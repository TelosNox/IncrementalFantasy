// Zentrale Sprite-Zuordnung (feinspec §8) - von Stage.svelte (Kampf) und
// BestiaryModal.svelte (Bestiarium-Karte) gemeinsam genutzt, damit neue
// Assets nur an einer Stelle eingebunden werden müssen.

import claudeSprite from '../assets/characters/claude_64.png'
import barrelSprite from '../assets/characters/barrel_64.png'
import blandoSprite from '../assets/monsters/blando_64.png'
import caffiendSprite from '../assets/monsters/caffiend_64.png'
import safeguardSprite from '../assets/monsters/safeguard_64.png'
import kindlebaleSprite from '../assets/monsters/kindlebale_64.png'
import blandzillaSprite from '../assets/bosses/blandzilla_base.png'
import fortKnoxiousSprite from '../assets/bosses/fort_knoxious_base.png'

export const CHARACTER_SPRITES: Record<string, string> = {
  claude: claudeSprite,
  barrel: barrelSprite,
}

export const ENEMY_SPRITES: Record<string, string> = {
  blando: blandoSprite,
  caffiend: caffiendSprite,
  safeguard: safeguardSprite,
  kindlebale: kindlebaleSprite,
  blandzilla: blandzillaSprite,
  fort_knoxious: fortKnoxiousSprite,
}
