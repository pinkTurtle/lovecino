
/**
 * Module dependencies
 */

var o = jQuery = require('jquery');
var inherit = require('inherit');
var Emitter = require('emitter');
var Dropdown = require ('dropdown');
var Item = require('./item');
var config = require('./config');
var isotope = require('isotope');
var infinitescroll = require('infinite-scroll');
var behaviors = require('./manual-trigger');
var debug = require('debug')('wtw:home');

/**
 * Expose `Home` constructor
 */

module.exports = Home;

/**
 * Home component
 *
 * @param {jQuery} el
 * @param {WTW} wtw
 * @api public
 */

function Home(el, wtw){
  if (!(this instanceof Home)) return new Home(wtw);
  Emitter.call(this);
  this.wtw = wtw;
  this.el = o(el);
  this.inited = false;
}

/**
 * Inherit from 'Emitter'
 */

inherit(Home, Emitter);

/**
 * Initialize about page
 */

Home.prototype.init = function(){
  debug('inited: %s', this.inited);
  if (this.inited) return this;
  debug('initing ...');

  this.currentitem = null;

  this.els = {
    container: this.el.find('#container'),
    dropdown: this.el.find('.tag-dropdown'),
    filterstatus: this.el.find('.filter-status'),
    categories: this.el.find('#nav ul.what')
  };

  // Isotope size control 
  var w = o(window).outerWidth();
  var itemW = w > 320 ? 209 : 155;
  var isoptions = {
    width: itemW,
    height: itemW
  }

  this.isotope(isoptions);
  this.infinitescroll(); 
  this.retrieveItems();
  this.dropdown();

  // handling events
  this.els.filterstatus.on('click', 'a', this.onclearfilter.bind(this));
  this.on('item-open', this.onitemopen.bind(this));
  this.on('item-close', this.onitemclose.bind(this));
  this.els.categories.on('click', 'li', this.onstreammenu.bind(this));

  this.inited = true;
  debug('inited');
}

/**
 * Focus to homepage
 * 
 * @param {String} path
 * @api public
 */

Home.prototype.focus = function(path, fn){
  fn = fn || function(){};
  if ('homepage' == this.wtw.currentpage && this.inited) return;
  debug('focus');
  this.wtw.mainload(this.el, path, function(){
    this.init();
    this.wtw.move('homepage');
    fn();
  }.bind(this));
}

/**
 * Set dims and position to do the swap animation
 */

Home.prototype.wrapped = function(){
  var w = o(window).width();
  this.el
    .width(w)
    .css('position', 'absolute')
    .css('width', w)
    .css('left', w)
    .css('top', 0);
}

/**
 * Rove the `style` attribute.
 * Basically reset wrapped status
 */

Home.prototype.unwrapped = function() {
  this.el.removeAttr('style');
};

/**
 * Show
 */

Home.prototype.show = function() {
  this.el.show();
};

/**
 * Hide
 */

Home.prototype.hide = function() {
  this.el.hide();
};

/**
 * Isotope stuff
 *
 * @param {Object} options
 * @api private
 */

Home.prototype.isotope = function(options){
  var self = this;

  // Options
  options = options || {};

  this.item = {
    width: options.width || 209,
    height: options.height || 209,
    classname: options.classname || 'item'
  };

  debug('isotope -> w: %s, h: %s', this.item.width, this.item.height);

  this.items = {};

  var item_selector = '.' + this.item.classname;

  // Init Isotope
  this.els.container.isotope({
    itemSelector : item_selector,
    masonry: {
      columnWidth: this.item.width,
      rowHeight: this.item.height
    }
  });
};

/**
 * Infinite Scroll
 * *
 * @api public
*
*/


Home.prototype.infinitescroll = function(){
   var container = this.els.container
   var self = this;
   container.infinitescroll({
    navSelector  : ".alignright a",            
    nextSelector : ".alignright a",    
    itemSelector : ".item",          
    behavior : "twitter",
    loading: {
      finishedMsg: 'No more pages to load.',
      img: 'http://i.imgur.com/qkKy8.gif'
    }
  },
  function( newElements ) {
    container.isotope( 'appended', o( newElements ) ); 
    o.each( o( newElements ),function(i, e){
      Item(e, self);
    });
  });
  o(window).unbind('.infscr');
  o(".alignright").on('click','a',function(){
    o(document).trigger('retrieve');
    return false;
  });
  // remove the paginator when we're done.
  o(document).ajaxError(function(e,xhr,opt){
    if (xhr.status == 404) o(".alignright a").remove();
  });
}


/**
 * Retrieve initial items from the html markup
 *
 * @api public
 */

Home.prototype.retrieveItems = function(){
  var self = this;
  o.each(this.els.container.find('.item'), function(i, e){
    Item(e, self);
  });
};

/**
 * Retrieve an item by id
 * from this.iso.items cache object.
 *
 * @return {Item}
 */

Home.prototype.getItemById = function(html) {
  return this.items[html.data('post')];
};


/**
 * Dropdown tags
 *
 * @api public
 */

