let produtos = [];

function cadastrar(form){

    produtos.push({"Nome":form.nome.value, "Categoria":form.categoria.value, "Marca":form.marca.value,
        "Preco":form.preco.value, "validade":form.validade.value, "Quantidade":form.quantidade.value});

    console.log(produtos);

    event.preventDefault();
}

function mostrar(){
    return produtos;
}