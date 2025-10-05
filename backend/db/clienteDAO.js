import Cliente from "../models/cliente.js";
import conectar from "./conexao.js";

export default class ClienteDAO {
    
    async gravar(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "INSERT INTO cliente(cli_cpf, cli_nome, cli_telefone, cli_email) VALUES (?,?,?,?)";
            const parametros = [                
                cliente.cpf,
                cliente.nome,
                cliente.telefone,
                cliente.email,                
            ];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async alterar(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "UPDATE cliente SET cli_cpf = ?, cli_nome = ?, cli_telefone = ?, cli_email = ? WHERE cli_cpf = ?";
            const parametros = [                
                cliente.cpf,
                cliente.nome,
                cliente.telefone,
                cliente.email,
                cliente.cpf              
            ];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async excluir(cliente) {
        if (cliente instanceof Cliente) {
            const conexao = await conectar();
            const sql = "DELETE FROM cliente WHERE cli_cpf = ?";
            const parametros = [cliente.cpf];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async consultar() {
        const conexao = await conectar();
        const sql = "SELECT * from cliente ORDER BY cli_nome";
        const [registros] = await conexao.query(sql);
        await conexao.release();

        let listaClientes = [];
        for (const registro of registros) {            
            const cliente = new Cliente(
                                    registro.cli_cpf,
                                    registro.cli_nome,
                                    registro.cli_telefone,
                                    registro.cli_email
                                );
            listaClientes.push(cliente);
        }

        return listaClientes;
    }

    async consultarCPF(cpf) {
        cpf = cpf || ' ';
        const conexao = await conectar();
        const sql = "SELECT * from cliente WHERE cli_cpf = ? ORDER BY cli_nome";
        const [registros] = await conexao.query(sql,[cpf]);
        await conexao.release();

        let listaClientes = [];
        for (const registro of registros) {            
            const cliente = new Cliente(
                                    registro.cli_cpf,
                                    registro.cli_nome,
                                    registro.cli_telefone,
                                    registro.cli_email
                                );
            listaClientes.push(cliente);
        }

        return listaClientes;
    }    
};