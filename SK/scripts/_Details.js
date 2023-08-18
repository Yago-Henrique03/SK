window.detail = (function () {

    var config = {
        urls: {
            viewProduct: '',
        },
    };

    var init = function ($config) {
        config = $config;
    };

    var details = function (Id) {
        $.get(config.urls.viewProduct, {
            id: Id
        }).done(function (data) {
            $('#main-homepg').slideUp();
            $('#details').html(data).slideDown();
            console.log('Dados enviados com sucesso para o servidor ');
        }).fail(function (xhr) {
            console.log(xhr.responseText);
        });
    }

    var returnToSkins = function() {
        $('#details').slideUp();
        $('#main-homepg').slideDown();
        console.log("returned to skins");
    }

    return {
        init: init,
        details: details,
        returnToSkins: returnToSkins,
    };
})();
