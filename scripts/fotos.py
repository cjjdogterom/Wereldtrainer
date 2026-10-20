"""Algemeen fotoscript voor de Wereldtrainer.

Gebruik: python3 fotos.py <repo> <uitmap-in-public> <ts-uitvoer> <bron.json> [bron2.json …]
bron.json: { "<id>": [ { "wiki": "Titel", "taal": "nl"|"en", "bijschrift": "…" } ] }
Schrijft public/<uitmap>/<id>-<n>.jpg en een TS-bestand met FOTOS per id."""
import html
import json
import re
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(sys.argv[1])
UITMAP = sys.argv[2]
TS = REPO / sys.argv[3]
BRONNEN = [REPO / p for p in sys.argv[4:]]
UIT = REPO / "public" / UITMAP
UIT.mkdir(parents=True, exist_ok=True)
CTX = ssl.create_default_context(cafile="/etc/ssl/cert.pem")
UA = {"User-Agent": "Wereldtrainer/1.0 (persoonlijke leerapp; https://github.com/cjjdogterom/Wereldtrainer)"}


def haal(url, binair=False):
    wacht = 2.0
    for _ in range(7):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60, context=CTX) as r:
                b = r.read()
                return b if binair else json.loads(b.decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                time.sleep(wacht)
                wacht *= 2
                continue
            raise
    raise RuntimeError("geweigerd: " + url[:90])


def schoon(t):
    t = re.sub(r"<[^>]+>", "", t or "")
    return re.sub(r"\s+", " ", html.unescape(t)).strip()[:120]


def blokken(xs, n=50):
    for i in range(0, len(xs), n):
        yield xs[i : i + n]


bron = {}
for p in BRONNEN:
    for k, v in json.loads(p.read_text(encoding="utf-8")).items():
        bron.setdefault(k, []).extend(v)

# 1. hoofdfoto per (taal, titel)
titels = {}
for items in bron.values():
    for it in items:
        titels.setdefault(it.get("taal", "en"), set()).add(it["wiki"])
foto_van = {}  # (taal, titel) -> (bestandsnaam, thumb-url)
for taal, ts in titels.items():
    for blok in blokken(sorted(ts)):
        j = haal(
            f"https://{taal}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1"
            "&prop=pageimages&piprop=thumbnail|name&pithumbsize=800&titles=" + urllib.parse.quote("|".join(blok))
        )
        q = j.get("query", {})
        naar = {r["from"]: r["to"] for r in q.get("normalized", []) + q.get("redirects", [])}
        pagina = {p["title"]: p for p in q.get("pages", [])}
        for t in blok:
            d = t
            for _ in range(3):
                d = naar.get(d, d)
            p = pagina.get(d)
            if p and p.get("pageimage") and p.get("thumbnail"):
                foto_van[(taal, t)] = (p["pageimage"], p["thumbnail"]["source"])
        time.sleep(1)

# 2. maker/licentie van Commons
meta = {}
for blok in blokken(sorted({b for b, _ in foto_van.values()})):
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
        meta[naam] = {
            "maker": schoon(m.get("Artist", {}).get("value", "")) or "onbekend",
            "licentie": schoon(m.get("LicenseShortName", {}).get("value", "")) or "zie bron",
            "bron": ii.get("descriptionurl", ""),
        }
    time.sleep(1)

# 3. downloaden en verkleinen
uit, mis = {}, []
gedownload = {}  # thumb-url -> lokale naam (zelfde foto niet dubbel ophalen)
for pid, items in bron.items():
    for n, it in enumerate(items, start=1):
        taal = it.get("taal", "en")
        f = foto_van.get((taal, it["wiki"]))
        if not f:
            mis.append((pid, it["wiki"]))
            continue
        bestand, thumb = f
        lokaal = gedownload.get(thumb)
        if not lokaal:
            ext = ".png" if thumb.lower().endswith(".png") else ".jpg"
            lokaal = f"{pid}-{n}{ext}"
            doel = UIT / lokaal
            if not doel.exists() or doel.stat().st_size < 1000:
                try:
                    doel.write_bytes(haal(thumb, binair=True))
                    time.sleep(1.1)
                except Exception as e:  # noqa: BLE001
                    mis.append((pid, it["wiki"] + " — " + str(e)[:60]))
                    continue
                if ext == ".jpg":
                    subprocess.run(["sips", "-s", "formatOptions", "74", "-Z", "800", str(doel), "--out", str(doel)], capture_output=True)
            gedownload[thumb] = lokaal
        m = meta.get(bestand.replace(" ", "_"), {})
        uit.setdefault(pid, []).append(
            {
                "src": f"/{UITMAP}/{lokaal}",
                "bijschrift": it.get("bijschrift", ""),
                "maker": m.get("maker", "onbekend"),
                "licentie": m.get("licentie", "zie bron"),
                "bron": m.get("bron") or f"https://{taal}.wikipedia.org/wiki/" + urllib.parse.quote(it["wiki"].replace(" ", "_")),
            }
        )
    print("ok", pid, flush=True)

regels = [
    "// Gegenereerd door scripts/fotos.py — foto's van Wikimedia Commons.",
    "import type { Foto } from '../ui/Fotos'",
    "",
    "export const FOTOS: Record<string, Foto[]> = {",
]
for pid, fs in uit.items():
    regels.append(f"  {json.dumps(pid)}: {json.dumps(fs, ensure_ascii=False)},")
regels.append("}")
TS.write_text("\n".join(regels) + "\n", encoding="utf-8")
print(f"\n{sum(len(v) for v in uit.values())} foto's voor {len(uit)} ids; {len(mis)} mislukt")
for m in mis:
    print("MIS", *m)
