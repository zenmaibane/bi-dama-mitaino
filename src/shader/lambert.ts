import { Effect, Scene, ShaderMaterial, Vector3 } from "@babylonjs/core";

export const lambertShader = (
  scene: Scene,
  name: string,
  baseColor: Vector3
) => {
  const shaderMaterial = new ShaderMaterial(
    name,
    scene,
    {
      vertex: "lambert",
      fragment: "lambert",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
        "lightDirection",
        "lightIntensity",
        "baseColor",
      ],
    }
  );
  shaderMaterial.setVector3("baseColor", baseColor);
  return shaderMaterial;
};

Effect.ShadersStore["lambertVertexShader"] = `
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 worldViewProjection;
  uniform mat4 world;
  varying vec3 vPositionW;
  varying vec3 vNormal;
  void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vPositionW = (world * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(world) * normal);
  }`;

Effect.ShadersStore["lambertFragmentShader"] = `
  precision highp float;
  uniform vec3 lightDirection;
  uniform vec3 baseColor;
  uniform float lightIntensity;
  varying vec3 vPositionW;
  varying vec3 vNormal;
  void main(void) {
    // memo:ここで0とのmaxを取っているのは、マイナスのときは見えてないとされるため。
    float NdotL = max(dot(normalize(vNormal), lightDirection), 0.0);
    // memo: ランバート反射モデルの計算
    float diffuse = NdotL * lightIntensity;
    gl_FragColor = vec4(baseColor * diffuse, 1.0);
  }`;
