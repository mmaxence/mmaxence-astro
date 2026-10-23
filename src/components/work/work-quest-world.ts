import * as THREE from 'three';
import { createMonorail } from './work-monorail';
import { createAmbientLife } from './work-ambient-life';

export interface WorldHandle {
  select(slug: string): void;
  hover(slug: string | null): void;
  pan(delta: number): void;
  setPan(position: number): void;
  step(direction: -1 | 1): void;
  restoreStation(slug: string): void;
  boost(): void;
  zoom(delta: number): void;
  setProgress(progress: Record<string, number>): void;
  setMotion(enabled: boolean, immediate?: boolean): void;
  dispose(): void;
}
type Projection = { slug: string; x: number; y: number; visible: boolean };
type WorldOptions = {
  onProject(points: Projection[]): void;
  onWorkshop?(point: {x:number;y:number;visible:boolean}): void;
  onReady?(): void;
  onError?(): void;
  onSelect?(slug: string, event?: MouseEvent): void;
  onHover?(slug: string | null): void;
  onPan?(position: number): void;
  onStation?(slug: string): void;
};
const chapters = ['lockscreen', 'offerwall', 'game-ua-multi-mission', 'interaction-composer', 'buzzvil-mediums', 'hanji'];
const ivory = '#f5f5f5';
const ink = '#353535';

