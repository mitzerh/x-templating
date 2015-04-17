var EventMessageHandler = (function(app){

    return (typeof EventMessageHandler === "undefined") ? app : EventMessageHandler;

}(

    (function(){

        var CONST = {};

        // stringify for IE 8 & 9
        CONST.stringify = (function(){

            var ver = false;

            if (navigator && navigator.appName === "Microsoft Internet Explorer") {
                var ua = navigator.userAgent,
                    re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");

                if (re.exec(ua) != null) {
                    ver = parseFloat( RegExp.$1 );
                }

                if (ver && ver <= 9) {
                    ver = true;
                }

            }
            
            return ver;
        }());

        var App = function() {

            var VARS = {},
                HANDLERS = {},
                MESSAGE_HANDLER;

            var Proto = this;

            // create handler
            MESSAGE_HANDLER = function(event) {

                var message = event.data,
                    hasErr = false;

                if (CONST.stringify) {

                    if (!window.JSON) {
                        log("[EventMessageHandler.send] Requires JSON");
                        return false;
                    }
                    
                    try {

                        message = JSON.parse(message);

                    } catch(err) {

                        log("[EventMessageHandler.send] error:");
                        log(err);
                        var hasErr = true;
                        
                    }
                    
                }

                if (!hasErr) {

                    log("[EventMessageHandler.receive]", message);

                    var type = (message && message.type) ? message.type : false,
                        data = (message && message.data) ? message.data : false;

                    // execute
                    if (type && data && HANDLERS[type] && typeof HANDLERS[type] === "function") {
                        HANDLERS[type](data);
                    }

                }
                
            };

            if (window.addEventListener) {
                window.addEventListener("message", MESSAGE_HANDLER, false);
            } else if (window.attachEvent) {
                window.attachEvent("onmessage", MESSAGE_HANDLER);
            }


            /**
             * @function addHandler
             *
             * @description
             * Adds and event handler
             *
             * @param {string} type - name of the handler
             * @param {function} callback - function to execute when the handler is called
             *
             */
            Proto.addHandler = function(type, callback) {
                if (typeof type !== "string") { return false; }
                HANDLERS[type] = callback;
            };

            /**
             * @function sendMessage
             *
             * @description
             * Sends a message event to the target element
             *
             * @param {string|DOM} element - the target element
             * @param {string} type - the name of the handler to execute on the target element
             * @param {string|object|boolean} data - data you can pass to the handler
             *
             * @example
             * Sending a message to the parent of an iframe, set element param to "parent":
             * sendMessage("parent", "hello", true)
             * &nbsp;
             * Sending a message to an iframe on the page:
             * var iframe = document.getElementById("my-iframe");
             * sendMessage(iframe, "hello", true);
             *
             */
            Proto.sendMessage = function(element, type, data) {

                if (typeof type !== "string") { return false; }
                
                var info = { type:type, data:data };

                if (CONST.stringify) {

                    if (!window.JSON) {
                        log("[EventMessageHandler.send] Requires JSON");
                        return false;
                    }

                    info = JSON.stringify(info);
                }

                if (element && typeof element === "string" && element === "parent") {
                    window.parent.postMessage(info, "*");
                    log("[EventMessageHandler.send]", info);
                } else if (element && typeof element === "string" && element === "self") {
                    window.postMessage(info, "*");
                } else if (element && element.contentWindow) {
                    try {
                        element.contentWindow.postMessage(info, "*");
                        log("[EventMessageHandler.send]", info);
                    } catch(err) {
                        // TODO: error message here
                    }
                }

            };

            // logger
            function log() {
                var loggerON = (window.location.search.indexOf("_log=1") > -1) ? true : false;
                if (loggerON && window.console) {
                    try {
                        return console.log.apply(console, arguments);
                    } catch(err) {
                        console.log(arguments);
                    }
                }
            }


        };
        
        return App;

    }())

));