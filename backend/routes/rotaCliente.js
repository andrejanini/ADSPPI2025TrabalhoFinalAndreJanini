import { Router } from 'express';
import ClienteController from "../controllers/clienteController.js";

const clienteRouter = Router();
const clienteCtrl = new ClienteController();

clienteRouter
    .get("/", clienteCtrl.consultar.bind(clienteCtrl))
    .get("/:cpf", clienteCtrl.consultar.bind(clienteCtrl))
    .get("/:cpf/livros", clienteCtrl.consultarLivros.bind(clienteCtrl))
    .post("/", clienteCtrl.gravar.bind(clienteCtrl))
    .put("/:cpf", clienteCtrl.alterar.bind(clienteCtrl))
    .delete("/:cpf", clienteCtrl.excluir.bind(clienteCtrl));

export default clienteRouter;