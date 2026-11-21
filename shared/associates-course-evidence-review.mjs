/**
 * Associates academic evidence handoff v1: inspection only.
 * Source-owned attempts are never accepted as grades merely because a JSON
 * object, browser event, or self-asserted "verified" flag claims authority.
 * This module cannot issue credit, enrollment, certificates or Cloud receipts.
 */
export const EVIDENCE_SCHEMA="khaemenes-associates-course-evidence-candidate-v1";
export const EVIDENCE_STATUS=Object.freeze({
 MISSING:"NO_SOURCE_EVIDENCE",MISMATCH:"REJECTED_SCOPE",
 INVALID:"REJECTED_PROVENANCE",REVIEW:"COURSE_SOURCE_REVIEW_REQUIRED",
 BELOW:"CORRECTION_REQUIRED_UNVERIFIED",READY:"SOURCE_EVIDENCE_PRESENT_NOT_CERTIFIED"
});
const validText=v=>typeof v==="string"&&v.length>0&&v.length<=160&&!/[\u0000-\u001f\u007f]/.test(v);
const validDate=s=>typeof s==="string"&&/^\d{4}-\d\d-\d\dT/.test(s)&&Number.isFinite(Date.parse(s));
export function inspectCourseEvidence(input,{learnerId,programId,allowedCourses=[]}={}){
 const baseline={status:EVIDENCE_STATUS.MISSING,learningUnitsAwarded:0,
  certificateIssued:false,cloudSynced:false,officialGrade:null,readyForCertificate:false,
  sourceCandidateCount:0};
 if(!Array.isArray(input)||input.length===0)return {...baseline};
 if(!validText(learnerId)||!validText(programId)||!Array.isArray(allowedCourses))
  return {...baseline,status:EVIDENCE_STATUS.MISMATCH};
 let reviewed=0,below=0,invalid=0,mismatch=0;
 for(const attempt of input){
  if(!attempt||typeof attempt!=="object"||Array.isArray(attempt)||
    attempt.schema!==EVIDENCE_SCHEMA||attempt.learnerId!==learnerId||
    attempt.programId!==programId||!allowedCourses.includes(attempt.courseCode)){
   mismatch++;continue;
  }
  if(!validText(attempt.assessmentId)||!validText(attempt.sourceRepository)||
     !validText(attempt.sourcePath)||!validText(attempt.sourceVersion)||
     !validText(attempt.attemptId)||!validDate(attempt.submittedAt)||
     !["quiz","midterm","final","lab","studio","capstone","diagnostic"].includes(attempt.kind)||
     !Number.isInteger(attempt.possible)||attempt.possible<1||
     !Number.isInteger(attempt.earned)||attempt.earned<0||attempt.earned>attempt.possible||
     !Array.isArray(attempt.evidenceRefs)||attempt.evidenceRefs.some(x=>!validText(x))||
     attempt.evidenceRefs.length>40){
    invalid++;continue;
  }
  reviewed++;
  // Source candidate scores provide review guidance, NOT awardable mastery.
  if(attempt.kind!=="diagnostic"&&attempt.earned*100<attempt.possible*80)below++;
 }
 return {...baseline,
  status:mismatch?EVIDENCE_STATUS.MISMATCH:invalid?EVIDENCE_STATUS.INVALID:
   below?EVIDENCE_STATUS.BELOW:reviewed?EVIDENCE_STATUS.REVIEW:EVIDENCE_STATUS.MISSING,
  sourceCandidateCount:reviewed,belowMasteryCandidateCount:below,
  mismatchedCount:mismatch,invalidCount:invalid};
}
export function buildCertificateReview({learnerId,programId,program,sourceCandidates=[]}={}){
 const sections={sharedCore:24,concentration:30,capstone:6};
 const courseCodes=Array.isArray(program?.courses)?program.courses.map(x=>x.code):[];
 const allowedCourses=[...courseCodes,...Array.from({length:8},(_,i)=>"KHL-CORE-"+(101+i)),
  program?.capstone?.code].filter(x=>validText(x));
 const assessment=inspectCourseEvidence(sourceCandidates,{learnerId,programId,allowedCourses});
 const status=validText(learnerId)&&program?.id===programId&&
  program?.total_units===60&&program?.shared_core_units===24&&
  program?.concentration_units===30&&program?.capstone_units===6
  ?"REQUIREMENTS_FOUND_SOURCE_EVIDENCE_PENDING":"PROGRAM_OR_IDENTITY_HOLD";
 return {
  schema:"khaemenes-associates-certificate-review-v1",
  status,programId:status==="PROGRAM_OR_IDENTITY_HOLD"?null:programId,
  requirements:sections,requiredInternalLearningUnits:60,
  assessed:assessment,officialUnitsAwarded:0,officialCreditsAwarded:0,
  certificateIssued:false,transcriptCertified:false,accountCloudSynced:false,
  nextGate:"INDEPENDENT_COURSE_RECEIPTS_AND_EVALUATOR_REVIEW_REQUIRED"
 };
}
