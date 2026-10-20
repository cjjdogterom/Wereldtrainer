// Dagcursus bridge: van absolute beginner tot een stevige basis in het
// Nederlandse systeem "5-kaart hoog" met een zwakke sans (15–17).
// Eén les per dag; elke les eerst uitleg met voorbeelden, dan oefenvragen.
// De biedregels volgen exact de systeemkaart van public/bridge/biedtrainer.html.
import type { BridgeLes } from './dagcursus-types'

export const DAGCURSUS: BridgeLes[] = [
  // ════════════════════════════════════════════════════════════════
  // DEEL 1 — DE BASIS
  // ════════════════════════════════════════════════════════════════
  {
    id: 'spelers-en-windrichtingen',
    deel: 'De basis',
    titel: 'Vier spelers, twee paren',
    kern: 'Bridge speel je met vier mensen in twee vaste paren: Noord-Zuid tegen Oost-West, en alles gaat met de klok mee.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Welkom bij bridge! Bridge is een kaartspel voor precies vier spelers. Je speelt niet voor jezelf, maar samen met een vaste partner. Jij en je partner vormen een paar, en jullie spelen tegen het andere paar. Wat jullie samen bereiken, telt voor jullie allebei.',
      },
      {
        soort: 'tekst',
        tekst:
          'De vier spelers worden genoemd naar de windrichtingen, alsof de tafel een kompas is: Noord, Oost, Zuid en West (afgekort N, O, Z, W). Partners zitten altijd tegenover elkaar. Noord en Zuid vormen dus samen een paar, en Oost en West vormen het andere paar.',
      },
      {
        soort: 'tabel',
        kop: ['Plek', 'Partner'],
        rijen: [
          ['Noord (N)', 'Zuid (Z) — tegenover hem'],
          ['Oost (O)', 'West (W) — tegenover hem'],
          ['Zuid (Z)', 'Noord (N)'],
          ['West (W)', 'Oost (O)'],
        ],
      },
      { soort: 'regel', tekst: 'Partners zitten tegenover elkaar: Noord-Zuid speelt samen tegen Oost-West.' },
      {
        soort: 'tekst',
        tekst:
          'Eén speler deelt de kaarten: dat is de gever. Hij deelt het hele spel van 52 kaarten één voor één uit, met de klok mee, zodat iedereen 13 kaarten krijgt. Met de klok mee betekent: van Noord naar Oost, naar Zuid, naar West en weer terug naar Noord.',
      },
      {
        soort: 'tekst',
        tekst:
          'Ook daarna gaat alles met de klok mee: het bieden (dat leer je in les 3) en het spelen van de kaarten. De gever mag als eerste bieden. Na elk spel schuift de rol van gever één plek door, zodat iedereen om de beurt begint.',
      },
      {
        soort: 'regel',
        tekst: 'Alles gaat met de klok mee: N → O → Z → W. De gever begint met bieden.',
      },
      {
        soort: 'tekst',
        tekst:
          'Een spel bridge heeft twee fases. Eerst is er het bieden: een soort veiling waarin beide paren aangeven hoeveel slagen ze denken te kunnen halen. Daarna volgt het afspelen: de kaarten worden echt gespeeld en je kijkt of het gelukt is. In deze cursus leer je vooral het bieden, maar we beginnen bij het spelen, want het bieden draait helemaal om wat je straks met de kaarten kunt doen.',
      },
      {
        soort: 'tekst',
        tekst:
          'Je mag tijdens het spel niet met je partner overleggen of hem laten zien wat je hebt. De enige manier om informatie te geven is via je biedingen en de kaarten die je speelt. Daarom is bieden een soort taal met vaste afspraken: het systeem. Wij leren het systeem dat in Nederland het meest gespeeld wordt: "5-kaart hoog".',
      },
    ],
    vragen: [
      {
        vraag: 'Met wie speel jij samen als je op Zuid zit?',
        opties: ['Met Oost', 'Met West', 'Met Noord', 'Met niemand, iedereen speelt voor zichzelf'],
        goed: 2,
        uitleg: 'Partners zitten tegenover elkaar. Tegenover Zuid zit Noord, dus Noord-Zuid vormt een paar.',
      },
      {
        vraag: 'Hoeveel kaarten krijgt elke speler?',
        opties: ['13', '10', '12', '52'],
        goed: 0,
        uitleg: 'Het spel heeft 52 kaarten en er zijn vier spelers: 52 gedeeld door 4 is 13 kaarten per persoon.',
      },
      {
        vraag: 'West is aan de beurt. Wie komt daarna?',
        opties: ['Oost', 'Zuid', 'West nog een keer', 'Noord'],
        goed: 3,
        uitleg: 'Alles gaat met de klok mee: N → O → Z → W → en dan weer N. Na West komt dus Noord.',
      },
      {
        vraag: 'Wie mag als eerste bieden?',
        opties: ['Altijd Noord', 'De gever', 'De speler met de meeste azen', 'De speler links van de gever'],
        goed: 1,
        uitleg: 'De gever begint met bieden. Daarna gaat het met de klok mee rond.',
      },
      {
        vraag: 'Hoe mag je je partner laten weten wat voor kaarten je hebt?',
        opties: [
          'Door het hardop te zeggen',
          'Door je kaarten even te laten zien',
          'Alleen via je biedingen en de kaarten die je speelt',
          'Door te knipogen bij een goede hand',
        ],
        goed: 2,
        uitleg: 'Overleggen mag niet. Bieden is de afgesproken taal waarmee je partner informatie krijgt; daarom leer je een vast systeem.',
      },
    ],
  },
  {
    id: 'slagen-bekennen-troef',
    deel: 'De basis',
    titel: 'Slagen, bekennen en troef',
    kern: 'Elke ronde van vier kaarten is een slag; je moet de gevraagde kleur bekennen, en een troefkaart wint van elke andere kleur.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Een kaartspel heeft vier kleuren: schoppen ♠, harten ♥, ruiten ♦ en klaveren ♣. Elke kleur heeft dertien kaarten. De hoogste is de aas (A), dan de heer (H), de vrouw (V), de boer (B), en daarna de 10, 9, 8 en zo verder tot de 2. Aas, heer, vrouw en boer noemen we samen de honneurs.',
      },
      {
        soort: 'tabel',
        kop: ['Afkorting', 'Kaart'],
        rijen: [
          ['A', 'Aas — de hoogste kaart'],
          ['H', 'Heer'],
          ['V', 'Vrouw'],
          ['B', 'Boer'],
          ['10 … 2', 'De kleine kaarten, van hoog naar laag'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'Het afspelen gaat in rondes. Iemand legt een kaart open op tafel: hij komt uit. Daarna legt elke speler, met de klok mee, ook één kaart. Die vier kaarten samen heten een slag. Wie de hoogste kaart heeft gelegd, wint de slag voor zijn paar en mag de volgende slag beginnen. Omdat iedereen 13 kaarten heeft, zijn er in elk spel precies 13 slagen te verdelen.',
      },
      { soort: 'regel', tekst: 'Een slag = vier kaarten, één van iedere speler. Er zijn 13 slagen per spel.' },
      {
        soort: 'tekst',
        tekst:
          'De belangrijkste regel bij het spelen is bekennen. De eerste kaart van een slag bepaalt welke kleur er gevraagd wordt. Heb je die kleur, dan moet je hem bijspelen; dat heet bekennen. Je mag zelf kiezen welke kaart van die kleur je legt, hoog of laag. Alleen als je de gevraagde kleur niet (meer) hebt, mag je een andere kaart leggen.',
      },
      { soort: 'regel', tekst: 'Bekennen is verplicht: heb je de gevraagde kleur, dan moet je die spelen.' },
      {
        soort: 'tekst',
        tekst:
          'Normaal wint de hoogste kaart in de gevraagde kleur. Een kaart van een andere kleur is waardeloos, hoe hoog ook. Behalve als er een troefkleur is. Troef is een kleur die tijdens dit spel boven alle andere staat. Kun je niet bekennen, dan mag je een troefkaart leggen: dat heet introeven. Zelfs de troef-2 wint dan van een aas in een andere kleur.',
      },
      {
        soort: 'tekst',
        tekst:
          'Een voorbeeld: harten is troef. Oost komt uit met de ♠A. Zuid heeft geen schoppen meer en legt de ♥2. Zuid wint de slag, want harten is troef. Leggen meerdere spelers troef, dan wint de hoogste troef. Of er een troefkleur is, en welke, wordt beslist tijdens het bieden. Er kan ook zonder troef gespeeld worden: dat heet sans atout (afgekort SA).',
      },
      { soort: 'regel', tekst: 'Kun je niet bekennen, dan mag je introeven: de laagste troef wint van elke kaart in een andere kleur.' },
    ],
    vragen: [
      {
        vraag: 'Oost komt uit met ♦5. Jij hebt nog ♦H en ♦3. Wat mag je spelen?',
        opties: ['Elke kaart die je wilt', 'De ♦H of de ♦3 — je moet ruiten bekennen', 'Alleen de ♦H', 'Een troefkaart'],
        goed: 1,
        uitleg: 'Je hebt ruiten, dus je moet bekennen. Welke ruiten je legt, mag je zelf kiezen.',
      },
      {
        vraag: 'Schoppen is troef. Er wordt klaveren gespeeld en je hebt geen klaveren meer. Wat mag je doen?',
        opties: [
          'Niets, je moet passen',
          'Alleen een harten leggen',
          'Introeven met een schoppen, of een andere kaart weggooien',
          'Een kaart terugnemen',
        ],
        goed: 2,
        uitleg: 'Als je niet kunt bekennen, ben je vrij: je mag introeven met troef, maar je mag ook een andere kleur weggooien.',
      },
      {
        vraag: 'Harten is troef. In een slag liggen: ♣A, ♣H, ♥3 en ♣V. Welke kaart wint?',
        opties: ['♣A', '♣H', '♣V', '♥3'],
        goed: 3,
        uitleg: 'Een troefkaart wint van elke kaart in een andere kleur, dus de ♥3 wint, ook al is het maar een drietje.',
      },
      {
        vraag: 'Hoeveel slagen zijn er in totaal in één spel?',
        opties: ['13', '4', '26', '52'],
        goed: 0,
        uitleg: 'Iedere speler heeft 13 kaarten en speelt per slag één kaart, dus er zijn 13 slagen.',
      },
      {
        vraag: 'Wat betekent "sans atout" (SA)?',
        opties: ['Er wordt zonder troef gespeeld', 'Schoppen is troef', 'Je hoeft niet te bekennen', 'De aas telt niet mee'],
        goed: 0,
        uitleg: 'Sans atout is Frans voor "zonder troef": de hoogste kaart in de gevraagde kleur wint altijd.',
      },
    ],
  },
  {
    id: 'het-contract-en-de-biedladder',
    deel: 'De basis',
    titel: 'Het contract en de biedladder',
    kern: 'Een bod zegt hoeveel slagen boven de zes je samen belooft en in welke troefkleur; elk bod moet hoger zijn dan het vorige.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Voordat er gespeeld wordt, is er het bieden. Je kunt het zien als een veiling: beide paren strijden om het recht om de troefkleur te kiezen. In ruil daarvoor beloof je een aantal slagen te halen. Het laatste bod in de veiling wordt het contract: de afspraak die het spelende paar moet waarmaken.',
      },
      {
        soort: 'tekst',
        tekst:
          'Een bod bestaat uit een getal en een kleur, bijvoorbeeld 2♥. Het getal heet het niveau en loopt van 1 tot 7. Het niveau is altijd het aantal slagen bovenop zes. De eerste zes slagen tellen niet mee; die heten het boek. Wie 2♥ biedt, belooft dus 6 + 2 = 8 slagen te halen met harten als troef.',
      },
      { soort: 'regel', tekst: 'Aantal slagen dat je belooft = 6 + het niveau. 1♠ = 7 slagen, 4♥ = 10 slagen, 3SA = 9 slagen.' },
      {
        soort: 'tabel',
        kop: ['Bod', 'Je belooft'],
        rijen: [
          ['1-niveau', '7 slagen'],
          ['2-niveau', '8 slagen'],
          ['3-niveau', '9 slagen'],
          ['4-niveau', '10 slagen'],
          ['5-niveau', '11 slagen'],
          ['6-niveau', '12 slagen'],
          ['7-niveau', 'alle 13 slagen'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'De kleuren hebben bij het bieden een vaste volgorde, van laag naar hoog: klaveren ♣, ruiten ♦, harten ♥, schoppen ♠ en als hoogste sans atout (SA). Klaveren en ruiten heten de lage kleuren, harten en schoppen de hoge kleuren. Er zit geen logica achter, het is gewoon zo afgesproken; met een beetje oefening zit het er snel in. Onthoud: ♣ ♦ ♥ ♠ SA.',
      },
      {
        soort: 'tekst',
        tekst:
          'Zet je alle biedingen onder elkaar, dan krijg je de biedladder: 1♣, 1♦, 1♥, 1♠, 1SA, dan 2♣, 2♦, 2♥, 2♠, 2SA, en zo verder tot 7SA. Elk nieuw bod moet hoger op de ladder staan dan het vorige bod. Na 1♠ mag je dus 1SA bieden, maar wil je harten bieden, dan moet het minstens 2♥ zijn.',
      },
      { soort: 'regel', tekst: 'Volgorde van laag naar hoog: ♣ ♦ ♥ ♠ SA. Elk bod moet hoger zijn dan het vorige.' },
      {
        soort: 'tekst',
        tekst:
          'In plaats van een bod mag je altijd passen: je biedt dan niets. Het bieden stopt zodra er na een bod drie keer achter elkaar gepast is. Het laatste bod is dan het contract. Passen alle vier spelers meteen, dan wordt het spel niet gespeeld en gaan de kaarten weer in de doos.',
      },
      {
        soort: 'serie',
        stappen: [
          { wie: 'N', bod: '1♥' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '2♥' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '4♥' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: 'pas' },
          { wie: 'W', bod: 'pas' },
        ],
        uitleg:
          'Noord is gever en biedt 1♥. Na het bod 4♥ wordt er drie keer gepast, dus het contract is 4♥: Noord-Zuid moeten 6 + 4 = 10 slagen halen met harten als troef.',
      },
    ],
    vragen: [
      {
        vraag: 'Hoeveel slagen beloof je met een bod van 3SA?',
        opties: ['3', '6', '10', '9'],
        goed: 3,
        uitleg: 'Het niveau komt bovenop de zes slagen van het boek: 6 + 3 = 9 slagen.',
      },
      {
        vraag: 'Het laatste bod was 2♠. Welk bod mag jij NIET doen?',
        opties: ['2♥', '2SA', '3♣', 'Pas'],
        goed: 0,
        uitleg: 'Harten staat onder schoppen op de ladder, dus 2♥ is lager dan 2♠. Je moet minstens 2SA of 3-iets bieden, of passen.',
      },
      {
        vraag: 'Wat is de juiste volgorde van laag naar hoog?',
        opties: ['♠ ♥ ♦ ♣ SA', '♣ ♦ ♥ ♠ SA', 'SA ♣ ♦ ♥ ♠', '♣ ♥ ♦ ♠ SA'],
        goed: 1,
        uitleg: 'Klaveren is het laagst, dan ruiten, harten, schoppen, en sans atout staat bovenaan.',
      },
      {
        vraag: 'Wanneer is het bieden afgelopen?',
        opties: [
          'Als iemand 4♥ biedt',
          'Na precies vier biedingen',
          'Als er na een bod drie keer achter elkaar gepast is',
          'Als de gever opnieuw aan de beurt is',
        ],
        goed: 2,
        uitleg: 'Drie passen achter elkaar sluiten de veiling. Het laatste echte bod is het contract.',
      },
      {
        vraag: 'Welke kleuren zijn de "hoge kleuren"?',
        opties: ['Klaveren en ruiten', 'Ruiten en harten', 'Schoppen en klaveren', 'Harten en schoppen'],
        goed: 3,
        uitleg: 'Harten en schoppen zijn de hoge kleuren; klaveren en ruiten de lage. Dat onderscheid is in het hele systeem heel belangrijk.',
      },
    ],
  },
  {
    id: 'leider-dummy-uitkomst',
    deel: 'De basis',
    titel: 'Leider, dummy en de uitkomst',
    kern: 'De leider speelt het contract met beide handen, zijn partner legt als dummy de kaarten open, en links van de leider komt uit.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Als het bieden klaar is, weten we het contract en welk paar het moet spelen. Maar van dat paar speelt maar één persoon echt: de leider. De leider is de speler die als eerste de kleur van het contract noemde. Was het contract 4♥ en bood Noord als eerste harten, dan is Noord de leider, ook al bood Zuid uiteindelijk 4♥.',
      },
      { soort: 'regel', tekst: 'Leider = wie van het spelende paar als eerste de kleur (of SA) van het contract bood.' },
      {
        soort: 'tekst',
        tekst:
          'De partner van de leider heet de dummy (in het Nederlands ook wel "blinde"). Zodra de eerste kaart gespeeld is, legt de dummy al zijn kaarten open op tafel, netjes per kleur gesorteerd. Vanaf dat moment doet de dummy niet meer mee: de leider bepaalt welke kaarten er uit de dummy gespeeld worden. De leider speelt dus met 26 kaarten: zijn eigen 13 en die van de dummy.',
      },
      {
        soort: 'tekst',
        tekst:
          'De twee andere spelers zijn de verdedigers (of tegenspelers). Hun doel is te voorkomen dat de leider genoeg slagen haalt. Zij zien elkaars kaarten niet; ze moeten samenwerken door slim te spelen.',
      },
      {
        soort: 'tekst',
        tekst:
          'De eerste kaart van het spel heet de uitkomst. Die wordt altijd gespeeld door de verdediger links van de leider (de speler die na de leider aan de beurt is). Pas daarna gaat de dummy open. De uitkomst gebeurt dus blind: de verdediger ziet alleen zijn eigen kaarten. Hoe je goed uitkomt, leer je in de laatste les.',
      },
      { soort: 'regel', tekst: 'De speler links van de leider komt uit. Daarna legt de dummy zijn kaarten open.' },
      {
        soort: 'serie',
        stappen: [
          { wie: 'Z', bod: '1♠' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '2♠' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '4♠' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: 'pas' },
          { wie: 'O', bod: 'pas' },
        ],
        uitleg:
          'Contract 4♠ voor Noord-Zuid. Zuid noemde als eerste schoppen, dus Zuid is de leider en Noord de dummy. West zit links van Zuid en komt uit. Daarna legt Noord zijn kaarten open.',
      },
      {
        soort: 'tabel',
        kop: ['Rol', 'Wat doet hij?'],
        rijen: [
          ['Leider', 'Speelt het contract, met zijn eigen kaarten én die van de dummy'],
          ['Dummy', 'Legt na de uitkomst alles open en speelt verder niet mee'],
          ['Verdedigers', 'Proberen het contract te laten mislukken (down te spelen)'],
          ['Uitkomst', 'De eerste kaart, door de verdediger links van de leider'],
        ],
      },
    ],
    vragen: [
      {
        vraag: 'Bieden: N 1♦ – Z 1♥ – N 2♥ – Z 4♥, daarna drie keer pas. Wie is de leider?',
        opties: ['Noord, want die opende', 'Zuid, want die bood als eerste harten', 'Oost', 'Degene die het laatst bood'],
        goed: 1,
        uitleg: 'Het contract is in harten, en Zuid noemde harten als eerste. Dus Zuid is leider, ook al opende Noord.',
      },
      {
        vraag: 'Oost is de leider. Wie komt uit?',
        opties: ['Noord', 'West', 'Oost zelf', 'Zuid'],
        goed: 3,
        uitleg: 'De speler links van de leider komt uit: na Oost komt (met de klok mee) Zuid.',
      },
      {
        vraag: 'Wanneer legt de dummy zijn kaarten open?',
        opties: ['Direct na de uitkomst', 'Voor het bieden', 'Aan het eind van het spel', 'Na de eerste slag'],
        goed: 0,
        uitleg: 'De uitkomst wordt blind gedaan; direct daarna gaat de dummy open op tafel.',
      },
      {
        vraag: 'Wie bepaalt welke kaarten de dummy speelt?',
        opties: ['De dummy zelf', 'De verdedigers', 'De leider', 'Om de beurt'],
        goed: 2,
        uitleg: 'De dummy speelt niet meer mee; de leider kiest de kaarten uit beide handen.',
      },
    ],
  },
  {
    id: 'deelscore-manche-slem',
    deel: 'De basis',
    titel: 'Deelscore, manche en slem',
    kern: 'Een manche (3SA, 4♥/4♠, 5♣/5♦) levert een flinke bonus op; mik daarop met samen 25 punten, op klein slem met 33, groot slem met 37.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Waarom zou je hoog bieden als je laag ook kunt spelen? Omdat de puntentelling hoge contracten beloont. Elke slag boven het boek levert punten op, maar de echte klapper is de bonus voor een manche: een contract dat zo hoog is dat je in één keer genoeg slagpunten maakt.',
      },
      {
        soort: 'tabel',
        kop: ['Contract', 'Slagen nodig'],
        rijen: [
          ['3SA', '9 slagen — de goedkoopste manche'],
          ['4♥ of 4♠', '10 slagen'],
          ['5♣ of 5♦', '11 slagen — duur, dus minder populair'],
          ['Klein slem (6-niveau)', '12 slagen'],
          ['Groot slem (7-niveau)', 'alle 13 slagen'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'Een contract onder de manche, zoals 2♥ of 3♦, heet een deelscore. Dat levert een klein beetje op. Een manche levert een grote bonus op, en een slem (12 of 13 slagen) een nog veel grotere. Maar let op: haal je je contract niet, dan ga je down en krijgt de tegenpartij punten. Te hoog bieden wordt dus gestraft.',
      },
      { soort: 'regel', tekst: 'Manche = 3SA, 4♥, 4♠, 5♣ of 5♦. Lager is een deelscore, 6- of 7-niveau is slem.' },
      {
        soort: 'tekst',
        tekst:
          'Hoe weet je of jullie samen sterk genoeg zijn voor een manche? Daarvoor tel je punten: elke honneur is een aantal punten waard (dat leer je in de volgende les). In het hele spel zitten 40 punten. Uit de ervaring van miljoenen spellen komen drie vuistregels, die je bij elk bod gebruikt.',
      },
      {
        soort: 'tabel',
        kop: ['Samen', 'Doel'],
        rijen: [
          ['minder dan 25 punten', 'Deelscore: blijf laag'],
          ['25 punten of meer', 'Manche'],
          ['33 punten of meer', 'Klein slem (12 slagen)'],
          ['37 punten of meer', 'Groot slem (13 slagen)'],
        ],
      },
      { soort: 'regel', tekst: 'Samen 25 punten → manche. Samen 33 → klein slem. Samen 37 → groot slem.' },
      {
        soort: 'tekst',
        tekst:
          'Het hele bieden draait dus om twee vragen. Eén: hebben we samen 25 punten of meer (manche of niet)? Twee: in welke kleur spelen we? Een kleur is geschikt als troef als jullie er samen minstens acht kaarten van hebben. Zo’n gezamenlijke kleur heet een fit. Heb je geen fit, dan speel je vaak in sans atout.',
      },
      { soort: 'regel', tekst: 'Een fit = samen 8 of meer kaarten in één kleur. Die kleur wordt troef.' },
      {
        soort: 'tekst',
        tekst:
          'Waarom liefst een fit in een hoge kleur? Voor 4♥ of 4♠ heb je tien slagen nodig, voor 5♣ of 5♦ elf. Met een fit in de lage kleuren speel je daarom meestal liever 3SA. Daarom zoek je in het bieden altijd eerst naar een fit in harten of schoppen. Dat idee komt in elke les terug.',
      },
    ],
    vragen: [
      {
        vraag: 'Welk contract is GEEN manche?',
        opties: ['3SA', '4♠', '3♥', '5♦'],
        goed: 2,
        uitleg: '3♥ is een deelscore. De hartenmanche is pas 4♥ (10 slagen).',
      },
      {
        vraag: 'Jullie hebben samen 26 punten. Waar mik je op?',
        opties: ['Een deelscore', 'Een manche', 'Klein slem', 'Groot slem'],
        goed: 1,
        uitleg: 'Samen 25 of meer is genoeg voor een manche. Voor klein slem heb je 33 nodig.',
      },
      {
        vraag: 'Wat is een fit?',
        opties: [
          'Een hand met veel punten',
          'Een kleur waarin je zelf vijf kaarten hebt',
          'Een kleur waarin je met je partner samen minstens 8 kaarten hebt',
          'Een contract dat precies gehaald wordt',
        ],
        goed: 2,
        uitleg: 'Een fit is een gezamenlijke kleur van 8+ kaarten. Die kleur kun je goed als troef gebruiken.',
      },
      {
        vraag: 'Hoeveel slagen heb je nodig voor klein slem?',
        opties: ['10', '11', '13', '12'],
        goed: 3,
        uitleg: 'Klein slem is het 6-niveau: 6 + 6 = 12 slagen. Groot slem (7-niveau) is alle 13.',
      },
      {
        vraag: 'Waarom zoek je liever een fit in harten of schoppen dan in klaveren of ruiten?',
        opties: [
          'Omdat de manche daar al op 4-niveau ligt in plaats van 5',
          'Omdat lage kleuren niet als troef mogen',
          'Omdat hoge kleuren meer kaarten hebben',
          'Omdat de dummy dat prettiger vindt',
        ],
        goed: 0,
        uitleg: '4♥/4♠ vraagt 10 slagen, 5♣/5♦ vraagt er 11. Een hoge-kleurenmanche is dus een slag goedkoper.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DEEL 2 — JE HAND WAARDEREN
  // ════════════════════════════════════════════════════════════════
  {
    id: 'honneurpunten-tellen',
    deel: 'Je hand waarderen',
    titel: 'Honneurpunten tellen',
    kern: 'Tel je kracht met honneurpunten: aas 4, heer 3, vrouw 2, boer 1 — in het hele spel zitten er 40.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Om te weten hoe sterk je hand is, tel je punten. De hoge kaarten winnen de meeste slagen, dus die krijgen een waarde. Dit heten honneurpunten (vaak afgekort tot HCP, van het Engelse "high card points"). Kleine kaarten, van de 10 tot de 2, zijn nul punten waard.',
      },
      {
        soort: 'tabel',
        kop: ['Kaart', 'Punten'],
        rijen: [
          ['Aas (A)', '4'],
          ['Heer (H)', '3'],
          ['Vrouw (V)', '2'],
          ['Boer (B)', '1'],
          ['10 en lager', '0'],
        ],
      },
      { soort: 'regel', tekst: 'Aas 4 · Heer 3 · Vrouw 2 · Boer 1. Per kleur 10 punten, in het hele spel 40.' },
      {
        soort: 'tekst',
        tekst:
          'Elke kleur heeft één aas, heer, vrouw en boer: samen 4 + 3 + 2 + 1 = 10 punten. Vier kleuren maal 10 is 40 punten in het hele spel. Gemiddeld heeft iedere speler dus 10 punten. Heb je er meer, dan is je hand sterker dan gemiddeld; heb je er minder, dan zwakker.',
      },
      {
        soort: 'tekst',
        tekst:
          'Tel rustig kleur voor kleur, van schoppen naar klaveren, en tel de tussenstanden op. Na een paar dagen gaat het vanzelf. Een handige controle: tel eerst alle azen (elk 4), dan de heren, enzovoort.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H 7 4', h: 'V 9 3', d: 'B 8 6 2', c: 'H 5' },
        titel: '13 honneurpunten',
        uitleg:
          'Schoppen: aas 4 + heer 3 = 7. Harten: vrouw = 2, totaal 9. Ruiten: boer = 1, totaal 10. Klaveren: heer = 3, totaal 13. Dit is een hand boven het gemiddelde van 10.',
      },
      {
        soort: 'hand',
        hand: { s: '9 6 3', h: 'A B 8 5', d: 'H V 4', c: '10 7 2' },
        titel: '10 honneurpunten — precies gemiddeld',
        uitleg:
          'Schoppen: geen honneurs, 0. Harten: aas 4 + boer 1 = 5. Ruiten: heer 3 + vrouw 2 = 5, totaal 10. Klaveren: de 10 telt niet, dus 10 punten. Precies een gemiddelde hand.',
      },
      {
        soort: 'tekst',
        tekst:
          'Waarom is dit zo handig? Omdat je met punten kunt rekenen. Weet je hoeveel punten je partner ongeveer heeft, dan tel je die bij de jouwe op en kijk je naar de vuistregels uit les 5: samen 25 punten voor een manche. Bieden is dus voor een groot deel rekenen.',
      },
    ],
    vragen: [
      {
        vraag: 'Hoeveel honneurpunten zitten er in het hele spel?',
        opties: ['30', '52', '40', '10'],
        goed: 2,
        uitleg: 'Per kleur 4 + 3 + 2 + 1 = 10, en er zijn vier kleuren: 40 punten.',
      },
      {
        vraag: 'Hoeveel honneurpunten heeft deze hand?',
        hand: { s: 'A V 6', h: 'H 8 5 3', d: 'B 9 2', c: 'A 7 4' },
        opties: ['12', '13', '14', '15'],
        goed: 2,
        uitleg: 'Aas 4 + vrouw 2 + heer 3 + boer 1 + aas 4 = 14 punten.',
      },
      {
        vraag: 'Hoeveel honneurpunten heeft deze hand?',
        hand: { s: 'H B 5 2', h: '7 4', d: 'A V 10 6', c: '9 8 3' },
        opties: ['10', '9', '11', '8'],
        goed: 0,
        uitleg: 'Heer 3 + boer 1 + aas 4 + vrouw 2 = 10 punten. De 10 telt niet mee.',
      },
      {
        vraag: 'Hoeveel punten is een vrouw waard?',
        opties: ['4', '3', '1', '2'],
        goed: 3,
        uitleg: 'Aas 4, heer 3, vrouw 2, boer 1.',
      },
      {
        vraag: 'Hoeveel honneurpunten heeft deze hand?',
        hand: { s: '8 6 4 2', h: 'V 7 3', d: 'H 9 5', c: 'B 10 6' },
        opties: ['5', '6', '7', '8'],
        goed: 1,
        uitleg: 'Vrouw 2 + heer 3 + boer 1 = 6 punten. Een zwakke hand.',
      },
    ],
  },
  {
    id: 'lengtepunten-en-verdeling',
    deel: 'Je hand waarderen',
    titel: 'Lengtepunten en verdeling',
    kern: 'Tel 1 lengtepunt voor elke kaart boven de vier in een kleur; honneurpunten plus lengtepunten is je totale kracht.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Niet alleen hoge kaarten maken slagen; lange kleuren ook. Heb je zes harten en zijn alle hogere harten gespeeld, dan zijn je laatste kleine harten winnaars omdat niemand anders nog harten heeft. Daarom tellen we in ons systeem ook lengtepunten.',
      },
      { soort: 'regel', tekst: 'Lengtepunten: 1 punt per kaart boven de vier. 5-kaart +1, 6-kaart +2, 7-kaart +3.' },
      {
        soort: 'tekst',
        tekst:
          'Je totale kracht is honneurpunten plus lengtepunten. Als in deze cursus staat "13 punten", dan bedoelen we altijd dat totaal. Een vierkaart of korter levert nooit lengtepunten op. Heb je twee lange kleuren, dan tel je ze allebei.',
      },
      { soort: 'regel', tekst: 'Je punten = honneurpunten + lengtepunten. Met dat totaal bied je.' },
      {
        soort: 'hand',
        hand: { s: 'A H 8 6 3 2', h: 'A 5 4', d: 'H 2', c: '9 7' },
        titel: '14 honneur + 2 lengte = 16 punten',
        uitleg:
          'Honneurs: ♠A 4 + ♠H 3 + ♥A 4 + ♦H 3 = 14. De schoppen zijn een zeskaart: twee kaarten meer dan vier, dus +2. Totaal 16 punten.',
      },
      {
        soort: 'hand',
        hand: { s: '7 4', h: 'H V 9 6 3', d: 'A 8 5', c: 'B 6 2' },
        titel: '10 honneur + 1 lengte = 11 punten',
        uitleg:
          'Honneurs: ♥H 3 + ♥V 2 + ♦A 4 + ♣B 1 = 10. De harten zijn een vijfkaart: +1. Totaal 11 punten.',
      },
      {
        soort: 'tekst',
        tekst:
          'Bij het bekijken van je hand let je ook op de verdeling: hoeveel kaarten je per kleur hebt. Die schrijf je als vier getallen van groot naar klein, bijvoorbeeld 5-3-3-2: een vijfkaart, twee driekaarten en een tweekaart. De verdeling van de eerste voorbeeldhand is 6-3-2-2.',
      },
      {
        soort: 'tabel',
        kop: ['Woord', 'Betekenis'],
        rijen: [
          ['Renonce', 'Een kleur waarvan je geen kaarten hebt'],
          ['Singleton', 'Een kleur met precies één kaart'],
          ['Doubleton', 'Een kleur met precies twee kaarten'],
          ['Lange kleur', 'Een kleur met vijf of meer kaarten'],
        ],
      },
    ],
    vragen: [
      {
        vraag: 'Hoeveel punten (honneur + lengte) heeft deze hand?',
        hand: { s: 'H V 10 7 5', h: 'A 4', d: 'V 8 6', c: '9 5 3' },
        opties: ['11', '12', '13', '10'],
        goed: 1,
        uitleg: 'Honneurs: 3 + 2 + 4 + 2 = 11. Vijf schoppen geeft +1. Totaal 12.',
      },
      {
        vraag: 'Hoeveel punten heeft deze hand?',
        hand: { s: '6', h: 'A H B 9 7 4 2', d: 'V 5 3', c: '8 4' },
        opties: ['10', '11', '12', '13'],
        goed: 3,
        uitleg: 'Honneurs: 4 + 3 + 1 + 2 = 10. Een zevenkaart harten geeft +3. Totaal 13.',
      },
      {
        vraag: 'Wat is de verdeling van deze hand?',
        hand: { s: 'A 9 7 4', h: 'H 10 6 3', d: 'V 8 2', c: '5 4' },
        opties: ['4-4-3-2', '4-3-3-3', '5-3-3-2', '5-4-2-2'],
        goed: 0,
        uitleg: 'Vier schoppen, vier harten, drie ruiten, twee klaveren: 4-4-3-2.',
      },
      {
        vraag: 'Hoeveel lengtepunten geeft een zeskaart?',
        opties: ['0', '1', '3', '2'],
        goed: 3,
        uitleg: 'Eén punt per kaart boven de vier: 6 − 4 = 2.',
      },
      {
        vraag: 'Hoeveel punten heeft deze hand?',
        hand: { s: 'A V 8 6 4', h: 'H B 9 7 3', d: '5', c: '6 2' },
        opties: ['10', '11', '12', '13'],
        goed: 2,
        uitleg: 'Honneurs: 4 + 2 + 3 + 1 = 10. Twee vijfkaarten: +1 en +1. Totaal 12.',
      },
    ],
  },
  {
    id: 'sansverdeling-herkennen',
    deel: 'Je hand waarderen',
    titel: 'De sansverdeling herkennen',
    kern: 'Een hand is sans-verdeeld bij 4-3-3-3, 4-4-3-2 of 5-3-3-2: geen renonce, geen singleton en hooguit één doubleton.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Sommige handen hebben een mooie, gelijkmatige verdeling: geen kleur is erg lang of erg kort. Zulke handen noemen we vlak of sans-verdeeld. Ze zijn geschikt om sans atout te spelen, want je hebt in elke kleur wel iets om mee te bekennen.',
      },
      { soort: 'regel', tekst: 'Sansverdeling = 4-3-3-3, 4-4-3-2 of 5-3-3-2. Andere verdelingen zijn niet vlak.' },
      {
        soort: 'tekst',
        tekst:
          'Een snelle manier om het te controleren: heb je een renonce of een singleton? Dan is het géén sanshand. Heb je twee doubletons? Ook niet (bijvoorbeeld 5-4-2-2). Heb je een zeskaart? Ook niet. Blijft er hooguit één doubleton over en geen kleur langer dan vijf, dan is het een sansverdeling.',
      },
      {
        soort: 'hand',
        hand: { s: 'H B 4', h: 'A V 6', d: 'H 8 5 2', c: 'V 9 3' },
        titel: '4-3-3-3: sans-verdeeld',
        uitleg:
          'Drie schoppen, drie harten, vier ruiten, drie klaveren. Geen korte kleur, dus een schoolvoorbeeld van een vlakke hand. Punten: 3 + 1 + 4 + 2 + 3 + 2 = 15.',
      },
      {
        soort: 'hand',
        hand: { s: 'A 8 7 5 3', h: 'H 6', d: 'V 9 4', c: 'A B 2' },
        titel: '5-3-3-2: ook sans-verdeeld',
        uitleg:
          'Vijf schoppen, twee harten, drie ruiten, drie klaveren. Eén doubleton en geen singleton: dat mag. Punten: 4 + 3 + 2 + 4 + 1 = 14 honneur + 1 lengte = 15.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H 9 6', h: '5', d: 'H V 8 4', c: 'B 7 3 2' },
        titel: '4-4-4-1: niet sans-verdeeld',
        uitleg:
          'Er zit een singleton harten in. Speel je sans atout, dan kunnen de tegenstanders hun harten afdraaien zonder dat jij ze kunt stoppen. Deze hand is dus niet vlak. Punten: 7 + 5 + 1 = 13.',
      },
      {
        soort: 'tekst',
        tekst:
          'Waarom is dit belangrijk? Straks leer je de opening 1SA: die belooft een sansverdeling met 15–17 punten. Partner weet dan in één keer bijna alles over je hand. Herken je de verdeling vlot, dan zie je die kans meteen.',
      },
    ],
    vragen: [
      {
        vraag: 'Welke verdeling is een sansverdeling?',
        opties: ['5-4-2-2', '4-4-4-1', '5-3-3-2', '6-3-2-2'],
        goed: 2,
        uitleg: 'Alleen 4-3-3-3, 4-4-3-2 en 5-3-3-2 zijn sansverdelingen. De andere hebben een singleton, twee doubletons of een zeskaart.',
      },
      {
        vraag: 'Is deze hand sans-verdeeld?',
        hand: { s: 'V 9 5 2', h: 'A H 7', d: 'B 10 6', c: 'H 8 3' },
        opties: ['Ja, het is 4-3-3-3', 'Nee, er is een doubleton', 'Nee, er is geen vijfkaart', 'Alleen als je 15 punten hebt'],
        goed: 0,
        uitleg: 'Vier schoppen en drie in elke andere kleur: 4-3-3-3, de vlakste verdeling die er is.',
      },
      {
        vraag: 'Is deze hand sans-verdeeld?',
        hand: { s: 'A H 8 5 3', h: 'V 7', d: 'H 9 6 4', c: '8 2' },
        opties: ['Ja, het is 5-3-3-2', 'Ja, 5-4-2-2 telt ook', 'Ja, want er is geen singleton', 'Nee: 5-4-2-2 heeft twee doubletons'],
        goed: 3,
        uitleg: 'Vijf schoppen, vier ruiten, twee harten, twee klaveren: 5-4-2-2. Twee doubletons is te ongelijk.',
      },
      {
        vraag: 'Is deze hand sans-verdeeld?',
        hand: { s: 'A B 9 6', h: 'H V 7 3', d: '5', c: 'A 10 8 4' },
        opties: ['Ja', 'Nee, er zit een singleton in', 'Alleen met 15–17 punten', 'Alleen zonder vijfkaart'],
        goed: 1,
        uitleg: 'De singleton ruiten maakt deze 4-4-4-1-hand ongeschikt als sanshand.',
      },
      {
        vraag: 'Wat is een renonce?',
        opties: ['Een kleur met één kaart', 'Een kleur met twee kaarten', 'Een kleur zonder kaarten', 'Een lange kleur'],
        goed: 2,
        uitleg: 'Een renonce is een kleur waarin je geen enkele kaart hebt. Met een renonce is je hand nooit sans-verdeeld.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DEEL 3 — OPENEN
  // ════════════════════════════════════════════════════════════════
  {
    id: 'wanneer-open-je',
    deel: 'Openen',
    titel: 'Wanneer open je? Het denkschema',
    kern: 'Met 12 of meer punten open je; met een vast denkschema kies je in een paar stappen het juiste openingsbod.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Het eerste bod in een spel (dat geen pas is) heet de opening; de speler die het doet is de openaar. Zijn partner heet de antwoorder. Met een opening zeg je tegen partner: "ik heb meer dan gemiddeld, laten we kijken of we een manche hebben."',
      },
      { soort: 'regel', tekst: 'Open met 12 punten of meer (honneur + lengte). Met minder pas je, op een paar uitzonderingen na.' },
      {
        soort: 'tekst',
        tekst:
          'Waarom 12? Gemiddeld heeft iedereen 10 punten. Met 12 heb je duidelijk meer dan je deel, en heeft partner ook een redelijke hand, dan komen jullie al snel aan de 25 voor een manche. Let op: lengtepunten tellen mee. Een hand met 10 honneurpunten en een zeskaart heeft 12 punten en is dus een opening.',
      },
      {
        soort: 'tekst',
        tekst:
          'Welk bod je opent, kies je met een vast stappenplan. Loop het elke keer van boven naar beneden door en stop bij de eerste stap die past. In de komende lessen werken we elke stap uit; vandaag is het genoeg dat je de volgorde kent.',
      },
      {
        soort: 'tabel',
        kop: ['Stap', 'Vraag en opening'],
        rijen: [
          ['1', '22+ punten? → open 2♣'],
          ['2', 'Sansverdeling met 20–21? → open 2SA'],
          ['3', 'Sansverdeling met 15–17? → open 1SA'],
          ['4', '12+ punten en een vijfkaart harten of schoppen? → open 1♥ of 1♠'],
          ['5', '12+ punten zonder vijfkaart hoog? → open 1♣ of 1♦'],
          ['6', 'Minder dan 12? → zwakke twee of preëmpt als het past, anders pas'],
        ],
      },
      { soort: 'regel', tekst: 'Denkschema: 2♣ (22+) → 2SA (20–21 sans) → 1SA (15–17 sans) → 1♥/1♠ → 1♣/1♦ → zwak of pas.' },
      {
        soort: 'hand',
        hand: { s: 'A V 7 4', h: 'H 9 3', d: 'B 8 6 2', c: 'H 5' },
        titel: '13 punten → openen',
        uitleg:
          'Punten: 4 + 2 + 3 + 1 + 3 = 13, geen lengtepunten. Geen 22+, wel vlak (4-4-3-2), maar niet 15–17 of 20–21. Geen vijfkaart hoog. Dus stap 5: een lage kleur (ruiten, zie les 11).',
      },
      {
        soort: 'hand',
        hand: { s: 'A V 9 7 5 3', h: 'H 6', d: 'B 8 4', c: '7 2' },
        titel: '10 honneur + 2 lengte = 12 → openen 1♠',
        uitleg:
          'Honneurs: 4 + 2 + 3 + 1 = 10. De zes schoppen geven +2. Samen 12: genoeg om te openen. Er is een vijfkaart (zelfs zeskaart) schoppen, dus stap 4: 1♠.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 8 6 4', h: 'V 7 2', d: 'A 9 5', c: 'B 6 3' },
        titel: '10 punten → pas',
        uitleg:
          'Punten: 3 + 2 + 4 + 1 = 10. Geen lange kleur, dus geen lengtepunten. Minder dan 12 en geen zeskaart of zevenkaart voor een zwakke opening: pas. Partner kan zelf nog openen.',
      },
    ],
    vragen: [
      {
        vraag: 'Je bent gever. Wat doe je met deze hand?',
        hand: { s: 'H V 6 3', h: 'A 8 4', d: 'V 10 7', c: 'B 9 5' },
        opties: ['Pas', 'Openen', 'Alleen openen als partner gaf', 'Pas, want je hebt geen vijfkaart'],
        goed: 1,
        uitleg: 'Punten: 3 + 2 + 4 + 2 + 1 = 12. Met 12 open je, ook zonder lange kleur.',
      },
      {
        vraag: 'Je bent gever. Wat doe je met deze hand?',
        hand: { s: 'V 7 5', h: 'H B 4 2', d: 'A 9 6', c: '8 5 3' },
        opties: ['Pas: 10 punten is te weinig', 'Openen: 10 is genoeg', 'Open 1SA', 'Open 2♣'],
        goed: 0,
        uitleg: 'Punten: 2 + 3 + 1 + 4 = 10. Minder dan 12 en geen lange kleur: pas.',
      },
      {
        vraag: 'Hoeveel punten heb je minimaal nodig om normaal te openen?',
        opties: ['10', '11', '12', '15'],
        goed: 2,
        uitleg: 'Met 12 punten (honneur + lengte) open je.',
      },
      {
        vraag: 'Mag je met deze hand openen?',
        hand: { s: 'A 8', h: 'H V 10 7 6 4', d: 'B 9 5', c: '7 3' },
        opties: ['Nee, maar 10 honneurpunten', 'Nee, want geen 15 punten', 'Alleen met 2♣', 'Ja: 10 + 2 lengte = 12'],
        goed: 3,
        uitleg: 'Honneurs: 4 + 3 + 2 + 1 = 10, plus 2 voor de zeskaart harten: 12 punten. Dat is een opening.',
      },
      {
        vraag: 'Wat is de eerste vraag in het denkschema?',
        opties: ['Heb ik een vijfkaart hoog?', 'Heb ik 22 punten of meer?', 'Hoeveel azen heb ik?', 'Wat heeft partner?'],
        goed: 1,
        uitleg: 'Je begint bovenaan: eerst kijken of je zó sterk bent dat je 2♣ moet openen.',
      },
    ],
  },
  {
    id: 'openen-vijfkaart-hoog',
    deel: 'Openen',
    titel: 'Vijfkaart hoog: 1♥ en 1♠',
    kern: 'Met 12–19 punten en vijf of meer harten of schoppen open je 1♥ of 1♠; met twee even lange hoge kleuren open je 1♠.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Nu wordt het systeem "5-kaart hoog" duidelijk. Een opening van 1♥ of 1♠ belooft minstens vijf kaarten in die kleur. Dat is heel waardevol: heeft partner er drie bij, dan weten jullie meteen dat er een fit is (5 + 3 = 8). Je opent dus nooit 1♥ of 1♠ met maar vier kaarten.',
      },
      { soort: 'regel', tekst: '1♥ / 1♠ = 12–19 punten en minstens vijf kaarten in die kleur.' },
      {
        soort: 'tekst',
        tekst:
          'De vijfkaart hoog gaat vóór alles wat lager in het denkschema staat: heb je 12–19 punten en een vijfkaart harten of schoppen, dan open je die kleur, ook als je ook een lange lage kleur hebt. Alleen een sanshand met 15–17 opent eerder 1SA (dat leer je in les 12).',
      },
      {
        soort: 'hand',
        hand: { s: 'A H V 6 2', h: 'H 8 3', d: '9 5', c: '7 6 2' },
        titel: '12 + 1 lengte = 13 punten, vijf schoppen → 1♠',
        uitleg: 'Honneurs: 4 + 3 + 2 + 3 = 12. Vijfkaart schoppen: +1. 13 punten en een vijfkaart hoog: open 1♠.',
      },
      {
        soort: 'tekst',
        tekst:
          'Wat als je twee hoge kleuren hebt? Dan kies je de langste. Zijn ze even lang (5-5), dan open je de hoogste: 1♠. Partner kan daarna nog steeds harten steunen als jij later harten biedt.',
      },
      { soort: 'regel', tekst: 'Twee hoge kleuren: open de langste; bij gelijke lengte open je 1♠.' },
      {
        soort: 'hand',
        hand: { s: 'A H 8 6 2', h: 'A V 9 5 3', d: '4', c: '8 2' },
        titel: 'Twee vijfkaarten, 15 punten → 1♠',
        uitleg: 'Honneurs: 4 + 3 + 4 + 2 = 13. Twee vijfkaarten: +1 +1 = 15 punten. Schoppen en harten zijn even lang, dus open de hoogste: 1♠.',
      },
      {
        soort: 'hand',
        hand: { s: 'H V 7 4 2', h: 'A H 9 8 6 3', d: '5', c: '7' },
        titel: 'Zes harten, vijf schoppen → 1♥',
        uitleg: 'Honneurs: 3 + 2 + 4 + 3 = 12. Lengte: zeskaart +2, vijfkaart +1, totaal 15. Harten is langer dan schoppen, dus open 1♥.',
      },
      {
        soort: 'tekst',
        tekst:
          'Waarom tot 19 punten? Met 20 of meer ben je zo sterk dat je partner een manche zou kunnen missen als hij past. Daarvoor zijn de sterke openingen 2SA en 2♣. Tussen 12 en 19 vertel je later, bij je tweede bod, of je minimum of extra sterk bent.',
      },
    ],
    vragen: [
      {
        vraag: 'Wat open je?',
        hand: { s: 'V 5', h: 'A H 10 8 4', d: 'H 9 6', c: 'B 7 3' },
        opties: ['1♣', '1SA', '1♥', 'Pas'],
        goed: 2,
        uitleg: 'Honneurs 13 + 1 voor de vijfkaart = 14 punten. Geen 15–17, dus geen 1SA: open je vijfkaart hoog, 1♥.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H 9 7 3', h: 'H V 8 6 2', d: 'A 4', c: '5' },
        opties: ['1♥', '2♣', '1SA', '1♠'],
        goed: 3,
        uitleg: 'Honneurs 16 + 2 lengte = 18 punten. Twee even lange hoge kleuren: open de hoogste, 1♠.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A 6', h: 'H V 9 7 5 2', d: 'A 8 4', c: '10 3' },
        opties: ['1♥', '1SA', '2♥', '1♦'],
        goed: 0,
        uitleg: 'Honneurs 13 + 2 lengte = 15. Met een zeskaart is de hand niet vlak, dus geen 1SA: open 1♥.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'H B 8 6 4', h: 'A 3', d: 'V 7 5', c: 'H 9 2' },
        opties: ['1SA', '1♠', '1♣', 'Pas'],
        goed: 1,
        uitleg: 'Honneurs 13 + 1 lengte = 14. Vlak, maar geen 15–17, dus open je vijfkaart: 1♠.',
      },
      {
        vraag: 'Wat belooft een opening van 1♥?',
        opties: ['12–19 punten en 4+ harten', '15–17 punten en harten', '12–19 punten en 5+ harten', '6–10 punten en zes harten'],
        goed: 2,
        uitleg: 'In 5-kaart hoog belooft 1♥ minstens vijf harten en 12–19 punten.',
      },
    ],
  },
  {
    id: 'openen-lage-kleur',
    deel: 'Openen',
    titel: 'Geen vijfkaart hoog: 1♣ of 1♦',
    kern: 'Zonder vijfkaart hoog open je je langste lage kleur; met 3-3 open je 1♣, met 4-4 open je 1♦.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Heel vaak heb je 12 punten of meer, maar geen vijfkaart harten of schoppen. Dan mag je 1♥ of 1♠ niet openen. Je opent dan in een lage kleur: 1♣ of 1♦. Zo’n opening belooft niet per se een lange kleur; hij zegt vooral "ik heb een opening zonder vijfkaart hoog".',
      },
      { soort: 'regel', tekst: 'Geen vijfkaart hoog → open je langste lage kleur.' },
      {
        soort: 'tekst',
        tekst:
          'Kijk dus alleen naar klaveren en ruiten en open de langste van de twee. Zijn ze even lang, dan geldt: met drie-drie open je 1♣, met vier-vier (of langer) open je 1♦. Een opening van 1♦ belooft daardoor bijna altijd minstens vier ruiten; 1♣ kan soms maar drie klaveren zijn.',
      },
      { soort: 'regel', tekst: 'Lage kleuren even lang: 3-3 → 1♣, 4-4 → 1♦.' },
      {
        soort: 'hand',
        hand: { s: 'A 9 6 2', h: 'H 7 4', d: 'V 6', c: 'H B 5 3' },
        titel: '13 punten, klaveren het langst → 1♣',
        uitleg: 'Punten: 4 + 3 + 2 + 3 + 1 = 13. Geen vijfkaart hoog. Lage kleuren: vier klaveren, twee ruiten. Klaveren is het langst: 1♣.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H 5', h: '9 7', d: 'H V 8 2', c: 'B 6 3 2' },
        titel: '13 punten, lage kleuren 4-4 → 1♦',
        uitleg: 'Punten: 4 + 3 + 3 + 2 + 1 = 13. Geen vijfkaart hoog. Vier ruiten en vier klaveren: bij 4-4 open je 1♦.',
      },
      {
        soort: 'hand',
        hand: { s: 'A V 7 4', h: 'B 8 6', d: 'H 8 5', c: 'V 4 3' },
        titel: '12 punten, lage kleuren 3-3 → 1♣',
        uitleg: 'Punten: 4 + 2 + 1 + 3 + 2 = 12. Vier schoppen is geen vijfkaart, dus geen 1♠. Drie ruiten en drie klaveren: bij 3-3 open je 1♣.',
      },
      {
        soort: 'tekst',
        tekst:
          'Let op: ook een vlakke hand van 12–14 punten of 18–19 punten open je zo met een lage kleur, want die past niet in 1SA (15–17) of 2SA (20–21). Bij je tweede bod laat je dan zien hoe sterk je bent.',
      },
    ],
    vragen: [
      {
        vraag: 'Wat open je?',
        hand: { s: 'H 8 4', h: 'A 7', d: 'A V 9 6 3', c: '10 5 2' },
        opties: ['1♣', '1SA', '1♥', '1♦'],
        goed: 3,
        uitleg: 'Honneurs 13 + 1 lengte = 14. Geen vijfkaart hoog en ruiten is de langste lage kleur: 1♦.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A B 6', h: 'H 9 5', d: 'V 8 4', c: 'A 7 3 2' },
        opties: ['1♣', '1♦', '1SA', 'Pas'],
        goed: 0,
        uitleg: 'Punten: 5 + 3 + 2 + 4 = 14. Vlak, maar geen 15–17. Klaveren (vier) is langer dan ruiten (drie): 1♣.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'H V 7 2', h: 'A 5', d: 'B 9 6 3', c: 'A 8 4' },
        opties: ['1♠', '1♣', '1♦', '1SA'],
        goed: 2,
        uitleg: 'Punten: 5 + 4 + 1 + 4 = 14. Vier schoppen is te kort voor 1♠. Ruiten (vier) is langer dan klaveren (drie): 1♦.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H 6 3', h: 'B 9 7', d: 'V 8 4', c: 'H 5 2' },
        opties: ['1♦', '1♣', '1♠', 'Pas'],
        goed: 1,
        uitleg: 'Punten: 7 + 1 + 2 + 3 = 13. Geen vijfkaart hoog, lage kleuren 3-3: open 1♣.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: '8 6', h: 'A 8 3', d: 'H B 7 4', c: 'A V 9 2' },
        opties: ['1♣', '1SA', '1♦', '1♥'],
        goed: 2,
        uitleg: 'Punten: 4 + 4 + 6 = 14, dus te weinig voor 1SA. Lage kleuren 4-4: open 1♦.',
      },
    ],
  },
  {
    id: 'openen-1sa',
    deel: 'Openen',
    titel: 'De opening 1SA (15–17)',
    kern: 'Met 15–17 punten en een sansverdeling open je 1SA — ook als je een vijfkaart hoog hebt in een 5-3-3-2.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          '1SA is de meest precieze opening die er is. Je vertelt partner in één bod twee dingen: je hebt 15, 16 of 17 punten, en je hand is vlak (4-3-3-3, 4-4-3-2 of 5-3-3-2). Partner kan daarna bijna meteen uitrekenen of er een manche in zit.',
      },
      { soort: 'regel', tekst: '1SA = 15–17 punten met een sansverdeling (4-3-3-3, 4-4-3-2 of 5-3-3-2).' },
      {
        soort: 'tekst',
        tekst:
          'In het denkschema staat 1SA boven de kleuropeningen. Heb je dus een 5-3-3-2 met een vijfkaart harten en 15–17 punten, dan open je toch 1SA. Partner heeft speciale biedingen (Stayman en Jacoby, les 19 en 20) om een fit in een hoge kleur alsnog te vinden.',
      },
      {
        soort: 'hand',
        hand: { s: 'H B 4', h: 'A V 6', d: 'H 8 5 2', c: 'V 9 3' },
        titel: '15 punten, 4-3-3-3 → 1SA',
        uitleg: 'Punten: 3 + 1 + 4 + 2 + 3 + 2 = 15. Vlak en tussen 15 en 17: open 1SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'A 7', h: 'H V 8 6 3', d: 'A B 4', c: 'V 10 2' },
        titel: '16 + 1 = 17 punten, 5-3-3-2 → 1SA',
        uitleg: 'Honneurs: 4 + 3 + 2 + 4 + 1 + 2 = 16. Vijfkaart harten: +1, dus 17. De verdeling is 5-3-3-2, sans-verdeeld. Ondanks de vijf harten open je 1SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H 7 4', h: '6', d: 'H V 9 5', c: 'A 8 6 3' },
        titel: '16 punten maar een singleton → 1♦',
        uitleg: 'Punten: 7 + 5 + 4 = 16. De singleton harten maakt de hand niet vlak, dus geen 1SA. Geen vijfkaart hoog; ruiten en klaveren 4-4: open 1♦.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H 5', h: 'H V 4', d: 'A B 7 3', c: 'V 8 2' },
        titel: '19 punten, vlak → te sterk voor 1SA → 1♦',
        uitleg: 'Punten: 7 + 5 + 5 + 2 = 19. Vlak, maar boven 17 en onder 20. Open dus een kleur: geen vijfkaart hoog, ruiten (vier) is langst: 1♦. Bij je tweede bod laat je de 18–19 zien met 2SA.',
      },
      { soort: 'regel', tekst: 'Vlak met 12–14 of 18–19? Open een kleur, niet 1SA.' },
    ],
    vragen: [
      {
        vraag: 'Wat open je?',
        hand: { s: 'A V 5', h: 'H 9 4 2', d: 'H B 6', c: 'A 8 3' },
        opties: ['1♥', '1♣', '1SA', '2SA'],
        goed: 2,
        uitleg: 'Punten: 6 + 3 + 4 + 4 = 17, verdeling 4-3-3-3: open 1SA. (Vier harten is trouwens ook te kort voor 1♥.)',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'H V 8', h: 'A 6', d: 'V B 7 5 3', c: 'H 9 4' },
        opties: ['1SA', '1♦', '2♦', '1♠'],
        goed: 0,
        uitleg: 'Honneurs 15 + 1 lengte = 16. Verdeling 5-3-3-2 is vlak: open 1SA.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H 9 4', h: '7', d: 'H V 8 3', c: 'A 10 6 2' },
        opties: ['1SA', '2SA', '1♣', '1♦'],
        goed: 3,
        uitleg: '16 punten, maar met een singleton is de hand niet vlak. Lage kleuren 4-4: open 1♦.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'V 8 3', h: 'A H 7', d: 'B 9 6 4', c: 'A 5 2' },
        opties: ['1SA', '1♦', '1♣', 'Pas'],
        goed: 1,
        uitleg: 'Punten: 2 + 7 + 1 + 4 = 14. Vlak, maar te weinig voor 1SA. Ruiten is je langste lage kleur: 1♦.',
      },
      {
        vraag: 'Wat belooft de opening 1SA?',
        opties: ['12–14 punten en vlak', '15–17 punten en een vijfkaart', '20–21 punten', '15–17 punten en een sansverdeling'],
        goed: 3,
        uitleg: '1SA = 15–17 punten met een 4-3-3-3, 4-4-3-2 of 5-3-3-2.',
      },
    ],
  },
  {
    id: 'sterke-openingen',
    deel: 'Openen',
    titel: 'De sterke openingen 2♣ en 2SA',
    kern: 'Met 22+ punten open je 2♣ (mancheforcing, partner wacht met 2♦); met 20–21 en een sansverdeling open je 2SA.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Soms krijg je een prachtige hand. Open je dan 1♥, dan kan partner met een zwakke hand passen en mis je een makkelijke manche. Daarom zijn er twee speciale openingen voor heel sterke handen.',
      },
      { soort: 'regel', tekst: '2SA = 20–21 punten met een sansverdeling.' },
      {
        soort: 'hand',
        hand: { s: 'A H 3', h: 'H V 6 2', d: 'A H 4', c: 'B 5 3' },
        titel: '20 punten, 4-3-3-3 → 2SA',
        uitleg: 'Punten: 7 + 5 + 7 + 1 = 20. Vlak en 20–21: open 2SA. Partner weet nu precies hoe sterk je bent.',
      },
      {
        soort: 'tekst',
        tekst:
          'Met 22 punten of meer open je 2♣. Dit bod is kunstmatig: het zegt niets over klaveren, alleen "ik ben ontzettend sterk". Het is mancheforcing: geen van beiden mag passen voordat de manche bereikt is. Zo kan de openaar rustig zijn hand beschrijven.',
      },
      { soort: 'regel', tekst: '2♣ = 22+ punten, elke verdeling. Mancheforcing: niemand past vóór de manche.' },
      {
        soort: 'tekst',
        tekst:
          'Partner antwoordt meestal 2♦. Ook dat is kunstmatig: een wachtbod, dat zegt "vertel maar verder". Het kan zelfs met 0 punten. Daarna beschrijft de openaar zijn hand: met een vlakke hand biedt hij 2SA (22–24), anders noemt hij zijn langste kleur.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H V 4', h: 'A V 2', d: 'A H 3', c: '8 7 2' },
        titel: '22 punten → 2♣',
        uitleg: 'Punten: 9 + 6 + 7 = 22. Stap 1 van het denkschema: 22 of meer, dus 2♣, ook al is de hand vlak.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H V B 7 5', h: 'A H 6', d: 'A 4', c: '9 3' },
        titel: '21 + 2 lengte = 23 punten → 2♣',
        uitleg: 'Honneurs: 10 + 7 + 4 = 21. Zeskaart schoppen +2, dus 23. Open 2♣ en bied daarna je schoppen.',
      },
      {
        soort: 'serie',
        stappen: [
          { wie: 'N', bod: '2♣' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '2♦' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '2♠' },
        ],
        uitleg:
          'Noord opent 2♣ met de hand hierboven. Zuid wacht met 2♦ (niets gezegd over ruiten). Noord toont nu zijn schoppen. Zuid mag niet passen: het bieden gaat door tot minstens de manche.',
      },
    ],
    vragen: [
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H 5', h: 'A V 4', d: 'H V 8 2', c: 'A 7 3' },
        opties: ['2SA', '2♣', '1SA', '1♦'],
        goed: 1,
        uitleg: 'Punten: 7 + 6 + 5 + 4 = 22. Met 22 of meer open je 2♣, ook met een vlakke hand.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A V 4', h: 'A H 8', d: 'H B 7 3', c: 'H B 5' },
        opties: ['2♣', '1SA', '2SA', '1♦'],
        goed: 2,
        uitleg: 'Punten: 6 + 7 + 4 + 4 = 21, verdeling 4-3-3-3: open 2SA (20–21).',
      },
      {
        vraag: 'Partner opent 2♣. Mag jij passen met een heel zwakke hand?',
        opties: ['Ja, met 0–5 punten', 'Ja, altijd', 'Alleen als de tegenpartij biedt', 'Nee: 2♣ is mancheforcing, je antwoordt minstens 2♦'],
        goed: 3,
        uitleg: '2♣ is mancheforcing. Met een zwakke hand antwoord je het wachtbod 2♦.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H V 10 8 6 4', h: 'A H', d: 'A 5', c: '7 2' },
        opties: ['2♠', '4♠', '2♣', '1♠'],
        goed: 2,
        uitleg: 'Honneurs: 9 + 7 + 4 = 20, plus 3 voor de zevenkaart: 23 punten. Open 2♣.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A H 7 6 4', h: 'A V', d: 'H 9 3', c: 'V 8 2' },
        opties: ['1♠', '2SA', '2♣', '1SA'],
        goed: 0,
        uitleg: 'Honneurs 18 + 1 lengte = 19. Vlak, maar geen 15–17 of 20–21, en geen 22. Open je vijfkaart: 1♠.',
      },
    ],
  },
  {
    id: 'zwakke-twee-en-preempts',
    deel: 'Openen',
    titel: 'Zwakke twee en preëmpts',
    kern: 'Met 6–10 punten en een zeskaart ♦/♥/♠ open je een zwakke twee; met 5–9 punten en een zevenkaart open je op 3-niveau.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Je hebt minder dan 12 punten, maar wel een mooie lange kleur. Dan kun je toch openen, met een zwakke opening. Het doel is tweeledig: partner weet direct wat je hebt, en de tegenpartij, die waarschijnlijk de meeste punten heeft, verliest biedruimte. Zulke storende biedingen heten preëmptief.',
      },
      { soort: 'regel', tekst: 'Zwakke twee: 2♦, 2♥ of 2♠ = 6–10 punten met een zeskaart in die kleur.' },
      {
        soort: 'tekst',
        tekst:
          'Een zwakke twee kan niet in klaveren: 2♣ is al de sterke opening. De punten tellen weer inclusief lengtepunten, dus een zeskaart levert al 2 op. Zorg dat de punten vooral in je lange kleur zitten: dan levert die kleur slagen op.',
      },
      {
        soort: 'hand',
        hand: { s: 'H V B 9 6 3', h: '8 4', d: '7 5 2', c: '9 6' },
        titel: '6 + 2 lengte = 8 punten, zes schoppen → 2♠',
        uitleg: 'Honneurs: 3 + 2 + 1 = 6. Zeskaart: +2, dus 8 punten. Te zwak voor 1♠, maar perfect voor een zwakke twee: 2♠.',
      },
      { soort: 'regel', tekst: 'Preëmpt: 3♣, 3♦, 3♥ of 3♠ = 5–9 punten met een zevenkaart in die kleur.' },
      {
        soort: 'hand',
        hand: { s: '8', h: '6', d: 'H V B 8 6 4 2', c: '9 7 5 3' },
        titel: '6 + 3 lengte = 9 punten, zeven ruiten → 3♦',
        uitleg: 'Honneurs: 3 + 2 + 1 = 6. Zevenkaart: +3, dus 9. Open 3♦: je hebt veel slagen in ruiten en bijna niets daarbuiten.',
      },
      {
        soort: 'hand',
        hand: { s: '8 5', h: 'V 7 3', d: '9 4', c: 'A H 10 8 6 2' },
        titel: 'Zes klaveren, 11 punten → pas',
        uitleg: 'Honneurs: 2 + 4 + 3 = 9, plus 2 lengte = 11. Te weinig voor een normale opening, en een zwakke twee in klaveren bestaat niet (2♣ is sterk). Een preëmpt vraagt een zevenkaart. Dus: pas.',
      },
      {
        soort: 'tekst',
        tekst:
          'Heb je 12 punten of meer met een zeskaart, dan open je gewoon op 1-niveau. De zwakke openingen zijn echt voor zwakke handen. Partner weet daardoor precies wat hij kan verwachten, en dat helpt hem straks bij zijn antwoord (les 21).',
      },
    ],
    vragen: [
      {
        vraag: 'Wat open je?',
        hand: { s: '7 4', h: 'A V 10 8 6 2', d: 'B 5 3', c: '8 4' },
        opties: ['Pas', '1♥', '2♥', '3♥'],
        goed: 2,
        uitleg: 'Honneurs 7 + 2 lengte = 9 punten met zes harten: een zwakke twee, 2♥.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'H B 10 8 7 4 3', h: '5', d: '9 6 2', c: '8 4' },
        opties: ['3♠', '2♠', 'Pas', '4♠'],
        goed: 0,
        uitleg: 'Honneurs 4 + 3 lengte = 7 punten met zeven schoppen: preëmpt op 3-niveau, 3♠.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: 'A V 9 7 5 3', h: 'H 4', d: 'V 6 2', c: '7 3' },
        opties: ['2♠', '1♠', '3♠', 'Pas'],
        goed: 1,
        uitleg: 'Honneurs 11 + 2 lengte = 13. Met 12+ open je gewoon 1♠, niet zwak.',
      },
      {
        vraag: 'Wat open je?',
        hand: { s: '6 3', h: '9 4', d: 'A H 10 8 7 5', c: 'B 6 2' },
        opties: ['Pas', '1♦', '3♦', '2♦'],
        goed: 3,
        uitleg: 'Honneurs 8 + 2 lengte = 10 punten met zes ruiten: zwakke twee, 2♦.',
      },
      {
        vraag: 'Waarom bestaat er geen zwakke twee in klaveren?',
        opties: ['Klaveren is te laag', '2♣ is al de sterke opening (22+)', 'Dat mag wel', 'Alleen met een zevenkaart'],
        goed: 1,
        uitleg: '2♣ is gereserveerd voor de sterke, mancheforcing opening. Met zes klaveren en een zwakke hand pas je.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DEEL 4 — ANTWOORDEN
  // ════════════════════════════════════════════════════════════════
  {
    id: 'antwoorden-hoog-met-steun',
    deel: 'Antwoorden',
    titel: 'Antwoorden op 1♥/1♠ met steun',
    kern: 'Met drie kaarten mee in partners hoge kleur heb je een fit: 6–9 → verhoog naar 2, 10–11 → naar 3, 12+ → eerst nieuwe kleur, dan manche.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Partner opent en nu ben jij, de antwoorder, aan de beurt. Je eerste vraag is altijd: hoeveel punten heb ik? Met 0–5 punten pas je: zelfs als partner 19 heeft, komen jullie niet aan de 25. Elk antwoord belooft daarom minstens 6 punten.',
      },
      { soort: 'regel', tekst: 'Antwoorder: met 0–5 punten pas je. Elk bod belooft 6+.' },
      {
        soort: 'tekst',
        tekst:
          'Opent partner 1♥ of 1♠, dan weet je dat hij minstens vijf kaarten in die kleur heeft. Heb jij er drie of meer bij, dan hebben jullie samen minstens acht: een fit! Dat heet steun. Met steun vertel je partner meteen hoe sterk je bent, door zijn kleur te verhogen.',
      },
      {
        soort: 'tabel',
        kop: ['Steun (3+) en…', 'Bod (partner opende 1♥)'],
        rijen: [
          ['6–9 punten', '2♥ — één keer verhogen'],
          ['10–11 punten', '3♥ — twee keer verhogen, inviterend'],
          ['12+ punten', 'Eerst een nieuwe kleur (forcing), daarna minstens 4♥'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'Inviterend betekent: een uitnodiging tot de manche. Partner beslist. Met een minimum (12–14) past hij, met meer biedt hij de manche. Forcing betekent: partner mag niet passen. Een nieuwe kleur van de antwoorder is altijd forcing, want jouw kracht is dan nog onbekend.',
      },
      {
        soort: 'hand',
        hand: { s: '8 4', h: 'V 9 6', d: 'A 8 5 3', c: 'B 7 6 2' },
        titel: 'Partner 1♥: 7 punten, drie harten → 2♥',
        uitleg: 'Punten: 2 + 4 + 1 = 7. Drie harten bij partners vijf: fit. 6–9 punten: verhoog één keer naar 2♥.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 4', h: 'V 9 6 5', d: 'A 8 5 3', c: 'B 7 6' },
        titel: 'Partner 1♥: 10 punten, vier harten → 3♥',
        uitleg: 'Punten: 3 + 2 + 4 + 1 = 10. Fit in harten en 10–11 punten: verhoog naar 3♥, een invite.',
      },
      {
        soort: 'hand',
        hand: { s: 'A V 5 3', h: 'H 8 6', d: 'A 9 5 2', c: '8 4' },
        titel: 'Partner 1♥: 13 punten, drie harten → 1♠, later 4♥',
        uitleg:
          'Punten: 4 + 2 + 3 + 4 = 13. Samen minstens 25: manche. Een sprong naar 4♥ zou in ons systeem te zwak klinken, dus bied je eerst een nieuwe kleur, 1♠ (forcing), en daarna 4♥.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 9 6 4', h: 'A 7', d: 'H B 5', c: 'V 8 6 2' },
        titel: 'Partner 1♠: 13 punten, vier schoppen → 2♣, later 4♠',
        uitleg:
          'Punten: 3 + 4 + 4 + 2 = 13. Fit en 12+. De nieuwe kleur kies je in een lage kleur: klaveren (vier) is langer dan ruiten (drie), dus 2♣, en daarna 4♠.',
      },
      { soort: 'regel', tekst: 'Steun eerst: met 3+ kaarten in partners hoge kleur vertel je meteen je kracht.' },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1♥. Wat antwoord je?',
        hand: { s: '7 5 3', h: 'H 10 8 4', d: 'V 9 6 2', c: '8 5' },
        opties: ['2♥', 'Pas', '1SA', '3♥'],
        goed: 1,
        uitleg: 'Punten: 3 + 2 = 5. Met 0–5 pas je, ook met een fit.',
      },
      {
        vraag: 'Partner opent 1♠. Wat antwoord je?',
        hand: { s: 'V 8 5 3', h: '9 4', d: 'A B 7 2', c: 'H 6 3' },
        opties: ['2♠', '4♠', '3♠', '2♦'],
        goed: 2,
        uitleg: 'Punten: 2 + 5 + 3 = 10 met vier schoppen. Steun en 10–11: verhoog naar 3♠ (inviterend).',
      },
      {
        vraag: 'Partner opent 1♥. Wat antwoord je?',
        hand: { s: 'B 9 4', h: 'A 7 6', d: 'V 8 5 3', c: '10 6 2' },
        opties: ['2♥', '1SA', '1♠', '3♥'],
        goed: 0,
        uitleg: 'Punten: 1 + 4 + 2 = 7, drie harten mee. Steun met 6–9: 2♥.',
      },
      {
        vraag: 'Partner opent 1♥. Wat is je plan?',
        hand: { s: 'A H 7 4', h: 'V 8 5 2', d: 'H 6', c: '9 7 3' },
        opties: ['Direct 4♥', '3♥', '2♥', 'Eerst 1♠, later 4♥'],
        goed: 3,
        uitleg: 'Punten: 7 + 2 + 3 = 12 met hartensteun. Met 12+ bied je eerst een nieuwe kleur (1♠, forcing) en dan de manche.',
      },
      {
        vraag: 'Partner opent 1♠. Wat antwoord je?',
        hand: { s: '9 6 2', h: 'H 8 5', d: 'A 10 7 4', c: 'B 8 3' },
        opties: ['3♠', '2♠', '1SA', 'Pas'],
        goed: 1,
        uitleg: 'Punten: 3 + 4 + 1 = 8, drie schoppen mee. Steun met 6–9: 2♠.',
      },
    ],
  },
  {
    id: 'antwoorden-hoog-zonder-steun',
    deel: 'Antwoorden',
    titel: 'Antwoorden op 1♥/1♠ zonder steun',
    kern: 'Zonder steun: 1♠ op 1♥ met vier schoppen, een nieuwe kleur op 2-niveau met 10+, en anders 1SA met 6–9.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Heb je minder dan drie kaarten in partners kleur, dan is er (nog) geen fit. Je zoekt dan een ander antwoord. Er zijn drie mogelijkheden, die je in deze volgorde bekijkt.',
      },
      {
        soort: 'tabel',
        kop: ['Antwoord', 'Betekenis'],
        rijen: [
          ['1♠ (na 1♥)', '6+ punten en vier of meer schoppen. Forcing.'],
          ['Nieuwe kleur op 2-niveau', '10+ punten. 2♥ na 1♠ belooft bovendien vijf harten. Forcing.'],
          ['1SA', '6–9 punten, geen steun, geen ander passend bod'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'Na 1♥ kun je schoppen nog op 1-niveau bieden, want 1♠ is hoger dan 1♥. Dat kost geen ruimte, dus het kan al met 6 punten en een vierkaart. Op 2-niveau bieden is duurder: daarvoor heb je 10 punten nodig. Wil je na 1♠ harten bieden, dan moet dat 2♥ zijn, en dat belooft vijf harten en 10+.',
      },
      { soort: 'regel', tekst: 'Nieuwe kleur op 1-niveau: 6+. Nieuwe kleur op 2-niveau: 10+. Beide zijn forcing.' },
      {
        soort: 'tekst',
        tekst:
          '1SA is de "restbak": je hebt 6–9 punten maar geen steun en geen schoppenvierkaart om op 1-niveau te bieden. Het zegt niets over je verdeling, alleen dat je zwak bent. Partner mag erop passen.',
      },
      { soort: 'regel', tekst: '1SA als antwoord = 6–9 punten, geen steun, niets beters.' },
      {
        soort: 'hand',
        hand: { s: 'A V 5 3', h: '8 6', d: 'V 9 5 2', c: '8 4 2' },
        titel: 'Partner 1♥: 8 punten, vier schoppen → 1♠',
        uitleg: 'Punten: 4 + 2 + 2 = 8. Twee harten is geen steun. Vier schoppen: bied 1♠.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 5 3', h: '8 6', d: 'A V 9 5 2', c: 'H 4 2' },
        titel: 'Partner 1♥: 12 + 1 = 13 punten → 2♦',
        uitleg: 'Honneurs: 3 + 6 + 3 = 12, vijf ruiten +1 = 13. Geen steun, geen vier schoppen. Met 10+ bied je een nieuwe kleur op 2-niveau: 2♦.',
      },
      {
        soort: 'hand',
        hand: { s: '7 2', h: 'A H 10 8 5', d: 'V 6 3', c: '9 5 4' },
        titel: 'Partner 1♠: 9 + 1 = 10 punten, vijf harten → 2♥',
        uitleg: 'Honneurs: 7 + 2 = 9, vijf harten +1 = 10. Geen schoppensteun. 10+ en vijf harten: 2♥.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 5 3', h: '8 6', d: 'V 9 5 2', c: 'H B 4 2' },
        titel: 'Partner 1♥: 9 punten, niets passends → 1SA',
        uitleg: 'Punten: 3 + 2 + 3 + 1 = 9. Geen steun, geen vier schoppen, te zwak voor 2-niveau: 1SA.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1♥. Wat antwoord je?',
        hand: { s: 'V 10 7 4', h: '9 3', d: 'H 8 6 2', c: 'B 7 5' },
        opties: ['1SA', 'Pas', '1♠', '2♦'],
        goed: 2,
        uitleg: 'Punten: 2 + 3 + 1 = 6. Geen hartensteun, wel vier schoppen: 1♠ kan al met 6.',
      },
      {
        vraag: 'Partner opent 1♠. Wat antwoord je?',
        hand: { s: '8 4', h: 'H 7 5', d: 'A V 9 6 3', c: 'V 8 2' },
        opties: ['2♦', '1SA', '2♠', '3♦'],
        goed: 0,
        uitleg: 'Honneurs 11 + 1 lengte = 12. Geen steun; met 10+ bied je een nieuwe kleur op 2-niveau: 2♦.',
      },
      {
        vraag: 'Partner opent 1♠. Wat antwoord je?',
        hand: { s: '7 3', h: 'H B 8 4', d: 'V 9 6 2', c: 'H 7 5' },
        opties: ['2♥', '1SA', 'Pas', '2♦'],
        goed: 1,
        uitleg: 'Punten: 4 + 2 + 3 = 9. Geen steun, te zwak voor 2-niveau (en 2♥ belooft vijf harten): 1SA.',
      },
      {
        vraag: 'Partner opent 1♥. Wat antwoord je?',
        hand: { s: '8 2', h: '7 4', d: 'A 10 6 3', c: 'A H 9 5 3' },
        opties: ['1SA', '2♦', '3SA', '2♣'],
        goed: 3,
        uitleg: 'Honneurs 11 + 1 lengte = 12. Geen steun, geen schoppen. Nieuwe kleur op 2-niveau in je langste kleur: 2♣.',
      },
      {
        vraag: 'Partner opent 1♠. Wat antwoord je?',
        hand: { s: '6', h: 'A V 9 7', d: 'H 8 5 3 2', c: 'V 7 4' },
        opties: ['2♥', '2♦', '1SA', '2♠'],
        goed: 1,
        uitleg: 'Honneurs 11 + 1 lengte = 12. Geen steun. 2♥ belooft vijf harten (je hebt er vier), dus bied je vijfkaart ruiten: 2♦.',
      },
    ],
  },
  {
    id: 'antwoorden-lage-kleur',
    deel: 'Antwoorden',
    titel: 'Antwoorden op 1♣/1♦',
    kern: 'Na 1♣/1♦ bied je eerst een vierkaart hoog (bij 4-4 → 1♥); anders steun of sans: 1SA 6–9, 2SA 10–11, 3SA 12–15.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Opent partner 1♣ of 1♦, dan weet je dat hij geen vijfkaart hoog heeft. Hij kan wel een vierkaart harten of schoppen hebben. Omdat een fit in een hoge kleur zo waardevol is, laat jij éérst je vierkaart hoog zien. Dat gaat voor alles, of je nu 6 of 16 punten hebt.',
      },
      { soort: 'regel', tekst: 'Na 1♣/1♦: met 6+ en een vierkaart hoog bied je die eerst. Met twee vierkaarten: 1♥.' },
      {
        soort: 'tekst',
        tekst:
          'Heb je zowel vier harten als vier schoppen, bied dan 1♥, de laagste. Partner kan daarna nog 1♠ bieden als hij vier schoppen heeft, en zo vinden jullie elke fit. Heb je vijf schoppen en vier harten, bied dan de langste: 1♠.',
      },
      {
        soort: 'hand',
        hand: { s: 'V 8 7 4', h: 'A B 6 2', d: 'H 9 3', c: '5 4' },
        titel: 'Partner 1♣: 10 punten, 4-4 hoog → 1♥',
        uitleg: 'Punten: 2 + 5 + 3 = 10. Vier harten en vier schoppen: bied de laagste, 1♥.',
      },
      {
        soort: 'tekst',
        tekst:
          'Geen vierkaart hoog? Dan kijk je naar steun voor partners lage kleur. Omdat 1♣ soms maar drie kaarten is, wil je voor steun vijf klaveren of vier ruiten. Met 6–9 verhoog je één keer, met 10–11 twee keer (inviterend). Na 1♣ mag je met vier ruiten ook 1♦ bieden.',
      },
      {
        soort: 'hand',
        hand: { s: '9 6', h: 'H 8 4', d: '9 7 2', c: 'V 9 8 5 3' },
        titel: 'Partner 1♣: 5 + 1 = 6 punten, vijf klaveren → 2♣',
        uitleg: 'Honneurs: 3 + 2 = 5, vijfkaart +1 = 6. Geen vierkaart hoog, wel klaverensteun: 6–9, dus 2♣.',
      },
      {
        soort: 'tekst',
        tekst:
          'Is er geen vierkaart hoog en geen steun, dan antwoord je in sans atout, afhankelijk van je kracht.',
      },
      {
        soort: 'tabel',
        kop: ['Punten', 'Sans-antwoord'],
        rijen: [
          ['6–9', '1SA'],
          ['10–11', '2SA — inviterend'],
          ['12–15', '3SA — manche'],
        ],
      },
      {
        soort: 'hand',
        hand: { s: 'B 7 4', h: 'V 8 3', d: 'H 9 5', c: 'V 6 3 2' },
        titel: 'Partner 1♣: 8 punten → 1SA',
        uitleg: 'Punten: 1 + 2 + 3 + 2 = 8. Geen vierkaart hoog, geen vijf klaveren, geen vier ruiten: 1SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'H B 5', h: 'A 7 3', d: 'V 6 4', c: 'H 10 8 2' },
        titel: 'Partner 1♦: 13 punten → 3SA',
        uitleg: 'Punten: 4 + 4 + 2 + 3 = 13. Geen vierkaart hoog, geen ruitensteun: met 12–15 bied je meteen 3SA.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1♦. Wat antwoord je?',
        hand: { s: 'H 9 6 3', h: 'V 8 7 2', d: 'B 5', c: 'A 6 4' },
        opties: ['1♠', '1♥', '1SA', '2♦'],
        goed: 1,
        uitleg: 'Punten: 3 + 2 + 1 + 4 = 10. Twee vierkaarten hoog: bied de laagste, 1♥.',
      },
      {
        vraag: 'Partner opent 1♣. Wat antwoord je?',
        hand: { s: 'A 10 8 5', h: '9 6 3', d: 'V 7 4', c: 'B 8 2' },
        opties: ['1SA', '2♣', 'Pas', '1♠'],
        goed: 3,
        uitleg: 'Punten: 4 + 2 + 1 = 7. De vierkaart schoppen gaat voor alles: 1♠.',
      },
      {
        vraag: 'Partner opent 1♦. Wat antwoord je?',
        hand: { s: 'B 8 4', h: 'V 7 3', d: 'H 10 6 5 2', c: '9 5' },
        opties: ['2♦', '1SA', 'Pas', '3♦'],
        goed: 0,
        uitleg: 'Honneurs 6 + 1 lengte = 7. Geen vierkaart hoog, wel ruitensteun met 6–9: 2♦.',
      },
      {
        vraag: 'Partner opent 1♣. Wat antwoord je?',
        hand: { s: 'H 7 3', h: 'V 9 4', d: 'A B 6', c: 'V 8 5 2' },
        opties: ['2SA', '3♣', '3SA', '1♦'],
        goed: 2,
        uitleg: 'Punten: 3 + 2 + 5 + 2 = 12. Geen vierkaart hoog, geen vijf klaveren: met 12–15 bied je 3SA.',
      },
      {
        vraag: 'Partner opent 1♦. Wat antwoord je?',
        hand: { s: 'V 8 3', h: 'H 7 2', d: 'B 9 4', c: 'A 10 6 5' },
        opties: ['1SA', '2♣', '3SA', '2SA'],
        goed: 3,
        uitleg: 'Punten: 2 + 3 + 1 + 4 = 10. Geen vierkaart hoog, geen steun, geen vijfkaart om op 2-niveau te bieden: 2SA (10–11).',
      },
    ],
  },
  {
    id: 'antwoorden-1sa-basis',
    deel: 'Antwoorden',
    titel: 'Antwoorden op 1SA: pas, 2SA, 3SA',
    kern: 'Partner heeft 15–17: met 0–7 pas je, met 8–9 inviteer je met 2SA, met 10–15 bied je meteen 3SA.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Opent partner 1SA, dan heb jij het makkelijk: je weet zijn kracht op drie punten nauwkeurig (15–17) en je weet dat hij vlak is. Jij bent nu de kapitein: jij rekent uit of er een manche in zit. Tel je punten op bij die van partner en kijk naar de 25.',
      },
      {
        soort: 'tabel',
        kop: ['Jouw punten', 'Antwoord'],
        rijen: [
          ['0–7', 'Pas — zelfs tegenover 17 geen 25'],
          ['8–9', '2SA — inviterend: partner biedt 3SA met 16–17'],
          ['10–15', '3SA — samen zeker 25+'],
        ],
      },
      { soort: 'regel', tekst: 'Na 1SA: 0–7 pas · 8–9 2SA · 10–15 3SA.' },
      {
        soort: 'tekst',
        tekst:
          'In deze les gaan we uit van handen zonder vierkaart of vijfkaart hoog. Heb je die wel, dan zijn er speciale biedingen: Stayman (les 19) en Jacoby (les 20). Met 8–9 punten is het precies op het randje: met partners 15 kom je op 23–24, met zijn 17 op 25–26. Daarom laat je hem kiezen met 2SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 9 2', h: 'V 5 4', d: 'B 8 7 3', c: 'V 6 4' },
        titel: '8 punten → 2SA',
        uitleg: 'Punten: 3 + 2 + 1 + 2 = 8. Samen 23–25: twijfelgeval. Bied 2SA; partner past met 15 en biedt 3SA met 16–17.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 9 2', h: 'V 5 4', d: 'A B 7 3', c: 'V 6 4' },
        titel: '12 punten → 3SA',
        uitleg: 'Punten: 3 + 2 + 5 + 2 = 12. Samen minstens 27: bied direct de manche, 3SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'B 9 2', h: 'V 5 4', d: '10 8 7 3', c: 'H 6 4' },
        titel: '6 punten → pas',
        uitleg: 'Punten: 1 + 2 + 3 = 6. Hooguit 23 samen: geen manche. 1SA is een prima contract, dus pas.',
      },
      {
        soort: 'serie',
        stappen: [
          { wie: 'N', bod: '1SA' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '2SA' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '3SA' },
        ],
        uitleg: 'Zuid heeft 8 punten en inviteert. Noord heeft 17, een maximum, en neemt de uitnodiging aan: 3SA.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'V 7 3', h: 'H 8 5', d: 'B 9 6 2', c: '10 7 4' },
        opties: ['2SA', 'Pas', '3SA', '2♣'],
        goed: 1,
        uitleg: 'Punten: 2 + 3 + 1 = 6. Met 0–7 pas je.',
      },
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'A 6 4', h: 'V 9 3', d: 'H B 8 2', c: 'V 7 5' },
        opties: ['3SA', '2SA', 'Pas', '4SA'],
        goed: 0,
        uitleg: 'Punten: 4 + 2 + 4 + 2 = 12. Met 10–15 bied je meteen 3SA.',
      },
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'H 8 5', h: 'B 7 3', d: 'A 9 6 4', c: '10 8 2' },
        opties: ['Pas', '3SA', '2SA', '2♦'],
        goed: 2,
        uitleg: 'Punten: 3 + 1 + 4 = 8. Met 8–9 inviteer je met 2SA.',
      },
      {
        vraag: 'Jij opende 1SA met 17 punten, partner biedt 2SA. Wat doe je?',
        opties: ['Pas', '3♣', '4SA', '3SA'],
        goed: 3,
        uitleg: '2SA is een invite. Met een maximum (16–17) neem je die aan: 3SA.',
      },
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'V 9 4', h: 'H 6 3', d: 'A 10 7 5', c: 'B 8 4' },
        opties: ['2SA', '3SA', 'Pas', '6SA'],
        goed: 1,
        uitleg: 'Punten: 2 + 3 + 4 + 1 = 10. Met 10–15 is er samen 25+: 3SA.',
      },
    ],
  },
  {
    id: 'stayman',
    deel: 'Antwoorden',
    titel: 'Stayman: 2♣ na 1SA',
    kern: 'Met 8+ punten en een vierkaart hoog vraag je met 2♣ of partner ook een vierkaart hoog heeft: 2♦ = nee, 2♥/2♠ = ja.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Partner opent 1SA en jij hebt een vierkaart harten of schoppen. Misschien heeft partner er ook vier, en dan is 4♥ of 4♠ vaak een beter contract dan 3SA. Om dat te ontdekken is er een afspraak: Stayman. Je biedt 2♣, en dat betekent niets over klaveren, maar is een vraag.',
      },
      { soort: 'regel', tekst: '2♣ na 1SA (Stayman) = 8+ punten en een vierkaart hoog. Vraag: heb jij een vierkaart hoog?' },
      {
        soort: 'tabel',
        kop: ['Antwoord openaar', 'Betekenis'],
        rijen: [
          ['2♦', 'Ik heb geen vierkaart harten of schoppen'],
          ['2♥', 'Ik heb vier harten (misschien ook vier schoppen)'],
          ['2♠', 'Ik heb vier schoppen, geen vier harten'],
        ],
      },
      {
        soort: 'tekst',
        tekst:
          'Een bod dat iets anders betekent dan het lijkt, heet een conventie of kunstmatig bod. Stayman is de bekendste conventie. Waarom 8+? Omdat je na het antwoord nog moet kunnen doorbieden: met minder punten zou je in de problemen komen als partner 2♦ antwoordt.',
      },
      {
        soort: 'tekst',
        tekst:
          'Na het antwoord rekent de antwoorder verder. Fit gevonden? Met 8–9 punten verhoog je naar 3 (invite), met 10+ bied je 4♥ of 4♠. Geen fit? Dan bied je in sans: 2SA met 8–9, 3SA met 10+.',
      },
      { soort: 'regel', tekst: 'Na Stayman: fit → 3 in de kleur (8–9) of 4 (10+); geen fit → 2SA (8–9) of 3SA (10+).' },
      {
        soort: 'hand',
        hand: { s: 'H V 5 2', h: 'B 8 3', d: 'A 9 6 2', c: '7 4' },
        titel: '10 punten, vier schoppen → 2♣',
        uitleg: 'Punten: 3 + 2 + 1 + 4 = 10. Vierkaart schoppen en 8+: Stayman. Antwoordt partner 2♠, dan bied je 4♠; antwoordt hij 2♦ of 2♥, dan 3SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'V 9 7 4', h: 'H 8 3', d: 'B 6 5 2', c: '9 4' },
        titel: '6 punten, vier schoppen → pas',
        uitleg: 'Punten: 2 + 3 + 1 = 6. Te zwak voor Stayman (8+) en geen vijfkaart: pas.',
      },
      {
        soort: 'serie',
        stappen: [
          { wie: 'N', bod: '1SA' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '2♣' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '2♠' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '4♠' },
        ],
        uitleg: 'Zuid vraagt met 2♣ naar een vierkaart hoog. Noord heeft vier schoppen. Fit gevonden en Zuid heeft 10+: 4♠.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'A V 6 3', h: '8 5 2', d: 'H 10 7 4', c: '9 3' },
        opties: ['2SA', '2♣', '3SA', 'Pas'],
        goed: 1,
        uitleg: 'Punten: 4 + 2 + 3 = 9 met vier schoppen. 8+ en vierkaart hoog: Stayman, 2♣.',
      },
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'B 8 6 2', h: 'V 7 4', d: 'H 9 5', c: '8 6 3' },
        opties: ['2♣', '2SA', 'Pas', '2♠'],
        goed: 2,
        uitleg: 'Punten: 1 + 2 + 3 = 6. Te zwak voor Stayman: pas.',
      },
      {
        vraag: 'Na 1SA – 2♣ antwoordt partner 2♦. Wat betekent dat?',
        opties: ['Vier ruiten', 'Een sterke hand', 'Vijf ruiten', 'Geen vierkaart harten of schoppen'],
        goed: 3,
        uitleg: '2♦ is kunstmatig: "ik heb geen vierkaart hoog".',
      },
      {
        vraag: 'Je bood 2♣ (Stayman), partner antwoordt 2♠. Wat nu?',
        hand: { s: 'H V 8 4', h: 'A 7 5', d: 'V 9 6 3', c: '8 2' },
        opties: ['3♠', '3SA', '4♠', 'Pas'],
        goed: 2,
        uitleg: 'Punten: 5 + 4 + 2 = 11. Fit in schoppen en 10+: bied de manche, 4♠.',
      },
      {
        vraag: 'Je bood 2♣ (Stayman), partner antwoordt 2♥. Wat nu?',
        hand: { s: 'A 9 6 3', h: '8 5', d: 'H B 7 4', c: 'V 10 2' },
        opties: ['4♥', '3SA', '2SA', '3♥'],
        goed: 1,
        uitleg: 'Punten: 4 + 4 + 2 = 10. Partner heeft harten, jij schoppen: geen fit. Met 10+ bied je 3SA.',
      },
    ],
  },
  {
    id: 'jacoby-transfers',
    deel: 'Antwoorden',
    titel: 'Jacoby: 2♦ en 2♥ na 1SA',
    kern: 'Met een vijfkaart hoog na 1SA bied je de kleur eronder: 2♦ vraagt partner 2♥ te bieden, 2♥ vraagt 2♠ — met elke sterkte.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Heb je na partners 1SA een vijfkaart of langer in harten of schoppen, dan wil je die kleur vaak als troef. Maar het is slim als partner, de sterke hand, het contract speelt: dan blijven zijn honneurs verborgen en komt de uitkomst naar hém toe. Daarvoor bestaat de Jacoby-transfer.',
      },
      {
        soort: 'tabel',
        kop: ['Jij biedt', 'Betekenis'],
        rijen: [
          ['2♦', 'Ik heb 5+ harten. Partner, bied 2♥.'],
          ['2♥', 'Ik heb 5+ schoppen. Partner, bied 2♠.'],
        ],
      },
      { soort: 'regel', tekst: 'Jacoby: bied de kleur onder je vijfkaart hoog. 2♦ → 2♥, 2♥ → 2♠. Met elke sterkte.' },
      {
        soort: 'tekst',
        tekst:
          'De openaar moet de gevraagde kleur bieden; hij mag niet passen. Daarna beslist de antwoorder. Met 0–7 punten past hij: 2♥ of 2♠ is een veiliger contract dan 1SA met een zwakke lange kleur. Dat is het mooie van Jacoby: het werkt óók met een heel zwakke hand.',
      },
      {
        soort: 'tabel',
        kop: ['Na de transfer, met…', 'Tweede bod'],
        rijen: [
          ['0–7 punten', 'Pas'],
          ['8–9, vijfkaart', '2SA — inviterend'],
          ['8–9, zeskaart', '3♥ of 3♠ — inviterend'],
          ['10–15, vijfkaart', '3SA — partner kiest 4 in de kleur met 3+ kaarten'],
          ['10–15, zeskaart', 'Direct 4♥ of 4♠'],
        ],
      },
      {
        soort: 'hand',
        hand: { s: '4', h: 'H V 8 6 3 2', d: 'A 7 2', c: '9 6 2' },
        titel: '9 + 2 = 11 punten, zes harten → 2♦, daarna 4♥',
        uitleg: 'Honneurs: 3 + 2 + 4 = 9, zeskaart +2 = 11. Bied 2♦; partner moet 2♥ bieden. Met een zeskaart heb je samen minstens acht harten, en met 10+ punten is er samen 25+: bied nu 4♥.',
      },
      {
        soort: 'hand',
        hand: { s: '9 8 7 6 4 2', h: '5', d: 'B 6 3', c: '8 7 2' },
        titel: '1 + 2 = 3 punten, zes schoppen → 2♥, daarna pas',
        uitleg: 'Honneurs: 1, zeskaart +2 = 3. Bied 2♥, partner biedt 2♠ en jij past. In 2♠ heb je troeven; in 1SA zou je hand niets opleveren.',
      },
      {
        soort: 'hand',
        hand: { s: 'A V 9 7 5', h: '8 4', d: 'H 6 3', c: 'B 7 2' },
        titel: '10 + 1 = 11 punten, vijf schoppen → 2♥, daarna 3SA',
        uitleg: 'Honneurs: 4 + 2 + 3 + 1 = 10, vijfkaart +1 = 11. Bied 2♥ (transfer), partner biedt 2♠. Met 10+ en een vijfkaart bied je 3SA; heeft partner drie schoppen, dan kiest hij 4♠.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'H 9 7 6 3', h: '8 4', d: 'V 5 2', c: '7 6 3' },
        opties: ['2♠', 'Pas', '2♥', '2♣'],
        goed: 2,
        uitleg: 'Vijf schoppen: transfer met 2♥, en na partners 2♠ pas je met je 6 punten.',
      },
      {
        vraag: 'Partner opent 1SA. Wat antwoord je?',
        hand: { s: 'A 5', h: 'H B 9 6 4', d: '8 7 3', c: 'V 6 2' },
        opties: ['2♦', '2♥', '3SA', '2♣'],
        goed: 0,
        uitleg: 'Vijf harten: transfer met 2♦ (bied de kleur eronder). Daarna toon je je 11 punten met 3SA.',
      },
      {
        vraag: 'Jij opende 1SA, partner biedt 2♦. Wat bied je?',
        opties: ['Pas', '2♠', '2SA', '2♥'],
        goed: 3,
        uitleg: '2♦ is een transfer naar harten. Je moet 2♥ bieden.',
      },
      {
        vraag: 'Partner opent 1SA. Wat is je eerste bod?',
        hand: { s: 'V 7 4', h: 'A H 10 8 6 3', d: '9 5', c: '8 2' },
        opties: ['4♥', '2♦', '2♥', '3♥'],
        goed: 1,
        uitleg: 'Honneurs 9 + 2 lengte = 11 met zes harten. Eerst de transfer 2♦; na 2♥ bied je 4♥.',
      },
      {
        vraag: 'Na 1SA – 2♥ (jij) – 2♠ (partner). Wat bied je nu?',
        hand: { s: 'H B 8 4 2', h: 'A 7', d: 'V 9 6', c: '10 5 3' },
        opties: ['Pas', '3♠', '3SA', '4♠'],
        goed: 2,
        uitleg: 'Honneurs 10 + 1 lengte = 11 met een vijfkaart: 3SA. Partner kiest 4♠ als hij drie schoppen heeft.',
      },
    ],
  },
  {
    id: 'antwoorden-sterk-en-zwak',
    deel: 'Antwoorden',
    titel: 'Antwoorden op 2♣, 2SA en een zwakke twee',
    kern: 'Na 2♣ wacht je met 2♦ (of positief met 8+); na 2SA bied je manche vanaf 5 punten; na een zwakke twee pas je meestal.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Partner opent 2♣ (22+). Passen mag niet. Met een gewone hand antwoord je 2♦: het wachtbod. Dat kan met 0 punten. Heb je 8+ punten en een goede vijfkaart, dan mag je een positief antwoord geven in je kleur (2♥, 2♠, 3♣, 3♦), of 2SA met 8+ zonder vijfkaart.',
      },
      { soort: 'regel', tekst: 'Na 2♣: 2♦ = wachten (0+). Kleur = 8+ met vijfkaart. 2SA = 8+ vlak. Doorbieden tot de manche!' },
      {
        soort: 'hand',
        hand: { s: '9 7 5', h: 'B 8 6 3', d: 'V 4 2', c: '8 5 3' },
        titel: 'Partner 2♣: 3 punten → 2♦',
        uitleg: 'Punten: 1 + 2 = 3. Passen mag niet. Bied het wachtbod 2♦ en blijf bieden tot de manche.',
      },
      {
        soort: 'hand',
        hand: { s: 'A V 9 5 3', h: '8 4 2', d: 'H 7 2', c: '9 6' },
        titel: 'Partner 2♣: 9 + 1 = 10 punten, vijf schoppen → 2♠',
        uitleg: 'Honneurs: 4 + 2 + 3 = 9, vijfkaart +1 = 10. 8+ en een goede vijfkaart: positief antwoord 2♠. Slem komt in beeld!',
      },
      {
        soort: 'tekst',
        tekst:
          'Opent partner 2SA (20–21), dan heb je met 5 punten al 25 samen. Met 0–4 pas je. Met 5+ zonder vierkaart hoog bied je 3SA. Stayman en Jacoby werken hier ook, alleen één niveau hoger: 3♣ is Stayman (5+ en een vierkaart hoog), 3♦ en 3♥ zijn transfers.',
      },
      {
        soort: 'tabel',
        kop: ['Na 2SA', 'Betekenis'],
        rijen: [
          ['Pas', '0–4 punten'],
          ['3♣', 'Stayman: 5+ en een vierkaart hoog'],
          ['3♦ / 3♥', 'Jacoby: vijfkaart harten / schoppen, elke sterkte'],
          ['3SA', '5–11 punten, geen vierkaart hoog'],
        ],
      },
      {
        soort: 'hand',
        hand: { s: 'V 9 2', h: 'H 5 4', d: 'B 8 7 3', c: 'V 6 4' },
        titel: 'Partner 2SA: 8 punten → 3SA',
        uitleg: 'Punten: 2 + 3 + 1 + 2 = 8. Samen minstens 28, geen vierkaart hoog: 3SA.',
      },
      {
        soort: 'tekst',
        tekst:
          'Opent partner een zwakke twee, dan weet je precies wat hij heeft: 6–10 punten en een zeskaart. Meestal pas je, ook met een redelijke hand: zonder fit valt er weinig te halen. Met een fit (3+ kaarten) kun je verhogen om de tegenpartij nog meer te storen; dat is geen invite, partner moet passen. Met 16+ en een fit bied je zelf de manche.',
      },
      { soort: 'regel', tekst: 'Na een zwakke twee: meestal pas. Fit → verhogen om te storen. 16+ met fit → manche.' },
      {
        soort: 'hand',
        hand: { s: 'H 8 5 3', h: '7', d: 'A 9 6 4 2', c: '8 5 3' },
        titel: 'Partner 2♠: fit → 3♠ (storend)',
        uitleg: 'Punten: 3 + 4 + 1 = 8. Vier schoppen mee: samen tien schoppen. Verhoog naar 3♠, puur om de tegenpartij dwars te zitten. Partner past.',
      },
    ],
    vragen: [
      {
        vraag: 'Partner opent 2♣. Wat antwoord je?',
        hand: { s: '8 6 4', h: 'V 7 5 2', d: 'B 9 3', c: '10 6 4' },
        opties: ['Pas', '2♦', '2SA', '3♣'],
        goed: 1,
        uitleg: 'Passen mag niet op 2♣. Met 3 punten bied je het wachtbod 2♦.',
      },
      {
        vraag: 'Partner opent 2SA. Wat antwoord je?',
        hand: { s: 'H 8 4', h: 'B 7 3', d: 'V 9 6 2', c: '8 5 3' },
        opties: ['Pas', '3♣', '3SA', '4SA'],
        goed: 2,
        uitleg: 'Punten: 3 + 1 + 2 = 6. Met 5+ en geen vierkaart hoog bied je 3SA.',
      },
      {
        vraag: 'Partner opent 2♥ (zwak). Wat antwoord je?',
        hand: { s: 'H V 8 4', h: '7 3', d: 'A 9 6', c: 'V 10 5 2' },
        opties: ['Pas', '2SA', '3♥', '2♠'],
        goed: 0,
        uitleg: '11 punten en maar twee harten: geen fit en geen 16+. Pas.',
      },
      {
        vraag: 'Partner opent 2SA. Wat antwoord je?',
        hand: { s: 'H B 6 2', h: '9 7 5', d: 'V 8 4 3', c: '5 2' },
        opties: ['3SA', 'Pas', '3♦', '3♣'],
        goed: 3,
        uitleg: 'Punten: 4 + 2 = 6 met vier schoppen. Na 2SA is 3♣ Stayman (5+ en vierkaart hoog).',
      },
      {
        vraag: 'Partner opent 2♠ (zwak). Wat antwoord je?',
        hand: { s: 'A V 5', h: 'A 8 6 4', d: 'A H 7 2', c: '5 3' },
        opties: ['3♠', '4♠', 'Pas', '3SA'],
        goed: 1,
        uitleg: 'Punten: 6 + 4 + 7 = 17 met drie schoppen mee: 16+ en een fit, dus bied je de manche, 4♠.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DEEL 5 — DE TWEEDE RONDE
  // ════════════════════════════════════════════════════════════════
  {
    id: 'herbieding-openaar',
    deel: 'De tweede ronde',
    titel: 'De herbieding van de openaar',
    kern: 'Bij je tweede bod vertel je hoe sterk je opening is: minimum 12–14, matig 15–17 of maximum 18–19.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Een opening van één in een kleur beloofde 12–19 punten. Dat is een grote spanwijdte: met 12 en met 19 speel je heel verschillende contracten. Je tweede bod, de herbieding, is het moment om die spanwijdte kleiner te maken. Deel je hand daarvoor in drie groepen in.',
      },
      {
        soort: 'tabel',
        kop: ['Groep', 'Punten'],
        rijen: [
          ['Minimum', '12–14'],
          ['Matig (extra)', '15–17'],
          ['Maximum', '18–19'],
        ],
      },
      { soort: 'regel', tekst: 'Herbieding: minimum 12–14 · matig 15–17 · maximum 18–19. Hoe sterker, hoe hoger je biedt.' },
      {
        soort: 'tekst',
        tekst:
          'Daarna kies je wát je biedt. Eerst: kun je partners kleur steunen? Hij beloofde met een nieuwe kleur vier kaarten, dus met vier mee heb je een fit. Verhoog één keer met een minimum, twee keer met matig, en naar de manche met een maximum. Zonder fit kun je je eigen kleur herhalen (belooft een zeskaart), een nieuwe kleur bieden, of sans bieden met een vlakke hand.',
      },
      {
        soort: 'tabel',
        kop: ['Herbieding', 'Minimum / matig / maximum'],
        rijen: [
          ['Partners kleur steunen (4 mee)', 'Eén hoger / twee hoger / manche'],
          ['Eigen zeskaart herhalen', 'Zelfde niveau / sprong / manche'],
          ['Sans, vlak zonder fit', '1SA (12–14) / — / 2SA (18–19)'],
          ['Nieuwe lagere kleur', '12–17, niet forcing'],
        ],
      },
      {
        soort: 'hand',
        hand: { s: 'A 5', h: 'H B 9 3', d: '7', c: 'A V 8 6 4 2' },
        titel: '1♣ – 1♥: 16 punten, vier harten → 3♥',
        uitleg: 'Honneurs: 4 + 4 + 6 = 14, zeskaart +2 = 16: matig. Partner heeft vier harten, jij ook: fit. Met 15–17 verhoog je twee keer: 3♥, een invite.',
      },
      {
        soort: 'hand',
        hand: { s: 'A H V 9 6 4', h: 'B 4', d: 'H 8 2', c: '5 3' },
        titel: '1♠ – 1SA: 15 punten, zes schoppen → 3♠',
        uitleg: 'Honneurs: 9 + 1 + 3 = 13, zeskaart +2 = 15: matig. Herhaal je zeskaart met een sprong: 3♠, inviterend.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 8 4', h: '7 5', d: 'H B 4', c: 'A V 9 3 2' },
        titel: '1♣ – 1♥: 14 punten, vlak → 1SA',
        uitleg: 'Honneurs: 3 + 4 + 6 = 13, vijfkaart +1 = 14: minimum. Geen hartenfit, vlakke hand: 1SA (12–14).',
      },
      {
        soort: 'hand',
        hand: { s: 'H 9 7 4', h: 'A 5', d: 'V B 8 3', c: 'H 6 2' },
        titel: '1♦ – 1♠: 13 punten, vier schoppen → 2♠',
        uitleg: 'Punten: 3 + 4 + 3 + 3 = 13: minimum. Vier schoppen mee: fit. Met 12–14 verhoog je één keer: 2♠.',
      },
    ],
    vragen: [
      {
        vraag: 'Jij opende 1♥, partner antwoordt 1♠. Wat herbied je?',
        hand: { s: 'H 7 3', h: 'A V 9 6 4', d: 'H 8 5', c: '7 2' },
        opties: ['2♠', '1SA', '2♥', '2SA'],
        goed: 1,
        uitleg: 'Honneurs 12 + 1 = 13: minimum. Drie schoppen is geen fit met zijn vier, geen zeskaart harten, vlak: 1SA.',
      },
      {
        vraag: 'Jij opende 1♠, partner antwoordt 1SA. Wat herbied je?',
        hand: { s: 'A H B 8 7 3', h: 'V 4', d: 'A 9 6', c: '8 5' },
        opties: ['2♠', '4♠', '3♠', 'Pas'],
        goed: 2,
        uitleg: 'Honneurs 14 + 2 = 16: matig. Zeskaart schoppen met een sprong herhalen: 3♠ (invite).',
      },
      {
        vraag: 'Jij opende 1♦, partner antwoordt 1♠. Wat herbied je?',
        hand: { s: 'A V 7 3', h: 'H 5', d: 'A H 9 6 4', c: '8 2' },
        opties: ['3♠', '2♠', '4♠', '1SA'],
        goed: 0,
        uitleg: 'Honneurs 16 + 1 = 17: matig. Vier schoppen mee is een fit; met 15–17 verhoog je twee keer: 3♠.',
      },
      {
        vraag: 'Jij opende 1♣, partner antwoordt 1♥. Wat herbied je?',
        hand: { s: 'A H 6', h: 'H V 8 3', d: 'A 7', c: 'H 9 5 4' },
        opties: ['2♥', '3♥', '2SA', '4♥'],
        goed: 3,
        uitleg: 'Punten: 7 + 5 + 4 + 3 = 19: maximum. Vier harten mee: fit. Met 18–19 bied je direct de manche, 4♥.',
      },
      {
        vraag: 'Jij opende 1♦, partner antwoordt 1♥. Wat herbied je?',
        hand: { s: 'A H 5', h: '8 4', d: 'H V 7 6 3', c: 'A B 2' },
        opties: ['1SA', '2SA', '3SA', '2♦'],
        goed: 1,
        uitleg: 'Honneurs 17 + 1 = 18: maximum. Geen hartenfit, vlakke hand: 2SA (18–19).',
      },
    ],
  },
  {
    id: 'reverse-en-sprongen',
    deel: 'De tweede ronde',
    titel: 'Reverse en sprongen',
    kern: 'Een nieuwe kleur hoger dan je eerste kleur op 2-niveau (reverse) belooft 16+ en is forcing; sprongen tonen extra kracht.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Als openaar kun je bij je herbieding een tweede kleur noemen. Dan is het belangrijk op welk niveau dat gebeurt. Bied je een lagere kleur dan je eerste kleur, dan kan partner op 2-niveau terug naar jouw eerste kleur. Dat is goedkoop, en kan dus met een minimum: 12–17 punten, niet forcing.',
      },
      {
        soort: 'hand',
        hand: { s: '7 2', h: '9 6', d: 'A V 9 6 4', c: 'A H 8 3' },
        titel: '1♦ – 1♠ – 2♣: gewone tweede kleur (12–17)',
        uitleg: 'Honneurs: 6 + 7 = 13, vijfkaart +1 = 14. Na 1♠ bied je je klaveren: 2♣ staat lager dan ruiten, dus partner kan goedkoop terug naar 2♦. Geen extra kracht nodig.',
      },
      {
        soort: 'tekst',
        tekst:
          'Anders wordt het als je tweede kleur hóger is dan je eerste, en je hem op 2-niveau moet bieden: bijvoorbeeld 1♦ – 1♠ – 2♥. Wil partner terug naar ruiten, dan moet hij 3♦ bieden: één niveau hoger. Zo’n herbieding heet een reverse en belooft daarom een sterke hand: 16 punten of meer. Een reverse is forcing voor één ronde.',
      },
      { soort: 'regel', tekst: 'Reverse = nieuwe kleur hoger dan je eerste, op 2-niveau. Belooft 16+ en is forcing.' },
      {
        soort: 'hand',
        hand: { s: '4', h: 'A H 8 6', d: 'A V 10 8 4', c: 'H 7 3' },
        titel: '1♦ – 1♠ – 2♥: reverse met 17 punten',
        uitleg: 'Honneurs: 7 + 6 + 3 = 16, vijfkaart +1 = 17. Geen schoppenfit. Je toont je harten met 2♥: hoger dan ruiten, dus een reverse, en met 16+ mag dat.',
      },
      {
        soort: 'tekst',
        tekst:
          'Ook met een sprong vertel je dat je extra hebt. Spring je in je eigen kleur (1♥ – 1♠ – 3♥), dan toon je een zeskaart met 15–17. Spring je naar 2SA (1♣ – 1♠ – 2SA), dan toon je een vlakke hand met 18–19. Met 18–19 en een goede eigen zeskaart, of een fit, bied je zelf de manche.',
      },
      { soort: 'regel', tekst: 'Sprong in eigen zeskaart = 15–17. Sprong naar 2SA = 18–19 vlak.' },
      {
        soort: 'hand',
        hand: { s: 'H 5', h: 'A V 4', d: 'H B 7', c: 'A 10 8 6 2' },
        titel: '1♣ – 1♠ – 2SA: 18 punten, vlak',
        uitleg: 'Honneurs: 3 + 6 + 4 + 4 = 17, vijfkaart +1 = 18. Vlak (5-3-3-2), geen schoppenfit. Met 18–19 spring je naar 2SA.',
      },
      {
        soort: 'hand',
        hand: { s: 'H 4', h: 'A H V 9 7 3', d: 'A 8 5', c: '6 2' },
        titel: '1♥ – 1♠ – 4♥: 18 punten, zes sterke harten',
        uitleg: 'Honneurs: 3 + 9 + 4 = 16, zeskaart +2 = 18: maximum. Je harten zijn zo goed dat je zelf de manche biedt: 4♥.',
      },
    ],
    vragen: [
      {
        vraag: 'Wat belooft de openaar met 1♦ – 1♠ – 2♥?',
        opties: ['12–14, niet forcing', '16+ punten, forcing', 'Een zwakke hand', 'Een zeskaart harten'],
        goed: 1,
        uitleg: '2♥ is hoger dan ruiten op 2-niveau: een reverse. Dat belooft 16+ en partner mag niet passen.',
      },
      {
        vraag: 'Jij opende 1♦, partner antwoordt 1♠. Wat herbied je?',
        hand: { s: '6', h: 'A V 9 4', d: 'A H 8 7 5', c: 'H 6 2' },
        opties: ['2♥', '1SA', '2♦', '3♦'],
        goed: 0,
        uitleg: 'Honneurs 16 + 1 = 17. Met 16+ mag je reversen: 2♥ toont je harten en je kracht.',
      },
      {
        vraag: 'Jij opende 1♦, partner antwoordt 1♠. Wat herbied je?',
        hand: { s: '5', h: 'V 9 8', d: 'A H 7 6 3', c: 'H 8 4 2' },
        opties: ['1SA', '3♣', '2♣', '2♥'],
        goed: 2,
        uitleg: 'Honneurs 12 + 1 = 13: minimum. Klaveren is lager dan ruiten, dus 2♣ is geen reverse en kan met 12–17.',
      },
      {
        vraag: 'Jij opende 1♥, partner antwoordt 1♠. Wat herbied je?',
        hand: { s: 'A 7', h: 'A H B 10 8 4', d: 'H 5 2', c: '9 3' },
        opties: ['2♥', '3♥', '4♥', '2SA'],
        goed: 1,
        uitleg: 'Honneurs 15 + 2 = 17: matig. Met een zeskaart en 15–17 spring je in je kleur: 3♥.',
      },
      {
        vraag: 'Wat toont de openaar met 1♣ – 1♥ – 2SA?',
        opties: ['12–14 vlak', '15–17 vlak', 'Een zeskaart klaveren', '18–19 vlak'],
        goed: 3,
        uitleg: 'Met 15–17 vlak had hij 1SA geopend. De sprong naar 2SA toont 18–19 met een vlakke hand.',
      },
    ],
  },
  {
    id: 'tweede-beurt-antwoorder',
    deel: 'De tweede ronde',
    titel: 'De tweede beurt van de antwoorder',
    kern: 'Tel je punten op bij het midden van partners range: onder 25 stop je, rond 25 inviteer je, met 25+ bied je de manche.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Na de herbieding van de openaar weet jij als antwoorder zijn kracht een stuk preciezer. Nu kun je de rekening maken. Neem het midden van zijn range (minimum ongeveer 13, matig ongeveer 16, maximum ongeveer 18–19) en tel daar je eigen punten bij op.',
      },
      {
        soort: 'tabel',
        kop: ['Samen', 'Wat doe je?'],
        rijen: [
          ['minder dan 25', 'Stop: pas of kies een veilige deelscore'],
          ['ongeveer 25', 'Inviteer: laat partner beslissen'],
          ['ruim 25 of meer', 'Bied de manche'],
        ],
      },
      { soort: 'regel', tekst: 'Midden van partners range + jouw punten. Samen 25 → manche.' },
      {
        soort: 'tekst',
        tekst:
          'Onthoud ook wat jij zelf al beloofde. Met 6–9 ben je zwak en pas je meestal op een minimum-herbieding; op een invite van partner bied je door met 8–9 en pas je met 6–7. Met 10–11 inviteer je zelf: partners kleur naar 3 tillen, je eigen goede kleur op 3-niveau herhalen, of 2SA. Met 12+ bied je de manche.',
      },
      {
        soort: 'tabel',
        kop: ['Jij hebt', 'Tweede bod (meestal)'],
        rijen: [
          ['6–9', 'Pas of een eenvoudige voorkeur; op een invite door met 8–9'],
          ['10–11', 'Inviteren: 3 in de fit, of 2SA'],
          ['12–15', 'Manche: 3SA, 4♥ of 4♠'],
        ],
      },
      {
        soort: 'hand',
        hand: { s: 'H V 8 4', h: 'A 7 5', d: 'V 9 3', c: 'B 6 2' },
        titel: '1♦ – 1♠ – 2♠: 12 punten → 4♠',
        uitleg: 'Punten: 5 + 4 + 2 + 1 = 12. Partner heeft een minimum (rond 13) en vier schoppen. 13 + 12 = 25 met een fit: 4♠.',
      },
      {
        soort: 'hand',
        hand: { s: '9 5', h: 'A V 8 6 3', d: 'H 7 4', c: '8 6 2' },
        titel: '1♣ – 1♥ – 1♠: 10 punten → 3♥ (invite)',
        uitleg: 'Honneurs: 6 + 3 = 9, vijfkaart +1 = 10. Partner heeft 12–17 (rond 14): samen ongeveer 24. Inviteer door je vijfkaart harten op 3-niveau te bieden; partner kiest.',
      },
      {
        soort: 'hand',
        hand: { s: 'V 7 4', h: 'H 8 5 3', d: 'B 9 6', c: 'H 8 2' },
        titel: '1♠ – 2♠ – 3♠: 9 punten → 4♠',
        uitleg: 'Punten: 2 + 3 + 1 + 3 = 9. Je beloofde 6–9; partner nodigt uit met 3♠. Met de bovenkant (8–9) neem je de invite aan: 4♠.',
      },
      {
        soort: 'serie',
        stappen: [
          { wie: 'N', bod: '1♥' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: '2♥' },
          { wie: 'W', bod: 'pas' },
          { wie: 'N', bod: '3♥' },
          { wie: 'O', bod: 'pas' },
          { wie: 'Z', bod: 'pas' },
        ],
        uitleg: 'Zuid gaf 2♥ met 6–9. Noord inviteert met 3♥ (15–17). Zuid heeft maar 6 punten, de onderkant, en past.',
      },
    ],
    vragen: [
      {
        vraag: '1♥ (partner) – 2♥ (jij) – 3♥ (partner). Wat doe je?',
        hand: { s: 'B 8 4', h: 'V 9 6', d: 'H 7 5 3', c: '8 6 2' },
        opties: ['4♥', 'Pas', '3SA', '4♣'],
        goed: 1,
        uitleg: 'Punten: 1 + 2 + 3 = 6, de onderkant van 6–9. Wijs de invite af: pas.',
      },
      {
        vraag: '1♣ (partner) – 1♠ (jij) – 1SA (partner, 12–14). Wat doe je?',
        hand: { s: 'A V 9 6', h: 'H 7 3', d: 'H 8 2', c: '7 5 4' },
        opties: ['2SA', 'Pas', '4♠', '3SA'],
        goed: 3,
        uitleg: 'Punten: 6 + 3 + 3 = 12. Partner rond 13: samen 25. Hij heeft geen vier schoppen (anders steunde hij): 3SA.',
      },
      {
        vraag: '1♦ (partner) – 1♥ (jij) – 1SA (partner, 12–14). Wat doe je?',
        hand: { s: 'H 8 4', h: 'A V 7 6', d: 'B 5 2', c: '10 9 4' },
        opties: ['Pas', '2SA', '3SA', '2♥'],
        goed: 1,
        uitleg: 'Punten: 3 + 6 + 1 = 10. Partner rond 13: samen ongeveer 23–24. Inviteer met 2SA; partner biedt 3SA met 14.',
      },
      {
        vraag: '1♥ (partner) – 1♠ (jij) – 2♥ (partner, minimum). Wat doe je?',
        hand: { s: 'H V 8 5', h: '7 4', d: 'V 9 6 3', c: 'B 8 2' },
        opties: ['Pas', '2SA', '3♥', '2♠'],
        goed: 0,
        uitleg: 'Punten: 5 + 2 + 1 = 8. Partner heeft een minimum: samen hooguit 22. Hij heeft zes harten, dus 2♥ is prima: pas.',
      },
      {
        vraag: '1♠ (partner) – 2♠ (jij) – 3♠ (partner). Wat doe je?',
        hand: { s: 'H 8 5', h: 'V 9 6 3', d: 'A 7 4', c: '8 6 2' },
        opties: ['Pas', '3SA', '4♠', '4♥'],
        goed: 2,
        uitleg: 'Punten: 3 + 2 + 4 = 9, de bovenkant van 6–9. Neem de invite aan: 4♠.',
      },
    ],
  },
  {
    id: 'forcing-inviterend-passen',
    deel: 'De tweede ronde',
    titel: 'Forcing, inviterend en wanneer je mag passen',
    kern: 'Op een forcing bod mag je nooit passen; op een invite kies je zelf; op een begrensd bod mag partner passen.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Elk bod valt in een van drie soorten, en het is belangrijk dat je ze herkent. Passen op een forcing bod is een van de duurste fouten in bridge: partner had misschien wel 18 punten en jullie spelen ineens op 1-niveau.',
      },
      {
        soort: 'tabel',
        kop: ['Soort', 'Betekenis'],
        rijen: [
          ['Forcing', 'Partner mag niet passen; de kracht is nog niet begrensd'],
          ['Mancheforcing', 'Niemand mag passen vóór de manche (bijv. na 2♣)'],
          ['Inviterend', 'Uitnodiging: partner past met een minimum, biedt manche met extra'],
          ['Begrensd / afsluitend', 'De kracht is bekend; partner mag passen'],
        ],
      },
      { soort: 'regel', tekst: 'Een nieuwe kleur van de antwoorder is forcing. Passen mag dan niet.' },
      {
        soort: 'tabel',
        kop: ['Voorbeeld', 'Soort'],
        rijen: [
          ['1♥ – 1♠ / 1♥ – 2♣', 'Forcing (nieuwe kleur van de antwoorder)'],
          ['1♦ – 1♠ – 2♥', 'Forcing (reverse)'],
          ['2♣ – 2♦', 'Mancheforcing'],
          ['1SA – 2♣ / 1SA – 2♦', 'Forcing: partner moet antwoorden'],
          ['1♥ – 3♥ / 1SA – 2SA', 'Inviterend'],
          ['1♥ – 2♥ / 1♥ – 1SA', 'Begrensd: 6–9, openaar mag passen'],
        ],
      },
      { soort: 'regel', tekst: 'Een invite (zoals 1♥ – 3♥ of 1SA – 2SA): pas met een minimum, manche met een maximum.' },
      {
        soort: 'hand',
        hand: { s: 'B 6', h: 'H 8 3', d: 'A V 9 4', c: 'V 7 5 2' },
        titel: '1♦ – 1♠: 12 punten, je moet bieden → 1SA',
        uitleg: 'Punten: 1 + 3 + 6 + 2 = 12, minimum. Partners 1♠ is forcing, dus passen mag niet, hoe zwak je ook bent. Geen schoppenfit, vlak: 1SA (12–14).',
      },
      {
        soort: 'hand',
        hand: { s: 'A 8 4', h: 'H V 8 6 2', d: 'V 7 3', c: '9 5' },
        titel: '1♥ – 3♥: 12 punten → pas',
        uitleg: 'Honneurs: 4 + 5 + 2 = 11, vijfkaart +1 = 12. Partner inviteert met 10–11. Samen 22–23: te weinig. Wijs de invite af: pas.',
      },
      {
        soort: 'tekst',
        tekst:
          'Twijfel je? Kies dan het veiligste bod dat partner nog kan corrigeren. Bij een forcing bod van partner is een eenvoudig bod (1SA, je kleur herhalen, partners kleur steunen) altijd beter dan passen.',
      },
    ],
    vragen: [
      {
        vraag: 'Welk biedverloop is forcing (partner mag niet passen)?',
        opties: ['1♥ – 2♥', '1♥ – 1SA', '1SA – 2SA', '1♥ – 1♠'],
        goed: 3,
        uitleg: 'Een nieuwe kleur van de antwoorder is forcing. 2♥ en 1SA zijn begrensd (6–9), 2SA is inviterend.',
      },
      {
        vraag: 'Jij opende 1♥, partner verhoogt naar 2♥. Wat doe je?',
        hand: { s: 'A 7 3', h: 'H B 9 6 4', d: 'V 8 5', c: 'H 6' },
        opties: ['3♥', '4♥', 'Pas', '2SA'],
        goed: 2,
        uitleg: 'Honneurs 13 + 1 = 14: minimum. Partner heeft 6–9: samen hooguit 23. 2♥ is begrensd, dus je mag passen.',
      },
      {
        vraag: 'Wat betekent "inviterend"?',
        opties: [
          'Partner moet passen',
          'Partner kiest: pas met een minimum, manche met een maximum',
          'Niemand mag passen tot de manche',
          'Het bod is kunstmatig',
        ],
        goed: 1,
        uitleg: 'Een invite is een uitnodiging tot de manche. De beslissing ligt bij partner.',
      },
      {
        vraag: '2♣ (partner) – 2♦ (jij) – 2♥ (partner). Je hebt 2 punten. Wat doe je?',
        opties: [
          'Doorbieden: 2♣ is mancheforcing, passen mag niet',
          'Pas, je hebt niets',
          'Pas, partner weet dat je zwak bent',
          'Alleen bieden met 6+',
        ],
        goed: 0,
        uitleg: 'Na 2♣ mag niemand passen voordat de manche bereikt is, ook niet met 0 punten.',
      },
      {
        vraag: 'Jij opende 1SA met 15 punten, partner biedt 2SA. Wat doe je?',
        opties: ['3SA', 'Pas', '4SA', '3♣'],
        goed: 1,
        uitleg: '2SA is een invite (8–9). Met 15, het minimum, wijs je af: pas.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // DEEL 6 — SPELEN
  // ════════════════════════════════════════════════════════════════
  {
    id: 'uitkomen-troef-trekken-snit',
    deel: 'Spelen',
    titel: 'Uitkomen, troef trekken en de snit',
    kern: 'Kom uit met de top van een reeks of de vierde van boven, trek als leider eerst de troeven, en gebruik de snit om een heer te vangen.',
    blokken: [
      {
        soort: 'tekst',
        tekst:
          'Tot slot een eerste blik op het afspelen. Als verdediger begint het met de uitkomst. Heb je een reeks honneurs naast elkaar, zoals H-V-B, kom dan uit met de hoogste: de heer. Die kan de aas eruit drijven, waarna je vrouw en boer winnaars worden. Heb je geen reeks, kom dan tegen sans atout uit met de vierde kaart van boven in je langste kleur.',
      },
      { soort: 'regel', tekst: 'Uitkomen: top van een reeks (H uit H-V-B). Anders tegen SA: de vierde van boven in je langste kleur.' },
      {
        soort: 'hand',
        hand: { s: 'H V B 4', h: '8 6 3', d: '9 7 5 2', c: '10 4' },
        titel: 'Uitkomst tegen 3SA: ♠H',
        uitleg: 'Je schoppens vormen een reeks H-V-B. Kom uit met de hoogste, de ♠H. Neemt de leider met de aas, dan zijn je ♠V en ♠B later baas.',
      },
      {
        soort: 'tekst',
        tekst:
          'Als leider in een troefcontract tel je eerst: hoeveel troeven hebben wij samen, en hoeveel hebben de tegenstanders dus? Daarna trek je meestal eerst de troeven: je speelt troef tot de tegenstanders er geen meer hebben. Zo kunnen ze je winnaars in andere kleuren niet meer introeven.',
      },
      { soort: 'regel', tekst: 'Troef trekken: speel troef tot de tegenstanders er geen meer hebben. Tel ze mee!' },
      {
        soort: 'tekst',
        tekst:
          'De snit is de bekendste speeltechniek. Stel: je hebt A-V in een kleur en de heer ontbreekt. Speel je eerst de aas, dan wint de heer later van je vrouw. Speel je in plaats daarvan vanuit de andere hand een kleine kaart náár je A-V, dan wacht je af wat de tegenstander ertussen doet. Legt hij klein, dan speel je de vrouw. Zat de heer bij hem, dan wint je vrouw! Dat lukt ongeveer de helft van de keren.',
      },
      { soort: 'regel', tekst: 'Snit: speel klein náár je A-V. Zit de heer vóór je A-V, dan wint de vrouw.' },
      {
        soort: 'hand',
        hand: { s: 'A V 5', h: 'A H B 9 4', d: 'H 7 3', c: '8 2' },
        titel: 'Leider (Zuid) in 4♥',
        uitleg: 'Dit is jouw hand. In de dummy (Noord) liggen ♥V 10 7 6: samen negen troeven, dus vier bij de tegenstanders. Trek eerst troef. Daarna speel je vanuit de dummy een kleine schoppen naar je ♠A-V: legt Oost klein, dan speel je de ♠V (de snit).',
      },
      {
        soort: 'hand',
        hand: { s: '8 6 3', h: 'V 10 7 6', d: 'A 5 2', c: 'H 9 4' },
        titel: 'Dummy (Noord) in 4♥',
        uitleg: 'De dummy ligt open. Hieruit speel je de kleine schoppen naar de ♠A-V van Zuid. Oost speelt vóór Zuid: heeft Oost de ♠H, dan wint je ♠V. Gebruik de ♦A of ♣H om in de dummy te komen.',
      },
      {
        soort: 'tekst',
        tekst:
          'Gefeliciteerd: je hebt nu het hele fundament van bridge gezien, van de slag tot de snit. Speel veel spellen in de biedtrainer en herhaal lessen die nog lastig voelen. Bridge leer je door het te doen.',
      },
    ],
    vragen: [
      {
        vraag: 'Wie doet de uitkomst?',
        opties: ['De leider', 'De dummy', 'De verdediger links van de leider', 'De verdediger rechts van de leider'],
        goed: 2,
        uitleg: 'De speler links van de leider (die na hem aan de beurt is) komt uit.',
      },
      {
        vraag: 'Je komt uit tegen 3SA. Welke kaart kies je?',
        hand: { s: 'H V B 7', h: '9 5', d: '8 6 4 2', c: 'A 7 3' },
        opties: ['♣A', '♦2', '♠7', '♠H'],
        goed: 3,
        uitleg: 'Je hebt de reeks H-V-B in schoppen: kom uit met de top, de ♠H.',
      },
      {
        vraag: 'Waarom trek je als leider meestal eerst de troeven?',
        opties: [
          'Omdat het verplicht is',
          'Zodat de tegenstanders je winnaars niet kunnen introeven',
          'Om de dummy te ontlasten',
          'Om punten te tellen',
        ],
        goed: 1,
        uitleg: 'Zolang de tegenstanders troef hebben, kunnen ze je goede kaarten in andere kleuren introeven.',
      },
      {
        vraag: 'Je hebt A-V tegenover kleine kaarten en snijdt op de heer. Waar moet de heer zitten?',
        opties: ['In de dummy', 'Bij de tegenstander die ná je A-V speelt', 'Bij de tegenstander die vóór je A-V aan de beurt is', 'Maakt niet uit'],
        goed: 2,
        uitleg: 'Je speelt klein náár de A-V. Speelt de tegenstander met de heer vóór jou, dan kun je de vrouw leggen en wint die.',
      },
      {
        vraag: 'Jullie hebben samen negen troeven. Hoeveel hebben de tegenstanders?',
        opties: ['3', '4', '5', '2'],
        goed: 1,
        uitleg: 'Elke kleur heeft 13 kaarten: 13 − 9 = 4 troeven bij de tegenstanders.',
      },
    ],
  },
]
