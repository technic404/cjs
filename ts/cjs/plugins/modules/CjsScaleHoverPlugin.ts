import { CjsPlugin } from "../CjsPlugin";

export class CjsScaleHoverPlugin extends CjsPlugin {
    private readonly attribute = "hover";
    private readonly animationTime = 350;
    private readonly hoverScale = 0.95;

    private addStyles(): void {
        this._addStyleRules({

            [`[${this.attribute}]`]: [
                `transition: transform ${this.animationTime}ms !important;`
            ],

            [`[${this.attribute}]:hover`]: [
                `transform: scale(${this.hoverScale}) !important;`
            ]
        });
    }

    public enable(): void {
        this.addStyles();
    }
}