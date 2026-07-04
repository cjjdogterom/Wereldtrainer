
export interface ClubMeta {
  color: string;
  logo?: string;
  shortName: string;
  mnemonic?: string;
  mnemonicDetail?: string;
}

export const clubMeta: Record<string, ClubMeta> = {
  Ajax: {
    color: '#C8102E',
    shortName: 'AJA',
    mnemonic: 'Acht keer in de jaren 60, drie keer op rij in de jaren 80 en 2010s',
    mnemonicDetail:
      'Ajax won 36 titels! Ezelsbruggetje: groepeer per decennium — begin (1917-19), gouden jaren 30 (1930-39), naoorlogse start (1946-47, 1956-57), dominantie 1965-73 (8x!), comeback 1978-85, triple 1993-96, en recent 2010-14 + 2018-22. Onthoud: "Zestig, tachtig, tien" = Ajax domineert elke grote voetbaleeuw.',
  },
  PSV: {
    color: '#ED1C24',
    shortName: 'PSV',
    mnemonic: 'PSV = Philips Stadion Victories: reeks 1985-89 en 2000-08',
    mnemonicDetail:
      'PSV won 27 titels. Ezelsbruggetje: "Vijf op rij" (1985-89), "Zeven in de jaren 2000" (2000-08), en recent 2014-18 + 2023-26. Philips uit Eindhoven = rood-wit macht in Brabant.',
  },
  Feyenoord: {
    color: '#E30613',
    shortName: 'FEY',
    mnemonic: 'Feyenoord: de jaren 60, 70, en recent 2016-17 + 2022-23',
    mnemonicDetail:
      'Feyenoord won 16 titels. Ezelsbruggetje: "Zestig en zeventig" — 4 titels in de jaren 60, 3 in de jaren 70. Plus 1920s (1923-24, 1927-28), 1930s (1935-36, 1937-38), en de recente renaissance 2016-17 en 2022-23. Rotterdam = De Kuip = kampioen!',
  },
  HVV: {
    color: '#1B365D',
    shortName: 'HVV',
    mnemonic: 'HVV = Haagse Voetbal Vereniging: 10 titels, vooral 1899-1907',
    mnemonicDetail:
      'HVV domineerde het begin van de 20e eeuw met 10 titels. Ezelsbruggetje: "HVV Haagse Hegemonie" — 4 op rij (1899-1903), nog 2 in 1904-07, en later 1909-10 en 1913-14. Den Haag was vroeger het machtscentrum!',
  },
  'Sparta Rotterdam': {
    color: '#FF0000',
    shortName: 'SPA',
    mnemonic: 'Sparta: 4 op rij 1910-13, plus 1958-59 Eredivisie-titel',
    mnemonicDetail:
      'Sparta won 6 titels. Ezelsbruggetje: "Vier op rij voor de Eerste Wereldoorlog" (1910-13), en de verrassende Eredivisie-titel in 1958-59. Rotterdamse tweede club na Feyenoord.',
  },
  RAP: {
    color: '#006633',
    shortName: 'RAP',
    mnemonic: 'RAP = Amsterdamse kampioen: 5 titels tussen 1891-1899',
    mnemonicDetail:
      'RAP (Amsterdam) won 5 titels in de vroege jaren. Ezelsbruggetje: "RAP regeerde Amsterdam" — titels in 1891-92, 1893-94, en drie op rij 1897-99.',
  },
  'Go Ahead Eagles': {
    color: '#FFD700',
    shortName: 'GAE',
    mnemonic: 'Go Ahead: Deventer kampioen in 1917, 1922, 1930 en 1933',
    mnemonicDetail:
      '4 titels verspreid over de vroege jaren. Ezelsbruggetje: "GA Eagles vlogen hoog" in 1916-17, 1921-22, 1929-30 en 1932-33.',
  },
  HFC: {
    color: '#003366',
    shortName: 'HFC',
    mnemonic: 'HFC = Haarlemse Football Club: eerste officiële kampioen 1889/90',
    mnemonicDetail:
      'HFC won 3 vroege titels (1889/90, 1892/93, 1894/95). Ezelsbruggetje: "Haarlemse FC, de allereerste" — een van de oudste clubs van Nederland.',
  },
  HBS: {
    color: '#003087',
    shortName: 'HBS',
    mnemonic: 'HBS = Haagse Betaald Sport: 3 titels rond 1900 en 1925',
    mnemonicDetail:
      'HBS won in 1903-04, 1905-06 en 1924-25. Ezelsbruggetje: "Haagse Blauwe Sport" — afwisselend met HVV in het begin van de eeuw.',
  },
  'Willem II': {
    color: '#1E3A8A',
    shortName: 'WII',
    mnemonic: 'Willem II: Tilburg kampioen in 1916, 1952 en 1955',
    mnemonicDetail:
      '3 titels voor de Tricolores. Ezelsbruggetje: "Willem wint in de jaren 50" — 1951-52 en 1954-55 vlak voor de Eredivisie.',
  },
  AZ: {
    color: '#E30613',
    shortName: 'AZ',
    mnemonic: 'AZ = Alkmaar Zangers: 1981 en 2009 — twee verrassende titels',
    mnemonicDetail:
      '2 titels die iedereen zich herinnert: 1980-81 (met Kees Kist) en 2008-09 (Louis van Gaal). Ezelsbruggetje: "Alkmaar Zingt Kampioen" op de 1 en de 9.',
  },
  'Heracles Almelo': {
    color: '#000000',
    shortName: 'HER',
    mnemonic: 'Heracles: Almelo kampioen in 1927 en 1941',
    mnemonicDetail:
      '2 titels in oorlogstijd en tussenoorlogse periode. Ezelsbruggetje: "Heracles de sterkste held" — 1926-27 en 1940-41.',
  },
  'ADO Den Haag': {
    color: '#FFD700',
    shortName: 'ADO',
    mnemonic: 'ADO: 2 titels in de oorlogsjaren 1942 en 1943',
    mnemonicDetail:
      'Twee opeenvolgende titels tijdens WOII (1941-42 en 1942-43). Ezelsbruggetje: "ADO domineerde de oorlog" — uniek dubbel in die periode.',
  },
  RCH: {
    color: '#006633',
    shortName: 'RCH',
    mnemonic: 'RCH = Racing Club Haarlem/Heemstede: 1923 en 1953',
    mnemonicDetail:
      '2 titels: 1922-23 en 1952-53. Ezelsbruggetje: "Racing Club Haarlem" — begin en eind van het amateurtijdperk.',
  },
  'NAC Breda': {
    color: '#FFD700',
    shortName: 'NAC',
    mnemonic: 'NAC: Breda kampioen in 1921 — enige titel',
    mnemonicDetail:
      'Eén titel in 1920-21. Ezelsbruggetje: "Nooit Achteruit, Kampioen!" — de enige keer dat NAC bovenaan eindigde.',
  },
  'FC Twente': {
    color: '#C8102E',
    shortName: 'TWE',
    mnemonic: 'FC Twente: enige titel in 2010 — "Twente is kampioen!"',
    mnemonicDetail:
      'Eén Eredivisie-titel in 2009-10. Ezelsbruggetje: "Twente Tien" — het seizoen 2009/10, met McClaren als coach.',
  },
  'Roda JC': {
    color: '#FFD700',
    shortName: 'RJC',
    mnemonic: 'Roda JC (als Rapid JC): kampioen 1956, laatste voor Eredivisie',
    mnemonicDetail:
      'Als Rapid JC de laatste kampioen vóór de Eredivisie (1955-56). Ezelsbruggetje: "Rapid naar Roda" — de club fuseerde later tot Roda JC.',
  },
  DOS: {
    color: '#006633',
    shortName: 'DOS',
    mnemonic: 'DOS Utrecht: verrassende Eredivisie-titel 1958',
    mnemonicDetail:
      'Eén titel in 1957-58, het tweede Eredivisie-seizoen. Ezelsbruggetje: "DOS Direct Oppermachtig" — promovend en meteen kampioen.',
  },
  DWS: {
    color: '#003366',
    shortName: 'DWS',
    mnemonic: 'DWS Amsterdam: promoveerde en werd meteen kampioen in 1964',
    mnemonicDetail:
      'Eén titel in 1963-64. Ezelsbruggetje: "Direct Wedstrijd Spektakel" — promoveerde in 1962-63, kampioen het jaar erna!',
  },
  'VV Concordia': {
    color: '#8B0000',
    shortName: 'CON',
    mnemonic: 'Concordia Rotterdam: eerste "kampioen" 1888/89',
    mnemonicDetail:
      'Onofficiële eerste kampioen van Nederland. Ezelsbruggetje: "Concordia de eerste" — Rotterdam was er als eerste bij.',
  },
  'Quick Den Haag': {
    color: '#4169E1',
    shortName: 'QUI',
    mnemonic: 'Quick Den Haag: kampioen 1908 — snel en Haags',
    mnemonicDetail: 'Eén titel in 1907-08. Ezelsbruggetje: "Quick uit Den Haag" — snelle aanval, één keer bovenaan.',
  },
  'Be Quick 1887': {
    color: '#006633',
    shortName: 'BQG',
    mnemonic: 'Be Quick Groningen: noordelijk kampioen 1920',
    mnemonicDetail: 'Eén titel in 1919-20. Ezelsbruggetje: "Be Quick uit het Noorden" — Groningen op de kaart.',
  },
  'SC Enschede': {
    color: '#C8102E',
    shortName: 'SCE',
    mnemonic: 'SC Enschede: voorloper van FC Twente, kampioen 1926',
    mnemonicDetail: 'Eén titel in 1925-26. Ezelsbruggetje: "Enschede Sport Club" — de voorouder van FC Twente.',
  },
  'FC Den Bosch': {
    color: '#003366',
    shortName: 'BOS',
    mnemonic: 'FC Den Bosch (BVV): Brabants kampioen 1948',
    mnemonicDetail: 'Eén titel in 1947-48 als BVV. Ezelsbruggetje: "Bossche BVV" — Den Bosch bovenaan.',
  },
  SVV: {
    color: '#003366',
    shortName: 'SVV',
    mnemonic: 'SVV Schiedam: kampioen 1949',
    mnemonicDetail: 'Eén titel in 1948-49. Ezelsbruggetje: "Schiedamse Voetbal Vereniging" — één keer de beste.',
  },
  'SV Limburgia': {
    color: '#006633',
    shortName: 'LIM',
    mnemonic: 'Limburgia Brunssum: Limburgs kampioen 1950',
    mnemonicDetail: 'Eén titel in 1949-50. Ezelsbruggetje: "Limburgia de Limburgers" — Zuid-Limburg op de kaart.',
  },
  'FC Eindhoven': {
    color: '#4169E1',
    shortName: 'EIN',
    mnemonic: 'FC Eindhoven: kampioen 1954, vóór PSV-dominantie',
    mnemonicDetail: 'Eén titel in 1953-54. Ezelsbruggetje: "Eindhoven eerst" — voordat PSV de stad domineerde.',
  },
  'De Volewijckers': {
    color: '#003366',
    shortName: 'VOL',
    mnemonic: 'De Volewijckers Amsterdam: kampioen 1944',
    mnemonicDetail: 'Eén titel in 1943-44. Ezelsbruggetje: "Volewijckers uit Amsterdam-Noord" — één keer bovenaan.',
  },
  'HFC Haarlem': {
    color: '#003366',
    shortName: 'HAA',
    mnemonic: 'HFC Haarlem: kampioen na WOII in 1946',
    mnemonicDetail: 'Eén titel in 1945-46. Ezelsbruggetje: "Haarlem Hersteld" — eerste kampioen na de oorlog.',
  },
};

