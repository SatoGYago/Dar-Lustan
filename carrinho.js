// O carrinho fica no navegador para continuar disponível ao trocar de página.
const carrinhoLateral = document.getElementById('carrinhoLateral');
const itensCarrinho = document.getElementById('itensCarrinho');
const mensagemCarrinho = document.getElementById('mensagemCarrinho');
const botaoFinalizar = document.getElementById('finalizarPedido');

function obterCarrinho()
{
    const itens = lerDados('darLustanCarrinho', []);
    if (!Array.isArray(itens)) return [];
    return itens.filter(function (item) {
        return item && Number.isInteger(item.ItemID) && item.ItemID > 0 &&
            typeof item.Nome === 'string' && quantidadeValida(item.Quantidade) &&
            Number.isFinite(item.PrecoUnitario) && item.PrecoUnitario > 0;
    });
}

function quantidadeValida(quantidade)
{
    return Number.isInteger(quantidade) && quantidade >= 1 && quantidade <= 10;
}

function formatarPreco(valor)
{
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotal(itens)
{
    // Calcula em centavos para evitar diferenças de arredondamento.
    return itens.reduce(function (total, item) {
        return total + Math.round(item.PrecoUnitario * 100) * item.Quantidade;
    }, 0) / 100;
}

function salvarCarrinho(itens)
{
    return salvarDados('darLustanCarrinho', itens);
}

function abrirCarrinho()
{
    mensagemCarrinho.textContent = '';
    atualizarCarrinho();
    if (!carrinhoLateral.open) carrinhoLateral.showModal();
}

function adicionarItem(produto)
{
    const campoQuantidade = produto.querySelector('input[name="quantidade"]');
    const quantidade = Number(campoQuantidade.value);
    if (!quantidadeValida(quantidade)) {
        campoQuantidade.setCustomValidity('Digite uma quantidade inteira de 1 a 10.');
        campoQuantidade.reportValidity();
        return;
    }

    const itens = obterCarrinho();
    const id = Number(produto.dataset.itemId);
    const existente = itens.find(function (item) { return item.ItemID === id; });
    if (existente) {
        if (!quantidadeValida(existente.Quantidade + quantidade)) {
            abrirCarrinho();
            mensagemCarrinho.textContent = 'O limite é de 10 unidades por item. Altere a quantidade no carrinho.';
            return;
        }
        existente.Quantidade += quantidade;
    } else {
        itens.push({
            ItemID: id,
            Nome: produto.querySelector('.NomeProd').textContent.trim(),
            Quantidade: quantidade,
            PrecoUnitario: Number(produto.querySelector('.precoProd').textContent.trim().replace(',', '.'))
        });
    }
    if (salvarCarrinho(itens)) abrirCarrinho();
}

function alterarQuantidade(id, campo)
{
    const itens = obterCarrinho();
    const item = itens.find(function (produto) { return produto.ItemID === id; });
    if (!item) {
        atualizarCarrinho();
        return;
    }
    const quantidade = Number(campo.value);
    if (!quantidadeValida(quantidade)) {
        mensagemCarrinho.textContent = 'Digite uma quantidade inteira de 1 a 10.';
        campo.value = item.Quantidade;
        return;
    }
    item.Quantidade = quantidade;
    if (salvarCarrinho(itens)) {
        mensagemCarrinho.textContent = '';
        atualizarCarrinho();
        document.getElementById('quantidadeCarrinho' + id).focus();
    } else {
        atualizarCarrinho();
    }
}

function excluirItem(id)
{
    const itens = obterCarrinho().filter(function (item) { return item.ItemID !== id; });
    if (salvarCarrinho(itens)) {
        mensagemCarrinho.textContent = 'Item removido.';
        atualizarCarrinho();
        document.getElementById('fecharCarrinho').focus();
    }
}

function atualizarCarrinho()
{
    const itens = obterCarrinho();
    itensCarrinho.replaceChildren();
    if (itens.length === 0) {
        itensCarrinho.textContent = 'Seu carrinho está vazio.';
    }
    itens.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'itemCarrinho';
        div.innerHTML = `
            <div class="dadosItemCarrinho">
                <h3></h3>
                <p class="precoItemCarrinho"></p>
                <p class="subtotalItemCarrinho"></p>
                <button type="button">Excluir</button>
            </div>
            <div class="quantidadeItemCarrinho">
                <label>Quantidade</label>
                <input type="number" min="1" max="10" step="1" required>
            </div>`;
        div.querySelector('h3').textContent = item.Nome;
        div.querySelector('.precoItemCarrinho').textContent = 'Unidade: ' + formatarPreco(item.PrecoUnitario);
        div.querySelector('.subtotalItemCarrinho').textContent = 'Subtotal: ' + formatarPreco(calcularTotal([item]));
        const campo = div.querySelector('input');
        campo.id = 'quantidadeCarrinho' + item.ItemID;
        campo.value = item.Quantidade;
        div.querySelector('label').htmlFor = campo.id;
        campo.setAttribute('aria-label', 'Quantidade de ' + item.Nome);
        campo.addEventListener('change', function () { alterarQuantidade(item.ItemID, campo); });
        const excluir = div.querySelector('button');
        excluir.setAttribute('aria-label', 'Excluir ' + item.Nome);
        excluir.addEventListener('click', function () { excluirItem(item.ItemID); });
        itensCarrinho.appendChild(div);
    });
    document.getElementById('totalCarrinho').textContent = formatarPreco(calcularTotal(itens));
    botaoFinalizar.disabled = itens.length === 0;
}

