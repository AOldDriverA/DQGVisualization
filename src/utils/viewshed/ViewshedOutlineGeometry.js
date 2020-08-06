import degToRad from "../../dqg/TileUtil";

function viewshedOutlineGeometry (options) {
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
    modelMatrix: Cesium.Matrix4.fromRotationTranslation(

    ),
    id: options.id,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color(0.0, 1.0, 0.0, 1.0))
    }
  })
  let viewshedInstance = new Cesium.Primitive({
    GeometryInstance: outlineInstance,
    appearance: new Cesium.PerInstanceColorAppearance()
  })
  return viewshedInstance;
}

export {viewshedOutlineGeometry};