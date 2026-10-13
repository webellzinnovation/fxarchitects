import * as THREE from 'three';
const green=[0x64a82f,0x83b936,0x438827,0x9acb49].map(color=>new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true}));const bark=new THREE.MeshStandardMaterial({color:0x795035,roughness:1});const grass=new THREE.MeshStandardMaterial({color:0x60963a,roughness:1});const border=new THREE.MeshStandardMaterial({color:0x927e62,roughness:1});const canopy=new THREE.IcosahedronGeometry(1,0),cone=new THREE.ConeGeometry(1,1,7),trunk=new THREE.CylinderGeometry(.045,.08,1,6);
export function lowPolyTree(parent,x,z,size=1,kind=0,accent=false){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);const add=(geo,mat,px,py,pz,sx,sy,sz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;g.add(m);return m};const s=size;if(accent){add(new THREE.BoxGeometry(1,1,1),border,0,.025,0,s*1.05,.05,s*.95);add(new THREE.BoxGeometry(1,1,1),grass,0,.055,0,s,.02,s*.9);}
 if(kind===3){for(let i=0;i<3;i++)add(canopy,green[i%4],(i-1)*s*.15,s*.2,0,s*.25,s*.25,s*.25);return g;}
 add(trunk,bark,0,s*.45,0,s,s*.9,s);
 if(kind===2){for(let i=0;i<3;i++)add(cone,green[(i+2)%4],0,s*(.65+i*.28),0,s*(.47-i*.11),s*.65,s*(.47-i*.11));}
 else if(kind===1){for(let i=0;i<5;i++)add(canopy,green[i%4],Math.sin(i*2)*s*.14,s*(.77+i*.16),Math.cos(i*2)*s*.1,s*.32,s*.35,s*.32);}
 else{for(let i=0;i<7;i++){const a=i*Math.PI*2/6,r=i===6?0:s*.26;add(canopy,green[i%4],Math.cos(a)*r,s*(i===6?1.12:.88+(i%2)*.13),Math.sin(a)*r,s*.36,s*.28,s*.35);}for(let i=0;i<3;i++){const a=i*2.1,b=add(trunk,bark,Math.cos(a)*s*.12,s*.66,Math.sin(a)*s*.12,s*.7,s*.4,s*.7);b.rotation.z=.65;b.rotation.y=a;}}
 return g;
}
