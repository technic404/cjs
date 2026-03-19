const A = {
  HTMLToElement(n) {
    const e = document.createElement("template");
    e.innerHTML = n.trim();
    const t = e.content.firstElementChild;
    if (!t)
      throw new Error("htmlToElement: Provided HTML produced no element.");
    return t;
  },
  getAttributesStartingWith(n, e) {
    if (!n.attributes) return [];
    const t = [];
    for (const s of Array.from(n.attributes)) {
      const r = s.name;
      r.startsWith(e) && t.push(r);
    }
    return t;
  }
}, T = {
  injectAttribute(n, e, t) {
    const s = n.length;
    let r = 0;
    for (; r < s && n.charCodeAt(r) <= 32; ) r++;
    if (n[r] !== "<") return n;
    const o = r, c = n.indexOf(">", o);
    if (c === -1) return n;
    const i = n.slice(o, c), a = i.indexOf(`${e}=`), u = a !== -1, d = e.length;
    let f;
    if (u) {
      const b = i[a + d], y = a + d + 1, v = i.indexOf(b, y), h = i.slice(y, v).trim(), p = !h.endsWith(";") && h.length > 0 ? h + ";" + t : h + t;
      f = i.slice(0, y) + p + i.slice(v);
    } else
      f = i + ` ${e}="${t}"`;
    return n.slice(0, o) + f + n.slice(c);
  }
}, g = {
  /**
   * Returns values from keys if the value is not an object
   */
  getNonObjectValues(n) {
    const e = (t) => {
      if (!t || typeof t != "object") return [t];
      const s = [];
      for (const r of Object.keys(t)) {
        const o = t[r], c = typeof o == "object" && o !== null && !Array.isArray(o);
        s.push(...c ? e(o) : [o]);
      }
      return s;
    };
    return e(n);
  },
  /**
   * Deep merges two objects
   * object2 overwrites object1 by default
   */
  join(n, e, t = !0) {
    const s = (r, o) => {
      if (typeof r != "object" || r === null)
        return o ?? r;
      const c = Array.isArray(r) ? [...r] : {}, i = /* @__PURE__ */ new Set([
        ...Object.keys(r ?? {}),
        ...Object.keys(o ?? {})
      ]);
      for (const a of i) {
        if (!(a in o)) {
          c[a] = r?.[a];
          continue;
        }
        !t && a in r ? c[a] = r[a] : c[a] = s(r?.[a], o?.[a]);
      }
      return c;
    };
    return s(n, e);
  },
  /**
   * Deep copy of an object
   */
  copy(n) {
    const e = (t) => {
      if (t === null) return null;
      const s = typeof t != "object", r = typeof HTMLElement < "u" && (t instanceof HTMLElement || t instanceof Node);
      if (s || r) return t;
      if (Array.isArray(t))
        return t.map((c) => e(c));
      const o = {};
      for (const [c, i] of Object.entries(t))
        o[c] = e(i);
      return o;
    };
    return e(n);
  },
  /**
   * Removes keys that have nullable / empty values (mutates object)
   */
  filterOutNullableValues(n) {
    for (const [e, t] of Object.entries(n)) {
      const s = typeof t == "object" && t !== null && !Array.isArray(t) && Object.keys(t).length === 0;
      (t == null || Array.isArray(t) && t.length === 0 || typeof t == "string" && t.trim() === "" || s) && delete n[e];
    }
    return n;
  },
  isEmpty(n) {
    return !n || Object.keys(n).length === 0;
  }
}, B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", O = "abcdefghijklmnopqrstuvwxyz0123456789", N = {
  getRandom(n, e = !0) {
    let t = "";
    const s = e ? O : B, r = s.length;
    let o = 0;
    for (; o < n; )
      t += s.charAt(Math.floor(Math.random() * r)), o += 1;
    if (e) {
      const c = (i) => !isNaN(Number(i.substring(0, 1)));
      for (; c(t); )
        t = this.getRandom(n, e);
    }
    return t;
  }
}, l = {
  None: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Black: "\x1B[30m",
  Red: "\x1B[31m",
  Green: "\x1B[32m",
  Yellow: "\x1B[33m",
  Blue: "\x1B[34m",
  Magenta: "\x1B[35m",
  Cyan: "\x1B[36m",
  White: "\x1B[37m"
}, D = {
  0: l.Black,
  1: l.Blue,
  2: l.Green,
  3: l.Cyan,
  4: l.Red,
  5: l.Magenta,
  6: l.Yellow,
  7: l.White,
  8: l.Dim,
  9: l.Blue,
  a: l.Green,
  b: l.Cyan,
  c: l.Red,
  d: l.Magenta,
  e: l.Yellow,
  f: l.White,
  l: l.Bright,
  n: l.Underscore,
  r: l.None
}, k = {
  /**
   * `&0` black
   * `&1` dark blue
   * `&2` dark green
   * `&3` dark aqua
   * `&4` dark red
   * `&5` dark purple
   * `&6` gold
   * `&7` gray
   * `&8` dark gray
   * `&9` blue
   * `&a` green (lime)
   * `&b` aqua
   * `&c` red
   * `&d` light purple
   * `&e` yellow
   * `&f` white
   * `&r` reset
   * `&l` bold
   * `&n` underline
   * @param text 
   * @returns 
   */
  format(n) {
    return n.replace(/&([0-9a-flnr])/gi, (e, t) => D[t.toLowerCase()] ?? "") + l.None;
  }
}, w = "[CJS]";
k.format(`&e&n${w}&r `);
const H = k.format(`&c&n${w}&r `), R = k.format(`&c&a${w}&r `), $ = k.format(`&c&b${w}&r `), x = "fx:render", L = "cjsroot", M = "cjsevent-", C = {
  info(n, ...e) {
    console.log(`${$}${n}`, e);
  },
  success(n, ...e) {
    console.log(`${R}${n}`, e);
  },
  error(n, ...e) {
    console.log(`${H}${n}`, e);
  }
};
class P {
  #e;
  constructor(e) {
    this.#e = e;
  }
  #t = {
    radio: (e) => e.checked ? e.value : null,
    checkbox: (e) => e.checked,
    file: (e) => e.files,
    number: (e) => e.value !== "" ? Number(e.value) : null,
    "*": (e) => e.value
  };
  serialize(e = {}) {
    const t = Array.from(this.#e.querySelectorAll("select")), s = Array.from(this.#e.querySelectorAll("input")), r = Array.from(this.#e.querySelectorAll("textarea")), o = [...t, ...s, ...r], c = {};
    for (let i = 0; i < o.length; i++) {
      const a = o[i], u = a.getAttribute("name");
      if (!u && !e.includeNoNames) continue;
      const d = a.getAttribute("type") ?? "*", b = (this.#t[d] ?? this.#t["*"])(a), y = u ?? i;
      c[y] = b;
    }
    if (e.checkboxesReadType === "array") {
      const i = s.filter((a) => a.type === "checkbox");
      for (const a of i) {
        if (!a.name) {
          C.error("Checkbox doesn't have a name attribute, but it's required when options.checkboxesReadType === array", a);
          continue;
        }
        const u = a.name;
        (!(u in c) || !Array.isArray(c[u])) && (c[u] = []), a.checked && c[u].push(a.value);
      }
    }
    return c;
  }
}
const E = /* @__PURE__ */ new Map();
class q {
  /**
   * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
   */
  constructor(e = null, t = null) {
    this.__events = {}, this._cssStyle = null, this._cssClassName = null, this._additionalStyle = {}, this._defaultData = {}, this._preSetData = {}, e && (this._preSetData = g.copy(e)), t && (this._additionalStyle = g.copy(t));
  }
  /**
   * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
   */
  /** Provides the HTML string for the component */
  getHtml() {
    let e = this._template();
    if (g.isEmpty(this._additionalStyle) || (e = T.injectAttribute(
      e,
      "style",
      Object.entries(this._additionalStyle).map((t) => `${t[0]}: ${t[1]}`).join("; ")
    )), this._cssStyle) {
      const t = E.has(this._cssStyle) ? E.get(this._cssStyle) : (() => {
        let s = null;
        const r = Array.from(E.values());
        for (; s == null || r.includes(s); )
          s = N.getRandom(6);
        return E.set(this._cssStyle, s), s;
      })();
      e = T.injectAttribute(
        e,
        "class",
        t
      );
    }
    return e;
  }
  /**
   * 
   * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
   * 
   */
  /** Function that provides template for base html structure */
  _template() {
    return "";
  }
  /** Function that provides actions for the component */
  _events() {
    return {};
  }
  /** Provides component as an HTML element */
  visualise(e = null) {
    return e && (this._preSetData = g.copy(e)), A.HTMLToElement(this.getHtml());
  }
  /**
   * 
   * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
   * 
   */
  /** Provides merged component data including default data and pre-set data */
  get data() {
    return g.copy(
      g.join(this._defaultData, this._preSetData)
    );
  }
  /** Provides all form elements within the component as CjsForm instances */
  get forms() {
    return Array.from(
      A.HTMLToElement(this.getHtml()).querySelectorAll("form"),
      (e) => new P(e)
    );
  }
  /** Provides all event handlers for the component */
  get events() {
    const e = this;
    return new Proxy(this.__events, {
      get(t, s) {
        return s in t ? t[s] : (r) => {
          e._events()[s](r);
        };
      }
    });
  }
  /**
   * 
   * / 🟡 ------------ STATIC SCOPE ------------ 🟡 /
   * 
   */
  /** Provides a rendered HTML string for the component */
  static render(e = {}) {
    return new this(e).getHtml();
  }
  /** Provides a visualised HTML element for the component */
  static visualise(e = {}) {
    return A.HTMLToElement(new this(e).getHtml());
  }
  /** Sets the data for the component */
  static withData(e = {}) {
    return new this(e);
  }
  /** Sets additional style for the component */
  static withStyle(e) {
    return new this(null, e);
  }
}
class _ {
  /**
   * @param elements Function returning layout structure
   */
  constructor(e) {
    this._preSetData = null, this.elements = e;
  }
  withData(e) {
    const t = Object.create(Object.getPrototypeOf(this));
    return Object.assign(t, this), t._preSetData = e, t;
  }
  createErrorElement() {
    return document.createElement("cjslayouterror");
  }
  /** Build DOM structure */
  visualise() {
    const e = document.createElement("div");
    function t(r) {
      return typeof r == "function" && r.prototype?.constructor === r;
    }
    const s = (r) => {
      if (!Array.isArray(r))
        return C.error("Layout have wrong pattern, component should be in array"), [this.createErrorElement()];
      if (r.length === 0)
        return C.error("Layout have an empty component space"), [this.createErrorElement()];
      const o = r[0];
      if (o instanceof _) return o.visualise();
      const c = t(o) ? new o() : o;
      if (!(c instanceof q))
        return C.error("The element should be CjsComponent, but passed", c), [this.createErrorElement()];
      const i = c.visualise();
      if (r.length === 2) {
        let u = i.getElementsByTagName(x)[0];
        const d = r[1];
        if (!Array.isArray(d))
          return C.error("Layout sub components at second argument have to be Array"), [i];
        d.forEach((f, b) => {
          if (f === null) return;
          const y = b === d.length - 1, v = f[0], h = s(f);
          if (v instanceof _) {
            for (const p of h)
              i.insertAdjacentElement("beforeend", p);
            return;
          }
          if (u = i.getElementsByTagName(x)[0], u) {
            y || u.insertAdjacentElement(
              "afterend",
              document.createElement(x)
            );
            for (const p of h)
              u.insertAdjacentElement("afterend", p);
            u.remove();
          } else
            for (const p of h)
              i.insertAdjacentElement("beforeend", p);
        });
      }
      return [i];
    };
    return this.elements(this._preSetData).forEach((r) => {
      if (!r) return;
      const o = s(r.filter((c) => c !== null));
      for (const c of o)
        e.insertAdjacentElement(
          "beforeend",
          c
        );
    }), Array.from(e.children);
  }
}
const S = new class {
  #e = /* @__PURE__ */ new Map();
  constructor() {
  }
  /**
   * @param eventCallback 
   * @returns attribute that have to applied to element, to properly detect element to add the click event
   */
  addCallback(e) {
    const t = N.getRandom(16);
    return this.#e.set(t, e), ` ${M}${t}`;
  }
  hasCallback(e) {
    return this.#e.has(e);
  }
  getCallback(e) {
    return this.#e.get(e);
  }
}(), j = new class {
  #e;
  constructor() {
    this.#e = new MutationObserver(this.callback);
  }
  processForms() {
    document.body.querySelectorAll("form").forEach((e) => {
      e.onsubmit = (t) => t.preventDefault();
    });
  }
  processElementEvents(e) {
    const t = A.getAttributesStartingWith(
      e,
      M
    );
    if (t.length !== 0)
      for (const s of t) {
        const r = Array.from(document.body.querySelectorAll(`[${s}]`)), o = s.replace(M, "");
        for (const c of r) {
          if (c.removeAttribute(s), !S.hasCallback(o)) continue;
          const i = S.getCallback(o);
          (i.applyToWindow ? window : c).addEventListener(
            i.eventName,
            (u) => i.callback({ event: u, source: c })
          );
        }
      }
  }
  callback(e) {
    this.processForms();
    const s = e.filter((r) => r.type === "childList").map((r) => Array.from(r.addedNodes)).flat().filter((r) => r.nodeType === 1).map((r) => {
      const o = document.createElement("div");
      return o.appendChild(r.cloneNode(!0)), o;
    }).map((r) => Array.from(r.querySelectorAll("*"))).flat();
    for (const r of s)
      this.processElementEvents(r);
  }
  observe() {
    this.#e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}();
function W(n) {
  const e = document.body.querySelector(L);
  if (!e)
    return document.body.appendChild(document.createElement(L)), W(n);
  e.innerHTML = "";
  for (const t of n.visualise())
    e.appendChild(t);
  window.addEventListener("DOMContentLoaded", (t) => {
    Array.from(document.body.querySelectorAll("*")).forEach((s) => {
      j.processElementEvents(s);
    }), j.observe();
  });
}
const m = (n, e) => S.addCallback({
  eventName: n,
  callback: e,
  applyToWindow: !1
}), I = (n) => m("change", n), z = (n) => m("click", n), G = (n) => m("dblclick", n), Y = (n) => m("focus", n), V = (n) => m("focusout", n), J = (n) => m("input", n), Q = (n) => m("mouseenter", n), K = (n) => m("mouseleave", n), X = (n) => m("mousemove", n), Z = (n) => m("resize", n), ee = (n) => m("scroll", n), te = (n) => m("touchmove", n);
export {
  q as CjsComponent,
  _ as CjsLayout,
  W as init,
  I as onChange,
  z as onClick,
  G as onDoubleClick,
  Y as onFocus,
  V as onFocusOut,
  J as onInput,
  Q as onMouseEnter,
  K as onMouseLeave,
  X as onMouseMove,
  Z as onResize,
  ee as onScroll,
  te as onTouchMove
};
//# sourceMappingURL=cjs.mjs.map
