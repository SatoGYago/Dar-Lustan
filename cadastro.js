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

const formsCadastro = Document.getElementById('FormularioCadastro');

formsCadastro.addEventListener('submit', function(e) {

});