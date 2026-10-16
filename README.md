# Constru Fácil Itu · landing

Landing da Constru Fácil (pedras decorativas e churrasqueiras pré-moldadas, Itu/SP), cliente do Lucas.
Domínio previsto: `lojaconstrufacilitu.com.br` (canonical, OG, sitemap e schema já apontam para `https://www.lojaconstrufacilitu.com.br`).

Estático puro (HTML, CSS e JS), sem framework. Deploy na Vercel com `framework: null`.

## Rodar local

    npx serve -l 8889 .

## Editar

- **CSS:** a fonte da verdade é `assets/css/site.css`, mas o navegador lê a cópia inline no `index.html`.
  Depois de editar, rode `python3 build.py` (ele também carimba o `site.js` com hash).
- **Pedras do seletor:** nome, usos, texto e fotos ficam em `ferramentas/pedras.py`. Edite a lista e rode
  `python3 ferramentas/pedras.py && python3 build.py`. Fotos em `assets/img/pedras/<slug>-<n>-{200,520,900}.webp`.
- **WhatsApp:** número `5511982898159` em `assets/js/site.js` (`NUM`). Todo botão passa por `obrigado.html`,
  que dispara `whatsapp_click` no dataLayer antes de abrir a conversa (pronto para o GTM).

## Logo

Redesenhado em vetor a partir do folheto do Google Sites (não havia arquivo original): três telhados medidos no
pixel + nome em TeX Gyre Bonum Bold (clone livre da Bookman, licença GUST), sem a sombra do original.
Entra como `<symbol id="logo">` no HTML, com cores por variável (`--l-preto`, `--l-cinza`, `--l-texto`, `--l-verm`).
Versões soltas em `assets/img/logo-*.svg`.

## A confirmar com o cliente

- Entrega na obra (Itu e região) e assentamento com equipe própria: deduzidos do Instagram (equipe "Operacional"
  nas obras, caminhonete com paletes), não confirmados por escrito.
- Cálculo de metragem com sobra de corte e "pedra escolhida na origem".
- Horário de funcionamento (fora da página até confirmar).
- GTM / tag de conversão do Google Ads (ainda não instalados).
