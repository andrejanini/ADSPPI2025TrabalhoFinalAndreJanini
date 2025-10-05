import { Router } from 'express';
import LivroController from "../controllers/livroController.js";

const livroRouter = Router();
const livroCtrl = new LivroController();

livroRouter
    .get("/cliente/:cpf", livroCtrl.consultarPorCliente.bind(livroCtrl))
    .get("/", livroCtrl.consultar.bind(livroCtrl))
    .get("/:id", livroCtrl.consultar.bind(livroCtrl))
    .post("/", livroCtrl.gravar.bind(livroCtrl))
    .put("/:id", livroCtrl.alterar.bind(livroCtrl))
    .delete("/:id", livroCtrl.excluir.bind(livroCtrl));

export default livroRouter;