import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../assets/associates-academy-identity-bridge.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const base=()=>({
 activeIds:()=>({familyId:'family-a',adultId:'adult-a',learnerId:'scholar-a'}),
 getFamily:()=>({familyId:'family-a',adultIds:['adult-a'],learnerIds:['scholar-a']}),
 getAdult:id=>id==='adult-a'?{adultId:id}:null,
 getLearner:id=>id==='scholar-a'?{learnerId:id,familyId:'family-a',stage:'higher',selfDirectedAdult:true,linkedAdultId:'adult-a'}:null,
 getAdultLearner:()=>null,normalizeStage:x=>x,canAdult:()=>true
});
function init(registry=base(),origin='https://vervenveda.com'){
 const subscriptions=[];
 const doc={readyState:'loading',addEventListener:(event,fn)=>subscriptions.push([event,fn]),getElementById:()=>null};
 const w={location:{origin},document:doc,KhaemenesFamilyRegistry:registry,
 addEventListener:(event,fn)=>subscriptions.push([event,fn])};
 const context={window:w,globalThis:w,Set,Object,Array,Date,String};
 vm.runInNewContext(source,context,{filename:'associates-academy-identity-bridge.js',timeout:1200});
 const state=()=>JSON.parse(JSON.stringify(w.KhaemenesAssociatesAcademyBridge.status()));
 return {state,subscriptions,api:w.KhaemenesAssociatesAcademyBridge};
}
test('bridge and canonical registry are loaded in Associate-Level home, in order',()=>{
 assert.match(html,/id="associateAcademyIdentityStatus"/);
 const i=html.indexOf('assets/khaemenes-family-registry.js');
 const j=html.indexOf('assets/associates-academy-identity-bridge.js');
 assert.ok(i>0&&j>i);
 assert.equal((html.match(/associates-academy-identity-bridge\.js/g)||[]).length,1);
});
test('valid existing Academy adult/scholar identity is recognized but never authenticated',()=>{
 const {state}=init();
 const r=state();assert.equal(r.ready,true);assert.equal(r.learnerId,'scholar-a');
 assert.equal(r.stage,'higher');assert.equal(r.programScope,'associate-level');
 assert.equal(r.authenticated,false);assert.equal(r.cloudSynced,false);assert.equal(r.canEnroll,false);
 assert.equal(r.canAwardCredit,false);
});
test('different domain is never treated as shared Academy identity',()=>{
 const r=init(base(),'https://vervenveda.github.io').state();
 assert.equal(r.ready,false);assert.equal(r.code,'academy-origin-required');
});
test('unavailable or different family, learner, adult or stage fails closed',()=>{
 for(const mutate of [
  x=>{x.getFamily=()=>null},
  x=>{x.getFamily=()=>({adultIds:[],learnerIds:['scholar-a']})},
  x=>{x.getFamily=()=>({adultIds:['adult-a'],learnerIds:[]})},
  x=>{x.getLearner=()=>({...base().getLearner('scholar-a'),familyId:'other'})},
  x=>{x.getLearner=()=>({...base().getLearner('scholar-a'),stage:'high'})},
  x=>{x.getLearner=()=>({...base().getLearner('scholar-a'),linkedAdultId:'other'})}
 ]){
  const x=base();mutate(x);assert.equal(init(x).state().ready,false);
 }
});
test('non-self-directed Higher Learning learner must have read permission',()=>{
 let x=base();x.getLearner=()=>({...base().getLearner('scholar-a'),selfDirectedAdult:false,linkedAdultId:null});
 x.canAdult=()=>false;
 assert.equal(init(x).state().code,'learner-permission-unverified');
 x.canAdult=()=>true;assert.equal(init(x).state().ready,true);
});
test('active student from another grade is never replaced by auto-created account',()=>{
 let x=base();
 x.activeIds=()=>({familyId:'family-a',adultId:'adult-a',learnerId:'grade09'});
 x.getLearner=id=>id==='grade09'?{learnerId:id,familyId:'family-a',stage:'high'}:null;
 const r=init(x).state();assert.equal(r.ready,false);
 assert.equal(r.code,'learner-mismatch');
 assert.doesNotMatch(source,/\.setActive\s*\(|\.createFamily\s*\(|\.registerLearner\s*\(|localStorage|fetch\s*\(/);
});
test('missing registry is a local selection HOLD, not an enrollment step',()=>{
 const r=init(null).state();assert.equal(r.code,'registry-unavailable');
 assert.equal(r.ready,false);
});
test('same bridge supports refresh without storing secrets or publishing learner ID in URL',()=>{
 const {api,subscriptions}=init();
 assert.equal(typeof api.refresh,'function');
 assert.ok(subscriptions.some(([name])=>name==='storage'));
 assert.match(api.familyUrl,/Khaemenes_Academy\.github\.io\/family\/$/);
 assert.match(api.adultEnrollUrl,/Khaemenes_Academy\.github\.io\/adult\/enroll\/$/);
 assert.doesNotMatch(source,/sessionStorage|indexedDB|Authorization:|password|passcode|token|api\/v1\/|STOS/i);
});
