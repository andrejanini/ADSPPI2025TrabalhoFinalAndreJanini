import express from 'express';
import cors from 'cors';
import session from 'express-session';
import verificarAutenticacao from './middlewares/autenticar.js';
import clienteRouter from './routes/rotaCliente.js';
import livroRouter from './routes/rotaLivro.js';

const app = express();
const porta = 3000;
const host = '0.0.0.0';

app.use(cors({ origin: '*', }));

app.use(session({
    secret: 'meuS3gr3d0',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    const urlDestino = requisicao.session.urlDestino || '/index.html';
    
    if (usuario == 'admin' && senha == 'admin') {
        requisicao.session.autenticado = true;
        resposta.redirect(urlDestino);
    }
    else {
        resposta.send("<span>Usuário ou senha inválidos!</span> <a href='login.html'>Tentar novamente</a>");
    }
});

app.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect('/login.html');
});

app.use(express.static('frontend/publico'));
app.use('/js', express.static('frontend/js'));
app.use(verificarAutenticacao, express.static('frontend/privado'));

app.use('/clientes', clienteRouter);
app.use('/livros', livroRouter);

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});