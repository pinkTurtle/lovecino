
/**
 * Module dependecies
 */

var o = jQuery = require('jquery');
var page = require('page');
var qs = require('querystring');
var conf = require('./config')();
var debug = require('debug')('love:Routing');

/**
 * Expose 'routing' component
 */

module.exports = Routing;

function Routing(){
  page.base('/lovecino');
  page('*', parse );
  page('/', home); 
}

/**
 * Parse the ctx.querystring into a object
 */

function parse(ctx, next) {
  debug('parse: ' + ctx.path);
  ctx.query = qs.parse(ctx.querystring);

  next();
}

function home(ctx, next){ 
  console.log('-> ctx -> ', ctx);
}
