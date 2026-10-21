"""Controleert de krantenartikelen en haalt hun foto's op.

Gebruik: python3 scripts/krant.py [--fotos]
- controleert src/krant/stukken/*.json (velden, woorden, foto-indexen)
- met --fotos: schrijft een bronbestand en draait scripts/fotos.py naar
  public/krant-fotos + src/krant/fotos.ts, en verkleint de bestanden."""
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
STUKKEN = sorted((REPO / "src/krant/stukken").glob("*.json"))
SCHEMAS = set(re.findall(r"\|\s*'([a-z0-9-]+)'", (REPO / "src/elektronica/types.ts").read_text().split("export type SchemaId")[1].split("\n\n")[0]))
VT = {"papi", "viertakt", "ils", "vleugel", "rotor", "circuit", "baan"}

alle, fouten = [], []
for p in STUKKEN:
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        fouten.append(f"{p.name}: geen geldige JSON ({e})")
        continue
    for s in d:
        w = sum(len(a.split()) for x in s["secties"] for a in x["alineas"])
        alle.append((p.name, s["id"], w, len(s.get("fotos", []))))
        for x in s["secties"]:
            if "foto" in x and not (0 <= x["foto"] < len(s.get("fotos", []))):
                fouten.append(f"{s['id']}: foto-index {x['foto']} bestaat niet")
            if x.get("schema") and x["schema"] not in SCHEMAS:
                fouten.append(f"{s['id']}: onbekend schema {x['schema']}")
            if x.get("vt") and x["vt"] not in VT:
                fouten.append(f"{s['id']}: onbekend vt-beeld {x['vt']}")
        bijs = [f["bijschrift"] for f in s.get("fotos", [])]
        if len(bijs) != len(set(bijs)):
            fouten.append(f"{s['id']}: dubbele bijschriften")

ids = [a[1] for a in alle]
for i in {x for x in ids if ids.count(x) > 1}:
    fouten.append(f"dubbel id {i}")
per = {}
for f, i, w, n in alle:
    per.setdefault(i.rsplit("-", 1)[0], []).append(w)
for r, ws in sorted(per.items()):
    print(f"{r:14} {len(ws):3} artikelen  {sum(ws):6} woorden  (min {min(ws)}, max {max(ws)})")
print(f"totaal {len(alle)} artikelen, {sum(a[2] for a in alle)} woorden")
for f in fouten:
    print("FOUT", f)

if "--fotos" in sys.argv:
    bron = {}
    for p in STUKKEN:
        for s in json.loads(p.read_text(encoding="utf-8")):
            bron[s["id"]] = s.get("fotos", [])
    tmp = REPO / "scripts/.krant-fotos-bron.json"
    tmp.write_text(json.dumps(bron, ensure_ascii=False), encoding="utf-8")
    subprocess.run([sys.executable, str(REPO / "scripts/fotos.py"), str(REPO), "krant-fotos", "src/krant/fotos.ts", str(tmp.relative_to(REPO))], check=True)
    tmp.unlink()
    from PIL import Image

    for f in (REPO / "public/krant-fotos").glob("*.jpg"):
        im = Image.open(f)
        if im.format == "JPEG" and f.stat().st_size < 250_000:
            continue
        im.seek(0)
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        bg.save(f, "JPEG", quality=78, optimize=True, progressive=True)
