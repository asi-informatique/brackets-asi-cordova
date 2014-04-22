/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    module.exports = {
        PLATFORM_ANDROID:           "android",
        PLATFORM_IOS:               "ios",
        CMD_ANDROID_ADD:            "cordova platform add android",
        CMD_ANDROID_BUILD:          "cordova build android",
        CMD_ANDROID_RUN:            "cordova run android",
        CMD_ANDROID_REMOVE:         "cordova platform remove android",
        CMD_IOS_ADD:                "cordova platform add ios",
        CMD_IOS_BUILD:              "cordova build ios",
        CMD_IOS_RUN:                "cordova run ios",
        CMD_IOS_REMOVE:             "cordova platform remove ios",
        CMD_PLUGIN_ADD:             "cordova plugin add",
        CMD_PLUGIN_REMOVE:          "cordova plugin remove",
        CMD_PLUGIN_LIST:            "cordova plugin ls",
        LOCAL_STORAGE_SETTINGS:     "asi.cordova.settings"
    };
});