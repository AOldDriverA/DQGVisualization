import * as Cesium from 'cesium/Cesium';
import 'cesium/Widgets/widgets.css';

const defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYWVkMTRlNi02M2I4LTQ1NTEtOTFhZC00NjVlYzlhNDBlMWIiLCJpZCI6NDMwMywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDQ1NDkwM30.GMDUMgqvDLbut9PhoLQUsjFZrLZxhCE47ly11GYkNv8';
Cesium.Ion.defaultAccessToken = defaultAccessToken;

const initCesium = (divId, options) => {
  const CESIUM = new Cesium.Viewer(divId, options);
  return CESIUM;
}

export default {
  Cesium,
  initCesium
};