import fs from "node:fs";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const program=JSON.parse(read("programs/arts/program.json"));
const blueprint=JSON.parse(read("programs/arts/PROFESSIONAL_PRACTICE_BLUEPRINT.json"));
const matrix=JSON.parse(read("programs/arts/BEST_PRACTICE_INTEGRATION.json"));

assert.equal(program.id,"arts");
assert.equal(program.concentration_units,30);
assert.equal(program.capstone_units,6);
assert.equal(program.courses.length,10);
assert.equal(program.courses.reduce((n,c)=>n+c.units,0),30);

for(const c of program.courses){
 assert.equal(c.duration_weeks,36,c.code+" weeks");
 assert.equal(c.curriculum_unit_count,13,c.code+" curriculum units");
 assert.equal(c.units,3,c.code+" learning units");
 assert.equal(c.curriculum_units.length,13,c.code+" curriculum unit list");
}
assert.equal(program.practice_model.instructional_days_per_week,5);
assert.equal(program.practice_model.minimum_hands_on_studio_days_per_week,1);\nassert.equal(program.practice_model.minimum_creative_or_skill_days_per_week,2);
for(const d of ["monday","tuesday","wednesday","thursday","friday"]) assert(program.practice_model.weekly_spine[d],d+" missing");
assert.match(program.practice_model.weekly_spine.monday.rule,/hands-on making/i);
assert.match(program.practice_model.weekly_spine.wednesday.rule,/hands-on making/i);
assert.match(program.practice_model.weekly_spine.friday.rule,/hands-on making/i);
assert.match(program.practice_model.weekly_spine.tuesday.focus,/Critique|Portfolio/i);
assert.match(program.practice_model.weekly_spine.thursday.focus,/Business|Marketing/i);

for(const key of ["drawing_and_observation","design_2d","space_3d","time_4d","research","critique","visual_culture","collaboration","sustainability","audience_and_exhibition"]){
 assert(program.practice_model.borrowed_best_practices[key], "missing best practice "+key);
}
for(const phrase of ["Drawing","2D","3D","4D","Research","Critique","Marketing","Pricing","Contracts","Exhibition"]){
 assert(program.courses.some(c=>(c.title+" "+c.curriculum_units.join(" ")).includes(phrase)), "program missing "+phrase);
}
assert.equal(matrix.integrations.length>=10,true);
assert(matrix.rejected_or_reframed.some(x=>/Prestige/i.test(x)));
assert(matrix.rejected_or_reframed.some(x=>/jargon/i.test(x)));
assert.equal(blueprint.course_standard.duration_weeks,36);
assert.equal(blueprint.course_standard.curriculum_units,13);
assert.equal(blueprint.course_standard.minimum_studio_days_per_week,1);\nassert.equal(blueprint.course_standard.minimum_creative_or_skill_days_per_week,2);

assert.equal(program.capstone.units,6);
assert.equal(program.capstone.duration_weeks,36);
assert.equal(program.capstone.curriculum_unit_count,13);
for(const phrase of ["artist statements","pricing structure","marketing strategy","website/portfolio","public exhibition","oral defense"]){
 assert(program.capstone.evidence.some(x=>x.toLowerCase().includes(phrase.toLowerCase())), "capstone evidence missing "+phrase);
}

console.log("PASS Arts professional-practice contract: global foundation strengths integrated into a 10-course / 30-unit working-artist track with 36-week 13-unit courses, five-role weekly operating model, portfolio/business/marketing spine, and 6-unit launch capstone.");
