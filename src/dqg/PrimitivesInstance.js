
/**
 * 创建格网轮廓线
 * @param {*} cameraInfo 相机相关信息
 * @param {*} tileList 格网列表
 * @param {*} outlineInstances 格网几何信息
 */
function outlineInstance(cameraInfo, tileList, outlineInstances) {
  for (let i = 0; i < tileList.length; ++i) {
    outlineInstances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleOutlineGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(tileList[i]._west, tileList[i]._south, tileList[i]._east, tileList[i]._north),
          height: cameraInfo.altitudeDistance
        }),
        id: tileList[i]._Morton,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.DARKGRAY)
        }
      })
    )
  }
  let primitivesInstance = new Cesium.Primitive({
    geometryInstances: outlineInstances,
    asynchronous: false,
    compressVertices: false,
    cull: false,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      translucent: false,
      renderState: {
        lineWidth: 1
      }
    })
  });
  return primitivesInstance;
}

/**
 * 创建格网面片
 * @param {*} cameraInfo 相机相关信息
 * @param {*} tileList 格网列表
 * @param {*} surfaceInstances 格网几何信息
 */
function surfaceInstance(cameraInfo, tileList, surfaceInstances) {
  for (let i = 0; i < tileList.length; i++) {
    surfaceInstances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(tileList[i]._west, tileList[i]._south, tileList[i]._east, tileList[i]._north),
          height: cameraInfo.altitudeDistance
        }),
        id: tileList[i],
        attributes: {
          // 必须设置颜色，否则拾取不到
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color.RED.withAlpha(0.01))
        }
      })
    )
  }
  let primitivesInstance = new Cesium.Primitive({
    //show: false,
    geometryInstances: surfaceInstances,
    asynchronous: false,
    compressVertices: false,
    cull: false,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      translucent: true,
    })
  });
  return primitivesInstance;
}

/**
 * 创建单个网格片面的通用封装
 */
function singleSurfaceInstance(cameraInfo, tile, singleSurfaceInstance, gridOptions) {

  singleSurfaceInstance.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(tile._west, tile._south, tile._east, tile._north),
          height: cameraInfo.altitudeDistance
        }),
        id: tile._Morton,
        attributes: {
          // 必须设置颜色，否则拾取不到
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(gridOptions.color)
        }
      })
    )
  let primitivesInstance = new Cesium.Primitive({
    //show: false,
    geometryInstances: singleSurfaceInstance,
    asynchronous: false,
    compressVertices: false,
    cull: false,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      translucent: true,
    })
  });
  return primitivesInstance;
}

export { outlineInstance, surfaceInstance, singleSurfaceInstance };
