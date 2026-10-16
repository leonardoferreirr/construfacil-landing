#!/usr/bin/env python3
"""Monta as abas e os painéis do seletor de pedras no index.html a partir de PEDRAS.

Fonte única: nome, usos, texto e fotos de cada pedra moram aqui. Para trocar ou
incluir uma pedra, edite a lista, gere as fotos em assets/img/pedras/<slug>-<n>-{200,520,900}.webp
e rode:  python3 ferramentas/pedras.py  &&  python3 build.py
"""
import html, re
from pathlib import Path
from urllib.parse import quote
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
HTML = RAIZ / "index.html"
ZAP = "5511982898159"
VAZIO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"

PEDRAS = [
    dict(slug="moledo-branca", nome="Moledo Branca Premium", curto="Fachada e muro",
         usos=["Fachada", "Muro", "Área gourmet"],
         texto="Pedra branca de textura rústica e recorte irregular. Ilumina a fachada e combina com esquadria escura e madeira.",
         fotos=["Fachada de casa revestida com Moledo Branca Premium", "Detalhe da parede em Moledo Branca Premium"]),
    dict(slug="moledo-champagne", nome="Moledo Champagne", curto="Fachada e parede de destaque",
         usos=["Fachada", "Muro", "Parede de destaque"],
         texto="Tom areia com pontos dourados, assentada em mosaico. Dá à fachada e ao muro aquele ar de casa de campo, com acabamento limpo.",
         fotos=["Parede externa em Moledo Champagne", "Muro em Moledo Champagne", "Textura da Moledo Champagne de perto"]),
    dict(slug="madeira-amarela", nome="Pedra Madeira Amarela", curto="Muro, escada e piscina",
         usos=["Muro de arrimo", "Escada", "Borda de piscina", "Caminho"],
         texto="A mais versátil da loja: vai em muro de arrimo, escada, borda de piscina e caminho no jardim. A Pedra Madeira vem em 8 cores, aberta ou serrada.",
         fotos=["Escada com muro em Pedra Madeira Amarela", "Piscina com mureta em Pedra Madeira Amarela",
                "Muro de jardim em Pedra Madeira Amarela", "Caminho no gramado em Pedra Madeira Amarela"]),
    dict(slug="madeira-rosa", nome="Pedra Madeira Rosa Serrada", curto="Degrau e piso externo",
         usos=["Degrau", "Piso externo", "Caminho"],
         texto="Serrada em placas de espessura regular, com veios rosados. Ideal para degrau, piso externo e caminho que precisa ficar firme e nivelado.",
         fotos=["Degraus em Pedra Madeira Rosa Serrada", "Placas de Pedra Madeira Rosa Serrada de perto"]),
    dict(slug="sao-tome", nome="Lajão Amarelo São Tomé", curto="Caminho e quintal",
         usos=["Caminho", "Quintal", "Entorno de piscina"],
         texto="Lajões grandes em tom amarelo, com superfície naturalmente antiderrapante. O clássico para caminho, quintal e entorno de piscina.",
         fotos=["Caminho de jardim em Lajão Amarelo São Tomé", "Piso de quintal em Lajão Amarelo São Tomé",
                "Pisantes de São Tomé no gramado"]),
    dict(slug="folheta", nome="Pedra Folheta", curto="Escada, muro e floreira",
         usos=["Escada", "Muro", "Floreira"],
         texto="Filetes empilhados em tom quente, com cara de obra feita à mão. Fica linda em escadaria, muro e floreira.",
         fotos=["Escadaria de entrada em Pedra Folheta", "Escada e floreiras em Pedra Folheta", "Muro em Pedra Folheta"]),
]

SETA = '<svg aria-hidden="true"><use href="#ic-seta"/></svg>'
ZAPIC = '<svg aria-hidden="true"><use href="#ic-zap"/></svg>'
SIZES = "(max-width:900px) calc(100vw - 2.5rem), (max-width:1080px) 46vw, 32vw"


def larg(caminho):
    return Image.open(RAIZ / caminho).width


def wa(msg):
    return f"https://wa.me/{ZAP}?text={quote(msg)}"


