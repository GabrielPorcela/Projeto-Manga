/**
 * ===========================================================
 * CORE STUDIO — SCRIPT.JS
 * JavaScript Vanilla, sem dependências externas.
 *
 * Índice:
 * 1. Helpers
 * 2. Módulo: Menu de navegação responsivo
 * 3. Módulo: Header com fundo ao rolar a página
 * 4. Módulo: Revelação de elementos no scroll (IntersectionObserver)
 * 5. Módulo: Rodapé — ano dinâmico
 * 6. Inicialização
 * ===========================================================
 */

(function () {
  'use strict';

  /* ===========================================================
     1. HELPERS
     =========================================================== */

  /**
   * Atalho para document.querySelector.
   * @param {string} selector
   * @param {Document|Element} scope
   * @returns {Element|null}
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Atalho para document.querySelectorAll, já convertido em Array.
   * @param {string} selector
   * @param {Document|Element} scope
   * @returns {Element[]}
   */
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }


  /* ===========================================================
     2. MÓDULO: MENU DE NAVEGAÇÃO RESPONSIVO
     Controla a abertura/fechamento do menu mobile (hambúrguer)
     e garante que ele feche ao clicar em um link ou ao redimensionar
     a tela para desktop.
     =========================================================== */
  function initMobileNav() {
    var toggleBtn = qs('#navToggle');
    var nav = qs('#primaryNav');

    if (!toggleBtn || !nav) return;

    var navLinks = qsa('.primary-nav__link', nav);

    /**
     * Alterna o estado aberto/fechado do menu mobile.
     * Sincroniza classes visuais e atributos ARIA.
     */
    function toggleMenu() {
      var isOpen = nav.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.setAttribute(
        'aria-label',
        isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );

      // Trava o scroll do body enquanto o menu mobile estiver aberto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    /**
     * Fecha o menu mobile (usado ao clicar em um link ou em resize).
     */
    function closeMenu() {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', toggleMenu);

    // Fecha o menu automaticamente ao navegar para uma seção
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Garante que o menu não fique "aberto" se a tela crescer para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    });
  }


  /* ===========================================================
     3. MÓDULO: HEADER COM FUNDO AO ROLAR A PÁGINA
     Adiciona a classe "is-scrolled" ao header quando o usuário
     desce a página, dando o fundo escuro/blur apenas quando
     necessário (mantendo o hero limpo no topo).
     =========================================================== */
  function initHeaderScrollState() {
    var header = qs('#siteHeader');
    if (!header) return;

    var SCROLL_THRESHOLD = 40; // pixels rolados antes de ativar o fundo
    var ticking = false;

    function updateHeaderState() {
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    }

    // requestAnimationFrame evita disparar a função em todo pixel de scroll
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    });

    updateHeaderState(); // estado inicial (ex: reload com a página já rolada)
  }


  /* ===========================================================
     4. MÓDULO: REVELAÇÃO DE ELEMENTOS NO SCROLL
     Usa IntersectionObserver (nativo do browser, alto desempenho)
     para adicionar a classe "is-visible" aos elementos marcados
     com [data-reveal] conforme entram na viewport.
     =========================================================== */
  function initScrollReveal() {
    var revealElements = qsa('[data-reveal]');
    if (revealElements.length === 0) return;

    // Fallback: sem suporte a IntersectionObserver, apenas revela tudo
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Uma vez revelado, não precisamos mais observar o elemento
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,        // dispara quando 15% do elemento está visível
        rootMargin: '0px 0px -40px 0px' // antecipa levemente a revelação
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ===========================================================
     5. MÓDULO: RODAPÉ — ANO DINÂMICO
     Mantém o copyright sempre atualizado sem precisar editar o HTML.
     =========================================================== */
  function initDynamicYear() {
    var yearEl = qs('#currentYear');
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }


  /* ===========================================================
     6. INICIALIZAÇÃO
     Executa todos os módulos quando o DOM estiver pronto.
     =========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHeaderScrollState();
    initScrollReveal();
    initDynamicYear();
  });

})();
