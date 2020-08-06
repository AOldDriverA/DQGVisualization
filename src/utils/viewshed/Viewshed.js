//import degToRad from "../../dqg/TileUtil";
const degToRad = 0.01745329251994;

//import viewshedOutlineGeometry from "./ViewshedOutlineGeometry"
//import ShadowMap from "./ShadowMap";

function viewshedOutlineGeometry(options) {
  const ellipsoid = new Cesium.EllipsoidOutlineGeometry({
    radii: new Cesium.Cartesian3(options.radii, options.radii, options.radii),
    innderRade: new Cesium.Cartesian3(options.innerRadii, options.innerRadii, options.innerRadii),
    minimumClock: -0.5 * options.horizViewAngle * degToRad,
    maximumClock: 0.5 * options.horizViewAngle * degToRad,
    minimumCone: (90.0 - 0.5 * options.vertiViewAngle) * degToRad,
    maximumCone: (90.0 + 0.5 * options.vertiViewAngle) * degToRad,
    stackPartitions: options.stackPartitions,
    slicePartitions: options.slicePartitions,
    subdivisions: options.subdivisions
  })
  let outlineInstance = new Cesium.GeometryInstance({
    geometry: ellipsoid,
    // modelMatrix: Cesium.Matrix4.fromCamera(
    //   options.lightCamera
    // ),
    id: options.id,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 1.0, 0.0, 1.0))
    }
  })
  let viewshedInstance = new Cesium.Primitive({
    geometryInstances: outlineInstance,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true
    })
  })
  return viewshedInstance;
}

const ViewshedPrimitve = function(shadowMap) {
  this.shadowMap = shadowMap;
  this.name = 'VIEWSHEDPrimitIVE';
}

ViewshedPrimitve.prototype.update = function(frameState) {
  frameState.shadowMaps.push(this.shadowMap);
}

class Viewshed {
  constructor(options) {
    if (!Cesium.defined(options)) {
      throw new Cesium.DeveloperError("options is required in ViewShed.");
    }
    if (!Cesium.defined(options.viewer)) {
      throw new Cesium.DeveloperError("optinos.viewer is required in ViewShed.");
    } else if (!Cesium.defined(options.viewPointPosition)) {
      throw new Cesium.DeveloperError("optinos.viewPointPosition is required in ViewShed.");
    }
    // 可以当做是与Cesium的Viewer进行沟通的桥梁
    this.viewer = options.viewer;
    // 可视域原点（可视域的观察点，用相机进行代替）
    this.viewPointPosition = options.viewPointPosition;
    // 水平方位角（垂直轴，向上，从右到左）
    this.heading = Cesium.defaultValue(options.heading, 90.0) % 360 * degToRad;
    // 垂直方位角（水平轴，向右，从下到上）
    this.pitch = Cesium.defaultValue(options.pitch, 0.0) * degToRad;
    // 纵向方位角（纵轴，向前，可以理解为歪头斜脑）
    this.roll = Cesium.defaultValue(options.roll, 0.0) * degToRad;
    // 视域水平角度
    this.horizViewAngle = Cesium.defaultValue(options.horizViewAngle, 90.0) * degToRad;
    // 视域垂直角度
    this.vertiViewAngle = Cesium.defaultValue(options.vertiViewAngle, 60.0) * degToRad;
    // 可视域半径
    this.radii = options.radii ? options.radii : 100.0;
    // 可视域内半径
    this.innerRadii = Cesium.defaultValue(options.innerRadii, this.radii * 0.1);
    // 可视域部分颜色
    this.visibleAreaColor = Cesium.defaultValue(options.visibleAreaColor, Cesium.Color.GREEN);
    // 不可视部分颜色
    this.invisibleAreaColor = Cesium.defaultValue(options.invisibleAreaColor, Cesium.Color.RED);
    // 可视域线框ID
    this.id = 'viewshedPrimitve'
    // 可视域的视图矩阵
    this.cameraViewMatrix = new Cesium.Matrix4();
    // 可视域的投影矩阵
    this.cameraProjectionMatrix = new Cesium.Matrix4();
    // 可视域的视线方向
    this.orientation = undefined;
    this.quaternion = undefined;
    // 计算出视线方向（四元数表示）
    this.computeOrientation(this.viewPointPosition);
    // 创建相机
    this.createLightCamera();
    // 用于绘制展示的视域框
    this.viewshedPrimitive = viewshedOutlineGeometry(this);
    this.viewer.scene.primitives.add(this.viewshedPrimitive);
    this.drawFrustum();
    // 生成阴影纹理
    this.createShadowMap();
    //ShadowMap(this);
    this.viewer.camera.setView({
      destination: this.viewPointPosition,
      orientation: {
        heading: 0.0,
        pitch: -90.0 * degToRad,
        roll: this.roll
      }
    });
    this.viewer.scene.primitives.add(new ViewshedPrimitve(this.shadowMap));
  }

