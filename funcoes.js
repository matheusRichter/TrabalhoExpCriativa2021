/*Variáveis e constantes*/
let produtos = [];
let repor = [];
let contador = 1;
let vencidos = 0;
let baixoEstoque = 0;
let pouco_e_vencido = 0;
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
const dashVencidos = document.getElementById('vencidos');
const dashFalta = document.getElementById('emFalta');
const dashFaltaVencido = document.getElementById('vencidosBaixoEstoque');
const dashboard = document.getElementById('dashboard');
const detailTable = document.getElementById('detail-table');

/*Funções de cadastro e exibição de produtos na tabela*/
function mostrarFormCadastro() {
    modalTitle.innerText = 'Cadastro de Produto';
    form.style.display = 'block';
    gastos.style.display = 'none';
    reposicao.style.display = 'none';
    dashboard.style.display = 'none';
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

    if ((Date.parse(produtos[produtos.length-1].validade) < Date.now()) && (produtos[produtos.length-1].Quantidade) <= 1) {
        linha.style.backgroundColor = "rgba(228, 59, 59, 0.685)";
    } else if ((Date.parse(produtos[produtos.length-1].validade) < Date.now())) {
        linha.style.backgroundColor = "orange";
    } else if ((produtos[produtos.length-1].Quantidade) <= 1) {
        linha.style.backgroundColor = "yellow";
    } else {
        linha.style.backgroundColor = "";
    }
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
            if (Date.parse(element.validade) < Date.now()) vencidos++;
            if (element.Quantidade <= 1) baixoEstoque++;
            if (Date.parse(element.validade) < Date.now() && element.Quantidade <= 1) pouco_e_vencido++;
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

        if ((Date.parse(repor[i].validade) < Date.now()) && (repor[i].Quantidade) <= 1) {
            linha.style.backgroundColor = "rgba(228, 59, 59, 0.685)";
        } else if ((Date.parse(repor[i].validade) < Date.now())) {
            linha.style.backgroundColor = "orange";
        } else if ((repor[i].Quantidade) <= 1) {
            linha.style.backgroundColor = "yellow";
        } else {
            linha.style.backgroundColor = "";
        }
    }
    modalTitle.innerText = 'Produtos a Repor';
    form.style.display = "none";
    gastos.style.display = "none";
    reposicao.style.display = "block";
    dashboard.style.display = 'none';
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
    dashboard.style.display = 'none';

    let gasto = calcularGasto();
    gastoTotal.innerText = gasto == undefined ? 'Você não possui histórico.' : 'Gasto total: R$' + gasto;

    let estoque = mostraEsoque()
    let estoque2 = ''
    for (let i = 0; i < estoque.length; i++) {
        estoque2 += i+1 + ' - ';
        estoque2 += 'Produto: ' + estoque[i].Nome + ' | ';
        estoque2 += 'Validade: ' + estoque[i].validadeM + ' | ';
        estoque2 += 'Estoque: ' + estoque[i].Quantidade;
        estoque2 += '\n'
    }
    tableE.innerText = 'Produtos em estoque: \n' + estoque2;

    let valEcon = calcularEconomiaPrevisao(gasto);
    economia.innerText = 'Economia na próxima compra: R$' + valEcon;
    economia.style.backgroundColor = "lightgreen";

    let prevGasto = calcularEconomiaPrevisao();
    previsao.innerText = 'Gasto na próxima compra: R$' + prevGasto;
    previsao.style.backgroundColor = "orange";
}

function calcularEconomiaPrevisao(gastoTotal = 0) {
    listarReposicoes();
    let valorEcon = 0;
    for (let p in repor) {
        valorEcon += parseFloat(repor[p].Preco) * parseInt(repor[p].Quantidade)
    }
    return Math.abs(gastoTotal - valorEcon).toFixed(2);
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

/*Funções de exibição do dashboard*/
function mostrarDash() {
    modalTitle.innerText = 'Dashboard';
    form.style.display = "none";
    gastos.style.display = "none";
    reposicao.style.display = "none";
    dashboard.style.display = 'block';

    listarReposicoes();

    dashFalta.innerText = 'Baixo estoque: \n' + baixoEstoque;
    dashVencidos.innerText = 'Vencidos: \n' + vencidos;
    dashFaltaVencido.innerText = 'Vencidos e com Baixo estoque: \n' + pouco_e_vencido;
}

function listarCategoria(id) {
    listarReposicoes();
    limparCategoria();
    for (let i = 0; i < repor.length; i++) {
        const linha = detailTable.insertRow(i+1);
        let c1 = linha.insertCell(0);
        let c2 = linha.insertCell(1);
        let c3 = linha.insertCell(2);

        switch(id) {
            case 1:
                if (Date.parse(repor[i].validade) < Date.now()){
                    c1.innerHTML = repor[i].Nome;
                    c2.innerHTML = repor[i].validadeM;
                    c3.innerHTML = repor[i].Quantidade;
                }
            break;
            case 2:
                if (repor[i].Quantidade <= 1){
                    c1.innerHTML = repor[i].Nome;
                    c2.innerHTML = repor[i].validadeM;
                    c3.innerHTML = repor[i].Quantidade;
                }
            break;
            case 3:
                if (repor[i].Quantidade <= 1 && Date.parse(repor[i].validade) < Date.now()){
                    c1.innerHTML = repor[i].Nome;
                    c2.innerHTML = repor[i].validadeM;
                    c3.innerHTML = repor[i].Quantidade;
                }
            break;
        }
    }
}

function limparCategoria() {
    let length = detailTable.rows.length;
    for (let i = 1; i < length; i++) {
        detailTable.deleteRow(1);
    }
}