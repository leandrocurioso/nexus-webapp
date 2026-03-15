function setupApp($document, initCb, configPath = "/config.json") {
    $.getJSON(configPath, (config) => {
        const app = {
            config,
            $document,
            contentContainer: new Map(),
            totalContentLoaded: 0,
            isLoaded: () => {
                return app.totalContentLoaded == app.contentContainer.size;
            }
        };
        initCb(app);
    });
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

function getConfigValue(config, key = "") {
   try {
    if (!config) throw new Error(`Config object does not exist while getting: ${key}`);
    const value = config[key];
    if (!value) throw new Error(`Key ${key} not found in condig`);
    if (value.value) return value.value;
    if (!value.value && value.default) return value.default;
    throw new Error(`There is no value or default for the config key: ${key}`);
   } catch (err) {
    throw err;
   }
}

export {
    setupApp,
    registerContent,
    startApp,
    registerRouteClickListener,
    getContentByUri,
    getConfigValue,
};