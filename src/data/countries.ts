import rawCountries from 'world-countries'
import { dutchCapitals, dutchCountryNames } from './dutchNames'

type RawCountry = (typeof rawCountries)[number]

export type Continent = 'Wereld' | 'Afrika' | 'Azie' | 'Europa' | 'Noord-Amerika' | 'Zuid-Amerika' | 'Oceanie'

export type TrainerMode = 'landen' | 'vlaggen' | 'hoofdsteden' | 'gemengd' | 'combo'

export type Routine = 'normaal' | 'slim' | 'fouten' | 'snel'

export type Country = {
  id: string
  mapId: string
  name: string
  englishName: string
  capital: string
  capitals: string[]
  continent: Exclude<Continent, 'Wereld'>
  subregion: string
  flag: string
  latlng: [number, number]
  area: number
  aliases: string[]
}

const REGION_LABELS: Record<string, Exclude<Continent, 'Wereld'>> = {
  Africa: 'Afrika',
  Asia: 'Azie',
  Europe: 'Europa',
  Oceania: 'Oceanie',
}

const NORTH_AMERICA_SUBREGIONS = new Set(['North America', 'Central America', 'Caribbean'])

function continentFor(country: RawCountry): Country['continent'] | null {
  if (country.region === 'Americas') {
    return NORTH_AMERICA_SUBREGIONS.has(country.subregion ?? '') ? 'Noord-Amerika' : 'Zuid-Amerika'
  }

  return REGION_LABELS[country.region] ?? null
}

function displayName(country: RawCountry) {
  return dutchCountryNames[country.cca3] ?? country.translations?.nld?.common ?? country.name.common
}

function buildAliases(country: RawCountry) {
  return Array.from(
    new Set([
      displayName(country),
      country.name.common,
      country.name.official,
      country.translations?.nld?.official,
      ...(country.altSpellings ?? []),
    ].filter(Boolean)),
  )
}

function capitalNames(country: RawCountry) {
  const names = [...(dutchCapitals[country.cca3] ?? country.capital), ...country.capital]
  return Array.from(new Set(names.filter(Boolean)))
}

const manualCountries: Country[] = [
  {
    id: 'XKX',
    mapId: 'Kosovo',
    name: 'Kosovo',
    englishName: 'Kosovo',
    capital: 'Pristina',
    capitals: ['Pristina', 'Prishtina'],
    continent: 'Europa',
    subregion: 'Zuidoost-Europa',
    flag: '🇽🇰',
    latlng: [42.6, 20.9],
    area: 10908,
    aliases: ['Kosovo', 'Republic of Kosovo', 'Republiek Kosovo'],
  },
]

const datasetCountries: Country[] = rawCountries
  .filter((country) => country.independent && country.capital?.length && country.ccn3 && continentFor(country))
  .map((country) => ({
    id: country.cca3,
    mapId: country.ccn3,
    name: displayName(country),
    englishName: country.name.common,
    capital: capitalNames(country)[0],
    capitals: capitalNames(country),
    continent: continentFor(country)!,
    subregion: country.subregion ?? country.region,
    flag: country.flag,
    latlng: country.latlng as [number, number],
    area: country.area,
    aliases: buildAliases(country),
  }))

export const countries: Country[] = [...datasetCountries, ...manualCountries]
  .sort((a, b) => a.name.localeCompare(b.name, 'nl'))

export const continents: Continent[] = ['Wereld', 'Afrika', 'Azie', 'Europa', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanie']

export const modeLabels: Record<TrainerMode, string> = {
  landen: 'Landen',
  vlaggen: 'Vlaggen',
  hoofdsteden: 'Hoofdsteden',
  gemengd: 'Mix',
  combo: 'Dubbel',
}

export const routineLabels: Record<Routine, string> = {
  normaal: 'Normaal',
  slim: 'Slim herhalen',
  fouten: 'Foutenronde',
  snel: 'Sneltempo',
}
