import Livro from "../models/livro.js";
import conectar from "./conexao.js";

export default class LivroDAO {
    
    async gravar(livro) {
        if (livro instanceof Livro) {
            const conexao = await conectar();
            
            const [existe] = await conexao.query(
                "SELECT liv_id FROM livro WHERE liv_titulo = ? AND liv_autor = ? AND cli_cpf IS NOT NULL",
                [livro.titulo, livro.autor]
            );

            if (existe.length > 0) {
                await conexao.release();
                throw new Error("Este livro já está associado a um cliente.");
            }

            const sql = "INSERT INTO livro (liv_titulo, liv_autor, cli_cpf) VALUES (?,?,?)";
            const parametros = [livro.titulo, livro.autor, livro.cpfCliente || null];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
    
    async alterar(livro) {
        if (livro instanceof Livro) {
            const conexao = await conectar();
            const sql = "UPDATE livro SET liv_titulo = ?, liv_autor = ?, cli_cpf = ? WHERE liv_id = ?";
            const parametros = [                
                livro.titulo,
                livro.autor,
                livro.cpfCliente,
                livro.id
            ];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async excluir(livro) {
        if (livro instanceof Livro) {
            const conexao = await conectar();
            const sql = "DELETE FROM livro WHERE liv_id = ?";
            const parametros = [livro.id];

            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }

    async consultar() {
        const conexao = await conectar();
        const sql = `
            SELECT 
                l.liv_id,
                l.liv_titulo,
                l.liv_autor,
                l.cli_cpf,
                c.cli_nome,
                c.cli_email,
                c.cli_telefone
            FROM livro l
            LEFT JOIN cliente c ON l.cli_cpf = c.cli_cpf
            ORDER BY l.liv_titulo
        `;
        const [registros] = await conexao.query(sql);
        await conexao.release();

        let listaLivros = [];
        for (const registro of registros) {            
            const livro = new Livro(
                registro.liv_id,
                registro.liv_titulo,
                registro.liv_autor,
                registro.cli_cpf                                    
            );
            livro.cpfCliente = registro.cli_cpf;
            livro.nomeCliente = registro.cli_nome || null;            

            listaLivros.push(livro);
        }

        return listaLivros;
    }

    async consultarID(id) {
        id = id || ' ';
        const conexao = await conectar();
        const sql = `
            SELECT 
                l.liv_id,
                l.liv_titulo,
                l.liv_autor,
                l.cli_cpf,
                c.cli_nome,
                c.cli_email,
                c.cli_telefone
            FROM livro l
            LEFT JOIN cliente c ON l.cli_cpf = c.cli_cpf
            WHERE l.liv_id = ?
            ORDER BY l.liv_titulo
        `;
        const [registros] = await conexao.query(sql, [id]);
        await conexao.release();

        let listaLivros = [];
        for (const registro of registros) {            
            const livro = new Livro(
                registro.liv_id,
                registro.liv_titulo,
                registro.liv_autor,
                registro.cli_cpf
            );
            livro.cpfCliente = registro.cli_cpf;
            livro.nomeCliente = registro.cli_nome || null;
            
            listaLivros.push(livro);
        }

        return listaLivros;
    }

    async consultarPorCliente(cpfCliente) {
        const conexao = await conectar();
        const sql = `
            SELECT 
                l.liv_id,
                l.liv_titulo,
                l.liv_autor,
                l.cli_cpf,
                c.cli_nome,
                c.cli_email,
                c.cli_telefone
            FROM livro l
            INNER JOIN cliente c ON l.cli_cpf = c.cli_cpf
            WHERE l.cli_cpf = ?
            ORDER BY l.liv_titulo
        `;
        const [registros] = await conexao.query(sql, [cpfCliente]);
        await conexao.release();

        let listaLivros = [];
        for (const registro of registros) {            
            const livro = new Livro(
                registro.liv_id,
                registro.liv_titulo,
                registro.liv_autor,
                registro.cli_cpf
            );
            livro.cpfCliente = registro.cli_cpf;
            livro.nomeCliente = registro.cli_nome || null;
            
            listaLivros.push(livro);
        }

        return listaLivros;
    }
}