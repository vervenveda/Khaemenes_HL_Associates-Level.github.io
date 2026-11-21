import {mountArtsSovereignTools} from "./arts-sovereign-tools-engine.js";
import {mountArtsGuidance} from "./arts-guidance-engine.js";
import {mountArtsProfessionalPractice} from "./arts-professional-practice-engine.js";
import {mountArtsVocabulary} from "./arts-vocabulary-engine.js";
import {mountArtsPortfolioCheckpoint} from "./arts-portfolio-checkpoint-engine.js";
import {mountArtsCumulativeAssessment} from "./arts-cumulative-assessment-engine.js";

const FLOOR=80;
const ok=v=>v!==null&&v!==undefined&&(typeof v!=="string"||v.trim()!=="");

function sharedInputs(){
  return [...document.querySelectorAll("[data-associate-required-input]")].map((el,i)=>({
    id:el.dataset.associateRequiredInput||el.id||("shared-input-"+i),
    value:el.type==="checkbox"?(el.checked?"complete":""):el.value
  }));
}
function sharedEvidence(){
  return [...document.querySelectorAll("[data-associate-required-evidence]")].map((el,i)=>({
    id:el.dataset.associateRequiredEvidence||el.id||("shared-evidence-"+i),
    ref:el.type==="file"?(el.files?.[0]?.name||""):el.value
  }));
}
function sharedScores(){
  return [...document.querySelectorAll("[data-associate-required-score]")].map((el,i)=>({
    id:el.dataset.associateRequiredScore||el.id||("shared-score-"+i),
    score:el.dataset.score||el.value||null,
    required:true
  }));
}
export function evaluateAssociateMastery(i={}){
  const requiredInputs=[...(i.requiredInputs||[]),...sharedInputs()];
  const requiredEvidence=[...(i.requiredEvidence||[]),...sharedEvidence()];
  const scores=[...(i.scores||[]),...sharedScores()];
  const mi=requiredInputs.filter(x=>!ok(x?.value)).map(x=>x?.id||"input");
  const fs=scores.filter(x=>x?.required!==false&&(!Number.isFinite(Number(x?.score))||Number(x.score)<FLOOR)).map(x=>({id:x?.id||"score",score:x?.score??null}));
  const me=requiredEvidence.filter(x=>!ok(x?.ref)).map(x=>x?.id||"evidence");
  const c=i.checkpoint||null;
  const cf=!!(c&&c.required!==false&&(!Number.isFinite(Number(c.score))||Number(c.score)<FLOOR));
  const mastered=!mi.length&&!fs.length&&!me.length&&!cf;
  return{status:mastered?"mastered":"needs-correction",masteryFloor:FLOOR,unlockNext:mastered,missingInputs:mi,failingScores:fs,missingEvidence:me,checkpointPassed:c?!cf:true};
}
export function issueMasteryReceipt(meta,i){
  const r=evaluateAssociateMastery(i);
  return{...meta,...r,receiptIssued:r.unlockNext,issuedAt:r.unlockNext?new Date().toISOString():null};
}
async function mountAssociateArtsLayers(){
  await mountArtsProfessionalPractice().catch(()=>false);
  await mountArtsGuidance().catch(()=>false);
  await mountArtsVocabulary().catch(()=>false);
  await mountArtsPortfolioCheckpoint().catch(()=>false);
  await mountArtsCumulativeAssessment().catch(()=>false);
  await mountArtsSovereignTools().catch(()=>false);
}
function boot(){mountAssociateArtsLayers();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
