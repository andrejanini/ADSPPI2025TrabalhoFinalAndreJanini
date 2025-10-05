import Cliente from "../models/cliente.js";
import Livro from "../models/livro.js";

export default class ClienteController {    
    gravar(requisicao, resposta) {
        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const dados = requisicao.body;

            if (dados.cpf && dados.nome && dados.telefone && dados.email) {
                const cliente = new Cliente(dados.cpf, dados.nome, dados.telefone, dados.email);
                
                cliente.gravar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Cliente gravado com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao gravar o cliente: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do cliente (CPF, nome, telefone e e-mail)."
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }
    
    alterar(requisicao, resposta) {
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is("application/json")) {            
            const dados = requisicao.body;
            const cpf = requisicao.params.cpf;
            
            if (dados.cpf && dados.nome && dados.telefone && dados.email) {
                const cliente = new Cliente(dados.cpf, dados.nome, dados.telefone, dados.email);
                cliente.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Cliente atualizado com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao atualizar o cliente: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do cliente (CPF, nome, telefone e email). O cliente a ser alterado deve ser informado na URL."
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }
    
    excluir(requisicao, resposta) {
        if (requisicao.method === 'DELETE') {
            const cpf = requisicao.params.cpf;
           
            if (cpf) {
                const cliente = new Cliente();
                cliente.consultarCPF(cpf)
                .then((listaClientes) => {
                    const cliente = listaClientes[0];

                    if (cliente) {
                        cliente.excluir()
                        .then(() => {
                            resposta.status(200).json({
                                status: true,
                                mensagem: "Cliente excluído com sucesso!"
                            });
                        })
                        .catch((erro) => {
                            resposta.status(500).json({
                                status: false,
                                mensagem: "Erro ao excluir o cliente: " + erro.message
                            });
                        })
                    }
                    else {
                        resposta.status(404).json({
                            status: false,
                            mensagem: "Cliente não encontrado."
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o cliente para exclusão: " + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o CPF do cliente."
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }
    
    consultar(requisicao, resposta) {
        if (requisicao.method === 'GET') {
            const cpf = requisicao.params.cpf;
            const cliente = new Cliente();

            if (cpf) {
                cliente.consultarCPF(cpf)
                .then((listaClientes) => {
                    if (listaClientes.length > 0) {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Consulta realizada com sucesso!",
                            clientes: listaClientes
                        });
                    }
                    else {
                        resposta.status(404).json({
                            status: false,
                            mensagem: "Cliente não encontrado."
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o cliente: " + erro.message
                    });
                })
            }
            else {
                cliente.consultar()
                .then((listaClientes) => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Consulta realizada com sucesso!",
                        clientes: listaClientes
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar os clientes: " + erro.message
                    });
                })
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }

    consultarLivros(requisicao, resposta) {
        if (requisicao.method === 'GET') {
            const cpf = requisicao.params.cpf;

            if (cpf) {
                const livro = new Livro();
                livro.consultarPorCliente(cpf)
                .then((listaLivros) => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Consulta realizada com sucesso!",
                        livros: listaLivros,
                        total: listaLivros.length
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar livros do cliente: " + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o CPF do cliente."
                });
            }
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }
}