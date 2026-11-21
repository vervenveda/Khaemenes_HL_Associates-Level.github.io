/* Khaemenes HL Associate-Level · Academy identity consumption bridge v1.0
 * Existing local Academy family/learner records ONLY. No new accounts,
 * registration writes, authentication, cloud sessions, credentials or storage.
 */
(function attachAssociateIdentity(global) {
  "use strict";
  if (global.KhaemenesAssociatesAcademyBridge) return;
  const VERSION="1.0.0";
  const familyUrl="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const adultEnrollUrl="https://vervenveda.com/Khaemenes_Academy.github.io/adult/enroll/";
  const noticeId="associateAcademyIdentityStatus";
  const allowedStages=new Set(["higher"]);
  const text=(value)=>String(value??"").trim();
  const snapshot=()=>{
    if (global.location?.origin!=="https://vervenveda.com") {
      return {code:"academy-origin-required",ready:false};
    }
    const R=global.KhaemenesFamilyRegistry;
    if (!R?.activeIds||!R?.getFamily||!R?.getAdult||!R?.getLearner) {
      return {code:"registry-unavailable",ready:false};
    }
    try {
      const ids=R.activeIds()||{};
      if (!ids.familyId||!ids.adultId) return {code:"selection-required",ready:false};
      const family=R.getFamily(ids.familyId),adult=R.getAdult(ids.adultId);
      if (!family||!adult||!Array.isArray(family.adultIds)||
          !family.adultIds.includes(ids.adultId)||!Array.isArray(family.learnerIds)) {
        return {code:"family-mismatch",ready:false};
      }
      // Reuse only a currently selected scholar, or the canonical self-directed
      // learner linked to the currently selected adult (without switching selection).
      const learner=ids.learnerId?R.getLearner(ids.learnerId):R.getAdultLearner?.(ids.adultId);
      if (!learner?.learnerId||learner.familyId!==ids.familyId||
          !family.learnerIds.includes(learner.learnerId)) {
        return {code:"learner-mismatch",ready:false};
      }
      const stage=R.normalizeStage?R.normalizeStage(learner.stage):text(learner.stage).toLowerCase();
      if (!allowedStages.has(stage)) return {code:"higher-scholar-required",ready:false};
      if (learner.selfDirectedAdult===true) {
        if (learner.linkedAdultId!==ids.adultId) return {code:"adult-scholar-mismatch",ready:false};
      } else if (R.canAdult?.(ids.adultId,learner.learnerId,"learner.view")!==true) {
        return {code:"learner-permission-unverified",ready:false};
      }
      return {
        code:"local-scholar-recognized",ready:true,learnerId:learner.learnerId,
        familyId:ids.familyId,adultId:ids.adultId,stage:"higher",
        programScope:"associate-level",grade:null,
        authority:"browser-local-selection-only",
        authenticated:false,cloudSynced:false,canEnroll:false,canAwardCredit:false
      };
    } catch {
      return {code:"registry-unreadable",ready:false};
    }
  };
  function render() {
    const target=global.document?.getElementById(noticeId);
    if (!target) return;
    const state=snapshot();
    target.replaceChildren();
    const title=global.document.createElement("strong");
    title.textContent=state.ready?"Existing Academy scholar located on this browser.":"Academy account connection";
    const description=global.document.createElement("p");
    description.textContent=state.ready
      ?"Your existing Higher Learning scholar selection can be used for Associate-Level study. This is browser-local recognition, not verified enrollment, cloud synchronization, or a credential."
      :"Choose an existing Academy family/scholar account first, or use the Academy adult enrollment pathway. This program does not create a second Account ID.";
    const links=global.document.createElement("p");
    const family=global.document.createElement("a");family.href=familyUrl;family.textContent="Family Portal";
    const enrollment=global.document.createElement("a");enrollment.href=adultEnrollUrl;enrollment.textContent="Adult Enrollment";
    links.append(family," · ",enrollment);
    target.append(title,description,links);
    target.dataset.identityStatus=state.code;
  }
  const api=Object.freeze({
    version:VERSION,
    status:()=>Object.freeze(snapshot()),
    refresh:render,
    familyUrl,adultEnrollUrl
  });
  global.KhaemenesAssociatesAcademyBridge=api;
  if (global.document?.readyState==="loading") {
    global.document.addEventListener("DOMContentLoaded",render,{once:true});
  } else render();
  for (const event of ["pageshow","focus","storage","khaemenes-family-backup-restored","khaemenes-student-profile-changed"]) {
    global.addEventListener?.(event,render);
  }
})(typeof window!=="undefined"?window:globalThis);
