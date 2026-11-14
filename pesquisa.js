// Barra de pesquisa do cardápio: esconde os produtos que não têm o texto digitado no nome.
const pesquisaInput = document.getElementById('pesquisaInput');
const mensagemPesquisa = document.getElementById('mensagemPesquisa');
// Guarda a ordem original dos produtos e das fileiras (cada fileira tem 4 produtos).
const todosProdutos = Array.from(document.querySelectorAll('.prod'));
const fileiras = Array.from(document.querySelectorAll('.produtos'));

function normalizarTexto(texto)
{
    // Tira os acentos e deixa tudo minúsculo, assim "kafta" acha "Kafta" e "cardapio" acharia "Cardápio".
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function pesquisarProdutos()
{
    const busca = normalizarTexto(pesquisaInput.value);
    const encontrados = todosProdutos.filter(function (produto) {
        return normalizarTexto(produto.querySelector('.NomeProd').textContent).includes(busca);
    });

    // Esconde os produtos que não bateram com a pesquisa.
    todosProdutos.forEach(function (produto) {
        produto.style.display = encontrados.includes(produto) ? '' : 'none';
        fileiras[fileiras.length - 1].appendChild(produto);
    });

    // Junta os encontrados, de 4 em 4, a partir da primeira fileira, para não sobrar buraco no meio.
    // Com a pesquisa vazia todos aparecem, então cada produto volta para a fileira original.
    encontrados.forEach(function (produto, posicao) {
        fileiras[Math.floor(posicao / 4)].appendChild(produto);
    });

    // Fileira sem nenhum produto aparecendo fica escondida.
    fileiras.forEach(function (fileira, posicao) {
        fileira.style.display = posicao * 4 < encontrados.length ? '' : 'none';
    });
    mensagemPesquisa.hidden = encontrados.length > 0;
}

// Pesquisa enquanto digita e também ao clicar na lupa.
pesquisaInput.addEventListener('input', pesquisarProdutos);
document.getElementById('search').addEventListener('click', function () {
    pesquisarProdutos();
    pesquisaInput.focus();
});
