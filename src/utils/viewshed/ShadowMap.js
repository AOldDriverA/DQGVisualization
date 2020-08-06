import CustomPrimitive from "../custom/CustomPrimitive";
import loadText from "../loadtext/LoadText"


class ShadowMap {
  constructor(options) {
    this.context = options.viewer.scene.context;
    this.data = options.data;
    this.cameraViewMatrix = options.cameraViewMatrix;
    this.cameraProjectionMatrix = options.cameraProjectionMatrix;
    this.shadowMapTexture = undefined;
    this.shadowMapPrimitive = undefined;
    this.createShadowMapTexture(this.context, this.data);
    this.createShadowMap(options);
  }

  /**
   * 创建从可视域视角出发观察到的纹理
   * @param {*} context 上下文
   * @param {*} data 输入的参数，就是纹理的长和宽
   */
  createShadowMapTexture(context, data) {
    // 创建纹理的选项
    let textureOptions = {
      context: context,
      width: data.width,
      height: data.height,
      pixelFormat: Cesium.pixelFormat.LUMINANCE,
      pixleDatatype: Cesium.PixelDatatype.FLOAT,
      flipY: false,
      sampler: new Cesium.Sampler({
        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
      })
    }

    // 创建纹理
    this.shadowMapTexture = new Cesium.Texture(textureOptions);
  }

  createShadowMap() {
    const that = this;
    that.shadowMapPrimitive = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        // 视域体的视图矩阵
        cameraViewMatrix: that.cameraViewMatrix,
        // 视域体的投影矩阵
        cameraProjectionMatrix: that.cameraProjectionMatrix,

      },
      preExecute: function () {

      },
      vertexShaderSource: new Cesium.ShaderSource({
        //defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
        sources: [loadText('glsl/shadowMap.vert')]
      }),
      fragementShaderSource: new Cesium.ShaderSource({
        sources: [loadText('glsl/shadowMap.frag')]
      }),
      outputTexture: that.shadowMapTexture,
    })
  }
}

export default ShadowMap;

