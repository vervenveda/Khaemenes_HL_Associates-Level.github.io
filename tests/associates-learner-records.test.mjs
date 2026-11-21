import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {readDraft,storageKey,emptyDraft,proposeProgram,recordPortfolioReference,createScholarRecordService,academicReview} from "../shared/associates-learner-records.mjs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const ui=readFileSync(new URL("../assets/associates-learner-records-ui.mjs",import.meta.url),"utf8");
function fixture(){
 const map=new Map();
 const storage={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let learnerId="scholar-a",familyId="family-a",adultId="adult-a",ready=true;
 const registryBridge={status:()=>({ready,learnerId,familyId,adultId,stage:"higher",
  authority:"browser-local-selection-only",authenticated:false,cloudSynced:false})};
 const service=createScholarRecordService({registryBridge,storage,clock:()=> "2026-11-21T05:00:00Z"});
 return {service,storage,map,setLearner:x=>learnerId=x,setFamily:x=>familyId=x,
   setAdult:x=>adultId=x,setReady:x=>ready=x};
}
test("only the canonical Associates page mounts one learner-scoped records owner",()=>{
 for(const marker of ["associateScholarRecordsTitle","associateProgramSelect","associateSaveStudyInterest",
  "associateEvidenceCourse","associateEvidenceTitle","associateSaveEvidence","associateDraftStatus",
  "associateDraftSummary"])assert.ok(html.includes('id="'+marker+'"'),marker);
 assert.equal(html.split('src="assets/associates-learner-records-ui.mjs"').length-1,1);
 assert.match(ui,/createScholarRecordService\(\{registryBridge:bridge,storage:window\.localStorage\}\)/);
});
test("existing scholar saves only a provisional local study interest, never real enrollment",()=>{
 const f=fixture(),result=f.service.saveProgram("arts");
 assert.equal(result.status,"LOCAL_DRAFT_SAVED");
 assert.equal(result.record.selectedProgram,"arts");
 assert.equal(result.record.studyRequests[0].status,"LOCAL_INTEREST");
 assert.equal(f.service.read().review.enrollment,"PROVISIONAL_LOCAL_INTEREST_ONLY");
 assert.equal(academicReview().learningUnitsAwarded,0);
});
test("portfolio references are unverified drafts, not scored submissions or uploaded files",()=>{
 const f=fixture();
 assert.equal(f.service.addPortfolioReference("ARTS-111","Observation study").status,"INVALID_DRAFT");
 f.service.saveProgram("arts");
 const res=f.service.addPortfolioReference("ARTS-111","Observation study");
 assert.equal(res.status,"LOCAL_DRAFT_SAVED");
 assert.equal(res.record.portfolioDrafts[0].status,"UNVERIFIED_REFERENCE");
 assert.deepEqual(Object.keys(res.record.portfolioDrafts[0]).sort(),["courseCode","notedAt","programId","status","title"].sort());
 assert.equal(f.service.read().review.assessment,"COURSE_OWNER_NOT_VERIFIED");
 assert.equal(f.service.read().review.certificate,"NOT_ISSUED");
});
test("learner switching creates distinct local keys and never shows prior learner draft",()=>{
 const f=fixture();f.service.saveProgram("arts");f.service.addPortfolioReference("ARTS-111","First artwork");
 f.setLearner("scholar-b");
 assert.equal(f.service.read().record.selectedProgram,null);
 assert.equal(f.service.read().record.portfolioDrafts.length,0);
 f.service.saveProgram("business");
 assert.equal(f.service.read().record.selectedProgram,"business");
 f.setLearner("scholar-a");
 assert.equal(f.service.read().record.portfolioDrafts[0].title,"First artwork");
 assert.notEqual(storageKey("scholar-a"),storageKey("scholar-b"));
});
test("untrusted account or absent learner blocks all record reads/writes",()=>{
 const f=fixture();f.setReady(false);
 assert.equal(f.service.read().status,"IDENTITY_HOLD");
 assert.equal(f.service.saveProgram("arts").status,"IDENTITY_HOLD");
 assert.equal(f.map.size,0);
});
test("switch during mutation fails closed without crossing learner boundaries",()=>{
 const f=fixture();f.service.saveProgram("arts");
 const original=f.storage.getItem.bind(f.storage);
 let first=true;
 f.storage.getItem=k=>{const out=original(k);if(first){first=false;f.setLearner("scholar-b");}return out};
 assert.equal(f.service.saveProgram("sciences").status,"IDENTITY_CHANGED");
 f.setLearner("scholar-a");
 assert.equal(f.service.read().record.selectedProgram,"arts");
});
test("corrupt or cross-learner draft is withheld without overwriting the source",()=>{
 const f=fixture(),key=storageKey("scholar-a");
 f.storage.setItem(key,JSON.stringify(emptyDraft("scholar-b")));
 assert.equal(f.service.read().status,"CORRUPT_OR_MISMATCHED_RECORD");
 assert.equal(f.service.saveProgram("arts").status,"CORRUPT_OR_MISMATCHED_RECORD");
 assert.equal(JSON.parse(f.storage.getItem(key)).learnerId,"scholar-b");
});
test("invalid concentrations, scores and unsafe metadata are not admitted",()=>{
 const a=emptyDraft("scholar-a");
 assert.equal(proposeProgram(a,"outside","2026-11-21T05:00:00Z"),null);
 assert.equal(recordPortfolioReference(a,"ARTS-111","Work","2026-11-21T05:00:00Z"),null);
 const b=proposeProgram(a,"arts","2026-11-21T05:00:00Z");
 assert.equal(recordPortfolioReference(b,"INVALID/../../","Test evidence","2026-11-21T05:00:00Z"),null);
 assert.equal(recordPortfolioReference(b,"SCI-111","Wrong concentration","2026-11-21T05:00:00Z"),null);
 assert.ok(recordPortfolioReference(b,"KHL-CORE-101","Shared core work","2026-11-21T05:00:00Z"));
 const result=recordPortfolioReference(b,"ARTS-111","My studio study","2026-11-21T05:00:00Z");
 assert.equal(result.portfolioDrafts[0].courseCode,"ARTS-111");
 assert.equal(readDraft({...result,studentGrade:99},"scholar-a").studentGrade,undefined);
});
test("no certificate, cloud receipt, source assessment score or official transcript can be granted",()=>{
 const f=fixture();f.service.saveProgram("arts");
 for(const name of ["cloud","transcript","certificate","assessment"]){
  assert.ok(/NOT_|COURSE_/.test(f.service.read().review[name]),name);
 }
 assert.equal(academicReview().learningUnitsAwarded,0);
 assert.doesNotMatch(ui,/fetch\(|AccountCloud\.sync|awardCredit|issueCertificate/);
});
