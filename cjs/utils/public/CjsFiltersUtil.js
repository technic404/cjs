class CjsFilter {
    /**
     * @param {string} name
     * @param {number} amount
     * @param {string} direction
     * @param {number} time
     * @param {string} className
     */
    constructor(name, amount, direction, time, className) {
        this.name = name;
        this.amount = amount;
        this.direction = direction;
        this.time = time;
        this.className = className;
    }

    getClassName() {
        return this.className;
    }
}

/**
 * @param {CjsFilterTypes} filterName
 * @param {number} filterAmount
 * @param {CjsFilterDirections} filterDirection
 * @param {number} timeMs
 */
function addStyle(filterName, filterAmount, filterDirection, timeMs) {
    const style = document.head.querySelector(`[id="${CJS_STYLE_FILTERS_PREFIX}"]`);

    let filter = {
        from: null, to: null
    }

    switch (filterName) {
        case "grayscale": filter = { from: `grayscale(0)`, to: `grayscale(${filterAmount})` }; break;
        case "blur": filter = { from: `blur(0px)`, to: `blur(${filterAmount}px)` }; break;
        case "brightness": filter = { from: `brightness(0%)`, to: `brightness(${filterAmount}%)` }; break;
        case "contrast": filter = { from: `contrast(0%)`, to: `contrast(${filterAmount}%)` }; break;
        case "hue-rotate": filter = { from: `hue-rotate(0deg)`, to: `hue-rotate(${filterAmount}deg)` }; break;
        case "invert": filter = { from: `invert(0%)`, to: `invert(${filterAmount}%)` }; break;
        case "opacity": filter = { from: `opacity(0)`, to: `opacity(${filterAmount})` }; break;
        case "saturate": filter = { from: `saturate(0%)`, to: `saturate(${filterAmount}%)` }; break;
        case "sepia": filter = { from: `sepia(0%)`, to: `sepia(${filterAmount}%)` }; break;
    }

    if(filterDirection === "reverse") {
        const to = filter.to;

        filter.to = filter.from;
        filter.from = to;
    }

    const className = `${CJS_STYLE_FILTERS_PREFIX}${filterName}-${getRandomCharacters(8)}`;
    const animationName = getRandomCharacters(32);

    const css = `
    .${className} {
        filter: ${filter.to};
        animation: ${animationName} ${timeMs / 1000}s;
    }
    
    @keyframes ${animationName} {
        0% { filter: ${filter.from}; }
        100% { filter: ${filter.to}; }
    }
    `

    style.innerHTML += css;

    return new CjsFilter(
        filterName,
        filterAmount,
        filterDirection,
        timeMs,
        className
    );
}

const ACTIVE_FILTERS = { blur: [], opacity: [] };

async function passFilterToElement(el, name, amount, direction, time) {
    const matchingElements = ACTIVE_FILTERS[name].filter(e => {
        return (
            e.name === name &&
            e.amount === amount &&
            e.direction === direction &&
            e.time === time
        )
    });

    const cjsFilter = (matchingElements.length > 0 ? matchingElements[0] : addStyle(name, amount, direction, time));

    ACTIVE_FILTERS[name].push(cjsFilter);
    ACTIVE_FILTERS[name].forEach(c => { el.classList.remove(c.getClassName()); });

    el.classList.add(cjsFilter.getClassName());

    await sleep(time);

    el.classList.remove(cjsFilter.getClassName());
}

/**
 * @param {HTMLElement} element
 * @param {CjsFilterOptions} options
 * @return {Promise<void>}
 */
async function createFilter(element, options) {
    if(!("time" in options)) { options.time = 500; }
    if(!("amount" in options)) { options.amount = 10; }
    if(!("direction" in options)) { options.direction = "standard"; }

    await passFilterToElement(element, options.filter, options.amount, options.direction, options.time);
}