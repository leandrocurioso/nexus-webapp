import Content from "../content.js"; 
import Swal from 'sweetalert2'
import DataTable from 'datatables.net-bs';
import jszip from 'jszip';

class PageJourneyCategoriesContent extends Content {

    constructor(options, apiServerHttpClient) {
        super(Object.assign({}, {
            uri: "/journey-categories",
            contentName: "PageJourneyCategoriesContent",
            contentPath: "assets/html-content/page-journey-categories-content/page-journey-categories-content.html",
        }, options));
        this.apiServerHttpClient = apiServerHttpClient;
    }

    async viewEdit() {
        const params = new URLSearchParams(window.location.search);

        // Get a specific value
        const journeyCategoryId = params.get('journey_category_id');
 
        if (journeyCategoryId &&  journeyCategoryId.toLowerCase()) {

            this.resetForm();
            var text = "Editar Categoria de Jornada";
            await this.get(journeyCategoryId);
            $('#form-create-journey-category-modal-label').text(text);
            $('.journey-category-update-section').show()
        }
    }

    once() {
        if (!this.onceExecuted) {
            DataTable.Buttons.jszip(jszip);
            this.isUpdatingTable = false;

            this.journeyCategoryDatatable = this.setDataTable('#tb-journey-categories');
            
            $('#form-create-journey-category').on('submit', async(event) =>{
                event.preventDefault();
                await this.save();
            });
       
            this.$document.on('click', ".btn-grid-delete-journey-category", async(event) =>{
                const id = $(event.currentTarget).data("id");
                await Swal.fire({
                    title: "Deseja realmente deletar o registro?",
                    text: "Não será possível recuperar a informação!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não",
                    width: "500px"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await this.delete(id);
                    }
                });
            });

            $("#btn-journey-category-clear-form").on('click', (event) => {
                this.resetForm();
            });

            $("#btn-update-journey-category-table").on('click', async (event) => {
                if (!this.isUpdatingTable) {
                    this.isUpdatingTable = true;
                    $(event.currentTarget).attr("disabled", true);
                    await this.loadGrid();
                }
            });
            
            $("#btn-create-journey-category").on('click', async (event) => {
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
               
                $('#form-create-journey-category-modal-label').text(text);
              
                var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.journey-category-update-section').show()
                } else {
                    $('.journey-category-update-section').hide()
                }

                this.resetForm();
                $("#form-create-journey-category-modal").modal("show");
            });

            this.$document.on('click', ".btn-grid-edit-journey-category", async(event) =>{
                this.resetForm();
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
                const id = $(event.currentTarget).data("id");
                await this.get(id);
                $('#form-create-journey-category-modal-label').text(text);

                 var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.journey-category-update-section').show()
                } else {
                    $('.journey-category-update-section').hide()
                }
            })

        }
        this.onceExecuted = true;
    }

    init(options) {
        this.once();
        if (options.load) {
            this.loadGrid().then(async () => {
                await this.viewEdit();
            });
        }
    }

    async save() {
        
        let validationTxt = "";
        
        const payload = {
            active: $("#chk-journey-category-active").is(":checked"),
            journey_category_name: $("#txt-journey-category-name").val().trim(),
            journey_category_description: $('#txt-journey-category-description').val()
        };

        const id = parseInt($("#hdn-journey-category-id").val(), 10);
        if (!Number.isNaN(id)) {
            payload.journey_category_id = id;
        }

        // Validate 
        if (!payload.journey_category_name || payload.journey_category_name.length < 2) {
            validationTxt += "O nome da categoria de jornada é obrigatória! <br/>";
        }
        if (validationTxt.length > 0) {
            Swal.fire({
                title: 'Validação',
                html: '<strong>Por favor preencha os campos obrigatórios:</strong><br/><br/>' + validationTxt,
                icon: 'error',
                confirmButtonText: 'Ok',
                width: '500px'
            });
            return
        }

        try {

            await this.apiServerHttpClient.postJourneyCategoryV1(payload);
            $('#form-create-journey-category-modal').modal('hide');

            await Swal.fire({
                title: 'Sucesso!',
                html: 'Ação realizada com sucesso.',
                icon: 'success',
                confirmButtonText: 'Ok',
                width: '500px'
            }).then(async () => {
                await this.loadGrid();
                this.resetForm();
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Erro!',
                html: 'Ops! Ocorreu um erro ao salvar.<br/><br/>Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                width: '500px'
            });
        }
    }

    resetForm() {
        $('#form-create-journey-category :input')
            .not('#txt-journey-category-created-at, #txt-journey-category-updated-at, :submit, :button')
            .val('');

        $("#hdn-journey-category-id").val("")
        $('#txt-journey-category-description').val("");
        $("#chk-journey-category-active").prop("checked", true);
    }

    async delete(id) {
        try {
            await this.apiServerHttpClient.deleteJourneyCategoryV1(id);

            await Swal.fire({
                title: "Deletado!",
                text: "Seu registro foi apagado com sucesso",
                icon: "success",
                width: '500px',
            }).then(async () => {
                await this.loadGrid();
            });
        } catch(err) {
            console.error("error: ",err)
            Swal.fire({
                title: 'Erro!',
                html: 'Ops! Ocorreu um erro ao deletar.<br/><br/>Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                width: '500px'
            });
        }
    }

    async get(id) {
        const item = await this.apiServerHttpClient.getJourneyCategoryV1(id);
        if (item) {
            $("#hdn-journey-category-id").val(item.journey_category_id)
            $('.journey-category-update-section').show();
            $("#txt-journey-category-name").val(item.journey_category_name);
     
            $('#txt-journey-category-description').val(item.journey_category_description);
            $("#chk-journey-category-active").prop("checked", item.journey_category_active);

            if (item.journey_category_created_at) {
                $("#txt-journey-category-created-at").val(this.toPtBrDatetime(item.journey_category_created_at));
            } 

            if (item.journey_category_created_at !== item.journey_category_updated_at) {
                $("#txt-journey-category-updated-at").val(this.toPtBrDatetime(item.journey_category_updated_at));
            } else {
                $("#txt-journey-category-updated-at").val("Ainda não atualizado");
            }

            $("#form-create-journey-category-modal").modal("show");

        }
    }

    async loadGrid() {
        try {
            const results = await this.apiServerHttpClient.getJourneyCategoriesV1();

            const tbody = this.$document.find('#tb-journey-category tbody');
            tbody.html("");

            // Populate table
            this.journeyCategoryDatatable.clear().draw();
                       
            for (const item of results.journeyCategories) {
                this.journeyCategoryDatatable.row.add([
                    item.journey_category_id,
                    item.journey_category_name,
                    `
                        <button type="button" data-show-update-block="true" data-modal-title="Editar Categoria de Jornada" data-toggle="modal" data-target="#form-create-journey-category-modal" data-id="${item.journey_category_id}" class="btn btn-info btn-grid-edit-journey-category"><span class="glyphicon glyphicon-pencil"></span></button>
                        <button type="button" data-id="${item.journey_category_id}" class="btn btn-danger btn-grid-delete-journey-category"><span class="glyphicon glyphicon-trash"></span></button>
                    `
                ]).draw(false);

            }

            setTimeout(() => {
                this.isUpdatingTable = false;
                $("#btn-update-journey-category-table").attr("disabled", false);
            }, 1000);

        } catch (error) {
            console.error("Error loading:", error);
            Swal.fire({
                title: 'Erro!',
                html: 'Ops! Ocorreu um erro no carregamento.<br/><br/>Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                width: '500px'
            });
        }
    }

}

export default PageJourneyCategoriesContent;