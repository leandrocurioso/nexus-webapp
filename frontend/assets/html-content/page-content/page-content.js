import Content from "../content.js"; 

class PageContent extends Content {

    constructor($document) {
        super($document);
    }

    onLoad(event, options) {
        options.onLoadCb(event)
    }

}

export default PageContent;