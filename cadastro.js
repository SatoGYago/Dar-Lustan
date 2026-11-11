function MascaraTelefone() 
{
  const inputTelefone = document.getElementById('inputTelefone');

    inputTelefone.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, ''); 
      if (valor.length > 11) valor = valor.substring(0, 11);

      if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (valor.length > 0) {
        valor = valor.replace(/^(\d{0,2})/, '($1');
      }
      e.target.value = valor;
    });
}

const formulario = document.getElementById('formularioCadastro');

formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const dados = {
    NomeCompleto: document.getElementById('nomeInput').value,
    EmailUsuario: document.getElementById('Emailinput').value,
    PasswordUsuario: document.getElementById('PasswordInput').value,
    UserTelNumber: document.getElementById('TelInput').value,
    UserAdress: document.getElementById('AdressInput').value,
    UserType: document.querySelector('input[name="UserType"]:checked')?.value
  }
  const jsonDados = JSON.stringify(dados, null, 2);

  const blob = new Blob([jsonDados], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dados.json';
  link.click();
  link.remove();

  url.revokeObjectURL(url);
});