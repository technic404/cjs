import { CjsPlugin } from "../CjsPlugin";

export class CjsRipplePlugin extends CjsPlugin {

    /* Attribute that enables ripple */
    private readonly attribute = "ripple";

    /* Animation time */
    private readonly animationTime = 400;

    /* CSS variable names */
    private readonly cssVariables = {
        s: "sx",
        t: "tx",
        o: "ox",
        d: "dx",
        x: "xx",
        y: "yx"
    };

    private applyEffect(element: HTMLElement): void {
        // Prevent attaching duplicate listeners
        if ((element as any).__rippleAttached) return;

        element.addEventListener("click", (event: MouseEvent | TouchEvent) => {

            const e = (event as TouchEvent).touches
                ? (event as TouchEvent).touches[0]
                : (event as MouseEvent);

            const rect = element.getBoundingClientRect();
            const diameter =
                Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) * 2;

            element.style.cssText =
                `--${this.cssVariables.s}: 0; --${this.cssVariables.o}: 1;`;

            // Force reflow
            element.offsetTop;

            element.style.cssText =
                `--${this.cssVariables.t}: 1;
                 --${this.cssVariables.o}: 0;
                 --${this.cssVariables.d}: ${diameter};
                 --${this.cssVariables.x}: ${e.clientX - rect.left};
                 --${this.cssVariables.y}: ${e.clientY - rect.top};`;

        });

        // Mark as attached
        (element as any).__rippleAttached = true;
    }

    private addStyles(): void {
        const cssAnimationTime = `${this.animationTime}ms`;

        this._addStyleRules({

            [`[${this.attribute}]`]: [
                "cursor: pointer;",
                "overflow: hidden;",
                "position: relative;",
                "-webkit-user-select: none;",
                "-moz-user-select: none;",
                "-ms-user-select: none;",
                "user-select: none;",
                "-webkit-tap-highlight-color: rgba(0,0,0,0);"
            ],

            [`[${this.attribute}]::before`]: [
                "content: '';",
                "display: block;",
                "border-radius: 50%;",
                "position: absolute;",
                "pointer-events: none;",
                "transform-origin: center;",
                `top: calc(var(--${this.cssVariables.y}) * 1px);`,
                `left: calc(var(--${this.cssVariables.x}) * 1px);`,
                `width: calc(var(--${this.cssVariables.d}) * 1px);`,
                `height: calc(var(--${this.cssVariables.d}) * 1px);`,
                "background: var(--ripple-background, white);",
                `transform: translate(-50%, -50%) scale(var(--${this.cssVariables.s}, 1));`,
                `opacity: calc(var(--${this.cssVariables.o}, 1) * var(--ripple-opacity, 0.3));`,
                `transition: calc(var(--${this.cssVariables.t}, 0) * var(--ripple-duration, ${cssAnimationTime})) var(--ripple-easing, linear);`
            ]
        });
    }

    public enable(): void {
        this.addStyles();

        // Apply to existing elements
        document.querySelectorAll<HTMLElement>(`[${this.attribute}]`)
            .forEach(el => this.applyEffect(el));

        // Observe future elements
        const observer = new MutationObserver((mutations) => {

            const addedElements = mutations
                .filter(m => m.type === "childList")
                .flatMap(m => Array.from(m.addedNodes))
                .filter((node): node is HTMLElement => node instanceof HTMLElement)
                .flatMap(node => [
                    node,
                    ...Array.from(node.querySelectorAll<HTMLElement>("*"))
                ])
                .filter(el => el.hasAttribute(this.attribute));

            for (const element of addedElements) {
                this.applyEffect(element);
            }

        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
}