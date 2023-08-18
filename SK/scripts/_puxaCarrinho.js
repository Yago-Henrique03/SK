function puxaCarrinho() {
    $.get(`/Carrinho/lengthCarrinho`, 'json')
    .done(function (data) {
        $("#cartquantity").text(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        alert('Ocorreu um erro durante a inserção.');
    });
}