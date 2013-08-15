
/**
 * Module dependencies
 */

var o = jQuery = require('jquery');
var iso = require('isotope');

/**
 * Expose `stream` component
 */

module.exports = Stream;

function Stream(){
  if (!(this instanceof Stream)) return new Stream();
  this.els = {
    filters: []
  };
};

/**
 * Isotope stuff
 *
 * @param {Object} options
 * @api private
 */

Stream.prototype.isotope = function(options){
  // Options
  options = options || {};
  this.els = {
    container: o('.isotope-container'),
    filters: this.els.filters
  };

  this.item = {
    width: options.width || 240,
    height: options.height || 240,
    classname: options.classname || 'item'
  };

  this.items = {};

  var item_selector = '.' + this.item.classname;

  // Init Isotope
  this.els.container.isotope({
    itemSelector : item_selector,
    masonry: {
      columnWidth: this.item.width
    },
    getSortData : {
      menu_order : function ( el ) {
        return parseFloat( el.data('order') + el.data('date'));
      },
    },
    sortBy : 'menu_order',
    sortAscending : false
  });
};

/**
 * Refresh the layout
 *
 * @param {Function} fn (optional)
 *
 * @api public
 */

Stream.prototype.relayout = function(fn){
  this.els.container.isotope('reLayout', fn || function(){});
};


Stream.prototype.filter = function(selector, fn){
  fn = fn || function(){};

  var fls = '*'; 
  if(selector != '' ){
    var index = o.inArray(selector, this.els.filters);
    if( index == -1 ){ 
      this.els.filters.push( selector );
      o('#filters_menus .'+selector).addClass('current');
    }
    else { 
      this.els.filters.splice(index, 1); 
      o('#filters_menus .'+selector).removeClass('current');
    }
    if (this.els.filters.length > 0) { fls = '.' +  this.els.filters.join(', .');}
  } else {
    this.els.filters.length = 0;
    o('#filters_menus li').removeClass('current');
  }
  this.els.container.isotope({ filter: fls });
};

Stream.prototype.insert = function(data, fn){
  fn = fn || function(){};
  var newitems = o(data);
  this.els.container.isotope('insert', newitems);
};
