import { CjsComponent } from "cjs";


type Data = {

}

export class MapContent extends CjsComponent<Data> {
    _defaultData = {};

   _template() {
       const {  } = this.data;

       return `
          <section class="map-content"></section>
       `;
   }

   _events() {
        return {};
   }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/MapContent.css';
};