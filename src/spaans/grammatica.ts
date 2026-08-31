// Beknopte Spaanse grammatica-uitleg in het Nederlands.

export type GrammaticaVoorbeeld = { es: string; nl: string }

export type Grammatica = {
  id: string
  titel: string
  uitleg: string
  voorbeelden: GrammaticaVoorbeeld[]
}

export const GRAMMATICA: Grammatica[] = [
  {
    id: 'lidwoorden',
    titel: 'Lidwoorden & geslacht',
    uitleg: 'Elk zelfstandig naamwoord is mannelijk of vrouwelijk. Bepaalde lidwoorden zijn el (mannelijk enkelvoud), la (vrouwelijk enkelvoud), los en las (meervoud). Onbepaalde lidwoorden zijn un (mannelijk) en una (vrouwelijk). Woorden op -o zijn meestal mannelijk, die op -a meestal vrouwelijk, maar er zijn uitzonderingen zoals el día (dag) en la mano (hand). Vrouwelijke woorden die beginnen met een beklemtoonde a- krijgen in het enkelvoud el (el agua), maar blijven vrouwelijk.',
    voorbeelden: [
      { es: 'el libro', nl: 'het boek' },
      { es: 'la mesa', nl: 'de tafel' },
      { es: 'los niños', nl: 'de kinderen' },
      { es: 'una casa', nl: 'een huis' },
      { es: 'el agua fría', nl: 'het koude water' },
    ],
  },
  {
    id: 'meervoud',
    titel: 'Meervoud van zelfstandige naamwoorden',
    uitleg: 'Woorden die eindigen op een klinker krijgen -s in het meervoud (libro → libros). Woorden die eindigen op een medeklinker krijgen -es (papel → papeles). Woorden op -z veranderen de z in c en krijgen -es (luz → luces). Bij woorden op onbeklemtoonde -es of -is blijft de vorm soms gelijk (el lunes → los lunes). Let op dat een accent in het enkelvoud in het meervoud kan verdwijnen (canción → canciones).',
    voorbeelden: [
      { es: 'el coche → los coches', nl: 'de auto → de auto\'s' },
      { es: 'la ciudad → las ciudades', nl: 'de stad → de steden' },
      { es: 'la voz → las voces', nl: 'de stem → de stemmen' },
      { es: 'la canción → las canciones', nl: 'het lied → de liederen' },
    ],
  },
  {
    id: 'bijvoeglijk',
    titel: 'Bijvoeglijke naamwoorden',
    uitleg: 'Een bijvoeglijk naamwoord komt overeen met het zelfstandig naamwoord in geslacht en getal, en staat meestal erachter. Woorden op -o hebben vier vormen: -o, -a, -os, -as (rojo, roja, rojos, rojas). Woorden op -e of op een medeklinker veranderen niet van geslacht, alleen in getal (verde → verdes, azul → azules). Nationaliteiten op een medeklinker krijgen wél een vrouwelijke -a (español → española).',
    voorbeelden: [
      { es: 'el coche rojo', nl: 'de rode auto' },
      { es: 'la casa roja', nl: 'het rode huis' },
      { es: 'los libros verdes', nl: 'de groene boeken' },
      { es: 'una chica española', nl: 'een Spaans meisje' },
    ],
  },
  {
    id: 'ser-estar',
    titel: 'Ser vs. estar',
    uitleg: 'Beide betekenen \'zijn\', maar ze worden verschillend gebruikt. Ser gebruik je voor blijvende eigenschappen: identiteit, herkomst, beroep, tijd en wezenlijke kenmerken (Soy alto, Es médico). Estar gebruik je voor plaats, tijdelijke toestanden en stemmingen (Estoy cansado, Está en casa). Sommige bijvoeglijke naamwoorden veranderen van betekenis: ser aburrido = saai zijn, estar aburrido = zich vervelen.',
    voorbeelden: [
      { es: 'Soy holandés.', nl: 'Ik ben Nederlander.' },
      { es: 'Estoy cansado.', nl: 'Ik ben moe.' },
      { es: 'La sopa está caliente.', nl: 'De soep is warm.' },
      { es: 'Madrid está en España.', nl: 'Madrid ligt in Spanje.' },
      { es: 'Son las tres.', nl: 'Het is drie uur.' },
    ],
  },
  {
    id: 'tegenwoordige-tijd',
    titel: 'Tegenwoordige tijd van regelmatige werkwoorden',
    uitleg: 'Spaanse werkwoorden eindigen op -ar, -er of -ir. Je haalt de uitgang weg en plakt de persoonsuitgang aan de stam. Voor -ar: -o, -as, -a, -amos, -áis, -an (hablar → hablo). Voor -er: -o, -es, -e, -emos, -éis, -en (comer → como). Voor -ir: -o, -es, -e, -imos, -ís, -en (vivir → vivo). Omdat de uitgang de persoon aangeeft, is het onderwerpspronomen (yo, tú...) vaak overbodig.',
    voorbeelden: [
      { es: 'Hablo español.', nl: 'Ik spreek Spaans.' },
      { es: '¿Comes carne?', nl: 'Eet jij vlees?' },
      { es: 'Vivimos en Ámsterdam.', nl: 'Wij wonen in Amsterdam.' },
      { es: 'Ellos trabajan mucho.', nl: 'Zij werken veel.' },
    ],
  },
  {
    id: 'stamverandering',
    titel: 'Werkwoorden met klinkerverandering in de stam',
    uitleg: 'Bij sommige werkwoorden verandert de beklemtoonde klinker in de stam in de tegenwoordige tijd. De belangrijkste patronen zijn o→ue (poder → puedo), e→ie (querer → quiero) en e→i (pedir → pido). Deze verandering treedt op in alle personen behalve nosotros en vosotros, omdat daar de klemtoon niet op de stam valt. De uitgangen blijven wel gewoon regelmatig.',
    voorbeelden: [
      { es: 'Puedo ayudar.', nl: 'Ik kan helpen.' },
      { es: 'Quiero café.', nl: 'Ik wil koffie.' },
      { es: 'Él pide la cuenta.', nl: 'Hij vraagt om de rekening.' },
      { es: 'Dormimos bien.', nl: 'Wij slapen goed.' },
    ],
  },
  {
    id: 'gustar',
    titel: 'De gustar-constructie',
    uitleg: 'Gustar betekent letterlijk \'bevallen\', dus de zin wordt omgekeerd opgebouwd ten opzichte van het Nederlands. Het ding dat bevalt is het onderwerp, en de persoon staat als meewerkend voorwerp ervoor: me, te, le, nos, os, les. Bij een enkelvoudig onderwerp gebruik je gusta, bij meervoud gustan (Me gusta el café / Me gustan los libros). Voor een werkwoord gebruik je altijd gusta (Me gusta bailar). Andere werkwoorden zoals encantar en doler werken net zo.',
    voorbeelden: [
      { es: 'Me gusta el chocolate.', nl: 'Ik houd van chocola.' },
      { es: 'Me gustan las fresas.', nl: 'Ik houd van aardbeien.' },
      { es: '¿Te gusta bailar?', nl: 'Houd jij van dansen?' },
      { es: 'Le duele la cabeza.', nl: 'Hij/zij heeft hoofdpijn.' },
    ],
  },
  {
    id: 'ontkenning',
    titel: 'Ontkenning',
    uitleg: 'Een zin ontken je door no direct vóór het werkwoord te zetten (No hablo francés). Anders dan in het Nederlands is een dubbele ontkenning normaal en correct: als een ontkennend woord als nunca (nooit), nada (niets) of nadie (niemand) ná het werkwoord staat, blijft no ervoor staan (No veo nada). Staat het ontkennende woord vóór het werkwoord, dan vervalt no (Nunca como carne).',
    voorbeelden: [
      { es: 'No tengo dinero.', nl: 'Ik heb geen geld.' },
      { es: 'No hay nada.', nl: 'Er is niets.' },
      { es: 'Nunca fumo.', nl: 'Ik rook nooit.' },
      { es: 'No viene nadie.', nl: 'Er komt niemand.' },
    ],
  },
  {
    id: 'vraagwoorden',
    titel: 'Vraagwoorden',
    uitleg: 'Vraagwoorden dragen altijd een accent: qué (wat), quién (wie), dónde (waar), cuándo (wanneer), cómo (hoe), por qué (waarom) en cuánto (hoeveel). Cuánto en quién passen zich aan in getal en soms geslacht (cuántos, cuántas, quiénes). In het Spaans staat vóór de vraag ook een omgekeerd vraagteken ¿. Let op het verschil tussen por qué (waarom, vraag) en porque (omdat, antwoord).',
    voorbeelden: [
      { es: '¿Qué quieres?', nl: 'Wat wil je?' },
      { es: '¿Dónde vives?', nl: 'Waar woon je?' },
      { es: '¿Cuándo llegas?', nl: 'Wanneer kom je aan?' },
      { es: '¿Por qué no vienes?', nl: 'Waarom kom je niet?' },
      { es: '¿Cuántos años tienes?', nl: 'Hoe oud ben je?' },
    ],
  },
  {
    id: 'bezittelijk',
    titel: 'Bezittelijke voornaamwoorden',
    uitleg: 'De bezittelijke voornaamwoorden vóór het zelfstandig naamwoord zijn mi, tu, su, nuestro, vuestro en su. Ze komen overeen in getal met het bezit, niet met de bezitter (mis libros = mijn boeken). Alleen nuestro en vuestro hebben ook een vrouwelijke vorm (nuestra casa). Su kan \'zijn\', \'haar\', \'uw\' of \'hun\' betekenen; de context maakt duidelijk wat bedoeld wordt.',
    voorbeelden: [
      { es: 'mi casa', nl: 'mijn huis' },
      { es: 'tus amigos', nl: 'jouw vrienden' },
      { es: 'su coche', nl: 'zijn/haar/hun auto' },
      { es: 'nuestra familia', nl: 'onze familie' },
    ],
  },
  {
    id: 'objectpronomina',
    titel: 'Lijdend en meewerkend voorwerp',
    uitleg: 'Het lijdend voorwerp (wat/wie) is me, te, lo/la, nos, os, los/las. Het meewerkend voorwerp (aan wie) is me, te, le, nos, os, les. De pronomina staan vóór het vervoegde werkwoord (Lo veo). Bij een infinitief of gerundium mogen ze eraan vastgeplakt worden (Voy a verlo). Komen beide samen voor, dan gaat het meewerkend voorwerp eerst, en veranderen le/les in se vóór lo/la (Se lo doy).',
    voorbeelden: [
      { es: 'Te veo.', nl: 'Ik zie je.' },
      { es: 'Lo compro.', nl: 'Ik koop het.' },
      { es: 'Le doy el libro.', nl: 'Ik geef hem/haar het boek.' },
      { es: 'Se lo digo.', nl: 'Ik zeg het hem/haar.' },
    ],
  },
  {
    id: 'por-para',
    titel: 'Por vs. para',
    uitleg: 'Beide worden vaak met \'voor\' vertaald, maar hebben een verschillende functie. Para geeft doel, bestemming of ontvanger aan: waar iets heen gaat of waarvoor iets dient (Es para ti, Salgo para Madrid). Por geeft oorzaak, reden, ruil, duur of middel aan: waardoor of waarlangs iets gebeurt (Gracias por todo, Paso por el parque). Vuistregel: para kijkt vooruit naar een doel, por kijkt terug naar een oorzaak.',
    voorbeelden: [
      { es: 'Este regalo es para ti.', nl: 'Dit cadeau is voor jou.' },
      { es: 'Gracias por tu ayuda.', nl: 'Bedankt voor je hulp.' },
      { es: 'Estudio para el examen.', nl: 'Ik studeer voor het examen.' },
      { es: 'Viajo por Europa.', nl: 'Ik reis door Europa.' },
    ],
  },
  {
    id: 'verleden-tijden',
    titel: 'Pretérito vs. imperfecto',
    uitleg: 'Het Spaans heeft twee verleden tijden voor verschillende soorten handelingen. De pretérito (indefinido) gebruik je voor afgeronde, eenmalige gebeurtenissen met een begin en eind (Ayer comí paella). De imperfecto gebruik je voor gewoontes, herhaling, achtergrond en beschrijvingen in het verleden, vaak vertaald met \'placht te\' of de onvoltooid verleden tijd (De niño jugaba mucho). Vaak lopen ze samen: de imperfecto schetst het decor, de pretérito brengt de actie.',
    voorbeelden: [
      { es: 'Ayer fui al cine.', nl: 'Gisteren ging ik naar de bioscoop.' },
      { es: 'Cuando era niño, vivía en Madrid.', nl: 'Toen ik kind was, woonde ik in Madrid.' },
      { es: 'Comía cuando llamaste.', nl: 'Ik was aan het eten toen je belde.' },
      { es: 'El año pasado visité España.', nl: 'Vorig jaar bezocht ik Spanje.' },
    ],
  },
  {
    id: 'voltooid',
    titel: 'Voltooid tegenwoordige tijd',
    uitleg: 'De voltooid tegenwoordige tijd (pretérito perfecto) maak je met het hulpwerkwoord haber in de tegenwoordige tijd plus het voltooid deelwoord: he, has, ha, hemos, habéis, han + deelwoord (he hablado). Het deelwoord eindigt op -ado bij -ar-werkwoorden en op -ido bij -er/-ir-werkwoorden en verandert nooit van vorm. Je gebruikt deze tijd voor recente gebeurtenissen of handelingen binnen een nog lopende periode (hoy, esta semana). Enkele deelwoorden zijn onregelmatig: hecho (hacer), visto (ver), escrito (escribir).',
    voorbeelden: [
      { es: 'He comido ya.', nl: 'Ik heb al gegeten.' },
      { es: '¿Has visto la película?', nl: 'Heb je de film gezien?' },
      { es: 'Hoy hemos trabajado mucho.', nl: 'Vandaag hebben we veel gewerkt.' },
      { es: 'Han escrito una carta.', nl: 'Ze hebben een brief geschreven.' },
    ],
  },
]
