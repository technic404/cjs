import {CjsComponent, CjsEventsMap, CjsSearch, onClick, strif, svg} from "cjs";

type Data = {
    icon: string
    text: string
    path: string
    isActive?: boolean
}

export class Section extends CjsComponent<Data> {
    _defaultData = {
        icon: svg('admin'),
        text: "Example",
        path: "/example",
        isActive: false,
    };

    _template() {
        const { icon, text, isActive } = this.data;
        const { click } = this.events;

        return `
            <button ${strif(isActive!, "class='active'")} ${onClick(click)}>
                <div class="line"></div>
                <div class="content">   
                    <img src="${icon}" alt="${text}">
                    <p>${text}</p>
                </div>
            </button>
        `;
    }

    _events() {
        const { path } = this.data;

        return {
            click: (e) => {
                this.getComponents().classList.addOnlyRemoveOthers("active", e.source);

                CjsSearch.set(path);
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/side/_styles/Section.css';
};