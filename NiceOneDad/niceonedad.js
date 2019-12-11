// --------------------------------------
//
//    _  _ _/ .  _  _/ /_ _  _  _
//   /_|/_ / /|//_  / / //_ /_// /_/
//   http://activetheory.net     _/
//
// --------------------------------------
//   8/5/15 19:19
// --------------------------------------

window.Global = new Object();
window.getURL = function(a, b) {
    if (!b) {
        b = "_blank"
    }
    window.open(a, b)
}
;
if (typeof (console) === "undefined") {
    window.console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = function() {}
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b, a) {
                window.setTimeout(b, 1000 / 60)
            }
        }
    )()
}
Date.now = Date.now || function() {
    return +new Date
}
;
window.Class = function(b, c) {
    var e = this || window;
    var d = b.toString();
    var a = d.match(/function ([^\(]+)/)[1];
    c = (c || "").toLowerCase();
    b.prototype.__call = function() {
        if (this.events) {
            this.events.scope(this)
        }
    }
    ;
    if (!c) {
        e[a] = b
    } else {
        if (c == "static") {
            e[a] = new b()
        } else {
            if (c == "singleton") {
                e[a] = (function() {
                        var g = new Object();
                        var f;
                        g.instance = function() {
                            if (!f) {
                                f = new b()
                            }
                            return f
                        }
                        ;
                        return g
                    }
                )()
            }
        }
    }
}
;
window.Inherit = function(f, a, d) {
    if (typeof d === "undefined") {
        d = f
    }
    var c = new a(d);
    var b = {};
    for (var e in c) {
        f[e] = c[e];
        b[e] = c[e]
    }
    if (f.__call) {
        f.__call()
    }
    Render.nextFrame(function() {
        for (e in c) {
            if ((f[e] && b[e]) && f[e] !== b[e]) {
                f["_" + e] = b[e]
            }
        }
        c = b = null
    })
}
;
window.Interface = function(b, a) {
    Render.nextFrame(function() {
        var c = new a();
        for (var e in c) {
            if (typeof b[e] === "undefined") {
                throw "Interface Error: Missing Property: " + e + " ::: " + a
            } else {
                var d = typeof c[e];
                if (typeof b[e] != d) {
                    throw "Interface Error: Property " + e + " is Incorrect Type ::: " + a
                }
            }
        }
        c = null
    })
}
;
window.Namespace = function(b, a) {
    if (!a) {
        window[b] = {
            Class: window.Class
        }
    } else {
        a.Class = window.Class
    }
}
;
Class(function HydraObject(c, d, b, g) {
    var f = this;
    var h;
    this._events = {};
    this._children = new LinkedList();
    this.__useFragment = g;
    (function() {
            e()
        }
    )();
    function e() {
        if (c && typeof c !== "string") {
            f.div = c
        } else {
            var k = c ? c.charAt(0) : null;
            var j = c ? c.slice(1) : null;
            if (k != "." && k != "#") {
                j = c;
                k = "."
            }
            if (!b) {
                f._type = d || "div";
                f.div = document.createElement(f._type);
                if (k) {
                    if (k == "#") {
                        f.div.id = j
                    } else {
                        f.div.className = j
                    }
                }
            } else {
                if (k != "#") {
                    throw "Hydra Selectors Require #ID"
                }
                f.div = document.getElementById(j)
            }
        }
        f.div.hydraObject = f
    }
    function i(l, j, k) {
        if (l[k == "." ? "className" : "id"] == j) {
            return l
        }
        return false
    }
    function a() {
        if (!h) {
            return false
        }
        f.div.appendChild(h);
        h = null
    }
    this.addChild = this.add = function(k) {
        var j = this.div;
        if (this.__useFragment) {
            if (!h) {
                h = document.createDocumentFragment();
                Render.nextFrame(a)
            }
            j = h
        }
        if (k.element && k.element instanceof HydraObject) {
            j.appendChild(k.element.div);
            this._children.push(k.element);
            k.element._parent = this
        } else {
            if (k.container && k.container instanceof HydraObject) {
                j.appendChild(k.container.div);
                this._children.push(k.container);
                k.container._parent = this
            } else {
                if (k.div) {
                    j.appendChild(k.div);
                    this._children.push(k);
                    k._parent = this
                } else {
                    if (k.nodeName) {
                        j.appendChild(k)
                    }
                }
            }
        }
        return this
    }
    ;
    this.clone = function() {
        return $(this.div.cloneNode(true))
    }
    ;
    this.create = function(j, k) {
        var l = $(j, k);
        this.addChild(l);
        return l
    }
    ;
    this.empty = function() {
        var j = this._children.start();
        while (j) {
            if (j && j.remove) {
                j.remove()
            }
            j = this._children.next()
        }
        this.div.innerHTML = "";
        return this
    }
    ;
    this.parent = function() {
        return this._parent
    }
    ;
    this.children = function() {
        return this.div.children ? this.div.children : this.div.childNodes
    }
    ;
    this.removeChild = function(k, j) {
        if (!j) {
            try {
                this.div.removeChild(k.div)
            } catch (l) {}
        }
        this._children.remove(k)
    }
    ;
    this.remove = function(l) {
        this.stopTween();
        var j = this._parent;
        if (j && j.removeChild) {
            j.removeChild(this)
        }
        if (!l) {
            var k = this._children.start();
            while (k) {
                if (k && k.remove) {
                    k.remove()
                }
                k = this._children.next()
            }
            this._children.empty();
            Utils.nullObject(this)
        }
    }
});
Class(function Hydra() {
    var f = this;
    var d, b;
    var e = new Array();
    this.READY = false;
    (function() {
            a()
        }
    )();
    function a() {
        if (!document || !window) {
            return setTimeout(a, 1)
        }
        if (window._NODE_) {
            return setTimeout(c, 1)
        }
        if (window.addEventListener) {
            f.addEvent = "addEventListener";
            f.removeEvent = "removeEventListener";
            window.addEventListener("load", c, false)
        } else {
            f.addEvent = "attachEvent";
            f.removeEvent = "detachEvent";
            window.attachEvent("onload", c)
        }
    }
    function c() {
        if (window.removeEventListener) {
            window.removeEventListener("load", c, false)
        }
        for (var g = 0; g < e.length; g++) {
            e[g]()
        }
        e = null;
        f.READY = true;
        if (window.Main) {
            Hydra.Main = new window.Main()
        }
    }
    this.development = function(g) {
        if (!g) {
            clearInterval(d)
        } else {
            d = setInterval(function() {
                for (var k in window) {
                    if (k.strpos("webkit")) {
                        continue
                    }
                    var j = window[k];
                    if (typeof j !== "function" && k.length > 2) {
                        if (k.strpos("_ga") || k.strpos("_typeface_js")) {
                            continue
                        }
                        var i = k.charAt(0);
                        var h = k.charAt(1);
                        if (i == "_" || i == "$") {
                            if (h !== h.toUpperCase()) {
                                throw "Hydra Warning:: " + k + " leaking into global scope"
                            }
                        }
                    }
                }
            }, 1000)
        }
    }
    ;
    this.ready = function(g) {
        if (this.READY) {
            return g()
        }
        e.push(g)
    }
    ;
    this.$ = function(g, h, i) {
        return new HydraObject(g,h,i)
    }
    ;
    this.HTML = {};
    this.SHADERS = {};
    this.JSON = {};
    this.$.fn = HydraObject.prototype;
    window.$ = this.$
}, "Static");
Hydra.ready(function() {
    window.__window = $(window);
    window.__document = $(document);
    window.__body = $(document.getElementsByTagName("body")[0]);
    window.Stage = __body.create("#Stage");
    Stage.size("100%");
    Stage.__useFragment = true;
    Stage.width = window.innerWidth || document.documentElement.offsetWidth;
    Stage.height = window.innerHeight || document.documentElement.offsetHeight;
    (function() {
            var b = Date.now();
            var a;
            setTimeout(function() {
                var g = ["hidden", "msHidden", "webkitHidden"];
                var f, e;
                (function() {
                        for (var h in g) {
                            if (document[g[h]] !== "undefined") {
                                f = g[h];
                                switch (f) {
                                    case "hidden":
                                        e = "visibilitychange";
                                        break;
                                    case "msHidden":
                                        e = "msvisibilitychange";
                                        break;
                                    case "webkitHidden":
                                        e = "webkitvisibilitychange";
                                        break
                                }
                                return
                            }
                        }
                    }
                )();
                if (typeof document[f] === "undefined") {
                    if (Device.browser.ie) {
                        document.onfocus = c;
                        document.onblur = d
                    } else {
                        window.onfocus = c;
                        window.onblur = d
                    }
                } else {
                    document.addEventListener(e, function() {
                        var h = Date.now();
                        if (h - b > 10) {
                            if (document[f] === false) {
                                c()
                            } else {
                                d()
                            }
                        }
                        b = h
                    })
                }
            }, 250);
            function c() {
                if (a != "focus") {
                    HydraEvents._fireEvent(HydraEvents.BROWSER_FOCUS, {
                        type: "focus"
                    })
                }
                a = "focus"
            }
            function d() {
                if (a != "blur") {
                    HydraEvents._fireEvent(HydraEvents.BROWSER_FOCUS, {
                        type: "blur"
                    })
                }
                a = "blur"
            }
        }
    )();
    window.onresize = function() {
        if (!Device.mobile) {
            Stage.width = window.innerWidth || document.documentElement.offsetWidth;
            Stage.height = window.innerHeight || document.documentElement.offsetHeight;
            HydraEvents._fireEvent(HydraEvents.RESIZE)
        }
    }
});
Class(function MVC() {
    Inherit(this, Events);
    var a = {};
    this.classes = {};
    function b(d, c) {
        a[c] = {};
        Object.defineProperty(d, c, {
            set: function(e) {
                if (a[c]) {
                    a[c].s.apply(d, [e])
                }
            },
            get: function() {
                if (a[c]) {
                    return a[c].g.apply(d)
                }
            }
        })
    }
    this.set = function(d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].s = c
    }
    ;
    this.get = function(d, c) {
        if (!a[d]) {
            b(this, d)
        }
        a[d].g = c
    }
    ;
    this.delayedCall = function(f, c, d) {
        var e = this;
        return setTimeout(function() {
            if (e.destroy) {
                f.apply(e, [d])
            }
        }, c || 0)
    }
    ;
    this.initClass = function(m, p, o, n, l, k, j, i) {
        var h = Utils.timestamp();
        this.classes[h] = new m(p,o,n,l,k,j,i);
        this.classes[h].parent = this;
        this.classes[h].__id = h;
        if (this.element && arguments[arguments.length - 1] !== null) {
            this.element.addChild(this.classes[h])
        }
        return this.classes[h]
    }
    ;
    this.destroy = function() {
        if (this.container) {
            Global[this.container.div.id.toUpperCase()] = null
        }
        for (var d in this.classes) {
            var c = this.classes[d];
            if (c.destroy) {
                c.destroy()
            }
        }
        this.classes = null;
        if (this.events) {
            this.events = this.events.destroy()
        }
        if (this.element && this.element.remove) {
            this.element = this.container = this.element.remove()
        }
        if (this.parent && this.parent.__destroyChild) {
            this.parent.__destroyChild(this.__id)
        }
        return Utils.nullObject(this)
    }
    ;
    this.__destroyChild = function(c) {
        this.classes[c] = null;
        delete this.classes[c]
    }
});
Class(function Model(a) {
    Inherit(this, MVC);
    Global[a.constructor.toString().match(/function ([^\(]+)/)[1].toUpperCase()] = {};
    this.__call = function() {
        this.events.scope(this);
        delete this.__call
    }
});
Class(function View(a) {
    Inherit(this, MVC);
    this.element = $("." + a.constructor.toString().match(/function ([^\(]+)/)[1]);
    this.element.__useFragment = true;
    this.css = function(b) {
        this.element.css(b);
        return this
    }
    ;
    this.transform = function(b) {
        this.element.transform(b || this);
        return this
    }
    ;
    this.tween = function(d, e, f, b, g, c) {
        return this.element.tween(d, e, f, b, g, c)
    }
});
Class(function Controller(a) {
    Inherit(this, MVC);
    a = a.constructor.toString().match(/function ([^\(]+)/)[1];
    this.element = this.container = $("#" + a);
    this.element.__useFragment = true;
    Global[a.toUpperCase()] = {};
    this.css = function(b) {
        this.container.css(b)
    }
});
Class(function Component() {
    Inherit(this, MVC);
    this.__call = function() {
        this.events.scope(this);
        delete this.__call
    }
});
Class(function Utils() {
    var d = this;
    if (typeof Float32Array == "undefined") {
        Float32Array = Array
    }
    function a(e) {
        e = parseInt(e, 10);
        if (isNaN(e)) {
            return "00"
        }
        e = Math.max(0, Math.min(e, 255));
        return "0123456789ABCDEF".charAt((e - e % 16) / 16) + "0123456789ABCDEF".charAt(e % 16)
    }
    function c(f, e) {
        return b(Math.random(), f, e)
    }
    function b(f, g, e) {
        return g + (e - g) * f
    }
    this.doRandom = function(f, e) {
        return Math.round(c(f - 0.5, e + 0.5))
    }
    ;
    this.headsTails = function(f, g) {
        var e = d.doRandom(0, 1);
        if (!e) {
            return f
        } else {
            return g
        }
    }
    ;
    this.toDegrees = function(e) {
        return e * (180 / Math.PI)
    }
    ;
    this.toRadians = function(e) {
        return e * (Math.PI / 180)
    }
    ;
    this.findDistance = function(h, g) {
        var f = g.x - h.x;
        var e = g.y - h.y;
        return Math.sqrt(f * f + e * e)
    }
    ;
    this.timestamp = function() {
        var e = Date.now() + d.doRandom(0, 99999);
        return e.toString()
    }
    ;
    this.rgbToHex = function(f, e, g) {
        return a(f) + a(e) + a(g)
    }
    ;
    this.hexToRGB = function(f) {
        var e = [];
        f.replace(/(..)/g, function(g) {
            e.push(parseInt(g, 16))
        });
        return e
    }
    ;
    this.getBackground = function(f) {
        var e = f.css("backgroundImage");
        if (e.length) {
            e = e.replace('("', "(");
            e = e.replace('")', ")");
            e = e.split("(");
            e = e[1].slice(0, -1)
        }
        return e
    }
    ;
    this.hitTestObject = function(k, j) {
        var f = k.x
            , o = k.y
            , p = k.width
            , l = k.height;
        var s = j.x
            , i = j.y
            , n = j.width
            , r = j.height;
        var e = f + p
            , m = o + l
            , q = s + n
            , g = i + r;
        if (s >= f && s <= e) {
            if (i >= o && i <= m) {
                return true
            } else {
                if (o >= i && o <= g) {
                    return true
                }
            }
        } else {
            if (f >= s && f <= q) {
                if (i >= o && i <= m) {
                    return true
                } else {
                    if (o >= i && o <= g) {
                        return true
                    }
                }
            }
        }
        return false
    }
    ;
    this.randomColor = function() {
        var e = "#" + Math.floor(Math.random() * 16777215).toString(16);
        if (e.length < 7) {
            e = this.randomColor()
        }
        return e
    }
    ;
    this.touchEvent = function(g) {
        var f = {};
        f.x = 0;
        f.y = 0;
        if (!g) {
            return f
        }
        if (g.touches || g.changedTouches) {
            if (g.changedTouches.length) {
                f.x = g.changedTouches[0].pageX;
                f.y = g.changedTouches[0].pageY
            } else {
                f.x = g.touches[0].pageX;
                f.y = g.touches[0].pageY
            }
        } else {
            f.x = g.pageX;
            f.y = g.pageY
        }
        return f
    }
    ;
    this.clamp = function(f, g, e) {
        return Math.min(Math.max(f, g), e)
    }
    ;
    this.nullObject = function(e) {
        if (e.destroy) {
            for (var f in e) {
                if (typeof e[f] !== "undefined") {
                    e[f] = null
                }
            }
        }
        return null
    }
    ;
    this.convertRange = function(f, i, g, k, h) {
        var j = (g - i);
        var e = (h - k);
        return (((f - i) * e) / j) + k
    }
    ;
    String.prototype.strpos = function(e) {
        return this.indexOf(e) != -1
    }
    ;
    String.prototype.clip = function(f, e) {
        return this.length > f ? this.slice(0, f) + e : this
    }
    ;
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }
}, "Static");
(function() {
        $.fn.text = function(a) {
            if (typeof a !== "undefined") {
                this.div.textContent = a;
                return this
            } else {
                return this.div.textContent
            }
        }
        ;
        $.fn.html = function(a) {
            if (typeof a !== "undefined") {
                this.div.innerHTML = a;
                return this
            } else {
                return this.div.innerHTML
            }
        }
        ;
        $.fn.hide = function() {
            this.div.style.display = "none";
            return this
        }
        ;
        $.fn.show = function() {
            this.div.style.display = "block";
            return this
        }
        ;
        $.fn.visible = function() {
            this.div.style.visibility = "visible";
            return this
        }
        ;
        $.fn.invisible = function() {
            this.div.style.visibility = "hidden";
            return this
        }
        ;
        $.fn.setZ = function(a) {
            this.div.style.zIndex = a;
            return this
        }
        ;
        $.fn.clearAlpha = function() {
            this.div.style.opacity = "";
            return this
        }
        ;
        $.fn.size = function(a, b, c) {
            if (typeof a === "string") {
                if (typeof b === "undefined") {
                    b = "100%"
                } else {
                    if (typeof b !== "string") {
                        b = b + "px"
                    }
                }
                this.div.style.width = a;
                this.div.style.height = b
            } else {
                this.div.style.width = a + "px";
                this.div.style.height = b + "px";
                if (!c) {
                    this.div.style.backgroundSize = a + "px " + b + "px"
                }
            }
            this.width = a;
            this.height = b;
            return this
        }
        ;
        $.fn.retinaSize = function(a, b) {
            if (typeof a === "string") {
                this.div.style.backgroundSize = a + " " + b
            } else {
                this.div.style.backgroundSize = a + "px " + b + "px"
            }
            return this
        }
        ;
        $.fn.mouseEnabled = function(a) {
            this.div.style.pointerEvents = a ? "auto" : "none";
            return this
        }
        ;
        $.fn.fontStyle = function(e, c, b, d) {
            var a = new Object();
            if (e) {
                a.fontFamily = e
            }
            if (c) {
                a.fontSize = c
            }
            if (b) {
                a.color = b
            }
            if (d) {
                a.fontStyle = d
            }
            this.css(a);
            return this
        }
        ;
        $.fn.bg = function(c, a, d, b) {
            if (!c) {
                return this
            }
            if (!c.strpos(".")) {
                this.div.style.backgroundColor = c
            } else {
                this.div.style.backgroundImage = "url(" + c + ")"
            }
            if (typeof a !== "undefined") {
                a = typeof a == "number" ? a + "px" : a;
                d = typeof d == "number" ? d + "px" : d;
                this.div.style.backgroundPosition = a + " " + d
            }
            if (b) {
                this.div.style.backgroundSize = "";
                this.div.style.backgroundRepeat = b
            }
            return this
        }
        ;
        $.fn.center = function(a, c) {
            var b = {};
            if (typeof a === "undefined") {
                b.left = "50%";
                b.top = "50%";
                b.marginLeft = -this.width / 2;
                b.marginTop = -this.height / 2
            } else {
                if (a) {
                    b.left = "50%";
                    b.marginLeft = -this.width / 2
                }
                if (c) {
                    b.top = "50%";
                    b.marginTop = -this.height / 2
                }
            }
            this.css(b);
            return this
        }
        ;
        $.fn.mask = function(b, a, e, c, d) {
            this.div.style[Device.styles.vendor + "Mask"] = (b.strpos(".") ? "url(" + b + ")" : b) + " no-repeat";
            return this
        }
        ;
        $.fn.css = function(d, c) {
            if (typeof c == "boolean") {
                skip = c;
                c = null
            }
            if (typeof d !== "object") {
                if (!c) {
                    var b = this.div.style[d];
                    if (typeof b !== "number") {
                        if (b.strpos("px")) {
                            b = Number(b.slice(0, -2))
                        }
                        if (d == "opacity") {
                            b = 1
                        }
                    }
                    if (!b) {
                        b = 0
                    }
                    return b
                } else {
                    this.div.style[d] = c;
                    return this
                }
            }
            TweenManager.clearCSSTween(this);
            for (var a in d) {
                var e = d[a];
                if (!(typeof e === "string" || typeof e === "number")) {
                    continue
                }
                if (typeof e !== "string" && a != "opacity" && a != "zIndex") {
                    e += "px"
                }
                this.div.style[a] = e
            }
            return this
        }
    }
)();
Class(function CSS() {
    var g = this;
    var f, b, a;
    Hydra.ready(function() {
        b = "";
        f = document.createElement("style");
        f.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(f)
    });
    function d(j) {
        var i = j.match(/[A-Z]/);
        var k = i ? i.index : null;
        if (k) {
            var l = j.slice(0, k);
            var h = j.slice(k);
            j = l + "-" + h.toLowerCase()
        }
        return j
    }
    function e(j) {
        var i = j.match(/\-/);
        var l = i ? i.index : null;
        if (l) {
            var m = j.slice(0, l);
            var h = j.slice(l).slice(1);
            var k = h.charAt(0);
            h = h.slice(1);
            h = k.toUpperCase() + h;
            j = m + h
        }
        return j
    }
    function c() {
        f.innerHTML = b;
        a = false
    }
    this._read = function() {
        return b
    }
    ;
    this._write = function(h) {
        b = h;
        if (!a) {
            a = true;
            Render.nextFrame(c)
        }
    }
    ;
    this._toCSS = d;
    this.style = function(h, k) {
        var j = h + " {";
        for (var i in k) {
            var m = d(i);
            var l = k[i];
            if (typeof l !== "string" && i != "opacity") {
                l += "px"
            }
            j += m + ":" + l + "!important;"
        }
        j += "}";
        f.innerHTML += j
    }
    ;
    this.get = function(k, h) {
        var q = new Object();
        var n = f.innerHTML.split(k + " {");
        for (var m = 0; m < n.length; m++) {
            var o = n[m];
            if (!o.length) {
                continue
            }
            var p = o.split("!important;");
            for (var l in p) {
                if (p[l].strpos(":")) {
                    var r = p[l].split(":");
                    if (r[1].slice(-2) == "px") {
                        r[1] = Number(r[1].slice(0, -2))
                    }
                    q[e(r[0])] = r[1]
                }
            }
        }
        if (!h) {
            return q
        } else {
            return q[h]
        }
    }
    ;
    this.textSize = function(k) {
        var j = k.clone();
        j.css({
            position: "relative",
            cssFloat: "left",
            styleFloat: "left",
            marginTop: -99999,
            width: "",
            height: ""
        });
        __body.addChild(j);
        var i = j.div.offsetWidth;
        var h = j.div.offsetHeight;
        j.remove();
        return {
            width: i,
            height: h
        }
    }
    ;
    this.prefix = function(h) {
        return Device.styles.vendor == "" ? h[0].toLowerCase() + h.slice(1) : Device.styles.vendor + h
    }
}, "Static");
Class(function Device() {
    var b = this;
    this.agent = navigator.userAgent.toLowerCase();
    function a(f) {
        var e = document.createElement("div")
            , d = "Khtml ms O Moz Webkit".split(" ")
            , c = d.length;
        if (f in e.style) {
            return true
        }
        f = f.replace(/^[a-z]/, function(g) {
            return g.toUpperCase()
        });
        while (c--) {
            if (d[c] + f in e.style) {
                return true
            }
        }
        return false
    }
    this.detect = function(d) {
        if (typeof d === "string") {
            d = [d]
        }
        for (var c = 0; c < d.length; c++) {
            if (this.agent.strpos(d[c])) {
                return true
            }
        }
        return false
    }
    ;
    this.mobile = (!!("ontouchstart"in window) && this.detect(["ios", "iphone", "ipad", "windows phone", "android", "blackberry"])) ? {} : false;
    if (this.mobile) {
        this.mobile.tablet = window.innerWidth > 1000 || window.innerHeight > 900;
        this.mobile.phone = !this.mobile.tablet
    }
    this.browser = new Object();
    this.browser.chrome = this.detect("chrome");
    this.browser.safari = !this.browser.chrome && this.detect("safari");
    this.browser.firefox = this.detect("firefox");
    this.browser.ie = (function() {
            if (b.detect("msie")) {
                return true
            }
            if (b.detect("trident") && b.detect("rv:")) {
                return true
            }
        }
    )();
    this.browser.version = (function() {
            try {
                if (b.browser.chrome) {
                    return Number(b.agent.split("chrome/")[1].split(".")[0])
                }
                if (b.browser.firefox) {
                    return Number(b.agent.split("firefox/")[1].split(".")[0])
                }
                if (b.browser.safari) {
                    return Number(b.agent.split("version/")[1].split(".")[0].charAt(0))
                }
                if (b.browser.ie) {
                    if (b.detect("msie")) {
                        return Number(b.agent.split("msie ")[1].split(".")[0])
                    }
                    return Number(b.agent.split("rv:")[1].split(".")[0])
                }
            } catch (c) {
                return -1
            }
        }
    )();
    this.vendor = (function() {
            if (b.browser.firefox) {
                return "moz"
            }
            if (b.browser.opera) {
                return "o"
            }
            if (b.browser.ie && b.browser.version >= 11) {
                return ""
            }
            if (b.browser.ie) {
                return "ms"
            }
            return "webkit"
        }
    )();
    this.system = new Object();
    this.system.retina = window.devicePixelRatio > 1 ? true : false;
    this.system.webworker = typeof window.Worker !== "undefined";
    this.system.offline = typeof window.applicationCache !== "undefined";
    this.system.geolocation = typeof navigator.geolocation !== "undefined";
    this.system.pushstate = typeof window.history.pushState !== "undefined";
    this.system.webcam = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    this.system.language = window.navigator.userLanguage || window.navigator.language;
    this.system.webaudio = typeof window.webkitAudioContext !== "undefined" || typeof window.AudioContent !== "undefined";
    this.system.localStorage = typeof window.localStorage !== "undefined";
    this.system.fullscreen = typeof document[b.vendor + "CancelFullScreen"] !== "undefined";
    this.system.os = (function() {
            if (b.detect("mac os")) {
                return "mac"
            } else {
                if (b.detect("windows nt 6.3")) {
                    return "windows8.1"
                } else {
                    if (b.detect("windows nt 6.2")) {
                        return "windows8"
                    } else {
                        if (b.detect("windows nt 6.1")) {
                            return "windows7"
                        } else {
                            if (b.detect("windows nt 6.0")) {
                                return "windowsvista"
                            } else {
                                if (b.detect("windows nt 5.1")) {
                                    return "windowsxp"
                                } else {
                                    if (b.detect("linux")) {
                                        return "linux"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return "undetected"
        }
    )();
    this.media = new Object();
    this.media.audio = (function() {
            if (!!document.createElement("audio").canPlayType) {
                return b.detect(["firefox", "opera"]) ? "ogg" : "mp3"
            } else {
                return false
            }
        }
    )();
    this.media.video = (function() {
            var c = document.createElement("video");
            if (!!c.canPlayType) {
                if (Device.mobile) {
                    return "mp4"
                }
                if (b.browser.chrome) {
                    return "webm"
                }
                if (b.browser.firefox || b.browser.opera) {
                    if (c.canPlayType('video/webm; codecs="vorbis,vp8"')) {
                        return "webm"
                    }
                    return "ogv"
                }
                return "mp4"
            } else {
                return false
            }
        }
    )();
    this.graphics = new Object();
    this.graphics.webgl = (function() {
            try {
                return !!window.WebGLRenderingContext && !!document.createElement("canvas").getContext("experimental-webgl")
            } catch (c) {}
        }
    )();
    this.graphics.canvas = (function() {
            var c = document.createElement("canvas");
            return c.getContext ? true : false
        }
    )();
    this.styles = new Object();
    this.styles.filter = a("filter") && !b.browser.firefox;
    this.styles.shader = b.browser.chrome;
    this.styles.vendor = (function() {
            if (b.browser.firefox) {
                return "Moz"
            }
            if (b.browser.opera) {
                return "O"
            }
            if (b.browser.ie && b.browser.version >= 11) {
                return ""
            }
            if (b.browser.ie) {
                return "ms"
            }
            return "Webkit"
        }
    )();
    this.styles.vendorTransition = this.styles.vendor.length ? this.styles.vendor + "Transition" : "transition";
    this.styles.vendorTransform = this.styles.vendor.length ? this.styles.vendor + "Transform" : "transform";
    this.tween = new Object();
    this.tween.transition = a("transition");
    this.tween.css2d = a("transform");
    this.tween.css3d = a("perspective");
    this.tween.complete = (function() {
            if (b.browser.firefox || b.browser.ie) {
                return "transitionend"
            }
            if (b.browser.opera) {
                return "oTransitionEnd"
            }
            return "webkitTransitionEnd"
        }
    )();
    this.openFullscreen = function(c) {
        c = c || __body;
        if (c && b.system.fullscreen) {
            if (c == __body) {
                c.css({
                    top: 0
                })
            }
            c.div[b.vendor + "RequestFullScreen"]()
        }
    }
    ;
    this.closeFullscreen = function() {
        if (b.system.fullscreen) {
            document[b.vendor + "CancelFullScreen"]()
        }
    }
    ;
    this.getFullscreen = function() {
        return document[b.vendor + "IsFullScreen"]
    }
}, "Static");
Class(function Storage() {
    var d = this;
    var c;
    (function() {
            a()
        }
    )();
    function a() {
        if (window.localStorage) {
            try {
                window.localStorage.test = 1;
                window.localStorage.removeItem("test");
                c = true
            } catch (f) {
                c = false
            }
        } else {
            c = false
        }
    }
    function b(i, j, f) {
        var g;
        if (arguments.length > 1 && (j === null || typeof j !== "object")) {
            g = new Object();
            g.path = "/";
            g.expires = f || 1;
            if (j === null) {
                g.expires = -1
            }
            if (typeof g.expires === "number") {
                var l = g.expires
                    , h = g.expires = new Date();
                h.setDate(h.getDate() + l)
            }
            return (document.cookie = [encodeURIComponent(i), "=", g.raw ? String(j) : encodeURIComponent(String(j)), g.expires ? "; expires=" + g.expires.toUTCString() : "", g.path ? "; path=" + g.path : "", g.domain ? "; domain=" + g.domain : "", g.secure ? "; secure" : ""].join(""))
        }
        g = j || {};
        var e, k = g.raw ? function(m) {
                return m
            }
            : decodeURIComponent;
        return (e = new RegExp("(?:^|; )" + encodeURIComponent(i) + "=([^;]*)").exec(document.cookie)) ? k(e[1]) : null
    }
    this.setCookie = function(f, g, e) {
        b(f, g, e)
    }
    ;
    this.getCookie = function(e) {
        return b(e)
    }
    ;
    this.set = function(e, f) {
        if (typeof f === "object") {
            f = JSON.stringify(f)
        }
        if (c) {
            if (typeof f === "null") {
                window.localStorage.removeItem(e)
            } else {
                window.localStorage[e] = f
            }
        } else {
            b(e, f, 365)
        }
    }
    ;
    this.get = function(e) {
        var g;
        if (c) {
            g = window.localStorage[e]
        } else {
            g = b(e)
        }
        if (g) {
            var f;
            if (g.charAt) {
                f = g.charAt(0)
            }
            if (f == "{" || f == "[") {
                g = JSON.parse(g)
            }
        }
        return g
    }
}, "Static");
Class(function DynamicObject(a) {
    var c;
    for (var b in a) {
        this[b] = a[b]
    }
    this.tween = function(f, g, h, e, i, d) {
        if (typeof e !== "number") {
            d = i;
            i = e;
            e = 0
        }
        this.stopTween();
        if (typeof d !== "function") {
            d = null
        }
        if (typeof i !== "function") {
            i = null
        }
        c = TweenManager.tween(this, f, g, h, e, d, i);
        return c
    }
    ;
    this.stopTween = function() {
        if (c && c.stop) {
            c.stop()
        }
    }
    ;
    this.copy = function() {
        var e = new DynamicObject();
        for (var d in this) {
            if (typeof this[d] !== "function" && typeof this[d] !== "object") {
                e[d] = this[d]
            }
        }
        return e
    }
    ;
    this.clear = function() {
        for (var d in this) {
            if (typeof this[d] !== "function") {
                delete this[d]
            }
        }
        return this
    }
});
Class(function ObjectPool(b, d) {
    Inherit(this, Component);
    var c = this;
    var a = [];
    this.limit = Math.round(d * 1.25);
    (function() {
            if (b) {
                d = d || 10;
                b = b || Object;
                for (var e = 0; e < d; e++) {
                    a.push(new b())
                }
            }
        }
    )();
    this.get = function() {
        if (!a.length && a.length < c.limit) {
            a.push(new b())
        }
        return a.shift()
    }
    ;
    this.empty = function() {
        a = []
    }
    ;
    this.put = function(e) {
        if (e) {
            a.push(e)
        }
    }
    ;
    this.insert = function(f) {
        if (typeof f.push === "undefined") {
            f = [f]
        }
        for (var e = 0; e < f.length; e++) {
            a.push(f[e])
        }
    }
    ;
    this.destroy = function() {
        for (var e = 0; e < a.length; e++) {
            if (a[e].destroy) {
                a[e].destroy()
            }
        }
        a = null;
        return this._destroy()
    }
});
Class(function LinkedList() {
    var a = LinkedList.prototype;
    this.length = 0;
    this.first = null;
    this.last = null;
    this.current = null;
    a.push = function(b) {
        if (this.first === null) {
            b.__prev = b;
            b.__next = b;
            this.first = b;
            this.last = b
        } else {
            b.__prev = this.last;
            b.__next = this.first;
            this.last.__next = b;
            this.last = b
        }
        this.length++
    }
    ;
    a.remove = function(b) {
        if (this.length > 1 && b.__prev) {
            b.__prev.__next = b.__next;
            b.__next.__prev = b.__prev;
            if (b == this.first) {
                this.first = b.__next
            }
            if (b == this.last) {
                this.last = b.__prev
            }
        } else {
            this.first = null;
            this.last = null
        }
        b.__prev = null;
        b.__next = null;
        this.length--
    }
    ;
    a.empty = function() {
        this.length = 0;
        this.first = null;
        this.last = null;
        this.current = null
    }
    ;
    a.start = function(b) {
        b = b || this;
        b.current = this.first;
        return b.current
    }
    ;
    a.next = function(b) {
        b = b || this;
        if (!b.current || !b.current.__next) {
            return false
        }
        b.current = b.current.__next;
        if (b.current == b.current.__next || b.current == b.current.__prev) {
            b.current = null
        }
        return b.current
    }
    ;
    a.destroy = function() {
        Utils.nullObject(this);
        return null
    }
});
Class(function Pact() {
    var a = this;
    Namespace("Pact", this);
    (function() {}
    )();
    this.create = function() {
        return new this.Emitter(arguments)
    }
    ;
    this.batch = function() {
        return new this.Batch()
    }
}, "Static");
Pact.Class(function Emitter(e) {
    var g = this;
    var a, d, f;
    var c;
    this._fire = function() {
        if (c) {
            return
        }
        c = true;
        var h = arguments;
        var i = false;
        Render.nextFrame(function() {
            if (f || d) {
                var k = h[0];
                var j = h[1];
                if (k instanceof Error) {
                    if (f) {
                        f.apply(g, [k])
                    }
                    i = true
                } else {
                    if (j instanceof Error) {
                        if (f) {
                            f.apply(g, [j])
                        }
                        i = true
                    } else {
                        if (!k && j && d) {
                            d.apply(g, [j]);
                            i = true
                        }
                        if (!j && k && d) {
                            d.apply(g, [k]);
                            i = true
                        }
                    }
                }
            }
            if (!i && a) {
                a.apply(g, h)
            }
        })
    }
    ;
    this.exec = function() {
        b(arguments);
        return this
    }
    ;
    this.then = function(h) {
        a = h;
        return this
    }
    ;
    this.error = function(h) {
        f = h;
        return this
    }
    ;
    this.success = function(h) {
        d = h;
        return this
    }
    ;
    function b(l) {
        var h = [];
        var k = l[0];
        for (var j = 1; j < l.length; j++) {
            h.push(l[j])
        }
        h.push(g._fire);
        k.apply(k, h)
    }
    if (e.length) {
        b(e)
    }
});
Pact.Class(function Batch() {
    Inherit(this, Events);
    var e = this;
    var g = 0;
    var a = [];
    var i = [];
    var j = [];
    var c = [];
    this.push = function(k) {
        k.then(h).error(d).success(f);
        c.push(k)
    }
    ;
    function f() {
        this.data = arguments;
        i.push(this);
        b()
    }
    function d() {
        this.data = arguments;
        j.push(this);
        b()
    }
    function h() {
        this.data = arguments;
        a.push(this);
        b()
    }
    function b() {
        g++;
        if (g == c.length) {
            e.events.fire(HydraEvents.COMPLETE, {
                complete: a,
                success: i,
                error: j
            })
        }
    }
});
Class(function HydraEvents() {
    var b = new Array();
    var a = {};
    this.BROWSER_FOCUS = "hydra_focus";
    this.HASH_UPDATE = "hydra_hash_update";
    this.COMPLETE = "hydra_complete";
    this.PROGRESS = "hydra_progress";
    this.UPDATE = "hydra_update";
    this.LOADED = "hydra_loaded";
    this.END = "hydra_end";
    this.FAIL = "hydra_fail";
    this.SELECT = "hydra_select";
    this.ERROR = "hydra_error";
    this.READY = "hydra_ready";
    this.RESIZE = "hydra_resize";
    this.CLICK = "hydra_click";
    this.HOVER = "hydra_hover";
    this.MESSAGE = "hydra_message";
    this.ORIENTATION = "orientation";
    this.BACKGROUND = "background";
    this.BACK = "hydra_back";
    this.PREVIOUS = "hydra_previous";
    this.NEXT = "hydra_next";
    this.RELOAD = "hydra_reload";
    this._checkDefinition = function(c) {
        if (typeof c == "undefined") {
            throw "Undefined event"
        }
    }
    ;
    this._addEvent = function(f, g, c) {
        this._checkDefinition(f);
        var d = new Object();
        d.evt = f;
        d.object = c;
        d.callback = g;
        b.push(d)
    }
    ;
    this._removeEvent = function(c, e) {
        this._checkDefinition(c);
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].evt == c && b[d].callback == e) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    }
    ;
    this._destroyEvents = function(c) {
        for (var d = b.length - 1; d > -1; d--) {
            if (b[d].object == c) {
                b[d] = null;
                b.splice(d, 1)
            }
        }
    }
    ;
    this._fireEvent = function(c, f) {
        this._checkDefinition(c);
        var e = true;
        f = f || a;
        f.cancel = function() {
            e = false
        }
        ;
        for (var d = 0; d < b.length; d++) {
            if (b[d].evt == c) {
                if (e) {
                    b[d].callback(f)
                } else {
                    return false
                }
            }
        }
    }
    ;
    this._consoleEvents = function() {
        console.log(b)
    }
}, "Static");
Class(function Events(c) {
    this.events = {};
    var b = {};
    var a = {};
    this.events.subscribe = function(d, e) {
        HydraEvents._addEvent(d, !!e._fire ? e._fire : e, c);
        return e
    }
    ;
    this.events.unsubscribe = function(d, e) {
        HydraEvents._removeEvent(d, !!e._fire ? e._fire : e)
    }
    ;
    this.events.fire = function(d, f, e) {
        f = f || a;
        HydraEvents._checkDefinition(d);
        if (b[d]) {
            f.target = f.target || c;
            b[d](f);
            f.target = null
        } else {
            if (!e) {
                HydraEvents._fireEvent(d, f)
            }
        }
    }
    ;
    this.events.add = function(d, e) {
        HydraEvents._checkDefinition(d);
        b[d] = !!e._fire ? e._fire : e;
        return e
    }
    ;
    this.events.remove = function(d) {
        HydraEvents._checkDefinition(d);
        if (b[d]) {
            delete b[d]
        }
    }
    ;
    this.events.bubble = function(e, d) {
        HydraEvents._checkDefinition(d);
        var f = this;
        e.events.add(d, function(g) {
            f.fire(d, g)
        })
    }
    ;
    this.events.scope = function(d) {
        c = d
    }
    ;
    this.events.destroy = function() {
        HydraEvents._destroyEvents(c);
        b = null;
        return null
    }
});
Class(function PushState(a) {
    var b = this;
    if (typeof a !== "boolean") {
        a = window.location.href.strpos("local") || window.location.href.charAt(0) == "1"
    }
    this.locked = false;
    this.dispatcher = new StateDispatcher(a);
    this.getState = function() {
        return this.dispatcher.getState()
    }
    ;
    this.setState = function(c) {
        this.dispatcher.setState(c)
    }
    ;
    this.setTitle = function(c) {
        this.dispatcher.setTitle(c)
    }
    ;
    this.lock = function() {
        this.locked = true;
        this.dispatcher.lock()
    }
    ;
    this.unlock = function() {
        this.locked = false;
        this.dispatcher.unlock()
    }
    ;
    this.setPathRoot = function(c) {
        this.dispatcher.setPathRoot(c)
    }
});
Class(function StateDispatcher(g) {
    Inherit(this, Events);
    var f = this;
    var i, a;
    var d = "/";
    this.locked = false;
    (function() {
            b();
            i = c();
            a = i
        }
    )();
    function b() {
        if (!Device.system.pushstate || g) {
            if (Device.detect(["msie 7", "msie 8", "firefox/3", "safari/4"])) {
                setInterval(function() {
                    var j = c();
                    if (j != a) {
                        h(j)
                    }
                }, 300)
            } else {
                window.addEventListener("hashchange", function() {
                    h(c())
                }, false)
            }
        } else {
            window.onpopstate = history.onpushstate = e
        }
    }
    function c() {
        if (!Device.system.pushstate || g) {
            var j = window.location.hash;
            j = j.slice(3);
            return String(j)
        } else {
            var k = location.pathname.toString();
            k = d != "/" ? k.split(d)[1] : k.slice(1);
            k = k || "";
            return k
        }
    }
    function e() {
        var j = location.pathname;
        if (!f.locked && j != a) {
            j = d != "/" ? j.split(d)[1] : j.slice(1);
            j = j || "";
            a = j;
            f.events.fire(HydraEvents.UPDATE, {
                value: j,
                split: j.split("/")
            })
        } else {
            if (j != a) {
                if (a) {
                    window.history.pushState(null, null, d + j)
                }
            }
        }
    }
    function h(j) {
        if (!f.locked && j != a) {
            a = j;
            f.events.fire(HydraEvents.UPDATE, {
                value: j,
                split: j.split("/")
            })
        } else {
            if (j != a) {
                if (a) {
                    window.location.hash = "!/" + a
                }
            }
        }
    }
    this.getState = function() {
        return c()
    }
    ;
    this.setPathRoot = function(j) {
        if (j.charAt(0) == "/") {
            d = j
        } else {
            d = "/" + j
        }
    }
    ;
    this.setState = function(j) {
        if (!Device.system.pushstate || g) {
            if (j != a) {
                window.location.hash = "!/" + j;
                a = j
            }
        } else {
            if (j != a) {
                window.history.pushState(null, null, d + j);
                a = j
            }
        }
    }
    ;
    this.setTitle = function(j) {
        document.title = j
    }
    ;
    this.lock = function() {
        this.locked = true
    }
    ;
    this.unlock = function() {
        this.locked = false
    }
    ;
    this.forceHash = function() {
        g = true
    }
});
Class(function AssetLoader(j) {
    Inherit(this, Component);
    var c = this;
    var m = 0;
    var l = 0;
    var e, d, l;
    var f, g;
    (function() {
            e = new Array();
            g = new Array();
            k();
            setTimeout(h, 10)
        }
    )();
    function k() {
        for (var o in j) {
            if (typeof j[o] !== "undefined") {
                m++;
                e.push(j[o])
            }
        }
    }
    function h() {
        d = Math.round(m * 0.5);
        for (var o = 0; o < d; o++) {
            a(e[o])
        }
    }
    function b() {
        if (e) {
            var r = [];
            for (var q = 0; q < e.length; q++) {
                var p = false;
                for (var o = 0; o < g.length; o++) {
                    if (g[o] == e[q]) {
                        p = true
                    }
                }
                if (!p) {
                    r.push(e[q])
                }
            }
            if (r.length) {
                console.log("AssetLoader Files Failed To Load:");
                console.log(r)
            }
        }
        if (c.events) {
            c.events.fire(HydraEvents.COMPLETE)
        }
    }
    function a(s) {
        if (s) {
            var p = s.split("/");
            p = p[p.length - 1];
            var q = p.split(".");
            var r = q[q.length - 1].split("?")[0];
            switch (r) {
                case "html":
                    XHR.get(s, function(u) {
                        Hydra.HTML[q[0]] = u;
                        n(s)
                    }, "text");
                    break;
                case "js":
                case "php":
                case undefined:
                    var o = document.createElement("script");
                    o.type = "text/javascript";
                    o.src = s;
                    o.async = true;
                    __body.addChild(o);
                    XHR.get(s, function() {
                        setTimeout(function() {
                            n(s)
                        }, 100)
                    }, "text");
                    break;
                case "json":
                    XHR.get(s, function(u) {
                        Hydra.JSON[q[0]] = u;
                        n(s)
                    });
                    break;
                case "fs":
                case "vs":
                case "frag":
                case "vert":
                    XHR.get(s, function(u) {
                        Hydra.SHADERS[q[0] + "." + r] = u;
                        n(s)
                    }, "text");
                    break;
                default:
                    var t = new Image();
                    t.src = s;
                    t.onload = function() {
                        n(s)
                    }
                    ;
                    break
            }
        }
    }
    function i() {
        if (l == d && l < m) {
            var p = d;
            d *= 2;
            for (var o = p; o < d; o++) {
                if (e[o]) {
                    a(e[o])
                }
            }
        }
    }
    function n(o) {
        if (e) {
            l++;
            c.events.fire(HydraEvents.PROGRESS, {
                percent: l / m
            });
            g.push(o);
            clearTimeout(f);
            i();
            if (l == m) {
                c.complete = true;
                if (c.events) {
                    c.events.fire(HydraEvents.COMPLETE)
                }
            } else {
                f = setTimeout(b, 3000)
            }
        }
    }
    this.add = function(o) {
        m += o
    }
    ;
    this.trigger = function(o) {
        o = o || 1;
        for (var p = 0; p < o; p++) {
            n("trigger")
        }
    }
    ;
    this.destroy = function() {
        j = null;
        l = null;
        e = null;
        l = null;
        d = null;
        return this._destroy()
    }
});
Class(function Render() {
    var h = this;
    var n, e, k, g, a;
    var d = [];
    var j = [];
    var m = new LinkedList();
    var l = new LinkedList();
    var f = m;
    (function() {
            requestAnimationFrame(c);
            Hydra.ready(b)
        }
    )();
    function b() {
        setTimeout(function() {
            if (!k) {
                window.requestAnimationFrame = function(o) {
                    setTimeout(o, 1000 / 60)
                }
                ;
                c()
            }
        }, 250)
    }
    function c() {
        var p = Date.now();
        var r = 0;
        var q = 60;
        if (k) {
            r = p - k;
            q = 1000 / r
        }
        k = p;
        h.FPS = q;
        for (var o = j.length - 1; o > -1; o--) {
            if (j[o]) {
                j[o](p, q, r)
            }
        }
        if (g && q < g) {
            for (o = d.length - 1; o > -1; o--) {
                if (d[o]) {
                    d[o](q)
                } else {
                    d.splice(o, 1)
                }
            }
        }
        if (f.length) {
            i()
        }
        requestAnimationFrame(c)
    }
    function i() {
        var o = f;
        f = f == m ? l : m;
        var p = o.start();
        while (p) {
            p();
            p = o.next()
        }
        o.empty()
    }
    this.startRender = function(q) {
        var p = true;
        var o = j.length - 1;
        if (j.indexOf(q) == -1) {
            j.push(q)
        }
    }
    ;
    this.stopRender = function(p) {
        var o = j.indexOf(p);
        if (o > -1) {
            j.splice(o, 1)
        }
    }
    ;
    this.addThreshold = function(o, p) {
        g = o;
        if (d.indexOf(p) == -1 && p) {
            d.push(p)
        }
    }
    ;
    this.removeThreshold = function(p) {
        if (p) {
            var o = d.indexOf(p);
            if (o > -1) {
                d.splice(o, 1)
            }
        } else {
            d = []
        }
        g = null
    }
    ;
    this.startTimer = function(o) {
        a = o || "Timer";
        if (console.time && !window._NODE_) {
            console.time(a)
        } else {
            e = Date.now()
        }
    }
    ;
    this.stopTimer = function() {
        if (console.time && !window._NODE_) {
            console.timeEnd(a)
        } else {
            console.log("Render " + a + ": " + (Date.now() - e))
        }
    }
    ;
    this.nextFrame = function(o) {
        f.push(o)
    }
    ;
    this.setupTween = function(o) {
        h.nextFrame(function() {
            h.nextFrame(o)
        })
    }
}, "Static");
Class(function Thread() {
    Inherit(this, Component);
    var g = this;
    var a, d, c;
    (function() {
            f();
            b()
        }
    )();
    function f() {
        c = (function() {
                if (typeof Config !== "undefined") {
                    return Config.PATH || ""
                }
                return ""
            }
        )();
        d = new Object();
        a = new Worker(c + "assets/js/hydra/hydra-thread.js");
        var h = Utils.constructor.toString();
        h += "Utils = new Utils();";
        a.postMessage({
            code: h
        })
    }
    function b() {
        a.addEventListener("message", e)
    }
    function e(h) {
        if (h.data.console) {
            console.log(h.data.message)
        }
        if (h.data.id) {
            var i = d[h.data.id];
            if (i) {
                i(h.data.message)
            }
            delete d[h.data.id]
        }
        if (h.data.emit) {
            var i = d[h.data.evt];
            if (i) {
                i(h.data.msg)
            }
        }
    }
    this.on = function(h, i) {
        d[h] = i
    }
    ;
    this.off = function(h) {
        delete d[h]
    }
    ;
    this.initFunction = function(k, j) {
        k = k.toString();
        if (!j) {
            k = k.replace("(", "!!!");
            var i = k.split("!!!");
            var h = i[0].split(" ")[1];
            k = "self." + h + " = function(" + i[1];
            a.postMessage({
                code: k,
                fn: h
            })
        } else {
            a.postMessage({
                code: k
            })
        }
    }
    ;
    this.initCode = function(j, l) {
        if (typeof l === "function") {
            l = [l]
        }
        var h = "self." + j + " = function(object, id) {";
        for (var k = 0; k < l.length; k++) {
            h += l[k].toString()
        }
        h += l[0].toString().match(/function ([^\(]+)/)[1] + "(object, id);";
        h += "}";
        a.postMessage({
            code: h,
            fn: j
        })
    }
    ;
    this.importScript = function(h) {
        a.postMessage({
            path: h,
            importScript: true
        })
    }
    ;
    this.send = function(h, j, l) {
        if (typeof h === "string") {
            var i = h;
            j = j || {};
            j.fn = h
        } else {
            l = j;
            j = h
        }
        var k = Utils.timestamp();
        if (l) {
            d[k] = l
        }
        a.postMessage({
            message: j,
            id: k
        })
    }
    ;
    this.destroy = function() {
        if (a.terminate) {
            a.terminate()
        }
        return this._destroy()
    }
});
Class(function XHR() {
    var c = this;
    var b;
    function a(e, f) {
        if (typeof f === "object") {
            for (var d in f) {
                var g = e + "[" + d + "]";
                if (typeof f[d] === "object") {
                    a(g, f[d])
                } else {
                    b.push(g + "=" + f[d])
                }
            }
        } else {
            b.push(e + "=" + f)
        }
    }
    this.get = function(e, h, j, g) {
        if (typeof h === "function") {
            g = j;
            j = h;
            h = null
        } else {
            if (typeof h === "object") {
                var d = "?";
                for (var f in h) {
                    d += f + "=" + h[f] + "&"
                }
                d = d.slice(0, -1);
                e += d
            }
        }
        var i = new XMLHttpRequest();
        i.open("GET", e, true);
        i.send();
        i.onreadystatechange = function() {
            if (i.readyState == 4 && i.status == 200) {
                if (typeof j === "function") {
                    var k = i.responseText;
                    if (g == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                i = null
            }
        }
    }
    ;
    this.post = function(d, g, j, f, i) {
        if (typeof g === "function") {
            i = f;
            f = j;
            j = g;
            g = null
        } else {
            if (typeof g === "object") {
                if (j == "json" || f == "json" || i == "json") {
                    g = JSON.stringify(g)
                } else {
                    b = new Array();
                    for (var e in g) {
                        a(e, g[e])
                    }
                    g = b.join("&");
                    g = g.replace(/\[/g, "%5B");
                    g = g.replace(/\]/g, "%5D");
                    b = null
                }
            }
        }
        var h = new XMLHttpRequest();
        h.open("POST", d, true);
        switch (i) {
            case "upload":
                i = "application/upload";
                break;
            default:
                i = "application/x-www-form-urlencoded";
                break
        }
        h.setRequestHeader("Content-type", i);
        h.onreadystatechange = function() {
            if (h.readyState == 4 && h.status == 200) {
                if (typeof j === "function") {
                    var k = h.responseText;
                    if (f == "text") {
                        j(k)
                    } else {
                        try {
                            j(JSON.parse(k))
                        } catch (l) {
                            console.error(k)
                        }
                    }
                }
                h = null
            }
        }
        ;
        h.send(g)
    }
}, "Static");
Class(function Color(b) {
    Inherit(this, Component);
    var f = this;
    this.r = 1;
    this.g = 1;
    this.b = 1;
    (function() {
            e(b)
        }
    )();
    function e(g) {
        if (g instanceof Color) {
            d(g)
        } else {
            if (typeof g === "number") {
                c(g)
            }
        }
    }
    function d(g) {
        f.r = g.r;
        f.g = g.g;
        f.b = g.b
    }
    function c(g) {
        g = Math.floor(g);
        f.r = (g >> 16 & 255) / 255;
        f.g = (g >> 8 & 255) / 255;
        f.b = (g & 255) / 255
    }
    function a(i, h, g) {
        if (g < 0) {
            g += 1
        }
        if (g > 1) {
            g -= 1
        }
        if (g < 1 / 6) {
            return i + (h - i) * 6 * g
        }
        if (g < 1 / 2) {
            return h
        }
        if (g < 2 / 3) {
            return i + (h - i) * 6 * (2 / 3 - g)
        }
        return i
    }
    this.set = function(g) {
        e(g);
        return this
    }
    ;
    this.setRGB = function(j, i, h) {
        this.r = j;
        this.g = i;
        this.b = h;
        return this
    }
    ;
    this.setHSL = function(j, i, g) {
        if (i === 0) {
            this.r = this.g = this.b = g
        } else {
            var m = g <= 0.5 ? g * (1 + i) : g + i - (g * i);
            var k = (2 * g) - m;
            this.r = a(k, m, j + 1 / 3);
            this.g = a(k, m, j);
            this.b = a(k, m, j - 1 / 3)
        }
        return this
    }
    ;
    this.getStyle = function() {
        return "rgb(" + ((this.r * 255) | 0) + "," + ((this.g * 255) | 0) + "," + ((this.b * 255) | 0) + ")"
    }
    ;
    this.getHex = function() {
        return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0
    }
    ;
    this.getHexString = function() {
        return ("000000" + this.getHex().toString(16)).slice(-6)
    }
    ;
    this.add = function(g) {
        this.r += g.r;
        this.g += g.g;
        this.b += g.b
    }
    ;
    this.mix = function(g, h) {
        this.r = this.r * (1 - h) + (g.r * h);
        this.g = this.g * (1 - h) + (g.g * h);
        this.b = this.b * (1 - h) + (g.b * h)
    }
    ;
    this.addScalar = function(g) {
        this.r += g;
        this.g += g;
        this.b += g
    }
    ;
    this.multiply = function(g) {
        this.r *= g.r;
        this.g *= g.g;
        this.b *= g.b
    }
    ;
    this.multiplyScalar = function(g) {
        this.r *= g;
        this.g *= g;
        this.b *= g
    }
    ;
    this.clone = function() {
        return new Color().setRGB(this.r, this.g, this.b)
    }
});
Class(function Matrix2() {
    var o = this;
    var k = Matrix2.prototype;
    var g, f, e, n, m, l, u, t, s;
    var r, q, p, d, c, a, j, i, h;
    this.type = "matrix2";
    this.data = new Float32Array(9);
    (function() {
            v()
        }
    )();
    function v(w) {
        w = w || o.data;
        w[0] = 1,
            w[1] = 0,
            w[2] = 0;
        w[3] = 0,
            w[4] = 1,
            w[5] = 0;
        w[6] = 0,
            w[7] = 0,
            w[8] = 1
    }
    function b(w) {
        w = Math.abs(w) < 0.000001 ? 0 : w;
        return w
    }
    k.identity = function(w) {
        v(w);
        return this
    }
    ;
    k.transformVector = function(z) {
        var A = this.data;
        var w = z.x;
        var B = z.y;
        z.x = A[0] * w + A[1] * B + A[2];
        z.y = A[3] * w + A[4] * B + A[5];
        return z
    }
    ;
    k.setTranslation = function(y, x, w) {
        var z = w || this.data;
        z[0] = 1,
            z[1] = 0,
            z[2] = y;
        z[3] = 0,
            z[4] = 1,
            z[5] = x;
        z[6] = 0,
            z[7] = 0,
            z[8] = 1;
        return this
    }
    ;
    k.getTranslation = function(w) {
        var x = this.data;
        w = w || new Vector2();
        w.x = x[2];
        w.y = x[5];
        return w
    }
    ;
    k.setScale = function(z, y, w) {
        var x = w || this.data;
        x[0] = z,
            x[1] = 0,
            x[2] = 0;
        x[3] = 0,
            x[4] = y,
            x[5] = 0;
        x[6] = 0,
            x[7] = 0,
            x[8] = 1;
        return this
    }
    ;
    k.setShear = function(z, y, w) {
        var x = w || this.data;
        x[0] = 1,
            x[1] = z,
            x[2] = 0;
        x[3] = y,
            x[4] = 1,
            x[5] = 0;
        x[6] = 0,
            x[7] = 0,
            x[8] = 1;
        return this
    }
    ;
    k.setRotation = function(x, w) {
        var A = w || this.data;
        var z = Math.cos(x);
        var y = Math.sin(x);
        A[0] = z,
            A[1] = -y,
            A[2] = 0;
        A[3] = y,
            A[4] = z,
            A[5] = 0;
        A[6] = 0,
            A[7] = 0,
            A[8] = 1;
        return this
    }
    ;
    k.setTRS = function(y, w, x, D, C) {
        var B = this.data;
        var A = Math.cos(x);
        var z = Math.sin(x);
        B[0] = A * D,
            B[1] = -z * C,
            B[2] = y;
        B[3] = z * D,
            B[4] = A * C,
            B[5] = w;
        B[6] = 0,
            B[7] = 0,
            B[8] = 1;
        return this
    }
    ;
    k.translate = function(x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    }
    ;
    k.rotate = function(w) {
        this.identity(Matrix2.__TEMP__);
        this.setTranslation(w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    }
    ;
    k.scale = function(x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setScale(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    }
    ;
    k.shear = function(x, w) {
        this.identity(Matrix2.__TEMP__);
        this.setRotation(x, w, Matrix2.__TEMP__);
        return this.multiply(Matrix2.__TEMP__)
    }
    ;
    k.multiply = function(x) {
        var y = this.data;
        var w = x.data || x;
        g = y[0],
            f = y[1],
            e = y[2];
        n = y[3],
            m = y[4],
            l = y[5];
        u = y[6],
            t = y[7],
            s = y[8];
        r = w[0],
            q = w[1],
            p = w[2];
        d = w[3],
            c = w[4],
            a = w[5];
        j = w[6],
            i = w[7],
            h = w[8];
        y[0] = g * r + f * d + e * j;
        y[1] = g * q + f * c + e * i;
        y[2] = g * p + f * a + e * h;
        y[3] = n * r + m * d + l * j;
        y[4] = n * q + m * c + l * i;
        y[5] = n * p + m * a + l * h;
        return this
    }
    ;
    k.copyTo = function(x) {
        var y = this.data;
        var w = x.data || x;
        w[0] = y[0],
            w[1] = y[1],
            w[2] = y[2];
        w[3] = y[3],
            w[4] = y[4],
            w[5] = y[5];
        w[6] = y[6],
            w[7] = y[7],
            w[8] = y[8];
        return x
    }
    ;
    k.copyFrom = function(x) {
        var y = this.data;
        var w = x.data || x;
        w[0] = y[0],
            w[1] = y[1],
            w[2] = y[2];
        w[3] = y[3],
            w[4] = y[4],
            w[5] = y[5];
        w[6] = y[6],
            w[7] = y[7],
            w[8] = y[8];
        return this
    }
    ;
    k.getCSS = function() {
        var w = this.data;
        if (Device.tween.css3d) {
            return "matrix3d(" + b(w[0]) + ", " + b(w[3]) + ", 0, 0, " + b(w[1]) + ", " + b(w[4]) + ", 0, 0, 0, 0, 1, 0, " + b(w[2]) + ", " + b(w[5]) + ", 0, 1)"
        } else {
            return "matrix(" + b(w[0]) + ", " + b(w[3]) + ", " + b(w[1]) + ", " + b(w[4]) + ", " + b(w[2]) + ", " + b(w[5]) + ")"
        }
    }
});
Matrix2.__TEMP__ = new Matrix2().data;
Class(function Matrix4() {
    var d = this;
    var b = Matrix4.prototype;
    this.type = "matrix4";
    this.data = new Float32Array(16);
    (function() {
            a()
        }
    )();
    function a(e) {
        var f = e || d.data;
        f[0] = 1,
            f[4] = 0,
            f[8] = 0,
            f[12] = 0;
        f[1] = 0,
            f[5] = 1,
            f[9] = 0,
            f[13] = 0;
        f[2] = 0,
            f[6] = 0,
            f[10] = 1,
            f[14] = 0;
        f[3] = 0,
            f[7] = 0,
            f[11] = 0,
            f[15] = 1
    }
    function c(e) {
        e = Math.abs(e) < 0.000001 ? 0 : e;
        return e
    }
    b.identity = function() {
        a();
        return this
    }
    ;
    b.transformVector = function(g, h) {
        var j = this.data;
        var e = g.x
            , k = g.y
            , i = g.z
            , f = g.w;
        h = h || g;
        h.x = j[0] * e + j[4] * k + j[8] * i + j[12] * f;
        h.y = j[1] * e + j[5] * k + j[9] * i + j[13] * f;
        h.z = j[2] * e + j[6] * k + j[10] * i + j[14] * f;
        return h
    }
    ;
    b.multiply = function(L, M) {
        var O = this.data;
        var N = L.data || L;
        var K, J, I, H, G, F, E, D, C, B, q, p, o, n, l, k;
        var A, z, y, x, w, v, u, t, s, r, j, i, h, g, f, e;
        K = O[0],
            J = O[1],
            I = O[2],
            H = O[3];
        G = O[4],
            F = O[5],
            E = O[6],
            D = O[7];
        C = O[8],
            B = O[9],
            q = O[10],
            p = O[11];
        o = O[12],
            n = O[13],
            l = O[14],
            k = O[15];
        A = N[0],
            z = N[1],
            y = N[2],
            x = N[3];
        w = N[4],
            v = N[5],
            u = N[6],
            t = N[7];
        s = N[8],
            r = N[9],
            j = N[10],
            i = N[11];
        h = N[12],
            g = N[13],
            f = N[14],
            e = N[15];
        O[0] = K * A + G * z + C * y + o * x;
        O[1] = J * A + F * z + B * y + n * x;
        O[2] = I * A + E * z + q * y + l * x;
        O[3] = H * A + D * z + p * y + k * x;
        O[4] = K * w + G * v + C * u + o * t;
        O[5] = J * w + F * v + B * u + n * t;
        O[6] = I * w + E * v + q * u + l * t;
        O[7] = H * w + D * v + p * u + k * t;
        O[8] = K * s + G * r + C * j + o * i;
        O[9] = J * s + F * r + B * j + n * i;
        O[10] = I * s + E * r + q * j + l * i;
        O[11] = H * s + D * r + p * j + k * i;
        O[12] = K * h + G * g + C * f + o * e;
        O[13] = J * h + F * g + B * f + n * e;
        O[14] = I * h + E * g + q * f + l * e;
        O[15] = H * h + D * g + p * f + k * e;
        return this
    }
    ;
    b.setTRS = function(o, n, l, g, f, e, v, u, t, k) {
        k = k || this;
        var r = k.data;
        this.identity(k);
        var j = Math.sin(g);
        var s = Math.cos(g);
        var i = Math.sin(f);
        var q = Math.cos(f);
        var h = Math.sin(e);
        var p = Math.cos(e);
        r[0] = (q * p + i * j * h) * v;
        r[1] = (-q * h + i * j * p) * v;
        r[2] = i * s * v;
        r[4] = h * s * u;
        r[5] = p * s * u;
        r[6] = -j * u;
        r[8] = (-i * p + q * j * h) * t;
        r[9] = (h * i + q * j * p) * t;
        r[10] = q * s * t;
        r[12] = o;
        r[13] = n;
        r[14] = l;
        return k
    }
    ;
    b.setScale = function(i, h, f, e) {
        e = e || this;
        var g = e.data || e;
        this.identity(e);
        g[0] = i,
            g[5] = h,
            g[10] = f;
        return e
    }
    ;
    b.setTranslation = function(g, f, i, e) {
        e = e || this;
        var h = e.data || e;
        this.identity(e);
        h[12] = g,
            h[13] = f,
            h[14] = i;
        return e
    }
    ;
    b.setRotation = function(g, f, e, i) {
        i = i || this;
        var l = i.data || i;
        this.identity(i);
        var p = Math.sin(g);
        var k = Math.cos(g);
        var o = Math.sin(f);
        var j = Math.cos(f);
        var n = Math.sin(e);
        var h = Math.cos(e);
        l[0] = j * h + o * p * n;
        l[1] = -j * n + o * p * h;
        l[2] = o * k;
        l[4] = n * k;
        l[5] = h * k;
        l[6] = -p;
        l[8] = -o * h + j * p * n;
        l[9] = n * o + j * p * h;
        l[10] = j * k;
        return i
    }
    ;
    b.translate = function(f, e, g) {
        this.setTranslation(f, e, g, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    }
    ;
    b.rotate = function(g, f, e) {
        this.setRotation(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    }
    ;
    b.scale = function(g, f, e) {
        this.setScale(g, f, e, Matrix4.__TEMP__);
        return this.multiply(Matrix4.__TEMP__)
    }
    ;
    b.copyTo = function(f) {
        var g = this.data;
        var e = f.data || f;
        for (var h = 0; h < 16; h++) {
            e[h] = g[h]
        }
        return f
    }
    ;
    b.copyRotationTo = function(f) {
        var g = this.data;
        var e = f.data || f;
        e[0] = g[0];
        e[1] = g[1];
        e[2] = g[2];
        e[3] = g[4];
        e[4] = g[5];
        e[5] = g[6];
        e[6] = g[8];
        e[7] = g[9];
        e[8] = g[10];
        return f
    }
    ;
    b.copyPosition = function(e) {
        var g = this.data;
        var f = e.data || e;
        g[12] = f[12];
        g[13] = f[13];
        g[14] = f[14];
        return this
    }
    ;
    b.getCSS = function() {
        var e = this.data;
        return "matrix3d(" + c(e[0]) + "," + c(e[1]) + "," + c(e[2]) + "," + c(e[3]) + "," + c(e[4]) + "," + c(e[5]) + "," + c(e[6]) + "," + c(e[7]) + "," + c(e[8]) + "," + c(e[9]) + "," + c(e[10]) + "," + c(e[11]) + "," + c(e[12]) + "," + c(e[13]) + "," + c(e[14]) + "," + c(e[15]) + ")"
    }
    ;
    b.extractPosition = function(e) {
        e = e || new Vector3();
        var f = this.data;
        e.set(f[12], f[13], f[14]);
        return e
    }
    ;
    b.determinant = function() {
        var e = this.data;
        return e[0] * (e[5] * e[10] - e[9] * e[6]) + e[4] * (e[9] * e[2] - e[1] * e[10]) + e[8] * (e[1] * e[6] - e[5] * e[2])
    }
    ;
    b.inverse = function(h) {
        var o = this.data;
        var q = (h) ? h.data || h : this.data;
        var l = this.determinant();
        if (Math.abs(l) < 0.0001) {
            console.warn("Attempt to inverse a singular Matrix4. ", this.data);
            console.trace();
            return h
        }
        var g = o[0]
            , u = o[4]
            , r = o[8]
            , k = o[12]
            , f = o[1]
            , t = o[5]
            , p = o[9]
            , j = o[13]
            , e = o[2]
            , s = o[6]
            , n = o[10]
            , i = o[14];
        l = 1 / l;
        q[0] = (t * n - p * s) * l;
        q[1] = (r * s - u * n) * l;
        q[2] = (u * p - r * t) * l;
        q[4] = (p * e - f * n) * l;
        q[5] = (g * n - r * e) * l;
        q[6] = (r * f - g * p) * l;
        q[8] = (f * s - t * e) * l;
        q[9] = (u * e - g * s) * l;
        q[10] = (g * t - u * f) * l;
        q[12] = -(k * q[0] + j * q[4] + i * q[8]);
        q[13] = -(k * q[1] + j * q[5] + i * q[9]);
        q[14] = -(k * q[2] + j * q[6] + i * q[10]);
        return h
    }
    ;
    b.transpose = function(h) {
        var j = this.data;
        var l = h ? h.data || h : this.data;
        var g = j[0]
            , q = j[4]
            , n = j[8]
            , f = j[1]
            , p = j[5]
            , k = j[9]
            , e = j[2]
            , o = j[6]
            , i = j[10];
        l[0] = g;
        l[1] = q;
        l[2] = n;
        l[4] = f;
        l[5] = p;
        l[6] = k;
        l[8] = e;
        l[9] = o;
        l[10] = i
    }
    ;
    b.lookAt = function(g, f) {
        var i = this.data;
        var e = D3.m4v31;
        var j = D3.m4v32;
        var h = D3.m4v33;
        h.set(i[12], i[13], i[14]);
        h.sub(h, g).normalize();
        if (h.lengthSq() === 0) {
            h.z = 1
        }
        e.cross(f, h).normalize();
        if (e.lengthSq() === 0) {
            h.x += 0.0001;
            e.cross(f, h).normalize()
        }
        j.cross(h, e);
        i[0] = e.x,
            i[4] = j.x,
            i[8] = h.x;
        i[1] = e.y,
            i[5] = j.y,
            i[9] = h.y;
        i[2] = e.z,
            i[6] = j.z,
            i[10] = h.z;
        return this
    }
});
Matrix4.__TEMP__ = new Matrix4().data;
Class(function Vector2(c, a) {
    var d = this;
    var b = Vector2.prototype;
    this.x = typeof c == "number" ? c : 0;
    this.y = typeof a == "number" ? a : 0;
    this.type = "vector2";
    b.set = function(e, f) {
        this.x = e;
        this.y = f;
        return this
    }
    ;
    b.clear = function() {
        this.x = 0;
        this.y = 0;
        return this
    }
    ;
    b.copyTo = function(e) {
        e.x = this.x;
        e.y = this.y;
        return this
    }
    ;
    b.copyFrom = function(e) {
        this.x = e.x;
        this.y = e.y;
        return this
    }
    ;
    b.addVectors = function(f, e) {
        this.x = f.x + e.x;
        this.y = f.y + e.y;
        return this
    }
    ;
    b.subVectors = function(f, e) {
        this.x = f.x - e.x;
        this.y = f.y - e.y;
        return this
    }
    ;
    b.multiplyVectors = function(f, e) {
        this.x = f.x * e.x;
        this.y = f.y * e.y
    }
    ;
    b.add = function(e) {
        this.x += e.x;
        this.y += e.y;
        return this
    }
    ;
    b.sub = function(e) {
        this.x -= e.x;
        this.y -= e.y;
        return this
    }
    ;
    b.multiply = function(e) {
        this.x *= e;
        this.y *= e;
        return this
    }
    ;
    b.divide = function(e) {
        this.x /= e;
        this.y /= e;
        return this
    }
    ;
    b.lengthSq = function() {
        return (this.x * this.x + this.y * this.y) || 0.00001
    }
    ;
    b.length = function() {
        return Math.sqrt(this.lengthSq())
    }
    ;
    b.normalize = function() {
        var e = this.length();
        this.x /= e;
        this.y /= e;
        return this
    }
    ;
    b.perpendicular = function(h, f) {
        var g = this.x;
        var e = this.y;
        this.x = -e;
        this.y = g;
        return this
    }
    ;
    b.lerp = function(e, f) {
        this.x += (e.x - this.x) * f;
        this.y += (e.y - this.y) * f;
        return this
    }
    ;
    b.setAngleRadius = function(e, f) {
        this.x = Math.cos(e) * f;
        this.y = Math.sin(e) * f;
        return this
    }
    ;
    b.addAngleRadius = function(e, f) {
        this.x += Math.cos(e) * f;
        this.y += Math.sin(e) * f;
        return this
    }
    ;
    b.clone = function() {
        return new Vector2(this.x,this.y)
    }
    ;
    b.dot = function(f, e) {
        e = e || this;
        return (f.x * e.x + f.y * e.y)
    }
    ;
    b.distanceTo = function(g, h) {
        var f = this.x - g.x;
        var e = this.y - g.y;
        if (!h) {
            return Math.sqrt(f * f + e * e)
        }
        return f * f + e * e
    }
    ;
    b.solveAngle = function(f, e) {
        if (!e) {
            e = this
        }
        return Math.acos(f.dot(e) / (f.length() * e.length()))
    }
    ;
    b.equals = function(e) {
        return this.x == e.x && this.y == e.y
    }
});
Class(function Vector3(d, b, a, e) {
    var f = this;
    var c = Vector3.prototype;
    this.x = typeof d === "number" ? d : 0;
    this.y = typeof b === "number" ? b : 0;
    this.z = typeof a === "number" ? a : 0;
    this.w = typeof e === "number" ? e : 1;
    this.type = "vector3";
    c.set = function(g, j, i, h) {
        this.x = g || 0;
        this.y = j || 0;
        this.z = i || 0;
        this.w = h || 1;
        return this
    }
    ;
    c.clear = function() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this
    }
    ;
    c.copyTo = function(g) {
        g.x = this.x;
        g.y = this.y;
        g.z = this.z;
        g.w = this.w;
        return g
    }
    ;
    c.copyFrom = function(g) {
        this.x = g.x;
        this.y = g.y;
        this.z = g.z;
        this.w = g.w;
        return this
    }
    ;
    c.lengthSq = function() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }
    ;
    c.length = function() {
        return Math.sqrt(this.lengthSq())
    }
    ;
    c.normalize = function() {
        var g = 1 / this.length();
        this.set(this.x * g, this.y * g, this.z * g);
        return this
    }
    ;
    c.addVectors = function(h, g) {
        this.x = h.x + g.x;
        this.y = h.y + g.y;
        this.z = h.z + g.z;
        return this
    }
    ;
    c.subVectors = function(h, g) {
        this.x = h.x - g.x;
        this.y = h.y - g.y;
        this.z = h.z - g.z;
        return this
    }
    ;
    c.multiplyVectors = function(h, g) {
        this.x = h.x * g.x;
        this.y = h.y * g.y;
        this.z = h.z * g.z;
        return this
    }
    ;
    c.add = function(g) {
        this.x += g.x;
        this.y += g.y;
        this.z += g.z;
        return this
    }
    ;
    c.sub = function(g) {
        this.x -= g.x;
        this.y -= g.y;
        this.z -= g.z;
        return this
    }
    ;
    c.multiply = function(g) {
        this.x *= g;
        this.y *= g;
        this.z *= g;
        return this
    }
    ;
    c.divide = function(g) {
        this.x /= g;
        this.y /= g;
        this.z /= g;
        return this
    }
    ;
    c.lerp = function(g, h) {
        this.x += (g.x - this.x) * h;
        this.y += (g.y - this.y) * h;
        this.z += (g.z - this.z) * h;
        return this
    }
    ;
    c.setAngleRadius = function(g, h) {
        this.x = Math.cos(g) * h;
        this.y = Math.sin(g) * h;
        this.z = Math.sin(g) * h;
        return this
    }
    ;
    c.addAngleRadius = function(g, h) {
        this.x += Math.cos(g) * h;
        this.y += Math.sin(g) * h;
        this.z += Math.sin(g) * h;
        return this
    }
    ;
    c.dot = function(h, g) {
        g = g || this;
        return h.x * g.x + h.y * g.y + h.z * g.z
    }
    ;
    c.clone = function() {
        return new Vector3(this.x,this.y,this.z)
    }
    ;
    c.cross = function(i, h) {
        if (!h) {
            h = this
        }
        var g = i.y * h.z - i.z * h.y;
        var k = i.z * h.x - i.x * h.z;
        var j = i.x * h.y - i.y * h.x;
        this.set(g, k, j, this.w);
        return this
    }
    ;
    c.distanceTo = function(j, k) {
        var i = this.x - j.x;
        var h = this.y - j.y;
        var g = this.z - j.z;
        if (!k) {
            return Math.sqrt(i * i + h * h + g * g)
        }
        return i * i + h * h + g * g
    }
    ;
    c.solveAngle = function(h, g) {
        if (!g) {
            g = this
        }
        return Math.acos(h.dot(g) / (h.length() * g.length()))
    }
    ;
    c.equals = function(g) {
        return this.x == g.x && this.y == g.y && this.z == g.z
    }
});
Class(function Mobile() {
    Inherit(this, Events);
    var e = this;
    var a;
    var i = true;
    var h = {};
    this.sleepTime = 10000;
    if (Device.mobile) {
        setInterval(f, 250);
        this.phone = Device.mobile.phone;
        this.tablet = Device.mobile.tablet;
        this.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
        this.os = (function() {
                if (Device.detect(["ipad", "iphone"])) {
                    return "iOS"
                }
                if (Device.detect(["android", "kindle"])) {
                    return "Android"
                }
                if (Device.detect("windows phone")) {
                    return "Windows"
                }
                if (Device.detect("blackberry")) {
                    return "Blackberry"
                }
                return "Unknown"
            }
        )();
        this.version = (function() {
                try {
                    if (e.os == "iOS") {
                        var l = Device.agent.split("os ")[1].split("_");
                        var j = l[0];
                        var m = l[1].split(" ")[0];
                        return Number(j + "." + m)
                    }
                    if (e.os == "Android") {
                        var k = Device.agent.split("android ")[1].split(";")[0];
                        if (k.length > 3) {
                            k = k.slice(0, -2)
                        }
                        return Number(k)
                    }
                    if (e.os == "Windows") {
                        return Number(Device.agent.split("windows phone ")[1].split(";")[0])
                    }
                } catch (n) {}
                return -1
            }
        )();
        this.browser = (function() {
                if (e.os == "iOS") {
                    return Device.detect("crios") ? "Chrome" : "Safari"
                }
                if (e.os == "Android") {
                    if (Device.detect("chrome")) {
                        return "Chrome"
                    }
                    if (Device.detect("firefox")) {
                        return "Firefox"
                    }
                    return "Browser"
                }
                if (e.os == "Windows") {
                    return "IE"
                }
                return "Unknown"
            }
        )();
        Hydra.ready(function() {
            window.addEventListener("orientationchange", d);
            window.addEventListener("touchstart", c);
            window.addEventListener("touchmove", g);
            window.onresize = b
        });
        function b() {
            if (!e.allowScroll) {
                document.body.scrollTop = 0
            }
            setTimeout(function() {
                Stage.width = window.innerWidth;
                Stage.height = window.innerHeight;
                e.events.fire(HydraEvents.RESIZE)
            }, 100)
        }
        function d() {
            e.orientation = Math.abs(window.orientation) == 90 ? "landscape" : "portrait";
            setTimeout(function() {
                Stage.width = window.innerWidth;
                Stage.height = window.innerHeight;
                HydraEvents._fireEvent(HydraEvents.ORIENTATION, {
                    orientation: e.orientation
                })
            }, 100)
        }
        function c(m) {
            var n = Utils.touchEvent(m);
            var l = m.target;
            var k = l.nodeName == "INPUT" || l.nodeName == "TEXTAREA" || l.nodeName == "SELECT";
            if (e.allowScroll) {
                return
            }
            if (i) {
                return m.preventDefault()
            }
            var j = true;
            var l = m.target;
            while (l.parentNode) {
                if (k) {
                    j = false
                }
                if (l._scrollParent) {
                    j = false;
                    h.target = l;
                    h.y = n.y
                }
                l = l.parentNode
            }
            if (j) {
                m.preventDefault()
            }
        }
        function g(l) {
            var m = Utils.touchEvent(l);
            if (e.allowScroll) {
                return
            }
            if (h.target) {
                var k = h.target;
                var j = k.__scrollHeight || Number((k.style.height || "0px").slice(0, -2));
                k.__scrollheight = j;
                if (m.y < h.y) {
                    if (Math.round(k.scrollTop) == Math.round(j / 2)) {
                        l.preventDefault()
                    }
                } else {
                    if (k.scrollTop == 0) {
                        l.preventDefault()
                    }
                }
            }
        }
    }
    function f() {
        var j = Date.now();
        if (a) {
            if (j - a > e.sleepTime) {
                e.events.fire(HydraEvents.BACKGROUND)
            }
        }
        a = j
    }
    this.Class = window.Class;
    this.fullscreen = function() {
        if (e.os == "Android") {
            __window.bind("touchstart", function() {
                Device.openFullscreen()
            })
        }
    }
    ;
    this.overflowScroll = function(k, j, m) {
        if (!Device.mobile) {
            return false
        }
        var l = {
            "-webkit-overflow-scrolling": "touch"
        };
        if ((!j && !m) || (j && m)) {
            l.overflow = "scroll"
        }
        if (!j && m) {
            l.overflowY = "scroll";
            l.overflowX = "hidden"
        }
        if (j && !m) {
            l.overflowX = "scroll";
            l.overflowY = "hidden"
        }
        k.css(l);
        k.div._scrollParent = true;
        i = false
    }
}, "Static");
Class(function Verlet() {
    Namespace("Verlet", this)
}, "Static");
Verlet.Class(function Physics() {
    Inherit(this, Component);
    var a = this;
    this.behaviors = new LinkedList();
    this.particles = new LinkedList();
    this.springs = new LinkedList();
    this.elasticity = 10;
    (function() {}
    )();
    this.addBehavior = function(c) {
        this.behaviors.push(c)
    }
    ;
    this.removeBehavior = function(c) {
        this.behaviors.remove(c)
    }
    ;
    this.addParticle = function(b) {
        this.particles.push(b)
    }
    ;
    this.removeParticle = function(b) {
        this.particles.remove(b)
    }
    ;
    this.addSpring = function(b) {
        if (!this.getSpring(b.a, b.b)) {
            this.springs.push(b)
        }
    }
    ;
    this.removeSpring = function(b) {
        this.springs.remove(b)
    }
    ;
    this.getSpring = function(d, c) {
        var e = this.springs.start();
        while (e) {
            if ((e.a == d && e.b == c) || (e.a == c && e.b == c)) {
                return e
            }
            e = this.springs.next()
        }
    }
    ;
    this.update = function(b) {
        b = b || 16;
        this.updateParticles(b);
        this.updateSprings(b)
    }
    ;
    this.updateParticles = function(e) {
        var c, d;
        c = this.behaviors.start();
        while (c) {
            d = this.particles.start();
            while (d) {
                c.applyBehavior(d);
                d = this.particles.next()
            }
            c = this.behaviors.next()
        }
        d = this.particles.start();
        while (d) {
            d.update(e);
            d = this.particles.next()
        }
    }
    ;
    this.updateSprings = function(d) {
        for (var b = 0; b < this.elasticity; b++) {
            var c = this.springs.start();
            while (c) {
                c.update(d);
                c = this.springs.next()
            }
        }
    }
});
Verlet.Class(function Particle(h, g, e) {
    Inherit(this, Component);
    var d = this;
    var c = typeof e === "number" ? Vector3 : Vector2;
    Inherit(this, c);
    var i, f, a;
    this.locked = false;
    this.dampening = new c();
    this.velocity = new c();
    this.acceleration = new c();
    this.origin = new c(h,g,e);
    (function() {
            b();
            d.set(h, g, e)
        }
    )();
    function b() {
        i = new c();
        f = new c();
        a = new c()
    }
    this.lock = function() {
        this.locked = true
    }
    ;
    this.unlock = function() {
        this.locked = false
    }
    ;
    this.shift = function() {
        i.copyFrom(this);
        f.copyFrom(this.velocity)
    }
    ;
    this.update = function(j) {
        this.shift();
        if (!this.locked) {
            a.copyFrom(this.dampening).multiply(j);
            this.velocity.add(a);
            this.velocity.add(this.acceleration);
            a.copyFrom(this.velocity).multiply(j);
            this.add(a);
            this.acceleration.clear()
        }
    }
    ;
    this.applyForce = function(j) {
        this.acceleration.add(j)
    }
});
Verlet.Class(function Spring(j, i) {
    Inherit(this, Component);
    var f = this;
    var b;
    var a, k, e, d, h, c;
    this.a = j;
    this.b = i;
    this.tension = 0.5;
    (function() {
            g()
        }
    )();
    function g() {
        var l = j.type == "vector3" ? Vector3 : Vector2;
        a = new l();
        k = new l();
        h = new l();
        e = new l();
        d = new l();
        c = new l();
        b = j.distanceTo(i)
    }
    this.set("distance", function(l) {
        b = l
    });
    this.update = function(l) {
        h.subVectors(i, j).multiply(this.tension);
        a.copyFrom(j).add(h);
        k.subVectors(i, j).normalize();
        c.copyFrom(k);
        k.multiply(-this.tension).multiply(b);
        e.copyFrom(a).add(k);
        k.copyFrom(c);
        k.multiply(1 - this.tension).multiply(b);
        d.copyFrom(a).add(k);
        j.shift();
        i.shift();
        if (!j.locked) {
            h.copyFrom(e);
            h.sub(j).divide(l);
            j.copyFrom(e)
        }
        if (!i.locked) {
            h.copyFrom(d);
            h.sub(i).divide(l);
            i.copyFrom(d)
        }
    }
});
Class(function Spark() {
    Namespace("Spark", this);
    this.determine = function(a) {
        return typeof a.z === "undefined" ? Vector2 : Vector3
    }
}, "Static");
Spark.Class(function Emitter(c) {
    Inherit(this, Component);
    var g = this;
    var d;
    var b = 0;
    var a = (function() {
            if (c) {
                return c.type == "vector3" ? Vector3 : Vector2
            } else {
                return Vector2
            }
        }
    )();
    this.initializers = [];
    this.position = c || new a();
    this.autoEmit = 1;
    (function() {
            f();
            e(100)
        }
    )();
    function f() {
        d = g.initClass(ObjectPool)
    }
    function e(k) {
        b += k;
        var j = [];
        for (var h = 0; h < k; h++) {
            j.push(new Spark.Particle())
        }
        d.insert(j)
    }
    this.addInitializer = function(h) {
        if (typeof h !== "function") {
            throw "Initializer must be a function"
        }
        this.initializers.push(h)
    }
    ;
    this.removeInitializer = function(i) {
        var h = this.initializers.indexOf(i);
        if (h > -1) {
            this.initializers.splice(h, 1)
        }
    }
    ;
    this.emit = function(k) {
        if (k > b) {
            e(k - b)
        }
        if (!this.parent) {
            throw "Emitter needs to be added to a System"
        }
        k = k || 1;
        for (var l = 0; l < k; l++) {
            var m = d.get();
            m.copyFrom(this.position);
            m.emitter = this;
            for (var h = 0; h < this.initializers.length; h++) {
                this.initializers[h](m)
            }
            this.parent.addParticle(m)
        }
    }
    ;
    this.remove = function(h) {
        d.insert(h)
    }
});
Spark.Class(function System() {
    Inherit(this, Component);
    var c = this;
    var a = {};
    this.emitters = new LinkedList();
    this.particles = new LinkedList();
    this.behaviors = new LinkedList();
    (function() {}
    )();
    function b(e) {
        var d = c.behaviors.start();
        while (d) {
            d.applyBehavior(e);
            d = c.behaviors.next()
        }
    }
    this.addEmitter = function(d) {
        if (!(d instanceof Spark.Emitter)) {
            throw "Emitter must be Spark.Emitter"
        }
        this.emitters.push(d);
        d.parent = this
    }
    ;
    this.removeEmitter = function(d) {
        if (!(d instanceof Spark.Emitter)) {
            throw "Emitter must be Spark.Emitter"
        }
        this.emitters.remove(d);
        d.parent = null
    }
    ;
    this.addParticle = function(d) {
        if (!(d instanceof Spark.Particle)) {
            throw "Particle must be Spark.Particle"
        }
        this.particles.push(d);
        if (a.create) {
            a.create(d)
        }
        d.system = this
    }
    ;
    this.removeParticle = function(d) {
        if (!(d instanceof Spark.Particle)) {
            throw "Particle must be Spark.Particle"
        }
        if (d.emitter) {
            d.emitter.remove(d)
        }
        this.particles.remove(d);
        if (a.destroy) {
            a.destroy(d)
        }
        d.system = null
    }
    ;
    this.addBehavior = function(d) {
        if (!d || typeof d.applyBehavior === "undefined") {
            throw "Behavior must have applyBehavior method"
        }
        this.behaviors.push(d);
        d.system = this
    }
    ;
    this.removeBehavior = function(d) {
        if (!d || typeof d.applyBehavior === "undefined") {
            throw "Behavior must have applyBehavior method"
        }
        this.behaviors.remove(d);
        d.system = null
    }
    ;
    this.update = function() {
        var d = this.particles.start();
        while (d) {
            b(d);
            d.update();
            if (a.update) {
                a.update(d)
            }
            d = this.particles.next()
        }
    }
    ;
    this.bind = function(d, e) {
        a[d] = e
    }
    ;
    this.unbind = function(d) {
        delete a[d]
    }
});
Spark.Class(function Particle(e, c, b) {
    var f = this;
    var a = typeof b === "number" ? Vector3 : Vector2;
    var d = Particle.prototype;
    Inherit(this, a);
    this.set(e, c, b);
    this.velocity = new a();
    this.acceleration = new a();
    this.behaviors = new LinkedList();
    d.update = function() {
        this.updateBehaviors();
        this.velocity.add(this.acceleration);
        this.add(this.velocity);
        this.acceleration.clear()
    }
    ;
    d.updateBehaviors = function() {
        var g = this.behaviors.start();
        while (g) {
            var h = this.system.particles.start(f);
            while (h) {
                if (h != this) {
                    g.applyBehavior(h)
                }
                h = this.system.particles.next(f)
            }
            g = this.behaviors.next()
        }
    }
    ;
    d.applyForce = function(g) {
        this.acceleration.add(g)
    }
    ;
    d.addBehavior = function(g) {
        if (!g || typeof g.applyBehavior === "undefined") {
            throw "Behavior must have applyBehavior method"
        }
        if (g.position) {
            g.position = this
        }
        this.behaviors.push(g)
    }
    ;
    d.removeBehavior = function(g) {
        if (!g || typeof g.applyBehavior === "undefined") {
            throw "Behavior must have applyBehavior method"
        }
        this.behaviors.remove(g)
    }
    ;
    d.destroy = function() {
        if (this.system) {
            this.system.removeParticle(this)
        }
    }
});
Spark.Class(function BasicBehavior() {
    var g = this;
    var e;
    var a;
    this.bounds = {};
    this.friction = 1;
    this.collision = false;
    this.snapOrigin = false;
    (function() {}
    )();
    function c(i) {
        var h = g.bounds;
        if (!h) {
            return
        }
        if (h.width && h.height) {
            if (i.x < h.x) {
                i.x = h.x;
                i.velocity.x *= -g.bounds.friction || -1
            } else {
                if (i.x > h.width) {
                    i.x = h.width;
                    i.velocity.x *= -g.bounds.friction || -1
                }
            }
            if (i.y < h.y) {
                i.y = h.y;
                i.velocity.y *= -g.bounds.friction || -1
            } else {
                if (i.y > h.height) {
                    i.y = h.height;
                    i.velocity.y *= -g.bounds.friction || -1
                }
            }
            if (h.depth) {
                if (i.z < h.z) {
                    i.z = h.z;
                    i.velocity.z *= -g.bounds.friction || -1
                } else {
                    if (i.z > h.depth) {
                        i.z = h.depth;
                        i.velocity.z *= -g.bounds.friction || -1
                    }
                }
            }
        }
    }
    function d(h) {
        h.velocity.multiply(g.friction)
    }
    function f(i) {
        if (!g.collision) {
            return
        }
        i.radius = i.radius || 1;
        var h = g.system.particles;
        var k = h.start(g);
        while (k) {
            k.radius = k.radius || 1;
            var j = i.radius + k.radius;
            e.subVectors(k, i);
            if (e.length() < j) {
                i.velocity.multiply(-1);
                k.velocity.multiply(-1);
                i.update();
                k.update()
            }
            k = h.next(g)
        }
    }
    function b(h) {
        if (!g.snapOrigin) {
            return
        }
        if (!h.origin) {
            h.origin = new a();
            h.origin.copyFrom(h)
        }
        e.subVectors(h.origin, h).multiply(g.snapOrigin);
        h.applyForce(e)
    }
    this.applyBehavior = function(h) {
        if (!e) {
            a = Spark.determine(h);
            e = new a()
        }
        c(h);
        d(h);
        f(h);
        b(h)
    }
});
Spark.Class(function Attractor(b, c, d) {
    Inherit(this, Component);
    var h = this;
    var a = b.type == "vector2" ? Vector2 : Vector3;
    var g = new a();
    c = c || 100;
    d = d || 1000;
    var e = d * d;
    var f = 0;
    this.position = b || new a();
    this.clamp = 100;
    this.enabled = true;
    (function() {}
    )();
    this.get("force", function() {
        return c
    });
    this.set("force", function(i) {
        c = i
    });
    this.get("radius", function() {
        return d
    });
    this.set("radius", function(i) {
        d = i;
        e = i * i
    });
    this.applyBehavior = function(j) {
        if (!this.enabled) {
            return false
        }
        g.copyFrom(this.position);
        g.sub(j);
        f = g.lengthSq();
        if (f > 0.00004 && f < e) {
            var i = f / e;
            g.normalize();
            g.multiply(1 - f / e);
            g.multiply(c);
            j.applyForce(g)
        }
    }
});
Spark.Class(function Spring(c) {
    var f = this;
    var a;
    var e;
    this.position = c;
    this.minDist = 10;
    this.mass = 1;
    this.direction = -1;
    this.affectAll = true;
    this.dampening = 0.02;
    this.friction = 1;
    (function() {}
    )();
    function b(g) {
        if (typeof g.origin === "undefined") {
            g.origin = new a();
            g.origin.copyFrom(g);
            g.force = new a();
            g.minDist = g.minDist || f.minDist;
            g.minDistSq = g.minDist * g.minDist;
            g.mass = g.mass || f.mass
        }
    }
    function d(j) {
        e.subVectors(j, f.position);
        var h = e.lengthSq();
        var i = h / j.minDistSq;
        i = Utils.clamp(i, 0, 1);
        i = i * f.direction;
        var g = j.solveAngle(f.position);
        if (f.affectAll || h < j.minDistSq) {
            j.force.addAngleRadius(g, i);
            e.subVectors(j.origin, j).multiply(f.dampening).multiply(j.mass);
            j.force.add(e).divide(j.mass);
            j.applyForce(j.force)
        }
        j.multiply(f.friction);
        j.force.multiply(0)
    }
    this.applyBehavior = function(g) {
        if (!e) {
            a = Spark.determine(g);
            e = new a();
            if (!f.position) {
                f.position = new a()
            }
        }
        b(g);
        d(g)
    }
});
Spark.Class(function Force(a) {
    var b = this;
    this.force = a;
    (function() {
            if (!a.type || !a.type.strpos("vector")) {
                throw "Spark.Force must be Vector"
            }
        }
    )();
    this.applyBehavior = function(c) {
        c.applyForce(this.force)
    }
});
Class(function D3() {
    Namespace("D3", this);
    this.CSS3D = Device.tween.css3d;
    this.m4v31 = new Vector3();
    this.m4v32 = new Vector3();
    this.m4v33 = new Vector3();
    this.UP = new Vector3(0,1,0);
    this.FWD = new Vector3(0,0,-1);
    this.translate = function(a, c, b) {
        a = typeof a == "string" ? a : (a || 0) + "px";
        c = typeof c == "string" ? c : (c || 0) + "px";
        b = typeof b == "string" ? b : (b || 0) + "px";
        if (Device.browser.ie) {
            a = 0;
            c = 0
        }
        return "translate3d(" + a + "," + c + "," + b + ")"
    }
}, "Static");
D3.Class(function Camera(c, b, a) {
    Inherit(this, D3.Object3D);
    var d = this;
    this.inverseWorldMatrix = new Matrix4();
    (function() {
            Render.nextFrame(function() {
                d.scene.setProjection(c, b, a)
            })
        }
    )();
    this.set("fov", function(e) {
        c = e;
        d.scene.setProjection(c, b, a)
    });
    this.computeInverseMatrix = function() {
        this.worldMatrix.inverse(this.inverseWorldMatrix);
        return this.inverseWorldMatrix
    }
    ;
    this.render = function() {}
});
D3.Class(function Material(o) {
    Inherit(this, Component);
    var k = this;
    var f, m;
    var d, n, g, e, b, h, j;
    var c = true;
    this.material = o;
    this.width = o.width;
    this.height = o.height;
    (function() {
            i();
            l()
        }
    )();
    function i() {
        j = new Vector3();
        h = new Vector3();
        if (Device.browser.ie) {
            o.css({
                marginLeft: -o.width / 2,
                marginTop: -o.height / 2
            })
        }
        if (D3.CSS3D) {
            return false
        }
        d = new Matrix2();
        n = new Matrix4();
        g = new Vector3()
    }
    function l() {
        m = o.element || o;
        if (o.element) {
            Render.nextFrame(function() {
                o.material = k;
                o.object = k.object
            })
        }
    }
    function a(q) {
        if (k.object._scene.fog) {
            var s = k.object._scene.fog;
            h.subVectors(q.camera.position, j);
            var t = h.length();
            if (t > s) {
                var p = (s * 2) - s;
                t -= s;
                var r = Utils.convertRange(t, 0, p, 0, 1);
                r = Utils.clamp(r, 0, 1);
                e = 1 - r;
                m.div.style.opacity = e
            } else {
                if (e < 1) {
                    m.div.style.opacity = 1;
                    e = 1
                }
            }
        }
    }
    this.set("visible", function(p) {
        c = p;
        if (p) {
            o.show()
        } else {
            o.hide()
        }
    });
    this.draw = function(p) {
        p.renderer.addChild(o)
    }
    ;
    this.remove = function() {
        if (o.destroy) {
            o.destroy()
        } else {
            if (o.remove) {
                o.remove(true)
            }
        }
    }
    ;
    this.render = function(q) {
        if (!c) {
            return
        }
        k.object.worldMatrix.extractPosition(j);
        a(q);
        if (D3.CSS3D) {
            var w = D3.translate("-50%", "-50%", q.cssDistance);
            var v = "perspective(" + q.cssDistance + "px)";
            var s = w + " " + k.object.viewMatrix.getCSS();
            if (Device.browser.ie) {
                m.matrix(v + s)
            } else {
                m.matrix(s)
            }
        } else {
            q.projection.copyTo(n);
            n.multiply(k.object.viewMatrix);
            g.set(0, 0, 0);
            n.transformVector(g);
            g.x = g.x / g.z * q.centerX;
            g.y = g.y / g.z * q.centerY;
            var u = 1 / (g.z / q.cssDistance);
            var r = k.object.rotation.z;
            d.setTRS(g.x, g.y, r, u, u);
            h.subVectors(q.camera.position, j);
            var t = h.length();
            o.setZ(~~(999999 - t)).matrix("translate(-50%, -50%) " + d.getCSS());
            if (g.z <= 0 && !o._meshHidden) {
                o._meshHidden = true;
                o.hide()
            } else {
                if (g.z > 0 && o._meshHidden) {
                    o._meshHidden = false;
                    o.show()
                }
            }
        }
    }
});
D3.Class(function Object3D(f) {
    Inherit(this, Component);
    var h = this;
    var g, c, e;
    var a = true;
    var b = new Matrix4();
    var d = new Vector3();
    this.id = Utils.timestamp();
    this.directMatrix = false;
    this.billboard = false;
    this.material = f || null;
    this.position = new Vector3(0,0,0);
    this.rotation = new Vector3(0,0,0);
    this.scale = new Vector3(1,1,1);
    this.matrix = new Matrix4();
    this.worldMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.children = new LinkedList();
    (function() {
            if (h.material) {
                h.material.object = h
            }
        }
    )();
    this.get("numChildren", function() {
        return h.children.length
    });
    this.get("depth", function() {
        return h.viewMatrix.data[14]
    });
    this.get("globalPosition", function() {
        h.worldMatrix.extractPosition(d);
        return d
    });
    this.get("enabled", function() {
        return a
    });
    this.set("enabled", function(i) {
        a = i;
        if (h.material) {
            h.material.visibility(a)
        }
        var j = h.children.start();
        while (j) {
            j.enabled = i;
            j = h.children.next()
        }
    });
    this.set("scene", function(i) {
        if (!i) {
            return false
        }
        e = h._scene = i;
        if (h.material) {
            h.material.draw(i)
        }
    });
    this.add = function(i) {
        if (!(i instanceof D3.Object3D)) {
            throw "Can only add D3.Object3D"
        }
        i._parent = this;
        this.children.push(i);
        Render.nextFrame(function() {
            i.scene = e
        })
    }
    ;
    this.remove = function(i) {
        if (!(i instanceof D3.Object3D)) {
            throw "Can only remove D3.Object3D"
        }
        i._parent = null;
        i.removed();
        this.children.remove(i)
    }
    ;
    this.removed = function() {
        if (this.material) {
            this.material.remove()
        }
    }
    ;
    this.empty = function() {
        var i = this.children.start();
        while (i) {
            i._parent = null;
            i.removed();
            i = this.children.next()
        }
        this.children.empty()
    }
    ;
    this.updateMatrix = function() {
        if (!this.directMatrix) {
            var k = this.position;
            var j = this.rotation;
            var i = this.scale;
            this.matrix.setTRS(k.x, k.y, k.z, j.x, j.y, j.z, i.x, i.y, i.z)
        }
        if (g) {
            this.matrix.lookAt(g, D3.UP)
        }
        if (this._parent && this._parent.worldMatrix) {
            this._parent.worldMatrix.copyTo(this.worldMatrix);
            this.worldMatrix.multiply(this.matrix)
        } else {
            this.matrix.copyTo(this.worldMatrix)
        }
        if (c) {
            this.worldMatrix.lookAt(c.globalPosition, D3.UP)
        }
        var l = this.children.start();
        while (l) {
            l.updateMatrix();
            l = this.children.next()
        }
    }
    ;
    this.updateView = function(i) {
        if (!a) {
            return false
        }
        if (this.billboard) {
            i.copyTo(b);
            b.transpose();
            b.copyPosition(this.worldMatrix);
            b.scale(this.scale.x, this.scale.y, this.scale.z);
            b.data[3] = 0;
            b.data[7] = 0;
            b.data[11] = 0;
            b.data[15] = 1;
            b.copyTo(this.worldMatrix)
        }
        i.copyTo(this.viewMatrix);
        this.viewMatrix.multiply(this.worldMatrix);
        var j = this.children.start();
        while (j) {
            j.updateView(i);
            j = this.children.next()
        }
    }
    ;
    this.render = function(i) {
        if (!a) {
            return false
        }
        if (this.material) {
            this.material.render(i)
        }
        var j = this.children.start();
        while (j) {
            j.render(i);
            j = this.children.next()
        }
    }
    ;
    this.lookAt = function(i) {
        if (i instanceof Vector3) {
            g = i
        } else {
            c = i
        }
    }
    ;
    this.destroy = function() {
        this.empty();
        if (this._parent) {
            this._parent.remove(this)
        }
        return this._destroy()
    }
});
D3.Class(function PerspectiveProjection() {
    var c = this;
    var b = PerspectiveProjection.prototype;
    this.data = new Float32Array(16);
    (function() {
            a()
        }
    )();
    function a() {
        var d = c.data;
        d[0] = 1,
            d[1] = 0,
            d[2] = 0,
            d[3] = 0;
        d[4] = 0,
            d[5] = 1,
            d[6] = 0,
            d[7] = 0;
        d[8] = 0,
            d[9] = 0,
            d[10] = 1,
            d[11] = 0;
        d[12] = 0,
            d[13] = 0,
            d[14] = 0,
            d[15] = 1
    }
    b.identity = function() {
        a();
        return this
    }
    ;
    b.perspective = function(g, f, i, e) {
        var d = this.data;
        var h = i * Math.tan(g * Math.PI / 360);
        var j = e - i;
        d[0] = i / (h * f);
        d[4] = 0;
        d[8] = 0;
        d[12] = 0;
        d[1] = 0;
        d[5] = i / h;
        d[9] = 0;
        d[13] = 0;
        d[2] = 0;
        d[6] = 0;
        d[10] = -(e + i) / j;
        d[14] = -(2 * e * i) / j;
        d[3] = 0;
        d[7] = 0;
        d[11] = -1;
        d[15] = 0
    }
    ;
    b.transformVector = function(g, h) {
        var e = g.x
            , j = g.y
            , i = g.z
            , f = g.w;
        var d = this.data;
        h = h || g;
        h.x = d[0] * e + d[4] * j + d[8] * i + d[12] * f;
        h.y = d[1] * e + d[5] * j + d[9] * i + d[13] * f;
        h.z = d[2] * e + d[6] * j + d[10] * i + d[14] * f;
        return h
    }
    ;
    b.inverse = function(x) {
        var A = this.data;
        x = x || this.data;
        var I = A[0], G = A[1], F = A[2], D = A[3], h = A[4], g = A[5], f = A[6], e = A[7], w = A[8], v = A[9], u = A[10], t = A[11], K = A[12], J = A[13], H = A[14], E = A[15], s = I * g - G * h, r = I * f - F * h, q = I * e - D * h, p = G * f - F * g, o = G * e - D * g, n = F * e - D * f, l = w * J - v * K, k = w * H - u * K, j = w * E - t * K, i = v * H - u * J, C = v * E - t * J, z = u * E - t * H, B = (s * z - r * C + q * i + p * j - o * k + n * l), y;
        if (!B) {
            return null
        }
        x[0] = (g * z - f * C + e * i) * y;
        x[1] = (-G * z + F * C - D * i) * y;
        x[2] = (J * n - H * o + E * p) * y;
        x[3] = (-v * n + u * o - t * p) * y;
        x[4] = (-h * z + f * j - e * k) * y;
        x[5] = (I * z - F * j + D * k) * y;
        x[6] = (-K * n + H * q - E * r) * y;
        x[7] = (w * n - u * q + t * r) * y;
        x[8] = (h * C - g * j + e * l) * y;
        x[9] = (-I * C + G * j - D * l) * y;
        x[10] = (K * o - J * q + E * s) * y;
        x[11] = (-w * o + v * q - t * s) * y;
        x[12] = (-h * i + g * k - f * l) * y;
        x[13] = (I * i - G * k + F * l) * y;
        x[14] = (-K * p + J * r - H * s) * y;
        x[15] = (w * p - v * r + u * s) * y;
        return x
    }
    ;
    b.copyTo = function(e) {
        var f = this.data;
        var d = e.data || e;
        for (var g = 0; g < 16; g++) {
            d[g] = f[g]
        }
        return e
    }
});
D3.Class(function Scene(k, e) {
    Inherit(this, Component);
    var g = this;
    var l;
    var m, b;
    var i, c, j, h;
    this.children = new LinkedList();
    this.center = new Vector3(0,0,0);
    (function() {
            d();
            a();
            f()
        }
    )();
    function d() {
        if (!k || !e) {
            throw "D3.Scene requires width, height"
        }
        m = $("#Scene3D");
        b = m.create("Renderer");
        b.center();
        g.container = m;
        g.renderer = b
    }
    function a() {
        l = {};
        l.projection = new D3.PerspectiveProjection();
        l.scene = g;
        g.uniforms = l
    }
    function f() {
        l.width = k;
        l.height = e;
        l.aspect = k / e;
        l.centerX = k / 2;
        l.centerY = e / 2;
        m.size(k, e)
    }
    this.get("numChildren", function() {
        return g.children.length
    });
    this.get("distance", function() {
        return l.cssDistance
    });
    this.setProjection = function(o, p, n) {
        i = o || (i || 30);
        c = p || 0.1;
        j = n || 1000;
        l.cssDistance = 0.5 / Math.tan(i * Math.PI / 360) * l.height;
        l.projection.perspective(i, l.width / l.height, c, j);
        if (m) {
            m.div.style[CSS.prefix("Perspective")] = l.cssDistance + "px";
            b.div.style[CSS.prefix("TransformStyle")] = "preserve-3d"
        }
    }
    ;
    this.resize = function(n, o) {
        k = n;
        e = o;
        f();
        g.setProjection()
    }
    ;
    this.add = function(n) {
        if (!(n instanceof D3.Object3D) && !(n instanceof D3.Camera)) {
            throw "Can only add D3.Object3D"
        }
        n._parent = this;
        n.scene = this;
        this.children.push(n)
    }
    ;
    this.remove = function(n) {
        if (!(n instanceof D3.Object3D) && !(n instanceof D3.Camera)) {
            throw "Can only remove D3.Object3D"
        }
        n.removed();
        n._parent = null;
        this.children.remove(n)
    }
    ;
    this.empty = function() {
        var n = this.children.start();
        while (n) {
            n.removed();
            n = this.children.next()
        }
        this.children.empty()
    }
    ;
    this.render = function(n) {
        n.updateMatrix();
        l.camera = n;
        l.viewMatrix = n.computeInverseMatrix();
        var o = this.children.start();
        while (o) {
            o.updateMatrix();
            o.updateView(l.viewMatrix);
            o.render(l);
            o = this.children.next()
        }
    }
});
Class(function SplitTextfield(e, b) {
    Inherit(this, Component);
    var c = new Array();
    (function() {
            switch (b) {
                case "word":
                    a();
                    break;
                default:
                    d();
                    break
            }
        }
    )();
    function d() {
        var j = e.div.innerHTML;
        var g = j.split("");
        e.div.innerHTML = "";
        for (var f = 0; f < g.length; f++) {
            if (g[f] == " ") {
                g[f] = "&nbsp;"
            }
            var h = $(null, "span");
            h.html(g[f]).css({
                display: "block",
                position: "relative",
                padding: 0,
                margin: 0,
                cssFloat: "left",
                styleFloat: "left"
            });
            c.push(h);
            e.addChild(h)
        }
        return c
    }
    function a() {
        var k = e.div.innerHTML;
        var g = k.split(" ");
        e.empty();
        for (var f = 0; f < g.length; f++) {
            var j = $(null, "span");
            var h = $(null, "span");
            j.html(g[f]).css({
                display: "block",
                position: "relative",
                padding: 0,
                margin: 0,
                cssFloat: "left",
                styleFloat: "left"
            });
            h.html("&nbsp").css({
                display: "block",
                position: "relative",
                padding: 0,
                margin: 0,
                cssFloat: "left",
                styleFloat: "left"
            });
            c.push(j);
            c.push(h);
            e.addChild(j);
            e.addChild(h)
        }
        return c
    }
    this.getArray = function() {
        return c
    }
});
Class(function CSSAnimation(a) {
    Inherit(this, Component);
    var i = this;
    var m = "a" + Utils.timestamp();
    var d, g, j;
    var h = 1000;
    var b = "linear";
    var e = false;
    var k = 1;
    var n = null;
    (function() {}
    )();
    function c() {
        i.playing = false;
        if (i.events) {
            i.events.fire(HydraEvents.COMPLETE, null, true)
        }
    }
    function f() {
        var t = CSS._read();
        var o = "/*" + m + "*/";
        var C = "@-" + Device.vendor + "-keyframes " + m + " {\n";
        var u = o + C;
        if (t.strpos(m)) {
            var w = t.split(o);
            t = t.replace(o + w[1] + o, "")
        }
        var y = d.length - 1;
        var z = Math.round(100 / y);
        var x = 0;
        for (var s = 0; s < d.length; s++) {
            var q = d[s];
            if (s == d.length - 1) {
                x = 100
            }
            u += (q.percent || x) + "% {\n";
            var p = false;
            var v = {};
            var B = {};
            for (var A in q) {
                if (TweenManager.checkTransform(A)) {
                    v[A] = q[A];
                    p = true
                } else {
                    B[A] = q[A]
                }
            }
            if (p) {
                u += "-" + Device.vendor + "-transform: " + TweenManager.parseTransform(v) + ";"
            }
            for (A in B) {
                var r = B[A];
                if (typeof r !== "string" && A != "opacity" && A != "zIndex") {
                    r += "px"
                }
                u += CSS._toCSS(A) + ": " + r + ";"
            }
            u += "\n}\n";
            x += z
        }
        u += "}" + o;
        t += u;
        CSS._write(t)
    }
    function l() {
        var p = CSS._read();
        var q = "/*" + m + "*/";
        if (p.strpos(m)) {
            var o = p.split(q);
            p = p.replace(q + o[1] + q, "")
        }
        CSS._write(p)
    }
    this.set("frames", function(o) {
        d = o;
        f()
    });
    this.set("steps", function(o) {
        n = o;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationTimingFunction")] = "steps(" + o + ")"
        }
    });
    this.set("duration", function(o) {
        h = Math.round(o);
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationDuration")] = i.duration + "ms"
        }
    });
    this.get("duration", function() {
        return h
    });
    this.set("ease", function(o) {
        b = o;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationTimingFunction")] = TweenManager.getEase(b)
        }
    });
    this.get("ease", function() {
        return b
    });
    this.set("loop", function(o) {
        e = o;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k
        }
    });
    this.get("loop", function() {
        return e
    });
    this.set("count", function(o) {
        k = o;
        if (i.playing && a) {
            a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k
        }
    });
    this.get("count", function() {
        return k
    });
    this.play = function() {
        a.div.style[CSS.prefix("AnimationName")] = m;
        a.div.style[CSS.prefix("AnimationDuration")] = i.duration + "ms";
        a.div.style[CSS.prefix("AnimationTimingFunction")] = n ? "steps(" + n + ")" : TweenManager.getEase(b);
        a.div.style[CSS.prefix("AnimationIterationCount")] = e ? "infinite" : k;
        a.div.style[CSS.prefix("AnimationPlayState")] = "running";
        i.playing = true;
        clearTimeout(g);
        if (!i.loop) {
            j = Date.now();
            g = setTimeout(c, k * h)
        }
    }
    ;
    this.pause = function() {
        i.playing = false;
        clearTimeout(g);
        a.div.style[CSS.prefix("AnimationPlayState")] = "paused"
    }
    ;
    this.stop = function() {
        i.playing;
        clearTimeout(g);
        a.div.style[CSS.prefix("AnimationName")] = ""
    }
    ;
    this.destroy = function() {
        this.stop();
        a = d = null;
        l();
        return this._destroy()
    }
});
Class(function Warp(i) {
    Inherit(this, Component);
    var d = this;
    var j;
    this.points = [{
        x: 0,
        y: 0
    }, {
        x: 0,
        y: 0
    }, {
        x: 0,
        y: 0
    }, {
        x: 0,
        y: 0
    }];
    this.tl = this.points[0];
    this.tr = this.points[1];
    this.bl = this.points[2];
    this.br = this.points[3];
    function e() {
        if (d.points[1].x == 0) {
            d.points[1].x = d.width
        }
        if (d.points[2].y == 0) {
            d.points[2].y = d.height
        }
        if (d.points[3].x == 0) {
            d.points[3].x = d.width
        }
        if (d.points[3].y == 0) {
            d.points[3].y = d.height
        }
    }
    function h(v, k, A, p, B, q, n, x, o, y, u, l, w, m, C, r) {
        var t = b(v, k, B, q, o, y, w, m);
        var z = b(A, p, n, x, u, l, C, r);
        return f(z, g(t))
    }
    function b(n, s, l, r, k, q, u, p) {
        var o = [n, l, k, s, r, q, 1, 1, 1];
        var t = c(g(o), [u, p, 1]);
        return f(o, [t[0], 0, 0, 0, t[1], 0, 0, 0, t[2]])
    }
    function g(k) {
        return [k[4] * k[8] - k[5] * k[7], k[2] * k[7] - k[1] * k[8], k[1] * k[5] - k[2] * k[4], k[5] * k[6] - k[3] * k[8], k[0] * k[8] - k[2] * k[6], k[2] * k[3] - k[0] * k[5], k[3] * k[7] - k[4] * k[6], k[1] * k[6] - k[0] * k[7], k[0] * k[4] - k[1] * k[3]]
    }
    function f(m, l) {
        var r = Array(9);
        for (var q = 0; q != 3; ++q) {
            for (var o = 0; o != 3; ++o) {
                var p = 0;
                for (var n = 0; n != 3; ++n) {
                    p += m[3 * q + n] * l[3 * n + o]
                }
                r[3 * q + o] = p
            }
        }
        return r
    }
    function c(k, l) {
        return [k[0] * l[0] + k[1] * l[1] + k[2] * l[2], k[3] * l[0] + k[4] * l[1] + k[5] * l[2], k[6] * l[0] + k[7] * l[1] + k[8] * l[2]]
    }
    function a(v, u, o) {
        var m = v[0].x;
        var s = v[0].y;
        var l = v[1].x;
        var r = v[1].y;
        var k = v[2].x;
        var q = v[2].y;
        var y = v[3].x;
        var p = v[3].y;
        var x = h(0, 0, m, s, u, 0, l, r, 0, o, k, q, u, o, y, p);
        for (var n = 0; n < 9; n++) {
            x[n] = x[n] / x[8]
        }
        x = [x[0], x[3], 0, x[6], x[1], x[4], 0, x[7], 0, 0, 1, 0, x[2], x[5], 0, x[8]];
        x = "matrix3d(" + x.join(", ") + ")";
        return x
    }
    (function() {}
    )();
    this.render = function(k) {
        if (k - j < 5 || !d.points) {
            return false
        }
        j = k;
        if (!d.width) {
            d.width = i.width;
            d.height = i.height;
            i.transformPoint(0, 0);
            if (!d.width) {
                throw "Warp requires width and height"
            }
            e()
        }
        i.div.style[CSS.prefix("Transform")] = a(d.points, d.width, d.height)
    }
    ;
    this.tween = function(k, n, q, r, m, l) {
        if (!this.points) {
            return
        }
        if (typeof m !== "number") {
            l = m;
            m = 0
        }
        var o;
        switch (k) {
            case "tl":
                o = this.points[0];
                break;
            case "tr":
                o = this.points[1];
                break;
            case "bl":
                o = this.points[2];
                break;
            case "br":
                o = this.points[3];
                break;
            default:
                throw k + "not found on WarpView. Only tl, tr, bl, br accepted.";
                break
        }
        return TweenManager.tween(o, n, q, r, m, l, this.render)
    }
});
Class(function Canvas(c, e, j) {
    Inherit(this, Component);
    var g = this;
    var n, d, h;
    this.children = [];
    this.offset = {
        x: 0,
        y: 0
    };
    this.retina = j;
    (function() {
            if (j instanceof HydraObject) {
                k(j)
            } else {
                f()
            }
            g.width = c;
            g.height = e;
            g.context._matrix = new Matrix2();
            a(c, e, j)
        }
    )();
    function k() {
        var o = "c" + Utils.timestamp();
        g.context = document.getCSSCanvasContext("2d", o, c, e);
        g.background = "-" + Device.styles.vendor.toLowerCase() + "-canvas(" + o + ")";
        j.css({
            backgroundImage: g.background
        });
        j = null
    }
    function f() {
        g.div = document.createElement("canvas");
        g.context = g.div.getContext("2d");
        g.object = $(g.div)
    }
    function a(o, r, p) {
        var q = (p ? (window.devicePixelRatio || 1) : 1);
        if (g.div) {
            g.div.width = o * q;
            g.div.height = r * q
        }
        g.width = o;
        g.height = r;
        g.scale = q;
        if (g.object) {
            g.object.size(g.width, g.height)
        }
        if (Device.system.retina && p) {
            g.context.scale(q, q);
            g.div.style.width = o + "px";
            g.div.style.height = r + "px"
        }
    }
    function m(q) {
        q = Utils.touchEvent(q);
        q.x += g.offset.x;
        q.y += g.offset.y;
        q.width = 1;
        q.height = 1;
        for (var o = g.children.length - 1; o > -1; o--) {
            var p = g.children[o].hit(q);
            if (p) {
                return p
            }
        }
        return false
    }
    function b(p) {
        var o = m(p);
        if (!o) {
            return g.interacting = false
        }
        g.interacting = true;
        h = o;
        if (Device.mobile) {
            o.events.fire(HydraEvents.HOVER, {
                action: "over"
            }, true);
            o.__time = Date.now()
        }
    }
    function i(p) {
        var o = m(p);
        if (o) {
            g.interacting = true
        } else {
            g.interacting = false
        }
        if (!Device.mobile) {
            if (o && d) {
                if (o != d) {
                    d.events.fire(HydraEvents.HOVER, {
                        action: "out"
                    }, true);
                    o.events.fire(HydraEvents.HOVER, {
                        action: "over"
                    }, true);
                    d = o
                }
            } else {
                if (o && !d) {
                    d = o;
                    o.events.fire(HydraEvents.HOVER, {
                        action: "over"
                    }, true)
                } else {
                    if (!o && d) {
                        if (d) {
                            d.events.fire(HydraEvents.HOVER, {
                                action: "out"
                            }, true)
                        }
                        d = null
                    }
                }
            }
        }
    }
    function l(p) {
        var o = m(p);
        if (o) {
            g.interacting = true
        } else {
            g.interacting = false
        }
        if (!h && !o) {
            return
        }
        if (!Device.mobile) {
            if (o && o == h) {
                o.events.fire(HydraEvents.CLICK, {
                    action: "click"
                }, true)
            }
        } else {
            if (h) {
                h.events.fire(HydraEvents.HOVER, {
                    action: "out"
                }, true)
            }
            if (o == h) {
                if (Date.now() - h.__time < 750) {
                    o.events.fire(HydraEvents.CLICK, {
                        action: "click"
                    }, true)
                }
            }
        }
        h = null
    }
    this.set("interactive", function(o) {
        if (!n && o) {
            Stage.bind("touchstart", b);
            Stage.bind("touchmove", i);
            Stage.bind("touchend", l)
        } else {
            if (n && !o) {
                Stage.unbind("touchstart", b);
                Stage.unbind("touchmove", i);
                Stage.unbind("touchend", l)
            }
        }
        n = o
    });
    this.get("interactive", function() {
        return n
    });
    this.toDataURL = function() {
        return g.div.toDataURL()
    }
    ;
    this.sort = function() {
        _objects.sort(function(p, o) {
            return p.z - o.z
        })
    }
    ;
    this.render = function(q) {
        if (!(typeof q === "boolean" && q)) {
            g.clear()
        }
        var o = g.children.length;
        for (var p = 0; p < o; p++) {
            g.children[p].render()
        }
    }
    ;
    this.clear = function() {
        g.context.clearRect(0, 0, g.div.width, g.div.height)
    }
    ;
    this.add = function(o) {
        o._canvas = this;
        o._parent = this;
        this.children.push(o);
        o._z = this.children.length
    }
    ;
    this.remove = function(p) {
        p._canvas = null;
        p._parent = null;
        var o = this.children.indexOf(p);
        if (o) {
            this.children.splice(o, 1)
        }
    }
    ;
    this.destroy = function() {
        for (var o = 0; o < this.children.length; o++) {
            if (this.children[o].destroy) {
                this.children[o].destroy()
            }
        }
        return this._destroy()
    }
    ;
    this.startRender = function() {
        Render.startRender(g.render)
    }
    ;
    this.stopRender = function() {
        Render.stopRender(g.render)
    }
    ;
    this.texture = function(p) {
        var o = new Image();
        o.src = p;
        return o
    }
    ;
    this.size = a
});
Class(function CanvasTexture(a, b, d) {
    Inherit(this, CanvasObject);
    var f = this;
    var e;
    this.width = b || 0;
    this.height = d || 0;
    (function() {
            c()
        }
    )();
    function c() {
        if (typeof a === "string") {
            var g = a;
            a = new Image();
            a.src = g;
            a.onload = function() {
                if (!f.width && !f.height) {
                    f.width = a.width / (f._canvas && f._canvas.retina ? 2 : 1);
                    f.height = a.height / (f._canvas && f._canvas.retina ? 2 : 1)
                }
            }
        }
        f.texture = a
    }
    this.draw = function(h) {
        var g = this._canvas.context;
        if (this.isMask() && !h) {
            return false
        }
        if (a) {
            this.startDraw(this.anchor.tx, this.anchor.ty);
            g.drawImage(a, -this.anchor.tx, -this.anchor.ty, this.width, this.height);
            this.endDraw()
        }
        if (e) {
            g.globalCompositeOperation = "source-in";
            e.render(true);
            g.globalCompositeOperation = "source-over"
        }
    }
    ;
    this.mask = function(g) {
        if (!g) {
            return e = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var k = this._parent.children;
        var j = false;
        for (var h = 0; h < k.length; h++) {
            if (g == k[h]) {
                j = true
            }
        }
        if (j) {
            e = g;
            g.masked = this
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});
Class(function CanvasGraphics(h, c) {
    Inherit(this, CanvasObject);
    var e = this;
    var j = {};
    var d = [];
    var a, f;
    this.width = h || 0;
    this.height = c || 0;
    (function() {
            i()
        }
    )();
    function b(l) {
        for (var k in j) {
            var m = j[k];
            if (m instanceof Color) {
                l[k] = m.getHexString()
            } else {
                l[k] = m
            }
        }
    }
    function i() {
        a = new ObjectPool(Array,25)
    }
    function g() {
        var l = a.get();
        for (var k = 0; k < arguments.length; k++) {
            l[k] = arguments[k]
        }
        d.push(l)
    }
    this.set("strokeStyle", function(k) {
        j.strokeStyle = k
    });
    this.get("strokeStyle", function() {
        return j.strokeStyle
    });
    this.set("fillStyle", function(k) {
        j.fillStyle = k
    });
    this.get("fillStyle", function() {
        return j.fillStyle
    });
    this.set("lineWidth", function(k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function() {
        return j.lineWidth
    });
    this.set("lineWidth", function(k) {
        j.lineWidth = k
    });
    this.get("lineWidth", function() {
        return j.lineWidth
    });
    this.set("lineCap", function(k) {
        j.lineCap = k
    });
    this.get("lineCap", function() {
        return j.lineCap
    });
    this.set("lineDashOffset", function(k) {
        j.lineDashOffset = k
    });
    this.get("lineDashOffset", function() {
        return j.lineDashOffset
    });
    this.set("lineJoin", function(k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function() {
        return j.lineJoin
    });
    this.set("lineJoin", function(k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function() {
        return j.lineJoin
    });
    this.set("lineJoin", function(k) {
        j.lineJoin = k
    });
    this.get("lineJoin", function() {
        return j.lineJoin
    });
    this.set("miterLimit", function(k) {
        j.miterLimit = k
    });
    this.get("miterLimit", function() {
        return j.miterLimit
    });
    this.set("font", function(k) {
        j.font = k
    });
    this.get("font", function(k) {
        return j.font
    });
    this.set("textAlign", function(k) {
        j.textAlign = k
    });
    this.get("textAlign", function(k) {
        return j.textAlign
    });
    this.set("textBaseline", function(k) {
        j.textBaseline = k
    });
    this.get("textBaseline", function(k) {
        return j.textBaseline
    });
    this.draw = function(m) {
        if (this.isMask() && !m) {
            return false
        }
        var l = this._canvas.context;
        this.startDraw();
        b(l);
        for (var k = 0; k < d.length; k++) {
            var o = d[k];
            if (!o) {
                continue
            }
            var n = o.shift();
            l[n].apply(l, o);
            o.unshift(n)
        }
        this.endDraw();
        if (f) {
            l.save();
            l.clip();
            f.render(true);
            l.restore()
        }
    }
    ;
    this.clear = function() {
        for (var k = 0; k < d.length; k++) {
            d[k].length = 0;
            a.put(d[k])
        }
        d.length = 0
    }
    ;
    this.arc = function(m, p, n, l, o, k) {
        if (m && !p) {
            n = m;
            m = 0;
            p = 0
        }
        m = m || 0;
        p = p || 0;
        n = n || 0;
        n -= 90;
        k = k || false;
        o = o || 0;
        o -= 90;
        l = l ? l : this.radius || this.width / 2;
        g("beginPath");
        g("arc", m, p, l, Utils.toRadians(o), Utils.toRadians(n), k)
    }
    ;
    this.quadraticCurveTo = function(m, l, k, n) {
        g("quadraticCurveTo", m, l, k, n)
    }
    ;
    this.bezierCurveTo = function(m, l, o, n, k, p) {
        g("bezierCurveTo", m, l, o, n, k, p)
    }
    ;
    this.fillRect = function(k, n, l, m) {
        g("fillRect", k, n, l, m)
    }
    ;
    this.clearRect = function(k, n, l, m) {
        g("clearRect", k, n, l, m)
    }
    ;
    this.strokeRect = function(k, n, l, m) {
        g("strokeRect", k, n, l, m)
    }
    ;
    this.moveTo = function(k, l) {
        g("moveTo", k, l)
    }
    ;
    this.lineTo = function(k, l) {
        g("lineTo", k, l)
    }
    ;
    this.stroke = function() {
        g("stroke")
    }
    ;
    this.fill = function() {
        if (!f) {
            g("fill")
        }
    }
    ;
    this.beginPath = function() {
        g("beginPath")
    }
    ;
    this.closePath = function() {
        g("closePath")
    }
    ;
    this.fillText = function(m, k, n, l) {
        g("fillText", m, k, n, l)
    }
    ;
    this.strokeText = function(m, k, n, l) {
        g("strokeText", m, k, n, l)
    }
    ;
    this.setLineDash = function(k) {
        g("setLineDash", k)
    }
    ;
    this.mask = function(k) {
        if (!k) {
            return f = null
        }
        if (!this._parent) {
            throw "CanvasTexture :: Must add to parent before masking."
        }
        var n = this._parent.children;
        var m = false;
        for (var l = 0; l < n.length; l++) {
            if (k == n[l]) {
                m = true
            }
        }
        if (m) {
            f = k;
            k.masked = this;
            for (l = 0; l < d.length; l++) {
                if (d[l][0] == "fill" || d[l][0] == "stroke") {
                    d[l].length = 0;
                    a.put(d[l]);
                    d.splice(l, 1)
                }
            }
        } else {
            throw "CanvasGraphics :: Can only mask a sibling"
        }
    }
});
Class(function CanvasObject() {
    Inherit(this, Component);
    var a = this;
    this.alpha = 1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.scale = 1;
    this.visible = true;
    this.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.values = new CanvasValues();
    this.styles = new CanvasValues(true);
    this.children = [];
    this.blendMode = "normal";
    this.updateValues = function() {
        this.anchor.tx = this.anchor.x <= 1 && !this.anchor.full ? this.anchor.x * this.width : this.anchor.x;
        this.anchor.ty = this.anchor.y <= 1 && !this.anchor.full ? this.anchor.y * this.height : this.anchor.y;
        this.values.setTRSA(this.x, this.y, Utils.toRadians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.alpha);
        if (this._parent.values) {
            this.values.calculate(this._parent.values)
        }
        if (this._parent.styles) {
            this.styles.calculateStyle(this._parent.styles)
        }
    }
    ;
    this.render = function(d) {
        if (!this.visible) {
            return false
        }
        this.updateValues();
        if (this.draw) {
            this.draw(d)
        }
        var b = this.children.length;
        for (var c = 0; c < b; c++) {
            this.children[c].render(d)
        }
    }
    ;
    this.startDraw = function(d, c) {
        var b = this._canvas.context;
        var j = this.values.data;
        var h = j[0] + (d || 0);
        var g = j[1] + (c || 0);
        b.save();
        b._matrix.setTRS(h, g, j[2], j[3], j[4]);
        b.globalCompositeOperation = this.blendMode || "normal";
        var f = b._matrix.data;
        b.transform(f[0], f[3], f[1], f[4], f[2], f[5]);
        b.globalAlpha = j[5];
        if (this.styles.styled) {
            var k = this.styles.values;
            for (var i in k) {
                var e = k[i];
                if (e instanceof Color) {
                    b[i] = e.getHexString()
                } else {
                    b[i] = e
                }
            }
        }
    }
    ;
    this.endDraw = function() {
        this._canvas.context.restore()
    }
    ;
    this.add = function(b) {
        b._canvas = this._canvas;
        b._parent = this;
        this.children.push(b);
        b._z = this.children.length
    }
    ;
    this.remove = function(c) {
        c._canvas = null;
        c._parent = null;
        var b = this.children.indexOf(c);
        if (b) {
            this.children.splice(b, 1)
        }
    }
    ;
    this.isMask = function() {
        var b = this;
        while (b) {
            if (b.masked) {
                return true
            }
            b = b._parent
        }
        return false
    }
    ;
    this.unmask = function() {
        this.masked.mask(null);
        this.masked = null
    }
    ;
    this.setZ = function(b) {
        if (!this._parent) {
            throw "CanvasObject :: Must add to parent before setZ"
        }
        this._z = b;
        this._parent.children.sort(function(d, c) {
            return d._z - c._z
        })
    }
    ;
    this.hit = function(d) {
        if (!this.ignoreHit) {
            var c = Utils.hitTestObject(d, this.values.hit(this));
            if (c) {
                return this
            }
        }
        for (var b = this.children.length - 1; b > -1; b--) {
            var f = this.children[b];
            c = f.hit(d);
            if (c) {
                return f
            }
        }
        return false
    }
    ;
    this.destroy = function() {
        for (var b = 0; b < this.children.length; b++) {
            if (this.children[b].destroy) {
                this.children[b].destroy()
            }
        }
        return Utils.nullObject(this)
    }
});
Class(function CanvasValues(a) {
    Inherit(this, Component);
    var d = this;
    var c = {};
    var b = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (!a) {
        this.data = new Float32Array(6)
    } else {
        this.styled = false
    }
    this.set("shadowOffsetX", function(e) {
        d.styled = true;
        c.shadowOffsetX = e
    });
    this.get("shadowOffsetX", function() {
        return c.shadowOffsetX
    });
    this.set("shadowOffsetY", function(e) {
        d.styled = true;
        c.shadowOffsetY = e
    });
    this.get("shadowOffsetY", function() {
        return c.shadowOffsetY
    });
    this.set("shadowBlur", function(e) {
        d.styled = true;
        c.shadowBlur = e
    });
    this.get("shadowBlur", function() {
        return c.shadowBlur
    });
    this.set("shadowColor", function(e) {
        d.styled = true;
        c.shadowColor = e
    });
    this.get("shadowColor", function() {
        d.styled = true;
        return c.shadowColor
    });
    this.get("values", function() {
        return c
    });
    this.setTRSA = function(f, k, h, j, i, g) {
        var e = this.data;
        e[0] = f;
        e[1] = k;
        e[2] = h;
        e[3] = j;
        e[4] = i;
        e[5] = g
    }
    ;
    this.calculate = function(g) {
        var f = g.data;
        var e = this.data;
        e[0] = e[0] + f[0];
        e[1] = e[1] + f[1];
        e[2] = e[2] + f[2];
        e[3] = e[3] * f[3];
        e[4] = e[4] * f[4];
        e[5] = e[5] * f[5]
    }
    ;
    this.calculateStyle = function(g) {
        if (!g.styled) {
            return false
        }
        this.styled = true;
        var e = g.values;
        for (var f in e) {
            if (!c[f]) {
                c[f] = e[f]
            }
        }
    }
    ;
    this.hit = function(e) {
        b.x = this.data[0];
        b.y = this.data[1];
        b.width = e.width;
        b.height = e.height;
        return b
    }
});
Class(function CanvasPoints(e, a, d) {
    Inherit(this, CanvasObject);
    var f = this;
    this.graphics = new CanvasGraphics();
    this.type = "fill";
    this.points = [];
    this.width = a || 0;
    this.height = d || 0;
    this.line = "direct";
    (function() {
            b();
            Render.nextFrame(c)
        }
    )();
    function b() {
        if (e) {
            for (var g = 0; g < e.length; g++) {
                f.points.push(e[g])
            }
        }
    }
    function c() {
        f.add(f.graphics)
    }
    this.draw = function() {
        if (this.points.length < 2) {
            return false
        }
        this.graphics.clear();
        this.graphics.beginPath();
        if (this.line == "direct") {
            this.graphics.moveTo(this.points[0].x, this.points[0].y);
            for (var g = 1; g < this.points.length; g++) {
                this.graphics.lineTo(this.points[g].x, this.points[g].y)
            }
        } else {
            for (var g = 1; g < this.points.length - 2; g++) {
                var h = (this.points[g].x + this.points[g + 1].x) / 2;
                var j = (this.points[g].y + this.points[g + 1].y) / 2;
                this.graphics.quadraticCurveTo(this.points[g].x, this.points[g].y, h, j)
            }
            this.graphics.quadraticCurveTo(this.points[g].x, this.points[g].y, this.points[g + 1].x, this.points[g + 1].y)
        }
        this.graphics[this.type]()
    }
    ;
    this.insert = function(h) {
        if (!h.splice) {
            h = [h]
        }
        for (var g = 0; g < h.length; g++) {
            this.points.push(h[g])
        }
    }
});
Class(function CSSShader(l, f, k) {
    Inherit(this, Component);
    var h = this;
    var e = "";
    var i = "";
    var b = ["grayscale", "sepia", "saturate", "hue", "invert", "opacity", "brightness", "contrast", "blur"];
    var a;
    this.composite = "normal source-atop";
    this.rows = 5;
    this.cols = 5;
    this.uniforms = {};
    this.transform = {};
    this.filters = {};
    this.perspective = 2000;
    this.detached = false;
    function c(o) {
        for (var n = b.length - 1; n > -1; n--) {
            if (b[n] == o) {
                return true
            }
        }
        return false
    }
    function m() {
        var r = "";
        var n = b.length - 1;
        for (var o in h.filters) {
            if (!c(o)) {
                continue
            }
            var p = o;
            var q = h.filters[o];
            if (typeof q === "number") {
                p = p == "hue" ? "hue-rotate" : p;
                q = p == "hue-rotate" ? q + "deg" : q;
                q = p == "blur" ? q + "px" : q;
                r += p + "(" + q + ") "
            }
        }
        i = r
    }
    function j() {
        e = "perspective(" + h.perspective + ")";
        e += TweenManager.parseTransform(h.transform)
    }
    function d() {
        var o = "";
        if (f && k) {
            o += "custom(url(" + f + ")";
            o += "mix(url(" + k + ")";
            o += h.composite + "),";
            o += h.rows + " " + h.cols + (h.detached ? " detached" : "") + ",";
            o += "transform " + e + ",";
            for (var n in h.uniforms) {
                o += n + " " + h.uniforms[n] + ","
            }
            o = o.slice(0, -1);
            o += ")"
        }
        o += i;
        if (!h._blender) {
            l.div.style[Device.styles.vendor + "Filter"] = o
        } else {
            return o
        }
    }
    function g() {
        if (a || !l || l.div) {
            return false
        }
        l.div.style[Device.styles.vendor + "Transition"] = ""
    }
    this.apply = function() {
        m();
        j();
        return d()
    }
    ;
    this.tween = function(o, p, q, n, r) {
        if (typeof n === "function") {
            r = n
        }
        n = n || 0;
        clearTimeout(a);
        a = setTimeout(function() {
            l.div.style[Device.styles.vendor + "Transition"] = "all " + p + "ms " + TweenManager.getEase(q) + " " + n + "ms";
            var u = {};
            var s = {};
            var v = {};
            for (var t in o) {
                if (TweenManager.checkTransform(t)) {
                    u[t] = o[t]
                } else {
                    if (c(t)) {
                        v[t] = o[t]
                    } else {
                        s[t] = o[t]
                    }
                }
            }
            for (t in u) {
                h.transform[t] = u[t]
            }
            for (t in s) {
                h.uniforms[t] = s[t]
            }
            for (t in v) {
                h.filters[t] = v[t]
            }
            a = setTimeout(function() {
                if (r) {
                    r()
                }
            }, p + n);
            if (!h._blender) {
                h.apply()
            } else {
                h._blender.apply()
            }
        }, 10)
    }
    ;
    this.stopTween = function() {
        clearTimeout(a);
        a = null;
        g()
    }
    ;
    this.clear = function() {
        this.stopTween();
        this.filters = {};
        this.uniforms = {};
        this.transform = {};
        this.apply()
    }
    ;
    this.destroy = function() {
        this.clear();
        l = null;
        a = null;
        e = null;
        return this._destroy()
    }
});
Class(function CSSComposer(c) {
    Inherit(this, Component);
    var e = this;
    var a = [];
    var d;
    (function() {}
    )();
    function b() {
        a.sort(function(g, f) {
            var h = g._index - f._index;
            if (h == 0) {
                h = g._time - f._time;
                if (h > 1) {
                    h = -1;
                    g._index++
                } else {
                    f._index++;
                    h = 1
                }
            }
            return h
        })
    }
    this.add = function(g, f) {
        a.push(g);
        g._time = Date.now();
        g._index = typeof f === "undefined" ? a.length - 1 : f;
        g._blender = this;
        b()
    }
    ;
    this.sort = function(g, f) {
        g._time = Date.now();
        g._index = typeof f === "undefined" ? a.length - 1 : f;
        b()
    }
    ;
    this.apply = function() {
        var g = "";
        for (var f = 0; f < a.length; f++) {
            g += a[f].apply()
        }
        c.div.style[Device.styles.vendor + "Filter"] = g
    }
    ;
    this.destroy = function() {
        for (var f = 0; f < a.length; f++) {
            if (a[f] && a[f].destroy) {
                a[f] = a[f].destroy()
            }
        }
        c = null;
        d = null;
        _transform = null;
        return this._destroy()
    }
});
Class(function CanvasShader(w, v, x) {
    Inherit(this, Component);
    var u = this;
    var m, p, e, g, h, n;
    var r = {};
    var k = [];
    var f = 0;
    var s = "t" + Utils.timestamp();
    this.retina = false;
    this.uniforms = r;
    (function() {
            o();
            q();
            if (w) {
                l();
                j()
            }
        }
    )();
    function o() {
        if (!w.show) {
            x = v;
            v = w;
            w = null
        }
    }
    function l() {
        m = u.initClass(Canvas, null);
        p = m.context;
        u.context = p
    }
    function j() {
        if (!w.width) {
            throw "PixelShader requires width, height properties on object."
        }
        var A = typeof w == "string" ? w : Utils.getBackground(w);
        g = new Image();
        g.src = A;
        g.onload = function() {
            g.width = w.width;
            g.height = w.height;
            m.size(g.width, g.height, u.retina);
            p.drawImage(g, 0, 0, g.width, g.height);
            if (w.css) {
                w.css({
                    background: ""
                }).addChild(m)
            }
            b();
            e = true
        }
    }
    function q() {
        if (!v) {
            return false
        }
        x = x || 1;
        for (var B = 0; B < x; B++) {
            var A = u.initClass(Thread);
            A.initCode(s, v);
            A.initFunction(a, true);
            A.initFunction(y, true);
            A.initFunction(i);
            A.initFunction(t);
            k.push(A)
        }
    }
    function d() {
        var A = k[f];
        f++;
        if (f >= k.length) {
            f = 0
        }
        return A
    }
    function z(B) {
        var A = d();
        A.send(s, B, function(C) {
            p.putImageData(C, 0, 0);
            if (u.postprocess) {
                u.postprocess(p, g, m)
            }
            n = false
        })
    }
    function b(B) {
        var C = p.createImageData(g.width, g.height);
        var D = p.getImageData(0, 0, g.width, g.height);
        for (var A = 0; A < k.length; A++) {
            k[A].send("setData", {
                imageData: D,
                emptyData: C
            })
        }
    }
    function c(C, D) {
        var A = u.initClass(Canvas);
        var B = Utils.getBackground(C);
        var E = new Image();
        E.src = B;
        E.onload = function() {
            A.size(E.width, E.height, u.retina);
            A.context.drawImage(E, 0, 0, E.width, E.height);
            if (C.css) {
                C.css({
                    background: ""
                }).addChild(A)
            }
            var F = d();
            if (u.preprocess) {
                u.preprocess(A.context, E, A)
            }
            D = D || {};
            D.imageData = A.context.getImageData(0, 0, E.width, E.height);
            F.send(s, D, function(G) {
                A.context.putImageData(G, 0, 0);
                if (u.postprocess) {
                    u.postprocess(A.context, E, A)
                }
                C.removeChild(A, true);
                A = A.destroy()
            })
        }
    }
    function i(A) {
        self.buffer = A.emptyData;
        self.image = A.imageData;
        self.width = self.image.width;
        self.height = self.image.height;
        self.pixels = self.image.data;
        self.buffer.data.set(self.pixels)
    }
    function a(B) {
        var A = new Uint8ClampedArray(self.image.data);
        return A
    }
    function t(A, C, B) {
        B = B || self.width;
        return ((C - 1) * (B * 4)) + (A * 4)
    }
    function y() {
        self.buffer.data.set(self.pixels)
    }
    this.render = function(A, B) {
        if (n) {
            return false
        }
        if (!A || !A.show) {
            B = A || r;
            A = null;
            B = B || r;
            if (!e) {
                clearTimeout(h);
                h = setTimeout(function() {
                    u.render(B)
                }, 50);
                return false
            }
            if (u.preprocess) {
                u.preprocess(p, g, m);
                b()
            }
            if (v) {
                z(B)
            }
        } else {
            c(A, B)
        }
        n = true
    }
    ;
    this.resize = function(A, B) {
        if (!g) {
            throw "PixelShader Error: Image not found on resize"
        }
        g.width = A;
        g.height = B;
        m.size(g.width, g.height, u.retina);
        p.drawImage(g, 0, 0, g.width, g.height);
        b()
    }
    ;
    this.getPixel = function(A, C, B) {
        B = B || g.width;
        return ((C - 1) * (B * 4)) + (A * 4)
    }
    ;
    this.destroy = function() {
        if (w) {
            w.removeChild(m, true)
        }
        return this._destroy()
    }
});
Class(function GLShader(z, r, c, f, t) {
    Inherit(this, Component);
    var q = this;
    var m, h, u, g, n;
    var x, s, b;
    this.rows = 1;
    this.cols = 1;
    this.uniforms = {};
    (function() {
            if (!Device.graphics.webgl) {
                q.div = z.div;
                q.object = z.object;
                return
            }
            v();
            y();
            k();
            o()
        }
    )();
    function v() {
        if (typeof r !== "number") {
            f = r;
            t = c;
            r = z.width;
            c = z.height
        }
    }
    function y() {
        var E = f;
        var B = t;
        var C, D, A;
        if (E) {
            if (!E.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            C = E.split("void main() {");
            D = C[0];
            A = C[1].slice(0, -1)
        }
        f = ["precision mediump float;", "attribute vec2 a_position;", "uniform vec2 u_resolution;", "attribute vec2 a_texCoord;", "varying vec2 v_texCoord;", "vec4 position;", D || "", "vec2 _position(vec2 pos) {", "vec2 zeroToOne = pos / u_resolution;", "vec2 zeroToTwo = zeroToOne * 2.0;", "vec2 clipSpace = zeroToTwo - 1.0;", "return clipSpace * vec2(1, -1);", "}", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "position = vec4(_position(a_position), 0, 1);", "v_texCoord = a_texCoord;", A || "", (A && A.strpos("gl_Position") ? "" : "gl_Position = position;"), "}", ].join("");
        if (B) {
            if (!B.strpos("void main() {")) {
                throw 'GLShader :: Requires "void main() {"'
            }
            C = B.split("void main() {");
            D = C[0];
            A = C[1].slice(0, -1)
        }
        t = ["precision mediump float;", "varying vec2 v_texCoord;", "uniform sampler2D u_texture;", "uniform vec2 u_resolution;", "vec4 texel;", D || "", "vec2 coord(vec2 pos) {", "return pos / u_resolution;", "}", "vec2 pixel(vec2 co) {", "return co * u_resolution;", "}", "void main() {", "texel = texture2D(u_texture, v_texCoord);", A || "", (A && A.strpos("gl_FragColor") ? "" : "gl_FragColor = texel;"), "}", ].join("")
    }
    function k() {
        m = document.createElement("canvas");
        m.width = q.width = r || 500;
        m.height = q.height = c || 500;
        try {
            h = m.getContext("experimental-webgl")
        } catch (A) {
            h = m.getContext("webgl")
        }
        q.div = m;
        q.object = $(m);
        q.object.mouseEnabled(false)
    }
    function d(H) {
        var N = z.width;
        var G = z.height;
        var C = q.rows;
        var O = q.cols;
        var M = 0;
        var K = 0;
        var B = N / C;
        var E = G / O;
        var P = [];
        var J = C * O;
        var D, L, A, I;
        for (var F = 0; F < J; F++) {
            D = M;
            A = M + B;
            L = K;
            I = K + E;
            P.push(D);
            P.push(L);
            P.push(A);
            P.push(L);
            P.push(D);
            P.push(I);
            P.push(D);
            P.push(I);
            P.push(A);
            P.push(L);
            P.push(A);
            P.push(I);
            M += B;
            if (M > N - 1) {
                M = 0;
                K += E
            }
        }
        M = q.width / 2 - N / 2;
        K = q.height / 2 - G / 2;
        for (F = 0; F < P.length; F++) {
            if (F % 2 == 0) {
                if (H) {
                    P[F] /= N
                } else {
                    P[F] += M
                }
            } else {
                if (H) {
                    P[F] /= G
                } else {
                    P[F] += K
                }
            }
        }
        return new Float32Array(P)
    }
    function j() {
        if (!q.uniforms) {
            q.uniforms = {}
        }
        for (var A in q.uniforms) {
            var C = q.uniforms[A];
            var B = h.getUniformLocation(u, A);
            if (typeof C === "number") {
                h.uniform1f(B, C)
            } else {
                if (C instanceof Vector2) {
                    h.uniform2f(B, C.x, C.y)
                } else {
                    if (C instanceof Vector3) {
                        h.uniform4f(B, C.x, C.y, C.z, C.w)
                    } else {
                        if (C instanceof Color) {
                            h.uniform3f(B, C.r, C.g, C.b)
                        }
                    }
                }
            }
        }
    }
    function l() {
        u = w();
        h.useProgram(u);
        h.clearColor(0, 0, 0, 0);
        g = d();
        n = d(true)
    }
    function i() {
        var C = h.getAttribLocation(u, "a_position");
        var A = h.getAttribLocation(u, "a_texCoord");
        if (!b) {
            b = h.createBuffer()
        }
        h.bindBuffer(h.ARRAY_BUFFER, b);
        h.bufferData(h.ARRAY_BUFFER, n, h.STATIC_DRAW);
        h.enableVertexAttribArray(A);
        h.vertexAttribPointer(A, 2, h.FLOAT, false, 0, 0);
        if (!x) {
            x = h.createTexture()
        }
        h.bindTexture(h.TEXTURE_2D, x);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.NEAREST);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
        h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, h.RGBA, h.UNSIGNED_BYTE, z.div);
        var B = h.getUniformLocation(u, "u_resolution");
        h.uniform2f(B, q.width, q.height);
        if (!s) {
            s = h.createBuffer();
            q.buffer = s
        }
        h.bindBuffer(h.ARRAY_BUFFER, s);
        h.enableVertexAttribArray(C);
        h.vertexAttribPointer(C, 2, h.FLOAT, false, 0, 0);
        h.bufferData(h.ARRAY_BUFFER, g, h.STATIC_DRAW);
        h.enableVertexAttribArray(C);
        h.drawArrays(h.TRIANGLES, 0, g.length / 2)
    }
    function p(C, A) {
        var B = h.createShader(A);
        h.shaderSource(B, C);
        h.compileShader(B);
        if (!h.getShaderParameter(B, h.COMPILE_STATUS)) {
            throw h.getShaderInfoLog(B)
        }
        return B
    }
    function w() {
        var A = h.createProgram();
        var C = p(f, h.VERTEX_SHADER);
        var B = p(t, h.FRAGMENT_SHADER);
        h.attachShader(A, C);
        h.attachShader(A, B);
        h.linkProgram(A);
        if (!h.getProgramParameter(A, h.LINK_STATUS)) {
            throw h.getProgramInfoLog(A)
        }
        return A
    }
    function o() {
        m.addEventListener("webglcontextlost", a);
        m.addEventListener("webglcontextrestored", e)
    }
    function e() {
        try {
            h = m.getContext("experimental-webgl")
        } catch (A) {
            h = m.getContext("webgl")
        }
    }
    function a() {
        h = u = x = s = b = null
    }
    this.render = function() {
        if (!Device.graphics.webgl) {
            return false
        }
        if (!u) {
            l()
        }
        h.clear(h.COLOR_BUFFER_BIT | h.DEPTH_BUFFER_BIT);
        j();
        i()
    }
    ;
    this.destroy = function() {
        if (this.object) {
            this.object.remove()
        }
        m = h = u = x = s = b = null;
        return this._destroy()
    }
    ;
    this.startRender = function() {
        Render.startRender(q.render)
    }
    ;
    this.stopRender = function() {
        Render.stopRender(q.render)
    }
});
Class(function TweenManager() {
    var f = this;
    var a = [];
    var d, c;
    (function() {
            Hydra.ready(b);
            Render.startRender(e)
        }
    )();
    function b() {
        f._dynamicPool = new ObjectPool(DynamicObject,100)
    }
    function e(j) {
        if (a.length) {
            var g = a.length - 1;
            for (var h = g; h > -1; h--) {
                if (a[h]) {
                    a[h].update(j)
                } else {
                    a.splice(h, 1)
                }
            }
        }
    }
    this._addMathTween = function(g) {
        a.push(g)
    }
    ;
    this._removeMathTween = function(h) {
        for (var g = a.length - 1; g > -1; g--) {
            if (h == a[g]) {
                a.splice(g, 1)
            }
        }
    }
    ;
    this._initCSS = function(l, j, k, m, h, g, i) {
        return new CSSTween(l,j,k,m,h,g,i)
    }
    ;
    this.tween = function(k, i, j, l, h, g, m) {
        if (typeof h !== "number") {
            m = g;
            g = h;
            h = 0
        }
        return new MathTween(k,i,j,l,h,m,g)
    }
    ;
    this.clearTween = function(g) {
        if (g._mathTween && g._mathTween.stop) {
            g._mathTween.stop()
        }
    }
    ;
    this.clearCSSTween = function(g) {
        if (g && !g._cssTween && g.div._transition) {
            g.div.style[Device.styles.vendorTransition] = "";
            g.div._transition = false
        }
    }
    ;
    this.checkTransform = function(h) {
        for (var g = f.Transforms.length - 1; g > -1; g--) {
            if (h == f.Transforms[g]) {
                return true
            }
        }
        return false
    }
    ;
    this.addCustomEase = function(j) {
        var h = true;
        if (typeof j !== "object" || !j.name || !j.curve) {
            throw "TweenManager :: setCustomEase requires {name, curve}"
        }
        for (var g = f.CSSEases.length - 1; g > -1; g--) {
            if (j.name == f.CSSEases[g].name) {
                h = false
            }
        }
        if (h) {
            j.values = j.curve.split("(")[1].slice(0, -1).split(",");
            for (g = 0; g < j.values.length; g++) {
                j.values[g] = parseFloat(j.values[g])
            }
            f.CSSEases.push(j)
        }
    }
    ;
    this.getEase = function(h, g) {
        var k = f.CSSEases;
        for (var j = k.length - 1; j > -1; j--) {
            if (k[j].name == h) {
                if (g) {
                    return k[j].values
                }
                return k[j].curve
            }
        }
        return false
    }
    ;
    this.getAllTransforms = function(g) {
        var k = {};
        for (var h = 0; h < f.Transforms.length; h++) {
            var j = f.Transforms[h];
            var l = g[j];
            if (l !== 0 && typeof l === "number") {
                k[j] = l
            }
        }
        return k
    }
    ;
    this.getTransformProperty = function() {
        switch (Device.styles.vendor) {
            case "Moz":
                return "-moz-transform";
                break;
            case "Webkit":
                return "-webkit-transform";
                break;
            case "O":
                return "-o-transform";
                break;
            case "ms":
                return "-ms-transform";
                break;
            default:
                return "transform";
                break
        }
    }
    ;
    this.parseTransform = function(i) {
        var h = "";
        var k = "";
        if (typeof i.x !== "undefined" || typeof i.y !== "undefined" || typeof i.z !== "undefined") {
            var g = (i.x || 0);
            var l = (i.y || 0);
            var j = (i.z || 0);
            k += g + "px, ";
            k += l + "px";
            if (Device.tween.css3d) {
                k += ", " + j + "px";
                h += "translate3d(" + k + ")"
            } else {
                h += "translate(" + k + ")"
            }
        }
        if (typeof i.scale !== "undefined") {
            h += "scale(" + i.scale + ")"
        } else {
            if (typeof i.scaleX !== "undefined") {
                h += "scaleX(" + i.scaleX + ")"
            }
            if (typeof i.scaleY !== "undefined") {
                h += "scaleY(" + i.scaleY + ")"
            }
        }
        if (typeof i.rotation !== "undefined") {
            h += "rotate(" + i.rotation + "deg)"
        }
        if (typeof i.rotationX !== "undefined") {
            h += "rotateX(" + i.rotationX + "deg)"
        }
        if (typeof i.rotationY !== "undefined") {
            h += "rotateY(" + i.rotationY + "deg)"
        }
        if (typeof i.rotationZ !== "undefined") {
            h += "rotateZ(" + i.rotationZ + "deg)"
        }
        if (typeof i.skewX !== "undefined") {
            h += "skewX(" + i.skewX + "deg)"
        }
        if (typeof i.skewY !== "undefined") {
            h += "skewY(" + i.skewY + "deg)"
        }
        return h
    }
    ;
    this.Class = window.Class
}, "Static");
Class(function MathTween(j, l, m, b, i, k, n) {
    var h = this;
    var d, a, f;
    var e;
    (function() {
            if (j && l) {
                if (typeof m !== "number") {
                    throw "MathTween Requires object, props, time, ease"
                }
                c()
            }
        }
    )();
    function c() {
        if (j._mathTween && j._mathTween.stop) {
            j._mathTween.stop()
        }
        j._mathTween = h;
        TweenManager._addMathTween(h);
        b = TweenManager.MathEasing.convertEase(b);
        d = Date.now();
        d += i;
        f = l;
        a = TweenManager._dynamicPool.get();
        for (var o in f) {
            if (typeof j[o] === "number") {
                a[o] = j[o]
            }
        }
    }
    function g() {
        if (!j && !l) {
            return false
        }
        j._mathTween = null;
        TweenManager._dynamicPool.put(a.clear());
        d = a = f = e = null;
        j = l = m = b = i = k = n = null;
        TweenManager._removeMathTween(h)
    }
    this.start = function(p, q, r, s, o, u, t) {
        j = p;
        l = q;
        m = r;
        b = s;
        i = o;
        k = u;
        n = t;
        h = this;
        c()
    }
    ;
    this.update = function(r) {
        if (r < d) {
            return true
        }
        var p = (r - d) / m;
        p = p > 1 ? 1 : p;
        var q;
        if (typeof b === "function") {
            q = b(p)
        } else {
            q = TweenManager.MathEasing.solve(b, p)
        }
        for (var t in a) {
            if (typeof a[t] === "number") {
                var s = a[t];
                var o = f[t];
                j[t] = s + (o - s) * q
            }
        }
        if (k) {
            k(r)
        }
        if (p == 1) {
            if (!e) {
                e = true;
                if (n) {
                    n()
                }
                g()
            }
            return false
        }
        return true
    }
    ;
    this.stop = function() {
        g();
        return null
    }
});
TweenManager.Class(function MathEasing() {
    function d(i, g, h) {
        return ((a(g, h) * i + f(g, h)) * i + e(g)) * i
    }
    function b(k, n, l) {
        var h = k;
        for (var j = 0; j < 4; j++) {
            var m = c(h, n, l);
            if (m == 0) {
                return h
            }
            var g = d(h, n, l) - k;
            h -= g / m
        }
        return h
    }
    function c(i, g, h) {
        return 3 * a(g, h) * i * i + 2 * f(g, h) * i + e(g)
    }
    function a(g, h) {
        return 1 - 3 * h + 3 * g
    }
    function f(g, h) {
        return 3 * h - 6 * g
    }
    function e(g) {
        return 3 * g
    }
    this.convertEase = function(i) {
        var g = (function() {
                switch (i) {
                    case "easeInQuad":
                        return TweenManager.MathEasing.Quad.In;
                        break;
                    case "easeInCubic":
                        return TweenManager.MathEasing.Cubic.In;
                        break;
                    case "easeInQuart":
                        return TweenManager.MathEasing.Quart.In;
                        break;
                    case "easeInQuint":
                        return TweenManager.MathEasing.Quint.In;
                        break;
                    case "easeInSine":
                        return TweenManager.MathEasing.Sine.In;
                        break;
                    case "easeInExpo":
                        return TweenManager.MathEasing.Expo.In;
                        break;
                    case "easeInCirc":
                        return TweenManager.MathEasing.Circ.In;
                        break;
                    case "easeInElastic":
                        return TweenManager.MathEasing.Elastic.In;
                        break;
                    case "easeInBack":
                        return TweenManager.MathEasing.Back.In;
                        break;
                    case "easeInBounce":
                        return TweenManager.MathEasing.Bounce.In;
                        break;
                    case "easeOutQuad":
                        return TweenManager.MathEasing.Quad.Out;
                        break;
                    case "easeOutCubic":
                        return TweenManager.MathEasing.Cubic.Out;
                        break;
                    case "easeOutQuart":
                        return TweenManager.MathEasing.Quart.Out;
                        break;
                    case "easeOutQuint":
                        return TweenManager.MathEasing.Quint.Out;
                        break;
                    case "easeOutSine":
                        return TweenManager.MathEasing.Sine.Out;
                        break;
                    case "easeOutExpo":
                        return TweenManager.MathEasing.Expo.Out;
                        break;
                    case "easeOutCirc":
                        return TweenManager.MathEasing.Circ.Out;
                        break;
                    case "easeOutElastic":
                        return TweenManager.MathEasing.Elastic.Out;
                        break;
                    case "easeOutBack":
                        return TweenManager.MathEasing.Back.Out;
                        break;
                    case "easeOutBounce":
                        return TweenManager.MathEasing.Bounce.Out;
                        break;
                    case "easeInOutQuad":
                        return TweenManager.MathEasing.Quad.InOut;
                        break;
                    case "easeInOutCubic":
                        return TweenManager.MathEasing.Cubic.InOut;
                        break;
                    case "easeInOutQuart":
                        return TweenManager.MathEasing.Quart.InOut;
                        break;
                    case "easeInOutQuint":
                        return TweenManager.MathEasing.Quint.InOut;
                        break;
                    case "easeInOutSine":
                        return TweenManager.MathEasing.Sine.InOut;
                        break;
                    case "easeInOutExpo":
                        return TweenManager.MathEasing.Expo.InOut;
                        break;
                    case "easeInOutCirc":
                        return TweenManager.MathEasing.Circ.InOut;
                        break;
                    case "easeInOutElastic":
                        return TweenManager.MathEasing.Elastic.InOut;
                        break;
                    case "easeInOutBack":
                        return TweenManager.MathEasing.Back.InOut;
                        break;
                    case "easeInOutBounce":
                        return TweenManager.MathEasing.Bounce.InOut;
                        break;
                    case "linear":
                        return TweenManager.MathEasing.Linear.None;
                        break
                }
            }
        )();
        if (!g) {
            var h = TweenManager.getEase(i, true);
            if (h) {
                g = h
            } else {
                g = TweenManager.MathEasing.Cubic.Out
            }
        }
        return g
    }
    ;
    this.solve = function(h, g) {
        if (h[0] == h[1] && h[2] == h[3]) {
            return g
        }
        return d(b(g, h[0], h[2]), h[1], h[3])
    }
}, "Static");
(function() {
        TweenManager.MathEasing.Linear = {
            None: function(a) {
                return a
            }
        };
        TweenManager.MathEasing.Quad = {
            In: function(a) {
                return a * a
            },
            Out: function(a) {
                return a * (2 - a)
            },
            InOut: function(a) {
                if ((a *= 2) < 1) {
                    return 0.5 * a * a
                }
                return -0.5 * (--a * (a - 2) - 1)
            }
        };
        TweenManager.MathEasing.Cubic = {
            In: function(a) {
                return a * a * a
            },
            Out: function(a) {
                return --a * a * a + 1
            },
            InOut: function(a) {
                if ((a *= 2) < 1) {
                    return 0.5 * a * a * a
                }
                return 0.5 * ((a -= 2) * a * a + 2)
            }
        };
        TweenManager.MathEasing.Quart = {
            In: function(a) {
                return a * a * a * a
            },
            Out: function(a) {
                return 1 - --a * a * a * a
            },
            InOut: function(a) {
                if ((a *= 2) < 1) {
                    return 0.5 * a * a * a * a
                }
                return -0.5 * ((a -= 2) * a * a * a - 2)
            }
        };
        TweenManager.MathEasing.Quint = {
            In: function(a) {
                return a * a * a * a * a
            },
            Out: function(a) {
                return --a * a * a * a * a + 1
            },
            InOut: function(a) {
                if ((a *= 2) < 1) {
                    return 0.5 * a * a * a * a * a
                }
                return 0.5 * ((a -= 2) * a * a * a * a + 2)
            }
        };
        TweenManager.MathEasing.Sine = {
            In: function(a) {
                return 1 - Math.cos(a * Math.PI / 2)
            },
            Out: function(a) {
                return Math.sin(a * Math.PI / 2)
            },
            InOut: function(a) {
                return 0.5 * (1 - Math.cos(Math.PI * a))
            }
        };
        TweenManager.MathEasing.Expo = {
            In: function(a) {
                return a === 0 ? 0 : Math.pow(1024, a - 1)
            },
            Out: function(a) {
                return a === 1 ? 1 : 1 - Math.pow(2, -10 * a)
            },
            InOut: function(a) {
                if (a === 0) {
                    return 0
                }
                if (a === 1) {
                    return 1
                }
                if ((a *= 2) < 1) {
                    return 0.5 * Math.pow(1024, a - 1)
                }
                return 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
            }
        };
        TweenManager.MathEasing.Circ = {
            In: function(a) {
                return 1 - Math.sqrt(1 - a * a)
            },
            Out: function(a) {
                return Math.sqrt(1 - --a * a)
            },
            InOut: function(a) {
                if ((a *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - a * a) - 1)
                }
                return 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
            }
        };
        TweenManager.MathEasing.Elastic = {
            In: function(c) {
                var d, b = 0.1, e = 0.4;
                if (c === 0) {
                    return 0
                }
                if (c === 1) {
                    return 1
                }
                if (!b || b < 1) {
                    b = 1;
                    d = e / 4
                } else {
                    d = e * Math.asin(1 / b) / (2 * Math.PI)
                }
                return -(b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
            },
            Out: function(c) {
                var d, b = 0.1, e = 0.4;
                if (c === 0) {
                    return 0
                }
                if (c === 1) {
                    return 1
                }
                if (!b || b < 1) {
                    b = 1;
                    d = e / 4
                } else {
                    d = e * Math.asin(1 / b) / (2 * Math.PI)
                }
                return (b * Math.pow(2, -10 * c) * Math.sin((c - d) * (2 * Math.PI) / e) + 1)
            },
            InOut: function(c) {
                var d, b = 0.1, e = 0.4;
                if (c === 0) {
                    return 0
                }
                if (c === 1) {
                    return 1
                }
                if (!b || b < 1) {
                    b = 1;
                    d = e / 4
                } else {
                    d = e * Math.asin(1 / b) / (2 * Math.PI)
                }
                if ((c *= 2) < 1) {
                    return -0.5 * (b * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e))
                }
                return b * Math.pow(2, -10 * (c -= 1)) * Math.sin((c - d) * (2 * Math.PI) / e) * 0.5 + 1
            }
        };
        TweenManager.MathEasing.Back = {
            In: function(a) {
                var b = 1.70158;
                return a * a * ((b + 1) * a - b)
            },
            Out: function(a) {
                var b = 1.70158;
                return --a * a * ((b + 1) * a + b) + 1
            },
            InOut: function(a) {
                var b = 1.70158 * 1.525;
                if ((a *= 2) < 1) {
                    return 0.5 * (a * a * ((b + 1) * a - b))
                }
                return 0.5 * ((a -= 2) * a * ((b + 1) * a + b) + 2)
            }
        };
        TweenManager.MathEasing.Bounce = {
            In: function(a) {
                return 1 - TweenManager.MathEasing.Bounce.Out(1 - a)
            },
            Out: function(a) {
                if (a < (1 / 2.75)) {
                    return 7.5625 * a * a
                } else {
                    if (a < (2 / 2.75)) {
                        return 7.5625 * (a -= (1.5 / 2.75)) * a + 0.75
                    } else {
                        if (a < (2.5 / 2.75)) {
                            return 7.5625 * (a -= (2.25 / 2.75)) * a + 0.9375
                        } else {
                            return 7.5625 * (a -= (2.625 / 2.75)) * a + 0.984375
                        }
                    }
                }
            },
            InOut: function(a) {
                if (a < 0.5) {
                    return TweenManager.MathEasing.Bounce.In(a * 2) * 0.5
                }
                return TweenManager.MathEasing.Bounce.Out(a * 2 - 1) * 0.5 + 0.5
            }
        }
    }
)();
Class(function CSSTween(p, A, D, l, u, s, r) {
    var z = this;
    var g, t, G, E, F;
    var f, q, d, j, o;
    var v, y, b, n;
    (function() {
            if (p && A) {
                if (typeof D !== "number") {
                    throw "CSSTween Requires object, props, time, ease"
                }
                i()
            }
        }
    )();
    function i() {
        if (c()) {
            B();
            if (!r) {
                k()
            }
        } else {
            if (!r) {
                e();
                h();
                a()
            }
        }
    }
    function h() {
        var H = TweenManager.getAllTransforms(p);
        var J = [];
        for (var I in A) {
            if (TweenManager.checkTransform(I)) {
                H.use = true;
                H[I] = A[I];
                delete A[I]
            } else {
                J.push(I)
            }
        }
        if (H.use) {
            J.push(TweenManager.getTransformProperty())
        }
        j = H;
        v = J
    }
    function B() {
        var H = TweenManager.getAllTransforms(p);
        E = TweenManager._dynamicPool.get();
        d = TweenManager._dynamicPool.get();
        q = TweenManager._dynamicPool.get();
        G = TweenManager._dynamicPool.get();
        for (var I in H) {
            q[I] = H[I];
            d[I] = H[I]
        }
        for (I in A) {
            if (TweenManager.checkTransform(I)) {
                y = true;
                q[I] = p[I] || 0;
                d[I] = A[I]
            } else {
                b = true;
                if (typeof A[I] === "string") {
                    p.div.style[I] = A[I]
                } else {
                    G[I] = Number(p.css(I));
                    E[I] = A[I]
                }
            }
        }
    }
    function c() {
        if (A.math) {
            delete A.math;
            return g = true
        }
        if (!Device.tween.transition) {
            return g = true
        }
        if (l.strpos("Elastic") || l.strpos("Bounce")) {
            return g = true
        }
        return g = false
    }
    function k() {
        p._cssTween = z;
        z.playing = true;
        A = G.copy();
        j = q.copy();
        if (b) {
            t = TweenManager.tween(A, E, D, l, u, w, x)
        }
        if (y) {
            o = TweenManager.tween(j, d, D, l, u, (!b ? w : null), (!b ? x : null))
        }
    }
    function a() {
        if (!z.kill && p.div && v) {
            p._cssTween = z;
            p.div._transition = true;
            var J = "";
            var H = v.length;
            for (var I = 0; I < H; I++) {
                J += (J.length ? ", " : "") + v[I] + " " + D + "ms " + TweenManager.getEase(l) + " " + u + "ms"
            }
            Render.setupTween(function() {
                if (z.kill || !p || !p.div) {
                    return false
                }
                p.div.style[Device.styles.vendorTransition] = J;
                p.css(A);
                p.transform(j);
                z.playing = true;
                p.div.addEventListener(Device.tween.complete, m)
            })
        }
    }
    function m() {
        if (z.kill || !p || !p.div) {
            return false
        }
        w()
    }
    function x() {
        if (!z.kill && p && p.div) {
            p.css(A);
            p.transform(j)
        }
    }
    function e() {
        if (!p || !p.div) {
            return false
        }
        if (p._cssTween) {
            p._cssTween.stop()
        }
        p.div.removeEventListener(Device.tween.complete, m);
        z.playing = false
    }
    function C() {
        if (g) {
            TweenManager._dynamicPool.put(E.clear());
            TweenManager._dynamicPool.put(d.clear());
            TweenManager._dynamicPool.put(q.clear());
            TweenManager._dynamicPool.put(G.clear())
        }
        g = t = o = G = E = F = null;
        f = q = d = j = o = null;
        v = y = b = null;
        A = D = l = u = s = r = null;
        z.kill = false
    }
    function w() {
        if (z.playing) {
            p._cssTween = null;
            if (!g) {
                e()
            }
            z.playing = false;
            if (f) {
                f.play()
            } else {
                if (s) {
                    s()
                }
            }
            C()
        }
    }
    this.start = function(I, K, L, M, H, N, J) {
        p = I;
        A = K;
        D = L;
        l = M;
        u = H;
        s = N;
        r = J;
        z = this;
        i();
        return this
    }
    ;
    this.stop = function() {
        if (z.playing) {
            p.div.style[Device.styles.vendor + "Transition"] = "";
            p.div._transition = false;
            z.kill = true;
            p._cssTween = null;
            if (f) {
                f.stop()
            }
            if (g && t && t.stop) {
                t.stop()
            }
            if (g && o && o.stop) {
                o.stop()
            } else {
                e()
            }
            C()
        }
    }
    ;
    this.play = function(H) {
        if (!z.playing) {
            if (g) {
                if (!H) {
                    B()
                }
                k()
            } else {
                h();
                Render.nextFrame(a)
            }
        }
    }
    ;
    this.chain = function(H) {
        f = H;
        return f
    }
});
(function() {
        $.fn.transform = function(b) {
            TweenManager.clearCSSTween(this);
            if (Device.tween.css2d) {
                if (!b) {
                    b = this
                } else {
                    for (var a in b) {
                        if (typeof b[a] === "number") {
                            this[a] = b[a]
                        }
                    }
                }
                if (!this._matrix) {
                    this.div.style[Device.styles.vendorTransform] = TweenManager.parseTransform(b)
                } else {
                    if (this._matrix.type == "matrix2") {
                        this._matrix.setTRS(this.x, this.y, this.rotation, this.scaleX || this.scale, this.scaleY || this.scale)
                    } else {
                        this._matrix.setTRS(this.x, this.y, this.z, this.rotationX, this.rotationY, this.rotationZ, this.scaleX || this.scale, this.scaleY || this.scale, this.scaleZ || this.scale)
                    }
                    this.div.style[Device.styles.vendorTransform] = this._matrix.getCSS()
                }
            }
            return this
        }
        ;
        $.fn.useMatrix3D = function() {
            this._matrix = new Matrix4();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scale = 1;
            return this
        }
        ;
        $.fn.useMatrix2D = function() {
            this._matrix = new Matrix2();
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scale = 1;
            return this
        }
        ;
        $.fn.matrix = function(a) {
            this.div.style[Device.styles.vendorTransform] = a;
            return this
        }
        ;
        $.fn.accelerate = function() {
            this.__accelerated = true;
            if (!this.z) {
                this.z = 0;
                this.transform()
            }
        }
        ;
        $.fn.backfaceVisibility = function(a) {
            if (a) {
                this.div.style[CSS.prefix("BackfaceVisibility")] = "visible"
            } else {
                this.div.style[CSS.prefix("BackfaceVisibility")] = "hidden"
            }
        }
        ;
        $.fn.enable3D = function(b, a, c) {
            this.div.style[CSS.prefix("TransformStyle")] = "preserve-3d";
            if (b) {
                this.div.style[CSS.prefix("Perspective")] = b + "px"
            }
            a = typeof a === "number" ? a + "px" : a;
            c = typeof c === "number" ? c + "px" : c;
            this.div.style[CSS.prefix("PerspectiveOrigin")] = a + " " + c;
            return this
        }
        ;
        $.fn.disable3D = function() {
            this.div.style[CSS.prefix("TransformStyle")] = "";
            this.div.style[CSS.prefix("Perspective")] = "";
            return this
        }
        ;
        $.fn.transformPoint = function(a, d, c) {
            var b = "";
            if (typeof a !== "undefined") {
                b += (typeof a === "number" ? a + "px " : a)
            }
            if (typeof d !== "undefined") {
                b += (typeof d === "number" ? d + "px " : d)
            }
            if (typeof c !== "undefined") {
                b += (typeof c === "number" ? c + "px" : c)
            }
            this.div.style[CSS.prefix("TransformOrigin")] = b;
            return this
        }
        ;
        $.fn.tween = function(c, d, e, a, f, b) {
            if (typeof a === "boolean") {
                b = a;
                a = 0;
                f = null
            } else {
                if (typeof a === "function") {
                    f = a;
                    a = 0
                }
            }
            if (typeof f === "boolean") {
                b = f;
                f = null
            }
            if (!a) {
                a = 0
            }
            return TweenManager._initCSS(this, c, d, e, a, f, b)
        }
        ;
        $.fn.clearTransform = function() {
            if (typeof this.x === "number") {
                this.x = 0
            }
            if (typeof this.y === "number") {
                this.y = 0
            }
            if (typeof this.z === "number") {
                this.z = 0
            }
            if (typeof this.scale === "number") {
                this.scale = 1
            }
            if (typeof this.scaleX === "number") {
                this.scaleX = 1
            }
            if (typeof this.scaleY === "number") {
                this.scaleY = 1
            }
            if (typeof this.rotation === "number") {
                this.rotation = 0
            }
            if (typeof this.rotationX === "number") {
                this.rotationX = 0
            }
            if (typeof this.rotationY === "number") {
                this.rotationY = 0
            }
            if (typeof this.rotationZ === "number") {
                this.rotationZ = 0
            }
            if (typeof this.skewX === "number") {
                this.skewX = 0
            }
            if (typeof this.skewY === "number") {
                this.skewY = 0
            }
            if (!this.__accelerated) {
                this.div.style[Device.styles.vendorTransform] = ""
            } else {
                this.accelerate()
            }
            return this
        }
        ;
        $.fn.stopTween = function() {
            if (this._cssTween) {
                this._cssTween.stop()
            }
            if (this._mathTween) {
                this._mathTween.stop()
            }
            return this
        }
    }
)();
(function() {
        TweenManager.Transforms = ["scale", "scaleX", "scaleY", "x", "y", "z", "rotation", "rotationX", "rotationY", "rotationZ", "skewX", "skewY", ];
        TweenManager.CSSEases = [{
            name: "easeOutCubic",
            curve: "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
        }, {
            name: "easeOutQuad",
            curve: "cubic-bezier(0.250, 0.460, 0.450, 0.940)"
        }, {
            name: "easeOutQuart",
            curve: "cubic-bezier(0.165, 0.840, 0.440, 1.000)"
        }, {
            name: "easeOutQuint",
            curve: "cubic-bezier(0.230, 1.000, 0.320, 1.000)"
        }, {
            name: "easeOutSine",
            curve: "cubic-bezier(0.390, 0.575, 0.565, 1.000)"
        }, {
            name: "easeOutExpo",
            curve: "cubic-bezier(0.190, 1.000, 0.220, 1.000)"
        }, {
            name: "easeOutCirc",
            curve: "cubic-bezier(0.075, 0.820, 0.165, 1.000)"
        }, {
            name: "easeOutBack",
            curve: "cubic-bezier(0.175, 0.885, 0.320, 1.275)"
        }, {
            name: "easeInCubic",
            curve: "cubic-bezier(0.550, 0.055, 0.675, 0.190)"
        }, {
            name: "easeInQuad",
            curve: "cubic-bezier(0.550, 0.085, 0.680, 0.530)"
        }, {
            name: "easeInQuart",
            curve: "cubic-bezier(0.895, 0.030, 0.685, 0.220)"
        }, {
            name: "easeInQuint",
            curve: "cubic-bezier(0.755, 0.050, 0.855, 0.060)"
        }, {
            name: "easeInSine",
            curve: "cubic-bezier(0.470, 0.000, 0.745, 0.715)"
        }, {
            name: "easeInCirc",
            curve: "cubic-bezier(0.600, 0.040, 0.980, 0.335)"
        }, {
            name: "easeInBack",
            curve: "cubic-bezier(0.600, -0.280, 0.735, 0.045)"
        }, {
            name: "easeInOutCubic",
            curve: "cubic-bezier(0.645, 0.045, 0.355, 1.000)"
        }, {
            name: "easeInOutQuad",
            curve: "cubic-bezier(0.455, 0.030, 0.515, 0.955)"
        }, {
            name: "easeInOutQuart",
            curve: "cubic-bezier(0.770, 0.000, 0.175, 1.000)"
        }, {
            name: "easeInOutQuint",
            curve: "cubic-bezier(0.860, 0.000, 0.070, 1.000)"
        }, {
            name: "easeInOutSine",
            curve: "cubic-bezier(0.445, 0.050, 0.550, 0.950)"
        }, {
            name: "easeInOutExpo",
            curve: "cubic-bezier(1.000, 0.000, 0.000, 1.000)"
        }, {
            name: "easeInOutCirc",
            curve: "cubic-bezier(0.785, 0.135, 0.150, 0.860)"
        }, {
            name: "easeInOutBack",
            curve: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
        }, {
            name: "linear",
            curve: "linear"
        }]
    }
)();
Class(function Mouse() {
    var d = this;
    var b;
    this.x = 0;
    this.y = 0;
    function c(g) {
        d.ready = true;
        var f = Utils.touchEvent(g);
        d.x = f.x;
        d.y = f.y
    }
    function a() {
        d.x = d.y = 0
    }
    this.capture = function(e, f) {
        if (b) {
            return false
        }
        b = true;
        d.x = e || 0;
        d.y = f || 0;
        if (!Device.mobile) {
            __window.bind("mousemove", c)
        } else {
            __window.bind("touchend", a);
            __window.bind("touchmove", c);
            __window.bind("touchstart", c)
        }
    }
    ;
    this.stop = function() {
        if (!b) {
            return false
        }
        b = false;
        d.x = 0;
        d.y = 0;
        if (!Device.mobile) {
            __window.unbind("mousemove", c)
        } else {
            __window.unbind("touchend", a);
            __window.unbind("touchmove", c);
            __window.unbind("touchstart", c)
        }
    }
    ;
    this.preventClicks = function() {
        d._preventClicks = true;
        setTimeout(function() {
            d._preventClicks = false
        }, 500)
    }
    ;
    this.preventFireAfterClick = function() {
        d._preventFire = true
    }
}, "Static");
(function() {
        $.fn.click = function(d, a) {
            var c = this;
            function b(f) {
                if (!c.div) {
                    return false
                }
                if (Mouse._preventClicks) {
                    return false
                }
                f.object = c.div.className == "hit" ? c.parent() : c;
                f.action = "click";
                if (!f.pageX) {
                    f.pageX = f.clientX;
                    f.pageY = f.clientY
                }
                if (d) {
                    d(f)
                }
                if (Mouse.autoPreventClicks) {
                    Mouse.preventClicks()
                }
            }
            if (a) {
                if (this._events.click) {
                    this.div[Hydra.removeEvent](Hydra.translateEvent("click"), this._events.click, true);
                    this.div.style.cursor = "auto";
                    this._events.click = null
                }
            } else {
                if (this._events.click) {
                    this.click(null, true)
                }
                this.div[Hydra.addEvent](Hydra.translateEvent("click"), b, true);
                this.div.style.cursor = "pointer"
            }
            this._events.click = b;
            return this
        }
        ;
        $.fn.hover = function(g, a) {
            var f = this;
            var e = false;
            var d;
            function b(j) {
                if (!f.div) {
                    return false
                }
                var i = Date.now();
                var h = j.toElement || j.relatedTarget;
                if (d && (i - d) < 5) {
                    d = i;
                    return false
                }
                d = i;
                j.object = f.div.className == "hit" ? f.parent() : f;
                switch (j.type) {
                    case "mouseout":
                        j.action = "out";
                        break;
                    case "mouseleave":
                        j.action = "out";
                        break;
                    default:
                        j.action = "over";
                        break
                }
                if (e) {
                    if (Mouse._preventClicks) {
                        return false
                    }
                    if (j.action == "over") {
                        return false
                    }
                    if (j.action == "out") {
                        if (c(f.div, h)) {
                            return false
                        }
                    }
                    e = false
                } else {
                    if (j.action == "out") {
                        return false
                    }
                    e = true
                }
                if (!j.pageX) {
                    j.pageX = j.clientX;
                    j.pageY = j.clientY
                }
                if (g) {
                    g(j)
                }
            }
            function c(l, j) {
                var h = l.children.length - 1;
                for (var k = h; k > -1; k--) {
                    if (j == l.children[k]) {
                        return true
                    }
                }
                for (k = h; k > -1; k--) {
                    if (c(l.children[k], j)) {
                        return true
                    }
                }
            }
            if (a) {
                if (this._events.hover) {
                    this.div[Hydra.removeEvent](Hydra.translateEvent("mouseover"), this._events.hover, true);
                    this.div[Hydra.removeEvent](Hydra.translateEvent("mouseout"), this._events.hover, true);
                    this._events.hover = null
                }
            } else {
                if (this._events.hover) {
                    this.hover(null, true)
                }
                this.div[Hydra.addEvent](Hydra.translateEvent("mouseover"), b, true);
                this.div[Hydra.addEvent](Hydra.translateEvent("mouseout"), b, true)
            }
            this._events.hover = b;
            return this
        }
        ;
        $.fn.press = function(d, a) {
            var c = this;
            function b(f) {
                if (!c.div) {
                    return false
                }
                f.object = c.div.className == "hit" ? c.parent() : c;
                switch (f.type) {
                    case "mousedown":
                        f.action = "down";
                        break;
                    default:
                        f.action = "up";
                        break
                }
                if (!f.pageX) {
                    f.pageX = f.clientX;
                    f.pageY = f.clientY
                }
                if (d) {
                    d(f)
                }
            }
            if (a) {
                if (this._events.press) {
                    this.div[Hydra.removeEvent](Hydra.translateEvent("mousedown"), this._events.press, true);
                    this.div[Hydra.removeEvent](Hydra.translateEvent("mouseup"), this._events.press, true);
                    this._events.press = null
                }
            } else {
                if (this._events.press) {
                    this.press(null, true)
                }
                this.div[Hydra.addEvent](Hydra.translateEvent("mousedown"), b, true);
                this.div[Hydra.addEvent](Hydra.translateEvent("mouseup"), b, true)
            }
            this._events.press = b;
            return this
        }
        ;
        $.fn.bind = function(b, f) {
            if (b == "touchstart") {
                if (!Device.mobile) {
                    b = "mousedown"
                }
            } else {
                if (b == "touchmove") {
                    if (!Device.mobile) {
                        b = "mousemove"
                    }
                } else {
                    if (b == "touchend") {
                        if (!Device.mobile) {
                            b = "mouseup"
                        }
                    }
                }
            }
            this._events["bind_" + b] = this._events["bind_" + b] || [];
            var d = this._events["bind_" + b];
            var c = {};
            c.callback = f;
            c.target = this.div;
            d.push(c);
            function a(j) {
                var k = Utils.touchEvent(j);
                j.x = k.x;
                j.y = k.y;
                for (var g = 0; g < d.length; g++) {
                    var h = d[g];
                    if (h.target == j.currentTarget) {
                        h.callback(j)
                    }
                }
            }
            if (!this._events["fn_" + b]) {
                this._events["fn_" + b] = a;
                this.div[Hydra.addEvent](Hydra.translateEvent(b), a, true)
            }
            return this
        }
        ;
        $.fn.unbind = function(a, e) {
            if (a == "touchstart") {
                if (!Device.mobile) {
                    a = "mousedown"
                }
            } else {
                if (a == "touchmove") {
                    if (!Device.mobile) {
                        a = "mousemove"
                    }
                } else {
                    if (a == "touchend") {
                        if (!Device.mobile) {
                            a = "mouseup"
                        }
                    }
                }
            }
            var d = this._events["bind_" + a];
            if (!d) {
                return this
            }
            for (var b = 0; b < d.length; b++) {
                var c = d[b];
                if (c.callback == e) {
                    d.splice(b, 1)
                }
            }
            if (this._events["fn_" + a] && !d.length) {
                this.div[Hydra.removeEvent](Hydra.translateEvent(a), this._events["fn_" + a], true);
                this._events["fn_" + a] = null
            }
            return this
        }
        ;
        $.fn.interact = function(c, a, b) {
            if (!this.hit) {
                this.hit = $(".hit");
                this.hit.css({
                    width: "100%",
                    height: "100%",
                    zIndex: 99999,
                    top: 0,
                    left: 0,
                    position: "absolute",
                    background: "rgba(255, 255, 255, 0)"
                });
                this.addChild(this.hit)
            }
            if (!Device.mobile) {
                this.hit.hover(c).click(a)
            } else {
                this.hit.touchClick(!b ? c : null, a)
            }
        }
        ;
        Hydra.eventTypes = ["hover", "press", "click", "touchClick", "touchSwipe"];
        Hydra.translateEvent = function(a) {
            if (Hydra.addEvent == "attachEvent") {
                switch (a) {
                    case "click":
                        return "onclick";
                        break;
                    case "mouseover":
                        return "onmouseover";
                        break;
                    case "mouseout":
                        return "onmouseleave";
                        break;
                    case "mousedown":
                        return "onmousedown";
                        break;
                    case "mouseup":
                        return "onmouseup";
                        break;
                    case "mousemove":
                        return "onmousemove";
                        break
                }
            }
            return a
        }
    }
)();
(function() {
        $.fn.attr = function(a, b) {
            if (a && b) {
                if (b == "") {
                    this.div.removeAttribute(a)
                } else {
                    this.div.setAttribute(a, b)
                }
            } else {
                if (a) {
                    return this.div.getAttribute(a)
                }
            }
            return this
        }
        ;
        $.fn.val = function(a) {
            if (typeof a === "undefined") {
                return this.div.value
            } else {
                this.div.value = a
            }
            return this
        }
        ;
        $.fn.change = function(b) {
            var a = this;
            if (this._type == "select") {
                this.div.onchange = function() {
                    b({
                        object: a,
                        value: a.div.value || ""
                    })
                }
            }
        }
    }
)();
(function() {
        $.fn.keypress = function(a) {
            this.div.onkeypress = function(b) {
                b = b || window.event;
                b.code = b.keyCode ? b.keyCode : b.charCode;
                a(b)
            }
        }
        ;
        $.fn.keydown = function(a) {
            this.div.onkeydown = function(b) {
                b = b || window.event;
                b.code = b.keyCode;
                a(b)
            }
        }
        ;
        $.fn.keyup = function(a) {
            this.div.onkeyup = function(b) {
                b = b || window.event;
                b.code = b.keyCode;
                a(b)
            }
        }
    }
)();
Class(function Swipe() {
    var c;
    var b, a;
    this.max = 0;
    this.width = 100;
    this.currentSlide = 0;
    this.saveX = 0;
    this.currentX = 0;
    this.threshold = 0.1;
    this.minDist = 10;
    this.disableY = false;
    this._values = new Object();
    this.__slide = function(e) {
        var f = c.currentSlide;
        c.currentSlide += e;
        var d = -c.currentSlide * c.slideWidth;
        c.swipeContainer.tween({
            x: d
        }, 500, "easeOutCubic");
        c.currentX = d;
        if (f != c.currentSlide && c.slideComplete) {
            c.slideComplete(c.currentSlide)
        }
    }
    ;
    this.__start = function(d) {
        if ((!Device.mobile || d.touches.length == 1) && !a) {
            c.swiping = true;
            c.swipeContainer.stopTween();
            c._values.x = Utils.touchEvent(d).x;
            c._values.time = Date.now();
            if (Device.mobile) {
                __window.bind("touchmove", c.__move)
            } else {
                __window.bind("mousemove", c.__move)
            }
            if (c.disableY) {
                b = d.touches[0].pageY
            }
        }
    }
    ;
    this.__move = function(g) {
        if ((!Device.mobile || g.touches.length == 1) && !a) {
            if (c.disableY) {
                var i = Utils.touchEvent(g).y;
                if (Math.abs(i - b) > 25) {
                    a = true;
                    if (Device.mobile) {
                        __window.unbind("touchmove", c.__move)
                    } else {
                        __window.unbind("mousemove", c.__move)
                    }
                }
            }
            var d = Utils.touchEvent(g).x;
            var f = d - c._values.x;
            var h = c.saveX + f;
            if (h > 0) {
                f /= 2;
                c._values.snap = "left"
            } else {
                if (h < c.max) {
                    f /= 2;
                    c._values.snap = "right"
                } else {
                    c._values.snap = null
                }
            }
            c.currentX = c.saveX + f;
            c.swipeContainer.x = c.currentX;
            c.swipeContainer.transform();
            if (c.move) {
                c.move(c.currentX, c.currentSlide)
            }
        }
    }
    ;
    this.__end = function(j) {
        c.swiping = false;
        if (Device.mobile) {
            __window.unbind("touchmove", c.__move)
        } else {
            __window.unbind("mousemove", c.__move)
        }
        a = false;
        if (a) {
            c.__slide(0)
        } else {
            if (c._values.snap) {
                var f = 0;
                if (c._values.snap == "right") {
                    f = c.max
                }
                c.swipeContainer.tween({
                    x: f
                }, 500, "easeOutCubic");
                c.currentX = f;
                c._values.snap = null
            } else {
                var d = -(c.slideWidth * c.currentSlide + c.slideWidth / 2);
                var i = d + c.slideWidth;
                if (c.currentX < d) {
                    c.__slide(1)
                } else {
                    if (c.currentX > i) {
                        c.__slide(-1)
                    } else {
                        var h = Date.now();
                        var l = Utils.touchEvent(j).x - c._values.x;
                        var k = h - c._values.time;
                        var g = l / k;
                        if (Math.abs(l) >= c.minDist && Math.abs(g) > c.threshold) {
                            if (g < 0) {
                                c.__slide(1)
                            } else {
                                c.__slide(-1)
                            }
                        } else {
                            c.__slide(0)
                        }
                    }
                }
            }
        }
        c._values.x = c._values.time = null;
        c.saveX = c.currentX
    }
    ;
    this.addListeners = function(d) {
        c = this;
        c.slideWidth = c.width / c.slides;
        c.max = -c.width + c.slideWidth;
        c.swipeContainer = d;
        d.transform({
            x: 0
        });
        if (Device.mobile) {
            d.bind("touchstart", c.__start);
            __window.bind("touchend", c.__end);
            __window.bind("touchcancel", c.__touchCancel)
        } else {
            d.bind("mousedown", c.__start);
            __window.bind("mouseup", c.__end)
        }
    }
    ;
    this.removeListeners = function() {
        var d = c.swipeContainer;
        if (Device.mobile) {
            d.unbind("touchstart", c.__start);
            __window.unbind("touchend", c.__end);
            __window.unbind("touchcancel", c.__touchCancel)
        } else {
            d.unbind("mousedown", c.__start);
            __window.unbind("mouseup", c.__end)
        }
    }
});
(function() {
        $.fn.touchSwipe = function(i, c) {
            if (!window.addEventListener) {
                return this
            }
            var d = this;
            var a = 75;
            var k, j;
            var f = false;
            var e = Device.mobile;
            var l = {};
            if (e) {
                if (!c) {
                    if (this._events.touchswipe) {
                        this.touchSwipe(null, true)
                    }
                    this.div.addEventListener("touchstart", b);
                    this.div.addEventListener("touchend", h);
                    this.div.addEventListener("touchcancel", h);
                    this._events.touchswipe = true
                } else {
                    this.div.removeEventListener("touchstart", b);
                    this.div.removeEventListener("touchend", h);
                    this.div.removeEventListener("touchcancel", h);
                    this._events.touchswipe = false
                }
            }
            function b(m) {
                var n = Utils.touchEvent(m);
                if (!d.div) {
                    return false
                }
                if (m.touches.length == 1) {
                    k = n.x;
                    j = n.y;
                    f = true;
                    d.div.addEventListener("touchmove", g)
                }
            }
            function g(o) {
                if (!d.div) {
                    return false
                }
                if (f) {
                    var p = Utils.touchEvent(o);
                    var n = k - p.x;
                    var m = j - p.y;
                    l.direction = null;
                    l.moving = null;
                    l.x = null;
                    l.y = null;
                    l.evt = o;
                    if (Math.abs(n) >= a) {
                        h();
                        if (n > 0) {
                            l.direction = "left"
                        } else {
                            l.direction = "right"
                        }
                    } else {
                        if (Math.abs(m) >= a) {
                            h();
                            if (m > 0) {
                                l.direction = "up"
                            } else {
                                l.direction = "down"
                            }
                        } else {
                            l.moving = true;
                            l.x = n;
                            l.y = m
                        }
                    }
                    if (i) {
                        i(l)
                    }
                }
            }
            function h(m) {
                if (!d.div) {
                    return false
                }
                k = j = f = false;
                d.div.removeEventListener("touchmove", g)
            }
            return this
        }
        ;
        $.fn.touchClick = function(f, l, c) {
            if (!window.addEventListener) {
                return this
            }
            var d = this;
            var n, m;
            var e = Device.mobile;
            var h = this;
            var b = {};
            var g = {};
            if (f === null && l === true) {
                c = true
            }
            if (!c) {
                if (this._events.touchclick) {
                    this.touchClick(null, null, true)
                }
                this._events.touchclick = true;
                if (e) {
                    this.div.addEventListener("touchmove", i, false);
                    this.div.addEventListener("touchstart", a, false);
                    this.div.addEventListener("touchend", j, false)
                } else {
                    this.div.addEventListener("mousedown", a, false);
                    this.div.addEventListener("mouseup", j, false)
                }
            } else {
                if (e) {
                    this.div.removeEventListener("touchmove", i, false);
                    this.div.removeEventListener("touchstart", a, false);
                    this.div.removeEventListener("touchend", j, false)
                } else {
                    this.div.removeEventListener("mousedown", a, false);
                    this.div.removeEventListener("mouseup", j, false)
                }
                this._events.touchclick = false
            }
            function i(o) {
                if (!d.div) {
                    return false
                }
                g = Utils.touchEvent(o);
                if (Utils.findDistance(b, g) > 20) {
                    m = true
                } else {
                    m = false
                }
            }
            function k(o) {
                var p = Utils.touchEvent(o);
                o.touchX = p.x;
                o.touchY = p.y;
                b.x = o.touchX;
                b.y = o.touchY
            }
            function a(o) {
                if (!d.div) {
                    return false
                }
                n = Date.now();
                o.preventDefault();
                o.action = "over";
                o.object = d.div.className == "hit" ? d.parent() : d;
                k(o);
                if (f) {
                    f(o)
                }
            }
            function j(q) {
                if (!d.div) {
                    return false
                }
                var p = Date.now();
                var o = false;
                q.object = d.div.className == "hit" ? d.parent() : d;
                k(q);
                if (n && p - n < 750) {
                    if (Mouse._preventClicks) {
                        return false
                    }
                    if (l && !m) {
                        o = true;
                        q.action = "click";
                        if (l && !m) {
                            l(q)
                        }
                        if (Mouse.autoPreventClicks) {
                            Mouse.preventClicks()
                        }
                    }
                }
                if (f) {
                    q.action = "out";
                    if (!Mouse._preventFire) {
                        f(q)
                    }
                }
                m = false
            }
            return this
        }
    }
)();
Mobile.Class(function Accelerometer() {
    var b = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    function a(c) {
        switch (window.orientation) {
            case 0:
                b.x = -c.accelerationIncludingGravity.x;
                b.y = c.accelerationIncludingGravity.y;
                b.z = c.accelerationIncludingGravity.z;
                break;
            case 180:
                b.x = c.accelerationIncludingGravity.x;
                b.y = -c.accelerationIncludingGravity.y;
                b.z = c.accelerationIncludingGravity.z;
                break;
            case 90:
                b.x = c.accelerationIncludingGravity.y;
                b.y = c.accelerationIncludingGravity.x;
                b.z = c.accelerationIncludingGravity.z;
                break;
            case -90:
                b.x = -c.accelerationIncludingGravity.y;
                b.y = -c.accelerationIncludingGravity.x;
                b.z = c.accelerationIncludingGravity.z;
                break
        }
        if (c.rotationRate) {
            b.alpha = c.rotationRate.alpha;
            b.beta = c.rotationRate.beta;
            b.gamma = c.rotationRate.gamma
        }
    }
    this.capture = function() {
        window.ondevicemotion = a
    }
    ;
    this.stop = function() {
        window.ondevicemotion = null;
        b.x = b.y = b.z = 0
    }
}, "Static");
Class(function Video(m) {
    Inherit(this, Component);
    var i = this;
    var g, n, b, k, l, d;
    var c = 0;
    var e = {};
    this.loop = false;
    this.playing = false;
    this.width = m.width || 0;
    this.height = m.height || 0;
    (function() {
            j();
            a()
        }
    )();
    function j() {
        var o = m.src;
        if (!o.strpos("webm") && !o.strpos("mp4") && !o.strpos("ogv")) {
            o += "." + Device.media.video
        }
        i.div = document.createElement("video");
        i.div.src = o;
        i.div.controls = m.controls;
        i.div.id = m.id || "";
        i.div.width = m.width;
        i.div.height = m.height;
        d = i.div.loop = m.loop;
        i.div.preload = true;
        i.object = $(i.div);
        i.width = m.width;
        i.height = m.height;
        i.object.size(i.width, i.height)
    }
    function a() {
        if (!Device.mobile && !Device.browser.ie) {
            i.div.play();
            setTimeout(function() {
                i.div.pause()
            }, 1)
        }
    }
    function f() {
        if (!i.div || !i.events) {
            return Render.stopRender(f)
        }
        i.duration = i.div.duration;
        i.time = i.div.currentTime;
        if (i.div.currentTime == b) {
            c++;
            if (c > 60 && !k) {
                k = true;
                i.events.fire(HydraEvents.ERROR, null, true)
            }
        } else {
            c = 0;
            if (k) {
                i.events.fire(HydraEvents.READY, null, true);
                k = false
            }
        }
        b = i.div.currentTime;
        if (i.div.currentTime >= i.div.duration - 0.001) {
            if (!d) {
                Render.stopRender(f);
                i.events.fire(HydraEvents.COMPLETE, null, true)
            }
        }
        e.time = i.div.currentTime;
        e.duration = i.div.duration;
        i.events.fire(HydraEvents.UPDATE, e, true)
    }
    function h() {
        if (!Device.mobile) {
            if (!l) {
                i.buffered = i.div.readyState == i.div.HAVE_ENOUGH_DATA
            } else {
                var o = -1;
                var q = i.div.seekable;
                if (q) {
                    for (var p = 0; p < q.length; p++) {
                        if (q.start(p) < l) {
                            o = q.end(p) - 0.5
                        }
                    }
                    if (o >= l) {
                        i.buffered = true
                    }
                } else {
                    i.buffered = true
                }
            }
        } else {
            i.buffered = true
        }
        if (i.buffered) {
            Render.stopRender(h);
            i.events.fire(HydraEvents.READY, null, true)
        }
    }
    this.set("loop", function(o) {
        if (!i.div) {
            return
        }
        d = o;
        i.div.loop = o
    });
    this.get("loop", function() {
        return d
    });
    this.play = function() {
        if (!i.div) {
            return false
        }
        if (!Device.mobile) {
            if (i.ready()) {
                i.playing = true;
                i.div.play();
                Render.startRender(f)
            } else {
                setTimeout(i.play, 10)
            }
        } else {
            i.playing = true;
            i.div.play();
            Render.startRender(f)
        }
    }
    ;
    this.pause = function() {
        if (!i.div) {
            return false
        }
        i.playing = false;
        i.div.pause();
        Render.stopRender(f)
    }
    ;
    this.stop = function() {
        i.playing = false;
        Render.stopRender(f);
        if (!i.div) {
            return false
        }
        i.div.pause();
        i.div.currentTime = 0
    }
    ;
    this.volume = function(o) {
        if (!i.div) {
            return false
        }
        i.div.volume = o
    }
    ;
    this.seek = function(o) {
        if (!i.div) {
            return false
        }
        if (i.div.readyState <= 1) {
            return setTimeout(function() {
                i.seek(o)
            }, 10)
        }
        i.div.currentTime = o
    }
    ;
    this.canPlayTo = function(o) {
        l = null;
        if (o) {
            l = o
        }
        if (!i.div) {
            return false
        }
        if (!i.buffered) {
            Render.startRender(h)
        }
        return this.buffered
    }
    ;
    this.ready = function() {
        if (!i.div) {
            return false
        }
        return i.div.readyState == i.div.HAVE_ENOUGH_DATA
    }
    ;
    this.size = function(o, p) {
        if (!i.div) {
            return false
        }
        this.div.width = this.width = o;
        this.div.height = this.height = p;
        this.object.size(o, p)
    }
    ;
    this.destroy = function() {
        this.stop();
        this.object.remove();
        return this._destroy()
    }
});
Class(function Webcam(a, d, b) {
    Inherit(this, Component);
    var h = this;
    (function() {
            f();
            e()
        }
    )();
    function f() {
        h.div = document.createElement("video");
        h.div.width = a;
        h.div.height = d;
        h.div.autoplay = true;
        h.element = $(h.div)
    }
    function e() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({
            video: true,
            audio: b
        }, g, c)
    }
    function g(i) {
        h.div.src = window.URL.createObjectURL(i);
        h.events.fire(HydraEvents.READY, null, true);
        h.element.show()
    }
    function c() {
        h.events.fire(HydraEvents.ERROR, null, true)
    }
    this.size = function(i, j) {
        h.div.width = a = i;
        h.div.height = d = j;
        if (h.canvas) {
            h.canvas.resize(i, j)
        }
    }
    ;
    this.getPixels = function() {
        if (!h.canvas) {
            h.canvas = h.initClass(Canvas, a, d, null)
        }
        h.canvas.context.drawImage(h.div, 0, 0, a, d);
        return h.canvas.context.getImageData(0, 0, a, d)
    }
    ;
    this.destroy = function() {
        g = c = null;
        return this._destroy()
    }
});
Class(function GATracker() {
    this.trackPage = function(a) {
        if (typeof ga !== "undefined") {
            ga("send", "pageview", a)
        }
    }
    ;
    this.trackEvent = function(b, d, a, c) {
        if (typeof ga !== "undefined") {
            ga("send", "event", b, d, a, (c || 0))
        }
    }
}, "Static");
Class(function Text() {
    this.JOKES = [{
        setup: "Our wedding was so beautiful,",
        punchline: "even the cake was in tiers"
    }, {
        setup: "I'm reading a book on the history of glue",
        punchline: "I just can't seem to put it down"
    }, {
        setup: "What do you call an Argentinian with a rubber toe?",
        punchline: "Roberto"
    }, {
        setup: "I am terrified of elevators,",
        punchline: "I'm going to start taking steps to avoid them"
    }, {
        setup: "Why do crabs never give to charity?",
        punchline: "Because they're shellfish."
    }, {
        setup: "Why don't skeletons ever go trick or treating?",
        punchline: "Because they have no body to go with"
    }, {
        setup: "What do you call cheese by itself?",
        punchline: "Provolone"
    }, {
        setup: '"Ill call you later."',
        punchline: "Don't call me later, call me Dad"
    }, {
        setup: "Dad, I'm hungry.",
        punchline: "Hello, Hungry. I'm Dad"
    }, {
        setup: "Where does Fonzie like to go for lunch?",
        punchline: "Chick-Fil-Eyyyyyyyy"
    }, {
        setup: "Did you hear about the cheese factory that exploded in France?",
        punchline: "There was nothing left but de Brie"
    }, {
        setup: "I knew I shouldn’t have had the seafood",
        punchline: "I’m feeling a little eel"
    }, {
        setup: "What do you call a sketchy Italian neighbour hood?",
        punchline: "The Spaghetto"
    }, {
        setup: "Why can't you have a nose 12 inches long?",
        punchline: "Because then it would be a foot"
    }, {
        setup: "My wife is on a tropical food diet, the house is full of the stuff",
        punchline: "It's enough to make a mango crazy"
    }, {
        setup: "I’d like to give a big shout out to all the sidewalks",
        punchline: "for keeping me off the streets"
    }, {
        setup: "What does an annoying pepper do?",
        punchline: "It get’s jalapeño face"
    }, {
        setup: "Why did the scarecrow win an award?",
        punchline: "Because he was outstanding in his field"
    }, {
        setup: "Why do bees hum?",
        punchline: "Because they don't know the words"
    }, {
        setup: "What do prisoners use to call each other?",
        punchline: "Cell phones"
    }, {
        setup: "What do you call cheese that isn't yours?",
        punchline: "Nacho Cheese"
    }, {
        setup: "What do you get when you cross a snowman with a vampire",
        punchline: "Frostbite"
    }, {
        setup: "What lies at the bottom of the ocean and twitches?",
        punchline: "A nervous wreck"
    }, {
        setup: "Why couldn't the bicycle stand up by itself?",
        punchline: "It was two tired"
    }, {
        setup: "What did the grape do when he got stepped on?",
        punchline: "He let out a little wine"
    }, {
        setup: "I've just been diagnosed as colorblind",
        punchline: "I know, it certainly has come out of the purple"
    }, {
        setup: "Last night I dreamt I was a muffler",
        punchline: "I woke up exhausted"
    }, {
        setup: "What do you call a deer with no eyes?",
        punchline: "No idea"
    }, {
        setup: "I just watched a program about beavers",
        punchline: "It was the best dam program I've ever seen"
    }, {
        setup: "Two satellites decided to get married",
        punchline: "The wedding wasn't much, but the reception was incredible"
    }, {
        setup: "Did you hear about the guy who invented the knock knock joke?",
        punchline: "He won the 'no-bell' prize"
    }, {
        setup: "Is this pool safe for diving?",
        punchline: "It deep ends"
    }, {
        setup: "I used to hate facial hair,",
        punchline: "but then it grew on me"
    }, {
        setup: "What do you call a fake noodle?",
        punchline: "An Impasta"
    }, {
        setup: "Can February March?",
        punchline: "No, but April May"
    }, {
        setup: "Wanna hear a joke about paper?",
        punchline: "Nevermind, it's tearable"
    }, {
        setup: "Don't trust atoms",
        punchline: "They make up everything"
    }, {
        setup: "How many apples grow on a tree?",
        punchline: "All of them"
    }, {
        setup: "What do you call somebody with no body and no nose?",
        punchline: "Nobody knows"
    }, {
        setup: "What did the buffalo say to his son when he left for college?",
        punchline: "Bison"
    }, {
        setup: "What do you call a pony with a sore throat?",
        punchline: "A little horse"
    }, {
        setup: "I bought shoes from a drug dealer once",
        punchline: "I don't know what he laced them with, but I was tripping all day"
    }, {
        setup: "Where do you learn to make ice cream?",
        punchline: "Sunday school"
    }, {
        setup: "What did the officer molecule say to the suspect molecule?",
        punchline: "I've got my ion you"
    }, {
        setup: "If prisoners could take their own mug shots,",
        punchline: "they'd be called cellfies"
    }, {
        setup: "Why can't you hear a pterodactyl go to the bathroom?",
        punchline: "Because the pee is silent"
    }, {
        setup: "I'm not addicated to brake fluid",
        punchline: "I can stop whenever I want"
    }, {
        setup: "Why did the coffee file a police report?",
        punchline: "It got mugged"
    }, {
        setup: "Did you hear about the restaurant on the moon?",
        punchline: "Great food, no atmosphere"
    }, {
        setup: "I hate jokes about german sausages",
        punchline: "They're the wurst"
    }, {
        setup: "Why did the can-crusher quit his job?",
        punchline: "Because it was soda-pressing"
    }, {
        setup: "I wouldn't buy anything with velcro",
        punchline: "It's a total rip-off"
    }, {
        setup: "Dad, can you put the cat out?",
        punchline: "I didn't know it was on fire"
    }, {
        setup: "This graveyard looks overcrowded,",
        punchline: "people must be dying to get in there"
    }, {
        setup: "Dad, can you put my shoes on?",
        punchline: "I don't think they'll fit me"
    }, {
        setup: "Dad, did you get a haircut?",
        punchline: "No I got them all cut"
    }, {
        setup: "Have you heard of the band 1023MB?",
        punchline: "They haven't got a gig yet"
    }, {
        setup: "What do cows love to watch?",
        punchline: "Moosicals"
    }, {
        setup: "Of all the inventions of the last 100 years,",
        punchline: "the dry erase board has to be the most remarkable."
    }, {
        setup: "Why don't eggs tell jokes?",
        punchline: "They'd crack each other up."
    }, {
        setup: "I don't trust stairs.",
        punchline: "They're always up to something."
    }, {
        setup: "Did you hear the rumor about butter?",
        punchline: "Well, I'm not going to spread it!"
    }, {
        setup: "What time did the man go to the dentist?",
        punchline: "Tooth hurt-y."
    }, {
        setup: "How many tickles does it take to make an octopus laugh?",
        punchline: "Ten tickles."
    }, {
        setup: "I made a pencil with two erasers.",
        punchline: "It was pointless."
    }, {
        setup: "I've got a great joke about construction,",
        punchline: "but I'm still working on it."
    }, {
        setup: "I decided to sell my vacuum cleaner",
        punchline: "it was just gathering dust!"
    }, {
        setup: "What's brown and sticky?",
        punchline: "A stick."
    }, {
        setup: "What do you get from a pampered cow?",
        punchline: "Spoiled milk."
    }, {
        setup: "Did you hear about the circus fire?",
        punchline: "It was in tents."
    }, {
        setup: "What's the best way to watch a fly fishing tournament?",
        punchline: "Live stream."
    }, {
        setup: "I could tell a joke about pizza,",
        punchline: "but it's a little cheesy."
    }, {
        setup: "When does a joke become a dad joke?",
        punchline: "When it becomes apparent."
    }, {
        setup: "What’s an astronaut’s favorite part of a computer?",
        punchline: "The space bar."
    }, {
        setup: "What happens when you go to the bathroom in France?",
        punchline: "European."
    }, {
        setup: "What's the difference between a poorly dressed man on a tricycle and a well-dressed man on a bicycle?",
        punchline: "Attire!"
    }, {
        setup: "How does a penguin build its house?",
        punchline: "Igloos it together!"
    }, {
        setup: "Why did the old man fall in the well?",
        punchline: "Because he couldn't see that well!"
    }, {
        setup: "Why did the invisible man turn down the job offer?",
        punchline: "He couldn't see himself doing it!"
    }, {
        setup: "To whoever stole my copy of Microsoft Office, I will find you.",
        punchline: "You have my Word!"
    }, {
        setup: "I used to work in a shoe-recycling shop.",
        punchline: "It was sole destroying!"
    }, {
        setup: "Did I tell you the time I fell in love during a backflip?",
        punchline: "I was heels over head"
    }, {
        setup: "I would avoid the sushi if I was you.",
        punchline: "It's a little fishy"
    }, {
        setup: "Did you hear about the Italian chef who died?",
        punchline: "He pasta way!"
    }, {
        setup: "I know a lot of jokes about retired people,",
        punchline: "but none of them work"
    }, {
        setup: "What did the ocean say to the sailboat?",
        punchline: "Nothing, it just waved."
    }, {
        setup: "How do celebrities stay cool?",
        punchline: "They have many fans."
    }, {
        setup: "What’s Forrest Gump’s Facebook password?",
        punchline: "1forest1."
    }, {
        setup: "Why did the coach go to the bank?",
        punchline: "To get his quarter back."
    }, {
        setup: "Why does Snoop Dogg always carry an umbrella?",
        punchline: "Fo’ Drizzle."
    }, {
        setup: "What did the fisherman say to the magician?",
        punchline: "Pick a cod, any cod."
    }, {
        setup: "Which is faster, hot or cold?",
        punchline: "Hot, because you can catch a cold."
    }, {
        setup: "How do you organize a space party?",
        punchline: "You planet."
    }, {
        setup: "Why are skeletons so calm?",
        punchline: "Because nothing gets under their skin."
    }, {
        setup: "What did one ocean say to the other ocean?",
        punchline: "Nothing, they just waved."
    }, {
        setup: "Why are elevator jokes so good?",
        punchline: "They work on so many levels."
    }, {
        setup: "Why can’t a leopard hide?",
        punchline: "Because he’s always spotted."
    }, {
        setup: "What do you call an illegally parked frog?",
        punchline: "Toad."
    }, {
        setup: "Why are spiders so smart?",
        punchline: "They can find everything on the web."
    }, {
        setup: "How can you tell it’s a dogwood tree?",
        punchline: "From the bark."
    }, {
        setup: "How do you make holy water?",
        punchline: "You boil the hell out of it."
    }, {
        setup: "If a child refuses to sleep during nap time,",
        punchline: "are they guilty of resisting a rest?"
    }, {
        setup: "I ordered a chicken and an egg from Amazon.",
        punchline: "I’ll let you know"
    }, {
        setup: "What is the least spoken language in the world?",
        punchline: "Sign language"
    }, {
        setup: "Justice is a dish best served cold,",
        punchline: "if it were served warm it would be justwater."
    }, {
        setup: "''How do I look?''",
        punchline: "''With your eyes.''"
    }, {
        setup: "Did you hear the news? FedEx and UPS are merging.",
        punchline: "They’re going to go by the name Fed-Up from now on."
    }, {
        setup: "What has two butts and kills people?",
        punchline: "An assassin."
    }, {
        setup: "What did the pirate say on his 80th birthday?",
        punchline: "AYE MATEY"
    }, {
        setup: "What's the best part about living in Switzerland?",
        punchline: "I don't know, but the flag is a big plus."
    }, {
        setup: "What do you call a dog that can do magic?",
        punchline: "A Labracadabrador."
    }, {
        setup: "I used to have a job at a calendar factory,",
        punchline: "they fired me for taking a couple of days off."
    }, {
        setup: "Two peanuts were walking down the street.",
        punchline: "One was a salted."
    }, {
        setup: "What do you call a cow with two legs?",
        punchline: "Lean beef. If the cow has no legs, then it’s ground beef."
    }, {
        setup: "What is Beethoven’s favorite fruit?",
        punchline: "A ba-na-na-na."
    }, {
        setup: "You know what the loudest pet you can get is?",
        punchline: "A trumpet."
    }, {
        setup: "I’m only familiar with 25 letters in the English language.",
        punchline: "I don’t know why."
    }, {
        setup: "Did you hear about the guy who invented Lifesavers?",
        punchline: "They say he made a mint."
    }, {
        setup: "I got gas today for $1.39!",
        punchline: "Unfortunately, it was from Taco Bell."
    }, {
        setup: "Is ''buttcheeks'' one word?",
        punchline: "Or should I spread them apart?"
    }, {
        setup: "''I have a split personality,  said Tom,''",
        punchline: "being frank."
    }, {
        setup: "Did you know vampires aren't real?",
        punchline: "Unless you Count Dracula."
    }, {
        setup: "What do you call a bee who can’t make up his mind?",
        punchline: "A maybe."
    }, {
        setup: "Someone broke into my house last night and stole my limbo trophy,",
        punchline: "How low can you go?"
    }, {
        setup: "Why was it called the dark ages?",
        punchline: "Because of all the knights."
    }, {
        setup: "All my friends claim that I’m the cheapest person that they have ever met.",
        punchline: "I’m not buying it."
    }, {
        setup: "What are terminators called when they retire?",
        punchline: "Exterminators"
    }, {
        setup: "I tripped over my girlfriends bra",
        punchline: "seemed to be a booby trap."
    }, {
        setup: "I'm making a new documentary on how to fly a plane",
        punchline: "We're currently filming the pilot."
    }, {
        setup: "Never tell a secret in a cornfield",
        punchline: "There are too many ears"
    }, {
        setup: "Did you hear the joke about the farm?",
        punchline: "It was too corny."
    }, {
        setup: "Why doesn’t Mike Tyson use a PlayStation?",
        punchline: "Because he’s an X-Boxer"
    }, {
        setup: "How do you fix a damaged jack-o-lantern?",
        punchline: "You use a pumpkin patch."
    }, {
        setup: "Why did Dracula lie in the wrong coffin?",
        punchline: "He made a grave mistake."
    }, {
        setup: "I have a scary joke about math,",
        punchline: "but I'm 2² to say it."
    }, {
        setup: "What’s the difference between roast beef and pea soup?",
        punchline: "Anyone can learn to roast beef."
    }, {
        setup: "I can cut wood just by staring at it",
        punchline: "It's true, I saw it with my own eyes"
    }, {
        setup: "Every night I tell my wife I’m going out for a jog, but I don’t go, and she knows it",
        punchline: "It’s a running joke."
    }, {
        setup: "I am convinced that someone is secretly adding glue to my weapons collection.",
        punchline: "Everyone keeps denying it, but I’m sticking to my guns."
    }, {
        setup: "Why is 69 afraid of 70?",
        punchline: "Because they once had a fight and 71."
    }, {
        setup: "Who are the happiest people?",
        punchline: "Nomads"
    }, {
        setup: "I dated a girl with a lazy eye once.",
        punchline: "Turns out she was seeing someone on the side."
    }, {
        setup: "For my birthday, I got an alarm clock that swears at you instead of beeping.",
        punchline: "That was quite a rude awakening."
    }, {
        setup: "What did one plate say to the other plate?",
        punchline: "Dinner is on me!"
    }, {
        setup: "Can a Ninja throw Stars?",
        punchline: "Shur-he-kan"
    }, {
        setup: "Why was Santa's little helper feeling depressed?",
        punchline: "Because he has low elf esteem."
    }, {
        setup: "What has 4 wheels and flies?",
        punchline: "A garbage truck."
    }, {
        setup: "Nine ants were kicked out of the apartment complex",
        punchline: "Because they were not tenants."
    }, {
        setup: "What do you call a constipated detective",
        punchline: "No shit Sherlock"
    }, {
        setup: "You got to hand it to short people",
        punchline: "They probably can't reach it anyways."
    }]
}, "Static");
Class(function Config() {
    var a = this;
    a.FONTS = ["Bubblegum Sans", "Lobster", "Fredoka One", "Chewy", "Lemon", "Kavoon"]
}, "Static");
window.Config = window.Config || {};
window.Config.ASSETS = ["assets/images/share.jpg"];
Class(function Container() {
    Inherit(this, Controller);
    var g = this;
    var e;
    var a;
    (function() {
            f();
            d();
            c()
        }
    )();
    function f() {
        e = g.container;
        e.size("100%");
        Stage.addChild(e)
    }
    function d() {
        a = g.initClass(Jokes)
    }
    function c() {
        g.events.subscribe(HydraEvents.RESIZE, b)
    }
    function b() {}
}, "Singleton");
Class(function Jokes() {
    Inherit(this, Controller);
    var e = this;
    var b;
    var d;
    (function() {
            c();
            a()
        }
    )();
    function c() {
        b = e.container;
        b.size("100%")
    }
    function a() {
        d = e.initClass(JokesView)
    }
});
Class(function JokesJoke(b) {
    Inherit(this, View);
    var j = this;
    var m, c, e;
    var o = Config.FONTS[Utils.doRandom(0, Config.FONTS.length - 1)];
    var i = "hsl(" + Utils.doRandom(0, 255) + ", 25%, 60%)";
    var a = Stage.width > Stage.height ? Stage.width : Stage.height;
    var n = Math.round((50 - b.setup.length / 3) + a / 60);
    if (Mobile.phone) {
        n = 26
    }
    var f = n / 10 + "px " + n / 10 + "px rgba(0,0,0,0.1)";
    var p = a / 100;
    if (p < 8) {
        p = 8
    }
    (function() {
            g();
            d();
            l();
            j.delayedCall(k, 200)
        }
    )();
    function g() {
        m = j.element;
        m.size("100%").bg("#fff");
        m.back = m.create(".background");
        m.back.size(window.innerWidth - p * 2, window.innerHeight - p * 2).css({
            top: p,
            left: p
        }).bg(i);
        m.wrapper = m.create(".wrapper");
        m.wrapper.css({
            width: Mobile.phone ? "70%" : "60%",
            top: "45%",
            left: Mobile.phone ? "15%" : "20%"
        })
    }
    function d() {
        c = m.wrapper.create(".text");
        c.fontStyle(o, n, "#fff");
        c.css({
            width: "100%",
            textAlign: "center",
            letterSpacing: "1px",
            display: "block",
            position: "relative",
            textShadow: f,
            marginBottom: n * 0.3,
            lineHeight: n * 1.1
        }).transform({
            y: 30
        });
        c.text(b.setup)
    }
    function l() {
        e = m.wrapper.create(".text");
        e.fontStyle(o, n, "#fff");
        e.css({
            width: "100%",
            textAlign: "center",
            letterSpacing: "1px",
            display: "block",
            position: "relative",
            opacity: 0,
            textShadow: f,
            lineHeight: n * 1.1
        });
        e.text(b.punchline)
    }
    function k() {
        var q = m.wrapper.div.offsetHeight;
        m.wrapper.css({
            marginTop: -q / 2
        })
    }
    function h() {
        c.tween({
            y: 0
        }, 800, "easeOutBack");
        e.transform({
            y: 40
        }).tween({
            opacity: 1,
            y: 0
        }, 800, "easeOutBack");
        j.delayedCall(function() {
            j.events.fire(HydraEvents.COMPLETE)
        }, 1000)
    }
    this.animateIn = function() {
        var q = b.setup.length * 30 + 1400;
        j.delayedCall(h, q)
    }
    ;
    this.animateOut = function(r) {
        var q = Utils.headsTails(0, 1);
        if (q) {
            m.transformPoint("0%", 0)
        } else {
            m.transformPoint("100%", 0)
        }
        m.tween({
            rotation: Utils.headsTails(-15, 15),
            y: Stage.height * 1.3
        }, 800, "easeInCubic", r)
    }
});
Class(function JokesView() {
    Inherit(this, View);
    var f = this;
    var h, e, n, j;
    var g, k, a;
    (function() {
            d();
            m();
            b()
        }
    )();
    function d() {
        h = f.element;
        h.size("100%");
        h.interact(null, i);
        f.canClick = false;
        h.hit.css({
            cursor: "auto"
        })
    }
    function m() {
        n = h.create(".cover");
        n.size("100%").bg("#fff").setZ(10);
        j = n.create(".punchline");
        j.fontStyle(Config.FONTS[1], Mobile.phone ? 60 : 80, "#749dc7");
        j.css({
            width: "100%",
            top: "50%",
            marginTop: -100,
            textAlign: "center",
            letterSpacing: "1px",
            display: "block",
            position: "relative",
            opacity: 0
        });
        j.text("Nice one dad".toUpperCase());
        j.transform({
            y: 20
        }).tween({
            y: 0,
            opacity: 1
        }, 500, "easeOutCubic", 300, function() {
            c({
                init: true
            });
            n.tween({
                rotation: Utils.headsTails(-15, 15),
                y: Stage.height * 1.2
            }, 700, "easeInCubic", 600, function() {
                n.remove()
            })
        })
    }
    function b() {
        e = __body.create(".by");
        e.fontStyle("Courier", 16, "#fff");
        e.css({
            width: "100%",
            textAlign: "center",
            bottom: "5%",
            opacity: 0
        }).setZ(100).mouseEnabled(true);
        e.html((Device.mobile ? "Tap" : "Click") + " to Continue")
    }
    function l() {
        if (!a || a.length == 0) {
            a = Text.JOKES.slice(0)
        }
        var o = Utils.doRandom(0, a.length - 1);
        var p = a[o];
        a.splice(o, 1);
        return p
    }
    function c(o) {
        var p = l();
        k = g;
        g = f.initClass(JokesJoke, p);
        g.events.add(HydraEvents.COMPLETE, c);
        if (k) {
            k.element.setZ(2)
        }
        if (g) {
            g.element.setZ(1)
        }
        if (!o.init) {
            f.canClick = true;
            h.hit.css({
                cursor: "pointer"
            });
            e.tween({
                opacity: 1
            }, 400, "easeOutSine")
        } else {
            g.animateIn()
        }
    }
    function i() {
        if (!f.canClick) {
            return
        }
        f.canClick = false;
        h.hit.css({
            cursor: "auto"
        });
        g.animateIn();
        e.tween({
            opacity: 0
        }, 400, "easeOutSine");
        if (k) {
            k.animateOut(function() {
                if (k) {
                    k = k.destroy()
                }
            })
        }
    }
    this.animateIn = function() {}
});
Class(function Main() {
    (function() {
            a();
            var b = Container.instance()
        }
    )();
    function a() {
        var e = "Rammetto+One|Luckiest+Guy|Lemon|Sansita+One|Titan+One|Chango";
        var d = e.split("|");
        Config.FONTS = [];
        for (var c = 0; c < d.length; c++) {
            var b = d[c].replace("+", " ");
            Config.FONTS.push(b)
        }
    }
});
