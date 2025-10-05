console.log("Script clientes.js carregado com sucesso!");

const formulario = document.getElementById("form-clientes");
const inputCPFCliente = document.getElementById("cpf");
const inputNome = document.getElementById("nome");
const inputTelefone = document.getElementById("telefone");
const inputEmail = document.getElementById("email");
const btnAtualizar = document.getElementById("btn-atualizar");
const btnExcluir = document.getElementById("btn-excluir");

formulario.onsubmit = gravarCliente;

btnAtualizar.addEventListener("click", atualizarCliente);

btnExcluir.addEventListener("click", () => {
    const cpf = inputCPFCliente.value;
    if (!cpf) {
        mostrarAlerta("Nenhum cliente selecionado para exclusão.", "warning");
        return;
    }
    excluirCliente(cpf);
});

inputCPFCliente.addEventListener("input", aplicarMascaraCPF);
inputTelefone.addEventListener("input", aplicarMascaraTelefone);

exibirTabelaClientes();

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/[^\d]/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

function aplicarMascaraCPF(e) {
    let valor = e.target.value.replace(/[^\d]/g, '');

    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = valor;
}

function aplicarMascaraTelefone(e) {
    let valor = e.target.value.replace(/[^\d]/g, '');
    
    if (valor.length <= 11) {
        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }
    }
    
    e.target.value = valor;
}

function mostrarAlerta(mensagem, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <strong>${tipo === 'success' ? '✓' : tipo === 'danger' ? '✗' : 'ℹ'}</strong> ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function validarFormulario() {
    let valido = true;
    let mensagensErro = [];

    const cpf = inputCPFCliente.value;
    if (!cpf || !validarCPF(cpf)) {
        inputCPFCliente.classList.add('is-invalid');
        mensagensErro.push('CPF inválido');
        valido = false;
    } else {
        inputCPFCliente.classList.remove('is-invalid');
        inputCPFCliente.classList.add('is-valid');
    }
        
    const nome = inputNome.value.trim();
    if (!nome || nome.length < 3) {
        inputNome.classList.add('is-invalid');
        mensagensErro.push('Nome deve ter no mínimo 3 caracteres');
        valido = false;
    } else {
        inputNome.classList.remove('is-invalid');
        inputNome.classList.add('is-valid');
    }
        
    const telefone = inputTelefone.value;
    if (!telefone || !validarTelefone(telefone)) {
        inputTelefone.classList.add('is-invalid');
        mensagensErro.push('Telefone inválido');
        valido = false;
    } else {
        inputTelefone.classList.remove('is-invalid');
        inputTelefone.classList.add('is-valid');
    }
        
    const email = inputEmail.value.trim();
    if (!email || !validarEmail(email)) {
        inputEmail.classList.add('is-invalid');
        mensagensErro.push('E-mail inválido');
        valido = false;
    } else {
        inputEmail.classList.remove('is-invalid');
        inputEmail.classList.add('is-valid');
    }
    
    if (!valido) {
        mostrarAlerta('Por favor, corrija os seguintes erros: ' + mensagensErro.join(', '), 'warning');
    }
    
    return valido;
}

function gravarCliente(evento) {
    evento.stopPropagation();
    evento.preventDefault();

    if(validarFormulario()) {
        const cpf = inputCPFCliente.value;
        const nome = inputNome.value.trim();
        const telefone = inputTelefone.value;
        const email = inputEmail.value.trim();

        fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "cpf": cpf,
                "nome": nome,
                "telefone": telefone,
                "email": email,                
            })
        })
        .then(resposta => resposta.json())
        .then((dados) => {
            alert(dados.mensagem);
            if (dados.status) {
                mostrarAlerta(dados.mensagem, 'success');
                prepararTela();
                exibirTabelaClientes();
            } else {
                mostrarAlerta(dados.mensagem, 'danger');
            }
        })
        .catch((erro) => {
            mostrarAlerta("Não foi possível gravar o cliente:" + erro.message, 'danger');
        });
    }
}

function atualizarCliente() {
    if (validarFormulario()) {
        const cpf = inputCPFCliente.value;
        const nome = inputNome.value.trim();
        const telefone = inputTelefone.value;
        const email = inputEmail.value.trim();

        fetch("http://localhost:3000/clientes/" + cpf, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"                
            },
            body: JSON.stringify({
                "cpf": cpf,
                "nome": nome,
                "telefone": telefone,
                "email": email
            })
        })
        .then(resposta => resposta.json())
        .then(dados => {            
            if (dados.status) {
                mostrarAlerta(dados.mensagem, 'success');
                prepararTela();
                exibirTabelaClientes();
            } else {
                mostrarAlerta(dados.mensagem, 'danger');
            }
        })
        .catch(erro => {
            mostrarAlerta("Erro ao atualizar o cliente: " + erro.message, 'danger');
        });
    }
}

