/**
* x-templating v0.1.0 | 2015-04-17
* Cross domain html templating
* by Helcon Mabesa
* MIT license http://opensource.org/licenses/MIT
**/

(function(app){

    window.x_templating = app;

}(

    (function($, DomReady, EventMessageHandler){

        var scripts = document.getElementsByTagName("script"),
            src = null;

        // get the embed script source path
        // to determine the domain to use
        for (var i = 0; i < scripts.length; i++) {
            var attr = scripts[i].getAttribute("src") || "";
            if (attr.indexOf("/xtpl.embed.js") > -1) {
                src = attr;
                break;
            }
        }

        if (!src) { return false; }

        var path = src.replace("/xtpl.embed.js", "/assets"),
            ifrId = "x-templating-ifr",
            ifrSrc = path +  "/frame.html";

        // embed iframe
        // use jQuery if it's available
        if ($) {
            $(document).ready(function(){
                $("body").append('<iframe id="'+ifrId+'" src="'+ifrSrc+'" frameborder="0" width="1" height="1" style="display: none !important; width: 1px; height: 1px;" ></iframe>');
            });
        } else {
            DomReady(function(){
                var ifr = document.createElement("iframe");
                ifr.setAttribute("id", ifrId);
                ifr.setAttribute("src", ifrSrc);
                ifr.frameborder = 0;
                ifr.style.display = "none";
                ifr.style.width = "1px";
                ifr.style.height = "1px";
                (document.getElementsByTagName("body"))[0].appendChild(ifr);
            });
        }

        var OnReady = function(execFN) {
            if ($) {
                $(document).ready(function(){
                    execFN();
                });
            } else {
                DomReady(function(){
                    execFN();
                });
            }
        };

        var App = function() {

            this.VERSION = "0.1.0";
        };

        /**
         * @function get
         *
         * @description
         * load template
         *
         * @param  {String}   template  template path
         * @param  {Function} callback  callback funciton
         */
        App.prototype.get = function(template, callback) {
            var tplId = "get-template|" + template;

            EventMessageHandler.addHandler(tplId, function(evt, data){
                callback(data);
            });

            OnReady(function(){
                EventMessageHandler.sendMessage(document.getElementById(ifrId), tplId, { id: tplId, template: template });
            });
        };

        return (new App());

    }(
        window.jQuery || null,

        (function(){
            var domready=function(a){function b(a){for(n=1;a=d.shift();)a()}var c,d=[],e=!1,f=document,g=f.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l="readyState",m=h?/^loaded|^c/:/^loaded|c/,n=m.test(f[l]);return f[j]&&f[j](i,c=function(){f.removeEventListener(i,c,e),b()},e),h&&f.attachEvent(k,c=function(){/^c/.test(f[l])&&(f.detachEvent(k,c),b())}),ready=h?function(a){self!=top?n?a():d.push(a):function(){try{g.doScroll("left")}catch(b){return setTimeout(function(){ready(a)},50)}a()}()}:function(a){n?a():d.push(a)}}();
            return domready;
        }()),

        (function(){
            var EventMessageHandler=function(a){return"undefined"==typeof EventMessageHandler?a:EventMessageHandler}(function(){var a={};a.stringify=function(){var a=!1;if(navigator&&"Microsoft Internet Explorer"===navigator.appName){var b=navigator.userAgent,c=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");null!=c.exec(b)&&(a=parseFloat(RegExp.$1)),a&&9>=a&&(a=!0)}return a}();var b=function(){function b(){var a=window.location.search.indexOf("_log=1")>-1?!0:!1;if(a&&window.console)try{return console.log.apply(console,arguments)}catch(b){console.log(arguments)}}var c,d={},e=this;c=function(c){var e=c.data,f=!1;if(a.stringify){if(!window.JSON)return b("[EventMessageHandler.send] Requires JSON"),!1;try{e=JSON.parse(e)}catch(g){b("[EventMessageHandler.send] error:"),b(g);var f=!0}}if(!f){b("[EventMessageHandler.receive]",e);var h=e&&e.type?e.type:!1,i=e&&e.data?e.data:!1;h&&i&&d[h]&&"function"==typeof d[h]&&d[h](i)}},window.addEventListener?window.addEventListener("message",c,!1):window.attachEvent&&window.attachEvent("onmessage",c),e.addHandler=function(a,b){return"string"!=typeof a?!1:void(d[a]=b)},e.sendMessage=function(c,d,e){if("string"!=typeof d)return!1;var f={type:d,data:e};if(a.stringify){if(!window.JSON)return b("[EventMessageHandler.send] Requires JSON"),!1;f=JSON.stringify(f)}if(c&&"string"==typeof c&&"parent"===c)window.parent.postMessage(f,"*"),b("[EventMessageHandler.send]",f);else if(c&&"string"==typeof c&&"self"===c)window.postMessage(f,"*");else if(c&&c.contentWindow)try{c.contentWindow.postMessage(f,"*"),b("[EventMessageHandler.send]",f)}catch(g){}}};return b}());
            return (new EventMessageHandler());
        }())

    ))

));