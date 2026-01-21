const campoPesquisa = document.getElementById('campoFiltro');

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('formularioCadastro')) {
    prepararFormulario();
  } else {
    carregarUsuario();
  }

  if (document.getElementById('campoFiltro')) {

    campoPesquisa.addEventListener('input', () => {
      carregarUsuario();
    });
  }
});

async function carregarUsuario() {
  // const pesquisa = campoPesquisa ? campoPesquisa?.value.toLowerCase() : "";
  const filtro = document.getElementById('campoFiltro') 
  ? document.getElementById('campoFiltro').value.toLowerCase() 
  : "";

  const resposta = await fetch('http://localhost:3000/usuarios');

  const usuarios = await resposta.json();

  const tabela = document.getElementById('tabelaUsuarios');

  tabela.innerHTML = '';

  usuarios.filter(usuario => 
    usuario.nome.toLowerCase().includes(filtro) ||
    usuario.email.toLowerCase().includes(filtro)
  ).forEach(usuario => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td>${usuario.idade}</td>
      <td class="acoes">
        <button class="editar" onclick="editarUsuario('${usuario._id}')">Editar</button>
        <button class="excluir" onclick="excluirUsuario('${usuario._id}')">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });

}

async function prepararFormulario() {
  
}

