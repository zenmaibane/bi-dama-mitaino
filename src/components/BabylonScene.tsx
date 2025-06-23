import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  Color4,
  StandardMaterial,
  Color3,
  DirectionalLight,
  ShadowGenerator,
  Texture,
  MultiMaterial,
  SubMesh,
  Effect,
  ShaderMaterial,
} from "@babylonjs/core";

export const BabylonScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.04, 0.04, 0.1, 1);

    const handleResize = () => {
      if (engine) {
        engine.resize();
      }
    };
    window.addEventListener("resize", handleResize);

    const camera = new ArcRotateCamera(
      "camera",
      0,
      Math.PI / 3,
      10,
      new Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);

    const hemisphericLight = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.7;

    const directionalLight = new DirectionalLight(
      "light",
      new Vector3(0.5, 1, 0),
      scene
    );
    directionalLight.intensity = 0.7;
    directionalLight.position = new Vector3(0, 10, 0);

    const shaderMaterial = new ShaderMaterial(
      "shader",
      scene,
      {
        vertex: "custom",
        fragment: "custom",
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
        ],
      }
    );

    shaderMaterial.setVector3(
      "lightDirection",
      directionalLight.direction.normalize()
    );

    const sphere = MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position = new Vector3(0, 0, 0);
    sphere.material = shaderMaterial;

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

Effect.ShadersStore["customVertexShader"] = `
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

Effect.ShadersStore["customFragmentShader"] = `
  precision highp float;
  uniform vec3 lightDirection;
  varying vec3 vPositionW;
  varying vec3 vNormal;
  void main(void) {
    vec3 baseColor = vec3(0.2, 0.6, 1.0);
    // memo:ここで0とのmaxを取っているのは、マイナスのときは見えてないとされるため。
    float NdotL = max(dot(normalize(vNormal), lightDirection), 0.0);
    float lightPower = 1.0;
    // memo: ランバート反射モデルの計算
    float diffuse = NdotL * lightPower;
    gl_FragColor = vec4(baseColor * diffuse, 1.0);
  }`;
