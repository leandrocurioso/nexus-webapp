import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "select2";
import "select2/dist/css/select2.min.css";
import "datatables.net-bs/css/dataTables.bootstrap.min.css";
import "datatables.net-responsive-bs/css/responsive.bootstrap.min.css";
import "datatables.net-colreorder-bs/css/colReorder.bootstrap.min.css";
import "datatables.net-columncontrol-bs/css/columnControl.bootstrap.min.css";
import "datatables.net-responsive-bs/css/responsive.bootstrap.min.css";
import "datatables.net-scroller-bs/css/scroller.bootstrap.min.css";
import "datatables.net-searchpanes-bs/css/searchPanes.bootstrap.min.css";
import "datatables.net-select-bs/css/select.bootstrap.min.css";
import "datatables.net-staterestore-bs/css/stateRestore.bootstrap.min.css";
import 'datatables.net-buttons-bs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-colreorder-bs';
import 'datatables.net-columncontrol-bs';
import 'datatables.net-responsive-bs';
import 'datatables.net-scroller-bs';
import 'datatables.net-searchpanes-bs';
import 'datatables.net-select-bs';
import 'datatables.net-staterestore-bs';
import '../css/ie10-viewport-bug-workaround.css';
import '../css/dashboard.css';

import AppConfig from "./config.js";
import ApiServerHttpClient from "./api-server-http-client.js";
import { registerContent, setupApp, startApp, getContentByUri } from "./core.js";
import SidebarContent from "../html-content/side-menu-content/side-menu-content.js";
import PageMainContent from "../html-content/page-main-content/page-main-content.js";
import PageServicesContent from "../html-content/page-services-content/page-services-content.js";
import PageJourneysContent from "../html-content/page-journeys-content/page-journeys-content.js";
import PageJourneyCategoriesContent from "../html-content/page-journey-categories-content/page-journey-categories-content.js";

$(function($e) {

    const app = setupApp($(document));

    const apiServerHttpClient = new ApiServerHttpClient(AppConfig.apiServerBaseUri);

    registerContent(app, SidebarContent, "SidebarContent");
    registerContent(app, PageMainContent, "PageMainContent");
    registerContent(app, PageJourneyCategoriesContent, "PageJourneyCategoriesContent", [
        apiServerHttpClient
    ]);
    registerContent(app, PageServicesContent, "PageServicesContent", [
        apiServerHttpClient
    ]);
    registerContent(app, PageJourneysContent, "PageJourneysContent", [
        apiServerHttpClient
    ]);

    startApp(app, {
        onReady: () => {
            const uri = window.location.pathname.toLowerCase();
            const menuItem = $("#sidebar-menu li").find(`a[href='${uri}']`);
            if (menuItem.length > 0 && uri === menuItem.attr("href")) {
                $("#sidebar-menu li").removeClass("active");
                menuItem.parent("li").addClass("active");
                $(`[data-group="Page"]`).attr("data-show",false);
                const content = getContentByUri(app, uri);
                if (content) {
                    content.init({ load: true });
                    $(`[data-content-handler="${content.options.contentName}"]`).attr("data-show",true);
                }
            }
        },
        onRouteClickListener: (e, content) => {
            $("#sidebar-menu li").removeClass("active");
            $(e.currentTarget).parent("li").addClass("active");
            $(`[data-group="Page"]`).attr("data-show",false);
            $(`[data-content-handler="${content.options.contentName}"]`).attr("data-show",true);
        },
    });

});
