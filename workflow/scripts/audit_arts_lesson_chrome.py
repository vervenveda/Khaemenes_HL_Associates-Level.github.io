#!/usr/bin/env python3
from pathlib import Path
import json, re

ROOT=Path(__file__).resolve().parents[2]
LESSON_ROOTS=[
 ROOT/"courses/tracks/arts/drawing-observation-creative-calling/lessons",
 ROOT/"courses/tracks/arts/drawing-painting-composition/lessons",
]
LANDINGS=[
 ROOT/"index.html",
 ROOT/"programs/arts/index.html",
 ROOT/"courses/tracks/arts/2d-design-color-visual-communication/index.html",
 ROOT/"courses/tracks/arts/3d-material-space-time-production/index.html",
 ROOT/"courses/tracks/arts/artist-research-critique-portfolio-writing/index.html",
 ROOT/"courses/tracks/arts/creative-enterprise-niche-market-discovery/index.html",
 ROOT/"courses/tracks/arts/drawing-observation-creative-calling/index.html",
 ROOT/"courses/tracks/arts/drawing-painting-composition/index.html",
]
REPORT=ROOT/"workflow/reports/ARTS-LESSON-CHROME-TOPOLOGY.json"
REPORT.parent.mkdir(parents=True,exist_ok=True)

CANON={
 "ticker333":"https://vervenveda.com/assets/vnv-333-ticker.js",
 "autoTicker":"https://vervenveda.com/assets/vnv-ticker-autopopulate.js",
 "header":"https://vervenveda.com/assets/vnv-header-autopopulate.js",
 "translator":"https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 "language":"https://vervenveda.com/assets/vnv-language.js?v=20261121-half-height",
 "classTools":"https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1",
 "ecosystem":"https://vervenveda.com/assets/vnv-ecosystem-toolbar.js",
}
ENROLL="https://vervenveda.com/Khaemenes_Academy.github.io/adult/enroll/"

