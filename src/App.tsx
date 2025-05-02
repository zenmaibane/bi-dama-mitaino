import "./App.css";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <div className="canvasContainer">
      <Canvas
        camera={{
          fov: 45, // 視野角
          position: [-8, 3, 8], // 位置
        }}
        shadows={"soft"} // 影を有効化
      >
        <mesh>
          {/* 球体ジオメトリ */}
          <sphereGeometry />
          {/* ノーマルマテリアル */}
          <meshNormalMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
