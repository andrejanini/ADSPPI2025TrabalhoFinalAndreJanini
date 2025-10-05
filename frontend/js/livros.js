const formulario = document.getElementById("form-livros");
const inputIDLivro = document.getElementById("id");
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const selectCPFCliente = document.getElementById("cpf-cliente");
const btnAtualizar = document.getElementById("btn-atualizar");
const btnExcluir = document.getElementById("btn-excluir");
const btnLimpar = document.getElementById("btn-limpar");
const loading = document.getElementById("loading");
const btnFilstrar = document.getElementById("btn-filtrar");

formulario.onsubmit = gravarLivro;
btnAtualizar.addEventListener("click", atualizarLivro);
btnLimpar.addEventListener("click", () => prepararTela());

btnFilstrar.addEventListener("click", () => {
    const cpfCliente = selectCPFCliente.value;
    consultarLivrosPorCliente(cpfCliente);
});

btnExcluir.addEventListener("click", () => {
    const id = inputIDLivro.value;
    if (!id) {
        mostrarAlerta("Nenhum livro selecionado para exclusão.", "warning");
        return;
    }
    excluirLivro(id);
});

carregarClientes();
exibirTabelaLivros();

function mostrarLoading(show = true) {
    if (loading) {
        loading.classList.toggle('show', show);
    }
}

function mostrarAlerta(mensagem, tipo = 'info') {
    const icone = tipo === 'success' ? '✓' : tipo === 'danger' ? '✗' : 'ℹ';
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <strong>${icone}</strong> ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 6000);
}

function validarFormulario() {
    const formValidado = formulario.checkValidity();
    
    if (!formValidado) {
        formulario.classList.add("was-validated");
        mostrarAlerta("Por favor, preencha todos os campos obrigatórios corretamente.", "warning");
    } else {
        formulario.classList.remove("was-validated");
    }

    return formValidado;
}

function carregarClientes() {
    fetch("http://localhost:3000/clientes")
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.status && dados.clientes) {
            selectCPFCliente.innerHTML = '<option value="">Selecione um cliente...</option>';

            dados.clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.cpf;
                option.textContent = `${cliente.nome} - ${cliente.cpf}`;
                selectCPFCliente.appendChild(option);
            });
        }
    })
    .catch(erro => {
        console.error("Erro ao carregar clientes:", erro);
        mostrarAlerta("Erro ao carregar lista de clientes.", "danger");
    });
}

function gravarLivro(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    
    if(validarFormulario()) {
        const titulo = inputTitulo.value.trim();
        const autor = inputAutor.value.trim();
        const cpfCliente = selectCPFCliente.value;

        mostrarLoading(true);

        fetch("http://localhost:3000/livros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo,
                autor: autor,
                cpfCliente: cpfCliente
            })
        })
        .then(resposta => resposta.json())
        .then(dados => {
            mostrarLoading(false);
            
            if (dados.status) {
                mostrarAlerta(dados.mensagem, "success");
                prepararTela();
                exibirTabelaLivros();
            } else {
                mostrarAlerta(dados.mensagem, "danger");
            }
        })
        .catch(erro => {
            mostrarLoading(false);
            mostrarAlerta("Erro ao gravar livro: " + erro.message, "danger");
        });
    }
}

