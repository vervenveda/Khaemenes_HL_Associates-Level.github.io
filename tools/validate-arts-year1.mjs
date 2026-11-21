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
const feedback=JSON.parse(read("programs/arts/year-1/YEAR-1-BLUEPRINT.json")).real_world_feedback_model;
assert(feedback,"missing real-world feedback model");
assert(feedback.guardrails.some(x=>/likes.*not.*artistic quality/i.test(x)),"likes guardrail missing");
assert(feedback.guardrails.some(x=>/virality/i.test(x))||feedback.guardrails.some(x=>/follower/i.test(x)),"vanity-metric guardrail missing");
assert.equal(feedback.evidence.includes("revision decision"),true,"feedback revision evidence missing");
assert.equal(feedback.evidence.includes("which feedback was rejected and why"),true,"feedback rejection rationale missing");
const y=JSON.parse(read("programs/arts/year-1/YEAR-1-BLUEPRINT.json"));
for(const week of [12,24,32])assert(y.integrated_milestones.some(m=>m.week===week&&/Feedback Experiment/i.test(m.name)),"missing feedback milestone "+week);
const c141=JSON.parse(read("courses/tracks/arts/artist-research-critique-portfolio-writing/course-map.json"));
const c151=JSON.parse(read("courses/tracks/arts/creative-enterprise-niche-market-discovery/course-map.json"));
assert(c141.course.feedback_evidence_required,"ARTS-141 feedback evidence not required");
assert(c151.course.feedback_evidence_required,"ARTS-151 feedback evidence not required");

console.log("PASS Arts Year 1: 5 courses / 15 concentration units / 65 curriculum units / 180 course-weeks mapped, each course 36 weeks and 13 units with studio, portfolio and career evidence.");