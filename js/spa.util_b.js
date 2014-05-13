/*
 * spa.util_b.js
 * Javascript browser utilities
*/

/*jslint         browser : true, continue : true,
  devel  : true,  indent : 2,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.util_b = ( function () { 
    'use strict';
    
    /*** Module scope variables ***/
    
    var configMap = {
            regex_encode_html  : /[&"'><]/g,
            regex_encode_noamp : /["'><]/g,
            html_encode_map    : {
                '&' : '&#38',
                '"' : '&#34',
                "'" : '&#39',
                '>' : '&#62',
                '<' : '&#60'
            }
        },
        decodeHtml, 
        encodeHtml,
        getEmSize;
    
    // create modified copy of the configuration to encode entities
    configMap.encode_noaamp_map = $.extend({}, configMap.html_encode_map);
    // remove the ampersand
    delete configMap.encode_noaamp_map['&'];
    
    /*** Utility methods ***/
    
    
    /**    
     * Decodes HTML entities in a browser-friendly way
     * See http://stackoverflow.com/questions/1912501/\ 
     * unescape-html-entities-in-javascript
     * @param {string} input_arg_str string to decode    
     * @param {boolean} exclude_amp true to exclude ampersand    
     */
    decodeHtml = function ( input_arg_str, exclude_amp ) {
        var input_str = String( input_arg_str ),
            regex, 
            lookup_map;
        
        if ( exclude_amp ) {
            lookup_map = configMap.encode_noaamp_map;
            regex      = configMap.regex_encode_noamp;
        } else {
            lookup_map = configMap.html_encode_map;
            regex      = configMap.regex_encode_html;
        }
        
        return input_str.replace( regex,
            function ( match, name ) {
                return lookup_map[match] || '';
            }
        );
    };
    
    
    /**    
     * return size of ems in pixels    
     * @param {object} elem Element to measure    
     * @returns {int} Size of an elem em in pixels    
     */
    getEmSize = function ( elem ) {
        return Number(
            getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
        );
        
    };
    
    return {
        decodeHtml : decodeHtml,
        encodeHtml : encodeHtml,
        getEmSize  : getEmSize
    };
    
}() );