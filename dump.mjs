import { readFileSync } from "node:fs";
import { curriculumEntries } from "./scripts/i18n.ts";
import { validateCurriculum } from "./shared/curriculum.validate.ts";
const r = validateCurriculum(JSON.parse(readFileSync("data/curriculum.json", "utf8")));
if (!r.ok) { console.error(r.errors); process.exit(1); }
const re = new RegExp(process.argv[2]);
const sel = curriculumEntries(r.data).filter(x => re.test(x.key));
console.log(JSON.stringify(Object.fromEntries(sel.map(x => [x.key, x.value])), null, 1));
