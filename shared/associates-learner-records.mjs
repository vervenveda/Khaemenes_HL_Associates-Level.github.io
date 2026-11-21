/**
 * Associate-Level local study/evidence record contract. No authenticated enrollment,
 * academic assessment authority, certificate issuance, or protected Account Cloud writes.
 * Self-authored entries are unverified drafts; never mastery/grades.
 */
export const PROGRAMS=Object.freeze(["arts","sciences","civics","health","business"]);
export const RECORD_SCHEMA="khaemenes-associates-learner-draft-v1";
export const MAX_EVIDENCE=40;
const clean=(v,max=120)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max);
const validId=v=>typeof v==="string"&&v.length>0&&v.length<=160&&!/[\u0000-\u001f\u007f]/.test(v);
export function storageKey(id){
 if(!validId(id))return null;
 return "khaemenes.associates.drafts.v1:learner:"+encodeURIComponent(id);
}
export function academicReview(){
 return Object.freeze({enrollment:"PROVISIONAL_LOCAL_INTEREST_ONLY",assessment:"COURSE_OWNER_NOT_VERIFIED",
  transcript:"NOT_CERTIFIED",certificate:"NOT_ISSUED",learningUnitsAwarded:0,cloud:"NOT_SYNCED"});
}
export function emptyDraft(id){
 if(!validId(id))return null;
 return {schema:RECORD_SCHEMA,learnerId:id,selectedProgram:null,studyRequests:[],
  portfolioDrafts:[],updatedAt:null};
}
export function readDraft(raw,learnerId){
 const fresh=emptyDraft(learnerId);
 if(!fresh)return null;
 if(raw===null||raw===undefined||raw==="")return fresh;
 try{
  const v=typeof raw==="string"?JSON.parse(raw):raw;
  if(!v||v.schema!==RECORD_SCHEMA||v.learnerId!==learnerId||
     !Array.isArray(v.studyRequests)||!Array.isArray(v.portfolioDrafts)||
     v.studyRequests.length>PROGRAMS.length||v.portfolioDrafts.length>MAX_EVIDENCE||
     (v.selectedProgram!==null&&!PROGRAMS.includes(v.selectedProgram)))return null;
  if(v.studyRequests.some(x=>!x||!PROGRAMS.includes(x.programId)||x.status!=="LOCAL_INTEREST"||
      typeof x.notedAt!=="string")||
     v.portfolioDrafts.some(x=>!x||!PROGRAMS.includes(x.programId)||
      !validId(x.title)||!validId(x.courseCode)||x.status!=="UNVERIFIED_REFERENCE"||
      typeof x.notedAt!=="string"))return null;
  return {schema:RECORD_SCHEMA,learnerId,selectedProgram:v.selectedProgram,
   studyRequests:v.studyRequests.map(x=>({programId:x.programId,status:"LOCAL_INTEREST",notedAt:x.notedAt})),
   portfolioDrafts:v.portfolioDrafts.map(x=>({programId:x.programId,courseCode:x.courseCode,
      title:x.title,status:"UNVERIFIED_REFERENCE",notedAt:x.notedAt})),
   updatedAt:typeof v.updatedAt==="string"?v.updatedAt:null};
 }catch{return null;}
}
export function proposeProgram(record,programId,now){
 if(!record||!PROGRAMS.includes(programId)||!Number.isFinite(Date.parse(now)))return null;
 const current=readDraft(record,record.learnerId);
 if(!current)return null;
 const existing=current.studyRequests.filter(x=>x.programId!==programId);
 const next={...current,selectedProgram:programId,
  studyRequests:[...existing,{programId,status:"LOCAL_INTEREST",notedAt:now}],
  updatedAt:now};
 return next;
}
export function recordPortfolioReference(record,courseCode,title,now){
 if(!record||!Number.isFinite(Date.parse(now)))return null;
 const current=readDraft(record,record.learnerId);
 if(!current||!current.selectedProgram||current.portfolioDrafts.length>=MAX_EVIDENCE)return null;
 const code=clean(courseCode,24).toUpperCase(),name=clean(title,120);
 // Evidence metadata only. No filenames, URLs, raw uploads, grades or passcodes.
 if(!/^(?:KHL-CORE-10[1-8]|[A-Z]{2,5}-[1-2][0-9]{2})$/.test(code)||
    !name||name.length<3)return null;
 return {...current,updatedAt:now,
  portfolioDrafts:[...current.portfolioDrafts,{programId:current.selectedProgram,
    courseCode:code,title:name,status:"UNVERIFIED_REFERENCE",notedAt:now}]};
}
export function createScholarRecordService({registryBridge,storage,clock=()=>new Date().toISOString()}={}){
 function context(){const s=registryBridge?.status?.();return s?.ready===true&&s.stage==="higher"&&
  s.authority==="browser-local-selection-only"&&s.authenticated===false&&
  s.cloudSynced===false&&validId(s.learnerId)?s:null;}
 function load(){
  const s=context(),key=s&&storageKey(s.learnerId);
  if(!key)return {status:"IDENTITY_HOLD",record:null,review:academicReview()};
  try{
   const raw=storage.getItem(key),record=readDraft(raw,s.learnerId);
   if(!record)return {status:"CORRUPT_OR_MISMATCHED_RECORD",record:null,review:academicReview()};
   return {status:"LOCAL_DRAFT_ONLY",record,review:academicReview()};
  }catch{return {status:"STORAGE_UNAVAILABLE",record:null,review:academicReview()};}
 }
 function update(transform){
  const initial=context(),key=initial&&storageKey(initial.learnerId);
  if(!key)return {status:"IDENTITY_HOLD"};
  const loaded=load();if(loaded.status!=="LOCAL_DRAFT_ONLY")return {status:loaded.status};
  const record=transform(loaded.record,clock());if(!record||record.learnerId!==initial.learnerId)
   return {status:"INVALID_DRAFT"};
  // Fail closed on profile switch while editing or between read and write.
  const latest=context();
  if(!latest||latest.learnerId!==initial.learnerId||latest.familyId!==initial.familyId||
     latest.adultId!==initial.adultId)return {status:"IDENTITY_CHANGED"};
  try{
   storage.setItem(key,JSON.stringify(record));
   const check=readDraft(storage.getItem(key),initial.learnerId);
   if(!check||JSON.stringify(check)!==JSON.stringify(record))return {status:"READBACK_FAILED"};
   return {status:"LOCAL_DRAFT_SAVED",record:check,review:academicReview()};
  }catch{return {status:"STORAGE_UNAVAILABLE"};}
 }
 return Object.freeze({
  read:load,
  saveProgram:(programId)=>update((record,at)=>proposeProgram(record,programId,at)),
  addPortfolioReference:(courseCode,title)=>update((record,at)=>recordPortfolioReference(record,courseCode,title,at)),
  academicReview
 });
}
