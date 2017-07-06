/*!
 * Overscoll animation like android
 * Copyright (C) 2017 rickhysiswanto@gmail.com
 * Licensed under the MIT license
 *
 * @author Rickhy Siswanto
 * @version 1.0.0 (2017-07-01)
 * @link http://www.sinar-soft.com/plugins/
 */
 
Framework7.prototype.plugins.overscrollAnimation = function (app, params) {
 
// exit if not enabled
if (Object.getOwnPropertyNames(params).length < 1) return;

//defaults options
var defaults = {
	color: "#d2d2d2",
	width: "400",
	height: "680",
	opacity: ".6"
};

//cache
var SUPPORTS_TOUCH = "ontouchstart" in window,
	// Detect whether device supports orientationchange event, otherwise fall back to
	// the resize event.
	supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
	opt = merge_options(params),
	strAnimation = generateString(),
    shell,
    bounds = document.getElementsByClassName('feedback-animation-canvas'),
    inputY,
    dotSettings,
    cleanBoundsTimeout,
    cleanBoundsInterval;
	//setupOverScroll();
	
// Orientation event listener
window.addEventListener(orientationEvent, orientatiOnChange, false);

/**
 * Overwrites obj1's values and adds obj1's to default object 
 * @param obj1
 * @returns obj2 a new object based on obj1
 */
function merge_options(obj1){
    for (var attrname in obj1) { defaults[attrname] = obj1[attrname]; }
    return defaults;
}

function orientatiOnChange(){
	var fac = document.querySelectorAll('.feedback-animation-canvas');
	
	for (var i = 0; i < fac.length; i++) {
		console.dir(fac[i]);
		fac[i].setAttribute('width', screen.width);
	}
}

//setup (touch/non-touch)
function handleAppInit(){
    var scroller = document.querySelectorAll('.page-content');
	inputY = 0;
	
	for (var i = 0; i < scroller.length; i++) {
		if(scroller[i].previousElementSibling.tagName !== 'svg') scroller[i].insertAdjacentHTML('beforebegin', strAnimation);
		scroller[i].addEventListener(SUPPORTS_TOUCH ? "touchstart" : "mousedown", onDown, false);
		if(!SUPPORTS_TOUCH) { scroller[i].setAttribute('class', 'hideScrollBar'); }
	}
	
    var dot = document.querySelectorAll('.feedback-animation');
	
	for (var i = 0; i < dot.length; i++) {
		dotSettings = { 
			cxOrig: dot[i].getAttribute('cx'), 
			cyOrig: dot[i].getAttribute('cy'),
			cyOrigMax: 0,
			cyOffset: dot[i].getAttribute('r') - Math.abs(dot[i].getAttribute('cy')),
			r: dot[i].getAttribute('r'),
			isAtMinBounds: true,
			SCALER: -7,
			X_INCREMENTER: 4,
			Y_INCREMENTER: 3,
			ALPHA_INCREMENTER: .08,
			ALPHA_MULTIPLIER: .6,
			CLEAR_TIME: 500,
			CLEAN_BOUNDS_INTERVAL: 25
		};
	}
	orientatiOnChange();
}

function generateString(){
	var str='';
		str += '<svg class=\"feedback-animation-canvas\" width=\"'+ opt.width +'\" height=\"'+ opt.height +'\" opacity=\"'+ opt.opacity +'\">';
		str += '<circle class=\"feedback-animation hidden\" cx=\"100\" cy=\"-975\" r=\"1000\" fill=\"'+ opt.color +'\" opacity=\"0\"\/>';
		str += '<\/svg>';
	return str;
}
//methods
function overscrollAnimation(el) {
  cleanBoundsTimeout = setTimeout(function(){
    el.previousElementSibling.firstElementChild.setAttribute('class', 'hidden');
    //clear below animation update
    clearInterval(cleanBoundsInterval);
  }, dotSettings.CLEAR_TIME);
  
  cleanBoundsInterval = setInterval(function(){
    var currX = el.previousElementSibling.firstElementChild.getAttribute('cx'),
  			currY = el.previousElementSibling.firstElementChild.getAttribute('cy'),
        newX, newY, newA;    
    
    //x
    if(currX < dotSettings.cxOrig) { newX = parseFloat(currX) + dotSettings.X_INCREMENTER; }
    else if(currX > dotSettings.cxOrig) { newX = parseFloat(currX) - dotSettings.X_INCREMENTER; }
    
    //y
    if(currY < dotSettings.cyOrig) { newY = parseFloat(currY) - dotSettings.Y_INCREMENTER; }
    else if(currY > dotSettings.cyOrig) { newY = parseFloat(currY) + dotSettings.Y_INCREMENTER; }
    
    //a
    newA = parseFloat(el.previousElementSibling.firstElementChild.getAttribute('opacity')) - dotSettings.ALPHA_INCREMENTER;
    
    //update
    updateDot(newX, newY, newA, el.previousElementSibling.firstElementChild);
  }, dotSettings.CLEAN_BOUNDS_INTERVAL);
}

function quickFlash(isAtMinBounds, el) {
  var y = isAtMinBounds ? 
      		parseFloat(dotSettings.cyOrig) + parseFloat(dotSettings.cyOffset) : 
  				parseFloat(dotSettings.cyOrigMax) - parseFloat(dotSettings.cyOffset); 
  dotSettings.isAtMinBounds = isAtMinBounds;
  
  if(el){  
	el.previousElementSibling.firstElementChild.setAttribute('class', '');
	updateDot(dotSettings.cxOrig, y, .5, el.previousElementSibling.firstElementChild);
	if(cleanBoundsTimeout) { clearTimeout(cleanBoundsTimeout); clearInterval(cleanBoundsInterval); } 
	overscrollAnimation(el);
  }
}

function updateDot(x, y, a, el) {
  if(x) { el.setAttribute('cx', x) };
  if(y) { el.setAttribute('cy', y) };
  if(a) { el.setAttribute('opacity', a) };
}

//handlers
function onDown(e){ 
  //top vs bottom bounds
  if(this.scrollTop === 0) {
    dotSettings.isAtMinBounds = true;
    updateDot(dotSettings.cxOrig, dotSettings.cyOrig, 0, this.previousElementSibling.firstElementChild);
  } else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
	dotSettings.isAtMinBounds = false;
    dotSettings.cyOrigMax = (dotSettings.cyOrig * -1) + this.clientHeight;
  	updateDot(dotSettings.cxOrig, dotSettings.cyOrigMax, 0, this.previousElementSibling.firstElementChild);
  } else {
    this.addEventListener("scroll", onScrolling, false);
    return;
  }
  //prep updates
  inputY = SUPPORTS_TOUCH ? e.touches[0].clientY : e.clientY;
  window.thatParams = this;
  window.addEventListener(SUPPORTS_TOUCH ? "touchend" : "mouseup", onUp, false);
  this.addEventListener(SUPPORTS_TOUCH ? "touchmove" : "mousemove", onMove, false);
  this.previousElementSibling.firstElementChild.setAttribute('class', '');
  this.parentElement.parentElement.classList[0] = 'cursor-dot-down';
  if(cleanBoundsTimeout) { clearTimeout(cleanBoundsTimeout); clearInterval(cleanBoundsInterval); }
}

