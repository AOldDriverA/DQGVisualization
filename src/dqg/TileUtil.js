/**
 * 格网常用的函数
 * 工具箱
 */

import { computeHeight } from "./TileMath";

const degToRad = 0.01745329251994;
const ellipsoid = Cesium.Ellipsoid.WGS84;

let triangle = new Cesium.Rectangle();
let rectangle = new Cesium.Rectangle();
let unUsedPoint = new Cesium.Cartesian3();
let boundingBox = new Cesium.BoundingSphere();

/**
 * 判断三角形格网是否在视窗体内（是否可见）
 * @param {*} triangleTile 要判断的格网
 * @param {*} cameraInfo 场景中的相机相关信息
 */
function isTriangleTileVisible(triangleTile, cameraInfo) {
  triangle.west = triangleTile._west * degToRad;
  triangle.south = triangleTile._south * degToRad;
  triangle.east = triangleTile._east * degToRad;
  triangle.north = triangleTile._north * degToRad;

  triangleTile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(triangle, ellipsoid, 0.0, boundingBox);
  let cullingVolume = cameraInfo.cullingVolume;
  let intersection = cullingVolume.computeVisibility(triangleTile.boundingBox);
  let ifPointVisible = false;
  if (intersection != -1) {
    let occluder = cameraInfo.occluder;
    let factor = 1 / Math.cos(triangle.north - triangle.south);
    let point = Cesium.Cartesian3.multiplyByScalar(triangleTile._center, factor, unUsedPoint);
    let scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
    ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
    if (intersection == 0 && !ifPointVisible) {
      let points = Cesium.Cartesian3.fromRadiansArray([triangle.west, triangle.north, triangle.west, triangle.south,
      triangle.east, triangle.south, triangle.east, triangle.north]);
      if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[0]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[1]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[2]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[3]))) {
        ifPointVisible = true;
      }
    }
  }
  return ifPointVisible;
}

/**
 * 判断四边形格网是否在视窗体内（是否可见）
 * @param {*} quadTile 要判断的格网
 * @param {*} cameraInfo 场景中的相机相关信息
 */
function isQuadTileVisible(quadTile, cameraInfo) {
  rectangle.west = quadTile._west * degToRad;
  rectangle.south = quadTile._south * degToRad;
  rectangle.east = quadTile._east * degToRad;
  rectangle.north = quadTile._north * degToRad;

  // compute grid bounding sphere(faster than bounding box)
  quadTile.boundingBox = Cesium.BoundingSphere.fromRectangle3D(rectangle, ellipsoid, 0.0, boundingBox);
  // create frustum. camera.frustum是调用PerspectiveFrustum的默认值生成的，因而有computeCullingVolume函数并且只需输入三个参数
  let cullingVolume = cameraInfo.cullingVolume;
  // determine whether the frustum intersects the bounding sphere
  let intersection = cullingVolume.computeVisibility(quadTile.boundingBox);

  let ifPointVisible = false;
  // filter the invisible points in frustum (located on the back of the earth)
  // intersection == -1 means frustum is separated from the bounding sphere
  if (intersection !== -1) {
    let occluder = cameraInfo.occluder;
    // INTERSECT
    if (intersection == 0) {
      let factor = 1 / Math.cos(rectangle.north - rectangle.south);
      let point = Cesium.Cartesian3.multiplyByScalar(quadTile._center, factor, unUsedPoint);
      let scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(point);
      ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
    }
    // INSIDE
    else if (intersection == 1 && quadTile._level < 3) {
      let points = Cesium.Cartesian3.fromRadiansArray([rectangle.west, rectangle.north, rectangle.west, rectangle.south,
      rectangle.east, rectangle.south, rectangle.east, rectangle.north]);
      if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[0]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[1]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[2]))) {
        ifPointVisible = true;
      }
      else if (occluder.isScaledSpacePointVisible(ellipsoid.transformPositionToScaledSpace(points[3]))) {
        ifPointVisible = true;
      }
    }
    else {
      let scaledSpacePoint = ellipsoid.transformPositionToScaledSpace(quadTile._center);
      ifPointVisible = occluder.isScaledSpacePointVisible(scaledSpacePoint);
    }
  }
  return ifPointVisible;
}

/** 英文注释写起来太别扭了，爱我汉字 */
/**
 * 判断细分函数
 * @param {*} tile 要判断的格网
 * @param {*} camera 场景中的相机
 * @returns {number}  细分阈值
 */
function isSubdivisionVisible(tile, cameraInfo) {
  let cameraPosition = cameraInfo.position;
  let height = computeHeight(tile) * degToRad;
  let angleA, angleB, angleFactor;
  // 多尺度
  if (cameraInfo.DQGStyle === 2) {
    // 如果距离小于6387000，就启动局部坐标系统
    if (cameraInfo.cameraDistance < 6387000) {
      angleA = cameraInfo.angle;
      angleB = angleA * 0.45
    }
    // 全球部分在视椎体内
    else if (cameraInfo.cameraDistance < cameraInfo.radiusDistance) {
      angleA = cameraInfo.angle;
      angleB = Cesium.Cartesian3.angleBetween(tile._center, cameraPosition);
      angleFactor = angleB / angleA;
      if (angleFactor < 0.6) {
        angleB = angleA * 0.1;
      }
      else if (angleFactor < 0.85) {
        angleB = angleA * 0.3;
      }
    }
    // 全球都在视椎体内
    else {
      angleA = cameraInfo.fovyRadians;
      angleB = Cesium.Cartesian3.angleBetween(tile._center, cameraPosition);
      angleFactor = angleB / angleA;
      if (angleFactor < 0.15) {
        angleB = angleA * 0.05;
      }
      else if (angleFactor < 0.4) {
        angleB = angleA * 0.1;
      }
    }
  }
  // 细单尺度
  else {
    if (cameraInfo.cameraDistance < 6387000) {
      angleA = cameraInfo.angle;
      angleB = angleA * 0.45
    }
    // 全球部分在视椎体内
    else if (cameraInfo.cameraDistance < cameraInfo.radiusDistance) {   //18400000.0 //12713504.628490359 //24643229.007640
      angleA = cameraInfo.angle;
      angleB = angleA * 0.8;
    }
    // 全球都在视椎体内
    else {
      angleA = cameraInfo.fovyRadians;
      // angleB = Cesium.Cartesian3.angleBetween(tile.center,cameraPosition);
      angleB = angleA * 0.5;
    }
  }

  var f1 = angleA / height;
  var f2 = angleB / height;
  return f1 * f2;
}

/**
 * 销毁格网
 * @param {*} tile 待销毁的格网
 */
function freeTile(tile) {
  if (Cesium.defined(tile)) {
    tile.freeResources();
  }
}

export { degToRad, isTriangleTileVisible, isQuadTileVisible, isSubdivisionVisible, freeTile };