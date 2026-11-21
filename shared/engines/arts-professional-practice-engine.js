const DATA_URL=new URL("../../programs/arts/lesson-engines/PROFESSIONAL-PRACTICE-72-WEEK.json",import.meta.url);
const Y1_START={1:1,2:2,3:5,4:8,5:11,6:14,7:17,8:20,9:23,10:26,11:29,12:32,13:35};
const Y2_START={1:1,2:3,3:6,4:9,5:12,6:15,7:18,8:20,9:23,10:26,11:29,12:32,13:35};
function n(re,s){const m=String(s||"").match(re);return m?Number(m[1]):0}
function context(){
 const p=location.pathname,txt=document.body?.innerText||"";
 const year=/drawing-painting-composition/.test(p)?2:/drawing-observation-creative-calling/.test(p)?1:0;
 if(!year)return null;
 let week=n(/week[-\s](\d{1,2})/i,p)||n(/Week\s+(\d{1,2})/i,txt);
 let day=n(/day[-\s]0?(\d)/i,p);
 if(!day){
   const names=["Creative Day","CEO Day","Skills & Technique","Artpreneur","Marketing & Promotion"];
   const i=names.findIndex(x=>txt.includes(x));day=i>=0?i+1:1;
 }
 if(!week){
   const unit=n(/unit-(\d{1,2})/i,p),lesson=n(/lesson-(\d{1,2})\.html/i,p);
   const start=(year===1?Y1_START:Y2_START)[unit]||1;
   week=start+Math.max(0,(lesson||1)-1);
 }
 return {year,week:Math.min(36,Math.max(1,week||1)),day:Math.min(5,Math.max(1,day||1))};
}
function style(){
 if(document.getElementById("artsProfessionalPracticeStyle"))return;
 const s=document.createElement("style");s.id="artsProfessionalPracticeStyle";s.textContent=`
 .arts-professional-practice{margin:0 0 24px}
 .arts-professional-practice .app-note{margin:0 0 11px;padding:14px;border:1px solid #d8cebd;border-radius:7px;background:#f7f1e5;text-align:center}
 .arts-professional-practice details{width:100%;border:1px solid #243038;border-radius:7px;overflow:hidden;background:#fffdf8;margin:0 0 11px}
 .arts-professional-practice summary{list-style:none;cursor:pointer;min-height:55px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;background:#243038;color:#fffaf0;font:400 20px/1.3 Cinzel,Georgia,serif;text-align:left}
 .arts-professional-practice summary::-webkit-details-marker{display:none}
 .arts-professional-practice summary::after{content:"+";width:28px;height:28px;display:grid;place-items:center;border:1px solid #c7b78d;border-radius:7px}
 .arts-professional-practice details[open] summary::after{content:"−"}
 .arts-professional-practice .app-body{padding:24px;text-align:center}
 .arts-professional-practice .app-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}
 .arts-professional-practice .app-card{padding:18px;border:1px solid #d8cebd;border-radius:7px;background:#fffaf0}
 .arts-professional-practice .app-card h4{margin:0 0 7px;font:400 20px/1.3 Cinzel,Georgia,serif}
 .arts-professional-practice .app-btn{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:10px 16px;border-radius:7px;background:#243038;color:#fffaf0;text-decoration:none}\n .arts-professional-practice .app-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:11px;margin-top:16px}\n .arts-professional-practice .app-trust{margin:16px auto 0;max-width:820px;padding:14px;border:1px solid #d8cebd;border-radius:7px;background:#f7f1e5;text-align:left}\n .arts-professional-practice .app-trust strong{display:block;margin-bottom:7px}
 @media(max-width:760px){.arts-professional-practice .app-grid{grid-template-columns:1fr}}
 `;document.head.append(s);
}
function details(title,focus,knowledge,today,extra=""){
 return `<details><summary>${title}</summary><div class="app-body"><div class="app-grid"><article class="app-card"><h4>Weekly Focus</h4><p>${focus}</p></article><article class="app-card"><h4>Today’s Step</h4><p>${today}</p></article></div><p>${knowledge}</p>${extra}</div></details>`;
}
export async function mountArtsProfessionalPractice(){
 const c=context();if(!c||document.getElementById("artsProfessionalPractice"))return false;
 const res=await fetch(DATA_URL,{cache:"no-store"});if(!res.ok)return false;const data=await res.json();
 const w=data.weeks.find(x=>x.year===c.year&&x.week===c.week);if(!w)return false;
 style();
 const host=document.createElement("section");host.id="artsProfessionalPractice";host.className="arts-professional-practice";
 const d=data.days[c.day-1]||"Today";
 host.innerHTML=`<div class="app-note"><strong>Professional Practice · Year ${c.year} · Week ${c.week} · ${d}</strong><br>These strands are part of the two-year certificate and continue alongside the day’s main studio lesson.</div>`+
 details(w.specialization.title,w.specialization.weekly_focus,"Specialization is documented through experiments, series decisions and portfolio evidence—not through subjective taste.",w.specialization.daily[c.day-1])+
 details("Artist Business · Daily Knowledge & Task",w.artist_business.weekly_focus,w.artist_business.knowledge,w.artist_business.daily[c.day-1])+
 details("Marketing · Brand · Audience · Daily Step",w.marketing_brand_audience.weekly_focus,w.marketing_brand_audience.knowledge,w.marketing_brand_audience.daily[c.day-1])+
 details("Exhibition · Clients · Galleries · Live Call for Art",w.exhibition_clients_galleries.weekly_focus,w.exhibition_clients_galleries.knowledge,w.exhibition_clients_galleries.daily[c.day-1],
 `<div class="app-actions"><a class="app-btn" href="${w.exhibition_clients_galleries.registry_app||w.exhibition_clients_galleries.registry_landing}" target="_blank" rel="noopener">Open Live Call for Art Registry</a><a class="app-btn" href="${w.exhibition_clients_galleries.registry_landing}" target="_blank" rel="noopener">Registry Guide</a></div><div class="app-trust"><strong>Read the trust labels before acting</strong><span><em>Verified Current</em> means required checks are current. <em>Needs Recheck</em> means information is incomplete or stale. <em>Flagged</em> means a material concern needs review. <em>Expired</em> means the deadline has passed. Community remarks describe artist experience and do not determine validity.</span></div><p><small>Discovery is a starting point. Verify the official organizer’s deadline, eligibility, fees, compensation, rights, shipping/installation terms and application requirements before acting. The registry is free, ad-free and does not use sponsored ranking.</small></p>`);
 const stack=document.querySelector(".accordion-stack");
 if(stack){const evidence=stack.querySelector("#lessonEvidence");evidence?stack.insertBefore(host,evidence):stack.append(host)}
 else{
   const shell=document.querySelector("main .shell,main")||document.body;
   shell.append(host);
 }
 return true;
}
function boot(){mountArtsProfessionalPractice().catch(()=>{})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
