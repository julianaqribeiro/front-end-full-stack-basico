const url_api = 'http://127.0.0.1:5000/';


const limparTabelaCardapio = () =>{

  var tableHeaderRowCount = 1;
  var table = document.getElementById('tabelaCardapio');
  var rowCount = table.rows.length;
  if (rowCount > 0){
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount);
    }
  }  
}

/*
  --------------------------------------------------------------------------------------
  Função para obter os dados do cardapio existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
  const getCardapio = async (criarRadioButtonCategoria = false) => {
    
    limparTabelaCardapio();
    let url = url_api + 'cardapio';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { 
        if (criarRadioButtonCategoria){
          getListaCategoria();
        }                                                    
        data.categorias.forEach(categoria => inserirLinhaTabelaCardapio(categoria));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
    getCardapio(true)

  /*
  --------------------------------------------------------------------------------------
  Função para obter as categorias do cardapio existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
  */ 
  const getListaCategoria = async () => {
    
    let url = url_api + 'categorias_cardapio';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { 
        var divcategoria = document.getElementById("categorias");                                          
        
        for (let index = 0; index < data.categorias.length; index++) {          
          const categoria = data.categorias[index];
          criarRadioCategoria(divcategoria, categoria, (index == 0))
        }        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
  --------------------------------------------------------------------------------------
  Função para criar os radios buttons referentes as categorias do cardapio
  cadastradas no sistema
  --------------------------------------------------------------------------------------
  */
  const criarRadioCategoria = (divcategoria, categoria, checked) => {
    
    radioInput = document.createElement('input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', "categoria");
    radioInput.setAttribute('id', categoria.nome);
    radioInput.setAttribute('value', categoria.id);       
    if ( checked ) {
        radioInput.setAttribute('checked', 'checked');
    }

    var labelCategoria = document.createElement("label");
    labelCategoria.setAttribute('class', "radioCategoria"); 
    var textoCategoria = document.createTextNode(categoria.nome);
    labelCategoria.appendChild(textoCategoria);

    divcategoria.appendChild(radioInput);
    divcategoria.appendChild(labelCategoria);
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const criarBotaoDeletarItem = (parent, idItem) => {

    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");       
    span.className = "close";
    span.id = idItem;        
    span.appendChild(txt);
    parent.appendChild(span);
  }
    
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");    
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {                      
        
        const idTem = this.getAttribute('id'); 

        if (confirm(`Deseja realmente excluir o item selecionado ?`)) {
          deletarItemCardapio(idTem)          
          
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deletarItemCardapio = (idItem) => {
    
    let url = url_api + 'item_cardapio?id=' + idItem;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => {
        response.json();
        if (response.status == 200){ 
          getCardapio(); 
          alert("Item removido com sucesso!");
        }
        else{
          alert("Erro ao remover item do cardápio.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputNome, inputDescricao, inputPreco, inputCategoriaId) => {
    const formData = new FormData();    
    formData.append('nome', inputNome);
    formData.append('descricao', inputDescricao);
    formData.append('preco', inputPreco);
    formData.append('categoria_id', inputCategoriaId);
  
    let url = url_api + 'item_cardapio';
    fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => { 
      response.json(); 
      if (response.status == 200){        
        getCardapio();
        alert("Item adicionado!");
      }
      else{
        alert("Erro ao adicionar Item.");
      }      
    })        
    .catch((error) => {
      alert("Erro ao adicionar Item.");
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para cadastrar um novo item do cardápio 
    --------------------------------------------------------------------------------------
  */
  const adicionarItem = () => {

    let inputNome = document.getElementById("nome").value;
    let inputDescricao = document.getElementById("descricao").value;
    let inputPreco = document.getElementById("preco").value;
    let inputCategoriaId = document.querySelector('input[name="categoria"]:checked').value;

    if (inputNome === '') {
      alert("É obrigatório preencher o nome!");
    } else if (inputDescricao === '') {
      alert("É obrigatório preencher a descrição!");
    } else if (inputPreco == 0) {
      alert("Preço com valor inválido");
    } else {      
      postItem(inputNome, inputDescricao, inputPreco, inputCategoriaId)      
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir linha na tabela referente ao cardápio
    --------------------------------------------------------------------------------------
  */
  const inserirLinhaTabelaCardapio = (categoria) => {
    
    let tabela = document.getElementById('tabelaCardapio');

    if (categoria.itens.length == 0){
        
        inserirLinhaNomeCategoria(tabela, categoria.nome);
        inserirLinhaNenhumItemCadastrado(tabela);        
        return;
    }
   
    for (let i = 0; i < categoria.itens.length; i++) {                        
                       
        if (i == 0){            
          inserirLinhaNomeCategoria(tabela, categoria.nome);                        
        }
                        
        inserirLinhaItemCardapio(tabela, categoria.itens[i]);           
    }     
  }

  const inserirLinhaNomeCategoria = (tabela, nome_categoria) => {
    
    let linha = tabela.insertRow();
    let cel = linha.insertCell(0);
    cel.innerHTML = '<b>' + nome_categoria + '<b>'; 
    cel.colSpan = 3;
    cel.style.width = 'auto';
    cel.className = 'linhaCategoria';
  }

  const inserirLinhaNenhumItemCadastrado = (tabela) => {
    
    let linha = tabela.insertRow();        
    let cel = linha.insertCell(0);
    cel.innerHTML = 'Nenhum item cadastrado.'; 
    cel.colSpan = 3;
    cel.style.width = 'auto';
    cel.className = 'celulaNomeItemCardapio';
  }

  const inserirLinhaItemCardapio = (tabela, item) => {
         
    let linha = tabela.insertRow();
        
    let cel_nome_descricao = linha.insertCell(0);
    cel_nome_descricao.innerHTML = '<b>' + item.nome + '</b><br><br>' + item.descricao; 
    cel_nome_descricao.className = 'celulaNomeItemCardapio';

    let cel_preco = linha.insertCell(1);
    cel_preco.textContent = item.preco;
    cel_preco.className = 'celulaPrecoItemCardapio';
    
    criarBotaoDeletarItem(linha.insertCell(-1), item.id);
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("preco").value = "";
  
    removeElement();
  }