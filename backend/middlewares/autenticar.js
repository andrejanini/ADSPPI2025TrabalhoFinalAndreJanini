export default function verificarAutenticacao(requisicao, resposta, proximo) {
    
    if (requisicao?.session?.autenticado) {
        proximo();
    }
    else {
        requisicao.session.urlDestino = requisicao.originalUrl;
        resposta.redirect('/login.html');
    }
}