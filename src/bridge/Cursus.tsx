// De volledige bridgecursus (vijfkaart hoog), met visuele voorbeeldhanden.
import type { ReactNode } from 'react'

// ── Visuele bouwstenen ──────────────────────────────────────────────

const SYMBOLEN = ['♠', '♥', '♦', '♣'] as const

// Eén hand als "echte" speelkaartjes, gegroepeerd per kleur.
// s/h/d/c: kaarten als string, bijv. "A V 8 4".
export function Kaarten({ s, h, d, c, label }: { s: string; h: string; d: string; c: string; label?: string }) {
  const kleuren = [s, h, d, c]
  return (
    <div className="spk-hand">
      {label && <span className="spk-label">{label}</span>}
      <div className="spk-rij">
        {kleuren.map((kleur, i) => (
          <span className="spk-groep" key={i}>
            {(kleur.trim() ? kleur.trim().split(/\s+/) : []).map((rang, j) => (
              <span className={`spk${i === 1 || i === 2 ? ' spk-rood' : ''}`} key={j}>
                <span className="spk-rang">{rang}</span>
                <span className="spk-sym">{SYMBOLEN[i]}</span>
              </span>
            ))}
            {!kleur.trim() && <span className="spk spk-leeg"><span className="spk-rang">—</span><span className="spk-sym">{SYMBOLEN[i]}</span></span>}
          </span>
        ))}
      </div>
    </div>
  )
}

// Een voorbeeldblok: hand + (punten)conclusie.
function Voorbeeld({ titel, children, s, h, d, c }: { titel: ReactNode; children: ReactNode; s: string; h: string; d: string; c: string }) {
  return (
    <div className="br-voorbeeld">
      <Kaarten s={s} h={h} d={d} c={c} />
      <div className="br-voorbeeld-tekst">
        <strong>{titel}</strong>
        <p>{children}</p>
      </div>
    </div>
  )
}

// Een biedserie als rij chips met speler-labels.
function Serie({ stappen }: { stappen: { wie: string; bod: string }[] }) {
  return (
    <div className="br-serie">
      {stappen.map((stap, i) => (
        <span className="br-stap" key={i}>
          <span className="br-stap-wie">{stap.wie}</span>
          <span className="br-stap-bod">{stap.bod}</span>
          {i < stappen.length - 1 && <span className="br-stap-pijl" aria-hidden="true">→</span>}
        </span>
      ))}
    </div>
  )
}

