import fs from "node:fs";import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const c=JSON.parse(read("programs/arts/assessment/MASTERY-AND-PORTFOLIO-CONTRACT.json"));
assert.equal(c.mastery_floor_percent,80);
assert.equal(c.no_average_around_missing_work,true);
assert.equal(c.section_rules.vocabulary.mastery_floor_percent,80);
assert.equal(c.section_rules.weekly_unit_quiz.mastery_floor_percent,80);
assert.equal(c.assessments.midterm.includes(">=80%"),true);
assert.equal(c.assessments.final_exam.includes(">=80%"),true);
assert.equal(c.section_rules.visual_or_business_artifact.pass_condition.includes("required image/screenshot/photo uploaded to portfolio evidence"),true);
assert.equal(c.portfolio_evidence.credit_rule.includes("No visual/business artifact receives assignment credit"),true);
assert(c.lesson_gate_algorithm.some(x=>/every required input/i.test(x)));
assert(c.lesson_gate_algorithm.some(x=>/portfolio evidence/i.test(x)));
assert(c.lesson_gate_algorithm.some(x=>/>=80%/.test(x)));
assert(/does not grade whether the artwork is beautiful/i.test(c.artistic_freedom));
for(const p of [
 "workflow/imports/yearbook-reference/high-school-upper-grade-yearbook-dialog.js",
 "workflow/imports/yearbook-reference/academy-yearbook-index.html",
 "workflow/imports/yearbook-reference/yearbook-global-standard-v1.js",
 "workflow/imports/yearbook-reference/yearbook-agi-minicloud.html",
 "workflow/imports/yearbook-reference/provenance.json"
]) assert(fs.existsSync(p),"missing imported Yearbook reference "+p);
const prov=JSON.parse(read("workflow/imports/yearbook-reference/provenance.json"));
assert(prov.sources.some(s=>s.repository==="vervenveda/Khaemenes_High.github.io"&&s.path==="grades/shared/upper-grade-yearbook-dialog.js"));
assert(prov.sources.some(s=>s.repository==="vervenveda/Academy-Yearbook.github.io"&&s.path==="index.html"));
console.log("PASS Arts mastery/portfolio contract: strict required-input completion, >=80% mastery, portfolio evidence gating, vocabulary/quizzes/midterm/final, non-subjective art grading, and Yearbook reference provenance.");
