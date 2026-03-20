import {App} from "../../requests/App";

export type LanguageTag = "pl" | "en" | "ru";

type TranslationContent = Record<string, string>;

class TranslationsClass {
    #ElementAttributePrefix = "n-translation";
    #DefaultLang: LanguageTag = "en";

    lang: LanguageTag = this.#DefaultLang;
    content: TranslationContent | null = null;

    constructor() {
        const observer = new MutationObserver((mutations) => {
            if (!this.content) return;

            const filtered = mutations
                .filter((mutation) => mutation.type === "childList")
                .flatMap((mutation) => Array.from(mutation.addedNodes))
                .filter((node): node is Element => node instanceof Element)
                .flatMap((node) => [node, ...Array.from(node.querySelectorAll("*"))])
                .filter((element) =>
                    element.getAttribute(this.#ElementAttributePrefix) !== null
                );

            for (const element of filtered) {
                const messageKey = element.getAttribute(this.#ElementAttributePrefix);
                this.#reloadTranslationElements(messageKey ?? undefined);
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    /**
     * Reloads all translation elements with currently selected language
     */
    #reloadTranslationElements(withCertainMessageKey?: string) {
        if (!this.content) return;

        const elements = Array.from(
            document.body.querySelectorAll<HTMLElement>(
                `[${this.#ElementAttributePrefix}]`
            )
        );

        for (const element of elements) {
            const messageKey = element.getAttribute(
                this.#ElementAttributePrefix
            );

            if (!messageKey) continue;
            if (withCertainMessageKey && withCertainMessageKey !== messageKey)
                continue;

            if (!(messageKey in this.content)) {
                console.error(`Missing translation in ${this.lang}/${messageKey}`);
                continue;
            }

            element.innerText = this.content[messageKey];
        }
    }

    /**
     * Loads language JSON from API
     */
    async #loadLanguage(lang: LanguageTag): Promise<void> {
        const content = await App.translations.get(lang);

        if (!content) return;

        this.content = content as TranslationContent;
    }

    /**
     * Sets and loads the new language
     */
    set(lang: LanguageTag): void {
        this.lang = lang;

        this.#loadLanguage(this.lang).then(() => {
            this.#reloadTranslationElements();
        });
    }

    /**
     * Returns a <span> string with translation binding
     */
    p(messageKey: string): string {
        const content =
            this.content && messageKey in this.content
                ? this.content[messageKey]
                : "";

        return `<span 
      class="skeleton-text"
      style="color: inherit; 
      font-family: inherit; 
      font-size: inherit;
      text-align: inherit;
      text-wrap: inherit;"
      ${this.#ElementAttributePrefix}="${messageKey}"
    >${content}</span>`;
    }
}

export const Translations = new TranslationsClass();
export const T = Translations;