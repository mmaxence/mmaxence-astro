import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Small, spaced-out encounters. One clock, no timers or spawned objects. */
export function createAmbientLife() {
  const object = new THREE.Group();
  object.name = 'Quiet globe encounters';
  const soft = new THREE.MeshStandardMaterial({ color: 0xe2e2e2, roughness: .9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: .9 });
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  const panel = new RoundedBoxGeometry(1, 1, 1, 2, .12);
  const mesh = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, position: number[], scale: number[]) => {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(...position as [number, number, number]);
    part.scale.set(...scale as [number, number, number]);
    parent.add(part);
    return part;
  };
  const surfaceLife=new THREE.Group();surfaceLife.name='Planet-bound wildlife';
  const flock = new THREE.Group(); flock.name = 'Passing birds'; surfaceLife.add(flock);
  const birds = Array.from({ length: 3 }, (_, i) => {
    const bird = new THREE.Group(); bird.rotation.x = Math.PI * .38; flock.add(bird);
    bird.position.set(-i * .38, (i % 2 ? 1 : -1) * i * .14, -i * .16);
    mesh(bird, sphere, dark, [0, 0, 0], [.12, .045, .055]);
    const wings = [-1, 1].map(side => {
      const hinge = new THREE.Group(); hinge.rotation.y = -side * .55; bird.add(hinge);
      mesh(hinge, sphere, dark, [-.025, 0, side * .13], [.085, .018, .18]);
      return { hinge, side };
    });
    return { bird, wings };
  });
  const satellite = new THREE.Group(); satellite.name = 'Distant satellite'; object.add(satellite);
  mesh(satellite, panel, soft, [0, 0, 0], [.25, .28, .24]);
  mesh(satellite, panel, dark, [0, 0, 0], [1.05, .035, .045]);
  for (const side of [-1, 1]) mesh(satellite, panel, dark, [side * .44, 0, 0], [.48, .035, .32]);
  mesh(satellite, sphere, soft, [0, .2, 0], [.17, .045, .17]);
  let clock = 0, pace = 1;
  const envelope = (phase: number) => Math.min(1, phase / .12, (1 - phase) / .12);
  const pose = () => {
    const cycle = clock % 46;
    const flight = (cycle - 4) / 11;
    flock.visible = flight > 0 && flight < 1;
    if (flock.visible) {
      const angle = (flight - .5) * Math.PI * 1.12;
      flock.position.set(Math.sin(angle) * 8.2, 4.2 + Math.sin(flight * Math.PI) * .45, Math.cos(angle) * 7.2);
      flock.rotation.y = angle;
      flock.scale.setScalar(envelope(flight));
      birds.forEach(({ bird, wings }, i) => {
        bird.position.y = (i % 2 ? 1 : -1) * i * .14 + Math.sin(clock * 2 + i) * .025;
        // A few wingbeats followed by a longer glide.
        const beat = Math.max(0, Math.sin(clock * 1.5 + i * .4));
        wings.forEach(({ hinge, side }) => { hinge.rotation.x = side * (.12 + Math.sin(clock * 10 - i) * .42 * beat); });
      });
    }
    // A wider, tilted orbit travels right to left, opposite the flock.
    // The globe itself occludes its far side; it is never spawned or teleported.
    const angle = .65 - clock * Math.PI * 2 / 56;
    satellite.visible = clock > 0;
    satellite.position.set(Math.sin(angle) * 10.8, Math.cos(angle) * 4.7, Math.cos(angle) * 9.5);
    satellite.rotation.set(.25, -angle, -.35);
    satellite.scale.setScalar(.9 * Math.min(1, clock / 1.5));
  };
  pose();
  return {
    object, surfaceLife,
    update(dt: number, interacting: boolean) {
      pace = THREE.MathUtils.lerp(pace, interacting ? .2 : 1, 1 - Math.exp(-dt * 2));
      clock += dt * pace;
      pose();
    },
    reset() { clock = 0; pace = 1; pose(); },
    dispose() { surfaceLife.removeFromParent();object.removeFromParent(); sphere.dispose(); panel.dispose(); soft.dispose(); dark.dispose(); },
  };
}
