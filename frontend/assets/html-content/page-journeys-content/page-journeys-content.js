import Content from "../content.js"; 
import Swal from 'sweetalert2'
import DataTable from 'datatables.net-bs';
import jszip from 'jszip';

class PageJourneysContent extends Content {

    constructor(options, apiServerHttpClient) {
        super(Object.assign({}, {
            uri: "/journeys",
            contentName: "PageJourneysContent",
            contentPath: "assets/html-content/page-journeys-content/page-journeys-content.html",
        }, options));
        this.apiServerHttpClient = apiServerHttpClient;
    }

    once() {
        if (!this.onceExecuted) {
            DataTable.Buttons.jszip(jszip);
            this.isUpdatingTable = false;

            this.journeyDatatable = this.setDataTable('#tb-journeys');
            
            $("#slt-journey-categories").select2({
                placeholder: "Selecione uma categoria de jornada",
            });

            $("#slt-journey-projects").select2({
                placeholder: "Selecione um projeto",
            });

            this.setSelect2Multiple("#slt-related-journey-services", "Selecione os serviço(s)");

            $('#form-create-journey').on('submit', async(event) =>{
                event.preventDefault();
                await this.save();
            });

            $(document).on('click', ".btn-grid-delete-journey", async(event) =>{
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

            $("#btn-journey-clear-form").on('click', (event) => {
                this.resetForm();
            });

            $("#btn-update-journey-table").on('click', async (event) => {
                if (!this.isUpdatingTable) {
                    this.isUpdatingTable = true;
                    $(event.currentTarget).attr("disabled", true);
                    await this.loadGrid();
                }
            });
            
            $("#btn-create-journey").on('click', async (event) => {
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
               
                $('#form-create-journey-modal-label').text(text);
              
                var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.journey-update-section').show()
                } else {
                    $('.journey-update-section').hide()
                }

                this.resetForm();
                $("#form-create-journey-modal").modal("show");
            });

            this.$document.on('click', ".btn-grid-edit-journey", async(event) =>{
                this.resetForm();
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
                const id = $(event.currentTarget).data("id");
                await this.get(id);
                $('#form-create-journey-modal-label').text(text);

                 var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.journey-update-section').show()
                } else {
                    $('.journey-update-section').hide()
                }
                $("#form-create-journey-modal").modal("show");
            })

            this.$document.on('click', ".btn-grid-view-journey", async(event) =>{
                this.resetForm();
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
                const id = $(event.currentTarget).data("id");
                await this.viewJourney(id);
                $('#form-view-journey-modal-label').text(text);
                $("#form-view-journey-modal").modal("show");
            })
        }
        this.onceExecuted = true;
    }

    async viewJourney(id) {
        const item = await this.apiServerHttpClient.getJourneyViewV1(id);
        if (item) {
            $("#modal-view-journey-name").text(item.journey.journey_name);
            $("#modal-view-journey-category").text(item.journey.journey_category_name).attr("href", `/journey-categories?journey_category_id=${item.journey.journey_category_id}`);

            $("#modal-view-journey-project").text(item.journey.project_name);

            if (item.journey.journey_description && this.stripTags(item.journey.journey_description).trim().length > 0) {
                $("#modal-view-journey-description").html(item.journey.journey_description);            
            }
            if (item.journey.journey_slo && this.stripTags(item.journey.journey_slo).trim().length > 0) {
                $("#modal-view-journey-slo").html(item.journey.journey_slo);            
            }
            $("#modal-view-journey-active").text(item.journey.journey_active === 1 ? "Sim" : "Não");
            $("#modal-view-journey-critical").text(item.journey.journey_critical === 1 ? "Sim" : "Não");
            $("#modal-view-journey-integrated-tests").text(item.journey.journey_integrated_tests === 1 ? "Sim" : "Não");
            
            if (item.journey.journey_created_at) {
                $("#modal-view-journey-created").text(this.toPtBrDatetime(item.journey.journey_created_at));
            } 

            if (item.journey.journey_created_at !== item.journey.journey_updated_at) {
                $("#modal-view-journey-updated").text(this.toPtBrDatetime(item.journey.journey_updated_at));
            } else {
                $("#modal-view-journey-updated").text("Ainda não atualizado");
            }

            let htmlServices = "";
            let itemsHTML = "";
            htmlServices += `
                <ul class="list-group">
                     __CONTENT__
                </ul>
            `;  
       
            for (let index = 0; index < item.journey.services.length; index++) {
                const service = item.journey.services[index];
                
                let depHtml = ``;
                if (service.service_dependency_product_ids && service.service_dependency_product_ids.split(",").length > 0) {
                   const deps = service.service_dependency_product_ids.split(",").map(x => parseInt(x, 10));
                   let depTxt = "";
                   for (let index2 = 0; index2 < deps.length; index2++) {
                        const prodId = deps[index2];
                        const prod = item.products[item.products.findIndex(x => x.product_id === prodId)];
                        if (prod ) {
                            depTxt += `<span class="label label-primary">${prod.product_name}</span>`;
                        }
                   }
                        
                    depHtml += `<p class="bold-font" style="margin-bottom:0px;">Depende do(s) produtos(s)</p>`;
                    depHtml += `<div class="label-center-container">${depTxt}</div>`;
                }
                                        

                itemsHTML += `
                    <li class="list-group-item list-group-item-service">
                        <a style="font-size:20px;" target="_blank" href="/services?service_id=${service.service_id}">${index+1} - ${service.service_name}</a>
                        <p class="bold-font" style="margin-bottom:0px;">Produto</p>
                        <div class="label-center-container">
                            <span class="label label-success">${service.product_name}</span>
                        </div>

                        <p class="bold-font" style="margin-bottom:0px;">Time</p>
                        <div class="label-center-container">
                            <span class="label label-success">${service.team_name}</span>
                        </div>
                      
    
                        ${depHtml}
                    </li>
                `;

                if (index+1 !== item.journey.services.length) {
                    itemsHTML += `
                        <li class="no-bullets"><span style="margin-top:5px;font-size:28px;" class="glyphicon glyphicon-circle-arrow-down"></span></li>
                    `;
                }

            }

            $("#container-view-journey-services").html(htmlServices.replace("__CONTENT__", itemsHTML));
        }   
    }

