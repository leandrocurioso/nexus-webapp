import Content from "../content.js"; 

class PageMainContent extends Content {

    constructor(options) {
        super(Object.assign({}, {
            uri: "/main",
            contentName: "PageMainContent",
            contentPath: "assets/html-content/page-main-content/page-main-content.html",
        }, options));
    }

}

export default PageMainContent;