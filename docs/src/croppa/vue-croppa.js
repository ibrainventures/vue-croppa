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

var canvasExifOrientation$1 = createCommonjsModule(function (module, exports) {
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
    var _canvas = canvasExifOrientation$1.drawImage(img, orientation);
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
      console.log(' use orgin ', useOriginal);
      console.log(' apply meta ', applyMetadata);
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
    },
    getResizedImage: function getResizedImage(file) {
      var _this12 = this;

      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

      if (!file) {
        return null;
      }
      var img = new Image();
      var imgResized = new Image();
      var canvas = null;
      var fileReader = new FileReader();
      var ratio = 1;
      fileReader.onload = function (e) {
        var fileData = e.target.result;
        var base64 = u.parseDataUrl(fileData);
        // first get EXIF orientation
        var orientation = 1;
        try {
          orientation = u.getFileOrientation(u.base64ToArrayBuffer(base64));
        } catch (err) {}
        img.src = fileData;
        img.onload = function () {
          ratio = img.height / img.width;
          canvas = canvasExifOrientation.drawImage(img, orientation, 0, 0, width, width * ratio);
          imgResized.src = canvas.toDataURL();
          imgResized.onload = function () {
            _this12._onload(imgResized);
          };
        };
      };
      fileReader.readAsDataURL(file);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XG4gIE51bWJlci5pc0ludGVnZXIgfHxcbiAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXG4gICAgKVxuICB9XG5cbnZhciBpbml0aWFsSW1hZ2VUeXBlID0gU3RyaW5nXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkltYWdlKSB7XG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2YWx1ZTogT2JqZWN0LFxuICB3aWR0aDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMDAsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgIH1cbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xuICB9LFxuICBwbGFjZWhvbGRlckNvbG9yOiB7XG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPj0gMFxuICAgIH1cbiAgfSxcbiAgY2FudmFzQ29sb3I6IHtcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIHF1YWxpdHk6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICB6b29tU3BlZWQ6IHtcbiAgICBkZWZhdWx0OiAzLFxuICAgIHR5cGU6IE51bWJlcixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBhY2NlcHQ6IFN0cmluZyxcbiAgZmlsZVNpemVMaW1pdDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA+PSAwXG4gICAgfVxuICB9LFxuICBkaXNhYmxlZDogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxuICBkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbjogQm9vbGVhbixcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXG4gIGRpc2FibGVSb3RhdGlvbjogQm9vbGVhbixcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXG4gIHNob3dSZW1vdmVCdXR0b246IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3JlZCdcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBpbml0aWFsSW1hZ2U6IGluaXRpYWxJbWFnZVR5cGUsXG4gIGluaXRpYWxTaXplOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXG4gICAgfVxuICB9LFxuICBpbml0aWFsUG9zaXRpb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICB2YXIgdmFsaWRzID0gWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xuICAgICAgICAgIHJldHVybiB2YWxpZHMuaW5kZXhPZih3b3JkKSA+PSAwXG4gICAgICAgIH0pIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXG4gICAgICApXG4gICAgfVxuICB9LFxuICBpbnB1dEF0dHJzOiBPYmplY3QsXG4gIHNob3dMb2FkaW5nOiBCb29sZWFuLFxuICBsb2FkaW5nU2l6ZToge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMFxuICB9LFxuICBsb2FkaW5nQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHJlcGxhY2VEcm9wOiBCb29sZWFuLFxuICBwYXNzaXZlOiBCb29sZWFuLFxuICBpbWFnZUJvcmRlclJhZGl1czoge1xuICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgZGVmYXVsdDogMFxuICB9LFxuICBhdXRvU2l6aW5nOiBCb29sZWFuLFxuICB2aWRlb0VuYWJsZWQ6IEJvb2xlYW4sXG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgTkVXX0lNQUdFX0VWRU5UOiAnbmV3LWltYWdlJyxcbiAgTkVXX0lNQUdFX0RSQVdOX0VWRU5UOiAnbmV3LWltYWdlLWRyYXduJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbScsXG4gIERSQVdfRVZFTlQ6ICdkcmF3JyxcbiAgSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQ6ICdpbml0aWFsLWltYWdlLWxvYWRlZCcsXG4gIExPQURJTkdfU1RBUlRfRVZFTlQ6ICdsb2FkaW5nLXN0YXJ0JyxcbiAgTE9BRElOR19FTkRfRVZFTlQ6ICdsb2FkaW5nLWVuZCdcbn1cbiIsIjx0ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIHJlZj1cIndyYXBwZXJcIlxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtcbiAgICAgIHBhc3NpdmUgPyAnY3JvcHBhLS1wYXNzaXZlJyA6ICcnXG4gICAgfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7XG4gICAgICBkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnXG4gICAgfSAke1xuICAgICAgZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnXG4gICAgfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXG4gICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0xlYXZlXCJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiXG4gID5cbiAgICA8aW5wdXRcbiAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXG4gICAgICByZWY9XCJmaWxlSW5wdXRcIlxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXG4gICAgICBzdHlsZT1cIlxuICAgICAgICBoZWlnaHQ6IDFweDtcbiAgICAgICAgd2lkdGg6IDFweDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC05OTk5OXB4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBcIlxuICAgIC8+XG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCIgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW5cIj5cbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxjYW52YXNcbiAgICAgIHJlZj1cImNhbnZhc1wiXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICA+PC9jYW52YXM+XG4gICAgPHN2Z1xuICAgICAgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxuICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0IC8gNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aCAvIDQwfXB4YFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXG4gICAgICB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGggLyAxMFwiXG4gICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aCAvIDEwXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiXG4gICAgICA+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIlxuICAgID5cbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiIHYtZm9yPVwiaSBpbiAxMlwiIDprZXk9XCJpXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxuICAgICAgICAgIDpzdHlsZT1cInsgYmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3IgfVwiXG4gICAgICAgID48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xuXG5jb25zdCBQQ1RfUEVSX1pPT00gPSAxIC8gMTAwMDAwIC8vIFRoZSBhbW91bnQgb2Ygem9vbWluZyBldmVyeXRpbWUgaXQgaGFwcGVucywgaW4gcGVyY2VudGFnZSBvZiBpbWFnZSB3aWR0aC5cbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBNSU5fV0lEVEggPSAxMCAvLyBUaGUgbWluaW1hbCB3aWR0aCB0aGUgdXNlciBjYW4gem9vbSB0by5cbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cbmNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcblxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxuLy8gY29uc3QgREVCVUcgPSBmYWxzZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1vZGVsOiB7XG4gICAgcHJvcDogJ3ZhbHVlJyxcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcbiAgfSxcblxuICBwcm9wczogcHJvcHMsXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbnZhczogbnVsbCxcbiAgICAgIGN0eDogbnVsbCxcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXG4gICAgICBpbWc6IG51bGwsXG4gICAgICB2aWRlbzogbnVsbCxcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcbiAgICAgIGltZ0RhdGE6IHtcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICBzdGFydFk6IDBcbiAgICAgIH0sXG4gICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxuICAgICAgdGFiU3RhcnQ6IDAsXG4gICAgICBzY3JvbGxpbmc6IGZhbHNlLFxuICAgICAgcGluY2hpbmc6IGZhbHNlLFxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxuICAgICAgcGluY2hEaXN0YW5jZTogMCxcbiAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxuICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXG4gICAgICBuYXR1cmFsV2lkdGg6IDAsXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxuICAgICAgc2NhbGVSYXRpbzogbnVsbCxcbiAgICAgIG9yaWVudGF0aW9uOiAxLFxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxuICAgICAgaW1hZ2VTZXQ6IGZhbHNlLFxuICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxuICAgICAgX2xvYWRpbmc6IGZhbHNlLFxuICAgICAgcmVhbFdpZHRoOiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cbiAgICAgIHJlYWxIZWlnaHQ6IDAsIC8vIG9ubHkgZm9yIHdoZW4gYXV0b1NpemluZyBpcyBvblxuICAgICAgY2hvc2VuRmlsZTogbnVsbCxcbiAgICAgIHVzZUF1dG9TaXppbmc6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG91dHB1dFdpZHRoICgpIHtcbiAgICAgIGNvbnN0IHcgPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGhcbiAgICAgIHJldHVybiB3ICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIG91dHB1dEhlaWdodCAoKSB7XG4gICAgICBjb25zdCBoID0gdGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsSGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICAgIHJldHVybiBoICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGFzcGVjdFJhdGlvICgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgIH0sXG5cbiAgICBsb2FkaW5nU3R5bGUgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICByaWdodDogJzE1cHgnLFxuICAgICAgICBib3R0b206ICcxMHB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBsb2FkaW5nOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9sb2FkaW5nXG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBuZXdWYWx1ZVxuICAgICAgICBpZiAob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX1NUQVJUX0VWRU5UKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19FTkRfRVZFTlQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgIHUuckFGUG9seWZpbGwoKVxuICAgIHUudG9CbG9iUG9seWZpbGwoKVxuXG4gICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcbiAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcbiAgICAgIHRoaXMuJHdhdGNoKCd2YWx1ZS5fZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBzZXQgPSBmYWxzZVxuICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxuICAgICAgICAgICAgaWYgKHZhbCAhPT0gdGhpc1trZXldKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcbiAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgICBkZWVwOiB0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxuICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdJbml0KClcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xuICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxuICAgIH0sXG4gICAgb3V0cHV0SGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcbiAgICB9LFxuICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuICAgIGltYWdlQm9yZGVyUmFkaXVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2ZW50V2hpdGVTcGFjZSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgfSxcbiAgICBzY2FsZVJhdGlvICh2YWwsIG9sZFZhbCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cblxuICAgICAgdmFyIHggPSAxXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChvbGRWYWwpICYmIG9sZFZhbCAhPT0gMCkge1xuICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXG4gICAgICB9XG4gICAgICB2YXIgcG9zID0gdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkIHx8IHtcbiAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXG4gICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxuICAgICAgfVxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB2YWxcblxuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSAmJiB0aGlzLmltYWdlU2V0ICYmICF0aGlzLnJvdGF0aW5nKSB7XG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UoKVxuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgIH1cbiAgICB9LFxuICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyh2YWwgLSBvbGRWYWwpID4gKHZhbCAqICgxIC8gMTAwMDAwKSkpIHtcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuWk9PTV9FVkVOVClcbiAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuaGVpZ2h0JzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICB9LFxuICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXG4gICAgICB9XG4gICAgfSxcbiAgICBhdXRvU2l6aW5nICh2YWwpIHtcbiAgICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBlbWl0RXZlbnQgKC4uLmFyZ3MpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3NbMF0pXG4gICAgICB0aGlzLiRlbWl0KC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICBnZXRDYW52YXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXG4gICAgfSxcblxuICAgIGdldENvbnRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3R4XG4gICAgfSxcblxuICAgIGdldENob3NlbkZpbGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hvc2VuRmlsZSB8fCB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxuICAgIH0sXG5cbiAgICBtb3ZlIChvZmZzZXQpIHtcbiAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcbiAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5NT1ZFX0VWRU5UKVxuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZURvd253YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXG4gICAgfSxcblxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcbiAgICB9LFxuXG4gICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICB6b29tICh6b29tSW4gPSB0cnVlLCBhY2NlbGVyYXRpb24gPSAxKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxuICAgICAgbGV0IHNwZWVkID0gKHRoaXMub3V0cHV0V2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXG4gICAgICBsZXQgeCA9IDFcbiAgICAgIGlmICh6b29tSW4pIHtcbiAgICAgICAgeCA9IDEgKyBzcGVlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcbiAgICAgICAgeCA9IDEgLSBzcGVlZFxuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIGEgbmV3IGltYWdlIGlzIGxvYWRlZCB3aXRoIHRoZSBzYW1lIGFzcGVjdCByYXRpb1xuICAgICAgLy8gYXMgdGhlIHByZXZpb3VzbHkgcmVtb3ZlKClkIG9uZSwgdGhlIGltZ0RhdGEud2lkdGggYW5kIC5oZWlnaHRcbiAgICAgIC8vIGVmZmVjdGl2ZWxseSBkb24ndCBjaGFuZ2UgKHRoZXkgY2hhbmdlIHRocm91Z2ggb25lIHRpY2tcbiAgICAgIC8vIGFuZCBlbmQgdXAgYmVpbmcgdGhlIHNhbWUgYXMgYmVmb3JlIHRoZSB0aWNrLCBzbyB0aGVcbiAgICAgIC8vIHdhdGNoZXJzIGRvbid0IHRyaWdnZXIpLCBtYWtlIHN1cmUgc2NhbGVSYXRpbyBpc24ndCBudWxsIHNvXG4gICAgICAvLyB0aGF0IHpvb21pbmcgd29ya3MuLi5cbiAgICAgIGlmICh0aGlzLnNjYWxlUmF0aW8gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5pbWdEYXRhLndpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcbiAgICB9LFxuXG4gICAgem9vbUluICgpIHtcbiAgICAgIHRoaXMuem9vbSh0cnVlKVxuICAgIH0sXG5cbiAgICB6b29tT3V0ICgpIHtcbiAgICAgIHRoaXMuem9vbShmYWxzZSlcbiAgICB9LFxuXG4gICAgcm90YXRlIChzdGVwID0gMSkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxuICAgICAgaWYgKGlzTmFOKHN0ZXApIHx8IHN0ZXAgPiAzIHx8IHN0ZXAgPCAtMykge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXG4gICAgICAgIHN0ZXAgPSAxXG4gICAgICB9XG4gICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcbiAgICB9LFxuXG4gICAgZmxpcFggKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDIpXG4gICAgfSxcblxuICAgIGZsaXBZICgpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxuICAgIH0sXG5cbiAgICByZWZyZXNoICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2luaXRpYWxpemUpXG4gICAgfSxcblxuICAgIGhhc0ltYWdlICgpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuaW1hZ2VTZXRcbiAgICB9LFxuICAgIGFwcGx5TWV0YWRhdGFXaXRoUGl4ZWxEZW5zaXR5IChtZXRhZGF0YSkge1xuICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgIGxldCBzdG9yZWRQaXhlbERlbnNpdHkgPSBtZXRhZGF0YS5waXhlbERlbnNpdHkgfHwgMVxuICAgICAgICBsZXQgY3VycmVudFBpeGVsRGVuc2l0eSA9IHRoaXMucXVhbGl0eVxuICAgICAgICBsZXQgcGl4ZWxEZW5zaXR5RGlmZiA9IGN1cnJlbnRQaXhlbERlbnNpdHkgLyBzdG9yZWRQaXhlbERlbnNpdHlcbiAgICAgICAgbWV0YWRhdGEuc3RhcnRYID0gbWV0YWRhdGEuc3RhcnRYICogcGl4ZWxEZW5zaXR5RGlmZlxuICAgICAgICBtZXRhZGF0YS5zdGFydFkgPSBtZXRhZGF0YS5zdGFydFkgKiBwaXhlbERlbnNpdHlEaWZmXG4gICAgICAgIG1ldGFkYXRhLnNjYWxlID0gbWV0YWRhdGEuc2NhbGUgKiBwaXhlbERlbnNpdHlEaWZmXG5cbiAgICAgICAgdGhpcy5hcHBseU1ldGFkYXRhKG1ldGFkYXRhKVxuICAgICAgfVxuICAgIH0sXG4gICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcbiAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbWV0YWRhdGFcbiAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcbiAgICB9LFxuICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSlcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXG4gICAgfSxcblxuICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xuICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxuICAgICAgICAgIH0sIC4uLmFyZ3MpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXG4gICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhV2l0aFBpeGVsRGVuc2l0eSAoKSB7XG4gICAgICBsZXQgbWV0YWRhdGEgPSB0aGlzLmdldE1ldGFkYXRhKClcbiAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICBtZXRhZGF0YS5waXhlbERlbnNpdHkgPSB0aGlzLnF1YWxpdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZXRhZGF0YVxuICAgIH0sXG5cbiAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxuICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNob29zZUZpbGUgKCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXG4gICAgfSxcblxuICAgIHJlbW92ZSAoa2VlcENob3NlbkZpbGUgPSBmYWxzZSkge1xuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSByZXR1cm5cbiAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG5cbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy5pbWdEYXRhID0ge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMFxuICAgICAgfVxuICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICBpZiAoIWtlZXBDaG9zZW5GaWxlKSB7XG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXG4gICAgICAgIHRoaXMudmlkZW8gPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmIChoYWRJbWFnZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRDbGlwUGx1Z2luIChwbHVnaW4pIHtcbiAgICAgIGlmICghdGhpcy5jbGlwUGx1Z2lucykge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zID0gW11cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2xpcFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pIDwgMCkge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NsaXAgcGx1Z2lucyBzaG91bGQgYmUgZnVuY3Rpb25zJylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW1pdE5hdGl2ZUV2ZW50IChldnQpIHtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2dC50eXBlLCBldnQpO1xuICAgIH0sXG5cbiAgICBzZXRGaWxlIChmaWxlKSB7XG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfc2V0Q29udGFpbmVyU2l6ZSAoKSB7XG4gICAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICAgIHRoaXMucmVhbFdpZHRoID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS53aWR0aC5zbGljZSgwLCAtMilcbiAgICAgICAgdGhpcy5yZWFsSGVpZ2h0ID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS5oZWlnaHQuc2xpY2UoMCwgLTIpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nSW5pdCAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfYXV0b1NpemluZ1JlbW92ZSAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfaW5pdGlhbGl6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXG4gICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9IFwiaGlnaFwiO1xuICAgICAgdGhpcy5jdHgud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4Lm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXG4gICAgICB0aGlzLmltZyA9IG51bGxcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXG4gICAgICBpZiAoIXRoaXMucGFzc2l2ZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFNpemUgKCkge1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSAodGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsV2lkdGggOiB0aGlzLndpZHRoKSArICdweCdcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodCkgKyAncHgnXG4gICAgfSxcblxuICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcbiAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcbiAgICAgIHN3aXRjaCAoc3RlcCkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA2XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG4gICAgfSxcblxuICAgIF9zZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcbiAgICAgIGxldCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWltZykgcmV0dXJuXG5cbiAgICAgIHZhciBvbkxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuXG4gICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgIG9uTG9hZCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMub3V0cHV0V2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemVcbiAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxuICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMub3V0cHV0V2lkdGggLyAyLCB0aGlzLm91dHB1dEhlaWdodCAvIDIpXG4gICAgfSxcblxuICAgIF9zZXRQbGFjZWhvbGRlcnMgKCkge1xuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIHRoaXMuX3NldEltYWdlUGxhY2Vob2xkZXIoKVxuICAgICAgdGhpcy5fc2V0VGV4dFBsYWNlaG9sZGVyKClcbiAgICB9LFxuXG4gICAgX3NldEluaXRpYWwgKCkge1xuICAgICAgbGV0IHNyYywgaW1nXG4gICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXG4gICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XG4gICAgICAgICAgaW1nID0gZWxtXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmluaXRpYWxJbWFnZSAmJiB0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXG4gICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGlmICghL15kYXRhOi8udGVzdChzcmMpICYmICEvXmJsb2I6Ly50ZXN0KHNyYykpIHtcbiAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxuICAgICAgICB9XG4gICAgICAgIGltZy5zcmMgPSBzcmNcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgICAgIGltZyA9IHRoaXMuaW5pdGlhbEltYWdlXG4gICAgICB9XG4gICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gdHJ1ZVxuXG4gICAgICBsZXQgb25FcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgIGlmIChpbWcuY29tcGxldGUpIHtcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xuICAgICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uRXJyb3IoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgLy8gdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICBvbkVycm9yKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25sb2FkIChpbWcsIG9yaWVudGF0aW9uID0gMSwgaW5pdGlhbCkge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUodHJ1ZSlcbiAgICAgIH1cbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xuICAgICAgdGhpcy5pbWcgPSBpbWdcblxuICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xuICAgICAgICBvcmllbnRhdGlvbiA9IDFcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG5cbiAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uVmlkZW9Mb2FkICh2aWRlbywgaW5pdGlhbCkge1xuICAgICAgdGhpcy52aWRlbyA9IHZpZGVvXG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgICAgY29uc3QgeyB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCB9ID0gdmlkZW9cbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvV2lkdGhcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWRlb0hlaWdodFxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBjb25zdCBkcmF3RnJhbWUgPSAoaW5pdGlhbCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMudmlkZW8pIHJldHVyblxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KVxuICAgICAgICBjb25zdCBmcmFtZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGZyYW1lLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKVxuICAgICAgICBmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBmcmFtZVxuICAgICAgICAgIC8vIHRoaXMuX3BsYWNlSW1hZ2UoKVxuICAgICAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkcmF3RnJhbWUodHJ1ZSlcbiAgICAgIGNvbnN0IGtlZXBEcmF3aW5nID0gKCkgPT4ge1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgZHJhd0ZyYW1lKClcbiAgICAgICAgICBpZiAoIXRoaXMudmlkZW8gfHwgdGhpcy52aWRlby5lbmRlZCB8fCB0aGlzLnZpZGVvLnBhdXNlZCkgcmV0dXJuXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoa2VlcERyYXdpbmcpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlQ2xpY2sgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoICYmICF0aGlzLnBhc3NpdmUpIHtcbiAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZURibENsaWNrIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnZpZGVvRW5hYmxlZCAmJiB0aGlzLnZpZGVvKSB7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCB8fCB0aGlzLnZpZGVvLmVuZGVkKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcbiAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XG4gICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuXG4gICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBmaWxlO1xuICAgICAgaWYgKCF0aGlzLl9maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcbiAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IHUucGFyc2VEYXRhVXJsKGZpbGVEYXRhKVxuICAgICAgICAgIGNvbnN0IGlzVmlkZW8gPSAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSlcbiAgICAgICAgICBpZiAoaXNWaWRlbykge1xuICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuICAgICAgICAgICAgdmlkZW8uc3JjID0gZmlsZURhdGFcbiAgICAgICAgICAgIGZpbGVEYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh2aWRlby5yZWFkeVN0YXRlID49IHZpZGVvLkhBVkVfRlVUVVJFX0RBVEEpIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYW4gcGxheSBldmVudCcpXG4gICAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9FVkVOVClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXG5cbiAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcbiAgICB9LFxuXG4gICAgX2ZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xuICAgICAgY29uc3QgYWNjZXB0YWJsZU1pbWVUeXBlID0gKHRoaXMudmlkZW9FbmFibGVkICYmIC9edmlkZW8vLnRlc3QoZmlsZS50eXBlKSAmJiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpLmNhblBsYXlUeXBlKGZpbGUudHlwZSkpIHx8IC9eaW1hZ2UvLnRlc3QoZmlsZS50eXBlKVxuICAgICAgaWYgKCFhY2NlcHRhYmxlTWltZVR5cGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmFjY2VwdCkgcmV0dXJuIHRydWVcbiAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdFxuICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxuICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXG4gICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcbiAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XG4gICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSxcblxuICAgIF9wbGFjZUltYWdlIChhcHBseU1ldGFkYXRhKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXG4gICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XG5cbiAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcbiAgICAgIGltZ0RhdGEuc3RhcnRZID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WSkgPyBpbWdEYXRhLnN0YXJ0WSA6IDBcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcbiAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdGhpcy5zY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICgvdG9wLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGhcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IC9eKC0/XFxkKyklICgtP1xcZCspJSQvLmV4ZWModGhpcy5pbml0aWFsUG9zaXRpb24pXG4gICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB4ICogKHRoaXMub3V0cHV0V2lkdGggLSBpbWdEYXRhLndpZHRoKVxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5fYXBwbHlNZXRhZGF0YSgpXG5cbiAgICAgIGlmIChhcHBseU1ldGFkYXRhICYmIHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy56b29tKGZhbHNlLCAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogMCB9KVxuICAgICAgfVxuICAgICAgdGhpcy5fZHJhdygpXG4gICAgfSxcblxuICAgIF9hc3BlY3RGaWxsICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgIGxldCBzY2FsZVJhdGlvXG5cbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FzcGVjdEZpdCAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICBsZXQgc2NhbGVSYXRpb1xuICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfbmF0dXJhbFNpemUgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLnN1cHBvcnRUb3VjaCA9IHRydWVcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcbiAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IHBvaW50ZXJDb29yZFxuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG4gICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xuICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cblxuICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLl9oYW5kbGVQb2ludGVyRW5kKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxuICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xuICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcbiAgICAgICAgaWYgKChwb2ludGVyTW92ZURpc3RhbmNlIDwgQ0xJQ0tfTU9WRV9USFJFU0hPTEQpICYmIHRhYkVuZCAtIHRoaXMudGFiU3RhcnQgPCBNSU5fTVNfUEVSX0NMSUNLICYmIHRoaXMuc3VwcG9ydFRvdWNoKSB7XG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcbiAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXG4gICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gY29vcmRcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXG5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcbiAgICAgICAgICB0aGlzLm1vdmUoe1xuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xuICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxuICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxuICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxuICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBQSU5DSF9BQ0NFTEVSQVRJT04pXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXG4gICAgfSxcblxuICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWVcbiAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcbiAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XG4gICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxuICAgICAgfVxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkgcmV0dXJuXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJvcCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcblxuICAgICAgbGV0IGZpbGVcbiAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcbiAgICAgIGlmICghZHQpIHJldHVyblxuICAgICAgaWYgKGR0Lml0ZW1zKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cbiAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xuICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm91dHB1dFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3V0cHV0SGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMub3V0cHV0V2lkdGgpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldE9yaWVudGF0aW9uIChvcmllbnRhdGlvbiA9IDEsIGFwcGx5TWV0YWRhdGEpIHtcbiAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcbiAgICAgIGNvbnNvbGUubG9nKCcgdXNlIG9yZ2luICcsIHVzZU9yaWdpbmFsKVxuICAgICAgY29uc29sZS5sb2coJyBhcHBseSBtZXRhICcsIGFwcGx5TWV0YWRhdGEpXG4gICAgICBpZiAoKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkgJiYgIXRoaXMuZGlzYWJsZUV4aWZBdXRvT3JpZW50YXRpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICAgIHRoaXMucm90YXRpbmcgPSB0cnVlXG4gICAgICAgIC8vIHUuZ2V0Um90YXRlZEltYWdlRGF0YSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgdmFyIF9pbWcgPSB1LmdldFJvdGF0ZWRJbWFnZSh1c2VPcmlnaW5hbCA/IHRoaXMub3JpZ2luYWxJbWFnZSA6IHRoaXMuaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICB9XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XG4gICAgICAgIC8vIGZsaXAgeFxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWCh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XG4gICAgICAgIC8vIGZsaXAgeVxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5mbGlwWSh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XG4gICAgICAgIC8vIDkwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XG4gICAgICAgIC8vIDE4MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xuICAgICAgICAvLyAyNzAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cbiAgICAgIH1cblxuICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcGFpbnRCYWNrZ3JvdW5kICgpIHtcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgfSxcblxuICAgIF9kcmF3ICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9kcmF3RnJhbWUgKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVDb250YWluZXJDbGlwUGF0aClcbiAgICAgICAgLy8gdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVJbWFnZUNsaXBQYXRoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRFJBV19FVkVOVCwgY3R4KVxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRFJBV05fRVZFTlQpXG4gICAgICB9XG4gICAgICB0aGlzLnJvdGF0aW5nID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX2NsaXBQYXRoRmFjdG9yeSAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cbiAgICAgICAgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA6XG4gICAgICAgICFpc05hTihOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykpID8gTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpIDogMFxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoICgpIHtcbiAgICAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMuZm9yRWFjaChmdW5jID0+IHtcbiAgICAgICAgICBmdW5jKHRoaXMuY3R4LCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gX2NyZWF0ZUltYWdlQ2xpcFBhdGggKCkge1xuICAgIC8vICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxuICAgIC8vICAgbGV0IHcgPSB3aWR0aFxuICAgIC8vICAgbGV0IGggPSBoZWlnaHRcbiAgICAvLyAgIGxldCB4ID0gc3RhcnRYXG4gICAgLy8gICBsZXQgeSA9IHN0YXJ0WVxuICAgIC8vICAgaWYgKHcgPCBoKSB7XG4gICAgLy8gICAgIGggPSB0aGlzLm91dHB1dEhlaWdodCAqICh3aWR0aCAvIHRoaXMub3V0cHV0V2lkdGgpXG4gICAgLy8gICB9XG4gICAgLy8gICBpZiAoaCA8IHcpIHtcbiAgICAvLyAgICAgdyA9IHRoaXMub3V0cHV0V2lkdGggKiAoaGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgLy8gICAgIHggPSBzdGFydFggKyAod2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAvLyAgIH1cbiAgICAvLyAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSh4LCBzdGFydFksIHcsIGgpXG4gICAgLy8gfSxcblxuICAgIF9jbGlwIChjcmVhdGVQYXRoKSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC5zYXZlKClcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcbiAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXG4gICAgICBjcmVhdGVQYXRoKClcbiAgICAgIGN0eC5maWxsKClcbiAgICAgIGN0eC5yZXN0b3JlKClcbiAgICB9LFxuXG4gICAgX2FwcGx5TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXG4gICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WCkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcbiAgICAgIH1cblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRSZXNpemVkSW1hZ2UgKGZpbGUsIHdpZHRoID0gMTAwMCkge1xuICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICB2YXIgaW1nUmVzaXplZCA9IG5ldyBJbWFnZSgpO1xuICAgICAgdmFyIGNhbnZhcyA9IG51bGw7XG4gICAgICBsZXQgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBsZXQgcmF0aW8gPSAxO1xuICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGxldCBiYXNlNjQgPSB1LnBhcnNlRGF0YVVybChmaWxlRGF0YSk7XG4gICAgICAgIC8vIGZpcnN0IGdldCBFWElGIG9yaWVudGF0aW9uXG4gICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YTtcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICByYXRpbyA9IGltZy5oZWlnaHQgLyBpbWcud2lkdGhcbiAgICAgICAgICBjYW52YXMgPSBjYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKFxuICAgICAgICAgICAgaW1nLFxuICAgICAgICAgICAgb3JpZW50YXRpb24sXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgd2lkdGggKiByYXRpb1xuICAgICAgICAgICk7XG4gICAgICAgICAgaW1nUmVzaXplZC5zcmMgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgICAgaW1nUmVzaXplZC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nUmVzaXplZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cbi5jcm9wcGEtY29udGFpbmVyXG4gIGRpc3BsYXkgaW5saW5lLWJsb2NrXG4gIGN1cnNvciBwb2ludGVyXG4gIHRyYW5zaXRpb24gYWxsIDAuM3NcbiAgcG9zaXRpb24gcmVsYXRpdmVcbiAgZm9udC1zaXplIDBcbiAgYWxpZ24tc2VsZiBmbGV4LXN0YXJ0XG4gIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxuXG4gIGNhbnZhc1xuICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcblxuICAmOmhvdmVyXG4gICAgb3BhY2l0eSAwLjdcblxuICAmLmNyb3BwYS0tZHJvcHpvbmVcbiAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxuXG4gICAgY2FudmFzXG4gICAgICBvcGFjaXR5IDAuNVxuXG4gICYuY3JvcHBhLS1kaXNhYmxlZC1jY1xuICAgIGN1cnNvciBkZWZhdWx0XG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAmLmNyb3BwYS0taGFzLXRhcmdldFxuICAgIGN1cnNvciBtb3ZlXG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxuICAgICAgY3Vyc29yIGRlZmF1bHRcblxuICAmLmNyb3BwYS0tZGlzYWJsZWRcbiAgICBjdXJzb3Igbm90LWFsbG93ZWRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICYuY3JvcHBhLS1wYXNzaXZlXG4gICAgY3Vyc29yIGRlZmF1bHRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gIHN2Zy5pY29uLXJlbW92ZVxuICAgIHBvc2l0aW9uIGFic29sdXRlXG4gICAgYmFja2dyb3VuZCB3aGl0ZVxuICAgIGJvcmRlci1yYWRpdXMgNTAlXG4gICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXG4gICAgei1pbmRleCAxMFxuICAgIGN1cnNvciBwb2ludGVyXG4gICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxuPC9zdHlsZT5cblxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xuLnNrLWZhZGluZy1jaXJjbGUge1xuICAkY2lyY2xlQ291bnQ6IDEyO1xuICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xuXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAuc2stY2lyY2xlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgdG9wOiAwO1xuICB9XG5cbiAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgd2lkdGg6IDE1JTtcbiAgICBoZWlnaHQ6IDE1JTtcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xuICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSB7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcgLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKSk7XG4gICAgfVxuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgICBhbmltYXRpb24tZGVsYXk6IC0kYW5pbWF0aW9uRHVyYXRpb24gK1xuICAgICAgICAkYW5pbWF0aW9uRHVyYXRpb24gL1xuICAgICAgICAkY2lyY2xlQ291bnQgKlxuICAgICAgICAoJGkgLSAxKTtcbiAgICB9XG4gIH1cbn1cbkBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcbiAgMCUsXG4gIDM5JSxcbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICA0MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cbjwvc3R5bGU+XG5cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsInVybCIsInJlZyIsImV4ZWMiLCJiYXNlNjQiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwidyIsInVzZUF1dG9TaXppbmciLCJyZWFsV2lkdGgiLCJ3aWR0aCIsImgiLCJyZWFsSGVpZ2h0IiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIm5hdHVyYWxIZWlnaHQiLCJsb2FkaW5nU2l6ZSIsIl9sb2FkaW5nIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsInBhc3NpdmUiLCJlbWl0RXZlbnQiLCJMT0FESU5HX1NUQVJUX0VWRU5UIiwiTE9BRElOR19FTkRfRVZFTlQiLCJfaW5pdGlhbGl6ZSIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJhdXRvU2l6aW5nIiwiJHJlZnMiLCJ3cmFwcGVyIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIl9hdXRvU2l6aW5nSW5pdCIsIl9hdXRvU2l6aW5nUmVtb3ZlIiwib25EaW1lbnNpb25DaGFuZ2UiLCJfc2V0UGxhY2Vob2xkZXJzIiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwidXNlck1ldGFkYXRhIiwicm90YXRpbmciLCJvZmZzZXRYIiwib2Zmc2V0WSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlIiwiX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCJaT09NX0VWRU5UIiwiJGVtaXQiLCJjdHgiLCJjaG9zZW5GaWxlIiwiZmlsZUlucHV0IiwiZmlsZXMiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJhbW91bnQiLCJtb3ZlIiwiem9vbUluIiwiYWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvdXRwdXRXaWR0aCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsInN0b3JlZFBpeGVsRGVuc2l0eSIsInBpeGVsRGVuc2l0eSIsImN1cnJlbnRQaXhlbERlbnNpdHkiLCJwaXhlbERlbnNpdHlEaWZmIiwic2NhbGUiLCJhcHBseU1ldGFkYXRhIiwiY29tcHJlc3Npb25SYXRlIiwibWltZVR5cGUiLCJxdWFsaXR5QXJndW1lbnQiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJnZW5lcmF0ZUJsb2IiLCJibG9iIiwiZXJyIiwiZ2V0TWV0YWRhdGEiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwia2VlcENob3NlbkZpbGUiLCJoYWRJbWFnZSIsIm9yaWdpbmFsSW1hZ2UiLCJ2aWRlbyIsInBhdXNlIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwicGx1Z2luIiwiY2xpcFBsdWdpbnMiLCJwdXNoIiwiRXJyb3IiLCJmaWxlIiwiX29uTmV3RmlsZUluIiwic2xpY2UiLCJfc2V0Q29udGFpbmVyU2l6ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3NldFNpemUiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiZ2V0Q29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsImltYWdlU21vb3RoaW5nUXVhbGl0eSIsIndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiX3NldEluaXRpYWwiLCJvdXRwdXRIZWlnaHQiLCIkc2xvdHMiLCJwbGFjZWhvbGRlciIsInZOb2RlIiwidGFnIiwiZWxtIiwib25Mb2FkIiwiaW1hZ2VMb2FkZWQiLCJvbmxvYWQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJmb250U2l6ZSIsImNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSIsImZvbnQiLCJmaWxsU3R5bGUiLCJwbGFjZWhvbGRlckNvbG9yIiwiZmlsbFRleHQiLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJfc2V0VGV4dFBsYWNlaG9sZGVyIiwiaW5pdGlhbCIsImluaXRpYWxJbWFnZSIsInNldEF0dHJpYnV0ZSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJjdXJyZW50SXNJbml0aWFsIiwib25FcnJvciIsImxvYWRpbmciLCJfb25sb2FkIiwiZGF0YXNldCIsIm9uZXJyb3IiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsInZpZGVvV2lkdGgiLCJ2aWRlb0hlaWdodCIsImRyYXdGcmFtZSIsImZyYW1lIiwia2VlcERyYXdpbmciLCJlbmRlZCIsInBhdXNlZCIsImVtaXROYXRpdmVFdmVudCIsImRpc2FibGVDbGlja1RvQ2hvb3NlIiwic3VwcG9ydFRvdWNoIiwiY2hvb3NlRmlsZSIsInZpZGVvRW5hYmxlZCIsInBsYXkiLCJpbnB1dCIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiX2ZpbGVTaXplSXNWYWxpZCIsIkZJTEVfU0laRV9FWENFRURfRVZFTlQiLCJfZmlsZVR5cGVJc1ZhbGlkIiwiRklMRV9UWVBFX01JU01BVENIX0VWRU5UIiwibmFtZSIsInRvTG93ZXJDYXNlIiwicG9wIiwiZnIiLCJlIiwiZmlsZURhdGEiLCJ0YXJnZXQiLCJyZXN1bHQiLCJwYXJzZURhdGFVcmwiLCJpc1ZpZGVvIiwicmVhZHlTdGF0ZSIsIkhBVkVfRlVUVVJFX0RBVEEiLCJfb25WaWRlb0xvYWQiLCJnZXRGaWxlT3JpZW50YXRpb24iLCJiYXNlNjRUb0FycmF5QnVmZmVyIiwiTkVXX0lNQUdFX0VWRU5UIiwicmVhZEFzRGF0YVVSTCIsImZpbGVTaXplTGltaXQiLCJzaXplIiwiYWNjZXB0YWJsZU1pbWVUeXBlIiwiY2FuUGxheVR5cGUiLCJhY2NlcHQiLCJiYXNlTWltZXR5cGUiLCJyZXBsYWNlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJmaWxlQmFzZVR5cGUiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxTaXplIiwiX2FzcGVjdEZpdCIsIl9uYXR1cmFsU2l6ZSIsImluaXRpYWxQb3NpdGlvbiIsIl9hcHBseU1ldGFkYXRhIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJjYW52YXNSYXRpbyIsImFzcGVjdFJhdGlvIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsInNjcm9sbGluZyIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwicmVwbGFjZURyb3AiLCJmaWxlRHJhZ2dlZE92ZXIiLCJpdGVtcyIsIml0ZW0iLCJraW5kIiwiZ2V0QXNGaWxlIiwidXNlT3JpZ2luYWwiLCJsb2ciLCJkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbiIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIl9jbGlwIiwiX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoIiwiRFJBV19FVkVOVCIsIk5FV19JTUFHRV9EUkFXTl9FVkVOVCIsInJhZGl1cyIsImltYWdlQm9yZGVyUmFkaXVzIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwicXVhZHJhdGljQ3VydmVUbyIsImNsb3NlUGF0aCIsIl9jbGlwUGF0aEZhY3RvcnkiLCJmb3JFYWNoIiwiY3JlYXRlUGF0aCIsInNhdmUiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJmaWxsIiwicmVzdG9yZSIsImltZ1Jlc2l6ZWQiLCJmaWxlUmVhZGVyIiwicmF0aW8iLCJjYW52YXNFeGlmT3JpZW50YXRpb24iLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3RCLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Q0EsU0FBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2QixNQUFNLEFBQWlDO1FBQ3BDLGNBQWMsR0FBRyxPQUFPLEVBQUUsQ0FBQztLQUM5QixBQUVGO0NBQ0YsQ0FBQ0MsY0FBSSxFQUFFLFlBQVk7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
