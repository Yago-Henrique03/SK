var ui = (function ($) {
    // PROTOTYPES
    (function () {
        Object.defineProperty(Object.prototype, 'progressCard', {
            value: function (card, button, style) {
                card = typeof card === 'string' ? $(card) : card;
                style = style || 'linear';

                if (!$(card).find('.ui-progress-' + style).length)
                    $(card).prepend(style === 'radial' ? ui.progressRadial : ui.progressLinear);

                if (button) {
                    button = typeof button === 'string' ? $(button) : button;
                    button.prop('disabled', true);
                }

                var always = this.always.bind({});
                this.always = function () {
                    $(card).find('.ui-progress-' + style).remove();
                    if (button)
                        button.prop('disabled', false);

                    always();
                };
                return this;
            },
            enumerable: false,
            writable: true
        });

        String.prototype.toMoney = function () {
            var re = '\\d(?=(\\d{3})+\\D)';
            return this.replace('.', ',').replace(new RegExp(re, 'g'), '$&' + ('.'));
        };
        String.prototype.toPercent = function () {
            var re = '\\d(?=(\\d{3})+\\D)';
            return this.replace('.', ',').replace(new RegExp(re, 'g'), '$&' + ('.'));
        };
        String.prototype.toDecimal = function () {
            return this.replace(/\./g, '').replace(',', '.');
        }
        String.prototype.padLeft = function (length, caracter) {
            var str = this.toString();
            if (!caracter) caracter = '0';

            while (str.length < length)
                str = caracter + str;

            return str;
        };
        String.prototype.padRight = function (length, caracter) {
            var string = this.toString();
            if (!caracter) caracter = '0';

            while (string.length < length)
                string = string + caracter;

            return string;
        };
        String.prototype.isValidDate = function () {
            return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(this);
        };
        String.prototype.isValidMonthYear = function () {
            var parts = this.split('/');
            return parts.length === 2
                && parts[0].length === 2 // tamanho do mes
                && parts[1].length === 4 // tamanho do ano
                && +parts[0] > 0 && +parts[0] < 13 // meses validos
                && +parts[1] >= 1970 && +parts[1] <= 2100; // anos validos
        };
        String.prototype.isValidCpf = function () {
            var cpf = this.replace(/\.|\-|\//g, "").padLeft(11);

            var digitosIguais = 1;
            for (var i = 0; i < cpf.length - 1; i++)
                if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                    digitosIguais = 0;
                    break;
                }

            if (digitosIguais)
                return false;

            var numeros = cpf.substring(0, 9),
                digitos = cpf.substring(9),
                soma = 0,
                resultado;

            for (var i = 10; i > 1; i--)
                soma += numeros.charAt(10 - i) * i;

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0))
                return false;

            numeros = cpf.substring(0, 10);
            soma = 0;

            for (var i = 11; i > 1; i--)
                soma += numeros.charAt(11 - i) * i;

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(1))
                return false;

            return true;
        };
        String.prototype.isValidCnpj = function () {
            var cnpj = this.replace(/\.|\-|\//g, "").padLeft(14);

            if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" ||
                cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999")
                return false;

            var tamanho = cnpj.length - 2,
                numeros = cnpj.substring(0, tamanho),
                digitos = cnpj.substring(tamanho),
                soma = 0,
                pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;

            return true;
        };
        String.prototype.isValidEmail = function () {
            return this.match(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
        };
        String.prototype.isValidPix = function (tipoChave) {
            var chavePix = this;

            var errorMessage = null;
            switch (tipoChave) {
                case 1: // Telefone
                    if (chavePix.length != 15)
                        errorMessage = 'Telefone inválido';
                    break;
                case 2: // E-mail
                    if (!chavePix.isValidEmail())
                        errorMessage = 'E-mail inválido';
                    break;
                case 3: // CPF/CNPJ
                    if (chavePix.length != 14 && chavePix.length != 18)
                        errorMessage = 'CPF/CNPJ inválido';
                    else if (chavePix.length == 14 && !chavePix.isValidCpf())
                        errorMessage = 'CPF inválido';
                    else if (chavePix.length == 18 && !chavePix.isValidCnpj())
                        errorMessage = 'CNPJ inválido';
                    break;
                case 4: // Chave Aleatória
                    if (chavePix.length != 36)
                        errorMessage = 'Deve possuir 36 caracteres';
                    break;
                default:
                    errorMessage = 'Tipo Chave não informado';
                    break;
            }

            return errorMessage;
        };
        String.prototype.toDate = function () {
            if (this != "" && !this.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/))
                console.error("parseDate: A data '" + this + "' é inválida!");
            return new Date(parseInt(this.substr(6)), parseInt(this.substr(3, 2) - 1), parseInt(this.substr(0, 2)));
        };
        String.prototype.toShortDateString = function () {
            return new Date(+this.replace(/[^\d]/g, '')).toShortDateString();
        };
        Date.prototype.toShortDateString = function () {
            return this.getDate().toString().padLeft(2) + "/" + (this.getMonth() + 1).toString().padLeft(2) + "/" + this.getFullYear();
        };
        Date.prototype.addDays = function(num) {
            var value = this.valueOf();
            value += 86400000 * num;
            return new Date(value);
        };
        Number.prototype.toMoney = function () {
            var re = '\\d(?=(\\d{3})+\\D)',
                num = this.toFixed(2);
            return num.replace('.', ',').replace(new RegExp(re, 'g'), '$&' + ('.'));
        };
        Number.prototype.toPercent = function () {
            var re = '\\d(?=(\\d{3})+\\D)',
                num = this.toFixed(5);
            return num.replace('.', ',').replace(new RegExp(re, 'g'), '$&' + ('.'));
        };
    })();

    var fix = (function () {
        function inputContainer() {
            $('.ui-input-container').each(function () {
                var container = $(this);
                if (container.children('.ui-input-wrap').length) {
                    container.find('.ui-control').fixLabel();
                    return;
                }

                container.wrapInner('<div class="ui-input-wrap"></div>').children('.ui-input-wrap').append('<div class="line"></div>');

                var input = container.find('.ui-control');
                if (input.is('.required'))
                    input.toggleClass('ui-invalid', !input.val());

                input.fixLabel();
            });
        }

        function textArea() {
            $('textarea').each(function () {
                var textarea = $(this),
                    div = textarea.parent();

                if (div.find('.ui-messages').length)
                    return;

                if (textarea.attr('readonly'))
                    return;

                var maxlength = +textarea.attr("maxlength") || 0;
                if (!maxlength)
                    return;

                div.append($('<div/>', {
                    'class': 'ui-messages',
                    html: $('<div/>', { 'class': 'ui-message counter' }).text(textarea.val().length + '/' + maxlength)
                }));

                textarea.on('input', function () {
                    var length = textarea.val().length;
                    div.find('.ui-message.counter').text(length + '/' + maxlength).toggleClass('error', length == maxlength);
                });
            });
        }

        function tableCheckbox() {
            $('table[data-checkbox]').each(function () {
                var table = $(this),
                    title = table.data('checkbox'),
                    onUpdateSelects = table.data('on-update-selects');
                if (!title)
                    return;

                if (table.siblings('.ui-toolbar').length || (table.parent().is('.ui-data-table-scroll') && table.parent().siblings('.ui-toolbar').length))
                    return;

                table[0].updateSelecteds = function () {
                    table.find('tbody tr').removeClass('background-blue');

                    var inputCheckeds = table.find('tbody input:checkbox:checked');
                    inputCheckeds.closest('tr').addClass('background-blue');

                    var toolbar = table.siblings('.ui-toolbar');
                    if (!inputCheckeds.length) {
                        toolbar.removeClass('selected');
                        toolbar.find('button').hide();
                        toolbar.find('div.title').html(title).show();
                    } else {
                        toolbar.addClass('selected');
                        toolbar.find('button').show();

                        var inputLengthTitle = inputCheckeds.length + ' itens selecionados';
                        if (inputCheckeds.length == 1)
                            inputLengthTitle = '1 item selecionado';
                        if (table.find('thead input:checkbox').is(':checked'))
                            inputLengthTitle = 'Todos os itens estão selecionados';

                        toolbar.find('div.title').html(inputLengthTitle).show();
                    }

                    if (onUpdateSelects && typeof (window[onUpdateSelects]) === 'function')
                        window[onUpdateSelects]();
                };

                (table.parent().is('.ui-data-table-scroll') ? table.parent() : table).before($('<div/>', {
                    'class': 'ui-toolbar flat',
                    html: $('<button/>', {
                        'class': 'ui-button primary icon flat',
                        type: 'button',
                        style: 'display: none;',
                        'data-tooltip': 'Cancelar seleção',
                        html: '<i class="material-icons">close</i>',
                        click: function () {
                            table.find('tr').removeClass('background-blue').find('input:checkbox').prop('checked', false);
                            table[0].updateSelecteds();                            
                        }
                    }).add($('<div/>', {
                        'class': 'title',
                        html: title
                    }))
                }));
            });
        }

        function mask() {
            $('input[data-type]').each(function () { applyMask($(this)); });
        }

        function option() {
            $('.ui-option').each(function () {
                if (!$(this).find('.ui-option-shell').length)
                    $(this).data('ui-option-shell', true)
                        .wrapInner('<label></label>')
                        .find('input')
                        .after('<div class="ui-option-shell"><div class="ui-option-fill"></div><div class="ui-option-mark"></div></div>');
            });
        }

        function contextMenu() {
            $('.ui-contextmenu').each(function () {
                if (!$(document.body).find('[data-cm="' + $(this).prop('id') + '"]').length)
                    $(this).remove();
            });
        }

        function radioTipoPessoa() {
            $('div[data-tipo-pessoa]').each(function () {
                $(this).find('input:radio:checked').trigger('click');
            });
        }

        function inputFile() {
            $('.ui-input-container input:file').each(function () {
                var input = $(this);
                if (input.siblings('input:text').length)
                    return;

                var paramsInput = {
                    type: 'text',
                    'class': 'ui-control' + (input.is('.required') ? ' required' : ''),
                    name: input.attr('name') + '_Name',
                    value: input.attr('value'),
                    readonly: ''
                };

                if (input.prop('disabled'))
                    paramsInput['disabled'] = true;
                else 
                    paramsInput['style'] = 'cursor: pointer; border-style: solid !important;';

                var inputText = $('<input/>', paramsInput);

                var icon = $('<div/>', { 'class': 'suffix material-icons light', style: 'cursor: pointer;', html: 'file_upload' });

                input.addClass('ui-input-file-hidden').after(inputText).after(icon);

                var accept = input.attr('accept').toUpperCase().split(','),
                    types = accept.length == 2 ? accept[0] + ' e ' + accept[1] : accept.join(', ');

                if (accept.length) {
                    input.alert('Insira arquivos somente ' + (accept.length == 1 ? 'do tipo' : 'dos tipos') + ' ' + types);
                    input.closest('.ui-input-container').find('.ui-messages').addClass('fixed');
                }

                input.on('change', function () {
                    var fileName = input.val().split('\\').pop(),
                        extension = fileName ? fileName.split('.').pop().toUpperCase() : null;

                    if (extension && accept.every(function (ext) { return ext != '.' + extension; })) {
                        ui.toast('Apenas formatos do tipo "' + types + '" são permitidos');
                        input.val(fileName = '');
                    }

                    inputText.val(fileName);
                });

                inputText.add(icon).on('click', function () {
                    input.trigger('click');
                });
            });
        }

        function foneDdi() {
            $('input[data-type="foneddi"]').trigger('blur');
        }

        function tipoChavePix() {
            $('select[data-pix]').trigger('change');
        }

        return {
            inputContainer: inputContainer,
            textArea: textArea,
            tableCheckbox: tableCheckbox,
            mask: mask,
            option: option,
            contextMenu: contextMenu,
            radioTipoPessoa: radioTipoPessoa,
            inputFile: inputFile,
            foneDdi: foneDdi,
            all: function () {
                inputContainer();
                textArea();
                tableCheckbox();
                mask();
                option();
                contextMenu();
                radioTipoPessoa();
                inputFile();
                foneDdi();
                tipoChavePix();
            },
        };
    })();

    $(fix.all);

    function applyMask(input) {
        var mascaraCpfCnpj = function (val) {
            return val.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009';
        }, optionsCpfCnpj = {
            onKeyPress: function (val, e, field, options) {
                field.mask(mascaraCpfCnpj.apply({}, arguments), options);
            }
        }

        switch (input.attr('data-type')) {
            case 'cep': input.mask('00000-000'); break;
            case 'cepDadosCadastrais': input.mask('00000-000'); break;
            case 'cpf': input.mask('000.000.000-00'); break;
            case 'cnpj': input.mask('00.000.000/0000-00'); break;
            case 'cpfcnpj': input.mask(mascaraCpfCnpj, optionsCpfCnpj); break;
            case 'number': input.mask('#0', { maxlength: false, reverse: true }); break;
            case 'numeroCcb': input.mask('0000000/00', { maxlength: true, reverse: true }); break;
            case 'ano': input.mask('0000', { maxlength: true, reverse: true }); break;
        }
    }

    $.ajaxSetup({ cache: false });
    $(document).on('ajaxComplete', function () {
        fix.all();
    });

    // EVENTS
    $(document).on('reset', 'form', function () {
        $(this).find('.ui-control').removeClass('ui-dirty').addClass('ui-empty').fixLabel();
        $(this).find('.ui-messages:not(.fixed)').remove();
    }).on('click', '.expand-container .expand-action', function (e) {
        e.stopPropagation();
        if ($(e.target).is('[data-no-action]') || $(e.target).closest('[data-no-action]').length)
            return;

        $(this).closest('.expand-container').toggleClass('opened').find('.expand-content').stop().slideToggle(220);
    }).on('blur', 'input[data-type]', function () {
        var input = $(this),
            value = input.val().trim(),
            condition = false;

        switch (input.attr('data-type')) {
            case 'data':
                condition = value && !value.isValidDate();
                input.is('[data-toast]') && condition ? ui.toast('Data inválida!') : input.alertError(condition, 'Data inválida');
                break;
            case 'mesano': condition = input.alertError(value && !value.isValidMonthYear(), 'Mês/Ano inválido'); break;
            case 'cpf': condition = input.alertError(value && !value.isValidCpf(), 'CPF inválido'); break;
            case 'cnpj': condition = input.alertError(value && !value.isValidCnpj(), 'CNPJ inválido'); break;
            case 'email': condition = input.alertError(value && !value.isValidEmail(), 'E-mail inválido'); break;
            case 'fone':
            case 'foneddd':
            case 'foneddi':
                var invalid;
                if (!value || (input.attr('data-type') === 'foneddi' && value === '+55'))
                    break;

                var fone = value.split(' ');
                for (var i = fone.length - 1; i >= 0; i--)
                // ddi -> validar com 3 digitos
                // ddd -> validar com 2 digitos
                // numero -> validar com 8 digitos ou com 7 para USA e Russia, que tem ddi menor
                    if ((invalid = fone[i].replace(/[^\d]+/g, '').length
                        < (i === 0 ? 0 : i === 1 ? 2 : value.indexOf('+1') > -1 || value.indexOf('+7') > -1 ? 7 : 8)))
                        break;

                condition = $(this).alertError(invalid, 'Telefone inválido');
                break;
            case 'pix':
                if (value) {
                    var id = input.attr('id'),
                        tipoChave = +$('select[data-pix="' + id + '"]').val();

                    var errorMessage = value.isValidPix(tipoChave);
                    if (errorMessage)
                        condition = input.alertError(true, errorMessage);
                }

                break;
        }

        if (condition)
            $(this).val("");
    }).on('input', 'input[data-type="data"]', function () {
        $(this).mask("00/00/0000");
    }).on('input', 'input[data-type="mesano"]', function () {
        $(this).mask("00/0000", { reverse: true });
    }).on('input', 'input[data-type="ano"]', function () {
        $(this).mask("0000", { reverse: true, maxlength: true });
    }).on('input', 'input[data-type="money"]', function () {
        $(this).mask("##.#00,00", { reverse: true, maxlength: false });
    }).on('input', 'input[data-type="fone"]', function () {
        $(this).mask($(this).val().length <= 9 ? "0000-0000#" : "00000-0000");
    }).on('input', 'input[data-type="foneddd"]', function () {
        $(this).mask($(this).val().length <= 14 ? "(00) 0000-0000#" : "(00) 00000-0000");
    }).on('input', 'input[data-type="foneddi"]', function () {
        var value = $(this).val();
        // ddis com 1 digito
        if (value.length && (value.indexOf('+1') > -1 || value.indexOf('+7') > -1))
            return $(this).mask(value.length <= 17 ? "+0 (000) 000-0000#" : "+0 (000) 0000-0000");

        // ddis com 2 digitos
        if (value.length > 2) {
            var ddi = +value.substring(0, 3).replace('+', '');
            if ([20, 27, 30, 31, 32, 33, 34, 36, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58,
                60, 61, 62, 63, 64, 65, 66, 81, 82, 83, 84, 86, 90, 91, 92, 93, 94, 95, 98].indexOf(ddi) > -1)
                return $(this).mask(value.length <= 18 ? "+00 (00) 0000-0000#" : "+00 (00) 00000-0000");
        }

        // restante sao os ddis com 3 digitos
        return $(this).mask(value.length <= 19 ? "+000 (00) 0000-0000#" : "+000 (00) 00000-0000");
    }).on('blur', 'input[data-type="foneddi"]', function () {
        if (!$(this).val())
            $(this).val('+55').trigger('change');
    }).on('blur', 'input[data-type="cep"], input[data-type="cepDadosCadastrais"]', function () {
        var input = $(this),
            inputId = input.prop("id");

        if (!input.val()) {
            $('input[data-cep^="' + inputId + '"], select[data-cep^="' + inputId + '"]').val('');
            input.attr('data-last-value', "");
            return;
        }

        var numeroCep = +input.val().replace('-', '').padLeft(8);
        if (input.is('[data-last-value]') && numeroCep == +input.attr('data-last-value'))
            return;

        $.get(ui.cepUrl, {
            numeroCep: numeroCep 
        }).done(function (data) {
            ui.fillCep(inputId, JSON.parse(data), input.attr('data-type') === 'cepDadosCadastrais');
        }).fail(function (xhr) {
            $('input[data-cep^="' + inputId + '"], select[data-cep^="' + inputId + '"]').val('');
            ui.blockCepFields(inputId, false);
            ui.toast("Não foi possível pesquisar o CEP: " + (xhr.responseText || ''));
        }).always(function () {
            input.attr('data-last-value', numeroCep);
        });
    }).on('focus', 'input[data-type="data"]', function () {
        if (!$(this).is('[readonly]'))
            $(this).datepicker({ changeMonth: true, changeYear: true });
    }).on('click', 'div[data-tipo-pessoa] input:radio', function () {
        var tipoPessoa = $(this).closest('div[data-tipo-pessoa]').attr('data-tipo-pessoa').split(';'),
            checked = $(this).val(),
            input = $('#' + tipoPessoa[0]);

        applyMask(input.attr('data-type', checked == 'F' ? 'cpf' : 'cnpj').val(input.val().length ? input.val() : '').trigger('blur'));
        $('label[for="' + tipoPessoa[0] + '"]').text(checked == 'F' ? 'CPF' : 'CNPJ');
        if (tipoPessoa[1])
            $('label[for="' + tipoPessoa[1] + '"]').text(checked == 'F' ? 'Nome' : 'Nome Fantasia');
    }).on('click', 'table[data-checkbox] thead input:checkbox', function () {
        var table = $(this).closest('table');
        table.find('tbody input:checkbox:not([exclude-check-all])').prop('checked', $(this).is(':checked'));
        table[0].updateSelecteds();
    }).on('click', 'table[data-checkbox] tbody tr, table[data-checkbox] tbody input:checkbox', function (e) {
        if ($(this).is('tr')) {
            if ($(this).is('[not-checkbox]'))
                return;
            var checkbox = $(this).find('input:checkbox');
            checkbox.prop('checked', !checkbox.prop('checked'));
        }

        var table = $(this).closest('table'),
            divs = table.find('tbody input:checkbox:not([exclude-check-all])');

        table.find('thead input:checkbox').prop('checked', divs.length == divs.filter(':checked').length);
        table[0].updateSelecteds();
    }).on('change blur', '.ui-control', function () {
        $(this).fixLabel();
    }).on('input blur', '.ui-control', function () {
        var input = $(this);
        input.addClass('ui-dirty');
        if (input.is('.required') && !input.val())
            input.addClass('ui-invalid');
        else
            input.removeClass('ui-invalid');
    }).on('input', '.textarea-expand', function () {
        $(this).css('height', '0px').css('height', this.scrollHeight + 'px');
    }).on('mouseenter', '[data-tooltip]', function () {
        var tooltipRef = $(this),
            text = tooltipRef.attr('data-tooltip'),
            direction = (tooltipRef.attr('data-direction') || 'bottom').toLowerCase();

        if (!text)
            return;

        if (!tooltipRef.data('tooltipRef'))
            tooltipRef.data('tooltipRef', $('<div/>', { 'class': 'ui-tooltip ' + direction }));

        tooltip = tooltipRef.data('tooltipRef').clone();
        tooltip.html(text).on('mouseleave', function () {
            $(this).fadeOut(75, function () { $(this).remove(); });
        });

        $(document.body).prepend(tooltip);
        tooltipRef.data('tooltipRefClone', tooltip);

        var elementPosition = tooltipRef.offset(),
            position = {};

        var shortDirection = direction[0].toUpperCase();
        if (shortDirection === 'T' || shortDirection === 'B') {
            position.left = (elementPosition.left + tooltipRef.outerWidth() / 2) - (tooltip.outerWidth() / 2);
            position.top = elementPosition.top;

            if (shortDirection === 'B')
                position.top += tooltipRef.outerHeight();
            else
                position.top -= tooltip.outerHeight();
        }

        if (shortDirection === 'L' || shortDirection === 'R') {
            position.top = (elementPosition.top + tooltipRef.outerHeight() / 2) - (tooltip.outerHeight() / 2);
            position.left = elementPosition.left;

            if (shortDirection === 'L')
                position.left -= tooltip.outerWidth();
            else
                position.left += tooltipRef.outerWidth();
        }

        tooltip.css({ top: position.top, left: position.left });
        setTimeout(function () { tooltip.addClass('show'); }, 10);
    }).on('mousedown mouseleave', '[data-tooltip]', function () {
        var tooltipRef = $(this),
            tooltip = tooltipRef.data('tooltipRefClone');
        if (tooltip && tooltip.length)
            tooltip.trigger('mouseleave');
    }).on("change", "select[data-pix]", function (e) {
        var input = $(this),
            tipoChavePix = +input.val(),
            inputChavePix = $('#' + input.attr('data-pix')),
            chavePix = inputChavePix.val();

        if (e.isTrigger !== 3)
            inputChavePix.val('');

        inputChavePix.prop('disabled', false).removeClass('ui-invalid').siblings('.ui-messages').remove();
        inputChavePix.unmask();

        switch (tipoChavePix) {
            case 1:
                inputChavePix.mask('(00) 00000-0000');
                break;
            case 2:
                break;
            case 3:
                var getMask = function (text) {
                    text = (text || '').replace(/\D+/g, '');
                    return text.length < 3 ? 'X#' : text.length <= 11 ? '000.000.000-009999' : '00.000.000/0000-00';
                };

                inputChavePix.removeAttr('placeholder').mask(getMask(chavePix), {
                    translation: { X: { pattern: /./ } },
                    onKeyPress: function (value, e, field, options) {
                        inputChavePix.mask(getMask(value), options);
                    }
                });
                break;
            case 4:
                inputChavePix.mask('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
                break;
            default:
                inputChavePix.prop('disabled', true);
                break;
        }
    });

    // FUNCTIONS JQUERY
    $.fn.fixLabel = function () {
        $(this).each(function () {
            $(this).toggleClass('ui-empty', !$(this).val());
        });
        return $(this);
    };

    $.fn.fixMask = function () {
        $(this).each(function () {
            applyMask($(this));
        });
        return $(this);
    };

    $.fn.autoScroll = function (time) {
        $('html, body').animate({ scrollTop: $(this).offset().top }, time || 280);
    };

    $.fn.tabs = function (options) {
        options = options || {};
        $(this).each(function () {
            var container = $(this),
                containerOptions = container.data('options') || {};

            var optionsTab = $.extend({
                active: undefined,
                title: [],

                onload: undefined,
                onclick: undefined,
                onclose: undefined,

                removable: [],

                show: [],
                hide: [],

                enable: [],
                disable: [],

                add: undefined // { title: '', content: '', removable: false, focus: true }
            }, { onload: containerOptions.onload, onclick: containerOptions.onclick }, options);

            function addTab(title, content, removable) {
                var tab = $('<div/>', { 'class': 'tab', html: title });

                if (typeof content === 'string')
                    container.find('> .tabs-content').append(content = $('<div/>', { 'class': 'tab-content', html: content }).hide());

                if (removable)
                    tab.append($('<i/>', { 'class': 'light material-icons s-18', style: 'margin-left: 8px; position: relative; top: -1px;', html: 'close' }));

                container.find('> .tabs-header .tabs-container .tabs').append(tab);
            }

            if (!container.is('.ui-tabs')) {
                container.addClass('ui-tabs').children('div').addClass('tab-content');
                container.wrapInner('<div class="tabs-content"></div>');

                var header = $('<div/>', { 'class': 'tabs-header' }),
                    tabs = $('<div/>', { 'class': 'tabs' });

                header.html($('<div/>', { 'class': 'tabs-container', html: tabs }).append('<div class="ink-bar" style="display: none;"></div>'));
                container.prepend(header);

                container.find('.tab-content').each(function (i) {
                    addTab($(this).attr('title') || optionsTab.title[i] || 'Tab ' + i, $(this), optionsTab.removable[i]);
                    $(this).removeAttr('title');
                });

                header.on('click', '.tabs-container .tabs .tab:not(.disabled)', function () {
                    if (!$(this).is('.active'))
                        activeTab($(this));
                }).on('click', '.tabs-container .tabs .tab i', function (e) {
                    e.stopPropagation();

                    var tab = $(this).closest('.tab'),
                        index = tab.index(),
                        tabContent = container.find('> .tabs-content > .tab-content').eq(index),
                        tabClone = tab.clone(),
                        tabContentClone = tabContent.clone(),
                        tabsLength = tab.parent().find('.tab').length;

                    if (tab.is('.active')) {
                        var tabToActive = tab.parent().find('.tab').eq(index > 0 ? index - 1 : index + 1);
                        if (tabToActive.length)
                            activeTab(tabToActive);
                    }

                    tabContent.remove();
                    tab.remove();

                    if (typeof options.onclose === 'function')
                        options.onclose(index, tabsLength - 1, tabContentClone, tabClone);
                });
            }

            if (optionsTab.add)
                addTab(optionsTab.add.title || 'New Tab', optionsTab.add.content, optionsTab.add.removable);

            optionsTab.header = container.children('.tabs-header');
            optionsTab.tabs = optionsTab.header.find('.tab');
            container.data('options', optionsTab);

            if (optionsTab.add && (typeof optionsTab.add.focus === 'undefined' || optionsTab.add.focus))
                optionsTab.active = optionsTab.tabs.length - 1;

            function activeTab(tab) {
                var options = tab.closest('.ui-tabs').data('options');
                var active = options.tabs.filter('.active').length;
                options.tabs.removeClass('active');
                tab.addClass('active');

                var index = tab.index(),
                    content = container.find('> .tabs-content > .tab-content');

                content.hide().eq(index).show();

                var inkBar = options.header.find('.ink-bar');
                if (active)
                    inkBar.show();

                inkBar.css({ left: tab.position().left, width: tab.outerWidth() });

                clearTimeout(options.timer);
                options.timer = setTimeout(function () { inkBar.hide(); }, 280);

                if (!tab.data('loaded') && typeof options.onload === 'function') {
                    options.onload(index, content.eq(index), tab);
                    tab.data('loaded', true);
                }

                if (typeof options.onclick === 'function')
                    options.onclick(index, content.eq(index), tab);
            }

            function exhibition(type) {
                var typeofExhibition = typeof options[type];
                if (typeofExhibition !== 'undefined') {
                    if (typeofExhibition === 'number')
                        options[type] = [options[type]];

                    if (type === 'enable' || type === 'disable')
                        options[type].forEach(function (index) { optionsTab.tabs.eq(index).toggleClass('disabled', type === 'disable'); });
                    else
                        options[type].forEach(function (index) { optionsTab.tabs.eq(index)[type](); });
                }
            }

            exhibition('disable');
            exhibition('enable');

            exhibition('show');

            if (typeof optionsTab.active !== 'undefined')
                activeTab(optionsTab.tabs.eq(optionsTab.active));

            exhibition('hide');
        });

        return $(this);
    };

    $.fn.inputCombo = function (combo) {
        var input = $(this);
        combo = $(combo);

        input.on('input', function () {
            var value = +input.val();
            combo.val(value && combo.find("option[value='" + value + "']").length ? value : '').trigger('change');
        }).on('blur', function () {
            var value = +input.val();
            if (!combo.find("option[value='" + value + "']").length)
                input.val('');

            combo.trigger('change');
        });

        combo.on('change', function (e) {
            if (!e.isTrigger)
                input.val(combo.val()).trigger('change');
        });

        return input;
    };

    $.fn.serializeObject = function (options) {
        var form = $(this);
        options = options || {};
        if (!form.is('form')) {
            form = form.wrap('<form/>').parent();
            var obj = form.serializeObject(options);
            form.children().unwrap('form');
            return obj;
        }

        var disabledFields = [];
        if (options.withDisabledFields)
            disabledFields = form.find('input:disabled, select:disabled').prop('disabled', false);

        var obj = {}, arr = form.serializeArray();
        if (disabledFields.length)
            disabledFields.prop('disabled', true);

        for (var i = 0; i < arr.length; i++) {
            if (options.booleanCheckBoxes && arr[i].name && form.find('input[name="' + arr[i].name + '"]').is(':checkbox'))
                obj[arr[i].name] = form.find('input[name=' + arr[i].name + ']').prop('checked');
            else 
                obj[arr[i].name] = arr[i].value;
        }

        obj.length = arr.length;
        if (options.verifyEmpty) {
            var focused = false;
            for (var prop in obj)
                if (!obj[prop].toString().trim()) {
                    obj.emptyLength = (obj.emptyLength || 0) + 1;

                    var input = form.find('[name="' + prop + '"]');
                    if (input.is('.required:visible') || (input.is('.required') && options.verifyInvisible)) {
                        obj.requiredEmptyLength = (obj.requiredEmptyLength || 0) + 1;
                        input.trigger('input');

                        if (!focused) {
                            input.focus();
                            focused = true;
                        }
                    }
                }
        }

        return obj;
    };

    $.fn.submitUpload = function (options) {
        var options = $.extend({
            url: '',
            model: {},
            files: [],
            done: null,
            fail: null,
            always: null
        }, options);

        var form = $(this);
        if (!options.url)
            options.url = form.attr('action');

        form.prop("enctype", "multipart/form-data").submit(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        });

        var formData = new FormData();
        form.find("input:file").each(function () {
            formData.append($(this).prop("name"), $(this)[0].files[0]);
        });

        options.files.forEach(function (file) {
            formData.append(file.prop("name"), file[0].files[0]);
        });

        var data = form.serializeObject();
        for (var item in data)
            formData.append(item, data[item]);
        for (var prop in options.model)
            formData.append(prop, options.model[prop]);

        return $.ajax({
            url: options.url,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (typeof (options.done) == "function")
                    options.done(data);
            },
            error: function (xhr) {
                if (typeof (options.fail) == "function")
                    options.fail(xhr);
            },
            complete: function (xhr) {
                if (typeof (options.always) == "function")
                    options.always(xhr);
            }
        });
    };

    $.submitUpload = function (options) {
        return $('<form/>').submitUpload(options);
    };

    $.fn.paginate = function (config) {
        var table = $(this);

        config = $.extend({
            url: '',
            params: {},
            onpagechange: null,

            pageParam: 'page',
            page: 1,
            length: 0,

            sortable: false,
            sortFieldParam: 'column',
            sortParam: 'order',

            scroll: false,
            scrollHeight: '529px',

            container: null,
        }, config);

        var trs = table.find('tbody tr:not(.ui-tr-sub-table)');

        var tableLength = trs.length;
        config.total = +table.attr('data-total') || tableLength;
        config.length = config.length || tableLength;
        var container = config.container || table.parent();
        config.params[config.pageParam] = config.page;

        table.removeAttr('data-total');

        var setPages = function () {
            config.autoPage = true;

            var page = 1;
            trs.each(function (i) {
                $(this).attr('data-page', page);
                if ((i + 1) % config.length == 0)
                    page++;
            });

            table.find('tbody tr:not(.ui-tr-sub-table)[data-page!="' + config.page + '"]').hide();
        };

        if (tableLength > config.length)
            setPages();

        var info = function () {
            var pageLength = config.page * config.length;
            return (pageLength - (config.length - 1)) + '-' + (pageLength > config.total ? config.total : pageLength) + ' de ' + config.total;
        };

        if (!config.scroll && (config.page * config.length < config.total || config.page > 1)) {
            var buttonWrap = $('<div/>').append(
                $('<button/>', { 'class': 'ui-button icon flat', html: '<i class="material-icons light">chevron_left</i>' }),
                $('<button/>', { 'class': 'ui-button icon flat', html: '<i class="material-icons light">chevron_right</i>' })
            );

            buttonWrap.find('button').on('click', function () {
                if (container.find('.ui-progress-linear').length)
                    return;

                var icon = $(this).find('i'),
                    nameIcon = icon.html(),
                    buttons = $(this).parent().find('button'),
                    oldPage = config.page;

                if (nameIcon === 'chevron_left') {
                    if (config.page === 1)
                        return;
                    config.page -= 1;
                } else {
                    if (config.length === config.total || config.page * config.length >= config.total)
                        return;
                    config.page += 1;
                }

                config.params[config.pageParam] = config.page;

                container.prepend(ui.progressLinear);
                buttons.prop('disabled', true);

                var always = function () {
                    buttons.prop('disabled', false);
                    container.find('.ui-progress-linear').remove();
                    table.siblings('.tfoot').find('.info').html(info());
                    if (typeof config.onpagechange === 'function')
                        config.onpagechange(config.params[config.pageParam]);
                };

                if (config.autoPage) {
                    trs.hide().filter('[data-page="' + config.page + '"]').show();
                    always();
                } else {
                    $.get(config.url, config.params).done(function (data) {
                        table.find('tbody:eq(0)').html($(data).wrap('<div/>').parent().find('tbody').html());
                    }).fail(function (xhr) {
                        ui.toast(xhr);
                        config.params[config.pageParam] = oldPage;
                    }).always(always);
                }
            });

            var tfoot = $('<div/>', { 'class': 'tfoot', html: '<div class="info">' + info(config) + '</div>' });
            tfoot.append(buttonWrap);
            table.siblings('div.tfoot').remove();
            table.filter(':not(.ui-sub-table)').after(tfoot);
        }

        if (config.scroll) {
            var divScroll = table.wrap('<div class="ui-data-table-scroll"/>').parent();
            divScroll.css('max-height', config.scrollHeight).find('table thead th').addClass('no-shadow');
            divScroll.on('scroll', function () {
                var top = $(this).scrollTop();
                $(this).find('table thead th').css('top', top + 'px')[top > 0 ? 'removeClass' : 'addClass']('no-shadow');
            });
        }

        table.find('thead th[data-order]').attr('data-order', '');
        if (config.sortable) {
            var icon = $('<i/>', { 'class': 'material-icons', html: 'arrow_downward' });

            table.find('thead th[data-field]:not(.order, .ui-sub-table)').wrapInner('<div data-text></div>').prepend(icon).addClass('order').on('click', function () {
                if (container.find('.ui-progress-linear').length)
                    return;
                container.prepend(ui.progressLinear);

                var th = $(this),
                    order = !th.attr('data-order') ? 'A' : th.attr('data-order') == 'A' ? 'D' : '';

                if (!th.attr('data-order'))
                    table.data('originalOrder', table.find('tbody').html());

                config.params[config.sortFieldParam] = order ? th.attr('data-field') : '';
                config.params[config.sortParam] = order;

                if (config.autoPage) {
                    if (!order) {
                        table.find('tbody').html(table.data('originalOrder'));
                    } else {
                        // https://www.w3schools.com/howto/howto_js_sort_table.asp
                        // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc

                        var rows = table[0].rows,
                            thIndex = th.index(),
                            switching = true;

                        while (switching) {
                            switching = false;
                            for (var i = 1; i < rows.length - 1; i++) {
                                var x = rows[i].getElementsByTagName('td')[thIndex].innerHTML.toLowerCase(),
                                    y = rows[i + 1].getElementsByTagName('td')[thIndex].innerHTML.toLowerCase();

                                // Date
                                if (/\d{2}\/\d{2}\/\d{4}/g.test(x))
                                    x = x.substr(6) + x.substr(3, 2) + x.substr(0, 2);
                                if (/\d{2}\/\d{2}\/\d{4}/g.test(y))
                                    y = y.substr(6) + y.substr(3, 2) + y.substr(0, 2);

                                // Number
                                if (/^\d+$/g.test(x.trim()))
                                    x = +x;
                                if (/^\d+$/g.test(y.trim()))
                                    y = +y;

                                if ((order == 'A' && x > y) || (order == 'D' && x < y)) {
                                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                                    switching = true;
                                    break;
                                }
                            }
                        }
                    }

                    th.attr('data-order', order).siblings('th').attr('data-order', '');
                    container.find('.ui-progress-linear').remove();
                    setPages();
                    trs.hide().filter('[data-page="' + config.page + '"]').show();
                } else {
                    $.get(config.url, config.params).done(function (data) {
                        table.find('tbody').html($(data).wrap('<div/>').parent().find('tbody').html());
                        th.attr('data-order', order).siblings('th').attr('data-order', '');
                    }).fail(ui.toast).always(function () {
                        container.find('.ui-progress-linear').remove();
                    });
                }
            });
        }

        return table;
    };

    $.fn.contextmenu = function (target, selector, options) {
        options.container = $(this);

        if (!$(document).data('contextmenu_event')) {
            $(document).on('click', function (event) {
                if ($('.ui-contextmenu.open').length)
                    $('.ui-contextmenu.open').not($(event.target).closest('.ui-contextmenu.open')).removeClass('open');
            });

            $(window).on('resize scroll', function () {
                if ($('.ui-contextmenu.open').length)
                    $('.ui-contextmenu.open').removeClass('open');
            });

            $(document).data('contextmenu_event', true);
        }

        if (!options) options = {};
        if (typeof options.rightButton === 'undefined') options.rightButton = true;

        if (!options.minLeft) options.minLeft = 0;
        if (!options.maxLeft) options.maxLeft = window.innerWidth;
        if (!options.minTop) options.minTop = 0;
        if (!options.maxTop) options.maxTop = window.innerHeight;

        var id = 'cm_' + ($('.ui-contextmenu').length + 1);
        var contextMenu = options.container.find(selector).wrap('<div class="ui-contextmenu" id="' + id + '"></div>').show().parent();

        contextMenu.prependTo('body');
        contextMenu.close = function (callback) {
            close(contextMenu, callback);
        };

        function close(cm, callback) {
            cm.removeClass('open');
            setTimeout(function () {
                if (typeof callback === 'function')
                    callback();
            }, 280);
        }

        function getCoord(x, y, o) {
            var w = window.innerWidth,
                h = window.innerHeight,
                minLeft = typeof o.minLeft === 'function' ? o.minLeft() : o.minLeft,
                maxLeft = typeof o.maxLeft === 'function' ? o.maxLeft() : o.maxLeft,
                minTop = typeof o.minTop === 'function' ? o.minTop() : o.minTop,
                maxTop = typeof o.maxTop === 'function' ? o.maxTop() : o.maxTop;

            x -= $(window).scrollLeft();
            y -= $(window).scrollTop();

            if (x < minLeft) x = minLeft;
            if (x > maxLeft) x = maxLeft;
            if (y < minTop) y = minTop;
            if (y > maxTop) y = maxTop;

            if (!o.rightToLeft) {
                if (x + o.contextWidth > w)
                    x = x - (x + o.contextWidth - w);
            } else {
                x -= o.contextWidth;
                if (x < 0)
                    x = 0;
            }

            if (y + o.contextHeight > h)
                y = y - (y + o.contextHeight - h);
            if (y < 0)
                y = 0;

            return { x: x, y: y };
        }

        if (options.container.data('contextmenu-events') && options.container.find(target).first().attr('data-cm') == id)
            return contextMenu;

        options.container.find(target).attr('data-cm', id);
        options.container.on('click contextmenu', target, function (e) {
            var $this = $(this);
            var contextMenu = $('#' + $this.attr('data-cm'));
            if (e.button === 0 && !options.leftButton)
                return false;
            if (e.button === 2 && !options.rightButton)
                return false;

            if (typeof options.onstart === 'function')
                options.onstart($this, contextMenu);

            if (options.style)
                contextMenu.attr('style', options.style);

            if (options.rightToLeft)
                contextMenu.addClass('right-to-left');

            if (contextMenu.is('.open')) {
                if (contextMenu.data('target') === $this[0])
                    setCoord();
                else
                    close(contextMenu, open);
                return false;
            }

            function setCoord() {
                options.contextWidth = contextMenu.outerWidth();
                options.contextHeight = contextMenu.outerHeight();

                if (e.isTrigger) {
                    var offset = $this.offset();
                    e.pageX = offset.left + ($this.outerWidth() / 2);
                    e.pageY = offset.top + ($this.outerHeight() / 2);
                }

                var coord = getCoord(e.pageX, e.pageY, options);
                if (coord.y == 0 && coord.x == 0)
                    return;

                contextMenu.css({ top: coord.y + 'px', left: coord.x + 'px' });
            }

            function open() {
                $('.ui-contextmenu.open').not(contextMenu).removeClass('open');
                setCoord();
                setTimeout(function () {
                    setTimeout(function () {
                        if (typeof options.onload === 'function')
                            options.onload($this, contextMenu);
                    }, 280);
                    contextMenu.data('target', $this[0]).addClass('open');
                }, 10);
            }

            open();
            return false;
        }).data('contextmenu-events', true);
        return contextMenu;
    };

    $.modal = function (config) {
        config = $.extend({
            open: true,
            destroy: true,
            withHeader: true,
            withOverflow: true,
            clickOverlayToClose: true,
            onstart: null,
            onload: null,
            onclose: null
        }, config);

        var modal = typeof config.content === 'string' ? $('<div>' + config.content + '</div>') : config.content;
        modal.data('config', config);

        var modalContainer = config.container ? config.container : generateContainer();
        var content = modalContainer.find('.ui-modal-wrap');
        modal.hide().appendTo(content);

        if (config.open)
            open();

        function open() {
            setTitle(config.title);
            resize(config.width);
            content.children().removeClass('active').hide();

            modal.show().addClass('active');
            modalContainer.show();
            verifyBackButton();

            setTimeout(function () {
                $('body').css('overflow', 'hidden');
                if (typeof config.onstart === 'function')
                    config.onstart(content);

                modalContainer.addClass('open');
                if (typeof config.onload === 'function') {
                    setTimeout(function () {
                        config.onload(content);
                    }, 280);
                }
            });
        }

        function close() {
            modalContainer.removeClass('open');
            setTimeout(function () {
                $('body').css('overflow', '');
                modalContainer.hide();
                if (config.destroy)
                    modalContainer.remove();

                if (typeof config.onclose === 'function')
                    setTimeout(function () {
                        config.onclose(content);
                    }, 280);
            }, 280);
        }

        function generateContainer() {
            var toolbar = !config.withHeader ? '' : '\
                <div class="ui-card-toolbar">\
                    <button class="ui-button icon flat back">\
                        <i class="material-icons light">arrow_back</i>\
                    </button>\
                    <div class="ui-modal-title title"></div>\
                    <button class="ui-button icon flat close">\
                        <i class="material-icons light">close</i>\
                    </button>\
                </div>';

            modalContainer = $('<div/>', {
                'class': 'ui-modal-container pre-open',
                style: 'display: none',
                html: $('<div/>', {
                    'class': 'overlay',
                    click: function () {
                        if (config.clickOverlayToClose)
                            close();
                    }
                }).add($('<div/>', {
                    'class': 'ui-card',
                    css: {
                        'overflow': config.withOverflow ? 'auto' : 'hidden',
                    },
                    html: toolbar + '<div class="ui-modal-wrap" style="height: 100%;"></div>'
                }))
            });

            modalContainer.find('.ui-card-toolbar')
                .on('click', '.ui-button.back', function () {
                    var index = modalContainer.find('.ui-modal-wrap .active').index();
                    back(index, index - 1);
                })
                .on('click', '.ui-button.close', function () {
                    close();
                });

            $('body').prepend(modalContainer);
            return modalContainer;
        }

        function back(from, to) {
            var modals = modalContainer.find('.ui-modal-wrap').children();
            var fromElement = modals.eq(from);
            var toElement = modals.eq(to);
            var fromElementConfig = fromElement.data('config');

            fromElementConfig.onClose && fromElementConfig.onClose();
            fromElement.remove();
            toElement.show();

            // formatando card
            setTitle(config.title);
            resize(config.width);
            verifyBackButton();
        }

        function verifyBackButton() {
            var backButton = modalContainer.find('.ui-card-toolbar .back');
            var firstContent = modalContainer.find('.ui-modal-wrap :first');
            backButton.toggle(!firstContent.is(':visible'));
        }

        function setTitle() {
            modalContainer.find('.ui-modal-title').text(config.title);
        }

        function resize() {
            modalContainer.find('.ui-card').css('width', config.width || '').css('height', config.height || '');
        }

        return {
            open: open,
            close: close,
            content: content,
            add: function (config) {
                config.container = modalContainer;
                config.open = true;
                $.modal(config);
            }
        };
    };

    $.fn.modal = function (config) {
        config.content = $(this);
        return $.modal(config);
    };

    $.fn.getBase64 = function (onload, onerror) {
        var reader = new FileReader(),
            file = $(this)[0].files[0];

        reader.readAsDataURL(file);
        reader.onload = function () {
            if (typeof onload === 'function')
                onload(reader.result);
        };
        reader.onerror = function (error) {
            if (typeof onerror === 'function')
                onerror(error);
        };
    };

    $.fn.shineText = function(config) {
        config = $.extend({
            time: 2000,
        }, config);

        var input = $(this),
            shineClass = 'ui-text-shine';

        input.addClass(shineClass);
        setTimeout(function() {
            input.removeClass(shineClass);
        }, config.time);
    }

    $.fn.chosen = function (config) {
        config = $.extend({
            multiple: false,
            separator: ';',
            checkbox: true,
        }, config);

        var select = $(this);
        var options = getOptions(select);
        var chosen = generateChosen();
        var chosenWrap;

        if (config.multiple) {
            select
                .attr('multiple', '')
                .find('option:selected')
                .prop('selected', false);
        }

        select.parent().prepend(chosen);

        select.hide();

        select.change(setLabel);

        fix.inputContainer();

        $(document).on('click', function (event) {
            var chosenElement = $(event.target).closest('.ui-chosen')[0];
            var chosenWrapElement = $(event.target).closest('.ui-chosen-wrap')[0];

            if (chosenElement === chosen[0] || (chosenWrap && chosenWrapElement === chosenWrap[0])) {
                return;
            }

            closeChosen();
        });

        function searchOption(value) {
            value = unaccent(value.toLowerCase());

            var filteredOptions = chosenWrap.find('li').filter(function () {
                var text = $(this).find('span').text();
                var label = unaccent(text).toLowerCase();

                return label.indexOf(value) !== -1;
            });

            var chosenList = chosenWrap.find('ul');

            chosenList.find('li').show().not(filteredOptions).hide();
        }

        function getOptions(select) {
            return select.find('option').map(function () {
                var option = $(this);
                return {
                    value: option.val() || option.text(),
                    label: option.attr('label') || option.text(),
                    selected: option.prop('selected'),
                }
            }).toArray();
        }

        function generateChosen() {
            var value = $('<div>', {
                class: 'value',
            });

            var chosen = $('<div>', {
                class: 'ui-control ui-chosen',
                html: value,
                tabindex: '0',
                focus: openChosen
            });

            return chosen;
        }

        function generateOption(option) {
            var checkboxWrap = $();

            if (config.multiple && config.checkbox) {
                var checkbox = $('<input>', {
                    type: 'checkbox',
                    tabindex: '0',
                    click: function (event) {
                        event.preventDefault();

                        $(this).closest('li').trigger('click');
                    }
                });

                checkboxWrap = $('<div>', {
                    class: 'ui-option',
                    html: checkbox,
                });
            }

            var text = $('<span>', { html: option.label });

            return $('<li>', {
                'data-value': option.value,
                tabindex: '0',
                html: [checkboxWrap, text],
                click: function () {
                    toggleValue(this);
                },
                keydown: function (event) {
                    switch (event.keyCode) {
                        case 13:
                            toggleValue(this);
                            break;
                        case 38: // Setinha para cima
                            focusOption($(this).prev(), event);
                            break;
                        case 40: // Setinha para baixo
                            focusOption($(this).next(), event);
                            break;
                    }
                }
            });
        }

        function focusOption(element, event) {
            if (!element.length) {
                element = chosenWrap.find('.search');
            }

            element.focus();

            event.preventDefault();
        }

        function setLabel() {
            var label = select
                .find('option:selected')
                .map(function () { return $(this).text().trim(); })
                .toArray()
                .join(config.separator + ' ');

            chosen.val(label);
            chosen.find('.value').text(label);
        }

        function toggleValue(chosenOptionElement) {
            var chosenOption = $(chosenOptionElement);

            if (!config.multiple) {
                chosenWrap.find('li').not(chosenOption).removeClass('selected');
                closeChosen();
            }

            var value = chosenOption.attr('data-value');
            var option = select.find('option[value="' + value + '"]');

            chosenOption.toggleClass('selected');
            chosenOption.find('input:checkbox').prop('checked', chosenOption.is('.selected'));
            option.prop('selected', chosenOption.is('.selected'));

            if (value == 0) {
                option.prop('selected', false);

                chosenWrap.find('li').not(chosenOption).each(function () {
                    if ($(this).is('.selected') !== chosenOption.is('.selected')) {
                        $(this).toggleClass('selected');
                        $(this).find('input:checkbox').prop('checked', chosenOption.is('.selected'));

                        value = $(this).attr('data-value');
                        option = select.find('option[value="' + value + '"]');
                        option.prop('selected', chosenOption.is('.selected'));
                    }
                });
            } else {
                chosenWrap.find('li[data-value=0]').each(function () {
                    if ($(this).is('.selected')) {
                        $(this).toggleClass('selected');
                        $(this).find('input:checkbox').prop('checked', false);
                    }
                });
            }

            setLabel();
            fix.inputContainer();

            select.trigger('change');
        }

        function openChosen() {
            if (chosenWrap) {
                return;
            }

            options = getOptions(select);


            var searchInput = $('<input>', {
                class: 'ui-control search',
                keydown: function (event) {
                    switch (event.keyCode) {
                        case 9: // TAB
                        case 27: // ESC
                            closeChosen();
                            event.preventDefault();
                            break;
                        case 38: // Setinha para cima
                            chosenWrap.find('li:last').focus();
                            event.preventDefault();
                            break;
                        case 40: // Setinha para baixo
                            chosenWrap.find('li:first').focus();
                            event.preventDefault();
                            break;
                    }
                }
            });

            searchInput.on('input change', function () {
                searchOption(this.value)
            });

            var search = $('<div>', {
                class: 'ui-input-container no-space',
                html: searchInput
            });

            var list = $('<ul>', {
                html: options.map(function (option) {
                    var li = generateOption(option);

                    if (option.selected) {
                        li.addClass('selected').find('input:checkbox').prop('checked', true);
                    }

                    return li;
                })
            });


            var chosenPosition = chosen.offset();

            chosenWrap = $('<div>', {
                class: 'ui-chosen-wrap',
                html: [search, list],
                css: {
                    top: chosenPosition.top + chosen.height(),
                    left: chosenPosition.left,
                    width: chosen.width()
                }
            });

            $('body').append(chosenWrap);

            fix.option();

            chosenWrap.find('.search').focus();
        }

        function closeChosen() {
            if (chosenWrap) {
                chosen.blur();
                chosenWrap.remove();
                chosenWrap = null;
            }

        }
    }

    function getMessages(messages) {
        try {
            messages = JSON.parse(Array.isArray(messages) ? messages[0] : messages);
        } catch (e) {
            if (typeof messages === 'string')
                messages = [messages];
        }
        return messages;
    }

    ['', 'Info', 'Success', 'Warn', 'Error'].forEach(function (type) {
        $.fn['alert' + type] = function () {
            var params = [],
                isContainer = arguments[arguments.length - 1] === 'container',
                count = isContainer ? arguments.length - 1 : arguments.length;

            for (var i = 0; i < count; i++)
                params.push(arguments[i]);

            var config = {
                type: (type || 'default').toLowerCase(),
                condition: params.length > 1 && typeof params[1] === 'string' ? params[0] : true,
                message: getMessages(params.length == 1 || typeof params[1] === 'number' ? params[0] : params[1]),
                delay: params.length > 1 && typeof params[1] === 'number' ? params[1] : 0,
                isContainer: isContainer
            };

            var elem = $(this), div, container;
            config.message.forEach(function (message) {
                //ui-message
                if (elem.is('input, select')) {
                    container = elem.parent().find('.ui-messages:not(.fixed)');
                    if (!config.condition) {
                        if (container.length)
                            container.empty();
                    } else {
                        if (!container.length)
                            elem.parent().append(container = $('<div/>', { 'class': 'ui-messages' }));

                        container.html($('<div/>', {
                            'class': 'ui-message ' + (config.type === 'error' ? 'error' : 'helper'),
                            html: message
                        })).data('message', message);
                    }

                    return config.condition;
                }

                //ui-alert
                var types = '.default, .info, .success, .info, .error';
                div = config.isContainer
                    ? elem.children('.ui-alert').filter(types).filter(function () { return $(this).data('message') == message; })
                    : elem.children('.ui-alert').not(types).children('div').filter(function () { return $(this).data('message') == message; });

                if (!config.condition) {
                    if (div.length) {
                        if (!config.isContainer && div.parent().children('div').length == 1)
                            div.parent().remove();
                        else
                            div.remove();
                    }
                } else {
                    if (div.length)
                        div.attr('data-count', (+div.attr('data-count') || 1) + 1);
                    else {
                        if (config.isContainer)
                            elem.append($('<div/>', { 'class': 'ui-alert ' + config.type, html: message }).data('message', message));
                        else {
                            container = elem.children('.ui-alert').not(types);
                            if (!container.length)
                                elem.append(container = $('<div/>', { 'class': 'ui-alert' }));

                            container.append($('<div/>', { 'class': config.type, html: message }).data('message', message));
                        }
                    }
                }
            });

            return config.condition;
        }
    });

    var toast = function () {
        /*
        *  1º arg string = message
        *  2º arg string = buttonText
        *  1º arg number = delay
        *  1º arg function = callback
        */
        var options = {
            buttonText: 'FECHAR',
            delay: 5000
        };

        if (!arguments || !arguments.length || !arguments[0])
            return;

        if (typeof arguments[0] === 'object')
            options.message = arguments[0].responseText;

        for (var i = 0; i < arguments.length; i++) {
            var argument = arguments[i];
            switch (typeof argument) {
                case 'string':
                    if (!options.message)
                        options.message = argument;
                    break;
                case 'number': options.delay = argument; break;
                case 'function': options.callback = argument; break;
            }
        }

        var messages = getMessages(options.message);
        if (!messages || !messages.length)
            return;

        options.buttonText = options.buttonText == 'BAD REQUEST' ? 'FECHAR' : options.buttonText;
        messages.forEach(function (item) {
            var uiToast = $('<div/>', {
                'class': 'ui-toast',
                html: $('<div/>', { 'class': 'text', html: item })
            });

            var action = $('<div/>', {
                'class': 'action',
                html: $('<button/>', {
                    'class': 'ui-button flat primary',
                    html: options.buttonText,
                    click: function () {
                        if (typeof options.callback === 'function')
                            options.callback();

                        uiToast.addClass('leave');
                        setTimeout(function () {
                            uiToast.remove();
                        }, 280);
                    }
                })
            });

            uiToast.append(action);

            var container = $('.ui-toast-container');
            if (!container.length)
                $('body').append(container = $('<div/>', { 'class': 'ui-toast-container' }));
            container.append(uiToast.wrap('<div class="ui-toast-wrap"></div>').parent());

            setTimeout(function () {
                uiToast.find('button').trigger('click');
            }, options.delay);
        });
    };

    var dialog = function (message, callbackYes, callbackNo, width, title) {
        var content = $('<div/>',
            {
                'class': 'ui-button-container cover',
                html: button('NÃO', callbackNo, 'flat').add(button('SIM', callbackYes, 'raised'))
            });

        if (message)
            content = $('<div/>', { 'class': 'ui-card-content', html: message }).add(content);

        var template = $('<div/>', {
            'class': 'ui-modal',
            html: content,
        });

        var modalDialog = $.modal({
            title: title || 'Confirmação',
            content: template,
            width: width || 350,
            onstart: function (content) {
                content.find('button.raised').focus();
            }
        });

        modalDialog.content.closest('.ui-modal-container').css('z-index', 6);

        function button(text, callback, $class) {
            return $('<button/>', {
                'class': 'ui-button primary ' + $class,
                html: text,
                click: function () {
                    modalDialog.close();
                    if (typeof callback === 'function')
                        callback();
                }
            });
        }
    };

    var alert = function (message, callback) {
        var template = $('<div/>', {
            'class': 'ui-modal',
            html: $('<div/>', { 'class': 'ui-card-content', html: message })
                .add($('<div/>', {
                    'class': 'ui-button-container cover',
                    html: button('OK', callback, 'raised')
                }))
        });

        var modalDialog = $.modal({ content: template, withHeader: false, width: 450, clickOverlayToClose: false });
        modalDialog.content.closest('.ui-modal-container').css('z-index', 6);

        function button(text, callback, $class) {
            return $('<button/>', {
                'class': 'ui-button primary ' + $class,
                html: text,
                click: function () {
                    modalDialog.close();
                    if (typeof callback === 'function')
                        callback();
                }
            });
        }
    };

    var loading = function (hide) {
        if (typeof hide === 'boolean' && !hide) {
            $('body').find('.ui-progress-overlay').remove();
            return;
        }

        if ($('body').find('.ui-progress-overlay').length)
            return;

        $('body').prepend('<div class="ui-progress-overlay">' + ui.progressRadial.replace('ui-progress-radial', 'ui-progress-radial full') + '</div>');
    };

    var blockCepFields = function (inputId, block, uf) {
        if (block) {
            $('input[data-cep="' + inputId + '_Rua"]').prop("readonly", true);
            $('input[data-cep="' + inputId + '_Bairro"]').prop("readonly", true);
            $('input[data-cep="' + inputId + '_Cidade"]').prop("readonly", true);
        } else {
            $('input[data-cep="' + inputId + '_Rua"]').removeAttr("readonly");
            $('input[data-cep="' + inputId + '_Bairro"]').removeAttr("readonly");
        }

        $('select[data-cep="' + inputId + '_Uf"] option').prop('disabled', false);
        if (typeof uf != "undefined")
            $("select[data-cep='" + inputId + "_Uf'] option[value!='" + uf + "']").prop('disabled', true);
    };

    var fillCep = function (inputId, address, dadosCadastrais) {
        var input = $('#' + inputId);
        if (!address)
            return;

        input.val(address.NomCep);
        $('[data-cep="' + inputId + '_Rua"]').val(address.NomRua);
        $('[data-cep="' + inputId + '_Bairro"]').val(address.Nom_InicialBairro);
        $('[data-cep="' + inputId + '_Cidade"]').val(address.Nom_Localidade);
        $('[data-cep="' + inputId + '_Uf"]').val(address.Nom_Uf);

        if (dadosCadastrais)
            return;

        $('[data-cep="' + inputId + '_Numero"]').val('').focus();
        $('[data-cep="' + inputId + '_Complemento"]').val('');
        blockCepFields(inputId, address.Ind_CepEspecial == "N", address.Nom_Uf);
    };

    var unaccent = function (str) {
        str = str.split('');
        var strAccentsOut = new Array(),
            strAccentsLen = str.length,
            accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž',
            accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeDIIIIiiiiUUUUuuuuNnSsYyyZ';

        for (var y = 0; y < strAccentsLen; y++)
            strAccentsOut[y] = accents.indexOf(str[y]) != -1 ? accentsOut.substr(accents.indexOf(str[y]), 1) : str[y];

        return strAccentsOut.join('');
    };

    return {
        toast: toast,
        dialog: dialog,
        alert: alert,
        today: function () { return new Date().toShortDateString() },
        progressLinear: '<div class="ui-progress-linear"><div class="indeterminate"></div></div>',
        progressRadial: '<div class="ui-progress-radial"><svg class="spinner-container" viewBox="0 0 44 44"><circle class="path"cx="22"cy="22"r="20"fill="none"stroke-width="4"></circle></svg></div>',
        loading: loading,
        loadCepUrl: function (url) { ui.cepUrl = url; },
        fillCep: fillCep,
        blockCepFields: blockCepFields,
        unaccent: unaccent,
    };
})(jQuery);
