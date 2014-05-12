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
            anchor_schema_map : {
                chat : { opened : true, closed : true }
            },
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
                + '<div class="spa-shell-modal"></div>',
            resize_interval : 200
        },
        stateMap  = { 
            $container        : null,
            anchor_map        : {},
            is_chat_retracted : true,
            resize_idto       : undefined
        },
        jqueryMap = {},
        copyAnchorMap,
        setJQueryMap,
        changeAnchorPart,
        onHashChange,
        onResize,
        setChatAnchor,
        initModule;
    
    /*** Utility methods ***/
    
    
    /**    
     * Returns copy of stored anchor map; minimizes overhead
     * 
     * remark: jQuery.extend function allows to copy an object
     */
    copyAnchorMap = function () {
        return $.extend( true, {}, stateMap.anchor_map );
    };
    
    /*** DOM methods ***/
    
    
    /**    
     * Changes part of the URI anchor component    
     * @param object arg_map The map describing what part of the URI anchor
     *        we want changed.
     * @returns boolean
     *      true  - URI's anchor was changed
     *      false - URI's anchor could not be updated
     */
    changeAnchorPart = function ( arg_map ) {
        var anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name,
            key_name_dep;
        
        // merge changes into anchor map
        KEYVAL:
        for ( key_name in arg_map ) {
            if ( arg_map.hasOwnProperty( key_name ) ) {
                
                // skip dependent keys during iteration
                if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }
                
                // update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                
                // update matching dependent key
                key_name_dep = '_' + key_name;
                if ( arg_map[key_name_dep] ) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        
        // attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor( anchor_map_revise );
        } 
        catch ( error ) {
            // replace URI with existing state
            $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
            bool_return = false;
        }
        
        return bool_return;
    };
    
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
            $container : $container
        };
    };
    
    /*** Event handlers ***/
    
    
    /**    
     * Handles the hashchange event 
     * @param object event jQuery event object
     * @returns false
     * Action :
     *    - Parses the URI anchor component
     *    - Compares proposed app state with current
     *    - Adjust the app only where proposed state differs from existing
     */
    onHashChange = function ( event ) {
        var anchor_map_previous = copyAnchorMap(),
            anchor_map_proposed,
            _s_chat_previous, 
            _s_chat_proposed,
            s_chat_proposed,
            is_ok = true;
        
        // attempt to parse anchor
        try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
        catch ( error ) {
            $.uriAnchor.setAnchor( anchor_map_previous, null, true );
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;
        
        // convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        
        // adjust chat component if changed
        if ( ! anchor_map_previous
            || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch ( s_chat_proposed ) {
                case 'opened' : 
                    is_ok = spa.chat.setSliderPosition( 'opened' );
                    break;
                case 'closed' :
                    is_ok = spa.chat.setSliderPosition( 'closed' );
                    break;
                default : 
                    spa.chat.setSliderPosition( 'closed' );
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
            }
        }
        
        // Begin revert anchor if slider change denied
        if ( ! is_ok ) {
            if ( anchor_map_previous ) {
                $.uriAnchor.setAnchor( anchor_map_previous, null, true );
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
            }
        }
        
        return false;
    };
    
    
    
    /**    
     * 
     * @returns {type} Description    
     */
    onResize = function () {
        if ( stateMap.resize_idto ) { return true; }
        
        spa.chat.handleResize();
        
        // ser a timeout function to reset resize_idto to undefined
        // every 200ms to allow handleResize to execute
        stateMap.resize_idto = setTimeout(
            function () { stateMap.resize_idto = undefined; },
            configMap.resize_interval
        );
        
        // returns true, to prevent jQuery from doing preventDefault or 
        // stopPropagation
        return true;
    };
    
    /*** Callback methods ***/
    
    
    /**    
     * Change the chat component of the anchor
     * @param {string} position_type may be 'closed' or 'opened'    
     * @returns {boolean} true - anchor part updated. 
     *                    false - anchor part not updated
     */
    setChatAnchor = function ( position_type ) {
        return changeAnchorPart( { chat : position_type } );
    };
    
    
    /*** Public methods ***/
    
    initModule = function ( $container ) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJQueryMap();
 
       // configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });        
        
        // configure and initialize feature modules
        spa.chat.configModule({
            set_chat_anchor : setChatAnchor,
            chat_model      : spa.model.chat,
            people_model    : spa.model.people
        });
        spa.chat.initModule( jqueryMap.$container );
        
        // Handle URI anchor change events
        // This is donde after all feature modules are configured
        // and initialized, otherwise they will not be ready to handle
        // the trigger event, which is used to ensure the anchor
        // is considered on-load
        $(window)
            .bind( 'resize', onResize )
            .bind( 'hashchange', onHashChange )
            .trigger( 'hashchange' );
    };
    
    return { initModule : initModule };
        
}());
