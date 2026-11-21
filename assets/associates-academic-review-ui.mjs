import {createScholarRecordService} from "../shared/associates-learner-records.mjs";
import {buildCertificateReview} from "../shared/associates-course-evidence-review.mjs";

/* Source-level program requirements only. This UI does not fetch or accept any
 * learner's assessment attempts; no authoritative course receipt adapter exists.
 */
const $=id=>document.getElementById(id);
const status=$("associateAcademicEvidenceStatus"),container=$("associateCertificateReview");
const bridge=window.KhaemenesAssociatesAcademyBridge;
const drafts=createScholarRecordService({registryBridge:bridge,storage:window.localStorage});
const programPaths=Object.freeze({
 arts:"programs/arts/program.json",
 sciences:"programs/sciences/program.json",
 civics:"programs/civics/program.json",
 health:"programs/health/program.json",
 business:"programs/business/program.json"
});
let sequence=0;
function show(lines){
 container.replaceChildren();
 const list=document.createElement("ul");
 for(const line of lines){const item=document.createElement("li");item.textContent=line;list.append(item);}
 container.append(list);
}
async function refresh(){
 const run=++sequence,read=drafts.read();
 if(read.status!=="LOCAL_DRAFT_ONLY"){
  status.textContent="Learner identity unavailable or switched. Academic evidence withheld.";
  container.replaceChildren();
  return;
 }
 const programId=read.record.selectedProgram,path=programPaths[programId];
 if(!path){
  status.textContent="Choose a concentration to view its published requirements. No academic evidence is linked.";
  show(["Academic scores: no course-owned assessment receipts connected",
   "Awarded internal units: 0 · Certificate: NOT ISSUED · Account Cloud: NOT SYNCED"]);
  return;
 }
 try{
  const response=await fetch(new URL("../"+path,import.meta.url),{
   credentials:"omit",cache:"no-store"
  });
  if(!response.ok)throw Error("program manifest unavailable");
  const program=await response.json();
  const latest=drafts.read();
  if(run!==sequence||latest.status!=="LOCAL_DRAFT_ONLY"||
     latest.record.learnerId!==read.record.learnerId||
     latest.record.selectedProgram!==programId)return;
  const review=buildCertificateReview({
   learnerId:read.record.learnerId,programId,program,sourceCandidates:[]
  });
  status.textContent="Program requirement review only. Course quizzes, exams, studio evidence and evaluator receipts have not yet been imported.";
  show(["Review status: "+review.status,
   "Required internal units: 24 shared core + 30 concentration + 6 capstone = 60",
   "Course assessments: "+review.assessed.status,
   "Official units awarded by this bridge: "+review.officialUnitsAwarded,
   "Certificate: NOT ISSUED · Academic transcript: NOT CERTIFIED",
   "Encrypted Account Cloud archive: NOT SYNCED"]);
 }catch{
  if(run!==sequence)return;
  status.textContent="Published program requirements could not be loaded. No credit or certificate was awarded.";
  container.replaceChildren();
 }
}
for(const event of ["pageshow","focus","storage","khaemenes-student-profile-changed",
 "khaemenes-family-backup-restored"]){window.addEventListener(event,refresh);}
$("associateSaveStudyInterest")?.addEventListener("click",()=>queueMicrotask(refresh));
refresh();
