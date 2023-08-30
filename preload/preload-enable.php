<?php

require('wp-load.php');
define('WP_USE_THEMES', false);

// Enable Preload
$options = get_option('wp_rocket_settings', []);
$options['manual_preload'] = 1;
update_option('wp_rocket_settings', $options);