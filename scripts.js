const url_api = 'http://127.0.0.1:5000/';

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
  const getList = async () => {
    
    let url = url_api + 'cardapio';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { 
        getListaCategoria();                                          
        data.categorias.forEach(categoria => insertList(categoria));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getListaCategoria = async () => {
    
    let url = url_api + 'categorias_cardapio';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { 
        var divcategoria = document.getElementById("categorias");                                          
        data.categorias.forEach(categoria => criarRadioCategoria(divcategoria, categoria, false));
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
  getList()


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
    labelCategoria.setAttribute('class', "radio_categoria"); 
    var textoCategoria = document.createTextNode(categoria.nome);
    labelCategoria.appendChild(textoCategoria);

    divcategoria.appendChild(radioInput);
    divcategoria.appendChild(labelCategoria);
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputProduct, inputQuantity, inputPrice) => {
    const formData = new FormData();
    formData.append('nome', inputProduct);
    formData.append('quantidade', inputQuantity);
    formData.append('valor', inputPrice);
  
    let url = url_api + 'produto';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
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
        
        let div = this.parentElement.parentElement;
        const idTem = this.getAttribute('id'); 

        if (confirm(`Deseja realmente excluir o item selecionado ?`)) {
          div.remove()
          deletarItemCardapio(idTem)
          alert("Item removido com sucesso!")
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
      .then((response) => response.json() )
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade e valor 
    --------------------------------------------------------------------------------------
  */
  const adicionarItem = () => {
    let inputProduct = document.getElementById("newInput").value;
    let inputQuantity = document.getElementById("newQuantity").value;
    let inputPrice = document.getElementById("newPrice").value;
  
    if (inputProduct === '') {
      alert("Escreva o nome de um item!");
    } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
      alert("Quantidade e valor precisam ser números!");
    } else {
      insertList(inputProduct, inputQuantity, inputPrice)
      postItem(inputProduct, inputQuantity, inputPrice)
      alert("Item adicionado!")
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (categoria) => {
    
    var tabela = document.getElementById('tabelaCardapio');

    if (categoria.itens.length == 0){
        var linha = tabela.insertRow();        
        montarCelulaNomeCategoria(linha, categoria.nome, 1);

        var cel = linha.insertCell(1);
        cel.textContent = "Nenhum item cadastrado.";
        cel.colSpan = 2;

        var cel = linha.insertCell(-1);
        cel.textContent = "";

        return;
    }
   
    for (var i = 0; i < categoria.itens.length; i++) {                        
       
        var linha = tabela.insertRow();
        var num_celula_item = 0;
        
        if (i == 0){            
            montarCelulaNomeCategoria(linha, categoria.nome, categoria.itens.length);            
            num_celula_item = 1;
        }
        
        montarCelulasItemCardapio(linha, categoria.itens[i], num_celula_item);           
    }     
  }

  const montarCelulaNomeCategoria = (linha, nome_categoria, numRowSpan) => {
    
    var cel = linha.insertCell(0);
    cel.innerHTML = '<h3>' + nome_categoria + "<h3>"; 
    cel.rowSpan = numRowSpan;
    cel.style.width = 'auto';
  }

  const montarCelulasItemCardapio = (linha, item, num_celula_item) => {
                       
    var cel_nome_descricao = linha.insertCell(num_celula_item);
    cel_nome_descricao.innerHTML = '<b>' + item.nome + '</b><br><h5>' + item.descricao +"</h5>"; 

    var cel_preco = linha.insertCell(num_celula_item + 1);
    cel_preco.textContent = item.preco;
    
    criarBotaoDeletarItem(linha.insertCell(-1), item.id);
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("preco").value = "";
  
    removeElement();
  }