//import * as Cesium from "cesium/Cesium";
import drawDQG from "../dqg/DrawDQG";

function draw(viewer) {
  

  // viewer.clock.onTick.addEventListener(() => {
  //   drawDQG(viewer);
  // })
  // window.requestAnimationFrame(() => {
  //   draw(viewer);
  // });
  drawDQG(viewer);
}

export default draw;