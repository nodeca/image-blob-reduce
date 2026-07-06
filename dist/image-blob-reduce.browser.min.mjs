/*!

image-blob-reduce
https://github.com/nodeca/image-blob-reduce

*/
//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function r(e) {
	let t = e.replace(/[\r\n=]/g, ""), r = t.length, i = new Uint8Array(r * 3 >> 2), a = 0, o = 0;
	for (let e = 0; e < r; e++) e % 4 == 0 && e && (i[o++] = a >> 16 & 255, i[o++] = a >> 8 & 255, i[o++] = a & 255), a = a << 6 | n.indexOf(t.charAt(e));
	let s = r % 4 * 6;
	return s === 0 ? (i[o++] = a >> 16 & 255, i[o++] = a >> 8 & 255, i[o++] = a & 255) : s === 18 ? (i[o++] = a >> 10 & 255, i[o++] = a >> 2 & 255) : s === 12 && (i[o++] = a >> 4 & 255), i;
}
var i;
function a() {
	if (i !== void 0 || (i = !1, typeof WebAssembly > "u")) return i;
	try {
		let e = new Uint8Array([
			0,
			97,
			115,
			109,
			1,
			0,
			0,
			0,
			1,
			6,
			1,
			96,
			1,
			127,
			1,
			127,
			3,
			2,
			1,
			0,
			5,
			3,
			1,
			0,
			1,
			7,
			8,
			1,
			4,
			116,
			101,
			115,
			116,
			0,
			0,
			10,
			16,
			1,
			14,
			0,
			32,
			0,
			65,
			1,
			54,
			2,
			0,
			32,
			0,
			40,
			2,
			0,
			11
		]), t = new WebAssembly.Module(e);
		return new WebAssembly.Instance(t, {}).exports.test(4) !== 0 && (i = !0), i;
	} catch (e) {}
	return i;
}
var o = {
	js: !0,
	wasm: !0
}, s = class {
	constructor(e) {
		let t = Object.assign({}, o, e || {});
		if (this.options = t, this.__cache = {}, this.__init_promise = null, this.__modules = t.modules || {}, this.__memory = null, this.__wasm = {}, this.__isLE = new Uint32Array(new Uint8Array([
			1,
			0,
			0,
			0
		]).buffer)[0] === 1, !this.options.js && !this.options.wasm) throw Error("mathlib: at least \"js\" or \"wasm\" should be enabled");
	}
	has_wasm() {
		return a();
	}
	use(e) {
		return this.__modules[e.name] = e, this.options.wasm && this.has_wasm() && e.wasm_fn ? this[e.name] = e.wasm_fn : this[e.name] = e.fn, this;
	}
	init() {
		return this.__init_promise ? this.__init_promise : !this.options.js && this.options.wasm && !this.has_wasm() ? Promise.reject(/* @__PURE__ */ Error("mathlib: only \"wasm\" was enabled, but it's not supported")) : (this.__init_promise = Promise.all(Object.keys(this.__modules).map((e) => {
			let t = this.__modules[e];
			return !this.options.wasm || !this.has_wasm() || !t.wasm_fn || this.__wasm[e] ? null : WebAssembly.compile(r(t.wasm_src)).then((t) => {
				this.__wasm[e] = t;
			});
		})).then(() => this), this.__init_promise);
	}
	__reallocate(e) {
		if (!this.__memory) return this.__memory = new WebAssembly.Memory({ initial: Math.ceil(e / (64 * 1024)) }), this.__memory;
		let t = this.__memory.buffer.byteLength;
		return t < e && this.__memory.grow(Math.ceil((e - t) / (64 * 1024))), this.__memory;
	}
	__instance(e, t, n) {
		if (t && this.__reallocate(t), !this.__wasm[e]) {
			let t = this.__modules[e];
			this.__wasm[e] = new WebAssembly.Module(r(t.wasm_src));
		}
		if (!this.__cache[e]) {
			let t = {
				memoryBase: 0,
				memory: this.__memory,
				tableBase: 0,
				table: new WebAssembly.Table({
					initial: 0,
					element: "anyfunc"
				})
			};
			this.__cache[e] = new WebAssembly.Instance(this.__wasm[e], { env: Object.assign(t, n || {}) });
		}
		return this.__cache[e];
	}
	__align(e, t) {
		t = t || 8;
		let n = e % t;
		return e + (n ? t - n : 0);
	}
};
function c(e) {
	e < .5 && (e = .5);
	let t = Math.exp(.726 * .726) / e, n = Math.exp(-t), r = Math.exp(-2 * t), i = (1 - n) * (1 - n) / (1 + 2 * t * n - r), a = i, o = i * (t - 1) * n, s = i * (t + 1) * n, c = -i * r, l = 2 * n, u = -r, d = (a + o) / (1 - l - u), f = (s + c) / (1 - l - u);
	return new Float32Array([
		a,
		o,
		s,
		c,
		l,
		u,
		d,
		f
	]);
}
function l(e, t, n, r, i, a) {
	let o, s, c, l, u, d, f, p, m, h, g, _, v, y;
	for (m = 0; m < a; m++) {
		for (d = m * i, f = m, p = 0, o = e[d], u = o * r[6], l = u, g = r[0], _ = r[1], v = r[4], y = r[5], h = 0; h < i; h++) s = e[d], c = s * g + o * _ + l * v + u * y, u = l, l = c, o = s, n[p] = l, p++, d++;
		for (d--, p--, f += a * (i - 1), o = e[d], u = o * r[7], l = u, s = o, g = r[2], _ = r[3], h = i - 1; h >= 0; h--) c = s * g + o * _ + l * v + u * y, u = l, l = c, o = s, s = e[d], t[f] = n[p] + l, d--, p--, f -= a;
	}
}
function u(e, t, n, r) {
	if (!r) return;
	let i = new Uint16Array(e.length), a = new Float32Array(Math.max(t, n)), o = c(r);
	l(e, i, a, o, t, n, r), l(i, e, a, o, n, t, r);
}
function d(e, t, n) {
	let r = t * n, i = new Uint16Array(r), a, o, s, c;
	for (let t = 0; t < r; t++) a = e[4 * t], o = e[4 * t + 1], s = e[4 * t + 2], c = a >= o && a >= s ? a : o >= s && o >= a ? o : s, i[t] = c << 8;
	return i;
}
function f(e, t, n, r, i, a) {
	let o, s, c, l, f;
	if (r === 0 || i < .5) return;
	i > 2 && (i = 2);
	let p = d(e, t, n), m = new Uint16Array(p);
	u(m, t, n, i);
	let h = r / 100 * 4096 + .5 | 0, g = a << 8, _ = t * n;
	for (let t = 0; t < _; t++) o = p[t], l = o - m[t], Math.abs(l) >= g && (s = o + (h * l + 2048 >> 12), s = s > 65280 ? 65280 : s, s = s < 0 ? 0 : s, o = o === 0 ? 1 : o, c = (s << 12) / o | 0, f = t * 4, e[f] = e[f] * c + 2048 >> 12, e[f + 1] = e[f + 1] * c + 2048 >> 12, e[f + 2] = e[f + 2] * c + 2048 >> 12);
}
function p(e, t, n, r, i, a) {
	if (r === 0 || i < .5) return;
	i > 2 && (i = 2);
	let o = t * n, s = o * 4, c = o * 2, l = o * 2, u = Math.max(t, n) * 4, d = s, f = d + c, p = f + l, m = p + l, h = m + u, g = this.__instance("unsharp_mask", s + c + l * 2 + u + 32, { exp: Math.exp }), _ = new Uint32Array(e.buffer);
	new Uint32Array(this.__memory.buffer).set(_);
	let v = g.exports.hsv_v16 || g.exports._hsv_v16;
	if (!v) throw Error("WASM hsv_v16 function is not available");
	if (v(0, d, t, n), v = g.exports.blurMono16 || g.exports._blurMono16, !v) throw Error("WASM blurMono16 function is not available");
	if (v(d, f, p, m, h, t, n, i), v = g.exports.unsharp || g.exports._unsharp, !v) throw Error("WASM unsharp function is not available");
	v(0, 0, d, f, t, n, r, a), _.set(new Uint32Array(this.__memory.buffer, 0, o));
}
var m = {
	name: "unsharp_mask",
	fn: f,
	wasm_fn: p,
	wasm_src: "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"
}, h = { filter: {
	box: {
		win: .5,
		fn(e) {
			return e < 0 && (e = -e), +(e < .5);
		}
	},
	hamming: {
		win: 1,
		fn(e) {
			if (e < 0 && (e = -e), e >= 1) return 0;
			if (e < 1.1920929e-7) return 1;
			let t = e * Math.PI;
			return Math.sin(t) / t * (.54 + .46 * Math.cos(t / 1));
		}
	},
	lanczos2: {
		win: 2,
		fn(e) {
			if (e < 0 && (e = -e), e >= 2) return 0;
			if (e < 1.1920929e-7) return 1;
			let t = e * Math.PI;
			return Math.sin(t) / t * Math.sin(t / 2) / (t / 2);
		}
	},
	lanczos3: {
		win: 3,
		fn(e) {
			if (e < 0 && (e = -e), e >= 3) return 0;
			if (e < 1.1920929e-7) return 1;
			let t = e * Math.PI;
			return Math.sin(t) / t * Math.sin(t / 3) / (t / 3);
		}
	},
	mks2013: {
		win: 2.5,
		fn(e) {
			return e < 0 && (e = -e), e >= 2.5 ? 0 : e >= 1.5 ? -.125 * (e - 2.5) * (e - 2.5) : e >= .5 ? .25 * (4 * e * e - 11 * e + 7) : 1.0625 - 1.75 * e * e;
		}
	}
} }, g = 14;
function _(e) {
	return Math.round(e * ((1 << g) - 1));
}
function v(e, t, n, r, i) {
	let a = h.filter[e].fn, o = 1 / r, s = Math.min(1, r), c = h.filter[e].win / s, l, u, d, f, p, m, g, v, y, b, x, S, C, w, T, E, D, ee = Math.floor((c + 1) * 2), O = new Int16Array((ee + 2) * n), k = 0, A = !O.subarray || !O.set;
	for (l = 0; l < n; l++) {
		for (u = (l + .5) * o + i, d = Math.max(0, Math.floor(u - c)), f = Math.min(t - 1, Math.ceil(u + c)), p = f - d + 1, m = new Float32Array(p), g = new Int16Array(p), v = 0, y = d, b = 0; y <= f; y++, b++) x = a((y + .5 - u) * s), v += x, m[b] = x;
		for (S = 0, b = 0; b < m.length; b++) C = m[b] / v, S += C, g[b] = _(C);
		for (g[n >> 1] += _(1 - S), w = 0; w < g.length && g[w] === 0;) w++;
		if (w < g.length) {
			for (T = g.length - 1; T > 0 && g[T] === 0;) T--;
			if (E = d + w, D = T - w + 1, O[k++] = E, O[k++] = D, !A) O.set(g.subarray(w, T + 1), k), k += D;
			else for (b = w; b <= T; b++) O[k++] = g[b];
		} else O[k++] = 0, O[k++] = 0;
	}
	return O;
}
function y(e) {
	return e < 0 ? 0 : e > 255 ? 255 : e;
}
function b(e) {
	return e >= 0 ? e : 0;
}
function x(e, t, n, r, i, a) {
	let o, s, c, l, u, d, f, p, m, h, g, _ = 0, v = 0;
	for (m = 0; m < r; m++) {
		for (u = 0, h = 0; h < i; h++) {
			for (d = a[u++], f = a[u++], p = _ + d * 4 | 0, o = s = c = l = 0; f > 0; f--) g = a[u++], l = l + g * e[p + 3] | 0, c = c + g * e[p + 2] | 0, s = s + g * e[p + 1] | 0, o = o + g * e[p] | 0, p = p + 4 | 0;
			t[v + 3] = b(l >> 7), t[v + 2] = b(c >> 7), t[v + 1] = b(s >> 7), t[v] = b(o >> 7), v = v + r * 4 | 0;
		}
		v = (m + 1) * 4 | 0, _ = (m + 1) * n * 4 | 0;
	}
}
function S(e, t, n, r, i, a) {
	let o, s, c, l, u, d, f, p, m, h, g, _ = 0, v = 0;
	for (m = 0; m < r; m++) {
		for (u = 0, h = 0; h < i; h++) {
			for (d = a[u++], f = a[u++], p = _ + d * 4 | 0, o = s = c = l = 0; f > 0; f--) g = a[u++], l = l + g * e[p + 3] | 0, c = c + g * e[p + 2] | 0, s = s + g * e[p + 1] | 0, o = o + g * e[p] | 0, p = p + 4 | 0;
			o >>= 7, s >>= 7, c >>= 7, l >>= 7, t[v + 3] = y(l + 8192 >> 14), t[v + 2] = y(c + 8192 >> 14), t[v + 1] = y(s + 8192 >> 14), t[v] = y(o + 8192 >> 14), v = v + r * 4 | 0;
		}
		v = (m + 1) * 4 | 0, _ = (m + 1) * n * 4 | 0;
	}
}
function C(e, t, n, r, i, a) {
	let o, s, c, l, u, d, f, p, m, h, g, _, v = 0, y = 0;
	for (h = 0; h < r; h++) {
		for (d = 0, g = 0; g < i; g++) {
			for (f = a[d++], p = a[d++], m = v + f * 4 | 0, o = s = c = l = 0; p > 0; p--) _ = a[d++], u = e[m + 3], l = l + _ * u | 0, c = c + _ * e[m + 2] * u | 0, s = s + _ * e[m + 1] * u | 0, o = o + _ * e[m] * u | 0, m = m + 4 | 0;
			c = c / 255 | 0, s = s / 255 | 0, o = o / 255 | 0, t[y + 3] = b(l >> 7), t[y + 2] = b(c >> 7), t[y + 1] = b(s >> 7), t[y] = b(o >> 7), y = y + r * 4 | 0;
		}
		y = (h + 1) * 4 | 0, v = (h + 1) * n * 4 | 0;
	}
}
function w(e, t, n, r, i, a) {
	let o, s, c, l, u, d, f, p, m, h, g, _ = 0, v = 0;
	for (m = 0; m < r; m++) {
		for (u = 0, h = 0; h < i; h++) {
			for (d = a[u++], f = a[u++], p = _ + d * 4 | 0, o = s = c = l = 0; f > 0; f--) g = a[u++], l = l + g * e[p + 3] | 0, c = c + g * e[p + 2] | 0, s = s + g * e[p + 1] | 0, o = o + g * e[p] | 0, p = p + 4 | 0;
			o >>= 7, s >>= 7, c >>= 7, l >>= 7, l = y(l + 8192 >> 14), l > 0 && (o = o * 255 / l | 0, s = s * 255 / l | 0, c = c * 255 / l | 0), t[v + 3] = l, t[v + 2] = y(c + 8192 >> 14), t[v + 1] = y(s + 8192 >> 14), t[v] = y(o + 8192 >> 14), v = v + r * 4 | 0;
		}
		v = (m + 1) * 4 | 0, _ = (m + 1) * n * 4 | 0;
	}
}
function T(e, t, n) {
	let r = 3, i = t * n * 4 | 0;
	for (; r < i;) {
		if (e[r] !== 255) return !0;
		r = r + 4 | 0;
	}
	return !1;
}
function E(e, t, n) {
	let r = 3, i = t * n * 4 | 0;
	for (; r < i;) e[r] = 255, r = r + 4 | 0;
}
function D(e) {
	let t = e.src, n = e.width, r = e.height, i = e.toWidth, a = e.toHeight, o = e.scaleX || e.toWidth / e.width, s = e.scaleY || e.toHeight / e.height, c = e.offsetX || 0, l = e.offsetY || 0, u = e.dest || new Uint8Array(i * a * 4), d = e.filter === void 0 ? "mks2013" : e.filter, f = v(d, n, i, o, c), p = v(d, r, a, s, l), m = new Uint16Array(i * r * 4);
	return T(t, n, r) ? (C(t, m, n, r, i, f), w(m, u, r, i, a, p)) : (x(t, m, n, r, i, f), S(m, u, r, i, a, p), E(u, i, a)), u;
}
function ee(e, t, n) {
	let r = 3, i = t * n * 4 | 0;
	for (; r < i;) {
		if (e[r] !== 255) return !0;
		r = r + 4 | 0;
	}
	return !1;
}
function O(e, t, n) {
	let r = 3, i = t * n * 4 | 0;
	for (; r < i;) e[r] = 255, r = r + 4 | 0;
}
function k(e) {
	return new Uint8Array(e.buffer, 0, e.byteLength);
}
var A = !0;
try {
	A = new Uint32Array(new Uint8Array([
		1,
		0,
		0,
		0
	]).buffer)[0] === 1;
} catch (e) {}
function te(e, t, n) {
	if (A) {
		t.set(k(e), n);
		return;
	}
	for (let r = n, i = 0; i < e.length; i++) {
		let n = e[i];
		t[r++] = n & 255, t[r++] = n >> 8 & 255;
	}
}
function ne(e) {
	let t = e.src, n = e.width, r = e.height, i = e.toWidth, a = e.toHeight, o = e.scaleX || e.toWidth / e.width, s = e.scaleY || e.toHeight / e.height, c = e.offsetX || 0, l = e.offsetY || 0, u = e.dest || new Uint8Array(i * a * 4), d = e.filter === void 0 ? "mks2013" : e.filter, f = v(d, n, i, o, c), p = v(d, r, a, s, l), m = Math.max(t.byteLength, u.byteLength), h = this.__align(0 + m), g = r * i * 4 * 2, _ = this.__align(h + g), y = this.__align(_ + f.byteLength), b = y + p.byteLength, x = this.__instance("resize", b), S = new Uint8Array(this.__memory.buffer), C = new Uint32Array(this.__memory.buffer), w = new Uint32Array(t.buffer);
	C.set(w), te(f, S, _), te(p, S, y);
	let T = x.exports.convolveHV || x.exports._convolveHV;
	if (!T) throw Error("WASM resize function is not available");
	return ee(t, n, r) ? T(_, y, h, n, r, i, a, 1) : (T(_, y, h, n, r, i, a, 0), O(u, i, a)), new Uint32Array(u.buffer).set(new Uint32Array(this.__memory.buffer, 0, a * i)), u;
}
var re = {
	name: "resize",
	fn: D,
	wasm_fn: ne,
	wasm_src: "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"
}, ie = class extends s {
	constructor(e) {
		let t = e || [], n = {
			js: t.indexOf("js") >= 0,
			wasm: t.indexOf("wasm") >= 0
		};
		super(n), this.features = {
			js: n.js,
			wasm: n.wasm && this.has_wasm()
		}, this.use(m), this.use(re);
	}
	resizeAndUnsharp(e) {
		let t = this.resize(e);
		return e.unsharpAmount && this.unsharp_mask(t, e.toWidth, e.toHeight, e.unsharpAmount, e.unsharpRadius, e.unsharpThreshold), t;
	}
};
function j(e) {
	"@babel/helpers - typeof";
	return j = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, j(e);
}
function ae(e, t) {
	if (j(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (j(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function oe(e) {
	var t = ae(e, "string");
	return j(t) == "symbol" ? t : t + "";
}
function M(e, t, n) {
	return (t = oe(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function se(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function N(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? se(Object(n), !0).forEach(function(t) {
			M(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : se(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
var ce = 100, le = class {
	constructor(e, t) {
		M(this, "create", void 0), M(this, "available", void 0), M(this, "acquired", void 0), M(this, "lastId", void 0), M(this, "timeoutId", void 0), M(this, "idle", void 0), this.create = e, this.available = [], this.acquired = {}, this.lastId = 1, this.timeoutId = 0, this.idle = t || 2e3;
	}
	acquire() {
		let e;
		return e = this.available.length === 0 ? N(N({}, this.create()), {}, {
			id: this.lastId++,
			lastUsed: 0
		}) : this.available.pop(), this.acquired[e.id] = e, {
			value: e.value,
			release: () => this.release(e)
		};
	}
	release(e) {
		delete this.acquired[e.id], e.lastUsed = Date.now(), this.available.push(e), this.timeoutId === 0 && (this.timeoutId = setTimeout(() => this.gc(), ce));
	}
	gc() {
		let e = Date.now();
		this.available = this.available.filter((t) => e - t.lastUsed > this.idle ? (t.destroy(), !1) : !0), this.available.length === 0 ? this.timeoutId = 0 : this.timeoutId = setTimeout(() => this.gc(), ce);
	}
};
function P(e) {
	var t, n;
	return (t = e == null || (n = e.constructor) == null ? void 0 : n.name) == null ? "" : t;
}
function ue(e) {
	let t = P(e);
	return t === "HTMLCanvasElement" || t === "OffscreenCanvas" || t === "Canvas" || t === "CanvasElement";
}
function F(e) {
	return P(e) === "HTMLImageElement";
}
function de(e) {
	return P(e) === "ImageBitmap";
}
function fe(e) {
	let t = 0, n = [];
	function r() {
		if (t < e && n.length) {
			var r;
			t++, (r = n.shift()) == null || r();
		}
	}
	return function(e) {
		return new Promise((i, a) => {
			n.push(() => {
				e().then((e) => {
					i(e), t--, r();
				}, (e) => {
					a(e), t--, r();
				});
			}), r();
		});
	};
}
function pe(e) {
	switch (e) {
		case 0: return "pixelated";
		case 1: return "low";
		case 2: return "medium";
	}
	return "high";
}
var I = [
	"box",
	"hamming",
	"lanczos2",
	"lanczos3"
];
function me(e) {
	return I[e];
}
function he(e) {
	return I.indexOf(e) >= 0;
}
function ge(e) {
	let t = I.indexOf(e);
	return t >= 0 ? t : void 0;
}
var _e = 2, ve = 3;
function ye(e, t, n, r, i) {
	let a = n / e, o = r / t, s = (2 * ve + _e + 1) / i;
	if (s > .5) return [[n, r]];
	let c = Math.ceil(Math.log(Math.min(a, o)) / Math.log(s));
	if (c <= 1) return [[n, r]];
	let l = [];
	for (let i = 0; i < c; i++) {
		let a = Math.round((e ** (c - i - 1) * n ** +(i + 1)) ** (1 / c)), o = Math.round((t ** (c - i - 1) * r ** +(i + 1)) ** (1 / c));
		l.push([a, o]);
	}
	return l;
}
var be = 1e-5;
function L(e) {
	let t = Math.round(e);
	return Math.abs(e - t) < be ? t : Math.floor(e);
}
function xe(e) {
	let t = Math.round(e);
	return Math.abs(e - t) < be ? t : Math.ceil(e);
}
function Se(e) {
	let t = e.toWidth / e.width, n = e.toHeight / e.height, r = L(e.srcTileSize * t) - 2 * e.destTileBorder, i = L(e.srcTileSize * n) - 2 * e.destTileBorder;
	if (r < 1 || i < 1) throw Error("Internal error in pica: target tile width/height is too small.");
	let a, o, s, c, l, u, d = [], f;
	for (c = 0; c < e.toHeight; c += i) for (s = 0; s < e.toWidth; s += r) a = s - e.destTileBorder, a < 0 && (a = 0), l = s + r + e.destTileBorder - a, a + l >= e.toWidth && (l = e.toWidth - a), o = c - e.destTileBorder, o < 0 && (o = 0), u = c + i + e.destTileBorder - o, o + u >= e.toHeight && (u = e.toHeight - o), f = {
		toX: a,
		toY: o,
		toWidth: l,
		toHeight: u,
		toInnerX: s,
		toInnerY: c,
		toInnerWidth: r,
		toInnerHeight: i,
		offsetX: a / t - L(a / t),
		offsetY: o / n - L(o / n),
		scaleX: t,
		scaleY: n,
		x: L(a / t),
		y: L(o / n),
		width: xe(l / t),
		height: xe(u / n)
	}, d.push(f);
	return d;
}
var R = "/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/4AAQskZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAACAAMBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABsQAAMBAQADAAAAAAAAAAAAAAECAwQFABEx/9oACAEBAAA/AC06fW6va0ps7PT179E88MiV02arrCEkjGQZiSEnKc5ovxURVHoADz//2Q==", z = {
	canvas: !1,
	offscreen_canvas: !1,
	may_be_worker: !1,
	create_image_bitmap: !1,
	safari_put_image_data_fix: !1,
	bug_canvas_orientation_region: !0,
	bug_image_bitmap_orientation_region: !0,
	cib_resize: !1
}, Ce = !1, B = null;
function V() {
	if (typeof document > "u" || !document.createElement) return !1;
	try {
		let e = document.createElement("canvas");
		e.width = 2, e.height = 1;
		let t = e.getContext("2d"), n = t.createImageData(2, 1);
		return n.data[0] = 12, n.data[1] = 23, n.data[2] = 34, n.data[3] = 255, n.data[4] = 45, n.data[5] = 56, n.data[6] = 67, n.data[7] = 255, t.putImageData(n, 0, 0), n = t.getImageData(0, 0, 2, 1), n.data[0] === 12 && n.data[1] === 23 && n.data[2] === 34 && n.data[3] === 255 && n.data[4] === 45 && n.data[5] === 56 && n.data[6] === 67 && n.data[7] === 255;
	} catch (e) {
		return !1;
	}
}
function H() {
	if (typeof OffscreenCanvas > "u") return !1;
	try {
		let e = new OffscreenCanvas(2, 1).getContext("2d"), t = e.createImageData(2, 1);
		return t.data[0] = 12, t.data[1] = 23, t.data[2] = 34, t.data[3] = 255, t.data[4] = 45, t.data[5] = 56, t.data[6] = 67, t.data[7] = 255, e.putImageData(t, 0, 0), t = e.getImageData(0, 0, 2, 1), t.data[0] === 12 && t.data[1] === 23 && t.data[2] === 34 && t.data[3] === 255 && t.data[4] === 45 && t.data[5] === 56 && t.data[6] === 67 && t.data[7] === 255;
	} catch (e) {
		return !1;
	}
}
function U() {
	return typeof createImageBitmap < "u";
}
function we() {
	return typeof Worker < "u" && typeof URL < "u" && !!URL.createObjectURL;
}
function Te() {
	try {
		return !!(typeof navigator < "u" && navigator.userAgent && navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") < 0);
	} catch (e) {
		return !1;
	}
}
function Ee() {
	return Promise.resolve().then(() => {
		if (H() && U() && typeof Blob < "u" && typeof atob < "u") {
			let e = atob(R), t = new Uint8Array(e.length);
			for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
			return createImageBitmap(new Blob([t], { type: "image/jpeg" })).then((e) => {
				let t = new OffscreenCanvas(1, 1);
				try {
					let n = t.getContext("2d");
					return n.drawImage(e, 1, 1, 1, 1, 0, 0, 1, 1), n.getImageData(0, 0, 1, 1).data[0] < 240;
				} finally {
					e.close();
				}
			});
		}
		return V() && typeof Image < "u" ? new Promise((e) => {
			let t = new Image();
			t.onload = () => {
				try {
					let n = document.createElement("canvas");
					n.width = 1, n.height = 1;
					let r = n.getContext("2d");
					r.drawImage(t, 1, 1, 1, 1, 0, 0, 1, 1), e(r.getImageData(0, 0, 1, 1).data[0] < 240);
				} catch (t) {
					e(!0);
				}
			}, t.onerror = () => e(!0), t.src = `data:image/jpeg;base64,${R}`;
		}) : !0;
	}).catch(() => !0);
}
function De() {
	return Promise.resolve().then(() => {
		if (!z.create_image_bitmap && !U() || typeof Blob > "u" || typeof atob > "u") return !0;
		let e = H(), t = V();
		if (!e && !t) return !0;
		let n = atob(R), r = new Uint8Array(n.length);
		for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
		return createImageBitmap(new Blob([r], { type: "image/jpeg" })).then((t) => createImageBitmap(t, 1, 1, 1, 1).then((n) => {
			let r;
			e ? r = new OffscreenCanvas(1, 1) : (r = document.createElement("canvas"), r.width = 1, r.height = 1);
			try {
				let e = r.getContext("2d");
				return e.drawImage(n, 0, 0), n.width !== 1 || n.height !== 1 || e.getImageData(0, 0, 1, 1).data[0] < 240;
			} finally {
				t.close(), n.close();
			}
		}, () => (t.close(), !0)));
	}).catch(() => !0);
}
function Oe() {
	return Promise.resolve().then(() => {
		if (!U()) return !1;
		let e;
		if (z.canvas || V()) e = document.createElement("canvas"), e.width = 20, e.height = 20;
		else if (z.offscreen_canvas || H()) e = new OffscreenCanvas(20, 20), e.getContext("2d").clearRect(0, 0, 20, 20);
		else return !1;
		return createImageBitmap(e, 0, 0, 20, 20, {
			resizeWidth: 5,
			resizeHeight: 5,
			resizeQuality: "high"
		}).then((t) => {
			let n = t.width === 5 && !!t.close;
			return t.close && t.close(), e = null, n;
		});
	}).catch(() => !1);
}
function ke() {
	if (Ce) return Promise.resolve(Object.assign({}, z));
	if (B) return B.then(() => Object.assign({}, z));
	z.canvas = V(), z.offscreen_canvas = H(), z.may_be_worker = we(), z.create_image_bitmap = U(), z.safari_put_image_data_fix = Te();
	let e = Ee().then((e) => {
		z.bug_canvas_orientation_region = e;
	}).catch(() => {}), t = De().then((e) => {
		z.bug_image_bitmap_orientation_region = e;
	}).catch(() => {}), n = Oe().then((e) => {
		z.cib_resize = e;
	}).catch(() => {});
	return B = Promise.all([
		e,
		t,
		n
	]).then(() => (Ce = !0, B = null, Object.assign({}, z)), (e) => {
		throw B = null, e;
	}), B;
}
function Ae(e, t, n, r, i, a, o) {
	try {
		var s = e[a](o), c = s.value;
	} catch (e) {
		n(e);
		return;
	}
	s.done ? t(c) : Promise.resolve(c).then(r, i);
}
function W(e) {
	return function() {
		var t = this, n = arguments;
		return new Promise(function(r, i) {
			var a = e.apply(t, n);
			function o(e) {
				Ae(a, r, i, o, s, "next", e);
			}
			function s(e) {
				Ae(a, r, i, o, s, "throw", e);
			}
			o(void 0);
		});
	};
}
var je = "/*!\n\npica\nhttps://github.com/nodeca/pica\n\n*/\n!function(){var A;function t(A){const t=A.replace(/[\\r\\n=]/g,\"\"),e=t.length,n=new Uint8Array(3*e>>2);let a=0,i=0;for(let s=0;s<e;s++)s%4==0&&s&&(n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=255&a),a=a<<6|\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\".indexOf(t.charAt(s));const r=e%4*6;return 0===r?(n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=255&a):18===r?(n[i++]=a>>10&255,n[i++]=a>>2&255):12===r&&(n[i++]=a>>4&255),n}var e={js:!0,wasm:!0},n=class{constructor(A){const t=Object.assign({},e,A||{});if(this.options=t,this.__cache={},this.__init_promise=null,this.__modules=t.modules||{},this.__memory=null,this.__wasm={},this.__isLE=1===new Uint32Array(new Uint8Array([1,0,0,0]).buffer)[0],!this.options.js&&!this.options.wasm)throw new Error('mathlib: at least \"js\" or \"wasm\" should be enabled')}has_wasm(){return function(){if(void 0!==A)return A;if(A=!1,\"undefined\"==typeof WebAssembly)return A;try{const t=new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]),e=new WebAssembly.Module(t);return 0!==new WebAssembly.Instance(e,{}).exports.test(4)&&(A=!0),A}catch(t){}return A}()}use(A){return this.__modules[A.name]=A,this.options.wasm&&this.has_wasm()&&A.wasm_fn?this[A.name]=A.wasm_fn:this[A.name]=A.fn,this}init(){return this.__init_promise?this.__init_promise:this.options.js||!this.options.wasm||this.has_wasm()?(this.__init_promise=Promise.all(Object.keys(this.__modules).map(A=>{const e=this.__modules[A];return this.options.wasm&&this.has_wasm()&&e.wasm_fn?this.__wasm[A]?null:WebAssembly.compile(t(e.wasm_src)).then(t=>{this.__wasm[A]=t}):null})).then(()=>this),this.__init_promise):Promise.reject(new Error('mathlib: only \"wasm\" was enabled, but it\\'s not supported'))}__reallocate(A){if(!this.__memory)return this.__memory=new WebAssembly.Memory({initial:Math.ceil(A/65536)}),this.__memory;const t=this.__memory.buffer.byteLength;return t<A&&this.__memory.grow(Math.ceil((A-t)/65536)),this.__memory}__instance(A,e,n){if(e&&this.__reallocate(e),!this.__wasm[A]){const e=this.__modules[A];this.__wasm[A]=new WebAssembly.Module(t(e.wasm_src))}if(!this.__cache[A]){const t={memoryBase:0,memory:this.__memory,tableBase:0,table:new WebAssembly.Table({initial:0,element:\"anyfunc\"})};this.__cache[A]=new WebAssembly.Instance(this.__wasm[A],{env:Object.assign(t,n||{})})}return this.__cache[A]}__align(A,t){const e=A%(t=t||8);return A+(e?t-e:0)}};function a(A,t,e,n,a,i){let r,s,o,g,I,h,B,Q,E,C,c,f,u,m;for(E=0;E<i;E++){for(h=E*a,B=E,Q=0,r=A[h],I=r*n[6],g=I,c=n[0],f=n[1],u=n[4],m=n[5],C=0;C<a;C++)s=A[h],o=s*c+r*f+g*u+I*m,I=g,g=o,r=s,e[Q]=g,Q++,h++;for(h--,Q--,B+=i*(a-1),r=A[h],I=r*n[7],g=I,s=r,c=n[2],f=n[3],C=a-1;C>=0;C--)o=s*c+r*f+g*u+I*m,I=g,g=o,r=s,s=A[h],t[B]=e[Q]+g,h--,Q--,B-=i}}function i(A,t,e,n){if(!n)return;const i=new Uint16Array(A.length),r=new Float32Array(Math.max(t,e)),s=function(A){A<.5&&(A=.5);const t=Math.exp(.527076)/A,e=Math.exp(-t),n=Math.exp(-2*t),a=(1-e)*(1-e)/(1+2*t*e-n),i=a*(t-1)*e,r=a*(t+1)*e,s=-a*n,o=2*e,g=-n;return new Float32Array([a,i,r,s,o,g,(a+i)/(1-o-g),(r+s)/(1-o-g)])}(n);a(A,i,r,s,t,e),a(i,A,r,s,e,t)}var r={name:\"unsharp_mask\",fn:function(A,t,e,n,a,r){let s,o,g,I,h;if(0===n||a<.5)return;a>2&&(a=2);const B=function(A,t,e){const n=t*e,a=new Uint16Array(n);let i,r,s,o;for(let g=0;g<n;g++)i=A[4*g],r=A[4*g+1],s=A[4*g+2],o=i>=r&&i>=s?i:r>=s&&r>=i?r:s,a[g]=o<<8;return a}(A,t,e),Q=new Uint16Array(B);i(Q,t,e,a);const E=n/100*4096+.5|0,C=r<<8,c=t*e;for(let i=0;i<c;i++)s=B[i],I=s-Q[i],Math.abs(I)>=C&&(o=s+(E*I+2048>>12),o=o>65280?65280:o,o=o<0?0:o,s=0!==s?s:1,g=(o<<12)/s|0,h=4*i,A[h]=A[h]*g+2048>>12,A[h+1]=A[h+1]*g+2048>>12,A[h+2]=A[h+2]*g+2048>>12)},wasm_fn:function(A,t,e,n,a,i){if(0===n||a<.5)return;a>2&&(a=2);const r=t*e,s=4*r,o=2*r,g=2*r,I=4*Math.max(t,e),h=s,B=h+o,Q=B+g,E=Q+g,C=E+I,c=this.__instance(\"unsharp_mask\",s+o+2*g+I+32,{exp:Math.exp}),f=new Uint32Array(A.buffer);new Uint32Array(this.__memory.buffer).set(f);let u=c.exports.hsv_v16||c.exports._hsv_v16;if(!u)throw new Error(\"WASM hsv_v16 function is not available\");if(u(0,h,t,e),u=c.exports.blurMono16||c.exports._blurMono16,!u)throw new Error(\"WASM blurMono16 function is not available\");if(u(h,B,Q,E,C,t,e,a),u=c.exports.unsharp||c.exports._unsharp,!u)throw new Error(\"WASM unsharp function is not available\");u(0,0,h,B,t,e,n,i),f.set(new Uint32Array(this.__memory.buffer,0,r))},wasm_src:\"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\"},s={filter:{box:{win:.5,fn:A=>(A<0&&(A=-A),A<.5?1:0)},hamming:{win:1,fn(A){if(A<0&&(A=-A),A>=1)return 0;if(A<1.1920929e-7)return 1;const t=A*Math.PI;return Math.sin(t)/t*(.54+.46*Math.cos(t/1))}},lanczos2:{win:2,fn(A){if(A<0&&(A=-A),A>=2)return 0;if(A<1.1920929e-7)return 1;const t=A*Math.PI;return Math.sin(t)/t*Math.sin(t/2)/(t/2)}},lanczos3:{win:3,fn(A){if(A<0&&(A=-A),A>=3)return 0;if(A<1.1920929e-7)return 1;const t=A*Math.PI;return Math.sin(t)/t*Math.sin(t/3)/(t/3)}},mks2013:{win:2.5,fn:A=>(A<0&&(A=-A),A>=2.5?0:A>=1.5?-.125*(A-2.5)*(A-2.5):A>=.5?.25*(4*A*A-11*A+7):1.0625-1.75*A*A)}}};function o(A){return Math.round(16383*A)}function g(A,t,e,n,a){const i=s.filter[A].fn,r=1/n,g=Math.min(1,n),I=s.filter[A].win/g;let h,B,Q,E,C,c,f,u,m,d,w,l,y,_,b,D,M;const p=Math.floor(2*(I+1)),G=new Int16Array((p+2)*e);let U=0;const k=!G.subarray||!G.set;for(h=0;h<e;h++){for(B=(h+.5)*r+a,Q=Math.max(0,Math.floor(B-I)),E=Math.min(t-1,Math.ceil(B+I)),C=E-Q+1,c=new Float32Array(C),f=new Int16Array(C),u=0,m=Q,d=0;m<=E;m++,d++)w=i((m+.5-B)*g),u+=w,c[d]=w;for(l=0,d=0;d<c.length;d++)y=c[d]/u,l+=y,f[d]=o(y);for(f[e>>1]+=o(1-l),_=0;_<f.length&&0===f[_];)_++;if(_<f.length){for(b=f.length-1;b>0&&0===f[b];)b--;if(D=Q+_,M=b-_+1,G[U++]=D,G[U++]=M,k)for(d=_;d<=b;d++)G[U++]=f[d];else G.set(f.subarray(_,b+1),U),U+=M}else G[U++]=0,G[U++]=0}return G}function I(A){return A<0?0:A>255?255:A}function h(A){return A>=0?A:0}var B=!0;try{B=1===new Uint32Array(new Uint8Array([1,0,0,0]).buffer)[0]}catch(p){}function Q(A,t,e){if(B)t.set(function(A){return new Uint8Array(A.buffer,0,A.byteLength)}(A),e);else for(let n=e,a=0;a<A.length;a++){const e=A[a];t[n++]=255&e,t[n++]=e>>8&255}}var E={name:\"resize\",fn:function(A){const t=A.src,e=A.width,n=A.height,a=A.toWidth,i=A.toHeight,r=A.scaleX||A.toWidth/A.width,s=A.scaleY||A.toHeight/A.height,o=A.offsetX||0,B=A.offsetY||0,Q=A.dest||new Uint8Array(a*i*4),E=void 0===A.filter?\"mks2013\":A.filter,C=g(E,e,a,r,o),c=g(E,n,i,s,B),f=new Uint16Array(a*n*4);return!function(A,t,e){let n=3;const a=t*e*4|0;for(;n<a;){if(255!==A[n])return!0;n=n+4|0}return!1}(t,e,n)?(function(A,t,e,n,a,i){let r,s,o,g,I,B,Q,E,C,c,f,u=0,m=0;for(C=0;C<n;C++){for(I=0,c=0;c<a;c++){for(B=i[I++],Q=i[I++],E=u+4*B|0,r=s=o=g=0;Q>0;Q--)f=i[I++],g=g+f*A[E+3]|0,o=o+f*A[E+2]|0,s=s+f*A[E+1]|0,r=r+f*A[E]|0,E=E+4|0;t[m+3]=h(g>>7),t[m+2]=h(o>>7),t[m+1]=h(s>>7),t[m]=h(r>>7),m=m+4*n|0}m=4*(C+1)|0,u=(C+1)*e*4|0}}(t,f,e,n,a,C),function(A,t,e,n,a,i){let r,s,o,g,h,B,Q,E,C,c,f,u=0,m=0;for(C=0;C<n;C++){for(h=0,c=0;c<a;c++){for(B=i[h++],Q=i[h++],E=u+4*B|0,r=s=o=g=0;Q>0;Q--)f=i[h++],g=g+f*A[E+3]|0,o=o+f*A[E+2]|0,s=s+f*A[E+1]|0,r=r+f*A[E]|0,E=E+4|0;r>>=7,s>>=7,o>>=7,g>>=7,t[m+3]=I(g+8192>>14),t[m+2]=I(o+8192>>14),t[m+1]=I(s+8192>>14),t[m]=I(r+8192>>14),m=m+4*n|0}m=4*(C+1)|0,u=(C+1)*e*4|0}}(f,Q,n,a,i,c),function(A,t,e){let n=3;const a=t*e*4|0;for(;n<a;)A[n]=255,n=n+4|0}(Q,a,i)):(function(A,t,e,n,a,i){let r,s,o,g,I,B,Q,E,C,c,f,u,m=0,d=0;for(c=0;c<n;c++){for(B=0,f=0;f<a;f++){for(Q=i[B++],E=i[B++],C=m+4*Q|0,r=s=o=g=0;E>0;E--)u=i[B++],I=A[C+3],g=g+u*I|0,o=o+u*A[C+2]*I|0,s=s+u*A[C+1]*I|0,r=r+u*A[C]*I|0,C=C+4|0;o=o/255|0,s=s/255|0,r=r/255|0,t[d+3]=h(g>>7),t[d+2]=h(o>>7),t[d+1]=h(s>>7),t[d]=h(r>>7),d=d+4*n|0}d=4*(c+1)|0,m=(c+1)*e*4|0}}(t,f,e,n,a,C),function(A,t,e,n,a,i){let r,s,o,g,h,B,Q,E,C,c,f,u=0,m=0;for(C=0;C<n;C++){for(h=0,c=0;c<a;c++){for(B=i[h++],Q=i[h++],E=u+4*B|0,r=s=o=g=0;Q>0;Q--)f=i[h++],g=g+f*A[E+3]|0,o=o+f*A[E+2]|0,s=s+f*A[E+1]|0,r=r+f*A[E]|0,E=E+4|0;r>>=7,s>>=7,o>>=7,g>>=7,g=I(g+8192>>14),g>0&&(r=255*r/g|0,s=255*s/g|0,o=255*o/g|0),t[m+3]=g,t[m+2]=I(o+8192>>14),t[m+1]=I(s+8192>>14),t[m]=I(r+8192>>14),m=m+4*n|0}m=4*(C+1)|0,u=(C+1)*e*4|0}}(f,Q,n,a,i,c)),Q},wasm_fn:function(A){const t=A.src,e=A.width,n=A.height,a=A.toWidth,i=A.toHeight,r=A.scaleX||A.toWidth/A.width,s=A.scaleY||A.toHeight/A.height,o=A.offsetX||0,I=A.offsetY||0,h=A.dest||new Uint8Array(a*i*4),B=void 0===A.filter?\"mks2013\":A.filter,E=g(B,e,a,r,o),C=g(B,n,i,s,I),c=Math.max(t.byteLength,h.byteLength),f=this.__align(0+c),u=n*a*4*2,m=this.__align(f+u),d=this.__align(m+E.byteLength),w=d+C.byteLength,l=this.__instance(\"resize\",w),y=new Uint8Array(this.__memory.buffer),_=new Uint32Array(this.__memory.buffer),b=new Uint32Array(t.buffer);_.set(b),Q(E,y,m),Q(C,y,d);const D=l.exports.convolveHV||l.exports._convolveHV;if(!D)throw new Error(\"WASM resize function is not available\");return!function(A,t,e){let n=3;const a=t*e*4|0;for(;n<a;){if(255!==A[n])return!0;n=n+4|0}return!1}(t,e,n)?(D(m,d,f,e,n,a,i,0),function(A,t,e){let n=3;const a=t*e*4|0;for(;n<a;)A[n]=255,n=n+4|0}(h,a,i)):D(m,d,f,e,n,a,i,1),new Uint32Array(h.buffer).set(new Uint32Array(this.__memory.buffer,0,i*a)),h},wasm_src:\"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\"},C=class extends n{constructor(A){const t=A||[],e={js:t.indexOf(\"js\")>=0,wasm:t.indexOf(\"wasm\")>=0};super(e),this.features={js:e.js,wasm:e.wasm&&this.has_wasm()},this.use(r),this.use(E)}resizeAndUnsharp(A){const t=this.resize(A);return A.unsharpAmount&&this.unsharp_mask(t,A.toWidth,A.toHeight,A.unsharpAmount,A.unsharpRadius,A.unsharpThreshold),t}},c=\"/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/4AAQskZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAACAAMBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABsQAAMBAQADAAAAAAAAAAAAAAECAwQFABEx/9oACAEBAAA/AC06fW6va0ps7PT179E88MiV02arrCEkjGQZiSEnKc5ovxURVHoADz//2Q==\",f={canvas:!1,offscreen_canvas:!1,may_be_worker:!1,create_image_bitmap:!1,safari_put_image_data_fix:!1,bug_canvas_orientation_region:!0,bug_image_bitmap_orientation_region:!0,cib_resize:!1},u=!1,m=null;function d(){if(\"undefined\"==typeof document||!document.createElement)return!1;try{const A=document.createElement(\"canvas\");A.width=2,A.height=1;const t=A.getContext(\"2d\");let e=t.createImageData(2,1);return e.data[0]=12,e.data[1]=23,e.data[2]=34,e.data[3]=255,e.data[4]=45,e.data[5]=56,e.data[6]=67,e.data[7]=255,t.putImageData(e,0,0),e=t.getImageData(0,0,2,1),12===e.data[0]&&23===e.data[1]&&34===e.data[2]&&255===e.data[3]&&45===e.data[4]&&56===e.data[5]&&67===e.data[6]&&255===e.data[7]}catch(p){return!1}}function w(){if(\"undefined\"==typeof OffscreenCanvas)return!1;try{const A=new OffscreenCanvas(2,1).getContext(\"2d\");let t=A.createImageData(2,1);return t.data[0]=12,t.data[1]=23,t.data[2]=34,t.data[3]=255,t.data[4]=45,t.data[5]=56,t.data[6]=67,t.data[7]=255,A.putImageData(t,0,0),t=A.getImageData(0,0,2,1),12===t.data[0]&&23===t.data[1]&&34===t.data[2]&&255===t.data[3]&&45===t.data[4]&&56===t.data[5]&&67===t.data[6]&&255===t.data[7]}catch(p){return!1}}function l(){return\"undefined\"!=typeof createImageBitmap}function y(){if(u)return Promise.resolve(Object.assign({},f));if(m)return m.then(()=>Object.assign({},f));f.canvas=d(),f.offscreen_canvas=w(),f.may_be_worker=\"undefined\"!=typeof Worker&&\"undefined\"!=typeof URL&&!!URL.createObjectURL,f.create_image_bitmap=l(),f.safari_put_image_data_fix=function(){try{return!!(\"undefined\"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.indexOf(\"Safari\")>=0&&navigator.userAgent.indexOf(\"Chrome\")<0)}catch(p){return!1}}();const A=Promise.resolve().then(()=>{if(w()&&l()&&\"undefined\"!=typeof Blob&&\"undefined\"!=typeof atob){const A=atob(c),t=new Uint8Array(A.length);for(let e=0;e<A.length;e++)t[e]=A.charCodeAt(e);return createImageBitmap(new Blob([t],{type:\"image/jpeg\"})).then(A=>{const t=new OffscreenCanvas(1,1);try{const e=t.getContext(\"2d\");return e.drawImage(A,1,1,1,1,0,0,1,1),e.getImageData(0,0,1,1).data[0]<240}finally{A.close()}})}return!d()||\"undefined\"==typeof Image||new Promise(A=>{const t=new Image;t.onload=()=>{try{const e=document.createElement(\"canvas\");e.width=1,e.height=1;const n=e.getContext(\"2d\");n.drawImage(t,1,1,1,1,0,0,1,1),A(n.getImageData(0,0,1,1).data[0]<240)}catch(p){A(!0)}},t.onerror=()=>A(!0),t.src=`data:image/jpeg;base64,${c}`})}).catch(()=>!0).then(A=>{f.bug_canvas_orientation_region=A}).catch(()=>{}),t=Promise.resolve().then(()=>{if(!f.create_image_bitmap&&!l())return!0;if(\"undefined\"==typeof Blob||\"undefined\"==typeof atob)return!0;const A=w(),t=d();if(!A&&!t)return!0;const e=atob(c),n=new Uint8Array(e.length);for(let a=0;a<e.length;a++)n[a]=e.charCodeAt(a);return createImageBitmap(new Blob([n],{type:\"image/jpeg\"})).then(t=>createImageBitmap(t,1,1,1,1).then(e=>{let n;A?n=new OffscreenCanvas(1,1):(n=document.createElement(\"canvas\"),n.width=1,n.height=1);try{const A=n.getContext(\"2d\");return A.drawImage(e,0,0),1!==e.width||1!==e.height||A.getImageData(0,0,1,1).data[0]<240}finally{t.close(),e.close()}},()=>(t.close(),!0)))}).catch(()=>!0).then(A=>{f.bug_image_bitmap_orientation_region=A}).catch(()=>{}),e=Promise.resolve().then(()=>{if(!l())return!1;const A=20;let t;if(f.canvas||d())t=document.createElement(\"canvas\"),t.width=A,t.height=A;else{if(!f.offscreen_canvas&&!w())return!1;t=new OffscreenCanvas(A,A),t.getContext(\"2d\").clearRect(0,0,A,A)}return createImageBitmap(t,0,0,A,A,{resizeWidth:5,resizeHeight:5,resizeQuality:\"high\"}).then(A=>{const e=5===A.width&&!!A.close;return A.close&&A.close(),t=null,e})}).catch(()=>!1).then(A=>{f.cib_resize=A}).catch(()=>{});return m=Promise.all([A,t,e]).then(()=>(u=!0,m=null,Object.assign({},f)),A=>{throw m=null,A})}var _=self,b=null;function D(A,t){return b||(b=new C(A.features)),b.resizeAndUnsharp(t)}function M(A){if(\"bitmap\"===A.job.kind)return void function(A,t){let e=new OffscreenCanvas(t.width,t.height);const n=e.getContext(\"2d\");n.drawImage(t.src,0,0);const a=n.getImageData(0,0,t.width,t.height).data;e.width=e.height=0,e=null,t.src.close();const i=D(A,{src:a,width:t.width,height:t.height,toWidth:t.toWidth,toHeight:t.toHeight,scaleX:t.scaleX,scaleY:t.scaleY,offsetX:t.offsetX,offsetY:t.offsetY,filter:t.filter,unsharpAmount:t.unsharpAmount,unsharpRadius:t.unsharpRadius,unsharpThreshold:t.unsharpThreshold}),r=new OffscreenCanvas(t.toWidth,t.toHeight),s=r.getContext(\"2d\"),o=s.createImageData(t.toWidth,t.toHeight);o.data.set(i),s.putImageData(o,0,0);const g=r.transferToImageBitmap();_.postMessage({kind:\"bitmap\",data:g},[g])}(A,A.job);const t=D(A,A.job);_.postMessage({kind:\"array\",data:t},[t.buffer])}_.onmessage=function(A){Promise.resolve().then(()=>function(A){switch(A.method){case\"get_supported_features\":return y().then(A=>{_.postMessage({data:A})});case\"resize\":return M(A),Promise.resolve();default:return Promise.reject(new Error(`Unknown worker method: ${A.method}`))}}(A.data)).catch(A=>{_.postMessage({err:A})})}}();\n//# sourceURL=pica-inline-worker.js", Me = 1;
typeof navigator < "u" && (Me = Math.min(navigator.hardwareConcurrency || 1, 4));
var Ne = {
	tile: 1024,
	concurrency: Me,
	features: [
		"js",
		"wasm",
		"ww"
	],
	idle: 2e3
}, G = {
	filter: "mks2013",
	unsharpAmount: 0,
	unsharpRadius: 0,
	unsharpThreshold: 0
}, Pe = class {
	constructor(e) {
		M(this, "options", void 0), M(this, "__limit", void 0), M(this, "resize_features", void 0), M(this, "__workersPool", void 0), M(this, "capabilities", void 0), M(this, "__requested_features", void 0), M(this, "__mathlib", void 0), M(this, "__initPromise", void 0), this.options = Object.assign({}, Ne, e || {}), (this.options.features.indexOf("ww") >= 0 || this.options.features.indexOf("all") >= 0) && this.options.workerURL, this.__limit = fe(this.options.concurrency), this.resize_features = {
			js: !1,
			wasm: !1,
			cib: !1,
			ww: !1
		}, this.__workersPool = null, this.capabilities = {
			worker: !1,
			ww_offscreen_canvas: !1,
			canvas: !1,
			offscreen_canvas: !1,
			may_be_worker: !1,
			create_image_bitmap: !1,
			safari_put_image_data_fix: !1,
			bug_canvas_orientation_region: !0,
			bug_image_bitmap_orientation_region: !0,
			cib_resize: !1
		}, this.__requested_features = [], this.__mathlib = null;
	}
	init() {
		return this.__initPromise || (this.__initPromise = this.__init()), this.__initPromise;
	}
	__init() {
		var e = this;
		return W(function* () {
			let t = e.options.features.slice();
			t.indexOf("all") >= 0 && (t = [
				"cib",
				"wasm",
				"js",
				"ww"
			]), e.__requested_features = t, e.__mathlib = new ie(t);
			let n = yield ke();
			if (Object.assign(e.capabilities, n), e.capabilities.cib_resize && t.indexOf("cib") >= 0 && (e.resize_features.cib = !0), e.capabilities.may_be_worker && t.indexOf("ww") >= 0 && je && (e.__workersPool = new le(() => e.__createWorkerSlot(), e.options.idle)), e.__workersPool) try {
				let t = yield e.__invokeWorker("get_supported_features"), n = t && t.data;
				n && (e.capabilities.worker = !0, e.resize_features.ww = !0, e.capabilities.ww_offscreen_canvas = !!n.offscreen_canvas);
			} catch (e) {}
			let r = yield e.__mathlib.init();
			return Object.assign(e.resize_features, r.features), e;
		})();
	}
	createCanvas(e, t, n) {
		if (n && this.capabilities.offscreen_canvas) return new OffscreenCanvas(e, t);
		if (this.capabilities.canvas) {
			let n = document.createElement("canvas");
			return n.width = e, n.height = t, n;
		}
		if (this.capabilities.ww_offscreen_canvas) return new OffscreenCanvas(e, t);
		throw Error("Pica: cannot create canvas");
	}
	__createWorkerSlot() {
		if (this.options.workerURL) {
			let e = new Worker(String(this.options.workerURL));
			return {
				value: e,
				destroy() {
					e.terminate();
				}
			};
		}
		{
			let e = window.URL.createObjectURL(new Blob([je], { type: "text/javascript" })), t = new Worker(e);
			return {
				value: t,
				destroy() {
					if (t.terminate(), typeof window < "u") {
						var n, r;
						(n = window.URL) == null || (r = n.revokeObjectURL) == null || r.call(n, e);
					}
				}
			};
		}
		throw Error("Pica: no worker source available");
	}
	__invokeWorker(e, t, n, r) {
		return new Promise((i, a) => {
			let o = this.__workersPool.acquire();
			r && r.cancelToken && r.cancelToken.catch((e) => a(e)), o.value.onmessage = (e) => {
				o.release(), e.data.err ? a(e.data.err) : i(e.data);
			}, o.value.postMessage(Object.assign({ method: e }, t || {}), n || []);
		});
	}
	__invokeResize(e, t) {
		var n = this;
		return W(function* () {
			if (yield Promise.resolve(), !n.resize_features.ww) {
				if (e.kind !== "array") throw Error("Pica: resize tile data is missing");
				let t = {
					src: e.src,
					width: e.width,
					height: e.height,
					toWidth: e.toWidth,
					toHeight: e.toHeight,
					scaleX: e.scaleX,
					scaleY: e.scaleY,
					offsetX: e.offsetX,
					offsetY: e.offsetY,
					filter: e.filter,
					unsharpAmount: e.unsharpAmount,
					unsharpRadius: e.unsharpRadius,
					unsharpThreshold: e.unsharpThreshold
				};
				return {
					kind: "array",
					data: n.__mathlib.resizeAndUnsharp(t)
				};
			}
			let r = [];
			return e.kind === "array" ? r.push(e.src.buffer) : r.push(e.src), n.__invokeWorker("resize", {
				job: e,
				features: n.__requested_features
			}, r, t);
		})();
	}
	__extractTileData(e, t, n, r) {
		if (this.resize_features.ww && this.capabilities.ww_offscreen_canvas) {
			this.debug("Create tile imageBitmap");
			let i = this.createCanvas(e.width, e.height, { preferOffscreen: !0 });
			if (i.getContext("2d").drawImage(n.srcImageBitmap || t, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height), !("transferToImageBitmap" in i)) throw Error("Pica: offscreen canvas is not available for worker transfer");
			return Object.assign({}, r, {
				kind: "bitmap",
				src: i.transferToImageBitmap()
			});
		}
		if (ue(t)) return n.srcCtx || (n.srcCtx = t.getContext("2d")), this.debug("Get tile pixel data"), Object.assign({}, r, {
			kind: "array",
			src: n.srcCtx.getImageData(e.x, e.y, e.width, e.height).data
		});
		this.debug("Draw tile imageBitmap/image to temporary canvas");
		let i = this.createCanvas(e.width, e.height, { preferOffscreen: !0 }), a = i.getContext("2d");
		a.globalCompositeOperation = "copy", a.drawImage(n.srcImageBitmap || t, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height), this.debug("Get tile pixel data");
		let o = a.getImageData(0, 0, e.width, e.height).data;
		return i.width = i.height = 0, Object.assign({}, r, {
			kind: "array",
			src: o
		});
	}
	__landTileData(e, t, n) {
		if (t.kind === "bitmap") return n.toCtx.drawImage(t.data, e.toX, e.toY), t.data.close(), null;
		this.debug("Draw tile");
		let r = n.toCtx.createImageData(e.toWidth, e.toHeight);
		return r.data.set(t.data), this.capabilities.safari_put_image_data_fix ? n.toCtx.putImageData(r, e.toX, e.toY, e.toInnerX - e.toX, e.toInnerY - e.toY, e.toInnerWidth + 1e-5, e.toInnerHeight + 1e-5) : n.toCtx.putImageData(r, e.toX, e.toY, e.toInnerX - e.toX, e.toInnerY - e.toY, e.toInnerWidth, e.toInnerHeight), null;
	}
	__tileAndResize(e, t, n, r) {
		var i = this;
		return W(function* () {
			let a = {
				srcCtx: null,
				srcImageBitmap: null,
				isImageBitmapReused: !1,
				toCtx: null
			}, o = (t) => i.__limit(W(function* () {
				if (r.canceled) return r.cancelToken;
				let o = {
					width: t.width,
					height: t.height,
					toWidth: t.toWidth,
					toHeight: t.toHeight,
					scaleX: t.scaleX,
					scaleY: t.scaleY,
					offsetX: t.offsetX,
					offsetY: t.offsetY,
					filter: n.filter,
					unsharpAmount: n.unsharpAmount,
					unsharpRadius: n.unsharpRadius,
					unsharpThreshold: n.unsharpThreshold
				};
				i.debug("Invoke resize math");
				let s = yield i.__extractTileData(t, e, a, o);
				i.debug("Invoke resize math");
				let c = yield i.__invokeResize(s, r);
				return r.canceled ? r.cancelToken : i.__landTileData(t, c, a);
			}));
			if (yield Promise.resolve(), a.toCtx = t.getContext("2d"), !ue(e)) if (de(e)) a.srcImageBitmap = e, a.isImageBitmapReused = !0;
			else if (F(e)) {
				if (i.capabilities.create_image_bitmap) {
					i.debug("Decode image via createImageBitmap");
					try {
						a.srcImageBitmap = yield createImageBitmap(e);
					} catch (e) {}
				}
			} else throw Error("Pica: \".from\" should be Image, Canvas or ImageBitmap");
			if (r.canceled) return r.cancelToken;
			i.debug("Calculate tiles");
			let s = Se({
				width: n.width,
				height: n.height,
				srcTileSize: i.options.tile,
				toWidth: n.toWidth,
				toHeight: n.toHeight,
				destTileBorder: Math.ceil(Math.max(3, 2.5 * n.unsharpRadius | 0))
			}).map((e) => o(e));
			function c(e) {
				e.srcImageBitmap && (e.isImageBitmapReused || e.srcImageBitmap.close(), e.srcImageBitmap = null);
			}
			i.debug("Process tiles");
			try {
				return yield Promise.all(s), i.debug("Finished!"), c(a), t;
			} catch (e) {
				throw c(a), e;
			}
		})();
	}
	__planStagesAndResize(e, t, n, r) {
		var i = this;
		return W(function* () {
			let a = e, o = n.width, s = n.height, c = ye(n.width, n.height, n.toWidth, n.toHeight, i.options.tile);
			for (; c.length > 0;) {
				if (r.canceled) return r.cancelToken;
				let [l, u] = c.shift(), d = c.length === 0, f;
				f = d || !he(n.filter) ? n.filter : n.filter === "box" ? "box" : "hamming";
				let p = N(N({}, n), {}, {
					filter: f,
					width: o,
					height: s,
					toWidth: l,
					toHeight: u
				}), m = d ? t : i.createCanvas(l, u, { preferOffscreen: !0 }), h = a === e ? void 0 : a;
				try {
					yield i.__tileAndResize(a, m, p, r);
				} finally {
					h && (h.width = h.height = 0);
				}
				a = m, o = l, s = u;
			}
			return t;
		})();
	}
	__resizeViaCreateImageBitmap(e, t, n, r) {
		var i = this;
		return W(function* () {
			var a;
			let o = t.getContext("2d");
			i.debug("Resize via createImageBitmap()");
			let s = yield createImageBitmap(e, {
				resizeWidth: n.toWidth,
				resizeHeight: n.toHeight,
				resizeQuality: pe((a = ge(n.filter)) == null ? 3 : a)
			});
			if (r.canceled) return r.cancelToken;
			if (!n.unsharpAmount) return o.drawImage(s, 0, 0), s.close(), o = null, i.debug("Finished!"), t;
			i.debug("Unsharp result");
			let c = i.createCanvas(n.toWidth, n.toHeight), l = c.getContext("2d");
			l.drawImage(s, 0, 0), s.close();
			let u = l.getImageData(0, 0, n.toWidth, n.toHeight);
			return i.__mathlib.unsharp_mask(u.data, n.toWidth, n.toHeight, n.unsharpAmount, n.unsharpRadius, n.unsharpThreshold), o.putImageData(u, 0, 0), c.width = c.height = 0, u = l = c = o = null, i.debug("Finished!"), t;
		})();
	}
	resize(e, t, n) {
		var r = this;
		return W(function* () {
			r.debug("Start resize...");
			let i = {};
			n && Object.assign(i, n);
			let a = i.filter || G.filter;
			if (Object.prototype.hasOwnProperty.call(i, "quality")) {
				let e = i.quality;
				if (typeof e != "number" || e < 0 || e > 3) throw Error(`Pica: .quality should be [0..3], got ${e}`);
				a = me(e);
			}
			let o = {
				filter: a,
				unsharpAmount: i.unsharpAmount || G.unsharpAmount,
				unsharpRadius: i.unsharpRadius || G.unsharpRadius,
				unsharpThreshold: i.unsharpThreshold || G.unsharpThreshold,
				width: F(e) ? e.naturalWidth : e.width,
				height: F(e) ? e.naturalHeight : e.height,
				toWidth: t.width,
				toHeight: t.height
			};
			if (o.unsharpRadius > 2 && (o.unsharpRadius = 2), t.width === 0 || t.height === 0) return Promise.reject(/* @__PURE__ */ Error(`Invalid output size: ${t.width}x${t.height}`));
			let s = {
				cancelToken: i.cancelToken,
				canceled: !1
			};
			if (s.cancelToken && (s.cancelToken = s.cancelToken.then((e) => {
				throw s.canceled = !0, e;
			}, (e) => {
				throw s.canceled = !0, e;
			})), yield r.init(), s.canceled) return s.cancelToken;
			if (r.capabilities.bug_image_bitmap_orientation_region && (F(e) || de(e))) {
				let t = r.createCanvas(o.width, o.height);
				t.getContext("2d").drawImage(e, 0, 0), e = t;
			}
			if (r.resize_features.cib) {
				if (he(o.filter)) return r.__resizeViaCreateImageBitmap(e, t, o, s);
				r.debug("cib is enabled, but not supports provided filter, fallback to manual math");
			}
			if (!r.capabilities.canvas && !r.capabilities.offscreen_canvas) {
				let e = /* @__PURE__ */ Error("Pica: cannot use getImageData on canvas, make sure fingerprinting protection isn't enabled");
				throw e.code = "ERR_GET_IMAGE_DATA", e;
			}
			return r.__planStagesAndResize(e, t, o, s);
		})();
	}
	resizeBuffer(e) {
		var t = this;
		return W(function* () {
			let n = Object.assign({}, G, e);
			if (Object.prototype.hasOwnProperty.call(n, "quality")) {
				let e = n.quality;
				if (typeof e != "number" || e < 0 || e > 3) throw Error(`Pica: .quality should be [0..3], got ${e}`);
				n.filter = me(e);
			}
			if (yield t.init(), !t.__mathlib) throw Error("Pica: math library is not initialized");
			let r = {
				src: n.src,
				width: n.width,
				height: n.height,
				toWidth: n.toWidth,
				toHeight: n.toHeight,
				dest: n.dest,
				scaleX: n.toWidth / n.width,
				scaleY: n.toHeight / n.height,
				offsetX: 0,
				offsetY: 0,
				filter: n.filter,
				unsharpAmount: n.unsharpAmount,
				unsharpRadius: n.unsharpRadius,
				unsharpThreshold: n.unsharpThreshold
			};
			return t.__mathlib.resizeAndUnsharp(r);
		})();
	}
	toBlob(e, t, n) {
		return W(function* () {
			if (t = t || "image/png", "toBlob" in e && e.toBlob) return new Promise((r) => {
				e.toBlob((e) => r(e), t, n);
			});
			if ("convertToBlob" in e && e.convertToBlob) return e.convertToBlob({
				type: t,
				quality: n
			});
			let r = atob(e.toDataURL(t, n).split(",")[1]), i = r.length, a = new Uint8Array(i);
			for (let e = 0; e < i; e++) a[e] = r.charCodeAt(e);
			return new Blob([a], { type: t });
		})();
	}
	debug(...e) {}
};
function Fe(e) {
	return new Pe(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/typeof.js
function K(e) {
	"@babel/helpers - typeof";
	return K = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, K(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPrimitive.js
function Ie(e, t) {
	if (K(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (K(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPropertyKey.js
function Le(e) {
	var t = Ie(e, "string");
	return K(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/defineProperty.js
function q(e, t, n) {
	return (t = Le(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/image_traverse.ts
var Re = /* @__PURE__ */ t({
	is_jpeg: () => X,
	jpeg_add_comment: () => Ge,
	jpeg_exif_tags_each: () => Ue,
	jpeg_exif_tags_filter: () => We,
	jpeg_segments_each: () => Z,
	jpeg_segments_filter: () => Q
});
function J(e, t) {
	let n = Error(e);
	return n.code = t, n;
}
function ze(e) {
	let t = e.toString(16).toUpperCase();
	for (let e = 2 - t.length; e > 0; e--) t = "0" + t;
	return "0x" + t;
}
function Be(e) {
	try {
		return unescape(encodeURIComponent(e));
	} catch (t) {
		return e;
	}
}
function Ve(e) {
	try {
		return decodeURIComponent(escape(e));
	} catch (t) {
		return e;
	}
}
function Y(e) {
	return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var He = class {
	constructor(e, t, n) {
		q(this, "input", void 0), q(this, "start", void 0), q(this, "big_endian", void 0), q(this, "aborted", !1), q(this, "ifds_to_read", []), q(this, "output", new Uint8Array()), this.input = e.subarray(t, n), this.start = t;
		let r = String.fromCharCode.apply(null, this.input.subarray(0, 4));
		if (r !== "II*\0" && r !== "MM\0*") throw J("invalid TIFF signature", "EBADDATA");
		this.big_endian = r[0] === "M";
	}
	each(e) {
		this.aborted = !1;
		let t = this.read_uint32(4);
		for (this.ifds_to_read = [{
			id: 0,
			offset: t
		}]; this.ifds_to_read.length > 0 && !this.aborted;) {
			let t = this.ifds_to_read.shift();
			!t || !t.offset || this.scan_ifd(t.id, t.offset, e);
		}
	}
	filter(e) {
		let t = {};
		t.ifd0 = {
			id: 0,
			entries: []
		}, this.each(function(n) {
			e(n) === !1 && !n.is_subifd_link || n.is_subifd_link && n.count !== 1 && n.format !== 4 || (t["ifd" + n.ifd] || (t["ifd" + n.ifd] = {
				id: n.ifd,
				entries: []
			}), t["ifd" + n.ifd].entries.push(n));
		}), delete t.ifd1;
		let n = 8;
		Object.keys(t).forEach(function(e) {
			n += 2, t[e].entries.forEach(function(e) {
				n += 12 + (e.data_length > 4 ? Math.ceil(e.data_length / 2) * 2 : 0);
			}), n += 4;
		}), this.output = new Uint8Array(n), this.output[0] = this.output[1] = (this.big_endian ? "M" : "I").charCodeAt(0), this.write_uint16(2, 42);
		let r = 8;
		if (this.write_uint32(4, r), Object.keys(t).forEach((e) => {
			t[e].written_offset = r;
			let n = r, i = n + 2 + t[e].entries.length * 12 + 4;
			r = i, this.write_uint16(n, t[e].entries.length), t[e].entries.sort(function(e, t) {
				return e.tag - t.tag;
			}).forEach((e, i) => {
				let a = n + 2 + i * 12;
				this.write_uint16(a, e.tag), this.write_uint16(a + 2, e.format), this.write_uint32(a + 4, e.count), e.is_subifd_link ? t["ifd" + e.tag] && (t["ifd" + e.tag].link_offset = a + 8) : e.data_length <= 4 ? this.output.set(this.input.subarray(e.data_offset - this.start, e.data_offset - this.start + 4), a + 8) : (this.write_uint32(a + 8, r), this.output.set(this.input.subarray(e.data_offset - this.start, e.data_offset - this.start + e.data_length), r), r += Math.ceil(e.data_length / 2) * 2);
			});
			let a = t["ifd" + (t[e].id + 1)];
			a && (a.link_offset = i - 4);
		}), Object.keys(t).forEach((e) => {
			t[e].written_offset && t[e].link_offset && this.write_uint32(t[e].link_offset, t[e].written_offset);
		}), this.output.length !== r) throw J("internal error: incorrect buffer size allocated");
		return this.output;
	}
	read_uint16(e) {
		let t = this.input;
		if (e + 2 > t.length) throw J("unexpected EOF", "EBADDATA");
		return this.big_endian ? t[e] * 256 + t[e + 1] : t[e] + t[e + 1] * 256;
	}
	read_uint32(e) {
		let t = this.input;
		if (e + 4 > t.length) throw J("unexpected EOF", "EBADDATA");
		return this.big_endian ? t[e] * 16777216 + t[e + 1] * 65536 + t[e + 2] * 256 + t[e + 3] : t[e] + t[e + 1] * 256 + t[e + 2] * 65536 + t[e + 3] * 16777216;
	}
	write_uint16(e, t) {
		let n = this.output;
		this.big_endian ? (n[e] = t >>> 8 & 255, n[e + 1] = t & 255) : (n[e] = t & 255, n[e + 1] = t >>> 8 & 255);
	}
	write_uint32(e, t) {
		let n = this.output;
		this.big_endian ? (n[e] = t >>> 24 & 255, n[e + 1] = t >>> 16 & 255, n[e + 2] = t >>> 8 & 255, n[e + 3] = t & 255) : (n[e] = t & 255, n[e + 1] = t >>> 8 & 255, n[e + 2] = t >>> 16 & 255, n[e + 3] = t >>> 24 & 255);
	}
	is_subifd_link(e, t) {
		return e === 0 && t === 34665 || e === 0 && t === 34853 || e === 34665 && t === 40965;
	}
	exif_format_length(e) {
		switch (e) {
			case 1:
			case 2:
			case 6:
			case 7: return 1;
			case 3:
			case 8: return 2;
			case 4:
			case 9:
			case 11: return 4;
			case 5:
			case 10:
			case 12: return 8;
			default: return 0;
		}
	}
	exif_format_read(e, t) {
		let n;
		switch (e) {
			case 1:
			case 2: return n = this.input[t], n;
			case 6: return n = this.input[t], n | (n & 128) * 33554430;
			case 3: return n = this.read_uint16(t), n;
			case 8: return n = this.read_uint16(t), n | (n & 32768) * 131070;
			case 4: return n = this.read_uint32(t), n;
			case 9: return n = this.read_uint32(t), n | 0;
			case 5:
			case 10:
			case 11:
			case 12: return null;
			case 7: return null;
			default: return null;
		}
	}
	scan_ifd(e, t, n) {
		let r = this.read_uint16(t);
		t += 2;
		for (let i = 0; i < r; i++) {
			let r = this.read_uint16(t), i = this.read_uint16(t + 2), a = this.read_uint32(t + 4), o = this.exif_format_length(i), s = a * o, c = s <= 4 ? t + 8 : this.read_uint32(t + 8), l = !1;
			if (c + s > this.input.length) throw J("unexpected EOF", "EBADDATA");
			let u = [], d = c;
			for (let e = 0; e < a; e++, d += o) {
				let e = this.exif_format_read(i, d);
				if (e === null) {
					u = null;
					break;
				}
				u.push(e);
			}
			if (Array.isArray(u) && i === 2) {
				try {
					u = Ve(String.fromCharCode.apply(null, u));
				} catch (e) {
					u = null;
				}
				u && u[u.length - 1] === "\0" && (u = u.slice(0, -1));
			}
			if (this.is_subifd_link(e, r) && Array.isArray(u) && Number.isInteger(u[0]) && u[0] > 0 && (this.ifds_to_read.push({
				id: r,
				offset: u[0]
			}), l = !0), n({
				is_big_endian: this.big_endian,
				ifd: e,
				tag: r,
				format: i,
				count: a,
				entry_offset: t + this.start,
				data_length: s,
				data_offset: c + this.start,
				value: u,
				is_subifd_link: l
			}) === !1) {
				this.aborted = !0;
				return;
			}
			t += 12;
		}
		e === 0 && this.ifds_to_read.push({
			id: 1,
			offset: this.read_uint32(t)
		});
	}
};
function X(e) {
	return e.length >= 4 && e[0] === 255 && e[1] === 216 && e[2] === 255;
}
function Z(e, t) {
	if (!Y(e)) throw J("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof t != "function") throw J("Invalid argument (on_segment), Function expected", "EINVAL");
	if (!X(e)) throw J("Unknown file format", "ENOTJPEG");
	let n = 0, r = !1, i = e.length;
	for (;;) {
		let a, o;
		if (n + 1 >= i) throw J("Unexpected EOF", "EBADDATA");
		let s = e[n], c = e[n + 1];
		if (s === 255 && c === 255) a = 255, o = 1;
		else if (s === 255 && c !== 0) {
			if (a = c, o = 2, !(a >= 208 && a <= 217 || a === 1)) {
				if (n + 3 >= i) throw J("Unexpected EOF", "EBADDATA");
				if (o += e[n + 2] * 256 + e[n + 3], o < 2) throw J("Invalid segment length", "EBADDATA");
				if (n + o - 1 >= i) throw J("Unexpected EOF", "EBADDATA");
			}
			r && (a >= 208 && a <= 215 || (r = !1)), a === 218 && (r = !0);
		} else if (r) for (let t = n + 1;; t++) {
			if (t >= i) throw J("Unexpected EOF", "EBADDATA");
			if (e[t] === 255) {
				if (t + 1 >= i) throw J("Unexpected EOF", "EBADDATA");
				if (e[t + 1] !== 0) {
					a = 0, o = t - n;
					break;
				}
			}
		}
		else throw J("Unexpected byte at segment start: " + ze(s) + " (offset " + ze(n) + ")", "EBADDATA");
		if (t({
			code: a,
			offset: n,
			length: o
		}) === !1 || a === 217) break;
		n += o;
	}
}
function Q(e, t) {
	if (!Y(e)) throw J("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof t != "function") throw J("Invalid argument (on_segment), Function expected", "EINVAL");
	let n = [], r = 0;
	Z(e, function(e) {
		let i = t(e);
		if (Y(i)) n.push({ data: i }), r += i.length;
		else if (Array.isArray(i)) i.filter(Y).forEach(function(e) {
			n.push({ data: e }), r += e.length;
		});
		else if (i !== !1) {
			let t = {
				start: e.offset,
				end: e.offset + e.length
			};
			n.length > 0 && n[n.length - 1].end === t.start ? n[n.length - 1].end = t.end : n.push(t), r += e.length;
		}
	});
	let i = new Uint8Array(r), a = 0;
	return n.forEach(function(t) {
		let n = t.data || e.subarray(t.start, t.end);
		i.set(n, a), a += n.length;
	}), i;
}
function Ue(e, t) {
	if (!Y(e)) throw J("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof t != "function") throw J("Invalid argument (on_exif_entry), Function expected", "EINVAL");
	Z(e, function(n) {
		if (n.code === 218) return !1;
		if (n.code === 225 && n.length >= 10 && e[n.offset + 4] === 69 && e[n.offset + 5] === 120 && e[n.offset + 6] === 105 && e[n.offset + 7] === 102 && e[n.offset + 8] === 0 && e[n.offset + 9] === 0) return new He(e, n.offset + 10, n.offset + n.length).each(t), !1;
	});
}
function We(e, t) {
	if (!Y(e)) throw J("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof t != "function") throw J("Invalid argument (on_exif_entry), Function expected", "EINVAL");
	let n = !1;
	return Q(e, function(r) {
		if (!n && (r.code === 218 && (n = !0), r.code === 225 && r.length >= 10 && e[r.offset + 4] === 69 && e[r.offset + 5] === 120 && e[r.offset + 6] === 105 && e[r.offset + 7] === 102 && e[r.offset + 8] === 0 && e[r.offset + 9] === 0)) {
			let i = new He(e, r.offset + 10, r.offset + r.length).filter(t);
			if (!i) return !1;
			let a = new Uint8Array(10);
			return a.set(e.slice(r.offset, r.offset + 10)), a[2] = i.length + 8 >>> 8 & 255, a[3] = i.length + 8 & 255, n = !0, [a, i];
		}
	});
}
function Ge(e, t) {
	let n = !1, r = 0;
	return Q(e, function(i) {
		if (r++, r === 1 && i.code === 216 || r === 2 && i.code === 224 || n) return;
		t = Be(t);
		let a = new Uint8Array(5 + t.length), o = 0;
		return a[o++] = 255, a[o++] = 254, a[o++] = t.length + 3 >>> 8 & 255, a[o++] = t.length + 3 & 255, t.split("").forEach(function(e) {
			a[o++] = e.charCodeAt(0) & 255;
		}), a[o++] = 0, n = !0, [a, e.subarray(i.offset, i.offset + i.length)];
	});
}
//#endregion
//#region src/jpeg_plugins.ts
async function Ke(e) {
	let t = await this._getUint8Array(e.blob);
	if (e.is_jpeg = X(t), !e.is_jpeg) return e;
	e.orig_blob = e.blob;
	try {
		let n, r;
		if (Ue(t, function(t) {
			if (t.ifd === 0 && t.tag === 274 && Array.isArray(t.value)) return e.orientation = t.value[0] || 1, n = t.is_big_endian, r = t.data_offset, !1;
		}), r) {
			let i = n ? new Uint8Array([0, 1]) : new Uint8Array([1, 0]);
			e.blob = new Blob([
				t.slice(0, r),
				i,
				t.slice(r + 2)
			], { type: "image/jpeg" });
		}
	} catch (e) {}
	return e;
}
async function qe(e) {
	if (!e.is_jpeg) return e;
	let t = (e.orientation || 1) - 1;
	if (!t) return e;
	let n;
	n = t & 4 ? this.pica.createCanvas(e.out_canvas.height, e.out_canvas.width) : this.pica.createCanvas(e.out_canvas.width, e.out_canvas.height);
	let r = n.getContext("2d");
	return r.save(), t & 1 && r.transform(-1, 0, 0, 1, n.width, 0), t & 2 && r.transform(-1, 0, 0, -1, n.width, n.height), t & 4 && r.transform(0, 1, 1, 0, 0, 0), r.drawImage(e.out_canvas, 0, 0), r.restore(), e.out_canvas.width = e.out_canvas.height = 0, e.out_canvas = n, e;
}
async function Je(e) {
	if (!e.is_jpeg) return e;
	let [t, n] = await Promise.all([this._getUint8Array(e.blob), this._getUint8Array(e.out_blob)]);
	if (!X(t)) return e;
	let r = [];
	Z(t, function(e) {
		if (e.code === 218) return !1;
		r.push(e);
	});
	let i = r.filter(function(e) {
		return e.code === 226 ? !1 : e.code >= 224 && e.code < 240 || e.code === 254;
	}).map(function(e) {
		return t.slice(e.offset, e.offset + e.length);
	});
	return e.out_blob = new Blob([n.slice(0, 2)].concat(i, [n.slice(20)]), { type: "image/jpeg" }), e;
}
function Ye(e) {
	e.before("_blob_to_image", Ke), e.after("_transform", qe), e.after("_create_blob", Je);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectSpread2.js
function Xe(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Ze(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Xe(Object(n), !0).forEach(function(t) {
			q(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xe(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutPropertiesLoose.js
function Qe(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.includes(r)) continue;
		n[r] = e[r];
	}
	return n;
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutProperties.js
function $e(e, t) {
	if (e == null) return {};
	var n, r, i = Qe(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.includes(n) || {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
//#endregion
//#region src/index.ts
var et = ["max"], $ = class {
	constructor(e) {
		q(this, "pica", void 0), q(this, "initialized", void 0), q(this, "_initPromise", void 0), e = e || {}, this.pica = e.pica || Fe({}), this.initialized = !1;
	}
	use(e, ...t) {
		return e(this, ...t), this;
	}
	setup() {
		this.use(Ye);
	}
	async _ensureInitialized() {
		var e = this;
		return e._initPromise || (e._initPromise = Promise.resolve().then(async () => {
			e.setup(), await e.pica.init(), e.initialized = !0;
		})), e._initPromise;
	}
	async toBlob(e, t) {
		var n = this;
		let r = {
			blob: e,
			opts: Ze({ max: Infinity }, t)
		};
		return await n._ensureInitialized(), r = await n._blob_to_image(r), r = await n._calculate_size(r), r = await n._transform(r), r = await n._cleanup(r), r = await n._create_blob(r), r.out_canvas.width = r.out_canvas.height = 0, r.out_blob;
	}
	async toCanvas(e, t) {
		var n = this;
		let r = {
			blob: e,
			opts: Ze({ max: Infinity }, t)
		};
		return await n._ensureInitialized(), r = await n._blob_to_image(r), r = await n._calculate_size(r), r = await n._transform(r), r = await n._cleanup(r), r.out_canvas;
	}
	before(e, t) {
		var n = this;
		if (!this[e]) throw Error("Method \"" + e + "\" does not exist");
		if (typeof t != "function") throw Error("Invalid argument \"fn\", function expected");
		let r = this[e];
		return this[e] = (async (e) => {
			let i = await t.call(n, e);
			return r.call(n, i);
		}), this;
	}
	after(e, t) {
		var n = this;
		if (!this[e]) throw Error("Method \"" + e + "\" does not exist");
		if (typeof t != "function") throw Error("Invalid argument \"fn\", function expected");
		let r = this[e];
		return this[e] = (async (e) => {
			let i = await r.call(n, e);
			return t.call(n, i);
		}), this;
	}
	_blob_to_image(e) {
		let t = window, n = t.URL || t.webkitURL || t.mozURL || t.msURL;
		return e.image = document.createElement("img"), e.image_url = n.createObjectURL(e.blob), e.image.src = e.image_url, new Promise(function(t, n) {
			e.image.onerror = function() {
				n(/* @__PURE__ */ Error("ImageBlobReduce: failed to create Image() from blob"));
			}, e.image.onload = function() {
				t(e);
			};
		});
	}
	async _calculate_size(e) {
		let t = e.opts.max / Math.max(e.image.width, e.image.height);
		return t > 1 && (t = 1), e.transform_width = Math.max(Math.round(e.image.width * t), 1), e.transform_height = Math.max(Math.round(e.image.height * t), 1), e.scale_factor = t, e;
	}
	async _transform(e) {
		var t = this;
		e.out_canvas = t.pica.createCanvas(e.transform_width, e.transform_height), e.transform_width = null, e.transform_height = null;
		let n = e.opts, { max: r } = n, i = $e(n, et);
		return await t.pica.resize(e.image, e.out_canvas, i), e;
	}
	async _cleanup(e) {
		e.image.src = "", e.image = null;
		let t = window, n = t.URL || t.webkitURL || t.mozURL || t.msURL;
		return n.revokeObjectURL && n.revokeObjectURL(e.image_url), e.image_url = null, e;
	}
	async _create_blob(e) {
		return e.out_blob = await this.pica.toBlob(e.out_canvas, e.blob.type), e;
	}
	async _getUint8Array(e) {
		return e.arrayBuffer ? new Uint8Array(await e.arrayBuffer()) : new Promise(function(t, n) {
			let r = new FileReader();
			r.readAsArrayBuffer(e), r.onload = function() {
				t(new Uint8Array(r.result));
			}, r.onerror = function() {
				n(/* @__PURE__ */ Error("ImageBlobReduce: failed to load data from input blob")), r.abort();
			}, r.onabort = function() {
				n(/* @__PURE__ */ Error("ImageBlobReduce: failed to load data from input blob (aborted)"));
			};
		});
	}
};
function tt(e) {
	return new $(e);
}
//#endregion
export { $ as ImageBlobReduce, Pe as Pica, tt as default, Re as image_traverse, Fe as pica };

//# sourceMappingURL=image-blob-reduce.browser.min.mjs.map