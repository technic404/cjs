import {CjsComponent, CjsLayout} from "cjs";
import {Card} from "./Card";
import {SearchInput} from "../inputs/SearchInput";
import {CardTable} from "./CardTable";


type Data = {
    th: any[]
    title: string
    searchCallback: (text: string, offset: number) => Promise<any[]>,
    mapperCallback: (requestObject: any) => any[],
}

export class SearchCard extends CjsComponent<Data> {
    _template() {
        const { th, title, searchCallback, mapperCallback } = this.data;

        let offset = 0;
        let reloadItemsCallback = (td: any[]) => {};

        return new CjsLayout(() => [
            [Card.withData({
                title,
                header: SearchInput.render({
                    input: async (value) => {
                        offset = 0;

                        const items = (await searchCallback(value.trim(), offset));

                        offset += items.length;

                        reloadItemsCallback(items.map(e => mapperCallback(e)));
                    }
                })
            }), [
                [CardTable.withData({
                    th,
                    onLoadTd: async (_reloadItemsCallback) => {
                        reloadItemsCallback = _reloadItemsCallback;

                        offset = 0;

                        const items = (await searchCallback("", offset));

                        offset += items.length;

                        return items.map(p => mapperCallback(p));
                    }
                })]
            ]]
        ]).visualise()[0].outerHTML;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/SearchCard.css';
};
