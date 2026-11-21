import fs from "node:fs";import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const program=JSON.parse(read("programs/arts/program.json"));
const blueprint=JSON.parse(read("programs/arts/PROFESSIONAL_PRACTICE_BLUEPRINT.json"));
const matrix=JSON.parse(read("programs/arts/BEST_PRACTICE_INTEGRATION.json"));
assert.equal(program.id,"arts");assert.equal(program.concentration_units,30);assert.equal(program.capstone_units,6);assert.equal(program.courses.length,10);assert.equal(program.courses.reduce((n,c)=>n+c.units,0),30);
for(const c of program.courses){assert.equal(c.duration_weeks,36,c.code+" weeks");assert.equal(c.curriculum_unit_count,13,c.code+" curriculum units");assert.equal(c.units,3,c.code+" units");assert.equal(c.curriculum_units.length,13,c.code+" unit list");}
const p=program.practice_model;assert.equal(p.instructional_days_per_week,5);assert.equal(p.minimum_hands_on_studio_days_per_week,1);assert.equal(p.minimum_creative_or_skill_days_per_week,2);
const roles={monday:"Creative Day",tuesday:"CEO Day",wednesday:"Skills & Technique Day",thursday:"Artpreneur Day",friday:"Marketing & Promotion Day"};
for(const [d,t] of Object.entries(roles)){assert.equal(p.weekly_spine[d].title,t,d+" title");assert(p.weekly_spine[d].purpose,d+" purpose");assert(p.weekly_spine[d].required_output,d+" output");}
assert.match(p.weekly_spine.monday.purpose,/creative/i);assert.match(p.weekly_spine.wednesday.purpose,/craft|technique|practice/i);assert.match(p.weekly_spine.tuesday.purpose,/business|career|manage/i);assert.match(p.weekly_spine.thursday.purpose,/infrastructure|revenue|business/i);assert.match(p.weekly_spine.friday.purpose,/promotion|audience|work in front/i);
for(const k of ["drawing_and_observation","design_2d","space_3d","time_4d","research","critique","visual_culture","collaboration","sustainability","audience_and_exhibition"])assert(p.borrowed_best_practices[k],"missing "+k);
assert(matrix.integrations.length>=10);assert(matrix.rejected_or_reframed.some(x=>/Prestige/i.test(x)));assert(matrix.rejected_or_reframed.some(x=>/jargon/i.test(x)));
assert.equal(blueprint.course_standard.duration_weeks,36);assert.equal(blueprint.course_standard.curriculum_units,13);assert.equal(blueprint.course_standard.minimum_studio_days_per_week,1);assert.equal(blueprint.course_standard.minimum_creative_or_skill_days_per_week,2);
assert.equal(program.capstone.units,6);assert.equal(program.capstone.duration_weeks,36);assert.equal(program.capstone.curriculum_unit_count,13);
console.log("PASS Arts professional-practice contract: final five-role week validated.");
