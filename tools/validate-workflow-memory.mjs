import fs from "node:fs";import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8"), exists=p=>fs.existsSync(p);
for(const p of ["workflow/README.md","workflow/DIGEST.md","workflow/DECISIONS.md","workflow/codex/CODEX-001-ARTS-PROGRAM.md","workflow/codex/TEMPLATE.md"])assert(exists(p),"missing workflow memory file "+p);
const d=read("workflow/DIGEST.md"),dec=read("workflow/DECISIONS.md"),c=read("workflow/codex/CODEX-001-ARTS-PROGRAM.md");
for(const phrase of ["60 internal Khaemenes learning units","24 shared core + 30 concentration + 6 capstone","ARTS-111","ARTS-298"])assert(d.includes(phrase),"digest missing "+phrase);
for(const phrase of ["D-008 · Arts identity","D-009 · Arts weekly rhythm","D-010 · Arts course standard","D-015 · Arts capstone"])assert(dec.includes(phrase),"decision register missing "+phrase);
for(const phrase of ["Monday — make","Thursday — business / marketing / career","36 weeks","13 curriculum units","programs/arts/PROFESSIONAL_PRACTICE_BLUEPRINT.json"])assert(c.includes(phrase),"Arts codex missing "+phrase);
for(const p of ["programs/arts/program.json","programs/arts/PROFESSIONAL_PRACTICE_BLUEPRINT.json","programs/arts/BEST_PRACTICE_INTEGRATION.json"])assert(exists(p),"codex target missing "+p);
console.log("PASS Workflow memory contract: digest, decision register, codex index/template and Arts program codex are present and aligned to repository artifacts.");