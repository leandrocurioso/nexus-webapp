function setupApp($document) {
    const app = {
        $document,
        contentContainer: new Map(),
        totalContentLoaded: 0,
        isLoaded: () => {
           return app.totalContentLoaded == app.contentContainer.size;
        }
    };;

    return app;
}

function registerContent(app, cls, key, args = []) {
    app.contentContainer.set(key, new cls({ document: app.$document }, ...args));
}

function startApp(app, callbackObj) {
    app.contentContainer.forEach((v, k) => { 
        v.load(app); 
    });

    if (callbackObj && callbackObj.onRouteClickListener)
        registerRouteClickListener(app, callbackObj.onRouteClickListener);

    if (callbackObj && callbackObj.onReady) {
        const intervalLoad = setInterval(() => {
            if (app.isLoaded()) {
                callbackObj.onReady();
                clearInterval(intervalLoad);
            }
        }, 50);
    }
        
}

function registerRouteClickListener(app, onRouteClickListener, selector = '[data-link="true"]') {
    app.$document.on("click", selector, (e) => {
        e.preventDefault(); // Stop the page refresh
        const href = $(e.currentTarget).attr("href").toLowerCase();
        if (!href) return;
        window.history.pushState({}, "", href);

        app.contentContainer.forEach((v, k) => {
            if (v.options.uri && v.options.uri === href) {
                v.init({
                    load: true
                });
                onRouteClickListener(e,v);
            }
        });
    });
}

function getContentByUri(app, uri) {
    for (const [key, value] of app.contentContainer) {
        if (value.options.uri && value.options.uri === uri) {
            return value;
        }
    }
    return null;
}

export {
    setupApp,
    registerContent,
    startApp,
    registerRouteClickListener,
    getContentByUri,
};