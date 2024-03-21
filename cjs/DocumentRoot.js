/**
 * Definition of Root website class
 */
class CjsRoot {
    constructor() {
        // Default website properties
        this.website = {
            title: "New project",
            icon: null,
        };
    }

    /**
     *
     * @param {CjsCursorTypes} cursor
     */
    setCursor(cursor) {
        document.body.style.cursor = cursor;
    }

    /**
     *
     * @param {{title?: string, icon?: string}} data
     */
    setDocumentData(data) {
        // Set default values for missing options in data object
        Object.keys(this.website).forEach(key => {
            if(!(key in data)) {
                data[key] = this.website[key];
            } else {
                this.website[key] = data[key];
            }
        });

        function createLink(rel, href) {
            if(href === null) return;

            const element = document.createElement("link");
            element.rel = rel;
            element.href = href;

            document.head.appendChild(element);
        }

        document.title = data.title;

        document.head.appendChild(document.createComment("Meta definitions"))

        // Links
        createLink("icon", data.icon);
    }
}

const Root = new CjsRoot();