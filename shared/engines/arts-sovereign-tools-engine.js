const DATA_URL=new URL("../../programs/arts/lesson-engines/ARTS-SOVEREIGN-TOOLS-CONTRACT.json",import.meta.url);
function n(re,s){const m=String(s||"").match(re);return m?Number(m[1]):0}
function context(){
 const p=location.pathname,txt=document.body?.innerText||"";
 const year=/drawing-painting-composition/.test(p)?2:/drawing-observation-creative-calling/.test(p)?1:0;
 if(!year)return null;
 const unit=n(/unit-(\d{1,2})/i,p)||n(/Unit\s+(\d{1,2})/i,txt)||1;
 let day=n(/day[-\s]0?(\d)/i,p);
 if(!day){
   const names=["Creative Day","CEO Day","Skills & Technique","Artpreneur Day","Marketing & Promotion Day"];
   const i=names.findIndex(x=>txt.includes(x));day=i>=0?i+1:1;
 }
 return{year,unit,day:Math.min(5,Math.max(1,day||1))};
}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function style(){
 if(document.getElementById("artsSovereignToolStyle"))return;
 const s=document.createElement("style");s.id="artsSovereignToolStyle";s.textContent=`
 .arts-tool-invite{margin:14px 0 0;padding:14px 16px;border:1px solid #c7b78d;border-radius:7px;background:#f7f1e5;text-align:center}
 .arts-tool-invite p{margin:0 auto 11px;max-width:760px;font-size:16px}
 .arts-tool-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:11px}
 .arts-tool-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fffaf0!important;text-decoration:none;text-align:center}
 .arts-tool-btn:hover,.arts-tool-btn:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
 `;document.head.append(s)
}
function findAnchor(patterns){
 const details=[...document.querySelectorAll("details")];
 for(const p of patterns||[]){
   const d=details.find(x=>(x.querySelector("summary")?.textContent||"").trim().includes(p));
   if(d)return d;
 }
 return null;
}
export async function mountArtsSovereignTools(){
 const c=context();if(!c||document.getElementById("artsSovereignToolInvite"))return false;
 const res=await fetch(DATA_URL,{cache:"no-store"});if(!res.ok)return false;
 const data=await res.json();
 const ids=data.mappings?.[String(c.year)]?.[String(c.unit)]?.[String(c.day)]||[];
 if(!ids.length)return false;
 const tools=ids.map(id=>data.tools[id]).filter(Boolean).slice(0,2);
 if(!tools.length)return false;
 style();
 const box=document.createElement("div");box.id="artsSovereignToolInvite";box.className="arts-tool-invite";
 box.innerHTML=`<p><strong>Optional sovereign creative tool.</strong> You can use a VNV/Bazaar Art tool for this activity, or continue with your own offline materials or software. Tool choice never affects mastery.</p><div class="arts-tool-actions">${tools.map(t=>`<a class="arts-tool-btn" href="${safe(t.url)}" target="_blank" rel="noopener" title="${safe(t.note)}">${safe(t.label)}</a>`).join("")}</div>`;
 const anchor=findAnchor(data.anchor_patterns?.[String(c.day)]);
 if(anchor){anchor.insertAdjacentElement("afterend",box);return true}
 const evidence=document.getElementById("lessonEvidence");
 if(evidence){evidence.insertAdjacentElement("beforebegin",box);return true}
 return false;
}
function boot(){mountArtsSovereignTools().catch(()=>{})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
