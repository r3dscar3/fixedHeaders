/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.fixedHeaders = factory();
})(undefined, function () {
    'use strict';

    var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
    var fixedTableHeaderClass = 'js-is-fixyHeader';
    var fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';

    function FixedHeader(target, o) {
        this.el = target;
        this.elCopy = this.el.cloneNode(true);
        this.elCopyAttached = false;
        this.releaseAtLastSibling = o && o.releaseAtLastSibling || false;
        this.scrollTarget = o && o.scrollTarget ? document.getElementById(o.scrollTarget) : window;
        this.fixedHeaderOffset = o && o.fixedHeaderOffset || 0;
    }

    FixedHeader.prototype.manageFixing = function manageFixing() {
        var _this = this;

        var el = this.el;
        var elCopy = this.elCopy;
        var fixedHeaderOffset = this.fixedHeaderOffset;
        var elCopyStyle = elCopy.style;
        var elCopyClasses = elCopy.classList;
        var elParent = el.parentNode;
        var fixedHeaderstart = el.getBoundingClientRect().top - fixedHeaderOffset;
        var releaseAtLastSibling = this.releaseAtLastSibling;
        var lastChildHeight = releaseAtLastSibling ? el.nextSibling.lastChild.offsetHeight : 0;
        var fixedHeaderstop = fixedHeaderstart + elParent.offsetHeight - el.offsetHeight - lastChildHeight;
        var scrollTarget = this.scrollTarget;

        this.fixing = function () {
            var elWidth = el.offsetWidth;
            var browserWidth = window.innerWidth;

            if (browserWidth > el.scrollWidth) {
                var scroll = scrollTarget === window ? scrollTarget.scrollY : scrollTarget.scrollTop;
                if (scroll < fixedHeaderstart) {
                    if (elCopyClasses.contains(fixedTableHeaderClass)) {
                        elCopyClasses.remove(fixedTableHeaderClass);
                        elCopyStyle.position = '';

                        if (_this.elCopyAttached) {
                            elParent.removeChild(elCopy);
                            _this.elCopyAttached = false;
                        }
                    }
                } else if (scroll > fixedHeaderstart && scroll < fixedHeaderstop) {
                    if (!elCopyClasses.contains(fixedTableHeaderClass)) elCopyClasses.add(fixedTableHeaderClass);
                    if (elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
                        elCopyClasses.remove(fixedTableHeaderIsStuckClass);
                        elCopyStyle.bottom = '';
                        elCopyStyle.position = 'fixed';
                        elCopyStyle.top = fixedHeaderOffset + 'px';
                        elCopyStyle.width = elWidth + 'px';
                    }
                    if (elCopyClasses.contains(fixedTableHeaderClass) && !_this.elCopyAttached) {
                        elParent.appendChild(elCopy);
                        elCopyClasses.add('cloned');
                        elCopyStyle.position = 'fixed';
                        elCopyStyle.top = fixedHeaderOffset + 'px';
                        elCopyStyle.width = elWidth + 'px';
                        _this.elCopyAttached = true;
                    }
                } else if (scroll > fixedHeaderstop && !elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
                    elCopyClasses.remove(fixedTableHeaderClass);
                    elCopyClasses.add(fixedTableHeaderIsStuckClass);
                    elCopyStyle.position = 'absolute';
                    elCopyStyle.top = '';
                    elCopyStyle.bottom = lastChildHeight + 'px';
                }
            }
        };

        this.getDoFixingOnAnimationFrame = function () {
            return _this.scrollTarget.requestAnimationFrame(_this.fixing);
        };

        this.removeChildrenThenFix = function () {
            if (_this.elCopyAttached) {
                elParent.removeChild(elCopy);
                _this.elCopyAttached = false;
            }

            _this.fixing();
        };

        window.addEventListener('resize', this.removeChildrenThenFix);
        scrollTarget.addEventListener('scroll', this.getDoFixingOnAnimationFrame);
    };

    FixedHeader.prototype.cleanup = function cleanup() {
        window.removeEventListener('resize', this.removeChildrenThenFix);
        this.scrollTarget.removeEventListener('scroll', this.getDoFixingOnAnimationFrame);
    };

    function MultiFixedHeaders(instances) {
        var self = this;

        this.privateInstances = instances || [];
        this.cleanup = function () {
            self.privateInstances.forEach(function (instance) {
                instance.cleanup();
            });
        };
    }

    function create(target, o) {
        var els = typeof target === 'string' ? document.querySelectorAll(target) : target;
        var instances = [];
        if (!('length' in els)) els = [els];
        for (var i = 0; i < els.length; i += 1) {
            var el = els[i];
            var fixedHeader = new FixedHeader(el, o);
            instances.push(fixedHeader);
            fixedHeader.manageFixing();
        }

        return new MultiFixedHeaders(instances);
    }

    return create;
});

/***/ })
/******/ ]);