def abas():
    out = []
    for i, p in enumerate(PEDRAS):
        sel = "true" if i == 0 else "false"
        tab = "" if i == 0 else ' tabindex="-1"'
        out.append(
            f'<button class="sel__tab" role="tab" id="t-{p["slug"]}" aria-controls="p-{p["slug"]}" aria-selected="{sel}"{tab}>'
            f'<span class="n">{i + 1:02d}</span><span class="nm">{p["nome"]}</span>{SETA}<span class="us">{p["curto"]}</span></button>')
    return "\n        ".join(out)


def painel(i, p):
    ativo = i == 0
    base = f'assets/img/pedras/{p["slug"]}'
    g = f'{base}-1-900.webp'
    srcset = f'{base}-1-520.webp 520w, {g} {larg(g)}w'
    if ativo:
        img = (f'<img src="{base}-1-520.webp" srcset="{srcset}" sizes="{SIZES}" width="520" height="650" '
               f'loading="lazy" decoding="async" alt="{p["fotos"][0]}">')
    else:
        img = (f'<img src="{VAZIO}" data-src="{base}-1-520.webp" data-srcset="{srcset}" sizes="{SIZES}" width="520" height="650" '
               f'decoding="async" alt="{p["fotos"][0]}">')
    minis = []
    for n, alt in enumerate(p["fotos"], 1):
        gg = f'{base}-{n}-900.webp'
        ss = f'{base}-{n}-520.webp 520w, {gg} {larg(gg)}w'
        mini = f'{base}-{n}-200.webp'
        src = f'src="{mini}" loading="lazy"' if ativo else f'src="{VAZIO}" data-src="{mini}"'
        minis.append(
            f'<button type="button" aria-pressed="{"true" if n == 1 else "false"}" data-srcset="{ss}" data-src="{base}-{n}-520.webp" '
            f'data-alt="{html.escape(alt)}" aria-label="Foto {n}: {html.escape(alt)}"><img {src} width="200" height="250" alt=""></button>')
    usos = "".join(f"<li>{u}</li>" for u in p["usos"])
    msg = f'Olá! Vim pelo site e quero o preço da {p["nome"]}.'
    oculto = "" if ativo else " hidden"
    return f'''<div class="painel" role="tabpanel" id="p-{p["slug"]}" aria-labelledby="t-{p["slug"]}" tabindex="0"{oculto}>
          <div>
            <div class="painel__fig">{img}</div>
            {'<div class="minis" role="group" aria-label="Mais fotos da ' + p["nome"] + '">' + "".join(minis) + '</div>' if len(minis) > 1 else ''}
          </div>
          <div class="painel__txt">
            <h3>{p["nome"]}</h3>
            <p>{p["texto"]}</p>
            <ul class="usos" aria-label="Onde usar">{usos}</ul>
            <a class="btn btn--zap" data-wa="pedra-{p["slug"]}" data-msg="{html.escape(msg)}" href="{wa(msg)}">{ZAPIC}Falar com especialista</a>
          </div>
        </div>'''


def main():
    s = HTML.read_text(encoding="utf-8")
    novo_abas = f'<div class="sel__lista" role="tablist" aria-label="Pedras">\n        {abas()}\n      </div>'
    s, n1 = re.subn(r'<div class="sel__lista" role="tablist" aria-label="Pedras">.*?\n      </div>', lambda m: novo_abas, s, count=1, flags=re.S)
    paineis = "\n        ".join(painel(i, p) for i, p in enumerate(PEDRAS))
    bloco = f"<!--PAINEIS-->\n        {paineis}\n        <!--/PAINEIS-->"
    if "<!--/PAINEIS-->" in s:
        s, n2 = re.subn(r"<!--PAINEIS-->.*?<!--/PAINEIS-->", lambda m: bloco, s, count=1, flags=re.S)
    else:
        s, n2 = s.replace("<!--PAINEIS-->", bloco, 1), 1
    if not (n1 and n2):
        raise SystemExit(f"marcadores não encontrados (abas={n1}, paineis={n2})")
    HTML.write_text(s, encoding="utf-8")
    print(f"{len(PEDRAS)} pedras, abas e painéis gerados")


if __name__ == "__main__":
    main()
