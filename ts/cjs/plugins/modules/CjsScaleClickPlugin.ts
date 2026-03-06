import { CjsKeyFrame } from "../../utils/public/CjsKeyFramesUtil";
import { CjsPlugin } from "../CjsPlugin";

export class CjsScaleClickPlugin extends CjsPlugin {
    private readonly attribute = "scale";
    private readonly animationTime = 350;
    private readonly scales = {
        start: 0.85,
        end: 1
    };

    private readonly keyframe: CjsKeyFrame;

    constructor() {
        super();

        this.keyframe = new CjsKeyFrame()
            .setDuration(this.animationTime)
            .addEntry({ transform: `scale(${this.scales.start})` })
            .addEntry({ transform: `scale(${this.scales.end})` });
    }

    private handleTouch(element: HTMLElement, isTouchStart: boolean): void {
        if (element.hasAttribute("disabled")) return;

        const className = this.keyframe.getClass({
            reversed: isTouchStart
        });

        const endScale = isTouchStart
            ? this.scales.start
            : this.scales.end;

        element.classList.add(className);
        element.style.transform = `scale(${endScale})`;

        setTimeout(() => {
            element.classList.remove(className);

            if (!isTouchStart) {
                element.style.transform = "";
            }

        }, this.animationTime);
    }

    private applyEvents(element: HTMLElement): void {
        if ((element as any).__scaleAttached) return;

        element.addEventListener("touchstart", () => {
            this.handleTouch(element, true);
        });

        element.addEventListener("touchend", () => {
            this.handleTouch(element, false);
        });

        (element as any).__scaleAttached = true;
    }

    public enable(): void {
        const attachToExisting = (): void => {
            document
                .querySelectorAll<HTMLElement>(`[${this.attribute}]`)
                .forEach(el => this.applyEvents(el));
        };

        attachToExisting();

        const observer = new MutationObserver((mutations) => {
            const added = mutations
                .filter(m => m.type === "childList")
                .flatMap(m => Array.from(m.addedNodes))
                .filter((node): node is HTMLElement =>
                    node instanceof HTMLElement
                )
                .flatMap(node => [
                    node,
                    ...Array.from(node.querySelectorAll<HTMLElement>("*"))
                ])
                .filter(el => el.hasAttribute(this.attribute));

            for (const el of added) {
                this.applyEvents(el);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
}