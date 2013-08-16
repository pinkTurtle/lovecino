
<?php
/**
 * The Header for our theme.
 *
 * @package WordPress
 * @subpackage Lo_Vecino_Theme
 * @since Twenty Thirteen 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?> class="csstransforms">
<!--<![endif]-->
  <head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width">
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>" />
    <script src="<?php echo get_template_directory_uri(); ?>/js/main.js" type="text/javascript"></script>
  </head>

  <body class="initial-page component">
    <div id="main" class="site-main">
    </div>

    <button class="cn-button" id="cn-button">Menu</button>
    <div class="cn-wrapper" id="cn-wrapper">
      <ul>
        <li><a href="#"><span>About</span></a></li>
        <li><a href="#"><span>Tutorials</span></a></li>
        <li><a href="#"><span>Articles</span></a></li>
        <li><a href="#"><span>Snippets</span></a></li>
        <li><a href="#"><span>Plugins</span></a></li>
        <li><a href="#"><span>Contact</span></a></li>
        <li><a href="#"><span>Follow</span></a></li>
       </ul>
    </div>

  <script>require('main');</script>
  </body>
</html>
