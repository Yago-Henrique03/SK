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
        event.preventDefault();

        var produto = {
            Nome_Produto: $("#Nome_Produto").val(),
            Preco: +$("#Preco").val().toDecimal(),
            ImageUrl: $("#ImageUrl").val(),
            Tipo: $("#Tipo").val()
        }

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

        $.post(`/Admin/Post`, {
            Nome_Produto: produto.Nome_Produto,
            Preco: produto.Preco,
            ImageUrl: produto.ImageUrl,
            Tipo: produto.Tipo
        }, 'json')
        .done(function (data) {
            alert('Inserido com sucesso!');
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert('Ocorreu um erro durante a inserção.');
        });

    }


    return {
        init: init,
        enviaDados: enviaDados,
    };
})();