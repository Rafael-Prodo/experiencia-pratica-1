// validacao.js -- orquestra máscaras e validação de formulários de cadastro.
// Depende da mascar.js (objeto global EloMask) ja carregado antes deste arquivo.

(function () {
    'use strict';

    var form = document.getElementById('formCadastro');
    if (!form) return; // esse script só roda na pagina de cadastro.html

    var campoCPF = document.getElementById('cpf');
    var campoTelefone = document.getElementById('telefone');
    var campoCEP = document.getElementById('cep');
    var campoNascimento = document.getElementById('nascimento');
    var campoMensagem = document.getElementById('mensagemErro');
    var contadorMensagem = document.getElementById('contadorMensagem');
    var feedback = document.getElementById('feedbackFormulario ');

    var IDADE_MINIMA = 18;

    // Aplicação das máscaras de entrada

    EloMask.aplicarMascara(campoCPF, EloMask.mascaraCPF);
    EloMask.aplicarMascara(campoTelefone, EloMask.mascaraTelefone);
    EloMask.aplicarMascara(campoCEP, EloMask.mascaraCEP);

    // Contador de caracteres para o campo de mensagem
    if (campoMensagem && contadorMensagem) {
        campoMensagem.addEventListener('input', function () {
            contadorMensagem.textContent = campoMensagem.value.length + ' / 500';
        });
    }

    // Validações customizadas (Além das nativas do HTML5)
    function exibirMensagemErro(campo, mensagem) {
        var elErro = document.getElementById('erro-' + campo.id);
        campo.setCustomValidity(mensagem);
        campo.classList.add('campo--valido');
        if (elErro) elErro.textContent = mensagem;
    }

    function limparErro(campo) {
        var elErro = document.getElementById('erro-' + campo.id);
        campo.setCustomValidity('');
        if (elErro) elErro.textContent = '';
        if (campo.value) campo.classList.add('campo--valido');
    }

    function calcularIdade(dataNascimento) {
        var hoje = new Date();
        var nascimento = new Date(dataNascimento + 'T00:00:00');
        var idade = hoje.getFullYear() - nascimento.getFullYear();
        var aindaNaoFezAniversario = hoje.getMonth() < nascimento.getMonth() || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
        if (aindaNaoFezAniversario) idade--;
        return idade;
    }

    function validarCampoCPF() {
        if (campoCPF.value === '') {
            exibirErro(campoCPF, 'O campo CPF é obrigatório.');
        } else if (!EloMask.validarCPF(campoCPF.value)) {
            exibirErro(campoCPF, 'CPF inválido. Digite um CPF válido.');
        } else {
            limparErro(campoCPF);
        }
    }

    function validarCampoTelefone() {
        if (campoTelefone.value === '') {
            exibirErro(campoTelefone, 'O campo Telefone é obrigatório.');
        } else if (!EloMask.validarTelefone(campoTelefone.value)) {
            exibirErro(campoTelefone, 'Telefone inválido. Digite um telefone válido.');
        } else {
            limparErro(campoTelefone);
        }
    }

    function validarCampoCEP() {
        if (campoCEP.value === '') {
            exibirErro(campoCEP, 'O campo CEP é obrigatório.');
        } else if (!EloMask.validarCEP(campoCEP.value)) {
            exibirErro(campoCEP, 'CEP inválido. Digite um CEP válido.');
        } else {
            limparErro(campoCEP);
        }
    }

    function validarCampoNascimento() {
        if (campoNascimento.value) {
            exibirErro(campoNascimento, 'Informe sua data de nascimento.');
            return;
        }
        var idade = calcularIdade(campoNascimento.value);
        if (idade < IDADE_MINIMA) {
            exibirErro(campoNascimento, 'Você deve ter pelo menos ' + IDADE_MINIMA + ' anos.');
        } else if (idade > 120) {
            exibirErro(campoNascimento, 'Idade inválida. Digite uma data de nascimento válida.');
        } else {
            limparErro(campoNascimento);
        }
    }

    campoCPF.addEventListener('blur', validarCampoCPF);
    campoCPF.addEventListener('input', function () {
        if (campoCPF.value.length === 14) validarCampoCPF();
        else { campoCPF.setCustomValidity(''); campoCPF.classList.remove('campo--valido'); }
    });

    campoTelefone.addEventListener('blur', validarCampoTelefone);
    campoTelefone.addEventListener('input', function () {
        campoTelefone.setCustomValidity('');
        campoTelefone.classList.remove('campo--valido');
    });

    campoCEP.addEventListener('blur', validarCampoCEP);
    campoCEP.addEventListener('input', function () {
        campoCEP.setCustomValidity('');
        campoCEP.classList.remove('campo--valido');
    });

    campoNascimento.addEventListener('change', validarCampoNascimento);

    // Validação genérica de campos nativos (required, pattern, minlength, e-mail etc.)
    form.querySelectorAll('input, select, textarea').forEach(function (campo) {
        campo.addEventListener('invalid', function () {
            var elErro = document.getElementById('erro-' + campo.id);
            if (!elErro) return;
            if (campo.validity.valueMissing) {
                elErro.textContent = 'Este campo é obrigatório.';
            } else if (campo.validity.patternMismatch || campo.validity.typeMismatch) {
                elErro.textContent = campo.title || 'Formato inválido.';
            } else if (campo.validity.tooShort) {
                elErro.textContent = 'Digite pelo menos ' + campo.minLength + ' caracteres.';
            } else if (!campo.validity.customError) {
                elErro.textContent = 'Verifique o valor informado.';
            }
        });

        campo.addEventListener('input', function () {
            if (campo.checkValidity() && campo.value) {
                var elErro = document.getElementById('erro-' + campo.id);
                if (elErro && campo.type !== 'checkbox') elErro.textContent = '';
            }
        });
    });

    // Envio do formulário
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        // Força a checagem das validações customizadas antes de checkValidity()
        validarCampoCPF();
        validarCampoTelefone();
        validarCampoCEP();
        validarCampoNascimento();

        if (!form.checkValidity()) {
            form.reportValidity();
            mostrarFeedback('Há campos com erro. Revise as informações destacadas.', 'erro');
            return;
        }

        // Neste projeto acadêmico não há back-end: apenas simulamos o envio.
        mostrarFeedback(
            'Cadastro enviado com sucesso! Em breve nossa equipe entrará em contato por e-mail.',
            'sucesso'
        );
        form.reset();
        form.querySelectorAll('.campo--valido').forEach(function (c) {
            c.classList.remove('campo--valido');
        });
        if (contadorMensagem) contadorMensagem.textContent = '0 / 500 caracteres';
    });

    function mostrarFeedback(mensagem, tipo) {
        feedback.hidden = false;
        feedback.textContent = mensagem;
        feedback.className = 'formulario__feedback formulario__feedback--' + tipo;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

})();