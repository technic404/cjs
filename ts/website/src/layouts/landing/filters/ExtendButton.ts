import {CjsComponent, CjsEventsMap, onClick, svg} from "cjs";

export class ExtendButton extends CjsComponent {
    _template() {
        const { click } = this.events;

        return `
            <button class="extend-button" ${onClick(click)}>
                <img src="${svg('up')}" alt="">
            </button>
        `;
    }

    _events() {
        return {
            click: (e) => {
            const PADDING = 11; // px

            const nav = e.source.parentElement!.querySelector("nav")!;
            const form = nav.querySelector("form")!;
            const formCurrentMaxHeight = parseInt(window.getComputedStyle(form).maxHeight.replace("px", ""));
            const button = e.source;
            const buttonHeight = button.getBoundingClientRect().height;

            if(button.classList.contains("extend")) {
                form.style.maxHeight = '';
                button.style.transform = '';
            } else {
                const remainingWindowHeight = window.innerHeight - nav.getBoundingClientRect().height;
                const extendBy = remainingWindowHeight - buttonHeight - (PADDING * 3);

                form.style.maxHeight = `${formCurrentMaxHeight + extendBy}px`;
            }

            button.classList.toggle("extend");
        }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/filters/_styles/ExtendButton.css';
};