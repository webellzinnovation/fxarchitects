import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {lowPolyTree} from './trees.js';
export function stageVilla(model){
 const g=new THREE.Group();g.add(model);
 model.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){const name=m.name.toLowerCase();if(name.includes('cream mineral')){m.map=null;m.color.set('#555b65');m.roughness=.84;}if(name.includes('clear glazing')){m.map=null;m.color.set('#d6ab70');m.transmission=0;m.transparent=true;m.opacity=.32;m.emissive.set('#ef9c44');m.emissiveIntensity=.6;m.depthWrite=false;}if(name.includes('slate')){m.color.set('#454951');m.roughness=.9;}}});
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.86});const dark=mat('#333940'),stone=mat('#697073'),wood=mat('#99755c'),leaves=mat('#344c35'),trunk=mat('#70513a'),fabric=mat('#c1a68a');
 const cube=(x,y,z,w,h,d,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh};
 cube(0,-.1,0,4.2,.2,4.1,dark);cube(0,.014,1.78,1.1,.03,.52,stone);
 for(let i=0;i<4;i++)cube(0,.025+i*.035,1.6-i*.1,.9,.05,.16,stone);
 for(const [i,x,z]of [[0,-1.75,-1.5],[1,1.7,-1.5],[2,-1.8,.8],[0,1.8,.6]])lowPolyTree(g,x,z,.65,i);
 for(let i=0;i<12;i++){const x=-1.85+(i%6)*.73,z=i<6?1.9:-1.85;lowPolyTree(g,x,z,.45,3);}
 const glow=new THREE.MeshStandardMaterial({color:'#f7c887',emissive:'#ffbb65',emissiveIntensity:2});for(const [x,z]of [[-1.6,1.6],[1.6,1.6],[-1.6,-1.6],[1.6,-1.6]]){cube(x,.075,z,.07,.15,.07,dark);cube(x,.16,z,.08,.025,.08,glow);}
 // Simple stage props, not original source furnishings or an actual architect's interior.
 cube(.75,.13,.65,.65,.14,.25,fabric);cube(.75,.26,.75,.65,.16,.06,fabric);cube(.75,.12,.25,.35,.04,.25,wood);
 g.updateMatrixWorld(true);const buckets=new Map(),old=[];g.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;let geo=o.geometry.clone().applyMatrix4(o.matrixWorld);if(geo.index)geo=geo.toNonIndexed();for(const key of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(key))geo.deleteAttribute(key);if(!geo.getAttribute('uv'))geo.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(geo.getAttribute('position').count*2),2));if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(geo);old.push(o);});old.forEach(o=>o.removeFromParent());for(const [mat,geos]of buckets){const mesh=new THREE.Mesh(mergeGeometries(geos),mat);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);geos.forEach(geo=>geo.dispose());}g.userData.stagedVilla=true;return g;
}
export function eveningViewer(v){v.scene.background=new THREE.Color('#d0d2d2');v.scene.traverse(o=>{if(o.isHemisphereLight)o.intensity=1.8;if(o.isDirectionalLight){o.intensity=2.0;o.color.set('#eee1c8')}});v.renderer.toneMappingExposure=1.25;const light=new THREE.PointLight('#ffb25d',7,7,2);light.position.set(0,1,.4);v.scene.add(light);v.camera.position.set(6,4.2,6);v.controls.target.set(0,.8,0);v.controls.update();}
