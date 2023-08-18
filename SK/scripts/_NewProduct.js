window.newProduct = (function () {

    var config = {
        urls: {
            newProductRoute: '',
        },
    };

    var init = function ($config) {
        config = $config;
    };

    var enviaDados = function(event) {
        event.preventDefault()

        var produto = {
            ProdutoId: +$("#ProdutoId").val(),
            Nome_Produto: $("#Nome_Produto").val(),
            Preco: +$("#Preco").val().toDecimal(),
            ImageUrl: $("#ImageUrl").val(),
            Tipo: $("#Tipo").val()
        }
        console.log(produto)

        if (produto.Tipo === 'Selecione um Tipo') {
            return alert("Insira um Tipo válido!");
        }

        if (produto.Preco === 0) {
            return alert("Insira um preço válido!")
        }

        if (produto.Nome_Produto === '') {
            return alert("Insira um Nome válido!")
        }

        if (produto.ImageUrl.length < 20) {
            return alert("Insira um link válido!")
        }

        //$.ajax({
        //    type: 'post',
        //    url: `/Admin/Post?&Nome_Produto=${produto.Nome_Produto}&Preco=${produto.Preco}&ImageUrl=${produto.ImageUrl}&Tipo=${produto.Tipo}`,
        //    dataType: 'json'
        //}).done(function (data) {
        //    alert('Inserido com sucesso!');
        //}).fail(function (jqXHR, textStatus, errorThrown) {
        //    alert('Ocorreu um erro durante a inserção.');
        //});

        $.post(`/Admin/Post?ProdutoId=${produto.ProdutoId}&Nome_Produto=${produto.Nome_Produto}&Preco=${produto.Preco}&ImageUrl=${produto.ImageUrl}&Tipo=${produto.Tipo}`)
        .done(function (data) {
            alert('Sucesso!');
            $("#ProdutoId").val("")
            $("#Nome_Produto").val("")
            $("#Preco").val("")
            $("#ImageUrl").val("")
            $("#Tipo").val("Selecione um Tipo")
            $("#imgToShow").attr("src", "")
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert('Ocorreu um erro durante a operação!.');
        });

    }

    var EnableID = function() {
        if ($("#ProdutoId").attr("disabled")) {
            let val = $("#ProdutoId").val()
            $("#ProdutoId").attr("disabled", false)
            $("#btn-submit").val("Editar produto")
        } else {
            $("#ProdutoId").val("")
            let val = $("#ProdutoId").val()
            $("#ProdutoId").attr("disabled", true)
            $("#btn-submit").val("Adicionar +")
        }
    }

    var showProduto = function () {
        var Id = +$("#ProdutoId").val();
        $.post(`/Admin/ListarId?id=${Id}`)
        .done(function (data) {
            $("#Nome_Produto").val(data.Nome_Produto);
            $("#Preco").val(data.Preco.toMoney());
            $("#ImageUrl").val(data.ImageUrl);
            $("#Tipo").val(data.Tipo);
            $("#imgToShow").attr("src", data.ImageUrl)
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert('Produto não existe');
        });
    }

    return {
        init: init,
        enviaDados: enviaDados,
        showProduto: showProduto,
        EnableID: EnableID
    };
})();