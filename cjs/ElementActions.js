class CjsEvent {
    /**
     *
     * @param {Event|ChangesObserverEvent} event
     * @param {HTMLElement} component nearest component html element
     * @param {HTMLElement} part nearest part html element
     * @param {HTMLElement} source element to witch the event was applied
     * @param {Object} data
     */
    constructor(event, component, part, source, data) {
        this.event = event;
        this.target = event.target;
        this.component = component;
        this.part = part;
        this.source = source;
        this.data = data;
    }
}

function cjsEventFunction(f, event, sourceElement, data) {
    f(new CjsEvent(
        event,
        findParentThatHasAttribute(sourceElement, CJS_COMPONENT_PREFIX),
        findParentThatHasAttribute(sourceElement, CJS_PART_PREFIX),
        sourceElement,
        data
    ));
}

/**
 *
 * @param {CjsCustomEvents} event
 */
function off(...event) {
    return functionMappings.disable(event);
}

/**
 * Executes when clicked on the element
 * @param {function(CjsEvent)} f
 */
function onClick(f) {
    return functionMappings.add("click", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when clicked on the element
 * @param {function(CjsEvent)} f
 */
function onInput(f) {
    return functionMappings.add("input", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when changed the element
 * @param {function(CjsEvent)} f
 */
function onChange(f) {
    return functionMappings.add("change", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when focused the element
 * @param {function(CjsEvent)} f
 */
function onFocus(f) {
    return functionMappings.add("focus", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when focused out the element
 * @param {function(CjsEvent)} f
 */
function onFocusOut(f) {
    return functionMappings.add("focusout", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when mouse enter the element
 * @param {function(CjsEvent)} f
 */
function onMouseenter(f) {
    return functionMappings.add("mouseenter", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when mouse leave the element
 * @param {function(CjsEvent)} f
 */
function onMouseleave(f) {
    return functionMappings.add("mouseleave", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when double-clicked on the element
 * @param {function(CjsEvent)} f
 */
function onDblclick(f) {
    return functionMappings.add("dblclick", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when clicked outside the element
 * @param {function(CjsEvent)} f
 */
function onOuterclick(f) {
    return functionMappings.add("click", (event, element, data) => {
        if (!document.body.contains(element)) return;

        if (element !== event.target && !element.contains(event.target)) {
            cjsEventFunction(f, event, element, data);
        }
    }, {windowApplied: true, additionalName: 'outerclick'});
}

// TODO add cancelLeftRightThreshold to function onSlideDown and create function onSlideUp

/**
 *
 * @param {function(CjsEvent)} f
 * @param {Number} slideThreshold
 * @returns {String}
 */
function onSlideUp(f, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY;
        let lastClientY = null;

        const start = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY - 1 <= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = undefined;
                return;
            }

            if(deltaY < -1 *  slideThreshold) {
                f(cjsEvent)

                startY = undefined;
            }

            lastClientY = clientY;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}

/**
 *
 * @param {function(CjsEvent)} f
 * @param {Number} slideThreshold
 * @returns {String}
 */
function onSlideDown(f, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY;
        let lastClientY = null;

        const start = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY + 1 >= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = undefined;
                return;
            }

            if(deltaY > slideThreshold) {
                f(cjsEvent)

                startY = undefined;
            }

            lastClientY = clientY;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}

/**
 *
 * @param {function(CjsEvent)} f
 * @param {Number} slideThreshold triggers event when user slides by that amount of pixels
 * @param {Number} cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 * @returns {String}
 */
function onSlideRight(f, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: null, startY: null, lastX: null, lastY: null }

        const start = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX + 1 >= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = undefined;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = undefined;
                return;
            }

            if(deltaX > slideThreshold) {
                f(cjsEvent)

                mouse.startX = undefined;
            }

            mouse.lastX = clientX
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}

/**
 *
 * @param {function(CjsEvent)} f
 * @param {Number} slideThreshold triggers event when user slides by that amount of pixels
 * @param {Number} cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 * @returns {String}
 */
function onSlideLeft(f, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: null, startY: null, lastX: null, lastY: null }

        const start = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX - 1 <= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = undefined;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = undefined;
                return;
            }

            if(deltaX < -1 * slideThreshold) {
                f(cjsEvent)

                mouse.startX = undefined;
            }

            mouse.lastX = clientX;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}

/**
 *
 * @param {function(CjsEvent)} f
 * @param {Number} time time of hold down in ms
 * @returns {String}
 */
function onHoldDown(f, time = 500) {
    return onLoad(cjsEvent => {
        let timeout;

        const cancel = () => { clearTimeout(timeout); }
        const down = () => {
            timeout = setTimeout(() => {
                f(cjsEvent);
            }, time);
        }

        cjsEvent.source.addEventListener('mousedown', down);
        cjsEvent.source.addEventListener('touchstart', down);

        cjsEvent.source.addEventListener('mouseup', cancel);
        cjsEvent.source.addEventListener('mousemove', cancel);
        cjsEvent.source.addEventListener('touchend', cancel);
        cjsEvent.source.addEventListener('touchcancel', cancel);
        cjsEvent.source.addEventListener('touchmove', cancel);
    })
}

/**
 * Executes when element is being loaded into website
 * @param {function(CjsEvent)} f
 */
function onLoad(f) {
    return changesObserver.listen("add", f);
}