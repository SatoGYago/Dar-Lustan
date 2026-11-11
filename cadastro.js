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

function baixarJson(dados)
{
  const jsonDados = JSON.stringify(dados, null, 2);

  const blob = new Blob([jsonDados], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dados.json';
  link.click();
  link.remove();

  url.revokeObjectURL(url);
}

const formulario = document.getElementById('formularioCadastro');
const inputDriverDados = document.getElementById('inputDriverDados');

const userTypes = document.querySelectorAll('input[name="UserType"]');

userTypes.forEach((radio) => {
    radio.addEventListener('change', function () {

        if (this.value === 'DeliveryPartner') {

            inputDriverDados.innerHTML = `
                <div id="inputVehicleType">
                    <input
                        type="text"
                        name="VehicleType"
                        id="VehicleInput"
                        placeholder="Tipo de veículo"
                        required
                    >
                </div>

                <div id="inputVehiclePlate">
                    <input
                        type="text"
                        name="VehiclePlate"
                        id="PlateInput"
                        placeholder="Placa do veículo"
                        required
                    >
                </div>
            `;

        } else {
            inputDriverDados.innerHTML = '';
        }
    });
});



formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  const UserType = document.querySelector('input[name="UserType"]:checked')?.value;
  if (UserType === 'DeliveryPartner') {
    const dados = 
    {
      NomeCompleto: document.getElementById('nomeInput').value,
      EmailUsuario: document.getElementById('Emailinput').value,
      PasswordUsuario: document.getElementById('PasswordInput').value,
      UserTelNumber: document.getElementById('TelInput').value,
      UserAdress: document.getElementById('AdressInput').value,
      UserType: UserType,
      VehicleType: document.getElementById('VehicleInput').value,
      VehiclePlate: document.getElementById('PlateInput').value
    }
    baixarJson(dados);
  }
  else {
     const dados = {
      NomeCompleto: document.getElementById('nomeInput').value,
      EmailUsuario: document.getElementById('Emailinput').value,
      PasswordUsuario: document.getElementById('PasswordInput').value,
      UserTelNumber: document.getElementById('TelInput').value,
      UserAdress: document.getElementById('AdressInput').value,
      UserType: document.querySelector('input[name="UserType"]:checked')?.value
    }

    baixarJson(dados);
}
});
