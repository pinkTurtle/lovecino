
/**
 * Module dependencies
 */

var o = require('jquery');
var routing = require('./routing');

/**
 * Init routing client-side
 */

routing();

initCircularMenu();

function initCircularMenu(){
  var button = o('.cn-button');
  var wrapper = o('.cn-wrapper');
  var overlay = o('.cn-overlay');

  var open = false;
  button.on('click', handler);
  wrapper.on('click',function(e){
    e.stopPropagation();
  });

  function handler(e){
    if (!e) var e = window.event;
    e.stopPropagation();//so that it doesn't trigger click event on document

    if(!open) {
      openNav();
    }
    else {
      closeNav();
    }
  }

  function openNav(){
    open = true;
    button.html('-');
    overlay.addClass('on-overlay');
    wrapper.addClass('opened-nav');
  }

  function closeNav(){
    open = false;
    button.html('+');
    overlay.removeClass('on-overlay');
    wrapper.removeClass('opened-nav');
  }

  document.addEventListener('click', closeNav);
}
