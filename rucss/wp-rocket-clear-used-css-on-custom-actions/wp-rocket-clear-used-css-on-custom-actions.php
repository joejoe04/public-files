<?php
/**
 * Plugin Name: WP Rocket | Clear Used CSS on Custom Actions
 * Description: Clears Used CSS when specified actions occur.
 * Author:      WP Rocket Support Team
 * Author URI:  http://wp-rocket.me/
 * License:     GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Copyright SAS WP MEDIA 2023
 */

namespace public_files\rucss\clear_used_css_on_custom_actions;

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
// EDIT HERE:
// Change only the first parameter ('wp_insert_post' below for example) to the action you would like to trigger clearing of Used CSS. Add as many lines as needed to clear cache on multiple actions.
add_filter ( 'wp_insert_post', __NAMESPACE__ . '\wpr_clear_unused_css' );
// add_filter ( 'custom_action_1', __NAMESPACE__ . '\wpr_clear_unused_css' );