'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (target, o) {
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
};

var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
var fixedTableHeaderClass = 'js-is-fixyHeader';
var fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';

function FixedHeader(target, o) {
    this.el = target;
    this.elCopy = this.el.cloneNode(true);
    this.elCopyAttached = false;
    this.releaseAtLastSibling = o && o.releaseAtLastSibling || false;
    this.ignoreParentWidth = o && o.ignoreParentWidth || false;
    this.scrollTarget = o && o.scrollTarget ? document.getElementById(o.scrollTarget) : window;
    this.fixedHeaderOffset = o && o.fixedHeaderOffset || 0;
}

FixedHeader.prototype.manageFixing = function manageFixing() {
    var _this = this;

    var el = this.el;
    var elCopy = this.elCopy;
    var fixedHeaderOffset = this.fixedHeaderOffset;
    var borderTop = this.el.style.borderTopWidth || 0;
    var borderBottom = this.el.style.borderBottomWidth || 0;
    var elCopyStyle = elCopy.style;
    var elCopyClasses = elCopy.classList;
    var elParent = el.parentNode;
    var ignoreParentWidth = this.ignoreParentWidth;
    var fixedHeaderstart = el.getBoundingClientRect().top - fixedHeaderOffset;
    var releaseAtLastSibling = this.releaseAtLastSibling;
    var lastChildHeight = releaseAtLastSibling ? el.nextSibling.lastChild.offsetHeight : 0;
    var fixedHeaderstop = fixedHeaderstart + elParent.offsetHeight - (el.offsetHeight + borderBottom + borderTop) - lastChildHeight;
    var scrollTarget = this.scrollTarget;

    this.fixing = function () {
        var elWidth = el.offsetWidth;

        if (elParent.offsetWidth >= el.scrollWidth || ignoreParentWidth) {
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
            } else if (scroll >= fixedHeaderstart && scroll < fixedHeaderstop) {
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
            } else if (scroll >= fixedHeaderstop && !elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
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