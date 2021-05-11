/*Variáveis e constantes*/
let produtos = [];
let contador = 1;
const form = document.getElementById('form-cadastro');
const table = document.getElementById('content-table');

/*Funções de cadastro e exibição de produtos na tabela*/
function cadastrar(form){
    let dataVal = form.validade.value;
    dataVal = dataVal.split('-');
    dataVal = dataVal[2] + '/' + dataVal[1] + '/' + dataVal[0];
    produtos.push({"Nome":form.nome.value, "Categoria":form.categoria.value, "Marca":form.marca.value, "Preco":form.preco.value, "validade":dataVal, "Quantidade":form.quantidade.value});

    addToTable();

    //alert(produtos.length);
}

function addToTable(){
    
    const linha = table.insertRow(contador);
    let c1 = linha.insertCell(0);
    let c2 = linha.insertCell(1);
    let c3 = linha.insertCell(2);
    let c4 = linha.insertCell(3);
    let c5 = linha.insertCell(4);

    c1.innerHTML = produtos[produtos.length-1].Nome;
    c2.innerHTML = produtos[produtos.length-1].validade;
    c3.innerHTML = produtos[produtos.length-1].Quantidade;
    c4.innerHTML = produtos[produtos.length-1].Preco;
    c5.innerHTML = produtos[produtos.length-1].Marca;
    contador++;
}

form.addEventListener(
    "submit",
    function(event) {
        cadastrar(form);
        event.preventDefault();
    }
);