/** A small world of work. Screen-space links remain the accessible navigation layer. */
export function createWorkQuestWorld(canvas: HTMLCanvasElement, options: WorldOptions): WorldHandle {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    options.onError?.();
    return { select() {}, hover() {}, pan() {}, setPan() {}, step() {}, restoreStation() {}, boost() {}, zoom() {}, setProgress() {}, setMotion() {}, dispose() {} };
  }
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 100);
  const sky = new THREE.HemisphereLight(0xffffff, 0x999999, 1.1);
  scene.add(sky);
  const sunlight = new THREE.DirectionalLight(0xffffff, 2.3);
  sunlight.position.set(-10, 34, 14);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunlight.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 0.5, far: 75 });
  sunlight.shadow.normalBias = 0.018;
  sunlight.shadow.bias = -0.0002;
  sunlight.shadow.radius = 3;
  scene.add(sunlight);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(8, -4, 15); scene.add(fill);
  scene.add(sunlight.target);
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const geometries = new Set<THREE.BufferGeometry>();
  const material = (color: string) => {
    let result = materials.get(color);
    if (!result) {
      result = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, flatShading: false });
      materials.set(color, result);
    }
    return result;
  };
  const own = <T extends THREE.BufferGeometry>(geometry: T): T => { geometries.add(geometry); return geometry; };
  const cube = own(new THREE.BoxGeometry(1, 1, 1));
  const sphere = own(new THREE.IcosahedronGeometry(1, 2));
  const cylinder = own(new THREE.CylinderGeometry(1, 1, 1, 10));
  const cone = own(new THREE.ConeGeometry(1, 1, 8));
  const add = (parent: THREE.Object3D, geometry: THREE.BufferGeometry, color: string, at: number[], scale: number[] = [1, 1, 1]) => {
    const mesh = new THREE.Mesh(geometry, material(color));
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.position.set(at[0], at[1], at[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    parent.add(mesh);
    return mesh;
  };
  const box = (parent: THREE.Object3D, color: string, at: number[], scale: number[]) => add(parent, cube, color, at, scale);
  const round = (width: number, height: number, depth: number, radius = 0.07) => {
    const shape = new THREE.Shape();
    const x = -width / 2, y = -height / 2, r = Math.min(radius, width / 3, height / 3);
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    const geometry = own(new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSegments: 3, steps: 1,
      bevelSize: 0.025, bevelThickness: 0.025, curveSegments: 8,
    }));
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  };
  const rounded = (parent: THREE.Object3D, color: string, at: number[], size: number[], radius = 0.07) =>
    add(parent, round(size[0], size[1], size[2], radius), color, at);
  const line = (parent: THREE.Object3D, color: string, points: THREE.Vector3[], thickness = 0.018) => {
    const path = new THREE.CatmullRomCurve3(points);
    return add(parent, own(new THREE.TubeGeometry(path, 16, thickness, 5, false)), color, [0, 0, 0]);
  };
  const coin = (parent: THREE.Object3D, at: number[], radius = 0.16) => {
    const result = add(parent, cylinder, '#adadad', at, [radius, 0.065, radius]);
    result.rotation.x = Math.PI / 2;
    return result;
  };
  const dots = (parent: THREE.Object3D, at: number[], color = ivory) => {
    for (let i = 0; i < 3; i++) add(parent, sphere, color, [at[0] + i * 0.12, at[1], at[2]], [0.026, 0.026, 0.016]);
  };
  const card = (parent: THREE.Object3D, at: number[], color: string, width = 0.7, height = 0.8) => {
    const group = new THREE.Group();
    group.position.set(at[0], at[1], at[2]);
    parent.add(group);
    rounded(group, ivory, [0, 0, 0], [width, height, 0.07]);
    rounded(group, color, [0, height * 0.15, 0.052], [width * 0.8, height * 0.42, 0.012], 0.035);
    box(group, '#bababa', [-width * 0.09, -height * 0.2, 0.052], [width * 0.62, 0.035, 0.014]);
    box(group, '#d0d0d0', [-width * 0.17, -height * 0.3, 0.052], [width * 0.46, 0.024, 0.014]);
    return group;
  };

  const radius=7;
  const planet=new THREE.Group();planet.name='Work globe';scene.add(planet);
  const ambient=createAmbientLife();scene.add(ambient.object);planet.add(ambient.surfaceLife);
  const surfaceMaterial=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:.42,roughness:1,metalness:0,toneMapped:false});
  const surface=new THREE.Mesh(own(new THREE.SphereGeometry(radius,96,64)),surfaceMaterial);
  surface.name='Globe surface';surface.receiveShadow=true;planet.add(surface);
  const longitude=[-40,20,80,140,200,260].map(THREE.MathUtils.degToRad);
  const latitude=[18,31,15,29,18,30].map(THREE.MathUtils.degToRad);
  const normals=chapters.map((_,i)=>new THREE.Vector3(Math.sin(longitude[i])*Math.cos(latitude[i]),Math.sin(latitude[i]),Math.cos(longitude[i])*Math.cos(latitude[i])));
  const globeUp=new THREE.Vector3(0,1,0),east=new THREE.Vector3(),south=new THREE.Vector3(),basis=new THREE.Matrix4();
  const places=chapters.map((slug,index)=>{
    const group=new THREE.Group();group.userData.slug=slug;
    group.position.copy(normals[index]).multiplyScalar(radius+0.015);
    east.set(Math.cos(longitude[index]),0,-Math.sin(longitude[index]));south.crossVectors(east,normals[index]);
    basis.makeBasis(east,normals[index],south);group.quaternion.setFromRotationMatrix(basis);
    planet.add(group);return group;
  });
  const buildings=places.map(place=>{const group=new THREE.Group();group.position.y=-0.2;place.add(group);return group;});
  const flags:THREE.Mesh[]=[];
  const halos:THREE.Mesh[]=[];
  const floating:THREE.Object3D[]=[];
  const transientMaterials:THREE.Material[]=[surfaceMaterial];
  // A single raised rail links stations in chronological order. It never
  // closes the gap from Hanji back to the early Lockscreen work.
  const stationDirections=longitude.map((angle,index)=>{
    const lat=latitude[index]+THREE.MathUtils.degToRad(16),lon=angle-THREE.MathUtils.degToRad(5);
    return new THREE.Vector3(Math.sin(lon)*Math.cos(lat),Math.sin(lat),Math.cos(lon)*Math.cos(lat));
  });
  const routeSpline=new THREE.CatmullRomCurve3(stationDirections,false,'centripetal');
  const railRadius=radius+.18;
  class SurfaceRoute extends THREE.Curve<THREE.Vector3>{
    constructor(){super();}
    getPoint(t:number,target=new THREE.Vector3()){return routeSpline.getPoint(t,target).normalize().multiplyScalar(railRadius);}
  }
  const railCurve=new SurfaceRoute();
  const route=new THREE.Mesh(own(new THREE.TubeGeometry(railCurve,360,.055,8,false)),material('#777777'));
  route.name='Chronological rail';route.castShadow=true;route.receiveShadow=true;planet.add(route);
  const railPoint=new THREE.Vector3(),railNormal=new THREE.Vector3(),railForward=new THREE.Vector3(),railSide=new THREE.Vector3(),railMatrix=new THREE.Matrix4();
  const railFrame=(t:number)=>{
    railCurve.getPoint(t,railPoint);railNormal.copy(railPoint).normalize();railCurve.getTangent(t,railForward);
    railForward.addScaledVector(railNormal,-railForward.dot(railNormal)).normalize();railSide.crossVectors(railForward,railNormal).normalize();railForward.crossVectors(railNormal,railSide).normalize();
    railMatrix.makeBasis(railForward,railNormal,railSide);
  };
  chapters.forEach((slug,index)=>{
    railFrame(index/(chapters.length-1));const station=new THREE.Group();station.name=`Station: ${slug}`;
    station.position.copy(railNormal).multiplyScalar(radius+.09);station.quaternion.setFromRotationMatrix(railMatrix);planet.add(station);
    rounded(station,'#d7d7d7',[0,0,0],[1.75,.10,.58],.045);
    rounded(station,'#555555',[-.62,.18,-.31],[.18,.28,.055],.04);
  });
  const railSupports=new THREE.InstancedMesh(own(new THREE.CylinderGeometry(.035,.045,.17,8)),material('#b2b2b2'),30);
  const support=new THREE.Object3D();
  for(let index=0;index<30;index++){
    railCurve.getPoint(index/29,railPoint);railNormal.copy(railPoint).normalize();support.position.copy(railNormal).multiplyScalar(radius+.085);support.quaternion.setFromUnitVectors(globeUp,railNormal);support.updateMatrix();railSupports.setMatrixAt(index,support.matrix);
  }
  railSupports.castShadow=true;railSupports.receiveShadow=true;planet.add(railSupports);
  places.forEach((place,index)=>{
    const haloMaterial=new THREE.MeshBasicMaterial({color:0x666666,transparent:true,opacity:0,depthWrite:false});transientMaterials.push(haloMaterial);
    const halo=new THREE.Mesh(own(new THREE.TorusGeometry(1.6,0.018,4,48,Math.PI*1.45)),haloMaterial);
    halo.rotation.set(Math.PI/2,0,index*.6);halo.position.y=.025;place.add(halo);halos.push(halo);
    const marker=add(place,sphere,'#b7b7b7',[-1.16,.42,.68],[.065,.065,.065]);flags.push(marker);
    add(place,cylinder,'#b7b7b7',[-1.16,.2,.68],[.018,.42,.018]);
  });

  // Lockscreen. A phone-shaped observation tower above a small entrance court.
  {
    const p=buildings[0];
    add(p,cylinder,'#d3d3d3',[0,0.36,0],[1.0,0.22,0.83]);
    const tower=rounded(p,'#484848',[0,1.7,-0.12],[1.15,2.7,0.35],0.12);
    tower.rotation.y=-0.08;
    const face=new THREE.Group();face.position.set(0,1.7,0.085);face.rotation.y=-0.08;p.add(face);
    rounded(face,ivory,[0,0,0],[1.0,2.48,0.035],0.09);
    rounded(face,'#c1c1c1',[0,0.1,0.035],[0.88,1.78,0.02],0.03);
    add(face,cone,'#8d8d8d',[0.13,-0.04,0.07],[0.46,0.95,0.09]);
    add(face,sphere,'#e4e4e4',[-0.25,0.57,0.075],[0.13,0.13,0.025]);
    box(face,'#909090',[0,1.05,0.06],[0.34,0.035,0.015]);
    rounded(face,ivory,[0,-0.58,0.08],[0.61,0.12,0.02],0.04);
    dots(face,[-0.12,-1.04,0.075],'#b2b2b2');
    rounded(p,'#e8e8e8',[-0.87,0.55,0.27],[0.45,0.5,0.42],0.04);
    rounded(p,'#858585',[-0.87,0.57,0.5],[0.29,0.32,0.02],0.02);
    for(let i=0;i<3;i++)box(p,'#d0d0d0',[0.73+i*0.1,0.38+i*0.08,0.42],[0.13,0.12,0.45]);
  }
  // Offerwall. A shared exchange, with three entrances feeding one atrium.
  {
    const p=buildings[1];
    for(const x of [-1.25,1.25])for(const z of [-0.65,0.55])box(p,'#bcbcbc',[x,0.83,z],[0.08,1.25,0.09]);
    rounded(p,ivory,[0,1.52,-0.05],[2.85,0.15,1.65],0.05);
    rounded(p,'#eeeeee',[0,0.36,-0.05],[2.8,0.14,1.65],0.04);
    for(const x of [-0.84,0,0.84]){
      rounded(p,'#d1d1d1',[x,0.91,0.15],[0.56,0.94,0.36],0.045);
      rounded(p,'#414141',[x,1.03,0.35],[0.42,0.44,0.02],0.02);
      box(p,ivory,[x,0.65,0.37],[0.3,0.04,0.015]);
    }
    const spine=card(p,[0,2.01,-0.35],'#545454',0.95,1.05);spine.rotation.y=-0.15;
    box(p,'#797979',[0,1.66,-0.35],[0.1,0.8,0.1]);
    for(const x of [-1.43,1.43]){const entry=card(p,[x,0.67,0.9],'#ababab',0.42,0.62);entry.rotation.y=x>0?-0.4:0.4;}
    line(p,'#aaaaaa',[new THREE.Vector3(-1.45,0.27,0.95),new THREE.Vector3(0,0.27,1.15),new THREE.Vector3(1.45,0.27,0.95)],0.014);
  }
  // Game UA. A tiny play park, complete with an arcade, lookout and slide.
  {
    const p=new THREE.Group();p.scale.setScalar(1.28);buildings[2].add(p);
    rounded(p,'#9f9f9f',[-0.45,0.77,0.05],[0.85,0.83,0.73],0.035);
    rounded(p,'#c8c8c8',[-0.45,1.49,-0.05],[1.05,1.01,0.56],0.045);
    const bezel=rounded(p,'#777777',[-0.45,1.51,.52],[.99,.87,.1],.035);bezel.rotation.x=-.55;
    const screen=new THREE.Group();screen.position.set(-.45,1.54,.575);screen.rotation.x=-.55;p.add(screen);
    rounded(screen,'#404040',[0,0,0],[0.87,0.73,0.025],0.025);
    rounded(p,'#eeeeee',[-0.45,2.08,-0.04],[1.12,0.14,0.49],0.025);
    box(p,'#dadada',[-0.45,1.06,0.4],[1.04,0.09,0.42]);
    add(p,cylinder,ink,[-0.65,1.18,0.46],[0.024,0.18,0.024]);add(p,sphere,'#7d7d7d',[-0.65,1.28,0.46],[0.075,0.075,0.075]);
    for(let i=0;i<3;i++){box(screen,'#d2d2d2',[-.25+i*.24,-.12+i*.12,.025],[.16,.055,.02]);add(p,cylinder,'#a0a0a0',[-0.3+i*0.12,1.12,0.46],[0.04,0.025,0.04]);}
    const playground=new THREE.Group();playground.position.set(.12,0,-.22);buildings[2].add(playground);
    for(const x of [0.6,1.15])box(playground,'#a1a1a1',[x,1.03,-0.5],[0.05,1.5,0.05]);
    box(playground,'#e8e8e8',[0.88,1.79,-0.47],[0.85,0.1,0.75]);
    for(let rung=0;rung<6;rung++)box(playground,'#a5a5a5',[0.88,0.45+rung*0.22,-0.52],[0.5,0.035,0.06]);
    line(playground,'#c7c7c7',[new THREE.Vector3(1.13,1.83,-0.45),new THREE.Vector3(1.44,1.55,0),new THREE.Vector3(1.55,0.68,0.6),new THREE.Vector3(1.48,0.29,1.05)],0.14);
    add(playground,cylinder,'#787878',[0.85,2.2,-0.54],[0.018,0.8,0.018]);
    const flag=new THREE.Shape();flag.moveTo(0,0);flag.lineTo(0.4,-0.13);flag.lineTo(0,-0.25);flag.closePath();add(playground,own(new THREE.ShapeGeometry(flag)),'#b9b9b9',[0.87,2.58,-0.54]);
    const prize=add(playground,sphere,'#8f8f8f',[-1.08,0.74,0.65],[0.16,0.16,0.16]);floating.push(prize);
  }
  // Composer. An open research portal with pieces that remain rearrangeable.
  {
    const p=buildings[3];
    const arch=new THREE.Shape();arch.moveTo(-1.15,0);arch.lineTo(-1.15,1.85);arch.quadraticCurveTo(-1.15,2.5,-0.55,2.5);arch.lineTo(0.55,2.5);arch.quadraticCurveTo(1.15,2.5,1.15,1.85);arch.lineTo(1.15,0);arch.closePath();
    const hole=new THREE.Path();hole.moveTo(-0.75,0.05);hole.lineTo(0.75,0.05);hole.lineTo(0.75,1.78);hole.quadraticCurveTo(0.75,2.05,0.45,2.05);hole.lineTo(-0.45,2.05);hole.quadraticCurveTo(-0.75,2.05,-0.75,1.78);hole.closePath();arch.holes.push(hole);
    add(p,own(new THREE.ExtrudeGeometry(arch,{depth:0.35,bevelEnabled:true,bevelSize:0.025,bevelThickness:0.025,bevelSegments:2,steps:1,curveSegments:8})),ivory,[0,0.22,-0.22]);
    const core=rounded(p,'#929292',[0,1.45,0.1],[0.58,0.58,0.58],0.035);core.rotation.set(0.25,0.5,0.12);floating.push(core);
    [[-0.45,0.75,0.35],[0.55,2.1,0.12],[0.93,0.55,0.8]].forEach(([x,y,z],i)=>{const piece=rounded(p,i%2?'#c9c9c9':'#b2b2b2',[x,y,z],[0.28,0.28,0.28],0.025);piece.rotation.set(0.15,i*0.8,0.15);floating.push(piece);});
    rounded(p,'#dedede',[-0.7,0.47,0.9],[1.1,0.1,0.45],0.025);for(const x of [-1.1,-0.3])box(p,'#999999',[x,0.33,0.9],[0.04,0.28,0.3]);
  }
  // Mediums. A family of web surfaces held by one architectural foundation.
  {
    const p=buildings[4];
    for(const x of [-1.25,1.25])box(p,'#a7a7a7',[x,1.07,-0.15],[0.14,1.7,0.8]);
    const roof=rounded(p,ivory,[0,2.08,-0.35],[2.96,0.15,1.5],0.03);roof.rotation.z=0.06;
    const main=new THREE.Group();main.position.set(0,1.23,0.38);p.add(main);
    rounded(main,'#ededed',[0,0,0],[2.15,1.36,0.14],0.06);
    rounded(main,'#464646',[0,0.48,0.09],[1.99,0.24,0.02],0.025);dots(main,[-0.82,0.48,0.115]);
    rounded(main,'#bcbcbc',[-0.4,-0.02,0.09],[1.02,0.62,0.02],0.025);add(main,sphere,'#8e8e8e',[-0.4,-0.02,0.12],[0.2,0.2,0.03]);
    for(let i=0;i<3;i++)box(main,i===2?'#8f8f8f':'#b0b0b0',[0.62,0.14-i*0.19,0.115],[0.52,0.04,0.015]);
    box(main,'#bdbdbd',[-0.2,-0.5,0.1],[1.4,0.035,0.015]);
    const side=card(p,[-1.02,2.05,-0.63],'#9b9b9b',0.72,1.15);side.rotation.y=0.24;
    const mobile=card(p,[1.25,0.75,0.83],'#b4b4b4',0.48,0.92);mobile.rotation.y=-0.3;
    box(p,'#cecece',[0,0.4,0.12],[2.4,0.14,1.35]);
  }
  // Hanji. Three folded paper wings share a deliberately thin structure.
  {
    const p=buildings[5];
    const fold=(x:number,z:number,rotation:number,height:number,color:string)=>{
      const group=new THREE.Group();group.position.set(x,0.27,z);group.rotation.y=rotation;p.add(group);
      const points=[-0.63,0,0, -0.63,height,0, 0,height+0.35,-0.38, 0.63,height,0, 0.63,0,0];
      const geometry=own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geometry.setIndex([0,1,2,0,2,4,2,3,4]);geometry.computeVertexNormals();
      const paperMaterial=new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide,flatShading:true});transientMaterials.push(paperMaterial);const paper=new THREE.Mesh(geometry,paperMaterial);group.add(paper);
      line(group,'#9e9e9e',[new THREE.Vector3(-0.63,height,0),new THREE.Vector3(0,height+0.35,-0.38),new THREE.Vector3(0.63,height,0)],0.012);
      for(let lineIndex=0;lineIndex<3;lineIndex++)box(group,'#a7a7a7',[-0.2,height*0.63-lineIndex*0.2,0.012],[0.48-lineIndex*0.08,0.024,0.012]);
    };
    fold(-0.68,-0.3,-0.35,1.95,'#d4d4d4');fold(0.68,-0.3,0.35,2.23,'#bfbfbf');fold(0,0.58,0,1.78,ivory);
    const foldedCorner=add(p,cone,'#c3c3c3',[1.2,0.42,0.66],[0.28,0.4,0.3]);foldedCorner.rotation.set(0.05,0.65,0.15);
    const thought=add(p,sphere,'#8b8b8b',[0,2.98,-0.12],[0.12,0.12,0.12]);floating.push(thought);
  }

  // A restrained population of trees and stones makes one inhabited world.
  // Instancing keeps these details inexpensive when the globe rotates.
  const treeTrunks=new THREE.InstancedMesh(own(new THREE.CylinderGeometry(.032,.044,.42,10)),material('#898989'),64);
  const treeCrowns=new THREE.InstancedMesh(own(new THREE.SphereGeometry(.31,12,8).scale(1,1.25,1)),material('#b1b1b1'),128);
  const rocks=new THREE.InstancedMesh(sphere,material('#d7d7d7'),26);
  for(const mesh of [treeTrunks,treeCrowns,rocks]){mesh.castShadow=true;mesh.receiveShadow=true;planet.add(mesh);}
  const instanceObject=new THREE.Object3D(),instanceNormal=new THREE.Vector3(),instanceQuaternion=new THREE.Quaternion(),instanceColor=new THREE.Color();
  const treeDirections:THREE.Vector3[]=[];
  normals.forEach((normal,index)=>{
    east.set(Math.cos(longitude[index]),0,-Math.sin(longitude[index]));south.crossVectors(east,normal);
    for(const [x,z] of [[.31,.20],[.4,.23],[.34,.32]]){
      const n=normal.clone().addScaledVector(east,x*(index%2?-1:1)).addScaledVector(south,z).normalize();
      if(!normals.some((other,i)=>i!==index&&other.dot(n)>.96))treeDirections.push(n);
    }
  });
  for(let index=0;index<12;index++){
    const y=1-2*(index+.5)/12,angle=index*2.39996323;
    const n=new THREE.Vector3(Math.cos(angle)*Math.sqrt(1-y*y),y,Math.sin(angle)*Math.sqrt(1-y*y));
    if(normals.every(normal=>normal.dot(n)<.9))treeDirections.push(n);
  }
  treeDirections.forEach((n,index)=>{
    const size=.62+(index%4)*.065;
    instanceQuaternion.setFromUnitVectors(globeUp,n);
    instanceObject.quaternion.copy(instanceQuaternion);instanceObject.scale.setScalar(size);
    instanceObject.position.copy(n).multiplyScalar(radius+.21*size);instanceObject.updateMatrix();treeTrunks.setMatrixAt(index,instanceObject.matrix);
    for(let layer=0;layer<2;layer++){
      instanceObject.position.copy(n).multiplyScalar(radius+(.62+layer*.27)*size);
      instanceObject.scale.setScalar(size*(layer?.75:1));instanceObject.updateMatrix();treeCrowns.setMatrixAt(index*2+layer,instanceObject.matrix);
      instanceColor.set(index%4===0?'#a9a9a9':index%3===0?'#cacaca':'#bcbcbc');treeCrowns.setColorAt(index*2+layer,instanceColor);
    }
  });
  treeTrunks.count=treeDirections.length;treeCrowns.count=treeDirections.length*2;
  for(let index=0;index<26;index++){
    const y=1-2*(index+.5)/26,angle=index*2.39996323+.8;
    instanceNormal.set(Math.cos(angle)*Math.sqrt(1-y*y),y,Math.sin(angle)*Math.sqrt(1-y*y));
    instanceObject.quaternion.setFromUnitVectors(globeUp,instanceNormal);instanceObject.position.copy(instanceNormal).multiplyScalar(radius+.065);
    const size=.08+(index%4)*.025;instanceObject.scale.set(size*1.8,size,size*1.25);instanceObject.updateMatrix();rocks.setMatrixAt(index,instanceObject.matrix);
  }
  const clouds:THREE.Group[]=[];
  const cloudDirections=[[-81,53],[-70,-33],[-5,66],[48,40],[92,-34],[171,22],[-142,-9]];
  cloudDirections.forEach(([lon,lat],index)=>{
    const a=THREE.MathUtils.degToRad(lon),b=THREE.MathUtils.degToRad(lat);
    const n=new THREE.Vector3(Math.sin(a)*Math.cos(b),Math.sin(b),Math.cos(a)*Math.cos(b));
    const cloud=new THREE.Group();cloud.position.copy(n).multiplyScalar(radius+1.15);cloud.quaternion.setFromUnitVectors(globeUp,n);cloud.userData.normal=n;planet.add(cloud);
    [[-.38,0,0,.35],[0,.12,0,.48],[.4,0,.03,.31],[.13,-.03,.2,.36]].forEach(([x,y,z,size])=>{
      const puff=add(cloud,own(new THREE.IcosahedronGeometry(1,2)),ivory,[x,y,z],[size*1.2,size*.65,size]);puff.castShadow=false;
    });
    cloud.scale.setScalar(index%2?.8:1);clouds.push(cloud);
  });
  const tapMaterial=new THREE.MeshBasicMaterial({color:0x737373,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
  transientMaterials.push(tapMaterial);
  const tapRing=new THREE.Mesh(own(new THREE.RingGeometry(.94,1,48)),tapMaterial);
  tapRing.name='Surface tap ripple';tapRing.visible=false;planet.add(tapRing);
  let tapTime=1;
  const hitVolumes=places.map((place,index)=>{
    const hit=box(place,'#ffffff',[0,1,0],[3.65,3.6,2.7]);hit.visible=false;hit.userData.slug=chapters[index];return hit;
  });
  // A community workshop lives off the chronological rail.
  const workshop=new THREE.Group();workshop.name='Open-source workshop';planet.add(workshop);
  const workshopNormal=new THREE.Vector3(.24,-.47,.85).normalize();
  east.set(workshopNormal.z,0,-workshopNormal.x).normalize();south.crossVectors(east,workshopNormal);
  basis.makeBasis(east,workshopNormal,south);workshop.quaternion.setFromRotationMatrix(basis);
  workshop.position.copy(workshopNormal).multiplyScalar(radius+.015);
  const workshopBuilding=new THREE.Group();workshop.add(workshopBuilding);
  rounded(workshopBuilding,'#bcbcbc',[0,.07,0],[2.15,.14,1.65],.12);
  rounded(workshopBuilding,ivory,[0,.65,-.58],[1.9,1.15,.18],.12);
  for(const x of [-.87,.87])rounded(workshopBuilding,'#777777',[x,.65,.56],[.14,1.15,.14],.06);
  rounded(workshopBuilding,ivory,[0,1.28,0],[2.25,.22,1.8],.12);
  for(const sign of [-1,1])line(workshopBuilding,ink,[new THREE.Vector3(sign*.22,1.42,-.28),new THREE.Vector3(sign*.48,1.42,0),new THREE.Vector3(sign*.22,1.42,.28)],.04);
  line(workshopBuilding,ink,[new THREE.Vector3(.10,1.42,-.32),new THREE.Vector3(-.10,1.42,.32)],.035);
  rounded(workshopBuilding,ink,[0,.66,.25],[1.35,.13,.66],.06);
  rounded(workshopBuilding,'#555555',[0,.94,-.38],[.75,.44,.09],.06);
  for(const sign of [-1,1])line(workshopBuilding,ivory,[new THREE.Vector3(sign*.16,1.04,-.32),new THREE.Vector3(sign*.25,.94,-.32),new THREE.Vector3(sign*.16,.84,-.32)],.018);
  for(let i=0;i<3;i++)rounded(workshopBuilding,['#aaa','#dedede','#888'][i],[-.46+i*.45,.82,.29],[.29,.2,.29],.04);
  const workshopHit=box(workshop,'#fff',[0,.75,0],[2.4,1.6,1.9]);workshopHit.visible=false;workshopHit.userData.slug='open-source';
  let workshopVisible=false;
  const monorail=createMonorail();monorail.object.name='Project monorail';planet.add(monorail.object);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),pointerTarget=new THREE.Vector2(),pointerCurrent=new THREE.Vector2();
  const globeSphere=new THREE.Sphere(new THREE.Vector3(),radius),rayPoint=new THREE.Vector3(),localRay=new THREE.Ray(),planetInverse=new THREE.Matrix4(),planetNormals=new THREE.Matrix3();
  const worldNormal=new THREE.Vector3(),worldPoint=new THREE.Vector3(),projected=new THREE.Vector3(),cameraDirection=new THREE.Vector3(0,0,1);
  const modelView=new THREE.Vector3(),modelQuaternion=new THREE.Quaternion();
  const hoverValue=new Float32Array(6),hoverVelocity=new Float32Array(6);
  const floatBases=floating.map(object=>object.position.y);
  const visibleProjects=new Uint8Array(6);
  let projectionCache:Projection[]=[];
  let width=1,height=1,viewWidth=24,viewHeight=15,compact=false,placeScale=.64,viewFocusX=0;
  let selected=0,hovered:string|null=null,panPosition=0,panCurrent=0,panTarget=0;
  let trainPosition=0,travelFrom=0,travelTo=0,travelTime=0,travelDuration=0,travelCameraFrom=0,travelCameraTo=0,followTrain=false;
  let reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motion=!reducedMotion;
  let viewChoosing=false,viewSettle=0;
  let idleTime=0,idleX=0,idleY=0,hoverHoldsView=false,pointerOverGlobe=false,autoTurning=false,pointerInView=false,cursorTurnSpeed=0;
  const departureDuration=.2,arrivalDuration=.36;
  const trainAnimation={speed:0,turn:0,departure:0,arrival:0,motion:true};
  const trainInverse=new THREE.Quaternion(),carriageQuaternion=new THREE.Quaternion(),carriagePoint=new THREE.Vector3(),trainForward=new THREE.Vector3(),trainSide=new THREE.Vector3();
  const railLength=railCurve.getLength();
  let ready=false,disposed=false,failed=false,visible=true,frame=0,previous=0,elapsed=0;
  let panVelocity=0,compression=0,compressionVelocity=0,lastPanNotice=0;
  let drag:{id:number;x:number;y:number;pan:number;lastX:number;lastTime:number;velocity:number;startSlug:string|undefined;active:boolean;cancelled:boolean}|undefined;
  const stage=canvas.closest('.quest-stage')??canvas;
  const normalizePan=(value:number)=>((value%1)+1)%1;
  const rotationRange=Math.PI*2;
  const updateGlobe=()=>{
    planet.scale.set(1+compression*.18,1-compression,1+compression*.18);
    planet.rotation.set(idleX+(motion?-pointerCurrent.y*.22:0),-panCurrent*rotationRange+idleY+(motion?pointerCurrent.x*.105:0),-.035);
    planet.updateMatrixWorld(true);planetInverse.copy(planet.matrixWorld).invert();planetNormals.getNormalMatrix(planet.matrixWorld);
    // Keep whole landmarks rendered: the opaque globe naturally hides their far side.
    places.forEach((place,index)=>{worldNormal.copy(normals[index]).applyMatrix3(planetNormals).normalize();place.visible=true;place.getWorldQuaternion(modelQuaternion).invert();modelView.copy(cameraDirection).applyQuaternion(modelQuaternion);buildings[index].rotation.y=Math.atan2(modelView.x,modelView.z);});
    worldNormal.copy(workshopNormal).applyMatrix3(planetNormals).normalize();workshop.visible=true;
    workshop.getWorldQuaternion(modelQuaternion).invert();modelView.copy(cameraDirection).applyQuaternion(modelQuaternion);workshopBuilding.rotation.y=Math.atan2(modelView.x,modelView.z);
    planet.updateMatrixWorld(true);
  };
  const project=()=>{
    const points=places.map((place,index)=>{
      worldNormal.copy(normals[index]).applyMatrix3(planetNormals).normalize();
      planet.localToWorld(worldPoint.copy(normals[index]).multiplyScalar(radius + .015));
      projected.copy(worldPoint).project(camera);
      const x=(projected.x*.5+.5)*width,y=(-projected.y*.5+.5)*height+24;
      // Separate enter/leave thresholds prevent horizon chatter while dragging.
      const front=worldNormal.dot(cameraDirection)>(visibleProjects[index] ? .12 : .20);
      const inFrame=x>-90&&x<width+90&&y>-70&&y<height;
      visibleProjects[index]=front&&inFrame?1:0;
      return{slug:chapters[index],x,y,visible:front&&inFrame};
    });
    worldNormal.copy(workshopNormal).applyMatrix3(planetNormals).normalize();
    workshop.localToWorld(worldPoint.set(0,0,1.2).divideScalar(workshop.scale.x));projected.copy(worldPoint).project(camera);
    const wx=(projected.x*.5+.5)*width,wy=(-projected.y*.5+.5)*height;
    workshopVisible=worldNormal.z>.25&&wx>25&&wx<width-25&&wy>65&&wy<height-58;
    options.onWorkshop?.({x:wx,y:wy,visible:workshopVisible});
    if(viewChoosing||autoTurning)chooseCenteredStation(points);
    if(points.some((point,index)=>!projectionCache[index]||point.visible!==projectionCache[index].visible||Math.abs(point.x-projectionCache[index].x)>.15||Math.abs(point.y-projectionCache[index].y)>.15)){projectionCache=points;options.onProject(points);}
  };
  const draw=()=>{if(disposed||failed)return;updateGlobe();project();renderer.render(scene,camera);if(!ready){ready=true;requestAnimationFrame(()=>{if(disposed||failed)return;renderer.render(scene,camera);options.onReady?.();});}};
  const animateAllowed=()=>motion&&visible&&!document.hidden&&!disposed&&!failed;
  const poseTrain=(dt=0,reset=false)=>{
    railFrame(trainPosition);monorail.object.position.copy(railNormal).multiplyScalar(railRadius+.055);
    monorail.object.quaternion.setFromRotationMatrix(railMatrix);trainInverse.copy(monorail.object.quaternion).invert();
    trainForward.copy(railForward);trainSide.copy(railSide);
    const scale=monorail.object.scale.x;
    const articulated=monorail.carriages;
    if(articulated){
      for(const [carriage,offset] of [[articulated.front,.88],[articulated.rear,-.88]] as const){
        const sample=trainPosition+offset*scale/railLength,clamped=THREE.MathUtils.clamp(sample,0,1);
        railFrame(clamped);carriagePoint.copy(railNormal).multiplyScalar(railRadius+.055);
        if(sample!==clamped)carriagePoint.addScaledVector(railForward,(sample-clamped)*railLength).normalize().multiplyScalar(railRadius+.055);
        carriage.position.copy(carriagePoint).sub(monorail.object.position).applyQuaternion(trainInverse).divideScalar(scale);
        carriageQuaternion.setFromRotationMatrix(railMatrix);carriage.quaternion.copy(trainInverse).multiply(carriageQuaternion);
      }
      trainAnimation.turn=THREE.MathUtils.clamp(railForward.dot(trainSide)*-12,-1,1);
    }
    trainAnimation.motion=!reset;monorail.updateMotion?.(dt,trainAnimation);
    monorail.object.userData.station=chapters[selected];monorail.object.userData.progress=trainPosition;
    monorail.object.userData.travelling=travelDuration>0;monorail.object.userData.phase=travelDuration===0?'parked':travelTime<0?'departure':travelTime<travelDuration?'moving':'arrival';
  };
  const publishStation=(index:number)=>{if(selected!==index){selected=index;options.onStation?.(chapters[index]);}};
  const parkStation=(index:number,notify=true)=>{
    selected=index;trainPosition=index/(chapters.length-1);travelDuration=0;followTrain=false;
    trainAnimation.speed=0;trainAnimation.departure=0;trainAnimation.arrival=0;poseTrain(0,true);
    if(notify)options.onStation?.(chapters[index]);
  };
  const beginJourney=(index:number,accompany:boolean)=>{
    const target=index/(chapters.length-1),targetPan=(longitude[index]-THREE.MathUtils.degToRad(5))/rotationRange;
    viewChoosing=false;viewSettle=0;autoTurning=false;publishStation(index);
    if(reducedMotion||Math.abs(target-trainPosition)<.0001){
      parkStation(index,false);if(accompany)moveCamera(targetPan);return;
    }
    const alreadyMoving=travelDuration>0&&travelTime>=0&&travelTime<travelDuration;
    travelFrom=trainPosition;travelTo=target;travelTime=alreadyMoving?0:-departureDuration;
    travelDuration=Math.min(3.4,.9+Math.abs(target-trainPosition)*3.4);
    const currentRailAngle=longitude[0]+trainPosition*(longitude[5]-longitude[0]);
    travelCameraFrom=panCurrent;travelCameraTo=targetPan+Math.round(panCurrent-(currentRailAngle-THREE.MathUtils.degToRad(5))/rotationRange);
    followTrain=accompany;poseTrain();
  };
  const chooseCenteredStation=(points:Projection[])=>{
    let nearest=-1,best=Infinity;
    points.forEach((point,index)=>{if(!point.visible)return;const score=Math.abs(point.x-viewFocusX);if(score<best){nearest=index;best=score;}});
    if(nearest<0)return;
    const current=points[selected],margin=compact?12:18;
    if(nearest!==selected&&(!current?.visible||best+margin<Math.abs(current.x-viewFocusX))){publishStation(nearest);viewSettle=0;if(autoTurning)beginJourney(nearest,false);}
    if(reducedMotion){parkStation(selected,false);viewChoosing=false;}
  };
  const tick=(time:number)=>{
    frame=0;if(!animateAllowed())return;
    const dt=previous?Math.min((time-previous)/1000,.045):0;previous=time;elapsed+=dt;
    if(!drag&&Math.abs(panVelocity)>.0001){
      panTarget+=panVelocity*dt;panVelocity*=Math.exp(-dt*5.5);panPosition=normalizePan(panTarget);
      if(time-lastPanNotice>40){options.onPan?.(panPosition);lastPanNotice=time;}
      if(Math.abs(panVelocity)<.0008){panVelocity=0;options.onPan?.(panPosition);}
    }
    compressionVelocity+=(-compression*150-compressionVelocity*16)*dt;
    compression=THREE.MathUtils.clamp(compression+compressionVelocity*dt,-.012,.045);
    if(Math.abs(compression)<.00001&&Math.abs(compressionVelocity)<.0001){compression=0;compressionVelocity=0;}
    if(!hovered&&!drag)pointerCurrent.lerp(pointerTarget,1-Math.exp(-dt*2.8));
    if(viewChoosing&&!drag&&Math.abs(panVelocity)<.016&&Math.abs(panTarget-panCurrent)<.006){
      viewSettle+=dt;if(viewSettle>=.3)beginJourney(selected,false);
    }else if(viewChoosing)viewSettle=0;
    const lastTrainPosition=trainPosition;
    trainAnimation.departure=0;trainAnimation.arrival=0;
    if(travelDuration>0){
      travelTime=Math.min(travelTime+dt,travelDuration+arrivalDuration);
      const t=THREE.MathUtils.clamp(travelTime/travelDuration,0,1),eased=t*t*t*(t*(t*6-15)+10);
      trainPosition=THREE.MathUtils.lerp(travelFrom,travelTo,eased);
      trainAnimation.departure=travelTime<0?(travelTime+departureDuration)/departureDuration:0;
      trainAnimation.arrival=travelTime>=travelDuration?(travelTime-travelDuration)/arrivalDuration:0;
      if(followTrain){panCurrent=THREE.MathUtils.lerp(travelCameraFrom,travelCameraTo,eased);panTarget=panCurrent;panPosition=normalizePan(panCurrent);if(time-lastPanNotice>40){options.onPan?.(panPosition);lastPanNotice=time;}}
      if(travelTime>=travelDuration+arrivalDuration){trainPosition=travelTo;travelDuration=0;trainAnimation.arrival=0;if(followTrain)options.onPan?.(panPosition);followTrain=false;}
    }
    trainAnimation.speed=dt?Math.min(1,Math.abs(trainPosition-lastTrainPosition)/dt*7):0;
    const interacting=!!drag||pointerOverGlobe||hoverHoldsView||viewChoosing||travelDuration>0||Math.abs(panVelocity)>.0001||!!document.documentElement.dataset.storyTravel;
    autoTurning=false;
    const cursorCanTurn=pointerInView&&!drag&&!pinching&&!hoverHoldsView&&!followTrain&&!viewChoosing&&Math.abs(panVelocity)<.0001&&!document.documentElement.dataset.storyTravel;
    const edge=Math.max(0,(Math.abs(pointerTarget.x)-.18)/.82);
    const desiredTurn=cursorCanTurn?Math.sign(pointerTarget.x)*Math.pow(Math.min(1,edge),1.5)*.07:0;
    cursorTurnSpeed=cursorCanTurn?THREE.MathUtils.lerp(cursorTurnSpeed,desiredTurn,1-Math.exp(-dt*3.8)):0;
    if(Math.abs(cursorTurnSpeed)>.0001){
      autoTurning=true;idleTime=0;panCurrent+=dt*cursorTurnSpeed;panTarget=panCurrent;panPosition=normalizePan(panCurrent);
      if(time-lastPanNotice>150){options.onPan?.(panPosition);lastPanNotice=time;}
    }
    if(interacting||pointerInView)idleTime=0;
    else {
      idleTime+=dt;
      const speed=THREE.MathUtils.smoothstep(idleTime,.8,2.8)*.004;
      if(speed>0){
        autoTurning=true;panCurrent+=dt*speed;panTarget=panCurrent;panPosition=normalizePan(panCurrent);
        if(time-lastPanNotice>250){options.onPan?.(panPosition);lastPanNotice=time;}
      }
    }
    ambient.update(dt,interacting);
    if(tapTime<.65){tapTime+=dt;const t=Math.min(1,tapTime/.65);tapRing.visible=t<1;tapRing.scale.setScalar(.12+(1-Math.pow(1-t,3))*.95);tapMaterial.opacity=(1-t)*.55;}
    if(!followTrain)panCurrent=THREE.MathUtils.lerp(panCurrent,panTarget,1-Math.exp(-dt*4.2));
    updateGlobe();poseTrain(dt);
    places.forEach((place,index)=>{
      const pressed=drag&&!drag.active&&drag.startSlug===chapters[index];const target=pressed?-.7:chapters[index]===hovered?1:0;hoverVelocity[index]+=(target-hoverValue[index])*95*dt;hoverVelocity[index]*=Math.exp(-dt*15);hoverValue[index]+=hoverVelocity[index]*dt;
      place.scale.setScalar(placeScale*(1+hoverValue[index]*.07));
      (halos[index].material as THREE.MeshBasicMaterial).opacity=pressed?.4:Math.max(0,hoverValue[index])*.32;
    });
    const workshopTarget=drag&&!drag.active&&drag.startSlug==='open-source'?.93:hovered==='open-source'?1.08:1;
    workshop.scale.setScalar(THREE.MathUtils.lerp(workshop.scale.x,workshopTarget,1-Math.exp(-dt*12)));
    floating.forEach((object,index)=>object.position.y=floatBases[index]+Math.sin(elapsed*.8+index)*.035);
    clouds.forEach((cloud,index)=>cloud.position.copy(cloud.userData.normal).multiplyScalar(radius+1.15+Math.sin(elapsed*.35+index)*.045));
    draw();frame=requestAnimationFrame(tick);
  };
  const wake=()=>{if(animateAllowed()&&!frame){previous=0;frame=requestAnimationFrame(tick);}else if(!animateAllowed()&&frame){cancelAnimationFrame(frame);frame=0;previous=0;}};
  const setHover=(slug:string|null,freezeCamera=true)=>{
    const index=slug?chapters.indexOf(slug):-1;hovered=index>=0||slug==='open-source'?slug:null;hoverHoldsView=!!hovered&&freezeCamera;
    if(index>=0||slug==='open-source'){pointerTarget.copy(pointerCurrent);if(freezeCamera||Math.abs(panVelocity)>.0001){panVelocity=0;followTrain=false;panTarget=panCurrent;panPosition=normalizePan(panCurrent);options.onPan?.(panPosition);}}
    if(!motion){workshop.scale.setScalar(slug==='open-source'?1.08:1);places.forEach((place,i)=>{hoverValue[i]=i===index?1:0;hoverVelocity[i]=0;place.scale.setScalar(placeScale*(i===index?1.07:1));(halos[i].material as THREE.MeshBasicMaterial).opacity=i===index?.32:0;});updateGlobe();poseTrain();draw();}wake();
  };
  const moveCamera=(value:number,notify=true)=>{
    if(disposed)return;panVelocity=0;panPosition=normalizePan(value);followTrain=false;
    const current=normalizePan(panCurrent);let delta=panPosition-current;if(delta>.5)delta-=1;if(delta<-.5)delta+=1;panTarget=panCurrent+delta;
    if(!motion){panCurrent=panTarget;updateGlobe();poseTrain();draw();}if(notify)options.onPan?.(panPosition);wake();
  };
  const setPan=(value:number)=>{viewChoosing=true;viewSettle=0;moveCamera(value);};
  const restoreStation=(slug:string)=>{
    const index=chapters.indexOf(slug);if(index<0||disposed)return;viewChoosing=false;viewSettle=0;autoTurning=false;idleTime=-3;parkStation(index);draw();wake();
  };
  const select=(slug:string)=>{
    const index=chapters.indexOf(slug);if(index<0||disposed)return;
    panVelocity=0;pointerTarget.copy(pointerCurrent);beginJourney(index,true);setHover(slug,false);draw();wake();
  };
  const step=(direction:-1|1)=>{const next=THREE.MathUtils.clamp(selected+direction,0,chapters.length-1);if(next!==selected)select(chapters[next]);};
  // Retain the old method for modules already loaded during local HMR.
  const boost=()=>step(1);
  const resize=()=>{
    const canvasWidth=canvas.clientWidth,canvasHeight=canvas.clientHeight;if(canvasWidth<1||canvasHeight<1||disposed)return;
    width=canvasWidth;height=canvasHeight;compact=width<700;placeScale=compact?.83:.64;
    // Zoom gets real vertical room in the page instead of clipping at the HUD.
    const baseHeight=height/Math.max(1,camera.zoom);
    const diameter=compact?Math.min(width*.8,baseHeight*.74):Math.min(width*.68,baseHeight*.78);
    const pixelsPerUnit=diameter/(radius*2);viewWidth=width/pixelsPerUnit;viewHeight=height/pixelsPerUnit;
    camera.left=-viewWidth/2;camera.right=viewWidth/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
    camera.position.set(0,0,30);camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    const centerX=width*.5,centerY=height*.47;
    viewFocusX=(Math.max(0,centerX-diameter/2)+Math.min(width,centerX+diameter/2))/2;
    planet.position.set((centerX-width/2)/pixelsPerUnit,(height/2-centerY)/pixelsPerUnit,0);
    ambient.object.position.copy(planet.position);
    sunlight.position.copy(planet.position).add(new THREE.Vector3(-14,20,24));sunlight.target.position.copy(planet.position);sunlight.target.updateMatrixWorld();
    places.forEach(place=>place.scale.setScalar(placeScale));
    monorail.object.scale.setScalar(compact?.54:.52);updateGlobe();poseTrain();
    const ratio=Math.min(window.devicePixelRatio||1,1.6);
    if(renderer.getPixelRatio()!==ratio)renderer.setPixelRatio(ratio);
    if(canvas.width!==Math.floor(width*ratio)||canvas.height!==Math.floor(height*ratio))renderer.setSize(width,height,false);
    draw();wake();
  };
  let zoomTarget=1,zoomFrame=0,zoomPrevious=0,pinching=false,pinchDistance=0,pinchZoom=1,suppressClickUntil=0;
  const applyZoom=(value:number)=>{camera.zoom=value;(stage as HTMLElement).style.setProperty('--world-zoom-space',String(Math.max(1,value)));resize();};
  const zoomTick=(time:number)=>{
    zoomFrame=0;if(disposed||failed)return;
    const dt=zoomPrevious?Math.min(.05,(time-zoomPrevious)/1000):1/60;zoomPrevious=time;
    const next=THREE.MathUtils.lerp(camera.zoom,zoomTarget,1-Math.exp(-dt*14));
    if(Math.abs(next-zoomTarget)<.001){applyZoom(zoomTarget);zoomPrevious=0;return;}
    applyZoom(next);zoomFrame=requestAnimationFrame(zoomTick);
  };
  const setZoom=(value:number)=>{
    zoomTarget=THREE.MathUtils.clamp(value,.8,1.35);idleTime=0;
    if(reducedMotion){applyZoom(zoomTarget);return;}
    if(!zoomFrame)zoomFrame=requestAnimationFrame(zoomTick);
  };
  const zoom=(delta:number)=>setZoom(zoomTarget+delta);
  const distance=(touches:TouchList)=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  const onTouchStart=(event:TouchEvent)=>{
    if(event.touches.length<2)return;event.preventDefault();pinching=true;suppressClickUntil=Infinity;pinchDistance=distance(event.touches);pinchZoom=zoomTarget;
    if(drag)drag.cancelled=true;panVelocity=0;setHover(null);options.onHover?.(null);
  };
  const onTouchMove=(event:TouchEvent)=>{
    if(!pinching||event.touches.length<2)return;event.preventDefault();
    setZoom(pinchZoom*distance(event.touches)/Math.max(1,pinchDistance));
  };
  const onTouchEnd=()=>{if(pinching)suppressClickUntil=performance.now()+400;pinching=false;drag=undefined;};
  const suppressPinchClick=(event:Event)=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}};
  const onGesture=(event:Event)=>event.preventDefault();
  const pointerRay=(event:MouseEvent)=>{
    const bounds=canvas.getBoundingClientRect();pointer.set((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2);raycaster.setFromCamera(pointer,camera);
  };
  const intersectGlobe=()=>{
    localRay.copy(raycaster.ray).applyMatrix4(planetInverse);
    const hit=localRay.intersectSphere(globeSphere,rayPoint);
    return hit?rayPoint.applyMatrix4(planet.matrixWorld):null;
  };
  const hitProject=(event:MouseEvent)=>{
    pointerRay(event);
    const globeHit=intersectGlobe();const globeDistance=globeHit?raycaster.ray.origin.distanceTo(globeHit):Infinity;
    return raycaster.intersectObjects([...hitVolumes,workshopHit],false).find(hit=>{
      const index=chapters.indexOf(hit.object.userData.slug);return (index<0?workshopVisible:visibleProjects[index])&&hit.distance<globeDistance+.08;
    })?.object.userData.slug as string|undefined;
  };
  const onPointerDown=(event:PointerEvent)=>{
    if(event.button!==0||pinching)return;
    const target=event.target as Element;if(target!==canvas&&!target.closest('[data-quest-select], [data-workshop-label]'))return;
    panVelocity=0;followTrain=false;panTarget=panCurrent;panPosition=normalizePan(panCurrent);pointerTarget.copy(pointerCurrent);options.onPan?.(panPosition);
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,pan:panPosition,lastX:event.clientX,lastTime:event.timeStamp,velocity:0,startSlug:hitProject(event),active:false,cancelled:false};
  };
  const onPointerMove=(event:PointerEvent)=>{
    if(pinching)return;
    const bounds=canvas.getBoundingClientRect();
    if(drag&&drag.id===event.pointerId){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.active&&!drag.cancelled&&Math.max(Math.abs(dx),Math.abs(dy))>7){if(Math.abs(dx)>Math.abs(dy)*1.15){drag.active=true;canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';setHover(null);options.onHover?.(null);}else drag.cancelled=true;}
      if(drag.active){
        event.preventDefault();const duration=Math.max(8,event.timeStamp-drag.lastTime)/1000;
        const velocity=THREE.MathUtils.clamp(-(event.clientX-drag.lastX)/width*.9/duration,-.8,.8);
        drag.velocity=THREE.MathUtils.lerp(drag.velocity,velocity,.45);drag.lastX=event.clientX;drag.lastTime=event.timeStamp;
        setPan(drag.pan-dx/width*.9);return;
      }if(drag.cancelled)return;
    }
    if(event.pointerType!=='mouse'||event.target!==canvas)return;
    const slug=hitProject(event)??null;pointerOverGlobe=!!intersectGlobe();canvas.style.cursor=slug?'pointer':'grab';
    if(slug!==hovered){setHover(slug);options.onHover?.(slug);}wake();
  };
  const finishPointer=(event:PointerEvent)=>{
    if(drag?.id!==event.pointerId)return;
    const current=drag,wasCancelled=event.type==='pointercancel'||current.cancelled;
    const moved=Math.hypot(event.clientX-current.x,event.clientY-current.y)>7;
    if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    drag=undefined;canvas.style.cursor='grab';
    if(current.active){suppressClickUntil=performance.now()+400;panVelocity=motion&&!wasCancelled&&event.timeStamp-current.lastTime<120?current.velocity:0;wake();return;}
    const bounds=canvas.getBoundingClientRect();
    if(wasCancelled||moved||event.target!==canvas||event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)return;
    const slug=hitProject(event);if(slug!==current.startSlug)return;
    if(slug)options.onSelect?.(slug,event);
    else if(motion){
      compressionVelocity=.65;pointerRay(event);const hit=intersectGlobe();
      if(hit){const n=planet.worldToLocal(hit.clone()).normalize();tapRing.position.copy(n).multiplyScalar(radius+.04);tapRing.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);tapTime=0;tapRing.visible=true;}
      wake();
    }
  };
  // Scene hover ends at its boundary, but camera steering spans the viewport.
  const onPointerLeave=()=>{pointerOverGlobe=false;if(drag?.active)return;setHover(null);options.onHover?.(null);canvas.style.cursor='grab';};
  const onViewportPointer=(event:PointerEvent)=>{
    if(event.pointerType!=='mouse'||drag||pinching||document.querySelector('dialog[open]'))return;
    const bounds=canvas.getBoundingClientRect();
    if(bounds.bottom<=0||bounds.top>=innerHeight)return;
    pointerInView=true;
    if(!hoverHoldsView)pointerTarget.set(THREE.MathUtils.clamp(event.clientX/innerWidth*2-1,-1,1),THREE.MathUtils.clamp(event.clientY/innerHeight*2-1,-1,1));
    wake();
  };
  const leaveViewport=()=>{pointerInView=false;cursorTurnSpeed=0;pointerTarget.set(0,0);onPointerLeave();wake();};
  // Pointer release is the sole activation path. Native compatibility clicks
  // must never reopen a story, or turn the end of a drag into an empty tap.
  const onClick=(event:MouseEvent)=>{event.preventDefault();};
  const onWheel=(event:WheelEvent)=>{if(event.ctrlKey){event.preventDefault();setZoom(zoomTarget*Math.exp(-event.deltaY*.008));return;}if(Math.abs(event.deltaX)<=Math.abs(event.deltaY)||Math.abs(event.deltaX)<1)return;event.preventDefault();setPan(panPosition+event.deltaX/width*.9);};
  const onContextLost=(event:Event)=>{event.preventDefault();failed=true;wake();options.onError?.();};
  const onVisibility=()=>{if(document.hidden)leaveViewport();else wake();};
  canvas.style.touchAction='pan-y';canvas.style.cursor='grab';
  stage.addEventListener('pointerdown',onPointerDown as EventListener);stage.addEventListener('pointermove',onPointerMove as EventListener);window.addEventListener('pointerup',finishPointer);window.addEventListener('pointercancel',finishPointer);stage.addEventListener('pointerleave',onPointerLeave);canvas.addEventListener('click',onClick);stage.addEventListener('wheel',onWheel as EventListener,{passive:false});stage.addEventListener('touchstart',onTouchStart as EventListener,{passive:false});stage.addEventListener('touchmove',onTouchMove as EventListener,{passive:false});stage.addEventListener('click',suppressPinchClick,true);stage.addEventListener('touchend',onTouchEnd);stage.addEventListener('touchcancel',onTouchEnd);stage.addEventListener('gesturestart',onGesture,{passive:false});stage.addEventListener('gesturechange',onGesture,{passive:false});canvas.addEventListener('webglcontextlost',onContextLost);document.addEventListener('visibilitychange',onVisibility);
  document.addEventListener('pointermove',onViewportPointer);document.documentElement.addEventListener('pointerleave',leaveViewport);window.addEventListener('blur',leaveViewport);
  // Tint the illumination and globe surface, preserving the objects' shading.
  // Observe tokens so custom themes, persisted themes and Reset all use one path.
  let themeBackground = '';
  const syncTheme = () => {
    const background = getComputedStyle(canvas).getPropertyValue('--theme-bg').trim() || '#ffffff';
    if (background === themeBackground) return;
    themeBackground = background;
    const base = new THREE.Color(background);
    const tint = base.clone().lerp(new THREE.Color('#ffffff'), .45);
    const surfaceTint = base.clone().lerp(new THREE.Color('#ffffff'), .18);
    surfaceMaterial.color.copy(surfaceTint);
    surfaceMaterial.emissive.copy(surfaceTint);
    sky.color.copy(tint);
    sunlight.color.copy(tint);
    fill.color.copy(tint);
    if (ready) draw();
  };
  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme', 'class'] });
  syncTheme();
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)draw();wake();},{rootMargin:'100px'});visibilityObserver.observe(canvas);
  resize();options.onPan?.(panPosition);options.onStation?.(chapters[selected]);
  return{
    select,hover:setHover,pan(delta){setPan(panPosition+delta);},setPan,step,restoreStation,boost,zoom,
    setProgress(progress){chapters.forEach((slug,index)=>{flags[index].material=material((progress[slug]||0)>=100?'#333333':'#b7b7b7');});draw();},
    setMotion(enabled,immediate=false){
      motion=enabled;reducedMotion=immediate;
      if(!motion){
        autoTurning=false;panVelocity=0;
        if(immediate){
          compression=0;compressionVelocity=0;panCurrent=panTarget;pointerCurrent.set(0,0);idleTime=idleX=idleY=0;tapTime=1;tapRing.visible=false;ambient.reset();
          updateGlobe();project();parkStation(selected,false);
          workshop.scale.setScalar(1);
          floating.forEach((object,index)=>object.position.y=floatBases[index]);clouds.forEach(cloud=>cloud.position.copy(cloud.userData.normal).multiplyScalar(radius+1.15));
        }else{panTarget=panCurrent;panPosition=normalizePan(panCurrent);options.onPan?.(panPosition);}
        updateGlobe();poseTrain(0,immediate);draw();
      }
      wake();
    },
    dispose(){
      if(disposed)return;disposed=true;if(zoomFrame)cancelAnimationFrame(zoomFrame);if(frame)cancelAnimationFrame(frame);resizeObserver.disconnect();visibilityObserver.disconnect();themeObserver.disconnect();
      stage.removeEventListener('pointerdown',onPointerDown as EventListener);stage.removeEventListener('pointermove',onPointerMove as EventListener);window.removeEventListener('pointerup',finishPointer);window.removeEventListener('pointercancel',finishPointer);stage.removeEventListener('pointerleave',onPointerLeave);canvas.removeEventListener('click',onClick);stage.removeEventListener('wheel',onWheel as EventListener);stage.removeEventListener('touchstart',onTouchStart as EventListener);stage.removeEventListener('touchmove',onTouchMove as EventListener);stage.removeEventListener('click',suppressPinchClick,true);stage.removeEventListener('touchend',onTouchEnd);stage.removeEventListener('touchcancel',onTouchEnd);stage.removeEventListener('gesturestart',onGesture);stage.removeEventListener('gesturechange',onGesture);canvas.removeEventListener('webglcontextlost',onContextLost);document.removeEventListener('visibilitychange',onVisibility);
      document.removeEventListener('pointermove',onViewportPointer);document.documentElement.removeEventListener('pointerleave',leaveViewport);window.removeEventListener('blur',leaveViewport);
      canvas.style.cursor='';canvas.style.touchAction='';ambient.dispose();monorail.dispose();railSupports.dispose();treeTrunks.dispose();treeCrowns.dispose();rocks.dispose();geometries.forEach(geometry=>geometry.dispose());materials.forEach(value=>value.dispose());transientMaterials.forEach(value=>value.dispose());renderer.dispose();renderer.forceContextLoss();scene.clear();
    },
  };
}
