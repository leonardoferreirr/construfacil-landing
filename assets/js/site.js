/* Constru Fácil Itu · landing */
(function () {
  'use strict';
  var NUM = '5511982898159';
  var parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var celular = window.matchMedia('(max-width: 900px)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- WhatsApp: todo botão passa pela página de obrigado ----------
     Lá o clique vira evento de conversão antes de abrir a conversa. A mensagem vai
     também no sessionStorage, porque servidor com URL limpa pode descartar a query
     no redirecionamento /obrigado.html -> /obrigado. Grava no CLIQUE, nunca na
     montagem (senão o último botão sobrescreve a mensagem de todos). */
  function guarda(dados) {
    try { sessionStorage.setItem('cf_wa', JSON.stringify(dados)); } catch (e) {}
  }
  $$('[data-wa]').forEach(function (a) {
    var c = a.getAttribute('data-wa'), t = a.getAttribute('data-msg') || 'Olá! Vim pelo site da Constru Fácil.';
    a.href = 'obrigado.html?n=' + NUM + '&c=' + encodeURIComponent(c) + '&t=' + encodeURIComponent(t);
    a.addEventListener('click', function () { guarda({ n: NUM, c: c, t: t }); });
  });

  /* ---------- cabeçalho e menu ---------- */
  var topo = $('#topo'), pedindo = false;
  function pintaTopo() {
    pedindo = false;
    if (window.scrollY > 16) topo.setAttribute('data-fixo', ''); else topo.removeAttribute('data-fixo');
  }
  addEventListener('scroll', function () { if (!pedindo) { pedindo = true; requestAnimationFrame(pintaTopo); } }, { passive: true });
  pintaTopo();

  var bt = $('#menuBt'), gaveta = $('#gaveta');
  function abreMenu(abrir) {
    bt.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    bt.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    gaveta.setAttribute('aria-hidden', abrir ? 'false' : 'true');
    if (abrir) { gaveta.setAttribute('data-aberta', ''); topo.setAttribute('data-fixo', ''); }
    else { gaveta.removeAttribute('data-aberta'); pintaTopo(); }
  }
  bt.addEventListener('click', function () { abreMenu(bt.getAttribute('aria-expanded') !== 'true'); });
  $$('a', gaveta).forEach(function (a) { a.addEventListener('click', function () { abreMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') abreMenu(false); });

  /* ---------- entrada no scroll ---------- */
  var sobe = $$('[data-sobe]');
  if ('IntersectionObserver' in window && !parado) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    sobe.forEach(function (el) { io.observe(el); });
  } else sobe.forEach(function (el) { el.classList.add('dentro'); });

  /* ---------- hero: fotos dentro da casa, janela 2x2 = qual foto ---------- */
  var casa = $('#casa');
  if (casa) {
    var fotos = $$('.casa__foto img', casa), janelas = $$('#casaLeg .janela button'), leg = $('#casaLeg p');
    var LEG = [['Moledo Branca Premium', 'na fachada'], ['Pedra Madeira Amarela', 'no muro e na escada'],
               ['Pedra Folheta', 'na escadaria'], ['Lajão Amarelo São Tomé', 'no caminho do jardim']];
    var atual = 0, timer = 0, visivel = true, prontas = false;
    function hidrata() {
      if (prontas) return; prontas = true;
      fotos.forEach(function (img) {
        var u = img.getAttribute(celular.matches ? 'data-m' : 'data-d');
        if (u) img.src = u;
      });
    }
    function mostra(i) {
      hidrata();
      fotos[atual].classList.remove('on');
      janelas[atual].removeAttribute('aria-current');
      atual = (i + fotos.length) % fotos.length;
      fotos[atual].classList.add('on');
      janelas[atual].setAttribute('aria-current', 'true');
      leg.innerHTML = '<strong>' + LEG[atual][0] + '</strong>' + LEG[atual][1];
    }
    function agenda() {
      clearInterval(timer);
      if (!parado && visivel && !document.hidden) timer = setInterval(function () { mostra(atual + 1); }, 5500);
    }
    janelas.forEach(function (b, i) { b.addEventListener('click', function () { mostra(i); agenda(); }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; agenda(); }).observe(casa);
    }
    document.addEventListener('visibilitychange', agenda);
    // textura de fundo do hero: baixa depois do load e só aparece quando já está pronta
    addEventListener('load', function () {
      var f = new Image();
      f.onload = function () { document.documentElement.classList.add('fundo-ok'); };
      f.src = 'assets/img/hero/fundo-' + (celular.matches ? '800' : '1280') + '.webp';
    });
    // as outras fotos só baixam depois do load: nada disputa banda com a primeira
    addEventListener('load', function () { setTimeout(function () { hidrata(); agenda(); }, 1200); });
  }

  /* ---------- seletor de pedras ---------- */
  var abas = $$('.sel__tab');
  function hidrataPainel(p) {
    $$('img[data-src]', p).forEach(function (img) {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
    });
  }
  function ativa(aba, foco) {
    abas.forEach(function (a) {
      var on = a === aba, p = document.getElementById(a.getAttribute('aria-controls'));
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      a.tabIndex = on ? 0 : -1;
      if (on) { hidrataPainel(p); p.hidden = false; } else p.hidden = true;
    });
    if (foco) aba.focus();
    if (celular.matches) aba.scrollIntoView({ block: 'nearest', inline: 'center', behavior: parado ? 'auto' : 'smooth' });
  }
  abas.forEach(function (a, i) {
    a.addEventListener('click', function () { ativa(a); });
    a.addEventListener('keydown', function (e) {
      var k = e.key, n = abas.length, j = -1;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
      if (k === 'Home') j = 0;
      if (k === 'End') j = n - 1;
      if (j > -1) { e.preventDefault(); ativa(abas[j], true); }
    });
  });
  $$('.painel').forEach(function (p) {
    var fig = $('.painel__fig img', p);
    $$('.minis button', p).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        $$('.minis button', p).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var nova = new Image();
        nova.srcset = b.dataset.srcset; nova.sizes = fig.sizes; nova.src = b.dataset.src;
        fig.classList.add('trocando');
        var troca = function () {
          fig.srcset = b.dataset.srcset; fig.src = b.dataset.src; fig.alt = b.dataset.alt;
          requestAnimationFrame(function () { fig.classList.remove('trocando'); });
        };
        (nova.decode ? nova.decode() : Promise.resolve()).then(function () { setTimeout(troca, 180); }, troca);
      });
    });
  });
  // no computador, com a seção chegando perto, as fotos principais das outras pedras já baixam
  var sel = $('.sel');
  if (sel && 'IntersectionObserver' in window) {
    var ioSel = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      ioSel.disconnect();
      if (celular.matches || (navigator.connection && navigator.connection.saveData)) return;
      (window.requestIdleCallback || setTimeout)(function () {
        $$('.painel[hidden] .painel__fig img[data-src]').forEach(function (img) {
          img.srcset = img.dataset.srcset; img.src = img.dataset.src;
          img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
        });
      });
    }, { rootMargin: '400px 0px' });
    ioSel.observe(sel);
  }

  /* ---------- vídeo do passo 1: só baixa e roda quando aparece ---------- */
  var video = $('#videoPasso');
  if (video) {
    if (parado) { video.setAttribute('controls', ''); }
    var carregou = false;
    function carrega() {
      if (carregou) return; carregou = true;
      var s = $('source', video); s.src = s.dataset.src; video.load();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { carrega(); if (!parado) { var p = video.play(); if (p) p.catch(function () {}); } }
        else video.pause();
      }, { threshold: .35 }).observe(video);
    } else carrega();
  }

  /* ---------- brasas subindo atrás da churrasqueira ---------- */
  var forno = $('#forno'), cv = $('#brasas');
  if (forno && cv && cv.getContext && !parado) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, ps = [], rodando = false, raf = 0, ult = 0;
    var sprite = document.createElement('canvas'); sprite.width = sprite.height = 32;
    var sc = sprite.getContext('2d'), gr = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(.25, 'rgba(246,160,80,.85)');
    gr.addColorStop(.6, 'rgba(232,116,42,.25)'); gr.addColorStop(1, 'rgba(232,116,42,0)');
    sc.fillStyle = gr; sc.fillRect(0, 0, 32, 32);
    function mede() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = forno.clientWidth; H = forno.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    function nasce(p, inicio) {
      p.x = W * (.3 + Math.random() * .4); p.y = inicio ? H * (.35 + Math.random() * .6) : H * (.78 + Math.random() * .12);
      p.v = 18 + Math.random() * 34; p.r = 2 + Math.random() * 5.5; p.fase = Math.random() * 6.28;
      p.vida = 0; p.dura = 3 + Math.random() * 3.5; p.amp = 6 + Math.random() * 16;
      return p;
    }
    function quadro(t) {
      raf = requestAnimationFrame(quadro);
      if (t - ult < 33) return;   // 30 quadros bastam para brasa
      var dt = Math.min((t - ult) / 1000, .1); ult = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.vida += dt; if (p.vida > p.dura) nasce(p, false);
        p.y -= p.v * dt;
        var x = p.x + Math.sin(p.fase + p.vida * 1.7) * p.amp * (p.vida / p.dura);
        var k = p.vida / p.dura, a = Math.sin(Math.PI * k) * (.55 + .45 * Math.sin(p.fase + t / 140));
        ctx.globalAlpha = Math.max(a, 0) * .9;
        var r = p.r * (1 - k * .5);
        ctx.drawImage(sprite, x - r * 2, p.y - r * 2, r * 4, r * 4);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    function liga() { if (rodando || document.hidden) return; rodando = true; ult = performance.now(); raf = requestAnimationFrame(quadro); }
    function desliga() { rodando = false; cancelAnimationFrame(raf); }
    var iniciou = false;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) {
        if (!iniciou) { iniciou = true; mede(); for (var i = 0; i < (W < 500 ? 26 : 42); i++) ps.push(nasce({}, true)); }
        liga();
      } else desliga();
    }, { rootMargin: '120px 0px' }).observe(forno);
    document.addEventListener('visibilitychange', function () { if (document.hidden) desliga(); });
    var espera = 0;
    addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(function () { if (iniciou) mede(); }, 200); });
  }

  /* ---------- mapa: o iframe do Google só entra perto da seção ---------- */
  var mapa = $('#mapa');
  if (mapa) {
    var poe = function () {
      if (mapa.firstChild) return;
      var f = document.createElement('iframe');
      f.src = mapa.dataset.src; f.title = 'Mapa da Constru Fácil em Itu'; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      mapa.appendChild(f);
    };
    if ('IntersectionObserver' in window) {
      var ioM = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { ioM.disconnect(); poe(); } }, { rootMargin: '500px 0px' });
      ioM.observe(mapa);
    } else poe();
  }

  /* ---------- formulário: monta a mensagem e abre o WhatsApp ----------
     Dado pessoal não vai na URL (entraria no page_location do Analytics):
     segue só pelo sessionStorage até a página de obrigado. */
  var form = $('#form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim(), quer = form.quer.value, cidade = form.cidade.value.trim(), medida = form.medida.value.trim();
      var nota = $('#formNota');
      if (!nome || !quer) {
        nota.textContent = !nome ? 'Escreva o seu nome para a loja saber com quem fala.' : 'Escolha o que você procura.';
        nota.style.color = 'var(--verm)';
        (!nome ? form.nome : form.quer).focus();
        return;
      }
      var linhas = ['Olá! Vim pelo site da Constru Fácil e quero um orçamento.', '', 'Nome: ' + nome, 'Procuro: ' + quer];
      if (cidade) linhas.push('Cidade da obra: ' + cidade);
      if (medida) linhas.push('Medida aproximada: ' + medida);
      guarda({ n: NUM, c: 'formulario', t: linhas.join('\n') });
      location.href = 'obrigado.html?n=' + NUM + '&c=formulario';
    });
  }
})();