function atualizarLivro() {
    if (validarFormulario()) {
        const id = inputIDLivro.value;
        const titulo = inputTitulo.value.trim();
        const autor = inputAutor.value.trim();
        const cpfCliente = selectCPFCliente.value;

        mostrarLoading(true);

        fetch(`http://localhost:3000/livros/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, autor, cpfCliente })
        })
        .then(resposta => resposta.json())
        .then(dados => {
            mostrarLoading(false);
            
            if (dados.status) {
                mostrarAlerta(dados.mensagem, "success");
                prepararTela();
                exibirTabelaLivros();
            } else {
                mostrarAlerta(dados.mensagem, "danger");
            }
        })
        .catch(erro => {
            mostrarLoading(false);
            mostrarAlerta("Erro ao atualizar livro: " + erro.message, "danger");
        });
    }
}

function excluirLivro(id) {
    if (confirm(`Deseja realmente excluir este livro (ID ${id})?`)) {
        mostrarLoading(true);

        fetch(`http://localhost:3000/livros/${id}`, { method: "DELETE" })
        .then(resposta => resposta.json())
        .then(dados => {
            mostrarLoading(false);
            
            if (dados.status) {
                mostrarAlerta(dados.mensagem, "success");
                prepararTela();
                exibirTabelaLivros();
            } else {
                mostrarAlerta(dados.mensagem, "danger");
            }
        })
        .catch(erro => {
            mostrarLoading(false);
            mostrarAlerta("Erro ao excluir livro: " + erro.message, "danger");
        });
    }
}

function exibirTabelaLivros() {
    const espacoTabela = document.getElementById('tabela');
    espacoTabela.innerHTML = "";

    mostrarLoading(true);

    fetch("http://localhost:3000/livros")
    .then(resposta => resposta.json())
    .then(dados => {
        mostrarLoading(false);

        if (dados.status && dados.livros) {
            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover';

            tabela.innerHTML = `
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Cliente Interessado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${dados.livros.length > 0 ? dados.livros.map(livro => `
                        <tr>
                            <td>${livro.id}</td>
                            <td>${livro.titulo}</td>
                            <td>${livro.autor}</td>
                            <td>
                                <strong>${livro.nomeCliente || 'Cliente não encontrado'}</strong><br>
                                <small class="text-muted">CPF: ${livro.cpfCliente}</small>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="prepararTela('${livro.id}','${escapeHtml(livro.titulo)}','${escapeHtml(livro.autor)}','${livro.cpfCliente}','atualizacao')" title="Editar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                    </svg>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="prepararTela('${livro.id}','${escapeHtml(livro.titulo)}','${escapeHtml(livro.autor)}','${livro.cpfCliente}','exclusao')" title="Excluir">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="5" class="text-center">Nenhum livro cadastrado.</td></tr>'}
                </tbody>
            `;
            espacoTabela.appendChild(tabela);
        }
    })
    .catch(erro => {
        mostrarLoading(false);
        console.error("Erro ao exibir livros:", erro);
        mostrarAlerta("Erro ao exibir livros: " + erro.message, "danger");
    });
}

async function consultarLivrosPorCliente(cpfCliente) {
    if (!cpfCliente) return mostrarAlerta("Selecione um cliente", "warning");

    mostrarLoading(true);

    try {
        const resposta = await fetch(`/livros/cliente/${cpfCliente}`);
        const dados = await resposta.json();

        if (resposta.ok && dados.livros) {
            exibirLivrosPorCliente(dados.livros);
        } else {
            mostrarAlerta(dados.mensagem || "Nenhum livro encontrado.", "info");
            document.getElementById("tabela-cliente").innerHTML = "";
        }
    } catch (erro) {
        mostrarAlerta("Erro ao consultar os livros: " + erro.message, "danger");
    } finally {
        mostrarLoading(false);
    }
}

function exibirLivrosPorCliente(livros) {
    const tabelaCliente = document.getElementById("tabela-cliente");
    if (!livros || livros.length === 0) {
        tabelaCliente.innerHTML = "<p>Nenhum livro encontrado para este cliente.</p>";
        return;
    }

    let html = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>CPF Cliente</th>
                    <th>Nome Cliente</th>
                </tr>
            </thead>
            <tbody>
    `;

    livros.forEach(livro => {
        html += `
            <tr>
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${livro.cpfCliente}</td>
                <td>${livro.nomeCliente || ""}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    tabelaCliente.innerHTML = html;
}

function prepararTela(id="", titulo="", autor="", cpfCliente="", acao="") {
    document.getElementById("id").value = id;
    inputTitulo.value = titulo;
    inputAutor.value = autor;
    selectCPFCliente.value = cpfCliente;

    let botaoCadastrar = document.getElementById("btn-cadastrar-livro");

    if (acao === "exclusao") {
        botaoCadastrar.disabled = true;
        btnAtualizar.disabled = true;
        btnExcluir.disabled = false;
        inputTitulo.readOnly = true;
        inputAutor.readOnly = true;
        selectCPFCliente.disabled = true;
    } else if (acao === "atualizacao") {
        botaoCadastrar.disabled = true;
        btnAtualizar.disabled = false;
        btnExcluir.disabled = true;
        inputTitulo.readOnly = false;
        inputAutor.readOnly = false;
        selectCPFCliente.disabled = false;
    } else {
        botaoCadastrar.disabled = false;
        btnAtualizar.disabled = true;
        btnExcluir.disabled = true;
        inputTitulo.readOnly = false;
        inputAutor.readOnly = false;
        selectCPFCliente.disabled = false;
        limparFormulario();
    }

    formulario.classList.remove("was-validated");
}

function limparFormulario() {
    document.getElementById("id").value = "";
    inputTitulo.value = "";
    inputAutor.value = "";
    selectCPFCliente.value = "";
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}