
// =====================================
// NEWTECH - SCRIPT.JS
// =====================================

// Espera a página carregar
document.addEventListener("DOMContentLoaded", function() {

    // =====================================
    // FUNÇÕES PARA SALVAR DADOS
    // =====================================

    function buscarDados(nome) {
        return JSON.parse(localStorage.getItem(nome)) || [];
    }

    function salvarDados(nome, dados) {
        localStorage.setItem(nome, JSON.stringify(dados));
    }

    // =====================================
    // LOGIN
    // =====================================

    let botaoLogin = document.querySelector(".btn-login");

    if (botaoLogin) {

        botaoLogin.addEventListener("click", function(evento) {

            let campos = document.querySelectorAll(".login-box input");

            let usuario = campos[0].value;
            let senha = campos[1].value;

            if (usuario == "" || senha == "") {
                evento.preventDefault();
                alert("Preencha todos os campos!");
            } else {
                localStorage.setItem("newtechUsuario", usuario);
            }

        });
    }

    // Mostrar o nome do usuário

    let nomeUsuario = localStorage.getItem("newtechUsuario");
    let usuario = document.querySelector(".user-info");

    if (nomeUsuario && usuario) {
        usuario.textContent = "Olá, " + nomeUsuario;
    }

    // Mostrar e esconder senha

    let olho = document.querySelector(".password-toggle");

    if (olho) {

        olho.addEventListener("click", function() {

            let senha = document.querySelector('.login-box input[type="password"]');

            if (senha) {
                senha.type = "text";
            } else {
                senha = document.querySelector('.login-box input[type="text"]:nth-of-type(2)');

                if (senha) {
                    senha.type = "password";
                }
            }

        });
    }

    // Esqueci minha senha

    let esqueci = document.querySelector(".forgot");

    if (esqueci) {
        esqueci.addEventListener("click", function(evento) {
            evento.preventDefault();
            alert("Entre em contato com o administrador para recuperar sua senha.");
        });
    }

    // =====================================
    // CADASTRAR EQUIPAMENTOS
    // =====================================

    let tituloCadastro = Array.from(document.querySelectorAll("h2")).find(function(item) {
        return item.textContent.trim() == "Cadastrar Equipamento";
    });

    if (tituloCadastro) {

        let caixa = tituloCadastro.closest(".form-box");

        if (caixa) {

            let campos = caixa.querySelectorAll('input[type="text"]');
            let selecoes = caixa.querySelectorAll("select");
            let descricao = caixa.querySelector("textarea");
            let botao = caixa.querySelector("a.btn");

            if (botao) {

                botao.addEventListener("click", function(evento) {

                    evento.preventDefault();

                    let nome = campos[0].value;
                    let patrimonio = campos[1].value;
                    let local = selecoes[0].value;
                    let categoria = selecoes[1].value;

                    if (nome == "" || patrimonio == "" ||
                        local.includes("Selecione") ||
                        categoria.includes("Selecione")) {

                        alert("Preencha todos os campos!");
                        return;
                    }

                    let equipamentos = buscarDados("newtechEquipamentos");

                    let repetido = false;

                    for (let i = 0; i < equipamentos.length; i++) {
                        if (equipamentos[i].patrimonio == patrimonio) {
                            repetido = true;
                        }
                    }

                    if (repetido) {
                        alert("Esse patrimônio já está cadastrado!");
                        return;
                    }

                    let equipamento = {
                        nome: nome,
                        patrimonio: patrimonio,
                        local: local,
                        categoria: categoria,
                        descricao: descricao ? descricao.value : "",
                        status: "Operacional"
                    };

                    equipamentos.push(equipamento);

                    salvarDados("newtechEquipamentos", equipamentos);

                    alert("Equipamento cadastrado com sucesso!");

                    window.location.href = "equipamentos.html";

                });
            }
        }
    }

    // =====================================
    // LISTA DE EQUIPAMENTOS
    // =====================================

    let tabela = document.querySelector(".container table");
    let pesquisaEquipamento = document.querySelector(".input-busca");

    if (tabela && pesquisaEquipamento) {

        let equipamentos = buscarDados("newtechEquipamentos");

        for (let i = 0; i < equipamentos.length; i++) {

            let linha = tabela.insertRow();

            linha.insertCell().textContent = equipamentos[i].patrimonio;
            linha.insertCell().textContent = equipamentos[i].nome;
            linha.insertCell().textContent = equipamentos[i].local;
            linha.insertCell().textContent = equipamentos[i].status;

        }

        // Pesquisar equipamentos

        pesquisaEquipamento.addEventListener("input", function() {

            let texto = pesquisaEquipamento.value.toLowerCase();
            let linhas = tabela.querySelectorAll("tr");

            for (let i = 1; i < linhas.length; i++) {

                let conteudo = linhas[i].textContent.toLowerCase();

                if (conteudo.includes(texto)) {
                    linhas[i].style.display = "";
                } else {
                    linhas[i].style.display = "none";
                }

            }

        });
    }

    // =====================================
    // PÁGINA DE BUSCA
    // =====================================

    let caixaBusca = document.querySelector(".container-center .form-box");

    if (caixaBusca) {

        let campoBusca = caixaBusca.querySelector("input");
        let botaoBusca = caixaBusca.querySelector("a.btn");

        function pesquisar() {

            let texto = campoBusca.value.toLowerCase();

            if (texto == "") {
                alert("Digite algo para pesquisar!");
                return;
            }

            let resultados = [];

            // Equipamentos já existentes

            let equipamentos = [
                "Impressora 3D",
                "Torno CNC 02",
                "Computador LAB 01",
                "Computador LAB 02",
                "Furadeira de Bancada 01",
                "Compressor de Ar 01",
                "Torno Mecânico 01",
                "Máquina de Solda"
            ];

            // Equipamentos cadastrados pelo usuário

            let cadastrados = buscarDados("newtechEquipamentos");

            for (let i = 0; i < cadastrados.length; i++) {
                equipamentos.push(cadastrados[i].nome);
            }

            // Procurar equipamentos

            for (let i = 0; i < equipamentos.length; i++) {

                if (equipamentos[i].toLowerCase().includes(texto)) {
                    resultados.push(equipamentos[i]);
                }

            }

            // Ordens de serviço

            let ordens = [
                "OS-00048 Impressora 3D",
                "OS-00047 Torno CNC 02",
                "OS-00046 Computador LAB 01",
                "OS-00045 Computador LAB 02",
                "OS-00044 Furadeira de Bancada 01",
                "OS-00043 Compressor de Ar 01",
                "OS-00042 Torno Mecânico 01"
            ];

            for (let i = 0; i < ordens.length; i++) {

                if (ordens[i].toLowerCase().includes(texto)) {
                    resultados.push(ordens[i]);
                }

            }

            // Mostrar resultados

            let area = document.querySelector(".resultados-busca");

            if (!area) {
                area = document.createElement("div");
                area.className = "resultados-busca";
                caixaBusca.parentNode.appendChild(area);
            }

            area.innerHTML = "<h3>Resultados da busca</h3>";

            if (resultados.length == 0) {
                area.innerHTML += "<p>Nenhum resultado encontrado.</p>";
            } else {

                for (let i = 0; i < resultados.length; i++) {

                    let item = document.createElement("p");
                    item.textContent = resultados[i];

                    area.appendChild(item);

                }

            }

        }

        if (botaoBusca) {
            botaoBusca.addEventListener("click", function(evento) {
                evento.preventDefault();
                pesquisar();
            });
        }

        campoBusca.addEventListener("keydown", function(evento) {
            if (evento.key == "Enter") {
                evento.preventDefault();
                pesquisar();
            }
        });

    }

    // =====================================
    // AGENDAR MANUTENÇÃO
    // =====================================

    let tituloAgendamento = Array.from(document.querySelectorAll("h2")).find(function(item) {
        return item.textContent.trim() == "Agendar Manutenção";
    });

    if (tituloAgendamento) {

        let caixa = tituloAgendamento.closest(".form-box");

        if (caixa) {

            let selecoes = caixa.querySelectorAll("select");
            let data = caixa.querySelector('input[type="date"]');
            let horario = caixa.querySelector('input[type="time"]');
            let duracao = caixa.querySelector('input[type="text"]');
            let botao = caixa.querySelector(".btn-full");

            // Não permitir datas anteriores a hoje

            if (data) {

                let hoje = new Date().toISOString().split("T")[0];
                data.min = hoje;

            }

            if (botao) {

                botao.addEventListener("click", function(evento) {

                    evento.preventDefault();

                    let tecnico = selecoes[0].value;
                    let equipamento = selecoes[1].value;

                    if (tecnico.includes("Selecione") ||
                        equipamento.includes("Selecione") ||
                        data.value == "" ||
                        horario.value == "" ||
                        duracao.value == "") {

                        alert("Preencha todos os campos!");
                        return;
                    }

                    let agendamentos = buscarDados("newtechAgendamentos");

                    let agendamento = {
                        tecnico: tecnico,
                        equipamento: equipamento,
                        data: data.value,
                        horario: horario.value,
                        duracao: duracao.value
                    };

                    agendamentos.push(agendamento);

                    salvarDados("newtechAgendamentos", agendamentos);

                    // Criar notificação

                    let notificacoes = buscarDados("newtechNotificacoes");

                    notificacoes.push(
                        "Manutenção agendada para " + equipamento +
                        " em " + data.value.split("-").reverse().join("/") +
                        " às " + horario.value + "."
                    );

                    salvarDados("newtechNotificacoes", notificacoes);

                    alert("Agendamento realizado com sucesso!");

                    window.location.href = "notificacoes.html";

                });
            }
        }
    }

    // =====================================
    // NOTIFICAÇÕES
    // =====================================

    let tituloNotificacoes = Array.from(document.querySelectorAll("h2")).find(function(item) {
        return item.textContent.trim() == "Notificações";
    });

    if (tituloNotificacoes) {

        let container = tituloNotificacoes.closest(".container");
        let notificacoes = buscarDados("newtechNotificacoes");

        for (let i = 0; i < notificacoes.length; i++) {

            let aviso = document.createElement("div");
            let texto = document.createElement("p");

            texto.textContent = notificacoes[i];

            aviso.appendChild(texto);
            aviso.style.backgroundColor = "white";
            aviso.style.padding = "15px";
            aviso.style.marginTop = "10px";
            aviso.style.borderRadius = "8px";

            container.appendChild(aviso);

        }
    }

    // =====================================
    // PAINEL GERAL
    // =====================================

    let tituloPainel = Array.from(document.querySelectorAll("h2")).find(function(item) {
        return item.textContent.trim() == "Painel Geral";
    });

    if (tituloPainel) {

        let cards = document.querySelectorAll(".grid-cards .card h3");
        let equipamentos = buscarDados("newtechEquipamentos");

        if (cards.length > 0) {

            let quantidade = Number(cards[0].textContent);

            cards[0].textContent = quantidade + equipamentos.length;

        }
    }

});
