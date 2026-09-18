// script.js comportamento compartilhado entre todas as páginas

(function () {
    'use strict';

    // Atualiza o ano no rodapé automaticamente
    var anoAtual = document.getElementById('anoAtual');
    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

    // Menu mobile (hamburguer)
    var botaoMenu = document.getElementById('menuToggle');
    var nav = document.getElementById('navPrincipal');

    if (botaoMenu && nav) {
        botaoMenu.addEventListener('click', function () {
            var aberto = nav.classList.toggle('nav--aberto');
            botaoMenu.setAttribute('aria-expanded', String(aberto));
        });

        // Fecha o menu ao clicar em um link (navegação por ancora/mobile)
        nav.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--aberto');
                botaoMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();