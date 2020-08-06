uniform sampler2D colorTexture;

uniform sampler2D depthTexture;

varying vec2 v_textureCoordinates;

// 可视域近投影面距离
uniform float near;
// 可视域远投影面距离
uniform float far;
// 可视的颜色
uniform vec4 vsVisibleColor;
// 不可视的颜色
uniform vec4 vsInvisibleColor;
// 可视域视图矩阵
uniform mat4 vsCameraViewMatrix;
// 可视域投影矩阵
uniform mat4 vsCameraProjectionMatrix;

vec4 uvToViewPos(in vec2 uv, in float depth) {
  vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
  vec4 viewPos = czm_inverseProjection * vec4(xy, depth, 1.0);
  return viewPos / viewPos.w;
}

bool visible(in vec4 point) {
  point.x /= point.w;
  point.y /= point.w;
  point.z /= point.w;
  return (point.x >= -1.0 && point.x <= 1.0) &&
         (point.y >= -1.0 && point.y <= 1.0) &&
         (point.z >= -1.0 && point.z <= 1.0);
}

void main() {
  // 获取纹理颜色
  gl_FragColor = texture2D(colorTexture, v_textureCoordinates)
  // 获取纹理深度
  float depth = texture2D(depthTexture, v_textureCoordinates)
  // 投影坐标反算到视图坐标
  vec4 viewPos = uvToViewPos(v_textureCoordinates, depthTexture);
  // 视图坐标反算到世界坐标
  vec4 worldPos = czm_inverseView * viewPos;
  // 世界坐标到视域视图坐标
  vec4 vsViewPos = vsCameraViewMatrix * worldPos;
  // 视域体中该点到原点（视域体）的距离
  float distance = length(vsViewPos.xyz);

  if (distance > near && distance < far) {
    // 视域试图坐标到视域投影坐标
    vec4 vsProjPos = vsCameraProjectionMatrix * vsViewPos;
    vec4 visibleColor = vsVisibleColor;
    vec4 invisibleColor = vsInvisibleColor;
    // 说明点在视域体中
    if (visible(vsProjPos)) {
      float vis = shadow();
      if (vis > 0.3) {
        
      }
    }
  }

  
  
  
  
  
  
  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0)
}