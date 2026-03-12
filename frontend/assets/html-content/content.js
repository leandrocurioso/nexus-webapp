import Quill from 'quill';
import DataTable from 'datatables.net-bs';
import moment from 'moment';

class Content {

    constructor($document) {
        this.$document = $document; 
        this.onceExecuted = false;
        this.$document.on(`${this.constructor.name}$ComponentLoaded`, this.onLoad.bind(this));
    }

    stripTags(html) {
        return html.replace(/<[^>]*>?/gm, '');
    }

    toPtBrDatetime(datetimeStr) {
        return moment(datetimeStr).format('DD/MM/YYYY HH:mm:ss');
    }
    
    setHtmlEditor(selector) {

        while($(selector).length !== 0) {
            break;
        }
        
        return new Quill(selector, {
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'align': [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['bold', 'italic'],
                    [{ 'color': [] }, { 'background': [] }],          
                    ['link', 'blockquote', 'code-block',],
                ],
            },
            theme: 'snow',
        });
    }

    setDataTable(selector) {
        return new DataTable(selector, {
            order: [[1, 'asc']],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-center' 
                }
            ],
            "language": {
                "info": "Página _START_ de _END_ com _TOTAL_ item(s)",
                "search": "Buscar por ",
                "infoEmpty": "Nenhum item encontrado",
                "infoFiltered": "filtrado(s) do total de _MAX_",
                "lengthMenu": "Mostrar _MENU_ items por página",
                "zeroRecords": "Nenhum item encontrado",
                "emptyTable": "Nenhum dado encontrado para essa tabela",
                "loadingRecords": "Carregando...",
                "processing": "Processando...",
                "searchPlaceholder": "Digite sua busca..."
            }
        });
    }

    reorderSelect2(selectId, order) {
        const $select = $(selectId);

        const optionMap = {};

        // store all options
        $select.find("option").each(function () {
            optionMap[$(this).val()] = $(this);
        });

        const newOptions = [];

        // first: options in given order
        order.forEach(val => {
            if (optionMap[val]) {
                newOptions.push(optionMap[val]);
                delete optionMap[val];
            }
        });

        // then: remaining options (keep them)
        Object.values(optionMap).forEach(opt => {
            newOptions.push(opt);
        });

        // append in new order WITHOUT losing options
        $select.append(newOptions);

        $select.trigger("change.select2");
    }

    setSelect2Multiple(selector, placeholder) {
        return $(selector).select2({
            placeholder: placeholder,
        }).on('select2:select', (evt) => {
            var $element = $(evt.params.data.element);
            var $target = $(evt.target)

            window.setTimeout(function () {
                if ($target.find(":selected").length > 1) {
                    $element.detach();
                    
                    var $second = $target.find(":selected").eq(-1);
                    $second.after($element);
                } else {
                    $element.detach();
                    $target.prepend($element);
                }

                $target.trigger("change");
            }, 1);
        });

    }
    
}

export default Content;