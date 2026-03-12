import $ from "jquery";
import "bootstrap";
import "select2";
import 'datatables.net-buttons-bs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-colreorder-bs';
import 'datatables.net-columncontrol-bs';
import 'datatables.net-responsive-bs';
import 'datatables.net-scroller-bs';
import 'datatables.net-searchpanes-bs';
import 'datatables.net-select-bs';
import 'datatables.net-staterestore-bs';
 
import AppConfig from "./config.js";
import ApiServerHttpClient from "./api-server-http-client.js";
import { loadComponent, getHandler, updatePageContent } from "./core.js";
import HeaderContent from "../html-content/header/header-content.js";
import PageContent from "../html-content/page-content/page-content.js";
import PageMainContent from "../html-content/page-main-content/page-content.js";
import PageServicesContent from "../html-content/page-services-content/page-services-content.js";
import PageJourneysContent from "../html-content/page-journeys-content/page-journeys-content.js";

$(function($e) {

    const $document = $(document);

    window.addEventListener('hashchange', function(e) {
        updatePageContent(e);
    });

    window.addEventListener('load', function(e) {
        updatePageContent(e);
        
        // Set default hash if not present
        if (!window.location.hash.toLowerCase()) {
            window.location.hash = "#main";
        }

    });

    const apiServerHttpClient = new ApiServerHttpClient(AppConfig.apiServerBaseUri);

    const $componentMap = new Map();
    $componentMap.set("HeaderContent", new HeaderContent($document));
    $componentMap.set("PageContent", new PageContent($document));
    $componentMap.set("PageMainContent", new PageMainContent($document));
    $componentMap.set("PageServicesContent", new PageServicesContent($document, apiServerHttpClient));
    $componentMap.set("PageJourneysContent", new PageJourneysContent($document, apiServerHttpClient));

    loadComponent($document, getHandler("HeaderContent"));
    loadComponent($document, getHandler("PageContent"), {
        onLoadCb: (event) =>{
            loadComponent($document, getHandler("SideMenuContent"));
            loadComponent($document, getHandler("PageMainContent"));
            loadComponent($document, getHandler("PageServicesContent"));
            loadComponent($document, getHandler("PageJourneysContent"));
        }
    });

});
