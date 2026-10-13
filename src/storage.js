// Storage adapter boundary. This version never sends uploads off this device.
const DB='fxarch-demo-v1',STORE='projects';
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function transaction(mode,run){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode);let result;const r=run(tx.objectStore(STORE));r.onsuccess=()=>result=r.result;tx.oncomplete=()=>{db.close();resolve(result)};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error||new Error('Local save canceled'))};});}
export const storage={kind:'device-local',list:()=>transaction('readonly',s=>s.getAll()),save:record=>transaction('readwrite',s=>s.put(record)),remove:id=>transaction('readwrite',s=>s.delete(id))};
export function assetSize(p){return (p.model?.size||0)+(p.photos||[]).reduce((s,f)=>s+f.size,0)+(p.rooms||[]).reduce((s,r)=>s+(r.model?.size||0)+(r.photos||[]).reduce((a,f)=>a+f.size,0),0);}
