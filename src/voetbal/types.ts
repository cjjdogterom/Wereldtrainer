// Generiek model: één "Champion" = één winnaar in één seizoen/editie.
// Werkt voor landskampioenen (Eredivisie), bekerwinnaars (KNVB Beker),
// Europacup/Champions League en landentoernooien (WK/EK).

export interface Champion {
  id: string;
  season: string;
  year: number;
  /** De winnaar (club of land). null = geen winnaar dat jaar. */
  winner: string | null;
  /** Plaatsbepaling: stad, land of gastland — afhankelijk van de dataset. */
  location: string | null;
  /** Dataset-specifieke periode-sleutel (bv. 'eredivisie', 'champions-league'). */
  era?: string;
  note?: string;
  /** Extra context, bv. verliezend finalist bij WK/EK. */
  extra?: string;
}

export interface EntityMeta {
  color: string;
  shortName: string;
  logo?: string;
  /** Emoji-vlag voor landenteams (WK/EK). */
  flag?: string;
  mnemonic?: string;
  mnemonicDetail?: string;
}

export interface EraDef {
  key: string;
  /** Korte tag in tabellen, bv. "Eredivisie". */
  label: string;
  /** Volledige filterlabel, bv. "Eredivisie (1956–heden)". */
  filterLabel: string;
}

export interface WinnerStats {
  winner: string;
  totalTitles: number;
  seasons: string[];
  firstTitle: string;
  lastTitle: string;
}

export interface Dataset {
  /** URL-slug, bv. 'eredivisie'. */
  id: string;
  /** Volledige titel in de header. */
  title: string;
  /** Korte titel op de keuzepagina. */
  shortTitle: string;
  subtitle: string;
  icon: string;
  theme: { primary: string; primaryDark: string; secondary: string; accent: string };

  // Teksten op de homepagina van de trainer
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  cardDescription: string;

  // Naamgeving (voor dynamische zinnen door de hele app)
  winnerNoun: string; // bv. "landskampioen"
  winnerNounPlural: string; // bv. "landskampioenen"
  entityNoun: string; // bv. "club" of "land"
  entityNounPlural: string; // bv. "clubs" of "landen"
  entityColumnLabel: string; // tabelkop voor de winnaar, bv. "Kampioen"
  locationColumnLabel: string; // tabelkop voor de plaats, bv. "Stad"
  editionNounPlural: string; // bv. "seizoenen" of "toernooien"
  /** Vraag bij jaar → winnaar. */
  questionWinner: (year: string) => string;
  /** Vraag bij winnaar → jaar. */
  questionYear: (entity: string, hint: string) => string;
  /** Hint-tekst onder het invoerveld bij jaar→winnaar. */
  winnerInputHint: string;
  winnerInputPlaceholder: string;

  champions: Champion[];
  eras: EraDef[];
  meta: Record<string, EntityMeta>;
  aliases: Record<string, string[]>;
  funFacts: string[];
  timeline: { year: string; text: string }[];
}

export type QuizMode = 'season-to-club' | 'club-to-season' | 'mixed';
export type QuizOrder = 'random' | 'chronological' | 'reverse-chronological';

export interface QuizQuestion {
  id: string;
  type: 'season-to-club' | 'club-to-season';
  question: string;
  correctAnswer: string;
  correctYear: number;
  champion: Champion;
}

export type AnswerStatus = 'pending' | 'correct' | 'fuzzy' | 'wrong' | 'approved';
