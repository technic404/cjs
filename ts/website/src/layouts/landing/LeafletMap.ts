import { CjsComponent, onLoad, png } from "cjs";
import { ThemeUtil } from "../utils/ThemeUtil";
import {App} from "../../requests/App";
import {T} from "../utils/TranslationsUtil";

type Data = {

}

export class LeafletMap extends CjsComponent<Data> {
    _defaultData = {};

    _template() {
        const {  } = this.data;
        const { load } = this.events;

        return `
            <div class="leaflet-map" ${onLoad(load)} id="map"></div>
        `;
    }

    _events() {
        return this._wrapEvents({
            load: (e) => {
                e.source.style.height = `${window.innerHeight}px`;
                const map = L
                    .map('map', { attributionControl: false, zoomControl: false })
                    .setView([46.6 - 7, 29.8 - 3], 5);

                L.control.zoom({ position: 'topright' }).addTo(map);
                L.control.attribution({ position: 'topright' }).addTo(map);
                L.tileLayer(`https://{s}.basemaps.cartocdn.com/${ThemeUtil.getTheme()}_all/{z}/{x}/{y}{r}.png`, {
                    attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
                }).addTo(map);

                const lasso = L.lasso(map);

                map.on("lasso.finished", async function (event) {
                    const selectedMarkers = event.layers;
                    const selectedSites = selectedMarkers.map(marker => marker.site);

                    const publications = await App.publications.search(
                        { archaeologicalSiteIds: selectedSites.map(s => s.id) }
                    );

                    // Results.loadPublications(publications);
                });

                const button = L.control({ position: 'topright' });

                button.onAdd = function () {
                    const btn = L.DomUtil.create('button', '');
                    btn.innerHTML = T.p("lassoSelection");
                    btn.className = "leaflet-control-lasso-enable";
                    btn.onclick = () => lasso.enable();
                    return btn;
                };

                button.addTo(map);

                const loadFromCenter = async () => {
                    const { lat, lng } = map.getCenter();

                    const sites = await App.archaeologicalSites.getAll();

                    if(!sites) return;

                    for(const site of sites) {
                        const customIcon = L.icon({
                            iconUrl: png(`pins/blue`),
                            iconSize: [40, 40],
                            popupAnchor: [0, -35]
                        });
                        const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(map);

                        marker.site = site;

                        marker.on('click', async function () {
                            const publications = await App.publications.search({ archaeologicalSiteIds: [site.id] });

                            Results.loadPublications(publications);
                        });
                    }
                }
                // map.on('moveend', loadFromCenter);

                loadFromCenter();
            } 
        });
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/LeafletMap.css';
};

LeafletMap.fillHeight();