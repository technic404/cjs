const M = {
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
}, S = {
  injectAttribute(n, e, t) {
    const s = n.length;
    let r = 0;
    for (; r < s && n.charCodeAt(r) <= 32; ) r++;
    if (n[r] !== "<") return n;
    const o = r, c = n.indexOf(">", o);
    if (c === -1) return n;
    const i = n.slice(o, c), l = i.indexOf(`${e}=`), d = l !== -1, y = e.length;
    let m;
    if (d) {
      const A = i[l + y], g = l + y + 1, E = i.indexOf(A, g), f = i.slice(g, E).trim(), h = !f.endsWith(";") && f.length > 0 ? f + ";" + t : f + t;
      m = i.slice(0, g) + h + i.slice(E);
    } else
      m = i + ` ${e}="${t}"`;
    return n.slice(0, o) + m + n.slice(c);
  }
}, p = {
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
      for (const l of i) {
        if (!(l in o)) {
          c[l] = r?.[l];
          continue;
        }
        !t && l in r ? c[l] = r[l] : c[l] = s(r?.[l], o?.[l]);
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
};
class j {
  /**
   * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
   */
  constructor(e = null, t = null) {
    this.__events = {}, this._cssStyle = null, this._additionalStyle = {}, this._defaultData = {}, this._preSetData = {}, e && (this._preSetData = p.copy(e)), t && (this._additionalStyle = p.copy(t));
  }
  /**
   * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
   */
  getHtml() {
    let e = this._template();
    return p.isEmpty(this._additionalStyle) || (e = S.injectAttribute(
      e,
      "style",
      Object.entries(this._additionalStyle).map((t) => `${t[0]}: ${t[1]}`).join("; ")
    )), e;
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
  visualise(e = null) {
    return e && (this._preSetData = p.copy(e)), M.HTMLToElement(this.getHtml());
  }
  /**
   * 
   * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
   * 
   */
  get data() {
    return p.copy(
      p.join(this._defaultData, this._preSetData)
    );
  }
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
  static render(e = {}) {
    return new this(e).getHtml();
  }
  static visualise(e = {}) {
    return M.HTMLToElement(new this(e).getHtml());
  }
  static withData(e = {}) {
    return new this(e);
  }
  static withStyle(e) {
    return new this(null, e);
  }
}
const a = {
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
}, B = {
  0: a.Black,
  1: a.Blue,
  2: a.Green,
  3: a.Cyan,
  4: a.Red,
  5: a.Magenta,
  6: a.Yellow,
  7: a.White,
  8: a.Dim,
  9: a.Blue,
  a: a.Green,
  b: a.Cyan,
  c: a.Red,
  d: a.Magenta,
  e: a.Yellow,
  f: a.White,
  l: a.Bright,
  n: a.Underscore,
  r: a.None
}, b = {
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
    return n.replace(/&([0-9a-flnr])/gi, (e, t) => B[t.toLowerCase()] ?? "") + a.None;
  }
}, v = "[CJS]";
b.format(`&e&n${v}&r `);
const O = b.format(`&c&n${v}&r `), N = b.format(`&c&a${v}&r `), D = b.format(`&c&b${v}&r `), w = "fx:render", L = "cjsroot", k = "cjsevent-", C = {
  info(n, ...e) {
    console.log(`${D}${n}`, e);
  },
  success(n, ...e) {
    console.log(`${N}${n}`, e);
  },
  error(n, ...e) {
    console.log(`${O}${n}`, e);
  }
};
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
      if (!(c instanceof j))
        return C.error("The element should be CjsComponent, but passed", c), [this.createErrorElement()];
      const i = c.visualise();
      if (r.length === 2) {
        let d = i.getElementsByTagName(w)[0];
        const y = r[1];
        if (!Array.isArray(y))
          return C.error("Layout sub components at second argument have to be Array"), [i];
        y.forEach((m, A) => {
          if (m === null) return;
          const g = A === y.length - 1, E = m[0], f = s(m);
          if (E instanceof _) {
            for (const h of f)
              i.insertAdjacentElement("beforeend", h);
            return;
          }
          if (d = i.getElementsByTagName(w)[0], d) {
            g || d.insertAdjacentElement(
              "afterend",
              document.createElement(w)
            );
            for (const h of f)
              d.insertAdjacentElement("afterend", h);
            d.remove();
          } else
            for (const h of f)
              i.insertAdjacentElement("beforeend", h);
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
const $ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", H = "abcdefghijklmnopqrstuvwxyz0123456789", R = {
  getRandom(n, e = !0) {
    let t = "";
    const s = e ? H : $, r = s.length;
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
}, x = new class {
  #e = /* @__PURE__ */ new Map();
  constructor() {
  }
  /**
   * @param eventCallback 
   * @returns attribute that have to applied to element, to properly detect element to add the click event
   */
  addCallback(e) {
    const t = R.getRandom(16);
    return this.#e.set(t, e), ` ${k}${t}`;
  }
  hasCallback(e) {
    return this.#e.has(e);
  }
  getCallback(e) {
    return this.#e.get(e);
  }
}(), T = new class {
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
    const t = M.getAttributesStartingWith(
      e,
      k
    );
    if (t.length !== 0)
      for (const s of t) {
        const r = Array.from(document.body.querySelectorAll(`[${s}]`)), o = s.replace(k, "");
        for (const c of r) {
          if (c.removeAttribute(s), !x.hasCallback(o)) continue;
          const i = x.getCallback(o);
          (i.applyToWindow ? window : c).addEventListener(
            i.eventName,
            (d) => i.callback({ event: d, source: c })
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
function P(n) {
  const e = document.body.querySelector(L);
  if (!e)
    return document.body.appendChild(document.createElement(L)), P(n);
  e.innerHTML = "";
  for (const t of n.visualise())
    e.appendChild(t);
  window.addEventListener("DOMContentLoaded", (t) => {
    Array.from(document.body.querySelectorAll("*")).forEach((s) => {
      T.processElementEvents(s);
    }), T.observe();
  });
}
const u = (n, e) => x.addCallback({
  eventName: n,
  callback: e,
  applyToWindow: !1
}), q = (n) => u("change", n), F = (n) => u("click", n), I = (n) => u("dblclick", n), z = (n) => u("focus", n), G = (n) => u("focusout", n), Y = (n) => u("input", n), V = (n) => u("mouseenter", n), J = (n) => u("mouseleave", n), Q = (n) => u("mousemove", n), K = (n) => u("resize", n), X = (n) => u("scroll", n), Z = (n) => u("touchmove", n);
export {
  j as CjsComponent,
  _ as CjsLayout,
  P as init,
  q as onChange,
  F as onClick,
  I as onDoubleClick,
  z as onFocus,
  G as onFocusOut,
  Y as onInput,
  V as onMouseEnter,
  J as onMouseLeave,
  Q as onMouseMove,
  K as onResize,
  X as onScroll,
  Z as onTouchMove
};
//# sourceMappingURL=cjs.mjs.map
