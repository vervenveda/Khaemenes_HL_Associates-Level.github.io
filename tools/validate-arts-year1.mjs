import fs from "node:fs";import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const year=JSON.parse(read("programs/arts/year-1/YEAR-1-BLUEPRINT.json"));
assert.equal(year.duration_weeks,36);
assert.equal(year.concentration_courses,5);
assert.equal(year.concentration_units,15);
assert.equal(year.course_standard.curriculum_units_each,13);
assert.equal(year.course_standard.duration_weeks_each,36);
assert.equal(year.minimum_studio_days_per_week,3);
assert.equal(year.courses.length,5);
const expected=["ARTS-111","ARTS-121","ARTS-131","ARTS-141","ARTS-151"];
assert.deepEqual(year.courses.map(c=>c.code),expected);
for(const c of year.courses){
 assert.equal(c.units.length,13,c.code+" units");
 assert.equal(c.units.reduce((n,u)=>n+u.weeks,0),36,c.code+" weeks");
 assert.equal(c.internal_learning_units,3,c.code+" learning units");
 for(const u of c.units){
   assert(u.evidence.length>=3,c.code+" unit "+u.number+" evidence");
   assert(u.start_week>=1&&u.end_week<=36,c.code+" week bounds");
 }
 const p="courses/tracks/arts/"+c.slug+"/course-map.json";
 assert(fs.existsSync(p),c.code+" map missing");
 const m=JSON.parse(read(p));
 assert.equal(m.course.code,c.code);
 assert.equal(m.units.length,13);
 assert.equal(m.units.reduce((n,u)=>n+u.weeks,0),36);
}
for(const week of [1,9,18,27,34,36])assert(year.integrated_milestones.some(m=>m.week===week),"missing milestone week "+week);
for(const phrase of ["curated Year 1 portfolio","artist bio","niche","pricing","small public launch","Year 2"]){
 assert(year.year1_outcomes.join(" ").toLowerCase().includes(phrase.toLowerCase())||JSON.stringify(year).toLowerCase().includes(phrase.toLowerCase()),"missing Year 1 outcome "+phrase);
}
console.log("PASS Arts Year 1: 5 courses / 15 concentration units / 65 curriculum units / 180 course-weeks mapped, each course 36 weeks and 13 units with studio, portfolio and career evidence.");