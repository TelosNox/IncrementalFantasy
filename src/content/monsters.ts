// feinspec-kapitel1.md §6.2 - Monster- & Gate-Basiswerte (bei Einführung, vor
// g-Skalierung). 1:1-Abschrift; Zonen-Skalierung erfolgt zur Laufzeit über
// core/formulas.ts (scaleEnemyStat/scaleEnemyHp).

import type { Monster } from '../core/entities'

export const BLANDO: Monster = {
  id: 'blando',
  name: 'Blando',
  base: { hp: 40, atk: 8, def: 2, spd: 100 },
  reward: { exp: 5, gil: 4 },
  trait: 'baseline',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/blando_64.png',
}

export const CAFFIEND: Monster = {
  id: 'caffiend',
  name: 'Caffiend',
  base: { hp: 32, atk: 10, def: 2, spd: 180 },
  reward: { exp: 6, gil: 5 },
  trait: 'fast',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/caffiend_64.png',
}

export const SAFEGUARD: Monster = {
  id: 'safeguard',
  name: 'Safeguard',
  base: { hp: 75, atk: 9, def: 12, spd: 70 },
  reward: { exp: 12, gil: 10 },
  trait: 'armor',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/safeguard_64.png',
}

export const KINDLEBALE: Monster = {
  id: 'kindlebale',
  name: 'Kindlebale',
  base: { hp: 55, atk: 8, def: 3, spd: 90 },
  reward: { exp: 9, gil: 7 },
  trait: 'fireweak',
  weaknessTag: 'fire', // Teaser (weaknessUsable:false), erst ab Kapitel 2 nutzbar
  shockAffinity: 'neutral',
  sprite: 'monsters/kindlebale_64.png',
}

export const SHORTFUSE: Monster = {
  id: 'shortfuse',
  name: 'Shortfuse',
  base: { hp: 45, atk: 6, def: 3, spd: 90 },
  reward: { exp: 8, gil: 7 },
  trait: 'bomb',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/shortfuse_64.png',
}

export const FUNKUS: Monster = {
  id: 'funkus',
  name: 'Funkus',
  base: { hp: 60, atk: 7, def: 4, spd: 85 },
  reward: { exp: 10, gil: 8 },
  trait: 'poison',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/funkus_64.png',
}

export const PILFERRET: Monster = {
  id: 'pilferret',
  name: 'Pilferret',
  base: { hp: 38, atk: 6, def: 3, spd: 150 },
  reward: { exp: 7, gil: 6 },
  trait: 'drain',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'monsters/pilferret_64.png',
}

// Minibosse/Gates (isGate-Zonen, §6.3): Blandzilla (Z8, R1-Miniboss),
// Fort Knoxious (Z18, R2-Gate), Vaultron (Z30, Kapitel-Boss).
export const BLANDZILLA: Monster = {
  id: 'blandzilla',
  name: 'Blandzilla',
  base: { hp: 130, atk: 11, def: 4, spd: 90 },
  reward: { exp: 40, gil: 35 },
  trait: 'baseline',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'bosses/blandzilla_base.png',
}

export const FORT_KNOXIOUS: Monster = {
  id: 'fort_knoxious',
  name: 'Fort Knoxious',
  base: { hp: 160, atk: 12, def: 14, spd: 70 },
  reward: { exp: 70, gil: 60 },
  trait: 'armor',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'bosses/fort_knoxious_base.png',
}

export const VAULTRON: Monster = {
  id: 'vaultron',
  name: 'Vaultron',
  base: { hp: 240, atk: 14, def: 16, spd: 70 },
  reward: { exp: 140, gil: 120 },
  trait: 'boss',
  weaknessTag: null,
  shockAffinity: 'neutral',
  sprite: 'bosses/vaultron_base.png',
}

export const MONSTERS: Record<string, Monster> = {
  blando: BLANDO,
  caffiend: CAFFIEND,
  safeguard: SAFEGUARD,
  kindlebale: KINDLEBALE,
  shortfuse: SHORTFUSE,
  funkus: FUNKUS,
  pilferret: PILFERRET,
  blandzilla: BLANDZILLA,
  fort_knoxious: FORT_KNOXIOUS,
  vaultron: VAULTRON,
}

// Gates/Bosse lösen im Kampf die generische Limit-Zünden-Regel aus
// (sim_chapter1.py: use_limit_on_gate) statt der normalen Default-Gambits.
export const GATE_MONSTER_IDS = new Set(['blandzilla', 'fort_knoxious', 'vaultron'])

// Reines Präsentations-Flavor für die Bestiarium-Karte (M7) - "Vorbild"-Spalte
// aus gegner-katalog.md, kein Gameplay-Feld, daher bewusst getrennt vom
// 1:1-Schema in entities.ts/§4.2.
export const MONSTER_INSPIRED_BY: Record<string, string> = {
  blando: 'Guard Hound',
  caffiend: 'Mu',
  safeguard: 'Sahagin / Heavy Tank',
  kindlebale: 'Hedgehog Pie',
  shortfuse: 'Bomb (Self-Destruct)',
  funkus: 'Grashtrike / Zenene',
  pilferret: 'Vice',
  blandzilla: 'Guard Scorpion',
  fort_knoxious: 'Wall Market gate guard',
  vaultron: 'Shinra HQ mecha finale',
}
