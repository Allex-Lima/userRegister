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

async function editarUsuario(idUsuario) {
  window.location.href = `cadastro.html?id=${idUsuario}`;
}

async function excluirUsuario(idUsuario) {
  if(confirm('Tem certeza que deseja excluir este usuário')) {
    await fetch(`http://localhost:3000/usuarios/${idUsuario}`,{
      method: 'DELETE',
      });
      alert('Usuário removido com sucesso.');
      carregarUsuario();
  }
}

async function prepararFormulario() {
  const parametrosURL = new URLSearchParams(window.location.search);
  const idUsuario = parametrosURL.get('id');

  if (idUsuario) {
    const tituloPagina = document.getElementById('tituloPagina');

    tituloPagina.textContent = 'Editar usuário';

    const resposta = await fetch(`http://localhost:3000/usuarios`);
    const listausuario = await resposta.json();
    const usuarioEncontrado = listausuario.find(usuario => usuario._id === idUsuario);

    if (usuarioEncontrado) {
      document.getElementById('idUsuario').value = usuarioEncontrado._id;
      document.getElementById('nome').value = usuarioEncontrado.nome;
      document.getElementById('email').value = usuarioEncontrado.email;
      document.getElementById('idade').value = usuarioEncontrado.idade;
    }
  }
  const formCadastro = document.getElementById('formularioCadastro');

  formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const idUsuarioCampo = document.getElementById('idUsuario').value;
    const nomeUsuario = document.getElementById('nome').value;
    const emailUsuario = document.getElementById('email').value;
    const idadeUsuario = document.getElementById('idade').value;

    if (idUsuarioCampo) {
      await fetch(`http://localhost:3000/usuarios${idUsuarioCampo}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          nome: nomeUsuario,
          email: emailUsuario,
          idade: idadeUsuario,
        })
      });
      alert('Usuário atualizado com sucesso.');
    } else {
      await fetch(`http://localhost:3000/usuarios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          nome: nomeUsuario,
          email: emailUsuario,
          idade: idadeUsuario,
        })
      });
      alert('Usuário cadastrado com sucesso.');
    }
    window.location.href = 'index.html';
  });
}