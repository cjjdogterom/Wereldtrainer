"""Haalt per plant een foto via Wikipedia/Wikimedia Commons en schrijft
src/planten/media.ts met maker, licentie en bron. Werkt in batches en met
wachttijd, om de servers van Wikimedia niet te overbelasten."""
import html
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(sys.argv[1])
DATA = (REPO / "src/planten/data.ts").read_text(encoding="utf-8")
UIT = REPO / "public/planten"
UIT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context(cafile="/etc/ssl/cert.pem")
UA = {"User-Agent": "Wereldtrainer/1.0 (persoonlijke leerapp; https://github.com/cjjdogterom/Wereldtrainer)"}


def haal(url: str, binair=False, pogingen=6):
    wacht = 2.0
    for _ in range(pogingen):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                inhoud = r.read()
                return inhoud if binair else json.loads(inhoud.decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(wacht)
                wacht *= 2
                continue
            raise
    raise RuntimeError("te vaak geweigerd: " + url[:80])


def schoon(tekst: str) -> str:
    tekst = re.sub(r"<[^>]+>", "", tekst or "")
    return re.sub(r"\s+", " ", html.unescape(tekst)).strip()[:120]


def blokken(lijst, n=50):
    for i in range(0, len(lijst), n):
        yield lijst[i : i + n]


paren = re.findall(r"id:\s*'([^']+)'[\s\S]*?wiki:\s*(?:'((?:[^'\\]|\\.)*)'|\"([^\"]+)\")", DATA)
paren = [(i, (a or b).replace("\\'", "'")) for i, a, b in paren]
print(f"{len(paren)} soorten", flush=True)

# 1. Paginafoto per artikel (nl-Wikipedia), 50 titels per verzoek.
afbeelding_van_titel: dict[str, tuple[str, str]] = {}  # titel -> (bestandsnaam, thumb-url)
for blok in blokken([t for _, t in paren]):
    j = haal(
        "https://nl.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1"
        "&prop=pageimages&piprop=thumbnail|name&pithumbsize=800&titles=" + urllib.parse.quote("|".join(blok))
    )
    q = j.get("query", {})
    naar = {}
    for r in q.get("normalized", []) + q.get("redirects", []):
        naar[r["from"]] = r["to"]
    per_titel = {p["title"]: p for p in q.get("pages", [])}
    for t in blok:
        doel = t
        for _ in range(3):
            doel = naar.get(doel, doel)
        p = per_titel.get(doel)
        if p and p.get("pageimage") and p.get("thumbnail"):
            afbeelding_van_titel[t] = (p["pageimage"], p["thumbnail"]["source"])
    time.sleep(1)

# 2. Maker en licentie van Commons, 50 bestanden per verzoek.
bestanden = sorted({b for b, _ in afbeelding_van_titel.values()})
meta_van: dict[str, dict] = {}
for blok in blokken(bestanden):
    j = haal(
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2"
        "&prop=imageinfo&iiprop=url|extmetadata&titles=" + urllib.parse.quote("|".join("File:" + b for b in blok))
    )
    q = j.get("query", {})
    terug = {n["to"]: n["from"] for n in q.get("normalized", [])}
    for p in q.get("pages", []):
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        naam = terug.get(p["title"], p["title"]).removeprefix("File:").replace(" ", "_")
        m = ii.get("extmetadata", {})
        meta_van[naam] = {
            "maker": schoon(m.get("Artist", {}).get("value", "")) or "onbekend",
            "licentie": schoon(m.get("LicenseShortName", {}).get("value", "")) or "zie bron",
            "bron": ii.get("descriptionurl", ""),
        }
    time.sleep(1)

# 3. Downloaden, rustig aan.
media, mislukt = {}, []
for pid, titel in paren:
    gevonden = afbeelding_van_titel.get(titel)
    if not gevonden:
        mislukt.append((pid, titel, "geen paginafoto"))
        continue
    bestand, thumb = gevonden
    meta = meta_van.get(bestand.replace(" ", "_"))
    doel = UIT / f"{pid}.jpg"
    try:
        if not doel.exists() or doel.stat().st_size < 1000:
            doel.write_bytes(haal(thumb, binair=True))
            time.sleep(1.2)
        media[pid] = {
            "bestand": doel.name,
            "maker": (meta or {}).get("maker", "onbekend"),
            "licentie": (meta or {}).get("licentie", "zie bron"),
            "bron": (meta or {}).get("bron", "https://nl.wikipedia.org/wiki/" + urllib.parse.quote(titel.replace(" ", "_"))),
        }
        print("ok ", pid, flush=True)
    except Exception as e:  # noqa: BLE001
        mislukt.append((pid, titel, str(e)[:80]))

regels = [
    "// Gegenereerd door scripts: foto's van Wikimedia Commons in public/planten.",
    "export type Foto = { bestand: string; maker: string; licentie: string; bron: string }",
    "",
    "export const FOTO: Record<string, Foto> = {",
]
for pid, m in media.items():
    regels.append(f"  {json.dumps(pid)}: {json.dumps(m, ensure_ascii=False)},")
regels.append("}")
(REPO / "src/planten/media.ts").write_text("\n".join(regels) + "\n", encoding="utf-8")

print(f"\n{len(media)} foto's, {len(mislukt)} mislukt")
for m in mislukt:
    print("MIS", *m)
