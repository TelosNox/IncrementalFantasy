// ui-layout.md "Mechanik-Einführung" (M17) - kanonische Liste der 13 Einführungen (Reihenfolge
// = Auftritt). Blockierendes Popup pro Eintrag (s. `ui/gameStore.svelte.ts` activeIntro/#queueIntro),
// dauerhaft nachlesbar im Codex (`ui/Codex.svelte`). Texte bewusst OHNE konkrete Zahlen (qualitativ
// formuliert) - Begründung s. Spec: Balancing aendert praktisch jeden Wert, eine Zahl im Erklaertext
// wuerde zur Falschaussage. Die drei Selbstvorstellungen (claude_intro/barrel_intro/tofa_airis_intro)
// tragen `characterIds` fuer die Portrait-Darstellung und uebernehmen die Rollen-/Entwurfszeilen aus
// `docs/spec/charaktere-party.md` (dort deutsch skizziert, hier auf Englisch uebertragen - Sprachregel
// CLAUDE.md: Code/Text immer Englisch).

export type IntroId =
  | 'claude_intro'
  | 'atb_attack'
  | 'auto_attack'
  | 'special_mp'
  | 'zone_return'
  | 'inn'
  | 'limit'
  | 'barrel_intro'
  | 'target_select'
  | 'defend'
  | 'tofa_airis_intro'
  | 'shock'
  | 'reunion'

export interface Introduction {
  id: IntroId
  title: string
  /** nur bei den drei Selbstvorstellungen gesetzt - traegt die Portrait(s) aus `ui/sprites.ts`. */
  characterIds?: string[]
  /** Absaetze, Parodie-Ton, keine konkreten Zahlen. */
  lines: string[]
}

export const INTRO_ORDER: IntroId[] = [
  'claude_intro',
  'atb_attack',
  'auto_attack',
  'special_mp',
  'zone_return',
  'inn',
  'limit',
  'barrel_intro',
  'target_select',
  'defend',
  'tofa_airis_intro',
  'shock',
  'reunion',
]

export const INTRODUCTIONS: Record<IntroId, Introduction> = {
  claude_intro: {
    id: 'claude_intro',
    title: 'Claude',
    characterIds: ['claude'],
    lines: [
      '"I\'m a cloud with a sword three sizes too big for me. No, that shouldn\'t work. I\'m doing it anyway."',
      'Balanced melee damage, front and center - the one you\'ll have from the very first fight.',
    ],
  },
  atb_attack: {
    id: 'atb_attack',
    title: 'The ATB Clock & Attack',
    lines: [
      'Every fighter fills their own action gauge over time. The moment it\'s full, they wait for your call.',
      'Tap Attack to swing right now - simple, reliable, always available.',
    ],
  },
  auto_attack: {
    id: 'auto_attack',
    title: 'Auto-Attack',
    lines: [
      'The party can now fight on its own - a gauge filling up means an automatic swing, no tapping required.',
      'Flip any fighter back to manual any time you want the wheel yourself.',
    ],
  },
  special_mp: {
    id: 'special_mp',
    title: 'Special Ability & MP',
    lines: [
      'Claude\'s Cross Slash hits far harder than a regular swing - but it draws from a personal MP pool that only refills between fights.',
      'Spend it on the fight that needs it, not the one that doesn\'t.',
    ],
  },
  zone_return: {
    id: 'zone_return',
    title: 'Zone Return',
    lines: [
      'A loss costs you a delay, not your progress. Nothing is taken away.',
      'From the sidebar you can always step back to an easier, already-cleared zone to steady yourself before pushing forward again.',
    ],
  },
  inn: {
    id: 'inn',
    title: 'The Inn',
    lines: [
      'A stay at the Inn restores the whole party over time - the only place outside of victory itself where HP and MP come back.',
      'Queue it up any time from the sidebar; it kicks in once the current fight is over.',
    ],
  },
  limit: {
    id: 'limit',
    title: 'Limit Break',
    lines: [
      'Landing hits fills a fighter\'s Limit gauge. Once it\'s full, unleash it for a devastating strike that ignores the target\'s defenses.',
      'Gate encounters like this one are built to test whether you actually use it.',
    ],
  },
  barrel_intro: {
    id: 'barrel_intro',
    title: 'Barrel',
    characterIds: ['barrel'],
    lines: [
      '"I\'m a barrel. Barrels don\'t run, barrels just stand there. If you need something to slow down - I\'m happy to talk. At length."',
      'Barrel holds the line and drags enemies down with him - control over raw speed.',
    ],
  },
  target_select: {
    id: 'target_select',
    title: 'Target Select',
    lines: [
      'Not every enemy deserves your first hit. Click any living enemy to set the party\'s focus target - everyone\'s next action aims there.',
      'Some enemies undo their own damage over time. Ignore that at your own pace.',
    ],
  },
  defend: {
    id: 'defend',
    title: 'Defend',
    lines: [
      'That charging glow on an enemy telegraphs a big attack coming due. Defend braces a fighter and softens whatever lands next.',
      'It holds until that fighter acts again - so time it for the hit that matters.',
    ],
  },
  tofa_airis_intro: {
    id: 'tofa_airis_intro',
    title: 'Tofa & Air is...',
    characterIds: ['tofa', 'airis'],
    lines: [
      '"Two hundred hits a minute. Don\'t ask how a block of tofu does that. By the time you\'re done asking, the enemy\'s already wobbling." - Tofa',
      '"I\'m a fan. I blow wounds away - purely medicinal. And if that doesn\'t work, I blow the enemy away instead." - Air is...',
      'Tofa is fast and drives the party toward Shock; Air is... keeps everyone standing with group healing. The full party is online.',
    ],
  },
  shock: {
    id: 'shock',
    title: 'Shock',
    lines: [
      'Enough punishment in a short window rattles an enemy into a vulnerable state - hits land harder while it lasts.',
      'Tofa builds toward it fastest, but any sustained pressure counts.',
    ],
  },
  reunion: {
    id: 'reunion',
    title: 'Reunion',
    lines: [
      'You\'ve reached the chapter wall. Beating it lets you reunion: the run resets to the start, but a permanent boost and lasting rewards carry over.',
      'Everything you\'ve learned about this party stays learned.',
    ],
  },
}
