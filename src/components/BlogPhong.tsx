import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  Color4,
  DirectionalLight,
} from "@babylonjs/core";
import { lambertShader } from "@/shader/lambert";
import { vanillaShader } from "@/shader/vanilla";
import { phongShader } from "@/shader/phong";

export const BlogPhong = () => {
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
    directionalLight.intensity = 1.0;
    directionalLight.position = new Vector3(0, 10, 0);

    const vanilla = vanillaShader(scene, "vanilla", new Vector3(0.2, 0.6, 1.0));
    const vanillaSphere = MeshBuilder.CreateSphere("vanillaSphere", {}, scene);
    vanillaSphere.position = new Vector3(0, 0, -1.5);
    vanillaSphere.material = vanilla;

    const lambert = lambertShader(scene, "lambert", new Vector3(0.2, 0.6, 1.0));
    const lambertSphere = MeshBuilder.CreateSphere("lambertSphere", {}, scene);
    lambertSphere.position = new Vector3(0, 0, 0);
    lambertSphere.material = lambert;

    const phong = phongShader(scene, "phong", new Vector3(0.2, 0.6, 1.0));
    const phongSphere = MeshBuilder.CreateSphere("phongSphere", {}, scene);
    phongSphere.position = new Vector3(0, 0, 1.5);
    phongSphere.material = phong;

    engine.runRenderLoop(() => {
      lambert.setVector3(
        "lightDirection",
        directionalLight.direction.normalize()
      );
      lambert.setFloat("lightIntensity", directionalLight.intensity);

      phong.setVector3(
        "lightDirection",
        directionalLight.direction.normalize()
      );
      phong.setFloat("lightIntensity", directionalLight.intensity);
      phong.setVector3("cameraPosition", camera.position);
      scene.render();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};
