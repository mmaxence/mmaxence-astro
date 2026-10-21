import * as THREE from 'three';

export interface FlightVehicle {
  object: THREE.Group;
  update(dt: number, time: number, speed: number, boost: number, motion: boolean): void;
  dispose(): void;
}

/** An angular electric hover car with the same matte finish as the world. */
export function createFlightVehicle(scene: THREE.Scene): FlightVehicle {
  const object = new THREE.Group();
  object.name = 'Flying electric coupe';
  const car = new THREE.Group();
  object.add(car);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const own = <T extends THREE.BufferGeometry>(value: T): T => { geometries.add(value); return value; };
  const surface = (color: number) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, flatShading: true });
    materials.add(value);
    return value;
  };
  const white = surface(0xf5f5f5);
  const silver = surface(0xbdbdbd);
  const charcoal = surface(0x3b3b3b);
  const glass = surface(0x333333);
  glass.side = THREE.DoubleSide;
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, at: [number, number, number], parent: THREE.Object3D = car) => {
    const result = new THREE.Mesh(geometry, material);
    result.position.set(...at);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  };
  const cube = own(new THREE.BoxGeometry(1, 1, 1));
  const box = (material: THREE.Material, at: [number, number, number], scale: [number, number, number], parent: THREE.Object3D = car) => {
    const result = mesh(cube, material, at, parent);
    result.scale.set(...scale);
    return result;
  };
  const shape = (points: number[][]) => {
    const result = new THREE.Shape();
    result.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) result.lineTo(x, y);
    result.closePath();
    return result;
  };
  const extrude = (outline: THREE.Shape, halfWidth: number) => {
    const geometry = own(new THREE.ExtrudeGeometry(outline, { depth: halfWidth * 2, bevelEnabled: false, steps: 1, curveSegments: 2 }));
    geometry.translate(0, 0, -halfWidth);
    return geometry;
  };
  const face = (points: number[][], material: THREE.Material) => {
    const geometry = own(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
    const indices: number[] = [];
    for (let i = 1; i < points.length - 1; i++) indices.push(0, i, i + 1);
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return mesh(geometry, material, [0, 0, 0], car);
  };

  // One long wedge, two cut-out wheel arches and a peaked cabin. Large shapes
  // carry the silhouette, so the vehicle still reads at phone size.
  const shell = new THREE.Shape();
  shell.moveTo(-1.65, 0.24);
  shell.lineTo(-1.65, 0.62);
  shell.lineTo(-0.9, 0.68);
  shell.lineTo(0.65, 0.61);
  shell.lineTo(1.62, 0.42);
  shell.lineTo(1.62, 0.24);
  shell.lineTo(1.39, 0.24);
  shell.absarc(1.05, 0.24, 0.34, 0, Math.PI, false);
  shell.lineTo(-0.71, 0.24);
  shell.absarc(-1.05, 0.24, 0.34, 0, Math.PI, false);
  shell.closePath();
  mesh(extrude(shell, 0.71), white, [0, 0, 0]);
  mesh(extrude(shape([[-1.05, 0.66], [-0.32, 1.16], [0.05, 1.16], [0.85, 0.61]]), 0.57), white, [0, 0, 0]);

  for (const side of [-1, 1]) {
    const z = side * 0.579;
    face([[-0.91, 0.7, z], [-0.29, 1.1, z], [-0.2, 1.1, z], [-0.2, 0.685, z]], glass);
    face([[-0.105, 0.685, z], [-0.105, 1.1, z], [0.01, 1.1, z], [0.71, 0.65, z]], glass);
    box(charcoal, [0.49, 0.72, side * 0.68], [0.18, 0.075, 0.17]);
    // One graphic sill and a broad door seam replace the previous fine details.
    box(charcoal, [-0.02, 0.26, side * 0.718], [1.34, 0.055, 0.025], car);
    box(charcoal, [-0.15, 0.465, side * 0.718], [0.012, 0.32, 0.014], car);
  }
  face([[0.12, 1.123, -0.49], [0.12, 1.123, 0.49], [0.76, 0.693, 0.49], [0.76, 0.693, -0.49]], glass);
  face([[-0.39, 1.12, 0.49], [-0.39, 1.12, -0.49], [-0.92, 0.757, -0.49], [-0.92, 0.757, 0.49]], glass);
  // The single light bar is the electric pickup's most recognisable detail.
  box(charcoal, [1.631, 0.355, 0], [0.028, 0.085, 1.34]);
  box(white, [1.65, 0.366, 0], [0.018, 0.03, 1.2], car);
  box(charcoal, [-1.66, 0.51, 0], [0.025, 0.05, 1.24], car);
  box(silver, [-1.68, 0.285, 0], [0.09, 0.09, 1.18]);

  const wheels: { mount: THREE.Group; spin: THREE.Group; side: number }[] = [];
  const tireGeometry = own(new THREE.CylinderGeometry(0.29, 0.29, 0.19, 10));
  tireGeometry.rotateX(Math.PI / 2);
  const hubGeometry = own(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 6));
  hubGeometry.rotateX(Math.PI / 2);
  const centerGeometry = own(new THREE.CylinderGeometry(0.055, 0.055, 0.205, 6));
  centerGeometry.rotateX(Math.PI / 2);
  for (const x of [-1.05, 1.05]) {
    for (const side of [-1, 1]) {
      const mount = new THREE.Group();
      mount.position.set(x, 0.27, side * 0.7);
      car.add(mount);
      const spin = new THREE.Group();
      mount.add(spin);
      mesh(tireGeometry, charcoal, [0, 0, 0], spin);
      mesh(hubGeometry, silver, [0, 0, 0], spin);
      mesh(centerGeometry, charcoal, [0, 0, 0], spin);
      wheels.push({ mount, spin, side });
    }
  }

  const exhausts: THREE.Vector3[] = [];
  const podGeometry = own(new THREE.CylinderGeometry(0.16, 0.13, 0.14, 6));
  for (const x of [-0.89, 0.94]) {
    for (const z of [-0.45, 0.45]) {
      mesh(podGeometry, charcoal, [x, 0.14, z]);
      exhausts.push(new THREE.Vector3(x, 0.02, z));
    }
  }

  const capacity = 192;
  const locations = new Float32Array(capacity * 3);
  const sizes = new Float32Array(capacity);
  const opacity = new Float32Array(capacity);
  const seeds = Float32Array.from({ length: capacity }, () => Math.random() * 100);
  const ages = new Float32Array(capacity).fill(10);
  const lifetimes = new Float32Array(capacity).fill(1);
  const velocities = new Float32Array(capacity * 3);
  const baseSizes = new Float32Array(capacity);
  const growth = new Float32Array(capacity);
  const strengths = new Float32Array(capacity);
  const smokeGeometry = own(new THREE.BufferGeometry());
  smokeGeometry.setAttribute('position', new THREE.BufferAttribute(locations, 3).setUsage(THREE.DynamicDrawUsage));
  smokeGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
  smokeGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacity, 1).setUsage(THREE.DynamicDrawUsage));
  smokeGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const smokeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms: { uScale: { value: 100 }, uPerspective: { value: 0 } },
    vertexShader: `
      attribute float aSize;
      attribute float aOpacity;
      attribute float aSeed;
      uniform float uScale;
      uniform float uPerspective;
      varying float vOpacity;
      varying float vSeed;
      varying float vPixelSize;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = max(1.0, aSize * uScale / mix(1.0, max(0.1, -viewPosition.z), uPerspective));
        vOpacity = aOpacity;
        vSeed = aSeed;
        vPixelSize = gl_PointSize;
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      varying float vSeed;
      varying float vPixelSize;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float angle = vSeed * 0.13;
        p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
        // Four simple lobes make a little inked cloud rather than a blurry disc.
        float d = min(length(p - vec2(-0.26, 0.04)) - 0.43, length(p - vec2(0.27, 0.05)) - 0.42);
        d = min(d, length(p - vec2(0.02, -0.25)) - 0.43);
        d = min(d, length(p - vec2(0.01, 0.25)) - 0.36);
        float aa = 1.0 / max(1.0, vPixelSize);
        float stroke = 2.3 / max(1.0, vPixelSize);
        float alpha = (1.0 - smoothstep(-aa, aa, d)) * vOpacity;
        if (alpha < 0.01) discard;
        float fill = 1.0 - smoothstep(-stroke - aa, -stroke + aa, d);
        gl_FragColor = vec4(mix(vec3(0.15), vec3(1.0), fill), alpha);
      }
    `,
  });
  materials.add(smokeMaterial);
  const smoke = new THREE.Points(smokeGeometry, smokeMaterial);
  smoke.name = 'Outlined hover exhaust';
  smoke.frustumCulled = false;
  smoke.renderOrder = 1;
  scene.add(smoke);
  const drawingBuffer = new THREE.Vector2();
  smoke.onBeforeRender = (renderer, _scene, camera) => {
    renderer.getDrawingBufferSize(drawingBuffer);
    smokeMaterial.uniforms.uScale.value = drawingBuffer.y * camera.projectionMatrix.elements[5] * 0.5;
    smokeMaterial.uniforms.uPerspective.value = camera instanceof THREE.PerspectiveCamera ? 1 : 0;
  };

  let emission = 0;
  let cursor = 0;
  let initialized = false;
  let disposed = false;
  const current = new THREE.Vector3();
  const previous = new THREE.Vector3();
  const travel = new THREE.Vector3();
  const origin = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const down = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const modelScale = new THREE.Vector3();
  const lateral = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();

  function update(dt: number, time: number, speed: number, boost: number, motion: boolean) {
    if (disposed) return;
    dt = THREE.MathUtils.clamp(dt, 0, 0.05);
    speed = THREE.MathUtils.clamp(speed, 0, 1);
    boost = THREE.MathUtils.clamp(boost, 0, 1);
    car.position.y = motion ? Math.sin(time * 2.2) * 0.042 + Math.sin(time * 3.7) * 0.012 : 0;
    car.rotation.x = motion ? Math.sin(time * 1.4) * 0.018 : 0;
    car.rotation.z = motion ? -speed * 0.035 + Math.sin(time * 1.7) * 0.012 : 0;
    for (const { mount, spin, side } of wheels) {
      mount.rotation.x = side * (0.66 + boost * 0.16);
      if (motion) spin.rotation.z -= dt * (0.6 + speed * 4);
    }
    smoke.visible = motion;
    object.updateWorldMatrix(true, true);
    object.getWorldPosition(current);
    object.getWorldScale(modelScale);
    const unit = Math.max(0.01, Math.abs(modelScale.x));
    if (!initialized) { previous.copy(current); initialized = true; }
    travel.copy(current).sub(previous).multiplyScalar(dt > 0 ? 1 / dt : 0).clampLength(0, 4 * unit);
    previous.copy(current);
    if (!motion) {
      ages.fill(10);
      opacity.fill(0);
      smokeGeometry.attributes.aOpacity.needsUpdate = true;
      emission = 0;
      return;
    }
    car.getWorldQuaternion(quaternion);
    forward.set(1, 0, 0).applyQuaternion(quaternion);
    lateral.set(0, 0, 1).applyQuaternion(quaternion);
    down.set(0, -1, 0).applyQuaternion(quaternion);
    emission += dt * (14 + speed * 14 + boost * 24);
    while (emission >= 1) {
      emission--;
      const i = cursor++ % capacity;
      const spread = (exhausts[i % exhausts.length].z < 0 ? -1 : 1) * unit * 0.15;
      // Both the outlet and its thrust follow the vehicle's local frame, so
      // exhaust points toward the surface when the car follows a small globe.
      origin.copy(exhausts[i % exhausts.length]);
      origin.x += (Math.random() - 0.5) * 0.075;
      origin.z += (Math.random() - 0.5) * 0.075;
      origin.applyMatrix4(car.matrixWorld);
      locations[i * 3] = origin.x;
      locations[i * 3 + 1] = origin.y;
      locations[i * 3 + 2] = origin.z;
      velocity.copy(down).multiplyScalar((0.84 + Math.random() * 0.3 + boost * 0.32) * unit);
      velocity.addScaledVector(lateral, spread + (Math.random() - 0.5) * 0.22 * unit);
      velocity.addScaledVector(forward, ((Math.random() - 0.5) * 0.22 - speed * 0.18) * unit);
      velocity.addScaledVector(travel, -0.11);
      velocities[i * 3] = velocity.x;
      velocities[i * 3 + 1] = velocity.y;
      velocities[i * 3 + 2] = velocity.z;
      baseSizes[i] = (0.17 + Math.random() * 0.09) * unit;
      growth[i] = (0.62 + boost * 0.18) * unit;
      ages[i] = 0;
      lifetimes[i] = 1.5 + Math.random() * 0.45;
      strengths[i] = 0.92;
    }
    for (let i = 0; i < capacity; i++) {
      ages[i] += dt;
      if (ages[i] >= lifetimes[i]) { opacity[i] = 0; continue; }
      const life = ages[i] / lifetimes[i];
      locations[i * 3] += velocities[i * 3] * dt;
      locations[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      locations[i * 3 + 2] += velocities[i * 3 + 2] * dt;
      sizes[i] = baseSizes[i] + life * growth[i];
      opacity[i] = Math.min(1, life / 0.06) * Math.min(1, (1 - life) / 0.28) * strengths[i];
    }
    smokeGeometry.attributes.position.needsUpdate = true;
    smokeGeometry.attributes.aSize.needsUpdate = true;
    smokeGeometry.attributes.aOpacity.needsUpdate = true;
  }

  return {
    object,
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      object.removeFromParent();
      smoke.removeFromParent();
      smoke.onBeforeRender = () => {};
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
