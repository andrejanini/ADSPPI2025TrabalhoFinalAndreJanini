import Livro from "../models/livro.js";

export default class LivroController {
    gravar(requisicao, resposta) {
        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const dados = requisicao.body;

            if (dados.titulo && dados.autor && dados.cpfCliente) {
                const livro = new Livro("", dados.titulo, dados.autor, dados.cpfCliente);

                livro.gravar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Livro gravado com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao gravar o livro: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do livro (Título, Autor e CPF do cliente)."
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
            
            // http://localhost:3000/livro/1
            const id = requisicao.params.id; // ID do livro deve ser informado na URL
            
            if (id && dados.titulo && dados.autor && dados.cpfCliente) {
                const livro = new Livro(id, dados.titulo, dados.autor, dados.cpfCliente);
                livro.alterar()
                    .then(() => {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Livro atualizado com sucesso!"
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500).json({
                            status: false,
                            mensagem: "Erro ao atualizar o livro: " + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe todos os dados do livro (Título, Autor e CPF do cliente). O livro a ser alterado deve ser informado na URL."
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
            const id = requisicao.params.id;
           
            if (id) {
                const livro = new Livro();
                livro.consultarID(id)
                .then((listaLivros) => {
                    const livro = listaLivros[0];

                    if (livro) {
                        livro.excluir()
                        .then(() => {
                            resposta.status(200).json({
                                status: true,
                                mensagem: "Livro excluído com sucesso!"
                            });
                        })
                        .catch((erro) => {
                            resposta.status(500).json({
                                status: false,
                                mensagem: "Erro ao excluir o livro: " + erro.message
                            });
                        })
                    }
                    else {
                        resposta.status(404).json({
                            status: false,
                            mensagem: "Livro não encontrado."
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o livro para exclusão: " + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "Informe o ID do livro."
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
            // A consulta pode ou não especificar um ID.
            // Quando um ID não for especificado, então a consulta retornará todos os livros.
            const id = requisicao.params.id;
            const livro = new Livro();

            if (id) {
                livro.consultarID(id)
                .then((listaLivros) => {

                    if (listaLivros.length > 0) {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Consulta realizada com sucesso!",
                            livros: listaLivros
                        });
                    }
                    else {
                        resposta.status(404).json({
                            status: false,
                            mensagem: "Livro não encontrado."
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar o livro: " + erro.message
                    });
                })
            }
            else {
                livro.consultar()
                .then((listaLivros) => {
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Consulta realizada com sucesso!",
                        livros: listaLivros
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar os livros: " + erro.message
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

    consultarPorCliente(requisicao, resposta) {
        if (requisicao.method === 'GET') {
            const cpf = requisicao.params.cpf;
            const livro = new Livro();

            livro.consultarPorCliente(cpf)
                .then((listaLivros) => {
                    if (listaLivros.length > 0) {
                        resposta.status(200).json({
                            status: true,
                            mensagem: "Consulta realizada com sucesso!",
                            livros: listaLivros
                        });
                    } else {
                        resposta.status(404).json({
                            status: false,
                            mensagem: "Nenhum livro encontrado para este cliente."
                        });
                    }
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao consultar os livros do cliente: " + erro.message
                    });
                });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Requisição inválida."
            });
        }
    }
}