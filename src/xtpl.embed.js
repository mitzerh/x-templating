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

            this.VERSION = "${version}";
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
            //inclue:domready
            return domready;
        }()),

        (function(){
            //inclue:messenger
            return (new EventMessageHandler());
        }())

    ))

));