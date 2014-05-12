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
/*global $, spa, getComputedStyle */

spa.chat = (function () {
    var configMap = {
            main_html : String()
                + '<div class="spa-chat">' 
                    + '<div class="spa-chat-head">'
                        + '<div class="spa-chat-head-toggle">+</div>' 
                        + '<div class="spa-chat-head-title">'
                            + 'Chat' 
                        + '</div>'
                    + '</div>' 
                    + '<div class="spa-chat-closer">x</div>' 
                    + '<div class="spa-chat-sizer">'
                        + '<div class="spa-chat-msgs"></div>' 
                        + '<div class="spa-chat-box">'
                            + '<input type="text"/>'
                            + '<div>send</div>' 
                        + '</div>'
                    + '</div>'
                + '</div>',
            settable_map : {
                slider_open_time    : true,
                slider_close_time   : true,
                slider_opened_em    : true,
                slider_closed_em    : true,
                slider_opened_title : true,
                slider_closed_title : true,
                chat_model          : true,
                people_model        : true,
                set_chat_anchor     : true
            },
            slider_open_time     : 250,
            slider_close_time    : 250,
            slider_opened_em     : 18,
            slider_closed_em     : 2,
            slider_opened_min_em : 10,
            window_height_min_em : 20,
            slider_opened_title : 'Click to close',
            slider_closed_title : 'Click to open',
            chat_model      : null,
            people_model    : null,
            set_chat_anchor : null
        },
        stateMap  = {
            $append_target   : null,
            position_type    : 'closed',
            px_per_em        : 0,
            slider_hidden_px : 0,
            slider_closed_px : 0,
            slider_opened_px : 0
        },
        jqueryMap = {},
        setJqueryMap,
        getEmSize,
        setPxSizes,
        setSliderPosition,
        onClickToogle,
        configModule, 
        initModule,
        removeSlider,
        handleResize;
    
    /*** Utility methods ***/
    
    
    /**    
     * Convert the em display unit to pixels so we can use 
     * measurements in jQuery.
     * @param {object} elem the element to calculate size    
     * @returns {int} Number of pixels for the given element    
     */
    getEmSize = function ( elem ) {
        return Number(
            getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    
    /*** DOM methods ***/
    
    setJqueryMap = function () {
        var $append_target = stateMap.$append_target,
            $slider = $append_target.find( '.spa-chat' );
        
        jqueryMap = {
            $slider : $slider,
            $head   : $slider.find( '.spa-chat-head' ),
            $toggle : $slider.find( '.spa-chat-head-toggle' ),
            $title  : $slider.find( '.spa-chat-head-title' ),
            $sizer  : $slider.find( '.spa-chat-sizer' ),
            $msgs   : $slider.find( '.spa-chat-msgs' ),
            $box    : $slider.find( '.spa-chat-box' ),
            $input  : $slider.find( '.spa-chat-input input[type=text]' )
        };
    };
    
    
    /**    
     * Calculates the pixel sizes for elements managed by this module    
     */
    setPxSizes = function () {
        var px_per_em,
            opened_height_em,
            window_height_em;
        
        px_per_em = getEmSize( jqueryMap.$slider.get(0) );
        window_height_em = Math.floor(
            ( $(window).height() / px_per_em ) + 0.5
        );
        
        opened_height_em = 
            window_height_em > configMap.window_height_min_em
            ? configMap.slider_opened_em
            : configMap.slider_opened_min_em;
        
        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
        stateMap.slider_opened_px = opened_height_em * px_per_em;
        
        jqueryMap.$sizer.css({
            height : ( opened_height_em - 2 ) * px_per_em
        });
    };
    
    
    
    /**    
     * Move the chat slider to the requested position
     * Example: spa.chat.setSliderPosition( 'closed' );
     *
     * @param {string} position_type enum('closed', 'opened', or 'hidden')
     * @param {function} callback optional callback to be run at the end of
     *      slider animation. The callback receives a jQuery collection
     *      representing the slider div as its single argument.
     * @returns {boolean} true - requested position was achieved
     *                    false - requested position was not achieved
     */
    setSliderPosition = function ( position_type, callback ) {
        var height_px,
            animate_time,
            slider_title, 
            toogle_text;
        
        if ( stateMap.position_type === position_type ) {
            return true;
        }
        
        // prepare animate parameters 
        switch ( position_type ) {
            case 'opened' : 
                height_px = stateMap.slider_opened_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_opened_title;
                toogle_text = '=';
            break;
                
            case 'hidden' :
                height_px = 0;
                animate_time = configMap.slider_open_time;
                slider_title = '';
                toogle_text = '+';
            break;
                
            case 'closed' :
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toogle_text = '+';
            break;
            
            default: return false;
                
        }
        
        // animate slider position change
        stateMap.position_type = '';
        jqueryMap.$slider.animate(
            { height : height_px },
            animate_time,
            function () {
                jqueryMap.$toggle.prop( 'title', slider_title );
                jqueryMap.$toggle.text( toogle_text );
                stateMap.position_type = position_type;
                if ( callback ) { callback( jqueryMap.$slider ); }
            }
        );
        
        return true;
    };
    
    /*** Event handlers ***/
    
    onClickToogle = function ( event ) {
        var set_chat_anchor = configMap.set_chat_anchor;
        
        if ( stateMap.position_type === 'opened' ) {
            set_chat_anchor( 'closed' );
        }
        else if ( stateMap.position_type === 'closed' ) {
            set_chat_anchor( 'opened' );
        }
        return false;
    };
    
    /*** Public methods ***/
    
    /**    
     * Configure the module prior to initialization
     * Example: spa.chat.configModule( { slider_open_em : 18 } );
     *
     * @param object input_map A map of settable keys and values
     *      * set_chat_anchor - a callback to modify the URI anchor to indicate
     *          opened or closed state. This callback must return false if the
     *          requested state cannot be met.
     *      * chat_model - the chat model object provides methods to interact
     *          with our instant messaging
     *      * people_model - the people model object provides methods to manage
     *          the list of people the model mantains.
     *      * slider_* - settings. All these are optional scalars.
     *          See mapConfig.settable_map for a full list.
     * @returns true
     * @throws Javascript error object and stack trace on unacceptable or missing
     *         arguments
     */
    configModule = function ( input_map ) {
        spa.util.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            config_map   : configMap
        });
        return true;
    };
    
    
    /**    
     * Directs chat to offer its capability to the user
     * @param {object} $append_target A jQuery collection that should represent
     *      a single DOM container
     * @returns {boolean} true on success, false on failure
     */
    initModule = function ( $append_target ) {
        $append_target.append( configMap.main_html );
        stateMap.$append_target = $append_target;
        setJqueryMap();
        setPxSizes();
        
        // initializes chat slider to default title and state
        jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
        jqueryMap.$head.click( onClickToogle );
        stateMap.position_type = 'closed';
        
        return true;
    };
    
    
    /**    
     * Removes chatSlider DOM element
     *  Reverts to initial state
     *  Removes pointers to callbacks and other data
     */
    removeSlider = function () {
        // unwind initialization and state
        // remove DOM container; this removes event bindings too
        if ( jqueryMap.$slider ) {
            jqueryMap.$slider.remove();
            jqueryMap = {};
        }
        stateMap.$append_target = null;
        stateMap.position_type  = 'closed';
        
        // unwind key configurations
        configMap.chat_model      = null;
        configMap.people_model    = null;
        configMap.set_chat_anchor = null;
        
        return true;
    };
    
    
    /**    
     * Given a window resize event, adjust the presentation
     * provided by this module if needed.
     * @returns {boolean} false resize no considered, true resize considered    
     */
    handleResize = function () {
        // do not do anything if we don't have a slider container
        if ( ! jqueryMap.$slider ) { return false; }
        
        setPxSizes();
        if ( stateMap.position_type === 'opened' ) {
            jqueryMap.$slider.css({ height: stateMap.slider_opened_px });
        }
        return true;
    };
    
    return {
        setSliderPosition : setSliderPosition,
        configModule      : configModule,
        initModule        : initModule,
        removeSlider      : removeSlider,
        handleResize      : handleResize
    };
    
}());