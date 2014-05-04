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
                + '<div class="spa-shell-modal"></div>',
            chat_extend_time    : 1000,
            chat_retract_time   : 300,
            chat_extend_height  : 450,
            chat_retract_height : 15
        },
        stateMap = { $container: null },
        jqueryMap = {},
        setJQueryMap,
        toogleChat,
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
        
        jqueryMap = { 
            $container : $container,
            $chat      : $container.find( '.spa-shell-chat' )
        };
    };
    
    
    /**    
     * Extends or retract chat slider.    
     * @param boolean do_extend - if true, extends slider; if false retracts it     
     * @param function callback - optional function to execute at the end of 
     *  animation
     * @returns boolean
     *   true  - slider animation activated
     *   false - slider animation not activated
     */
    toogleChat = function ( do_extend, callback ) {
        var px_chat_ht = jqueryMap.$chat.height(),
            is_open    = px_chat_ht === configMap.chat_extend_height,
            is_closed  = px_chat_ht === configMap.chat_retract_height,
            is_sliding = !is_open && !is_closed;
        
        // avoid race condition 
        if ( is_sliding ) { return false; }
        
        // begin extend chat slider
        if ( do_extend ) {
            jqueryMap.$chat.animate( 
                { height : configMap.chat_extend_height },
                configMap.chat_extend_time,
                function () {
                    if ( callback ) { callback( jqueryMap.$chat ); }
                }
            );
            return true;
        }
        
        // begin retract chat slider
        jqueryMap.$chat.animate( 
            { height : configMap.chat_retract_height },
            configMap.chat_retract_time, 
            function () {
                if ( callback ) { callback( jqueryMap.$chat ); }
            }
        );
        return true;
    };
    
    /*** Event handlers ***/
    
    /*** Public methods ***/
    
    initModule = function ( $container ) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJQueryMap();
    };
    
    return { initModule : initModule };
        
}());
