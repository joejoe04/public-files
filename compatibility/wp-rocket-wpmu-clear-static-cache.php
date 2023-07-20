<?php
	/**
	 * Plugin Name: WP-Rocket-clear-static-cache
	 * Description: Clears the WPMU static cache when changes are made to posts and when WP-Rocket clears cache.
	 * Version:     0.1
	 *
	 * @package  clear-static-cache
	 * @license    GPLv2 or later
	 */

add_action( 'after_rocket_clean_post', 'wpmu_wp_rocket_static_cache_clear' );
add_action( 'after_rocket_clean_domain', 'wpmu_wp_rocket_static_cache_clear' );

/**
 * Function wpmu_wp_rocket_static_cache_clear
 *
 * This function clears the WPMUDev static cache when WP Rocket hooks after_rocket_clean_post and
 * after_rocket_clean_domain trigger.
 * If WPMUDev's static cache is not cleared, users of the site will not see the changes on static pages until
 * the next time the static cache is cleared.
 *
 * @return void
 */
function wpmu_wp_rocket_static_cache_clear() {
	wpmudev_hosting_purge_static_cache();
}

