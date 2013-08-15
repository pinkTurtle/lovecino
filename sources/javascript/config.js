
/**
 * Module dependencies
 */

var o = jQuery = require('jquery');

var envs = {
  production: {
    basedir: '',
    async_url: '/wp-admin/admin-ajax.php'
  },

  stage: {
    basedir: '/~cubhub',
    async_url: '/~cubhub/wp-admin/admin-ajax.php'
  },

  development: {
    basedir: '/cubhub',
    async_url: '/cubhub/wp-admin/admin-ajax.php'
  }
}

// detect current hostname
var host = o('body').data('server');

/**
 * Export config module
 */

module.exports = function (){
  var env;

  switch(host) {
    case 'localhost':
      env = 'development';
      break;
    case '67.222.18.91':
      env = 'stage';
      break;
    default:
      env = 'production';
  }

  envs.env = env;

  return envs[env];
}
