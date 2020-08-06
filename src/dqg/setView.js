// Cesium通行证
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjcyYzJmNS0zODljLTRjNTItODYxNy1iM2UyZDAxZWQ0YTAiLCJpZCI6NTU1NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MzU0NDI1NH0.9BwenxrdfAQmLfkvWrL1WKnCODMfoQ__b9d4x_7XCDg";

let viewerOptions = {
      animation: false,
      timeline: false,
      geocoder: false,
      fullscreenButton: false,
      sceneModePicker: false,
      navigationInstructionsInitiallyVisible: false,
      creditContainer: "cesium-credit",
      baseLayerPicker: false,
      infoBox: false,
      homeButton: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      fullscreenElement: 'cesium-credit',
      scene3DOnly: true,
      //shadows: true,
      terrainProvider: Cesium.createWorldTerrain()
}

function setView(viewer) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.3451, 39.9963, 800.0),
    orientation:{
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
      roll: Cesium.Math.toRadians(0.0)
    }
  });
}

export { viewerOptions, setView };