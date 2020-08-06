import { isTriangleTileVisible, freeTile, isSubdivisionVisible } from "./TileUtil";
import QuadTile from "./QuadTile";

class TriangleTile {
  constructor(options) {

    if (!Cesium.defined(options)) {
      throw new Cesium.DeveloperError("options is required.");
    }
    if (!Cesium.defined(options.morton)) {
      throw new Cesium.DeveloperError("options.morton is required.");
    } else if (!Cesium.defined(options.level)) {
      throw new Cesium.DeveloperError("options.level is required.");
    } else if (!Cesium.defined(options.west)) {
      throw new Cesium.DeveloperError("options.west is required.");
    } else if (!Cesium.defined(options.south)) {
      throw new Cesium.DeveloperError("options.south is required.");
    } else if (!Cesium.defined(options.east)) {
      throw new Cesium.DeveloperError("options.east is required.");
    } else if (!Cesium.defined(options.north)) {
      throw new Cesium.DeveloperError("options.north is required.");
    } else if (options.level < 0 || options.level > 30) {
      throw new Cesium.DeveloperError(
        "options.level must be greater than 0 and less than 30."
      );
    } else if (
      options.west < -180.00000000001 ||
      options.east > 180.00000000001 ||
      options.south < -90.00000000001 ||
      options.north > 90.00000000001
    ) {
      throw new Cesium.DeveloperError(
        "longitude should be between -180.0 and 180.0, and the same latitude shoude be between -90.0 and 90.0."
      );
    }

    this._Morton = options.morton;
    this._west = options.west;
    this._level = options.level;
    this._south = options.south;
    this._east = options.east;
    this._north = options.north;
    this._height = undefined;
    this._cenLon = (options.west + options.east) / 2;
    this._cenLat = (options.south + options.north) / 2;
    this._center = Cesium.Cartesian3.fromDegrees(this._cenLon, this._cenLat);
    this._LTChild = undefined;
    this._RTChild = undefined;
    this._LBChild = undefined;
    this._RBChild = undefined;
    this.boundingBox = undefined;
    this.intersection = undefined;
    this.changeColor = false;

  }

  /**
   * 更新格网的信息
   * @param {*} tileList 存储格网的队列
   * @param {*} cameraInfo 存储相机的相关信息
   */
  update(tileList, cameraInfo) {
    // 判断三角格网是否可见
    let isPointVisible = isTriangleTileVisible(this, cameraInfo);
    // 计算三角格网细分阈值
    let isSubDivision = isSubdivisionVisible(this, cameraInfo);
    // 北半球
    if (this._cenLat > 0) {
      // 小于细分阈值，并且可见，则继续细分
      if (isSubDivision < cameraInfo.subdivFactor && isPointVisible) {
        if (this._LTChild == undefined && this._LBChild == undefined && this._RBChild == undefined) {
          this.computeChildren();
        }
        this._LTChild.update(tileList, cameraInfo);
        this._LBChild.update(tileList, cameraInfo);
        this._RBChild.update(tileList, cameraInfo);
      }
      // 停止细分，并将已存在的子节点释放掉
      else if (isPointVisible) {
        this._LTChild = undefined;
        this._LBChild = undefined;
        this._RBChild = undefined;
        if (this._level > cameraInfo.maxWholeTileLevel) {
          cameraInfo.maxWholeTileLevel = this._level;
        }
        tileList.push(this);
      }
      if (!isPointVisible) {
        this.freeResources();
      }
    }
    else {
      if (isSubDivision < cameraInfo.subdivFactor && isPointVisible) {
        if (this._LTChild == undefined && this._RTChild == undefined && this._RBChild == undefined) {
          this.computeChildren();
        }
        this._LTChild.update(tileList, cameraInfo);
        this._RTChild.update(tileList, cameraInfo);
        this._RBChild.update(tileList, cameraInfo);
      }
      else if (isPointVisible) {
        this._LTChild = undefined;
        this._RTChild = undefined;
        this._RBChild = undefined;
        if (this._level > cameraInfo.maxWholeTileLevel) {
          cameraInfo.maxWholeTileLevel = this._level;
        }
        tileList.push(this);
      }
      if (!isPointVisible) {
        this.freeResources();
      }
    }
  }

  /**
   * 计算子格网
   */
  computeChildren() {
    if (this._cenLat > 0) {
      if (this._LTChild == undefined) {
        this._LTChild = new TriangleTile({morton: this._Morton + "0", level: this._level + 1, west: this._west, south: this._cenLat, east: this._east, north: this._north})
      }
      if (this._LBChild == undefined) {
        this._LBChild = new QuadTile({morton: this._Morton + '2', level: this._level + 1, west: this._west, south: this._south, east: this._cenLon, north: this._cenLat});
      }
      if (this._RBChild == undefined) {
        this._RBChild = new QuadTile({morton: this._Morton + '3', level: this._level + 1, west: this._cenLon, south: this._south, east: this._east, north: this._cenLat})
      }
    }
    else {
      if (this._RBChild == undefined) {
        this._RBChild = new TriangleTile({morton: this._Morton + '0', level: this._level + 1, west: this._west, south: this._south, east: this._east, north: this._cenLat})
      }
      if (this._RTChild == undefined) {
        this._RTChild = new QuadTile({morton: this._Morton + '2', level: this._level + 1, west: this._cenLon, south: this._cenLat, east: this._east, north: this._north})
      }
      if (this._LTChild == undefined) {
        this._LTChild = new QuadTile({morton: this._Morton + "3", level: this._level + 1, west: this._west, south: this._cenLat, east: this._cenLon, north: this._north})
      }
    }
  }

  /**
   * 释放格网
   */
  freeResources() {
    this._Morton = undefined;
    this._west = undefined;
    this._level = undefined;
    this._south = undefined;
    this._east = undefined;
    this._north = undefined;
    this._height = undefined;
    this._cenLon = undefined;
    this._cenLat = undefined;
    this._center = undefined;
    this.boundingBox = undefined;
    this.intersection = undefined;
    this.changeColor = false;
    freeTile(this._LTChild);
    this._LTChild = undefined;
    freeTile(this._RTChild);
    this._RTChild = undefined;
    freeTile(this._LBChild);
    this._LBChild = undefined;
    freeTile(this._RBChild);
    this._RBChild = undefined;
  }
}

export default TriangleTile;
