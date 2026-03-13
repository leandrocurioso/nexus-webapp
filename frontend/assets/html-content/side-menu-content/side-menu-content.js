import Content from "../content.js"; 

class SideMenuContent extends Content {
    
    constructor(options) {
        super(Object.assign({}, {
            contentName: "SideMenuContent",
            contentPath: "assets/html-content/side-menu-content/side-menu-content.html",
        }, options));
    }
    
}

export default SideMenuContent;