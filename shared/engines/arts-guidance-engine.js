const DATA_URL=new URL("../../programs/arts/lesson-engines/ARTS-GUIDANCE-CONTRACT.json",import.meta.url);
function num(re,s){const m=String(s||"").match(re);return m?Number(m[1]):0}
function lessonContext(){
 const p=location.pathname,txt=document.body?.innerText||"";
 const year=/drawing-painting-composition/.test(p)?2:/drawing-observation-creative-calling/.test(p)?1:0;
 if(!year)return null;
 let day=num(/day[-\s]0?(\d)/i,p);
 if(!day){
   const names=["Creative Day","CEO Day","Skills & Technique","Artpreneur Day","Marketing & Promotion Day"];
   const i=names.findIndex(x=>txt.includes(x));day=i>=0?i+1:1;
 }
 const week=num(/week[-\s](\d{1,2})/i,p)||num(/Week\s+(\d{1,2})/i,txt)||1;\n const unit=num(/unit-(\d{1,2})/i,p)||num(/Unit\s+(\d{1,2})/i,txt)||1;
 const title=(document.querySelector(".lesson-hero h1,.hero h1")?.textContent||document.title||"Today’s lesson").trim();
 const about=(document.querySelector(".section .card p,.card p")?.textContent||"").trim();
 return{year,day:Math.min(5,Math.max(1,day||1)),week,unit,title,about};
}
function evidenceLabels(){
 const evidence=document.getElementById("lessonEvidence");
 if(!evidence)return[];
 const labels=[...evidence.querySelectorAll("label")].map(x=>x.textContent.trim()).filter(Boolean);
 return labels.slice(0,6);
}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function list(items){return "<ul>"+items.map(x=>"<li>"+safe(x)+"</li>").join("")+"</ul>"}
function style(){
 if(document.getElementById("artsGuidanceStyle"))return;
 const s=document.createElement("style");s.id="artsGuidanceStyle";s.textContent=`
 .arts-guidance{margin:0 0 11px}
 .arts-guidance details{width:100%;border:1px solid #243038;border-radius:7px;overflow:hidden;background:#fffdf8}
 .arts-guidance summary{list-style:none;cursor:pointer;min-height:55px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;background:#243038;color:#fffaf0;font:400 20px/1.3 Cinzel,Georgia,serif;text-align:left}
 .arts-guidance summary::-webkit-details-marker{display:none}.arts-guidance summary::after{content:"+";width:28px;height:28px;display:grid;place-items:center;border:1px solid #c7b78d;border-radius:7px}.arts-guidance details[open] summary::after{content:"−"}
 .arts-guidance .guide-body{padding:24px;background:#fffdf8}.arts-guidance .guide-intro{max-width:840px;margin:0 auto 18px;text-align:center}
 .arts-guidance .guide-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.arts-guidance .guide-card{padding:18px;border:1px solid #d8cebd;border-radius:7px;background:#fffaf0;text-align:left}
 .arts-guidance .guide-card h4{margin:0 0 7px;font:400 20px/1.3 Cinzel,Georgia,serif;color:#243038}.arts-guidance .guide-card ul{margin:8px 0 0;padding-left:22px}.arts-guidance .guide-card li{margin:6px 0}
 .arts-guidance .guide-master{margin:14px 0 0;padding:16px;border:1px solid #c7b78d;border-radius:7px;background:#f7f1e5;text-align:left}.arts-guidance .guide-master strong{display:block;margin-bottom:6px}
 @media(max-width:760px){.arts-guidance .guide-grid{grid-template-columns:1fr}}
 `;document.head.append(s)
}
export async function mountArtsGuidance(){
 const c=lessonContext();if(!c||document.getElementById("artsGuidance"))return false;
 const res=await fetch(DATA_URL,{cache:"no-store"});if(!res.ok)return false;const data=await res.json(),g=data.days[String(c.day)];if(!g)return false;
 style();
 const evidence=evidenceLabels();\n const unit=data.unit_guidance?.[String(c.year)]?.[String(c.unit)]||null;\n const week=data.week_guidance?.[String(c.year)]?.[String(c.week)]||null;
 const y2=c.year===2?`<article class="guide-card"><h4>Year 2 Independence Check</h4><p>${safe(data.year2.emphasis)}</p>${list(data.year2.prompts)}</article>`:"";
 const evidenceCard=evidence.length?`<article class="guide-card"><h4>Before You Submit Evidence</h4><p>Make sure the required record is specific enough to stand on its own:</p>${list(evidence.map(x=>"Complete and verify: "+x))}</article>`:"";
 const mentor=unit?`<article class="guide-card"><h4>Unit Mentor Notes · ${safe(unit.name)}</h4><p>${safe(unit.mentor)}</p>${list(unit.diagnostics)}</article>`:"";\n const clinic=week?`<article class="guide-card"><h4>This Week’s Studio Clinic · ${safe(week.title)}</h4><p><strong>Studio focus:</strong> ${safe(week.studio_focus)}</p><p><strong>Diagnostic:</strong> ${safe(week.diagnostic_question)}</p><p><strong>Troubleshoot:</strong> ${safe(week.troubleshoot)}</p><p><strong>Critique sentence stem:</strong> ${safe(week.critique_stem)}</p><p><strong>Evidence example:</strong> ${safe(week.evidence_example)}</p></article>`:"";\n const host=document.createElement("section");host.id="artsGuidance";host.className="arts-guidance";
 host.innerHTML=`<details><summary>Guidance · How to Work Through This Lesson</summary><div class="guide-body"><div class="guide-intro"><h3>${safe(c.title)}</h3><p><strong>${safe(g.name)} coaching:</strong> ${safe(g.begin)}</p></div><div class="guide-grid"><article class="guide-card"><h4>What to Notice While You Work</h4>${list(g.notice)}</article><article class="guide-card"><h4>Common Traps to Avoid</h4>${list(g.common)}</article><article class="guide-card"><h4>Self-Check Before the Mastery Gate</h4>${list(g.selfcheck)}</article>${mentor}${clinic}${evidenceCard}${y2}</div><div class="guide-master"><strong>What mastery looks like here</strong><span>${safe(g.mastery)}</span></div></div></details>`;
 const stack=document.querySelector(".accordion-stack,.stack");
 if(stack){const evidenceNode=stack.querySelector("#lessonEvidence");evidenceNode?stack.insertBefore(host,evidenceNode):stack.prepend(host)}else{(document.querySelector("main .shell,main")||document.body).append(host)}
 return true
}
function boot(){mountArtsGuidance().catch(()=>{})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
