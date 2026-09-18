// mascara.js -- máscara de entrada e validação de formato reutilizáveis
// Expõe o objeto global EloMask para ser usado por qualquer página do site.

var EloMask = (function () {
    'use strict';

    // Remove tudo que não for digito
    function apenasDigitos(valor) {
        return (valor || '').replace(/\D/g, '');
    }

    // Aplica máscara de CPF (000.000.000-00) e formata progressivamente enquanto o usuário digita.
    function mascaraCPF(valor) {
        var digitos = apenasDigitos(valor).slice(0, 11); // Limita a 11 dígitos

        digitos = digitos.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
        digitos = digitos.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
        digitos = digitos.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço

        return digitos;
    }

    // Aplica máscara de telefone brasileiro (00 00000-0000) e detecta automaticamente se é celular ou fixo.
    function mascaraTelefone(valor) {
        var digitos = apenasDigitos(valor).slice(0, 11); // Limita a 11 dígitos

        if (digitos.length === 0) return '';

        // Adiciona o DDD
        digitos = digitos.replace(/(\d{2})(\d)/, '($1) $2');

        if (digitos.length > 10) {
            // Celular: (00) 00000-0000
            digitos = digitos.replace(/(\d{5})(\d)/, '$1-$2');
        } else {
            // Fixo: (00) 0000-0000
            digitos = digitos.replace(/(\d{4})(\d)/, '$1-$2');
        }

        return digitos;
    }

    // Aplicar máscara de CEP (00000-000)
    function mascaraCEP(valor) {
        var digitos = apenasDigitos(valor).slice(0, 8); // Limita a 8 dígitos

        digitos = digitos.replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o traço

        return digitos;
    }

    // Valida um CPF utilizando o algoritmo oficial de digitos verificadores
    function validarCPF(valorComOuSemMascara) {
        var cpf = apenasDigitos(valorComOuSemMascara);

        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false; // Todos os dígitos iguais

        var calcularDigito = function (base, pesoInicial) {
            var soma = 0;
            for (var i = 0; i < base.length; i++) {
                soma += parseInt(base.charAt(i), 10) * (pesoInicial - i);
            }
            var resto = (soma * 10) % 11;
            return resto === 10 ? 0 : resto;
        };

        var primeiroDigito = calcularDigito(cpf.substring(0, 9), 10);
        if (primeiroDigito !== parseInt(cpf.charAt(9), 10)) return false;

        var segundoDigito = calcularDigito(cpf.substring(0, 10), 11);
        if (segundoDigito !== parseInt(cpf.charAt(10), 10)) return false;

        return true;
    }

    // Valida se o CEP tem 8 dígitos numéricos
    function validarCEP(valorComOuSemMascara) {
        var cep = apenasDigitos(valorComOuSemMascara);
        return cep.length === 8;
    }

    // Valida se o telefone tem 10 ou 11 dígitos numéricos
    function validarTelefone(valorComOuSemMascara) {
        var telefone = apenasDigitos(valorComOuSemMascara);
        return telefone.length === 10 || telefone.length === 11;
    }

    // Liga um input a uma função de máscara, preservando o cursor na posição correta
    function aplicarMascaraInput(inputElement, funcaoMascara) {
        if (!input) return;
        input.addEventListener('input', function () {
            var posicaoOriginal = input.selectionStart;
            var tamanhoAntes = input.value.length;

            input.value = funcaoMascara(input.value);

            var diferenca = input.value.length - tamanhoAntes;
            var novaPosicao = Math.max(0, (posicaoOriginal || 0) + diferenca);
            input.setSelectionRange(novaPosicao, novaPosicao);
        });
    }

    return {
        apenasDigitos: apenasDigitos,
        mascaraCPF: mascaraCPF,
        mascaraTelefone: mascaraTelefone,
        mascaraCEP: mascaraCEP,
        validarCPF: validarCPF,
        validarCEP: validarCEP,
        validarTelefone: validarTelefone,
        aplicarMascaraInput: aplicarMascaraInput
    };
})();