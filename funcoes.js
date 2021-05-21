/*Variáveis e constantes*/
let produtos = [];
let repor = [];
let contador = 1;
const form = document.getElementById('form-cadastro');
const table = document.getElementById('content-table');
const gastos = document.getElementById('gastos');
const reposicao = document.getElementById('reposicao');
const tableR = document.getElementById('reposition-table');
const modalTitle = document.getElementById('modal-title');
const gastoTotal = document.getElementById('gastoTotal');
const economia = document.getElementById('economia');
const previsao = document.getElementById('previsao');
const tableE = document.getElementById('econ-table');

/*Funções de cadastro e exibição de produtos na tabela*/
function mostrarFormCadastro() {
    modalTitle.innerText = 'Cadastro de Produto';
    form.style.display = 'block';
    gastos.style.display = 'none';
    reposicao.style.display = 'none';
}

function cadastrar(form){
    let dataVal = form.validade.value;
    dataVal = dataVal.split('-');
    dataVal = dataVal[2] + '/' + dataVal[1] + '/' + dataVal[0];
    produtos.push({"Nome":form.nome.value, "Categoria":form.categoria.value, "Marca":form.marca.value, "Preco":form.preco.value, "validadeM":dataVal, validade:form.validade.value ,"Quantidade":form.quantidade.value});

    addToTable();
}

function addToTable(){
    
    const linha = table.insertRow(contador);
    let c1 = linha.insertCell(0);
    let c2 = linha.insertCell(1);
    let c3 = linha.insertCell(2);
    let c4 = linha.insertCell(3);
    let c5 = linha.insertCell(4);

    c1.innerHTML = produtos[produtos.length-1].Nome;
    c2.innerHTML = produtos[produtos.length-1].validadeM;
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

/*Funções de exibição de produtos que nesecitam de reposição*/
function listarReposicoes() {
    produtos.forEach(element => {
        if ((Date.parse(element.validade) < Date.now() || element.Quantidade <= 1) && !repor.includes(element)) {
            repor.push(element);
        }
    });
}

function mostrarReposicoes() {
    listarReposicoes();
    limparReposicao();
    for (let i = 0; i < repor.length; i++) {
        const linha = tableR.insertRow(i+1);
        let c1 = linha.insertCell(0);
        let c2 = linha.insertCell(1);
        let c3 = linha.insertCell(2);

        c1.innerHTML = repor[i].Nome;
        c2.innerHTML = repor[i].validadeM;
        c3.innerHTML = repor[i].Quantidade;
    }
    modalTitle.innerText = 'Produtos a Repor';
    form.style.display = "none";
    gastos.style.display = "none";
    reposicao.style.display = "block";
}

function limparReposicao() {
    let length = tableR.rows.length;
    for (let i = 1; i < length; i++) {
        tableR.deleteRow(1);
    }
}

/* Funçãoes de exibição de gastos e previsões */
function calcularGasto() {
    let total = 0;
    for (let produto in produtos) {
        total += parseFloat(produtos[produto].Preco) * parseInt(produtos[produto].Quantidade);
    }
    return total;
}

function mostrarGasto() {
    modalTitle.innerText = 'Gastos e Previsões';
    form.style.display = "none";
    gastos.style.display = "block";
    reposicao.style.display = "none";

    let gasto = calcularGasto();
    gastoTotal.innerText = gasto == undefined ? 'Você não possui histórico.' : 'Gasto total: R$' + gasto;

    let valEcon = calcularEconomiaPrevisao(gasto);
    economia.innerText = 'Valor de economia para a próxima compra: R$' + valEcon;

    let prevGasto = calcularEconomiaPrevisao();
    previsao.innerText = 'Valor previsto de gasto para a próxima compra: R$' + prevGasto;

    let estoque = mostraEsoque()
    let estoque2 = ''
    for (let i = 0; i < estoque.length; i++) {
        estoque2 += 'Nome: ' + estoque[i].Nome + ' ';
        estoque2 += 'Validade: ' + estoque[i].validadeM + ' ';
        estoque2 += 'Quantidade: ' + estoque[i].Quantidade;
        estoque2 += '\n'
    }
    tableE.innerText = 'Você poderá ecnomizar com: \n' + estoque2
}

function calcularEconomiaPrevisao(gastoTotal = 0) {
    listarReposicoes();
    let valorEcon = 0;
    for (let p in repor) {
        console.log(repor[p])
        valorEcon += parseFloat(repor[p].Preco) * parseInt(repor[p].Quantidade)
    }
    return Math.abs(gastoTotal - valorEcon)
}

function mostraEsoque() {
    let estoque = []
    listarReposicoes()
    for (let p in produtos) {
        if (!repor.includes(produtos[p])) {
            estoque.push(produtos[p])
        }
    }
    return estoque
}