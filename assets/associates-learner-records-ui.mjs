import {PROGRAMS,createScholarRecordService} from "../shared/associates-learner-records.mjs";

const $=id=>document.getElementById(id);
const programLabels={
 arts:"Arts, Design & Creative Practice",
 sciences:"Sciences & Scientific Inquiry",
 civics:"Civics, Governance & Public Life",
 health:"Health, Psychology & Wellbeing",
 business:"Business, Finance & Enterprise"
};
const status=$("associateDraftStatus"), summary=$("associateDraftSummary");
const pick=$("associateProgramSelect"),save=$("associateSaveStudyInterest"),
 course=$("associateEvidenceCourse"),title=$("associateEvidenceTitle"),add=$("associateSaveEvidence");
const bridge=window.KhaemenesAssociatesAcademyBridge;
const service=createScholarRecordService({registryBridge:bridge,storage:window.localStorage});
function lockForm(enabled){
 for(const control of [pick,save,course,title,add])if(control)control.disabled=!enabled;
}
function render(){
 const result=service.read();
 summary.replaceChildren();
 if(result.status!=="LOCAL_DRAFT_ONLY"){
  lockForm(false);
  status.textContent=result.status==="CORRUPT_OR_MISMATCHED_RECORD"
   ?"An existing learner draft could not be verified. Original records were not overwritten."
   :"Choose and verify an existing Academy Higher Learning scholar on the Family Portal before saving local study drafts.";
  return;
 }
 lockForm(true);
 const data=result.record;
 pick.value=data.selectedProgram||"";
 status.textContent="Existing scholar recognized locally. This is not authenticated course enrollment or Account Cloud synchronization.";
 const lines=[
  "Study interest: "+(data.selectedProgram?programLabels[data.selectedProgram]:"not selected"),
  "Saved local study interests: "+data.studyRequests.length,
  "Portfolio evidence references (unverified): "+data.portfolioDrafts.length,
  "Assessment scores: not imported; each course retains assessment authority",
  "Certificate: NOT ISSUED · institutional college credits: 0 awarded by this page",
  "Encrypted Account Cloud archive: NOT SYNCED"
 ];
 const ul=document.createElement("ul");
 for(const line of lines){const li=document.createElement("li");li.textContent=line;ul.append(li);}
 summary.append(ul);
}
save.addEventListener("click",()=>{
 const outcome=service.saveProgram(pick.value);
 if(outcome.status==="LOCAL_DRAFT_SAVED")render();
 else {render();status.textContent="Study selection not saved: "+outcome.status+". No enrollment was created.";}
});
add.addEventListener("click",()=>{
 const outcome=service.addPortfolioReference(course.value,title.value);
 if(outcome.status==="LOCAL_DRAFT_SAVED"){
  title.value="";render();
  status.textContent="Unverified portfolio reference saved locally for the selected scholar. No artwork uploaded or assignment graded.";
 } else {render();status.textContent="Portfolio reference withheld: "+outcome.status+". No records changed.";}
});
for(const event of ["pageshow","focus","storage","khaemenes-student-profile-changed","khaemenes-family-backup-restored"])
 window.addEventListener(event,render);
render();
