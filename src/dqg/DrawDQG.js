import TriangleTile from "./TriangleTile";
import { isTriangleTileVisible } from "./TileUtil";
import { outlineInstance, surfaceInstance, singleSurfaceInstance } from "./PrimitivesInstance";
import { computeRadius } from "./TileMath";


const ellipsoid = Cesium.Ellipsoid.WGS84;

function initOctantTiles() {
  let octantTiles = [];
  octantTiles[0] = new TriangleTile({ morton: "0", level: 0, west: 0.0, south: 0.0, east: 90.0, north: 90.0 });
  octantTiles[1] = new TriangleTile({ morton: "1", level: 0, west: 90.0, south: 0.0, east: 180.0, north: 90.0 });
  octantTiles[2] = new TriangleTile({ morton: "2", level: 0, west: -180.0, south: 0.0, east: -90.0, north: 90.0 });
  octantTiles[3] = new TriangleTile({ morton: "3", level: 0, west: -90.0, south: 0.0, east: 0.0, north: 90.0 });
  octantTiles[4] = new TriangleTile({ morton: "4", level: 0, west: 0.0, south: -90.0, east: 90.0, north: 0.0 });
  octantTiles[5] = new TriangleTile({ morton: "5", level: 0, west: 90.0, south: -90.0, east: 180.0, north: 0.0 });
  octantTiles[6] = new TriangleTile({ morton: "6", level: 0, west: -180.0, south: -90.0, east: -90.0, north: 0.0 });
  octantTiles[7] = new TriangleTile({ morton: "7", level: 0, west: -90.0, south: -90.0, east: 0.0, north: 0.0 });
  return octantTiles;
}

/**
 * 预计算每个网格都会用到的变量信息，挂载到专门的cameraInfo中
 * @param {*} camera 场景相机
 * @param {*} drawDQGOptions 交互信息
 */
function initCamera(camera, drawDQGOptions) {
  let cameraInfo = new Object();
  let R = computeRadius(camera);

  // 将drawDQGOptions中的部分参数挂载到cameraInfo中
  cameraInfo.subdivFactor = drawDQGOptions.subdivFactor;
  cameraInfo.DQGStyle = drawDQGOptions.DQGStyle;

  // 将网格细分和显示过程中的优化信息挂载到cameraInfo中
  cameraInfo.camera = camera;
  cameraInfo.position = camera.position;
  cameraInfo.cameraDistance = Cesium.Cartesian3.magnitude(camera.position);
  cameraInfo.cosfovy = Math.cos(camera.frustum._fovy / 2);
  cameraInfo.sinfovy = Math.sin(camera.frustum._fovy / 2);
  cameraInfo.fovyRadians = Math.PI / 2 - camera.frustum._fovy / 2;
  cameraInfo.dCosfovy = cameraInfo.cameraDistance * cameraInfo.cosfovy;
  cameraInfo.sqrtValue = R * R - cameraInfo.cameraDistance * cameraInfo.cameraDistance + cameraInfo.dCosfovy * cameraInfo.dCosfovy;
  cameraInfo.cosB = (cameraInfo.cameraDistance * (1 - cameraInfo.cosfovy * cameraInfo.cosfovy) + cameraInfo.cosfovy * Math.sqrt(cameraInfo.sqrtValue)) / R;
  cameraInfo.angle = Math.acos(cameraInfo.cosB);
  cameraInfo.radiusDistance = R / cameraInfo.sinfovy;

  // 将网格视锥体裁剪和背面剔除过程中用到的属性挂载到cameraInfo中
  cameraInfo.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
  cameraInfo.occluder = new Cesium.EllipsoidalOccluder(ellipsoid, camera.positionWC);
  cameraInfo.cameraHeight = cameraInfo.cameraDistance - R;
  cameraInfo.altitudeDistance = (cameraInfo.cameraDistance - R) / 1000;
  return cameraInfo;
}

/** 几个重要变量，用来存放网格的Primitives信息 */
// 线框网格的Primitives信息
let primitivesOutlineInstance;
// 面片网格的Primitives信息
let primitivesSurfaceInstance;
// 被选中的网格
let pickedPrimitivesInstance;

/**
 * 绘制全球网格（每帧运行一次，中心函数）
 * @param {*} scene          场景信息
 * @param {*} cameraInfo     相机信息
 * @param {*} drawDQGOptions 状态信息
 */
