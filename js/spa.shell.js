/*
 * spa.shell.js
 * Shell module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true
*/
/*global $, spa */

spa.shell = (function () {
    
    /*** Module scope variables ***/
    
    var configMap = {
        main_html : String()
            + '<div class="spa-shell-head">'
                + '<div class="spa-shell-head-logo"></div>' 
                + '<div class="spa-shell-head-acct"></div>' 
                + '<div class="spa-shell-head-search"></div>'
            + '</div>' 
            + '<div class="spa-shell-main">'
                + '<div class="spa-shell-main-nav"></div>'
                + '<div class="spa-shell-main-content"></div>' 
            + '</div>' 
            + '<div class="spa-shell-foot"></div>' 
            + '<div class="spa-shell-chat"></div>' 
            + '<div class="spa-shell-modal"></div>'
        },
        stateMap = { $container: null },
        jqueryMap = {},
        setJQueryMap,
        initModule;
    
    /*** Utility methods ***/
    
    /*** DOM methods ***/
    
    
    /**    
     * Used to cache jQuery collections.
     * Should be almost in every shell module
     * The use of "jQueryMap" cache can greatly
     * reduce the jQuery document transversals
     * and improve performance
     */
    setJQueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container : $container };
    };
    
    /*** Event handlers ***/
    
    /*** Public methods ***/
    
    initModule = function ( $container ) {
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJQueryMap();
    };
    
    return { initModule : initModule };
        
}());