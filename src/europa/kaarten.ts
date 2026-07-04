// Historische kaarten (Wikimedia Commons) per tijdvak, plus het ontstaan
// van de huidige Europese landen.
import type { Tijdvak } from './data'

export type Kaart = {
  file: string
  titel: string
  uitleg: string
  tijdvak: Tijdvak
}

export const KAARTEN: Kaart[] = [
  { file: 'rome-117.png', titel: 'Het Romeinse Rijk op zijn hoogtepunt (117 n.Chr.)', uitleg: 'Onder keizer Trajanus omsluit het rijk de hele Middellandse Zee — van Schotland tot de Perzische Golf. Vrijwel heel Zuid- en West-Europa is Romeins.', tijdvak: 'Rome' },
  { file: 'franken-814.png', titel: 'Het rijk van Karel de Grote (814)', uitleg: 'Bij Karels dood beslaat het Frankische rijk Frankrijk, de Lage Landen, Duitsland en Noord-Italië. De deling onder zijn kleinzonen (Verdun, 843) legt de kiem voor Frankrijk en Duitsland.', tijdvak: 'Middeleeuwen' },
  { file: 'europa-1519.jpg', titel: 'De landen van Karel V (1519)', uitleg: 'Door erfenissen regeert één Habsburger over Spanje, de Nederlanden, Oostenrijk en Zuid-Italië — plus de Amerikaanse koloniën. Frankrijk ligt ingeklemd.', tijdvak: 'Vroegmoderne tijd' },
  { file: 'europa-1648.jpg', titel: 'Europa na de Vrede van Westfalen (1648)', uitleg: 'Het moderne statenstelsel begint: soevereine staten met vaste grenzen. De Republiek is erkend; Duitsland blijft een lappendeken van honderden staatjes.', tijdvak: 'Vroegmoderne tijd' },
  { file: 'europa-1812.png', titel: 'Europa onder Napoleon (1812)', uitleg: 'Vrijwel het hele continent is Frans, bondgenoot of vazal. Alleen Groot-Brittannië en Rusland staan er nog buiten — de veldtocht naar Moskou wordt Napoleons ondergang.', tijdvak: 'Moderne tijd' },
  { file: 'europa-1815.png', titel: 'Europa na het Congres van Wenen (1815)', uitleg: 'De grootmachten tekenen de kaart opnieuw: het Verenigd Koninkrijk der Nederlanden (met België), een Duitse Bond en een hersteld Frankrijk binnen oude grenzen.', tijdvak: 'Moderne tijd' },
  { file: 'europa-1914.png', titel: 'De bondgenootschappen van 1914', uitleg: 'Twee blokken staan klaar: de Centralen (Duitsland, Oostenrijk-Hongarije) tegenover de Entente (Frankrijk, Rusland, Groot-Brittannië). Eén schot in Sarajevo ontsteekt de lont.', tijdvak: 'Moderne tijd' },
  { file: 'koude-oorlog.png', titel: 'NAVO tegenover Warschaupact (1949–1990)', uitleg: 'Europa in tweeën: het westerse bondgenootschap tegenover het Sovjetblok, gescheiden door het IJzeren Gordijn dwars door Duitsland.', tijdvak: 'Moderne tijd' },
  { file: 'eu-uitbreiding.png', titel: 'De uitbreiding van de Europese Unie', uitleg: 'Van zes oprichters (1957) naar meer dan 25 lidstaten: na de val van de Muur schuift de Unie steeds verder naar het oosten op.', tijdvak: 'Moderne tijd' },
]

export type LandOntstaan = {
  land: string
  jaar: string
  sorteer: number
  hoe: string
}

