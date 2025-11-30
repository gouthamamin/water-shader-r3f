// WaterPlane.jsx
import React, { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

function Ocean({
  size = 200,
  tiling = 4.0,
  speed = 0.2,
  normalScale = 1.0,
  color = new THREE.Color(0x2a63d6),
  lightDir = new THREE.Vector3(0.5, 0.8, 0.2).normalize(),
  normalUrl = "textures/ocean/waternormals.jpg" // change to your path
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const normalTex = useLoader(THREE.TextureLoader, normalUrl);

  // wrap so tiling works
  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      normalMap: { value: normalTex },
      normalScale: { value: normalScale },
      tiling: { value: tiling },
      speed: { value: speed },
      waterColor: { value: color },
      lightDir: { value: lightDir },
      cameraPos: { value: new THREE.Vector3() }
    }),
    [normalTex, normalScale, tiling, speed, color, lightDir]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.uniforms.time.value = t;
      matRef.current.uniforms.cameraPos.value.copy(state.camera.position);

    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    precision mediump float;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    uniform sampler2D normalMap;
    uniform float time;
    uniform float tiling;
    uniform float speed;
    uniform float normalScale;
    uniform vec3 waterColor;
    uniform vec3 lightDir;
    uniform vec3 cameraPos;

    // convert normal from normal map (RGB) to [-1,1]
    vec3 normalFromMap(vec2 uv) {
      vec3 n = texture2D(normalMap, uv).rgb;
      n = n * 2.0 - 1.0;
      return n;
    }

    void main() {
      // animate uv to create moving ripples
      vec2 uv = vUv * tiling;
      uv += vec2(time * speed, time * speed * 0.3);

      // sample the normal map
      vec3 nmap = normalFromMap(uv) * normalScale;

      // transform sampled normal from tangent-like to world approx:
      // This is a simple approach: mix geometry normal with normal map
      vec3 n = normalize(mix(vNormal, nmap, 0.9));

      // Lighting: simple directional + blinn-phong specular
      vec3 L = normalize(lightDir);
      float diff = max(dot(n, L), 0.0);

      // view vector
      vec3 V = normalize(cameraPos - vWorldPos);

      // Half vector for Blinn-Phong
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(n, H), 0.0), 64.0);

      // Fresnel rim for more 'watery' edge
      float fresnel = pow(1.0 - max(dot(n, V), 0.0), 3.0);

      // subtle color mixing: deeper tint + highlights
      vec3 base = waterColor * (0.4 + 0.6 * diff);
      vec3 highlight = vec3(1.0) * spec * 1.2;
      vec3 rim = vec3(0.6, 0.8, 1.0) * fresnel * 0.6;

      vec3 final = base + highlight + rim;

      // gamma correction
      final = pow(final, vec3(1.0 / 2.2));

      gl_FragColor = vec4(final, 1.0);
    }
  `;

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 256, 256]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Ocean;
