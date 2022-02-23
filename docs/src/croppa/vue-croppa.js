/*
 * vue-croppa v1.3.8
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2022 zhanziyang
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

    var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];

    var _loop = function _loop(i, len) {
      var e = cancelEvents[i];
      document.addEventListener(e, _this._handlePointerEnd);
      _this.$on('hook:beforeDestroy', function () {
        document.removeEventListener(e, _this._handlePointerEnd);
      });
    };

    for (var i = 0, len = cancelEvents.length; i < len; i++) {
      _loop(i, len);
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
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

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
        _this4._setPlaceholders();
        _this4.loading = false;
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
          _this4._onload(img, +img.dataset['exifOrientation'], true);
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
      var _this5 = this;

      this.video = video;
      var canvas = document.createElement('canvas');
      var videoWidth = video.videoWidth,
          videoHeight = video.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      var ctx = canvas.getContext('2d');
      this.loading = false;
      var drawFrame = function drawFrame(initial) {
        if (!_this5.video) return;
        ctx.drawImage(_this5.video, 0, 0, videoWidth, videoHeight);
        var frame = new Image();
        frame.src = canvas.toDataURL();
        frame.onload = function () {
          _this5.img = frame;
          // this._placeImage()
          if (initial) {
            _this5._placeImage();
          } else {
            _this5._draw();
          }
        };
      };
      drawFrame(true);
      var keepDrawing = function keepDrawing() {
        _this5.$nextTick(function () {
          drawFrame();
          if (!_this5.video || _this5.video.ended || _this5.video.paused) return;
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
      var _this6 = this;

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
              _this6._onVideoLoad(video);
            } else {
              video.addEventListener('canplay', function () {
                // console.log('can play event')
                _this6._onVideoLoad(video);
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
              _this6._onload(img, orientation);
              _this6.emitEvent(events.NEW_IMAGE_EVENT);
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

      // let cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel']
      // for (let i = 0, len = cancelEvents.length; i < len; i++) {
      //   let e = cancelEvents[i]
      //   document.addEventListener(e, this._handlePointerEnd)
      //   this.$on('hook:beforeDestroy', () => {
      //     document.removeEventListener(e, this._handlePointerEnd)
      //   })
      // }
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
      var _this7 = this;

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
        _this7.scrolling = false;
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
      var _this8 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if ((orientation > 1 || useOriginal) && !this.disableExifAutoOrientation) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this8.img = _img;
          _this8._placeImage(applyMetadata);
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
      var _this9 = this;

      this.$nextTick(function () {
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this9._drawFrame);
        } else {
          _this9._drawFrame();
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
      var _this10 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this10.ctx, 0, 0, _this10.outputWidth, _this10.outputHeight);
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
      var _this11 = this;

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
        _this11.userMetadata = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XG4gIE51bWJlci5pc0ludGVnZXIgfHxcbiAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXG4gICAgKVxuICB9XG5cbnZhciBpbml0aWFsSW1hZ2VUeXBlID0gU3RyaW5nXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkltYWdlKSB7XG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2YWx1ZTogT2JqZWN0LFxuICB3aWR0aDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMDAsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgIH1cbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xuICB9LFxuICBwbGFjZWhvbGRlckNvbG9yOiB7XG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPj0gMFxuICAgIH1cbiAgfSxcbiAgY2FudmFzQ29sb3I6IHtcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIHF1YWxpdHk6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICB6b29tU3BlZWQ6IHtcbiAgICBkZWZhdWx0OiAzLFxuICAgIHR5cGU6IE51bWJlcixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBhY2NlcHQ6IFN0cmluZyxcbiAgZmlsZVNpemVMaW1pdDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA+PSAwXG4gICAgfVxuICB9LFxuICBkaXNhYmxlZDogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxuICBkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbjogQm9vbGVhbixcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXG4gIGRpc2FibGVSb3RhdGlvbjogQm9vbGVhbixcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXG4gIHNob3dSZW1vdmVCdXR0b246IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3JlZCdcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBpbml0aWFsSW1hZ2U6IGluaXRpYWxJbWFnZVR5cGUsXG4gIGluaXRpYWxTaXplOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXG4gICAgfVxuICB9LFxuICBpbml0aWFsUG9zaXRpb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICB2YXIgdmFsaWRzID0gWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xuICAgICAgICAgIHJldHVybiB2YWxpZHMuaW5kZXhPZih3b3JkKSA+PSAwXG4gICAgICAgIH0pIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXG4gICAgICApXG4gICAgfVxuICB9LFxuICBpbnB1dEF0dHJzOiBPYmplY3QsXG4gIHNob3dMb2FkaW5nOiBCb29sZWFuLFxuICBsb2FkaW5nU2l6ZToge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMFxuICB9LFxuICBsb2FkaW5nQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHJlcGxhY2VEcm9wOiBCb29sZWFuLFxuICBwYXNzaXZlOiBCb29sZWFuLFxuICBpbWFnZUJvcmRlclJhZGl1czoge1xuICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgZGVmYXVsdDogMFxuICB9LFxuICBhdXRvU2l6aW5nOiBCb29sZWFuLFxuICB2aWRlb0VuYWJsZWQ6IEJvb2xlYW4sXG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgTkVXX0lNQUdFX0VWRU5UOiAnbmV3LWltYWdlJyxcbiAgTkVXX0lNQUdFX0RSQVdOX0VWRU5UOiAnbmV3LWltYWdlLWRyYXduJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbScsXG4gIERSQVdfRVZFTlQ6ICdkcmF3JyxcbiAgSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQ6ICdpbml0aWFsLWltYWdlLWxvYWRlZCcsXG4gIExPQURJTkdfU1RBUlRfRVZFTlQ6ICdsb2FkaW5nLXN0YXJ0JyxcbiAgTE9BRElOR19FTkRfRVZFTlQ6ICdsb2FkaW5nLWVuZCdcbn1cbiIsIjx0ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIHJlZj1cIndyYXBwZXJcIlxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtwYXNzaXZlID8gJ2Nyb3BwYS0tcGFzc2l2ZScgOiAnJ30gJHtcbiAgICAgIGRpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJydcbiAgICB9ICR7ZGlzYWJsZUNsaWNrVG9DaG9vc2UgPyAnY3JvcHBhLS1kaXNhYmxlZC1jYycgOiAnJ30gJHtcbiAgICAgIGRpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ1xuICAgIH0gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcbiAgICBAZHJhZ2VudGVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnRW50ZXJcIlxuICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdMZWF2ZVwiXG4gICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXG4gICAgQGRyb3Auc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyb3BcIlxuICA+XG4gICAgPGlucHV0XG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgIHYtYmluZD1cImlucHV0QXR0cnNcIlxuICAgICAgcmVmPVwiZmlsZUlucHV0XCJcbiAgICAgIEBjaGFuZ2U9XCJfaGFuZGxlSW5wdXRDaGFuZ2VcIlxuICAgICAgc3R5bGU9XCJoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luLWxlZnQ6IC05OTk5OXB4OyBwb3NpdGlvbjogYWJzb2x1dGVcIlxuICAgIC8+XG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCIgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW5cIj5cbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxjYW52YXNcbiAgICAgIHJlZj1cImNhbnZhc1wiXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICA+PC9jYW52YXM+XG4gICAgPHN2Z1xuICAgICAgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxuICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0IC8gNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aCAvIDQwfXB4YFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXG4gICAgICB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGggLyAxMFwiXG4gICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aCAvIDEwXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiXG4gICAgICA+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICAgIDxkaXYgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCIgOnN0eWxlPVwibG9hZGluZ1N0eWxlXCIgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIj5cbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiIHYtZm9yPVwiaSBpbiAxMlwiIDprZXk9XCJpXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUtaW5kaWNhdG9yXCIgOnN0eWxlPVwieyBiYWNrZ3JvdW5kQ29sb3I6IGxvYWRpbmdDb2xvciB9XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8c2xvdD48L3Nsb3Q+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbmltcG9ydCB1IGZyb20gJy4vdXRpbCdcbmltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xuaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcblxuY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXG5jb25zdCBNSU5fTVNfUEVSX0NMSUNLID0gNTAwIC8vIElmIHRvdWNoIGR1cmF0aW9uIGlzIHNob3J0ZXIgdGhhbiB0aGUgdmFsdWUsIHRoZW4gaXQgaXMgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxuY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxuY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXG5jb25zdCBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCA9IDIgLyAzIC8vIFBsYWNlaG9sZGVyIHRleHQgYnkgZGVmYXVsdCB0YWtlcyB1cCB0aGlzIGFtb3VudCBvZiB0aW1lcyBvZiBjYW52YXMgd2lkdGguXG5jb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAxIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXG5cbmNvbnN0IHN5bmNEYXRhID0gWydpbWdEYXRhJywgJ2ltZycsICdpbWdTZXQnLCAnb3JpZ2luYWxJbWFnZScsICduYXR1cmFsSGVpZ2h0JywgJ25hdHVyYWxXaWR0aCcsICdvcmllbnRhdGlvbicsICdzY2FsZVJhdGlvJ11cbi8vIGNvbnN0IERFQlVHID0gZmFsc2VcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtb2RlbDoge1xuICAgIHByb3A6ICd2YWx1ZScsXG4gICAgZXZlbnQ6IGV2ZW50cy5JTklUX0VWRU5UXG4gIH0sXG5cbiAgcHJvcHM6IHByb3BzLFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYW52YXM6IG51bGwsXG4gICAgICBjdHg6IG51bGwsXG4gICAgICBvcmlnaW5hbEltYWdlOiBudWxsLFxuICAgICAgaW1nOiBudWxsLFxuICAgICAgdmlkZW86IG51bGwsXG4gICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXG4gICAgICBpbWdEYXRhOiB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgc3RhcnRZOiAwXG4gICAgICB9LFxuICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcbiAgICAgIHRhYlN0YXJ0OiAwLFxuICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICAgIHBpbmNoaW5nOiBmYWxzZSxcbiAgICAgIHJvdGF0aW5nOiBmYWxzZSxcbiAgICAgIHBpbmNoRGlzdGFuY2U6IDAsXG4gICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxuICAgICAgcG9pbnRlck1vdmVkOiBmYWxzZSxcbiAgICAgIHBvaW50ZXJTdGFydENvb3JkOiBudWxsLFxuICAgICAgbmF0dXJhbFdpZHRoOiAwLFxuICAgICAgbmF0dXJhbEhlaWdodDogMCxcbiAgICAgIHNjYWxlUmF0aW86IG51bGwsXG4gICAgICBvcmllbnRhdGlvbjogMSxcbiAgICAgIHVzZXJNZXRhZGF0YTogbnVsbCxcbiAgICAgIGltYWdlU2V0OiBmYWxzZSxcbiAgICAgIGN1cnJlbnRQb2ludGVyQ29vcmQ6IG51bGwsXG4gICAgICBjdXJyZW50SXNJbml0aWFsOiBmYWxzZSxcbiAgICAgIF9sb2FkaW5nOiBmYWxzZSxcbiAgICAgIHJlYWxXaWR0aDogMCwgLy8gb25seSBmb3Igd2hlbiBhdXRvU2l6aW5nIGlzIG9uXG4gICAgICByZWFsSGVpZ2h0OiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cbiAgICAgIGNob3NlbkZpbGU6IG51bGwsXG4gICAgICB1c2VBdXRvU2l6aW5nOiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBvdXRwdXRXaWR0aCAoKSB7XG4gICAgICBjb25zdCB3ID0gdGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsV2lkdGggOiB0aGlzLndpZHRoXG4gICAgICByZXR1cm4gdyAqIHRoaXMucXVhbGl0eVxuICAgIH0sXG5cbiAgICBvdXRwdXRIZWlnaHQgKCkge1xuICAgICAgY29uc3QgaCA9IHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbEhlaWdodCA6IHRoaXMuaGVpZ2h0XG4gICAgICByZXR1cm4gaCAqIHRoaXMucXVhbGl0eVxuICAgIH0sXG5cbiAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxuICAgIH0sXG5cbiAgICBhc3BlY3RSYXRpbyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uYXR1cmFsV2lkdGggLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICB9LFxuXG4gICAgbG9hZGluZ1N0eWxlICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmxvYWRpbmdTaXplICsgJ3B4JyxcbiAgICAgICAgcmlnaHQ6ICcxNXB4JyxcbiAgICAgICAgYm90dG9tOiAnMTBweCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbG9hZGluZzoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkaW5nXG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgbGV0IG9sZFZhbHVlID0gdGhpcy5fbG9hZGluZ1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gbmV3VmFsdWVcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19TVEFSVF9FVkVOVClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkxPQURJTkdfRU5EX0VWRU5UKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplKClcbiAgICB1LnJBRlBvbHlmaWxsKClcbiAgICB1LnRvQmxvYlBvbHlmaWxsKClcblxuICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXG4gICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xuICAgICAgLy8gY29uc29sZS53YXJuKCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB2dWUtY3JvcHBhIGZ1bmN0aW9uYWxpdHkuJylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXNzaXZlKSB7XG4gICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICBsZXQgc2V0ID0gZmFsc2VcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICBpZiAoc3luY0RhdGEuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgICAgIGxldCB2YWwgPSBkYXRhW2tleV1cbiAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xuICAgICAgICAgICAgICB0aGlzLiRzZXQodGhpcywga2V5LCB2YWwpXG4gICAgICAgICAgICAgIHNldCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldCkge1xuICAgICAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgICAgZGVlcDogdHJ1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXG4gICAgfVxuXG4gICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXG4gICAgICB0aGlzLiRvbignaG9vazpiZWZvcmVEZXN0cm95JywgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBiZWZvcmVEZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICB0aGlzLl9hdXRvU2l6aW5nUmVtb3ZlKClcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBvdXRwdXRXaWR0aDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXG4gICAgfSxcbiAgICBvdXRwdXRIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxuICAgIH0sXG4gICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgfVxuICAgIH0sXG4gICAgaW1hZ2VCb3JkZXJSYWRpdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwbGFjZWhvbGRlckNvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXZlbnRXaGl0ZVNwYWNlICh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICB9LFxuICAgIHNjYWxlUmF0aW8gKHZhbCwgb2xkVmFsKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxuXG4gICAgICB2YXIgeCA9IDFcbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKG9sZFZhbCkgJiYgb2xkVmFsICE9PSAwKSB7XG4gICAgICAgIHggPSB2YWwgLyBvbGRWYWxcbiAgICAgIH1cbiAgICAgIHZhciBwb3MgPSB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgfHwge1xuICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcbiAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXG4gICAgICB9XG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHZhbFxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHZhbFxuXG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhICYmIHRoaXMuaW1hZ2VTZXQgJiYgIXRoaXMucm90YXRpbmcpIHtcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEud2lkdGgnOiBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xuICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5aT09NX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAnaW1nRGF0YS5oZWlnaHQnOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuc3RhcnRYJzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXG4gICAgICB9XG4gICAgfSxcbiAgICAnaW1nRGF0YS5zdGFydFknOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5fZHJhdylcbiAgICAgIH1cbiAgICB9LFxuICAgIGF1dG9TaXppbmcgKHZhbCkge1xuICAgICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nUmVtb3ZlKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGVtaXRFdmVudCAoLi4uYXJncykge1xuICAgICAgLy8gY29uc29sZS5sb2coYXJnc1swXSlcbiAgICAgIHRoaXMuJGVtaXQoLi4uYXJncyk7XG4gICAgfSxcblxuICAgIGdldENhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXNcbiAgICB9LFxuXG4gICAgZ2V0Q29udGV4dCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdHhcbiAgICB9LFxuXG4gICAgZ2V0Q2hvc2VuRmlsZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaG9zZW5GaWxlIHx8IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdXG4gICAgfSxcblxuICAgIG1vdmUgKG9mZnNldCkge1xuICAgICAgaWYgKCFvZmZzZXQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxuICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk1PVkVfRVZFTlQpXG4gICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxuICAgIH0sXG5cbiAgICBtb3ZlRG93bndhcmRzIChhbW91bnQgPSAxKSB7XG4gICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZUxlZnR3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXG4gICAgfSxcblxuICAgIHpvb20gKHpvb21JbiA9IHRydWUsIGFjY2VsZXJhdGlvbiA9IDEpIHtcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogYWNjZWxlcmF0aW9uXG4gICAgICBsZXQgc3BlZWQgPSAodGhpcy5vdXRwdXRXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcbiAgICAgIGxldCB4ID0gMVxuICAgICAgaWYgKHpvb21Jbikge1xuICAgICAgICB4ID0gMSArIHNwZWVkXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xuICAgICAgICB4ID0gMSAtIHNwZWVkXG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gYSBuZXcgaW1hZ2UgaXMgbG9hZGVkIHdpdGggdGhlIHNhbWUgYXNwZWN0IHJhdGlvXG4gICAgICAvLyBhcyB0aGUgcHJldmlvdXNseSByZW1vdmUoKWQgb25lLCB0aGUgaW1nRGF0YS53aWR0aCBhbmQgLmhlaWdodFxuICAgICAgLy8gZWZmZWN0aXZlbGx5IGRvbid0IGNoYW5nZSAodGhleSBjaGFuZ2UgdGhyb3VnaCBvbmUgdGlja1xuICAgICAgLy8gYW5kIGVuZCB1cCBiZWluZyB0aGUgc2FtZSBhcyBiZWZvcmUgdGhlIHRpY2ssIHNvIHRoZVxuICAgICAgLy8gd2F0Y2hlcnMgZG9uJ3QgdHJpZ2dlciksIG1ha2Ugc3VyZSBzY2FsZVJhdGlvIGlzbid0IG51bGwgc29cbiAgICAgIC8vIHRoYXQgem9vbWluZyB3b3Jrcy4uLlxuICAgICAgaWYgKHRoaXMuc2NhbGVSYXRpbyA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gKj0geFxuICAgIH0sXG5cbiAgICB6b29tSW4gKCkge1xuICAgICAgdGhpcy56b29tKHRydWUpXG4gICAgfSxcblxuICAgIHpvb21PdXQgKCkge1xuICAgICAgdGhpcy56b29tKGZhbHNlKVxuICAgIH0sXG5cbiAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXG4gICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignSW52YWxpZCBhcmd1bWVudCBmb3Igcm90YXRlKCkgbWV0aG9kLiBJdCBzaG91bGQgb25lIG9mIHRoZSBpbnRlZ2VycyBmcm9tIC0zIHRvIDMuJylcbiAgICAgICAgc3RlcCA9IDFcbiAgICAgIH1cbiAgICAgIHRoaXMuX3JvdGF0ZUJ5U3RlcChzdGVwKVxuICAgIH0sXG5cbiAgICBmbGlwWCAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcbiAgICB9LFxuXG4gICAgZmxpcFkgKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDQpXG4gICAgfSxcblxuICAgIHJlZnJlc2ggKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcbiAgICB9LFxuXG4gICAgaGFzSW1hZ2UgKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5pbWFnZVNldFxuICAgIH0sXG4gICAgYXBwbHlNZXRhZGF0YVdpdGhQaXhlbERlbnNpdHkgKG1ldGFkYXRhKSB7XG4gICAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgICAgbGV0IHN0b3JlZFBpeGVsRGVuc2l0eSA9IG1ldGFkYXRhLnBpeGVsRGVuc2l0eSB8fCAxXG4gICAgICAgIGxldCBjdXJyZW50UGl4ZWxEZW5zaXR5ID0gdGhpcy5xdWFsaXR5XG4gICAgICAgIGxldCBwaXhlbERlbnNpdHlEaWZmID0gY3VycmVudFBpeGVsRGVuc2l0eSAvIHN0b3JlZFBpeGVsRGVuc2l0eVxuICAgICAgICBtZXRhZGF0YS5zdGFydFggPSBtZXRhZGF0YS5zdGFydFggKiBwaXhlbERlbnNpdHlEaWZmXG4gICAgICAgIG1ldGFkYXRhLnN0YXJ0WSA9IG1ldGFkYXRhLnN0YXJ0WSAqIHBpeGVsRGVuc2l0eURpZmZcbiAgICAgICAgbWV0YWRhdGEuc2NhbGUgPSBtZXRhZGF0YS5zY2FsZSAqIHBpeGVsRGVuc2l0eURpZmZcblxuICAgICAgICB0aGlzLmFwcGx5TWV0YWRhdGEobWV0YWRhdGEpXG4gICAgICB9XG4gICAgfSxcbiAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xuICAgICAgaWYgKCFtZXRhZGF0YSB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpLCB0cnVlKVxuICAgIH0sXG4gICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4gJydcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxuICAgIH0sXG5cbiAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICBjYWxsYmFjayhudWxsKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcbiAgICB9LFxuXG4gICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XG4gICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGJsb2IpXG4gICAgICAgICAgfSwgLi4uYXJncylcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiB7fVxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFkgfSA9IHRoaXMuaW1nRGF0YVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGVSYXRpbyxcbiAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0TWV0YWRhdGFXaXRoUGl4ZWxEZW5zaXR5ICgpIHtcbiAgICAgIGxldCBtZXRhZGF0YSA9IHRoaXMuZ2V0TWV0YWRhdGEoKVxuICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgIG1ldGFkYXRhLnBpeGVsRGVuc2l0eSA9IHRoaXMucXVhbGl0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1ldGFkYXRhXG4gICAgfSxcblxuICAgIHN1cHBvcnREZXRlY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXG4gICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvb3NlRmlsZSAoKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcbiAgICB9LFxuXG4gICAgcmVtb3ZlIChrZWVwQ2hvc2VuRmlsZSA9IGZhbHNlKSB7XG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHJldHVyblxuICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcblxuICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxuICAgICAgdGhpcy5pbWcgPSBudWxsXG4gICAgICB0aGlzLmltZ0RhdGEgPSB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgc3RhcnRZOiAwXG4gICAgICB9XG4gICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gbnVsbFxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXG4gICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgIGlmICgha2VlcENob3NlbkZpbGUpIHtcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICB9XG4gICAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgdGhpcy52aWRlbyA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKGhhZEltYWdlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIGFkZENsaXBQbHVnaW4gKHBsdWdpbikge1xuICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMgPSBbXVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbWl0TmF0aXZlRXZlbnQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZ0LnR5cGUsIGV2dCk7XG4gICAgfSxcblxuICAgIHNldEZpbGUgKGZpbGUpIHtcbiAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgfSxcblxuICAgIF9zZXRDb250YWluZXJTaXplICgpIHtcbiAgICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgICAgdGhpcy5yZWFsV2lkdGggPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLndpZHRoLnNsaWNlKDAsIC0yKVxuICAgICAgICB0aGlzLnJlYWxIZWlnaHQgPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLmhlaWdodC5zbGljZSgwLCAtMilcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2F1dG9TaXppbmdJbml0ICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nUmVtb3ZlICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9pbml0aWFsaXplICgpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcbiAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gXCJoaWdoXCI7XG4gICAgICB0aGlzLmN0eC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHgubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICB0aGlzLl9zZXRJbml0aWFsKClcbiAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0U2l6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGgpICsgJ3B4J1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbEhlaWdodCA6IHRoaXMuaGVpZ2h0KSArICdweCdcbiAgICB9LFxuXG4gICAgX3JvdGF0ZUJ5U3RlcCAoc3RlcCkge1xuICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgc3dpdGNoIChzdGVwKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMjpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0zOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcbiAgICB9LFxuXG4gICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xuICAgICAgbGV0IGltZ1xuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXG4gICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xuICAgICAgICAgIGltZyA9IGVsbVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaW1nKSByZXR1cm5cblxuICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB9XG5cbiAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcbiAgICAgICAgb25Mb2FkKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltZy5vbmxvYWQgPSBvbkxvYWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXG4gICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZVxuICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXG4gICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5vdXRwdXRXaWR0aCAvIDIsIHRoaXMub3V0cHV0SGVpZ2h0IC8gMilcbiAgICB9LFxuXG4gICAgX3NldFBsYWNlaG9sZGVycyAoKSB7XG4gICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxuICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXG4gICAgICB0aGlzLl9zZXRUZXh0UGxhY2Vob2xkZXIoKVxuICAgIH0sXG5cbiAgICBfc2V0SW5pdGlhbCAoKSB7XG4gICAgICBsZXQgc3JjLCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcbiAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xuICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXG4gICAgICAgIH1cbiAgICAgICAgaW1nLnNyYyA9IHNyY1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgIH1cbiAgICAgIGlmICghc3JjICYmICFpbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXG5cbiAgICAgIGxldCBvbkVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgaWYgKGltZy5jb21wbGV0ZSkge1xuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgICAgLy8gdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25FcnJvcigpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAvLyB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgIG9uRXJyb3IoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxLCBpbml0aWFsKSB7XG4gICAgICBpZiAodGhpcy5pbWFnZVNldCkge1xuICAgICAgICB0aGlzLnJlbW92ZSh0cnVlKVxuICAgICAgfVxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXG4gICAgICB0aGlzLmltZyA9IGltZ1xuXG4gICAgICBpZiAoaXNOYU4ob3JpZW50YXRpb24pKSB7XG4gICAgICAgIG9yaWVudGF0aW9uID0gMVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcblxuICAgICAgaWYgKGluaXRpYWwpIHtcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25WaWRlb0xvYWQgKHZpZGVvLCBpbml0aWFsKSB7XG4gICAgICB0aGlzLnZpZGVvID0gdmlkZW9cbiAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICBjb25zdCB7IHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0IH0gPSB2aWRlb1xuICAgICAgY2FudmFzLndpZHRoID0gdmlkZW9XaWR0aFxuICAgICAgY2FudmFzLmhlaWdodCA9IHZpZGVvSGVpZ2h0XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgIGNvbnN0IGRyYXdGcmFtZSA9IChpbml0aWFsKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy52aWRlbykgcmV0dXJuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCwgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQpXG4gICAgICAgIGNvbnN0IGZyYW1lID0gbmV3IEltYWdlKClcbiAgICAgICAgZnJhbWUuc3JjID0gY2FudmFzLnRvRGF0YVVSTCgpXG4gICAgICAgIGZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmltZyA9IGZyYW1lXG4gICAgICAgICAgLy8gdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICAgICAgaWYgKGluaXRpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRyYXdGcmFtZSh0cnVlKVxuICAgICAgY29uc3Qga2VlcERyYXdpbmcgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICBkcmF3RnJhbWUoKVxuICAgICAgICAgIGlmICghdGhpcy52aWRlbyB8fCB0aGlzLnZpZGVvLmVuZGVkIHx8IHRoaXMudmlkZW8ucGF1c2VkKSByZXR1cm5cbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoa2VlcERyYXdpbmcpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCAoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShrZWVwRHJhd2luZylcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9oYW5kbGVDbGljayAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2ggJiYgIXRoaXMucGFzc2l2ZSkge1xuICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRGJsQ2xpY2sgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMudmlkZW9FbmFibGVkICYmIHRoaXMudmlkZW8pIHtcbiAgICAgICAgaWYgKHRoaXMudmlkZW8ucGF1c2VkIHx8IHRoaXMudmlkZW8uZW5kZWQpIHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xuICAgICAgbGV0IGlucHV0ID0gdGhpcy4kcmVmcy5maWxlSW5wdXRcbiAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG5cbiAgICAgIGxldCBmaWxlID0gaW5wdXQuZmlsZXNbMF1cbiAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgfSxcblxuICAgIF9vbk5ld0ZpbGVJbiAoZmlsZSkge1xuICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gZmFsc2VcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcbiAgICAgIHRoaXMuY2hvc2VuRmlsZSA9IGZpbGU7XG4gICAgICBpZiAoIXRoaXMuX2ZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2ZpbGVUeXBlSXNWYWxpZChmaWxlKSkge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9UWVBFX01JU01BVENIX0VWRU5ULCBmaWxlKVxuICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XG4gICAgICAgICAgY29uc3QgYmFzZTY0ID0gdS5wYXJzZURhdGFVcmwoZmlsZURhdGEpXG4gICAgICAgICAgY29uc3QgaXNWaWRlbyA9IC9edmlkZW8vLnRlc3QoZmlsZS50eXBlKVxuICAgICAgICAgIGlmIChpc1ZpZGVvKSB7XG4gICAgICAgICAgICBsZXQgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpXG4gICAgICAgICAgICB2aWRlby5zcmMgPSBmaWxlRGF0YVxuICAgICAgICAgICAgZmlsZURhdGEgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHZpZGVvLnJlYWR5U3RhdGUgPj0gdmlkZW8uSEFWRV9GVVRVUkVfREFUQSkge1xuICAgICAgICAgICAgICB0aGlzLl9vblZpZGVvTG9hZCh2aWRlbylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbiBwbGF5IGV2ZW50JylcbiAgICAgICAgICAgICAgICB0aGlzLl9vblZpZGVvTG9hZCh2aWRlbylcbiAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3JpZW50YXRpb24gPSAxXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpKVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IH1cbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA8IDEpIG9yaWVudGF0aW9uID0gMVxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcbiAgICAgICAgICAgIGZpbGVEYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTkVXX0lNQUdFX0VWRU5UKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9maWxlU2l6ZUlzVmFsaWQgKGZpbGUpIHtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcblxuICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxuICAgIH0sXG5cbiAgICBfZmlsZVR5cGVJc1ZhbGlkIChmaWxlKSB7XG4gICAgICBjb25zdCBhY2NlcHRhYmxlTWltZVR5cGUgPSAodGhpcy52aWRlb0VuYWJsZWQgJiYgL152aWRlby8udGVzdChmaWxlLnR5cGUpICYmIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJykuY2FuUGxheVR5cGUoZmlsZS50eXBlKSkgfHwgL15pbWFnZS8udGVzdChmaWxlLnR5cGUpXG4gICAgICBpZiAoIWFjY2VwdGFibGVNaW1lVHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAoIXRoaXMuYWNjZXB0KSByZXR1cm4gdHJ1ZVxuICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0XG4gICAgICBsZXQgYmFzZU1pbWV0eXBlID0gYWNjZXB0LnJlcGxhY2UoL1xcLy4qJC8sICcnKVxuICAgICAgbGV0IHR5cGVzID0gYWNjZXB0LnNwbGl0KCcsJylcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsZXQgdHlwZSA9IHR5cGVzW2ldXG4gICAgICAgIGxldCB0ID0gdHlwZS50cmltKClcbiAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xuICAgICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpID09PSB0LnRvTG93ZXJDYXNlKCkuc2xpY2UoMSkpIHJldHVybiB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodCkpIHtcbiAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxuICAgICAgICAgIGlmIChmaWxlQmFzZVR5cGUgPT09IGJhc2VNaW1ldHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsZS50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuXG4gICAgX3BsYWNlSW1hZ2UgKGFwcGx5TWV0YWRhdGEpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxuICAgICAgdmFyIGltZ0RhdGEgPSB0aGlzLmltZ0RhdGFcblxuICAgICAgdGhpcy5uYXR1cmFsV2lkdGggPSB0aGlzLmltZy5uYXR1cmFsV2lkdGhcbiAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcblxuICAgICAgaW1nRGF0YS5zdGFydFggPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRYKSA/IGltZ0RhdGEuc3RhcnRYIDogMFxuICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ2NvbnRhaW4nKSB7XG4gICAgICAgICAgdGhpcy5fYXNwZWN0Rml0KClcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWxTaXplID09ICduYXR1cmFsJykge1xuICAgICAgICAgIHRoaXMuX25hdHVyYWxTaXplKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB0aGlzLnNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgaWYgKC90b3AvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICAgIH0gZWxzZSBpZiAoL2JvdHRvbS8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcbiAgICAgICAgICB2YXIgeCA9ICtyZXN1bHRbMV0gLyAxMDBcbiAgICAgICAgICB2YXIgeSA9ICtyZXN1bHRbMl0gLyAxMDBcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHggKiAodGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGgpXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXBwbHlNZXRhZGF0YSAmJiB0aGlzLl9hcHBseU1ldGFkYXRhKClcblxuICAgICAgaWYgKGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiAwIH0pXG4gICAgICB9XG4gICAgICB0aGlzLl9kcmF3KClcbiAgICB9LFxuXG4gICAgX2FzcGVjdEZpbGwgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgbGV0IHNjYWxlUmF0aW9cblxuICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfYXNwZWN0Rml0ICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgIGxldCBzY2FsZVJhdGlvXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9uYXR1cmFsU2l6ZSAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHRcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJTdGFydCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxuICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cbiAgICAgIC8vIHNpbXVsYXRlIGNsaWNrIHdpdGggdG91Y2ggb24gbW9iaWxlIGRldmljZXNcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XG4gICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXG4gICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxuXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IHRydWVcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcbiAgICAgIH1cblxuICAgICAgLy8gbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxuICAgICAgLy8gZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbmNlbEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgLy8gICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxuICAgICAgLy8gICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXG4gICAgICAvLyAgIHRoaXMuJG9uKCdob29rOmJlZm9yZURlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAvLyAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCB0aGlzLl9oYW5kbGVQb2ludGVyRW5kKVxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxuICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xuICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcbiAgICAgICAgaWYgKChwb2ludGVyTW92ZURpc3RhbmNlIDwgQ0xJQ0tfTU9WRV9USFJFU0hPTEQpICYmIHRhYkVuZCAtIHRoaXMudGFiU3RhcnQgPCBNSU5fTVNfUEVSX0NMSUNLICYmIHRoaXMuc3VwcG9ydFRvdWNoKSB7XG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcbiAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXG4gICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gY29vcmRcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXG5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcbiAgICAgICAgICB0aGlzLm1vdmUoe1xuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xuICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxuICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxuICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxuICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBQSU5DSF9BQ0NFTEVSQVRJT04pXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXG4gICAgfSxcblxuICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWVcbiAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcbiAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XG4gICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxuICAgICAgfVxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkgcmV0dXJuXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJvcCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcblxuICAgICAgbGV0IGZpbGVcbiAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcbiAgICAgIGlmICghZHQpIHJldHVyblxuICAgICAgaWYgKGR0Lml0ZW1zKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cbiAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xuICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm91dHB1dFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3V0cHV0SGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMub3V0cHV0V2lkdGgpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldE9yaWVudGF0aW9uIChvcmllbnRhdGlvbiA9IDEsIGFwcGx5TWV0YWRhdGEpIHtcbiAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcbiAgICAgIGlmICgob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSAmJiAhdGhpcy5kaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IHRydWVcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcbiAgICAgIH1cblxuICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcbiAgICAgICAgLy8gZmxpcCB4XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcbiAgICAgICAgLy8gZmxpcCB5XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcbiAgICAgICAgLy8gOTAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcbiAgICAgICAgLy8gMTgwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XG4gICAgICAgIC8vIDI3MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuXG4gICAgICBpZiAodXNlT3JpZ2luYWwpIHtcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wYWludEJhY2tncm91bmQgKCkge1xuICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogdGhpcy5jYW52YXNDb2xvclxuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICB9LFxuXG4gICAgX2RyYXcgKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2RyYXdGcmFtZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoKVxuICAgICAgICAvLyB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUltYWdlQ2xpcFBhdGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5EUkFXX0VWRU5ULCBjdHgpXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9EUkFXTl9FVkVOVClcbiAgICAgIH1cbiAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfY2xpcFBhdGhGYWN0b3J5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCByYWRpdXMgPSB0eXBlb2YgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA9PT0gJ251bWJlcicgP1xuICAgICAgICB0aGlzLmltYWdlQm9yZGVyUmFkaXVzIDpcbiAgICAgICAgIWlzTmFOKE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSkgPyBOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykgOiAwXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xuICAgICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgaWYgKHRoaXMuY2xpcFBsdWdpbnMgJiYgdGhpcy5jbGlwUGx1Z2lucy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgICAgIGZ1bmModGhpcy5jdHgsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XG4gICAgLy8gICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG4gICAgLy8gICBsZXQgdyA9IHdpZHRoXG4gICAgLy8gICBsZXQgaCA9IGhlaWdodFxuICAgIC8vICAgbGV0IHggPSBzdGFydFhcbiAgICAvLyAgIGxldCB5ID0gc3RhcnRZXG4gICAgLy8gICBpZiAodyA8IGgpIHtcbiAgICAvLyAgICAgaCA9IHRoaXMub3V0cHV0SGVpZ2h0ICogKHdpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aClcbiAgICAvLyAgIH1cbiAgICAvLyAgIGlmIChoIDwgdykge1xuICAgIC8vICAgICB3ID0gdGhpcy5vdXRwdXRXaWR0aCAqIChoZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodClcbiAgICAvLyAgICAgeCA9IHN0YXJ0WCArICh3aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgIC8vICAgfVxuICAgIC8vICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KHgsIHN0YXJ0WSwgdywgaClcbiAgICAvLyB9LFxuXG4gICAgX2NsaXAgKGNyZWF0ZVBhdGgpIHtcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxuICAgICAgY3R4LnNhdmUoKVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmJ1xuICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcbiAgICAgIGNyZWF0ZVBhdGgoKVxuICAgICAgY3R4LmZpbGwoKVxuICAgICAgY3R4LnJlc3RvcmUoKVxuICAgIH0sXG5cbiAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cbiAgICAgIHZhciB7IHN0YXJ0WCwgc3RhcnRZLCBzY2FsZSB9ID0gdGhpcy51c2VyTWV0YWRhdGFcblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXG4gICAgICB9XG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WSkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcbiAgICAgIH1cblxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIG9uRGltZW5zaW9uQ2hhbmdlICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxuLmNyb3BwYS1jb250YWluZXJcbiAgZGlzcGxheSBpbmxpbmUtYmxvY2tcbiAgY3Vyc29yIHBvaW50ZXJcbiAgdHJhbnNpdGlvbiBhbGwgMC4zc1xuICBwb3NpdGlvbiByZWxhdGl2ZVxuICBmb250LXNpemUgMFxuICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcbiAgYmFja2dyb3VuZC1jb2xvciAjZTZlNmU2XG5cbiAgY2FudmFzXG4gICAgdHJhbnNpdGlvbiBhbGwgMC4zc1xuXG4gICY6aG92ZXJcbiAgICBvcGFjaXR5IDAuN1xuXG4gICYuY3JvcHBhLS1kcm9wem9uZVxuICAgIGJveC1zaGFkb3cgaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXG5cbiAgICBjYW52YXNcbiAgICAgIG9wYWNpdHkgMC41XG5cbiAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXG4gICAgY3Vyc29yIGRlZmF1bHRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICYuY3JvcHBhLS1oYXMtdGFyZ2V0XG4gICAgY3Vyc29yIG1vdmVcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XG4gICAgICBjdXJzb3IgZGVmYXVsdFxuXG4gICYuY3JvcHBhLS1kaXNhYmxlZFxuICAgIGN1cnNvciBub3QtYWxsb3dlZFxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgJi5jcm9wcGEtLXBhc3NpdmVcbiAgICBjdXJzb3IgZGVmYXVsdFxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgc3ZnLmljb24tcmVtb3ZlXG4gICAgcG9zaXRpb24gYWJzb2x1dGVcbiAgICBiYWNrZ3JvdW5kIHdoaXRlXG4gICAgYm9yZGVyLXJhZGl1cyA1MCVcbiAgICBmaWx0ZXIgZHJvcC1zaGFkb3coLTJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC43KSlcbiAgICB6LWluZGV4IDEwXG4gICAgY3Vyc29yIHBvaW50ZXJcbiAgICBib3JkZXIgMnB4IHNvbGlkIHdoaXRlXG48L3N0eWxlPlxuXG48c3R5bGUgbGFuZz1cInNjc3NcIj5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90b2JpYXNhaGxpbi9TcGluS2l0L2Jsb2IvbWFzdGVyL3Njc3Mvc3Bpbm5lcnMvMTAtZmFkaW5nLWNpcmNsZS5zY3NzXG4uc2stZmFkaW5nLWNpcmNsZSB7XG4gICRjaXJjbGVDb3VudDogMTI7XG4gICRhbmltYXRpb25EdXJhdGlvbjogMXM7XG5cbiAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gIC5zay1jaXJjbGUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gIH1cblxuICAuc2stY2lyY2xlIC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICB3aWR0aDogMTUlO1xuICAgIGhlaWdodDogMTUlO1xuICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7XG4gICAgYW5pbWF0aW9uOiBzay1jaXJjbGVGYWRlRGVsYXkgJGFuaW1hdGlvbkR1cmF0aW9uIGluZmluaXRlIGVhc2UtaW4tb3V0IGJvdGg7XG4gIH1cblxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XG4gICAgLnNrLWNpcmNsZSN7JGl9IHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyAvICRjaXJjbGVDb3VudCAqICgkaSAtIDEpKTtcbiAgICB9XG4gIH1cblxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XG4gICAgLnNrLWNpcmNsZSN7JGl9IC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcbiAgICAgIGFuaW1hdGlvbi1kZWxheTogLSRhbmltYXRpb25EdXJhdGlvbiArICRhbmltYXRpb25EdXJhdGlvbiAvICRjaXJjbGVDb3VudCAqICgkaSAtIDEpO1xuICAgIH1cbiAgfVxufVxuQGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXkge1xuICAwJSxcbiAgMzklLFxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gIDQwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuPC9zdHlsZT5cblxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJ0aGlzIiwicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJiaW5TdHIiLCJsZW4iLCJhcnIiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJvcmlnaW5hbEV2ZW50IiwidHlwZXMiLCJhcnJheUJ1ZmZlciIsInZpZXciLCJEYXRhVmlldyIsImdldFVpbnQxNiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJtYXJrZXIiLCJnZXRVaW50MzIiLCJsaXR0bGUiLCJ0YWdzIiwidXJsIiwicmVnIiwiZXhlYyIsImJhc2U2NCIsImJpbmFyeVN0cmluZyIsImJ5dGVzIiwiYnVmZmVyIiwib3JpZW50YXRpb24iLCJfY2FudmFzIiwiQ2FudmFzRXhpZk9yaWVudGF0aW9uIiwiZHJhd0ltYWdlIiwiX2ltZyIsIkltYWdlIiwic3JjIiwib3JpIiwibWFwIiwibiIsImlzTmFOIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwiaW5pdGlhbEltYWdlVHlwZSIsIlN0cmluZyIsInZhbCIsIkJvb2xlYW4iLCJ2YWxpZHMiLCJldmVyeSIsImluZGV4T2YiLCJ3b3JkIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwic3luY0RhdGEiLCJyZW5kZXIiLCJldmVudHMiLCJJTklUX0VWRU5UIiwicHJvcHMiLCJ3IiwidXNlQXV0b1NpemluZyIsInJlYWxXaWR0aCIsIndpZHRoIiwiaCIsInJlYWxIZWlnaHQiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2xvYWRpbmciLCJuZXdWYWx1ZSIsIm9sZFZhbHVlIiwicGFzc2l2ZSIsImVtaXRFdmVudCIsIkxPQURJTkdfU1RBUlRfRVZFTlQiLCJMT0FESU5HX0VORF9FVkVOVCIsIl9pbml0aWFsaXplIiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwiJHdhdGNoIiwiZGF0YSIsInNldCIsImtleSIsIiRzZXQiLCJyZW1vdmUiLCIkbmV4dFRpY2siLCJfZHJhdyIsImF1dG9TaXppbmciLCIkcmVmcyIsIndyYXBwZXIiLCJnZXRDb21wdXRlZFN0eWxlIiwiX2F1dG9TaXppbmdJbml0IiwiY2FuY2VsRXZlbnRzIiwiZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfaGFuZGxlUG9pbnRlckVuZCIsIiRvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfYXV0b1NpemluZ1JlbW92ZSIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiX3NldFBsYWNlaG9sZGVycyIsImltYWdlU2V0IiwiX3BsYWNlSW1hZ2UiLCJvbGRWYWwiLCJ1IiwibnVtYmVyVmFsaWQiLCJwb3MiLCJjdXJyZW50UG9pbnRlckNvb3JkIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsIl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSIsIl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwic2NhbGVSYXRpbyIsImhhc0ltYWdlIiwiYWJzIiwiWk9PTV9FVkVOVCIsIiRlbWl0IiwiY3R4IiwiY2hvc2VuRmlsZSIsImZpbGVJbnB1dCIsImZpbGVzIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsImFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib3V0cHV0V2lkdGgiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJfcm90YXRlQnlTdGVwIiwiX3NldE9yaWVudGF0aW9uIiwibWV0YWRhdGEiLCJzdG9yZWRQaXhlbERlbnNpdHkiLCJwaXhlbERlbnNpdHkiLCJjdXJyZW50UGl4ZWxEZW5zaXR5IiwicGl4ZWxEZW5zaXR5RGlmZiIsInNjYWxlIiwiYXBwbHlNZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImdldE1ldGFkYXRhIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsIkZpbGUiLCJGaWxlUmVhZGVyIiwiRmlsZUxpc3QiLCJjbGljayIsImtlZXBDaG9zZW5GaWxlIiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwidmlkZW8iLCJwYXVzZSIsIklNQUdFX1JFTU9WRV9FVkVOVCIsInBsdWdpbiIsImNsaXBQbHVnaW5zIiwicHVzaCIsIkVycm9yIiwiZmlsZSIsIl9vbk5ld0ZpbGVJbiIsInNsaWNlIiwiX3NldENvbnRhaW5lclNpemUiLCJfc2V0U2l6ZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJnZXRDb250ZXh0IiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiaW1hZ2VTbW9vdGhpbmdRdWFsaXR5Iiwid2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwibXNJbWFnZVNtb290aGluZ0VuYWJsZWQiLCJfc2V0SW5pdGlhbCIsIm91dHB1dEhlaWdodCIsIiRzbG90cyIsInBsYWNlaG9sZGVyIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsImZvbnRTaXplIiwiY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsIl9wYWludEJhY2tncm91bmQiLCJfc2V0SW1hZ2VQbGFjZWhvbGRlciIsIl9zZXRUZXh0UGxhY2Vob2xkZXIiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImN1cnJlbnRJc0luaXRpYWwiLCJvbkVycm9yIiwibG9hZGluZyIsIl9vbmxvYWQiLCJkYXRhc2V0Iiwib25lcnJvciIsIklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UIiwidmlkZW9XaWR0aCIsInZpZGVvSGVpZ2h0IiwiZHJhd0ZyYW1lIiwiZnJhbWUiLCJrZWVwRHJhd2luZyIsImVuZGVkIiwicGF1c2VkIiwiZW1pdE5hdGl2ZUV2ZW50IiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJjaG9vc2VGaWxlIiwidmlkZW9FbmFibGVkIiwicGxheSIsImlucHV0IiwiRklMRV9DSE9PU0VfRVZFTlQiLCJfZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJmciIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwicGFyc2VEYXRhVXJsIiwiaXNWaWRlbyIsInJlYWR5U3RhdGUiLCJIQVZFX0ZVVFVSRV9EQVRBIiwiX29uVmlkZW9Mb2FkIiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRV9FVkVOVCIsInJlYWRBc0RhdGFVUkwiLCJmaWxlU2l6ZUxpbWl0Iiwic2l6ZSIsImFjY2VwdGFibGVNaW1lVHlwZSIsImNhblBsYXlUeXBlIiwiYWNjZXB0IiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInQiLCJ0cmltIiwiY2hhckF0IiwiZmlsZUJhc2VUeXBlIiwiX2FzcGVjdEZpbGwiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJpbml0aWFsUG9zaXRpb24iLCJfYXBwbHlNZXRhZGF0YSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2FudmFzUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwic2Nyb2xsaW5nIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJyZXBsYWNlRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJ1c2VPcmlnaW5hbCIsImRpc2FibGVFeGlmQXV0b09yaWVudGF0aW9uIiwiZ2V0Um90YXRlZEltYWdlIiwiZmxpcFgiLCJmbGlwWSIsInJvdGF0ZTkwIiwiY2xlYXJSZWN0IiwiZmlsbFJlY3QiLCJfZHJhd0ZyYW1lIiwiX2NsaXAiLCJfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgiLCJEUkFXX0VWRU5UIiwiTkVXX0lNQUdFX0RSQVdOX0VWRU5UIiwicmFkaXVzIiwiaW1hZ2VCb3JkZXJSYWRpdXMiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwiY2xvc2VQYXRoIiwiX2NsaXBQYXRoRmFjdG9yeSIsImZvckVhY2giLCJjcmVhdGVQYXRoIiwic2F2ZSIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsImZpbGwiLCJyZXN0b3JlIiwiZGVmYXVsdE9wdGlvbnMiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwiYXNzaWduIiwidmVyc2lvbiIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtJQUN0QixJQUFJLE9BQU9BLFNBQU0sS0FBSyxVQUFVLElBQUlBLFNBQU0sQ0FBQyxHQUFHLEVBQUU7UUFDNUNBLFNBQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdkIsTUFBTSxBQUFpQztRQUNwQyxjQUFjLEdBQUcsT0FBTyxFQUFFLENBQUM7S0FDOUIsQUFFRjtDQUNGLENBQUNDLGNBQUksRUFBRSxZQUFZO0VBQ2xCLFlBQVksQ0FBQzs7RUFFYixTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0lBRWpGLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUNyQyxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0lBRXhDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7SUFFdkIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsUUFBUSxDQUFDLFdBQVc7O01BRWxCLEtBQUssQ0FBQztVQUNGLE1BQU07OztNQUdWLEtBQUssQ0FBQztTQUNILEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDakIsTUFBTTs7O01BR1QsS0FBSyxDQUFDO1VBQ0YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7VUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztVQUN6QixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2pCLE1BQU07OztNQUdWLEtBQUssQ0FBQztVQUNGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1VBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1VBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7VUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNqQixNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztVQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztVQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDMUIsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1VBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7VUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7VUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1VBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDakIsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1VBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7VUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7VUFDdEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7VUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxNQUFNO0tBQ1g7O0lBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztJQUVkLE9BQU8sTUFBTSxDQUFDO0dBQ2Y7O0VBRUQsT0FBTztJQUNMLFNBQVMsRUFBRSxTQUFTO0dBQ3JCLENBQUM7Q0FDSCxDQUFDLEVBQUU7OztBQ3pGSixRQUFlO2VBQUEseUJBQ0VDLEtBREYsRUFDU0MsRUFEVCxFQUNhO1FBQ2xCQyxNQURrQixHQUNFRCxFQURGLENBQ2xCQyxNQURrQjtRQUNWQyxPQURVLEdBQ0VGLEVBREYsQ0FDVkUsT0FEVTs7UUFFcEJDLE9BQU9GLE9BQU9HLHFCQUFQLEVBQVg7UUFDSUMsVUFBVU4sTUFBTU0sT0FBcEI7UUFDSUMsVUFBVVAsTUFBTU8sT0FBcEI7V0FDTztTQUNGLENBQUNELFVBQVVGLEtBQUtJLElBQWhCLElBQXdCTCxPQUR0QjtTQUVGLENBQUNJLFVBQVVILEtBQUtLLEdBQWhCLElBQXVCTjtLQUY1QjtHQU5XO2tCQUFBLDRCQVlLTyxHQVpMLEVBWVVULEVBWlYsRUFZYztRQUNyQlUsZ0JBQUo7UUFDSUQsSUFBSUUsT0FBSixJQUFlRixJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFuQixFQUFtQztnQkFDdkJGLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQVY7S0FERixNQUVPLElBQUlGLElBQUlHLGNBQUosSUFBc0JILElBQUlHLGNBQUosQ0FBbUIsQ0FBbkIsQ0FBMUIsRUFBaUQ7Z0JBQzVDSCxJQUFJRyxjQUFKLENBQW1CLENBQW5CLENBQVY7S0FESyxNQUVBO2dCQUNLSCxHQUFWOztXQUVLLEtBQUtJLGFBQUwsQ0FBbUJILE9BQW5CLEVBQTRCVixFQUE1QixDQUFQO0dBckJXO2tCQUFBLDRCQXdCS1MsR0F4QkwsRUF3QlVULEVBeEJWLEVBd0JjO1FBQ3JCYyxXQUFXTCxJQUFJRSxPQUFKLENBQVksQ0FBWixDQUFmO1FBQ0lJLFdBQVdOLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUssU0FBUyxLQUFLSCxhQUFMLENBQW1CQyxRQUFuQixFQUE2QmQsRUFBN0IsQ0FBYjtRQUNJaUIsU0FBUyxLQUFLSixhQUFMLENBQW1CRSxRQUFuQixFQUE2QmYsRUFBN0IsQ0FBYjs7V0FFT2tCLEtBQUtDLElBQUwsQ0FBVUQsS0FBS0UsR0FBTCxDQUFTSixPQUFPSyxDQUFQLEdBQVdKLE9BQU9JLENBQTNCLEVBQThCLENBQTlCLElBQW1DSCxLQUFLRSxHQUFMLENBQVNKLE9BQU9NLENBQVAsR0FBV0wsT0FBT0ssQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBN0MsQ0FBUDtHQTlCVztxQkFBQSwrQkFpQ1FiLEdBakNSLEVBaUNhVCxFQWpDYixFQWlDaUI7UUFDeEJjLFdBQVdMLElBQUlFLE9BQUosQ0FBWSxDQUFaLENBQWY7UUFDSUksV0FBV04sSUFBSUUsT0FBSixDQUFZLENBQVosQ0FBZjtRQUNJSyxTQUFTLEtBQUtILGFBQUwsQ0FBbUJDLFFBQW5CLEVBQTZCZCxFQUE3QixDQUFiO1FBQ0lpQixTQUFTLEtBQUtKLGFBQUwsQ0FBbUJFLFFBQW5CLEVBQTZCZixFQUE3QixDQUFiOztXQUVPO1NBQ0YsQ0FBQ2dCLE9BQU9LLENBQVAsR0FBV0osT0FBT0ksQ0FBbkIsSUFBd0IsQ0FEdEI7U0FFRixDQUFDTCxPQUFPTSxDQUFQLEdBQVdMLE9BQU9LLENBQW5CLElBQXdCO0tBRjdCO0dBdkNXO2FBQUEsdUJBNkNBQyxHQTdDQSxFQTZDSztXQUNUQSxJQUFJQyxRQUFKLElBQWdCRCxJQUFJRSxZQUFKLEtBQXFCLENBQTVDO0dBOUNXO2FBQUEseUJBaURFOztRQUVULE9BQU9DLFFBQVAsSUFBbUIsV0FBbkIsSUFBa0MsT0FBT0MsTUFBUCxJQUFpQixXQUF2RCxFQUFvRTtRQUNoRUMsV0FBVyxDQUFmO1FBQ0lDLFVBQVUsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFkO1NBQ0ssSUFBSVIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJUSxRQUFRQyxNQUFaLElBQXNCLENBQUNILE9BQU9JLHFCQUE5QyxFQUFxRSxFQUFFVixDQUF2RSxFQUEwRTthQUNqRVUscUJBQVAsR0FBK0JKLE9BQU9FLFFBQVFSLENBQVIsSUFBYSx1QkFBcEIsQ0FBL0I7YUFDT1csb0JBQVAsR0FBOEJMLE9BQU9FLFFBQVFSLENBQVIsSUFBYSxzQkFBcEI7YUFDckJRLFFBQVFSLENBQVIsSUFBYSw2QkFBcEIsQ0FERjs7O1FBSUUsQ0FBQ00sT0FBT0kscUJBQVosRUFBbUM7YUFDMUJBLHFCQUFQLEdBQStCLFVBQVVFLFFBQVYsRUFBb0I7WUFDN0NDLFdBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQWY7WUFDSUMsYUFBYW5CLEtBQUtvQixHQUFMLENBQVMsQ0FBVCxFQUFZLFFBQVFKLFdBQVdOLFFBQW5CLENBQVosQ0FBakI7WUFDSVcsS0FBS1osT0FBT2EsVUFBUCxDQUFrQixZQUFZO2NBQ2pDQyxNQUFNUCxXQUFXRyxVQUFyQjttQkFDU0ksR0FBVDtTQUZPLEVBR05KLFVBSE0sQ0FBVDttQkFJV0gsV0FBV0csVUFBdEI7ZUFDT0UsRUFBUDtPQVJGOztRQVdFLENBQUNaLE9BQU9LLG9CQUFaLEVBQWtDO2FBQ3pCQSxvQkFBUCxHQUE4QixVQUFVTyxFQUFWLEVBQWM7cUJBQzdCQSxFQUFiO09BREY7OztVQUtJRyxPQUFOLEdBQWdCLFVBQVVELEdBQVYsRUFBZTthQUN0QkUsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCTCxHQUEvQixNQUF3QyxnQkFBL0M7S0FERjtHQTlFVztnQkFBQSw0QkFtRks7UUFDWixPQUFPZixRQUFQLElBQW1CLFdBQW5CLElBQWtDLE9BQU9DLE1BQVAsSUFBaUIsV0FBbkQsSUFBa0UsQ0FBQ29CLGlCQUF2RSxFQUEwRjtRQUN0RkMsTUFBSixFQUFZQyxHQUFaLEVBQWlCQyxHQUFqQjtRQUNJLENBQUNILGtCQUFrQkgsU0FBbEIsQ0FBNEJPLE1BQWpDLEVBQXlDO2FBQ2hDQyxjQUFQLENBQXNCTCxrQkFBa0JILFNBQXhDLEVBQW1ELFFBQW5ELEVBQTZEO2VBQ3BELGVBQVVYLFFBQVYsRUFBb0JvQixJQUFwQixFQUEwQm5ELE9BQTFCLEVBQW1DO21CQUMvQm9ELEtBQUssS0FBS0MsU0FBTCxDQUFlRixJQUFmLEVBQXFCbkQsT0FBckIsRUFBOEJzRCxLQUE5QixDQUFvQyxHQUFwQyxFQUF5QyxDQUF6QyxDQUFMLENBQVQ7Z0JBQ01SLE9BQU9sQixNQUFiO2dCQUNNLElBQUkyQixVQUFKLENBQWVSLEdBQWYsQ0FBTjs7ZUFFSyxJQUFJUyxJQUFJLENBQWIsRUFBZ0JBLElBQUlULEdBQXBCLEVBQXlCUyxHQUF6QixFQUE4QjtnQkFDeEJBLENBQUosSUFBU1YsT0FBT1csVUFBUCxDQUFrQkQsQ0FBbEIsQ0FBVDs7O21CQUdPLElBQUlFLElBQUosQ0FBUyxDQUFDVixHQUFELENBQVQsRUFBZ0IsRUFBRUcsTUFBTUEsUUFBUSxXQUFoQixFQUFoQixDQUFUOztPQVZKOztHQXZGUztjQUFBLHdCQXVHQzVDLEdBdkdELEVBdUdNO1FBQ2JvRCxLQUFLcEQsSUFBSXFELFlBQUosSUFBb0JyRCxJQUFJc0QsYUFBSixDQUFrQkQsWUFBL0M7UUFDSUQsR0FBR0csS0FBUCxFQUFjO1dBQ1AsSUFBSU4sSUFBSSxDQUFSLEVBQVdULE1BQU1ZLEdBQUdHLEtBQUgsQ0FBU2xDLE1BQS9CLEVBQXVDNEIsSUFBSVQsR0FBM0MsRUFBZ0RTLEdBQWhELEVBQXFEO1lBQy9DRyxHQUFHRyxLQUFILENBQVNOLENBQVQsS0FBZSxPQUFuQixFQUE0QjtpQkFDbkIsSUFBUDs7Ozs7V0FLQyxLQUFQO0dBakhXO29CQUFBLDhCQW9IT08sV0FwSFAsRUFvSG9CO1FBQzNCQyxPQUFPLElBQUlDLFFBQUosQ0FBYUYsV0FBYixDQUFYO1FBQ0lDLEtBQUtFLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLEtBQWxCLEtBQTRCLE1BQWhDLEVBQXdDLE9BQU8sQ0FBQyxDQUFSO1FBQ3BDdEMsU0FBU29DLEtBQUtHLFVBQWxCO1FBQ0lDLFNBQVMsQ0FBYjtXQUNPQSxTQUFTeEMsTUFBaEIsRUFBd0I7VUFDbEJ5QyxTQUFTTCxLQUFLRSxTQUFMLENBQWVFLE1BQWYsRUFBdUIsS0FBdkIsQ0FBYjtnQkFDVSxDQUFWO1VBQ0lDLFVBQVUsTUFBZCxFQUFzQjtZQUNoQkwsS0FBS00sU0FBTCxDQUFlRixVQUFVLENBQXpCLEVBQTRCLEtBQTVCLEtBQXNDLFVBQTFDLEVBQXNELE9BQU8sQ0FBQyxDQUFSO1lBQ2xERyxTQUFTUCxLQUFLRSxTQUFMLENBQWVFLFVBQVUsQ0FBekIsRUFBNEIsS0FBNUIsS0FBc0MsTUFBbkQ7a0JBQ1VKLEtBQUtNLFNBQUwsQ0FBZUYsU0FBUyxDQUF4QixFQUEyQkcsTUFBM0IsQ0FBVjtZQUNJQyxPQUFPUixLQUFLRSxTQUFMLENBQWVFLE1BQWYsRUFBdUJHLE1BQXZCLENBQVg7a0JBQ1UsQ0FBVjthQUNLLElBQUlmLElBQUksQ0FBYixFQUFnQkEsSUFBSWdCLElBQXBCLEVBQTBCaEIsR0FBMUIsRUFBK0I7Y0FDekJRLEtBQUtFLFNBQUwsQ0FBZUUsU0FBVVosSUFBSSxFQUE3QixFQUFrQ2UsTUFBbEMsS0FBNkMsTUFBakQsRUFBeUQ7bUJBQ2hEUCxLQUFLRSxTQUFMLENBQWVFLFNBQVVaLElBQUksRUFBZCxHQUFvQixDQUFuQyxFQUFzQ2UsTUFBdEMsQ0FBUDs7O09BUk4sTUFXTyxJQUFJLENBQUNGLFNBQVMsTUFBVixLQUFxQixNQUF6QixFQUFpQyxNQUFqQyxLQUNGRCxVQUFVSixLQUFLRSxTQUFMLENBQWVFLE1BQWYsRUFBdUIsS0FBdkIsQ0FBVjs7V0FFQSxDQUFDLENBQVI7R0ExSVc7Y0FBQSx3QkE2SUNLLEdBN0lELEVBNklNO1FBQ1hDLE1BQU0sa0NBQVo7V0FDT0EsSUFBSUMsSUFBSixDQUFTRixHQUFULEVBQWMsQ0FBZCxDQUFQO0dBL0lXO3FCQUFBLCtCQWtKUUcsTUFsSlIsRUFrSmdCO1FBQ3ZCQyxlQUFlekIsS0FBS3dCLE1BQUwsQ0FBbkI7UUFDSTdCLE1BQU04QixhQUFhakQsTUFBdkI7UUFDSWtELFFBQVEsSUFBSXZCLFVBQUosQ0FBZVIsR0FBZixDQUFaO1NBQ0ssSUFBSVMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJVCxHQUFwQixFQUF5QlMsR0FBekIsRUFBOEI7WUFDdEJBLENBQU4sSUFBV3FCLGFBQWFwQixVQUFiLENBQXdCRCxDQUF4QixDQUFYOztXQUVLc0IsTUFBTUMsTUFBYjtHQXpKVztpQkFBQSwyQkE0SkkxRCxHQTVKSixFQTRKUzJELFdBNUpULEVBNEpzQjtRQUM3QkMsVUFBVUMsc0JBQXNCQyxTQUF0QixDQUFnQzlELEdBQWhDLEVBQXFDMkQsV0FBckMsQ0FBZDtRQUNJSSxPQUFPLElBQUlDLEtBQUosRUFBWDtTQUNLQyxHQUFMLEdBQVdMLFFBQVE1QixTQUFSLEVBQVg7V0FDTytCLElBQVA7R0FoS1c7T0FBQSxpQkFtS05HLEdBbktNLEVBbUtEO1FBQ05BLE1BQU0sQ0FBTixJQUFXLENBQWYsRUFBa0I7YUFDVEEsTUFBTSxDQUFiOzs7V0FHS0EsTUFBTSxDQUFiO0dBeEtXO09BQUEsaUJBMktOQSxHQTNLTSxFQTJLRDtRQUNKQyxNQUFNO1NBQ1AsQ0FETztTQUVQLENBRk87U0FHUCxDQUhPO1NBSVAsQ0FKTztTQUtQLENBTE87U0FNUCxDQU5PO1NBT1AsQ0FQTztTQVFQO0tBUkw7O1dBV09BLElBQUlELEdBQUosQ0FBUDtHQXZMVztVQUFBLG9CQTBMSEEsR0ExTEcsRUEwTEU7UUFDUEMsTUFBTTtTQUNQLENBRE87U0FFUCxDQUZPO1NBR1AsQ0FITztTQUlQLENBSk87U0FLUCxDQUxPO1NBTVAsQ0FOTztTQU9QLENBUE87U0FRUDtLQVJMOztXQVdPQSxJQUFJRCxHQUFKLENBQVA7R0F0TVc7YUFBQSx1QkF5TUFFLENBek1BLEVBeU1HO1dBQ1AsT0FBT0EsQ0FBUCxLQUFhLFFBQWIsSUFBeUIsQ0FBQ0MsTUFBTUQsQ0FBTixDQUFqQzs7Q0ExTUo7O0FDRkFFLE9BQU9DLFNBQVAsR0FDRUQsT0FBT0MsU0FBUCxJQUNBLFVBQVVDLEtBQVYsRUFBaUI7U0FFYixPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQ0FDLFNBQVNELEtBQVQsQ0FEQSxJQUVBN0UsS0FBSytFLEtBQUwsQ0FBV0YsS0FBWCxNQUFzQkEsS0FIeEI7Q0FISjs7QUFVQSxJQUFJRyxtQkFBbUJDLE1BQXZCO0FBQ0EsSUFBSSxPQUFPeEUsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsT0FBTzRELEtBQTVDLEVBQW1EO3FCQUM5QixDQUFDWSxNQUFELEVBQVNaLEtBQVQsQ0FBbkI7OztBQUdGLFlBQWU7U0FDTjVDLE1BRE07U0FFTjtVQUNDa0QsTUFERDthQUVJLEdBRko7ZUFHTSxtQkFBVU8sR0FBVixFQUFlO2FBQ2pCQSxNQUFNLENBQWI7O0dBTlM7VUFTTDtVQUNBUCxNQURBO2FBRUcsR0FGSDtlQUdLLG1CQUFVTyxHQUFWLEVBQWU7YUFDakJBLE1BQU0sQ0FBYjs7R0FiUztlQWdCQTtVQUNMRCxNQURLO2FBRUY7R0FsQkU7b0JBb0JLO2FBQ1A7R0FyQkU7dUJBdUJRO1VBQ2JOLE1BRGE7YUFFVixDQUZVO2VBR1IsbUJBQVVPLEdBQVYsRUFBZTthQUNqQkEsT0FBTyxDQUFkOztHQTNCUztlQThCQTthQUNGO0dBL0JFO1dBaUNKO1VBQ0RQLE1BREM7YUFFRSxDQUZGO2VBR0ksbUJBQVVPLEdBQVYsRUFBZTthQUNqQkEsTUFBTSxDQUFiOztHQXJDUzthQXdDRjthQUNBLENBREE7VUFFSFAsTUFGRztlQUdFLG1CQUFVTyxHQUFWLEVBQWU7YUFDakJBLE1BQU0sQ0FBYjs7R0E1Q1M7VUErQ0xELE1BL0NLO2lCQWdERTtVQUNQTixNQURPO2FBRUosQ0FGSTtlQUdGLG1CQUFVTyxHQUFWLEVBQWU7YUFDakJBLE9BQU8sQ0FBZDs7R0FwRFM7WUF1REhDLE9BdkRHO3NCQXdET0EsT0F4RFA7OEJBeURlQSxPQXpEZjt3QkEwRFNBLE9BMURUO3FCQTJETUEsT0EzRE47dUJBNERRQSxPQTVEUjtzQkE2RE9BLE9BN0RQO21CQThESUEsT0E5REo7dUJBK0RRQSxPQS9EUjtxQkFnRU1BLE9BaEVOO29CQWlFSztVQUNWQSxPQURVO2FBRVA7R0FuRUU7cUJBcUVNO1VBQ1hGLE1BRFc7YUFFUjtHQXZFRTtvQkF5RUs7VUFDVk47R0ExRUs7Z0JBNEVDSyxnQkE1RUQ7ZUE2RUE7VUFDTEMsTUFESzthQUVGLE9BRkU7ZUFHQSxtQkFBVUMsR0FBVixFQUFlO2FBQ2pCQSxRQUFRLE9BQVIsSUFBbUJBLFFBQVEsU0FBM0IsSUFBd0NBLFFBQVEsU0FBdkQ7O0dBakZTO21CQW9GSTtVQUNURCxNQURTO2FBRU4sUUFGTTtlQUdKLG1CQUFVQyxHQUFWLEVBQWU7VUFDcEJFLFNBQVMsQ0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixRQUFsQixFQUE0QixNQUE1QixFQUFvQyxPQUFwQyxDQUFiO2FBRUVGLElBQUk1QyxLQUFKLENBQVUsR0FBVixFQUFlK0MsS0FBZixDQUFxQixnQkFBUTtlQUNwQkQsT0FBT0UsT0FBUCxDQUFlQyxJQUFmLEtBQXdCLENBQS9CO09BREYsS0FFTSxrQkFBa0JDLElBQWxCLENBQXVCTixHQUF2QixDQUhSOztHQXpGUztjQWdHRHpELE1BaEdDO2VBaUdBMEQsT0FqR0E7ZUFrR0E7VUFDTFIsTUFESzthQUVGO0dBcEdFO2dCQXNHQztVQUNOTSxNQURNO2FBRUg7R0F4R0U7ZUEwR0FFLE9BMUdBO1dBMkdKQSxPQTNHSTtxQkE0R007VUFDWCxDQUFDUixNQUFELEVBQVNNLE1BQVQsQ0FEVzthQUVSO0dBOUdFO2NBZ0hERSxPQWhIQztnQkFpSENBO0NBakhoQjs7QUNmQSxhQUFlO2NBQ0QsTUFEQztxQkFFTSxhQUZOOzBCQUdXLGtCQUhYOzRCQUlhLG9CQUpiO21CQUtJLFdBTEo7eUJBTVUsaUJBTlY7c0JBT08sY0FQUDtjQVFELE1BUkM7Y0FTRCxNQVRDO2NBVUQsTUFWQzs4QkFXZSxzQkFYZjt1QkFZUSxlQVpSO3FCQWFNO0NBYnJCOzs7Ozs7OztBQzZFQSxJQUFNTSxlQUFlLElBQUksTUFBekI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBekI7QUFDQSxJQUFNQyx1QkFBdUIsR0FBN0I7QUFDQSxJQUFNQyxZQUFZLEVBQWxCO0FBQ0EsSUFBTUMsNkJBQTZCLElBQUksQ0FBdkM7QUFDQSxJQUFNQyxxQkFBcUIsQ0FBM0I7O0FBRUEsSUFBTUMsV0FBVyxDQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLFFBQW5CLEVBQTZCLGVBQTdCLEVBQThDLGVBQTlDLEVBQStELGNBQS9ELEVBQStFLGFBQS9FLEVBQThGLFlBQTlGLENBQWpCOzs7QUFHQSxnQkFBZSxFQUFDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUFELHFCQUFBO1NBQ047VUFDQyxPQUREO1dBRUVDLE9BQU9DO0dBSEg7O1NBTU5DLEtBTk07O01BQUEsa0JBUUw7V0FDQztjQUNHLElBREg7V0FFQSxJQUZBO3FCQUdVLElBSFY7V0FJQSxJQUpBO2FBS0UsSUFMRjtnQkFNSyxLQU5MO3VCQU9ZLElBUFo7ZUFRSTtlQUNBLENBREE7Z0JBRUMsQ0FGRDtnQkFHQyxDQUhEO2dCQUlDO09BWkw7dUJBY1ksS0FkWjtnQkFlSyxDQWZMO2lCQWdCTSxLQWhCTjtnQkFpQkssS0FqQkw7Z0JBa0JLLEtBbEJMO3FCQW1CVSxDQW5CVjtvQkFvQlMsS0FwQlQ7b0JBcUJTLEtBckJUO3lCQXNCYyxJQXRCZDtvQkF1QlMsQ0F2QlQ7cUJBd0JVLENBeEJWO2tCQXlCTyxJQXpCUDttQkEwQlEsQ0ExQlI7b0JBMkJTLElBM0JUO2dCQTRCSyxLQTVCTDsyQkE2QmdCLElBN0JoQjt3QkE4QmEsS0E5QmI7Z0JBK0JLLEtBL0JMO2lCQWdDTSxDQWhDTjtrQkFpQ08sQ0FqQ1A7a0JBa0NPLElBbENQO3FCQW1DVTtLQW5DakI7R0FUVzs7O1lBZ0RIO2VBQUEseUJBQ087VUFDUEMsSUFBSSxLQUFLQyxhQUFMLEdBQXFCLEtBQUtDLFNBQTFCLEdBQXNDLEtBQUtDLEtBQXJEO2FBQ09ILElBQUksS0FBS3BILE9BQWhCO0tBSE07Z0JBQUEsMEJBTVE7VUFDUndILElBQUksS0FBS0gsYUFBTCxHQUFxQixLQUFLSSxVQUExQixHQUF1QyxLQUFLQyxNQUF0RDthQUNPRixJQUFJLEtBQUt4SCxPQUFoQjtLQVJNOytCQUFBLHlDQVd1QjthQUN0QixLQUFLMkgsbUJBQUwsR0FBMkIsS0FBSzNILE9BQXZDO0tBWk07ZUFBQSx5QkFlTzthQUNOLEtBQUt1QixZQUFMLEdBQW9CLEtBQUtxRyxhQUFoQztLQWhCTTtnQkFBQSwwQkFtQlE7YUFDUDtlQUNFLEtBQUtDLFdBQUwsR0FBbUIsSUFEckI7Z0JBRUcsS0FBS0EsV0FBTCxHQUFtQixJQUZ0QjtlQUdFLE1BSEY7Z0JBSUc7T0FKVjtLQXBCTTs7O2FBNEJDO1dBQ0Ysa0JBQVk7ZUFDUixLQUFLQyxRQUFaO09BRks7V0FJRixnQkFBVUMsUUFBVixFQUFvQjtZQUNuQkMsV0FBVyxLQUFLRixRQUFwQjthQUNLQSxRQUFMLEdBQWdCQyxRQUFoQjtZQUNJQyxZQUFZRCxRQUFoQixFQUEwQjtjQUNwQixLQUFLRSxPQUFULEVBQWtCO2NBQ2RGLFFBQUosRUFBYztpQkFDUEcsU0FBTCxDQUFlakIsT0FBT2tCLG1CQUF0QjtXQURGLE1BRU87aUJBQ0FELFNBQUwsQ0FBZWpCLE9BQU9tQixpQkFBdEI7Ozs7O0dBeEZHOztTQUFBLHFCQStGRjs7O1NBQ0pDLFdBQUw7TUFDRUMsV0FBRjtNQUNFQyxjQUFGOztRQUVJQyxXQUFXLEtBQUtDLGdCQUFMLEVBQWY7UUFDSSxDQUFDRCxTQUFTRSxLQUFkLEVBQXFCOzs7O1FBSWpCLEtBQUtULE9BQVQsRUFBa0I7V0FDWFUsTUFBTCxDQUFZLGFBQVosRUFBMkIsVUFBQ0MsSUFBRCxFQUFVO1lBQy9CQyxTQUFNLEtBQVY7WUFDSSxDQUFDRCxJQUFMLEVBQVc7YUFDTixJQUFJRSxHQUFULElBQWdCRixJQUFoQixFQUFzQjtjQUNoQjdCLFNBQVNULE9BQVQsQ0FBaUJ3QyxHQUFqQixLQUF5QixDQUE3QixFQUFnQztnQkFDMUI1QyxNQUFNMEMsS0FBS0UsR0FBTCxDQUFWO2dCQUNJNUMsUUFBUSxNQUFLNEMsR0FBTCxDQUFaLEVBQXVCO29CQUNoQkMsSUFBTCxDQUFVLEtBQVYsRUFBZ0JELEdBQWhCLEVBQXFCNUMsR0FBckI7dUJBQ00sSUFBTjs7OztZQUlGMkMsTUFBSixFQUFTO2NBQ0gsQ0FBQyxNQUFLeEgsR0FBVixFQUFlO2tCQUNSMkgsTUFBTDtXQURGLE1BRU87a0JBQ0FDLFNBQUwsQ0FBZSxZQUFNO29CQUNkQyxLQUFMO2FBREY7OztPQWhCTixFQXFCRztjQUNPO09BdEJWOzs7U0EwQkc3QixhQUFMLEdBQXFCLENBQUMsRUFBRSxLQUFLOEIsVUFBTCxJQUFtQixLQUFLQyxLQUFMLENBQVdDLE9BQTlCLElBQXlDQyxnQkFBM0MsQ0FBdEI7UUFDSSxLQUFLakMsYUFBVCxFQUF3QjtXQUNqQmtDLGVBQUw7OztRQUdFQyxlQUFlLENBQUMsU0FBRCxFQUFZLFVBQVosRUFBd0IsYUFBeEIsRUFBdUMsWUFBdkMsRUFBcUQsZUFBckQsQ0FBbkI7OytCQUNTaEcsQ0EzQ0EsRUEyQ09ULEdBM0NQO1VBNENIMEcsSUFBSUQsYUFBYWhHLENBQWIsQ0FBUjtlQUNTa0csZ0JBQVQsQ0FBMEJELENBQTFCLEVBQTZCLE1BQUtFLGlCQUFsQztZQUNLQyxHQUFMLENBQVMsb0JBQVQsRUFBK0IsWUFBTTtpQkFDMUJDLG1CQUFULENBQTZCSixDQUE3QixFQUFnQyxNQUFLRSxpQkFBckM7T0FERjs7O1NBSEcsSUFBSW5HLElBQUksQ0FBUixFQUFXVCxNQUFNeUcsYUFBYTVILE1BQW5DLEVBQTJDNEIsSUFBSVQsR0FBL0MsRUFBb0RTLEdBQXBELEVBQXlEO1lBQWhEQSxDQUFnRCxFQUF6Q1QsR0FBeUM7O0dBMUk5QztlQUFBLDJCQW1KSTtRQUNYLEtBQUtzRSxhQUFULEVBQXdCO1dBQ2pCeUMsaUJBQUw7O0dBckpTOzs7U0F5Sk47aUJBQ1EsdUJBQVk7V0FDbEJDLGlCQUFMO0tBRkc7a0JBSVMsd0JBQVk7V0FDbkJBLGlCQUFMO0tBTEc7aUJBT1EsdUJBQVk7VUFDbkIsQ0FBQyxLQUFLMUksR0FBVixFQUFlO2FBQ1IySSxnQkFBTDtPQURGLE1BRU87YUFDQWQsS0FBTDs7S0FYQzt1QkFjYyw2QkFBWTtVQUN6QixLQUFLN0gsR0FBVCxFQUFjO2FBQ1A2SCxLQUFMOztLQWhCQztpQkFtQlEsdUJBQVk7VUFDbkIsQ0FBQyxLQUFLN0gsR0FBVixFQUFlO2FBQ1IySSxnQkFBTDs7S0FyQkM7c0JBd0JhLDRCQUFZO1VBQ3hCLENBQUMsS0FBSzNJLEdBQVYsRUFBZTthQUNSMkksZ0JBQUw7O0tBMUJDO2lDQTZCd0IsdUNBQVk7VUFDbkMsQ0FBQyxLQUFLM0ksR0FBVixFQUFlO2FBQ1IySSxnQkFBTDs7S0EvQkM7cUJBQUEsNkJBa0NjOUQsR0FsQ2QsRUFrQ21CO1VBQ2xCQSxHQUFKLEVBQVM7YUFDRitELFFBQUwsR0FBZ0IsS0FBaEI7O1dBRUdDLFdBQUw7S0F0Q0c7Y0FBQSxzQkF3Q09oRSxHQXhDUCxFQXdDWWlFLE1BeENaLEVBd0NvQjtVQUNuQixLQUFLbEMsT0FBVCxFQUFrQjtVQUNkLENBQUMsS0FBSzVHLEdBQVYsRUFBZTtVQUNYLENBQUMrSSxFQUFFQyxXQUFGLENBQWNuRSxHQUFkLENBQUwsRUFBeUI7O1VBRXJCL0UsSUFBSSxDQUFSO1VBQ0lpSixFQUFFQyxXQUFGLENBQWNGLE1BQWQsS0FBeUJBLFdBQVcsQ0FBeEMsRUFBMkM7WUFDckNqRSxNQUFNaUUsTUFBVjs7VUFFRUcsTUFBTSxLQUFLQyxtQkFBTCxJQUE0QjtXQUNqQyxLQUFLQyxPQUFMLENBQWFDLE1BQWIsR0FBc0IsS0FBS0QsT0FBTCxDQUFhakQsS0FBYixHQUFxQixDQURWO1dBRWpDLEtBQUtpRCxPQUFMLENBQWFFLE1BQWIsR0FBc0IsS0FBS0YsT0FBTCxDQUFhOUMsTUFBYixHQUFzQjtPQUZqRDtXQUlLOEMsT0FBTCxDQUFhakQsS0FBYixHQUFxQixLQUFLaEcsWUFBTCxHQUFvQjJFLEdBQXpDO1dBQ0tzRSxPQUFMLENBQWE5QyxNQUFiLEdBQXNCLEtBQUtFLGFBQUwsR0FBcUIxQixHQUEzQzs7VUFFSSxDQUFDLEtBQUt5RSxZQUFOLElBQXNCLEtBQUtWLFFBQTNCLElBQXVDLENBQUMsS0FBS1csUUFBakQsRUFBMkQ7WUFDckRDLFVBQVUsQ0FBQzFKLElBQUksQ0FBTCxLQUFXbUosSUFBSW5KLENBQUosR0FBUSxLQUFLcUosT0FBTCxDQUFhQyxNQUFoQyxDQUFkO1lBQ0lLLFVBQVUsQ0FBQzNKLElBQUksQ0FBTCxLQUFXbUosSUFBSWxKLENBQUosR0FBUSxLQUFLb0osT0FBTCxDQUFhRSxNQUFoQyxDQUFkO2FBQ0tGLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixLQUFLRCxPQUFMLENBQWFDLE1BQWIsR0FBc0JJLE9BQTVDO2FBQ0tMLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixLQUFLRixPQUFMLENBQWFFLE1BQWIsR0FBc0JJLE9BQTVDOzs7VUFHRSxLQUFLQyxpQkFBVCxFQUE0QjthQUNyQkMsMkJBQUw7YUFDS0MsMEJBQUw7O0tBakVDOztxQkFvRVksc0JBQVUvRSxHQUFWLEVBQWVpRSxNQUFmLEVBQXVCOztVQUVsQyxDQUFDQyxFQUFFQyxXQUFGLENBQWNuRSxHQUFkLENBQUwsRUFBeUI7V0FDcEJnRixVQUFMLEdBQWtCaEYsTUFBTSxLQUFLM0UsWUFBN0I7VUFDSSxLQUFLNEosUUFBTCxFQUFKLEVBQXFCO1lBQ2ZuSyxLQUFLb0ssR0FBTCxDQUFTbEYsTUFBTWlFLE1BQWYsSUFBMEJqRSxPQUFPLElBQUksTUFBWCxDQUE5QixFQUFtRDtlQUM1Q2dDLFNBQUwsQ0FBZWpCLE9BQU9vRSxVQUF0QjtlQUNLbkMsS0FBTDs7O0tBM0VEO3NCQStFYSx1QkFBVWhELEdBQVYsRUFBZTs7VUFFM0IsQ0FBQ2tFLEVBQUVDLFdBQUYsQ0FBY25FLEdBQWQsQ0FBTCxFQUF5QjtXQUNwQmdGLFVBQUwsR0FBa0JoRixNQUFNLEtBQUswQixhQUE3QjtLQWxGRztzQkFvRmEsdUJBQVUxQixHQUFWLEVBQWU7O1VBRTNCLEtBQUtpRixRQUFMLEVBQUosRUFBcUI7YUFDZGxDLFNBQUwsQ0FBZSxLQUFLQyxLQUFwQjs7S0F2RkM7c0JBMEZhLHVCQUFVaEQsR0FBVixFQUFlOztVQUUzQixLQUFLaUYsUUFBTCxFQUFKLEVBQXFCO2FBQ2RsQyxTQUFMLENBQWUsS0FBS0MsS0FBcEI7O0tBN0ZDO2NBQUEsc0JBZ0dPaEQsR0FoR1AsRUFnR1k7V0FDVm1CLGFBQUwsR0FBcUIsQ0FBQyxFQUFFLEtBQUs4QixVQUFMLElBQW1CLEtBQUtDLEtBQUwsQ0FBV0MsT0FBOUIsSUFBeUNDLGdCQUEzQyxDQUF0QjtVQUNJcEQsR0FBSixFQUFTO2FBQ0ZxRCxlQUFMO09BREYsTUFFTzthQUNBTyxpQkFBTDs7O0dBOVBPOztXQW1RSjthQUFBLHVCQUNhOztXQUVid0IsS0FBTDtLQUhLO2FBQUEsdUJBTU07YUFDSixLQUFLdkwsTUFBWjtLQVBLO2NBQUEsd0JBVU87YUFDTCxLQUFLd0wsR0FBWjtLQVhLO2lCQUFBLDJCQWNVO2FBQ1IsS0FBS0MsVUFBTCxJQUFtQixLQUFLcEMsS0FBTCxDQUFXcUMsU0FBWCxDQUFxQkMsS0FBckIsQ0FBMkIsQ0FBM0IsQ0FBMUI7S0FmSztRQUFBLGdCQWtCRHRILE1BbEJDLEVBa0JPO1VBQ1IsQ0FBQ0EsTUFBRCxJQUFXLEtBQUs2RCxPQUFwQixFQUE2QjtVQUN6QjBELE9BQU8sS0FBS25CLE9BQUwsQ0FBYUMsTUFBeEI7VUFDSW1CLE9BQU8sS0FBS3BCLE9BQUwsQ0FBYUUsTUFBeEI7V0FDS0YsT0FBTCxDQUFhQyxNQUFiLElBQXVCckcsT0FBT2pELENBQTlCO1dBQ0txSixPQUFMLENBQWFFLE1BQWIsSUFBdUJ0RyxPQUFPaEQsQ0FBOUI7VUFDSSxLQUFLMkosaUJBQVQsRUFBNEI7YUFDckJFLDBCQUFMOztVQUVFLEtBQUtULE9BQUwsQ0FBYUMsTUFBYixLQUF3QmtCLElBQXhCLElBQWdDLEtBQUtuQixPQUFMLENBQWFFLE1BQWIsS0FBd0JrQixJQUE1RCxFQUFrRTthQUMzRDFELFNBQUwsQ0FBZWpCLE9BQU80RSxVQUF0QjthQUNLM0MsS0FBTDs7S0E3Qkc7ZUFBQSx5QkFpQ2tCO1VBQVo0QyxNQUFZLHVFQUFILENBQUc7O1dBQ2xCQyxJQUFMLENBQVUsRUFBRTVLLEdBQUcsQ0FBTCxFQUFRQyxHQUFHLENBQUMwSyxNQUFaLEVBQVY7S0FsQ0s7aUJBQUEsMkJBcUNvQjtVQUFaQSxNQUFZLHVFQUFILENBQUc7O1dBQ3BCQyxJQUFMLENBQVUsRUFBRTVLLEdBQUcsQ0FBTCxFQUFRQyxHQUFHMEssTUFBWCxFQUFWO0tBdENLO2lCQUFBLDJCQXlDb0I7VUFBWkEsTUFBWSx1RUFBSCxDQUFHOztXQUNwQkMsSUFBTCxDQUFVLEVBQUU1SyxHQUFHLENBQUMySyxNQUFOLEVBQWMxSyxHQUFHLENBQWpCLEVBQVY7S0ExQ0s7a0JBQUEsNEJBNkNxQjtVQUFaMEssTUFBWSx1RUFBSCxDQUFHOztXQUNyQkMsSUFBTCxDQUFVLEVBQUU1SyxHQUFHMkssTUFBTCxFQUFhMUssR0FBRyxDQUFoQixFQUFWO0tBOUNLO1FBQUEsa0JBaURnQztVQUFqQzRLLE1BQWlDLHVFQUF4QixJQUF3QjtVQUFsQkMsWUFBa0IsdUVBQUgsQ0FBRzs7VUFDakMsS0FBS2hFLE9BQVQsRUFBa0I7VUFDZGlFLFlBQVksS0FBS0MsU0FBTCxHQUFpQkYsWUFBakM7VUFDSUcsUUFBUyxLQUFLQyxXQUFMLEdBQW1CNUYsWUFBcEIsR0FBb0N5RixTQUFoRDtVQUNJL0ssSUFBSSxDQUFSO1VBQ0k2SyxNQUFKLEVBQVk7WUFDTixJQUFJSSxLQUFSO09BREYsTUFFTyxJQUFJLEtBQUs1QixPQUFMLENBQWFqRCxLQUFiLEdBQXFCWCxTQUF6QixFQUFvQztZQUNyQyxJQUFJd0YsS0FBUjs7Ozs7Ozs7O1VBU0UsS0FBS2xCLFVBQUwsS0FBb0IsSUFBeEIsRUFBOEI7YUFDdkJBLFVBQUwsR0FBa0IsS0FBS1YsT0FBTCxDQUFhakQsS0FBYixHQUFxQixLQUFLaEcsWUFBNUM7OztXQUdHMkosVUFBTCxJQUFtQi9KLENBQW5CO0tBdEVLO1VBQUEsb0JBeUVHO1dBQ0htTCxJQUFMLENBQVUsSUFBVjtLQTFFSztXQUFBLHFCQTZFSTtXQUNKQSxJQUFMLENBQVUsS0FBVjtLQTlFSztVQUFBLG9CQWlGVztVQUFWQyxJQUFVLHVFQUFILENBQUc7O1VBQ1osS0FBS0MsZUFBTCxJQUF3QixLQUFLQyxRQUE3QixJQUF5QyxLQUFLeEUsT0FBbEQsRUFBMkQ7YUFDcER5RSxTQUFTSCxJQUFULENBQVA7VUFDSTdHLE1BQU02RyxJQUFOLEtBQWVBLE9BQU8sQ0FBdEIsSUFBMkJBLE9BQU8sQ0FBQyxDQUF2QyxFQUEwQzs7ZUFFakMsQ0FBUDs7V0FFR0ksYUFBTCxDQUFtQkosSUFBbkI7S0F4Rks7U0FBQSxtQkEyRkU7VUFDSCxLQUFLQyxlQUFMLElBQXdCLEtBQUtDLFFBQTdCLElBQXlDLEtBQUt4RSxPQUFsRCxFQUEyRDtXQUN0RDJFLGVBQUwsQ0FBcUIsQ0FBckI7S0E3Rks7U0FBQSxtQkFnR0U7VUFDSCxLQUFLSixlQUFMLElBQXdCLEtBQUtDLFFBQTdCLElBQXlDLEtBQUt4RSxPQUFsRCxFQUEyRDtXQUN0RDJFLGVBQUwsQ0FBcUIsQ0FBckI7S0FsR0s7V0FBQSxxQkFxR0k7V0FDSjNELFNBQUwsQ0FBZSxLQUFLWixXQUFwQjtLQXRHSztZQUFBLHNCQXlHSzthQUNILENBQUMsQ0FBQyxLQUFLNEIsUUFBZDtLQTFHSztpQ0FBQSx5Q0E0R3dCNEMsUUE1R3hCLEVBNEdrQztVQUNuQ0EsUUFBSixFQUFjO1lBQ1JDLHFCQUFxQkQsU0FBU0UsWUFBVCxJQUF5QixDQUFsRDtZQUNJQyxzQkFBc0IsS0FBS2hOLE9BQS9CO1lBQ0lpTixtQkFBbUJELHNCQUFzQkYsa0JBQTdDO2lCQUNTckMsTUFBVCxHQUFrQm9DLFNBQVNwQyxNQUFULEdBQWtCd0MsZ0JBQXBDO2lCQUNTdkMsTUFBVCxHQUFrQm1DLFNBQVNuQyxNQUFULEdBQWtCdUMsZ0JBQXBDO2lCQUNTQyxLQUFULEdBQWlCTCxTQUFTSyxLQUFULEdBQWlCRCxnQkFBbEM7O2FBRUtFLGFBQUwsQ0FBbUJOLFFBQW5COztLQXJIRztpQkFBQSx5QkF3SFFBLFFBeEhSLEVBd0hrQjtVQUNuQixDQUFDQSxRQUFELElBQWEsS0FBSzVFLE9BQXRCLEVBQStCO1dBQzFCMEMsWUFBTCxHQUFvQmtDLFFBQXBCO1VBQ0l0SCxNQUFNc0gsU0FBUzdILFdBQVQsSUFBd0IsS0FBS0EsV0FBN0IsSUFBNEMsQ0FBdEQ7V0FDSzRILGVBQUwsQ0FBcUJySCxHQUFyQixFQUEwQixJQUExQjtLQTVISzttQkFBQSwyQkE4SFVwQyxJQTlIVixFQThIZ0JpSyxlQTlIaEIsRUE4SGlDO1VBQ2xDLENBQUMsS0FBS2pDLFFBQUwsRUFBTCxFQUFzQixPQUFPLEVBQVA7YUFDZixLQUFLcEwsTUFBTCxDQUFZc0QsU0FBWixDQUFzQkYsSUFBdEIsRUFBNEJpSyxlQUE1QixDQUFQO0tBaElLO2dCQUFBLHdCQW1JT3JMLFFBbklQLEVBbUlpQnNMLFFBbklqQixFQW1JMkJDLGVBbkkzQixFQW1JNEM7VUFDN0MsQ0FBQyxLQUFLbkMsUUFBTCxFQUFMLEVBQXNCO2lCQUNYLElBQVQ7OztXQUdHcEwsTUFBTCxDQUFZa0QsTUFBWixDQUFtQmxCLFFBQW5CLEVBQTZCc0wsUUFBN0IsRUFBdUNDLGVBQXZDO0tBeElLO2dCQUFBLDBCQTJJZ0I7Ozt3Q0FBTkMsSUFBTTtZQUFBOzs7VUFDakIsT0FBT0MsT0FBUCxJQUFrQixXQUF0QixFQUFtQzs7OzthQUk1QixJQUFJQSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO1lBQ2xDO2lCQUNHQyxZQUFMLGdCQUFrQixVQUFDQyxJQUFELEVBQVU7b0JBQ2xCQSxJQUFSO1dBREYsU0FFTUwsSUFGTjtTQURGLENBSUUsT0FBT00sR0FBUCxFQUFZO2lCQUNMQSxHQUFQOztPQU5HLENBQVA7S0FoSks7ZUFBQSx5QkEySlE7VUFDVCxDQUFDLEtBQUsxQyxRQUFMLEVBQUwsRUFBc0IsT0FBTyxFQUFQO3FCQUNHLEtBQUtYLE9BRmpCO1VBRVBDLE1BRk8sWUFFUEEsTUFGTztVQUVDQyxNQUZELFlBRUNBLE1BRkQ7OzthQUlOO3NCQUFBO3NCQUFBO2VBR0UsS0FBS1EsVUFIUDtxQkFJUSxLQUFLbEc7T0FKcEI7S0EvSks7K0JBQUEseUNBdUt3QjtVQUN6QjZILFdBQVcsS0FBS2lCLFdBQUwsRUFBZjtVQUNJakIsUUFBSixFQUFjO2lCQUNIRSxZQUFULEdBQXdCLEtBQUsvTSxPQUE3Qjs7YUFFSzZNLFFBQVA7S0E1S0s7b0JBQUEsOEJBK0thO1VBQ2QsT0FBT3BMLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7VUFDL0JzTSxNQUFNdk0sU0FBU3dNLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjthQUNPO2lCQUNJdk0sT0FBT0kscUJBQVAsSUFBZ0NKLE9BQU93TSxJQUF2QyxJQUErQ3hNLE9BQU95TSxVQUF0RCxJQUFvRXpNLE9BQU8wTSxRQUEzRSxJQUF1RjFNLE9BQU9pQyxJQURsRztlQUVFLGlCQUFpQnFLLEdBQWpCLElBQXdCLFlBQVlBO09BRjdDO0tBbExLO2NBQUEsd0JBd0xPO1VBQ1IsS0FBSzlGLE9BQVQsRUFBa0I7V0FDYm1CLEtBQUwsQ0FBV3FDLFNBQVgsQ0FBcUIyQyxLQUFyQjtLQTFMSztVQUFBLG9CQTZMeUI7VUFBeEJDLGNBQXdCLHVFQUFQLEtBQU87O1VBQzFCLENBQUMsS0FBS3BFLFFBQVYsRUFBb0I7V0FDZkQsZ0JBQUw7O1VBRUlzRSxXQUFXLEtBQUtqTixHQUFMLElBQVksSUFBM0I7V0FDS2tOLGFBQUwsR0FBcUIsSUFBckI7V0FDS2xOLEdBQUwsR0FBVyxJQUFYO1dBQ0ttSixPQUFMLEdBQWU7ZUFDTixDQURNO2dCQUVMLENBRks7Z0JBR0wsQ0FISztnQkFJTDtPQUpWO1dBTUt4RixXQUFMLEdBQW1CLENBQW5CO1dBQ0trRyxVQUFMLEdBQWtCLElBQWxCO1dBQ0tQLFlBQUwsR0FBb0IsSUFBcEI7V0FDS1YsUUFBTCxHQUFnQixLQUFoQjtVQUNJLENBQUNvRSxjQUFMLEVBQXFCO2FBQ2RqRixLQUFMLENBQVdxQyxTQUFYLENBQXFCNUYsS0FBckIsR0FBNkIsRUFBN0I7YUFDSzJGLFVBQUwsR0FBa0IsSUFBbEI7O1VBRUUsS0FBS2dELEtBQVQsRUFBZ0I7YUFDVEEsS0FBTCxDQUFXQyxLQUFYO2FBQ0tELEtBQUwsR0FBYSxJQUFiOzs7VUFHRUYsUUFBSixFQUFjO2FBQ1BwRyxTQUFMLENBQWVqQixPQUFPeUgsa0JBQXRCOztLQXhORztpQkFBQSx5QkE0TlFDLE1BNU5SLEVBNE5nQjtVQUNqQixDQUFDLEtBQUtDLFdBQVYsRUFBdUI7YUFDaEJBLFdBQUwsR0FBbUIsRUFBbkI7O1VBRUUsT0FBT0QsTUFBUCxLQUFrQixVQUFsQixJQUFnQyxLQUFLQyxXQUFMLENBQWlCdEksT0FBakIsQ0FBeUJxSSxNQUF6QixJQUFtQyxDQUF2RSxFQUEwRTthQUNuRUMsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0JGLE1BQXRCO09BREYsTUFFTztjQUNDRyxNQUFNLGtDQUFOLENBQU47O0tBbk9HO21CQUFBLDJCQXVPVXZPLEdBdk9WLEVBdU9lO1dBQ2YySCxTQUFMLENBQWUzSCxJQUFJNEMsSUFBbkIsRUFBeUI1QyxHQUF6QjtLQXhPSztXQUFBLG1CQTJPRXdPLElBM09GLEVBMk9RO1dBQ1JDLFlBQUwsQ0FBa0JELElBQWxCO0tBNU9LO3FCQUFBLCtCQStPYztVQUNmLEtBQUsxSCxhQUFULEVBQXdCO2FBQ2pCQyxTQUFMLEdBQWlCLENBQUNnQyxpQkFBaUIsS0FBS0YsS0FBTCxDQUFXQyxPQUE1QixFQUFxQzlCLEtBQXJDLENBQTJDMEgsS0FBM0MsQ0FBaUQsQ0FBakQsRUFBb0QsQ0FBQyxDQUFyRCxDQUFsQjthQUNLeEgsVUFBTCxHQUFrQixDQUFDNkIsaUJBQWlCLEtBQUtGLEtBQUwsQ0FBV0MsT0FBNUIsRUFBcUMzQixNQUFyQyxDQUE0Q3VILEtBQTVDLENBQWtELENBQWxELEVBQXFELENBQUMsQ0FBdEQsQ0FBbkI7O0tBbFBHO21CQUFBLDZCQXNQWTtXQUNaQyxpQkFBTDthQUNPeEYsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS3dGLGlCQUF2QztLQXhQSztxQkFBQSwrQkEyUGM7V0FDZEEsaUJBQUw7YUFDT3JGLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDLEtBQUtxRixpQkFBMUM7S0E3UEs7ZUFBQSx5QkFnUVE7V0FDUm5QLE1BQUwsR0FBYyxLQUFLcUosS0FBTCxDQUFXckosTUFBekI7V0FDS29QLFFBQUw7V0FDS3BQLE1BQUwsQ0FBWXFQLEtBQVosQ0FBa0JDLGVBQWxCLEdBQXFDLENBQUMsS0FBS0MsV0FBTixJQUFxQixLQUFLQSxXQUFMLElBQW9CLFNBQTFDLEdBQXVELGFBQXZELEdBQXdFLE9BQU8sS0FBS0EsV0FBWixLQUE0QixRQUE1QixHQUF1QyxLQUFLQSxXQUE1QyxHQUEwRCxFQUF0SztXQUNLL0QsR0FBTCxHQUFXLEtBQUt4TCxNQUFMLENBQVl3UCxVQUFaLENBQXVCLElBQXZCLENBQVg7V0FDS2hFLEdBQUwsQ0FBU2lFLHFCQUFULEdBQWlDLElBQWpDO1dBQ0tqRSxHQUFMLENBQVNrRSxxQkFBVCxHQUFpQyxNQUFqQztXQUNLbEUsR0FBTCxDQUFTbUUsMkJBQVQsR0FBdUMsSUFBdkM7V0FDS25FLEdBQUwsQ0FBU29FLHVCQUFULEdBQW1DLElBQW5DO1dBQ0twRSxHQUFMLENBQVNpRSxxQkFBVCxHQUFpQyxJQUFqQztXQUNLakIsYUFBTCxHQUFxQixJQUFyQjtXQUNLbE4sR0FBTCxHQUFXLElBQVg7V0FDSytILEtBQUwsQ0FBV3FDLFNBQVgsQ0FBcUI1RixLQUFyQixHQUE2QixFQUE3QjtXQUNLb0UsUUFBTCxHQUFnQixLQUFoQjtXQUNLdUIsVUFBTCxHQUFrQixJQUFsQjtXQUNLb0UsV0FBTDtVQUNJLENBQUMsS0FBSzNILE9BQVYsRUFBbUI7YUFDWkMsU0FBTCxDQUFlakIsT0FBT0MsVUFBdEIsRUFBa0MsSUFBbEM7O0tBalJHO1lBQUEsc0JBcVJLO1dBQ0xuSCxNQUFMLENBQVl3SCxLQUFaLEdBQW9CLEtBQUs4RSxXQUF6QjtXQUNLdE0sTUFBTCxDQUFZMkgsTUFBWixHQUFxQixLQUFLbUksWUFBMUI7V0FDSzlQLE1BQUwsQ0FBWXFQLEtBQVosQ0FBa0I3SCxLQUFsQixHQUEwQixDQUFDLEtBQUtGLGFBQUwsR0FBcUIsS0FBS0MsU0FBMUIsR0FBc0MsS0FBS0MsS0FBNUMsSUFBcUQsSUFBL0U7V0FDS3hILE1BQUwsQ0FBWXFQLEtBQVosQ0FBa0IxSCxNQUFsQixHQUEyQixDQUFDLEtBQUtMLGFBQUwsR0FBcUIsS0FBS0ksVUFBMUIsR0FBdUMsS0FBS0MsTUFBN0MsSUFBdUQsSUFBbEY7S0F6Uks7aUJBQUEseUJBNFJRNkUsSUE1UlIsRUE0UmM7VUFDZnZILGNBQWMsQ0FBbEI7Y0FDUXVILElBQVI7YUFDTyxDQUFMO3dCQUNnQixDQUFkOzthQUVHLENBQUw7d0JBQ2dCLENBQWQ7O2FBRUcsQ0FBTDt3QkFDZ0IsQ0FBZDs7YUFFRyxDQUFDLENBQU47d0JBQ2dCLENBQWQ7O2FBRUcsQ0FBQyxDQUFOO3dCQUNnQixDQUFkOzthQUVHLENBQUMsQ0FBTjt3QkFDZ0IsQ0FBZDs7O1dBR0NLLGVBQUwsQ0FBcUI1SCxXQUFyQjtLQWxUSzt3QkFBQSxrQ0FxVGlCOzs7VUFDbEIzRCxZQUFKO1VBQ0ksS0FBS3lPLE1BQUwsQ0FBWUMsV0FBWixJQUEyQixLQUFLRCxNQUFMLENBQVlDLFdBQVosQ0FBd0IsQ0FBeEIsQ0FBL0IsRUFBMkQ7WUFDckRDLFFBQVEsS0FBS0YsTUFBTCxDQUFZQyxXQUFaLENBQXdCLENBQXhCLENBQVo7WUFDTUUsR0FGbUQsR0FFdENELEtBRnNDLENBRW5EQyxHQUZtRDtZQUU5Q0MsR0FGOEMsR0FFdENGLEtBRnNDLENBRTlDRSxHQUY4Qzs7WUFHckRELE9BQU8sS0FBUCxJQUFnQkMsR0FBcEIsRUFBeUI7Z0JBQ2pCQSxHQUFOOzs7O1VBSUEsQ0FBQzdPLEdBQUwsRUFBVTs7VUFFTjhPLFNBQVMsU0FBVEEsTUFBUyxHQUFNO2VBQ1o1RSxHQUFMLENBQVNwRyxTQUFULENBQW1COUQsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsT0FBS2dMLFdBQW5DLEVBQWdELE9BQUt3RCxZQUFyRDtPQURGOztVQUlJekYsRUFBRWdHLFdBQUYsQ0FBYy9PLEdBQWQsQ0FBSixFQUF3Qjs7T0FBeEIsTUFFTztZQUNEZ1AsTUFBSixHQUFhRixNQUFiOztLQXhVRzt1QkFBQSxpQ0E0VWdCO1VBQ2pCNUUsTUFBTSxLQUFLQSxHQUFmO1VBQ0krRSxZQUFKLEdBQW1CLFFBQW5CO1VBQ0lDLFNBQUosR0FBZ0IsUUFBaEI7VUFDSUMsa0JBQWtCLEtBQUtuRSxXQUFMLEdBQW1CeEYsMEJBQW5CLEdBQWdELEtBQUtrSixXQUFMLENBQWlCbk8sTUFBdkY7VUFDSTZPLFdBQVksQ0FBQyxLQUFLQywyQkFBTixJQUFxQyxLQUFLQSwyQkFBTCxJQUFvQyxDQUExRSxHQUErRUYsZUFBL0UsR0FBaUcsS0FBS0UsMkJBQXJIO1VBQ0lDLElBQUosR0FBV0YsV0FBVyxlQUF0QjtVQUNJRyxTQUFKLEdBQWlCLENBQUMsS0FBS0MsZ0JBQU4sSUFBMEIsS0FBS0EsZ0JBQUwsSUFBeUIsU0FBcEQsR0FBaUUsU0FBakUsR0FBNkUsS0FBS0EsZ0JBQWxHO1VBQ0lDLFFBQUosQ0FBYSxLQUFLZixXQUFsQixFQUErQixLQUFLMUQsV0FBTCxHQUFtQixDQUFsRCxFQUFxRCxLQUFLd0QsWUFBTCxHQUFvQixDQUF6RTtLQXBWSztvQkFBQSw4QkF1VmE7V0FDYmtCLGdCQUFMO1dBQ0tDLG9CQUFMO1dBQ0tDLG1CQUFMO0tBMVZLO2VBQUEseUJBNlZROzs7VUFDVDNMLFlBQUo7VUFBU2pFLFlBQVQ7VUFDSSxLQUFLeU8sTUFBTCxDQUFZb0IsT0FBWixJQUF1QixLQUFLcEIsTUFBTCxDQUFZb0IsT0FBWixDQUFvQixDQUFwQixDQUEzQixFQUFtRDtZQUM3Q2xCLFFBQVEsS0FBS0YsTUFBTCxDQUFZb0IsT0FBWixDQUFvQixDQUFwQixDQUFaO1lBQ01qQixHQUYyQyxHQUU5QkQsS0FGOEIsQ0FFM0NDLEdBRjJDO1lBRXRDQyxHQUZzQyxHQUU5QkYsS0FGOEIsQ0FFdENFLEdBRnNDOztZQUc3Q0QsT0FBTyxLQUFQLElBQWdCQyxHQUFwQixFQUF5QjtnQkFDakJBLEdBQU47OztVQUdBLEtBQUtpQixZQUFMLElBQXFCLE9BQU8sS0FBS0EsWUFBWixLQUE2QixRQUF0RCxFQUFnRTtjQUN4RCxLQUFLQSxZQUFYO2NBQ00sSUFBSTlMLEtBQUosRUFBTjtZQUNJLENBQUMsU0FBU21CLElBQVQsQ0FBY2xCLEdBQWQsQ0FBRCxJQUF1QixDQUFDLFNBQVNrQixJQUFULENBQWNsQixHQUFkLENBQTVCLEVBQWdEO2NBQzFDOEwsWUFBSixDQUFpQixhQUFqQixFQUFnQyxXQUFoQzs7WUFFRTlMLEdBQUosR0FBVUEsR0FBVjtPQU5GLE1BT08sSUFBSStMLFFBQU8sS0FBS0YsWUFBWixNQUE2QixRQUE3QixJQUF5QyxLQUFLQSxZQUFMLFlBQTZCOUwsS0FBMUUsRUFBaUY7Y0FDaEYsS0FBSzhMLFlBQVg7O1VBRUUsQ0FBQzdMLEdBQUQsSUFBUSxDQUFDakUsR0FBYixFQUFrQjthQUNYMkksZ0JBQUw7OztXQUdHc0gsZ0JBQUwsR0FBd0IsSUFBeEI7O1VBRUlDLFVBQVUsU0FBVkEsT0FBVSxHQUFNO2VBQ2J2SCxnQkFBTDtlQUNLd0gsT0FBTCxHQUFlLEtBQWY7T0FGRjtXQUlLQSxPQUFMLEdBQWUsSUFBZjtVQUNJblEsSUFBSUMsUUFBUixFQUFrQjtZQUNaOEksRUFBRWdHLFdBQUYsQ0FBYy9PLEdBQWQsQ0FBSixFQUF3Qjs7ZUFFakJvUSxPQUFMLENBQWFwUSxHQUFiLEVBQWtCLENBQUNBLElBQUlxUSxPQUFKLENBQVksaUJBQVosQ0FBbkIsRUFBbUQsSUFBbkQ7U0FGRixNQUdPOzs7T0FKVCxNQU9PO2FBQ0FGLE9BQUwsR0FBZSxJQUFmO1lBQ0luQixNQUFKLEdBQWEsWUFBTTs7aUJBRVpvQixPQUFMLENBQWFwUSxHQUFiLEVBQWtCLENBQUNBLElBQUlxUSxPQUFKLENBQVksaUJBQVosQ0FBbkIsRUFBbUQsSUFBbkQ7U0FGRjs7WUFLSUMsT0FBSixHQUFjLFlBQU07O1NBQXBCOztLQXpZRztXQUFBLG1CQStZRXRRLEdBL1lGLEVBK1lpQztVQUExQjJELFdBQTBCLHVFQUFaLENBQVk7VUFBVGtNLE9BQVM7O1VBQ2xDLEtBQUtqSCxRQUFULEVBQW1CO2FBQ1pqQixNQUFMLENBQVksSUFBWjs7V0FFR3VGLGFBQUwsR0FBcUJsTixHQUFyQjtXQUNLQSxHQUFMLEdBQVdBLEdBQVg7O1VBRUlxRSxNQUFNVixXQUFOLENBQUosRUFBd0I7c0JBQ1IsQ0FBZDs7O1dBR0c0SCxlQUFMLENBQXFCNUgsV0FBckI7O1VBRUlrTSxPQUFKLEVBQWE7YUFDTmhKLFNBQUwsQ0FBZWpCLE9BQU8ySywwQkFBdEI7O0tBN1pHO2dCQUFBLHdCQWlhT3BELEtBamFQLEVBaWFjMEMsT0FqYWQsRUFpYXVCOzs7V0FDdkIxQyxLQUFMLEdBQWFBLEtBQWI7VUFDTXpPLFNBQVN5QixTQUFTd00sYUFBVCxDQUF1QixRQUF2QixDQUFmO1VBQ1E2RCxVQUhvQixHQUdRckQsS0FIUixDQUdwQnFELFVBSG9CO1VBR1JDLFdBSFEsR0FHUXRELEtBSFIsQ0FHUnNELFdBSFE7O2FBSXJCdkssS0FBUCxHQUFlc0ssVUFBZjthQUNPbkssTUFBUCxHQUFnQm9LLFdBQWhCO1VBQ012RyxNQUFNeEwsT0FBT3dQLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjtXQUNLaUMsT0FBTCxHQUFlLEtBQWY7VUFDTU8sWUFBWSxTQUFaQSxTQUFZLENBQUNiLE9BQUQsRUFBYTtZQUN6QixDQUFDLE9BQUsxQyxLQUFWLEVBQWlCO1lBQ2JySixTQUFKLENBQWMsT0FBS3FKLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDcUQsVUFBaEMsRUFBNENDLFdBQTVDO1lBQ01FLFFBQVEsSUFBSTNNLEtBQUosRUFBZDtjQUNNQyxHQUFOLEdBQVl2RixPQUFPc0QsU0FBUCxFQUFaO2NBQ01nTixNQUFOLEdBQWUsWUFBTTtpQkFDZGhQLEdBQUwsR0FBVzJRLEtBQVg7O2NBRUlkLE9BQUosRUFBYTttQkFDTmhILFdBQUw7V0FERixNQUVPO21CQUNBaEIsS0FBTDs7U0FOSjtPQUxGO2dCQWVVLElBQVY7VUFDTStJLGNBQWMsU0FBZEEsV0FBYyxHQUFNO2VBQ25CaEosU0FBTCxDQUFlLFlBQU07O2NBRWYsQ0FBQyxPQUFLdUYsS0FBTixJQUFlLE9BQUtBLEtBQUwsQ0FBVzBELEtBQTFCLElBQW1DLE9BQUsxRCxLQUFMLENBQVcyRCxNQUFsRCxFQUEwRDtnQ0FDcENGLFdBQXRCO1NBSEY7T0FERjtXQU9LekQsS0FBTCxDQUFXOUUsZ0JBQVgsQ0FBNEIsTUFBNUIsRUFBb0MsWUFBTTs4QkFDbEJ1SSxXQUF0QjtPQURGO0tBaGNLO2dCQUFBLHdCQXFjTzFSLEdBcmNQLEVBcWNZO1dBQ1o2UixlQUFMLENBQXFCN1IsR0FBckI7VUFDSSxDQUFDLEtBQUs0SyxRQUFMLEVBQUQsSUFBb0IsQ0FBQyxLQUFLa0gsb0JBQTFCLElBQWtELENBQUMsS0FBSzVGLFFBQXhELElBQW9FLENBQUMsS0FBSzZGLFlBQTFFLElBQTBGLENBQUMsS0FBS3JLLE9BQXBHLEVBQTZHO2FBQ3RHc0ssVUFBTDs7S0F4Y0c7bUJBQUEsMkJBNGNVaFMsR0E1Y1YsRUE0Y2U7V0FDZjZSLGVBQUwsQ0FBcUI3UixHQUFyQjtVQUNJLEtBQUtpUyxZQUFMLElBQXFCLEtBQUtoRSxLQUE5QixFQUFxQztZQUMvQixLQUFLQSxLQUFMLENBQVcyRCxNQUFYLElBQXFCLEtBQUszRCxLQUFMLENBQVcwRCxLQUFwQyxFQUEyQztlQUNwQzFELEtBQUwsQ0FBV2lFLElBQVg7U0FERixNQUVPO2VBQ0FqRSxLQUFMLENBQVdDLEtBQVg7Ozs7S0FsZEM7c0JBQUEsZ0NBd2RlO1VBQ2hCaUUsUUFBUSxLQUFLdEosS0FBTCxDQUFXcUMsU0FBdkI7VUFDSSxDQUFDaUgsTUFBTWhILEtBQU4sQ0FBWTlKLE1BQWIsSUFBdUIsS0FBS3FHLE9BQWhDLEVBQXlDOztVQUVyQzhHLE9BQU8yRCxNQUFNaEgsS0FBTixDQUFZLENBQVosQ0FBWDtXQUNLc0QsWUFBTCxDQUFrQkQsSUFBbEI7S0E3ZEs7Z0JBQUEsd0JBZ2VPQSxJQWhlUCxFQWdlYTs7O1dBQ2J1QyxnQkFBTCxHQUF3QixLQUF4QjtXQUNLRSxPQUFMLEdBQWUsSUFBZjtXQUNLdEosU0FBTCxDQUFlakIsT0FBTzBMLGlCQUF0QixFQUF5QzVELElBQXpDO1dBQ0t2RCxVQUFMLEdBQWtCdUQsSUFBbEI7VUFDSSxDQUFDLEtBQUs2RCxnQkFBTCxDQUFzQjdELElBQXRCLENBQUwsRUFBa0M7YUFDM0J5QyxPQUFMLEdBQWUsS0FBZjthQUNLdEosU0FBTCxDQUFlakIsT0FBTzRMLHNCQUF0QixFQUE4QzlELElBQTlDO2VBQ08sS0FBUDs7VUFFRSxDQUFDLEtBQUsrRCxnQkFBTCxDQUFzQi9ELElBQXRCLENBQUwsRUFBa0M7YUFDM0J5QyxPQUFMLEdBQWUsS0FBZjthQUNLdEosU0FBTCxDQUFlakIsT0FBTzhMLHdCQUF0QixFQUFnRGhFLElBQWhEO1lBQ0k1TCxPQUFPNEwsS0FBSzVMLElBQUwsSUFBYTRMLEtBQUtpRSxJQUFMLENBQVVDLFdBQVYsR0FBd0IzUCxLQUF4QixDQUE4QixHQUE5QixFQUFtQzRQLEdBQW5DLEVBQXhCO2VBQ08sS0FBUDs7O1VBR0UsT0FBT3pSLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBT0EsT0FBT3lNLFVBQWQsS0FBNkIsV0FBbEUsRUFBK0U7WUFDekVpRixLQUFLLElBQUlqRixVQUFKLEVBQVQ7V0FDR21DLE1BQUgsR0FBWSxVQUFDNUcsQ0FBRCxFQUFPO2NBQ2IySixXQUFXM0osRUFBRTRKLE1BQUYsQ0FBU0MsTUFBeEI7Y0FDTTFPLFNBQVN3RixFQUFFbUosWUFBRixDQUFlSCxRQUFmLENBQWY7Y0FDTUksVUFBVSxTQUFTaE4sSUFBVCxDQUFjdUksS0FBSzVMLElBQW5CLENBQWhCO2NBQ0lxUSxPQUFKLEVBQWE7Z0JBQ1BoRixRQUFRaE4sU0FBU3dNLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBWjtrQkFDTTFJLEdBQU4sR0FBWThOLFFBQVo7dUJBQ1csSUFBWDtnQkFDSTVFLE1BQU1pRixVQUFOLElBQW9CakYsTUFBTWtGLGdCQUE5QixFQUFnRDtxQkFDekNDLFlBQUwsQ0FBa0JuRixLQUFsQjthQURGLE1BRU87b0JBQ0M5RSxnQkFBTixDQUF1QixTQUF2QixFQUFrQyxZQUFNOzt1QkFFakNpSyxZQUFMLENBQWtCbkYsS0FBbEI7ZUFGRixFQUdHLEtBSEg7O1dBUEosTUFZTztnQkFDRHhKLGNBQWMsQ0FBbEI7Z0JBQ0k7NEJBQ1lvRixFQUFFd0osa0JBQUYsQ0FBcUJ4SixFQUFFeUosbUJBQUYsQ0FBc0JqUCxNQUF0QixDQUFyQixDQUFkO2FBREYsQ0FFRSxPQUFPaUosR0FBUCxFQUFZO2dCQUNWN0ksY0FBYyxDQUFsQixFQUFxQkEsY0FBYyxDQUFkO2dCQUNqQjNELE1BQU0sSUFBSWdFLEtBQUosRUFBVjtnQkFDSUMsR0FBSixHQUFVOE4sUUFBVjt1QkFDVyxJQUFYO2dCQUNJL0MsTUFBSixHQUFhLFlBQU07cUJBQ1pvQixPQUFMLENBQWFwUSxHQUFiLEVBQWtCMkQsV0FBbEI7cUJBQ0trRCxTQUFMLENBQWVqQixPQUFPNk0sZUFBdEI7YUFGRjs7U0F6Qko7V0ErQkdDLGFBQUgsQ0FBaUJoRixJQUFqQjs7S0FsaEJHO29CQUFBLDRCQXNoQldBLElBdGhCWCxFQXNoQmlCO1VBQ2xCLENBQUNBLElBQUwsRUFBVyxPQUFPLEtBQVA7VUFDUCxDQUFDLEtBQUtpRixhQUFOLElBQXVCLEtBQUtBLGFBQUwsSUFBc0IsQ0FBakQsRUFBb0QsT0FBTyxJQUFQOzthQUU3Q2pGLEtBQUtrRixJQUFMLEdBQVksS0FBS0QsYUFBeEI7S0ExaEJLO29CQUFBLDRCQTZoQldqRixJQTdoQlgsRUE2aEJpQjtVQUNoQm1GLHFCQUFzQixLQUFLMUIsWUFBTCxJQUFxQixTQUFTaE0sSUFBVCxDQUFjdUksS0FBSzVMLElBQW5CLENBQXJCLElBQWlEM0IsU0FBU3dNLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0NtRyxXQUFoQyxDQUE0Q3BGLEtBQUs1TCxJQUFqRCxDQUFsRCxJQUE2RyxTQUFTcUQsSUFBVCxDQUFjdUksS0FBSzVMLElBQW5CLENBQXhJO1VBQ0ksQ0FBQytRLGtCQUFMLEVBQXlCLE9BQU8sS0FBUDtVQUNyQixDQUFDLEtBQUtFLE1BQVYsRUFBa0IsT0FBTyxJQUFQO1VBQ2RBLFNBQVMsS0FBS0EsTUFBbEI7VUFDSUMsZUFBZUQsT0FBT0UsT0FBUCxDQUFlLE9BQWYsRUFBd0IsRUFBeEIsQ0FBbkI7VUFDSXhRLFFBQVFzUSxPQUFPOVEsS0FBUCxDQUFhLEdBQWIsQ0FBWjtXQUNLLElBQUlFLElBQUksQ0FBUixFQUFXVCxNQUFNZSxNQUFNbEMsTUFBNUIsRUFBb0M0QixJQUFJVCxHQUF4QyxFQUE2Q1MsR0FBN0MsRUFBa0Q7WUFDNUNMLE9BQU9XLE1BQU1OLENBQU4sQ0FBWDtZQUNJK1EsSUFBSXBSLEtBQUtxUixJQUFMLEVBQVI7WUFDSUQsRUFBRUUsTUFBRixDQUFTLENBQVQsS0FBZSxHQUFuQixFQUF3QjtjQUNsQjFGLEtBQUtpRSxJQUFMLENBQVVDLFdBQVYsR0FBd0IzUCxLQUF4QixDQUE4QixHQUE5QixFQUFtQzRQLEdBQW5DLE9BQTZDcUIsRUFBRXRCLFdBQUYsR0FBZ0JoRSxLQUFoQixDQUFzQixDQUF0QixDQUFqRCxFQUEyRSxPQUFPLElBQVA7U0FEN0UsTUFFTyxJQUFJLFFBQVF6SSxJQUFSLENBQWErTixDQUFiLENBQUosRUFBcUI7Y0FDdEJHLGVBQWUzRixLQUFLNUwsSUFBTCxDQUFVbVIsT0FBVixDQUFrQixPQUFsQixFQUEyQixFQUEzQixDQUFuQjtjQUNJSSxpQkFBaUJMLFlBQXJCLEVBQW1DO21CQUMxQixJQUFQOztTQUhHLE1BS0EsSUFBSXRGLEtBQUs1TCxJQUFMLEtBQWNBLElBQWxCLEVBQXdCO2lCQUN0QixJQUFQOzs7O2FBSUcsS0FBUDtLQW5qQks7ZUFBQSx1QkFzakJNZ0ssYUF0akJOLEVBc2pCcUI7VUFDdEIsQ0FBQyxLQUFLOUwsR0FBVixFQUFlO1VBQ1htSixVQUFVLEtBQUtBLE9BQW5COztXQUVLakosWUFBTCxHQUFvQixLQUFLRixHQUFMLENBQVNFLFlBQTdCO1dBQ0txRyxhQUFMLEdBQXFCLEtBQUt2RyxHQUFMLENBQVN1RyxhQUE5Qjs7Y0FFUTZDLE1BQVIsR0FBaUJMLEVBQUVDLFdBQUYsQ0FBY0csUUFBUUMsTUFBdEIsSUFBZ0NELFFBQVFDLE1BQXhDLEdBQWlELENBQWxFO2NBQ1FDLE1BQVIsR0FBaUJOLEVBQUVDLFdBQUYsQ0FBY0csUUFBUUUsTUFBdEIsSUFBZ0NGLFFBQVFFLE1BQXhDLEdBQWlELENBQWxFOztVQUVJLEtBQUtLLGlCQUFULEVBQTRCO2FBQ3JCNEosV0FBTDtPQURGLE1BRU8sSUFBSSxDQUFDLEtBQUsxSyxRQUFWLEVBQW9CO1lBQ3JCLEtBQUsySyxXQUFMLElBQW9CLFNBQXhCLEVBQW1DO2VBQzVCQyxVQUFMO1NBREYsTUFFTyxJQUFJLEtBQUtELFdBQUwsSUFBb0IsU0FBeEIsRUFBbUM7ZUFDbkNFLFlBQUw7U0FESyxNQUVBO2VBQ0FILFdBQUw7O09BTkcsTUFRQTthQUNBbkssT0FBTCxDQUFhakQsS0FBYixHQUFxQixLQUFLaEcsWUFBTCxHQUFvQixLQUFLMkosVUFBOUM7YUFDS1YsT0FBTCxDQUFhOUMsTUFBYixHQUFzQixLQUFLRSxhQUFMLEdBQXFCLEtBQUtzRCxVQUFoRDs7O1VBR0UsQ0FBQyxLQUFLakIsUUFBVixFQUFvQjtZQUNkLE1BQU16RCxJQUFOLENBQVcsS0FBS3VPLGVBQWhCLENBQUosRUFBc0M7a0JBQzVCckssTUFBUixHQUFpQixDQUFqQjtTQURGLE1BRU8sSUFBSSxTQUFTbEUsSUFBVCxDQUFjLEtBQUt1TyxlQUFuQixDQUFKLEVBQXlDO2tCQUN0Q3JLLE1BQVIsR0FBaUIsS0FBS21GLFlBQUwsR0FBb0JyRixRQUFROUMsTUFBN0M7OztZQUdFLE9BQU9sQixJQUFQLENBQVksS0FBS3VPLGVBQWpCLENBQUosRUFBdUM7a0JBQzdCdEssTUFBUixHQUFpQixDQUFqQjtTQURGLE1BRU8sSUFBSSxRQUFRakUsSUFBUixDQUFhLEtBQUt1TyxlQUFsQixDQUFKLEVBQXdDO2tCQUNyQ3RLLE1BQVIsR0FBaUIsS0FBSzRCLFdBQUwsR0FBbUI3QixRQUFRakQsS0FBNUM7OztZQUdFLGtCQUFrQmYsSUFBbEIsQ0FBdUIsS0FBS3VPLGVBQTVCLENBQUosRUFBa0Q7Y0FDNUN6QixTQUFTLHNCQUFzQjNPLElBQXRCLENBQTJCLEtBQUtvUSxlQUFoQyxDQUFiO2NBQ0k1VCxJQUFJLENBQUNtUyxPQUFPLENBQVAsQ0FBRCxHQUFhLEdBQXJCO2NBQ0lsUyxJQUFJLENBQUNrUyxPQUFPLENBQVAsQ0FBRCxHQUFhLEdBQXJCO2tCQUNRN0ksTUFBUixHQUFpQnRKLEtBQUssS0FBS2tMLFdBQUwsR0FBbUI3QixRQUFRakQsS0FBaEMsQ0FBakI7a0JBQ1FtRCxNQUFSLEdBQWlCdEosS0FBSyxLQUFLeU8sWUFBTCxHQUFvQnJGLFFBQVE5QyxNQUFqQyxDQUFqQjs7Ozt1QkFJYSxLQUFLc04sY0FBTCxFQUFqQjs7VUFFSTdILGlCQUFpQixLQUFLcEMsaUJBQTFCLEVBQTZDO2FBQ3RDdUIsSUFBTCxDQUFVLEtBQVYsRUFBaUIsQ0FBakI7T0FERixNQUVPO2FBQ0FQLElBQUwsQ0FBVSxFQUFFNUssR0FBRyxDQUFMLEVBQVFDLEdBQUcsQ0FBWCxFQUFWOztXQUVHOEgsS0FBTDtLQTVtQks7ZUFBQSx5QkErbUJRO1VBQ1QrTCxXQUFXLEtBQUsxVCxZQUFwQjtVQUNJMlQsWUFBWSxLQUFLdE4sYUFBckI7VUFDSXVOLGNBQWMsS0FBSzlJLFdBQUwsR0FBbUIsS0FBS3dELFlBQTFDO1VBQ0kzRSxtQkFBSjs7VUFFSSxLQUFLa0ssV0FBTCxHQUFtQkQsV0FBdkIsRUFBb0M7cUJBQ3JCRCxZQUFZLEtBQUtyRixZQUE5QjthQUNLckYsT0FBTCxDQUFhakQsS0FBYixHQUFxQjBOLFdBQVcvSixVQUFoQzthQUNLVixPQUFMLENBQWE5QyxNQUFiLEdBQXNCLEtBQUttSSxZQUEzQjthQUNLckYsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLEVBQUUsS0FBS0QsT0FBTCxDQUFhakQsS0FBYixHQUFxQixLQUFLOEUsV0FBNUIsSUFBMkMsQ0FBakU7YUFDSzdCLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixDQUF0QjtPQUxGLE1BTU87cUJBQ1F1SyxXQUFXLEtBQUs1SSxXQUE3QjthQUNLN0IsT0FBTCxDQUFhOUMsTUFBYixHQUFzQndOLFlBQVloSyxVQUFsQzthQUNLVixPQUFMLENBQWFqRCxLQUFiLEdBQXFCLEtBQUs4RSxXQUExQjthQUNLN0IsT0FBTCxDQUFhRSxNQUFiLEdBQXNCLEVBQUUsS0FBS0YsT0FBTCxDQUFhOUMsTUFBYixHQUFzQixLQUFLbUksWUFBN0IsSUFBNkMsQ0FBbkU7YUFDS3JGLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixDQUF0Qjs7S0Fob0JHO2NBQUEsd0JBb29CTztVQUNSd0ssV0FBVyxLQUFLMVQsWUFBcEI7VUFDSTJULFlBQVksS0FBS3ROLGFBQXJCO1VBQ0l1TixjQUFjLEtBQUs5SSxXQUFMLEdBQW1CLEtBQUt3RCxZQUExQztVQUNJM0UsbUJBQUo7VUFDSSxLQUFLa0ssV0FBTCxHQUFtQkQsV0FBdkIsRUFBb0M7cUJBQ3JCRixXQUFXLEtBQUs1SSxXQUE3QjthQUNLN0IsT0FBTCxDQUFhOUMsTUFBYixHQUFzQndOLFlBQVloSyxVQUFsQzthQUNLVixPQUFMLENBQWFqRCxLQUFiLEdBQXFCLEtBQUs4RSxXQUExQjthQUNLN0IsT0FBTCxDQUFhRSxNQUFiLEdBQXNCLEVBQUUsS0FBS0YsT0FBTCxDQUFhOUMsTUFBYixHQUFzQixLQUFLbUksWUFBN0IsSUFBNkMsQ0FBbkU7YUFDS3JGLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixDQUF0QjtPQUxGLE1BTU87cUJBQ1F5SyxZQUFZLEtBQUtyRixZQUE5QjthQUNLckYsT0FBTCxDQUFhakQsS0FBYixHQUFxQjBOLFdBQVcvSixVQUFoQzthQUNLVixPQUFMLENBQWE5QyxNQUFiLEdBQXNCLEtBQUttSSxZQUEzQjthQUNLckYsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLEVBQUUsS0FBS0QsT0FBTCxDQUFhakQsS0FBYixHQUFxQixLQUFLOEUsV0FBNUIsSUFBMkMsQ0FBakU7YUFDSzdCLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixDQUF0Qjs7S0FwcEJHO2dCQUFBLDBCQXdwQlM7VUFDVnVLLFdBQVcsS0FBSzFULFlBQXBCO1VBQ0kyVCxZQUFZLEtBQUt0TixhQUFyQjtXQUNLNEMsT0FBTCxDQUFhakQsS0FBYixHQUFxQjBOLFFBQXJCO1dBQ0t6SyxPQUFMLENBQWE5QyxNQUFiLEdBQXNCd04sU0FBdEI7V0FDSzFLLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixFQUFFLEtBQUtELE9BQUwsQ0FBYWpELEtBQWIsR0FBcUIsS0FBSzhFLFdBQTVCLElBQTJDLENBQWpFO1dBQ0s3QixPQUFMLENBQWFFLE1BQWIsR0FBc0IsRUFBRSxLQUFLRixPQUFMLENBQWE5QyxNQUFiLEdBQXNCLEtBQUttSSxZQUE3QixJQUE2QyxDQUFuRTtLQTlwQks7dUJBQUEsK0JBaXFCY3RQLEdBanFCZCxFQWlxQm1CO1dBQ25CNlIsZUFBTCxDQUFxQjdSLEdBQXJCO1VBQ0ksS0FBSzBILE9BQVQsRUFBa0I7V0FDYnFLLFlBQUwsR0FBb0IsSUFBcEI7V0FDSytDLFlBQUwsR0FBb0IsS0FBcEI7VUFDSUMsZUFBZWxMLEVBQUVtTCxnQkFBRixDQUFtQmhWLEdBQW5CLEVBQXdCLElBQXhCLENBQW5CO1dBQ0tpVixpQkFBTCxHQUF5QkYsWUFBekI7O1VBRUksS0FBSzdJLFFBQVQsRUFBbUI7O1VBRWYsQ0FBQyxLQUFLdEIsUUFBTCxFQUFELElBQW9CLENBQUMsS0FBS2tILG9CQUE5QixFQUFvRDthQUM3Q29ELFFBQUwsR0FBZ0IsSUFBSXhULElBQUosR0FBV3lULE9BQVgsRUFBaEI7Ozs7VUFJRW5WLElBQUlvVixLQUFKLElBQWFwVixJQUFJb1YsS0FBSixHQUFZLENBQTdCLEVBQWdDOztVQUU1QixDQUFDcFYsSUFBSUUsT0FBTCxJQUFnQkYsSUFBSUUsT0FBSixDQUFZbUIsTUFBWixLQUF1QixDQUEzQyxFQUE4QzthQUN2Q2dVLFFBQUwsR0FBZ0IsSUFBaEI7YUFDS0MsUUFBTCxHQUFnQixLQUFoQjtZQUNJQyxRQUFRMUwsRUFBRW1MLGdCQUFGLENBQW1CaFYsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBWjthQUNLd1YsZUFBTCxHQUF1QkQsS0FBdkI7OztVQUdFdlYsSUFBSUUsT0FBSixJQUFlRixJQUFJRSxPQUFKLENBQVltQixNQUFaLEtBQXVCLENBQXRDLElBQTJDLENBQUMsS0FBS29VLGtCQUFyRCxFQUF5RTthQUNsRUosUUFBTCxHQUFnQixLQUFoQjthQUNLQyxRQUFMLEdBQWdCLElBQWhCO2FBQ0tJLGFBQUwsR0FBcUI3TCxFQUFFOEwsZ0JBQUYsQ0FBbUIzVixHQUFuQixFQUF3QixJQUF4QixDQUFyQjs7Ozs7Ozs7Ozs7S0E1ckJHO3FCQUFBLDZCQXlzQllBLEdBenNCWixFQXlzQmlCO1dBQ2pCNlIsZUFBTCxDQUFxQjdSLEdBQXJCO1VBQ0ksS0FBSzBILE9BQVQsRUFBa0I7VUFDZGtPLHNCQUFzQixDQUExQjtVQUNJLEtBQUtYLGlCQUFULEVBQTRCO1lBQ3RCRixlQUFlbEwsRUFBRW1MLGdCQUFGLENBQW1CaFYsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBbkI7OEJBQ3NCUyxLQUFLQyxJQUFMLENBQVVELEtBQUtFLEdBQUwsQ0FBU29VLGFBQWFuVSxDQUFiLEdBQWlCLEtBQUtxVSxpQkFBTCxDQUF1QnJVLENBQWpELEVBQW9ELENBQXBELElBQXlESCxLQUFLRSxHQUFMLENBQVNvVSxhQUFhbFUsQ0FBYixHQUFpQixLQUFLb1UsaUJBQUwsQ0FBdUJwVSxDQUFqRCxFQUFvRCxDQUFwRCxDQUFuRSxLQUE4SCxDQUFwSjs7VUFFRSxLQUFLcUwsUUFBVCxFQUFtQjtVQUNmLENBQUMsS0FBS3RCLFFBQUwsRUFBRCxJQUFvQixDQUFDLEtBQUtrSCxvQkFBOUIsRUFBb0Q7WUFDOUMrRCxTQUFTLElBQUluVSxJQUFKLEdBQVd5VCxPQUFYLEVBQWI7WUFDS1Msc0JBQXNCeFAsb0JBQXZCLElBQWdEeVAsU0FBUyxLQUFLWCxRQUFkLEdBQXlCL08sZ0JBQXpFLElBQTZGLEtBQUs0TCxZQUF0RyxFQUFvSDtlQUM3R0MsVUFBTDs7YUFFR2tELFFBQUwsR0FBZ0IsQ0FBaEI7Ozs7V0FJR0csUUFBTCxHQUFnQixLQUFoQjtXQUNLQyxRQUFMLEdBQWdCLEtBQWhCO1dBQ0tJLGFBQUwsR0FBcUIsQ0FBckI7V0FDS0YsZUFBTCxHQUF1QixJQUF2QjtXQUNLVixZQUFMLEdBQW9CLEtBQXBCO1dBQ0tHLGlCQUFMLEdBQXlCLElBQXpCO0tBaHVCSztzQkFBQSw4QkFtdUJhalYsR0FudUJiLEVBbXVCa0I7V0FDbEI2UixlQUFMLENBQXFCN1IsR0FBckI7VUFDSSxLQUFLMEgsT0FBVCxFQUFrQjtXQUNib04sWUFBTCxHQUFvQixJQUFwQjtVQUNJLENBQUMsS0FBS2xLLFFBQUwsRUFBTCxFQUFzQjtVQUNsQjJLLFFBQVExTCxFQUFFbUwsZ0JBQUYsQ0FBbUJoVixHQUFuQixFQUF3QixJQUF4QixDQUFaO1dBQ0tnSyxtQkFBTCxHQUEyQnVMLEtBQTNCOztVQUVJLEtBQUtySixRQUFMLElBQWlCLEtBQUs0SixpQkFBMUIsRUFBNkM7O1VBRXpDQyxjQUFKO1VBQ0ksQ0FBQy9WLElBQUlFLE9BQUwsSUFBZ0JGLElBQUlFLE9BQUosQ0FBWW1CLE1BQVosS0FBdUIsQ0FBM0MsRUFBOEM7WUFDeEMsQ0FBQyxLQUFLZ1UsUUFBVixFQUFvQjtZQUNoQixLQUFLRyxlQUFULEVBQTBCO2VBQ25CaEssSUFBTCxDQUFVO2VBQ0wrSixNQUFNM1UsQ0FBTixHQUFVLEtBQUs0VSxlQUFMLENBQXFCNVUsQ0FEMUI7ZUFFTDJVLE1BQU0xVSxDQUFOLEdBQVUsS0FBSzJVLGVBQUwsQ0FBcUIzVTtXQUZwQzs7YUFLRzJVLGVBQUwsR0FBdUJELEtBQXZCOzs7VUFHRXZWLElBQUlFLE9BQUosSUFBZUYsSUFBSUUsT0FBSixDQUFZbUIsTUFBWixLQUF1QixDQUF0QyxJQUEyQyxDQUFDLEtBQUtvVSxrQkFBckQsRUFBeUU7WUFDbkUsQ0FBQyxLQUFLSCxRQUFWLEVBQW9CO1lBQ2hCVSxXQUFXbk0sRUFBRThMLGdCQUFGLENBQW1CM1YsR0FBbkIsRUFBd0IsSUFBeEIsQ0FBZjtZQUNJaVcsUUFBUUQsV0FBVyxLQUFLTixhQUE1QjthQUNLM0osSUFBTCxDQUFVa0ssUUFBUSxDQUFsQixFQUFxQjFQLGtCQUFyQjthQUNLbVAsYUFBTCxHQUFxQk0sUUFBckI7O0tBOXZCRzt1QkFBQSwrQkFrd0JjaFcsR0Fsd0JkLEVBa3dCbUI7V0FDbkI2UixlQUFMLENBQXFCN1IsR0FBckI7VUFDSSxLQUFLMEgsT0FBVCxFQUFrQjtXQUNic0MsbUJBQUwsR0FBMkIsSUFBM0I7S0Fyd0JLO2dCQUFBLHdCQXd3Qk9oSyxHQXh3QlAsRUF3d0JZOzs7V0FDWjZSLGVBQUwsQ0FBcUI3UixHQUFyQjtVQUNJLEtBQUswSCxPQUFULEVBQWtCO1VBQ2QsS0FBS3dFLFFBQUwsSUFBaUIsS0FBS2dLLG1CQUF0QixJQUE2QyxDQUFDLEtBQUt0TCxRQUFMLEVBQWxELEVBQW1FO1VBQy9EbUwsY0FBSjtXQUNLSSxTQUFMLEdBQWlCLElBQWpCO1VBQ0luVyxJQUFJb1csVUFBSixHQUFpQixDQUFqQixJQUFzQnBXLElBQUlxVyxNQUFKLEdBQWEsQ0FBbkMsSUFBd0NyVyxJQUFJc1csTUFBSixHQUFhLENBQXpELEVBQTREO2FBQ3JEdkssSUFBTCxDQUFVLEtBQUt3SyxtQkFBZjtPQURGLE1BRU8sSUFBSXZXLElBQUlvVyxVQUFKLEdBQWlCLENBQWpCLElBQXNCcFcsSUFBSXFXLE1BQUosR0FBYSxDQUFuQyxJQUF3Q3JXLElBQUlzVyxNQUFKLEdBQWEsQ0FBekQsRUFBNEQ7YUFDNUR2SyxJQUFMLENBQVUsQ0FBQyxLQUFLd0ssbUJBQWhCOztXQUVHN04sU0FBTCxDQUFlLFlBQU07ZUFDZHlOLFNBQUwsR0FBaUIsS0FBakI7T0FERjtLQW54Qks7b0JBQUEsNEJBd3hCV25XLEdBeHhCWCxFQXd4QmdCO1dBQ2hCNlIsZUFBTCxDQUFxQjdSLEdBQXJCO1VBQ0ksS0FBSzBILE9BQVQsRUFBa0I7VUFDZCxLQUFLd0UsUUFBTCxJQUFpQixLQUFLc0ssa0JBQXRCLElBQTRDLENBQUMzTSxFQUFFNE0sWUFBRixDQUFlelcsR0FBZixDQUFqRCxFQUFzRTtVQUNsRSxLQUFLNEssUUFBTCxNQUFtQixDQUFDLEtBQUs4TCxXQUE3QixFQUEwQztXQUNyQ0MsZUFBTCxHQUF1QixJQUF2QjtLQTd4Qks7b0JBQUEsNEJBZ3lCVzNXLEdBaHlCWCxFQWd5QmdCO1dBQ2hCNlIsZUFBTCxDQUFxQjdSLEdBQXJCO1VBQ0ksS0FBSzBILE9BQVQsRUFBa0I7VUFDZCxDQUFDLEtBQUtpUCxlQUFOLElBQXlCLENBQUM5TSxFQUFFNE0sWUFBRixDQUFlelcsR0FBZixDQUE5QixFQUFtRDtXQUM5QzJXLGVBQUwsR0FBdUIsS0FBdkI7S0FweUJLO21CQUFBLDJCQXV5QlUzVyxHQXZ5QlYsRUF1eUJlO1dBQ2Y2UixlQUFMLENBQXFCN1IsR0FBckI7S0F4eUJLO2VBQUEsdUJBMnlCTUEsR0EzeUJOLEVBMnlCVztXQUNYNlIsZUFBTCxDQUFxQjdSLEdBQXJCO1VBQ0ksS0FBSzBILE9BQVQsRUFBa0I7VUFDZCxDQUFDLEtBQUtpUCxlQUFOLElBQXlCLENBQUM5TSxFQUFFNE0sWUFBRixDQUFlelcsR0FBZixDQUE5QixFQUFtRDtVQUMvQyxLQUFLNEssUUFBTCxNQUFtQixDQUFDLEtBQUs4TCxXQUE3QixFQUEwQzs7O1dBR3JDQyxlQUFMLEdBQXVCLEtBQXZCOztVQUVJbkksYUFBSjtVQUNJcEwsS0FBS3BELElBQUlxRCxZQUFiO1VBQ0ksQ0FBQ0QsRUFBTCxFQUFTO1VBQ0xBLEdBQUd3VCxLQUFQLEVBQWM7YUFDUCxJQUFJM1QsSUFBSSxDQUFSLEVBQVdULE1BQU1ZLEdBQUd3VCxLQUFILENBQVN2VixNQUEvQixFQUF1QzRCLElBQUlULEdBQTNDLEVBQWdEUyxHQUFoRCxFQUFxRDtjQUMvQzRULE9BQU96VCxHQUFHd1QsS0FBSCxDQUFTM1QsQ0FBVCxDQUFYO2NBQ0k0VCxLQUFLQyxJQUFMLElBQWEsTUFBakIsRUFBeUI7bUJBQ2hCRCxLQUFLRSxTQUFMLEVBQVA7Ozs7T0FKTixNQVFPO2VBQ0UzVCxHQUFHK0gsS0FBSCxDQUFTLENBQVQsQ0FBUDs7O1VBR0VxRCxJQUFKLEVBQVU7YUFDSEMsWUFBTCxDQUFrQkQsSUFBbEI7O0tBcDBCRzs4QkFBQSx3Q0F3MEJ1QjtVQUN4QixLQUFLdkUsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO2FBQ3RCRCxPQUFMLENBQWFDLE1BQWIsR0FBc0IsQ0FBdEI7O1VBRUUsS0FBS0QsT0FBTCxDQUFhRSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO2FBQ3RCRixPQUFMLENBQWFFLE1BQWIsR0FBc0IsQ0FBdEI7O1VBRUUsS0FBSzJCLFdBQUwsR0FBbUIsS0FBSzdCLE9BQUwsQ0FBYUMsTUFBaEMsR0FBeUMsS0FBS0QsT0FBTCxDQUFhakQsS0FBMUQsRUFBaUU7YUFDMURpRCxPQUFMLENBQWFDLE1BQWIsR0FBc0IsRUFBRSxLQUFLRCxPQUFMLENBQWFqRCxLQUFiLEdBQXFCLEtBQUs4RSxXQUE1QixDQUF0Qjs7VUFFRSxLQUFLd0QsWUFBTCxHQUFvQixLQUFLckYsT0FBTCxDQUFhRSxNQUFqQyxHQUEwQyxLQUFLRixPQUFMLENBQWE5QyxNQUEzRCxFQUFtRTthQUM1RDhDLE9BQUwsQ0FBYUUsTUFBYixHQUFzQixFQUFFLEtBQUtGLE9BQUwsQ0FBYTlDLE1BQWIsR0FBc0IsS0FBS21JLFlBQTdCLENBQXRCOztLQW4xQkc7K0JBQUEseUNBdTFCd0I7VUFDekIsS0FBS3JGLE9BQUwsQ0FBYWpELEtBQWIsR0FBcUIsS0FBSzhFLFdBQTlCLEVBQTJDO2FBQ3BDbkIsVUFBTCxHQUFrQixLQUFLbUIsV0FBTCxHQUFtQixLQUFLOUssWUFBMUM7OztVQUdFLEtBQUtpSixPQUFMLENBQWE5QyxNQUFiLEdBQXNCLEtBQUttSSxZQUEvQixFQUE2QzthQUN0QzNFLFVBQUwsR0FBa0IsS0FBSzJFLFlBQUwsR0FBb0IsS0FBS2pJLGFBQTNDOztLQTcxQkc7bUJBQUEsNkJBaTJCMEM7OztVQUFoQzVDLFdBQWdDLHVFQUFsQixDQUFrQjtVQUFmbUksYUFBZTs7VUFDM0NvSyxjQUFjcEssYUFBbEI7VUFDSSxDQUFDbkksY0FBYyxDQUFkLElBQW1CdVMsV0FBcEIsS0FBb0MsQ0FBQyxLQUFLQywwQkFBOUMsRUFBMEU7WUFDcEUsQ0FBQyxLQUFLblcsR0FBVixFQUFlO2FBQ1Z1SixRQUFMLEdBQWdCLElBQWhCOztZQUVJeEYsT0FBT2dGLEVBQUVxTixlQUFGLENBQWtCRixjQUFjLEtBQUtoSixhQUFuQixHQUFtQyxLQUFLbE4sR0FBMUQsRUFBK0QyRCxXQUEvRCxDQUFYO2FBQ0txTCxNQUFMLEdBQWMsWUFBTTtpQkFDYmhQLEdBQUwsR0FBVytELElBQVg7aUJBQ0s4RSxXQUFMLENBQWlCaUQsYUFBakI7U0FGRjtPQUxGLE1BU087YUFDQWpELFdBQUwsQ0FBaUJpRCxhQUFqQjs7O1VBR0VuSSxlQUFlLENBQW5CLEVBQXNCOzthQUVmQSxXQUFMLEdBQW1Cb0YsRUFBRXNOLEtBQUYsQ0FBUSxLQUFLMVMsV0FBYixDQUFuQjtPQUZGLE1BR08sSUFBSUEsZUFBZSxDQUFuQixFQUFzQjs7YUFFdEJBLFdBQUwsR0FBbUJvRixFQUFFdU4sS0FBRixDQUFRLEtBQUszUyxXQUFiLENBQW5CO09BRkssTUFHQSxJQUFJQSxlQUFlLENBQW5CLEVBQXNCOzthQUV0QkEsV0FBTCxHQUFtQm9GLEVBQUV3TixRQUFGLENBQVcsS0FBSzVTLFdBQWhCLENBQW5CO09BRkssTUFHQSxJQUFJQSxlQUFlLENBQW5CLEVBQXNCOzthQUV0QkEsV0FBTCxHQUFtQm9GLEVBQUV3TixRQUFGLENBQVd4TixFQUFFd04sUUFBRixDQUFXLEtBQUs1UyxXQUFoQixDQUFYLENBQW5CO09BRkssTUFHQSxJQUFJQSxlQUFlLENBQW5CLEVBQXNCOzthQUV0QkEsV0FBTCxHQUFtQm9GLEVBQUV3TixRQUFGLENBQVd4TixFQUFFd04sUUFBRixDQUFXeE4sRUFBRXdOLFFBQUYsQ0FBVyxLQUFLNVMsV0FBaEIsQ0FBWCxDQUFYLENBQW5CO09BRkssTUFHQTthQUNBQSxXQUFMLEdBQW1CQSxXQUFuQjs7O1VBR0V1UyxXQUFKLEVBQWlCO2FBQ1Z2UyxXQUFMLEdBQW1CQSxXQUFuQjs7S0FwNEJHO29CQUFBLDhCQXc0QmE7VUFDZHFLLGtCQUFtQixDQUFDLEtBQUtDLFdBQU4sSUFBcUIsS0FBS0EsV0FBTCxJQUFvQixTQUExQyxHQUF1RCxhQUF2RCxHQUF1RSxLQUFLQSxXQUFsRztXQUNLL0QsR0FBTCxDQUFTcUYsU0FBVCxHQUFxQnZCLGVBQXJCO1dBQ0s5RCxHQUFMLENBQVNzTSxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLEtBQUt4TCxXQUE5QixFQUEyQyxLQUFLd0QsWUFBaEQ7V0FDS3RFLEdBQUwsQ0FBU3VNLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsS0FBS3pMLFdBQTdCLEVBQTBDLEtBQUt3RCxZQUEvQztLQTU0Qks7U0FBQSxtQkErNEJFOzs7V0FDRjVHLFNBQUwsQ0FBZSxZQUFNO1lBQ2YsT0FBT3hILE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9JLHFCQUE1QyxFQUFtRTtnQ0FDM0MsT0FBS2tXLFVBQTNCO1NBREYsTUFFTztpQkFDQUEsVUFBTDs7T0FKSjtLQWg1Qks7Y0FBQSx3QkF5NUJPO1VBQ1IsQ0FBQyxLQUFLMVcsR0FBVixFQUFlO1dBQ1ZtUSxPQUFMLEdBQWUsS0FBZjtVQUNJakcsTUFBTSxLQUFLQSxHQUFmO3NCQUN3QyxLQUFLZixPQUpqQztVQUlOQyxNQUpNLGFBSU5BLE1BSk07VUFJRUMsTUFKRixhQUlFQSxNQUpGO1VBSVVuRCxLQUpWLGFBSVVBLEtBSlY7VUFJaUJHLE1BSmpCLGFBSWlCQSxNQUpqQjs7O1dBTVBxSixnQkFBTDtVQUNJNUwsU0FBSixDQUFjLEtBQUs5RCxHQUFuQixFQUF3Qm9KLE1BQXhCLEVBQWdDQyxNQUFoQyxFQUF3Q25ELEtBQXhDLEVBQStDRyxNQUEvQzs7VUFFSSxLQUFLcUQsaUJBQVQsRUFBNEI7YUFDckJpTixLQUFMLENBQVcsS0FBS0Msd0JBQWhCOzs7O1dBSUcvUCxTQUFMLENBQWVqQixPQUFPaVIsVUFBdEIsRUFBa0MzTSxHQUFsQztVQUNJLENBQUMsS0FBS3RCLFFBQVYsRUFBb0I7YUFDYkEsUUFBTCxHQUFnQixJQUFoQjthQUNLL0IsU0FBTCxDQUFlakIsT0FBT2tSLHFCQUF0Qjs7V0FFR3ZOLFFBQUwsR0FBZ0IsS0FBaEI7S0E1NkJLO29CQUFBLDRCQSs2Qld6SixDQS82QlgsRUErNkJjQyxDQS82QmQsRUErNkJpQm1HLEtBLzZCakIsRUErNkJ3QkcsTUEvNkJ4QixFQSs2QmdDO1VBQ2pDNkQsTUFBTSxLQUFLQSxHQUFmO1VBQ0k2TSxTQUFTLE9BQU8sS0FBS0MsaUJBQVosS0FBa0MsUUFBbEMsR0FDWCxLQUFLQSxpQkFETSxHQUVYLENBQUMzUyxNQUFNQyxPQUFPLEtBQUswUyxpQkFBWixDQUFOLENBQUQsR0FBeUMxUyxPQUFPLEtBQUswUyxpQkFBWixDQUF6QyxHQUEwRSxDQUY1RTtVQUdJQyxTQUFKO1VBQ0lDLE1BQUosQ0FBV3BYLElBQUlpWCxNQUFmLEVBQXVCaFgsQ0FBdkI7VUFDSW9YLE1BQUosQ0FBV3JYLElBQUlvRyxLQUFKLEdBQVk2USxNQUF2QixFQUErQmhYLENBQS9CO1VBQ0lxWCxnQkFBSixDQUFxQnRYLElBQUlvRyxLQUF6QixFQUFnQ25HLENBQWhDLEVBQW1DRCxJQUFJb0csS0FBdkMsRUFBOENuRyxJQUFJZ1gsTUFBbEQ7VUFDSUksTUFBSixDQUFXclgsSUFBSW9HLEtBQWYsRUFBc0JuRyxJQUFJc0csTUFBSixHQUFhMFEsTUFBbkM7VUFDSUssZ0JBQUosQ0FBcUJ0WCxJQUFJb0csS0FBekIsRUFBZ0NuRyxJQUFJc0csTUFBcEMsRUFBNEN2RyxJQUFJb0csS0FBSixHQUFZNlEsTUFBeEQsRUFBZ0VoWCxJQUFJc0csTUFBcEU7VUFDSThRLE1BQUosQ0FBV3JYLElBQUlpWCxNQUFmLEVBQXVCaFgsSUFBSXNHLE1BQTNCO1VBQ0krUSxnQkFBSixDQUFxQnRYLENBQXJCLEVBQXdCQyxJQUFJc0csTUFBNUIsRUFBb0N2RyxDQUFwQyxFQUF1Q0MsSUFBSXNHLE1BQUosR0FBYTBRLE1BQXBEO1VBQ0lJLE1BQUosQ0FBV3JYLENBQVgsRUFBY0MsSUFBSWdYLE1BQWxCO1VBQ0lLLGdCQUFKLENBQXFCdFgsQ0FBckIsRUFBd0JDLENBQXhCLEVBQTJCRCxJQUFJaVgsTUFBL0IsRUFBdUNoWCxDQUF2QztVQUNJc1gsU0FBSjtLQTk3Qks7NEJBQUEsc0NBaThCcUI7OztXQUNyQkMsZ0JBQUwsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsS0FBS3RNLFdBQWpDLEVBQThDLEtBQUt3RCxZQUFuRDtVQUNJLEtBQUtqQixXQUFMLElBQW9CLEtBQUtBLFdBQUwsQ0FBaUJoTixNQUF6QyxFQUFpRDthQUMxQ2dOLFdBQUwsQ0FBaUJnSyxPQUFqQixDQUF5QixnQkFBUTtlQUMxQixRQUFLck4sR0FBVixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsUUFBS2MsV0FBMUIsRUFBdUMsUUFBS3dELFlBQTVDO1NBREY7O0tBcDhCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUFBLGlCQTA5QkFnSixVQTE5QkEsRUEwOUJZO1VBQ2J0TixNQUFNLEtBQUtBLEdBQWY7VUFDSXVOLElBQUo7VUFDSWxJLFNBQUosR0FBZ0IsTUFBaEI7VUFDSW1JLHdCQUFKLEdBQStCLGdCQUEvQjs7VUFFSUMsSUFBSjtVQUNJQyxPQUFKO0tBaitCSztrQkFBQSw0QkFvK0JXOzs7VUFDWixDQUFDLEtBQUt0TyxZQUFWLEVBQXdCOzBCQUNRLEtBQUtBLFlBRnJCO1VBRVZGLE1BRlUsaUJBRVZBLE1BRlU7VUFFRkMsTUFGRSxpQkFFRkEsTUFGRTtVQUVNd0MsS0FGTixpQkFFTUEsS0FGTjs7O1VBSVo5QyxFQUFFQyxXQUFGLENBQWNJLE1BQWQsQ0FBSixFQUEyQjthQUNwQkQsT0FBTCxDQUFhQyxNQUFiLEdBQXNCQSxNQUF0Qjs7O1VBR0VMLEVBQUVDLFdBQUYsQ0FBY0ssTUFBZCxDQUFKLEVBQTJCO2FBQ3BCRixPQUFMLENBQWFFLE1BQWIsR0FBc0JBLE1BQXRCOzs7VUFHRU4sRUFBRUMsV0FBRixDQUFjNkMsS0FBZCxDQUFKLEVBQTBCO2FBQ25CaEMsVUFBTCxHQUFrQmdDLEtBQWxCOzs7V0FHR2pFLFNBQUwsQ0FBZSxZQUFNO2dCQUNkMEIsWUFBTCxHQUFvQixJQUFwQjtPQURGO0tBcC9CSztxQkFBQSwrQkF5L0JjO1VBQ2YsQ0FBQyxLQUFLdEosR0FBVixFQUFlO2FBQ1JnSCxXQUFMO09BREYsTUFFTztZQUNELEtBQUswQyxpQkFBVCxFQUE0QjtlQUNyQmQsUUFBTCxHQUFnQixLQUFoQjs7YUFFR2tGLFFBQUw7YUFDS2pGLFdBQUw7Ozs7Q0Fwd0NSOztBQ3ZGQTs7Ozs7O0FBTUE7QUFFQSxJQUFJLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztBQUN6RCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUNyRCxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7O0FBRTdELFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtDQUN0QixJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtFQUN0QyxNQUFNLElBQUksU0FBUyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7RUFDN0U7O0NBRUQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbkI7O0FBRUQsU0FBUyxlQUFlLEdBQUc7Q0FDMUIsSUFBSTtFQUNILElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0dBQ25CLE9BQU8sS0FBSyxDQUFDO0dBQ2I7Ozs7O0VBS0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDOUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUNoQixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7R0FDakQsT0FBTyxLQUFLLENBQUM7R0FDYjs7O0VBR0QsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0VBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUM1QixLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDeEM7RUFDRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0dBQy9ELE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2hCLENBQUMsQ0FBQztFQUNILElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxZQUFZLEVBQUU7R0FDckMsT0FBTyxLQUFLLENBQUM7R0FDYjs7O0VBR0QsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0VBQ2Ysc0JBQXNCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLE1BQU0sRUFBRTtHQUMxRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO0dBQ3ZCLENBQUMsQ0FBQztFQUNILElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDaEQsc0JBQXNCLEVBQUU7R0FDekIsT0FBTyxLQUFLLENBQUM7R0FDYjs7RUFFRCxPQUFPLElBQUksQ0FBQztFQUNaLENBQUMsT0FBTyxHQUFHLEVBQUU7O0VBRWIsT0FBTyxLQUFLLENBQUM7RUFDYjtDQUNEOztBQUVELGdCQUFjLEdBQUcsZUFBZSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU0sRUFBRSxNQUFNLEVBQUU7Q0FDOUUsSUFBSSxJQUFJLENBQUM7Q0FDVCxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDMUIsSUFBSSxPQUFPLENBQUM7O0NBRVosS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDMUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7RUFFNUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7R0FDckIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtJQUNuQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCO0dBQ0Q7O0VBRUQsSUFBSSxxQkFBcUIsRUFBRTtHQUMxQixPQUFPLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0tBQzVDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRDtHQUNEO0VBQ0Q7O0NBRUQsT0FBTyxFQUFFLENBQUM7Q0FDVjs7QUN0RkQsSUFBTWdQLGlCQUFpQjtpQkFDTjtDQURqQjs7QUFJQSxJQUFNQyxZQUFZO1dBQ1AsaUJBQVVDLEdBQVYsRUFBZUMsT0FBZixFQUF3QjtjQUNyQkMsYUFBTyxFQUFQLEVBQVdKLGNBQVgsRUFBMkJHLE9BQTNCLENBQVY7UUFDSUUsVUFBVTVULE9BQU95VCxJQUFJRyxPQUFKLENBQVlqVyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLENBQVAsQ0FBZDtRQUNJaVcsVUFBVSxDQUFkLEVBQWlCO1lBQ1QsSUFBSXpLLEtBQUosdUVBQThFeUssT0FBOUUsb0RBQU47O1FBRUVDLGdCQUFnQkgsUUFBUUcsYUFBUixJQUF5QixRQUE3Qzs7O1FBR0lDLFNBQUosQ0FBY0QsYUFBZCxFQUE2QkMsU0FBN0I7R0FWYzs7O0NBQWxCOzs7Ozs7OzsifQ==
