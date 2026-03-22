import {CjsComponent, CjsEventsMap, onLoad, onScrollBottom, strmap} from "cjs";

type Data = {
    th: any[],
    loadNext?: () => Promise<any[][]>,
    onLoadTd: (reloadTableContentsCallback: (_td: any[][]) => any) => Promise<any[][]>
}

export class CardTable extends CjsComponent<Data> {
    _defaultData = {
        loadNext: async () => [[]],
    } as const;

    _template() {
        const { th } = this.data;
        const { scrollBottom, load } = this.events;

        return `
            <div class="card-table">
                <table ${onLoad(load)} ${onScrollBottom(scrollBottom)}>
                    <tr>${strmap(th, e => `<th>${e}</th>`)}</tr>
                </table>
            </div>
        `;
    }

    #loadItems(element: HTMLElement, td: any[]) {
        element.insertAdjacentHTML(`beforeend`, strmap(
            td,
            e => `
                <tr>${strmap(e, f => `<td>${f}</td>`)}</tr>
                `
        ))
    }

    _events() {
        const { loadNext, onLoadTd } = this.data;
        const el = this.element!;

        return {
            scrollBottom: async (e) => {
                const td = await loadNext!();

                this.#loadItems(el.querySelector("tbody")!, td);
            },
            load: async (e) => {
                const tbody = el.querySelector("tbody")!;
                const replaceTableItemsCallback = (_td: any[]) => {
                    const tdWithoutHeader = Array.from(tbody.children).slice(1);

                    tdWithoutHeader.forEach(c => c.remove());

                    this.#loadItems(tbody, _td);
                };

                const td = await onLoadTd(replaceTableItemsCallback);

                this.#loadItems(tbody, td);
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/CardTable.css';
};