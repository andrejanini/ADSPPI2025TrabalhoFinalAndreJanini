import LivroDAO from "../db/livroDAO.js";

export default class Livro {    
    #id;
    #titulo;
    #autor;
    #cpfCliente;
    
    constructor(id = "", titulo = "", autor = "", cpfCliente = "") {        
        this.#id = id; // O ID será gerado automaticamente pelo banco de dados 
        this.#titulo = titulo;
        this.#autor = autor;
        this.#cpfCliente = cpfCliente;        
    }
        
    get id() {
        return this.#id
    }
    set id(id) {
        this.#id = id
    }

    get titulo() {
        return this.#titulo
    }
    set titulo(titulo) {
        this.#titulo = titulo
    }

    get autor() {
        return this.#autor
    }
    set autor(autor) {
        this.#autor = autor
    }

    get cpfCliente() {
        return this.#cpfCliente
    }
    set cpfCliente(cpfCliente) {
        this.#cpfCliente = cpfCliente
    }
    
    toString() { 
        return `
            ID: ${this.#id}\n
            Título: ${this.#titulo}\n
            Autor: ${this.#autor}\n
            CPF do cliente: ${this.#cpfCliente}\n            
        `;
    }
        
    toJSON() {
        return {
        id: this.#id,
        titulo: this.#titulo,
        autor: this.#autor,
        cpfCliente: this.#cpfCliente,
        nomeCliente: this.nomeCliente || null,
        emailCliente: this.emailCliente || null,
        telefoneCliente: this.telefoneCliente || null            
        };
    }
    
    async gravar() {
        const livroDAO = new LivroDAO();
        await livroDAO.gravar(this);
    }

    async alterar() {
        const livroDAO = new LivroDAO();
        await livroDAO.alterar(this);
    }

    async excluir() {
        const livroDAO = new LivroDAO();
        await livroDAO.excluir(this);
    }

    async consultar() {
        const livroDAO = new LivroDAO();
        return await livroDAO.consultar();
    }

    async consultarID(id) {
        const livroDAO = new LivroDAO();
        return await livroDAO.consultarID(id);
    }

    async consultarPorCliente(cpf) {
        const livroDAO = new LivroDAO();
        return await livroDAO.consultarPorCliente(cpf);
    }
}