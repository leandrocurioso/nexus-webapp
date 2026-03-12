import Content from "../content.js"; 
import { loadComponent, getHandler } from "../../js/core.js";
import Swal from 'sweetalert2'
import DataTable from 'datatables.net-bs';
import moment from 'moment';
import jszip from 'jszip';

class PageServicesContent extends Content {

    constructor($document, apiServerHttpClient) {
        super($document);
        this.apiServerHttpClient = apiServerHttpClient;
    }

    async viewEdit() {
        const params = new URLSearchParams(window.location.search);

        // Get a specific value
        const serviceId = params.get('service_id');
        if (serviceId &&  serviceId.toLowerCase()) {
            const cleanURL = window.location.origin + window.location.pathname + window.location.hash.toLowerCase();
            window.history.replaceState({}, document.title, cleanURL);

            this.resetForm();
            var text = "Editar Serviço";
            await this.getService(serviceId);
            $('#form-create-service-modal-label').text(text);
            $('.service-update-section').show()
            $("#form-create-service-modal").modal("show");
        }
    }

    once() {
        if (!this.onceExecuted) {
            DataTable.Buttons.jszip(jszip);
            this.isUpdatingTable = false;

            this.serviceDatatable = this.setDataTable('#tb-services')
            
            $("#slt-service-products").select2({
                placeholder: "Selecione um produto",
            });

            this.setSelect2Multiple("#slt-dependency-products", "Selecione os produto(s)");

            this.txtServiceDescriptionQuill = this.setHtmlEditor('#txt-service-description');
            this.txtServiceOrrQuill = this.setHtmlEditor('#txt-service-orr');

            $('#form-create-service').on('submit', async(event) =>{
                event.preventDefault();
                await this.saveService();
            });

            $(document).on('click', ".btn-grid-delete-service", async(event) =>{
                const serviceId = $(event.currentTarget).data("id");

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
                        await this.deleteService(serviceId);
                    }
                });
            });

            $("#btn-service-clear-form").on('click', (event) => {
                this.resetForm();
            });

            $("#btn-update-service-table").on('click', async (event) => {
                if (!this.isUpdatingTable) {
                    this.isUpdatingTable = true;
                    $(event.currentTarget).attr("disabled", true);
                    await this.loadGrid();
                }
            });
            

            $("#btn-create-service").on('click', async (event) => {
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
               
                $('#form-create-service-modal-label').text(text);
              
                var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.service-update-section').show()
                } else {
                    $('.service-update-section').hide()
                }

                this.resetForm();
                $("#form-create-service-modal").modal("show");
            });

            this.$document.on('click', ".btn-grid-edit-service", async(event) =>{
                this.resetForm();
                var button = $(event.currentTarget);
                var text = button.data('modal-title');
                const serviceId = $(event.currentTarget).data("id");
                await this.getService(serviceId);
                $('#form-create-service-modal-label').text(text);

                 var showUpdateBlock = button.data('show-update-block');
                if (showUpdateBlock) {
                    $('.service-update-section').show()
                } else {
                    $('.service-update-section').hide()
                }

                $("#form-create-service-modal").modal("show");
            })
 

        }
        this.onceExecuted = true;
    }

    onLoad(event, options) {
        this.once();
        if (options.loadData) {
            this.loadGrid().then(async () => {
                await this.viewEdit();
            });
        }
    }

    async saveService() {
        
        let validationTxt = "";
        
        const payload = {
            service_name: $("#txt-service-name").val().trim(),
            service_description: this.txtServiceDescriptionQuill.root.innerHTML,
            service_orr: this.txtServiceOrrQuill.root.innerHTML,
            product_id: $("#slt-service-products").val(),
            active: $("#chk-service-active").is(":checked"),
            dependency_product_ids: $("#slt-dependency-products").val().filter(v => v.trim() !== '').join(",")
        };
         
        const serviceId = parseInt($("#hdn-service-id").val(), 10);
        if (!Number.isNaN(serviceId)) {
            payload.service_id = serviceId;
        }
        // Validate 
        if (!payload.service_name || payload.service_name.length < 2) {
            validationTxt += "O nome do serviço é obrigatório! <br/>";
        }

         if (!payload.product_id || payload.product_id.length === 0) {
            validationTxt += "A seleção do produto é obrigatória! <br/>";
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
            await this.apiServerHttpClient.postServiceV1(payload);
            $('#form-create-service-modal').modal('hide');

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

        $('#form-create-service :input')
            .not('#txt-service-created-at, #txt-service-updated-at, :submit, :button')
            .val('');

        $("#hdn-service-id").val("")
        this.txtServiceDescriptionQuill.setContents([]);
        this.txtServiceOrrQuill.setContents([]);
        $('#slt-service-products').val(null).trigger('change');
        $("#slt-dependency-products").val("").trigger("change");
        $("#chk-service-active").prop("checked", true);

    }

    async deleteService(serviceId) {
        try {
            await this.apiServerHttpClient.deleteServiceV1(serviceId);

            await Swal.fire({
                title: "Deletado!",
                text: "Seu registro foi apagado com sucesso",
                icon: "success",
                width: '500px',
            }).then(async () => {
                await this.loadGrid();
            });
        } catch(err) {
            Swal.fire({
                title: 'Erro!',
                html: 'Ops! Ocorreu um erro ao deletar.<br/><br/>Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                width: '500px'
            });
        }
    }

    async getService(serviceId) {
        const service = await this.apiServerHttpClient.getServiceV1(serviceId);
        if (service) {

            $("#hdn-service-id").val(service.service_id)
            $('.service-update-section').show();
            $("#txt-service-name").val(service.service_name);
            $("#slt-service-products").val(service.product_id).trigger("change");

            if (service.service_dependency_product_ids) {
                const order = service.service_dependency_product_ids.split(',');
                this.reorderSelect2("#slt-dependency-products", order);
                $("#slt-dependency-products").val(order).trigger("change");
            }

            this.txtServiceDescriptionQuill.root.innerHTML = service.service_description;
            this.txtServiceOrrQuill.root.innerHTML = service.service_orr;
            $("#form-create-service-modal").modal("show");
            $("#chk-service-active").prop("checked", service.service_active);

            if (service.service_created_at) {
                $("#txt-service-created-at").val(service.service_created_at);
            } 

            if (service.service_created_at !== service.service_updated_at) {
                $("#txt-service-updated-at").val(service.service_updated_at);
            } else {
                $("#txt-service-updated-at").val("Ainda não atualizado");
            }

        }

    }

    createServiceProductHTML(service, products) {
        let productDependencieHTML = "";
        let itemsHTML = "";

        if (!service.service_dependency_product_ids) return "-";
        const splitedProducts = service.service_dependency_product_ids.split(",").map(i => parseInt(i, 10));

        if (!splitedProducts || !Array.isArray(splitedProducts)) return "Erro ao carregar";

        if (products || products.length > 0) {

            productDependencieHTML += `
                <button class="btn btn-default btn-sm" type="button" data-toggle="collapse" data-target="#collapse-dependency-products-${service.service_id}" aria-expanded="false" aria-controls="collapse-dependency-products-${service.service_id}">
                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Mostrar
                </button>
                <div class="collapse" id="collapse-dependency-products-${service.service_id}">
                    <div class="well">
                        <ul class="list-group">
                            __CONTENT__
                        </ul>
                    </div>
                </div>
            `;  
            for (let index = 0; index < splitedProducts.length; index++) {
                const prod = products[products.findIndex(p => p.product_id == splitedProducts[index])];
                if (prod) {
                    itemsHTML += `
                        <li class="list-group-item">${prod.product_name}</li>
                    `;
                }                 
            }
        }
        return productDependencieHTML.replace("__CONTENT__", itemsHTML);
    }

    async loadGrid() {
        try {
            const results = await this.apiServerHttpClient.getServicesV1();
            const tbody = this.$document.find('#tb-services tbody');
            tbody.html("");

            if (!results.products || results.products.length === 0) {
                $("#slt-service-products").html("<option></option>");
            }

            // Populate service table
            this.serviceDatatable.clear().draw();
            $("#slt-dependency-products").html("<option></option>");
            for (const service of results.services) {

                this.serviceDatatable.row.add([
                    service.service_id,
                    service.service_name,
                    service.product_name,
                    this.createServiceProductHTML(service, results.products),
                    service.team_name,
                    `
                        <button type="button" data-show-update-block="true" data-modal-title="Editar Serviço" data-toggle="modal" data-target="#form-create-service-modal" data-id="${service.service_id}" class="btn btn-info btn-grid-edit-service"><span class="glyphicon glyphicon-pencil"></span></button>
                        <button type="button" data-id="${service.service_id}" class="btn btn-danger btn-grid-delete-service"><span class="glyphicon glyphicon-trash"</span></button>
                    `
                ]).draw(false);

            }

            // Populate product select field
            $("#slt-service-products,#slt-dependency-products").html("<option></option>");
            for (const product of results.products) {
                $("#slt-dependency-products").append(`<option value="${product.product_id}">${product.product_name}</option>`);
                $("#slt-service-products").append(`<option value="${product.product_id}">${product.product_name}</option>`);
            }

            setTimeout(() => {
                this.isUpdatingTable = false;
                $("#btn-update-service-table").attr("disabled", false);
            }, 1000);

        } catch (error) {
            console.error("Error loading services:", error);
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

export default PageServicesContent;