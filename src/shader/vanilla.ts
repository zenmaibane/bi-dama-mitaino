import { Effect, Scene, ShaderMaterial, Vector3 } from "@babylonjs/core";

export const vanillaShader = (
  scene: Scene,
  name: string,
  baseColor: Vector3
) => {
  const shaderMaterial = new ShaderMaterial(
    name,
    scene,
    {
      vertex: "vanilla",
      fragment: "vanilla",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
        "baseColor",
      ],
    }
  );
  shaderMaterial.setVector3("baseColor", baseColor);
  return shaderMaterial;
};

Effect.ShadersStore["vanillaVertexShader"] = `
  precision highp float;
  attribute vec3 position;
  uniform mat4 worldViewProjection;
  void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
  }`;

Effect.ShadersStore["vanillaFragmentShader"] = `
  precision highp float;
  void main(void) {
    gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0);
  }`;
