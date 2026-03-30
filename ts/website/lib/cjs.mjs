const m = {
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
}, ue = {
  0: m.Black,
  1: m.Blue,
  2: m.Green,
  3: m.Cyan,
  4: m.Red,
  5: m.Magenta,
  6: m.Yellow,
  7: m.White,
  8: m.Dim,
  9: m.Blue,
  a: m.Green,
  b: m.Cyan,
  c: m.Red,
  d: m.Magenta,
  e: m.Yellow,
  f: m.White,
  l: m.Bright,
  n: m.Underscore,
  r: m.None
}, L = {
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
  format(r) {
    return r.replace(/&([0-9a-flnr])/gi, (e, t) => ue[t.toLowerCase()] ?? "") + m.None;
  }
}, I = "[CJS]";
L.format(`&e&n${I}&r `);
const he = L.format(`&c&n${I}&r `), de = L.format(`&c&a${I}&r `), fe = L.format(`&c&b${I}&r `), Y = "cjs:render", K = "cjsroot", H = "cjs-style", me = "cjs-style-keyframes", P = "cjsevent-", M = "cjs_", pe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", ge = "abcdefghijklmnopqrstuvwxyz0123456789", x = {
  getRandom(r, e = !0) {
    let t = "";
    const s = e ? ge : pe, n = s.length;
    let a = 0;
    for (; a < r; )
      t += s.charAt(Math.floor(Math.random() * n)), a += 1;
    if (e) {
      const c = (o) => !isNaN(Number(o.substring(0, 1)));
      for (; c(t); )
        t = this.getRandom(r, e);
    }
    return t;
  },
  /**
   * Creates a unique numeric ID from a string
   * (DJB2 hash)
   */
  getHash(r) {
    let e = 5381;
    for (let t = 0; t < r.length; t++) {
      const s = r.charCodeAt(t);
      e = e * 33 ^ s;
    }
    return e >>> 0;
  },
  /**
   * Remove HTML tags from the input, keeping inner content
   */
  removeHtmlTags(r) {
    return r.replace(/<[^>]*>/g, "");
  },
  /**
   * Capitalizes first letter of the string
   */
  capitalize(r) {
    return r && r.charAt(0).toUpperCase() + r.slice(1);
  },
  kebabCaseToCamelStyle(r) {
    return r.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
  },
  snakeStyleToCamelCase(r) {
    return r.replace(/_([a-z])/g, (e, t) => t.toUpperCase());
  },
  camelStyleToKebabCase(r) {
    return r.replace(/([A-Z])/g, "-$1").toLowerCase();
  },
  camelStyleToSnakeStyle(r) {
    return r.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
}, $ = new class {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  #s = () => {
    let e = null;
    for (; e === null || this.#e.has(e); )
      e = x.getRandom(16);
    return e;
  };
  constructor() {
  }
  /**
   * @param eventCallback 
   * @returns attribute that have to applied to element, to properly detect element to add the click event
   */
  addCallback(e) {
    const t = this.#s();
    return this.#e.set(t, e), ` ${P}${t}`;
  }
  addOnAddElementCallback(e) {
    const t = this.#s();
    return this.#t.set(t, { callback: e }), ` ${P}${t}`;
  }
  hasCallback(e) {
    return this.#e.has(e);
  }
  getCallback(e) {
    return this.#e.get(e);
  }
  hasOnAddElementCallback(e) {
    return this.#t.has(e);
  }
  getOnAddElementCallback(e) {
    return this.#t.get(e);
  }
}();
function E(r) {
  return $.addOnAddElementCallback(r);
}
function Ne(r) {
  return E((e) => {
    document.addEventListener("keydown", (t) => {
      (t.key === "Escape" || t.key == "Esc") && r(e);
    });
  });
}
function Pe(r, e = 500) {
  return E((t) => {
    let s = 0;
    const n = () => {
      clearTimeout(s);
    }, a = () => {
      s = setTimeout(() => {
        r(t);
      }, e);
    };
    t.source.addEventListener("mousedown", a), t.source.addEventListener("touchstart", a), t.source.addEventListener("mouseup", n), t.source.addEventListener("mousemove", n), t.source.addEventListener("touchend", n), t.source.addEventListener("touchcancel", n), t.source.addEventListener("touchmove", n);
  });
}
function Ie(r) {
  return $.addCallback({
    eventName: "click",
    callback: (e) => {
      const { event: t, source: s } = e;
      document.body.contains(s) && s !== t.target && !s.contains(t.target) && r(e);
    },
    applyToWindow: !0
  });
}
function He(r) {
  return E((e) => {
    e.source.addEventListener("scroll", () => {
      e.source.scrollTop + e.source.clientHeight >= e.source.scrollHeight && r(e);
    });
  });
}
function qe(r, e = 10) {
  return E((t) => {
    let s = 0, n = 0;
    const a = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientY : l.clientY;
      n = u, s = u;
    }, c = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientY : l.clientY, h = u + 1 >= n, d = u - s;
      if (!h) {
        s = 0;
        return;
      }
      d > e && (r(t), s = 0), n = u;
    }, { source: o } = t;
    o.addEventListener("mousedown", a), o.addEventListener("touchstart", a), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function Be(r, e = 50, t = 50) {
  return E((s) => {
    let n = { startX: 0, startY: 0, lastX: 0, lastY: 0 };
    const a = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientX : l.clientX, h = "touches" in l ? l.touches[0].clientY : l.clientY;
      n.lastX = u, n.startX = u, n.lastY = h, n.startY = h;
    }, c = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientX : l.clientX, h = "touches" in l ? l.touches[0].clientY : l.clientY, d = u - 1 <= n.lastX, f = u - n.startX, p = h - n.startY;
      if (t !== -1 && t < Math.abs(p)) {
        n.startX = 0;
        return;
      }
      if (!d) {
        n.startX = 0;
        return;
      }
      f < -1 * e && (r(s), n.startX = 0), n.lastX = u;
    }, { source: o } = s;
    o.addEventListener("mousedown", a), o.addEventListener("touchstart", a), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function Ye(r, e = 50, t = 50) {
  return E((s) => {
    let n = { startX: 0, startY: 0, lastX: 0, lastY: 0 };
    const a = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientX : l.clientX, h = "touches" in l ? l.touches[0].clientY : l.clientY;
      n.lastX = u, n.startX = u, n.lastY = h, n.startY = h;
    }, c = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientX : l.clientX, h = "touches" in l ? l.touches[0].clientY : l.clientY, d = u + 1 >= n.lastX, f = u - n.startX, p = h - n.startY;
      if (t !== -1 && t < Math.abs(p)) {
        n.startX = 0;
        return;
      }
      if (!d) {
        n.startX = 0;
        return;
      }
      f > e && (r(s), n.startX = 0), n.lastX = u;
    }, { source: o } = s;
    o.addEventListener("mousedown", a), o.addEventListener("touchstart", a), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
function De(r, e = 10) {
  return E((t) => {
    let s = 0, n = 0;
    const a = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientY : l.clientY;
      n = u, s = u;
    }, c = (i) => {
      const l = i, u = "touches" in l ? l.touches[0].clientY : l.clientY, h = u - 1 <= n, d = u - s;
      if (!h) {
        s = 0;
        return;
      }
      d < -1 * e && (r(t), s = 0), n = u;
    }, { source: o } = t;
    o.addEventListener("mousedown", a), o.addEventListener("touchstart", a), o.addEventListener("mousemove", c), o.addEventListener("touchmove", c);
  });
}
const w = (r, e, t = !1) => $.addCallback({
  eventName: r,
  callback: e,
  applyToWindow: t
}), Fe = (r) => w("change", r), Xe = (r) => w("click", r), Ue = (r) => w("dblclick", r), Ve = (r) => w("focus", r), ze = (r) => w("focusout", r), We = (r) => w("input", r), Ke = (r) => w("mouseenter", r), Ge = (r) => w("mouseleave", r), Je = (r) => w("mousemove", r), Ze = (r) => w("resize", r, !0), Qe = (r) => w("scroll", r), et = (r) => w("touchmove", r);
class re {
  /**
   * String to analyze input
   */
  constructor(e) {
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
    }, this.source = e;
  }
  _isOutOfBounds(e, t) {
    return e.length <= t + 1;
  }
  /**
   * Checks if string chars is one by one next chars in the array
   */
  _matchNextChars(e, t, s = !1) {
    if (e === void 0) return !1;
    const n = e.split("");
    s && console.log(
      `Comparsion: "${e}" with "${t.slice(0, e.length).join("")}"`
    );
    const a = [], c = () => {
      s && console.log(
        "Char by char comparsion:",
        a.map(
          (o) => `"${o.matchChar}" ${o.matchChar === o.arrayChar ? "==" : "!="} "${o.arrayChar}"`
        ).join(", ")
      );
    };
    for (let o = 0; o < n.length; o++) {
      const i = n[o], l = o;
      if (this._isOutOfBounds(t, l))
        return c(), !1;
      const u = t[l];
      if (a.push({ matchChar: i, arrayChar: u }), u !== i)
        return c(), !1;
    }
    return c(), !0;
  }
  /**
   * Reads string ignoring the comments sections with checks if the comment is in string
   */
  _read(e = () => {
  }) {
    const { comment: t, loop: s } = this, n = this.source.split("");
    let a = "";
    for (let i = 0; i < n.length; i++) {
      if (s.char = n[i], s.skipChars > 0) {
        s.skipChars--;
        continue;
      }
      if (t.multipleLineEnabled && this._matchNextChars(t.closing, n.slice(i)) && s.comment.multipleLineOpened) {
        s.comment.multipleLineOpened = !1, s.skipChars = t.closing.length - 1;
        continue;
      }
      if (t.singleLineEnabled && s.comment.singleLineOpened && this._matchNextChars(`
`, n.slice(i))) {
        s.comment.singleLineOpened = !1, s.skipChars = 1;
        continue;
      }
      if (!(s.comment.multipleLineOpened || s.comment.singleLineOpened)) {
        if (s.string.opened && s.char === s.string.openingChar) {
          s.string.opened = !1, s.string.openingChar = "", a += s.char;
          continue;
        }
        if (this.stringChars.includes(s.char) && !s.string.opened && (s.string.opened = !0, s.string.openingChar = s.char), t.singleLineEnabled && this._matchNextChars(t.singleLine, n.slice(i)) && !s.string.opened) {
          s.comment.singleLineOpened = !0;
          continue;
        }
        if (t.multipleLineEnabled && this._matchNextChars(t.opening, n.slice(i))) {
          if (s.string.multipleLineOpened && t.ignoreInString) {
            a += s.char;
            continue;
          }
          s.comment.multipleLineOpened = !0;
          continue;
        }
        a += s.char;
      }
    }
    const c = a.split(""), o = (i, l) => {
      e(i, l, (u, h = !1) => u === void 0 ? !1 : this._matchNextChars(u, c.slice(l), h));
    };
    for (let i = 0; i < c.length; i++) {
      const l = c[i];
      if (s.string.opened && l === s.string.openingChar) {
        s.string.opened = !1, s.string.openingChar = "", o(l, i);
        continue;
      }
      if (this.stringChars.includes(l) && !s.string.opened) {
        s.string.opened = !0, s.string.openingChar = l, o(l, i);
        continue;
      }
      o(l, i);
    }
    return a;
  }
}
class G extends re {
  /**
   * Css text
   */
  constructor(e) {
    super(e), this.comment = {
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
    const e = {};
    let t = !1, s = 0, n = "", a = "";
    const c = (o) => o.replaceAll(`
`, "");
    return this._read((o) => {
      const i = this.loop;
      if (o === "{" && !t && !i.string.opened) {
        t = !0, a = c(n), n = "", a in e || (e[a] = "");
        return;
      }
      if (!t) {
        n += o;
        return;
      }
      if (o === "{" && t && !i.string.opened && s++, o === "}" && s > 0 && !i.string.opened) {
        s--, n += o;
        return;
      }
      if (o === "}" && s === 0 && !i.string.opened) {
        e[a] = c(n), a = "", n = "", t = !1;
        return;
      }
      n += o;
    }), e;
  }
}
class ye extends re {
  /**
   * Css selector style
   */
  constructor(e) {
    super(e), this.comment = {
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
    const e = (n) => n.replaceAll(`
`, "");
    this.source = e(this.source);
    const t = {}, s = {
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
      const { loop: a } = this;
      if (n === ";" && !a.string.opened && s.reading === "value") {
        s._parse();
        const { name: u, value: h } = s;
        t[u] = h, s._reset();
        return;
      }
      if (n === ":" && !a.string.opened && s.reading === "name") {
        s.reading = "value";
        return;
      }
      if (s.reading === "value") {
        s.value += n;
        return;
      }
      s.reading === "name" && (s.name += n);
    }), t;
  }
}
const Ce = {
  processSelector(r) {
    const e = r.split(" "), t = e[1], s = e[2], n = {}, a = (() => {
      let i = "", l = "";
      for (const u of s.split(""))
        isNaN(Number(u)) ? l += u : i += u;
      return { number: parseInt(i), unit: l };
    })(), { number: c, unit: o } = a;
    return n["<"] = `max-width: ${c - 1}${o}`, n["<="] = `max-width: ${c}${o}`, n[">"] = `min-width: ${c + 1}${o}`, n[">="] = `min-width: ${c}${o}`, `@media only screen and (${n[t]})`;
  }
}, J = {
  "backdrop-filter": ["-webkit-backdrop-filter"]
}, be = {
  processComponentStyle(r, e) {
    const t = new G(e).read();
    let s = [];
    const n = (c, o) => {
      c = c.trim();
      const i = `${c} { ${o} }`;
      return c.startsWith(":") ? [i] : c.split(",").map((l) => {
        const u = l.trim().substring(0, 1), h = u === "." || u === "#", d = [
          `${r}${h ? "" : " "}${l.trim()}`
        ];
        if (!h) {
          const f = l.split(" "), p = f[0], v = f.slice(1).join(" "), C = p.includes(":") ? p.slice(p.indexOf(":")) : "", y = p.replace(C, ""), S = `${C} ${v}`, j = S.split(",").map((O) => O.trim()).slice(1), R = S.includes(",") ? j.map((O) => {
            const b = [
              `${y}${r}`,
              `${O.replace(y, "")}`
            ], T = !b[1].startsWith(":");
            return b.join(T ? " " : "");
          }) : "";
          S.includes(",") ? d.push(
            `${y}${r}${S.replace(
              j,
              R
            )}`
          ) : d.push(`${y}${r}${S}`);
        }
        return d;
      }).map((l) => `${l.join(", ")} { ${o} }`).flat();
    }, a = (c, o) => {
      const i = new G(o).read(), l = [];
      for (const [u, h] of Object.entries(i)) {
        const d = new ye(h).read();
        for (const [p, v] of Object.entries(d))
          if (p in J)
            for (const C of J[p])
              C in d || (d[C] = v);
        const f = n(u, h);
        l.push(...f);
      }
      return l;
    };
    for (const [c, o] of Object.entries(t)) {
      if (o.trim() === "") continue;
      const i = c.trim(), l = i.startsWith("@media"), u = i.startsWith("@keyframes"), h = i.startsWith("@range");
      if (console.log(i, u), h) {
        const p = `${Ce.processSelector(i)} { ${a(i, o).join(`
`)} }`;
        s.push(p);
        continue;
      }
      if (l) {
        const f = `${i} { ${a(
          i,
          o
        ).join(`
`)} }`;
        s.push(f);
        continue;
      }
      if (u) {
        s.push(`${i} { ${o} }`);
        continue;
      }
      const d = n(i, o);
      s.push(...d);
    }
    return s.join(" ").replaceAll(`
`, "");
  }
}, g = {
  info(r, ...e) {
    console.info(L.format(`${fe}${r}`), e);
  },
  success(r, ...e) {
    console.log(L.format(`${de}${r}`), e);
  },
  error(r, ...e) {
    console.warn(L.format(`${he}${r}`), e);
  }
}, A = {
  HTMLToElement(r) {
    const e = document.createElement("template");
    e.innerHTML = r.trim();
    const t = e.content.firstElementChild;
    if (!t)
      throw new Error("htmlToElement: Provided HTML produced no element.");
    return t;
  },
  getAttributesStartingWith(r, e) {
    if (!r.attributes) return [];
    const t = [];
    for (const s of Array.from(r.attributes)) {
      const n = s.name;
      n.startsWith(e) && t.push(n);
    }
    return t;
  }
}, D = {
  injectAttribute(r, e, t) {
    const s = r.length;
    let n = 0;
    for (; n < s && r.charCodeAt(n) <= 32; ) n++;
    if (r[n] !== "<") return r;
    const a = n, c = r.indexOf(">", a);
    if (c === -1) return r;
    let o = r.slice(a, c);
    const i = new RegExp(
      `\\b${e}\\s*=\\s*(['"])(.*?)\\1`,
      "i"
    ), l = o.match(i);
    let u;
    if (l) {
      const h = l[0], d = l[1], f = l[2].trim(), p = f.length === 0 ? t : f.endsWith(";") ? f + t : e === "style" ? f + "; " + t : f + " " + t, v = `${e}=${d}${p}${d}`;
      u = o.replace(h, v);
    } else {
      const h = o.endsWith("/") ? o.length - 1 : o.length;
      u = o.slice(0, h) + ` ${e}="${t}"` + o.slice(h);
    }
    return r.slice(0, a) + u + r.slice(c);
  }
}, k = {
  /**
   * Returns values from keys if the value is not an object
   */
  getNonObjectValues(r) {
    const e = (t) => {
      if (!t || typeof t != "object") return [t];
      const s = [];
      for (const n of Object.keys(t)) {
        const a = t[n], c = typeof a == "object" && a !== null && !Array.isArray(a);
        s.push(...c ? e(a) : [a]);
      }
      return s;
    };
    return e(r);
  },
  /**
   * Deep merges two objects
   * object2 overwrites object1 by default
   */
  join(r, e, t = !0) {
    const s = (n, a) => {
      if (typeof n != "object" || n === null)
        return a ?? n;
      const c = Array.isArray(n) ? [...n] : {}, o = /* @__PURE__ */ new Set([
        ...Object.keys(n ?? {}),
        ...Object.keys(a ?? {})
      ]);
      for (const i of o) {
        if (!(i in a)) {
          c[i] = n?.[i];
          continue;
        }
        !t && i in n ? c[i] = n[i] : c[i] = s(n?.[i], a?.[i]);
      }
      return c;
    };
    return s(r, e);
  },
  /**
   * Deep copy of an object
   */
  copy(r) {
    const e = (t) => {
      if (t === null) return null;
      const s = typeof t != "object", n = typeof HTMLElement < "u" && (t instanceof HTMLElement || t instanceof Node);
      if (s || n) return t;
      if (Array.isArray(t))
        return t.map((c) => e(c));
      const a = {};
      for (const [c, o] of Object.entries(t))
        a[c] = e(o);
      return a;
    };
    return e(r);
  },
  /**
   * Removes keys that have nullable / empty values (mutates object)
   */
  filterOutNullableValues(r) {
    for (const [e, t] of Object.entries(r)) {
      const s = typeof t == "object" && t !== null && !Array.isArray(t) && Object.keys(t).length === 0;
      (t == null || Array.isArray(t) && t.length === 0 || typeof t == "string" && t.trim() === "" || s) && delete r[e];
    }
    return r;
  },
  isEmpty(r) {
    return !r || Object.keys(r).length === 0;
  }
};
class F {
  constructor(e, t, s) {
    this.statusCode = e, this.response = t, this.networkError = s;
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
  onStatus(e, t) {
    this.statusCode === e && t();
  }
}
class we {
  constructor(e, t) {
    this.url = e, this.method = t, this.onStartCallback = () => {
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
    const e = localStorage.getItem(this.getCacheKey());
    if (!e) return null;
    const t = JSON.parse(e);
    return Date.now() > t.expiryTimestamp ? null : t;
  }
  setCached(e, t) {
    const s = (/* @__PURE__ */ new Date()).getTime() + 1e3 * t;
    localStorage.setItem(this.getCacheKey(), JSON.stringify({ data: e, expiryTimestamp: s }));
  }
  buildUrl() {
    const e = Object.keys(this.query);
    if (e.length === 0) return this.url;
    const t = e.map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(this.query[s])}`).join("&");
    return `${this.url}?${t}`;
  }
  sendBodyOrFiles(e) {
    const t = Object.keys(this.body).length > 0, s = Object.keys(this.files).length > 0;
    if (t || s)
      if (t && !s)
        e.setRequestHeader("Content-Type", "application/json"), e.send(JSON.stringify(this.body));
      else {
        const n = new FormData();
        if (Object.entries(this.files).forEach(([a, c]) => {
          c instanceof FileList ? Array.from(c).forEach(
            (o) => n.append(a, o)
          ) : n.append(a, c);
        }), t && !this.bodyKey) {
          console.error("BodyKey required when sending files + body"), e.send(n);
          return;
        }
        t && this.bodyKey && n.append(this.bodyKey, JSON.stringify(this.body)), e.send(n);
      }
    else
      e.send();
  }
  setQuery(e) {
    return this.query = e, this;
  }
  setHeaders(e) {
    return this.headers = e, this;
  }
  setBody(e) {
    return this.body = e, this;
  }
  setFiles(e) {
    return this.files = e, this;
  }
  setBodyKey(e) {
    return this.bodyKey = e, this;
  }
  setCacheSeconds(e) {
    return this.cacheSeconds = e, this;
  }
  setCacheMinutes(e) {
    return this.cacheSeconds = e * 60, this;
  }
  setCacheHours(e) {
    return this.cacheSeconds = e * 60 * 60, this;
  }
  setResponseType(e) {
    return this.responseType = e, this;
  }
  onStart(e) {
    return this.onStartCallback = e, this;
  }
  onEnd(e) {
    return this.onEndCallback = e, this;
  }
  onError(e) {
    return this.onErrorCallback = e, this;
  }
  onSuccess(e) {
    return this.onStartCallback = e, this;
  }
  onProgress(e) {
    return this.onProgressCallback = e, this;
  }
  async doRequest() {
    if (this.cacheSeconds > 0) {
      const s = this.getCached();
      if (s)
        return new F(
          s.statusCode,
          s.data,
          !1
        );
    }
    this.cooldown > 0 && await new Promise((s) => setTimeout(s, this.cooldown));
    const e = new XMLHttpRequest();
    return e.open(this.method.toUpperCase(), this.buildUrl(), !0), this.responseType && (e.responseType = this.responseType), Object.entries(this.headers).forEach(([s, n]) => {
      e.setRequestHeader(s, String(n));
    }), this.onStartCallback(), await new Promise((s) => {
      e.onreadystatechange = () => {
        if (e.readyState !== 4) return;
        const n = new F(
          e.status,
          e.response,
          e.status === 0
        );
        this.onEndCallback(n), n.isError() ? this.onErrorCallback(n) : this.onSuccessCallback(n), this.cacheSeconds > 0 && this.setCached({
          data: e.response,
          statusCode: e.status
        }, this.cacheSeconds), s(n);
      }, e.upload.onprogress = (n) => {
        if (n.lengthComputable) {
          let a = n.loaded / n.total * 100;
          this.onProgressCallback(a, n.loaded, n.total, n);
        }
      }, e.onerror = () => {
        const n = new F(0, null, !0);
        this.onErrorCallback(n), s(null);
      }, this.sendBodyOrFiles(e);
    });
  }
}
const tt = {
  clearCache() {
    for (let r = 0; r < localStorage.length; r++) {
      const e = localStorage.key(r);
      e?.startsWith("cjsrequest-") && localStorage.removeItem(e);
    }
  }
};
class Se {
  constructor(e) {
    this.components = Array.from(e);
  }
  call(e) {
    this.components.forEach((t) => e(t));
  }
  _add(e) {
    this.components.push(e);
  }
  /**
   * Sets the class name for all components
   */
  set className(e) {
    this.call((t) => t.className = e);
  }
  /**
   * Returns the value of first component className
   */
  get className() {
    return this.components.length === 0 ? null : this.components[0].className;
  }
  /**
   * classList wrapper for all components
   */
  get classList() {
    return {
      add: (...e) => {
        this.call((t) => t.classList.add(...e));
      },
      remove: (...e) => {
        this.call((t) => t.classList.remove(...e));
      },
      contains: (e) => this.components.every((t) => t.classList.contains(e)),
      toggle: (e, t) => {
        this.call((s) => s.classList.toggle(e, t));
      },
      addExcept: (e, t) => {
        this.call((s) => {
          s !== t && s.classList.add(e);
        });
      },
      removeExcept: (e, t) => {
        this.call((s) => {
          s !== t && s.classList.remove(e);
        });
      },
      addOnlyRemoveOthers: (e, t) => {
        this.call((s) => {
          s.classList[s === t ? "add" : "remove"](e);
        });
      },
      removeOnlyAddOthers: (e, t) => {
        this.call((s) => {
          s.classList[s === t ? "remove" : "add"](e);
        });
      }
    };
  }
}
class X {
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
    const t = Array.from(this.#e.querySelectorAll("select")), s = Array.from(this.#e.querySelectorAll("input")), n = Array.from(this.#e.querySelectorAll("textarea")), a = [...t, ...s, ...n], c = {};
    for (let o = 0; o < a.length; o++) {
      const i = a[o], l = i.getAttribute("name");
      if (!l && !e.includeNoNames) continue;
      const u = i.getAttribute("type") ?? "*", d = (this.#t[u] ?? this.#t["*"])(i), f = l ?? o;
      c[f] = d;
    }
    if (e.checkboxesReadType === "array") {
      const o = s.filter((i) => i.type === "checkbox");
      for (const i of o) {
        if (!i.name) {
          g.error("Checkbox doesn't have a name attribute, but it's required when options.checkboxesReadType === array", i);
          continue;
        }
        const l = i.name;
        (!(l in c) || !Array.isArray(c[l])) && (c[l] = []), i.checked && c[l].push(i.value);
      }
    }
    return c;
  }
}
const Z = [], W = class W {
  /**
   * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
   */
  constructor(e = null, t = null) {
    this.__events = {}, this._cssStyle = null, this._additionalStyle = {}, this._defaultData = {}, this._preSetData = {}, this._id = null, this.element = null, e && (this._preSetData = k.copy(e)), t && (this._additionalStyle = k.copy(t)), this.createId();
  }
  /**
   * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
   */
  /** Creates id or pulls it from the map */
  createId() {
    const e = this.constructor._prototypesData, t = Array.from(e.values()).map((s) => s.id);
    if (e.has(this.constructor))
      this._id = e.get(this.constructor).id;
    else {
      for (this._id = null; this._id === null || t.includes(this._id); )
        this._id = x.getRandom(6);
      e.set(this.constructor, { id: this._id });
    }
  }
  /** Passes processed component style to global root style */
  async injectRootStyle() {
    if (!this._cssStyle) return;
    const e = this._cssStyle.startsWith("./") ? this._cssStyle.slice(2) : this._cssStyle, t = await new we(e, "get").doRequest();
    if (t.isError()) {
      g.error(`Error occurred while importing style (&e${e}&r)`);
      return;
    }
    const s = t.text(), n = document.head.querySelector(`[id="${H}"]`);
    n && (n.innerHTML += be.processComponentStyle(`[${M}*="${this._id}"]`, s));
  }
  /** Provides the HTML string for the component */
  getHtml() {
    let e = this._template();
    const t = this.constructor._prototypesData.get(this.constructor), s = [];
    if (this._cssStyle && (Z.includes(this._cssStyle) || (this.injectRootStyle(), Z.push(this._cssStyle))), k.isEmpty(this._additionalStyle) || (e = D.injectAttribute(
      e,
      "style",
      Object.entries(this._additionalStyle).map((n) => `${x.camelStyleToKebabCase(n[0])}: ${n[1]}`).join("; ")
    )), t && "fillHeightData" in t) {
      const { maxHeight: n, offset: a } = t.fillHeightData, c = (o) => {
        const { source: i } = o;
        i.style.height = `${n !== void 0 && window.innerHeight > n ? n : window.innerHeight + a}px`;
      };
      s.push((o) => {
        window.addEventListener("resize", (i) => c(o)), c(o);
      });
    }
    return e = D.injectAttribute(e, E((n) => {
      s.forEach((a) => a(n)), this.element = n.source;
    }), ""), e = D.injectAttribute(e, M, this._id), e;
  }
  getConstructorClass() {
    return this.constructor;
  }
  /**
   * 
   * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
   * 
   */
  _addToPrototypeData(e) {
    const t = this.constructor._prototypesData;
    if (t.has(this.constructor)) {
      const s = t.get(this.constructor);
      t.set(this.constructor, { ...s, ...e });
      return;
    }
    t.set(this.constructor, e);
  }
  /** Function that provides template for base html structure */
  _template() {
    return "";
  }
  /** Function that provides actions for the component */
  _events() {
    return {};
  }
  /** Functions that creates an type for component events */
  _wrapEvents(e) {
    return e;
  }
  /** Provides auto fill height of the component to the actual screen height (with optional offsets) */
  fillHeight(e = 0, t = void 0) {
    this._addToPrototypeData({ fillHeightData: { offset: e, maxHeight: t } });
  }
  getForms() {
    const e = this.element;
    return e ? Array.from(
      e.querySelectorAll("form"),
      (t) => new X(t)
    ) : null;
  }
  getComponents() {
    return new Se(document.body.querySelectorAll(`[${M}="${this._id}"]`));
  }
  /** Sets the data for the component */
  withData(e = null) {
    return e && (this._preSetData = k.copy(e)), this;
  }
  /** Sets additional style for the component */
  withStyle(e) {
    return this._additionalStyle = k.copy(e), this;
  }
  /** Example: render HTML string */
  render(e = null) {
    return new (this.getConstructorClass())(e).getHtml();
  }
  /** Example: visualise component as element */
  visualise(e = null) {
    return e && (this._preSetData = k.copy(e)), A.HTMLToElement(this.getHtml());
  }
  /** Example: querySelector logic */
  querySelector(e) {
    return this.getFirst().querySelector(e);
  }
  /** Get first occurrence of the CjsComponent as HTMLElement */
  getFirst() {
    return document.body.querySelector(`[${M}="${this._id}"]`);
  }
  /** Get all occurrences of the CjsComponent as HTMLElement */
  getAll() {
    return document.body.querySelectorAll(`[${M}="${this._id}"]`);
  }
  /** Loads CjsLayout inside CjsComponent */
  loadLayout(e) {
    for (const t of this.getAll()) {
      t.innerHTML = "";
      for (const s of e.visualise())
        t.appendChild(s);
    }
  }
  /**
   * 
   * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
   * 
   */
  /** Provides merged component data including default data and pre-set data */
  get data() {
    return k.copy(
      k.join(this._defaultData, this._preSetData)
    );
  }
  /** Provides all form elements within the component as CjsForm instances */
  get forms() {
    return Array.from(
      A.HTMLToElement(this.getHtml()).querySelectorAll("form"),
      (e) => new X(e)
    );
  }
  /** Provides all event handlers for the component */
  get events() {
    const e = this;
    return new Proxy(this.__events, {
      get(t, s) {
        return s in t ? t[s] : (n) => {
          e._events()[s](n);
        };
      }
    });
  }
  /**
   * 
   * / 🟡 ------------ STATIC SCOPE ------------ 🟡 /
   * 
   */
  /** Central helper to get or create _id for a class */
  static getClassId() {
    let e = this._prototypesData.get(this).id;
    return e || (e = new this()._id), e;
  }
  static getInstance(...e) {
    const t = this, s = new t(...e);
    return s._id = t.getClassId(), s;
  }
  static getForms() {
    const e = this.getInstance().getFirst();
    return e ? Array.from(
      e.querySelectorAll("form"),
      (t) => new X(t)
    ) : null;
  }
  static getComponents() {
    return this.getInstance().getComponents();
  }
  /** Sets the data for the component */
  static withData(e = {}) {
    return this.getInstance(e);
  }
  /** Sets additional style for the component */
  static withStyle(e) {
    return this.getInstance(null, e);
  }
  /** Example: render HTML string */
  static render(e = {}) {
    return this.getInstance(e).getHtml();
  }
  /** Example: visualise component as element */
  static visualise(e = {}) {
    return this.getInstance().visualise(e);
  }
  /** Example: querySelector logic */
  static querySelector(e) {
    return this.getInstance().getFirst().querySelector(e);
  }
  /** Other static methods can do the same */
  static fillHeight(e = 0, t) {
    return this.getInstance().fillHeight(e, t);
  }
  /** Loads CjsLayout inside CjsComponent */
  static loadLayout(e) {
    return this.getInstance().loadLayout(e);
  }
  /** Get first occurrence of the CjsComponent as HTMLElement */
  static getFirst() {
    return this.getInstance().getFirst();
  }
  /** Get all occurrences of the CjsComponent as HTMLElement */
  static getAll() {
    return this.getInstance().getAll();
  }
};
W._prototypesData = /* @__PURE__ */ new Map();
let U = W;
class V {
  /**
   * @param elements Function returning layout structure
   */
  constructor(e) {
    this._preSetData = null, this._additionalStyle = null, this._layoutObjects = [], this.elements = e;
  }
  withData(e) {
    return this._preSetData = e, this;
  }
  withStyle(e) {
    return this._additionalStyle = e, this;
  }
  createErrorElement() {
    return document.createElement("cjslayouterror");
  }
  /** Build DOM structure */
  visualise() {
    const e = document.createElement("div");
    function t(c) {
      return typeof c == "function" && c.prototype?.constructor === c;
    }
    function s(c) {
      return c[Symbol.toStringTag] === "AsyncFunction";
    }
    const n = (c, o) => {
      if (!(c instanceof U))
        return g.error("The element should be CjsComponent, but passed", c), [this.createErrorElement()];
      const i = c.visualise();
      if (o.length === 2) {
        let u = i.getElementsByTagName(Y)[0];
        const h = o[1];
        if (!Array.isArray(h))
          return g.error("Layout sub components at second argument have to be Array"), [i];
        h.forEach((d, f) => {
          if (d === null) return;
          const p = f === h.length - 1, v = d[0], C = a(d);
          if (v instanceof V) {
            for (const y of C)
              i.insertAdjacentElement("beforeend", y);
            return;
          }
          if (u = i.getElementsByTagName(Y)[0], u) {
            p || u.insertAdjacentElement(
              "afterend",
              document.createElement(Y)
            );
            for (const y of C)
              u.insertAdjacentElement("afterend", y);
            u.remove();
          } else
            for (const y of C)
              i.insertAdjacentElement("beforeend", y);
        });
      }
      return [i];
    }, a = (c) => {
      if (!Array.isArray(c))
        return g.error("Layout have wrong pattern, component should be in array"), [this.createErrorElement()];
      if (c.length === 0)
        return g.error("Layout have an empty component space"), [this.createErrorElement()];
      const o = c[0];
      if (o instanceof V)
        return o.visualise();
      if (s(o)) {
        const l = document.createElement("cjsasyncelement");
        return o().then((u) => {
          const h = a([u]);
          for (const d of h)
            l.insertAdjacentElement("beforebegin", d);
          l.remove();
        }), [l];
      }
      const i = t(o) ? new o() : o;
      return n(i, c);
    };
    if (this.elements(this._preSetData).forEach((c) => {
      if (!c) return;
      const o = a(c.filter((i) => i !== null));
      for (const i of o)
        e.insertAdjacentElement(
          "beforeend",
          i
        );
    }), this._layoutObjects = Array.from(e.children), this._additionalStyle) {
      for (const c of this._layoutObjects) {
        const o = Object.entries(this._additionalStyle).map((u) => `${u[0]}: ${u[1]}`).join("; ") + ";", i = c.hasAttribute("style") ? c.getAttribute("style") : null;
        if (!i) {
          c.setAttribute("style", o);
          continue;
        }
        const l = i.endsWith(";");
        c.setAttribute(
          "style",
          l ? `${i} ${o}` : `${i}; ${o}`
        );
      }
      this._additionalStyle = null;
    }
    return this._layoutObjects;
  }
  reRender() {
    const e = this._layoutObjects, t = e[0];
    e.slice(1).forEach((n) => n.remove());
    for (const n of this.visualise())
      t.insertAdjacentElement("beforebegin", n);
    t.remove();
  }
}
let z = !1;
function Q() {
  if (z) return null;
  const r = document.head.appendChild(
    A.HTMLToElement(`<style id="${H}"></style>`)
  );
  return z = !0, r;
}
const ie = {
  create() {
    Q();
  },
  appendStyle(r) {
    if (!z) {
      Q().innerHTML += r;
      return;
    }
    const e = document.getElementById(H);
    e.innerHTML += r;
  }
};
class q {
  /**
   * Adds CSS style rules to plugin style container
   */
  _addStyleRules(e) {
    for (const [t, s] of Object.entries(e)) {
      const n = `${t} { ${s.join(" ")} }`;
      ie.appendStyle(`
${n}`);
    }
  }
}
class ve extends q {
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
  applyEffect(e) {
    e.__rippleAttached || (e.addEventListener("click", (t) => {
      const s = t.touches ? t.touches[0] : t, n = e.getBoundingClientRect(), a = Math.sqrt(Math.pow(n.width, 2) + Math.pow(n.height, 2)) * 2;
      e.style.cssText = `--${this.cssVariables.s}: 0; --${this.cssVariables.o}: 1;`, e.offsetTop, e.style.cssText = `--${this.cssVariables.t}: 1;
                 --${this.cssVariables.o}: 0;
                 --${this.cssVariables.d}: ${a};
                 --${this.cssVariables.x}: ${s.clientX - n.left};
                 --${this.cssVariables.y}: ${s.clientY - n.top};`;
    }), e.__rippleAttached = !0);
  }
  addStyles() {
    const e = `${this.animationTime}ms`;
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
        `transition: calc(var(--${this.cssVariables.t}, 0) * var(--ripple-duration, ${e})) var(--ripple-easing, linear);`
      ]
    });
  }
  enable() {
    this.addStyles(), document.querySelectorAll(`[${this.attribute}]`).forEach((t) => this.applyEffect(t)), new MutationObserver((t) => {
      const s = t.filter((n) => n.type === "childList").flatMap((n) => Array.from(n.addedNodes)).filter((n) => n instanceof HTMLElement).flatMap((n) => [
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
const ee = [], te = [];
class N {
  constructor() {
    this.entries = [], this.duration = 1e3, this.timingFunction = "ease", this.keepEndingEntryStyle = !0, this.selector = "", this.isImportant = !1, this.fillMode = "";
  }
  // --------------------------------------------------
  // Configuration
  // --------------------------------------------------
  setSelector(e) {
    return this.selector = e, this;
  }
  setFillMode(e) {
    return this.fillMode = e, this;
  }
  setEndingEntryStyle(e) {
    return this.keepEndingEntryStyle = e, this;
  }
  addEntry(e) {
    return this.entries.push(e), this;
  }
  setDuration(e) {
    return isNaN(e) ? (g.error("Provided argument is not a number"), this) : (this.duration = e, this);
  }
  setTimingFunction(e) {
    return this.timingFunction = e, this;
  }
  setImportant(e) {
    return this.isImportant = e, this;
  }
  // --------------------------------------------------
  // Core Logic
  // --------------------------------------------------
  getClass(e = {}) {
    const t = e.reversed ?? !1;
    this.entries.length > 100 && g.error("CjsKeyFrame cannot have more than 100 entries");
    const s = document.head.querySelector(
      `[id="${H}"]`
    );
    if (!s)
      throw new Error("Keyframes style element not found");
    const n = t ? [...this.entries].reverse() : this.entries, a = n.length === 1, c = 100 / Math.max(n.length - 1, 1), i = `{
${n.map((b, T) => {
      const oe = a ? 100 : T * c, ae = Object.entries(b).map(([ce, le]) => `${ce}: ${le};`).join(" ");
      return `    ${oe}% { ${ae} }`;
    }).join(`
`)}
}`, l = x.getHash(i), u = ee.find((b) => b.hash === l);
    let h;
    if (u)
      h = u.animation;
    else {
      h = `${me}${x.getRandom(16)}`;
      const b = `@keyframes ${h} ${i}`;
      s.innerHTML += `
${b}`, ee.push({
        hash: l,
        animation: h
      });
    }
    const d = n[n.length - 1], f = this.isImportant ? " !important" : "", p = Object.entries(d).map(([b, T]) => `${b}: ${T};`).join(" "), C = [`animation: ${h} ${this.duration / 1e3}s ${this.timingFunction}${f}`];
    this.keepEndingEntryStyle && C.push(p);
    const y = `{ ${C.join("; ")} }`, S = x.getHash(`${this.selector}-${y}`), j = te.find((b) => b.hash === S);
    if (j)
      return j.class;
    const R = `${h}-${S}`, O = `.${R} ${this.selector} ${y}`;
    return s.innerHTML += `
${O}`, te.push({
      hash: S,
      class: R
    }), R;
  }
}
class ke extends q {
  constructor() {
    super(), this.attribute = "scale", this.animationTime = 350, this.scales = {
      start: 0.85,
      end: 1
    }, this.keyframe = new N().setDuration(this.animationTime).addEntry({ transform: `scale(${this.scales.start})` }).addEntry({ transform: `scale(${this.scales.end})` });
  }
  handleTouch(e, t) {
    if (e.hasAttribute("disabled")) return;
    const s = this.keyframe.getClass({
      reversed: t
    }), n = t ? this.scales.start : this.scales.end;
    e.classList.add(s), e.style.transform = `scale(${n})`, setTimeout(() => {
      e.classList.remove(s), t || (e.style.transform = "");
    }, this.animationTime);
  }
  applyEvents(e) {
    e.__scaleAttached || (e.addEventListener("touchstart", () => {
      this.handleTouch(e, !0);
    }), e.addEventListener("touchend", () => {
      this.handleTouch(e, !1);
    }), e.__scaleAttached = !0);
  }
  enable() {
    document.querySelectorAll(`[${this.attribute}]`).forEach((s) => this.applyEvents(s)), new MutationObserver((s) => {
      const n = s.filter((a) => a.type === "childList").flatMap((a) => Array.from(a.addedNodes)).filter(
        (a) => a instanceof HTMLElement
      ).flatMap((a) => [
        a,
        ...Array.from(a.querySelectorAll("*"))
      ]).filter((a) => a.hasAttribute(this.attribute));
      for (const a of n)
        this.applyEvents(a);
    }).observe(document.documentElement, {
      childList: !0,
      subtree: !0
    });
  }
}
const Ee = {
  /**
   * Creates a delay (sleep)
   */
  sleep(r) {
    return new Promise((e) => {
      setTimeout(e, r);
    });
  }
};
class $e extends q {
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
    const e = "dark", t = "light";
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
        `background: ${this.themes[e].backgroundColor};`,
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
        `color: ${this.themes[t].backgroundColor};`,
        "margin: 0;",
        "font-size: 16px;",
        "display: -webkit-box;",
        "-webkit-line-clamp: 1;",
        "-webkit-box-orient: vertical;",
        "overflow: hidden;"
      ],
      [`#${this.containerId}.container > .notification > .icon`]: [
        "--size: 22px;",
        "width: var(--size);",
        "height: var(--size);"
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
    const e = A.HTMLToElement(`
            <div id="${this.containerId}" class="container"></div>
        `);
    return document.body.appendChild(e), e;
  }
  createNotification(e, t) {
    const s = document.getElementById(this.containerId) ?? this.createContainer(), n = {
      success: '<svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark1</title> <path d="M21.82 13.030l-1.002-1.002c-0.185-0.185-0.484-0.185-0.668 0l-6.014 6.013-2.859-2.882c-0.186-0.185-0.484-0.185-0.67 0l-1.002 1.003c-0.185 0.185-0.185 0.484 0 0.668l4.193 4.223c0.185 0.184 0.484 0.184 0.668 0l7.354-7.354c0.186-0.185 0.186-0.484 0-0.669zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM16 26c-5.522 0-10-4.478-10-10 0-5.523 4.478-10 10-10 5.523 0 10 4.477 10 10 0 5.522-4.477 10-10 10z"></path> </g></svg>',
      error: '<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>error</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#ffffff" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.232,42.6666667 42.6666667,119.232 42.6666667,213.333333 C42.6666667,307.434667 119.232,384 213.333333,384 C307.434667,384 384,307.434667 384,213.333333 C384,119.232 307.434667,42.6666667 213.333333,42.6666667 Z M262.250667,134.250667 L292.416,164.416 L243.498667,213.333333 L292.416,262.250667 L262.250667,292.416 L213.333333,243.498667 L164.416,292.416 L134.250667,262.250667 L183.168,213.333333 L134.250667,164.416 L164.416,134.250667 L213.333333,183.168 L262.250667,134.250667 Z" id="error"> </path> </g> </g> </g></svg>',
      info: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"></path> </g></svg>',
      warning: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#ffffff"></path></g></svg>'
    }, a = A.HTMLToElement(`
            <div class="notification ${t}">
                <div class="icon">
                    ${n[t]}
                </div>
                <p>${e}</p>
            </div>
        `);
    s.appendChild(a), Ee.sleep(this.keyframe.duration).then(() => a.remove());
  }
  info(e) {
    this.createNotification(e, "info");
  }
  error(e) {
    this.createNotification(e, "error");
  }
  warning(e) {
    this.createNotification(e, "warning");
  }
  success(e) {
    this.createNotification(e, "success");
  }
  enable() {
    this.addStyles();
  }
}
class Le extends q {
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
const xe = new ve(), _e = new $e(), Ae = new ke(), je = new Le(), st = {
  /**
   * Enables selected plugins
   */
  enable(r = {}) {
    const e = {
      ripple: xe,
      notification: _e,
      scaleClick: Ae,
      scaleHover: je
    };
    for (const t of Object.keys(e))
      r[t] && e[t].enable();
  }
};
class Re {
  /**
   * Simple translateX animation
   */
  x(e, t = 500) {
    return new N().setDuration(t).addEntry({ transform: `translateX(${e}px)` }).addEntry({ transform: "translateX(0)" }).getClass();
  }
  /**
   * Simple translateY animation
   */
  y(e, t = 500) {
    return new N().setDuration(t).addEntry({ transform: `translateY(${e}px)` }).addEntry({ transform: "translateY(0)" }).getClass();
  }
  /**
   * Simple scale animation
   */
  scale(e, t = 500) {
    return new N().setDuration(t).addEntry({ transform: `scale(${e})` }).addEntry({ transform: "scale(1)" }).getClass();
  }
  /**
   * Adds temporary class to element and removes it after timeout
   */
  tempClass(e, t, s = 500) {
    e && (e.classList.add(t), setTimeout(() => {
      e.classList.remove(t);
    }, s));
  }
}
const nt = new Re(), Oe = {
  /**
   * Returns parsed path that does not start with `./` or `/`
   */
  toFixedPath(r) {
    return r.startsWith("./") ? r.slice(2) : r.startsWith("/") ? r.slice(1) : r;
  }
};
function B(r) {
  return `src/assets/${Oe.toFixedPath(r)}`;
}
function rt(r) {
  return B(`svg/${r}.svg`);
}
function it(r) {
  return B(`images/${r}.png`);
}
function ot(r) {
  return B(`images/${r}.jpg`);
}
function at(r) {
  return B(`gif/${r}.gif`);
}
const ct = {
  async download(r, e = null) {
    try {
      const t = await fetch(r);
      if (!t.ok)
        return g.error(`Couldn't download file: ${t.statusText}`, t);
      const s = await t.blob();
      se(s, e ?? r.split("/").pop());
    } catch (t) {
      return g.error("Couldn't fetch file", t);
    }
  },
  async downloadFile(r, e, t = null) {
    try {
      const s = new Blob([r], { type: e }), n = e.split("/").pop() ?? "file", a = t ?? `${n}.${n}`;
      se(s, a);
    } catch (s) {
      g.error("Couldn't create download file", s);
    }
  }
};
function se(r, e) {
  if (typeof document > "u") return;
  const t = document.createElement("a");
  t.href = URL.createObjectURL(r), t.download = e ?? "download", document.body.appendChild(t), t.click(), document.body.removeChild(t), URL.revokeObjectURL(t.href);
}
const _ = {
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
  _.mouse.up = !1, _.mouse.down = !0, _.mouse.state = "down";
});
window.addEventListener("mouseup", () => {
  _.mouse.up = !0, _.mouse.down = !1, _.mouse.state = "up";
});
window.addEventListener("DOMContentLoaded", () => {
  _.window.DOMContentLoaded = !0;
});
function lt(r) {
  return r;
}
const ut = {
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
}, ht = new class {
  // ------------------------
  // Constructor
  // ------------------------
  constructor() {
    this.#e = "cjs-debug/Search", this.#t = !0, this.#s = !0, this.#i = "cjsSearch", this.#r = [], this._mode = "query", this.length = 0, this.search = "", this.search = "", window.addEventListener("popstate", () => {
      const e = new URL(window.location.href), t = this._mode === "query" ? e.searchParams.get("path") : e.pathname.replace(/^\/|\/$/g, "");
      t && this.set(t);
    });
  }
  #e;
  #t;
  #s;
  #i;
  #r;
  // ------------------------
  // Private Helpers
  // ------------------------
  #c(e) {
    return new URL(e).pathname.substring(1);
  }
  #n(e) {
    return e ? (e.charAt(0) === "/" && (e = e.slice(1)), e.charAt(e.length - 1) === "/" && (e = e.slice(0, -1)), e) : "";
  }
  #o() {
    ({
      query: () => {
        const t = new URL(window.location.href);
        t.searchParams.set("path", this.search), history.pushState({}, "", t);
      },
      path: () => {
        history.pushState(null, "", `/${this.search}`);
      }
    })[this._mode](), window.dispatchEvent(new Event("popstate"));
  }
  #a() {
    const e = A.HTMLToElement(`
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
    return document.body && document.body.appendChild(e), e;
  }
  // ------------------------
  // Public API
  // ------------------------
  setMode(e) {
    this._mode = e;
  }
  setDisplayedOnScreen(e) {
    return this.#t = e, this;
  }
  onChange(e) {
    return this.#r.push(e), this;
  }
  set(e, t = !1) {
    const s = this.#n(e);
    return this.search === s && !t ? this : (this.search = s, this.update(), this);
  }
  setQuiet(e) {
    return this.search = this.#n(e), this.update(!0), this;
  }
  update(e = !1) {
    localStorage.setItem(this.#i, this.search);
    const t = this.search.split("/").filter((s) => s.trim() !== "");
    if (this.length = t.length, e || this.#r.forEach(
      (s) => s({
        search: this.search,
        parts: t,
        length: this.length
      })
    ), this.#t) {
      const a = (document.getElementById(this.#e) ?? this.#a()).querySelector("p:nth-child(2)");
      a && (a.innerHTML = `/${this.search}`);
    }
    this.#s && this.#o();
  }
  equals(e) {
    return e === this.search ? !0 : this.search === this.#n(e);
  }
  startsWith(e) {
    return this.search.startsWith(this.#n(e));
  }
  slice(e, t = null) {
    const s = this.search.split("/").filter((n) => n.trim() !== "");
    return t === null ? s.slice(e).join("/") : s.slice(e, t).join("/");
  }
  get(e) {
    const t = this.search.split("/");
    return e > t.length - 1 ? (g.error("Provided index is too high"), null) : t[e];
  }
  add(e) {
    const t = e.replace(/\//g, "");
    return this.search += this.search.trim().length === 0 ? t : `/${t}`, this.update(), this;
  }
  remove(e) {
    const t = this.search.split("/");
    if (e > t.length - 1)
      return g.error("Provided index is too high"), this;
    const n = t.slice(0, t.length - e);
    return this.search = n.join("/"), this.update(), this;
  }
}();
function ft(r, e) {
  return Array.isArray(r) ? r.map(e).join("") : (g.error("The provided argument in strmap is not an array", r), "");
}
function mt(r, e) {
  return r ? e : "";
}
function pt(r, e) {
  if (!r || r.length <= e) return r;
  const s = e - 3;
  return s <= 0 ? "..." : r.substring(0, s) + "...";
}
function gt(r, e) {
  return r == null || r.trim() === "" ? e : r;
}
const yt = {
  /**
   * Checks if provided string is a valid email
   */
  isEmail(r) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r);
  }
};
class Ct {
  constructor() {
    this.webSocket = null, this.captures = /* @__PURE__ */ new Map(), this.isOpened = !1, this.waitingSendRequests = [];
  }
  /**
   * Connects to WebSocket
   */
  connect(e) {
    return this.webSocket = new WebSocket(e), this.webSocket.onopen = () => {
      this.isOpened = !0, this.waitingSendRequests.forEach((t) => {
        this.webSocket?.send(t);
      }), this.waitingSendRequests = [];
    }, this.webSocket.onmessage = (t) => {
      for (const s of this.captures.values())
        s(t);
    }, this.webSocket.onclose = () => {
      this.isOpened = !1;
    }, this;
  }
  /**
   * Sends raw data to WebSocket
   */
  send(e) {
    return !this.isOpened || !this.webSocket ? (this.waitingSendRequests.push(e), this) : (this.webSocket.send(e), this);
  }
  /**
   * Sends JSON data (auto stringified)
   */
  sendJson(e) {
    return this.send(JSON.stringify(e));
  }
  /**
   * Creates a capture.
   * When any message is received — the callback executes.
   *
   * @returns capture id
   */
  createCapture(e) {
    const t = x.getRandom(16);
    return this.captures.set(t, e), t;
  }
  /**
   * Removes capture
   */
  removeCapture(e) {
    return this.captures.delete(e), this;
  }
  /**
   * Checks if capture exists
   */
  hasCapture(e) {
    return this.captures.has(e);
  }
  /**
   * Closes websocket safely
   */
  close(e, t) {
    this.webSocket?.close(e, t), this.webSocket = null, this.isOpened = !1;
  }
}
const bt = {
  /**
   * Opens a url within a new tab / target
   */
  open(r, e = "_blank") {
    if (typeof document > "u") return;
    const t = document.createElement("a");
    t.href = r, t.target = e, t.style.display = "none", document.body.appendChild(t), t.click(), t.remove();
  }
}, ne = new class {
  constructor() {
    this.callback = (e) => {
      this.processForms();
      const s = e.filter((n) => n.type === "childList").filter((n) => n.type === "childList").flatMap((n) => Array.from(n.addedNodes)).filter((n) => n.nodeType === 1).flatMap((n) => [
        n,
        ...Array.from(n.querySelectorAll("*"))
      ]);
      for (const n of s)
        this.processElementEvents(n);
    }, this.#e = new MutationObserver(this.callback);
  }
  #e;
  #t(e, t) {
    if (!$.hasCallback(e)) return;
    const s = $.getCallback(e);
    (s.applyToWindow ? window : t).addEventListener(
      s.eventName,
      (a) => s.callback({ event: a, source: t })
    );
  }
  #s(e, t) {
    if (!$.hasOnAddElementCallback(e)) return;
    $.getOnAddElementCallback(e).callback({ event: null, source: t });
  }
  processForms() {
    document.body.querySelectorAll("form").forEach((e) => {
      e.onsubmit = (t) => t.preventDefault();
    });
  }
  processElementEvents(e) {
    const t = A.getAttributesStartingWith(
      e,
      P
    );
    if (t.length !== 0)
      for (const s of t) {
        const n = Array.from(document.body.querySelectorAll(`[${s}]`)), a = s.replace(P, "");
        for (const c of n)
          c.removeAttribute(s), this.#t(a, c), this.#s(a, c);
      }
  }
  observe() {
    this.#e.observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
}();
function Te(r) {
  const e = document.body.querySelector(K);
  if (!e)
    return document.body.appendChild(document.createElement(K)), Te(r);
  ie.create(), e.innerHTML = "", ne.observe();
  for (const t of r.visualise())
    e.appendChild(t), Array.from(t.querySelectorAll("*")).forEach((s) => {
      ne.processElementEvents(s);
    });
}
export {
  nt as CjsAnimation,
  U as CjsComponent,
  ct as CjsDownload,
  _ as CjsGlobals,
  N as CjsKeyFrame,
  V as CjsLayout,
  ut as CjsMobile,
  _e as CjsNotification,
  k as CjsObjectUtil,
  st as CjsPluginManager,
  we as CjsRequest,
  tt as CjsRequests,
  ht as CjsSearch,
  x as CjsStringUtil,
  Ee as CjsTimings,
  yt as CjsValidator,
  Ct as CjsWebSocket,
  bt as CjsWindow,
  B as asset,
  lt as createHandle,
  at as gif,
  Te as init,
  ot as jpg,
  Fe as onChange,
  Xe as onClick,
  Ue as onDoubleClick,
  Ne as onEscape,
  Ve as onFocus,
  ze as onFocusOut,
  Pe as onHoldDown,
  We as onInput,
  E as onLoad,
  Ke as onMouseEnter,
  Ge as onMouseLeave,
  Je as onMouseMove,
  Ie as onOuterclick,
  Ze as onResize,
  Qe as onScroll,
  He as onScrollBottom,
  qe as onSlideDown,
  Be as onSlideLeft,
  Ye as onSlideRight,
  De as onSlideUp,
  et as onTouchMove,
  it as png,
  mt as strif,
  ft as strmap,
  pt as strmax,
  gt as stror,
  rt as svg
};
//# sourceMappingURL=cjs.mjs.map
