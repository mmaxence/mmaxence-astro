import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export interface MonorailMotionState {
  speed: number;
  turn: number;
  departure: number;
  arrival: number;
  motion: boolean;
}

export interface Monorail {
  object: THREE.Group;
  /** Carriage centres start at native x +0.88 and -0.88, with wheel contact y = 0. */
  carriages: { front: THREE.Group; rear: THREE.Group };
  /** Call after applying carriage poses. Phase inputs run from 0 to 1; 0 is also inactive. */
  updateMotion(dt: number, state: MonorailMotionState): void;
  dispose(): void;
}

/** Two quiet carriages. Forward is +X; the wheel contact plane is local y = 0. */
export function createMonorail(): Monorail {
  const object = new THREE.Group();
  object.name = 'Monorail';
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const own = <T extends THREE.BufferGeometry>(geometry: T): T => { geometries.add(geometry); return geometry; };
  const material = (color: number, roughness = 0.9) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
    materials.add(result);
    return result;
  };
  const shell = material(0xf0f0f0);
  const glass = material(0x343434, 0.84);
  const chassis = material(0x646464);
  const rubber = material(0x303030);
  const connector = material(0x9a9a9a);
  const light = material(0xfafafa);
  light.emissive.set(0xaaaaaa);
  light.emissiveIntensity = 0.12;

  const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, surface: THREE.Material, at: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, surface);
    mesh.position.set(...at);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const rounded = (width: number, height: number, depth: number, radius: number, segments = 3) =>
    own(new RoundedBoxGeometry(width, height, depth, segments, radius));
  const panel = (width: number, height: number, radius: number) => {
    const shape = new THREE.Shape();
    const x = -width / 2, y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    const geometry = own(new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: false, curveSegments: 5, steps: 1 }));
    geometry.translate(0, 0, -0.006);
    return geometry;
  };

  const bodyGeometry = rounded(1.62, 0.52, 0.74, 0.14, 4);
  const chassisGeometry = rounded(1.39, 0.14, 0.58, 0.055, 2);
  const windowGeometry = panel(1.18, 0.19, 0.052);
  const windshieldGeometry = panel(0.43, 0.18, 0.048);
  const pillarGeometry = rounded(0.035, 0.192, 0.014, 0.006, 1);
  const headlightGeometry = rounded(0.022, 0.035, 0.08, 0.009, 2);
  const bogieGeometry = rounded(0.29, 0.115, 0.4, 0.035, 2);
  const wheelGeometry = own(new THREE.CylinderGeometry(0.085, 0.085, 0.065, 16));
  wheelGeometry.rotateX(Math.PI / 2);
  const hubGeometry = own(new THREE.CylinderGeometry(0.036, 0.036, 0.068, 12));
  hubGeometry.rotateX(Math.PI / 2);

  type Spring = { value: number; velocity: number };
  type Suspension = { carriage: THREE.Group; body: THREE.Group; height: Spring; roll: Spring; pitch: Spring; rear: boolean };
  const carriages = { front: new THREE.Group(), rear: new THREE.Group() };
  const suspensions: Suspension[] = [];
  const pivotHeight = 0.22;
  for (const direction of [-1, 1]) {
    const carriage = direction > 0 ? carriages.front : carriages.rear;
    carriage.name = direction > 0 ? 'Front carriage' : 'Rear carriage';
    carriage.position.x = direction * 0.88;
    object.add(carriage);
    const body = new THREE.Group();
    body.name = 'Suspended carriage body';
    body.position.y = pivotHeight;
    carriage.add(body);
    suspensions.push({ carriage, body, height: { value: 0, velocity: 0 }, roll: { value: 0, velocity: 0 }, pitch: { value: 0, velocity: 0 }, rear: direction < 0 });
    const bodyPart = (geometry: THREE.BufferGeometry, surface: THREE.Material, at: [number, number, number]) =>
      add(body, geometry, surface, [at[0], at[1] - pivotHeight, at[2]]);
    bodyPart(chassisGeometry, chassis, [0, 0.22, 0]);
    bodyPart(bodyGeometry, shell, [0, 0.46, 0]);

    for (const side of [-1, 1]) {
      const band = bodyPart(windowGeometry, glass, [0, 0.48, side * 0.371]);
      if (side < 0) band.rotation.y = Math.PI;
      // Two broad panes and a narrower door pane are legible at map scale.
      for (const x of [-0.24, 0.22]) bodyPart(pillarGeometry, shell, [x, 0.48, side * 0.38]);
    }

    const cab = bodyPart(windshieldGeometry, glass, [direction * 0.811, 0.48, 0]);
    cab.rotation.y = direction * Math.PI / 2;
    for (const side of [-1, 1]) {
      bodyPart(headlightGeometry, light, [direction * 0.813, 0.365, side * 0.18]);
    }

    for (const x of [-0.48, 0.48]) {
      add(carriage, bogieGeometry, chassis, [x, 0.1475, 0]);
      for (const side of [-1, 1]) {
        add(carriage, wheelGeometry, rubber, [x, 0.085, side * 0.2]);
        add(carriage, hubGeometry, connector, [x, 0.085, side * 0.2]);
      }
    }
  }

  const coupling = new THREE.Group();
  coupling.name = 'Flexible coupling';
  coupling.position.y = 0.37;
  object.add(coupling);
  add(coupling, rounded(0.22, 0.23, 0.43, 0.035, 2), chassis, [0, 0, 0]);
  const ribGeometry = rounded(0.016, 0.24, 0.45, 0.007, 1);
  for (const x of [-0.045, 0.015, 0.065]) add(coupling, ribGeometry, connector, [x, 0, 0]);

  const frontAnchor = new THREE.Vector3(), rearAnchor = new THREE.Vector3();
  const couplingForward = new THREE.Vector3(), couplingUp = new THREE.Vector3(), couplingSide = new THREE.Vector3(), rearUp = new THREE.Vector3();
  const couplingBasis = new THREE.Matrix4();
  const frontBody = suspensions.find(value => !value.rear)!.body;
  const rearBody = suspensions.find(value => value.rear)!.body;
  const updateCoupling = () => {
    carriages.front.updateMatrix(); carriages.rear.updateMatrix();
    frontBody.updateMatrix(); rearBody.updateMatrix();
    frontAnchor.set(-0.77, 0.37 - pivotHeight, 0).applyMatrix4(frontBody.matrix).applyMatrix4(carriages.front.matrix);
    rearAnchor.set(0.77, 0.37 - pivotHeight, 0).applyMatrix4(rearBody.matrix).applyMatrix4(carriages.rear.matrix);
    coupling.position.copy(frontAnchor).add(rearAnchor).multiplyScalar(0.5);
    couplingForward.copy(frontAnchor).sub(rearAnchor);
    const length = couplingForward.length();
    if (length < 0.000001) { coupling.visible = false; return; }
    coupling.visible = true;
    couplingForward.multiplyScalar(1 / length);
    couplingUp.set(0, 1, 0).applyQuaternion(carriages.front.quaternion);
    rearUp.set(0, 1, 0).applyQuaternion(carriages.rear.quaternion);
    couplingUp.add(rearUp).addScaledVector(couplingForward, -couplingUp.dot(couplingForward));
    if (couplingUp.lengthSq() < 0.000001) {
      couplingUp.set(Math.abs(couplingForward.y) > 0.9 ? 1 : 0, Math.abs(couplingForward.y) > 0.9 ? 0 : 1, 0);
      couplingUp.addScaledVector(couplingForward, -couplingUp.dot(couplingForward));
    }
    couplingUp.normalize();
    couplingSide.crossVectors(couplingForward, couplingUp).normalize();
    couplingUp.crossVectors(couplingSide, couplingForward).normalize();
    couplingBasis.makeBasis(couplingForward, couplingUp, couplingSide);
    coupling.quaternion.setFromRotationMatrix(couplingBasis);
    coupling.scale.x = length / 0.22;
  };
  const spring = (state: Spring, target: number, dt: number, rear: boolean) => {
    state.velocity += ((target - state.value) * (rear ? 100 : 135) - state.velocity * (rear ? 17 : 19)) * dt;
    state.value += state.velocity * dt;
    if (target === 0 && Math.abs(state.value) < 0.00001 && Math.abs(state.velocity) < 0.0001) state.value = state.velocity = 0;
  };
  const finite = (value: number, min: number, max: number) => THREE.MathUtils.clamp(Number.isFinite(value) ? value : 0, min, max);
  const envelope = (phase: number) => { const value = finite(phase, 0, 1); return value === 0 || value === 1 ? 0 : Math.sin(value * Math.PI); };
  let disposed = false;
  return {
    object,
    carriages,
    updateMotion(dt, state) {
      if (disposed) return;
      dt = finite(dt, 0, 0.05);
      const speed = finite(state.speed, 0, 1), turn = finite(state.turn, -1, 1);
      const departure = envelope(state.departure), arrival = envelope(state.arrival);
      for (const suspension of suspensions) {
        if (state.motion) {
          spring(suspension.height, -speed * 0.003 - departure * 0.01 - arrival * 0.013, dt, suspension.rear);
          spring(suspension.roll, -turn * speed * 0.027, dt, suspension.rear);
          spring(suspension.pitch, departure * 0.016 - arrival * 0.022, dt, suspension.rear);
        } else {
          for (const value of [suspension.height, suspension.roll, suspension.pitch]) value.value = value.velocity = 0;
        }
        suspension.body.position.y = pivotHeight + suspension.height.value;
        suspension.body.rotation.set(suspension.roll.value, 0, suspension.pitch.value);
      }
      // Rail placement belongs to the renderer. This only joins its two poses,
      // even when dt is zero during a paused resize or an immediate restore.
      updateCoupling();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      object.removeFromParent();
      for (const geometry of geometries) geometry.dispose();
      for (const surface of materials) surface.dispose();
    },
  };
}
