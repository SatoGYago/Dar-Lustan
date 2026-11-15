// Modo claro e modo escuro: a escolha fica salva no navegador e vale para todas as páginas.
// Este arquivo é carregado no <head> para aplicar o tema antes da página aparecer, sem piscar.
function lerTema()
{
    try {
        return localStorage.getItem('darLustanTema');
    } catch (erro) {
        return null;
    }
}

function aplicarTema(tema)
{
    const claro = tema === 'claro';
    document.documentElement.classList.toggle('modoClaro', claro);
    const botaoTema = document.getElementById('botaoTema');
    if (botaoTema) {
        // O botão mostra o tema para onde ele vai trocar.
        botaoTema.textContent = claro ? '☾' : '☀';
        botaoTema.title = claro ? 'Mudar para o modo escuro' : 'Mudar para o modo claro';
        botaoTema.setAttribute('aria-label', botaoTema.title);
    }
}

function trocarTema()
{
    const novoTema = document.documentElement.classList.contains('modoClaro') ? 'escuro' : 'claro';
    try {
        localStorage.setItem('darLustanTema', novoTema);
    } catch (erro) {
        // Se o navegador não deixar salvar, o tema troca só nesta página.
    }
    aplicarTema(novoTema);
}

aplicarTema(lerTema());

document.addEventListener('DOMContentLoaded', function () {
    aplicarTema(lerTema());
    document.getElementById('botaoTema').addEventListener('click', trocarTema);
});
// Se trocar o tema em outra aba, esta aba acompanha.
window.addEventListener('storage', function () { aplicarTema(lerTema()); });
