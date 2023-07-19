<?php

require( 'wp-load.php' );

// Clear Used CSS
function wpr_clear_unused_css() {
  if ( defined( 'WP_ROCKET_VERSION' ) ) {
    // access rocket's injection container
    $container = apply_filters( 'rocket_container', null );
    // get the rucss subscriber from the container
    $subscriber = $container->get( 'rucss_admin_subscriber' );
    // call the truncate method.
    $subscriber->truncate_used_css();
  }

  // clear domain cache
  if ( function_exists( 'rocket_clean_domain' ) ) {
    rocket_clean_domain();
  }

  // Clear minified CSS and JavaScript files.
  if ( function_exists( 'rocket_clean_minify' ) ) {
    rocket_clean_minify();
  }
}

wpr_clear_unused_css();