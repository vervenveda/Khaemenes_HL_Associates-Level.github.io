import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const courses=[
 ["KHL-CORE-101","academic-language-research"],
 ["KHL-CORE-102","critical-thinking-evidence"],
 ["KHL-CORE-103","quantitative-reasoning"],
 ["KHL-CORE-104","digital-information-literacy"],
 ["KHL-CORE-105","civic-literacy"],
 ["KHL-CORE-106","health-resilience"],
 ["KHL-CORE-107","personal-finance"],
 ["KHL-CORE-108","world-humanities"]
];
let totalUnits=0,totalLessons=0,totalHours=0;
for(const [code,slug] of courses){
 const base="courses/core/"+slug+"/";
 for(const f of ["course.json","course-map.json","index.html","sources/source-notes.json","assessments/diagnostic.html","assessments/midterm.html","assessments/final.html"]) assert(exists(base+f),code+" missing "+f);
 const authority=JSON.parse(read(base+"course.json"));
 const map=JSON.parse(read(base+"course-map.json"));
 assert.equal(authority.code,code,code+" authority code");
 assert.equal(authority.status,"instructional",code+" not active instructional");
 assert.equal(authority.units,3,code+" units");
 assert.equal(authority.estimated_hours,45,code+" hours");
 assert.equal(authority.modules,12,code+" module declaration");
 assert.equal(authority.lessons,36,code+" lesson declaration");
 assert.equal(map.course.code,code,code+" map code");
 assert.equal(map.course.units,3,code+" map units");
 assert.equal(map.course.estimated_hours,45,code+" map hours");
 assert.equal(map.course.modules,12,code+" map modules");
 assert.equal(map.course.lessons,36,code+" map lessons");
 assert.equal(map.course.mastery_floor,80,code+" mastery floor");
 assert.equal((map.modules||[]).length,12,code+" actual modules");
 const lessons=(map.modules||[]).flatMap(m=>m.lessons||[]);
 assert.equal(lessons.length,36,code+" mapped lessons");
 const ids=new Set();
 for(const l of lessons){
  assert(!ids.has(l.id),code+" duplicate lesson "+l.id);ids.add(l.id);
  const p=base+"lessons/"+l.id+".html";assert(exists(p),code+" missing lesson "+l.id);
  const html=read(p);
  assert(html.includes("<h1>"+l.title+"</h1>")||html.includes("<h1>"+l.title.replaceAll("&","&amp;")+"</h1>"),code+" title mismatch "+l.id);
 }
 const src=JSON.parse(read(base+"sources/source-notes.json"));
 assert.equal(src.course,code,code+" source-note course id");
 assert(Array.isArray(src.sources)&&src.sources.length>=1,code+" source lineage missing");
 totalUnits+=3;totalLessons+=36;totalHours+=45;
}
assert.equal(totalUnits,24);
assert.equal(totalLessons,288);
assert.equal(totalHours,360);

const catalog=JSON.parse(read("catalog/catalog-v1.json"));
assert.equal(catalog.shared_core.length,8);
assert.equal(catalog.shared_core.reduce((n,c)=>n+c.units,0),24);
for(const [code,slug] of courses){
 const c=catalog.shared_core.find(x=>x.code===code);assert(c,code+" missing catalog entry");
 assert.equal(c.status,"instructional",code+" catalog status");\n assert.match(c.readiness_note||"",/runtime mastery|normalization/i,code+" readiness note");
 assert.equal(c.canonical_path,"courses/core/"+slug+"/",code+" canonical path");
 assert.equal(c.lessons,36,code+" catalog lesson count");
}
assert.match(read("courses/core/health-resilience/index.html"),/does not qualify.*diagnose|Educational only/i);
assert.match(read("courses/core/personal-finance/index.html"),/Educational only/i);
assert.match(read("courses/core/civic-literacy/index.html"),/not legal advice|not legal/i);
assert.match(read("courses/core/world-humanities/index.html"),/No single civilization/i);
console.log("PASS Shared Collegiate Core: 8 courses / 24 internal units / 360 hours / 288 lessons with assessments, provenance and discipline boundaries.");
