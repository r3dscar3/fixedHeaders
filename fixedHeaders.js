(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fixedHeaders = factory());
}(this, (function () { 'use strict';

var browserPrefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];
var fixedTableHeaderClass = 'js-is-fixyHeader';
var fixedTableHeaderIsStuckClass = 'js-is-fixedHeader';
var trackedNodes = [];
var trackedHeaders = [];

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

	function wrappedCheckFixing() {
		return scrollTarget.requestAnimationFrame(checkFixing);
	}

	window.addEventListener('resize', fixing);

  scrollTarget.addEventListener('scroll', wrappedCheckFixing);

};

FixedHeader.prototype.destroy = function destroy() {
	window.removeEventListener('resize', FixedHeader.fixing);
	window.removeEventListener('scroll', FixedHeader.wrappedCheckFixing);
}

function create(target, o) {
  var els = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!('length' in els)) els = [els];
  var fixedHeader = void 0;
  for (var i = 0; i < els.length; i += 1) {
    var el = els[i];
		if (trackedNodes.indexOf(el) === -1) {
			trackedNodes.push(el);
	    fixedHeader = new FixedHeader(el, o);

			trackedHeaders.push(fixedHeader);
	    fixedHeader.manageFixing();
		}
  }
}

function destroy(target) {
	var els = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!('length' in els)) els = [els];
  var fixedHeader = void 0;
  for (var i = 0; i < els.length; i += 1) {
    var el = els[i];
		var trackedNode;
		var trackedHeader;
		var j;

		for (j = 0; j < trackedNodes.length; j++) {
			if (el === trackedNodes[j]) {
				trackedNode = trackedNodes[j];
				trackedNodes.splice(j, 1);
				break;
			}
		}

		for (j = 0; j < trackedHeaders.length; j++) {
			if (el === trackedHeaders[j].el) {
				trackedHeader = trackedHeaders[j];
				trackedHeaders.splice(j, 1);
				break;
			}
		}

		if (trackedHeader) trackedHeader.destroy();
  }
}

return {
	create: create,
	destroy: destroy
};

})));
