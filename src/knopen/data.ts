// Nautische knopen: wat is het, waarvoor gebruik je hem, en waar let je op.
// Afbeeldingen: Wikimedia Commons (zie bronvermelding onderaan de module).
export type Knoop = {
  id: string
  naam: string
  engels: string
  afbeelding: string
  doel: string
  uitleg: string
  onthoud?: string
}

export const KNOPEN: Knoop[] = [
  {
    id: 'paalsteek',
    naam: 'Paalsteek',
    engels: 'Bowline',
    afbeelding: '/knopen/paalsteek.jpg',
    doel: 'Een vaste lus maken die niet dichtschuift',
    uitleg: 'Dé lus voor afmeren aan een paal of ring en voor reddingswerk: de lus blijft even groot, hoe hard je ook trekt, en is daarna toch los te krijgen.',
    onthoud: 'Het slangetje komt uit de put, om de boom heen en weer terug de put in.',
  },
  {
    id: 'achtknoop',
    naam: 'Achtknoop',
    engels: 'Figure-eight',
    afbeelding: '/knopen/achtknoop.png',
    doel: 'Stopperknoop aan het einde van een lijn',
    uitleg: 'Voorkomt dat een lijn (bijv. een schoot) door een blok of oog schiet. Dikker dan een overhandse knoop en makkelijker weer los te maken.',
  },
  {
    id: 'platte-knoop',
    naam: 'Platte knoop',
    engels: 'Reef knot',
    afbeelding: '/knopen/platte-knoop.jpg',
    doel: 'Twee even dikke lijnen verbinden (licht belast)',
    uitleg: 'Klassieke knoop voor het reven van zeilen en het samenbinden van pakken. Niet betrouwbaar als verbinding van twee lijnen onder zware last — gebruik dan een schootsteek.',
    onthoud: 'Rechts over links, links over rechts.',
  },
  {
    id: 'mastworp',
    naam: 'Mastworp',
    engels: 'Clove hitch',
    afbeelding: '/knopen/mastworp.jpg',
    doel: 'Een lijn snel aan een paal of ring vastmaken',
    uitleg: 'Twee halve steken om een rondhout. Snel gelegd en goed instelbaar — ideaal voor stootwillen aan de reling. Kan slippen bij wisselende trek; borg hem met een halve steek.',
  },
  {
    id: 'schootsteek',
    naam: 'Schootsteek',
    engels: 'Sheet bend',
    afbeelding: '/knopen/schootsteek.jpg',
    doel: 'Twee (ongelijk dikke) lijnen verbinden',
    uitleg: 'De juiste knoop om twee lijnen aan elkaar te zetten, ook als ze verschillend van dikte zijn: maak de bocht in de dikke lijn en steek met de dunne. Dubbel gestoken (dubbele schootsteek) is hij extra zeker bij gladde of natte lijnen.',
  },
  {
    id: 'ronde-torn-twee-halve-steken',
    naam: 'Ronde torn met twee halve steken',
    engels: 'Round turn and two half hitches',
    afbeelding: '/knopen/ronde-torn-twee-halve-steken.jpg',
    doel: 'Een lijn onder last aan een ring of paal zetten',
    uitleg: 'De ronde torn vangt de trek op, de twee halve steken borgen. Ook onder zware last te leggen én weer los te maken — daarom favoriet voor meerlijnen aan een ring.',
  },
  {
    id: 'trompetsteek',
    naam: 'Trompetsteek',
    engels: 'Sheepshank',
    afbeelding: '/knopen/trompetsteek.jpg',
    doel: 'Een lijn tijdelijk inkorten',
    uitleg: 'Kort een te lange lijn in zonder hem te knippen, of vangt een beschadigd stuk lijn op. Houdt alleen onder gelijkmatige trek.',
  },
  {
    id: 'vissersknoop',
    naam: 'Vissersknoop',
    engels: "Fisherman's knot",
    afbeelding: '/knopen/vissersknoop.jpg',
    doel: 'Twee dunne of gladde lijnen verbinden',
    uitleg: 'Twee overhandse knopen die tegen elkaar aanschuiven. Zeer betrouwbaar voor dun of glad materiaal (vislijn, dyneema), maar daarna nauwelijks meer los te krijgen.',
  },
  {
    id: 'stopsteek',
    naam: 'Stopsteek',
    engels: 'Rolling hitch',
    afbeelding: '/knopen/stopsteek.jpg',
    doel: 'Een lijn op een andere lijn of rondhout zetten die niet mag verschuiven',
    uitleg: 'Houdt in de lengterichting: bijvoorbeeld om de trek van een belaste schoot over te nemen of een lijn langs een verstaging te zetten. De extra torn aan de trekzijde is het geheim.',
  },
  {
    id: 'kikkersteek',
    naam: 'Beleggen op een kikker',
    engels: 'Cleat hitch',
    afbeelding: '/knopen/kikkersteek.jpg',
    doel: 'Een lijn vastzetten op een kikker',
    uitleg: 'Eerst een ronde torn om de voet, dan kruislings achtjes leggen en afsluiten met een borgslag. Zo zet je een vallen of meerlijn snel en betrouwbaar vast.',
  },
  {
    id: 'slipsteek',
    naam: 'Slipsteek',
    engels: 'Slipped knot',
    afbeelding: '/knopen/slipsteek.jpg',
    doel: 'Snel weer los te maken verbinding',
    uitleg: 'Elke knoop kun je "geslipt" afmaken door een bocht in plaats van het einde door te steken — één ruk aan het einde en hij is los. Handig als tijdelijke bevestiging.',
  },
  {
    id: 'ankersteek',
    naam: 'Ankersteek',
    engels: 'Anchor bend',
    afbeelding: '/knopen/ankersteek.jpg',
    doel: 'Een lijn aan een ankerring vastmaken',
    uitleg: 'Variant op de ronde torn waarbij de eerste halve steek dóór de torn wordt gestoken. Blijft ook betrouwbaar als de lijn nat is en de trek steeds wisselt — precies wat een ankerlijn nodig heeft.',
  },
  {
    id: 'constrictorknoop',
    naam: 'Constrictorknoop',
    engels: 'Constrictor knot',
    afbeelding: '/knopen/constrictorknoop.png',
    doel: 'Iets keihard afbinden (zak, bundel, rafelend lijneinde)',
    uitleg: 'Lijkt op de mastworp maar klemt zichzelf vast en laat vrijwel niet meer los. Perfect om een lijneinde tegen rafelen te binden of een zak te sluiten.',
  },
]
