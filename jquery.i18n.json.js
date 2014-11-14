/******************************************************************************
* jquery.i18n.json
* 
* MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
* 
* @version     1.0.0
* @author      sunlianglei@gmail.com
* @inspiration jquery-i18n-properties (https://code.google.com/p/jquery-i18n-properties) by Nuno Fernandes
*****************************************************************************/

(function ($) {
    $.i18n = {};
    $.i18n.data = {};

    $.i18n.json = function (settings) {
        // set up settings
        var defaults = {
            language: '',
            path: '/',
            cache: false,
            encoding: 'UTF-8',
            callback: null
        };
        settings = $.extend(defaults, settings);
        if (settings.language === null || settings.language == '') {
            settings.language = $.i18n.browserLang();
        }
        if (settings.language === null) { settings.language = 'en'; }

        // load and parse json file
        loadFile(settings.path + settings.language + '.json', settings);

        // call callback
        if (settings.callback) { settings.callback(); }
    };

    $.i18n.prop = function (key) {
        var result;
        var flag = true;
        if (key.indexOf(".") == -1) {
            result = $.i18n.data[key];
        }
        else {
            var arr = key.split(".");
            result = $.i18n.data[arr[0]];
            for (var i = 1; i < arr.length; i++) {
                if (result == null || result == undefined) {
                    flag = false;
                    break;
                }
                result = result[arr[i]];
            }
        }
        if (flag && !!result) {
            if (arguments.length > 1) {
                if (arguments.length == 2 && typeof (arguments[1]) == "object") {
                    var args = arguments[1];
                    for (var key in args) {
                        if (args[key] != undefined) {
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < arguments.length - 1; i++) {
                        if (arguments[i + 1] != undefined) {
                            var reg = new RegExp("({)" + i + "(})", "g");
                            result = result.replace(reg, arguments[i + 1]);
                        }
                    }
                }
            }
            return result;
        }
        return '[' + key + ']';
    };

    /** Language reported by browser, normalized code */
    $.i18n.browserLang = function () {
        return navigator.language /* Mozilla */ || navigator.userLanguage /* IE */;
    }

    /** Load .json files */
    function loadFile(filename, settings) {
        $.ajax({
            url: filename,
            async: false,
            cache: settings.cache,
            contentType: 'text/plain;charset=' + settings.encoding,
            dataType: 'text',
            success: function (data, status) {
                var data = eval("(" + data + ")");
                $.i18n.data = data;
            }
        });
    }

})(jQuery);
             