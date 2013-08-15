/**
 * Module dependencies
 */

var o = jQuery = require('jquery');
var supera = require('superagent');

/**
 * Expose 'request' component
 */

module.exports = Request;

function Request(){
  if (!(this instanceof Request)) return new Request;
}

/**
 * load 
 */

Request.prototype.load = function(url, fn) {
  fn = fn || function(){};
  var el = o('#main');
  el.addClass('loading');
  el.empty();
  supera
  .get(url)
  .end(function(res){
    el.append(res.text); 
    el.removeClass('loading');
    fn(res);
  });
};

/**
 * item load 
 */

Request.prototype.itemload = function(url, fn) {
  fn = fn || function(){};
  supera
  .get(url)
  .end(function(res){
    var item = o(res.text);
    var postid = item.data('post');
    if ( postid ){
      var el = o( '#post-' + postid );
      el.addClass('loading');
      el.append(res.text); 
      el.addClass('opened-item');
      el.removeClass('loading');
      fn(true);
    } else {
      fn(false);
    } 
  });
};
/**
 * item load 
 */

Request.prototype.postgridload = function(url, ids, fn) {
  fn = fn || function(){};
  var strids = ids.join(',');
  supera
  .get(url)
  .query('postids=' + strids )
  .end(function(res){
    fn(res.text); 
   });
};

