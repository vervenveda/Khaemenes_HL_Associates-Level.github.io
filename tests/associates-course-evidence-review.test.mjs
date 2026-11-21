import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {inspectCourseEvidence,buildCertificateReview,EVIDENCE_SCHEMA,EVIDENCE_STATUS} from "../shared/associates-course-evidence-review.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const ui=read("assets/associates-academic-review-ui.mjs");
const page=read("index.html");
const manifest=JSON.parse(read("programs/arts/program.json"));
const sample=()=>({
 schema:EVIDENCE_SCHEMA,learnerId:"scholar-a",programId:"arts",
 courseCode:"ARTS-111",assessmentId:"ARTS-111-W01",attemptId:"attempt-a",
 sourceRepository:"Khaemenes_HL_Associates-Level.github.io",
 sourcePath:"courses/tracks/arts/drawing-observation-creative-calling/assessments/diagnostic.html",
 sourceVersion:"v1",kind:"quiz",possible:10,earned:9,
 evidenceRefs:[],submittedAt:"2026-11-21T01:00:00Z"
});
const scope={learnerId:"scholar-a",programId:"arts",allowedCourses:["ARTS-111","KHL-CORE-101"]};
test("missing course receipts cannot award academic credit or a certificate",()=>{
 const r=inspectCourseEvidence([],scope);
 assert.equal(r.status,EVIDENCE_STATUS.MISSING);
 assert.equal(r.learningUnitsAwarded,0);
 assert.equal(r.officialGrade,null);
 assert.equal(r.certificateIssued,false);
 assert.equal(r.cloudSynced,false);
});
test("a source-looking 90% quiz still requires original course provenance review",()=>{
 const r=inspectCourseEvidence([sample()],scope);
 assert.equal(r.status,EVIDENCE_STATUS.REVIEW);
 assert.equal(r.sourceCandidateCount,1);
 assert.equal(r.officialGrade,null);
 assert.equal(r.learningUnitsAwarded,0);
});
test("wrong family learner and a separate program course never cross-contaminate",()=>{
 const other={...sample(),learnerId:"scholar-b"};
 const wrong={...sample(),programId:"sciences"};
 const course={...sample(),courseCode:"SCI-111"};
 for(const value of [other,wrong,course]){
  const r=inspectCourseEvidence([value],scope);
  assert.equal(r.status,EVIDENCE_STATUS.MISMATCH);
  assert.equal(r.sourceCandidateCount,0);
 }
});
test("unscoped, missing timestamp and forged score candidates are invalid",()=>{
 for(const edit of [{attemptId:""},{sourcePath:""},{sourceVersion:""},
  {earned:11},{possible:0},{earned:9.5},{submittedAt:"now"},{kind:"certificate"}]){
  const r=inspectCourseEvidence([{...sample(),...edit}],scope);
  assert.equal(r.status,EVIDENCE_STATUS.INVALID);
  assert.equal(r.officialGrade,null);
 }
});
test("below 80% remains correction-required and does not unlock or issue certificate",()=>{
 const r=inspectCourseEvidence([{...sample(),earned:7}],scope);
 assert.equal(r.status,EVIDENCE_STATUS.BELOW);
 assert.equal(r.belowMasteryCandidateCount,1);
 assert.equal(r.learningUnitsAwarded,0);
});
test("diagnostic results are never treated as a mastery checkpoint",()=>{
 const r=inspectCourseEvidence([{...sample(),kind:"diagnostic",earned:5}],scope);
 assert.equal(r.status,EVIDENCE_STATUS.REVIEW);
 assert.equal(r.belowMasteryCandidateCount,0);
});
test("any mismatched receipt in a mixed batch fails closed",()=>{
 const r=inspectCourseEvidence([sample(),{...sample(),learnerId:"scholar-b"}],scope);
 assert.equal(r.status,EVIDENCE_STATUS.MISMATCH);
 assert.equal(r.sourceCandidateCount,1);
 assert.equal(r.certificateIssued,false);
});
test("each of five manifest programs has exact 24+30+6 units but no official award",()=>{
 const names=["arts","sciences","civics","health","business"];
 for(const name of names){
  const m=JSON.parse(read("programs/"+name+"/program.json"));
  const r=buildCertificateReview({learnerId:"scholar-a",programId:name,program:m});
  assert.equal(r.status,"REQUIREMENTS_FOUND_SOURCE_EVIDENCE_PENDING",name);
  assert.equal(r.requiredInternalLearningUnits,60);
  assert.deepEqual(Object.values(r.requirements),[24,30,6]);
  assert.equal(r.officialUnitsAwarded,0);
  assert.equal(r.officialCreditsAwarded,0);
  assert.equal(r.certificateIssued,false);
  assert.equal(r.accountCloudSynced,false);
 }
});
test("invalid or mismatched student/program blocks certificate requirements review",()=>{
 for(const opts of [{learnerId:""},{programId:"other"},{program:{...manifest,total_units:59}}]){
  const r=buildCertificateReview({learnerId:"scholar-a",programId:"arts",program:manifest,...opts});
  assert.equal(r.status,"PROGRAM_OR_IDENTITY_HOLD");
  assert.equal(r.certificateIssued,false);
 }
});
test("review accepts no writable learner score source by default",()=>{
 assert.match(ui,/sourceCandidates:\[\]/);
 assert.match(ui,/credentials:"omit"/);
 assert.match(ui,/cache:"no-store"/);
 assert.match(ui,/latest\.record\.learnerId!==read\.record\.learnerId/);
 assert.doesNotMatch(ui,/localStorage\.setItem|writeJSON|awardCredit|issueCertificate/);
});
test("new academic panel is single-owner and clearly not a certified transcript",()=>{
 for(const id of ["associateAcademicEvidenceHeading","associateAcademicEvidenceStatus","associateCertificateReview"])
  assert.equal(page.split('id="'+id+'"').length-1,1,id);
 assert.equal(page.split('src="assets/associates-academic-review-ui.mjs"').length-1,1);
 assert.match(page,/not academic credit/);
});
