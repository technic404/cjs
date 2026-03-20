export const MapContent = new class MapContent extends CjsComponent {
    data = {};

   _() {
       const {  } = this._renderData;

       return `
          <section class="map-content"></section>
       `;
   }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/MapContent.css';
};