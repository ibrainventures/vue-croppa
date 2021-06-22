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
  disableAutoOrientation: Boolean,
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
      console.warn('Your browser does not support vue-croppa functionality.');
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
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
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
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
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

      console.log('! Debug ! exif orient L730', orientation);
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
                console.log('can play event');
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
      if ((orientation > 1 || useOriginal) && !this.disableAutoOrientation) {
        if (!this.img) return;
        this.rotating = true;
        // u.getRotatedImageData(useOriginal ? this.originalImage : this.img, orientation)
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this8.img = _img;
          _this8._placeImage(applyMetadata);
          console.log('setorient step 1');
        };
      } else {
        this._placeImage(applyMetadata);
        console.log('setorient else step 1');
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        console.log('setorient else step 2 - 6');
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
        console.log('setorient else step 3 use ori');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XG4gIE51bWJlci5pc0ludGVnZXIgfHxcbiAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXG4gICAgKVxuICB9XG5cbnZhciBpbml0aWFsSW1hZ2VUeXBlID0gU3RyaW5nXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkltYWdlKSB7XG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2YWx1ZTogT2JqZWN0LFxuICB3aWR0aDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMDAsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgIH1cbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xuICB9LFxuICBwbGFjZWhvbGRlckNvbG9yOiB7XG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPj0gMFxuICAgIH1cbiAgfSxcbiAgY2FudmFzQ29sb3I6IHtcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIHF1YWxpdHk6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICB6b29tU3BlZWQ6IHtcbiAgICBkZWZhdWx0OiAzLFxuICAgIHR5cGU6IE51bWJlcixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBhY2NlcHQ6IFN0cmluZyxcbiAgZmlsZVNpemVMaW1pdDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA+PSAwXG4gICAgfVxuICB9LFxuICBkaXNhYmxlZDogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxuICBkaXNhYmxlQXV0b09yaWVudGF0aW9uOiBCb29sZWFuLFxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdUb01vdmU6IEJvb2xlYW4sXG4gIGRpc2FibGVTY3JvbGxUb1pvb206IEJvb2xlYW4sXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcbiAgZGlzYWJsZVJvdGF0aW9uOiBCb29sZWFuLFxuICByZXZlcnNlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcbiAgc2hvd1JlbW92ZUJ1dHRvbjoge1xuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuICByZW1vdmVCdXR0b25Db2xvcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAncmVkJ1xuICB9LFxuICByZW1vdmVCdXR0b25TaXplOiB7XG4gICAgdHlwZTogTnVtYmVyXG4gIH0sXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcbiAgaW5pdGlhbFNpemU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPT09ICdjb3ZlcicgfHwgdmFsID09PSAnY29udGFpbicgfHwgdmFsID09PSAnbmF0dXJhbCdcbiAgICB9XG4gIH0sXG4gIGluaXRpYWxQb3NpdGlvbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnY2VudGVyJyxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdmFsLnNwbGl0KCcgJykuZXZlcnkod29yZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcbiAgICAgICAgfSkgfHwgL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHZhbClcbiAgICAgIClcbiAgICB9XG4gIH0sXG4gIGlucHV0QXR0cnM6IE9iamVjdCxcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXG4gIGxvYWRpbmdTaXplOiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwXG4gIH0sXG4gIGxvYWRpbmdDb2xvcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcbiAgfSxcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXG4gIHBhc3NpdmU6IEJvb2xlYW4sXG4gIGltYWdlQm9yZGVyUmFkaXVzOiB7XG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICBkZWZhdWx0OiAwXG4gIH0sXG4gIGF1dG9TaXppbmc6IEJvb2xlYW4sXG4gIHZpZGVvRW5hYmxlZDogQm9vbGVhbixcbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0VfRVZFTlQ6ICduZXctaW1hZ2UnLFxuICBORVdfSU1BR0VfRFJBV05fRVZFTlQ6ICduZXctaW1hZ2UtZHJhd24nLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBV19FVkVOVDogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcbiAgTE9BRElOR19TVEFSVF9FVkVOVDogJ2xvYWRpbmctc3RhcnQnLFxuICBMT0FESU5HX0VORF9FVkVOVDogJ2xvYWRpbmctZW5kJ1xufVxuIiwiPHRlbXBsYXRlPlxuICA8ZGl2XG4gICAgcmVmPVwid3JhcHBlclwiXG4gICAgOmNsYXNzPVwiYGNyb3BwYS1jb250YWluZXIgJHtpbWcgPyAnY3JvcHBhLS1oYXMtdGFyZ2V0JyA6ICcnfSAke1xuICAgICAgcGFzc2l2ZSA/ICdjcm9wcGEtLXBhc3NpdmUnIDogJydcbiAgICB9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtcbiAgICAgIGRpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJydcbiAgICB9ICR7XG4gICAgICBkaXNhYmxlRHJhZ1RvTW92ZSAmJiBkaXNhYmxlU2Nyb2xsVG9ab29tID8gJ2Nyb3BwYS0tZGlzYWJsZWQtbXonIDogJydcbiAgICB9ICR7ZmlsZURyYWdnZWRPdmVyID8gJ2Nyb3BwYS0tZHJvcHpvbmUnIDogJyd9YFwiXG4gICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0VudGVyXCJcbiAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxuICAgIEBkcmFnb3Zlci5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ092ZXJcIlxuICAgIEBkcm9wLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcm9wXCJcbiAgPlxuICAgIDxpbnB1dFxuICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXG4gICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgICB2LWJpbmQ9XCJpbnB1dEF0dHJzXCJcbiAgICAgIHJlZj1cImZpbGVJbnB1dFwiXG4gICAgICBAY2hhbmdlPVwiX2hhbmRsZUlucHV0Q2hhbmdlXCJcbiAgICAgIHN0eWxlPVwiXG4gICAgICAgIGhlaWdodDogMXB4O1xuICAgICAgICB3aWR0aDogMXB4O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBtYXJnaW4tbGVmdDogLTk5OTk5cHg7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIFwiXG4gICAgLz5cbiAgICA8ZGl2IGNsYXNzPVwic2xvdHNcIiBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlblwiPlxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XG4gICAgPC9kaXY+XG4gICAgPGNhbnZhc1xuICAgICAgcmVmPVwiY2FudmFzXCJcbiAgICAgIEBjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlQ2xpY2tcIlxuICAgICAgQGRibGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVEYmxDbGlja1wiXG4gICAgICBAdG91Y2hzdGFydC5zdG9wPVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEB0b3VjaGVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXG4gICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHBvaW50ZXJlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNobW92ZS5zdG9wPVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBtb3VzZW1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxuICAgICAgQHBvaW50ZXJsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckxlYXZlXCJcbiAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICAgIEB3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICAgIEBtb3VzZXdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxuICAgID48L2NhbnZhcz5cbiAgICA8c3ZnXG4gICAgICBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxuICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nICYmICFwYXNzaXZlXCJcbiAgICAgIEBjbGljaz1cInJlbW92ZVwiXG4gICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQgLyA0MH1weDsgcmlnaHQ6IC0ke3dpZHRoIC8gNDB9cHhgXCJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcbiAgICAgIHZlcnNpb249XCIxLjFcIlxuICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aCAvIDEwXCJcbiAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoIC8gMTBcIlxuICAgID5cbiAgICAgIDxwYXRoXG4gICAgICAgIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxuICAgICAgICA6ZmlsbD1cInJlbW92ZUJ1dHRvbkNvbG9yXCJcbiAgICAgID48L3BhdGg+XG4gICAgPC9zdmc+XG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCJcbiAgICAgIDpzdHlsZT1cImxvYWRpbmdTdHlsZVwiXG4gICAgICB2LWlmPVwic2hvd0xvYWRpbmcgJiYgbG9hZGluZ1wiXG4gICAgPlxuICAgICAgPGRpdiA6Y2xhc3M9XCJgc2stY2lyY2xlJHtpfSBzay1jaXJjbGVgXCIgdi1mb3I9XCJpIGluIDEyXCIgOmtleT1cImlcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwic2stY2lyY2xlLWluZGljYXRvclwiXG4gICAgICAgICAgOnN0eWxlPVwieyBiYWNrZ3JvdW5kQ29sb3I6IGxvYWRpbmdDb2xvciB9XCJcbiAgICAgICAgPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPHNsb3Q+PC9zbG90PlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5pbXBvcnQgdSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgcHJvcHMgZnJvbSAnLi9wcm9wcydcbmltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXG5cbmNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxuY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cbmNvbnN0IENMSUNLX01PVkVfVEhSRVNIT0xEID0gMTAwIC8vIElmIHRvdWNoIG1vdmUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUsIHRoZW4gaXQgd2lsbCBieSBubyBtZWFuIGJlIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cbmNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxuY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxuY29uc3QgUElOQ0hfQUNDRUxFUkFUSU9OID0gMSAvLyBUaGUgYW1vdW50IG9mIHRpbWVzIGJ5IHdoaWNoIHRoZSBwaW5jaGluZyBpcyBtb3JlIHNlbnNpdGl2ZSB0aGFuIHRoZSBzY29sbGluZ1xuXG5jb25zdCBzeW5jRGF0YSA9IFsnaW1nRGF0YScsICdpbWcnLCAnaW1nU2V0JywgJ29yaWdpbmFsSW1hZ2UnLCAnbmF0dXJhbEhlaWdodCcsICduYXR1cmFsV2lkdGgnLCAnb3JpZW50YXRpb24nLCAnc2NhbGVSYXRpbyddXG4vLyBjb25zdCBERUJVRyA9IGZhbHNlXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbW9kZWw6IHtcbiAgICBwcm9wOiAndmFsdWUnLFxuICAgIGV2ZW50OiBldmVudHMuSU5JVF9FVkVOVFxuICB9LFxuXG4gIHByb3BzOiBwcm9wcyxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2FudmFzOiBudWxsLFxuICAgICAgY3R4OiBudWxsLFxuICAgICAgb3JpZ2luYWxJbWFnZTogbnVsbCxcbiAgICAgIGltZzogbnVsbCxcbiAgICAgIHZpZGVvOiBudWxsLFxuICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgbGFzdE1vdmluZ0Nvb3JkOiBudWxsLFxuICAgICAgaW1nRGF0YToge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMFxuICAgICAgfSxcbiAgICAgIGZpbGVEcmFnZ2VkT3ZlcjogZmFsc2UsXG4gICAgICB0YWJTdGFydDogMCxcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXG4gICAgICBwaW5jaGluZzogZmFsc2UsXG4gICAgICByb3RhdGluZzogZmFsc2UsXG4gICAgICBwaW5jaERpc3RhbmNlOiAwLFxuICAgICAgc3VwcG9ydFRvdWNoOiBmYWxzZSxcbiAgICAgIHBvaW50ZXJNb3ZlZDogZmFsc2UsXG4gICAgICBwb2ludGVyU3RhcnRDb29yZDogbnVsbCxcbiAgICAgIG5hdHVyYWxXaWR0aDogMCxcbiAgICAgIG5hdHVyYWxIZWlnaHQ6IDAsXG4gICAgICBzY2FsZVJhdGlvOiBudWxsLFxuICAgICAgb3JpZW50YXRpb246IDEsXG4gICAgICB1c2VyTWV0YWRhdGE6IG51bGwsXG4gICAgICBpbWFnZVNldDogZmFsc2UsXG4gICAgICBjdXJyZW50UG9pbnRlckNvb3JkOiBudWxsLFxuICAgICAgY3VycmVudElzSW5pdGlhbDogZmFsc2UsXG4gICAgICBfbG9hZGluZzogZmFsc2UsXG4gICAgICByZWFsV2lkdGg6IDAsIC8vIG9ubHkgZm9yIHdoZW4gYXV0b1NpemluZyBpcyBvblxuICAgICAgcmVhbEhlaWdodDogMCwgLy8gb25seSBmb3Igd2hlbiBhdXRvU2l6aW5nIGlzIG9uXG4gICAgICBjaG9zZW5GaWxlOiBudWxsLFxuICAgICAgdXNlQXV0b1NpemluZzogZmFsc2UsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgb3V0cHV0V2lkdGggKCkge1xuICAgICAgY29uc3QgdyA9IHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbFdpZHRoIDogdGhpcy53aWR0aFxuICAgICAgcmV0dXJuIHcgKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgb3V0cHV0SGVpZ2h0ICgpIHtcbiAgICAgIGNvbnN0IGggPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodFxuICAgICAgcmV0dXJuIGggKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyRm9udFNpemUgKiB0aGlzLnF1YWxpdHlcbiAgICB9LFxuXG4gICAgYXNwZWN0UmF0aW8gKCkge1xuICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgfSxcblxuICAgIGxvYWRpbmdTdHlsZSAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXG4gICAgICAgIGhlaWdodDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXG4gICAgICAgIHJpZ2h0OiAnMTVweCcsXG4gICAgICAgIGJvdHRvbTogJzEwcHgnXG4gICAgICB9XG4gICAgfSxcblxuICAgIGxvYWRpbmc6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZ1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGxldCBvbGRWYWx1ZSA9IHRoaXMuX2xvYWRpbmdcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IG5ld1ZhbHVlXG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPSBuZXdWYWx1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkxPQURJTkdfU1RBUlRfRVZFTlQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX0VORF9FVkVOVClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZSgpXG4gICAgdS5yQUZQb2x5ZmlsbCgpXG4gICAgdS50b0Jsb2JQb2x5ZmlsbCgpXG5cbiAgICBsZXQgc3VwcG9ydHMgPSB0aGlzLnN1cHBvcnREZXRlY3Rpb24oKVxuICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcbiAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFzc2l2ZSkge1xuICAgICAgdGhpcy4kd2F0Y2goJ3ZhbHVlLl9kYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHNldCA9IGZhbHNlXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgaWYgKHN5bmNEYXRhLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgICBsZXQgdmFsID0gZGF0YVtrZXldXG4gICAgICAgICAgICBpZiAodmFsICE9PSB0aGlzW2tleV0pIHtcbiAgICAgICAgICAgICAgdGhpcy4kc2V0KHRoaXMsIGtleSwgdmFsKVxuICAgICAgICAgICAgICBzZXQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZXQpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICAgIGRlZXA6IHRydWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVzZUF1dG9TaXppbmcgPSAhISh0aGlzLmF1dG9TaXppbmcgJiYgdGhpcy4kcmVmcy53cmFwcGVyICYmIGdldENvbXB1dGVkU3R5bGUpXG4gICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xuICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxuICAgIH1cbiAgfSxcblxuICBiZWZvcmVEZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICB0aGlzLl9hdXRvU2l6aW5nUmVtb3ZlKClcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBvdXRwdXRXaWR0aDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vbkRpbWVuc2lvbkNoYW5nZSgpXG4gICAgfSxcbiAgICBvdXRwdXRIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxuICAgIH0sXG4gICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgfVxuICAgIH0sXG4gICAgaW1hZ2VCb3JkZXJSYWRpdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuICAgIHBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwbGFjZWhvbGRlckNvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXZlbnRXaGl0ZVNwYWNlICh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICB9LFxuICAgIHNjYWxlUmF0aW8gKHZhbCwgb2xkVmFsKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxuXG4gICAgICB2YXIgeCA9IDFcbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKG9sZFZhbCkgJiYgb2xkVmFsICE9PSAwKSB7XG4gICAgICAgIHggPSB2YWwgLyBvbGRWYWxcbiAgICAgIH1cbiAgICAgIHZhciBwb3MgPSB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgfHwge1xuICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcbiAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXG4gICAgICB9XG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHZhbFxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHZhbFxuXG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhICYmIHRoaXMuaW1hZ2VTZXQgJiYgIXRoaXMucm90YXRpbmcpIHtcbiAgICAgICAgbGV0IG9mZnNldFggPSAoeCAtIDEpICogKHBvcy54IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WClcbiAgICAgICAgbGV0IG9mZnNldFkgPSAoeCAtIDEpICogKHBvcy55IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSlcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZIC0gb2Zmc2V0WVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICAgIHRoaXMuX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEud2lkdGgnOiBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xuICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5aT09NX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAnaW1nRGF0YS5oZWlnaHQnOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuc3RhcnRYJzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXG4gICAgICB9XG4gICAgfSxcbiAgICAnaW1nRGF0YS5zdGFydFknOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5fZHJhdylcbiAgICAgIH1cbiAgICB9LFxuICAgIGF1dG9TaXppbmcgKHZhbCkge1xuICAgICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nSW5pdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hdXRvU2l6aW5nUmVtb3ZlKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGVtaXRFdmVudCAoLi4uYXJncykge1xuICAgICAgLy8gY29uc29sZS5sb2coYXJnc1swXSlcbiAgICAgIHRoaXMuJGVtaXQoLi4uYXJncyk7XG4gICAgfSxcblxuICAgIGdldENhbnZhcyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXNcbiAgICB9LFxuXG4gICAgZ2V0Q29udGV4dCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdHhcbiAgICB9LFxuXG4gICAgZ2V0Q2hvc2VuRmlsZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaG9zZW5GaWxlIHx8IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdXG4gICAgfSxcblxuICAgIG1vdmUgKG9mZnNldCkge1xuICAgICAgaWYgKCFvZmZzZXQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCBvbGRYID0gdGhpcy5pbWdEYXRhLnN0YXJ0WFxuICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZICs9IG9mZnNldC55XG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk1PVkVfRVZFTlQpXG4gICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxuICAgIH0sXG5cbiAgICBtb3ZlRG93bndhcmRzIChhbW91bnQgPSAxKSB7XG4gICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZUxlZnR3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXG4gICAgfSxcblxuICAgIHpvb20gKHpvb21JbiA9IHRydWUsIGFjY2VsZXJhdGlvbiA9IDEpIHtcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgbGV0IHJlYWxTcGVlZCA9IHRoaXMuem9vbVNwZWVkICogYWNjZWxlcmF0aW9uXG4gICAgICBsZXQgc3BlZWQgPSAodGhpcy5vdXRwdXRXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcbiAgICAgIGxldCB4ID0gMVxuICAgICAgaWYgKHpvb21Jbikge1xuICAgICAgICB4ID0gMSArIHNwZWVkXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xuICAgICAgICB4ID0gMSAtIHNwZWVkXG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gYSBuZXcgaW1hZ2UgaXMgbG9hZGVkIHdpdGggdGhlIHNhbWUgYXNwZWN0IHJhdGlvXG4gICAgICAvLyBhcyB0aGUgcHJldmlvdXNseSByZW1vdmUoKWQgb25lLCB0aGUgaW1nRGF0YS53aWR0aCBhbmQgLmhlaWdodFxuICAgICAgLy8gZWZmZWN0aXZlbGx5IGRvbid0IGNoYW5nZSAodGhleSBjaGFuZ2UgdGhyb3VnaCBvbmUgdGlja1xuICAgICAgLy8gYW5kIGVuZCB1cCBiZWluZyB0aGUgc2FtZSBhcyBiZWZvcmUgdGhlIHRpY2ssIHNvIHRoZVxuICAgICAgLy8gd2F0Y2hlcnMgZG9uJ3QgdHJpZ2dlciksIG1ha2Ugc3VyZSBzY2FsZVJhdGlvIGlzbid0IG51bGwgc29cbiAgICAgIC8vIHRoYXQgem9vbWluZyB3b3Jrcy4uLlxuICAgICAgaWYgKHRoaXMuc2NhbGVSYXRpbyA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gKj0geFxuICAgIH0sXG5cbiAgICB6b29tSW4gKCkge1xuICAgICAgdGhpcy56b29tKHRydWUpXG4gICAgfSxcblxuICAgIHpvb21PdXQgKCkge1xuICAgICAgdGhpcy56b29tKGZhbHNlKVxuICAgIH0sXG5cbiAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXG4gICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCBhcmd1bWVudCBmb3Igcm90YXRlKCkgbWV0aG9kLiBJdCBzaG91bGQgb25lIG9mIHRoZSBpbnRlZ2VycyBmcm9tIC0zIHRvIDMuJylcbiAgICAgICAgc3RlcCA9IDFcbiAgICAgIH1cbiAgICAgIHRoaXMuX3JvdGF0ZUJ5U3RlcChzdGVwKVxuICAgIH0sXG5cbiAgICBmbGlwWCAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24oMilcbiAgICB9LFxuXG4gICAgZmxpcFkgKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDQpXG4gICAgfSxcblxuICAgIHJlZnJlc2ggKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcbiAgICB9LFxuXG4gICAgaGFzSW1hZ2UgKCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5pbWFnZVNldFxuICAgIH0sXG4gICAgYXBwbHlNZXRhZGF0YVdpdGhQaXhlbERlbnNpdHkgKG1ldGFkYXRhKSB7XG4gICAgICBpZiAobWV0YWRhdGEpIHtcbiAgICAgICAgbGV0IHN0b3JlZFBpeGVsRGVuc2l0eSA9IG1ldGFkYXRhLnBpeGVsRGVuc2l0eSB8fCAxXG4gICAgICAgIGxldCBjdXJyZW50UGl4ZWxEZW5zaXR5ID0gdGhpcy5xdWFsaXR5XG4gICAgICAgIGxldCBwaXhlbERlbnNpdHlEaWZmID0gY3VycmVudFBpeGVsRGVuc2l0eSAvIHN0b3JlZFBpeGVsRGVuc2l0eVxuICAgICAgICBtZXRhZGF0YS5zdGFydFggPSBtZXRhZGF0YS5zdGFydFggKiBwaXhlbERlbnNpdHlEaWZmXG4gICAgICAgIG1ldGFkYXRhLnN0YXJ0WSA9IG1ldGFkYXRhLnN0YXJ0WSAqIHBpeGVsRGVuc2l0eURpZmZcbiAgICAgICAgbWV0YWRhdGEuc2NhbGUgPSBtZXRhZGF0YS5zY2FsZSAqIHBpeGVsRGVuc2l0eURpZmZcblxuICAgICAgICB0aGlzLmFwcGx5TWV0YWRhdGEobWV0YWRhdGEpXG4gICAgICB9XG4gICAgfSxcbiAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xuICAgICAgaWYgKCFtZXRhZGF0YSB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpLCB0cnVlKVxuICAgIH0sXG4gICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4gJydcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy50b0RhdGFVUkwodHlwZSwgY29tcHJlc3Npb25SYXRlKVxuICAgIH0sXG5cbiAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICBjYWxsYmFjayhudWxsKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuY2FudmFzLnRvQmxvYihjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudClcbiAgICB9LFxuXG4gICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XG4gICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdObyBQcm9taXNlIHN1cHBvcnQuIFBsZWFzZSBhZGQgUHJvbWlzZSBwb2x5ZmlsbCBpZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBtZXRob2QuJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGJsb2IpXG4gICAgICAgICAgfSwgLi4uYXJncylcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgZ2V0TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiB7fVxuICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFkgfSA9IHRoaXMuaW1nRGF0YVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGVSYXRpbyxcbiAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0TWV0YWRhdGFXaXRoUGl4ZWxEZW5zaXR5ICgpIHtcbiAgICAgIGxldCBtZXRhZGF0YSA9IHRoaXMuZ2V0TWV0YWRhdGEoKVxuICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgIG1ldGFkYXRhLnBpeGVsRGVuc2l0eSA9IHRoaXMucXVhbGl0eVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1ldGFkYXRhXG4gICAgfSxcblxuICAgIHN1cHBvcnREZXRlY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXG4gICAgICAgICdkbmQnOiAnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXZcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvb3NlRmlsZSAoKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcbiAgICB9LFxuXG4gICAgcmVtb3ZlIChrZWVwQ2hvc2VuRmlsZSA9IGZhbHNlKSB7XG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHJldHVyblxuICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcblxuICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxuICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxuICAgICAgdGhpcy5pbWcgPSBudWxsXG4gICAgICB0aGlzLmltZ0RhdGEgPSB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgc3RhcnRZOiAwXG4gICAgICB9XG4gICAgICB0aGlzLm9yaWVudGF0aW9uID0gMVxuICAgICAgdGhpcy5zY2FsZVJhdGlvID0gbnVsbFxuICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXG4gICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgIGlmICgha2VlcENob3NlbkZpbGUpIHtcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICB9XG4gICAgICBpZiAodGhpcy52aWRlbykge1xuICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgdGhpcy52aWRlbyA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKGhhZEltYWdlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIGFkZENsaXBQbHVnaW4gKHBsdWdpbikge1xuICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMgPSBbXVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBlbWl0TmF0aXZlRXZlbnQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZ0LnR5cGUsIGV2dCk7XG4gICAgfSxcblxuICAgIHNldEZpbGUgKGZpbGUpIHtcbiAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgfSxcblxuICAgIF9zZXRDb250YWluZXJTaXplICgpIHtcbiAgICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgICAgdGhpcy5yZWFsV2lkdGggPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLndpZHRoLnNsaWNlKDAsIC0yKVxuICAgICAgICB0aGlzLnJlYWxIZWlnaHQgPSArZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRyZWZzLndyYXBwZXIpLmhlaWdodC5zbGljZSgwLCAtMilcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2F1dG9TaXppbmdJbml0ICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nUmVtb3ZlICgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3NldENvbnRhaW5lclNpemUpXG4gICAgfSxcblxuICAgIF9pbml0aWFsaXplICgpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kcmVmcy5jYW52YXNcbiAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gXCJoaWdoXCI7XG4gICAgICB0aGlzLmN0eC53ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHgubXNJbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBudWxsXG4gICAgICB0aGlzLl9zZXRJbml0aWFsKClcbiAgICAgIGlmICghdGhpcy5wYXNzaXZlKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0U2l6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGgpICsgJ3B4J1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMudXNlQXV0b1NpemluZyA/IHRoaXMucmVhbEhlaWdodCA6IHRoaXMuaGVpZ2h0KSArICdweCdcbiAgICB9LFxuXG4gICAgX3JvdGF0ZUJ5U3RlcCAoc3RlcCkge1xuICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgc3dpdGNoIChzdGVwKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA4XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMjpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0zOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcbiAgICB9LFxuXG4gICAgX3NldEltYWdlUGxhY2Vob2xkZXIgKCkge1xuICAgICAgbGV0IGltZ1xuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdXG4gICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxuICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xuICAgICAgICAgIGltZyA9IGVsbVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaW1nKSByZXR1cm5cblxuICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB9XG5cbiAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcbiAgICAgICAgb25Mb2FkKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltZy5vbmxvYWQgPSBvbkxvYWRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFRleHRQbGFjZWhvbGRlciAoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xuICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXG4gICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5vdXRwdXRXaWR0aCAqIERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIC8gdGhpcy5wbGFjZWhvbGRlci5sZW5ndGhcbiAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZVxuICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xuICAgICAgY3R4LmZpbGxTdHlsZSA9ICghdGhpcy5wbGFjZWhvbGRlckNvbG9yIHx8IHRoaXMucGxhY2Vob2xkZXJDb2xvciA9PSAnZGVmYXVsdCcpID8gJyM2MDYwNjAnIDogdGhpcy5wbGFjZWhvbGRlckNvbG9yXG4gICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5vdXRwdXRXaWR0aCAvIDIsIHRoaXMub3V0cHV0SGVpZ2h0IC8gMilcbiAgICB9LFxuXG4gICAgX3NldFBsYWNlaG9sZGVycyAoKSB7XG4gICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxuICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXG4gICAgICB0aGlzLl9zZXRUZXh0UGxhY2Vob2xkZXIoKVxuICAgIH0sXG5cbiAgICBfc2V0SW5pdGlhbCAoKSB7XG4gICAgICBsZXQgc3JjLCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcbiAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMuaW5pdGlhbFswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgICAgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xuICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXG4gICAgICAgIH1cbiAgICAgICAgaW1nLnNyYyA9IHNyY1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICAgICAgaW1nID0gdGhpcy5pbml0aWFsSW1hZ2VcbiAgICAgIH1cbiAgICAgIGlmICghc3JjICYmICFpbWcpIHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSB0cnVlXG5cbiAgICAgIGxldCBvbkVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgaWYgKGltZy5jb21wbGV0ZSkge1xuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgICAgLy8gdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25FcnJvcigpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAvLyB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgIG9uRXJyb3IoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxLCBpbml0aWFsKSB7XG4gICAgICBjb25zb2xlLmxvZygnISBEZWJ1ZyAhIGV4aWYgb3JpZW50IEw3MzAnLCBvcmllbnRhdGlvbilcbiAgICAgIGlmICh0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKHRydWUpXG4gICAgICB9XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcbiAgICAgIHRoaXMuaW1nID0gaW1nXG5cbiAgICAgIGlmIChpc05hTihvcmllbnRhdGlvbikpIHtcbiAgICAgICAgb3JpZW50YXRpb24gPSAxXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxuXG4gICAgICBpZiAoaW5pdGlhbCkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9vblZpZGVvTG9hZCAodmlkZW8sIGluaXRpYWwpIHtcbiAgICAgIHRoaXMudmlkZW8gPSB2aWRlb1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAgIGNvbnN0IHsgdmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQgfSA9IHZpZGVvXG4gICAgICBjYW52YXMud2lkdGggPSB2aWRlb1dpZHRoXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW9IZWlnaHRcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgY29uc3QgZHJhd0ZyYW1lID0gKGluaXRpYWwpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZpZGVvKSByZXR1cm5cbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnZpZGVvLCAwLCAwLCB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodClcbiAgICAgICAgY29uc3QgZnJhbWUgPSBuZXcgSW1hZ2UoKVxuICAgICAgICBmcmFtZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKClcbiAgICAgICAgZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW1nID0gZnJhbWVcbiAgICAgICAgICAvLyB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgICAgICBpZiAoaW5pdGlhbCkge1xuICAgICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZHJhd0ZyYW1lKHRydWUpXG4gICAgICBjb25zdCBrZWVwRHJhd2luZyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGRyYXdGcmFtZSgpXG4gICAgICAgICAgaWYgKCF0aGlzLnZpZGVvIHx8IHRoaXMudmlkZW8uZW5kZWQgfHwgdGhpcy52aWRlby5wYXVzZWQpIHJldHVyblxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShrZWVwRHJhd2luZylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsICgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2hhbmRsZUNsaWNrIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCAmJiAhdGhpcy5wYXNzaXZlKSB7XG4gICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVEYmxDbGljayAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy52aWRlb0VuYWJsZWQgJiYgdGhpcy52aWRlbykge1xuICAgICAgICBpZiAodGhpcy52aWRlby5wYXVzZWQgfHwgdGhpcy52aWRlby5lbmRlZCkge1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVJbnB1dENoYW5nZSAoKSB7XG4gICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxuICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGggfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cblxuICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxuICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcbiAgICB9LFxuXG4gICAgX29uTmV3RmlsZUluIChmaWxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSBmYWxzZVxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfQ0hPT1NFX0VWRU5ULCBmaWxlKVxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gZmlsZTtcbiAgICAgIGlmICghdGhpcy5fZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5fZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXG4gICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcbiAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcbiAgICAgICAgICBjb25zdCBiYXNlNjQgPSB1LnBhcnNlRGF0YVVybChmaWxlRGF0YSlcbiAgICAgICAgICBjb25zdCBpc1ZpZGVvID0gL152aWRlby8udGVzdChmaWxlLnR5cGUpXG4gICAgICAgICAgaWYgKGlzVmlkZW8pIHtcbiAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcbiAgICAgICAgICAgIHZpZGVvLnNyYyA9IGZpbGVEYXRhXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+PSB2aWRlby5IQVZFX0ZVVFVSRV9EQVRBKSB7XG4gICAgICAgICAgICAgIHRoaXMuX29uVmlkZW9Mb2FkKHZpZGVvKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2FuIHBsYXkgZXZlbnQnKVxuICAgICAgICAgICAgICAgIHRoaXMuX29uVmlkZW9Mb2FkKHZpZGVvKVxuICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkpXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHsgfVxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uIDwgMSkgb3JpZW50YXRpb24gPSAxXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxuICAgICAgICAgICAgZmlsZURhdGEgPSBudWxsO1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXG4gICAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRVZFTlQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2ZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICghdGhpcy5maWxlU2l6ZUxpbWl0IHx8IHRoaXMuZmlsZVNpemVMaW1pdCA9PSAwKSByZXR1cm4gdHJ1ZVxuXG4gICAgICByZXR1cm4gZmlsZS5zaXplIDwgdGhpcy5maWxlU2l6ZUxpbWl0XG4gICAgfSxcblxuICAgIF9maWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcbiAgICAgIGNvbnN0IGFjY2VwdGFibGVNaW1lVHlwZSA9ICh0aGlzLnZpZGVvRW5hYmxlZCAmJiAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSkgJiYgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZShmaWxlLnR5cGUpKSB8fCAvXmltYWdlLy50ZXN0KGZpbGUudHlwZSlcbiAgICAgIGlmICghYWNjZXB0YWJsZU1pbWVUeXBlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICghdGhpcy5hY2NlcHQpIHJldHVybiB0cnVlXG4gICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHRcbiAgICAgIGxldCBiYXNlTWltZXR5cGUgPSBhY2NlcHQucmVwbGFjZSgvXFwvLiokLywgJycpXG4gICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxldCB0eXBlID0gdHlwZXNbaV1cbiAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxuICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XG4gICAgICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKCkgPT09IHQudG9Mb3dlckNhc2UoKS5zbGljZSgxKSkgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xuICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXG4gICAgICAgICAgaWYgKGZpbGVCYXNlVHlwZSA9PT0gYmFzZU1pbWV0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0sXG5cbiAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB2YXIgaW1nRGF0YSA9IHRoaXMuaW1nRGF0YVxuXG4gICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxuICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxuXG4gICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXG4gICAgICBpbWdEYXRhLnN0YXJ0WSA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFkpID8gaW1nRGF0YS5zdGFydFkgOiAwXG5cbiAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxuICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnY29udGFpbicpIHtcbiAgICAgICAgICB0aGlzLl9hc3BlY3RGaXQoKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XG4gICAgICAgICAgdGhpcy5fbmF0dXJhbFNpemUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0ICogdGhpcy5zY2FsZVJhdGlvXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xuICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9sZWZ0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHRoaXMub3V0cHV0V2lkdGggLSBpbWdEYXRhLndpZHRoXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL14tP1xcZCslIC0/XFxkKyUkLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxuICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxuICAgICAgICAgIHZhciB5ID0gK3Jlc3VsdFsyXSAvIDEwMFxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcbiAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHkgKiAodGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuX2FwcGx5TWV0YWRhdGEoKVxuXG4gICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XG4gICAgICAgIHRoaXMuem9vbShmYWxzZSwgMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RyYXcoKVxuICAgIH0sXG5cbiAgICBfYXNwZWN0RmlsbCAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICBsZXQgc2NhbGVSYXRpb1xuXG4gICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hc3BlY3RGaXQgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgbGV0IHNjYWxlUmF0aW9cbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX25hdHVyYWxTaXplICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aFxuICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5zdXBwb3J0VG91Y2ggPSB0cnVlXG4gICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IGZhbHNlXG4gICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBwb2ludGVyQ29vcmRcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxuICAgICAgLy8gc2ltdWxhdGUgY2xpY2sgd2l0aCB0b3VjaCBvbiBtb2JpbGUgZGV2aWNlc1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcbiAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcbiAgICAgIGlmIChldnQud2hpY2ggJiYgZXZ0LndoaWNoID4gMSkgcmV0dXJuXG5cbiAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXG4gICAgICB9XG5cbiAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxuICAgICAgfVxuXG4gICAgICBsZXQgY2FuY2VsRXZlbnRzID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJywgJ3BvaW50ZXJlbmQnLCAncG9pbnRlcmNhbmNlbCddXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuY2VsRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgdGhpcy5faGFuZGxlUG9pbnRlckVuZClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcbiAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XG4gICAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVyblxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcbiAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXG4gICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXG4gICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXG4gICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IG51bGxcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcbiAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxuICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcbiAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IGNvb3JkXG5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUpIHJldHVyblxuXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlKHtcbiAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxuICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcbiAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cbiAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcbiAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcbiAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlckxlYXZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gbnVsbFxuICAgIH0sXG5cbiAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVTY3JvbGxUb1pvb20gfHwgIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlXG4gICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XG4gICAgICAgIHRoaXMuem9vbSh0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXG4gICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xuICAgICAgICB0aGlzLnpvb20oIXRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcbiAgICAgIH1cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdFbnRlciAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHJldHVyblxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSB0cnVlXG4gICAgfSxcblxuICAgIF9oYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdPdmVyIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyb3AgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXG5cbiAgICAgIGxldCBmaWxlXG4gICAgICBsZXQgZHQgPSBldnQuZGF0YVRyYW5zZmVyXG4gICAgICBpZiAoIWR0KSByZXR1cm5cbiAgICAgIGlmIChkdC5pdGVtcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZHQuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXG4gICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcbiAgICAgICAgICAgIGZpbGUgPSBpdGVtLmdldEFzRmlsZSgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gMFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vdXRwdXRXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aClcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm91dHB1dEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlICgpIHtcbiAgICAgIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPCB0aGlzLm91dHB1dFdpZHRoKSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMub3V0cHV0SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHRoaXMub3V0cHV0SGVpZ2h0IC8gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb24gPSAxLCBhcHBseU1ldGFkYXRhKSB7XG4gICAgICB2YXIgdXNlT3JpZ2luYWwgPSBhcHBseU1ldGFkYXRhXG4gICAgICBpZiAoKG9yaWVudGF0aW9uID4gMSB8fCB1c2VPcmlnaW5hbCkgJiYgIXRoaXMuZGlzYWJsZUF1dG9PcmllbnRhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IHRydWVcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICAgICAgY29uc29sZS5sb2coJ3NldG9yaWVudCBzdGVwIDEnKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXRvcmllbnQgZWxzZSBzdGVwIDEnKVxuICAgICAgfVxuXG4gICAgICBpZiAob3JpZW50YXRpb24gPT0gMikge1xuICAgICAgICAvLyBmbGlwIHhcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFgodGhpcy5vcmllbnRhdGlvbilcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNCkge1xuICAgICAgICAvLyBmbGlwIHlcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFkodGhpcy5vcmllbnRhdGlvbilcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gNikge1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0b3JpZW50IGVsc2Ugc3RlcCAyIC0gNicpXG4gICAgICAgIC8vIDkwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XG4gICAgICAgIC8vIDE4MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSlcbiAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xuICAgICAgICAvLyAyNzAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodS5yb3RhdGU5MCh0aGlzLm9yaWVudGF0aW9uKSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cbiAgICAgIH1cblxuICAgICAgaWYgKHVzZU9yaWdpbmFsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXRvcmllbnQgZWxzZSBzdGVwIDMgdXNlIG9yaScpXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcGFpbnRCYWNrZ3JvdW5kICgpIHtcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgfSxcblxuICAgIF9kcmF3ICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIF9kcmF3RnJhbWUgKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVDb250YWluZXJDbGlwUGF0aClcbiAgICAgICAgLy8gdGhpcy5fY2xpcCh0aGlzLl9jcmVhdGVJbWFnZUNsaXBQYXRoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRFJBV19FVkVOVCwgY3R4KVxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5ORVdfSU1BR0VfRFJBV05fRVZFTlQpXG4gICAgICB9XG4gICAgICB0aGlzLnJvdGF0aW5nID0gZmFsc2VcbiAgICB9LFxuXG4gICAgX2NsaXBQYXRoRmFjdG9yeSAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XG4gICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cbiAgICAgICAgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA6XG4gICAgICAgICFpc05hTihOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykpID8gTnVtYmVyKHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMpIDogMFxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcbiAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XG4gICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoICgpIHtcbiAgICAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgIGlmICh0aGlzLmNsaXBQbHVnaW5zICYmIHRoaXMuY2xpcFBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2xpcFBsdWdpbnMuZm9yRWFjaChmdW5jID0+IHtcbiAgICAgICAgICBmdW5jKHRoaXMuY3R4LCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gX2NyZWF0ZUltYWdlQ2xpcFBhdGggKCkge1xuICAgIC8vICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxuICAgIC8vICAgbGV0IHcgPSB3aWR0aFxuICAgIC8vICAgbGV0IGggPSBoZWlnaHRcbiAgICAvLyAgIGxldCB4ID0gc3RhcnRYXG4gICAgLy8gICBsZXQgeSA9IHN0YXJ0WVxuICAgIC8vICAgaWYgKHcgPCBoKSB7XG4gICAgLy8gICAgIGggPSB0aGlzLm91dHB1dEhlaWdodCAqICh3aWR0aCAvIHRoaXMub3V0cHV0V2lkdGgpXG4gICAgLy8gICB9XG4gICAgLy8gICBpZiAoaCA8IHcpIHtcbiAgICAvLyAgICAgdyA9IHRoaXMub3V0cHV0V2lkdGggKiAoaGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgLy8gICAgIHggPSBzdGFydFggKyAod2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAvLyAgIH1cbiAgICAvLyAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSh4LCBzdGFydFksIHcsIGgpXG4gICAgLy8gfSxcblxuICAgIF9jbGlwIChjcmVhdGVQYXRoKSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGN0eC5zYXZlKClcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZidcbiAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXG4gICAgICBjcmVhdGVQYXRoKClcbiAgICAgIGN0eC5maWxsKClcbiAgICAgIGN0eC5yZXN0b3JlKClcbiAgICB9LFxuXG4gICAgX2FwcGx5TWV0YWRhdGEgKCkge1xuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXG4gICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WCkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHN0YXJ0WFxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcbiAgICAgIH1cblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc2NhbGUpKSB7XG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHNjYWxlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG48L3NjcmlwdD5cblxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cbi5jcm9wcGEtY29udGFpbmVyXG4gIGRpc3BsYXkgaW5saW5lLWJsb2NrXG4gIGN1cnNvciBwb2ludGVyXG4gIHRyYW5zaXRpb24gYWxsIDAuM3NcbiAgcG9zaXRpb24gcmVsYXRpdmVcbiAgZm9udC1zaXplIDBcbiAgYWxpZ24tc2VsZiBmbGV4LXN0YXJ0XG4gIGJhY2tncm91bmQtY29sb3IgI2U2ZTZlNlxuXG4gIGNhbnZhc1xuICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcblxuICAmOmhvdmVyXG4gICAgb3BhY2l0eSAwLjdcblxuICAmLmNyb3BwYS0tZHJvcHpvbmVcbiAgICBib3gtc2hhZG93IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxuXG4gICAgY2FudmFzXG4gICAgICBvcGFjaXR5IDAuNVxuXG4gICYuY3JvcHBhLS1kaXNhYmxlZC1jY1xuICAgIGN1cnNvciBkZWZhdWx0XG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAmLmNyb3BwYS0taGFzLXRhcmdldFxuICAgIGN1cnNvciBtb3ZlXG5cbiAgICAmOmhvdmVyXG4gICAgICBvcGFjaXR5IDFcblxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxuICAgICAgY3Vyc29yIGRlZmF1bHRcblxuICAmLmNyb3BwYS0tZGlzYWJsZWRcbiAgICBjdXJzb3Igbm90LWFsbG93ZWRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICYuY3JvcHBhLS1wYXNzaXZlXG4gICAgY3Vyc29yIGRlZmF1bHRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gIHN2Zy5pY29uLXJlbW92ZVxuICAgIHBvc2l0aW9uIGFic29sdXRlXG4gICAgYmFja2dyb3VuZCB3aGl0ZVxuICAgIGJvcmRlci1yYWRpdXMgNTAlXG4gICAgZmlsdGVyIGRyb3Atc2hhZG93KC0ycHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuNykpXG4gICAgei1pbmRleCAxMFxuICAgIGN1cnNvciBwb2ludGVyXG4gICAgYm9yZGVyIDJweCBzb2xpZCB3aGl0ZVxuPC9zdHlsZT5cblxuPHN0eWxlIGxhbmc9XCJzY3NzXCI+XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdG9iaWFzYWhsaW4vU3BpbktpdC9ibG9iL21hc3Rlci9zY3NzL3NwaW5uZXJzLzEwLWZhZGluZy1jaXJjbGUuc2Nzc1xuLnNrLWZhZGluZy1jaXJjbGUge1xuICAkY2lyY2xlQ291bnQ6IDEyO1xuICAkYW5pbWF0aW9uRHVyYXRpb246IDFzO1xuXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAuc2stY2lyY2xlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDA7XG4gICAgdG9wOiAwO1xuICB9XG5cbiAgLnNrLWNpcmNsZSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgd2lkdGg6IDE1JTtcbiAgICBoZWlnaHQ6IDE1JTtcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlO1xuICAgIGFuaW1hdGlvbjogc2stY2lyY2xlRmFkZURlbGF5ICRhbmltYXRpb25EdXJhdGlvbiBpbmZpbml0ZSBlYXNlLWluLW91dCBib3RoO1xuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSB7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcgLyAkY2lyY2xlQ291bnQgKiAoJGkgLSAxKSk7XG4gICAgfVxuICB9XG5cbiAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xuICAgIC5zay1jaXJjbGUjeyRpfSAuc2stY2lyY2xlLWluZGljYXRvciB7XG4gICAgICBhbmltYXRpb24tZGVsYXk6IC0kYW5pbWF0aW9uRHVyYXRpb24gK1xuICAgICAgICAkYW5pbWF0aW9uRHVyYXRpb24gL1xuICAgICAgICAkY2lyY2xlQ291bnQgKlxuICAgICAgICAoJGkgLSAxKTtcbiAgICB9XG4gIH1cbn1cbkBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcbiAgMCUsXG4gIDM5JSxcbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICA0MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cbjwvc3R5bGU+XG5cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsInVybCIsInJlZyIsImV4ZWMiLCJiYXNlNjQiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwidyIsInVzZUF1dG9TaXppbmciLCJyZWFsV2lkdGgiLCJ3aWR0aCIsImgiLCJyZWFsSGVpZ2h0IiwiaGVpZ2h0IiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIm5hdHVyYWxIZWlnaHQiLCJsb2FkaW5nU2l6ZSIsIl9sb2FkaW5nIiwibmV3VmFsdWUiLCJvbGRWYWx1ZSIsInBhc3NpdmUiLCJlbWl0RXZlbnQiLCJMT0FESU5HX1NUQVJUX0VWRU5UIiwiTE9BRElOR19FTkRfRVZFTlQiLCJfaW5pdGlhbGl6ZSIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIndhcm4iLCIkd2F0Y2giLCJkYXRhIiwic2V0Iiwia2V5IiwiJHNldCIsInJlbW92ZSIsIiRuZXh0VGljayIsIl9kcmF3IiwiYXV0b1NpemluZyIsIiRyZWZzIiwid3JhcHBlciIsImdldENvbXB1dGVkU3R5bGUiLCJfYXV0b1NpemluZ0luaXQiLCJfYXV0b1NpemluZ1JlbW92ZSIsIm9uRGltZW5zaW9uQ2hhbmdlIiwiX3NldFBsYWNlaG9sZGVycyIsImltYWdlU2V0IiwiX3BsYWNlSW1hZ2UiLCJvbGRWYWwiLCJ1IiwibnVtYmVyVmFsaWQiLCJwb3MiLCJjdXJyZW50UG9pbnRlckNvb3JkIiwiaW1nRGF0YSIsInN0YXJ0WCIsInN0YXJ0WSIsInVzZXJNZXRhZGF0YSIsInJvdGF0aW5nIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsIl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSIsIl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwic2NhbGVSYXRpbyIsImhhc0ltYWdlIiwiYWJzIiwiWk9PTV9FVkVOVCIsIiRlbWl0IiwiY3R4IiwiY2hvc2VuRmlsZSIsImZpbGVJbnB1dCIsImZpbGVzIiwib2xkWCIsIm9sZFkiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsImFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib3V0cHV0V2lkdGgiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJfcm90YXRlQnlTdGVwIiwiX3NldE9yaWVudGF0aW9uIiwibWV0YWRhdGEiLCJzdG9yZWRQaXhlbERlbnNpdHkiLCJwaXhlbERlbnNpdHkiLCJjdXJyZW50UGl4ZWxEZW5zaXR5IiwicGl4ZWxEZW5zaXR5RGlmZiIsInNjYWxlIiwiYXBwbHlNZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImdldE1ldGFkYXRhIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsIkZpbGUiLCJGaWxlUmVhZGVyIiwiRmlsZUxpc3QiLCJjbGljayIsImtlZXBDaG9zZW5GaWxlIiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwidmlkZW8iLCJwYXVzZSIsIklNQUdFX1JFTU9WRV9FVkVOVCIsInBsdWdpbiIsImNsaXBQbHVnaW5zIiwicHVzaCIsIkVycm9yIiwiZmlsZSIsIl9vbk5ld0ZpbGVJbiIsInNsaWNlIiwiX3NldENvbnRhaW5lclNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9zZXRTaXplIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImdldENvbnRleHQiLCJpbWFnZVNtb290aGluZ0VuYWJsZWQiLCJpbWFnZVNtb290aGluZ1F1YWxpdHkiLCJ3ZWJraXRJbWFnZVNtb290aGluZ0VuYWJsZWQiLCJtc0ltYWdlU21vb3RoaW5nRW5hYmxlZCIsIl9zZXRJbml0aWFsIiwib3V0cHV0SGVpZ2h0IiwiJHNsb3RzIiwicGxhY2Vob2xkZXIiLCJ2Tm9kZSIsInRhZyIsImVsbSIsIm9uTG9hZCIsImltYWdlTG9hZGVkIiwib25sb2FkIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwiZm9udFNpemUiLCJjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiX3BhaW50QmFja2dyb3VuZCIsIl9zZXRJbWFnZVBsYWNlaG9sZGVyIiwiX3NldFRleHRQbGFjZWhvbGRlciIsImluaXRpYWwiLCJpbml0aWFsSW1hZ2UiLCJzZXRBdHRyaWJ1dGUiLCJiYWJlbEhlbHBlcnMudHlwZW9mIiwiY3VycmVudElzSW5pdGlhbCIsIm9uRXJyb3IiLCJsb2FkaW5nIiwiX29ubG9hZCIsImRhdGFzZXQiLCJvbmVycm9yIiwibG9nIiwiSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQiLCJ2aWRlb1dpZHRoIiwidmlkZW9IZWlnaHQiLCJkcmF3RnJhbWUiLCJmcmFtZSIsImtlZXBEcmF3aW5nIiwiZW5kZWQiLCJwYXVzZWQiLCJlbWl0TmF0aXZlRXZlbnQiLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImNob29zZUZpbGUiLCJ2aWRlb0VuYWJsZWQiLCJwbGF5IiwiaW5wdXQiLCJGSUxFX0NIT09TRV9FVkVOVCIsIl9maWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiX2ZpbGVUeXBlSXNWYWxpZCIsIkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsInBvcCIsImZyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwicGFyc2VEYXRhVXJsIiwiaXNWaWRlbyIsInJlYWR5U3RhdGUiLCJIQVZFX0ZVVFVSRV9EQVRBIiwiX29uVmlkZW9Mb2FkIiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRV9FVkVOVCIsInJlYWRBc0RhdGFVUkwiLCJmaWxlU2l6ZUxpbWl0Iiwic2l6ZSIsImFjY2VwdGFibGVNaW1lVHlwZSIsImNhblBsYXlUeXBlIiwiYWNjZXB0IiwiYmFzZU1pbWV0eXBlIiwicmVwbGFjZSIsInQiLCJ0cmltIiwiY2hhckF0IiwiZmlsZUJhc2VUeXBlIiwiX2FzcGVjdEZpbGwiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJpbml0aWFsUG9zaXRpb24iLCJfYXBwbHlNZXRhZGF0YSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiY2FudmFzUmF0aW8iLCJhc3BlY3RSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJfaGFuZGxlUG9pbnRlckVuZCIsInBvaW50ZXJNb3ZlRGlzdGFuY2UiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsInByZXZlbnREZWZhdWx0IiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJzY3JvbGxpbmciLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImV2ZW50SGFzRmlsZSIsInJlcGxhY2VEcm9wIiwiZmlsZURyYWdnZWRPdmVyIiwiaXRlbXMiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsInVzZU9yaWdpbmFsIiwiZGlzYWJsZUF1dG9PcmllbnRhdGlvbiIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIl9jbGlwIiwiX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoIiwiRFJBV19FVkVOVCIsIk5FV19JTUFHRV9EUkFXTl9FVkVOVCIsInJhZGl1cyIsImltYWdlQm9yZGVyUmFkaXVzIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwicXVhZHJhdGljQ3VydmVUbyIsImNsb3NlUGF0aCIsIl9jbGlwUGF0aEZhY3RvcnkiLCJmb3JFYWNoIiwiY3JlYXRlUGF0aCIsInNhdmUiLCJnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24iLCJmaWxsIiwicmVzdG9yZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtB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
