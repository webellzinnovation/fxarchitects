import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {lowPolyTree} from './trees.js';
// Original, illustrative landscape geometry. No downloaded assets or new portfolio claims.
export function installOutskirts(scene){
 const staticG=new THREE.Group();scene.add(staticG);
 const mat=(color)=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true});
 const white=mat(0xf3f2ed),roof=mat(0xd4d5ce),window=mat(0x657268),soil=mat(0x99866a),grass=mat(0x86a553),crop=mat(0x588e32),gold=mat(0xc5b266),road=mat(0xaba99d),wood=mat(0x846349),blue=mat(0x4e9cbd),skin=mat(0xad8060),shirt=mat(0x758276),black=mat(0x25292a),red=mat(0x89664f),cowWhite=mat(0xdedbd2);
 const cube=new THREE.BoxGeometry(1,1,1),sphere=new THREE.IcosahedronGeometry(1,1);
 function add(g,geo,m,x,y,z,sx,sy,sz){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 const box=(g,x,y,z,w,h,d,m=white)=>add(g,cube,m,x,y,z,w,h,d);
 const ball=(g,x,y,z,w,h,d,m)=>add(g,sphere,m,x,y,z,w,h,d);
 function line(g,a,b,width,m){const v=new THREE.Vector3().subVectors(b,a),o=add(g,new THREE.CylinderGeometry(width,width,1,5),m,0,0,0,1,v.length(),1);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o;}
 function batch(g){g.updateMatrixWorld(true);const inv=g.matrixWorld.clone().invert(),buckets=new Map(),old=[];g.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;let geo=o.geometry.clone().applyMatrix4(inv.clone().multiply(o.matrixWorld));if(geo.index)geo=geo.toNonIndexed();if(!geo.getAttribute('uv'))geo.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(geo.getAttribute('position').count*2),2));if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(geo);old.push(o)});old.forEach(o=>o.removeFromParent());for(const [m,geos]of buckets){const mesh=new THREE.Mesh(mergeGeometries(geos),m);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);geos.forEach(a=>a.dispose())}}
 function house(x,z,i){box(staticG,x,.58,z,1.65,1.2,1.5);const r=add(staticG,new THREE.CylinderGeometry(0,1,1,4),roof,x,1.52,z,1.42,.7,1.35);r.rotation.y=Math.PI/4;box(staticG,x,.45,z+.76,.32,.82,.035,window);for(const d of [-.5,.5])box(staticG,x+d,.82,z+.76,.3,.35,.035,window);box(staticG,x,.05,z+1.05,1.9,.1,.5,roof);box(staticG,x,.05,z,2.8,.03,2.8,soil);if(i%2===0)lowPolyTree(staticG,x+1.6,z-.5,1.25,i%3);}
 // Village: narrow lane, tiled/pitched clay roofs, low walls, well and shared banyan-like shade.
 box(staticG,-28,-.08,1,19,.05,19,grass);box(staticG,-28,-.03,2,1.1,.055,22,road);box(staticG,-23,-.03,6,11,.055,1.1,road);box(staticG,-20,-.03,0,8,.055,1.0,road);
 for(let i=0;i<12;i++)house(-28+(i%2?3.1:-3.1),-6+Math.floor(i/2)*3.4,i);
 for(let i=0;i<10;i++){box(staticG,-36+i*1.7,.28,11,1.55,.55,.12,white);lowPolyTree(staticG,-36+i*1.7,-10,1+(i%3)*.25,i%3);}
 const well=new THREE.Mesh(new THREE.TorusGeometry(.48,.12,6,16),white);well.rotation.x=Math.PI/2;well.position.set(-24,.6,2);staticG.add(well);for(const x of [-24.6,-23.4])box(staticG,x,.9,2,.08,1.7,.08,wood);box(staticG,-24,1.72,2,1.5,.16,1.2,roof);lowPolyTree(staticG,-22,3,2.6,0);
 // Farms extend beyond the village. Crop rows are merged once, not hundreds of draws.
 for(let f=0;f<6;f++){const x=-34+(f%3)*5.1,z=17+Math.floor(f/3)*5.5;box(staticG,x,-.1,z,4.7,.08,4.8,f%2?gold:soil);for(let row=0;row<9;row++){box(staticG,x-2+row*.5,-.03,z,.17,.04,4.4,crop);for(let n=0;n<9;n++)ball(staticG,x-2+row*.5,.1,z-2+n*.48,.13,.19,.16,f%2?gold:crop)}}
 box(staticG,-26,-.015,13,22,.045,.75,road);box(staticG,-20,-.015,20,.75,.045,14,road);box(staticG,-29,-.06,27,19,.08,.35,blue);
 // Northern edge is an added low-rise neighborhood rather than stretched existing plots.
 box(staticG,0,-.09,-30,78,.05,20,roof);
 const urban=[];for(let row=0;row<3;row++){const z=-27-row*5;box(staticG,0,-.03,z+1.8,77,.05,1.05,road);for(let col=0;col<21;col++){const x=-36+col*3.55;if(![-16,-4,3,16].some(roadX=>Math.abs(x-roadX)<2.4))urban.push({x,z});}}for(const x of [-38,-16,-4,3,16,38])box(staticG,x,-.025,-30,1.05,.05,21,road);
 for(let i=0;i<urban.length;i++){const {x,z}=urban[i],h=.7+(i%4)*.12,w=3.50;box(staticG,x,h/2,z,w,h,3.4);box(staticG,x,h+.075,z,w+.08,.15,3.5,roof);if(i%3===0){box(staticG,x-.4,h+.24,z-.25,1.05,.3,1.1);box(staticG,x-.4,h+.42,z-.25,1.22,.08,1.28,roof);}for(let k=0;k<3;k++)box(staticG,x-.65+k*.65,.53,z+1.71,.25,.3,.025,window);if(i%4===0)lowPolyTree(staticG,x+1.38,z+.9,1.25,i%3);}
 for(const x of [-16,-4,3,16])box(staticG,x,-.03,-23.5,1.05,.055,4,road);box(staticG,25,-.025,3,6,.055,1.1,road);box(staticG,26.5,-.025,3.5,1.1,.055,2,road);box(staticG,-25,-.03,3,6,.055,.7,road);box(staticG,-21,-.03,16,2,.055,.75,road);
 // Lake and fishing edge, kept outside railway and city plots.
 const lake=add(staticG,new THREE.CircleGeometry(1,48),blue,33,-.035,0,6,12,1);lake.rotation.x=-Math.PI/2;lake.castShadow=false;
 for(let i=0;i<30;i++){const a=i*Math.PI*2/30;ball(staticG,33+Math.cos(a)*6.1,0,Math.sin(a)*12.1,.45,.2,.55,soil);if(i%3===0)lowPolyTree(staticG,33+Math.cos(a)*7.5,Math.sin(a)*13.2,1.5,i%3);}
 box(staticG,27.5,.12,4,4,.18,1.2,wood);for(let n=0;n<8;n++)box(staticG,26+n*.44,.23,4,.36,.08,1.22,wood);for(const x of [26,29])for(const z of [3.5,4.5])box(staticG,x,0,z,.09,.8,.09,wood);
 function fisher(g,x,z){const p=new THREE.Group();p.position.set(x,.2,z);g.add(p);ball(p,0,.67,0,.1,.11,.1,skin);box(p,0,.43,0,.19,.32,.16,shirt);for(const a of [-.065,.065])box(p,a,.16,.03,.075,.25,.08,black);line(p,new THREE.Vector3(0,.49,0),new THREE.Vector3(.22,.55,.15),.025,skin);line(p,new THREE.Vector3(.2,.55,.15),new THREE.Vector3(.8,1.2,.6),.016,wood);line(p,new THREE.Vector3(.8,1.2,.6),new THREE.Vector3(.8,0,.6),.005,roof);batch(p);return p;}
 box(staticG,24,-.025,4,4,.055,1.1,road);fisher(staticG,28.4,4);
 const cattle=[];for(let i=0;i<7;i++){const g=new THREE.Group();g.position.set(-34+(i%4)*1.8,.02,10+(i>3?2:0));g.rotation.y=i*.8;scene.add(g);ball(g,0,.52,0,.47,.26,.22,cowWhite);ball(g,-.12,.61,.18,.14,.1,.035,black);for(const x of [-.28,.28])for(const z of [-.14,.14])box(g,x,.23,z,.06,.44,.07,black);line(g,new THREE.Vector3(-.4,.56,0),new THREE.Vector3(-.53,.26,0),.02,black);batch(g);const head=new THREE.Group();head.position.set(.4,.48,0);g.add(head);ball(head,.13,-.08,0,.19,.12,.14,cowWhite);ball(head,.26,-.11,0,.09,.08,.1,black);for(const z of [-.11,.11])line(head,new THREE.Vector3(.1,.04,z),new THREE.Vector3(.12,.16,z*1.35),.018,roof);batch(head);cattle.push({g,head});}
 const tractor=new THREE.Group();scene.add(tractor);box(tractor,0,.43,.15,.6,.44,1.1,red);box(tractor,0,.67,-.43,.68,.65,.52,white);box(tractor,0,1.04,-.42,.78,.09,.68,roof);box(tractor,0,.76,-.16,.5,.35,.02,window);box(tractor,.25,.94,.4,.06,.56,.07,black);for(const x of [-.38,.38])for(const z of [-.48,.55]){const o=add(tractor,new THREE.CylinderGeometry(1,1,1,10),black,x,z<0?.3:.2,z,z<0?.3:.2,.16,z<0?.3:.2);o.rotation.z=Math.PI/2;}box(tractor,0,.2,-1.35,.9,.18,.6,roof);batch(tractor);
 const route=new THREE.CatmullRomCurve3([new THREE.Vector3(-20,0,13),new THREE.Vector3(-20,0,26),new THREE.Vector3(-35,0,26),new THREE.Vector3(-35,0,13)],true,'catmullrom',.03);
 const boats=[];for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(31+i*1.1,.1,-5+i*4);scene.add(g);box(g,0,.05,0,.68,.12,1.65,wood);for(const x of [-.35,.35])box(g,x,.19,0,.08,.23,1.7,wood);for(const z of [-.87,.87])ball(g,0,.15,z,.35,.16,.27,wood);for(const z of [-.45,.3])box(g,0,.24,z,.7,.07,.16,roof);batch(g);fisher(g,0,.15);const paddle=box(g,.5,.32,0,.05,.05,1.4,wood);paddle.rotation.y=.5;boats.push(g);}
 batch(staticG);
 function update(time){for(let i=0;i<cattle.length;i++){cattle[i].head.rotation.z=-.3+Math.sin(time*.35+i)*.2;}const t=(time*.004)%1,p=route.getPointAt(t),v=route.getTangentAt(t);tractor.position.copy(p);tractor.rotation.y=Math.atan2(v.x,v.z);for(let i=0;i<boats.length;i++){boats[i].position.y=.12+Math.sin(time*.8+i)*.035;boats[i].rotation.z=Math.sin(time*.5+i)*.025;boats[i].rotation.y=.3+Math.sin(time*.06+i)*.15;}}
 update(0);return {update,cattle,tractor,boats,staticG,stats:{villageHouses:12,outerBuildings:urban.length,fields:6,cattle:7,boats:3,tractor:1}};
}
