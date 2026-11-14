// Gera um arquivo com os dados de um cadastro para o futuro backend em C#.
// O download não envia os dados automaticamente para o backend.
function baixarJson(dados) {
  const json = JSON.stringify(dados, null, 2);
  const arquivo = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dados.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Aguarda o navegador iniciar o download antes de liberar a URL.
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

// Simulação temporária de login enquanto o backend não está pronto.
// Quando houver uma API, ela deverá validar as contas e as senhas.
function lerDados(chave, valorPadrao) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorPadrao;
  } catch (erro) {
    return valorPadrao;
  }
}

function obterUsuarios() {
  const usuarios = lerDados('darLustanUsuarios', []);
  return Array.isArray(usuarios) ? usuarios : [];
}


function obterUsuarioLogado() {
  const usuario = lerDados('darLustanUsuarioLogado', null);
  return usuario && typeof usuario.NomeCompleto === 'string' &&
    typeof usuario.EmailUsuario === 'string' ? usuario : null;
}

function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (erro) {
    alert('Não foi possível salvar os dados. Verifique se o navegador permite armazenamento local.');
    return false;
  }
}

function MascaraTelefone() {
  const input = document.getElementById('TelInput');
  let valor = input.value.replace(/\D/g, '').slice(0, 11);
  if (valor.length > 10) {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (valor.length > 6) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
  } else if (valor.length > 2) {
    valor = valor.replace(/^(\d{2})(\d*)$/, '($1) $2');
  }
  input.value = valor;
}

const formularioCadastro = document.getElementById('formularioCadastro');
if (formularioCadastro) {
  const inputDriverDados = document.getElementById('inputDriverDados');
  const tiposUsuario = document.querySelectorAll('input[name="UserType"]');


  ['nomeInput', 'Emailinput', 'PasswordInput', 'TelInput', 'AdressInput', 'RadioUser']
    .forEach(function (id) {
      document.getElementById(id).required = true;
    });

  function atualizarCamposEntregador() {
    const entregador = document.getElementById('RadioPartner').checked;
    inputDriverDados.innerHTML = entregador ? `
      <div id="inputVehicleType">
        <input type="text" name="VehicleType" id="VehicleInput" placeholder="Tipo de veículo" required>
      </div>
      <div id="inputVehiclePlate">
        <input type="text" name="VehiclePlate" id="PlateInput" placeholder="Placa do veículo" required>
      </div>` : '';
  }

  tiposUsuario.forEach(function (radio) {
    radio.addEventListener('change', atualizarCamposEntregador);
  });
  atualizarCamposEntregador();

  formularioCadastro.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const usuarios = obterUsuarios();
    const email = document.getElementById('Emailinput').value.trim().toLowerCase();
    const nome = document.getElementById('nomeInput').value.trim();
    const senha = document.getElementById('PasswordInput').value;
    if (!nome || !email || !senha.trim()) {
      alert('Preencha o nome, o e-mail e a senha.');
      return;
    }
    if (usuarios.some(function (usuario) { return usuario.EmailUsuario === email; })) {
      alert('Este e-mail já está cadastrado. Use outro e-mail ou faça login.');
      return;
    }

    const dados = {
      NomeCompleto: nome,
      EmailUsuario: email,
      PasswordUsuario: senha,
      UserTelNumber: document.getElementById('TelInput').value,
      UserAdress: document.getElementById('AdressInput').value.trim(),
      UserType: document.querySelector('input[name="UserType"]:checked').value
    };
    if (dados.UserType === 'DeliveryPartner') {
      dados.VehicleType = document.getElementById('VehicleInput').value.trim();
      dados.VehiclePlate = document.getElementById('PlateInput').value.trim();
    }
    baixarJson(dados);
    // Esta cópia local permite testar o login antes da integração com o C#.
    usuarios.push(dados);
    if (salvarDados('darLustanUsuarios', usuarios)) {
      alert('Download de dados.json solicitado! Agora você pode testar o login neste navegador.');
      window.location.href = 'login.html';
    }
  });
}

const formularioLogin = document.getElementById('formularioLogin');
if (formularioLogin) {
  formularioLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const email = document.getElementById('emailLogin').value.trim().toLowerCase();
    const senha = document.getElementById('senhaLogin').value;
    const usuario = obterUsuarios().find(function (conta) {
      return conta.EmailUsuario === email && conta.PasswordUsuario === senha;
    });
    if (!usuario) {
      document.getElementById('mensagemLogin').textContent = 'E-mail ou senha incorretos.';
      return;
    }

    if (salvarDados('darLustanUsuarioLogado', {
      NomeCompleto: usuario.NomeCompleto,
      EmailUsuario: usuario.EmailUsuario,
      UserType: usuario.UserType
    })) {
      window.location.href = 'index.html';
    }
  });

  document.getElementById('botaoSair').addEventListener('click', function () {
    try {
      localStorage.removeItem('darLustanUsuarioLogado');
      atualizarEstadoLogin();
    } catch (erro) {
      alert('Não foi possível sair. Verifique o armazenamento do navegador.');
    }
  });
}

const userMenu = document.getElementById('userMenu');
if (userMenu) {
  const link = userMenu.querySelector('a');
  if (link) link.href = 'login.html';
  userMenu.addEventListener('click', function (evento) {
    evento.preventDefault();
    window.location.href = 'login.html';
  });
}

function atualizarEstadoLogin() {
  const usuario = obterUsuarioLogado();
  if (userMenu) {
    const descricao = usuario ? 'Conta de ' + usuario.NomeCompleto : 'Entrar na conta';
    userMenu.title = descricao;
    userMenu.dataset.logado = usuario ? 'true' : 'false';
    const link = userMenu.querySelector('a');
    if (link) link.setAttribute('aria-label', descricao);
  }
  if (formularioLogin) {
    formularioLogin.hidden = Boolean(usuario);
    document.getElementById('contaLogada').hidden = !usuario;
    document.getElementById('nomeUsuario').textContent = usuario ? usuario.NomeCompleto : '';
    document.getElementById('mensagemLogin').textContent = '';
    document.getElementById('senhaLogin').value = '';
  }
}

atualizarEstadoLogin();

window.addEventListener('storage', atualizarEstadoLogin);
window.addEventListener('pageshow', atualizarEstadoLogin);
