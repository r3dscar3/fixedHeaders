let browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
let fixedTableHeaderClass = 'js-is-fixyHeader';
let fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';

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
    let el = this.el;
    let elCopy = this.elCopy;
    let fixedHeaderOffset = this.fixedHeaderOffset;
    let borderTop = this.el.style.borderTopWidth || 0;
    let borderBottom = this.el.style.borderBottomWidth || 0;
    let elCopyStyle = elCopy.style;
    let elCopyClasses = elCopy.classList;
    let elParent = el.parentNode;
    let ignoreParentWidth = this.ignoreParentWidth;
    let fixedHeaderstart = el.getBoundingClientRect().top - borderTop - fixedHeaderOffset;
    let releaseAtLastSibling = this.releaseAtLastSibling;
    let lastChildHeight = releaseAtLastSibling ? el.nextSibling.lastChild.offsetHeight : 0;
    let fixedHeaderstop = fixedHeaderstart + elParent.offsetHeight - (el.offsetHeight + borderBottom) - lastChildHeight;
    let scrollTarget = this.scrollTarget;

    this.fixing = () => {
        let elWidth = el.offsetWidth;

        if ((elParent.offsetWidth >= el.scrollWidth) || ignoreParentWidth) {
            let scroll = scrollTarget === window ? scrollTarget.scrollY : scrollTarget.scrollTop;
            if (scroll < fixedHeaderstart) {
                if (elCopyClasses.contains(fixedTableHeaderClass)) {
                    elCopyClasses.remove(fixedTableHeaderClass);
                    elCopyStyle.position = '';

                    if (this.elCopyAttached) {
                        elParent.removeChild(elCopy);
                        this.elCopyAttached = false;
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
                if (elCopyClasses.contains(fixedTableHeaderClass) && !this.elCopyAttached) {
                    elParent.appendChild(elCopy);
                    elCopyClasses.add('cloned');
                    elCopyStyle.position = 'fixed';
                    elCopyStyle.top = fixedHeaderOffset + 'px';
                    elCopyStyle.width = elWidth + 'px';
                    this.elCopyAttached = true;
                }
            } else if (scroll >= fixedHeaderstop && !elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
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
    let self = this;

    this.privateInstances = instances || [];
    this.cleanup = function() {
        self.privateInstances.forEach(function(instance) {
            instance.cleanup();
        });
    }
}

export default function(target, o) {
    let els = typeof target === 'string' ? document.querySelectorAll(target) : target;
    let instances = [];
    if (!('length' in els)) els = [els];
    for (let i = 0; i < els.length; i += 1) {
        let el = els[i];
        let fixedHeader = new FixedHeader(el, o);
        instances.push(fixedHeader);
        fixedHeader.manageFixing();
    }

    return new MultiFixedHeaders(instances);
}
