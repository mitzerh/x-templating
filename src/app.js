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
        //inclue:domready
        return domready;
    }()),

    (function(){
        //inclue:messenger
        return (new EventMessageHandler());
    }())

));
