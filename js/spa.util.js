/*
 * spa.chat.js
 * General Javascript utilities
 * 
 * Michael S. Mikowski - mmikowski at gmail dot com 
 * These are routines I have created, compiled, and updated 
 * since 1998, with inspiration from around the web. 
 * 
 * MIT License
 *
*/

/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true
*/
/*global $, spa */

spa.util = (function () {
    var makeError, setConfigMap;
    
    
    /**    
     * Convenience wrapper to create an error object
     * @param {string} name_text the error name    
     * @param {string} msg_text long error message    
     * @param {string} data optional data attached to error object    
     * @returns {object} error object    
     */
    makeError = function( name_text, msg_text, data ) {
        var error = new Error();
        
        error.name = name_text;
        error.message = msg_text;
        
        if ( data ) { error.data = data; }
        
        return error;
    };
    
    
    /**    
     * Common code to set configs in feature modules    
     * @param {object} arg_map Settings map
     *      keys:
     *          input_map    - map of kv to set in config
     *          settable_map - map of allowable keys to set
     *          config map   - map to apply settings to
     */
    setConfigMap = function ( arg_map ) {
        var input_map    = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map   = arg_map.config_map,
            key_name,
            error;
        
        for ( key_name in input_map ) {
            if ( input_map.hasOwnProperty( key_name ) ) {
                if ( settable_map.hasOwnProperty( key_name ) ) {
                    config_map[key_name] = input_map[key_name];
                }
                else {
                    error = makeError( 'Bad Input', 
                        'Setting config key |' + key_name + '| is not supported');
                    throw error;
                }
            }
        }
        
    };
    
    return {
        makeError    : makeError,
        setConfigMap : setConfigMap
    };
    
    
}());