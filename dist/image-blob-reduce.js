/*!

image-blob-reduce
https://github.com/nodeca/image-blob-reduce

*/
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let pica = require("pica");
pica = __toESM(pica);
//#region \0@oxc-project+runtime@0.130.0/helpers/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region src/image_traverse.ts
var image_traverse_exports = /* @__PURE__ */ __exportAll({
	is_jpeg: () => is_jpeg,
	jpeg_add_comment: () => jpeg_add_comment,
	jpeg_exif_tags_each: () => jpeg_exif_tags_each,
	jpeg_exif_tags_filter: () => jpeg_exif_tags_filter,
	jpeg_segments_each: () => jpeg_segments_each,
	jpeg_segments_filter: () => jpeg_segments_filter
});
function error(message, code) {
	const err = new Error(message);
	err.code = code;
	return err;
}
function to_hex(number) {
	let n = number.toString(16).toUpperCase();
	for (let i = 2 - n.length; i > 0; i--) n = "0" + n;
	return "0x" + n;
}
function utf8_encode(str) {
	try {
		return unescape(encodeURIComponent(str));
	} catch (_) {
		return str;
	}
}
function utf8_decode(str) {
	try {
		return decodeURIComponent(escape(str));
	} catch (_) {
		return str;
	}
}
function is_uint8array(bin) {
	return Object.prototype.toString.call(bin) === "[object Uint8Array]";
}
var ExifParser = class {
	constructor(jpeg_bin, exif_start, exif_end) {
		_defineProperty(this, "input", void 0);
		_defineProperty(this, "start", void 0);
		_defineProperty(this, "big_endian", void 0);
		_defineProperty(this, "aborted", false);
		_defineProperty(this, "ifds_to_read", []);
		_defineProperty(this, "output", new Uint8Array(0));
		this.input = jpeg_bin.subarray(exif_start, exif_end);
		this.start = exif_start;
		const sig = String.fromCharCode.apply(null, this.input.subarray(0, 4));
		if (sig !== "II*\0" && sig !== "MM\0*") throw error("invalid TIFF signature", "EBADDATA");
		this.big_endian = sig[0] === "M";
	}
	each(on_entry) {
		this.aborted = false;
		const offset = this.read_uint32(4);
		this.ifds_to_read = [{
			id: 0,
			offset
		}];
		while (this.ifds_to_read.length > 0 && !this.aborted) {
			const i = this.ifds_to_read.shift();
			if (!i || !i.offset) continue;
			this.scan_ifd(i.id, i.offset, on_entry);
		}
	}
	filter(on_entry) {
		const ifds = {};
		ifds.ifd0 = {
			id: 0,
			entries: []
		};
		this.each(function(entry) {
			if (on_entry(entry) === false && !entry.is_subifd_link) return;
			if (entry.is_subifd_link && entry.count !== 1 && entry.format !== 4) return;
			if (!ifds["ifd" + entry.ifd]) ifds["ifd" + entry.ifd] = {
				id: entry.ifd,
				entries: []
			};
			ifds["ifd" + entry.ifd].entries.push(entry);
		});
		delete ifds.ifd1;
		let length = 8;
		Object.keys(ifds).forEach(function(ifd_no) {
			length += 2;
			ifds[ifd_no].entries.forEach(function(entry) {
				length += 12 + (entry.data_length > 4 ? Math.ceil(entry.data_length / 2) * 2 : 0);
			});
			length += 4;
		});
		this.output = new Uint8Array(length);
		this.output[0] = this.output[1] = (this.big_endian ? "M" : "I").charCodeAt(0);
		this.write_uint16(2, 42);
		let offset = 8;
		this.write_uint32(4, offset);
		Object.keys(ifds).forEach((ifd_no) => {
			ifds[ifd_no].written_offset = offset;
			const ifd_start = offset;
			const ifd_end = ifd_start + 2 + ifds[ifd_no].entries.length * 12 + 4;
			offset = ifd_end;
			this.write_uint16(ifd_start, ifds[ifd_no].entries.length);
			ifds[ifd_no].entries.sort(function(a, b) {
				return a.tag - b.tag;
			}).forEach((entry, idx) => {
				const entry_offset = ifd_start + 2 + idx * 12;
				this.write_uint16(entry_offset, entry.tag);
				this.write_uint16(entry_offset + 2, entry.format);
				this.write_uint32(entry_offset + 4, entry.count);
				if (entry.is_subifd_link) {
					if (ifds["ifd" + entry.tag]) ifds["ifd" + entry.tag].link_offset = entry_offset + 8;
				} else if (entry.data_length <= 4) this.output.set(this.input.subarray(entry.data_offset - this.start, entry.data_offset - this.start + 4), entry_offset + 8);
				else {
					this.write_uint32(entry_offset + 8, offset);
					this.output.set(this.input.subarray(entry.data_offset - this.start, entry.data_offset - this.start + entry.data_length), offset);
					offset += Math.ceil(entry.data_length / 2) * 2;
				}
			});
			const next_ifd = ifds["ifd" + (ifds[ifd_no].id + 1)];
			if (next_ifd) next_ifd.link_offset = ifd_end - 4;
		});
		Object.keys(ifds).forEach((ifd_no) => {
			if (ifds[ifd_no].written_offset && ifds[ifd_no].link_offset) this.write_uint32(ifds[ifd_no].link_offset, ifds[ifd_no].written_offset);
		});
		if (this.output.length !== offset) throw error("internal error: incorrect buffer size allocated");
		return this.output;
	}
	read_uint16(offset) {
		const d = this.input;
		if (offset + 2 > d.length) throw error("unexpected EOF", "EBADDATA");
		return this.big_endian ? d[offset] * 256 + d[offset + 1] : d[offset] + d[offset + 1] * 256;
	}
	read_uint32(offset) {
		const d = this.input;
		if (offset + 4 > d.length) throw error("unexpected EOF", "EBADDATA");
		return this.big_endian ? d[offset] * 16777216 + d[offset + 1] * 65536 + d[offset + 2] * 256 + d[offset + 3] : d[offset] + d[offset + 1] * 256 + d[offset + 2] * 65536 + d[offset + 3] * 16777216;
	}
	write_uint16(offset, value) {
		const d = this.output;
		if (this.big_endian) {
			d[offset] = value >>> 8 & 255;
			d[offset + 1] = value & 255;
		} else {
			d[offset] = value & 255;
			d[offset + 1] = value >>> 8 & 255;
		}
	}
	write_uint32(offset, value) {
		const d = this.output;
		if (this.big_endian) {
			d[offset] = value >>> 24 & 255;
			d[offset + 1] = value >>> 16 & 255;
			d[offset + 2] = value >>> 8 & 255;
			d[offset + 3] = value & 255;
		} else {
			d[offset] = value & 255;
			d[offset + 1] = value >>> 8 & 255;
			d[offset + 2] = value >>> 16 & 255;
			d[offset + 3] = value >>> 24 & 255;
		}
	}
	is_subifd_link(ifd, tag) {
		return ifd === 0 && tag === 34665 || ifd === 0 && tag === 34853 || ifd === 34665 && tag === 40965;
	}
	exif_format_length(format) {
		switch (format) {
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
	exif_format_read(format, offset) {
		let v;
		switch (format) {
			case 1:
			case 2:
				v = this.input[offset];
				return v;
			case 6:
				v = this.input[offset];
				return v | (v & 128) * 33554430;
			case 3:
				v = this.read_uint16(offset);
				return v;
			case 8:
				v = this.read_uint16(offset);
				return v | (v & 32768) * 131070;
			case 4:
				v = this.read_uint32(offset);
				return v;
			case 9:
				v = this.read_uint32(offset);
				return v | 0;
			case 5:
			case 10:
			case 11:
			case 12: return null;
			case 7: return null;
			default: return null;
		}
	}
	scan_ifd(ifd_no, offset, on_entry) {
		const entry_count = this.read_uint16(offset);
		offset += 2;
		for (let i = 0; i < entry_count; i++) {
			const tag = this.read_uint16(offset);
			const format = this.read_uint16(offset + 2);
			const count = this.read_uint32(offset + 4);
			const comp_length = this.exif_format_length(format);
			const data_length = count * comp_length;
			const data_offset = data_length <= 4 ? offset + 8 : this.read_uint32(offset + 8);
			let is_subifd_link = false;
			if (data_offset + data_length > this.input.length) throw error("unexpected EOF", "EBADDATA");
			let value = [];
			let comp_offset = data_offset;
			for (let j = 0; j < count; j++, comp_offset += comp_length) {
				const item = this.exif_format_read(format, comp_offset);
				if (item === null) {
					value = null;
					break;
				}
				value.push(item);
			}
			if (Array.isArray(value) && format === 2) {
				try {
					value = utf8_decode(String.fromCharCode.apply(null, value));
				} catch (_) {
					value = null;
				}
				if (value && value[value.length - 1] === "\0") value = value.slice(0, -1);
			}
			if (this.is_subifd_link(ifd_no, tag)) {
				if (Array.isArray(value) && Number.isInteger(value[0]) && value[0] > 0) {
					this.ifds_to_read.push({
						id: tag,
						offset: value[0]
					});
					is_subifd_link = true;
				}
			}
			if (on_entry({
				is_big_endian: this.big_endian,
				ifd: ifd_no,
				tag,
				format,
				count,
				entry_offset: offset + this.start,
				data_length,
				data_offset: data_offset + this.start,
				value,
				is_subifd_link
			}) === false) {
				this.aborted = true;
				return;
			}
			offset += 12;
		}
		if (ifd_no === 0) this.ifds_to_read.push({
			id: 1,
			offset: this.read_uint32(offset)
		});
	}
};
function is_jpeg(jpeg_bin) {
	return jpeg_bin.length >= 4 && jpeg_bin[0] === 255 && jpeg_bin[1] === 216 && jpeg_bin[2] === 255;
}
function jpeg_segments_each(jpeg_bin, on_segment) {
	if (!is_uint8array(jpeg_bin)) throw error("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof on_segment !== "function") throw error("Invalid argument (on_segment), Function expected", "EINVAL");
	if (!is_jpeg(jpeg_bin)) throw error("Unknown file format", "ENOTJPEG");
	let offset = 0, inside_scan = false;
	const length = jpeg_bin.length;
	for (;;) {
		let segment_code;
		let segment_length;
		if (offset + 1 >= length) throw error("Unexpected EOF", "EBADDATA");
		const byte1 = jpeg_bin[offset];
		const byte2 = jpeg_bin[offset + 1];
		if (byte1 === 255 && byte2 === 255) {
			segment_code = 255;
			segment_length = 1;
		} else if (byte1 === 255 && byte2 !== 0) {
			segment_code = byte2;
			segment_length = 2;
			if (segment_code >= 208 && segment_code <= 217 || segment_code === 1) {} else {
				if (offset + 3 >= length) throw error("Unexpected EOF", "EBADDATA");
				segment_length += jpeg_bin[offset + 2] * 256 + jpeg_bin[offset + 3];
				if (segment_length < 2) throw error("Invalid segment length", "EBADDATA");
				if (offset + segment_length - 1 >= length) throw error("Unexpected EOF", "EBADDATA");
			}
			if (inside_scan) if (segment_code >= 208 && segment_code <= 215) {} else inside_scan = false;
			if (segment_code === 218) inside_scan = true;
		} else if (inside_scan) for (let pos = offset + 1;; pos++) {
			if (pos >= length) throw error("Unexpected EOF", "EBADDATA");
			if (jpeg_bin[pos] === 255) {
				if (pos + 1 >= length) throw error("Unexpected EOF", "EBADDATA");
				if (jpeg_bin[pos + 1] !== 0) {
					segment_code = 0;
					segment_length = pos - offset;
					break;
				}
			}
		}
		else throw error("Unexpected byte at segment start: " + to_hex(byte1) + " (offset " + to_hex(offset) + ")", "EBADDATA");
		if (on_segment({
			code: segment_code,
			offset,
			length: segment_length
		}) === false) break;
		if (segment_code === 217) break;
		offset += segment_length;
	}
}
function jpeg_segments_filter(jpeg_bin, on_segment) {
	if (!is_uint8array(jpeg_bin)) throw error("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof on_segment !== "function") throw error("Invalid argument (on_segment), Function expected", "EINVAL");
	const ranges = [];
	let out_length = 0;
	jpeg_segments_each(jpeg_bin, function(segment) {
		const new_segment = on_segment(segment);
		if (is_uint8array(new_segment)) {
			ranges.push({ data: new_segment });
			out_length += new_segment.length;
		} else if (Array.isArray(new_segment)) new_segment.filter(is_uint8array).forEach(function(s) {
			ranges.push({ data: s });
			out_length += s.length;
		});
		else if (new_segment !== false) {
			const new_range = {
				start: segment.offset,
				end: segment.offset + segment.length
			};
			if (ranges.length > 0 && ranges[ranges.length - 1].end === new_range.start) ranges[ranges.length - 1].end = new_range.end;
			else ranges.push(new_range);
			out_length += segment.length;
		}
	});
	const result = new Uint8Array(out_length);
	let offset = 0;
	ranges.forEach(function(range) {
		const data = range.data || jpeg_bin.subarray(range.start, range.end);
		result.set(data, offset);
		offset += data.length;
	});
	return result;
}
function jpeg_exif_tags_each(jpeg_bin, on_exif_entry) {
	if (!is_uint8array(jpeg_bin)) throw error("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof on_exif_entry !== "function") throw error("Invalid argument (on_exif_entry), Function expected", "EINVAL");
	jpeg_segments_each(jpeg_bin, function(segment) {
		if (segment.code === 218) return false;
		if (segment.code === 225 && segment.length >= 10 && jpeg_bin[segment.offset + 4] === 69 && jpeg_bin[segment.offset + 5] === 120 && jpeg_bin[segment.offset + 6] === 105 && jpeg_bin[segment.offset + 7] === 102 && jpeg_bin[segment.offset + 8] === 0 && jpeg_bin[segment.offset + 9] === 0) {
			new ExifParser(jpeg_bin, segment.offset + 10, segment.offset + segment.length).each(on_exif_entry);
			return false;
		}
	});
}
function jpeg_exif_tags_filter(jpeg_bin, on_exif_entry) {
	if (!is_uint8array(jpeg_bin)) throw error("Invalid argument (jpeg_bin), Uint8Array expected", "EINVAL");
	if (typeof on_exif_entry !== "function") throw error("Invalid argument (on_exif_entry), Function expected", "EINVAL");
	let stop_search = false;
	return jpeg_segments_filter(jpeg_bin, function(segment) {
		if (stop_search) return;
		if (segment.code === 218) stop_search = true;
		if (segment.code === 225 && segment.length >= 10 && jpeg_bin[segment.offset + 4] === 69 && jpeg_bin[segment.offset + 5] === 120 && jpeg_bin[segment.offset + 6] === 105 && jpeg_bin[segment.offset + 7] === 102 && jpeg_bin[segment.offset + 8] === 0 && jpeg_bin[segment.offset + 9] === 0) {
			const new_exif = new ExifParser(jpeg_bin, segment.offset + 10, segment.offset + segment.length).filter(on_exif_entry);
			if (!new_exif) return false;
			const header = new Uint8Array(10);
			header.set(jpeg_bin.slice(segment.offset, segment.offset + 10));
			header[2] = new_exif.length + 8 >>> 8 & 255;
			header[3] = new_exif.length + 8 & 255;
			stop_search = true;
			return [header, new_exif];
		}
	});
}
function jpeg_add_comment(jpeg_bin, comment) {
	let comment_inserted = false, segment_count = 0;
	return jpeg_segments_filter(jpeg_bin, function(segment) {
		segment_count++;
		if (segment_count === 1 && segment.code === 216) return;
		if (segment_count === 2 && segment.code === 224) return;
		if (comment_inserted) return;
		comment = utf8_encode(comment);
		const csegment = new Uint8Array(5 + comment.length);
		let offset = 0;
		csegment[offset++] = 255;
		csegment[offset++] = 254;
		csegment[offset++] = comment.length + 3 >>> 8 & 255;
		csegment[offset++] = comment.length + 3 & 255;
		comment.split("").forEach(function(c) {
			csegment[offset++] = c.charCodeAt(0) & 255;
		});
		csegment[offset++] = 0;
		comment_inserted = true;
		return [csegment, jpeg_bin.subarray(segment.offset, segment.offset + segment.length)];
	});
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
	try {
		var i = n[a](c), u = i.value;
	} catch (n) {
		e(n);
		return;
	}
	i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
	return function() {
		var t = this, e = arguments;
		return new Promise(function(r, o) {
			var a = n.apply(t, e);
			function _next(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
			}
			function _throw(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
			}
			_next(void 0);
		});
	};
}
//#endregion
//#region src/jpeg_plugins.ts
function jpeg_patch_exif(_x) {
	return _jpeg_patch_exif.apply(this, arguments);
}
function _jpeg_patch_exif() {
	_jpeg_patch_exif = _asyncToGenerator(function* (env) {
		const data = yield this._getUint8Array(env.blob);
		env.is_jpeg = is_jpeg(data);
		if (!env.is_jpeg) return env;
		env.orig_blob = env.blob;
		try {
			let exif_is_big_endian;
			let orientation_offset;
			jpeg_exif_tags_each(data, function(entry) {
				if (entry.ifd === 0 && entry.tag === 274 && Array.isArray(entry.value)) {
					env.orientation = entry.value[0] || 1;
					exif_is_big_endian = entry.is_big_endian;
					orientation_offset = entry.data_offset;
					return false;
				}
			});
			if (orientation_offset) {
				const orientation_patch = exif_is_big_endian ? new Uint8Array([0, 1]) : new Uint8Array([1, 0]);
				env.blob = new Blob([
					data.slice(0, orientation_offset),
					orientation_patch,
					data.slice(orientation_offset + 2)
				], { type: "image/jpeg" });
			}
		} catch (_) {}
		return env;
	});
	return _jpeg_patch_exif.apply(this, arguments);
}
function jpeg_rotate_canvas(_x2) {
	return _jpeg_rotate_canvas.apply(this, arguments);
}
function _jpeg_rotate_canvas() {
	_jpeg_rotate_canvas = _asyncToGenerator(function* (env) {
		if (!env.is_jpeg) return env;
		const orientation = (env.orientation || 1) - 1;
		if (!orientation) return env;
		let canvas;
		if (orientation & 4) canvas = this.pica.createCanvas(env.out_canvas.height, env.out_canvas.width);
		else canvas = this.pica.createCanvas(env.out_canvas.width, env.out_canvas.height);
		const ctx = canvas.getContext("2d");
		ctx.save();
		if (orientation & 1) ctx.transform(-1, 0, 0, 1, canvas.width, 0);
		if (orientation & 2) ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height);
		if (orientation & 4) ctx.transform(0, 1, 1, 0, 0, 0);
		ctx.drawImage(env.out_canvas, 0, 0);
		ctx.restore();
		env.out_canvas.width = env.out_canvas.height = 0;
		env.out_canvas = canvas;
		return env;
	});
	return _jpeg_rotate_canvas.apply(this, arguments);
}
function jpeg_attach_orig_segments(_x3) {
	return _jpeg_attach_orig_segments.apply(this, arguments);
}
function _jpeg_attach_orig_segments() {
	_jpeg_attach_orig_segments = _asyncToGenerator(function* (env) {
		if (!env.is_jpeg) return env;
		const [data, data_out] = yield Promise.all([this._getUint8Array(env.blob), this._getUint8Array(env.out_blob)]);
		if (!is_jpeg(data)) return env;
		const segments = [];
		jpeg_segments_each(data, function(segment) {
			if (segment.code === 218) return false;
			segments.push(segment);
		});
		const segment_data = segments.filter(function(segment) {
			if (segment.code === 226) return false;
			if (segment.code >= 224 && segment.code < 240) return true;
			if (segment.code === 254) return true;
			return false;
		}).map(function(segment) {
			return data.slice(segment.offset, segment.offset + segment.length);
		});
		env.out_blob = new Blob([data_out.slice(0, 2)].concat(segment_data).concat([data_out.slice(20)]), { type: "image/jpeg" });
		return env;
	});
	return _jpeg_attach_orig_segments.apply(this, arguments);
}
function assign(reducer) {
	reducer.before("_blob_to_image", jpeg_patch_exif);
	reducer.after("_transform", jpeg_rotate_canvas);
	reducer.after("_create_blob", jpeg_attach_orig_segments);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectSpread2.js
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (e.includes(n)) continue;
		t[n] = r[n];
	}
	return t;
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutProperties.js
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var s = Object.getOwnPropertySymbols(e);
		for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
//#endregion
//#region src/index.ts
var _excluded = ["max"];
var ImageBlobReduce = class {
	constructor(options) {
		_defineProperty(this, "pica", void 0);
		_defineProperty(this, "initialized", void 0);
		_defineProperty(this, "_initPromise", void 0);
		options = options || {};
		this.pica = options.pica || (0, pica.default)({});
		this.initialized = false;
	}
	use(plugin, ...params) {
		plugin(this, ...params);
		return this;
	}
	setup() {
		this.use(assign);
	}
	_ensureInitialized() {
		var _this = this;
		return _asyncToGenerator(function* () {
			if (!_this._initPromise) _this._initPromise = Promise.resolve().then(_asyncToGenerator(function* () {
				_this.setup();
				yield _this.pica.init();
				_this.initialized = true;
			}));
			return _this._initPromise;
		})();
	}
	toBlob(blob, options) {
		var _this2 = this;
		return _asyncToGenerator(function* () {
			let env = {
				blob,
				opts: _objectSpread2({ max: Infinity }, options)
			};
			yield _this2._ensureInitialized();
			env = yield _this2._blob_to_image(env);
			env = yield _this2._calculate_size(env);
			env = yield _this2._transform(env);
			env = yield _this2._cleanup(env);
			env = yield _this2._create_blob(env);
			env.out_canvas.width = env.out_canvas.height = 0;
			return env.out_blob;
		})();
	}
	toCanvas(blob, options) {
		var _this3 = this;
		return _asyncToGenerator(function* () {
			let env = {
				blob,
				opts: _objectSpread2({ max: Infinity }, options)
			};
			yield _this3._ensureInitialized();
			env = yield _this3._blob_to_image(env);
			env = yield _this3._calculate_size(env);
			env = yield _this3._transform(env);
			env = yield _this3._cleanup(env);
			return env.out_canvas;
		})();
	}
	before(method_name, fn) {
		var _this4 = this;
		if (!this[method_name]) throw new Error("Method \"" + method_name + "\" does not exist");
		if (typeof fn !== "function") throw new Error("Invalid argument \"fn\", function expected");
		const old_fn = this[method_name];
		this[method_name] = function() {
			var _ref = _asyncToGenerator(function* (env) {
				const _env = yield fn.call(_this4, env);
				return old_fn.call(_this4, _env);
			});
			return function(_x) {
				return _ref.apply(this, arguments);
			};
		}();
		return this;
	}
	after(method_name, fn) {
		var _this5 = this;
		if (!this[method_name]) throw new Error("Method \"" + method_name + "\" does not exist");
		if (typeof fn !== "function") throw new Error("Invalid argument \"fn\", function expected");
		const old_fn = this[method_name];
		this[method_name] = function() {
			var _ref2 = _asyncToGenerator(function* (env) {
				const _env = yield old_fn.call(_this5, env);
				return fn.call(_this5, _env);
			});
			return function(_x2) {
				return _ref2.apply(this, arguments);
			};
		}();
		return this;
	}
	_blob_to_image(env) {
		const win = window;
		const URL = win.URL || win.webkitURL || win.mozURL || win.msURL;
		env.image = document.createElement("img");
		env.image_url = URL.createObjectURL(env.blob);
		env.image.src = env.image_url;
		return new Promise(function(resolve, reject) {
			env.image.onerror = function() {
				reject(/* @__PURE__ */ new Error("ImageBlobReduce: failed to create Image() from blob"));
			};
			env.image.onload = function() {
				resolve(env);
			};
		});
	}
	_calculate_size(env) {
		return _asyncToGenerator(function* () {
			let scale_factor = env.opts.max / Math.max(env.image.width, env.image.height);
			if (scale_factor > 1) scale_factor = 1;
			env.transform_width = Math.max(Math.round(env.image.width * scale_factor), 1);
			env.transform_height = Math.max(Math.round(env.image.height * scale_factor), 1);
			env.scale_factor = scale_factor;
			return env;
		})();
	}
	_transform(env) {
		var _this6 = this;
		return _asyncToGenerator(function* () {
			env.out_canvas = _this6.pica.createCanvas(env.transform_width, env.transform_height);
			env.transform_width = null;
			env.transform_height = null;
			const _env$opts = env.opts, { max } = _env$opts, pica_opts = _objectWithoutProperties(_env$opts, _excluded);
			yield _this6.pica.resize(env.image, env.out_canvas, pica_opts);
			return env;
		})();
	}
	_cleanup(env) {
		return _asyncToGenerator(function* () {
			env.image.src = "";
			env.image = null;
			const win = window;
			const URL = win.URL || win.webkitURL || win.mozURL || win.msURL;
			if (URL.revokeObjectURL) URL.revokeObjectURL(env.image_url);
			env.image_url = null;
			return env;
		})();
	}
	_create_blob(env) {
		var _this7 = this;
		return _asyncToGenerator(function* () {
			env.out_blob = yield _this7.pica.toBlob(env.out_canvas, env.blob.type);
			return env;
		})();
	}
	_getUint8Array(blob) {
		return _asyncToGenerator(function* () {
			if (blob.arrayBuffer) return new Uint8Array(yield blob.arrayBuffer());
			return new Promise(function(resolve, reject) {
				const fr = new FileReader();
				fr.readAsArrayBuffer(blob);
				fr.onload = function() {
					resolve(new Uint8Array(fr.result));
				};
				fr.onerror = function() {
					reject(/* @__PURE__ */ new Error("ImageBlobReduce: failed to load data from input blob"));
					fr.abort();
				};
				fr.onabort = function() {
					reject(/* @__PURE__ */ new Error("ImageBlobReduce: failed to load data from input blob (aborted)"));
				};
			});
		})();
	}
};
function imageBlobReduce(options) {
	return new ImageBlobReduce(options);
}
//#endregion
//#region src/index_cjs_proxy.ts
var imageBlobReduceWithStatic = imageBlobReduce;
imageBlobReduceWithStatic.ImageBlobReduce = ImageBlobReduce;
imageBlobReduceWithStatic.image_traverse = image_traverse_exports;
imageBlobReduceWithStatic.pica = pica.default;
imageBlobReduceWithStatic.Pica = pica.Pica;
//#endregion
module.exports = imageBlobReduceWithStatic;

//# sourceMappingURL=image-blob-reduce.js.map