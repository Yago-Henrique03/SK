window.cart = (function () {

    var config = {
        urls: {
            addToCart: '',
            removeCart: '',
            Increment: '',
            Decrement: '',
        },
    };

    var init = function ($config) {
        config = $config;
    };

    var addCart = function (Id) {
        $.get(config.urls.addToCart, {
            id: Id
        }).done(function (data) {
            puxaCarrinho()
        }).fail(function (xhr) {
            alert("Erro ao remover")
        });
    }

    var removeFromCart = function (Id) {
        $.get(config.urls.removeCart, {
            id: Id
        }).done(function (data) {
            // remove o produto e atualiza o preço.
            let quantity = parseInt($(`#ChangeQuantity-${Id}`).text());
            let total = parseFloat($("#Total").text().toDecimal());
            let value = parseFloat($(`#preco-${Id}`).text().toDecimal())
            let newValue = total - (value * quantity);
            $("#Total").text(newValue.toMoney());
            $(`#${Id}`).slideUp(function () {
                $(this).remove();
            });
            puxaCarrinho()
            // validação caso não exista produto no carrinho
            let valueOfDivs = $(".cart > div").length;
            let newDiv = `<div class="noHaveItems"><div><h1>Você não possui itens no carrinho</h1><p>Clique no botão "VOLTAR A SKINS" para visualizar todos os produtos</p></div><i class="ph ph-shopping-cart"></i></div>`;
            
            if (valueOfDivs === 2) {
                $(".total").slideUp();
                $(".cart").html(newDiv);
            }

        }).fail(function (xhr) {
            alert("Erro ao remover")
        });
    }

    var Increment = function (Id) {
        $.get(config.urls.Increment, {
            id: Id
        }).done(function (data) {
            //atualiza quantidade
            let newQuantity = parseInt($(`#ChangeQuantity-${Id}`).text()) + 1
            $(`#ChangeQuantity-${Id}`).text(newQuantity);

            //atualiza o total
            let total = parseFloat($("#Total").text().toDecimal());
            let value = parseFloat($(`#preco-${Id}`).text().toDecimal())
            let newValue = total + value;
            $("#Total").text(newValue.toMoney());
            puxaCarrinho()
        }).fail(function (xhr) {
            alert("Erro ao remover")
        })
    }

    var Decrement = function (Id) {
        let search = $(`#ChangeQuantity-${Id}`).text();
        if ( search == '1') {
            return alert(`Você não pode remover mais itens, para RETIRAR o item de seu carrinho clique em "REMOVER"`)
        } else {
            $.get(config.urls.Decrement, {
                id: Id
            }).done(function (data) {
                //atualiza quantidade
                let newQuantity = parseInt($(`#ChangeQuantity-${Id}`).text()) - 1
                $(`#ChangeQuantity-${Id}`).text(newQuantity);

                //atualiza o total
                let total = parseFloat($("#Total").text().toDecimal());
                let value = parseFloat($(`#preco-${Id}`).text().toDecimal())
                let newValue = total - value;
                $("#Total").text(newValue.toMoney());
                puxaCarrinho()
            }).fail(function (xhr) {
                alert("Erro ao remover")
            })
        }
    }

    return {
        init: init,
        addCart: addCart,
        removeFromCart: removeFromCart,
        Increment: Increment,
        Decrement: Decrement
    };
})();

//function removeFromCart(Id) {
//    $.get('@Url.Action("RemoveFromCart", "Home")', {
//        id: Id
//    }).done(function (data) {
//        alert("Produto removido do carrinho");
//        $(`#${Id}`).slideUp();
//    }).fail(function (xhr) {
//        alert("Erro ao remover")
//    });
//}

//function addToCart(Id) {
//    $.get('@Url.Action("AddToCart", "Home")', {
//        id: Id
//    }).done(function (data) {
//        alert("Produto adicionado ao carrinho");
//    }).fail(function (xhr) {
//        alert("Erro ao remover")
//    });
//}