export const LANDEN: LandOntstaan[] = [
  { land: 'Frankrijk', jaar: '843 / 987', sorteer: 843, hoe: 'West-Francië ontstaat bij de deling van het Frankenrijk (Verdun); met Hugo Capet (987) begint het Franse koningshuis.' },
  { land: 'Engeland', jaar: '927', sorteer: 927, hoe: 'Koning Æthelstan verenigt de Angelsaksische koninkrijken; in 1707 gaat Engeland met Schotland op in Groot-Brittannië.' },
  { land: 'Denemarken', jaar: '±958', sorteer: 958, hoe: 'Harald Blauwtand verenigt en kerstent de Denen — een van de oudste monarchieën ter wereld.' },
  { land: 'Polen', jaar: '966 / 1918', sorteer: 966, hoe: 'Met de doop van Mieszko I treedt Polen de christelijke wereld binnen; na de delingen van de 18e eeuw herrijst het pas in 1918.' },
  { land: 'Hongarije', jaar: '1000', sorteer: 1000, hoe: 'Stefanus I wordt met pauselijke zegen tot koning gekroond.' },
  { land: 'Portugal', jaar: '1143', sorteer: 1143, hoe: 'Bij het Verdrag van Zamora erkent Castilië het koninkrijk Portugal — de oudste vrijwel ongewijzigde grens van Europa.' },
  { land: 'Zwitserland', jaar: '1291 / 1648', sorteer: 1291, hoe: 'Drie bergkantons sluiten het Eedgenootschap; de onafhankelijkheid wordt in 1648 erkend.' },
  { land: 'Spanje', jaar: '1479 / 1492', sorteer: 1479, hoe: 'Het huwelijk van Isabella van Castilië en Ferdinand van Aragon verenigt de kronen; in 1492 valt Granada, het laatste Moorse rijk.' },
  { land: 'Zweden', jaar: '1523', sorteer: 1523, hoe: 'Gustav Vasa breekt uit de Kalmar-unie met Denemarken en sticht het moderne Zweden.' },
  { land: 'Rusland', jaar: '1547 / 1721', sorteer: 1547, hoe: 'Ivan de Verschrikkelijke laat zich tot tsaar kronen; Peter de Grote roept in 1721 het keizerrijk uit.' },
  { land: 'Nederland', jaar: '1581 / 1648', sorteer: 1581, hoe: 'Het Plakkaat van Verlatinghe zweert Filips II af; de Vrede van Münster bezegelt de onafhankelijkheid.' },
  { land: 'Verenigd Koninkrijk', jaar: '1707 / 1801', sorteer: 1707, hoe: 'Engeland en Schotland fuseren tot Groot-Brittannië; met Ierland erbij (1801) ontstaat het Verenigd Koninkrijk.' },
  { land: 'België', jaar: '1830', sorteer: 1830, hoe: 'Het zuiden scheidt zich af van het Verenigd Koninkrijk der Nederlanden; Leopold I wordt de eerste koning.' },
  { land: 'Griekenland', jaar: '1830', sorteer: 1831, hoe: 'Na de onafhankelijkheidsoorlog tegen de Ottomanen erkennen de grootmachten Griekenland.' },
  { land: 'Italië', jaar: '1861 / 1870', sorteer: 1861, hoe: 'Cavour en Garibaldi smeden de eenheid onder het huis Savoye; met de inname van Rome (1870) is de eenwording voltooid.' },
  { land: 'Duitsland', jaar: '1871', sorteer: 1871, hoe: 'Na de zege op Frankrijk roept Bismarck in Versailles het Duitse Keizerrijk uit — Pruisen aan het hoofd.' },
  { land: 'Noorwegen', jaar: '1905', sorteer: 1905, hoe: 'De unie met Zweden wordt vreedzaam ontbonden.' },
  { land: 'Finland', jaar: '1917', sorteer: 1917, hoe: 'Maakt zich tijdens de Russische Revolutie los van Rusland.' },
  { land: 'Ierland', jaar: '1922', sorteer: 1922, hoe: 'Na de onafhankelijkheidsoorlog wordt de Ierse Vrijstaat gevormd; Noord-Ierland blijft Brits.' },
  { land: 'Tsjechië & Slowakije', jaar: '1918 / 1993', sorteer: 1918, hoe: 'Tsjecho-Slowakije ontstaat uit Oostenrijk-Hongarije; in 1993 splitsen beide landen vreedzaam ("fluwelen scheiding").' },
  { land: 'Baltische staten', jaar: '1918 / 1991', sorteer: 1919, hoe: 'Estland, Letland en Litouwen worden onafhankelijk van Rusland, verdwijnen in de Sovjet-Unie (1940) en herwinnen hun vrijheid in 1991.' },
  { land: 'Oekraïne & Wit-Rusland', jaar: '1991', sorteer: 1991, hoe: 'Bij het uiteenvallen van de Sovjet-Unie worden vijftien republieken zelfstandig.' },
  { land: 'Balkanlanden', jaar: '1991–2008', sorteer: 1992, hoe: 'Joegoslavië valt bloedig uiteen: Slovenië en Kroatië (1991) tot Montenegro (2006) en Kosovo (2008).' },
]
