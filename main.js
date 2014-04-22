/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";
    
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        AppInit         = brackets.getModule("utils/AppInit"),
        cordovaManager;

    ExtensionUtils.loadStyleSheet(module, "css/style.css");
    
    AppInit.appReady(function () {
        cordovaManager = require('CordovaManager');
        cordovaManager.initialize();
    });
});