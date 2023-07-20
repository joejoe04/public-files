<?php
require( 'wp-load.php' ); // place this file at the website's root near wp-config.php
var_dump( wp_remote_get( 'https://wp-rocket.me/' ) );
 
//if it times out too fast use this
//var_dump( wp_remote_get( 'https://wp-rocket.me/', array( 'timeout' => 45 ) ) );