function onUp(e) {
  window.removeEventListener(SUPPORTS_TOUCH ? "touchend" : "mouseup", onUp, false);
  window.thatParams.removeEventListener(SUPPORTS_TOUCH ? "touchmove" : "mousemove", onMove, false);
  window.thatParams.parentElement.parentElement.classList[0] = 'pages';
  if(cleanBoundsTimeout) { clearTimeout(cleanBoundsTimeout); clearInterval(cleanBoundsInterval); }
  overscrollAnimation(window.thatParams);
}

function onMove(e) {
  var newY,
      newA,
      clientX = SUPPORTS_TOUCH ? e.touches[0].clientX : e.clientX,
  		clientY = SUPPORTS_TOUCH ? e.touches[0].clientY : e.clientY;
  
  //bounds top vs bottom
  if(dotSettings.isAtMinBounds) {
    if(clientY < inputY) { onUp(); return; }
    newY = dotSettings.cyOrig - (clientY - this.offsetTop)/dotSettings.SCALER ;
    newA = (clientY - this.offsetTop) / this.parentElement.parentElement.clientHeight;
  } else {
    if(clientY > inputY) { onUp(); return; }
    newY = dotSettings.cyOrigMax - dotSettings.cyOffset - (clientY - this.offsetTop)/dotSettings.SCALER;
    newA = 1 - (clientY - this.offsetTop) / this.parentElement.parentElement.clientHeight;
  }
  
  //update
  inputY = clientY;
  updateDot((clientX - this.offsetLeft), newY, newA, this.previousElementSibling.firstElementChild);
}

function onScrolling(e) {
  if(this.scrollTop === 0) {
    this.removeEventListener("scroll", onScrolling);
    quickFlash(true, this);
  } else if(this.scrollTop + this.clientHeight === this.scrollHeight) {  
    this.removeEventListener("scroll", onScrolling);
    dotSettings.cyOrigMax = (dotSettings.cyOrig * -1) + this.clientHeight;
    quickFlash(false);
  }
}

// Return hooks
return {
	hooks: {
		// App init hook
		appInit: handleAppInit,
		pageInit: function (pageData) {
			handleAppInit();
		},
	}
};  
  
}; 