SCRIPT_PATTERNS={
 "ticker333":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-333-ticker\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "autoTicker":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-ticker-autopopulate\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "header":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-header-autopopulate\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "translator":re.compile(r'<script\b[^>]*src=["\'][^"\']*khaemenes-translator-loader\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "language":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-language\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "classTools":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-class-tools-toolbar\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
 "ecosystem":re.compile(r'<script\b[^>]*src=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>\s*</script>',re.I),
}

def script_tag(key):
    defer=' defer' if key in ("translator","language","classTools","ecosystem") else ''
    return f'<script src="{CANON[key]}"{defer}></script>'

def count_script(s,key):
    return len(SCRIPT_PATTERNS[key].findall(s))

def normalize_scripts(s):
    for key in ("ticker333","autoTicker","header","language","classTools","ecosystem"):
        if SCRIPT_PATTERNS[key].search(s):
            s=SCRIPT_PATTERNS[key].sub(script_tag(key),s)
    if not SCRIPT_PATTERNS["translator"].search(s):
        lang=SCRIPT_PATTERNS["language"].search(s)
        if lang:
            s=s[:lang.start()]+script_tag("translator")+"\n"+s[lang.start():]
    else:
        s=SCRIPT_PATTERNS["translator"].sub(script_tag("translator"),s)
    return s

def normalize_enrollment(s):
    pat=re.compile(r'(<a\b[^>]*href=["\'])https://vervenveda\.com/Khaemenes_Academy\.github\.io/family/(["\'][^>]*>\s*Enrollment\s*</a>)',re.I)
    return pat.sub(r'\1'+ENROLL+r'\2',s)

def remove_legacy_chrome_shims(s):
    blocks=re.compile(r'<script>([\s\S]*?)</script>',re.I)
    removed={"mount_reorder":0,"translator_move":0}
    def repl(m):
        body=m.group(1)
        manual_mount=("VNV333Ticker" in body and "VNV_HEADER" in body and "VNV_TICKER" in body)
        translator_move=("vnvClassToolsToolbar" in body and "vnv-language-switch" in body)
        if manual_mount:
            removed["mount_reorder"]+=1
            return ""
        if translator_move:
            removed["translator_move"]+=1
            return ""
        return m.group(0)
    return blocks.sub(repl,s),removed

def has_translator_move_shim(s):
    return bool(re.search(r'<script>[\s\S]*?vnvClassToolsToolbar[\s\S]*?vnv-language-switch[\s\S]*?</script>',s,re.I))

def check_page(path,s,kind):
    scripts={k:count_script(s,k) for k in SCRIPT_PATTERNS}
    access={label:bool(re.search(r'>\s*'+re.escape(label)+r'\s*</a>',s,re.I)) for label in ("Learner Profile","Parent Profile","Enrollment")}
    enrollment=(re.search(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>\s*Enrollment\s*</a>',s,re.I) or [None,None])[1]
    style="\n".join(re.findall(r'<style[^>]*>([\s\S]*?)</style>',s,re.I))
    hero={
      "academy_33":bool(re.search(r'(?:\.lesson-hero\s+\.academy|\.academy|\.hero-eyebrow|\.vnv-eyebrow)[^{]*\{[^}]*33px',style,re.I)),
      "title_66":bool(re.search(r'(?:\.lesson-hero\s+h1|\.page-hero\s+h1|\.hero\s+h1)[^{]*\{[^}]*66px',style,re.I)),
      "descriptor_24":bool(re.search(r'(?:\.lesson-hero\s+\.descriptor|\.descriptor|\.desc|\.hero-description|\.vnv-descriptor)[^{]*\{[^}]*24px',style,re.I)),
    }
    return {
      "path":path.relative_to(ROOT).as_posix(),"kind":kind,
      "scripts":scripts,"script_contract":all(v==1 for v in scripts.values()),
      "access":access,"enrollment_href":enrollment,"enrollment_ok":enrollment==ENROLL,
      "hero":hero,"hero_contract":all(hero.values()),
      "about":bool(re.search(r'About\b',s,re.I)),
      "two_column_grid":bool(re.search(r'grid-template-columns\s*:\s*repeat\(2',style,re.I)),
      "footer":bool(re.search(r'<footer\b',s,re.I)),
      "footer_centered":bool(re.search(r'(?:site-footer|footer)[^{]*\{[^}]*text-align\s*:\s*center',style,re.I)),
      "radius_7_present":"7px" in style,
      "mastery_import":"associate-mastery-engine.js" in s,
      "translator_tool":bool(re.search(r'type\s*:\s*["\']translator["\']',s,re.I)),
      "custom_chrome_reorder":("VNV333Ticker" in s and "VNV_HEADER" in s and "VNV_TICKER" in s and bool(re.search(r"<script>[\s\S]*?(?:insertBefore\(|canonical-stack-ready)[\s\S]*?</script>",s,re.I))),
      "translator_move_shim":has_translator_move_shim(s),
    }

files=[]
for root in LESSON_ROOTS:
    files.extend(sorted(root.rglob("*.html")))

def is_alias(path,text):
    return path.parent.name=="lessons" and bool(re.search(r"http-equiv=['\"]refresh['\"]",text,re.I))

aliases=[]
active_files=[]
for p in files:
    txt=p.read_text(encoding="utf-8")
    if is_alias(p,txt):
        aliases.append(p)
    else:
        active_files.append(p)
files=active_files

changed=[]
before_issues=[]
for p in files:
    s=p.read_text(encoding="utf-8")
    b=check_page(p,s,"active-lesson")
    if not b["enrollment_ok"] or not b["script_contract"]:
        before_issues.append(b["path"])
    n=normalize_scripts(normalize_enrollment(s))
    n,_removed=remove_legacy_chrome_shims(n)
    if n!=s:
        p.write_text(n,encoding="utf-8")
        changed.append(p.relative_to(ROOT).as_posix())

lesson_results=[check_page(p,p.read_text(encoding="utf-8"),"active-lesson") for p in files]
landing_results=[check_page(p,p.read_text(encoding="utf-8"),"landing") for p in LANDINGS if p.exists()]

def violations(r):
    out=[]
    if not r["script_contract"]: out.append("canonical-script-count")
    if not all(r["access"].values()): out.append("academy-access-labels")
    if not r["enrollment_ok"]: out.append("enrollment-route")
    if not r["hero_contract"]: out.append("33-66-24-hero")
    if not r["about"]: out.append("about-section")
    if not r["two_column_grid"]: out.append("2-column-grid")
    if not r["footer"] or not r["footer_centered"]: out.append("centered-footer")
    if not r["radius_7_present"]: out.append("7px-radius")
    if r["kind"]=="active-lesson" and not r["mastery_import"]: out.append("mastery-engine-import")
    if r["kind"]=="active-lesson" and not r["translator_tool"]: out.append("translator-in-class-tools")
    if r["kind"]=="active-lesson" and r["custom_chrome_reorder"]: out.append("legacy-chrome-reorder-shim")
    if r["kind"]=="active-lesson" and r["translator_move_shim"]: out.append("legacy-translator-move-shim")
    return out

for r in lesson_results+landing_results:
    r["violations"]=violations(r)

summary={
 "schema":"khaemenes-arts-lesson-chrome-topology-v1",
 "active_lesson_files":len(lesson_results),
 "redirect_alias_files":len(aliases),
 "landing_files":len(landing_results),
 "files_normalized":len(changed),
 "pre_normalization_issue_files":len(before_issues),
 "post_normalization_violation_files":sum(1 for r in lesson_results+landing_results if r["violations"]),
 "lesson_custom_chrome_reorder_files":sum(1 for r in lesson_results if r["custom_chrome_reorder"]),
 "lesson_translator_move_shim_files":sum(1 for r in lesson_results if r["translator_move_shim"]),
 "lesson_mastery_import_files":sum(1 for r in lesson_results if r["mastery_import"]),
 "lesson_full_canonical_script_contract":sum(1 for r in lesson_results if r["script_contract"]),
 "lesson_correct_enrollment_route":sum(1 for r in lesson_results if r["enrollment_ok"]),
 "lesson_hero_33_66_24":sum(1 for r in lesson_results if r["hero_contract"]),
 "lesson_translator_tool":sum(1 for r in lesson_results if r["translator_tool"]),
}
report={"summary":summary,"changed":changed,"lessons":lesson_results,"landings":landing_results}
REPORT.write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
print(json.dumps(summary,indent=2))
