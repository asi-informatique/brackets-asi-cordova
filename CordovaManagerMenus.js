/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        Menus           = brackets.getModule("command/Menus"),
        Constants       = require("CordovaManagerConstants");

    function CordovaManagerMenus(cordovaManager) {
        this.cordovaManager = cordovaManager;
        this.$dialogNewProject = $(require("text!html/dialog-new-project.html"));
        this.createMenus();
    }
    
    /** Initialize Brackets menus */
    CordovaManagerMenus.prototype.createMenus = function () {
        
        var self = this;
        var menuCommands = [{
            'title': 'Create New Project',
            'id': 'asi.cordova.menu.new-project',
            'action': function () { self.cordovaManager.dialogNewProject.show(); }
        }, {
            'title': 'Android - Run',
            'id': 'asi.cordova.menu.android-run',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_ANDROID_RUN); }
        }, {
            'title': 'Android - Build',
            'id': 'asi.cordova.menu.android-build',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_ANDROID_BUILD); }
        }, {
            'title': 'Android - Add Platform',
            'id': 'asi.cordova.menu.android-add-platform',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_ANDROID_ADD); }
        }, {
            'title': 'Android - Remove Platform',
            'id': 'asi.cordova.menu.android-remove-platform',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_ANDROID_REMOVE); }
        }, {
            'title': 'iOS - Run',
            'id': 'asi.cordova.menu.ios-run',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_IOS_RUN); }
        }, {
            'title': 'iOS - Build',
            'id': 'asi.cordova.menu.ios-build',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_IOS_BUILD); }
        }, {
            'title': 'iOS - Add Platform',
            'id': 'asi.cordova.menu.ios-add-platform',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_IOS_ADD); }
        }, {
            'title': 'iOS - Remove Platform',
            'id': 'asi.cordova.menu.ios-remove-platform',
            'action': function () { self.cordovaManager.runCommand(Constants.CMD_IOS_REMOVE); }
        }, {
            'title': 'Plugins',
            'id': 'asi.cordova.menu.plugins',
            'action': function () { self.cordovaManager.dialogPlugins.show(); }
        }, {
            'title': 'Preferences...',
            'id': 'asi.cordova.menu.settings',
            'action': function () { self.cordovaManager.dialogSettings.show(); }
        }];
        
        var menu = Menus.addMenu('Cordova', 'asi.cordova.menu');
        $.each(menuCommands, function () {
            
            CommandManager.register(this.title, this.id, this.action);
            menu.addMenuItem(this.id);
            
            if ($.inArray(this.id, ['asi.cordova.menu.new-project', 'asi.cordova.menu.android-remove-platform', 'asi.cordova.menu.ios-remove-platform']) >= 0) {
                menu.addMenuDivider();
            }
        });
    };
    
    module.exports = CordovaManagerMenus;
});