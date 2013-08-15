
/**
 * Module dependecies
 */
var o = jQuery = require('jquery');
var page = require('page');
var qs = require('querystring');
var conf = require('./config')();
var Stream = require('./stream');
var Request = require('./request')();
var debug = require('debug')('ch:Routing');
var commander = Stream();
/**
 * Expose 'routing' component
 */

module.exports = Routing;

function Routing(){
  page.base(conf.basedir);
  page('*', parse );
  page('/', isoload); 
  page('/tag/:tag',  isoload );
  page('/category/:category',   isoload );
  page('/source/:source', isoload );
  page('/rank/:rank',  isoload );
  page('/resources/:view?/:filter?',  resourceload);
  page('/:post',  postload );
  page('/:page',  pageload );  
  page();
}

function parse(ctx, next) {
  debug('parse: ' + ctx.path);
  ctx.query = qs.parse(ctx.querystring);
  
  next();
}

function initialload(ctx, next){ 
  if(ctx.init) {
    commander.isotope(); 
    debug('initial load: ' + ctx.path );
  }
  else next(); 
}
function setcurrentmenu(ctx){
  var slug = ctx.params.page ? ctx.params.page : 'menu-item-home';
  var currentmenu = o('#menu-main-menu .current-menu-item');
  if( !currentmenu.hasClass(slug) ) {
    currentmenu.removeClass('current-menu-item');
    o('#menu-main-menu .' + slug).addClass('current-menu-item');
  }
}
/**
 * isoload
 */
function isoload(ctx, next){

  debug('isotope load: ' + ctx.path );
 
   if(filter == ''  ) { 
      ctx.state.filter = '';
      ctx.save();
   }
    else{
      if(ctx.state.filter)
        ctx.state.filter += '.' + filter;
      else 
        ctx.state.filter = '.' + filter;
      ctx.save();
    }

  setcurrentmenu(ctx);
  commander.isotope(); 
  var curtype = o('#primary').data('type');
  var items = o('.item');
  var postids = [];
  o.each(items, function(i,v){
    postids.push(o(v).data('post'));
  })
  if(postids.length > 0){
    Request.postgridload(ctx.canonicalPath, postids, function(res){
    if(res.length > 2)
      commander.insert(res);
    });
    var filter = ctx.params.source ? ctx.params.source : 
      ctx.params.rank ? ctx.params.rank : 
      ctx.params.tag ? ctx.params.tag : 
      ctx.params.category ? ctx.params.category : '';

    commander.filter(filter); 
  } else
    Request.load(ctx.canonicalPath, function(){
      var type = o('#primary').data('type');
      setTimeout(commander.isotope(), 1000); 
      next();
    });
}
/**
 * resource load
 */
function resourceload(ctx, next){
  ctx.params.page  = 'resources';
  setcurrentmenu(ctx);
  if(ctx.query.view) {
    var rcontent = o('.resources_subcontent');
    if(!rcontent.hasClass(ctx.query.view + '_view')){ 
      var otherview = ctx.query.view == 'grid' ? 'list_view' : 'grid_view';
      rcontent.removeClass(otherview);
      rcontent.addClass(ctx.query.view + '_view');
    }
  }
  else
    Request.load(ctx.canonicalPath);

  debug('resource load: ' + ctx.path );
}
/**
 * pageload
 */
function pageload(ctx, next){
  debug('page load: ' + ctx.path );
  console.log('-> ctx -> ', ctx);
  setcurrentmenu(ctx);
  Request.load(ctx.canonicalPath);
}
/**
 * post load
 */
function postload(ctx, next){
  debug('post load: ' + ctx.path );
  Request.itemload( ctx.canonicalPath,
    function(nextto){
      if( nextto ){ 
        setcurrentmenu(ctx);
        commander.relayout();
      }
      else
        next();
    });
}
