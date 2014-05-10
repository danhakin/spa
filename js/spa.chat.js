/*
 * spa.chat.js
 * Chat feature module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true
*/
/*global $, spa */

spa.chat = (function () {
    var configMap = {
            main_html : String()
                + '<div style="padding: 1em; color: #fff;">'
                +   'Say hello to chat'
                + '</div>',
            settable_map : {}
        },
        stateMap  = { $container : null },
        jqueryMap = {},
        setJqueryMap,
        configModule, 
        initModule;
    
    /*** DOM methods ***/
    
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container : $container };
    };
    
    /*** Public methods ***/
    
    /**    
     * Adjust configuration to allowed keys
     * @param object input_map A map of settable keys and values
     *      * color_name - color to use
     * Settings : 
     *      * configMap.settable_map declares allowed keys
     * @returns true
     */
    configModule = function ( input_map ) {
        spa.util.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            configMap    : configMap
        });
        return true;
    };
    
    initModule = function ( $container ) {
        $container.html( configMap.main_html );
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };
    
    return {
        configModule : configModule,
        initModule : initModule
    };
    
}());