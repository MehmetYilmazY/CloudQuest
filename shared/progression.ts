/* =========================================================================
   CloudQuest — Ekonomi & seviye kuralları (TEK KAYNAK)
   -------------------------------------------------------------------------
   Bu dosya artık SUNUCUDA otorite. İstemci sadece sonucu gösterir; XP,
   level, rank, credits ve rozetler burada hesaplanır ve Edge Function
   tarafından yazılır. İstemcide aynı sayıyı hesaplamak (optimistic UI)
   serbesttir ama bağlayıcı değildir.
   ========================================================================= */

export const START_CREDITS = 60;
export const ANSWER_COST = 25;              // ipucunu satın alma bedeli
export const MAX_WRONG_BEFORE_ANSWER = 3;   // bu kadar yanlıştan sonra ipucu bedava

/**
 * Level -> rank merdiveni. Eşikler cloudquest.ps1 ve eski game.js ile
 * BİREBİR aynı; sunucuya taşınırken denge değiştirilmedi.
 */
const RANK_LADDER: ReadonlyArray<readonly [number, string]> = [
  [12, 'Principal Cloud Wizard 🧙'],
  [10, 'Cloud Architect 🏛️'],
  [8,  'Senior Cloud Engineer'],
  [5,  'Cloud Engineer'],
  [3,  'Junior Cloud Engineer'],
  [2,  'Associate ☁️'],
  [1,  'Intern ☁️'],
];

export function rankFor(level: number): string {
  for (const [min, name] of RANK_LADDER) if (level >= min) return name;
  return RANK_LADDER[RANK_LADDER.length - 1][1];
}

/** Bir sonraki level için gereken XP. */
export function xpToNext(level: number): number {
  return level * 120;
}

export type Progress = {
  level: number;
  xp: number;
  credits: number;
  rank: string;
  badges: string[];
  completed: string[];
  freeHints: number;
};

export type Award = { xp?: number; credits?: number; badge?: string; questId?: string };

export type AwardResult = {
  next: Progress;
  leveledUp: boolean;
  levelsGained: number;
  newBadge: string | null;
};

/**
 * Ödülü uygular ve YENİ ilerlemeyi döndürür (girdiyi değiştirmez).
 * Level atlama döngüsü burada; oyunun tek yerde tanımlı kuralı budur.
 */
export function applyAward(p: Progress, award: Award): AwardResult {
  const next: Progress = {
    ...p,
    badges: [...p.badges],
    completed: [...p.completed],
  };

  next.xp += Math.max(0, award.xp ?? 0);
  next.credits += Math.max(0, award.credits ?? 0);

  const startLevel = next.level;
  // Güvenlik ağı: bozuk veri sonsuz döngüye sokmasın.
  let guard = 0;
  while (next.xp >= xpToNext(next.level) && guard++ < 1000) {
    next.xp -= xpToNext(next.level);
    next.level += 1;
  }
  next.rank = rankFor(next.level);

  let newBadge: string | null = null;
  if (award.badge && !next.badges.includes(award.badge)) {
    next.badges.push(award.badge);
    newBadge = award.badge;
  }
  if (award.questId && !next.completed.includes(award.questId)) {
    next.completed.push(award.questId);
  }

  return {
    next,
    leveledUp: next.level > startLevel,
    levelsGained: next.level - startLevel,
    newBadge,
  };
}

/** Sıfırdan başlangıç ilerlemesi (reset ve yeni hesap aynı yerden beslenir). */
export function freshProgress(): Progress {
  return {
    level: 1, xp: 0, credits: START_CREDITS, rank: rankFor(1),
    badges: [], completed: [], freeHints: 0,
  };
}
