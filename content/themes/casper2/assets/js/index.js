/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();
        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});

    });

}(jQuery));
