import * as THREE from 'three';
// Conservative world-space placement audit. Whole crowns, not just trunks.
export function installPlacement(city){
 const V=THREE.Vector3,boxes=[],grid=new Map(),cell=2,M=new THREE.Matrix4(),B=new THREE.Box3();city.scene.updateMatrixWorld(true);
 for(const g of [...city.contextGroups.values(),...city.buildings.map(b=>b.g),city.outskirts.staticG]){if(!g.visible)continue;g.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const a=o.geometry.attributes.position,idx=o.geometry.index;for(let i=0;i<(idx?.count||a.count);i+=3){B.makeEmpty();for(let j=0;j<3;j++)B.expandByPoint(new V().fromBufferAttribute(a,idx?idx.getX(i+j):i+j).applyMatrix4(o.matrixWorld));if(B.max.y<.15||B.min.y>2)continue;boxes.push({minX:B.min.x,maxX:B.max.x,minZ:B.min.z,maxZ:B.max.z});}});}
 boxes.forEach(b=>{for(let x=Math.floor(b.minX/cell);x<=Math.floor(b.maxX/cell);x++)for(let z=Math.floor(b.minZ/cell);z<=Math.floor(b.maxZ/cell);z++){const k=x+','+z;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(b)}});
 const occupied=(x,z,r=.07)=>{for(let i=Math.floor((x-r)/cell);i<=Math.floor((x+r)/cell);i++)for(let j=Math.floor((z-r)/cell);j<=Math.floor((z+r)/cell);j++)if((grid.get(i+','+j)||[]).some(b=>x+r>b.minX&&x-r<b.maxX&&z+r>b.minZ&&z-r<b.maxZ))return true;return false;};
 const segments=[];function path(c,w,kind){const ps=c.getSpacedPoints(650);for(let i=1;i<ps.length;i++)segments.push({a:ps[i-1],b:ps[i],w,kind});}
 city.masterplan.roads.forEach(r=>path(r.curve,r.width/2+.42,'road-and-walkway'));path(city.rail.metroCurve,1.1,'metro');path(city.rail.curve,.7,'steam');
 function line(x,z,X,Z,w){segments.push({a:new V(x,0,z),b:new V(X,0,Z),w,kind:'outskirts-walkway'});}
 line(-28,-9,-28,13,.85);line(-28.5,6,-17.5,6,.85);line(-24,0,-16,0,.8);line(-37,13,-15,13,.65);line(-20,13,-20,27,.65);
 for(let row=0;row<3;row++)line(-38.5,-25.2-row*5,38.5,-25.2-row*5,.8);for(const x of[-38,-16,-4,3,16,38])line(x,-40.5,x,-19.5,.8);line(22,4,29.5,4,.8);line(22,3,28,3,.8);
 for(const x of[-10,11])line(x,22,x,31,1.15);
 const distance=(x,z,s)=>{const dx=s.b.x-s.a.x,dz=s.b.z-s.a.z,t=THREE.MathUtils.clamp(((x-s.a.x)*dx+(z-s.a.z)*dz)/(dx*dx+dz*dz),0,1);return Math.hypot(x-s.a.x-t*dx,z-s.a.z-t*dz);};
 const clear=(x,z,r)=>!segments.some(s=>distance(x,z,s)<s.w+r+.06);
 const safeFurniture=(x,z,r=.12)=>!occupied(x,z,r)&&!segments.some(s=>distance(x,z,s)<(s.kind==='road-and-walkway'?s.w-.30:s.w)+r);
 const stats={treesBefore:0,treesRetained:0,treesRemoved:0,furnitureRemoved:0};
 city.scene.traverse(o=>{if(o.isInstancedMesh&&o.userData.licensedTree){const keep=[];o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){stats.treesBefore++;o.getMatrixAt(i,M);const world=o.matrixWorld.clone().multiply(M);B.copy(o.geometry.boundingBox).applyMatrix4(world);const x=(B.min.x+B.max.x)/2,z=(B.min.z+B.max.z)/2,r=Math.hypot(B.max.x-B.min.x,B.max.z-B.min.z)/2;const safe=clear(x,z,r)&&!occupied(x,z,r);if(safe)keep.push(M.clone());else stats.treesRemoved++;}keep.forEach((m,i)=>o.setMatrixAt(i,m));o.count=keep.length;stats.treesRetained+=keep.length;o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();}});
 const remove=[];city.scene.traverse(o=>{if(o.userData.curbFurniture){B.setFromObject(o);const p=B.getCenter(new V());if(!safeFurniture(p.x,p.z,.10))remove.push(o);}});const networks=new Set();for(const o of remove){let a=o.parent;while(a){if(a.userData.utilityNetwork)networks.add(a);a=a.parent;}}remove.forEach(o=>o.removeFromParent());networks.forEach(o=>o.removeFromParent());stats.furnitureRemoved=remove.length;
 const previous=city.placement?.stats;stats.treesRemoved+=(previous?.treesRemoved||0);stats.furnitureRemoved+=(previous?.furnitureRemoved||0);stats.treesBefore=stats.treesRetained+stats.treesRemoved;return{occupied,clear,safeFurniture,stats};
}
