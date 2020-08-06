attribute vec3 a_Position;

uniform mat4 cameraViewMatrix;
uniform mat4 cameraProjectionMatrix;

varying vec2 textureCoordinate;

void main() {
  gl_Position = cameraProjectionMatrix * cameraViewMatrix * a_Position;
}