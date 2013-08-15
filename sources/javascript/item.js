
/**
 * Module dependencies
 */

var o = require('jquery');;
var inherit = require('inherit');
var config = require('./config');
var swipe = require('swipe');
var Emitter = require('emitter');
var debug = require('debug')('wtw:item');

/**
 * Expose `Item` component
 */

module.exports = Item;

function Item(el, home){
  if (!(this instanceof Item)) return new Item(el, home);
  Emitter.call(this);
  this.el = o(el);
  this.home = home;
  this.full = this.el.find('.full-description');
  this.isogallery = this.el.find('.iso-gallery-wrapper');

  this.retrieveData();
  this.addswipe();
  this.el.on('click','.close', this.close.bind(this));
  this.css3 = this.el.css('-webkit-transform');
  return this;
}

/**
 * Inherit from 'Emitter'
 */

inherit(Item, Emitter);

/**
 * Render the item element
 *
 * @api public
 */

Item.prototype.render = function(){
  return this.el;
};

/**
 * Open
 *
 * Emits:
 *
 *  'open'
 *  'item-open' in home instance
 *
 * @api public
 */

Item.prototype.open = function(){
  if (this.opened) return;
  debug('opened');

  this.el.addClass('opened-item');
  this.opened = true;
  this.height();
  
  var offsetY = this.el;
  setTimeout(function(){
    o('html, body, document').animate({
      scrollTop: o(offsetY).offset().top
    });
  }, 2000);

  this.home.emit('item-open', this);
  this.emit('open');
  
};

/**
 * Close item
 *
 * Emits:
 *
 *  'close'
 *  'items-open' in home instance
 *
 * @api public
 */

Item.prototype.close = function(){
  if (!this.opened) return;
  debug('close');
  var ch = this.home.item.height * ('2x2' == this.size ? 2 : 1);
  this.el.height(ch-5);
  //this.full.height(0);
  this.el.removeClass('opened-item');
  this.home.emit('item-close', self);
  this.emit('close');
  this.opened = false;
};

/**
 * Round item height
 */

Item.prototype.height = function(){
  var h = this.full.outerHeight();
  debug('full description height: %s', h);

  var item_h = this.home.item.height;
  debug('height: %s', item_h);

  var n = Math.floor(h / item_h);
  if (h % item_h) n++;
  debug('n: %s', n);

  var ch = this.home.item.height * ('2x2' == this.size ? 2 : 1);
  this.el.height(n * item_h + ch);
  this.full.height(n * item_h);
  debug('New full description height: %s', n * item_h);
};

/**
 * Retrieve data from markup
 */

Item.prototype.retrieveData = function() {
  this.size = this.el.data('size');
  this.id = this.el.data('post');
  this.slug = this.el.data('slug');

  this.home.items[this.id] = this;
};

/**
 * Set the html of full description
 *
 * @param {jQuery} html
 * @api private
 */

Item.prototype.description = function(html) {
  this.full = html;

  this.el
    .height('auto')
    .append(html);

  this.isogallery = this.el.find('.iso-gallery-wrapper');
  if (this.isogallery.length) {
    this.addswipe();
  }
};

/**
 * Add swipe to gallery
 */

Item.prototype.addswipe = function() {
  if (!(this.isogallery && this.isogallery.length)) return;
  this.swipe = swipe(this.isogallery.children().get(0))
                .duration(800)
                .interval(4000)
                .play();

  var self = this;
  this.isogallery.on('click', 'a', function(e){
    e.stopPropagation();
    self.swipe[o(this).hasClass('prev-gallery') ? 'prev' : 'next']();
  });
};

/**
 * Test if the item is empty
 *
 * @api public
 */

Item.prototype.isempty = function(){
  var isempty =  !(this.full && this.full.children().length);
  debug('is empty: `%s`', isempty);
  return isempty;
};

