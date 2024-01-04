/**
 * Definition of base action modules
 */
const functionMappings = new FunctionMappings();

/**
 * Definition of Root website class
 */
class CjsRoot {
    constructor() {
        // Default website properties
        this.website = {
            title: "New project",
            icon: null,
            description: "Default website description",
            themeColor: '#ffffff'
        };
    }

    /**
     *
     * @param {"alias"|"all-scroll"|"auto"|"cell"|"context-menu"|"col-resize"|"copy"|"crosshair"|"default"|"e-resize"|"ew-resize"|"grab"|"grabbing"|"help"|"move"|"n-resize"|"ne-resize"|"nesw-resize"|"ns-resize"|"nw-resize"|"nwse-resize"|"no-drop"|"none"|"not-allowed"|"pointer"|"progress"|"row-resize"|"s-resize"|"se-resize"|"sw-resize"|"text"|"url"|"w-resize"|"wait"|"zoom-in"|"zoom-out"} cursor
     */
    setCursor(cursor) {
        document.body.style.cursor = cursor;
    }

    /**
     *
     * @param {{title?: string, icon?: string, description?: string, themeColor?: string}} data
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

        function createMeta(name, content) {
            if(content === null) return;

            const element = document.createElement("meta");
            element.name = name;
            element.content = content;

            document.head.appendChild(element);
        }

        document.title = data.title;

        document.head.appendChild(document.createComment("Meta definitions"))

        // Links
        createLink("icon", data.icon);

        // Metas
        createMeta("description", data.description);
        createMeta("theme-color", data.themeColor);
    }
}

const Root = new CjsRoot();