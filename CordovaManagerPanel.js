/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        PanelManager   = brackets.getModule("view/PanelManager"),
        Constants      = require("CordovaManagerConstants");

    function CordovaManagerPanel(cordovaManager) {
        this.cordovaManager = cordovaManager;
        this.panel = undefined;
        
        this.$panel = $(require("text!html/panel.html"));
        this.$iconCordova = $('<a id="toolbar-cordova" title="Cordova" href="#"></a>');
        this.$loader = this.$panel.find('.loader');
        
        this.createPanel();
    }
    
    /** Initialize Brackets panel */
    CordovaManagerPanel.prototype.createPanel = function () {
        
        var self = this;
        
        // Panel
        self.panel = PanelManager.createBottomPanel('asi.cordova.panel', self.$panel, 110);
            
        // Cordova Icon
        self.$iconCordova.appendTo($("#main-toolbar .buttons"));
        self.$iconCordova.on('click', function (e) {
            e.preventDefault();
            self.$iconCordova.toggleClass('open');

            if (self.$iconCordova.hasClass('open')) {
                self.panel.show();
            } else {
                self.panel.hide();
            }
        });
        
        // Header Panel's actions
        self.$panel.find('.dialog-new').on('click', function (e) {
            e.preventDefault();
            self.cordovaManager.dialogNewProject.show();
        });
        self.$panel.find('.dialog-plugins').on('click', function (e) {
            e.preventDefault();
            self.cordovaManager.dialogPlugins.show();
        });
        self.$panel.find('.dialog-settings').on('click', function (e) {
            e.preventDefault();
            self.cordovaManager.dialogSettings.show();
        });

        // Content Panel's actions
        self.$panel.find('.add').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconCordova.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.cordovaManager.runCommand(Constants.CMD_ANDROID_ADD);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.cordovaManager.runCommand(Constants.CMD_IOS_ADD);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconCordova.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.build').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconCordova.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.cordovaManager.runCommand(Constants.CMD_ANDROID_BUILD);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.cordovaManager.runCommand(Constants.CMD_IOS_BUILD);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconCordova.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.run').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconCordova.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.cordovaManager.runCommand(Constants.CMD_ANDROID_RUN);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.cordovaManager.runCommand(Constants.CMD_IOS_RUN);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconCordova.removeClass('process').addClass('open');
            });
        });
        self.$panel.find('.remove').on('click', function (e) {
            e.preventDefault();
            self.$loader.show();
            self.$iconCordova.removeClass('open').addClass('process');
            
            var device = $(this).parents('[data-device]').attr('data-device');
            var promise;
            
            if (device === Constants.PLATFORM_ANDROID) {
                promise = self.cordovaManager.runCommand(Constants.CMD_ANDROID_REMOVE);
            } else if (device === Constants.PLATFORM_IOS) {
                promise = self.cordovaManager.runCommand(Constants.CMD_IOS_REMOVE);
            }
            
            promise.done(function (data) {
                self.$loader.hide();
                self.$iconCordova.removeClass('process').addClass('open');
            });
        });
    };
    
    module.exports = CordovaManagerPanel;
});