Home.prototype.dropdown = function(){
  var tags = this.els.dropdown.data('tags');
  var self = this;

  // get dropdown items form markup
  var items = tags.map(function(e){
    return [e.slug, e.name, function(){
      var url = 'ALL' == e.name ? '/' : '/tag/' + e.slug + '/';
      if (!self.wtw.unsupported) {
        self.wtw.go(url);
      } else {
        if(e.name == 'ALL')
        var postname = url.replace(/\//g, '').substr(3);
        console.debug('postname -> ', postname);
        self.wtw.go_tag(url, postname);
      }
    }];
  });

  var target = this.els.dropdown;
  var dd = this._dropdown = Dropdown(target, {
    items: items,
    classname: 'dropdown-tags',
    menu: true,
    selectable: true
  });

  target.on('mousedown', function(e){
    var hasopened = target.hasClass('opened');
    setTimeout(function(){
      if (hasopened) dd.hide();
    }, 100);
  });
};

/**
 * Stream main menu
 *
 * @param {Object} ev event
 * @param {jQuery} el element
 * @api private
 */

Home.prototype.onstreammenu = function(e){
  if (this.wtw.unsupported) return;

  var el = o(e.target).closest('li');

  // remove the current filter
  if (el.hasClass('current')) {
    el.removeClass('current');
    return this.wtw.go('/');
  }

  this.wtw.go('/category/' + o(el).data('type') + '/');
};

/**
 * Bind `item-open`
 *
 * @param {Item} item
 *
 * @api private
 */

Home.prototype.onitemopen = function(item){
  if (this.currentitem) {
    this.currentitem.close();
  }

  this.currentitem = item;
  this.relayout();
};

/**
 * Bind `item-close`
 *
 * @param {Item} item
 *
 * @api private
 */

Home.prototype.onitemclose = function(item){
  /*if (this.currentitem) {
    this.currentitem.close();
  }*/

  this.currentitem = item;
  this.relayout();
};

/**
 * Refresh the layout
 *
 * @param {Function} fn (optional)
 *
 * @api public
 */

Home.prototype.relayout = function(fn){
  this.els.container.isotope('reLayout', fn || function(){});
};

/**
 * Print the filter status
 *
 * @param {String} text
 * @api private
 */

Home.prototype.filterstatus = function(text) {
  var text_status = 'Filtered by "<span>' + text + '</span>"';
  this.els.filterstatus.html(text_status + ' - ' + ' <a href="#">clear</a>');
};

/**
 * Set current filter
 *
 * @param {String} filter
 * @api private
 */

Home.prototype.setFilter = function(filter) {
  this.currentfilter = filter ? '.' + filter : '';
};

/**
 * Add Isotope filter
 *
 * Emit 'filter' event
 *
 * @param {String} filter
 * @param {String} text
 *
 * @api public
 */

Home.prototype.filter = function(filter, text){
  // Remove prevous filters
  this.setFilter(filter);
  this.filterstatus(text);

  this.els.container.isotope({ filter: this.currentfilter });
  this.emit('filter', this.currentfilter);
};

Home.prototype.filterByCategory = function(slug, text) {
  this.els.categories.find('li').removeClass('current');
  this.els.categories.find('li.' + slug).addClass('current');
  this.filter('category-' + slug, text);
};

/**
 * Bind click event to clear filter link
 *
 * @api private
 */

Home.prototype.onclearfilter = function(e){
  e.preventDefault();
  this.removeFilter();
  this.wtw.go('/blog');
};

/**
 * Remove Isotope filter
 *
 * @api public
 */

Home.prototype.removeFilter = function(){
  if (!this.els) return;

  debug('removing filter');
  this.setFilter();
  this.els.filterstatus.text('');
  this.els.categories.find('li').removeClass('current');
  o('body ul.dropdown-tags li.current').removeClass('current');

  this.els.container.isotope({ filter: this.currentfilter });
  this.emit('remove-filter', this.currentfilter);
}

/**
 * Open the first item
 */

Home.prototype.openTheFirst = function() {
  if ('homepage' != this.wtw.currentpage) return;
  var first = this.els.container.find('.item:first-child').attr('id').substr(5);
  var item = this.items[first];
  this.wtw.once('fbc-render', function(e){
    item.open();
  });
};

/**
 * Load a post and print the response into the item box
 *
 * @param {String} slug
 * @api private
 */

Home.prototype.load = function(slug) {
  var item = this.getItemBySlug(slug);
  if (item.loading || item.opened) return;

  item.loading = true;

  if (item.isempty()) {
    this.wtw.request({ postname: slug }, 'load_post', function(res){
      if (res.ok) {
        var html = o(res.text);
        item.description(html);
        parse();
      }
    });
  } else {
    item.full.height('auto');
    parse(); 
  }

  function parse(){
    if (!addthis) return;
    setTimeout(function(){
      addthis.toolbox(".addthis_toolbox");
      FB.XFBML.parse(item.el.get(0), function(){
        item.open();
        item.el.find('.fb-comments span').css('height', '100%');
        item.loading = false;
      });
    }, 1000);
  }
};

/**
 * Get an Item through ofgiven slug
 *
 * @api public
 */

Home.prototype.getItemBySlug = function(slug){
  debug('get item by `%s` slug', slug);
  var el = this.el.find('.item[data-slug=' + slug + ']');

  var id = el.data('post');

  debug('post item found: `%s`', id);
  return this.items ? this.items[id] : null;
};
