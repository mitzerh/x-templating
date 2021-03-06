/**
* x-templating v0.1.0 | 2015-04-20
* Cross domain html templating
* by Helcon Mabesa
* MIT license http://opensource.org/licenses/MIT
**/

(function(DomReady, EventMessageHandler){

    var trigger = function() {
        EventMessageHandler.addHandler("get.template", function(data){
            loadTemplate(data);

        });
    };

    var loadTemplate = function(info) {
        loadAjax(info, function(markup){
            EventMessageHandler.sendMessage("parent", info.id, { info: info, markup: markup });
        });
    };

    var loadAjax = function(info, callback) {
        var req = new XMLHttpRequest(),
            templatePath = "tpl/" + info.template + ".html";

        req.onreadystatechange = function() {
            if (req.readyState === XMLHttpRequest.DONE ) {
                if (req.status === 200) {
                    callback(req.responseText);
                } else {
                    console.log("error....");
                }
            }
        };

        req.open("GET", templatePath, true);
        req.send();
    };

    DomReady(function(){
        trigger();
    });

}(

    (function(){
        var domready=function(a){function b(a){for(n=1;a=d.shift();)a()}var c,d=[],e=!1,f=document,g=f.documentElement,h=g.doScroll,i="DOMContentLoaded",j="addEventListener",k="onreadystatechange",l="readyState",m=h?/^loaded|^c/:/^loaded|c/,n=m.test(f[l]);return f[j]&&f[j](i,c=function(){f.removeEventListener(i,c,e),b()},e),h&&f.attachEvent(k,c=function(){/^c/.test(f[l])&&(f.detachEvent(k,c),b())}),ready=h?function(a){self!=top?n?a():d.push(a):function(){try{g.doScroll("left")}catch(b){return setTimeout(function(){ready(a)},50)}a()}()}:function(a){n?a():d.push(a)}}();
        return domready;
    }()),

    (function(){
        var EventMessageHandler=function(a){return"undefined"==typeof EventMessageHandler?a:EventMessageHandler}(function(){var a={};a.stringify=function(){var a=!1;if(navigator&&"Microsoft Internet Explorer"===navigator.appName){var b=navigator.userAgent,c=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");null!=c.exec(b)&&(a=parseFloat(RegExp.$1)),a&&9>=a&&(a=!0)}return a}();var b=function(){function b(){var a=window.location.search.indexOf("_log=1")>-1?!0:!1;if(a&&window.console)try{return console.log.apply(console,arguments)}catch(b){console.log(arguments)}}var c,d={},e=this;c=function(c){var e=c.data,f=!1;if(a.stringify){if(!window.JSON)return b("[EventMessageHandler.send] Requires JSON"),!1;try{e=JSON.parse(e)}catch(g){b("[EventMessageHandler.send] error:"),b(g);var f=!0}}if(!f){b("[EventMessageHandler.receive]",e);var h=e&&e.type?e.type:!1,i=e&&e.data?e.data:!1;h&&i&&d[h]&&"function"==typeof d[h]&&d[h](i)}},window.addEventListener?window.addEventListener("message",c,!1):window.attachEvent&&window.attachEvent("onmessage",c),e.addHandler=function(a,b){return"string"!=typeof a?!1:void(d[a]=b)},e.sendMessage=function(c,d,e){if("string"!=typeof d)return!1;var f={type:d,data:e};if(a.stringify){if(!window.JSON)return b("[EventMessageHandler.send] Requires JSON"),!1;f=JSON.stringify(f)}if(c&&"string"==typeof c&&"parent"===c)window.parent.postMessage(f,"*"),b("[EventMessageHandler.send]",f);else if(c&&"string"==typeof c&&"self"===c)window.postMessage(f,"*");else if(c&&c.contentWindow)try{c.contentWindow.postMessage(f,"*"),b("[EventMessageHandler.send]",f)}catch(g){}}};return b}());
        return (new EventMessageHandler());
    }())

));