    init(options) {
        this.once();
        if (options.load) {
            this.loadGrid();
        }
    }

    async save() {
        
        let validationTxt = "";
        
        const payload = {
            active: $("#chk-journey-active").is(":checked"),
            journey_name: $("#txt-journey-name").val().trim(),
            project_id: $("#slt-journey-projects").val(),
            journey_category_id: $("#slt-journey-categories").val(),
            related_journey_service_ids: $("#slt-related-journey-services").val().filter(v => v.trim() !== '').join(","),
            journey_description: $('#txt-journey-description').val(),
            journey_slo: $('#txt-journey-slo').val(),
            journey_critical: $("#chk-journey-critical").is(":checked"),
            journey_integrated_test: $("#chk-journey-integrated-test").is(":checked"),
        };

        const id = parseInt($("#hdn-journey-id").val(), 10);
        if (!Number.isNaN(id)) {
            payload.journey_id = id;
        }

        // Validate 
        if (!payload.journey_name || payload.journey_name.length < 2) {
            validationTxt += "O nome da jornada é obrigatória! <br/>";
        }

         if (!payload.project_id || payload.project_id.length === 0) {
            validationTxt += "A seleção do projeto é obrigatória! <br/>";
        }

        if (!payload.journey_category_id || payload.journey_category_id.length === 0) {
            validationTxt += "A seleção da categoria da jornada é obrigatória! <br/>";
        }

        if (!payload.related_journey_service_ids || payload.related_journey_service_ids.length === 0) {
            validationTxt += "A seleção dos serviço(s) relacionado(s) é obrigatória! <br/>";
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

            await this.apiServerHttpClient.postJourneyV1(payload);
            $('#form-create-journey-modal').modal('hide');

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

        $('#form-create-journey :input')
            .not('#txt-journey-created-at, #txt-journey-updated-at, :submit, :button')
            .val('');

        $("#hdn-journey-id").val("")
        $('#txt-journey-description').val("");
         $('#txt-journey-slo').val("");
        $('#slt-journey-projects').val(null).trigger('change');
        $("#slt-related-journey-services").val([]).trigger("change");
        $("#slt-journey-categories").val(null).trigger('change');
        $("#chk-journey-active").prop("checked", true);
        $("#chk-journey-critical").prop("checked", false);
        $("#chk-journey-integrated-test").prop("checked", false);
    }

    async delete(id) {
        try {
            await this.apiServerHttpClient.deleteJourneyV1(id);

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
        const item = await this.apiServerHttpClient.getJourneyV1(id);

        if (item) {

            $("#hdn-journey-id").val(item.journey_id)
            $('.journey-update-section').show();
            $("#txt-journey-name").val(item.journey_name);
            $("#slt-journey-categories").val(item.journey_category_id).trigger("change");
            $("#slt-journey-projects").val(item.project_id).trigger("change");
     
            if (item.journey_service_ids) {
                const order = item.journey_service_ids.split(',');
                this.reorderSelect2("#slt-related-journey-services", order);
                $("#slt-related-journey-services").val(order).trigger("change");
            }
            
            $('#txt-journey-description').val(item.journey_description);
             $('#txt-journey-slo').val(item.journey_slo);
            $("#form-create-journey-modal").modal("show");
            $("#chk-journey-active").prop("checked", item.journey_active);
            $("#chk-journey-critical").prop("checked", item.journey_critical);
            $("#chk-journey-integrated-test").prop("checked", item.journey_integrated_tests);

            if (item.journey_created_at) {
                $("#txt-journey-created-at").val(this.toPtBrDatetime(item.journey_created_at));
            } 

            if (item.journey_created_at !== item.journey_updated_at) {
                $("#txt-journey-updated-at").val(this.toPtBrDatetime(item.journey_updated_at));
            } else {
                $("#txt-journey-updated-at").val("Ainda não atualizado");
            }

        }

    }

    createRelatederviceHTML(journey, services) {
        let dependencieHTML = "";
        let itemsHTML = "";

        if (!journey.journey_service_ids) return "-";
        const splitedServices = journey.journey_service_ids.split(",").map(i => parseInt(i, 10));

        if (!splitedServices || !Array.isArray(splitedServices)) return "Erro ao carregar";

        if (services || services.length > 0) {

            dependencieHTML += `
                <button class="btn btn-default btn-sm" type="button" data-toggle="collapse" data-target="#collapse-journey-related-services-${journey.journey_id}" aria-expanded="false" aria-controls="collapse-journey-related-services-${journey.journey_id}">
                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Mostrar
                </button>
                <div class="collapse" id="collapse-journey-related-services-${journey.journey_id}">
                    <h4>Sequência</h4>
                    <div class="well">
                        <ul class="list-group">
                            __CONTENT__
                        </ul>
                    </div>
                </div>
            `;  
       
            for (let index = 0; index < splitedServices.length; index++) {
                const serv = services[services.findIndex(x => x.service_id == splitedServices[index])];
                if (serv) {
                    itemsHTML += `
                        <li class="list-group-item"><a target="_blank" href="/services?service_id=${serv.service_id}">${index+1} - ${serv.service_name}</a></li>
                    `;
                }                 
            }
        }
        return dependencieHTML.replace("__CONTENT__", itemsHTML);
    }

    async loadGrid() {
        try {
            const results = await this.apiServerHttpClient.getJourneysV1();

            const tbody = this.$document.find('#tb-journeys tbody');
            tbody.html("");

            if (!results.projects || results.projects.length === 0) {
                $("#slt-service-projects").html("<option></option>");
            }

            // Populate table
            this.journeyDatatable.clear().draw();

            for (const item of results.journeys) {
                this.journeyDatatable.row.add([
                    item.journey_id,
                    item.journey_name,
                    `<span class="label label-default">${item.journey_category_name}</span>`,
                    item.project_name,
                    this.createRelatederviceHTML(item, results.services),
                    `
                        <button type="button" data-modal-title="Visualização da Jornada: #${item.journey_id}" data-toggle="modal" data-target="#form-view-journey-modal" data-id="${item.journey_id}" class="btn btn-warning btn-grid-view-journey"><span class="glyphicon glyphicon-list-alt"></span></button>
                        <button type="button" data-show-update-block="true" data-modal-title="Editar Jornada" data-toggle="modal" data-target="#form-create-journey-modal" data-id="${item.journey_id}" class="btn btn-info btn-grid-edit-journey"><span class="glyphicon glyphicon-pencil"></span></button>
                        <button type="button" data-id="${item.journey_id}" class="btn btn-danger btn-grid-delete-journey"><span class="glyphicon glyphicon-trash"></span></button>
                    `
                ]).draw(false);

            }

            // Populate projects select field
            $("#slt-journey-projects").html("<option></option>");
            for (const project of results.projects) {
                $("#slt-journey-projects").append(`<option value="${project.id}">${project.name}</option>`);
            }

            // Populate journey categories select field
            $("#slt-journey-categories").html("<option></option>");
            for (const jc of results.journey_categories) {
                $("#slt-journey-categories").append(`<option value="${jc.journey_category_id}">${jc.journey_category_name}</option>`);
            }

            // Populate related journey services select field
            $("#slt-related-journey-services").html("<option></option>");
            for (const service of results.services) {
                $("#slt-related-journey-services").append(`<option value="${service.service_id}">${service.service_name}</option>`);
            }

            setTimeout(() => {
                this.isUpdatingTable = false;
                $("#btn-update-journey-table").attr("disabled", false);
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

export default PageJourneysContent;