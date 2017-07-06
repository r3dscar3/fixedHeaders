(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.fixedHeaders = factory());
}(this, (function() {
    'use strict';

    var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
    var fixedTableHeaderClass = 'js-is-fixyHeader';
    var fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';

    function FixedHeader(target, o) {
        this.el = target;
        this.elCopy = this.el.cloneNode(true);
        this.elCopyAttached = false;
        this.scrollTarget = o && o.scrollTarget || window;
        this.fixedHeaderOffset = o && o.fixedHeaderOffset || 0;
    }

    FixedHeader.prototype.manageFixing = function manageFixing() {
        var el = this.el;
        var elCopy = this.elCopy;
        var fixedHeaderOffset = this.fixedHeaderOffset;
        var elCopyStyle = elCopy.style;
        var elCopyClasses = elCopy.classList;
        var elParent = el.parentNode;
        var fixedHeaderstart = el.getBoundingClientRect().top - fixedHeaderOffset;
        var lastChildHeight = el.nextSibling.lastChild.offsetHeight || 0;
        var fixedHeaderstop = fixedHeaderstart + elParent.offsetHeight - el.offsetHeight - lastChildHeight;
        var scrollTarget = this.scrollTarget;

        this.fixing = () => {
            var elWidth = el.offsetWidth;
            var browserWidth = window.innerWidth;

            if (browserWidth > el.scrollWidth) {
                var scroll = scrollTarget.scrollY;
                if (scroll < fixedHeaderstart) {
                    if (elCopyClasses.contains(fixedTableHeaderClass)) {
                        elCopyClasses.remove(fixedTableHeaderClass);
                        elCopyStyle.position = '';

                        if (this.elCopyAttached) {
                            elParent.removeChild(elCopy);
                            this.elCopyAttached = false;
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
                    if (elCopyClasses.contains(fixedTableHeaderClass) && !this.elCopyAttached) {
                        elParent.appendChild(elCopy);
                        elCopyClasses.add('cloned');
                        elCopyStyle.position = 'fixed';
                        elCopyStyle.top = fixedHeaderOffset + 'px';
                        elCopyStyle.width = elWidth + 'px';
                        this.elCopyAttached = true;
                    }
                } else if (scroll > fixedHeaderstop && !elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
                    elCopyClasses.remove(fixedTableHeaderClass);
                    elCopyClasses.add(fixedTableHeaderIsStuckClass);
                    elCopyStyle.position = 'absolute';
                    elCopyStyle.top = '';
                    elCopyStyle.bottom = lastChildHeight + 'px';
                }
            }
        }

        this.getDoFixingOnAnimationFrame = () => {
            return this.scrollTarget.requestAnimationFrame(this.fixing);
        }

        this.removeChildrenThenFix = () => {
            if (this.elCopyAttached) {
                elParent.removeChild(elCopy);
                this.elCopyAttached = false;
            }

            this.fixing();
        }

        window.addEventListener('resize', this.removeChildrenThenFix);
        scrollTarget.addEventListener('scroll', this.getDoFixingOnAnimationFrame);
    };

    FixedHeader.prototype.cleanup = function cleanup() {
        window.removeEventListener('resize', this.removeChildrenThenFix);
        this.scrollTarget.removeEventListener('scroll', this.getDoFixingOnAnimationFrame);
    }

    function MultiFixedHeaders(instances) {
        var self = this;

        this.privateInstances = instances || [];
        this.cleanup = function() {
            self.privateInstances.forEach(function(instance) {
                instance.cleanup();
            });
        }
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

})));
