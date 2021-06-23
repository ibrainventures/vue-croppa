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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIHBhcnNlRGF0YVVybCAodXJsKSB7XHJcbiAgICBjb25zdCByZWcgPSAvXmRhdGE6KFteO10rKT8oO2Jhc2U2NCk/LCguKikvZ21pXHJcbiAgICByZXR1cm4gcmVnLmV4ZWModXJsKVszXVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XG4gIE51bWJlci5pc0ludGVnZXIgfHxcbiAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiZcbiAgICAgIGlzRmluaXRlKHZhbHVlKSAmJlxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXG4gICAgKVxuICB9XG5cbnZhciBpbml0aWFsSW1hZ2VUeXBlID0gU3RyaW5nXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkltYWdlKSB7XG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2YWx1ZTogT2JqZWN0LFxuICB3aWR0aDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMDAsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID4gMFxuICAgIH1cbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDIwMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xuICB9LFxuICBwbGFjZWhvbGRlckNvbG9yOiB7XG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPj0gMFxuICAgIH1cbiAgfSxcbiAgY2FudmFzQ29sb3I6IHtcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gIH0sXG4gIHF1YWxpdHk6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICB6b29tU3BlZWQ6IHtcbiAgICBkZWZhdWx0OiAzLFxuICAgIHR5cGU6IE51bWJlcixcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgfVxuICB9LFxuICBhY2NlcHQ6IFN0cmluZyxcbiAgZmlsZVNpemVMaW1pdDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCA+PSAwXG4gICAgfVxuICB9LFxuICBkaXNhYmxlZDogQm9vbGVhbixcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxuICBkaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbjogQm9vbGVhbixcbiAgZGlzYWJsZUNsaWNrVG9DaG9vc2U6IEJvb2xlYW4sXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxuICBkaXNhYmxlUGluY2hUb1pvb206IEJvb2xlYW4sXG4gIGRpc2FibGVSb3RhdGlvbjogQm9vbGVhbixcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcbiAgcHJldmVudFdoaXRlU3BhY2U6IEJvb2xlYW4sXG4gIHNob3dSZW1vdmVCdXR0b246IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3JlZCdcbiAgfSxcbiAgcmVtb3ZlQnV0dG9uU2l6ZToge1xuICAgIHR5cGU6IE51bWJlclxuICB9LFxuICBpbml0aWFsSW1hZ2U6IGluaXRpYWxJbWFnZVR5cGUsXG4gIGluaXRpYWxTaXplOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXG4gICAgfVxuICB9LFxuICBpbml0aWFsUG9zaXRpb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICB2YXIgdmFsaWRzID0gWydjZW50ZXInLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J11cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xuICAgICAgICAgIHJldHVybiB2YWxpZHMuaW5kZXhPZih3b3JkKSA+PSAwXG4gICAgICAgIH0pIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXG4gICAgICApXG4gICAgfVxuICB9LFxuICBpbnB1dEF0dHJzOiBPYmplY3QsXG4gIHNob3dMb2FkaW5nOiBCb29sZWFuLFxuICBsb2FkaW5nU2l6ZToge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAyMFxuICB9LFxuICBsb2FkaW5nQ29sb3I6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXG4gIH0sXG4gIHJlcGxhY2VEcm9wOiBCb29sZWFuLFxuICBwYXNzaXZlOiBCb29sZWFuLFxuICBpbWFnZUJvcmRlclJhZGl1czoge1xuICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgZGVmYXVsdDogMFxuICB9LFxuICBhdXRvU2l6aW5nOiBCb29sZWFuLFxuICB2aWRlb0VuYWJsZWQ6IEJvb2xlYW4sXG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcbiAgRklMRV9DSE9PU0VfRVZFTlQ6ICdmaWxlLWNob29zZScsXG4gIEZJTEVfU0laRV9FWENFRURfRVZFTlQ6ICdmaWxlLXNpemUtZXhjZWVkJyxcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcbiAgTkVXX0lNQUdFX0VWRU5UOiAnbmV3LWltYWdlJyxcbiAgTkVXX0lNQUdFX0RSQVdOX0VWRU5UOiAnbmV3LWltYWdlLWRyYXduJyxcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcbiAgTU9WRV9FVkVOVDogJ21vdmUnLFxuICBaT09NX0VWRU5UOiAnem9vbScsXG4gIERSQVdfRVZFTlQ6ICdkcmF3JyxcbiAgSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQ6ICdpbml0aWFsLWltYWdlLWxvYWRlZCcsXG4gIExPQURJTkdfU1RBUlRfRVZFTlQ6ICdsb2FkaW5nLXN0YXJ0JyxcbiAgTE9BRElOR19FTkRfRVZFTlQ6ICdsb2FkaW5nLWVuZCdcbn1cbiIsIjx0ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIHJlZj1cIndyYXBwZXJcIlxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtcbiAgICAgIHBhc3NpdmUgPyAnY3JvcHBhLS1wYXNzaXZlJyA6ICcnXG4gICAgfSAke2Rpc2FibGVkID8gJ2Nyb3BwYS0tZGlzYWJsZWQnIDogJyd9ICR7XG4gICAgICBkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnXG4gICAgfSAke1xuICAgICAgZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnXG4gICAgfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxuICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXG4gICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0xlYXZlXCJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcbiAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiXG4gID5cbiAgICA8aW5wdXRcbiAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgIDphY2NlcHQ9XCJhY2NlcHRcIlxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgICAgdi1iaW5kPVwiaW5wdXRBdHRyc1wiXG4gICAgICByZWY9XCJmaWxlSW5wdXRcIlxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXG4gICAgICBzdHlsZT1cIlxuICAgICAgICBoZWlnaHQ6IDFweDtcbiAgICAgICAgd2lkdGg6IDFweDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC05OTk5OXB4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBcIlxuICAgIC8+XG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCIgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW5cIj5cbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxuICAgICAgPHNsb3QgbmFtZT1cInBsYWNlaG9sZGVyXCI+PC9zbG90PlxuICAgIDwvZGl2PlxuICAgIDxjYW52YXNcbiAgICAgIHJlZj1cImNhbnZhc1wiXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcbiAgICAgIEBkYmxjbGljay5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRGJsQ2xpY2tcIlxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxuICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcbiAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJTdGFydFwiXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxuICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcbiAgICAgIEB0b3VjaG1vdmUuc3RvcD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXG4gICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcbiAgICAgIEBwb2ludGVybGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJMZWF2ZVwiXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXG4gICAgICBAbW91c2V3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcbiAgICA+PC9jYW52YXM+XG4gICAgPHN2Z1xuICAgICAgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcbiAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZyAmJiAhcGFzc2l2ZVwiXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxuICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0IC8gNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aCAvIDQwfXB4YFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXG4gICAgICB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGggLyAxMFwiXG4gICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aCAvIDEwXCJcbiAgICA+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcbiAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiXG4gICAgICA+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiXG4gICAgICA6c3R5bGU9XCJsb2FkaW5nU3R5bGVcIlxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIlxuICAgID5cbiAgICAgIDxkaXYgOmNsYXNzPVwiYHNrLWNpcmNsZSR7aX0gc2stY2lyY2xlYFwiIHYtZm9yPVwiaSBpbiAxMlwiIDprZXk9XCJpXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxuICAgICAgICAgIDpzdHlsZT1cInsgYmFja2dyb3VuZENvbG9yOiBsb2FkaW5nQ29sb3IgfVwiXG4gICAgICAgID48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxuaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXG5pbXBvcnQgZXZlbnRzIGZyb20gJy4vZXZlbnRzJ1xuXG5jb25zdCBQQ1RfUEVSX1pPT00gPSAxIC8gMTAwMDAwIC8vIFRoZSBhbW91bnQgb2Ygem9vbWluZyBldmVyeXRpbWUgaXQgaGFwcGVucywgaW4gcGVyY2VudGFnZSBvZiBpbWFnZSB3aWR0aC5cbmNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXG5jb25zdCBNSU5fV0lEVEggPSAxMCAvLyBUaGUgbWluaW1hbCB3aWR0aCB0aGUgdXNlciBjYW4gem9vbSB0by5cbmNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cbmNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcblxuY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxuLy8gY29uc3QgREVCVUcgPSBmYWxzZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1vZGVsOiB7XG4gICAgcHJvcDogJ3ZhbHVlJyxcbiAgICBldmVudDogZXZlbnRzLklOSVRfRVZFTlRcbiAgfSxcblxuICBwcm9wczogcHJvcHMsXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbnZhczogbnVsbCxcbiAgICAgIGN0eDogbnVsbCxcbiAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXG4gICAgICBpbWc6IG51bGwsXG4gICAgICB2aWRlbzogbnVsbCxcbiAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGxhc3RNb3ZpbmdDb29yZDogbnVsbCxcbiAgICAgIGltZ0RhdGE6IHtcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICBzdGFydFk6IDBcbiAgICAgIH0sXG4gICAgICBmaWxlRHJhZ2dlZE92ZXI6IGZhbHNlLFxuICAgICAgdGFiU3RhcnQ6IDAsXG4gICAgICBzY3JvbGxpbmc6IGZhbHNlLFxuICAgICAgcGluY2hpbmc6IGZhbHNlLFxuICAgICAgcm90YXRpbmc6IGZhbHNlLFxuICAgICAgcGluY2hEaXN0YW5jZTogMCxcbiAgICAgIHN1cHBvcnRUb3VjaDogZmFsc2UsXG4gICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxuICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXG4gICAgICBuYXR1cmFsV2lkdGg6IDAsXG4gICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxuICAgICAgc2NhbGVSYXRpbzogbnVsbCxcbiAgICAgIG9yaWVudGF0aW9uOiAxLFxuICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxuICAgICAgaW1hZ2VTZXQ6IGZhbHNlLFxuICAgICAgY3VycmVudFBvaW50ZXJDb29yZDogbnVsbCxcbiAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxuICAgICAgX2xvYWRpbmc6IGZhbHNlLFxuICAgICAgcmVhbFdpZHRoOiAwLCAvLyBvbmx5IGZvciB3aGVuIGF1dG9TaXppbmcgaXMgb25cbiAgICAgIHJlYWxIZWlnaHQ6IDAsIC8vIG9ubHkgZm9yIHdoZW4gYXV0b1NpemluZyBpcyBvblxuICAgICAgY2hvc2VuRmlsZTogbnVsbCxcbiAgICAgIHVzZUF1dG9TaXppbmc6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG91dHB1dFdpZHRoICgpIHtcbiAgICAgIGNvbnN0IHcgPSB0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxXaWR0aCA6IHRoaXMud2lkdGhcbiAgICAgIHJldHVybiB3ICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIG91dHB1dEhlaWdodCAoKSB7XG4gICAgICBjb25zdCBoID0gdGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsSGVpZ2h0IDogdGhpcy5oZWlnaHRcbiAgICAgIHJldHVybiBoICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XG4gICAgfSxcblxuICAgIGFzcGVjdFJhdGlvICgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodFxuICAgIH0sXG5cbiAgICBsb2FkaW5nU3R5bGUgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxuICAgICAgICByaWdodDogJzE1cHgnLFxuICAgICAgICBib3R0b206ICcxMHB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBsb2FkaW5nOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9sb2FkaW5nXG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSBuZXdWYWx1ZVxuICAgICAgICBpZiAob2xkVmFsdWUgIT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5MT0FESU5HX1NUQVJUX0VWRU5UKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuTE9BRElOR19FTkRfRVZFTlQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuX2luaXRpYWxpemUoKVxuICAgIHUuckFGUG9seWZpbGwoKVxuICAgIHUudG9CbG9iUG9seWZpbGwoKVxuXG4gICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcbiAgICBpZiAoIXN1cHBvcnRzLmJhc2ljKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcbiAgICAgIHRoaXMuJHdhdGNoKCd2YWx1ZS5fZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBzZXQgPSBmYWxzZVxuICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGlmIChzeW5jRGF0YS5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxuICAgICAgICAgICAgaWYgKHZhbCAhPT0gdGhpc1trZXldKSB7XG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBrZXksIHZhbClcbiAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgICBkZWVwOiB0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy51c2VBdXRvU2l6aW5nID0gISEodGhpcy5hdXRvU2l6aW5nICYmIHRoaXMuJHJlZnMud3JhcHBlciAmJiBnZXRDb21wdXRlZFN0eWxlKVxuICAgIGlmICh0aGlzLnVzZUF1dG9TaXppbmcpIHtcbiAgICAgIHRoaXMuX2F1dG9TaXppbmdJbml0KClcbiAgICB9XG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMudXNlQXV0b1NpemluZykge1xuICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMub25EaW1lbnNpb25DaGFuZ2UoKVxuICAgIH0sXG4gICAgb3V0cHV0SGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcbiAgICB9LFxuICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuICAgIGltYWdlQm9yZGVyUmFkaXVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmltZykge1xuICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2ZW50V2hpdGVTcGFjZSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXG4gICAgfSxcbiAgICBzY2FsZVJhdGlvICh2YWwsIG9sZFZhbCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cblxuICAgICAgdmFyIHggPSAxXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChvbGRWYWwpICYmIG9sZFZhbCAhPT0gMCkge1xuICAgICAgICB4ID0gdmFsIC8gb2xkVmFsXG4gICAgICB9XG4gICAgICB2YXIgcG9zID0gdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkIHx8IHtcbiAgICAgICAgeDogdGhpcy5pbWdEYXRhLnN0YXJ0WCArIHRoaXMuaW1nRGF0YS53aWR0aCAvIDIsXG4gICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxuICAgICAgfVxuICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGggKiB2YWxcbiAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB2YWxcblxuICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSAmJiB0aGlzLmltYWdlU2V0ICYmICF0aGlzLnJvdGF0aW5nKSB7XG4gICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXG4gICAgICAgIGxldCBvZmZzZXRZID0gKHggLSAxKSAqIChwb3MueSAtIHRoaXMuaW1nRGF0YS5zdGFydFkpXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYIC0gb2Zmc2V0WFxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UoKVxuICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcbiAgICAgIH1cbiAgICB9LFxuICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdS5udW1iZXJWYWxpZCh2YWwpKSByZXR1cm5cbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyh2YWwgLSBvbGRWYWwpID4gKHZhbCAqICgxIC8gMTAwMDAwKSkpIHtcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuWk9PTV9FVkVOVClcbiAgICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuaGVpZ2h0JzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXG4gICAgICB0aGlzLnNjYWxlUmF0aW8gPSB2YWwgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICB9LFxuICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxuICAgICAgfVxuICAgIH0sXG4gICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXG4gICAgICB9XG4gICAgfSxcbiAgICBhdXRvU2l6aW5nICh2YWwpIHtcbiAgICAgIHRoaXMudXNlQXV0b1NpemluZyA9ICEhKHRoaXMuYXV0b1NpemluZyAmJiB0aGlzLiRyZWZzLndyYXBwZXIgJiYgZ2V0Q29tcHV0ZWRTdHlsZSlcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ0luaXQoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemluZ1JlbW92ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBlbWl0RXZlbnQgKC4uLmFyZ3MpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3NbMF0pXG4gICAgICB0aGlzLiRlbWl0KC4uLmFyZ3MpO1xuICAgIH0sXG5cbiAgICBnZXRDYW52YXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXG4gICAgfSxcblxuICAgIGdldENvbnRleHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3R4XG4gICAgfSxcblxuICAgIGdldENob3NlbkZpbGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2hvc2VuRmlsZSB8fCB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxuICAgIH0sXG5cbiAgICBtb3ZlIChvZmZzZXQpIHtcbiAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcbiAgICAgIGxldCBvbGRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WVxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxuICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5NT1ZFX0VWRU5UKVxuICAgICAgICB0aGlzLl9kcmF3KClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZVVwd2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcbiAgICB9LFxuXG4gICAgbW92ZURvd253YXJkcyAoYW1vdW50ID0gMSkge1xuICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXG4gICAgfSxcblxuICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IC1hbW91bnQsIHk6IDAgfSlcbiAgICB9LFxuXG4gICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCA9IDEpIHtcbiAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxuICAgIH0sXG5cbiAgICB6b29tICh6b29tSW4gPSB0cnVlLCBhY2NlbGVyYXRpb24gPSAxKSB7XG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxuICAgICAgbGV0IHNwZWVkID0gKHRoaXMub3V0cHV0V2lkdGggKiBQQ1RfUEVSX1pPT00pICogcmVhbFNwZWVkXG4gICAgICBsZXQgeCA9IDFcbiAgICAgIGlmICh6b29tSW4pIHtcbiAgICAgICAgeCA9IDEgKyBzcGVlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcbiAgICAgICAgeCA9IDEgLSBzcGVlZFxuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIGEgbmV3IGltYWdlIGlzIGxvYWRlZCB3aXRoIHRoZSBzYW1lIGFzcGVjdCByYXRpb1xuICAgICAgLy8gYXMgdGhlIHByZXZpb3VzbHkgcmVtb3ZlKClkIG9uZSwgdGhlIGltZ0RhdGEud2lkdGggYW5kIC5oZWlnaHRcbiAgICAgIC8vIGVmZmVjdGl2ZWxseSBkb24ndCBjaGFuZ2UgKHRoZXkgY2hhbmdlIHRocm91Z2ggb25lIHRpY2tcbiAgICAgIC8vIGFuZCBlbmQgdXAgYmVpbmcgdGhlIHNhbWUgYXMgYmVmb3JlIHRoZSB0aWNrLCBzbyB0aGVcbiAgICAgIC8vIHdhdGNoZXJzIGRvbid0IHRyaWdnZXIpLCBtYWtlIHN1cmUgc2NhbGVSYXRpbyBpc24ndCBudWxsIHNvXG4gICAgICAvLyB0aGF0IHpvb21pbmcgd29ya3MuLi5cbiAgICAgIGlmICh0aGlzLnNjYWxlUmF0aW8gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5pbWdEYXRhLndpZHRoIC8gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcbiAgICB9LFxuXG4gICAgem9vbUluICgpIHtcbiAgICAgIHRoaXMuem9vbSh0cnVlKVxuICAgIH0sXG5cbiAgICB6b29tT3V0ICgpIHtcbiAgICAgIHRoaXMuem9vbShmYWxzZSlcbiAgICB9LFxuXG4gICAgcm90YXRlIChzdGVwID0gMSkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxuICAgICAgaWYgKGlzTmFOKHN0ZXApIHx8IHN0ZXAgPiAzIHx8IHN0ZXAgPCAtMykge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXG4gICAgICAgIHN0ZXAgPSAxXG4gICAgICB9XG4gICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcbiAgICB9LFxuXG4gICAgZmxpcFggKCkge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDIpXG4gICAgfSxcblxuICAgIGZsaXBZICgpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxuICAgIH0sXG5cbiAgICByZWZyZXNoICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2luaXRpYWxpemUpXG4gICAgfSxcblxuICAgIGhhc0ltYWdlICgpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuaW1hZ2VTZXRcbiAgICB9LFxuICAgIGFwcGx5TWV0YWRhdGFXaXRoUGl4ZWxEZW5zaXR5IChtZXRhZGF0YSkge1xuICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgIGxldCBzdG9yZWRQaXhlbERlbnNpdHkgPSBtZXRhZGF0YS5waXhlbERlbnNpdHkgfHwgMVxuICAgICAgICBsZXQgY3VycmVudFBpeGVsRGVuc2l0eSA9IHRoaXMucXVhbGl0eVxuICAgICAgICBsZXQgcGl4ZWxEZW5zaXR5RGlmZiA9IGN1cnJlbnRQaXhlbERlbnNpdHkgLyBzdG9yZWRQaXhlbERlbnNpdHlcbiAgICAgICAgbWV0YWRhdGEuc3RhcnRYID0gbWV0YWRhdGEuc3RhcnRYICogcGl4ZWxEZW5zaXR5RGlmZlxuICAgICAgICBtZXRhZGF0YS5zdGFydFkgPSBtZXRhZGF0YS5zdGFydFkgKiBwaXhlbERlbnNpdHlEaWZmXG4gICAgICAgIG1ldGFkYXRhLnNjYWxlID0gbWV0YWRhdGEuc2NhbGUgKiBwaXhlbERlbnNpdHlEaWZmXG5cbiAgICAgICAgdGhpcy5hcHBseU1ldGFkYXRhKG1ldGFkYXRhKVxuICAgICAgfVxuICAgIH0sXG4gICAgYXBwbHlNZXRhZGF0YSAobWV0YWRhdGEpIHtcbiAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbWV0YWRhdGFcbiAgICAgIHZhciBvcmkgPSBtZXRhZGF0YS5vcmllbnRhdGlvbiB8fCB0aGlzLm9yaWVudGF0aW9uIHx8IDFcbiAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcbiAgICB9LFxuICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMudG9EYXRhVVJMKHR5cGUsIGNvbXByZXNzaW9uUmF0ZSlcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVCbG9iIChjYWxsYmFjaywgbWltZVR5cGUsIHF1YWxpdHlBcmd1bWVudCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXG4gICAgfSxcblxuICAgIHByb21pc2VkQmxvYiAoLi4uYXJncykge1xuICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxuICAgICAgICAgIH0sIC4uLmFyZ3MpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm4ge31cbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlUmF0aW8sXG4gICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLm9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIGdldE1ldGFkYXRhV2l0aFBpeGVsRGVuc2l0eSAoKSB7XG4gICAgICBsZXQgbWV0YWRhdGEgPSB0aGlzLmdldE1ldGFkYXRhKClcbiAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICBtZXRhZGF0YS5waXhlbERlbnNpdHkgPSB0aGlzLnF1YWxpdHlcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZXRhZGF0YVxuICAgIH0sXG5cbiAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxuICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNob29zZUZpbGUgKCkge1xuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXG4gICAgfSxcblxuICAgIHJlbW92ZSAoa2VlcENob3NlbkZpbGUgPSBmYWxzZSkge1xuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSByZXR1cm5cbiAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG5cbiAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcbiAgICAgIHRoaXMuaW1nID0gbnVsbFxuICAgICAgdGhpcy5pbWdEYXRhID0ge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgIHN0YXJ0WTogMFxuICAgICAgfVxuICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcbiAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IG51bGxcbiAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXG4gICAgICBpZiAoIWtlZXBDaG9zZW5GaWxlKSB7XG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpXG4gICAgICAgIHRoaXMudmlkZW8gPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmIChoYWRJbWFnZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRDbGlwUGx1Z2luIChwbHVnaW4pIHtcbiAgICAgIGlmICghdGhpcy5jbGlwUGx1Z2lucykge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zID0gW11cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2xpcFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pIDwgMCkge1xuICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0NsaXAgcGx1Z2lucyBzaG91bGQgYmUgZnVuY3Rpb25zJylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW1pdE5hdGl2ZUV2ZW50IChldnQpIHtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2dC50eXBlLCBldnQpO1xuICAgIH0sXG5cbiAgICBzZXRGaWxlIChmaWxlKSB7XG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfc2V0Q29udGFpbmVyU2l6ZSAoKSB7XG4gICAgICBpZiAodGhpcy51c2VBdXRvU2l6aW5nKSB7XG4gICAgICAgIHRoaXMucmVhbFdpZHRoID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS53aWR0aC5zbGljZSgwLCAtMilcbiAgICAgICAgdGhpcy5yZWFsSGVpZ2h0ID0gK2dldENvbXB1dGVkU3R5bGUodGhpcy4kcmVmcy53cmFwcGVyKS5oZWlnaHQuc2xpY2UoMCwgLTIpXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9hdXRvU2l6aW5nSW5pdCAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfYXV0b1NpemluZ1JlbW92ZSAoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKClcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9zZXRDb250YWluZXJTaXplKVxuICAgIH0sXG5cbiAgICBfaW5pdGlhbGl6ZSAoKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXG4gICAgICB0aGlzLl9zZXRTaXplKClcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogKHR5cGVvZiB0aGlzLmNhbnZhc0NvbG9yID09PSAnc3RyaW5nJyA/IHRoaXMuY2FudmFzQ29sb3IgOiAnJylcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgdGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nUXVhbGl0eSA9IFwiaGlnaFwiO1xuICAgICAgdGhpcy5jdHgud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4Lm1zSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXG4gICAgICB0aGlzLmltZyA9IG51bGxcbiAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcbiAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgdGhpcy5jaG9zZW5GaWxlID0gbnVsbFxuICAgICAgdGhpcy5fc2V0SW5pdGlhbCgpXG4gICAgICBpZiAoIXRoaXMucGFzc2l2ZSkge1xuICAgICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldFNpemUgKCkge1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSAodGhpcy51c2VBdXRvU2l6aW5nID8gdGhpcy5yZWFsV2lkdGggOiB0aGlzLndpZHRoKSArICdweCdcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9ICh0aGlzLnVzZUF1dG9TaXppbmcgPyB0aGlzLnJlYWxIZWlnaHQgOiB0aGlzLmhlaWdodCkgKyAncHgnXG4gICAgfSxcblxuICAgIF9yb3RhdGVCeVN0ZXAgKHN0ZXApIHtcbiAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcbiAgICAgIHN3aXRjaCAoc3RlcCkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSA2XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgLTI6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSAzXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAtMzpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG4gICAgfSxcblxuICAgIF9zZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcbiAgICAgIGxldCBpbWdcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xuICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxuICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcbiAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcbiAgICAgICAgICBpbWcgPSBlbG1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWltZykgcmV0dXJuXG5cbiAgICAgIHZhciBvbkxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuXG4gICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XG4gICAgICAgIG9uTG9hZCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWcub25sb2FkID0gb25Mb2FkXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXMuY3R4XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMub3V0cHV0V2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXG4gICAgICBsZXQgZm9udFNpemUgPSAoIXRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMuY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemVcbiAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxuICAgICAgY3R4LmZpbGxUZXh0KHRoaXMucGxhY2Vob2xkZXIsIHRoaXMub3V0cHV0V2lkdGggLyAyLCB0aGlzLm91dHB1dEhlaWdodCAvIDIpXG4gICAgfSxcblxuICAgIF9zZXRQbGFjZWhvbGRlcnMgKCkge1xuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIHRoaXMuX3NldEltYWdlUGxhY2Vob2xkZXIoKVxuICAgICAgdGhpcy5fc2V0VGV4dFBsYWNlaG9sZGVyKClcbiAgICB9LFxuXG4gICAgX3NldEluaXRpYWwgKCkge1xuICAgICAgbGV0IHNyYywgaW1nXG4gICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XG4gICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cbiAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXG4gICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XG4gICAgICAgICAgaW1nID0gZWxtXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmluaXRpYWxJbWFnZSAmJiB0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXG4gICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGlmICghL15kYXRhOi8udGVzdChzcmMpICYmICEvXmJsb2I6Ly50ZXN0KHNyYykpIHtcbiAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxuICAgICAgICB9XG4gICAgICAgIGltZy5zcmMgPSBzcmNcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgICAgIGltZyA9IHRoaXMuaW5pdGlhbEltYWdlXG4gICAgICB9XG4gICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XG4gICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gdHJ1ZVxuXG4gICAgICBsZXQgb25FcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcbiAgICAgIGlmIChpbWcuY29tcGxldGUpIHtcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xuICAgICAgICAgIC8vIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddLCB0cnVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uRXJyb3IoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgLy8gdGhpcy5lbWl0RXZlbnQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxuICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICBvbkVycm9yKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25sb2FkIChpbWcsIG9yaWVudGF0aW9uID0gMSwgaW5pdGlhbCkge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUodHJ1ZSlcbiAgICAgIH1cbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGltZ1xuICAgICAgdGhpcy5pbWcgPSBpbWdcblxuICAgICAgaWYgKGlzTmFOKG9yaWVudGF0aW9uKSkge1xuICAgICAgICBvcmllbnRhdGlvbiA9IDFcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2V0T3JpZW50YXRpb24ob3JpZW50YXRpb24pXG5cbiAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5JTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uVmlkZW9Mb2FkICh2aWRlbywgaW5pdGlhbCkge1xuICAgICAgdGhpcy52aWRlbyA9IHZpZGVvXG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgICAgY29uc3QgeyB2aWRlb1dpZHRoLCB2aWRlb0hlaWdodCB9ID0gdmlkZW9cbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvV2lkdGhcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWRlb0hlaWdodFxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBjb25zdCBkcmF3RnJhbWUgPSAoaW5pdGlhbCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMudmlkZW8pIHJldHVyblxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMudmlkZW8sIDAsIDAsIHZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0KVxuICAgICAgICBjb25zdCBmcmFtZSA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGZyYW1lLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKVxuICAgICAgICBmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBmcmFtZVxuICAgICAgICAgIC8vIHRoaXMuX3BsYWNlSW1hZ2UoKVxuICAgICAgICAgIGlmIChpbml0aWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZHJhdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkcmF3RnJhbWUodHJ1ZSlcbiAgICAgIGNvbnN0IGtlZXBEcmF3aW5nID0gKCkgPT4ge1xuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgZHJhd0ZyYW1lKClcbiAgICAgICAgICBpZiAoIXRoaXMudmlkZW8gfHwgdGhpcy52aWRlby5lbmRlZCB8fCB0aGlzLnZpZGVvLnBhdXNlZCkgcmV0dXJuXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGtlZXBEcmF3aW5nKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoa2VlcERyYXdpbmcpXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlQ2xpY2sgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMuc3VwcG9ydFRvdWNoICYmICF0aGlzLnBhc3NpdmUpIHtcbiAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZURibENsaWNrIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnZpZGVvRW5hYmxlZCAmJiB0aGlzLnZpZGVvKSB7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCB8fCB0aGlzLnZpZGVvLmVuZGVkKSB7XG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcbiAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XG4gICAgICBpZiAoIWlucHV0LmZpbGVzLmxlbmd0aCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxuXG4gICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXG4gICAgICB0aGlzLl9vbk5ld0ZpbGVJbihmaWxlKVxuICAgIH0sXG5cbiAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcbiAgICAgIHRoaXMuY3VycmVudElzSW5pdGlhbCA9IGZhbHNlXG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG4gICAgICB0aGlzLmVtaXRFdmVudChldmVudHMuRklMRV9DSE9PU0VfRVZFTlQsIGZpbGUpXG4gICAgICB0aGlzLmNob3NlbkZpbGUgPSBmaWxlO1xuICAgICAgaWYgKCF0aGlzLl9maWxlU2l6ZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcbiAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxuICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IHUucGFyc2VEYXRhVXJsKGZpbGVEYXRhKVxuICAgICAgICAgIGNvbnN0IGlzVmlkZW8gPSAvXnZpZGVvLy50ZXN0KGZpbGUudHlwZSlcbiAgICAgICAgICBpZiAoaXNWaWRlbykge1xuICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuICAgICAgICAgICAgdmlkZW8uc3JjID0gZmlsZURhdGFcbiAgICAgICAgICAgIGZpbGVEYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh2aWRlby5yZWFkeVN0YXRlID49IHZpZGVvLkhBVkVfRlVUVVJFX0RBVEEpIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYW4gcGxheSBldmVudCcpXG4gICAgICAgICAgICAgICAgdGhpcy5fb25WaWRlb0xvYWQodmlkZW8pXG4gICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXG4gICAgICAgICAgICBmaWxlRGF0YSA9IG51bGw7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcbiAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9FVkVOVClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXG5cbiAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcbiAgICB9LFxuXG4gICAgX2ZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xuICAgICAgY29uc3QgYWNjZXB0YWJsZU1pbWVUeXBlID0gKHRoaXMudmlkZW9FbmFibGVkICYmIC9edmlkZW8vLnRlc3QoZmlsZS50eXBlKSAmJiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpLmNhblBsYXlUeXBlKGZpbGUudHlwZSkpIHx8IC9eaW1hZ2UvLnRlc3QoZmlsZS50eXBlKVxuICAgICAgaWYgKCFhY2NlcHRhYmxlTWltZVR5cGUpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCF0aGlzLmFjY2VwdCkgcmV0dXJuIHRydWVcbiAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdFxuICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxuICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXG4gICAgICAgIGlmICh0LmNoYXJBdCgwKSA9PSAnLicpIHtcbiAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XG4gICAgICAgICAgdmFyIGZpbGVCYXNlVHlwZSA9IGZpbGUudHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJylcbiAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSxcblxuICAgIF9wbGFjZUltYWdlIChhcHBseU1ldGFkYXRhKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXG5cbiAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXG4gICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmltZy5uYXR1cmFsSGVpZ2h0XG5cbiAgICAgIGltZ0RhdGEuc3RhcnRYID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WCkgPyBpbWdEYXRhLnN0YXJ0WCA6IDBcbiAgICAgIGltZ0RhdGEuc3RhcnRZID0gdS5udW1iZXJWYWxpZChpbWdEYXRhLnN0YXJ0WSkgPyBpbWdEYXRhLnN0YXJ0WSA6IDBcblxuICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xuICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcbiAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdGhpcy5zY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiB0aGlzLnNjYWxlUmF0aW9cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XG4gICAgICAgIGlmICgvdG9wLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL2xlZnQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xuICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0gdGhpcy5vdXRwdXRXaWR0aCAtIGltZ0RhdGEud2lkdGhcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IC9eKC0/XFxkKyklICgtP1xcZCspJSQvLmV4ZWModGhpcy5pbml0aWFsUG9zaXRpb24pXG4gICAgICAgICAgdmFyIHggPSArcmVzdWx0WzFdIC8gMTAwXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXG4gICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB4ICogKHRoaXMub3V0cHV0V2lkdGggLSBpbWdEYXRhLndpZHRoKVxuICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLm91dHB1dEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5fYXBwbHlNZXRhZGF0YSgpXG5cbiAgICAgIGlmIChhcHBseU1ldGFkYXRhICYmIHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcbiAgICAgICAgdGhpcy56b29tKGZhbHNlLCAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogMCB9KVxuICAgICAgfVxuICAgICAgdGhpcy5fZHJhdygpXG4gICAgfSxcblxuICAgIF9hc3BlY3RGaWxsICgpIHtcbiAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XG4gICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgIGxldCBzY2FsZVJhdGlvXG5cbiAgICAgIGlmICh0aGlzLmFzcGVjdFJhdGlvID4gY2FudmFzUmF0aW8pIHtcbiAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FzcGVjdEZpdCAoKSB7XG4gICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxuICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxuICAgICAgbGV0IGNhbnZhc1JhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICBsZXQgc2NhbGVSYXRpb1xuICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xuICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLm91dHB1dFdpZHRoXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSBpbWdIZWlnaHQgLyBzY2FsZVJhdGlvXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxuICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfbmF0dXJhbFNpemUgKCkge1xuICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcbiAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXG4gICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XG4gICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKSAvIDJcbiAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLnN1cHBvcnRUb3VjaCA9IHRydWVcbiAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcbiAgICAgIGxldCBwb2ludGVyQ29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IHBvaW50ZXJDb29yZFxuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG4gICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBpZ25vcmUgbW91c2UgcmlnaHQgY2xpY2sgYW5kIG1pZGRsZSBjbGlja1xuICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cblxuICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXG4gICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGUgPSBjYW5jZWxFdmVudHNbaV1cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLl9oYW5kbGVQb2ludGVyRW5kKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9pbnRlckVuZCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxuICAgICAgaWYgKHRoaXMucG9pbnRlclN0YXJ0Q29vcmQpIHtcbiAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXG4gICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xuICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcbiAgICAgICAgaWYgKChwb2ludGVyTW92ZURpc3RhbmNlIDwgQ0xJQ0tfTU9WRV9USFJFU0hPTEQpICYmIHRhYkVuZCAtIHRoaXMudGFiU3RhcnQgPCBNSU5fTVNfUEVSX0NMSUNLICYmIHRoaXMuc3VwcG9ydFRvdWNoKSB7XG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IDBcbiAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5wb2ludGVyU3RhcnRDb29yZCA9IG51bGxcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXG4gICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuXG4gICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxuICAgICAgdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkID0gY29vcmRcblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSkgcmV0dXJuXG5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcbiAgICAgICAgICB0aGlzLm1vdmUoe1xuICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXG4gICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xuICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxuICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxuICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxuICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBQSU5DSF9BQ0NFTEVSQVRJT04pXG4gICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXG4gICAgICB0aGlzLmN1cnJlbnRQb2ludGVyQ29vcmQgPSBudWxsXG4gICAgfSxcblxuICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWVcbiAgICAgIGlmIChldnQud2hlZWxEZWx0YSA8IDAgfHwgZXZ0LmRlbHRhWSA+IDAgfHwgZXZ0LmRldGFpbCA+IDApIHtcbiAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LndoZWVsRGVsdGEgPiAwIHx8IGV2dC5kZWx0YVkgPCAwIHx8IGV2dC5kZXRhaWwgPCAwKSB7XG4gICAgICAgIHRoaXMuem9vbSghdGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tKVxuICAgICAgfVxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ0VudGVyIChldnQpIHtcbiAgICAgIHRoaXMuZW1pdE5hdGl2ZUV2ZW50KGV2dClcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkgcmV0dXJuXG4gICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcbiAgICB9LFxuXG4gICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJhZ092ZXIgKGV2dCkge1xuICAgICAgdGhpcy5lbWl0TmF0aXZlRXZlbnQoZXZ0KVxuICAgIH0sXG5cbiAgICBfaGFuZGxlRHJvcCAoZXZ0KSB7XG4gICAgICB0aGlzLmVtaXROYXRpdmVFdmVudChldnQpXG4gICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxuICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5yZXBsYWNlRHJvcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcblxuICAgICAgbGV0IGZpbGVcbiAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcbiAgICAgIGlmICghZHQpIHJldHVyblxuICAgICAgaWYgKGR0Lml0ZW1zKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cbiAgICAgICAgICBpZiAoaXRlbS5raW5kID09ICdmaWxlJykge1xuICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlID0gZHQuZmlsZXNbMF1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgdGhpcy5fb25OZXdGaWxlSW4oZmlsZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFggPiAwKSB7XG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WSA+IDApIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm91dHB1dFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLm91dHB1dFdpZHRoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3V0cHV0SGVpZ2h0IC0gdGhpcy5pbWdEYXRhLnN0YXJ0WSA+IHRoaXMuaW1nRGF0YS5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UgKCkge1xuICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMub3V0cHV0V2lkdGgpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5vdXRwdXRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRIZWlnaHQgLyB0aGlzLm5hdHVyYWxIZWlnaHRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldE9yaWVudGF0aW9uIChvcmllbnRhdGlvbiA9IDEsIGFwcGx5TWV0YWRhdGEpIHtcbiAgICAgIHZhciB1c2VPcmlnaW5hbCA9IGFwcGx5TWV0YWRhdGFcbiAgICAgIGlmICgob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSAmJiAhdGhpcy5kaXNhYmxlRXhpZkF1dG9PcmllbnRhdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgICAgdGhpcy5yb3RhdGluZyA9IHRydWVcbiAgICAgICAgLy8gdS5nZXRSb3RhdGVkSW1hZ2VEYXRhKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxuICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmltZyA9IF9pbWdcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKGFwcGx5TWV0YWRhdGEpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcbiAgICAgIH1cblxuICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcbiAgICAgICAgLy8gZmxpcCB4XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcbiAgICAgICAgLy8gZmxpcCB5XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcbiAgICAgICAgLy8gOTAgZGVnXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXG4gICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcbiAgICAgICAgLy8gMTgwIGRlZ1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxuICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XG4gICAgICAgIC8vIDI3MCBkZWdcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxuICAgICAgfVxuXG4gICAgICBpZiAodXNlT3JpZ2luYWwpIHtcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXG4gICAgICB9XG4gICAgfSxcblxuICAgIF9wYWludEJhY2tncm91bmQgKCkge1xuICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogdGhpcy5jYW52YXNDb2xvclxuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vdXRwdXRXaWR0aCwgdGhpcy5vdXRwdXRIZWlnaHQpXG4gICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcbiAgICB9LFxuXG4gICAgX2RyYXcgKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZHJhd0ZyYW1lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgX2RyYXdGcmFtZSAoKSB7XG4gICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcblxuICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUNvbnRhaW5lckNsaXBQYXRoKVxuICAgICAgICAvLyB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUltYWdlQ2xpcFBhdGgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdEV2ZW50KGV2ZW50cy5EUkFXX0VWRU5ULCBjdHgpXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWVcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoZXZlbnRzLk5FV19JTUFHRV9EUkFXTl9FVkVOVClcbiAgICAgIH1cbiAgICAgIHRoaXMucm90YXRpbmcgPSBmYWxzZVxuICAgIH0sXG5cbiAgICBfY2xpcFBhdGhGYWN0b3J5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcbiAgICAgIGxldCByYWRpdXMgPSB0eXBlb2YgdGhpcy5pbWFnZUJvcmRlclJhZGl1cyA9PT0gJ251bWJlcicgP1xuICAgICAgICB0aGlzLmltYWdlQm9yZGVyUmFkaXVzIDpcbiAgICAgICAgIWlzTmFOKE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSkgPyBOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykgOiAwXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xuICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMpO1xuICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcbiAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByYWRpdXMsIHkpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xuICAgICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgaWYgKHRoaXMuY2xpcFBsdWdpbnMgJiYgdGhpcy5jbGlwUGx1Z2lucy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgICAgIGZ1bmModGhpcy5jdHgsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBfY3JlYXRlSW1hZ2VDbGlwUGF0aCAoKSB7XG4gICAgLy8gICBsZXQgeyBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5pbWdEYXRhXG4gICAgLy8gICBsZXQgdyA9IHdpZHRoXG4gICAgLy8gICBsZXQgaCA9IGhlaWdodFxuICAgIC8vICAgbGV0IHggPSBzdGFydFhcbiAgICAvLyAgIGxldCB5ID0gc3RhcnRZXG4gICAgLy8gICBpZiAodyA8IGgpIHtcbiAgICAvLyAgICAgaCA9IHRoaXMub3V0cHV0SGVpZ2h0ICogKHdpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aClcbiAgICAvLyAgIH1cbiAgICAvLyAgIGlmIChoIDwgdykge1xuICAgIC8vICAgICB3ID0gdGhpcy5vdXRwdXRXaWR0aCAqIChoZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodClcbiAgICAvLyAgICAgeCA9IHN0YXJ0WCArICh3aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxuICAgIC8vICAgfVxuICAgIC8vICAgdGhpcy5fY2xpcFBhdGhGYWN0b3J5KHgsIHN0YXJ0WSwgdywgaClcbiAgICAvLyB9LFxuXG4gICAgX2NsaXAgKGNyZWF0ZVBhdGgpIHtcbiAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxuICAgICAgY3R4LnNhdmUoKVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmJ1xuICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1pbidcbiAgICAgIGNyZWF0ZVBhdGgoKVxuICAgICAgY3R4LmZpbGwoKVxuICAgICAgY3R4LnJlc3RvcmUoKVxuICAgIH0sXG5cbiAgICBfYXBwbHlNZXRhZGF0YSAoKSB7XG4gICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cbiAgICAgIHZhciB7IHN0YXJ0WCwgc3RhcnRZLCBzY2FsZSB9ID0gdGhpcy51c2VyTWV0YWRhdGFcblxuICAgICAgaWYgKHUubnVtYmVyVmFsaWQoc3RhcnRYKSkge1xuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXG4gICAgICB9XG5cbiAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WSkpIHtcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxuICAgICAgfVxuXG4gICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcbiAgICAgIH1cblxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG51bGxcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIG9uRGltZW5zaW9uQ2hhbmdlICgpIHtcbiAgICAgIGlmICghdGhpcy5pbWcpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldFNpemUoKVxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbjwvc2NyaXB0PlxuXG48c3R5bGUgbGFuZz1cInN0eWx1c1wiPlxuLmNyb3BwYS1jb250YWluZXJcbiAgZGlzcGxheSBpbmxpbmUtYmxvY2tcbiAgY3Vyc29yIHBvaW50ZXJcbiAgdHJhbnNpdGlvbiBhbGwgMC4zc1xuICBwb3NpdGlvbiByZWxhdGl2ZVxuICBmb250LXNpemUgMFxuICBhbGlnbi1zZWxmIGZsZXgtc3RhcnRcbiAgYmFja2dyb3VuZC1jb2xvciAjZTZlNmU2XG5cbiAgY2FudmFzXG4gICAgdHJhbnNpdGlvbiBhbGwgMC4zc1xuXG4gICY6aG92ZXJcbiAgICBvcGFjaXR5IDAuN1xuXG4gICYuY3JvcHBhLS1kcm9wem9uZVxuICAgIGJveC1zaGFkb3cgaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXG5cbiAgICBjYW52YXNcbiAgICAgIG9wYWNpdHkgMC41XG5cbiAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXG4gICAgY3Vyc29yIGRlZmF1bHRcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICYuY3JvcHBhLS1oYXMtdGFyZ2V0XG4gICAgY3Vyc29yIG1vdmVcblxuICAgICY6aG92ZXJcbiAgICAgIG9wYWNpdHkgMVxuXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XG4gICAgICBjdXJzb3IgZGVmYXVsdFxuXG4gICYuY3JvcHBhLS1kaXNhYmxlZFxuICAgIGN1cnNvciBub3QtYWxsb3dlZFxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgJi5jcm9wcGEtLXBhc3NpdmVcbiAgICBjdXJzb3IgZGVmYXVsdFxuXG4gICAgJjpob3ZlclxuICAgICAgb3BhY2l0eSAxXG5cbiAgc3ZnLmljb24tcmVtb3ZlXG4gICAgcG9zaXRpb24gYWJzb2x1dGVcbiAgICBiYWNrZ3JvdW5kIHdoaXRlXG4gICAgYm9yZGVyLXJhZGl1cyA1MCVcbiAgICBmaWx0ZXIgZHJvcC1zaGFkb3coLTJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC43KSlcbiAgICB6LWluZGV4IDEwXG4gICAgY3Vyc29yIHBvaW50ZXJcbiAgICBib3JkZXIgMnB4IHNvbGlkIHdoaXRlXG48L3N0eWxlPlxuXG48c3R5bGUgbGFuZz1cInNjc3NcIj5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90b2JpYXNhaGxpbi9TcGluS2l0L2Jsb2IvbWFzdGVyL3Njc3Mvc3Bpbm5lcnMvMTAtZmFkaW5nLWNpcmNsZS5zY3NzXG4uc2stZmFkaW5nLWNpcmNsZSB7XG4gICRjaXJjbGVDb3VudDogMTI7XG4gICRhbmltYXRpb25EdXJhdGlvbjogMXM7XG5cbiAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gIC5zay1jaXJjbGUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gIH1cblxuICAuc2stY2lyY2xlIC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICB3aWR0aDogMTUlO1xuICAgIGhlaWdodDogMTUlO1xuICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7XG4gICAgYW5pbWF0aW9uOiBzay1jaXJjbGVGYWRlRGVsYXkgJGFuaW1hdGlvbkR1cmF0aW9uIGluZmluaXRlIGVhc2UtaW4tb3V0IGJvdGg7XG4gIH1cblxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XG4gICAgLnNrLWNpcmNsZSN7JGl9IHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyAvICRjaXJjbGVDb3VudCAqICgkaSAtIDEpKTtcbiAgICB9XG4gIH1cblxuICBAZm9yICRpIGZyb20gMiB0aHJvdWdoICRjaXJjbGVDb3VudCB7XG4gICAgLnNrLWNpcmNsZSN7JGl9IC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcbiAgICAgIGFuaW1hdGlvbi1kZWxheTogLSRhbmltYXRpb25EdXJhdGlvbiArXG4gICAgICAgICRhbmltYXRpb25EdXJhdGlvbiAvXG4gICAgICAgICRjaXJjbGVDb3VudCAqXG4gICAgICAgICgkaSAtIDEpO1xuICAgIH1cbiAgfVxufVxuQGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXkge1xuICAwJSxcbiAgMzklLFxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gIDQwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuPC9zdHlsZT5cblxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImltcG9ydCBjb21wb25lbnQgZnJvbSAnLi9jcm9wcGVyLnZ1ZSdcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgY29tcG9uZW50TmFtZTogJ2Nyb3BwYSdcclxufVxyXG5cclxuY29uc3QgVnVlQ3JvcHBhID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IHZlcnNpb24gPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVswXSlcclxuICAgIGlmICh2ZXJzaW9uIDwgMikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZ1ZS1jcm9wcGEgc3VwcG9ydHMgdnVlIHZlcnNpb24gMi4wIGFuZCBhYm92ZS4gWW91IGFyZSB1c2luZyBWdWVAJHt2ZXJzaW9ufS4gUGxlYXNlIHVwZ3JhZGUgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIFZ1ZS5gKVxyXG4gICAgfVxyXG4gICAgbGV0IGNvbXBvbmVudE5hbWUgPSBvcHRpb25zLmNvbXBvbmVudE5hbWUgfHwgJ2Nyb3BwYSdcclxuXHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5jb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KVxyXG4gIH0sXHJcblxyXG4gIGNvbXBvbmVudFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZUNyb3BwYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJ0aGlzIiwicG9pbnQiLCJ2bSIsImNhbnZhcyIsInF1YWxpdHkiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJsZWZ0IiwidG9wIiwiZXZ0IiwicG9pbnRlciIsInRvdWNoZXMiLCJjaGFuZ2VkVG91Y2hlcyIsIm9uZVBvaW50Q29vcmQiLCJwb2ludGVyMSIsInBvaW50ZXIyIiwiY29vcmQxIiwiY29vcmQyIiwiTWF0aCIsInNxcnQiLCJwb3ciLCJ4IiwieSIsImltZyIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJsYXN0VGltZSIsInZlbmRvcnMiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJtYXgiLCJpZCIsInNldFRpbWVvdXQiLCJhcmciLCJpc0FycmF5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiSFRNTENhbnZhc0VsZW1lbnQiLCJiaW5TdHIiLCJsZW4iLCJhcnIiLCJ0b0Jsb2IiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJhdG9iIiwidG9EYXRhVVJMIiwic3BsaXQiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiZHQiLCJkYXRhVHJhbnNmZXIiLCJvcmlnaW5hbEV2ZW50IiwidHlwZXMiLCJhcnJheUJ1ZmZlciIsInZpZXciLCJEYXRhVmlldyIsImdldFVpbnQxNiIsImJ5dGVMZW5ndGgiLCJvZmZzZXQiLCJtYXJrZXIiLCJnZXRVaW50MzIiLCJsaXR0bGUiLCJ0YWdzIiwidXJsIiwicmVnIiwiZXhlYyIsImJhc2U2NCIsImJpbmFyeVN0cmluZyIsImJ5dGVzIiwiYnVmZmVyIiwib3JpZW50YXRpb24iLCJfY2FudmFzIiwiQ2FudmFzRXhpZk9yaWVudGF0aW9uIiwiZHJhd0ltYWdlIiwiX2ltZyIsIkltYWdlIiwic3JjIiwib3JpIiwibWFwIiwibiIsImlzTmFOIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidmFsdWUiLCJpc0Zpbml0ZSIsImZsb29yIiwiaW5pdGlhbEltYWdlVHlwZSIsIlN0cmluZyIsInZhbCIsIkJvb2xlYW4iLCJ2YWxpZHMiLCJldmVyeSIsImluZGV4T2YiLCJ3b3JkIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwic3luY0RhdGEiLCJyZW5kZXIiLCJldmVudHMiLCJJTklUX0VWRU5UIiwicHJvcHMiLCJ3IiwidXNlQXV0b1NpemluZyIsInJlYWxXaWR0aCIsIndpZHRoIiwiaCIsInJlYWxIZWlnaHQiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2xvYWRpbmciLCJuZXdWYWx1ZSIsIm9sZFZhbHVlIiwicGFzc2l2ZSIsImVtaXRFdmVudCIsIkxPQURJTkdfU1RBUlRfRVZFTlQiLCJMT0FESU5HX0VORF9FVkVOVCIsIl9pbml0aWFsaXplIiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwiJHdhdGNoIiwiZGF0YSIsInNldCIsImtleSIsIiRzZXQiLCJyZW1vdmUiLCIkbmV4dFRpY2siLCJfZHJhdyIsImF1dG9TaXppbmciLCIkcmVmcyIsIndyYXBwZXIiLCJnZXRDb21wdXRlZFN0eWxlIiwiX2F1dG9TaXppbmdJbml0IiwiX2F1dG9TaXppbmdSZW1vdmUiLCJvbkRpbWVuc2lvbkNoYW5nZSIsIl9zZXRQbGFjZWhvbGRlcnMiLCJpbWFnZVNldCIsIl9wbGFjZUltYWdlIiwib2xkVmFsIiwidSIsIm51bWJlclZhbGlkIiwicG9zIiwiY3VycmVudFBvaW50ZXJDb29yZCIsImltZ0RhdGEiLCJzdGFydFgiLCJzdGFydFkiLCJ1c2VyTWV0YWRhdGEiLCJyb3RhdGluZyIsIm9mZnNldFgiLCJvZmZzZXRZIiwicHJldmVudFdoaXRlU3BhY2UiLCJfcHJldmVudFpvb21pbmdUb1doaXRlU3BhY2UiLCJfcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsInNjYWxlUmF0aW8iLCJoYXNJbWFnZSIsImFicyIsIlpPT01fRVZFTlQiLCIkZW1pdCIsImN0eCIsImNob3NlbkZpbGUiLCJmaWxlSW5wdXQiLCJmaWxlcyIsIm9sZFgiLCJvbGRZIiwiTU9WRV9FVkVOVCIsImFtb3VudCIsIm1vdmUiLCJ6b29tSW4iLCJhY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsIm91dHB1dFdpZHRoIiwiem9vbSIsInN0ZXAiLCJkaXNhYmxlUm90YXRpb24iLCJkaXNhYmxlZCIsInBhcnNlSW50IiwiX3JvdGF0ZUJ5U3RlcCIsIl9zZXRPcmllbnRhdGlvbiIsIm1ldGFkYXRhIiwic3RvcmVkUGl4ZWxEZW5zaXR5IiwicGl4ZWxEZW5zaXR5IiwiY3VycmVudFBpeGVsRGVuc2l0eSIsInBpeGVsRGVuc2l0eURpZmYiLCJzY2FsZSIsImFwcGx5TWV0YWRhdGEiLCJjb21wcmVzc2lvblJhdGUiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdlbmVyYXRlQmxvYiIsImJsb2IiLCJlcnIiLCJnZXRNZXRhZGF0YSIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwiY2xpY2siLCJrZWVwQ2hvc2VuRmlsZSIsImhhZEltYWdlIiwib3JpZ2luYWxJbWFnZSIsInZpZGVvIiwicGF1c2UiLCJJTUFHRV9SRU1PVkVfRVZFTlQiLCJwbHVnaW4iLCJjbGlwUGx1Z2lucyIsInB1c2giLCJFcnJvciIsImZpbGUiLCJfb25OZXdGaWxlSW4iLCJzbGljZSIsIl9zZXRDb250YWluZXJTaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfc2V0U2l6ZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY2FudmFzQ29sb3IiLCJnZXRDb250ZXh0IiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiaW1hZ2VTbW9vdGhpbmdRdWFsaXR5Iiwid2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwibXNJbWFnZVNtb290aGluZ0VuYWJsZWQiLCJfc2V0SW5pdGlhbCIsIm91dHB1dEhlaWdodCIsIiRzbG90cyIsInBsYWNlaG9sZGVyIiwidk5vZGUiLCJ0YWciLCJlbG0iLCJvbkxvYWQiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImRlZmF1bHRGb250U2l6ZSIsImZvbnRTaXplIiwiY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplIiwiZm9udCIsImZpbGxTdHlsZSIsInBsYWNlaG9sZGVyQ29sb3IiLCJmaWxsVGV4dCIsIl9wYWludEJhY2tncm91bmQiLCJfc2V0SW1hZ2VQbGFjZWhvbGRlciIsIl9zZXRUZXh0UGxhY2Vob2xkZXIiLCJpbml0aWFsIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsImN1cnJlbnRJc0luaXRpYWwiLCJvbkVycm9yIiwibG9hZGluZyIsIl9vbmxvYWQiLCJkYXRhc2V0Iiwib25lcnJvciIsIklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UIiwidmlkZW9XaWR0aCIsInZpZGVvSGVpZ2h0IiwiZHJhd0ZyYW1lIiwiZnJhbWUiLCJrZWVwRHJhd2luZyIsImVuZGVkIiwicGF1c2VkIiwiZW1pdE5hdGl2ZUV2ZW50IiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJjaG9vc2VGaWxlIiwidmlkZW9FbmFibGVkIiwicGxheSIsImlucHV0IiwiRklMRV9DSE9PU0VfRVZFTlQiLCJfZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsInBhcnNlRGF0YVVybCIsImlzVmlkZW8iLCJyZWFkeVN0YXRlIiwiSEFWRV9GVVRVUkVfREFUQSIsIl9vblZpZGVvTG9hZCIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0VfRVZFTlQiLCJyZWFkQXNEYXRhVVJMIiwiZmlsZVNpemVMaW1pdCIsInNpemUiLCJhY2NlcHRhYmxlTWltZVR5cGUiLCJjYW5QbGF5VHlwZSIsImFjY2VwdCIsImJhc2VNaW1ldHlwZSIsInJlcGxhY2UiLCJ0IiwidHJpbSIsImNoYXJBdCIsImZpbGVCYXNlVHlwZSIsIl9hc3BlY3RGaWxsIiwiaW5pdGlhbFNpemUiLCJfYXNwZWN0Rml0IiwiX25hdHVyYWxTaXplIiwiaW5pdGlhbFBvc2l0aW9uIiwiX2FwcGx5TWV0YWRhdGEiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImNhbnZhc1JhdGlvIiwiYXNwZWN0UmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiX2hhbmRsZVBvaW50ZXJFbmQiLCJwb2ludGVyTW92ZURpc3RhbmNlIiwidGFiRW5kIiwiZGlzYWJsZURyYWdUb01vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3RhbmNlIiwiZGVsdGEiLCJkaXNhYmxlU2Nyb2xsVG9ab29tIiwic2Nyb2xsaW5nIiwid2hlZWxEZWx0YSIsImRlbHRhWSIsImRldGFpbCIsInJldmVyc2VTY3JvbGxUb1pvb20iLCJkaXNhYmxlRHJhZ0FuZERyb3AiLCJldmVudEhhc0ZpbGUiLCJyZXBsYWNlRHJvcCIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJ1c2VPcmlnaW5hbCIsImRpc2FibGVFeGlmQXV0b09yaWVudGF0aW9uIiwiZ2V0Um90YXRlZEltYWdlIiwiZmxpcFgiLCJmbGlwWSIsInJvdGF0ZTkwIiwiY2xlYXJSZWN0IiwiZmlsbFJlY3QiLCJfZHJhd0ZyYW1lIiwiX2NsaXAiLCJfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgiLCJEUkFXX0VWRU5UIiwiTkVXX0lNQUdFX0RSQVdOX0VWRU5UIiwicmFkaXVzIiwiaW1hZ2VCb3JkZXJSYWRpdXMiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwiY2xvc2VQYXRoIiwiX2NsaXBQYXRoRmFjdG9yeSIsImZvckVhY2giLCJjcmVhdGVQYXRoIiwic2F2ZSIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsImZpbGwiLCJyZXN0b3JlIiwiZGVmYXVsdE9wdGlvbnMiLCJWdWVDcm9wcGEiLCJWdWUiLCJvcHRpb25zIiwiYXNzaWduIiwidmVyc2lvbiIsImNvbXBvbmVudE5hbWUiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtJQUN0QixJQUFJLE9BQU9BLFNBQU0sS0FBSyxVQUFVLElBQUlBLFNBQU0sQ0FBQyxHQUFHLEVBQUU7UUFDNUNBLFNBQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdkIsTUFBTSxBQUFpQztRQUNwQyxjQUFjLEdBQUcsT0FBTyxFQUFFLENBQUM7S0FDOUIsQUFFRjtDQUNGLENBQUNDLGNBQUksRUFBRSxZQUFZO0VBQ2xCLFlBQVksQ0FBQzs7RUFFYixTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7O0lBRWpGLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUNyQyxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0lBRXhDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7SUFFdkIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1gsUUFBUSxDQUFDLFdBQVc7O01BRWxCLEtBQUssQ0FBQztVQUNGLE1BQU07OztNQUdWLEtBQUssQ0FBQztTQUNILEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDakIsTUFBTTs7O01BR1QsS0FBSyxDQUFDO1VBQ0YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7VUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztVQUN6QixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2pCLE1BQU07OztNQUdWLEtBQUssQ0FBQztVQUNGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1VBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1VBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7VUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNqQixNQUFNOzs7TUFHVixLQUFLLENBQUM7VUFDRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztVQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztVQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDMUIsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1VBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7VUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7VUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1VBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDakIsTUFBTTs7O01BR1YsS0FBSyxDQUFDO1VBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7VUFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7VUFDdEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7VUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztVQUNoQyxNQUFNO0tBQ1g7O0lBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxD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
