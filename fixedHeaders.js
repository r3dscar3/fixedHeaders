(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fixedHeaders = factory());
}(this, (function () { 'use strict';

var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
var fixedTableHeaderClass = 'js-is-fixyHeader';
var fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';

function FixedHeader(target, o) {
  this.el = target;
  this.scrollTarget = o && o.scrollTarget || window;
  this.fixedHeaderOffset = o && o.fixedHeaderOffset || 0;
}

FixedHeader.prototype.manageFixing = function manageFixing() {
  var el = this.el;
  var scrollTarget = this.scrollTarget;
  var fixedHeaderOffset = this.fixedHeaderOffset;
	var elCopy = el.cloneNode(true);
	var elCopyStyle = elCopy.style;
  var elCopyClasses = elCopy.classList;
  var elParent = el.parentNode;
	var lastChildHeight = el.nextSibling.lastChild.offsetHeight || 0;
  var fixedHeaderstart = el.getBoundingClientRect().top - fixedHeaderOffset;
  var fixedHeaderstop = fixedHeaderstart + elParent.offsetHeight - el.offsetHeight - lastChildHeight;
	var clones = elParent.getElementsByClassName('cloned');

  function fixing() {
		var browserWidth = window.innerWidth;
		var elWidth = el.offsetWidth;

		if (browserWidth > el.scrollWidth) {
			var scroll = scrollTarget.scrollY;
	    if (scroll < fixedHeaderstart) {
	      if (elCopyClasses.contains(fixedTableHeaderClass)) {
	        elCopyClasses.remove(fixedTableHeaderClass);
					elParent.removeChild(elCopy);
					elCopyStyle.position = '';
	      }
	    } else if (scroll > fixedHeaderstart && scroll < fixedHeaderstop) {
	      if (!elCopyClasses.contains(fixedTableHeaderClass)) elCopyClasses.add(fixedTableHeaderClass);
	      if (elCopyClasses.contains(fixedTableHeaderIsStuckClass)) {
	        elCopyClasses.remove(fixedTableHeaderIsStuckClass);
					elCopyStyle.bottom = '';
					elCopyStyle.width = '';
	      }
				if (elCopyClasses.contains(fixedTableHeaderClass)) {
					elParent.appendChild(elCopy);
					elCopyClasses.add('cloned');
					elCopyStyle.position = 'fixed';
					elCopyStyle.top = fixedHeaderOffset + 'px';
					elCopyStyle.width = elWidth + 'px';

					if(clones.length > 0) {
						for(var i = clones.length - 1; i > 0; i--) {
							clones[i].parentNode.removeChild(clones[i]);
						}
					}
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

  var invoked = void 0;
  function checkFixing() {
    if (invoked) return;
    invoked = true;
    fixing();
    window.setTimeout(function () {
      invoked = false;
    }, 0);
  }
	window.addEventListener('resize', function() {
		fixing();
	});
  scrollTarget.addEventListener('scroll', function () {
    return scrollTarget.requestAnimationFrame(checkFixing);
  });
};

function fixedHeaders(target, o) {
  var els = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!('length' in els)) els = [els];
  var fixedHeader = void 0;
  for (var i = 0; i < els.length; i += 1) {
    var el = els[i];
    fixedHeader = new FixedHeader(el, o);
    fixedHeader.manageFixing();
  }
}

return fixedHeaders;

})));
