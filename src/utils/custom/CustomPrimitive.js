class CustomPrimitive {
  constructor(options) {
    // 是“Draw”进行渲染还是“Compute”进行计算
    this.commandType = options.commandType;

    // 基元的信息
    this.geometry = options.geometry;

    this.attributeLocations = options.attributeLocations;
    
    // WebGL的基本图元：Points, Line, Line_Loop, Line_Strip, Trangles, Trangle_Strip, Trangle_Fan
    this.primitiveType = options.primitiveType;

    // 相当于给WebGL中的对应uniform赋值
    this.uniformMap = options.uniformMap;

    // 顶点着色器
    this.vertexShaderSource = options.vertexShaderSource;
    // 片元着色器
    this.fragmentShaderSource = options.fragmentShaderSource;

    this.rawRenderState = options.rawRenderState;
    // 帧缓存
    this.framebuffer = options.framebuffer;

    // computeCommand中。就是通过渲染机制实现GPU计算，对shader进行计算后的输出结果
    this.outputTexture = options.outputTexture;

    this.autoClear = Cesium.defaultValue(options.autoClear, false);
    // 要大规模进行计算的关键函数
    this.preExecute = options.preExecute;

    this.show = true;
    this.commandToExecute = undefined;
    // 清空缓冲区内容
    this.clearCommand = undefined;
    if (this.autoClear) {
      this.clearCommand = new Cesium.ClearCommand({
        // 指定清除的颜色
        color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
        // 指定清除的深度缓冲区（将所有深度缓冲区值设为1.0）
        depth: 1.0,
        framebuffer: this.framebuffer,
        // 清除的权重：不透明
        pass: Cesium.Pass.OPAQUE
      });
    }
  }

  createCommand(context) {
    switch (this.commandType) {
      case 'Draw': {
        // 顶点数组
        let vertexArray = Cesium.VertexArray.fromGeometry({
          context: context,
          // 包含顶点信息的对象
          geometry: this.geometry,
          attributeLocations: this.attributeLocations,
          bufferUsage: Cesium.BufferUsage.StAtIC_DRAW,
        })

        // 创建顶点着色器
        let shaderProgram = Cesium.ShaderProgram.fromCache({
          context: context,
          attributeLocations: this.attributeLocations,
          vertexShaderSource: this.vertexShaderSource,
          fragmentShaderSource: this.fragmentShaderSource
        })

        // 渲染状态
        let renderState = Cesium.RenderState.fromCache(this.rawRenderState);
        return new Cesium.DrawCommand({
            owner: this,
            vertexArray: vertexArray,
            primitiveType: this.primitiveType,
            uniformMap: this.uniformMap,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            shaderProgram: shaderProgram,
            framebuffer: this.framebuffer,
            renderState: renderState,
            pass: Cesium.Pass.OPAQUE
        });
      }

      case 'Compute': {
        return new Cesium.ComputeCommand({
            owner: this,
            fragmentShaderSource: this.fragmentShaderSource,
            uniformMap: this.uniformMap,
            outputTexture: this.outputTexture,
            persists: true
        });
      }
    }
  }

  setGeometry(context, geometry) {
    this.geometry = geometry;
    let vertexArray = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: this.geometry,
      attributeLocations: this.attributeLocations,
      bufferUsage: Cesium.BufferUsage.StAtIC_DRAW,
    });
    this.commandToExecute.vertexArray = vertexArray;
  }

  update(frameState) {
    if (!this.show) {
      return;
    }

    if (!Cesium.defined(this.commandToExecute)) {
      this.commandToExecute = this.createCommand(frameState.context);
    }

    if (Cesium.defined(this.preExecute)) {
      this.preExecute();
    }

    if (Cesium.defined(this.clearCommand)) {
      frameState.commandList.push(this.clearCommand);
    }
    frameState.commandList.push(this.commandToExecute);
  }

  isDestroyed() {
    return false;
  }

  destroy() {
    if (Cesium.defined(this.commandToExecute)) {
        this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy();
    }
    return Cesium.destroyObject(this);
  }
}

export default CustomPrimitive;