function drawGlobleTile(scene, cameraInfo, drawDQGOptions) {
  let octantTiles = initOctantTiles();
  let outlineInstances = [];
  let serfaceInstances = [];
  let tileList = new Array();
  cameraInfo.maxWholeTileLevel = 0;

  octantTiles.forEach(value => {
    let isOctantTileVisible = isTriangleTileVisible(value, cameraInfo);
    if (isOctantTileVisible) {
      value.update(tileList, cameraInfo)
    }
  });
  scene.primitives.remove(primitivesOutlineInstance);
  primitivesOutlineInstance = outlineInstance(
    cameraInfo,
    tileList,
    outlineInstances
  );
  scene.primitives.add(primitivesOutlineInstance);

  /** 双击触发显示网格信息 */
  if (drawDQGOptions.isDrawSurface) {
    let pickedGridInstance = [];
    scene.primitives.remove(pickedPrimitivesInstance);
    scene.primitives.remove(primitivesSurfaceInstance);

    primitivesSurfaceInstance = surfaceInstance(
      cameraInfo,
      tileList,
      serfaceInstances
    );
    scene.primitives.add(primitivesSurfaceInstance);

    let pickedGrid;
    // 需要异步处理，主要是pick函数最快需要发生在第二帧上，因为第一帧没绘制完毕，拾取不到网格信息
    // 所以借用setTimeOut，等到里面异步函数执行时，早已绘制了很多帧
    let pickFunc = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 注意，拾取到的信息存储在了pickedGrid.id中，是id中！“typeof id = object”
        pickedGrid = scene.pick(drawDQGOptions.screenUV);

        // 判断拾取到的物体是不是网格
        if (pickedGrid) {
          if (pickedGrid.id._Morton) {
            drawDQGOptions.isShowGridInfo = true;
            // 拾取到了网格，则进行绘制
            resolve(pickedGrid);
          }
        } else {
          // 没有拾取到网格，就当双击事件没发生过
          reject(pickedGrid);
        }
      })
    });
    pickFunc.then((pickedGrid) => {
      let grid;
      for (let i = 0; i < tileList.length; ++i) {
        if (tileList[i]._Morton === pickedGrid.id._Morton) {
          grid = tileList[i];
        }
      }

      // 将选中的网格挂载到drawDQGOptions中
      drawDQGOptions.pickedGrid = {};
      drawDQGOptions.pickedGrid.morton = grid._Morton;
      drawDQGOptions.pickedGrid.level = grid._level;
      drawDQGOptions.pickedGrid.west = grid._west;
      drawDQGOptions.pickedGrid.south = grid._south;
      drawDQGOptions.pickedGrid.east = grid._east;
      drawDQGOptions.pickedGrid.north = grid._north;
      drawDQGOptions.color = new Cesium.Color.RED.withAlpha(0.2);
      pickedPrimitivesInstance = singleSurfaceInstance(
        cameraInfo,
        grid,
        pickedGridInstance,
        drawDQGOptions
      );
      scene.primitives.add(pickedPrimitivesInstance);
    }).catch(() => {
      // 没有拾取到物体，关闭网格信息框
      drawDQGOptions.pickedGrid = {};
      drawDQGOptions.isShowGridInfo = false;
    })
    // 确保了触发后只绘制一次，不会每帧都画
    drawDQGOptions.isDrawSurface = !drawDQGOptions.isDrawSurface;
  } else if (drawDQGOptions.closeGridInfo) {
    // 点击“退出”是关闭了网格信息框
    drawDQGOptions.pickedGrid = {};
    drawDQGOptions.isShowGridInfo = false;
    scene.primitives.remove(pickedPrimitivesInstance);
    drawDQGOptions.closeGridInfo = !drawDQGOptions.closeGridInfo;
  }
}

let requestAnimationFrame;
/**
 * 绘制网格
 * @param {*} viewer 
 * @param {*} isDraw 
 */
function drawDQG(viewer, drawDQGOptions) {
  // 更新相机信息
  let cameraInfo = initCamera(viewer.camera, drawDQGOptions);
  // 更新绘制场景信息
  drawGlobleTile(viewer.scene, cameraInfo, drawDQGOptions);
  requestAnimationFrame = window.requestAnimationFrame(() => {
    drawDQG(viewer, drawDQGOptions);
  });
}

function cancelDrawDQG(scene) {
  window.cancelAnimationFrame(requestAnimationFrame);
  if (primitivesOutlineInstance) {
    scene.primitives.remove(primitivesOutlineInstance);
  }
  if (primitivesSurfaceInstance) {
    scene.primitives.remove(primitivesSurfaceInstance);
  }
}

export { drawDQG, cancelDrawDQG };