function excluirCliente(cpf) {
    if (confirm("Deseja realmente excluir esse cliente (" + cpf + ")?")) {
        fetch("http://localhost:3000/clientes/" + cpf, { method: "DELETE" })
        .then(resposta => resposta.json())
        .then(dados => {            
            if (dados.status) {
                mostrarAlerta(dados.mensagem, 'success');
                prepararTela();
                exibirTabelaClientes();
            } else {
                mostrarAlerta(dados.mensagem, 'danger');
            }
        })
        .catch(erro => {
            mostrarAlerta("Não foi possível excluir o cliente: " + erro.message, 'danger');
        });        
    }
}

function exibirTabelaClientes() {
    const espacoTabela = document.getElementById('tabela');
    espacoTabela.innerHTML="";

    fetch("http://localhost:3000/clientes", { method: "GET" })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.status) {
            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover';

            const cabecalho = document.createElement('thead');
            cabecalho.className = 'table-dark';
            cabecalho.innerHTML = `
                <tr>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </tr>
            `;
            tabela.appendChild(cabecalho);

            const corpoTabela = document.createElement('tbody');

            if (dados.clientes.length === 0) {
                corpoTabela.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum cliente cadastrado.</td></tr>';
            } else {
                for (const cliente of dados.clientes) {
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
                        <td>${cliente.cpf}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.email}</td>                    
                        <td>
                            <button type="button" class="btn btn-danger"
                            onclick="prepararTela('${cliente.cpf}', '${cliente.nome}', '${cliente.telefone}', '${cliente.email}', 'exclusao')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-warning" onclick="prepararTela('${cliente.cpf}', '${cliente.nome}', '${cliente.telefone}', '${cliente.email}', 'atualizacao')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                        </td>
                    `;
                    corpoTabela.appendChild(linha);
                }   
            }

            tabela.appendChild(corpoTabela);
            espacoTabela.appendChild(tabela);            
        }
    })
    .catch(erro => mostrarAlerta("Erro ao exibir clientes: " + erro.message, 'danger'));
}

function prepararTela(cpf="", nome="", telefone="", email="", acao="") {
    let botaoCadastrar = document.getElementById("btn-cadastrar-cliente");
    // let botaoAtualizar = document.getElementById("btn-atualizar");
    // let botaoExcluir = document.getElementById("btn-excluir");

    inputCPFCliente.value = cpf;
    inputNome.value = nome;
    inputTelefone.value = telefone;
    inputEmail.value = email;

    inputCPFCliente.classList.remove('is-valid', 'is-invalid');
    inputNome.classList.remove('is-valid', 'is-invalid');
    inputTelefone.classList.remove('is-valid', 'is-invalid');
    inputEmail.classList.remove('is-valid', 'is-invalid');

    if (acao === "exclusao") {
        botaoCadastrar.disabled = true;
        btnAtualizar.disabled = true;
        btnExcluir.disabled = false;
        inputCPFCliente.readOnly = true;
        inputNome.readOnly = true;
        inputTelefone.readOnly = true;
        inputEmail.readOnly = true;
    }
    else if (acao === "atualizacao") {
        botaoCadastrar.disabled = true;
        btnAtualizar.disabled = false;
        btnExcluir.disabled = true;
        inputCPFCliente.readOnly = true;
        inputNome.readOnly = false;
        inputTelefone.readOnly = false;
        inputEmail.readOnly = false;
    }
    else {
        botaoCadastrar.disabled = false;
        btnAtualizar.disabled = true;
        btnExcluir.disabled = true;
        inputCPFCliente.readOnly = false;
        inputNome.readOnly = false;
        inputTelefone.readOnly = false;
        inputEmail.readOnly = false;
        limparFormulario();
    }
}

function limparFormulario() {
    inputCPFCliente.value = "";
    inputNome.value = "";
    inputTelefone.value = "";
    inputEmail.value = "";
    inputCPFCliente.classList.remove('is-valid', 'is-invalid');
    inputNome.classList.remove('is-valid', 'is-invalid');
    inputTelefone.classList.remove('is-valid', 'is-invalid');
    inputEmail.classList.remove('is-valid', 'is-invalid');
}

function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}