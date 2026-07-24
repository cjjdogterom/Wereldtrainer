// Voortgangsopslag voor de Spaanse trainer: per woord goed/fout in localStorage.
export type WoordStat = { goed: number; fout: number }
export type Voortgang = Record<string, WoordStat>

const SLEUTEL = 'leerapp-spaans-v1'

export function laadVoortgang(): Voortgang {
  try {
    const raw = localStorage.getItem(SLEUTEL)
    return raw ? (JSON.parse(raw) as Voortgang) : {}
  } catch {
    return {}
  }
}

export function bewaarVoortgang(v: Voortgang) {
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify(v))
  } catch {
    /* opslag niet beschikbaar */
  }
}

export function registreer(v: Voortgang, woordId: string, goed: boolean): Voortgang {
  const oud = v[woordId] ?? { goed: 0, fout: 0 }
  const nieuw = { ...v, [woordId]: { goed: oud.goed + (goed ? 1 : 0), fout: oud.fout + (goed ? 0 : 1) } }
  bewaarVoortgang(nieuw)
  return nieuw
}

// Een woord telt als "gekend" na minstens 2 keer goed én vaker goed dan fout.
export function isGekend(stat?: WoordStat): boolean {
  return !!stat && stat.goed >= 2 && stat.goed > stat.fout
}

// Gewicht voor de vraagselectie: onbekende en foutgevoelige woorden vaker.
export function gewicht(stat?: WoordStat): number {
  if (!stat) return 10
  if (isGekend(stat)) return 2
  return 6 + stat.fout * 3
}