  /**
   * 计算可视域的视线方向
   * @param {*} pointPosition 
   */
  computeOrientation(viewPointPosition) {
    let pointPosition = Cesium.defaultValue(viewPointPosition, this.viewPointPosition);
    let pointDirection = new Cesium.HeadingPitchRoll(this.heading, this.pitch, this.roll);
    this.orientation = Cesium.Transforms.headingPitchRollQuaternion(
      Cesium.Cartesian3.fromDegrees(pointPosition.x, pointPosition.y, pointPosition.z),
      pointDirection
    );
    let localPosition = Cesium.Transforms.eastNorthUpToFixedFrame(this.viewPointPosition);
    let rotationMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromHeadingPitchRoll(pointDirection));
    let resultMatrix = new Cesium.Matrix4();
    Cesium.Matrix4.multiply(localPosition, rotationMatrix, resultMatrix);
    this.quaternion = Cesium.Quaternion.fromRotationMatrix(resultMatrix);
    //this.quaternion = Cesium.Quaternion.fromHeadingPitchRoll(pointDirection);
  }

  /**
   * 创建可视域体（可视域体和正常的视锥体一样）
   * 同时创建可视域体的视图矩阵和投影矩阵
   */
  createLightCamera() {
    this.lightCamera = new Cesium.Camera(this.viewer.scene);
    this.lightCamera.setView({
      destination: this.viewPointPosition,
      orientation: {
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      },
    });
    this.lightCamera.frustum.near = this.innerRadii;
    this.lightCamera.frustum.far = this.radii;
    this.lightCamera.frustum.aspectRatio =
      Math.tan(0.5 * this.horizViewAngle) /
      Math.tan(0.5 * this.vertiViewAngle);
    this.lightCamera.frustum.fov = this.vertiViewAngle;
    let cart3Direction = this.lightCamera.directionWC;
    Cesium.Matrix4.computeView(
      this.viewPointPosition, cart3Direction, this.lightCamera.upWC, this.lightCamera.rightWC, this.cameraViewMatrix
    );
    Cesium.Matrix4.computePerspectiveFieldOfView(
      this.lightCamera.frustum.fov, this.lightCamera.frustum.aspectRatio,
      this.lightCamera.frustum.near, this.lightCamera.frustum.far,
      this.cameraProjectionMatrix
    );
  }

  /**
   * 创建阴影
   */
  createShadowMap() {
    this.shadowMap = new Cesium.ShadowMap({
      context: this.viewer.scene.context,
      lightCamera: this.lightCamera,
      enabled: true,
      isPointLight: true,
      pointLightRadius: this.radii,
      cascadesEnabled: false,
      size: 1024,
      softShadows: true
    });

    this.viewer.scene.shadowMap = this.shadowMap;
  }

  drawFrustum() {
    var primitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.FrustumOutlineGeometry({
          frustum: this.lightCamera.frustum,
          origin: this.viewPointPosition,
          orientation: this.quaternion
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 0.0, 1.0))
        }
      }),
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    });

    this.viewer.scene.primitives.add(primitive);

    //this.vishedfrustum = primitive;
  }

  //createViewshedPrimitive

  // createPostStage() {

  // }
}

export default Viewshed;