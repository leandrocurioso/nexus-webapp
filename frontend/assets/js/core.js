function loadComponent($document, $element, options) {
    const handler = $element.data("handler");
    const content = $element.data("content");
    const hide = $element.data("hide");
    $element.load(content, function(e) {
        $document.trigger(`${handler}$ComponentLoaded`, Object.assign({}, options, {
            loadData: false
        }));
        if (hide) $element.hide();
    });
}

function getHandler(handlerName) {
    return $(`[data-handler="${handlerName}"]`)
}

function updatePageContent(e,) {
    const currentHash = window.location.hash.toLowerCase();
        $("ul[data-group='SideMenuContent'] li").removeClass("active")
    const pageContentGroups = $("[data-group='PageContent']");
    const content = $(`[data-href='${currentHash}']`);
    const handler = content.data("handler");
    $(`[data-group='SideMenuContent'] li a[href='${currentHash}']`).parent("li").addClass("active");
    pageContentGroups.attr("data-hide", true);
    content.attr("data-hide", false).show();
    content.trigger(`${handler}$ComponentLoaded`,{
        loadData: true
    });
}

export {
    loadComponent,
    getHandler,
    updatePageContent
};