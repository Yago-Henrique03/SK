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
            console.log("Produto adicionado ao carrinho");
        }).fail(function (xhr) {
            alert("Erro ao remover")
        });
    }

    var removeFromCart = function (Id) {
        $.get(config.urls.removeCart, {
            id: Id
        }).done(function (data) {
            console.log("Produto removido do carrinho");
            $(`#${Id}`).slideUp();
        }).fail(function (xhr) {
            alert("Erro ao remover")
        });
    }

    var Increment = function (Id) {
        $.get(config.urls.Increment, {
            id: Id
        }).done(function (data) {
            console.log(`${Id} - Incrementado`);
            let quantity = $(`#ChangeQuantity-${Id}`).text();
            console.log(quantity)

            let newQuantity = parseInt(quantity) + 1
            console.log(newQuantity)
            $(`#ChangeQuantity-${Id}`).text(newQuantity);

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
                console.log(`${Id} - Incrementado`);
                let quantity = $(`#ChangeQuantity-${Id}`).text();
                console.log(quantity)

                let newQuantity = parseInt(quantity) - 1
                console.log(newQuantity)
                $(`#ChangeQuantity-${Id}`).text(newQuantity);

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