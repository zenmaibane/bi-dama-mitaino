import { Effect, Scene, ShaderMaterial, Vector3 } from "@babylonjs/core";

export const phongShader = (scene: Scene, name: string, baseColor: Vector3) => {
  const shaderMaterial = new ShaderMaterial(
    name,
    scene,
    {
      vertex: "phong",
      fragment: "phong",
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
        "cameraPosition",
      ],
    }
  );
  shaderMaterial.setVector3("baseColor", baseColor);
  return shaderMaterial;
};

Effect.ShadersStore["phongVertexShader"] = `
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

Effect.ShadersStore["phongFragmentShader"] = `
  precision highp float;
  uniform vec3 lightDirection;
  uniform vec3 baseColor;
  uniform vec3 cameraPosition;
  uniform float lightIntensity;
  varying vec3 vPositionW;
  varying vec3 vNormal;
  void main(void) {
    vec3 toLightDirection = -lightDirection;
    float NdotL = max(dot(normalize(vNormal), toLightDirection), 0.0);
    float diffuse = NdotL * lightIntensity;

    // reflectVectorを導くreflect関数があるが、敢えて自分で計算する 
    // implements: https://registry.khronos.org/OpenGL-Refpages/gl4/html/reflect.xhtml
    vec3 reflectVector = - toLightDirection + 2.0 * vNormal * dot(toLightDirection, vNormal);
    vec3 viewDirection = normalize(cameraPosition - vPositionW);
    float shininess = 32.0; 
    float specularIntensity = 1.0; 
    float specular = pow(max(dot(reflectVector, viewDirection),0.0),shininess) * specularIntensity; 
    float ambientIntensity = 0.1;

    vec3 resultColor =  diffuse * baseColor + specular * vec3(1.0) + ambientIntensity * baseColor;
    gl_FragColor = vec4(resultColor, 1.0);
  }`;
