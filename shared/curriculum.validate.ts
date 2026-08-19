/* =========================================================================
   CloudQuest — müfredat doğrulama (şema + referans bütünlüğü)
   -------------------------------------------------------------------------
   Zod şeması "alanlar doğru mu?" sorusunu yanıtlar. Burası ikinci soruyu:
   "birbirlerine doğru mu bakıyorlar?" — requires zinciri, bölüm numaraları,
   story beat'lerinin işaret ettiği quest'ler, id tekrarı, kilit döngüsü.
   CI bu iki kontrolü de koşar; bozuk müfredat tarayıcıya ulaşmaz.
   ========================================================================= */
import { CurriculumSchema, type Curriculum, type Quest } from "./curriculum.schema.ts";

export type ValidationResult =
  | { ok: true; data: Curriculum; questCount: number; objectiveCount: number }
  | { ok: false; errors: string[] };

/** Story + lab quest'lerinin tamamı (tek düz liste). */
export function allQuests(c: Curriculum): Quest[] {
  return [...c.quests, ...c.modules.flatMap((m) => m.quests)];
}

export function validateCurriculum(raw: unknown): ValidationResult {
  const parsed = CurriculumSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(
      (i) => `${i.path.join(".") || "(kök)"}: ${i.message}`
    );
    return { ok: false, errors };
  }

  const c = parsed.data;
  const errors: string[] = [];
  const quests = allQuests(c);

  // 1) id tekrarı
  const seen = new Set<string>();
  for (const q of quests) {
    if (seen.has(q.id)) errors.push(`quest id tekrar ediyor: "${q.id}"`);
    seen.add(q.id);
  }

  // 2) requires gerçek bir quest'e mi bakıyor?
  for (const q of quests) {
    for (const r of q.requires) {
      if (!seen.has(r)) errors.push(`quest "${q.id}" olmayan bir quest'i gerektiriyor: "${r}"`);
    }
    if (q.requires.includes(q.id)) errors.push(`quest "${q.id}" kendini gerektiriyor`);
  }

  // 3) kilit döngüsü (a -> b -> a) — oyuncu asla açamaz
  const byId = new Map(quests.map((q) => [q.id, q]));
  const state = new Map<string, 0 | 1 | 2>(); // 0 yok, 1 ziyarette, 2 bitti
  const walk = (id: string, trail: string[]): void => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) {
      errors.push(`requires döngüsü: ${[...trail, id].join(" -> ")}`);
      return;
    }
    state.set(id, 1);
    for (const r of byId.get(id)?.requires ?? []) if (byId.has(r)) walk(r, [...trail, id]);
    state.set(id, 2);
  };
  for (const q of quests) walk(q.id, []);

  // 4) chapter numaraları tanımlı mı?
  const chapterNums = new Set(c.chapters.map((ch) => ch.n));
  for (const q of c.quests) {
    if (q.chapter === undefined) errors.push(`story quest "${q.id}" için chapter zorunlu`);
    else if (!chapterNums.has(q.chapter)) errors.push(`quest "${q.id}" tanımsız chapter: ${q.chapter}`);
  }
  for (const m of c.modules) {
    for (const q of m.quests) {
      if (q.chapter !== undefined) errors.push(`lab quest "${q.id}" chapter taşımamalı (modül: ${m.id})`);
    }
    if (m.status === "active" && m.quests.length === 0) {
      errors.push(`modül "${m.id}" active ama quest'i yok`);
    }
  }

  // 5) track'ler var olan bölümlere bakmalı, her bölüm bir track'e ait olmalı
  const covered = new Set<number>();
  for (const t of c.tracks) {
    for (const n of t.chapters) {
      if (!chapterNums.has(n)) errors.push(`track "${t.id}" tanımsız chapter: ${n}`);
      if (covered.has(n)) errors.push(`chapter ${n} birden fazla track'te`);
      covered.add(n);
    }
  }
  for (const n of chapterNums) if (!covered.has(n)) errors.push(`chapter ${n} hiçbir track'e ait değil`);

  // 6) story: act'ler track id'lerine, beat'ler quest id'lerine bakmalı
  const trackIds = new Set(c.tracks.map((t) => t.id));
  for (const actId of Object.keys(c.story.acts)) {
    if (!trackIds.has(actId)) errors.push(`story.acts."${actId}" bir track id'si değil`);
  }
  for (const beatId of Object.keys(c.story.beats)) {
    if (!seen.has(beatId)) errors.push(`story.beats."${beatId}" olmayan bir quest'e bakıyor`);
  }

  // 7) shop id tekrarı
  const shopIds = new Set<number>();
  for (const s of c.shop) {
    if (shopIds.has(s.id)) errors.push(`shop id tekrar ediyor: ${s.id}`);
    shopIds.add(s.id);
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: c,
    questCount: quests.length,
    objectiveCount: quests.reduce((n, q) => n + q.objectives.length, 0),
  };
}
