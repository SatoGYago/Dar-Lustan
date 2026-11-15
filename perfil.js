// Página de perfil: mostra os dados e os pedidos do usuário logado.
const listaPedidos = document.getElementById('listaPedidos');

function formatarDataPerfil(data)
{
    // "2026-11-15 12:45:00" vira "15/11/2026 12:45"
    const partes = data.split(' ');
    const dia = partes[0].split('-');
    return dia[2] + '/' + dia[1] + '/' + dia[0] + ' ' + partes[1].slice(0, 5);
}

function mostrarDados(usuario)
{
    // O login só guarda nome, e-mail e tipo, então o resto vem da lista de cadastros.
    const cadastro = obterUsuarios().find(function (conta) {
        return conta.EmailUsuario === usuario.EmailUsuario;
    }) || usuario;

    document.getElementById('perfilNome').textContent = cadastro.NomeCompleto;
    document.getElementById('perfilEmail').textContent = cadastro.EmailUsuario;
    document.getElementById('perfilTelefone').textContent = cadastro.UserTelNumber || '-';
    document.getElementById('perfilEndereco').textContent = cadastro.UserAdress || '-';

    const entregador = cadastro.UserType === 'DeliveryPartner';
    document.getElementById('perfilTipo').textContent = entregador ? 'Entregador' : 'Cliente';
    document.getElementById('dadosEntregador').hidden = !entregador;
    if (entregador) {
        document.getElementById('perfilVeiculo').textContent = cadastro.VehicleType || '-';
        document.getElementById('perfilPlaca').textContent = cadastro.VehicleNumber || '-';
    }
}

function mostrarPedidos(usuario)
{
    const historico = lerDados('darLustanPedidos', []);
    // Só os pedidos deste usuário, do mais novo para o mais antigo.
    const pedidos = (Array.isArray(historico) ? historico : []).filter(function (pedido) {
        return pedido && pedido.EmailUsuario === usuario.EmailUsuario && Array.isArray(pedido.Itens);
    }).reverse();

    listaPedidos.replaceChildren();
    if (pedidos.length === 0) {
        listaPedidos.textContent = 'Você ainda não fez nenhum pedido.';
        return;
    }
    pedidos.forEach(function (pedido) {
        const div = document.createElement('div');
        div.className = 'pedidoPerfil';
        div.innerHTML = `
            <p class="dataPedidoPerfil"></p>
            <ul class="itensPedidoPerfil"></ul>
            <p class="totalPedidoPerfil"></p>`;
        div.querySelector('.dataPedidoPerfil').textContent = 'Pedido de ' + formatarDataPerfil(pedido.DataPedido);
        pedido.Itens.forEach(function (item) {
            const li = document.createElement('li');
            li.textContent = item.Quantidade + 'x ' + item.Nome;
            div.querySelector('ul').appendChild(li);
        });
        div.querySelector('.totalPedidoPerfil').textContent = 'Total: ' + formatarPreco(pedido.Total);
        listaPedidos.appendChild(div);
    });
}

document.getElementById('botaoSairPerfil').addEventListener('click', function () {
    try {
        localStorage.removeItem('darLustanUsuarioLogado');
        window.location.href = 'index.html';
    } catch (erro) {
        alert('Não foi possível sair. Verifique o armazenamento do navegador.');
    }
});

// Sem ninguém logado, não tem perfil para mostrar, então vai para o login.
const usuarioPerfil = obterUsuarioLogado();
if (usuarioPerfil) {
    mostrarDados(usuarioPerfil);
    mostrarPedidos(usuarioPerfil);
} else {
    window.location.href = 'login.html';
}
