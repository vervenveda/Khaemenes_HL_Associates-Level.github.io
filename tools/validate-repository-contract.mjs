import fs from "node:fs";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const exists=p=>fs.existsSync(p);

for(const p of [
 "README.md","index.html","docs/ARCHITECTURE.md","docs/MIGRATION_MANIFEST.md",
 "shared/policies/CREDENTIAL_BOUNDARY.md","shared/policies/EVIDENCE_AND_MASTERY.md",
 "catalog/catalog-v1.json","catalog/program-registry.json","catalog/source-registry.json",
 "library/halls/README.md"
]) assert(exists(p),"missing repository contract file "+p);

const catalog=JSON.parse(read("catalog/catalog-v1.json"));
assert.equal(catalog.credential.total_learning_units,60);
assert.equal(catalog.structure.shared_collegiate_core,24);
assert.equal(catalog.structure.concentration_study,30);
assert.equal(catalog.structure.integrative_capstone,6);
assert.equal(catalog.shared_core.length,8);
assert.equal(catalog.shared_core.reduce((n,c)=>n+c.units,0),24);
assert.equal(Object.keys(catalog.concentrations).length,5);
for(const id of ["arts","sciences","civics","health","business"]){
 const p=catalog.concentrations[id]; assert(p,id+" concentration missing");
 assert.equal(p.courses.reduce((n,c)=>n+c.units,0),30,id+" concentration units");
 assert.equal(p.capstone.units,6,id+" capstone units");
 assert(exists("programs/"+id+"/program.json"),id+" program manifest missing");
 const m=JSON.parse(read("programs/"+id+"/program.json"));
 assert.equal(m.total_units,60,id+" total units");
}
const coreSlugs=[
 "academic-language-research","critical-thinking-evidence","quantitative-reasoning",
 "digital-information-literacy","civic-literacy","health-resilience","personal-finance","world-humanities"
];
for(const slug of coreSlugs){
 const p="courses/core/"+slug+"/course.json"; assert(exists(p),"missing core stub "+slug);
 const c=JSON.parse(read(p)); assert.equal(c.units,3,slug+" units"); assert.equal(c.status,"source-assembly-required");
}
const reg=JSON.parse(read("catalog/source-registry.json"));
assert.equal(reg.sources.length,8,"shared hall registry count");
for(const s of reg.sources){
 assert.equal(s.kind,"migrated-hall-snapshot");
 assert(exists(s.local_path),"missing hall snapshot "+s.id);
 const base=s.local_path.replace(/source\.html$/,"");
 const prov=JSON.parse(read(base+"provenance.json"));
 assert.equal(prov.source_sha,s.original_sha,s.id+" SHA provenance mismatch");
 assert.equal(prov.source_repository,s.original_repository,s.id+" repository provenance mismatch");
}
const boundary=read("shared/policies/CREDENTIAL_BOUNDARY.md");
assert.match(boundary,/free, non-accredited educational certificate/i);
assert.match(boundary,/not.*accredited associate degree/i);
assert.match(boundary,/not institutional college credits/i);
const evidence=read("shared/policies/EVIDENCE_AND_MASTERY.md");
assert.match(evidence,/80% mastery floor/i);
assert.match(evidence,/Health materials are educational only/i);

console.log("PASS Associate-Level repository contract: 5 programs, 60-unit structure, 8 shared core requirements, 8 provenance-preserved halls, and non-accredited credential boundary.");