// De biedtrap: alle mogelijke biedingen van laag naar hoog.
function BiedLadder() {
  const strains = ['♣', '♦', '♥', '♠', 'SA']
  const manche = new Set(['3SA', '4♥', '4♠', '5♣', '5♦'])
  return (
    <div className="br-ladder-wrap">
      <table className="br-ladder">
        <tbody>
          {[7, 6, 5, 4, 3, 2, 1].map((niveau) => (
            <tr key={niveau}>
              {strains.map((strain) => {
                const bod = `${niveau}${strain}`
                const rood = strain === '♥' || strain === '♦'
                return (
                  <td key={strain} className={manche.has(bod) ? 'br-manche' : ''}>
                    <span className={rood ? 'br-rood' : ''}>{bod}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="br-ladder-uitleg">
        De biedtrap: elk volgend bod moet hóger op de trap liggen. Per niveau geldt de volgorde ♣ → ♦ → ♥ → ♠ → SA;
        na 1♠ kun je dus nog 1SA bieden, maar voor klaveren moet je al naar 2♣.
        De <span className="br-manche-vlek">gemarkeerde</span> vakjes zijn de manches.
      </p>
    </div>
  )
}

// ── De cursus ───────────────────────────────────────────────────────

export default function BridgeCursus() {
  return (
    <article className="gs-artikel br-cursus">
      <div className="km-page-head">
        <p className="km-eyebrow">Cursus</p>
        <h1>Bridge vanaf nul</h1>
        <p>Een complete cursus vijfkaart hoog, met voorbeeldhanden bij elk bod. Na afloop kun je een avond meebridgen.</p>
      </div>

      <section className="gs-sectie">
        <h2>1 · Wat is bridge?</h2>
        <p className="gs-alinea">
          Bridge speel je met vier spelers in twee vaste paren: Noord–Zuid tegen Oost–West. Alle 52 kaarten worden
          verdeeld; iedereen krijgt er 13. Elk spel bestaat uit twee delen: eerst <strong>bieden</strong> jullie om te bepalen
          welk paar hoeveel slagen belooft te halen (het contract), daarna wordt er <strong>gespeeld</strong> in 13 slagen.
          Kaartvolgorde is gewoon A, H, V, B, 10 … 2. Zo ziet een hand van 13 kaarten eruit:
        </p>
        <Kaarten s="A V 8 4" h="H 10 3" d="V 8 6 2" c="7 5" label="Voorbeeldhand" />
      </section>

      <section className="gs-sectie">
        <h2>2 · Slagen, de leider en de dummy</h2>
        <p className="gs-alinea">
          Een slag: iedere speler legt met de klok mee één kaart bij; je moet de gevraagde kleur <strong>bekennen</strong> als je
          kan. De hoogste kaart van de gevraagde kleur wint — tenzij er een troefkaart valt, want elke troef klopt elke
          niet-troefkaart. Wie de slag wint, komt uit voor de volgende.
        </p>
        <p className="gs-alinea">
          Bijzonder aan bridge: van het paar dat het contract speelt, doet er maar één echt mee — de <strong>leider</strong> (degene
          die de contractkleur het eerst bood). Zijn partner, de <strong>dummy</strong>, legt na de eerste uitkomst zijn hele hand
          open op tafel; de leider speelt beide handen. De speler links van de leider komt uit.
        </p>
      </section>

      <section className="gs-sectie">
        <h2>3 · Punten tellen (HCP)</h2>
        <p className="gs-alinea">
          Voordat je kunt bieden, moet je weten wat je hand waard is. Dat doe je met honneurpunten:
          <strong> aas = 4, heer = 3, vrouw = 2, boer = 1</strong>. In het hele spel zitten 40 punten; een gemiddelde hand
          heeft er 10. Tel bij lange kleuren een lengtepunt bij voor elke kaart boven de vier.
        </p>
        <Voorbeeld titel="Tel maar mee: 15 punten" s="A V 8 4" h="H 10 3" d="V 8 6 2" c="A 5">
          ♠A (4) + ♠V (2) + ♥H (3) + ♦V (2) + ♣A (4) = 15 punten. Precies dit narekenen oefen je straks in de
          trainer "Punten tellen" — na tien handen doe je het in seconden.
        </Voorbeeld>
        <p className="gs-alinea">
          De magische grens om te onthouden: met <strong>samen 25 punten</strong> kan een paar meestal een manche maken
          (daarover later meer). Jouw 13 punten zeggen dus pas iets als je weet wat partner heeft — en dáárvoor is het
          bieden uitgevonden.
        </p>
      </section>

      <section className="gs-sectie">
        <h2>4 · Het bieden is een gesprek</h2>
        <p className="gs-alinea">
          Vergeet even dat een bod "slagen belooft". Het bieden is vooral een <strong>gesprek in een geheimtaal die iedereen
          mag kennen</strong>: met elk bod vertel je partner iets over je punten en je kleuren. "1♠" betekent in vijfkaart hoog
          niet zomaar "ik wil schoppen troef maken", maar letterlijk: <em>"partner, ik heb 12–19 punten en minstens vijf
          schoppen"</em>. Partner telt zijn punten erbij op en weet dan al bijna of jullie hoog of laag moeten eindigen.
        </p>
        <p className="gs-alinea">
          De vorm: een bod is een <strong>niveau + een speelsoort</strong>. Het niveau zegt hoeveel slagen je paar belooft:
          altijd <strong>6 + het niveau</strong>. Dus 1♠ = 7 slagen met schoppen troef, 3SA = 9 slagen zonder troef ("sans
          atout"). Bieden gaat met de klok mee; je mag passen of een hóger bod doen. Na drie passen op rij is het laatste
          bod het <strong>contract</strong>.
        </p>
        <BiedLadder />
        <p className="gs-alinea">
          Waarom zou je hoog willen bieden? Omdat sommige contracten een premie opleveren: de <strong>manches</strong> —
          3SA, 4♥, 4♠, 5♣ en 5♦ — zijn véél meer waard dan de som van lagere contracten. Het hele biedgesprek draait
          dus om twee vragen: <em>hebben wij samen ±25 punten voor een manche?</em> en <em>in welke speelsoort passen onze
          handen het best bij elkaar?</em> Een "fit" van samen 8 kaarten in één kleur (5+3 of 4+4) is een fijne troefkleur;
          heb je die niet, dan is sans vaak het beste.
        </p>
      </section>

      <section className="gs-sectie">
        <h2>5 · Openen: jouw eerste woord</h2>
        <p className="gs-alinea">
          De eerste speler die niet past, "opent" het bieden. Openen doe je vanaf <strong>12 punten</strong>; met minder pas je.
          Welke opening je kiest, lees je van boven naar beneden af:
        </p>
        <div className="km-table-wrap br-tabel">
          <table className="km-table">
            <thead><tr><th>Check in deze volgorde</th><th>Opening</th><th>Belooft</th></tr></thead>
            <tbody>
              <tr><td>22 of meer punten?</td><td><strong>2♣</strong></td><td>Kunstmatig: zegt niets over klaveren, alleen "ik ben héél sterk". Partner moet bieden.</td></tr>
              <tr><td>20–21 punten én sans-verdeling?</td><td><strong>2SA</strong></td><td>Gebalanceerde hand, 20–21 punten.</td></tr>
              <tr><td>15–17 punten én sans-verdeling?</td><td><strong>1SA</strong></td><td>Gebalanceerde hand, 15–17 punten.</td></tr>
              <tr><td>Vijfkaart (of langer) in ♥ of ♠?</td><td><strong>1♥ / 1♠</strong></td><td>12–19 punten, minstens vijf kaarten in die kleur. Langste eerst; bij 5-5 de hoogste (♠).</td></tr>
              <tr><td>Anders (geen vijfkaart hoog)</td><td><strong>1♣ / 1♦</strong></td><td>12–19 punten, langste lage kleur. Bij 4-4 laag open je 1♦, bij 3-3 open je 1♣.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="gs-alinea">
          <strong>Sans-verdeling</strong> betekent: geen renonce (0 kaarten), geen singleton (1 kaart) en hooguit één
          doubleton (2 kaarten). Alleen 4-3-3-3, 4-4-3-2 en 5-3-3-2 tellen. Nu wordt de naam van het systeem duidelijk:
          1♥ en 1♠ beloven áltijd een <strong>vijfkaart</strong> — daarom heet het "vijfkaart hoog", en daarom mag partner
          straks al met drie kaartjes mee steunen (5 + 3 = de gewenste acht-kaart fit).
        </p>

        <h3 className="br-subkop">Zes handen, zes openingen</h3>
        <Voorbeeld titel="Open 1♠" s="A H 8 6 3" h="V 4" d="H 7 5 2" c="8 4">
          13 punten en vijf schoppen: open 1♠. De vijfkaart hoog gaat vóór alles (behalve de sans- en 2♣-openingen).
        </Voorbeeld>
        <Voorbeeld titel="Open 1♥" s="V 4" h="A B 9 6 3" d="H 7 5" c="V 8 4">
          13 punten, vijf harten en geen langere schoppen: 1♥.
        </Voorbeeld>
        <Voorbeeld titel="Open 1♦" s="A V 8 4" h="H 10 6 3" d="V 8 6 2" c="7">
          12 punten, wél vier schoppen en vier harten — maar geen víjf. Dan open je je langste lage kleur: 1♦.
          De vierkaarten hoog komen later vanzelf ter sprake.
        </Voorbeeld>
        <Voorbeeld titel="Open 1♣" s="A V 8 4" h="H 6 3" d="V 8 6" c="H 7 5">
          14 punten, kleuren 4-3-3-3: geen vijfkaart hoog, en de lage kleuren zijn allebei een driekaart.
          Afspraak: met 3-3 laag open je 1♣.
        </Voorbeeld>
        <Voorbeeld titel="Open 1SA" s="A V 8" h="H 10 3" d="V 8 6 2" c="A B 5">
          16 punten en een keurige 4-3-3-3: dit is de klassieke 1SA-opening (15–17 gebalanceerd).
          Let op: met dezelfde punten maar een singleton zou het 1♦ zijn — de verdeling telt!
        </Voorbeeld>
        <Voorbeeld titel="Open 2♣" s="A H V 8 4" h="A H 5" d="A V 6" c="H 4">
          Maar liefst 25 punten. Zó sterk dat een gewone opening te riskant is (iedereen zou kunnen passen):
          2♣ dwingt partner om te bieden, wat hij ook heeft.
        </Voorbeeld>
        <Voorbeeld titel="Pas" s="V 8 6 3" h="B 7 4" d="H 8 5 2" c="9 3">
          6 punten: te weinig. Passen is ook een bod — het vertelt partner "minder dan 12".
        </Voorbeeld>
      </section>

      <section className="gs-sectie">
        <h2>6 · Antwoorden op 1♥ of 1♠</h2>
        <p className="gs-alinea">
          Partner opent 1♠ (of 1♥) en het is jouw beurt. Eerste regel: met <strong>0–5 punten pas je</strong> — samen kom je
          nooit aan de 25. Vanaf 6 punten móét je iets zeggen (partner kan 19 hebben!). Stel jezelf dan twee vragen,
          in deze volgorde:
        </p>
        <p className="gs-alinea">
          <strong>Vraag 1: heb ik steun?</strong> Steun = minstens drie kaarten in partners kleur (want 5 + 3 = 8: fit!).
          Zo ja, vertel dat meteen — de hoogte van je steunbod vertelt je punten:
        </p>
        <div className="km-table-wrap br-tabel">
          <table className="km-table">
            <thead><tr><th>Jouw punten (met 3+ steun)</th><th>Bod na 1♠</th><th>Boodschap</th></tr></thead>
            <tbody>
              <tr><td>6–9</td><td><strong>2♠</strong></td><td>"Ik heb een fit maar weinig punten."</td></tr>
              <tr><td>10–11</td><td><strong>3♠</strong></td><td>"Fit én aardig wat punten — heb je iets extra's, bied dan de manche."</td></tr>
              <tr><td>12+</td><td><strong>4♠</strong> (of eerst een nieuwe kleur)</td><td>"Samen hebben we de 25: manche!"</td></tr>
            </tbody>
          </table>
        </div>
        <p className="gs-alinea">
          <strong>Vraag 2 (geen steun): heb ik een eigen kleur of bied ik het vangnet?</strong> Een nieuwe kleur op
          1-niveau (bijvoorbeeld 1♠ na 1♥) mag al vanaf 6 punten. Maar een nieuwe kleur op <strong>2-niveau</strong>
          (bijvoorbeeld 2♦ na 1♠) belooft <strong>10+ punten</strong> — je hijst het gesprek immers een trede omhoog.
          Kun je geen van beide, dan bied je <strong>1SA</strong>: het vangnet dat alleen maar zegt "6–9 punten, geen steun,
          niets op 1-niveau te melden".
        </p>

        <h3 className="br-subkop">Vijf antwoorden op 1♠ van partner</h3>
        <Voorbeeld titel="Bied 2♠ (6–9 met steun)" s="V 8 4" h="H 7 3" d="B 8 6 2" c="9 5 3">
          7 punten en drie schoppen mee: 2♠. Meer niet — partner weet genoeg.
        </Voorbeeld>
        <Voorbeeld titel="Bied 3♠ (10–11 met steun)" s="V 8 4 2" h="A 7 3" d="H 8 6 2" c="9 5">
          10 punten met vier schoppen: 3♠ nodigt partner uit. Met een minimum (12–13) past hij, met meer biedt hij 4♠.
        </Voorbeeld>
        <Voorbeeld titel="Bied 4♠ (12+ met steun)" s="H V 8 4" h="A 7 3" d="H 8 6" c="9 5 3">
          13 punten en vierkaart steun: 12 + 13 ≥ 25, dus meteen de manche.
        </Voorbeeld>
        <Voorbeeld titel="Bied 1SA (6–9 zonder steun)" s="8 4" h="V B 7 3" d="H 8 6 2" c="9 5 3">
          6 punten, maar twee schoppen en te weinig voor 2♥ (dat zou 10+ beloven): het vangnet 1SA.
        </Voorbeeld>
        <Voorbeeld titel="Bied 2♦ (10+ eigen kleur)" s="8 4" h="A 7 3" d="H V 8 6 2" c="H 5 3">
          13 punten en een vijfkaart ruiten: 2♦. Dit dwingt het gesprek verder — jullie zoeken samen het beste contract.
        </Voorbeeld>
      </section>

      <section className="gs-sectie">
        <h2>7 · Antwoorden op 1♣ of 1♦</h2>
        <p className="gs-alinea">
          Na een lage opening is de eerste taak: <strong>zoek de hoge fit</strong>. Heb je een vierkaart (of langer) in ♥ of ♠,
          bied die dan op 1-niveau — mag al vanaf 6 punten. Met twee vierkaarten hoog bied je <strong>de laagste eerst</strong>
          (1♥ vóór 1♠): zo kan partner met vier schoppen nog goedkoop 1♠ bieden en glipt er geen fit doorheen.
          Steun in partners lage kleur bewaar je voor later; sans-biedingen (1SA = 6–9) zijn er als niets anders past.
        </p>
        <Voorbeeld titel="Na 1♣: bied 1♥" s="V 8 6 3" h="A 7 4 2" d="8 5" c="9 6 3">
          6 punten met vier schoppen én vier harten: eerst de laagste vierkaart, 1♥. Heeft partner vier schoppen,
          dan biedt hij nu 1♠ en is de fit alsnog gevonden.
        </Voorbeeld>
        <Voorbeeld titel="Na 1♦: bied 1♠" s="H B 8 6 3" h="7 4" d="V 5 2" c="9 6 3">
          7 punten en een vijfkaart schoppen: 1♠. Nieuwe kleur op 1-niveau — goedkoop en informatief.
        </Voorbeeld>
      </section>

      <section className="gs-sectie">
        <h2>8 · Antwoorden op 1SA</h2>
        <p className="gs-alinea">
          Na 1SA is het gesprek verrassend simpel, want partner heeft zijn hand al bijna helemaal beschreven:
          15–17 punten, gebalanceerd. Jij hoeft alleen op te tellen richting de 25:
        </p>
        <div className="km-table-wrap br-tabel">
          <table className="km-table">
            <thead><tr><th>Jouw punten</th><th>Bod</th><th>Rekensom</th></tr></thead>
            <tbody>
              <tr><td>0–7</td><td><strong>pas</strong></td><td>17 + 7 = 24: net niet genoeg, blijf laag.</td></tr>
              <tr><td>8–9</td><td><strong>2SA</strong></td><td>"Met 17 halen we de 25 — heb jij 16–17, bied dan 3SA."</td></tr>
              <tr><td>10–15</td><td><strong>3SA</strong></td><td>15 + 10 = 25: manche.</td></tr>
            </tbody>
          </table>
        </div>
        <Voorbeeld titel="Na 1SA: bied 3SA" s="V 8 4" h="H 7 3" d="A 8 6 2" c="H 5 3">
          12 punten: samen minstens 27 — bied de manche direct. Zonder lange hoge kleur is 3SA bijna altijd het doel.
        </Voorbeeld>
        <p className="gs-alinea">
          Voor later: met een vierkaart ♥ of ♠ kun je eerst <strong>2♣ ("Stayman")</strong> bieden — een kunstmatige vraag
          "partner, heb jij een vierkaart hoog?". Handig om te kennen zodat je niet schrikt als het aan tafel langskomt,
          maar niet nodig om te beginnen.
        </p>
      </section>

      <section className="gs-sectie">
        <h2>9 · Het tweede bod van de openaar</h2>
        <p className="gs-alinea">
          Na jouw antwoord is partner (de openaar) weer aan de beurt, en nu verfijnt hij zijn verhaal. Onthoud de
          drie zones van de openingshand: <strong>minimaal 12–14</strong>, <strong>uitnodigend 15–17</strong>, <strong>sterk 18–19</strong>.
          De openaar telt jouw beloofde punten bij de zijne op en kiest:
        </p>
        <div className="km-table-wrap br-tabel">
          <table className="km-table">
            <thead><tr><th>Situatie na bijv. 1♠ – 2♠</th><th>Herbieding openaar</th></tr></thead>
            <tbody>
              <tr><td>12–14 punten (12 + hooguit 9 &lt; 25)</td><td><strong>pas</strong> — 2♠ is prima zo</td></tr>
              <tr><td>15–17 punten</td><td><strong>3♠</strong> — uitnodiging: "partner, met 8–9 bied jij 4♠"</td></tr>
              <tr><td>18–19 punten (18 + 6 kan al 25 zijn)</td><td><strong>4♠</strong> — manche</td></tr>
            </tbody>
          </table>
        </div>
        <p className="gs-alinea">
          Hetzelfde denkraam geldt overal: na 1♥ – 1SA past de openaar met een minimum, en na 1♦ – 1♠ steunt hij met
          vier schoppen (2♠ minimaal, 3♠ uitnodigend, 4♠ sterk) of herbiedt hij 1SA met een gebalanceerde 12–14.
          Je hoeft geen rijtjes te stampen — <em>tel de gezamenlijke punten en stuur richting 25/manche of stop laag</em>.
        </p>
      </section>

      <section className="gs-sectie">
        <h2>10 · Vier complete biedgesprekken</h2>
        <p className="gs-alinea">Beide handen open op tafel, en per bod wat er "gezegd" wordt (tegenstanders passen steeds).</p>

        <div className="br-gesprek">
          <div className="br-gesprek-handen">
            <Kaarten label="Partner (openaar)" s="A H 8 6 3" h="V 4 2" d="H 7 5" c="8 4" />
            <Kaarten label="Jij" s="V 9 4" h="H 7 3" d="V 8 6 2" c="9 5 3" />
          </div>
          <Serie stappen={[{ wie: 'partner', bod: '1♠' }, { wie: 'jij', bod: '2♠' }, { wie: 'partner', bod: 'pas' }]} />
          <p className="gs-alinea">
            1♠ = "12–19, vijf schoppen". 2♠ = "6–9 met steun" (jij hebt 7 en drie schoppen). Partner telt: 13 + hooguit 9
            = te weinig voor de manche → pas. Contract: 2♠, acht slagen met schoppen troef. Precies hoog genoeg.
          </p>
        </div>

        <div className="br-gesprek">
          <div className="br-gesprek-handen">
            <Kaarten label="Partner (openaar)" s="A H 8 6 3" h="A 4" d="H 7 5 2" c="V 4" />
            <Kaarten label="Jij" s="V 9 4 2" h="H 7 3" d="V 8 6" c="H 5 3" />
          </div>
          <Serie stappen={[{ wie: 'partner', bod: '1♠' }, { wie: 'jij', bod: '3♠' }, { wie: 'partner', bod: '4♠' }, { wie: 'jij', bod: 'pas' }]} />
          <p className="gs-alinea">
            Jij hebt 10 punten en vierkaart steun: 3♠ nodigt uit. Partner heeft er 16 — ruim boven een minimum — en
            accepteert: 4♠, de manche. Samen 26 punten en negen troeven: dit hoort te lukken.
          </p>
        </div>

        <div className="br-gesprek">
          <div className="br-gesprek-handen">
            <Kaarten label="Partner (openaar)" s="A V 8" h="H B 3" d="V 8 6 2" c="A B 5" />
            <Kaarten label="Jij" s="H 4 3" h="V 8 6" d="A 7 5 3" c="V 8 2" />
          </div>
          <Serie stappen={[{ wie: 'partner', bod: '1SA' }, { wie: 'jij', bod: '3SA' }, { wie: 'partner', bod: 'pas' }]} />
          <p className="gs-alinea">
            1SA = 15–17 gebalanceerd (partner heeft 16). Jij telt: 16 + jouw 11 = 27, geen lange hoge kleur → direct 3SA.
            Korter kan een biedgesprek niet.
          </p>
        </div>

        <div className="br-gesprek">
          <div className="br-gesprek-handen">
            <Kaarten label="Partner (openaar)" s="H 7 3" h="A V 8 4" d="A B 6 2" c="8 4" />
            <Kaarten label="Jij" s="A B 8 6 2" h="7 3" d="V 8 5" c="V 6 3" />
          </div>
          <Serie stappen={[{ wie: 'partner', bod: '1♦' }, { wie: 'jij', bod: '1♠' }, { wie: 'partner', bod: '1SA' }, { wie: 'jij', bod: 'pas' }]} />
          <p className="gs-alinea">
            Partner opent zijn langste lage kleur (geen vijfkaart hoog). Jij toont je vijfkaart schoppen op 1-niveau.
            Partner heeft geen drie schoppen mee en herbiedt 1SA (12–14 gebalanceerd). Jij hebt 9: samen hooguit 23 —
            passen en laag blijven. Ook stoppen is een kunst.
          </p>
        </div>
      </section>

      <section className="gs-sectie">
        <h2>11 · Spiekbriefje</h2>
        <div className="km-table-wrap br-tabel">
          <table className="km-table">
            <thead><tr><th>Moment</th><th>Regel in één zin</th></tr></thead>
            <tbody>
              <tr><td>Openen</td><td>12+ punten; vijfkaart ♥/♠ eerst, anders langste lage kleur; 1SA = 15–17 gebalanceerd; 2SA = 20–21; 2♣ = 22+.</td></tr>
              <tr><td>Antwoorden</td><td>0–5 pas · 6–9 steun op 2-niveau of 1SA/nieuwe kleur op 1-niveau · 10–11 steun met sprong · 12+ manche in zicht (nieuwe kleur op 2-niveau mag).</td></tr>
              <tr><td>Na 1SA</td><td>0–7 pas · 8–9 2SA · 10+ 3SA.</td></tr>
              <tr><td>Herbieden</td><td>Tel samen: &lt;25 laag stoppen · grensgeval uitnodigen · 25+ manche bieden.</td></tr>
              <tr><td>Fit</td><td>Samen 8 kaarten in een kleur = troef spelen; geen fit = denk aan sans.</td></tr>
              <tr><td>Manches</td><td>3SA (9 slagen), 4♥/4♠ (10), 5♣/5♦ (11) — samen ±25 punten.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="gs-sectie">
        <h2>12 · Het spelen en de score</h2>
        <p className="gs-alinea">
          Uitkomen tegen een sans-contract: kies de <strong>vierde kaart van je langste kleur</strong>. Tegen een troefcontract is
          een kleur waarvan je A-H hebt of een singleton aantrekkelijk. Als leider in een troefcontract: <strong>trek eerst
          troef</strong> (speel troef tot de tegenpartij er geen meer heeft), tegen sans: ontwikkel je lange kleur. Een
          <strong> snit</strong> proberen (bijv. richting je V spelen in de hoop dat de heer "ervoor" zit) wint vaak een extra slag.
        </p>
        <p className="gs-alinea">
          De score hoef je niet uit je hoofd te kennen — die staat op elk biedbriefje. Onthoud alleen: contract gehaald =
          punten voor jullie (manche = veel extra), elke downslag = punten voor de tegenpartij, en "kwetsbaar" (na een
          eerder gewonnen manche in een robber) maakt alles duurder. Daarmee weet je genoeg om aan te schuiven —
          de rest leer je aan tafel.
        </p>
      </section>
    </article>
  )
}
