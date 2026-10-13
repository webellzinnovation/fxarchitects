import * as THREE from 'three';
// Radial urban skeleton interpreted from the supplied aerial, not a geographic survey.
export function masterplan(){
 const angles=[-.18,.30,.82,1.31,1.86,2.34,2.87,3.40,3.94,4.46,4.99,5.54],radii=[8,22,38,56];
 const V=(r,a)=>{const q=r*(1+.11*Math.sin(a*3+.5)+.06*Math.cos(a*2));return new THREE.Vector3(q*Math.cos(a),0,q*Math.sin(a));};
 const line=points=>{const c=new THREE.Curve();c.getPoint=(t,out=new THREE.Vector3())=>{const n=Math.min(points.length-1-1e-8,t*(points.length-1)),i=Math.floor(n);return out.copy(points[i]).lerp(points[i+1],n-i);};c.userData={segments:points.length-1};return c};
 const river=new THREE.CatmullRomCurve3([[-48,-8],[-32,-12],[-17,-7],[-2,4],[13,8],[29,4],[48,13]].map(([x,z])=>new THREE.Vector3(x,0,z)));
 const riverSamples=river.getPoints(160),riverDistance=(x,z)=>Math.min(...riverSamples.map(p=>Math.hypot(p.x-x,p.z-z)));
 const roads=[],junctions=[],plots=[];
 for(let j=0;j<12;j++){const a=angles[j];roads.push({curve:line(radii.concat(68).map(r=>V(r,a))),width:j%3===0?2.5:1.8,arterial:true});for(const r of[22,38,56])if(j%3===0)junctions.push(V(r,a));}
 for(const r of radii){const ps=angles.map(a=>V(r,a));ps.push(ps[0]);roads.push({curve:line(ps),width:r===8?2.1:r===56?2.2:1.25,ring:r});}
 // Local lanes divide wedges into small, non-grid parcels; outer fabric is visibly looser.
 for(let band=0;band<3;band++)for(let sector=0;sector<12;sector++){
  const a0=angles[sector],a1=angles[(sector+1)%12]+(sector===11?Math.PI*2:0),rm=(radii[band]+radii[band+1])/2;
  const divisions=band===0?1:band===1?2:3;
  const boundary=(r,a)=>V(r,a0).lerp(V(r,a1),(a-a0)/(a1-a0));
  for(let k=0;k<divisions;k++){
   const l=a0+(a1-a0)*k/divisions+.028,h=a0+(a1-a0)*(k+1)/divisions-.028;
   if(k>0)roads.push({curve:line([boundary(radii[band],l-.028),boundary(radii[band+1],l-.028)]),width:.62});
   for(let half=0;half<1;half++){
    const lo=(half===0?radii[band]:rm)+1.2,hi=radii[band+1]-1.5;
    const edge=(r,a)=>V(r,a0).lerp(V(r,a1),(a-a0)/(a1-a0));let poly=[edge(lo,l),edge(hi,l),edge(hi,h),edge(lo,h)];const center=poly.reduce((s,p)=>s.add(p),new THREE.Vector3()).multiplyScalar(.25);
    poly=poly.map(p=>p.clone().lerp(center,.18));if(riverDistance(center.x,center.z)<4.7||poly.some(p=>riverDistance(p.x,p.z)<2.7))continue;
    const width=poly[0].distanceTo(poly[1]),depth=(poly[0].distanceTo(poly[3])+poly[1].distanceTo(poly[2]))/2;
    plots.push({id:`radial-${band}-${sector}-${k}-${half}`,x:center.x,z:center.z,polygon:poly.map(p=>[p.x,p.z]),band,sector,width,depth,type:band===2?'roadside':sector%2===0?'corner':'center-block',occupied:false});
   }
  }
 }
 const samples=roads.flatMap(r=>r.curve.getPoints(300).map(p=>({p,w:r.width/2+.25})));for(const plot of plots){const radius=Math.min(...samples.map(({p,w})=>Math.hypot(p.x-plot.x,p.z-plot.z)-w));const h=Math.max(.15,radius/Math.sqrt(2)-.08);plot.fabricPolygon=plot.polygon;plot.fabricWidth=plot.width;plot.fabricDepth=plot.depth;plot.polygon=[[plot.x-h,plot.z-h],[plot.x+h,plot.z-h],[plot.x+h,plot.z+h],[plot.x-h,plot.z+h]];plot.width=plot.depth=h*2;}
 return{roads,plots,junctions,river,riverDistance,line,V,angles,radii};
}
