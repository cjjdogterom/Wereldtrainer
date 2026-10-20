"""Bridge biedkaart 5-kaart hoog — draagbare naslag-PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether,
)
from reportlab.lib.enums import TA_LEFT

INK = colors.HexColor("#20291f")
INK_SOFT = colors.HexColor("#5c6457")
ACCENT = colors.HexColor("#1e5c3a")
ACCENT_BG = colors.HexColor("#e4efe6")
RED = colors.HexColor("#b23a2c")
LINE = colors.HexColor("#c9c2ad")
CREAM = colors.HexColor("#faf6ea")
BAND = colors.HexColor("#f0eadb")

def R(sym): return f'<font color="#b23a2c">{sym}</font>'
S_S, S_H, S_D, S_C = "♠", R("♥"), R("♦"), "♣"

styles = {
    "titel": ParagraphStyle("titel", fontName="Times-Bold", fontSize=22,
                             textColor=ACCENT, alignment=TA_LEFT, leading=26,
                             spaceAfter=2),
    "onder": ParagraphStyle("onder", fontName="Times-Italic", fontSize=11.5,
                             textColor=INK_SOFT, alignment=TA_LEFT, leading=14,
                             spaceAfter=10),
    "h2": ParagraphStyle("h2", fontName="Times-Bold", fontSize=13.5,
                          textColor=ACCENT, alignment=TA_LEFT, leading=17,
                          spaceBefore=10, spaceAfter=4),
    "toel": ParagraphStyle("toel", fontName="Times-Italic", fontSize=9.2,
                            textColor=INK_SOFT, leading=11.5, spaceAfter=4),
    "cel": ParagraphStyle("cel", fontName="Times-Roman", fontSize=8.8,
                           textColor=INK, leading=11),
    "celFet": ParagraphStyle("celFet", fontName="Times-Bold", fontSize=8.8,
                              textColor=INK, leading=11),
    "vb": ParagraphStyle("vb", fontName="Times-Italic", fontSize=8,
                          textColor=INK_SOFT, leading=10, leftIndent=0, spaceBefore=2),
    "voet": ParagraphStyle("voet", fontName="Times-Italic", fontSize=8,
                            textColor=INK_SOFT, leading=10),
}

def P(txt, stijl="cel"):
    return Paragraph(txt, styles[stijl])

def maak_tabel(rijen, breedtes):
    data = []
    for kop, tekst in rijen:
        kop_p = P(kop, "celFet")
        if isinstance(tekst, list):
            inhoud = []
            inhoud.append(P(tekst[0], "cel"))
            for extra in tekst[1:]:
                inhoud.append(P(extra, "vb"))
            data.append([kop_p, inhoud])
        else:
            data.append([kop_p, P(tekst, "cel")])
    t = Table(data, colWidths=breedtes, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("BACKGROUND", (0,0), (0,-1), BAND),
        ("BACKGROUND", (1,0), (1,-1), CREAM),
        ("LINEBELOW", (0,0), (-1,-2), 0.4, LINE),
        ("BOX", (0,0), (-1,-1), 0.6, LINE),
    ]))
    return t

def hand(s="", h="", d="", c=""):
    """Formatteer een hand als tekst met kleursymbolen."""
    delen = []
    if s: delen.append(f"♠{s}")
    if h: delen.append(f'<font color="#b23a2c">♥{h}</font>')
    if d: delen.append(f'<font color="#b23a2c">♦{d}</font>')
    if c: delen.append(f"♣{c}")
    return " &nbsp;".join(delen)

def vb(txt):
    return f'<b>Voorbeeld:</b> {txt}'

# --- inhoud ---
verhaal = []

verhaal.append(P("Biedkaart 5-kaart hoog", "titel"))
verhaal.append(P("Draagbare naslag — openingen, antwoorden en herbiedingen op één plek", "onder"))

# ============ PUNTEN ============
verhaal.append(P("1. Puntentelling", "h2"))
verhaal.append(maak_tabel([
    ("Honneurpunten",
     "Aas 4 · Heer 3 · Vrouw 2 · Boer 1. Totaal in het spel: 40."),
    ("Lengtepunten",
     ["1 punt per kaart <b>ná de vierde</b> in een kleur. Een 5-kaart is +1, "
      "een 6-kaart +2, een 7-kaart +3. Je totale kracht = honneur + lengte.",
      vb(f"{hand('AH8632','A54','H2','97')} — 14 honneur + 2 lengte (6-kaart schoppen) = 16 punten.")]),
    ("Vuistregels manche",
     "Samen 25 punten → 3SA of 4 in een 8-kaart fit. Samen 33 → klein slem. Samen 37 → groot slem."),
    ("Fit",
     "Samen 8+ kaarten in één kleur. De openaar van 1" + S_H + " / 1♠ belooft 5, dus 3 mee is al een fit."),
    ("Forcing / Mancheforcing",
     "Forcing = partner mag niet passen. Mancheforcing = er wordt doorgeboden tot minstens de manche is bereikt."),
    ("Inviterend",
     "Uitnodiging tot de manche. Partner past met minimum, biedt door met maximum."),
], [40*mm, 130*mm]))

# ============ OPENINGEN ============
verhaal.append(P("2. Openingsbiedingen", "h2"))
verhaal.append(P("Kijkvolgorde: is de hand extreem sterk (2♣ of 2SA)? Sans met 15–17 → 1SA. "
                 "Anders 12+ → open een kleur; een 5-kaart hoog gaat altijd vóór. "
                 "Minder dan 12 → pas, tenzij preëmptief mogelijk.", "toel"))
verhaal.append(maak_tabel([
    (f"1{S_H} / 1♠",
     ["<b>12–19 punten</b>, 5-kaart of langer in die kleur. Twee vijfkaarten: open de hoogste.",
      vb(f"{hand('AHV62','H83','95','762')} — 13 punten → 1♠."),
      vb(f"{hand('AH862','AV953','4','82')} — twee 5-kaarten → 1♠ (de hoogste).")]),
    (f"1♣ / 1{S_D}",
     ["<b>12–19 punten</b>, géén 5-kaart hoog: langste lage kleur. "
      "Met 3-3 → 1♣, met 4-4 → 1" + S_D + ".",
      vb(f"{hand('A962','H74','V6','HB53')} — 13 punten → 1♣."),
      vb(f"{hand('AH5','97','HV82','B632')} — 4-4 laag → 1{S_D}.")]),
    ("1SA",
     ["<b>15–17 punten</b>, sans-verdeling (4-3-3-3, 4-4-3-2 of 5-3-3-2).",
      vb(f"{hand('HB4','AV6','H852','V93')} — 15 punten, 4-3-3-3 → 1SA.")]),
    ("2♣",
     ["<b>22+ punten</b>, mancheforcing. Partner moet bieden (2" + S_D + " = wachtbieding).",
      vb(f"{hand('AHV4','AV2','AH3','872')} — 22 punten → 2♣.")]),
    ("2SA",
     ["<b>20–21 punten</b>, sans-verdeling.",
      vb(f"{hand('AH3','HV62','AH4','B53')} — 20 punten → 2SA.")]),
    (f"2{S_D} / 2{S_H} / 2♠",
     ["<b>Zwakke twee</b>: 6–10 punten met een mooie 6-kaart. "
      "Beschrijvend voor partner, storend voor de tegenpartij. "
      "In klaveren kan het niet (2♣ is sterk).",
      vb(f"{hand('HVB963','84','752','96')} — 8 punten → 2♠.")]),
    ("3 in kleur",
     ["<b>Preëmptief</b>: 5–9 punten met een 7-kaart. Reken in slagen, "
      "want buiten de eigen kleur is de hand vrijwel waardeloos.",
      vb(f"{hand('8','6','HVB8642','9753')} — 9 punten → 3{S_D}.")]),
    ("Pas",
     ["Minder dan 12 punten en geen preëmptieve hand.",
      vb(f"{hand('B853','V4','H962','853')} — 6 punten → pas.")]),
], [30*mm, 140*mm]))

verhaal.append(PageBreak())

# ============ ANTWOORDEN 1H/1S ============
verhaal.append(P(f"3. Antwoorden na 1{S_H} / 1♠", "h2"))
verhaal.append(P("0–5 → altijd pas. Vanaf 6: kijk eerst naar steun (3+ mee, partner heeft er 5). "
                 "Met steun vertel je meteen je sterkte; zonder steun zoek je een ander bod. "
                 "Voorbeelden na 1" + S_H + ".", "toel"))
verhaal.append(maak_tabel([
    ("Steun, 6–9",
     [f"Verhoog één keer naar 2{S_H} / 2♠. Zwak, maar de fit is meteen bekend.",
      vb(f"{hand('84','V96','A853','B762')} — 7 punten, 3 harten → 2{S_H}.")]),
    ("Steun, 10–11",
     [f"Verhoog twee keer naar 3{S_H} / 3♠. Inviterend — partner biedt manche met extra's.",
      vb(f"{hand('H4','V965','A853','B76')} — 10 punten, 4 harten → 3{S_H}.")]),
    ("Steun, 12+",
     ["Samen is er manche. Bied éérst een nieuwe kleur (forcing), daarna minstens de manche in partners kleur. Direct verhogen zou te zwak klinken.",
      vb(f"{hand('AV53','H86','A952','84')} — 13 punten, 3 harten mee → eerst 1♠, dan 4{S_H}.")]),
    ("Nieuwe kleur, 1-niveau",
     [f"1♠ na 1{S_H}: <b>6+ punten</b>, 4-kaart schoppen. Forcing.",
      vb(f"{hand('AV53','86','V952','842')} — 8 punten → 1♠.")]),
    ("Nieuwe kleur, 2-niveau",
     [f"<b>10+ punten</b>. 2{S_H} na 1♠ belooft bovendien een 5-kaart harten.",
      vb(f"{hand('H53','86','AV952','H42')} — 13 punten → 2{S_D}.")]),
    ("1SA",
     ["Restcategorie: 6–9 punten, geen steun, geen biedbare hoge kleur. Zegt niets over verdeling.",
      vb(f"{hand('H53','86','V952','HB42')} — 9 punten → 1SA.")]),
    ("Pas", "Minder dan 6 punten."),
], [35*mm, 135*mm]))

# ============ ANTWOORDEN 1C/1D ============
verhaal.append(P(f"4. Antwoorden na 1♣ / 1{S_D}", "h2"))
verhaal.append(P("Doel: een fit in een hoge kleur vinden. Een 4-kaart harten of schoppen bieden "
                 "gaat vóór alles. Pas daarna: steun in partners lage kleur, of sans.", "toel"))
verhaal.append(maak_tabel([
    (f"1{S_H} / 1♠",
     ["<b>6+ punten</b> en een 4-kaart hoog. Met 4-4 hoog bied je de laagste (1"+S_H+") — zo blijft 1♠ vindbaar.",
      vb(f"Na 1♣: {hand('V874','AB62','H93','54')} — 10 punten, 4-4 hoog → 1{S_H}.")]),
    ("Steun laag, 6–9",
     [f"Geen 4-kaart hoog, wel 5-kaart steun: één verhogen (2♣ / 2{S_D}).",
      vb(f"Na 1♣: {hand('96','H84','972','V9853')} — 6 punten → 2♣.")]),
    ("Steun laag, 10–11",
     "Twee verhogen (3♣ / 3" + S_D + ") — inviterend."),
    ("1SA / 2SA / 3SA",
     [f"Geen 4-kaart hoog, geen steun: <b>6–9 → 1SA</b> · <b>10–11 → 2SA</b> (invite) · <b>12–15 → 3SA</b>.",
      vb(f"Na 1♣: {hand('B74','V83','H95','V632')} — 8 punten → 1SA.")]),
    (f"1{S_D} na 1♣",
     [f"Geen 4-kaart hoog: 4-kaart ruiten laten zien (6+ punten).",
      vb(f"Na 1♣: {hand('432','432','AV32','H832')} — 7 punten → 1{S_D}.")]),
], [35*mm, 135*mm]))

# ============ ANTWOORDEN 1SA ============
verhaal.append(P("5. Antwoorden na 1SA (15–17)", "h2"))
verhaal.append(P("Partner is nauw begrensd, dus jij kunt rekenen. Samen 25 → manche. "
                 "Met een lange hoge kleur gebruik je een conventie: de sterke hand speelt "
                 "het contract en blijft gedekt bij het uitkomen.", "toel"))
verhaal.append(maak_tabel([
    ("Pas",
     "0–7 punten zonder 5-kaart hoog. Samen zelfs met 17 geen 25."),
    ("2♣ Stayman",
     ["<b>8+ punten</b> en een 4-kaart hoog. Partner antwoordt: "
      f"2{S_D} = geen 4-kaart hoog · 2{S_H} / 2♠ = die 4-kaart.",
      vb(f"{hand('HV52','B83','A962','74')} — 10 punten, 4♠ → 2♣.")]),
    (f"2{S_D} / 2{S_H} Jacoby",
     [f"Transfer met een 5-kaart of langer, <b>elke sterkte</b>: 2{S_D} = 'bied 2{S_H}', "
      f"2{S_H} = 'bied 2♠'. Daarna: pas met zwak, doorbieden met manche-interesse.",
      vb(f"{hand('4','VB8632','H72','962')} — 8 punten → 2{S_D}; na 2{S_H} passen.")]),
    ("2SA",
     ["<b>8–9 punten</b>, geen 4/5-kaart hoog: inviterend. Partner past met 15, biedt 3SA met 16–17.",
      vb(f"{hand('H92','V54','B873','V64')} — 8 punten → 2SA.")]),
    ("3SA",
     ["<b>10–15 punten</b>, geen 4/5-kaart hoog: bied de manche.",
      vb(f"{hand('H92','V54','AB73','V64')} — 12 punten → 3SA.")]),
    (f"4{S_H} / 4♠",
     "Met een 6-kaart hoog en 10+ punten direct manche in je kleur."),
], [35*mm, 135*mm]))

verhaal.append(PageBreak())

# ============ 2C mancheforcing ============
verhaal.append(P("6. Antwoorden na 2♣ (22+, mancheforcing)", "h2"))
verhaal.append(P("Passen mag niet: er wordt hoe dan ook doorgeboden tot minstens de manche. "
                 "Je eerste antwoord hoeft niets te beloven — het zegt alleen of je iets meebrengt.", "toel"))
verhaal.append(maak_tabel([
    (f"2{S_D} wachtbieding",
     [f"Verreweg het gewoonste antwoord: 'vertel maar verder, partner'. Zegt niets over ruiten en kan met 0 punten.",
      vb(f"{hand('975','B863','V42','853')} — 3 punten → 2{S_D}.")]),
    (f"2{S_H} / 2♠ / 3♣ / 3{S_D}",
     ["<b>Positief</b>: 8+ punten én een goede 5-kaart. Wek slem-interesse.",
      vb(f"{hand('AV953','842','H72','96')} — 10 punten → 2♠.")]),
    ("2SA",
     ["<b>Positief zonder 5-kaart</b>: 8+ punten, sans-achtige hand.",
      vb(f"{hand('H92','V85','B743','A64')} — 10 punten → 2SA.")]),
    ("Vervolg openaar",
     f"Na 2♣ – 2{S_D}: 2SA = 22–24 sans (dan Stayman en Jacoby als na 1SA, één niveau hoger); "
     "een kleurbod = natuurlijke kleur. Doorbieden tot de manche."),
    ("Vervolg antwoorder",
     "Steun met 3+ mee, bied een nieuwe 5-kaart, of ga naar sans. "
     "Nieuwe kleuren blijven forcing tot de manche."),
], [35*mm, 135*mm]))

# ============ 2SA ============
verhaal.append(P("7. Antwoorden na 2SA (20–21)", "h2"))
verhaal.append(P("Zelfde gedachte als na 1SA, één niveau hoger. Met 5 punten zit je al aan 25: "
                 "bijna elke hand biedt door naar de manche.", "toel"))
verhaal.append(maak_tabel([
    ("Pas", "0–4 punten. Zelfs samen geen 25."),
    ("3♣ Stayman",
     ["5+ punten en een 4-kaart hoog. 3" + S_D + " = geen 4-kaart hoog.",
      vb(f"{hand('HB62','975','V843','52')} — 6 punten → 3♣.")]),
    (f"3{S_D} / 3{S_H} Jacoby",
     [f"Transfer naar {S_H} / ♠ met een 5-kaart of langer, elke sterkte.",
      vb(f"{hand('5','B87632','954','862')} — 3 punten → 3{S_D}; na 3{S_H} passen.")]),
    ("3SA",
     ["5–11 punten zonder hoge 4/5-kaart: bied de manche direct.",
      vb(f"{hand('V92','H54','B873','V64')} — 8 punten → 3SA.")]),
], [35*mm, 135*mm]))

# ============ zwakke 2 ============
verhaal.append(P("8. Antwoorden na een zwakke twee (2" + S_D + " / 2" + S_H + " / 2♠)", "h2"))
verhaal.append(P("Partner heeft precies 6–10 met een 6-kaart. Meestal is passen het beste. "
                 "Let op: verhogen is <b>geen invite</b> maar verder storen.", "toel"))
verhaal.append(maak_tabel([
    ("Pas", "Het vaakst juist, ook met een redelijke hand — zonder fit valt er niets te halen."),
    ("Verhogen",
     ["Met 3+ mee: stoor de tegenpartij verder. Partner moet passen.",
      vb(f"Na 2♠: {hand('H853','7','A9642','853')} — 4 schoppen → 3♠ (storend).")]),
    ("Manche bieden",
     [f"<b>16+ punten</b> en een fit: bied zelf 4{S_H} / 4♠.",
      vb(f"Na 2♠: {hand('AV5','A864','AH72','53')} — 17 punten, 3 schoppen → 4♠.")]),
    ("Nieuwe kleur / 2SA",
     "Forcing: sterke eigen hand (15+) zonder directe fit. Partner beschrijft verder."),
], [35*mm, 135*mm]))

# ============ preempts ============
verhaal.append(P("9. Antwoorden na een preëmpt (3-niveau)", "h2"))
verhaal.append(P("Partner heeft 5–9 met een 7-kaart: reken in slagen, niet in punten.", "toel"))
verhaal.append(maak_tabel([
    ("Pas", "Normaal, ook met een behoorlijke hand."),
    ("Manche bieden",
     f"Met 16+: 3SA met dekking in de andere kleuren, of 4{S_H} / 4♠ met fit in partners hoge kleur."),
    ("Verhogen", "Met een fit: verder storen — partner past."),
], [35*mm, 135*mm]))

verhaal.append(PageBreak())

# ============ herbiedingen openaar ============
verhaal.append(P("10. Tweede beurt van de openaar (herbieding)", "h2"))
verhaal.append(P("Je opende met 12–19: een grote spanwijdte. Nu vertel je aan welke kant je zit. "
                 "Deel je hand in <b>minimum 12–14</b>, <b>matig 15–17</b>, <b>maximum 18–19</b>. "
                 "Vervolgens: steun geven, kleur herhalen (6-kaart), nieuwe kleur, of naar sans.", "toel"))
verhaal.append(maak_tabel([
    ("Steun partners kleur",
     ["4-kaart steun (soms 3-kaart). Één verhogen = 12–14 · twee verhogen = 15–17 · manche = 18–19.",
      vb(f"Na 1♣ – 1{S_H}: {hand('5','HB93','V72','AHV84')} — 15 + 1 lengte = 16 punten → 3{S_H}.")]),
    ("Eigen kleur herhalen",
     ["Belooft <b>6-kaart of langer</b>. Zelfde niveau = 12–14 · sprong = 15–17 (invite) · manche = 18–19.",
      vb(f"Na 1♠ – 1SA: {hand('AHV964','B4','H82','53')} — 15 punten, 6-kaart → 3♠ (sprong).")]),
    ("Nieuwe kleur, lager",
     [f"12–17 punten, natuurlijke 4-kaart. Niet forcing. Zoek de fit die er nog kan zijn.",
      vb(f"Na 1{S_D} – 1{S_H}: {hand('HB84','7','AHV62','A93')} — 16 punten → 1♠.")]),
    ("Reverse (nieuwe kleur, hóger)",
     [f"Nieuwe kleur die hóger is dan je eerste én die het niveau verhoogt: <b>16+ punten</b>, forcing één ronde.",
      vb(f"Na 1{S_D} – 1SA: {hand('4','AHV6','AHV84','B73')} — 19 + 1 lengte = 20 punten → 2{S_H} (reverse).")]),
    ("Sans",
     ["Vlakke hand zonder fit. <b>1SA = 12–14</b> · <b>2SA (sprong) = 18–19</b>. "
      "15–17 sans had je 1SA moeten openen.",
      vb(f"Na 1♣ – 1{S_H}: {hand('H84','75','HB4','AV932')} — 13 punten, vlak → 1SA.")]),
    ("Manche bieden",
     f"Met 18–19 en fit: direct 4{S_H} / 4♠ of 3SA."),
], [45*mm, 125*mm]))

# ============ herbiedingen antwoorder ============
verhaal.append(P("11. Tweede beurt van de antwoorder", "h2"))
verhaal.append(P("Nu ken je partners kracht op 3 punten nauwkeurig. Reken: <b>samen &lt;25</b> → deelscore · "
                 "<b>25–26</b> → invite · <b>26+</b> → manche. Onthoud wat jij zelf al beloofde: "
                 "<b>zwak 6–9</b>, <b>invite 10–11</b>, <b>manche 12+</b>.", "toel"))
verhaal.append(maak_tabel([
    ("Zwak (6–9) na minimum",
     [f"Pas, tenzij partner zelf uitnodigt (sprong of reverse). Bij een invite: door met 9, pas met 6–7.",
      vb(f"Jij 1{S_H}, partner 2{S_H}: 8 punten, geen extra's → pas.")]),
    ("Invite (10–11)",
     ["Nodig zelf uit: kleur op 3-niveau herhalen, partners kleur naar 3, of 2SA bieden.",
      vb(f"Na 1♣ – 1{S_H} – 1♠: {hand('95','AV863','H74','V82')} — 11 punten, 5-kaart → 3{S_H}.")]),
    ("Manche (12–15)",
     ["Bied de manche direct (3SA of 4 in de fit), of eerst een nieuwe kleur (nog steeds forcing).",
      vb(f"Na 1{S_D} – 1♠ – 2♠: {hand('HV84','A75','V93','B62')} — 12 punten, fit → 4♠.")]),
    ("Voorkeur teruggeven",
     ["Partner bood twee kleuren: kies er één. Zijn eerste kleur op laagste niveau = 'valse preferentie' "
      "(kan met dubbelton); zijn tweede kleur = echte fit.",
      vb(f"Na 1♣ – 1{S_H} – 1♠: {hand('84','V976','V953','H82')} — 7 punten → 2♣ (valse preferentie).")]),
    ("Slem-interesse (16+)",
     "Nieuwe kleuren, of 4SA Blackwood (vraagt naar azen). Slem valt buiten deze basiskaart."),
], [45*mm, 125*mm]))

# ============ stappenplan ============
verhaal.append(P("12. Denkstappen bij elke nieuwe beurt", "h2"))
verhaal.append(maak_tabel([
    ("1. Bereken samen",
     "Neem het midden van partners range en tel je eigen punten erbij. <b>&lt;20</b> → stop laag · "
     "<b>20–24</b> → deelscore · <b>25+</b> → manche · <b>33+</b> → klein slem."),
    ("2. Is er een fit?",
     "Steun gaat vóór sans. 8+ kaarten samen in één kleur → speel daarin. "
     "Een 8-kaart hoog wint bijna altijd van 3SA."),
    ("3. Wie beslist?",
     "Een invite (sprong, 2SA na 1SA, enz.) geeft de keus aan de ander. "
     "Op een <b>forcing</b> bod mag níemand passen — dat is de duurste fout."),
    ("4. Twijfel?",
     "Kies het veiligste bod dat partner nog kan corrigeren. Beter een bod op laag niveau in de verkeerde "
     "kleur dan een pas op iets forcing."),
], [30*mm, 140*mm]))

verhaal.append(Spacer(1, 8))
verhaal.append(P(f"Bridge biedkaart 5-kaart hoog · {' · '.join(['Openingen','Antwoorden','Herbiedingen'])} · Print op A4 en houd bij de hand.", "voet"))

# --- bouw pdf ---
doc = SimpleDocTemplate(
    str(__import__("pathlib").Path(__file__).resolve().parent.parent / "public/bridge/biedkaart-5-kaart-hoog.pdf"),
    pagesize=A4,
    leftMargin=16*mm, rightMargin=16*mm,
    topMargin=14*mm, bottomMargin=14*mm,
    title="Biedkaart 5-kaart hoog",
    author="Biedtrainer",
)
doc.build(verhaal)
print("PDF gemaakt")
