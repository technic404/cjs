const m = {
  None: "\x1B[0m",
  Underscore: "\x1B[4m",
  Red: "\x1B[31m",
  Green: "\x1B[32m",
  Yellow: "\x1B[33m"
}, M = 16, gt = `${m.Yellow}${m.Underscore}[CJS]${m.None} `, f = `${gt}${m.Red}✘ ${m.None}`, At = `${gt}${m.Green}✔ ${m.None}`, E = "c_js-", yt = `${E}style-`, it = `${E}filters-`, rt = `${E}keyframes-`, Ot = `${E}plugins-`, et = `${E}root-`, Y = `${E}component-`, G = "cjsrender", Rt = `${E}layout-`, q = `${E}element-`, Z = `${E}elementdisabled-`, D = `${E}observer-`, K = `${E}lazy-`, X = "lazy:", st = {
  onLoadLayout: (i) => {
  }
}, N = {
  components: [],
  layouts: [],
  lazy: []
}, Qt = {
  Style: {
    Media: []
  }
};
function L(i, t) {
  if (!i.attributes) return [];
  const e = [];
  for (const s of Array.from(i.attributes)) {
    const n = s.name;
    n.startsWith(t) && e.push(n);
  }
  return e;
}
function A(i) {
  const t = document.createElement("template");
  t.innerHTML = i.trim();
  const e = t.content.firstElementChild;
  if (!e)
    throw new Error("htmlToElement: Provided HTML produced no element.");
  return e;
}
function ot(i) {
  const t = document.createElement("virtualContainer");
  return t.appendChild(i), t;
}
function bt(i, t, e = !0) {
  const s = (r) => L(r, t).length > 0;
  if (e && s(i))
    return i;
  let n = i.parentElement;
  for (; n; ) {
    if (s(n))
      return n;
    n = n.parentElement;
  }
  return null;
}
class Mt {
  constructor() {
    this.callback = (t) => {
      for (const e of t) {
        if (!e.isIntersecting) continue;
        const s = L(e.target, K)[0];
        if (!s) continue;
        const n = document.body.querySelector(`[${s}]`);
        n && this.performLazy(n);
      }
    }, this.observer = new IntersectionObserver(this.callback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    });
  }
  observe(t) {
    const e = L(t, K);
    if (!e.length) return;
    const s = e[0], n = document.body.querySelector(`[${s}]`);
    n && this.observer.observe(n);
  }
  /**
   * Observes all lazy elements in the document
   */
  observeAll() {
    Array.from(
      document.querySelectorAll(`[class*='${X}']`)
    ).forEach((e) => this.observe(e));
  }
  /**
   * Performs lazy activation
   */
  performLazy(t) {
    if (t.classList.length === 0) {
      this.observer.unobserve(t);
      return;
    }
    const e = Array.from(t.classList).find((s) => s.startsWith(X));
    if (e) {
      const s = e.slice(X.length);
      t.classList.remove(e), t.classList.add(s);
    }
    this.observer.unobserve(t);
  }
}
function S(i) {
  let t = "";
  const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".toLowerCase(), s = e.length;
  let n = 0;
  for (; n < i; )
    t += e.charAt(Math.floor(Math.random() * s)), n += 1;
  const r = (c) => !isNaN(Number(c.substring(0, 1)));
  for (; r(t); )
    t = S(i);
  return t;
}
function at(i) {
  let t = 5381;
  for (let e = 0; e < i.length; e++) {
    const s = i.charCodeAt(e);
    t = t * 33 ^ s;
  }
  return t >>> 0;
}
class _t {
  constructor() {
    this.mappings = /* @__PURE__ */ new Map(), this.disabled = /* @__PURE__ */ new Map(), this.appliedFunctions = /* @__PURE__ */ new Map();
  }
  /**
   * Adds new listener to website for provided event
   */
  add(t, e, s = { windowApplied: !1, additionalName: null }, n = {}) {
    let r = null;
    for (; r === null || this.mappings.has(r); )
      r = `${q}${S(M)}`;
    return this.mappings.set(r, {
      type: t,
      action: e,
      options: s,
      data: n,
      isApplied: !1,
      isLocked: !1
    }), ` ${r} `;
  }
  /**
   * Disables the provided event from being executed
   */
  disable(t) {
    let e = null;
    for (; e === null || this.disabled.has(e); )
      e = `${Z}${S(M)}`;
    return this.disabled.set(e, { events: t }), ` ${e} `;
  }
  cloneMapping(t) {
    if (!this.mappings.has(t))
      return console.log(`${f}Cannot clone mapping for ${m.Yellow}"${t}"${m.None}, because it does not exists`), null;
    const e = this.mappings.get(t);
    return this.add(e.type, e.action, e.options, e.data);
  }
  getElementActionAttributes(t, e = null, s = !1) {
    const n = [], r = [
      t,
      ...s ? Array.from(t.children) : []
    ];
    for (const c of r) {
      const o = L(c, q);
      e !== null ? o.forEach((a) => {
        if (!this.mappings.has(a)) return;
        const l = this.mappings.get(a), { additionalName: u } = l.options;
        l.type !== e && (u === null || e !== u) || n.push(a);
      }) : o.forEach((a) => n.push(a));
    }
    return n.flat();
  }
  setEventAttributeLocked(t, e) {
    if (!this.mappings.has(t)) {
      console.log(`${f}Cannot set data for ${m.Yellow}${t}${m.None}, because it doesn't exists`);
      return;
    }
    const s = this.mappings.get(t);
    s.isLocked = e;
  }
  isEventAttributeLocked(t) {
    if (!this.mappings.has(t)) {
      console.log(`${f}Cannot set data for ${m.Yellow}"${t}"${m.None}, because it doesn't exists`);
      return;
    }
    return this.mappings.get(t).isLocked;
  }
  setData(t, e) {
    if (!this.mappings.has(t)) {
      console.log(`${f}Cannot set data for ${m.Yellow}"${t}"${m.None}, because it doesn't exists`);
      return;
    }
    this.mappings.get(t).data = e;
  }
  applyElementAttributeMappingFunction(t, e, s = !1) {
    if (!this.mappings.has(e)) return;
    const n = this.mappings.get(e);
    if (n.isApplied && !s) return;
    n.isApplied = !0;
    const r = n.options.windowApplied ? window : t, c = (o) => {
      const a = bt(
        n.options.windowApplied ? o.target : t,
        Z,
        !0
      );
      if (a !== null) {
        const l = L(
          a,
          Z
        );
        for (const u of l) {
          if (!this.disabled.has(u)) continue;
          const d = this.disabled.get(u), h = d.events.includes(n.type), p = n.options.additionalName !== null && d.events.includes(n.options.additionalName);
          if (h || p)
            return;
        }
      }
      this.isEventAttributeLocked(e) || n.action(o, t, n.data);
    };
    if (this.appliedFunctions.has(e)) {
      const o = this.appliedFunctions.get(e);
      o.element.removeEventListener(o.type, o.mappingFunction);
    }
    this.appliedFunctions.set(e, {
      element: r,
      type: n.type,
      mappingFunction: c
    }), r.addEventListener(n.type, c);
  }
  removeElementAppliedFunctions(t) {
    if (!this.appliedFunctions.has(t))
      return !1;
    const e = this.appliedFunctions.get(t), { element: s, type: n, mappingFunction: r } = e;
    return s.removeEventListener(n, r), !0;
  }
  applyElementMappingFunction(t, e = !1) {
    const s = L(t, q);
    for (const n of s)
      this.applyElementAttributeMappingFunction(t, n, e);
  }
  applyBodyMappings() {
    for (const t of document.body.querySelectorAll("*"))
      this.applyElementMappingFunction(t, !1);
  }
}
const I = new _t();
class nt {
  constructor(t, e) {
    this.event = t, this.target = t.target, this.component = bt(e, Y), this.source = e;
  }
}
const P = {
  compiled: !1,
  relativePathPosition: 0,
  tempWebServerPort: 0,
  style: { map: /* @__PURE__ */ new Map() }
};
class jt {
  constructor() {
    this.data = null;
  }
  /**
   * If runnable variable is present
   */
  exists() {
    return typeof P < "u";
  }
  import() {
    this.exists() && (this.data = P);
  }
  isCompiled() {
    return this.data !== null && "compiled" in this.data ? !!this.data.compiled : !1;
  }
  getTempWebServerPort() {
    return this.data == null ? 0 : this.data.tempWebServerPort;
  }
  hasStyle() {
    return this.data == null ? !1 : "style" in this.data && this.data.style !== void 0;
  }
  isStyleValid() {
    return this.data == null ? !1 : this.hasStyle() && this.data.style !== void 0 && "map" in this.data.style;
  }
  validateStyle() {
    this.data != null && (!this.data.style || !("map" in this.data.style)) && console.log(
      `${f}Map is not present in runnable style configuration`
    );
  }
  validate() {
    this.data != null && this.hasStyle() && (this.validateStyle(), this.data.style && "map" in this.data.style && console.log(`${f}Please note that style compiler does not support import options: prefixStyleRules, encodeKeyframes, enableMultiSelector`));
  }
}
const R = new jt();
R.import();
R.validate();
class Q {
  constructor(t, e, s) {
    this.statusCode = t, this.response = e, this.networkError = s;
  }
  getStatusCode() {
    return this.statusCode;
  }
  isError() {
    return !String(this.statusCode).startsWith("2") || this.networkError;
  }
  isNetworkError() {
    return this.networkError;
  }
  text() {
    return this.response;
  }
  json() {
    return typeof this.response == "string" ? JSON.parse(this.response) : this.response;
  }
  blob() {
    return this.response;
  }
  toObjectURL() {
    return (window.URL || window.webkitURL).createObjectURL(this.response);
  }
  getTranslation() {
    return {
      200: "Pomyślnie wykonano operację",
      400: "Niepoprawne dane",
      401: "Brak autoryzacji",
      403: "Brak uprawnień",
      404: "Nie znaleziono",
      500: "Błąd serwera"
    }[this.statusCode] ?? (this.isError() ? "Błąd wykonania operacji" : "Pomyślnie wykonano operację");
  }
  onStatus(t, e) {
    this.statusCode === t && e();
  }
}
class Ct {
  constructor(t, e) {
    this.url = t, this.method = e, this.onStartCallback = () => {
    }, this.onEndCallback = () => {
    }, this.onErrorCallback = () => {
    }, this.onSuccessCallback = () => {
    }, this.onProgressCallback = () => {
    }, this.cachedKeyPrefix = "cjsrequest-", this.query = {}, this.body = {}, this.headers = {}, this.files = {}, this.bodyKey = null, this.cooldown = 0, this.cacheSeconds = 0, this.responseType = null;
  }
  getCacheKey() {
    return this.cachedKeyPrefix + JSON.stringify(this.body) + this.bodyKey + JSON.stringify(this.query) + JSON.stringify(this.headers);
  }
  getCached() {
    if (typeof localStorage > "u") return null;
    const t = localStorage.getItem(this.getCacheKey());
    if (!t) return null;
    const e = JSON.parse(t);
    return Date.now() > e.expiryTimestamp ? null : e;
  }
  setCached(t, e) {
    const s = Date.now() + e * 1e3;
    localStorage.setItem(
      this.getCacheKey(),
      JSON.stringify({ data: t, expiryTimestamp: s })
    );
  }
  buildUrl() {
    const t = Object.keys(this.query);
    if (t.length === 0) return this.url;
    const e = t.map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(this.query[s])}`).join("&");
    return `${this.url}?${e}`;
  }
  sendBodyOrFiles(t) {
    const e = Object.keys(this.body).length > 0, s = Object.keys(this.files).length > 0;
    if (e || s)
      if (e && !s)
        t.setRequestHeader("Content-Type", "application/json"), t.send(JSON.stringify(this.body));
      else {
        const n = new FormData();
        if (Object.entries(this.files).forEach(([r, c]) => {
          c instanceof FileList ? Array.from(c).forEach(
            (o) => n.append(r, o)
          ) : n.append(r, c);
        }), e && !this.bodyKey) {
          console.error("BodyKey required when sending files + body"), t.send(n);
          return;
        }
        e && this.bodyKey && n.append(this.bodyKey, JSON.stringify(this.body)), t.send(n);
      }
    else
      t.send();
  }
  setQuery(t) {
    return this.query = t, this;
  }
  setHeaders(t) {
    return this.headers = t, this;
  }
  setBody(t) {
    return this.body = t, this;
  }
  setFiles(t) {
    return this.files = t, this;
  }
  setBodyKey(t) {
    return this.bodyKey = t, this;
  }
  setCacheSeconds(t) {
    return this.cacheSeconds = t, this;
  }
  async doRequest() {
    if (this.cacheSeconds > 0) {
      const s = this.getCached();
      if (s)
        return new Q(
          s.statusCode,
          s.data,
          !1
        );
    }
    this.cooldown > 0 && await new Promise((s) => setTimeout(s, this.cooldown));
    const t = new XMLHttpRequest();
    return t.open(this.method.toUpperCase(), this.buildUrl(), !0), this.responseType && (t.responseType = this.responseType), Object.entries(this.headers).forEach(([s, n]) => {
      t.setRequestHeader(s, String(n));
    }), this.onStartCallback(), await new Promise((s) => {
      t.onreadystatechange = () => {
        if (t.readyState !== 4) return;
        const n = new Q(
          t.status,
          t.response,
          t.status === 0
        );
        this.onEndCallback(n), n.isError() ? this.onErrorCallback(n) : this.onSuccessCallback(n), this.cacheSeconds > 0 && this.setCached({
          data: t.response,
          statusCode: t.status
        }, this.cacheSeconds), s(n);
      }, t.onerror = () => {
        const n = new Q(0, null, !0);
        this.onErrorCallback(n), s(n);
      }, this.sendBodyOrFiles(t);
    });
  }
}
const te = {
  clearCache() {
    for (let i = 0; i < localStorage.length; i++) {
      const t = localStorage.key(i);
      t?.startsWith("cjsrequest-") && localStorage.removeItem(t);
    }
  }
};
class wt {
  /**
   * String to analyze input
   */
  constructor(t) {
    this.comment = {
      multipleLineEnabled: !0,
      opening: "<!--",
      closing: "-->",
      ignoreInString: !0,
      singleLineEnabled: !1,
      singleLine: "//"
    }, this.stringChars = ['"', "'"], this.loop = {
      comment: {
        multipleLineOpened: !1,
        singleLineOpened: !1
      },
      string: {
        openingChar: "",
        opened: !1
      },
      skipChars: 0,
      char: "",
      text: ""
    }, this.source = t;
  }
  _isOutOfBounds(t, e) {
    return t.length <= e + 1;
  }
  /**
   * Checks if string chars is one by one next chars in the array
   */
  _matchNextChars(t, e, s = !1) {
    if (t === void 0) return !1;
    const n = t.split("");
    s && console.log(
      `Comparsion: "${t}" with "${e.slice(0, t.length).join("")}"`
    );
    const r = [], c = () => {
      s && console.log(
        "Char by char comparsion:",
        r.map(
          (o) => `"${o.matchChar}" ${o.matchChar === o.arrayChar ? "==" : "!="} "${o.arrayChar}"`
        ).join(", ")
      );
    };
    for (let o = 0; o < n.length; o++) {
      const a = n[o], l = o;
      if (this._isOutOfBounds(e, l))
        return c(), !1;
      const u = e[l];
      if (r.push({ matchChar: a, arrayChar: u }), u !== a)
        return c(), !1;
    }
    return c(), !0;
  }
  /**
   * Reads string ignoring the comments sections with checks if the comment is in string
   */
  _read(t = () => {
  }) {
    const { comment: e, loop: s } = this, n = this.source.split("");
    let r = "";
    for (let a = 0; a < n.length; a++) {
      if (s.char = n[a], s.skipChars > 0) {
        s.skipChars--;
        continue;
      }
      if (e.multipleLineEnabled && this._matchNextChars(e.closing, n.slice(a)) && s.comment.multipleLineOpened) {
        s.comment.multipleLineOpened = !1, s.skipChars = e.closing.length - 1;
        continue;
      }
      if (e.singleLineEnabled && s.comment.singleLineOpened && this._matchNextChars(`
`, n.slice(a))) {
        s.comment.singleLineOpened = !1, s.skipChars = 1;
        continue;
      }
      if (!(s.comment.multipleLineOpened || s.comment.singleLineOpened)) {
        if (s.string.opened && s.char === s.string.openingChar) {
          s.string.opened = !1, s.string.openingChar = "", r += s.char;
          continue;
        }
        if (this.stringChars.includes(s.char) && !s.string.opened && (s.string.opened = !0, s.string.openingChar = s.char), e.singleLineEnabled && this._matchNextChars(e.singleLine, n.slice(a)) && !s.string.opened) {
          s.comment.singleLineOpened = !0;
          continue;
        }
        if (e.multipleLineEnabled && this._matchNextChars(e.opening, n.slice(a))) {
          if (s.string.multipleLineOpened && e.ignoreInString) {
            r += s.char;
            continue;
          }
          s.comment.multipleLineOpened = !0;
          continue;
        }
        r += s.char;
      }
    }
    const c = r.split(""), o = (a, l) => {
      t(a, l, (u, d = !1) => u === void 0 ? !1 : this._matchNextChars(u, c.slice(l), d));
    };
    for (let a = 0; a < c.length; a++) {
      const l = c[a];
      if (s.string.opened && l === s.string.openingChar) {
        s.string.opened = !1, s.string.openingChar = "", o(l, a);
        continue;
      }
      if (this.stringChars.includes(l) && !s.string.opened) {
        s.string.opened = !0, s.string.openingChar = l, o(l, a);
        continue;
      }
      o(l, a);
    }
    return r;
  }
}
class ct extends wt {
  /**
   * Css text
   */
  constructor(t) {
    super(t), this.comment = {
      multipleLineEnabled: !0,
      opening: "/*",
      closing: "*/",
      ignoreInString: !0,
      singleLineEnabled: !1,
      singleLine: "//"
    };
  }
  /**
   * Provides selector with its contents
   */
  read() {
    const t = {};
    let e = !1, s = 0, n = "", r = "";
    const c = (o) => o.replaceAll(`
`, "");
    return this._read((o) => {
      const a = this.loop;
      if (o === "{" && !e && !a.string.opened) {
        e = !0, r = c(n), n = "", r in t || (t[r] = "");
        return;
      }
      if (!e) {
        n += o;
        return;
      }
      if (o === "{" && e && !a.string.opened && s++, o === "}" && s > 0 && !a.string.opened) {
        s--, n += o;
        return;
      }
      if (o === "}" && s === 0 && !a.string.opened) {
        t[r] = c(n), r = "", n = "", e = !1;
        return;
      }
      n += o;
    }), t;
  }
}
class lt extends wt {
  /**
   * Css selector style
   */
  constructor(t) {
    super(t), this.comment = {
      multipleLineEnabled: !0,
      opening: "/*",
      closing: "*/",
      ignoreInString: !0,
      singleLineEnabled: !1,
      singleLine: "//"
    };
  }
  /**
   * Returns properties names and its values inside the css selector
   */
  read() {
    const t = (n) => n.replaceAll(`
`, "");
    this.source = t(this.source);
    const e = {}, s = {
      name: "",
      value: "",
      reading: "name",
      _parse: () => {
        s.name = s.name.replaceAll(" ", ""), s.value = s.value.trim();
      },
      _reset: () => {
        s.name = "", s.value = "", s.reading = "name";
      }
    };
    return this._read((n) => {
      const { loop: r } = this;
      if (n === ";" && !r.string.opened && s.reading === "value") {
        s._parse();
        const { name: u, value: d } = s;
        e[u] = d, s._reset();
        return;
      }
      if (n === ":" && !r.string.opened && s.reading === "name") {
        s.reading = "value";
        return;
      }
      if (s.reading === "value") {
        s.value += n;
        return;
      }
      s.reading === "name" && (s.name += n);
    }), e;
  }
}
const H = /* @__PURE__ */ new Map(), ut = {
  "backdrop-filter": ["-webkit-backdrop-filter"]
}, $t = {
  RootVariables: {
    _addProperties(i) {
      for (const [t, e] of Object.entries(i))
        $t.RootVariables[t.trim()] = e;
    }
  }
};
function St(i, t = "", e = {
  prefixStyleRules: !0,
  encodeKeyframes: !0,
  enableMultiSelector: !0
}) {
  const s = new ct(i).read();
  let n = [];
  const r = (o, a) => {
    o = o.trim();
    const l = `${o} { ${a} }`;
    if (o.startsWith(":")) {
      if (o.startsWith(":root")) {
        const d = new lt(a).read();
        $t.RootVariables._addProperties(d);
      }
      return [l];
    }
    return o.split(",").map((u) => {
      const d = u.trim().substring(0, 1), h = d === "." || d === "#", p = [
        `${t}${h ? "" : " "}${u.trim()}`
      ];
      if (!h) {
        const y = u.split(" "), b = y[0], x = y.slice(1).join(" "), C = b.includes(":") ? b.slice(b.indexOf(":")) : "", w = b.replace(C, ""), v = `${C} ${x}`, k = v.split(",").map((g) => g.trim()).slice(1), j = v.includes(",") ? k.map((g) => {
          const T = [
            `${w}${t}`,
            `${g.replace(w, "")}`
          ], J = !T[1].startsWith(":");
          return T.join(J ? " " : "");
        }) : "";
        v.includes(",") ? p.push(
          `${w}${t}${v.replace(
            k,
            j
          )}`
        ) : p.push(`${w}${t}${v}`);
      }
      return p;
    }).map((u) => `${u.join(", ")} { ${a} }`).flat();
  }, c = (o, a) => {
    const l = new ct(a).read(), u = [];
    for (const [d, h] of Object.entries(l)) {
      const p = new lt(h).read();
      for (const [b, x] of Object.entries(p))
        if (b in ut)
          for (const C of ut[b])
            C in p || (p[C] = x);
      const y = r(d, h);
      u.push(...y);
    }
    return u;
  };
  for (const [o, a] of Object.entries(s)) {
    if (a.trim() === "") continue;
    const l = o.startsWith("@media"), u = o.startsWith("@keyframes");
    if (o.startsWith("@range")) {
      const h = o.split(" "), p = h[1], y = h[2], b = {}, x = (() => {
        let k = "", j = "";
        for (const g of y.split(""))
          isNaN(Number(g)) ? j += g : k += g;
        return { number: parseInt(k), unit: j };
      })(), { number: C, unit: w } = x;
      b["<"] = `max-width: ${C - 1}${w}`, b["<="] = `max-width: ${C}${w}`, b[">"] = `min-width: ${C + 1}${w}`, b[">="] = `min-width: ${C}${w}`;
      const v = `@media only screen and (${b[p]}) { ${c(o, a).join(`
`)} }`;
      n.push(v);
      continue;
    }
    if (l) {
      const h = `${o} { ${c(
        o,
        a
      ).join(`
`)} }`;
      n.push(h);
      continue;
    }
    if (u) {
      n.push(`${o} { ${a} }`);
      continue;
    }
    if (e.prefixStyleRules) {
      const h = r(o, a);
      n.push(...h);
      continue;
    }
    n.push(a);
  }
  return n.join(" ").replaceAll(`
`, "");
}
async function Tt(i, t, e = {
  prefixStyleRules: !0,
  encodeKeyframes: !0,
  enableMultiSelector: !0
}) {
  if ("prefixStyleRules" in e || (e.prefixStyleRules = !0), "encodeKeyframes" in e || (e.encodeKeyframes = !0), "enableMultiSelector" in e || (e.enableMultiSelector = !0), R.isStyleValid()) {
    H.set(i, { options: e, path: t });
    return;
  }
  t = t.startsWith("./") ? t.slice(2) : t;
  const s = await new Ct(t, "get").doRequest();
  if (s.isError()) {
    console.log(
      `${f}Error occurred while importing style (${m.Yellow}${t}${m.None})`
    );
    return;
  }
  const n = s.text(), r = document.head.querySelector(
    `[id="${yt}"]`
  );
  if (!r) return;
  const c = St(n, `[${i}]`, e);
  r.innerHTML += c;
}
class Nt {
  constructor(t, e) {
    this.target = t, this.date = e;
  }
}
class Pt {
  constructor() {
    this.onAddCallback = () => {
    }, this.map = /* @__PURE__ */ new Map(), this.executedFunctions = /* @__PURE__ */ new Map(), this.callback = (t) => {
      this.processForms();
      const e = t.filter((n) => n.type === "childList"), s = e.map((n) => Array.from(n.addedNodes)).flat().filter((n) => n.nodeType === 1).map((n) => {
        const r = document.createElement("div");
        return r.appendChild(n.cloneNode(!0)), r;
      }).map((n) => Array.from(n.querySelectorAll("*"))).flat();
      for (const n of s) {
        this.onAddCallback(n);
        const r = {
          element: L(n, q).map((c) => ({
            elements: this.findRealElements(c),
            attribute: c
          })).flat(),
          observer: L(n, D).map((c) => ({
            elements: this.findRealElements(c),
            attribute: c
          })).flat()
        };
        if (R.isStyleValid()) {
          const c = Array.from(n.attributes).filter(
            (o) => H.has(o.name)
          );
          for (const o of c) {
            const a = H.get(o.name);
            if (!a) continue;
            const l = P.style.map.get(a.path);
            if (!P.style.map.has(a.path)) {
              console.log(`${f}Could not find ${a.path}`);
              return;
            }
            this.findRealElements(o.name).forEach((u) => {
              u.setAttribute(l.prefix, "");
            });
          }
        }
        r.element.forEach(({ elements: c, attribute: o }) => {
          c.forEach((a) => {
            I.applyElementAttributeMappingFunction(
              a,
              o,
              !0
            );
          });
        }), r.observer.forEach(({ elements: c, attribute: o }) => {
          c.forEach((a) => {
            this.execute("add", o, a);
          });
        });
      }
      for (const n of e.map((r) => Array.from(r.removedNodes)).flat())
        L(n, D).forEach((c) => {
          this.execute("remove", c, n);
        });
    }, this.observer = new MutationObserver(this.callback);
  }
  processForms() {
    document.body.querySelectorAll("form").forEach((t) => {
      t.onsubmit = (e) => e.preventDefault();
    });
  }
  findRealElements(t) {
    return Array.from(document.querySelectorAll(`[${t}='']`)).flat();
  }
  observe() {
    this.observer.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  onAdd(t) {
    this.onAddCallback = t;
  }
  listen(t, e) {
    if (t !== "add" && t !== "remove")
      return console.log(`${f}Type must be 'add' or 'remove'`), null;
    let s = null;
    for (; !s || this.map.has(s); )
      s = `${D}${S(M)}`;
    return this.map.set(s, {
      type: t,
      action: e,
      data: {}
    }), ` ${s} `;
  }
  cloneAttribute(t) {
    if (!this.map.has(t))
      return console.log(`${f}Attribute does not exist`), null;
    let e = null;
    for (; !e || this.map.has(e); )
      e = `${D}${S(M)}`;
    const s = Object.assign({}, this.map.get(t));
    return this.map.set(e, s), e;
  }
  replaceAttribute(t, e, s) {
    t.removeAttribute(e), t.setAttribute(s, "");
  }
  setData(t, e) {
    if (!this.map.has(t))
      return console.log(`${f}Attribute does not exist`), null;
    const s = this.cloneAttribute(t);
    if (!s) return null;
    const n = this.map.get(s);
    return n && (n.data = e), s;
  }
  executeAll(t) {
    for (const [e, s] of H.entries()) {
      const n = document.body.querySelectorAll(`[${e}='']`);
      n.length && n.forEach((r) => {
        const c = s.path, o = P.style.map.get(c);
        o && r.setAttribute(o.prefix, "");
      });
    }
    for (const [e, s] of this.map.entries()) {
      if (s.type !== t) continue;
      const n = document.body.querySelectorAll(`[${e}='']`);
      n.length && n.forEach((r) => {
        this.execute(t, e, r);
      });
    }
  }
  execute(t, e, s) {
    if (!this.map.has(e) || this.executedFunctions.get(e)?.elements.includes(s)) return;
    const r = this.map.get(e);
    if (!r || r.type !== t) return;
    const c = new nt(
      new Nt(s, /* @__PURE__ */ new Date()),
      s
    );
    r.action(c), this.executedFunctions.has(e) || this.executedFunctions.set(e, { elements: [] }), this.executedFunctions.get(e).elements.push(s);
  }
}
const F = new Pt(), Et = new Mt();
F.onAdd((i) => {
  Et.observe(i);
});
window.addEventListener("DOMContentLoaded", () => {
  Et.observeAll(), F.observe(), F.executeAll("add");
});
function _(i) {
  return F.listen("add", i);
}
function ee(i) {
  return _((t) => {
    document.addEventListener("keydown", (e) => {
      (e.key === "Escape" || e.key == "Esc") && i(t);
    });
  });
}
function se(i, t = 500) {
  return _((e) => {
    let s = 0;
    const n = () => {
      clearTimeout(s);
    }, r = () => {
      s = setTimeout(() => {
        i(e);
      }, t);
    };
    e.source.addEventListener("mousedown", r), e.source.addEventListener("touchstart", r), e.source.addEventListener("mouseup", n), e.source.addEventListener("mousemove", n), e.source.addEventListener("touchend", n), e.source.addEventListener("touchcancel", n), e.source.addEventListener("touchmove", n);
  });
}
function ne(i) {
  return I.add("click", (t, e) => {
    document.body.contains(e) && e !== t.target && !e.contains(t.target) && i(new nt(t, e));
  }, { windowApplied: !0, additionalName: "outerclick" });
}
function ie(i) {
  return _((t) => {
    t.source.addEventListener("scroll", () => {
      t.source.scrollTop + t.source.clientHeight >= t.source.scrollHeight && i(t);
    });
  });
}
function re(i, t = 10) {
  return _((e) => {
    let s = 0, n = 0;
    const r = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientY : l.clientY;
      n = u, s = u;
    }, c = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientY : l.clientY, d = u + 1 >= n, h = u - s;
      if (!d) {
        s = 0;
        return;
      }
      h > t && (i(e), s = 0), n = u;
    }, o = e.target;
    o.addEventListener("mousedown", r), o.addEventListener("touchstart", r), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function oe(i, t = 50, e = 50) {
  return _((s) => {
    let n = { startX: 0, startY: 0, lastX: 0, lastY: 0 };
    const r = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientX : l.clientX, d = "touches" in l ? l.touches[0].clientY : l.clientY;
      n.lastX = u, n.startX = u, n.lastY = d, n.startY = d;
    }, c = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientX : l.clientX, d = "touches" in l ? l.touches[0].clientY : l.clientY, h = u - 1 <= n.lastX, p = u - n.startX, y = d - n.startY;
      if (e !== -1 && e < Math.abs(y)) {
        n.startX = 0;
        return;
      }
      if (!h) {
        n.startX = 0;
        return;
      }
      p < -1 * t && (i(s), n.startX = 0), n.lastX = u;
    }, o = s.target;
    o.addEventListener("mousedown", r), o.addEventListener("touchstart", r), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function ae(i, t = 50, e = 50) {
  return _((s) => {
    let n = { startX: 0, startY: 0, lastX: 0, lastY: 0 };
    const r = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientX : l.clientX, d = "touches" in l ? l.touches[0].clientY : l.clientY;
      n.lastX = u, n.startX = u, n.lastY = d, n.startY = d;
    }, c = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientX : l.clientX, d = "touches" in l ? l.touches[0].clientY : l.clientY, h = u + 1 >= n.lastX, p = u - n.startX, y = d - n.startY;
      if (e !== -1 && e < Math.abs(y)) {
        n.startX = 0;
        return;
      }
      if (!h) {
        n.startX = 0;
        return;
      }
      p > t && (i(s), n.startX = 0), n.lastX = u;
    }, o = s.target;
    o.addEventListener("mousedown", r), o.addEventListener("touchstart", r), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function ce(i, t = 10) {
  return _((e) => {
    let s = 0, n = 0;
    const r = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientY : l.clientY;
      n = u, s = u;
    }, c = (a) => {
      const l = a, u = "touches" in l ? l.touches[0].clientY : l.clientY, d = u - 1 <= n, h = u - s;
      if (!d) {
        s = 0;
        return;
      }
      h < -1 * t && (i(e), s = 0), n = u;
    }, o = e.target;
    o.addEventListener("mousedown", r), o.addEventListener("touchstart", r), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function le(...i) {
  return I.disable(i);
}
const $ = (i, t) => I.add(i, (e, s) => t(new nt(e, s))), ue = (i) => $("change", i), de = (i) => $("click", i), he = (i) => $("dblclick", i), fe = (i) => $("focus", i), pe = (i) => $("focusout", i), me = (i) => $("input", i), ge = (i) => $("mouseenter", i), ye = (i) => $("mouseleave", i), be = (i) => $("mousemove", i), Ce = (i) => $("resize", i), we = (i) => $("scroll", i), $e = (i) => $("touchmove", i), V = {
  /**
   * Generates attribute
   * @param prefix 
   * @param exclude 
   * @returns 
   */
  generateAttribute(i, t) {
    let e = null;
    const s = () => {
      const n = e === null, r = t.includes(e);
      return n || r;
    };
    for (; s(); )
      e = `${i}${S(M)}`;
    return e;
  }
}, dt = {
  /**
   * Returns values from keys if the value is not an object
   */
  getNonObjectValues(i) {
    const t = (e) => {
      if (!e || typeof e != "object") return [e];
      const s = [];
      for (const n of Object.keys(e)) {
        const r = e[n], c = typeof r == "object" && r !== null && !Array.isArray(r);
        s.push(...c ? t(r) : [r]);
      }
      return s;
    };
    return t(i);
  },
  /**
   * Deep merges two objects
   * object2 overwrites object1 by default
   */
  join(i, t, e = !0) {
    const s = (n, r) => {
      if (typeof n != "object" || n === null)
        return r ?? n;
      const c = Array.isArray(n) ? [...n] : {}, o = /* @__PURE__ */ new Set([
        ...Object.keys(n ?? {}),
        ...Object.keys(r ?? {})
      ]);
      for (const a of o) {
        if (!(a in r)) {
          c[a] = n?.[a];
          continue;
        }
        !e && a in n ? c[a] = n[a] : c[a] = s(n?.[a], r?.[a]);
      }
      return c;
    };
    return s(i, t);
  },
  /**
   * Deep copy of an object
   */
  copy(i) {
    const t = (e) => {
      if (e === null) return null;
      const s = typeof e != "object", n = typeof HTMLElement < "u" && (e instanceof HTMLElement || e instanceof Node);
      if (s || n) return e;
      if (Array.isArray(e))
        return e.map((c) => t(c));
      const r = {};
      for (const [c, o] of Object.entries(e))
        r[c] = t(o);
      return r;
    };
    return t(i);
  },
  /**
   * Removes keys that have nullable / empty values (mutates object)
   */
  filterOutNullableValues(i) {
    for (const [t, e] of Object.entries(i)) {
      const s = typeof e == "object" && e !== null && !Array.isArray(e) && Object.keys(e).length === 0;
      (e == null || Array.isArray(e) && e.length === 0 || typeof e == "string" && e.trim() === "" || s) && delete i[t];
    }
    return i;
  },
  isEmpty(i) {
    return Object.keys(i).length > 0;
  }
};
class ht {
  constructor() {
    this.data = {}, this._renderData = {}, this._cssStyle = null, this._setStyle = {}, this.renderedCssStyle = !1, this.onLoadCallback = () => {
    }, this.preSetData = {}, this.attribute = V.generateAttribute(
      Y,
      N.components
    );
  }
  /**
   * Function that renders html.
   */
  _(t, e) {
    return "";
  }
  mergeObjects(t, e) {
    for (const s in e) {
      if (!Object.prototype.hasOwnProperty.call(e, s)) continue;
      typeof e[s] == "object" && e[s] !== null && t[s] ? this.mergeObjects(t[s], e[s]) : (t[s] === null || t[s] === void 0) && (t[s] = e[s]);
    }
  }
  getData(t) {
    const e = {};
    return this.mergeObjects(e, t), this.mergeObjects(e, this.data), dt.copy(e);
  }
  camelToKebab(t) {
    return t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  injectStyle(t, e) {
    const s = t.length;
    let n = 0;
    for (; n < s && t.charCodeAt(n) <= 32; ) n++;
    if (t[n] !== "<") return t;
    const r = n, c = t.indexOf(">", r);
    if (c === -1) return t;
    const o = t.slice(r, c), a = o.indexOf("style=");
    let l;
    if (a !== -1) {
      const u = o[a + 6], d = a + 7, h = o.indexOf(u, d), p = o.slice(d, h).trim(), y = !p.endsWith(";") && p.length > 0 ? p + ";" + e : p + e;
      l = o.slice(0, d) + y + o.slice(h);
    } else
      l = o + ` style="${e}"`;
    return t.slice(0, r) + l + t.slice(c);
  }
  addAttributes(t, e) {
    console.log("a", t);
    const s = ot(A(t));
    if (!s.firstElementChild) return "";
    const n = s.firstElementChild;
    return e.forEach((r) => n.setAttribute(r, "")), n.outerHTML;
  }
  addLazyIdentifiers(t) {
    const e = ot(A(t)), s = Array.from(e.querySelectorAll(`[class*='${X}']`)).filter((n) => L(n, K).length === 0);
    for (const n of s) {
      let r = null;
      for (; !r || N.lazy.includes(r); )
        r = S(M);
      N.lazy.push(r), n.setAttribute(`${K}${r}`, "");
    }
    return e.innerHTML;
  }
  getHtml(t, e = {}) {
    !this.renderedCssStyle && this._cssStyle && (Tt(this.attribute, this._cssStyle, {
      prefixStyleRules: !0,
      encodeKeyframes: !0,
      enableMultiSelector: !0
    }), this.renderedCssStyle = !0);
    const s = this._, n = s[Symbol.toStringTag] === "AsyncFunction", r = Object.entries(e).map(
      ([l, u]) => `${this.camelToKebab(l)}: ${u};`
    ).join(" "), c = F.listen("add", async (l) => {
      if (n) {
        this._renderData = t;
        const u = await s.call(this, () => l.source, {});
        l.source.outerHTML = this.addAttributes(
          this.addLazyIdentifiers(e ? this.injectStyle(u, r) : u),
          [this.attribute]
        );
      }
      this.executeOnLoad();
    });
    if (n) return `<div ${this.attribute} ${c.trim()}></div>`;
    this._renderData = t;
    const o = s.call(this, () => document.querySelector(`[${this.attribute}]`), {}), a = dt.isEmpty(e) ? o : this.injectStyle(o, r);
    return this.addAttributes(
      this.addLazyIdentifiers(a),
      [this.attribute, c.trim()]
    );
  }
  setData(t) {
    if (!(t instanceof Object))
      return console.log(`${f}Data passed into setData() must be object`), this;
    this.preSetData = t;
    const e = document.body.querySelector(`[${this.attribute}=""]`);
    return e && e.replaceWith(
      A(this.getHtml(this.getData(t), this._setStyle))
    ), this;
  }
  render(t = {}) {
    return this.getHtml(this.getData(t), this._setStyle);
  }
  visualise(t = {}) {
    return A(this.render(t));
  }
  /**
   * Clones an component and sets data with argument (used for Layouts)
   */
  withData(t = {}) {
    const e = Object.create(Object.getPrototypeOf(this));
    return Object.assign(e, this), e.attribute = V.generateAttribute(Y, N.components), e.setData(t);
  }
  /**
   * Adds style to element using attribute `style="..."`
   */
  withStyle(t) {
    const e = Object.create(Object.getPrototypeOf(this));
    return Object.assign(e, this), e.attribute = V.generateAttribute(Y, N.components), e._setStyle = t, e;
  }
  toVirtualElement() {
    return A(
      this.getHtml(
        this.getData(this.preSetData),
        this._setStyle
      )
    );
  }
  toElement(t = !1) {
    const e = document.body.querySelector(`[${this.attribute}=""]`);
    return e || document.readyState === "complete" && !t ? e : this.toVirtualElement();
  }
  loadLayout(...t) {
    const e = this.toElement();
    if (e) {
      e.innerHTML = "";
      for (const s of t)
        e.appendChild(s.toElement()), setTimeout(() => {
          s._executeOnLoad({}), st.onLoadLayout(s);
        }, 2);
    }
  }
  onLoad(t) {
    this.onLoadCallback = t;
  }
  executeOnLoad() {
    if (this.onLoadCallback(), this.fillHeightData) {
      const { offset: t, maxHeight: e } = this.fillHeightData, s = this.toElement();
      if (!s) return;
      const n = () => {
        const r = e && window.innerHeight > e ? e : window.innerHeight + t;
        s.style.height = `${r}px`;
      };
      n(), window.addEventListener("resize", n);
    }
  }
  hide() {
    const t = this.toElement();
    t && (t.style.display = "none");
  }
  show() {
    const t = this.toElement();
    t && (t.style.display = "");
  }
  exists() {
    return document.body.querySelector(`[${this.attribute}=""]`) !== null;
  }
  setDefaultData(t) {
    return t instanceof Object ? (this.data = t, this) : (console.log(`${f}Data passed into setDefaultData() must be object`), this);
  }
  querySelector(...t) {
    const e = this.toElement();
    if (!e) return null;
    const s = t.map((n) => e.querySelector(n));
    return s.length > 1 ? s : s[0];
  }
  querySelectorAll(t) {
    const e = this.toElement();
    return e ? Array.from(e.querySelectorAll(t)) : [];
  }
}
class B {
  /**
   * @param elements Function returning layout structure
   */
  constructor(t) {
    this.onLoadCallback = () => {
    }, this.dataState = {
      default: void 0,
      active: null
    }, this.elements = t, this.attribute = V.generateAttribute(
      Rt,
      N.layouts
    );
  }
  /**
   * Set function that will be executed when layout is loaded on website
   */
  onLoad(t) {
    this.onLoadCallback = (e) => {
      st.onLoadLayout(this), t(e);
    };
  }
  /**
   * Executes the onLoad function and sub components/layouts onLoad
   */
  _executeOnLoad(t) {
    this.elements(this.dataState.active).flat().forEach((e) => {
      e instanceof B && e._executeOnLoad(this.dataState.active);
    }), this.onLoadCallback(t);
  }
  /**
   * Finds component in layout
   */
  select(t) {
    const e = this.elements(this.dataState.active).flat().filter((s) => s.attribute === t.attribute);
    return e.length === 0 ? (console.log(`${f}Component not found when trying to use select(), make sure that provided component exists in layout`), null) : e[0];
  }
  /** Provides active layout data */
  get data() {
    return this.dataState.active;
  }
  /**
   * Reset layout data to default
   */
  resetToDefaultData() {
    return this.dataState.default === void 0 ? (console.log(`${f}Cannot reset layout data to default, because default data is not set`), this) : (this.dataState.active = Object.assign({}, this.dataState.default), this);
  }
  /**
   * Sets global layout data
   */
  setData(t) {
    if (t === null)
      return this.dataState.active = null, this;
    if (this.dataState.default !== void 0) {
      const e = (s, n) => {
        const r = (a) => {
          if (a === null || typeof a != "object") return a;
          if (a.constructor && a.constructor !== Object)
            return new a.constructor();
          if (Array.isArray(a))
            return a.map((u) => r(u));
          const l = {};
          for (const u in a)
            Object.prototype.hasOwnProperty.call(a, u) && (l[u] = r(a[u]));
          return l;
        }, c = r(s), o = (a, l) => {
          for (const u in l)
            Object.prototype.hasOwnProperty.call(l, u) && (typeof l[u] == "object" && l[u] !== null && a[u] ? o(a[u], l[u]) : a[u] = l[u]);
        };
        return o(c, n), c;
      };
      this.dataState.active = e(
        this.dataState.default,
        t
      );
    } else
      this.dataState.default = {}, this.dataState.active = {};
    return this.dataState.default = Object.assign({}, t), this.dataState.active = Object.assign({}, this.dataState.default), this;
  }
  /**
   * Converts layout into component with data
   */
  asComponentWithData(t) {
    this.setData(t);
    const e = new ht();
    return e._ = () => "<div></div>", e.onLoad(() => e.loadLayout(this.setData(t))), e;
  }
  /** Replace page content with layout */
  replacePage() {
    const t = document.getElementById(et);
    t && (t.innerHTML = "", t.appendChild(this.toElement()), this._executeOnLoad(this.dataState.active));
  }
  /** Get layout element from DOM */
  getElement() {
    return document.body.querySelector(`[${this.attribute}]`);
  }
  /** Check if layout exists in DOM */
  exists() {
    return this.getElement() !== null;
  }
  /** Build DOM structure */
  toElement() {
    const t = document.createElement("div");
    t.setAttribute(this.attribute, "");
    const e = (s) => {
      if (!Array.isArray(s))
        return console.log(`${f}Layout have wrong pattern, component should be in array`), document.createElement("cjslayouterror");
      if (s.length === 0)
        return console.log(`${f}Layout have an empty component space`), document.createElement("cjslayouterror");
      const n = s[0];
      if (n instanceof B)
        return n.toElement();
      if (!(n instanceof ht))
        return console.log(`${f}The passed element inside layout is not CjsComponent or CjsLayout`), document.createElement("cjslayouterror");
      const r = n.toVirtualElement();
      if (s.length === 2) {
        let o = r.querySelector(G);
        const a = s[1];
        if (!Array.isArray(a))
          return console.log(`${f}Layout sub components at second argument have to be Array`), r;
        a.forEach((l, u) => {
          if (l === null) return;
          const d = u === a.length - 1, h = l[0], p = e(l);
          if (h instanceof B) {
            r.insertAdjacentElement("beforeend", p);
            return;
          }
          o = r.querySelector(G), o ? (d || o.insertAdjacentElement(
            "afterend",
            document.createElement(
              G
            )
          ), o.replaceWith(p)) : r.insertAdjacentElement("beforeend", p);
        });
      }
      return r;
    };
    return this.elements(this.dataState.active).forEach((s) => {
      s && t.insertAdjacentElement(
        "beforeend",
        e(s.filter((n) => n !== null))
      );
    }), t;
  }
  /** Hide layout */
  hide() {
    const t = this.getElement();
    t && (t.style.display = "none");
  }
  /** Show layout */
  show() {
    const t = this.getElement();
    t && (t.style.display = "");
  }
  /** Rerender all layouts */
  rerenderLayouts() {
    const t = Array.from(document.body.querySelectorAll(`[${this.attribute}]`)), e = this.toElement();
    for (const s of t)
      s.replaceWith(e), setTimeout(() => {
        this._executeOnLoad(this.dataState.active), st.onLoadLayout(this);
      }, 2);
    return this;
  }
}
const ft = [], pt = [];
class z {
  constructor() {
    this.entries = [], this.duration = 1e3, this.timingFunction = "ease", this.keepEndingEntryStyle = !0, this.selector = "", this.isImportant = !1, this.fillMode = "";
  }
  // --------------------------------------------------
  // Configuration
  // --------------------------------------------------
  setSelector(t) {
    return this.selector = t, this;
  }
  setFillMode(t) {
    return this.fillMode = t, this;
  }
  setEndingEntryStyle(t) {
    return this.keepEndingEntryStyle = t, this;
  }
  addEntry(t) {
    return this.entries.push(t), this;
  }
  setDuration(t) {
    return isNaN(t) ? (console.log(`${f} Provided argument is not a number`), this) : (this.duration = t, this);
  }
  setTimingFunction(t) {
    return this.timingFunction = t, this;
  }
  setImportant(t) {
    return this.isImportant = t, this;
  }
  // --------------------------------------------------
  // Core Logic
  // --------------------------------------------------
  getClass(t = {}) {
    const e = t.reversed ?? !1;
    this.entries.length > 100 && console.log(`${f} CjsKeyFrame cannot have more than 100 entries`);
    const s = document.head.querySelector(
      `[id="${rt}"]`
    );
    if (!s)
      throw new Error("Keyframes style element not found");
    const n = e ? [...this.entries].reverse() : this.entries, r = n.length === 1, c = 100 / Math.max(n.length - 1, 1), a = `{
${n.map((g, T) => {
      const J = r ? 100 : T * c, Lt = Object.entries(g).map(([kt, xt]) => `${kt}: ${xt};`).join(" ");
      return `    ${J}% { ${Lt} }`;
    }).join(`
`)}
}`, l = at(a), u = ft.find((g) => g.hash === l);
    let d;
    if (u)
      d = u.animation;
    else {
      d = `${rt}${S(M)}`;
      const g = `@keyframes ${d} ${a}`;
      s.innerHTML += `
${g}`, ft.push({
        hash: l,
        animation: d
      });
    }
    const h = n[n.length - 1], p = this.isImportant ? " !important" : "", y = Object.entries(h).map(([g, T]) => `${g}: ${T};`).join(" "), x = [`animation: ${d} ${this.duration / 1e3}s ${this.timingFunction}${p}`];
    this.keepEndingEntryStyle && x.push(y);
    const C = `{ ${x.join("; ")} }`, w = at(`${this.selector}-${C}`), v = pt.find((g) => g.hash === w);
    if (v)
      return v.class;
    const k = `${d}-${w}`, j = `.${k} ${this.selector} ${C}`;
    return s.innerHTML += `
${j}`, pt.push({
      hash: w,
      class: k
    }), k;
  }
}
class Ft {
  /**
   * Simple translateX animation
   */
  x(t, e = 500) {
    return new z().setDuration(e).addEntry({ transform: `translateX(${t}px)` }).addEntry({ transform: "translateX(0)" }).getClass();
  }
  /**
   * Simple translateY animation
   */
  y(t, e = 500) {
    return new z().setDuration(e).addEntry({ transform: `translateY(${t}px)` }).addEntry({ transform: "translateY(0)" }).getClass();
  }
  /**
   * Simple scale animation
   */
  scale(t, e = 500) {
    return new z().setDuration(e).addEntry({ transform: `scale(${t})` }).addEntry({ transform: "scale(1)" }).getClass();
  }
  /**
   * Adds temporary class to element and removes it after timeout
   */
  tempClass(t, e, s = 500) {
    t && (t.classList.add(e), setTimeout(() => {
      t.classList.remove(e);
    }, s));
  }
}
const Se = new Ft();
function It(i) {
  return i.startsWith("./") ? i.slice(2) : i.startsWith("/") ? i.slice(1) : i;
}
function U(i) {
  const e = `src/assets/${It(i)}`;
  if (!R || !R.exists?.()) return e;
  const s = R.data?.relativePathPosition ?? 0;
  return "../".repeat(s) + e;
}
function Ee(i) {
  return U(`svg/${i}.svg`);
}
function ve(i) {
  return U(`images/${i}.png`);
}
function Le(i) {
  return U(`images/${i}.jpg`);
}
function ke(i) {
  return U(`gif/${i}.gif`);
}
const xe = {
  async download(i, t = null) {
    try {
      const e = await fetch(i);
      if (!e.ok)
        return console.log(`${f} Couldn't download file: ${e.statusText}`);
      const s = await e.blob();
      mt(s, t ?? i.split("/").pop());
    } catch (e) {
      console.log(
        `${f} Error downloading file`,
        e
      );
    }
  },
  async downloadFile(i, t, e = null) {
    try {
      const s = new Blob([i], { type: t }), n = t.split("/").pop() ?? "file", r = e ?? `${n}.${n}`;
      mt(s, r);
    } catch (s) {
      console.log(
        `${f} Error creating download file`,
        s
      );
    }
  }
};
function mt(i, t) {
  if (typeof document > "u") return;
  const e = document.createElement("a");
  e.href = URL.createObjectURL(i), e.download = t ?? "download", document.body.appendChild(e), e.click(), document.body.removeChild(e), URL.revokeObjectURL(e.href);
}
const vt = {
  /**
   * Creates a delay (sleep)
   */
  sleep(i) {
    return new Promise((t) => {
      setTimeout(t, i);
    });
  }
};
class Dt {
  constructor(t, e, s, n, r) {
    this.name = t, this.amount = e, this.direction = s, this.time = n, this.className = r;
  }
  getClassName() {
    return this.className;
  }
}
function Yt(i, t, e, s) {
  const n = document.head.querySelector(
    `[id="${it}"]`
  );
  if (!n)
    throw new Error("Filter style element not found");
  let r = "", c = "";
  switch (i) {
    case "grayscale":
      r = "grayscale(0)", c = `grayscale(${t})`;
      break;
    case "blur":
      r = "blur(0px)", c = `blur(${t}px)`;
      break;
    case "brightness":
      r = "brightness(0%)", c = `brightness(${t}%)`;
      break;
    case "contrast":
      r = "contrast(0%)", c = `contrast(${t}%)`;
      break;
    case "hue-rotate":
      r = "hue-rotate(0deg)", c = `hue-rotate(${t}deg)`;
      break;
    case "invert":
      r = "invert(0%)", c = `invert(${t}%)`;
      break;
    case "opacity":
      r = "opacity(0)", c = `opacity(${t})`;
      break;
    case "saturate":
      r = "saturate(0%)", c = `saturate(${t}%)`;
      break;
    case "sepia":
      r = "sepia(0%)", c = `sepia(${t}%)`;
      break;
  }
  e === "reverse" && ([r, c] = [c, r]);
  const o = `${it}${i}-${S(8)}`, a = S(32), l = `
.${o} {
    filter: ${c};
    animation: ${a} ${s / 1e3}s;
}

@keyframes ${a} {
    0% { filter: ${r}; }
    100% { filter: ${c}; }
}
`;
  return n.innerHTML += l, new Dt(
    i,
    t,
    e,
    s,
    o
  );
}
const tt = {
  blur: [],
  opacity: [],
  grayscale: [],
  brightness: [],
  contrast: [],
  "hue-rotate": [],
  invert: [],
  saturate: [],
  sepia: []
};
async function qt(i, t, e = 10, s = "standard", n = 500) {
  const r = tt[t].find(
    (o) => o.amount === e && o.direction === s && o.time === n
  ), c = r ?? Yt(t, e, s, n);
  r || tt[t].push(c), tt[t].forEach((o) => {
    i.classList.remove(o.getClassName());
  }), i.classList.add(c.getClassName()), await vt.sleep(n), i.classList.remove(c.getClassName());
}
async function Ae(i, t) {
  const e = {
    filter: t.filter,
    amount: t.amount ?? 10,
    direction: t.direction ?? "standard",
    time: t.time ?? 500
  };
  await qt(
    i,
    e.filter,
    e.amount,
    e.direction,
    e.time
  );
}
const O = {
  mouse: {
    up: !0,
    down: !1,
    state: "up"
  },
  window: {
    DOMContentLoaded: !1
  }
};
window.addEventListener("mousedown", () => {
  O.mouse.up = !1, O.mouse.down = !0, O.mouse.state = "down";
});
window.addEventListener("mouseup", () => {
  O.mouse.up = !0, O.mouse.down = !1, O.mouse.state = "up";
});
window.addEventListener("DOMContentLoaded", () => {
  O.window.DOMContentLoaded = !0;
});
function Oe(i) {
  return i;
}
const Re = {
  /**
   * Basic mobile device detection
   */
  isMobile() {
    return typeof navigator > "u" ? !1 : /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },
  /**
   * Checks if user is on iOS device
   */
  isIOS() {
    return typeof navigator > "u" ? !1 : /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
};
function Me(i, t) {
  return Array.isArray(i) ? i.map(t).join("") : (console.log(
    `${f}The provided argument in strmap is not an array`,
    i
  ), "");
}
function _e(i, t) {
  return i ? t : "";
}
function je(i, t) {
  if (!i || i.length <= t) return i;
  const s = t - 3;
  return s <= 0 ? "..." : i.substring(0, s) + "...";
}
function Te(i, t) {
  return i == null || i.trim() === "" ? t : i;
}
const Ne = {
  /**
   * Remove HTML tags from the input, keeping inner content
   */
  removeHtmlTags(i) {
    return i.replace(/<[^>]*>/g, "");
  },
  /**
   * Capitalizes first letter of the string
   */
  capitalize(i) {
    return i && i.charAt(0).toUpperCase() + i.slice(1);
  }
}, Pe = {
  /**
   * Checks if provided string is a valid email
   */
  isEmail(i) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i);
  }
};
class Fe {
  constructor() {
    this.webSocket = null, this.captures = /* @__PURE__ */ new Map(), this.isOpened = !1, this.waitingSendRequests = [];
  }
  /**
   * Connects to WebSocket
   */
  connect(t) {
    return this.webSocket = new WebSocket(t), this.webSocket.onopen = () => {
      this.isOpened = !0, this.waitingSendRequests.forEach((e) => {
        this.webSocket?.send(e);
      }), this.waitingSendRequests = [];
    }, this.webSocket.onmessage = (e) => {
      for (const s of this.captures.values())
        s(e);
    }, this.webSocket.onclose = () => {
      this.isOpened = !1;
    }, this;
  }
  /**
   * Sends raw data to WebSocket
   */
  send(t) {
    return !this.isOpened || !this.webSocket ? (this.waitingSendRequests.push(t), this) : (this.webSocket.send(t), this);
  }
  /**
   * Sends JSON data (auto stringified)
   */
  sendJson(t) {
    return this.send(JSON.stringify(t));
  }
  /**
   * Creates a capture.
   * When any message is received — the callback executes.
   *
   * @returns capture id
   */
  createCapture(t) {
    const e = S(16);
    return this.captures.set(e, t), e;
  }
  /**
   * Removes capture
   */
  removeCapture(t) {
    return this.captures.delete(t), this;
  }
  /**
   * Checks if capture exists
   */
  hasCapture(t) {
    return this.captures.has(t);
  }
  /**
   * Closes websocket safely
   */
  close(t, e) {
    this.webSocket?.close(t, e), this.webSocket = null, this.isOpened = !1;
  }
}
const Ie = {
  /**
   * Opens a url within a new tab / target
   */
  open(i, t = "_blank") {
    if (typeof document > "u") return;
    const e = document.createElement("a");
    e.href = i, e.target = t, e.style.display = "none", document.body.appendChild(e), e.click(), e.remove();
  }
};
function De(i, t) {
  return i = Math.ceil(i), t = Math.floor(t), Math.floor(Math.random() * (t - i + 1) + i);
}
class Xt {
  // ------------------------
  // Constructor
  // ------------------------
  constructor() {
    this.#e = "cjs-debug/Search", this.#s = !0, this.#i = !0, this.#r = "cjsSearch", this.#n = [], this._mode = "query", this.length = 0, this.search = "", this.search = "", window.addEventListener("popstate", () => {
      const t = new URL(window.location.href), e = this._mode === "query" ? t.searchParams.get("path") : t.pathname.replace(/^\/|\/$/g, "");
      e && this.set(e);
    });
  }
  #e;
  #s;
  #i;
  #r;
  #n;
  // ------------------------
  // Private Helpers
  // ------------------------
  #c(t) {
    return new URL(t).pathname.substring(1);
  }
  #t(t) {
    return t ? (t.charAt(0) === "/" && (t = t.slice(1)), t.charAt(t.length - 1) === "/" && (t = t.slice(0, -1)), t) : "";
  }
  #o() {
    ({
      query: () => {
        const e = new URL(window.location.href);
        e.searchParams.set("path", this.search), history.pushState({}, "", e);
      },
      path: () => {
        history.pushState(null, "", `/${this.search}`);
      }
    })[this._mode](), window.dispatchEvent(new Event("popstate"));
  }
  #a() {
    const t = A(`
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #000000;
                padding: 6px 12px;
                border: 2px solid #ffffff;
                border-radius: 6px;
            " id="${this.#e}">
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #acacac;
                    font-size: 10px;
                    user-select: none;
                ">Search url</p>
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #ffffff;
                    font-size: 15px;
                "></p>
            </div>
        `);
    return document.body && document.body.appendChild(t), t;
  }
  // ------------------------
  // Public API
  // ------------------------
  setMode(t) {
    this._mode = t;
  }
  setDisplayedOnScreen(t) {
    return this.#s = t, this;
  }
  onChange(t) {
    return this.#n.push(t), this;
  }
  set(t, e = !1) {
    const s = this.#t(t);
    return this.search === s && !e ? this : (this.search = s, this.update(), this);
  }
  setQuiet(t) {
    return this.search = this.#t(t), this.update(!0), this;
  }
  update(t = !1) {
    localStorage.setItem(this.#r, this.search);
    const e = this.search.split("/").filter((s) => s.trim() !== "");
    if (this.length = e.length, t || this.#n.forEach(
      (s) => s({
        search: this.search,
        parts: e,
        length: this.length
      })
    ), this.#s) {
      const r = (document.getElementById(this.#e) ?? this.#a()).querySelector("p:nth-child(2)");
      r && (r.innerHTML = `/${this.search}`);
    }
    this.#i && this.#o();
  }
  equals(t) {
    return t === this.search ? !0 : this.search === this.#t(t);
  }
  startsWith(t) {
    return this.search.startsWith(this.#t(t));
  }
  slice(t, e = null) {
    const s = this.search.split("/").filter((n) => n.trim() !== "");
    return e === null ? s.slice(t).join("/") : s.slice(t, e).join("/");
  }
  get(t) {
    const e = this.search.split("/");
    return t > e.length - 1 ? (console.log(`${f}Provided index is too high.`), null) : e[t];
  }
  add(t) {
    const e = t.replace(/\//g, "");
    return this.search += this.search.trim().length === 0 ? e : `/${e}`, this.update(), this;
  }
  remove(t) {
    const e = this.search.split("/");
    if (t > e.length - 1)
      return console.log(`${f}Provided index is too high.`), this;
    const n = e.slice(0, e.length - t);
    return this.search = n.join("/"), this.update(), this;
  }
}
const Ye = new Xt();
class W {
  /**
   * Adds CSS style rules to plugin style container
   */
  _addStyleRules(t) {
    const e = document.getElementById(
      Ot
    );
    if (!e) {
      console.warn(`${f} Plugin style element not found`);
      return;
    }
    for (const [s, n] of Object.entries(t)) {
      const r = `${s} { ${n.join(" ")} }`;
      e.innerHTML += `
${r}`;
    }
  }
}
class Ht extends W {
  constructor() {
    super(...arguments), this.attribute = "ripple", this.animationTime = 400, this.cssVariables = {
      s: "sx",
      t: "tx",
      o: "ox",
      d: "dx",
      x: "xx",
      y: "yx"
    };
  }
  applyEffect(t) {
    t.__rippleAttached || (t.addEventListener("click", (e) => {
      const s = e.touches ? e.touches[0] : e, n = t.getBoundingClientRect(), r = Math.sqrt(Math.pow(n.width, 2) + Math.pow(n.height, 2)) * 2;
      t.style.cssText = `--${this.cssVariables.s}: 0; --${this.cssVariables.o}: 1;`, t.offsetTop, t.style.cssText = `--${this.cssVariables.t}: 1;
                 --${this.cssVariables.o}: 0;
                 --${this.cssVariables.d}: ${r};
                 --${this.cssVariables.x}: ${s.clientX - n.left};
                 --${this.cssVariables.y}: ${s.clientY - n.top};`;
    }), t.__rippleAttached = !0);
  }
  addStyles() {
    const t = `${this.animationTime}ms`;
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
        `transition: calc(var(--${this.cssVariables.t}, 0) * var(--ripple-duration, ${t})) var(--ripple-easing, linear);`
      ]
    });
  }
  enable() {
    this.addStyles(), document.querySelectorAll(`[${this.attribute}]`).forEach((e) => this.applyEffect(e)), new MutationObserver((e) => {
      const s = e.filter((n) => n.type === "childList").flatMap((n) => Array.from(n.addedNodes)).filter((n) => n instanceof HTMLElement).flatMap((n) => [
        n,
        ...Array.from(n.querySelectorAll("*"))
      ]).filter((n) => n.hasAttribute(this.attribute));
      for (const n of s)
        this.applyEffect(n);
    }).observe(document.documentElement, {
      childList: !0,
      subtree: !0
    });
  }
}
class Vt extends W {
  constructor() {
    super(), this.attribute = "scale", this.animationTime = 350, this.scales = {
      start: 0.85,
      end: 1
    }, this.keyframe = new z().setDuration(this.animationTime).addEntry({ transform: `scale(${this.scales.start})` }).addEntry({ transform: `scale(${this.scales.end})` });
  }
  handleTouch(t, e) {
    if (t.hasAttribute("disabled")) return;
    const s = this.keyframe.getClass({
      reversed: e
    }), n = e ? this.scales.start : this.scales.end;
    t.classList.add(s), t.style.transform = `scale(${n})`, setTimeout(() => {
      t.classList.remove(s), e || (t.style.transform = "");
    }, this.animationTime);
  }
  applyEvents(t) {
    t.__scaleAttached || (t.addEventListener("touchstart", () => {
      this.handleTouch(t, !0);
    }), t.addEventListener("touchend", () => {
      this.handleTouch(t, !1);
    }), t.__scaleAttached = !0);
  }
  enable() {
    document.querySelectorAll(`[${this.attribute}]`).forEach((s) => this.applyEvents(s)), new MutationObserver((s) => {
      const n = s.filter((r) => r.type === "childList").flatMap((r) => Array.from(r.addedNodes)).filter(
        (r) => r instanceof HTMLElement
      ).flatMap((r) => [
        r,
        ...Array.from(r.querySelectorAll("*"))
      ]).filter((r) => r.hasAttribute(this.attribute));
      for (const r of n)
        this.applyEvents(r);
    }).observe(document.documentElement, {
      childList: !0,
      subtree: !0
    });
  }
}
class Bt extends W {
  constructor() {
    super(...arguments), this.containerId = "cjs-notification-plugin-container", this.keyframe = {
      name: "cjs-notification-plugin",
      duration: 4e3,
      showHideOffset: 10,
      yDiff: 8
    }, this.themes = {
      dark: {
        backgroundColor: "#242323"
      },
      light: {
        backgroundColor: "#ffffff"
      }
    };
  }
  addStyles() {
    const t = "dark", e = "light";
    this._addStyleRules({
      [`#${this.containerId}.container`]: [
        "position: fixed;",
        "bottom: 0;",
        "z-index: 999999999999;",
        "left: 50%;",
        "transform: translateX(-50%);",
        "display: flex;",
        "align-items: center;",
        "flex-direction: column;",
        `gap: ${this.keyframe.yDiff}px;`
      ],
      [`#${this.containerId}.container > .notification`]: [
        `background: ${this.themes[t].backgroundColor};`,
        "border-radius: 14px;",
        "padding: 8px;",
        "width: fit-content;",
        "display: flex;",
        "align-items: center;",
        "gap: 5px;",
        "opacity: 0;",
        "transform: translateY(0px);",
        "filter: drop-shadow(1px 2px 3px black);",
        `animation: ${this.keyframe.name} ${this.keyframe.duration}ms`
      ],
      [`#${this.containerId}.container > .notification.warning`]: [
        "background: #c0bd00;"
      ],
      [`#${this.containerId}.container > .notification.error`]: [
        "background: #de1f1f;"
      ],
      [`#${this.containerId}.container > .notification.info`]: [
        "background: #0e73ff;"
      ],
      [`#${this.containerId}.container > .notification.success`]: [
        "background: #00b600;"
      ],
      [`#${this.containerId}.container > .notification > p`]: [
        `color: ${this.themes[e].backgroundColor};`,
        "margin: 0;",
        "font-size: 16px;",
        "display: -webkit-box;",
        "-webkit-line-clamp: 1;",
        "-webkit-box-orient: vertical;",
        "overflow: hidden;"
      ],
      [`@keyframes ${this.keyframe.name}`]: [
        `0% { opacity: 0; transform: translateY(${this.keyframe.yDiff}px); }`,
        `${this.keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.keyframe.yDiff}px); }`,
        `${100 - this.keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.keyframe.yDiff}px); }`,
        `100% { opacity: 0; transform: translateY(${this.keyframe.yDiff}px); }`
      ]
    });
  }
  createContainer() {
    const t = A(`
            <div id="${this.containerId}" class="container"></div>
        `);
    return document.body.appendChild(t), t;
  }
  createNotification(t, e) {
    const s = document.getElementById(this.containerId) ?? this.createContainer(), r = A(`
            <div class="notification ${e}">
                <div class="icon">
                    ${{
      success: '<svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark1</title> <path d="M21.82 13.030l-1.002-1.002c-0.185-0.185-0.484-0.185-0.668 0l-6.014 6.013-2.859-2.882c-0.186-0.185-0.484-0.185-0.67 0l-1.002 1.003c-0.185 0.185-0.185 0.484 0 0.668l4.193 4.223c0.185 0.184 0.484 0.184 0.668 0l7.354-7.354c0.186-0.185 0.186-0.484 0-0.669zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM16 26c-5.522 0-10-4.478-10-10 0-5.523 4.478-10 10-10 5.523 0 10 4.477 10 10 0 5.522-4.477 10-10 10z"></path> </g></svg>',
      error: '<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>error</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#ffffff" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.232,42.6666667 42.6666667,119.232 42.6666667,213.333333 C42.6666667,307.434667 119.232,384 213.333333,384 C307.434667,384 384,307.434667 384,213.333333 C384,119.232 307.434667,42.6666667 213.333333,42.6666667 Z M262.250667,134.250667 L292.416,164.416 L243.498667,213.333333 L292.416,262.250667 L262.250667,292.416 L213.333333,243.498667 L164.416,292.416 L134.250667,262.250667 L183.168,213.333333 L134.250667,164.416 L164.416,134.250667 L213.333333,183.168 L262.250667,134.250667 Z" id="error"> </path> </g> </g> </g></svg>',
      info: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"></path> </g></svg>',
      warning: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#ffffff"></path></g></svg>'
    }[e]}
                </div>
                <p>${t}</p>
            </div>
        `);
    s.appendChild(r), vt.sleep(this.keyframe.duration).then(() => r.remove());
  }
  info(t) {
    this.createNotification(t, "info");
  }
  error(t) {
    this.createNotification(t, "error");
  }
  warning(t) {
    this.createNotification(t, "warning");
  }
  success(t) {
    this.createNotification(t, "success");
  }
  enable() {
    this.addStyles();
  }
}
class zt extends W {
  constructor() {
    super(...arguments), this.attribute = "hover", this.animationTime = 350, this.hoverScale = 0.95;
  }
  addStyles() {
    this._addStyleRules({
      [`[${this.attribute}]`]: [
        `transition: transform ${this.animationTime}ms !important;`
      ],
      [`[${this.attribute}]:hover`]: [
        `transform: scale(${this.hoverScale}) !important;`
      ]
    });
  }
  enable() {
    this.addStyles();
  }
}
const Kt = new Ht(), Ut = new Bt(), Wt = new Vt(), Jt = new zt(), qe = {
  /**
   * Enables selected plugins
   */
  enable(i = {}) {
    const t = {
      ripple: Kt,
      notification: Ut,
      scaleClick: Wt,
      scaleHover: Jt
    };
    for (const e of Object.keys(t))
      i[e] && t[e].enable();
  }
};
async function Xe(i) {
  const t = async (r) => new Promise((c) => {
    setTimeout(c, r);
  }), e = Date.now(), s = () => {
    Array.from(
      document.querySelectorAll(`#${et}`)
    ).forEach((c) => c.remove()), document.head.appendChild(document.createComment("Styles"));
  }, n = async () => {
    s(), await t(10);
    const r = Gt(et), c = i.toElement();
    r.innerHTML = "", r.insertAdjacentElement("beforeend", c), i._executeOnLoad({}), I.applyBodyMappings(), console.log(`${At}Website loaded in ${m.Green}${Date.now() - e} ms${m.None}.`);
  };
  if (O.window.DOMContentLoaded) {
    await n();
    return;
  }
  document.addEventListener("DOMContentLoaded", async () => {
    await n();
  });
}
function Gt(i) {
  const t = document.createElement("div");
  return t.setAttribute("id", i), document.body.appendChild(t), t;
}
class Zt {
  constructor() {
    this.website = {
      title: "New project",
      icon: null
    };
  }
  /**
   * Sets cursor for the body (whole website)
   */
  setCursor(t) {
    document.body.style.cursor = t;
  }
  setDocumentData(t) {
    this.website = { ...this.website, ...t }, Object.assign(t, this.website);
    const e = (s, n) => {
      if (n === null) return;
      const r = document.createElement("link");
      r.rel = s, r.href = n, document.head.appendChild(r);
    };
    document.title = t.title ?? this.website.title, document.head.appendChild(document.createComment("Meta definitions")), e("icon", t.icon ?? this.website.icon);
  }
  async importStyle(t) {
    const e = document.head.querySelector(`[id="${yt}"]`);
    if (!e) return;
    const s = await new Ct(t, "get").doRequest();
    if (s.isError()) {
      console.log(`${f}Error importing root style at path "${t}"`);
      return;
    }
    const n = St(s.text());
    e.innerHTML += n;
  }
}
const He = new Zt();
export {
  Se as CjsAnimation,
  ht as CjsComponent,
  Qt as CjsDebug,
  xe as CjsDownload,
  st as CjsFrameworkEvents,
  O as CjsGlobals,
  z as CjsKeyFrame,
  B as CjsLayout,
  Re as CjsMobile,
  Bt as CjsNotificationPlugin,
  dt as CjsObject,
  qe as CjsPluginManager,
  Ct as CjsRequest,
  te as CjsRequestsUtil,
  Ht as CjsRipplePlugin,
  Vt as CjsScaleClickPlugin,
  zt as CjsScaleHoverPlugin,
  Ne as CjsString,
  vt as CjsTimings,
  Pe as CjsValidator,
  Fe as CjsWebSocket,
  Ie as CjsWindow,
  He as Root,
  Ye as Search,
  U as asset,
  Ae as createFilter,
  Oe as createHandle,
  De as getRandom,
  ke as gif,
  Xe as init,
  Le as jpg,
  le as off,
  ue as onChange,
  de as onClick,
  he as onDoubleClick,
  ee as onEscape,
  fe as onFocus,
  pe as onFocusOut,
  se as onHoldDown,
  me as onInput,
  _ as onLoad,
  ge as onMouseEnter,
  ye as onMouseLeave,
  be as onMouseMove,
  ne as onOuterclick,
  Ce as onResize,
  we as onScroll,
  ie as onScrollBottom,
  re as onSlideDown,
  oe as onSlideLeft,
  ae as onSlideRight,
  ce as onSlideUp,
  $e as onTouchMove,
  ve as png,
  _e as strif,
  Me as strmap,
  je as strmax,
  Te as stror,
  Ee as svg
};
//# sourceMappingURL=cjs.mjs.map
