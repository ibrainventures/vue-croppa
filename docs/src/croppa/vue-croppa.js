/*
 * vue-croppa v1.3.8
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2021 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var canvasExifOrientation = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  parseDataUrl: function parseDataUrl(url) {
    var reg = /^data:([^;]+)?(;base64)?,(.*)/gmi;
    return reg.exec(url)[3];
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = canvasExifOrientation.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableExifAutoOrientation: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  },
  autoSizing: Boolean,
  videoEnabled: Boolean
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE_EVENT: 'new-image',
  NEW_IMAGE_DRAWN_EVENT: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW_EVENT: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START_EVENT: 'loading-start',
  LOADING_END_EVENT: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
// const DEFAULT_PLACEHOLDER_TAKEUP = 1 / 1 // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs, false)), _vm._v(" "), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._v(" "), _vm._t("placeholder")], 2), _vm._v(" "), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleClick($event);
        }, "dblclick": function dblclick($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handleDblClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();return _vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();return _vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();return _vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();return _vm._handleWheel($event);
        } } }), _vm._v(" "), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm._v(" "), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      video: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      _loading: false,
      realWidth: 0, // only for when autoSizing is on
      realHeight: 0, // only for when autoSizing is on
      chosenFile: null,
      useAutoSizing: false
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      var w = this.useAutoSizing ? this.realWidth : this.width;
      return w * this.quality;
    },
    outputHeight: function outputHeight() {
      var h = this.useAutoSizing ? this.realHeight : this.height;
      return h * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    },


    loading: {
      get: function get$$1() {
        return this._loading;
      },
      set: function set$$1(newValue) {
        var oldValue = this._loading;
        this._loading = newValue;
        if (oldValue != newValue) {
          if (this.passive) return;
          if (newValue) {
            this.emitEvent(events.LOADING_START_EVENT);
          } else {
            this.emitEvent(events.LOADING_END_EVENT);
          }
        }
      }
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      // console.warn('Your browser does not support vue-croppa functionality.')
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }

    this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
    if (this.useAutoSizing) {
      this._autoSizingInit();
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.useAutoSizing) {
      this._autoSizingRemove();
    }
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    outputHeight: function outputHeight() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.emitEvent(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    autoSizing: function autoSizing(val) {
      this.useAutoSizing = !!(this.autoSizing && this.$refs.wrapper && getComputedStyle);
      if (val) {
        this._autoSizingInit();
      } else {
        this._autoSizingRemove();
      }
    }
  },

  methods: {
    emitEvent: function emitEvent() {
      // console.log(args[0])
      this.$emit.apply(this, arguments);
    },
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.chosenFile || this.$refs.fileInput.files[0];
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.emitEvent(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      // when a new image is loaded with the same aspect ratio
      // as the previously remove()d one, the imgData.width and .height
      // effectivelly don't change (they change through one tick
      // and end up being the same as before the tick, so the
      // watchers don't trigger), make sure scaleRatio isn't null so
      // that zooming works...
      if (this.scaleRatio === null) {
        this.scaleRatio = this.imgData.width / this.naturalWidth;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        // console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.')
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadataWithPixelDensity: function applyMetadataWithPixelDensity(metadata) {
      if (metadata) {
        var storedPixelDensity = metadata.pixelDensity || 1;
        var currentPixelDensity = this.quality;
        var pixelDensityDiff = currentPixelDensity / storedPixelDensity;
        metadata.startX = metadata.startX * pixelDensityDiff;
        metadata.startY = metadata.startY * pixelDensityDiff;
        metadata.scale = metadata.scale * pixelDensityDiff;

        this.applyMetadata(metadata);
      }
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        // console.warn('No Promise support. Please add Promise polyfill if you want to use this method.')
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    getMetadataWithPixelDensity: function getMetadataWithPixelDensity() {
      var metadata = this.getMetadata();
      if (metadata) {
        metadata.pixelDensity = this.quality;
      }
      return metadata;
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      var keepChosenFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.imageSet) return;
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      if (!keepChosenFile) {
        this.$refs.fileInput.value = '';
        this.chosenFile = null;
      }
      if (this.video) {
        this.video.pause();
        this.video = null;
      }

      if (hadImage) {
        this.emitEvent(events.IMAGE_REMOVE_EVENT);
      }
    },
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
      }
    },
    emitNativeEvent: function emitNativeEvent(evt) {
      this.emitEvent(evt.type, evt);
    },
    setFile: function setFile(file) {
      this._onNewFileIn(file);
    },
    _setContainerSize: function _setContainerSize() {
      if (this.useAutoSizing) {
        this.realWidth = +getComputedStyle(this.$refs.wrapper).width.slice(0, -2);
        this.realHeight = +getComputedStyle(this.$refs.wrapper).height.slice(0, -2);
      }
    },
    _autoSizingInit: function _autoSizingInit() {
      this._setContainerSize();
      window.addEventListener('resize', this._setContainerSize);
    },
    _autoSizingRemove: function _autoSizingRemove() {
      this._setContainerSize();
      window.removeEventListener('resize', this._setContainerSize);
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      this.ctx.imageSmoothingEnabled = true;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imageSet = false;
      this.chosenFile = null;
      this._setInitial();
      if (!this.passive) {
        this.emitEvent(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = (this.useAutoSizing ? this.realWidth : this.width) + 'px';
      this.canvas.style.height = (this.useAutoSizing ? this.realHeight : this.height) + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      var _this4 = this;

      this.$nextTick(function () {
        _this4._paintBackground();
      });
      // this._paintBackground()
      this.$nextTick(function () {
        _this4._setImagePlaceholder();
      });
      this.$nextTick(function () {
        _this4._setTextPlaceholder();
      });
    },
    _setInitial: function _setInitial() {
      var _this5 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;

      var onError = function onError() {
        _this5._setPlaceholders();
        _this5.loading = false;
      };
      this.loading = true;
      if (img.complete) {
        if (u.imageLoaded(img)) {
          // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
          this._onload(img, +img.dataset['exifOrientation'], true);
        } else {
          onError();
        }
      } else {
        this.loading = true;
        img.onload = function () {
          // this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT)
          _this5._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          onError();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      if (this.imageSet) {
        this.remove(true);
      }
      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.emitEvent(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _onVideoLoad: function _onVideoLoad(video, initial) {
      var _this6 = this;

      this.video = video;
      var canvas = document.createElement('canvas');
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      var ctx = canvas.getContext('2d');
      this.loading = false;
      var drawFrame = function drawFrame(initial) {
        if (!_this6.video) return;
        ctx.drawImage(_this6.video, 0, 0, videoWidth, videoHeight);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        frame.onload = function () {
          _this6.img = frame;
          // this._placeImage()
          if (initial) {
            _this6._placeImage();
          } else {
            _this6._draw();
          }
        };
      };
      drawFrame(true);
      var keepDrawing = function keepDrawing() {
        _this6.$nextTick(function () {
          drawFrame();
          if (!_this6.video || _this6.video.ended || _this6.video.paused) return;
          requestAnimationFrame(keepDrawing);
        });
      };
      this.video.addEventListener('play', function () {
        requestAnimationFrame(keepDrawing);
      });
    },
    _handleClick: function _handleClick(evt) {
      this.emitNativeEvent(evt);
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleDblClick: function _handleDblClick(evt) {
      this.emitNativeEvent(evt);
      if (this.videoEnabled && this.video) {
        if (this.video.paused || this.video.ended) {
          this.video.play();
        } else {
          this.video.pause();
        }
        return;
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this7 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.emitEvent(events.FILE_CHOOSE_EVENT, file);
      this.chosenFile = file;
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_SIZE_EXCEED_EVENT, file);
        return false;
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.emitEvent(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        return false;
      }

      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var base64 = u.parseDataUrl(fileData);
          var isVideo = /^video/.test(file.type);
          if (isVideo) {
            var video = document.createElement('video');
            video.src = fileData;
            fileData = null;
            if (video.readyState >= video.HAVE_FUTURE_DATA) {
              _this7._onVideoLoad(video);
            } else {
              video.addEventListener('canplay', function () {
                // console.log('can play event')
                _this7._onVideoLoad(video);
              }, false);
            }
          } else {
            var orientation = 1;
            try {
              orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
            } catch (err) {}
            if (orientation < 1) orientation = 1;
            var img = new Image();
            img.src = fileData;
            fileData = null;
            img.onload = function () {
              _this7._onload(img, orientation);
              _this7.emitEvent(events.NEW_IMAGE_EVENT);
            };
          }
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      var acceptableMimeType = this.videoEnabled && /^video/.test(file.type) && document.createElement('video').canPlayType(file.type) || /^image/.test(file.type);
      if (!acceptableMimeType) return false;
      if (!this.accept) return true;
      var accept = this.accept;
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
      }
      this._draw();
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        this.imgData.startX = 0;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        this.imgData.startY = 0;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this8 = this;

      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this8.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {
      this.emitNativeEvent(evt);
    },
    _handleDrop: function _handleDrop(evt) {
      this.emitNativeEvent(evt);
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) {
        return;
      }
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this9 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if ((orientation > 1 || useOriginal) && !this.disableExifAutoOrientation) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this9.img = _img;
          _this9._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this10 = this;

      this.$nextTick(function () {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this10._drawFrame);
        } else {
          _this10._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      if (!this.img) return;
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath);
        // this._clip(this._createImageClipPath)
      }

      this.emitEvent(events.DRAW_EVENT, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.emitEvent(events.NEW_IMAGE_DRAWN_EVENT);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
    _createContainerClipPath: function _createContainerClipPath() {
      var _this11 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this11.ctx, 0, 0, _this11.outputWidth, _this11.outputHeight);
        });
      }
    },


    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this12 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this12.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = objectAssign({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XG4gIE51bWJlci5pc0ludGVnZXIgfHxcbiAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXG4gICAgKVxuICB9XG5cbnZhciBpbml0aWFsSW1hZ2VUeXBlID0gU3RyaW5nXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkltYWdlKSB7XG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2YWx1ZTogT2JqZWN0LFxuICB3aWR0aDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMDAsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgIH1cbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xuICB9LFxuICBwbGFjZWhvbGRlckNvbG9yOiB7XG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPj0gMFxuICAgIH1cbiAgfSxcbiAgY2FudmFzQ29sb3I6IHtcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIHF1YWxpdHk6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICB6b29tU3BlZWQ6IHtcbiAgICBkZWZhdWx0OiAzLFxuICAgIHR5cGU6IE51bWJlcixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBhY2NlcHQ6IFN0cmluZyxcbiAgZmlsZVNpemVMaW1pdDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA+PSAwXG4gICAgfVxuICB9LFxuICBkaXNhYmxlZDogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxuICBkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbjogQm9vbGVhbixcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXG4gIGRpc2FibGVSb3RhdGlvbjogQm9vbGVhbixcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXG4gIHNob3dSZW1vdmVCdXR0b246IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3JlZCdcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBpbml0aWFsSW1hZ2U6IGluaXRpYWxJbWFnZVR5cGUsXG4gIGluaXRpYWxTaXplOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXG4gICAgfVxuICB9LFxuICBpbml0aWFsUG9zaXRpb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICB2YXIgdmFsaWRzID0gWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xuICAgICAgICAgIHJldHVybiB2YWxpZHMuaW5kZXhPZih3b3JkKSA+PSAwXG4gICAgICAgIH0pIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXG4gICAgICApXG4gICAgfVxuICB9LFxuICBpbnB1dEF0dHJzOiBPYmplY3QsXG4gIHNob3dMb2FkaW5nOiBCb29sZWFuLFxuICBsb2FkaW5nU2l6ZToge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMFxuICB9LFxuICBsb2FkaW5nQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHJlcGxhY2VEcm9wOiBCb29sZWFuLFxuICBwYXNzaXZlOiBCb29sZWFuLFxuICBpbWFnZUJvcmRlclJhZGl1czoge1xuICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgZGVmYXVsdDogMFxuICB9LFxuICBhdXRvU2l6aW5nOiBCb29sZWFuLFxuICB2aWRlb0VuYWJsZWQ6IEJvb2xlYW4sXG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgTkVXX0lNQUdFX0VWRU5UOiAnbmV3LWltYWdlJyxcbiAgTkVXX0lNQUdFX0RSQVdOX0VWRU5UOiAnbmV3LWltYWdlLWRyYXduJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbScsXG4gIERSQVdfRVZFTlQ6ICdkcmF3JyxcbiAgSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQ6ICdpbml0aWFsLWltYWdlLWxvYWRlZCcsXG4gIExPQURJTkdfU1RBUlRfRVZFTlQ6ICdsb2FkaW5nLXN0YXJ0JyxcbiAgTE9BRElOR19FTkRfRVZFTlQ6ICdsb2FkaW5nLWVuZCdcbn1cbiIsIjx0ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIHJlZj1cIndyYXBwZXJcIlxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtcbiAgICAgIHBhc3NpdmUgPyAnY3JvcHBhLS1wYXNzaXZlJyA6ICcnXG4gICAgfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7XG4gICAgICBkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnXG4gICAgfSAke1xuICAgICAgZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnXG4gICAgfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXG4gICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0xlYXZlXCJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiXG4gID5cbiAgICA8aW5wdXRcbiAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXG4gICAgICByZWY9XCJmaWxlSW5wdXRcIlxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXG4gICAgICBzdHlsZT1cIlxuICAgICAgICBoZWlnaHQ6IDFweDtcbiAgICAgICAgd2lkdGg6IDFweDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC05OTk5OXB4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBcIlxuICAgIC8+XG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCIgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW5cIj5cbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxjYW52YXNcbiAgICAgIHJlZj1cImNhbnZhc1wiXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICA+PC9jYW52YXM+XG4gICAgPHN2Z1xuICAgICAgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxuICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0IC8gNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aCAvIDQwfXB4YFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXG4gICAgICB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGggLyAxMFwiXG4gICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aCAvIDEwXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiXG4gICAgICA+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIlxuICAgID5cbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiIHYtZm9yPVwiaSBpbiAxMlwiIDprZXk9XCJpXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxuICAgICAgICAgIDpzdHlsZT1cInsgYmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3IgfVwiXG4gICAgICAgID48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xuXG5jb25zdCBQQ1RfUEVSX1pPT00gPSAxIC8gMTAwMDAwIC8vIFRoZSBhbW91bnQgb2Ygem9vbWluZyBldmVyeXRpbWUgaXQgaGFwcGVucywgaW4gcGVyY2VudGFnZSBvZiBpbWFnZSB3aWR0aC5cbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBNSU5fV0lEVEggPSAxMCAvLyBUaGUgbWluaW1hbCB3aWR0aCB0aGUgdXNlciBjYW4gem9vbSB0by5cbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cbi8vIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMSAvIDEgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cbmNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcblxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxuLy8gY29uc3QgREVCVUcgPSBmYWxzZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1vZGVsOiB7XG4gICAgcHJvcDogJ3ZhbHVlJyxcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcbiAgfSxcblxuICBwcm9wczogcHJvcHMsXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbnZhczogbnVsbCxcbiAgICAgIGN0eDogbnVsbCxcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXG4gICAgICBpbWc6IG51bGwsXG4gICAgICB2aWRlbzogbnVsbCxcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcbiAgICAgIGltZ0RhdGE6IHtcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICBzdGFydFk6IDBcbiAgICAgIH0sXG4gICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxuICAgICAgdGFiU3RhcnQ6IDAsXG4gICAgICBzY3JvbGxpbmc6IGZhbHNlLFxuICAgICAgcGluY2hpbmc6IGZhbHNlLFxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxuICAgICAgcGluY2hEaXN0YW5jZTogMCxcbiAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxuICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXG4gICAgICBuYXR1cmFsV2lkdGg6IDAsXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxuICAgICAgc2NhbGVSYXRpbzogbnVsbCxcbiAgICAgIG9yaWVudGF0aW9uOiAxLFxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxuICAgICAgaW1hZ2VTZXQ6IGZhbHNlLFxuICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxuICAgICAgX2xvYWRpbmc6IGZhbHNlLFxuICAgICAgcmVhbFdpZHRoOiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cbiAgICAgIHJlYWxIZWlnaHQ6IDAsIC8vIG9ubHkgZm9yIHdoZW4gYXV0b1NpemluZyBpcyBvblxuICAgICAgY2hvc2VuRmlsZTogbnVsbCxcbiAgICAgIHVzZUF1dG9TaXppbmc6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG91dHB1dFdpZHRoICgpIHtcbiAgICAgIGNvbnN0IHcgPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGhcbiAgICAgIHJldHVybiB3ICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIG91dHB1dEhlaWdodCAoKSB7XG4gICAgICBjb25zdCBoID0gdGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsSGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICAgIHJldHVybiBoICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGFzcGVjdFJhdGlvICgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgIH0sXG5cbiAgICBsb2FkaW5nU3R5bGUgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICByaWdodDogJzE1cHgnLFxuICAgICAgICBib3R0b206ICcxMHB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBsb2FkaW5nOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9sb2FkaW5nXG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBuZXdWYWx1ZVxuICAgICAgICBpZiAob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX1NUQVJUX0VWRU5UKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19FTkRfRVZFTlQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgIHUuckFGUG9seWZpbGwoKVxuICAgIHUudG9CbG9iUG9seWZpbGwoKVxuXG4gICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcbiAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcbiAgICAgIHRoaXMuJHdhdGNoKCd2YWx1ZS5fZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBzZXQgPSBmYWxzZVxuICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxuICAgICAgICAgICAgaWYgKHZhbCAhPT0gdGhpc1trZXldKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcbiAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgICBkZWVwOiB0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxuICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdJbml0KClcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xuICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxuICAgIH0sXG4gICAgb3V0cHV0SGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcbiAgICB9LFxuICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuICAgIGltYWdlQm9yZGVyUmFkaXVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2ZW50V2hpdGVTcGFjZSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgfSxcbiAgICBzY2FsZVJhdGlvICh2YWwsIG9sZFZhbCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cblxuICAgICAgdmFyIHggPSAxXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChvbGRWYWwpICYmIG9sZFZhbCAhPT0gMCkge1xuICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXG4gICAgICB9XG4gICAgICB2YXIgcG9zID0gdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkIHx8IHtcbiAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXG4gICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxuICAgICAgfVxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB2YWxcblxuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSAmJiB0aGlzLmltYWdlU2V0ICYmICF0aGlzLnJvdGF0aW5nKSB7XG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UoKVxuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgIH1cbiAgICB9LFxuICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyh2YWwgLSBvbGRWYWwpID4gKHZhbCAqICgxIC8gMTAwMDAwKSkpIHtcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuWk9PTV9FVkVOVClcbiAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuaGVpZ2h0JzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICB9LFxuICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXG4gICAgICB9XG4gICAgfSxcbiAgICBhdXRvU2l6aW5nICh2YWwpIHtcbiAgICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBlbWl0RXZlbnQgKC4uLmFyZ3MpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3NbMF0pXG4gICAgICB0aGlzLiRlbWl0KC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICBnZXRDYW52YXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXG4gICAgfSxcblxuICAgIGdldENvbnRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3R4XG4gICAgfSxcblxuICAgIGdldENob3NlbkZpbGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hvc2VuRmlsZSB8fCB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxuICAgIH0sXG5cbiAgICBtb3ZlIChvZmZzZXQpIHtcbiAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcbiAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5NT1ZFX0VWRU5UKVxuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZURvd253YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXG4gICAgfSxcblxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcbiAgICB9LFxuXG4gICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICB6b29tICh6b29tSW4gPSB0cnVlLCBhY2NlbGVyYXRpb24gPSAxKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxuICAgICAgbGV0IHNwZWVkID0gKHRoaXMub3V0cHV0V2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXG4gICAgICBsZXQgeCA9IDFcbiAgICAgIGlmICh6b29tSW4pIHtcbiAgICAgICAgeCA9IDEgKyBzcGVlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcbiAgICAgICAgeCA9IDEgLSBzcGVlZFxuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIGEgbmV3IGltYWdlIGlzIGxvYWRlZCB3aXRoIHRoZSBzYW1lIGFzcGVjdCByYXRpb1xuICAgICAgLy8gYXMgdGhlIHByZXZpb3VzbHkgcmVtb3ZlKClkIG9uZSwgdGhlIGltZ0RhdGEud2lkdGggYW5kIC5oZWlnaHRcbiAgICAgIC8vIGVmZmVjdGl2ZWxseSBkb24ndCBjaGFuZ2UgKHRoZXkgY2hhbmdlIHRocm91Z2ggb25lIHRpY2tcbiAgICAgIC8vIGFuZCBlbmQgdXAgYmVpbmcgdGhlIHNhbWUgYXMgYmVmb3JlIHRoZSB0aWNrLCBzbyB0aGVcbiAgICAgIC8vIHdhdGNoZXJzIGRvbid0IHRyaWdnZXIpLCBtYWtlIHN1cmUgc2NhbGVSYXRpbyBpc24ndCBudWxsIHNvXG4gICAgICAvLyB0aGF0IHpvb21pbmcgd29ya3MuLi5cbiAgICAgIGlmICh0aGlzLnNjYWxlUmF0aW8gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5pbWdEYXRhLndpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcbiAgICB9LFxuXG4gICAgem9vbUluICgpIHtcbiAgICAgIHRoaXMuem9vbSh0cnVlKVxuICAgIH0sXG5cbiAgICB6b29tT3V0ICgpIHtcbiAgICAgIHRoaXMuem9vbShmYWxzZSlcbiAgICB9LFxuXG4gICAgcm90YXRlIChzdGVwID0gMSkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxuICAgICAgaWYgKGlzTmFOKHN0ZXApIHx8IHN0ZXAgPiAzIHx8IHN0ZXAgPCAtMykge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXG4gICAgICAgIHN0ZXAgPSAxXG4gICAgICB9XG4gICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcbiAgICB9LFxuXG4gICAgZmxpcFggKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDIpXG4gICAgfSxcblxuICAgIGZsaXBZICgpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxuICAgIH0sXG5cbiAgICByZWZyZXNoICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2luaXRpYWxpemUpXG4gICAgfSxcblxuICAgIGhhc0ltYWdlICgpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuaW1hZ2VTZXRcbiAgICB9LFxuICAgIGFwcGx5TWV0YWRhdGFXaXRoUGl4ZWxEZW5zaXR5IChtZXRhZGF0YSkge1xuICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgIGxldCBzdG9yZWRQaXhlbERlbnNpdHkgPSBtZXRhZGF0YS5waXhlbERlbnNpdHkgfHwgMVxuICAgICAgICBsZXQgY3VycmVudFBpeGVsRGVuc2l0eSA9IHRoaXMucXVhbGl0eVxuICAgICAgICBsZXQgcGl4ZWxEZW5zaXR5RGlmZiA9IGN1cnJlbnRQaXhlbERlbnNpdHkgLyBzdG9yZWRQaXhlbERlbnNpdHlcbiAgICAgICAgbWV0YWRhdGEuc3RhcnRYID0gbWV0YWRhdGEuc3RhcnRYICogcGl4ZWxEZW5zaXR5RGlmZlxuICAgICAgICBtZXRhZGF0YS5zdGFydFkgPSBtZXRhZGF0YS5zdGFydFkgKiBwaXhlbERlbnNpdHlEaWZmXG4gICAgICAgIG1ldGFkYXRhLnNjYWxlID0gbWV0YWRhdGEuc2NhbGUgKiBwaXhlbERlbnNpdHlEaWZmXG5cbiAgICAgICAgdGhpcy5hcHBseU1ldGFkYXRhKG1ldGFkYXRhKVxuICAgICAgfVxuICAgIH0sXG4gICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcbiAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbWV0YWRhdGFcbiAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcbiAgICB9LFxuICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSlcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXG4gICAgfSxcblxuICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xuICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxuICAgICAgICAgIH0sIC4uLmFyZ3MpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXG4gICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhV2l0aFBpeGVsRGVuc2l0eSAoKSB7XG4gICAgICBsZXQgbWV0YWRhdGEgPSB0aGlzLmdldE1ldGFkYXRhKClcbiAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICBtZXRhZGF0YS5waXhlbERlbnNpdHkgPSB0aGlzLnF1YWxpdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZXRhZGF0YVxuICAgIH0sXG5cbiAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxuICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNob29zZUZpbGUgKCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXG4gICAgfSxcblxuICAgIHJlbW92ZSAoa2VlcENob3NlbkZpbGUgPSBmYWxzZSkge1xuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSByZXR1cm5cbiAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG5cbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy5pbWdEYXRhID0ge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMFxuICAgICAgfVxuICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICBpZiAoIWtlZXBDaG9zZW5GaWxlKSB7XG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXG4gICAgICAgIHRoaXMudmlkZW8gPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmIChoYWRJbWFnZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRDbGlwUGx1Z2luIChwbHVnaW4pIHtcbiAgICAgIGlmICghdGhpcy5jbGlwUGx1Z2lucykge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zID0gW11cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2xpcFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pIDwgMCkge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NsaXAgcGx1Z2lucyBzaG91bGQgYmUgZnVuY3Rpb25zJylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW1pdE5hdGl2ZUV2ZW50IChldnQpIHtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2dC50eXBlLCBldnQpO1xuICAgIH0sXG5cbiAgICBzZXRGaWxlIChmaWxlKSB7XG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfc2V0Q29udGFpbmVyU2l6ZSAoKSB7XG4gICAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICAgIHRoaXMucmVhbFdpZHRoID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS53aWR0aC5zbGljZSgwLCAtMilcbiAgICAgICAgdGhpcy5yZWFsSGVpZ2h0ID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS5oZWlnaHQuc2xpY2UoMCwgLTIpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nSW5pdCAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfYXV0b1NpemluZ1JlbW92ZSAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfaW5pdGlhbGl6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXG4gICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9IFwiaGlnaFwiO1xuICAgICAgdGhpcy5jdHgud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4Lm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXG4gICAgICB0aGlzLmltZyA9IG51bGxcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXG4gICAgICBpZiAoIXRoaXMucGFzc2l2ZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFNpemUgKCkge1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSAodGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsV2lkdGggOiB0aGlzLndpZHRoKSArICdweCdcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodCkgKyAncHgnXG4gICAgfSxcblxuICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcbiAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcbiAgICAgIHN3aXRjaCAoc3RlcCkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA2XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG4gICAgfSxcblxuICAgIF9zZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcbiAgICAgIGxldCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWltZykgcmV0dXJuXG5cbiAgICAgIHZhciBvbkxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuXG4gICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgIG9uTG9hZCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMub3V0cHV0V2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemVcbiAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxuICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMub3V0cHV0V2lkdGggLyAyLCB0aGlzLm91dHB1dEhlaWdodCAvIDIpXG4gICAgfSxcblxuICAgIF9zZXRQbGFjZWhvbGRlcnMgKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4geyB0aGlzLl9wYWludEJhY2tncm91bmQoKSB9KVxuICAgICAgLy8gdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHsgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpIH0pXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7IHRoaXMuX3NldFRleHRQbGFjZWhvbGRlcigpIH0pXG4gICAgfSxcblxuICAgIF9zZXRJbml0aWFsICgpIHtcbiAgICAgIGxldCBzcmMsIGltZ1xuICAgICAgaWYgKHRoaXMuJHNsb3RzLmluaXRpYWwgJiYgdGhpcy4kc2xvdHMuaW5pdGlhbFswXSkge1xuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXG4gICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xuICAgICAgICAgIGltZyA9IGVsbVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBzcmMgPSB0aGlzLmluaXRpYWxJbWFnZVxuICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XG4gICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJylcbiAgICAgICAgfVxuICAgICAgICBpbWcuc3JjID0gc3JjXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ29iamVjdCcgJiYgdGhpcy5pbml0aWFsSW1hZ2UgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxuICAgICAgfVxuICAgICAgaWYgKCFzcmMgJiYgIWltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IHRydWVcblxuICAgICAgbGV0IG9uRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcbiAgICAgICAgICAvLyB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbkVycm9yKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxuICAgICAgICB9XG5cbiAgICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgb25FcnJvcigpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEsIGluaXRpYWwpIHtcbiAgICAgIGlmICh0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcbiAgICAgIHRoaXMuaW1nID0gaW1nXG5cbiAgICAgIGlmIChpc05hTihvcmllbnRhdGlvbikpIHtcbiAgICAgICAgb3JpZW50YXRpb24gPSAxXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxuXG4gICAgICBpZiAoaW5pdGlhbCkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9vblZpZGVvTG9hZCAodmlkZW8sIGluaXRpYWwpIHtcbiAgICAgIHRoaXMudmlkZW8gPSB2aWRlb1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAgIGNvbnN0IHsgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQgfSA9IHZpZGVvXG4gICAgICBjYW52YXMud2lkdGggPSB2aWRlb1dpZHRoXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW9IZWlnaHRcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgY29uc3QgZHJhd0ZyYW1lID0gKGluaXRpYWwpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZpZGVvKSByZXR1cm5cbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnZpZGVvLCAwLCAwLCB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodClcbiAgICAgICAgY29uc3QgZnJhbWUgPSBuZXcgSW1hZ2UoKVxuICAgICAgICBmcmFtZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcbiAgICAgICAgZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW1nID0gZnJhbWVcbiAgICAgICAgICAvLyB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgICAgICBpZiAoaW5pdGlhbCkge1xuICAgICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZHJhd0ZyYW1lKHRydWUpXG4gICAgICBjb25zdCBrZWVwRHJhd2luZyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGRyYXdGcmFtZSgpXG4gICAgICAgICAgaWYgKCF0aGlzLnZpZGVvIHx8IHRoaXMudmlkZW8uZW5kZWQgfHwgdGhpcy52aWRlby5wYXVzZWQpIHJldHVyblxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShrZWVwRHJhd2luZylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2hhbmRsZUNsaWNrIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCAmJiAhdGhpcy5wYXNzaXZlKSB7XG4gICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVEYmxDbGljayAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy52aWRlb0VuYWJsZWQgJiYgdGhpcy52aWRlbykge1xuICAgICAgICBpZiAodGhpcy52aWRlby5wYXVzZWQgfHwgdGhpcy52aWRlby5lbmRlZCkge1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVJbnB1dENoYW5nZSAoKSB7XG4gICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxuICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGggfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cblxuICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxuICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcbiAgICB9LFxuXG4gICAgX29uTmV3RmlsZUluIChmaWxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSBmYWxzZVxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gZmlsZTtcbiAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5fZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXG4gICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcbiAgICAgICAgICBjb25zdCBiYXNlNjQgPSB1LnBhcnNlRGF0YVVybChmaWxlRGF0YSlcbiAgICAgICAgICBjb25zdCBpc1ZpZGVvID0gL152aWRlby8udGVzdChmaWxlLnR5cGUpXG4gICAgICAgICAgaWYgKGlzVmlkZW8pIHtcbiAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcbiAgICAgICAgICAgIHZpZGVvLnNyYyA9IGZpbGVEYXRhXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+PSB2aWRlby5IQVZFX0ZVVFVSRV9EQVRBKSB7XG4gICAgICAgICAgICAgIHRoaXMuX29uVmlkZW9Mb2FkKHZpZGVvKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FuIHBsYXkgZXZlbnQnKVxuICAgICAgICAgICAgICAgIHRoaXMuX29uVmlkZW9Mb2FkKHZpZGVvKVxuICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkpXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uIDwgMSkgb3JpZW50YXRpb24gPSAxXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxuICAgICAgICAgICAgZmlsZURhdGEgPSBudWxsO1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXG4gICAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRVZFTlQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2ZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxuXG4gICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XG4gICAgfSxcblxuICAgIF9maWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcbiAgICAgIGNvbnN0IGFjY2VwdGFibGVNaW1lVHlwZSA9ICh0aGlzLnZpZGVvRW5hYmxlZCAmJiAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSkgJiYgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZShmaWxlLnR5cGUpKSB8fCAvXmltYWdlLy50ZXN0KGZpbGUudHlwZSlcbiAgICAgIGlmICghYWNjZXB0YWJsZU1pbWVUeXBlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICghdGhpcy5hY2NlcHQpIHJldHVybiB0cnVlXG4gICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHRcbiAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXG4gICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cbiAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxuICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XG4gICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xuICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXG4gICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0sXG5cbiAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB2YXIgaW1nRGF0YSA9IHRoaXMuaW1nRGF0YVxuXG4gICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxuICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxuXG4gICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXG4gICAgICBpbWdEYXRhLnN0YXJ0WSA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFkpID8gaW1nRGF0YS5zdGFydFkgOiAwXG5cbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxuICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnY29udGFpbicpIHtcbiAgICAgICAgICB0aGlzLl9hc3BlY3RGaXQoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XG4gICAgICAgICAgdGhpcy5fbmF0dXJhbFNpemUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zY2FsZVJhdGlvXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xuICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9sZWZ0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHRoaXMub3V0cHV0V2lkdGggLSBpbWdEYXRhLndpZHRoXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxuICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxuICAgICAgICAgIHZhciB5ID0gK3Jlc3VsdFsyXSAvIDEwMFxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHkgKiAodGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuX2FwcGx5TWV0YWRhdGEoKVxuXG4gICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XG4gICAgICAgIHRoaXMuem9vbShmYWxzZSwgMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RyYXcoKVxuICAgIH0sXG5cbiAgICBfYXNwZWN0RmlsbCAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICBsZXQgc2NhbGVSYXRpb1xuXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hc3BlY3RGaXQgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgbGV0IHNjYWxlUmF0aW9cbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX25hdHVyYWxTaXplICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXG4gICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxuICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcbiAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcbiAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXG5cbiAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxuICAgICAgfVxuXG4gICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuY2VsRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcbiAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcbiAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXG4gICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXG4gICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXG4gICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxuICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IGNvb3JkXG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUpIHJldHVyblxuXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlKHtcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxuICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcbiAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcbiAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcbiAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlckxlYXZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gbnVsbFxuICAgIH0sXG5cbiAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlXG4gICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XG4gICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXG4gICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xuICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcbiAgICAgIH1cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdFbnRlciAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHJldHVyblxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXG4gICAgfSxcblxuICAgIF9oYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdPdmVyIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyb3AgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXG5cbiAgICAgIGxldCBmaWxlXG4gICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXG4gICAgICBpZiAoIWR0KSByZXR1cm5cbiAgICAgIGlmIChkdC5pdGVtcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXG4gICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vdXRwdXRXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm91dHB1dEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlICgpIHtcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLm91dHB1dFdpZHRoKSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMub3V0cHV0SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0SGVpZ2h0IC8gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb24gPSAxLCBhcHBseU1ldGFkYXRhKSB7XG4gICAgICB2YXIgdXNlT3JpZ2luYWwgPSBhcHBseU1ldGFkYXRhXG4gICAgICBpZiAoKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkgJiYgIXRoaXMuZGlzYWJsZUV4aWZBdXRvT3JpZW50YXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXG4gICAgICAgIC8vIHUuZ2V0Um90YXRlZEltYWdlRGF0YSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgdmFyIF9pbWcgPSB1LmdldFJvdGF0ZWRJbWFnZSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICB9XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XG4gICAgICAgIC8vIGZsaXAgeFxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWCh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XG4gICAgICAgIC8vIGZsaXAgeVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWSh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XG4gICAgICAgIC8vIDkwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XG4gICAgICAgIC8vIDE4MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xuICAgICAgICAvLyAyNzAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cbiAgICAgIH1cblxuICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcGFpbnRCYWNrZ3JvdW5kICgpIHtcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgfSxcblxuICAgIF9kcmF3ICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9kcmF3RnJhbWUgKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVDb250YWluZXJDbGlwUGF0aClcbiAgICAgICAgLy8gdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVJbWFnZUNsaXBQYXRoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRFJBV19FVkVOVCwgY3R4KVxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRFJBV05fRVZFTlQpXG4gICAgICB9XG4gICAgICB0aGlzLnJvdGF0aW5nID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX2NsaXBQYXRoRmFjdG9yeSAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cbiAgICAgICAgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA6XG4gICAgICAgICFpc05hTihOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykpID8gTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpIDogMFxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoICgpIHtcbiAgICAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMuZm9yRWFjaChmdW5jID0+IHtcbiAgICAgICAgICBmdW5jKHRoaXMuY3R4LCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gX2NyZWF0ZUltYWdlQ2xpcFBhdGggKCkge1xuICAgIC8vICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxuICAgIC8vICAgbGV0IHcgPSB3aWR0aFxuICAgIC8vICAgbGV0IGggPSBoZWlnaHRcbiAgICAvLyAgIGxldCB4ID0gc3RhcnRYXG4gICAgLy8gICBsZXQgeSA9IHN0YXJ0WVxuICAgIC8vICAgaWYgKHcgPCBoKSB7XG4gICAgLy8gICAgIGggPSB0aGlzLm91dHB1dEhlaWdodCAqICh3aWR0aCAvIHRoaXMub3V0cHV0V2lkdGgpXG4gICAgLy8gICB9XG4gICAgLy8gICBpZiAoaCA8IHcpIHtcbiAgICAvLyAgICAgdyA9IHRoaXMub3V0cHV0V2lkdGggKiAoaGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgLy8gICAgIHggPSBzdGFydFggKyAod2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAvLyAgIH1cbiAgICAvLyAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSh4LCBzdGFydFksIHcsIGgpXG4gICAgLy8gfSxcblxuICAgIF9jbGlwIChjcmVhdGVQYXRoKSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC5zYXZlKClcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcbiAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXG4gICAgICBjcmVhdGVQYXRoKClcbiAgICAgIGN0eC5maWxsKClcbiAgICAgIGN0eC5yZXN0b3JlKClcbiAgICB9LFxuXG4gICAgX2FwcGx5TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXG4gICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WCkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcbiAgICAgIH1cblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cbi5jcm9wcGEtY29udGFpbmVyXG4gIGRpc3BsYXkgaW5saW5lLWJsb2NrXG4gIGN1cnNvciBwb2ludGVyXG4gIHRyYW5zaXRpb24gYWxsIDAuM3NcbiAgcG9zaXRpb24gcmVsYXRpdmVcbiAgZm9udC1zaXplIDBcbiAgYWxpZ24tc2VsZiBmbGV4LXN0YXJ0XG4gIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxuXG4gIGNhbnZhc1xuICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcblxuICAmOmhvdmVyXG4gICAgb3BhY2l0eSAwLjdcblxuICAmLmNyb3BwYS0tZHJvcHpvbmVcbiAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxuXG4gICAgY2FudmFzXG4gICAgICBvcGFjaXR5IDAuNVxuXG4gICYuY3JvcHBhLS1kaXNhYmxlZC1jY1xuICAgIGN1cnNvciBkZWZhdWx0XG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAmLmNyb3BwYS0taGFzLXRhcmdldFxuICAgIGN1cnNvciBtb3ZlXG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxuICAgICAgY3Vyc29yIGRlZmF1bHRcblxuICAmLmNyb3BwYS0tZGlzYWJsZWRcbiAgICBjdXJzb3Igbm90LWFsbG93ZWRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICYuY3JvcHBhLS1wYXNzaXZlXG4gICAgY3Vyc29yIGRlZmF1bHRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gIHN2Zy5pY29uLXJlbW92ZVxuICAgIHBvc2l0aW9uIGFic29sdXRlXG4gICAgYmFja2dyb3VuZCB3aGl0ZVxuICAgIGJvcmRlci1yYWRpdXMgNTAlXG4gICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXG4gICAgei1pbmRleCAxMFxuICAgIGN1cnNvciBwb2ludGVyXG4gICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxuPC9zdHlsZT5cblxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xuLnNrLWZhZGluZy1jaXJjbGUge1xuICAkY2lyY2xlQ291bnQ6IDEyO1xuICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xuXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAuc2stY2lyY2xlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgdG9wOiAwO1xuICB9XG5cbiAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgd2lkdGg6IDE1JTtcbiAgICBoZWlnaHQ6IDE1JTtcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xuICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSB7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcgLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKSk7XG4gICAgfVxuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgICBhbmltYXRpb24tZGVsYXk6IC0kYW5pbWF0aW9uRHVyYXRpb24gK1xuICAgICAgICAkYW5pbWF0aW9uRHVyYXRpb24gL1xuICAgICAgICAkY2lyY2xlQ291bnQgKlxuICAgICAgICAoJGkgLSAxKTtcbiAgICB9XG4gIH1cbn1cbkBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcbiAgMCUsXG4gIDM5JSxcbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICA0MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cbjwvc3R5bGU+XG5cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsInVybCIsInJlZyIsImV4ZWMiLCJiYXNlNjQiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwidyIsInVzZUF1dG9TaXppbmciLCJyZWFsV2lkdGgiLCJ3aWR0aCIsImgiLCJyZWFsSGVpZ2h0IiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIm5hdHVyYWxIZWlnaHQiLCJsb2FkaW5nU2l6ZSIsIl9sb2FkaW5nIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsInBhc3NpdmUiLCJlbWl0RXZlbnQiLCJMT0FESU5HX1NUQVJUX0VWRU5UIiwiTE9BRElOR19FTkRfRVZFTlQiLCJfaW5pdGlhbGl6ZSIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJhdXRvU2l6aW5nIiwiJHJlZnMiLCJ3cmFwcGVyIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIl9hdXRvU2l6aW5nSW5pdCIsIl9hdXRvU2l6aW5nUmVtb3ZlIiwib25EaW1lbnNpb25DaGFuZ2UiLCJfc2V0UGxhY2Vob2xkZXJzIiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwidXNlck1ldGFkYXRhIiwicm90YXRpbmciLCJvZmZzZXRYIiwib2Zmc2V0WSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlIiwiX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCJaT09NX0VWRU5UIiwiJGVtaXQiLCJjdHgiLCJjaG9zZW5GaWxlIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbUluIiwiYWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvdXRwdXRXaWR0aCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsInN0b3JlZFBpeGVsRGVuc2l0eSIsInBpeGVsRGVuc2l0eSIsImN1cnJlbnRQaXhlbERlbnNpdHkiLCJwaXhlbERlbnNpdHlEaWZmIiwic2NhbGUiLCJhcHBseU1ldGFkYXRhIiwiY29tcHJlc3Npb25SYXRlIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJnZW5lcmF0ZUJsb2IiLCJibG9iIiwiZXJyIiwiZ2V0TWV0YWRhdGEiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwia2VlcENob3NlbkZpbGUiLCJoYWRJbWFnZSIsIm9yaWdpbmFsSW1hZ2UiLCJ2aWRlbyIsInBhdXNlIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwicGx1Z2luIiwiY2xpcFBsdWdpbnMiLCJwdXNoIiwiRXJyb3IiLCJmaWxlIiwiX29uTmV3RmlsZUluIiwic2xpY2UiLCJfc2V0Q29udGFpbmVyU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3NldFNpemUiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiZ2V0Q29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsImltYWdlU21vb3RoaW5nUXVhbGl0eSIsIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiX3NldEluaXRpYWwiLCJvdXRwdXRIZWlnaHQiLCIkc2xvdHMiLCJwbGFjZWhvbGRlciIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJmb250U2l6ZSIsImNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJfc2V0VGV4dFBsYWNlaG9sZGVyIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJjdXJyZW50SXNJbml0aWFsIiwib25FcnJvciIsImxvYWRpbmciLCJfb25sb2FkIiwiZGF0YXNldCIsIm9uZXJyb3IiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsInZpZGVvV2lkdGgiLCJ2aWRlb0hlaWdodCIsImRyYXdGcmFtZSIsImZyYW1lIiwia2VlcERyYXdpbmciLCJlbmRlZCIsInBhdXNlZCIsImVtaXROYXRpdmVFdmVudCIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiY2hvb3NlRmlsZSIsInZpZGVvRW5hYmxlZCIsInBsYXkiLCJpbnB1dCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiX2ZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJfZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJwYXJzZURhdGFVcmwiLCJpc1ZpZGVvIiwicmVhZHlTdGF0ZSIsIkhBVkVfRlVUVVJFX0RBVEEiLCJfb25WaWRlb0xvYWQiLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFX0VWRU5UIiwicmVhZEFzRGF0YVVSTCIsImZpbGVTaXplTGltaXQiLCJzaXplIiwiYWNjZXB0YWJsZU1pbWVUeXBlIiwiY2FuUGxheVR5cGUiLCJhY2NlcHQiLCJiYXNlTWltZXR5cGUiLCJyZXBsYWNlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJmaWxlQmFzZVR5cGUiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsIl9hcHBseU1ldGFkYXRhIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjYW52YXNSYXRpbyIsImFzcGVjdFJhdGlvIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsInNjcm9sbGluZyIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwicmVwbGFjZURyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbiIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIl9jbGlwIiwiX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoIiwiRFJBV19FVkVOVCIsIk5FV19JTUFHRV9EUkFXTl9FVkVOVCIsInJhZGl1cyIsImltYWdlQm9yZGVyUmFkaXVzIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwicXVhZHJhdGljQ3VydmVUbyIsImNsb3NlUGF0aCIsIl9jbGlwUGF0aEZhY3RvcnkiLCJmb3JFYWNoIiwiY3JlYXRlUGF0aCIsInNhdmUiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJmaWxsIiwicmVzdG9yZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxN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
