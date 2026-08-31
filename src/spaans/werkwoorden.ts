// Vervoegingen van belangrijke (onregelmatige) Spaanse werkwoorden.

export type Vervoeging = {
  yo: string
  tu: string
  el: string
  nosotros: string
  vosotros: string
  ellos: string
}

export type Werkwoord = {
  infinitief: string
  nl: string
  type: string
  presente: Vervoeging
  preterito?: Vervoeging
  note?: string
}

export const PERSONEN: { sleutel: keyof Vervoeging; label: string }[] = [
  { sleutel: 'yo', label: 'yo' },
  { sleutel: 'tu', label: 'tú' },
  { sleutel: 'el', label: 'él / ella / usted' },
  { sleutel: 'nosotros', label: 'nosotros' },
  { sleutel: 'vosotros', label: 'vosotros' },
  { sleutel: 'ellos', label: 'ellos / ustedes' },
]

export const WERKWOORDEN: Werkwoord[] = [
  {
    infinitief: 'ser',
    nl: 'zijn (eigenschap/identiteit)',
    type: 'onregelmatig',
    presente: { yo: 'soy', tu: 'eres', el: 'es', nosotros: 'somos', vosotros: 'sois', ellos: 'son' },
    preterito: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
    note: 'Onregelmatig; deelt de verleden tijd met \'ir\'.',
  },
  {
    infinitief: 'estar',
    nl: 'zijn (toestand/plaats)',
    type: 'onregelmatig',
    presente: { yo: 'estoy', tu: 'estás', el: 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
    preterito: { yo: 'estuve', tu: 'estuviste', el: 'estuvo', nosotros: 'estuvimos', vosotros: 'estuvisteis', ellos: 'estuvieron' },
    note: 'Onregelmatige stam \'estuv-\' in de verleden tijd; accenten in tegenwoordige tijd.',
  },
  {
    infinitief: 'tener',
    nl: 'hebben',
    type: 'onregelmatig',
    presente: { yo: 'tengo', tu: 'tienes', el: 'tiene', nosotros: 'tenemos', vosotros: 'tenéis', ellos: 'tienen' },
    preterito: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', ellos: 'tuvieron' },
    note: 'Onregelmatige stam \'tuv-\'; e->ie in tegenwoordige tijd.',
  },
  {
    infinitief: 'ir',
    nl: 'gaan',
    type: 'onregelmatig',
    presente: { yo: 'voy', tu: 'vas', el: 'va', nosotros: 'vamos', vosotros: 'vais', ellos: 'van' },
    preterito: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
    note: 'Deelt de verleden tijd met \'ser\'.',
  },
  {
    infinitief: 'hacer',
    nl: 'doen/maken',
    type: 'onregelmatig',
    presente: { yo: 'hago', tu: 'haces', el: 'hace', nosotros: 'hacemos', vosotros: 'hacéis', ellos: 'hacen' },
    preterito: { yo: 'hice', tu: 'hiciste', el: 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', ellos: 'hicieron' },
    note: 'Let op \'hizo\' met z in de derde persoon enkelvoud.',
  },
  {
    infinitief: 'poder',
    nl: 'kunnen',
    type: 'stamverandering (o->ue)',
    presente: { yo: 'puedo', tu: 'puedes', el: 'puede', nosotros: 'podemos', vosotros: 'podéis', ellos: 'pueden' },
    preterito: { yo: 'pude', tu: 'pudiste', el: 'pudo', nosotros: 'pudimos', vosotros: 'pudisteis', ellos: 'pudieron' },
    note: 'Onregelmatige stam \'pud-\' in de verleden tijd.',
  },
  {
    infinitief: 'querer',
    nl: 'willen/houden van',
    type: 'stamverandering (e->ie)',
    presente: { yo: 'quiero', tu: 'quieres', el: 'quiere', nosotros: 'queremos', vosotros: 'queréis', ellos: 'quieren' },
    preterito: { yo: 'quise', tu: 'quisiste', el: 'quiso', nosotros: 'quisimos', vosotros: 'quisisteis', ellos: 'quisieron' },
    note: 'Onregelmatige stam \'quis-\' in de verleden tijd.',
  },
  {
    infinitief: 'decir',
    nl: 'zeggen',
    type: 'onregelmatig',
    presente: { yo: 'digo', tu: 'dices', el: 'dice', nosotros: 'decimos', vosotros: 'decís', ellos: 'dicen' },
    preterito: { yo: 'dije', tu: 'dijiste', el: 'dijo', nosotros: 'dijimos', vosotros: 'dijisteis', ellos: 'dijeron' },
    note: 'Stam \'dij-\'; ellos-vorm is \'dijeron\' (geen i).',
  },
  {
    infinitief: 'ver',
    nl: 'zien',
    type: 'onregelmatig',
    presente: { yo: 'veo', tu: 'ves', el: 've', nosotros: 'vemos', vosotros: 'veis', ellos: 'ven' },
    preterito: { yo: 'vi', tu: 'viste', el: 'vio', nosotros: 'vimos', vosotros: 'visteis', ellos: 'vieron' },
    note: 'Verleden tijd zonder accenten op \'vi\' en \'vio\'.',
  },
  {
    infinitief: 'dar',
    nl: 'geven',
    type: 'onregelmatig',
    presente: { yo: 'doy', tu: 'das', el: 'da', nosotros: 'damos', vosotros: 'dais', ellos: 'dan' },
    preterito: { yo: 'di', tu: 'diste', el: 'dio', nosotros: 'dimos', vosotros: 'disteis', ellos: 'dieron' },
    note: 'Krijgt in de verleden tijd de uitgangen van -er/-ir werkwoorden.',
  },
  {
    infinitief: 'saber',
    nl: 'weten/kunnen (vaardigheid)',
    type: 'onregelmatig',
    presente: { yo: 'sé', tu: 'sabes', el: 'sabe', nosotros: 'sabemos', vosotros: 'sabéis', ellos: 'saben' },
    preterito: { yo: 'supe', tu: 'supiste', el: 'supo', nosotros: 'supimos', vosotros: 'supisteis', ellos: 'supieron' },
    note: 'Onregelmatige stam \'sup-\'; yo-vorm \'sé\' met accent.',
  },
  {
    infinitief: 'poner',
    nl: 'zetten/leggen',
    type: 'onregelmatig',
    presente: { yo: 'pongo', tu: 'pones', el: 'pone', nosotros: 'ponemos', vosotros: 'ponéis', ellos: 'ponen' },
    preterito: { yo: 'puse', tu: 'pusiste', el: 'puso', nosotros: 'pusimos', vosotros: 'pusisteis', ellos: 'pusieron' },
    note: 'Onregelmatige stam \'pus-\' in de verleden tijd.',
  },
  {
    infinitief: 'salir',
    nl: 'weggaan/uitgaan',
    type: 'onregelmatig',
    presente: { yo: 'salgo', tu: 'sales', el: 'sale', nosotros: 'salimos', vosotros: 'salís', ellos: 'salen' },
    preterito: { yo: 'salí', tu: 'saliste', el: 'salió', nosotros: 'salimos', vosotros: 'salisteis', ellos: 'salieron' },
    note: 'Onregelmatig in tegenwoordige tijd (salgo), regelmatig in de verleden tijd.',
  },
  {
    infinitief: 'venir',
    nl: 'komen',
    type: 'onregelmatig',
    presente: { yo: 'vengo', tu: 'vienes', el: 'viene', nosotros: 'venimos', vosotros: 'venís', ellos: 'vienen' },
    preterito: { yo: 'vine', tu: 'viniste', el: 'vino', nosotros: 'vinimos', vosotros: 'vinisteis', ellos: 'vinieron' },
    note: 'Onregelmatige stam \'vin-\'; e->ie in tegenwoordige tijd.',
  },
  {
    infinitief: 'volver',
    nl: 'terugkeren',
    type: 'stamverandering (o->ue)',
    presente: { yo: 'vuelvo', tu: 'vuelves', el: 'vuelve', nosotros: 'volvemos', vosotros: 'volvéis', ellos: 'vuelven' },
    preterito: { yo: 'volví', tu: 'volviste', el: 'volvió', nosotros: 'volvimos', vosotros: 'volvisteis', ellos: 'volvieron' },
    note: 'Regelmatig in de verleden tijd; o->ue alleen in tegenwoordige tijd.',
  },
  {
    infinitief: 'pensar',
    nl: 'denken',
    type: 'stamverandering (e->ie)',
    presente: { yo: 'pienso', tu: 'piensas', el: 'piensa', nosotros: 'pensamos', vosotros: 'pensáis', ellos: 'piensan' },
    preterito: { yo: 'pensé', tu: 'pensaste', el: 'pensó', nosotros: 'pensamos', vosotros: 'pensasteis', ellos: 'pensaron' },
    note: 'Regelmatig in de verleden tijd; e->ie alleen in tegenwoordige tijd.',
  },
  {
    infinitief: 'empezar',
    nl: 'beginnen',
    type: 'stamverandering (e->ie)',
    presente: { yo: 'empiezo', tu: 'empiezas', el: 'empieza', nosotros: 'empezamos', vosotros: 'empezáis', ellos: 'empiezan' },
    preterito: { yo: 'empecé', tu: 'empezaste', el: 'empezó', nosotros: 'empezamos', vosotros: 'empezasteis', ellos: 'empezaron' },
    note: 'Spellingwijziging z->c voor e: \'empecé\'.',
  },
  {
    infinitief: 'dormir',
    nl: 'slapen',
    type: 'stamverandering (o->ue)',
    presente: { yo: 'duermo', tu: 'duermes', el: 'duerme', nosotros: 'dormimos', vosotros: 'dormís', ellos: 'duermen' },
    preterito: { yo: 'dormí', tu: 'dormiste', el: 'durmió', nosotros: 'dormimos', vosotros: 'dormisteis', ellos: 'durmieron' },
    note: 'o->u in derde persoon van de verleden tijd (durmió, durmieron).',
  },
  {
    infinitief: 'jugar',
    nl: 'spelen',
    type: 'stamverandering (u->ue)',
    presente: { yo: 'juego', tu: 'juegas', el: 'juega', nosotros: 'jugamos', vosotros: 'jugáis', ellos: 'juegan' },
    preterito: { yo: 'jugué', tu: 'jugaste', el: 'jugó', nosotros: 'jugamos', vosotros: 'jugasteis', ellos: 'jugaron' },
    note: 'Enige werkwoord met u->ue; spelling g->gu: \'jugué\'.',
  },
  {
    infinitief: 'conocer',
    nl: 'kennen (leren kennen)',
    type: 'onregelmatig',
    presente: { yo: 'conozco', tu: 'conoces', el: 'conoce', nosotros: 'conocemos', vosotros: 'conocéis', ellos: 'conocen' },
    preterito: { yo: 'conocí', tu: 'conociste', el: 'conoció', nosotros: 'conocimos', vosotros: 'conocisteis', ellos: 'conocieron' },
    note: 'yo-vorm met -zco (conozco); regelmatig in de verleden tijd.',
  },
  {
    infinitief: 'pedir',
    nl: 'vragen (om iets)/bestellen',
    type: 'stamverandering (e->i)',
    presente: { yo: 'pido', tu: 'pides', el: 'pide', nosotros: 'pedimos', vosotros: 'pedís', ellos: 'piden' },
    preterito: { yo: 'pedí', tu: 'pediste', el: 'pidió', nosotros: 'pedimos', vosotros: 'pedisteis', ellos: 'pidieron' },
    note: 'e->i in derde persoon van de verleden tijd (pidió, pidieron).',
  },
  {
    infinitief: 'seguir',
    nl: 'volgen/doorgaan',
    type: 'stamverandering (e->i)',
    presente: { yo: 'sigo', tu: 'sigues', el: 'sigue', nosotros: 'seguimos', vosotros: 'seguís', ellos: 'siguen' },
    preterito: { yo: 'seguí', tu: 'seguiste', el: 'siguió', nosotros: 'seguimos', vosotros: 'seguisteis', ellos: 'siguieron' },
    note: 'yo-vorm \'sigo\' (gu->g); e->i in derde persoon verleden tijd.',
  },
  {
    infinitief: 'traer',
    nl: 'brengen/meebrengen',
    type: 'onregelmatig',
    presente: { yo: 'traigo', tu: 'traes', el: 'trae', nosotros: 'traemos', vosotros: 'traéis', ellos: 'traen' },
    preterito: { yo: 'traje', tu: 'trajiste', el: 'trajo', nosotros: 'trajimos', vosotros: 'trajisteis', ellos: 'trajeron' },
    note: 'Stam \'traj-\'; ellos-vorm \'trajeron\' (geen i).',
  },
  {
    infinitief: 'oír',
    nl: 'horen',
    type: 'onregelmatig',
    presente: { yo: 'oigo', tu: 'oyes', el: 'oye', nosotros: 'oímos', vosotros: 'oís', ellos: 'oyen' },
    preterito: { yo: 'oí', tu: 'oíste', el: 'oyó', nosotros: 'oímos', vosotros: 'oísteis', ellos: 'oyeron' },
    note: 'i->y tussen klinkers (oyó, oyeron).',
  },
]