function formatarDataPedido(data)
{
    function doisDigitos(numero) { return String(numero).padStart(2, '0'); }
    return data.getFullYear() + '-' + doisDigitos(data.getMonth() + 1) + '-' +
        doisDigitos(data.getDate()) + ' ' + doisDigitos(data.getHours()) + ':' +
        doisDigitos(data.getMinutes()) + ':' + doisDigitos(data.getSeconds());
}

function montarPedido(usuario, itens)
{
    return {
        EmailUsuario: usuario.EmailUsuario,
        DataPedido: formatarDataPedido(new Date()),
        Itens: itens.map(function (item) {
            return {
                ItemID: item.ItemID,
                Quantidade: item.Quantidade,
                PrecoUnitario: item.PrecoUnitario
            };
        }),
        Total: calcularTotal(itens)
    };
}

function finalizarPedido()
{
    const itens = obterCarrinho();
    if (itens.length === 0) return;
    const usuario = obterUsuarioLogado();
    if (!usuario) {
        alert('Faça login para finalizar o pedido. Seu carrinho ficará salvo.');
        window.location.href = 'login.html';
        return;
    }

    // O arquivo será lido pelo futuro backend em C#. Não há envio automático.
    const pedido = montarPedido(usuario, itens);
    const arquivo = new Blob([JSON.stringify(pedido, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pedido.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

    // Guarda uma cópia do pedido, com o nome dos itens, para aparecer em "Meus pedidos" no perfil.
    const historico = lerDados('darLustanPedidos', []);
    const pedidosSalvos = Array.isArray(historico) ? historico : [];
    pedidosSalvos.push({
        EmailUsuario: pedido.EmailUsuario,
        DataPedido: pedido.DataPedido,
        Itens: itens.map(function (item) {
            return { Nome: item.Nome, Quantidade: item.Quantidade };
        }),
        Total: pedido.Total
    });
    salvarDados('darLustanPedidos', pedidosSalvos);

    if (salvarCarrinho([])) {
        atualizarCarrinho();
        mensagemCarrinho.textContent = 'Download de pedido.json solicitado!';
        document.getElementById('fecharCarrinho').focus();
    }
}

// Cada produto usa um ID fixo no HTML, de 1 a 12.
// Estes IDs devem corresponder aos produtos cadastrados no futuro backend.
document.querySelectorAll('.prod').forEach(function (produto) {
    const campo = produto.querySelector('input[name="quantidade"]');
    if (!campo.value) campo.value = 1;
    campo.setAttribute('aria-label', 'Quantidade de ' + produto.querySelector('.NomeProd').textContent.trim());
    campo.addEventListener('input', function () { campo.setCustomValidity(''); });
    produto.querySelector('.ProdForms button').addEventListener('click', function () {
        adicionarItem(produto);
    });
});

document.getElementById('menuPedidos').addEventListener('click', function (evento) {
    evento.preventDefault();
    abrirCarrinho();
});
document.getElementById('fecharCarrinho').addEventListener('click', function () {
    carrinhoLateral.close();
});
botaoFinalizar.addEventListener('click', finalizarPedido);
window.addEventListener('storage', atualizarCarrinho);
window.addEventListener('pageshow', atualizarCarrinho);
atualizarCarrinho();
