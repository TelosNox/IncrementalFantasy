// BigNumber-bewusste (De-)Serialisierung (Architektur §6): Reunion-Essenz wird als
// break_eternity-String gespeichert, nie als natives JSON-`number`.

import Decimal from 'break_eternity.js'
import type { SaveState } from './schema'

export interface SerializedSaveState extends Omit<SaveState, 'currencies'> {
  currencies: {
    reunionEssence: string
  }
}

export function serialize(state: SaveState): SerializedSaveState {
  return {
    ...state,
    currencies: {
      reunionEssence: state.currencies.reunionEssence.toString(),
    },
  }
}

export function deserialize(data: SerializedSaveState): SaveState {
  return {
    ...data,
    currencies: {
      reunionEssence: new Decimal(data.currencies.reunionEssence),
    },
  }
}

export function serializeToJson(state: SaveState): string {
  return JSON.stringify(serialize(state))
}

export function deserializeFromJson(json: string): SaveState {
  return deserialize(JSON.parse(json) as SerializedSaveState)
}
