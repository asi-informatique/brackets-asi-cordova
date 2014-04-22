/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        Strings         = brackets.getModule("strings"),
        Constants       = require("CordovaManagerConstants");
    
    function CordovaPluginsDialog(cordovaManager) {
        
        var self = this;
        this.cordovaManager = cordovaManager;
        this.$dialog = $(require("text!html/dialog-plugins.html"));
        this.$loader = this.$dialog.find('.loader');
        this.$inputAdd = this.$dialog.find('#cordova-plugins-add');
        this.$inputRemove = this.$dialog.find('#cordova-plugins-remove');
        this.$submitAdd = this.$dialog.find('#cordova-plugins-add-submit');
        this.$submitRemove = this.$dialog.find('#cordova-plugins-remove-submit');
        this.$tablePlugins = this.$dialog.find('table tbody');
    }
        
    /** Show dialog */
    CordovaPluginsDialog.prototype.show = function () {
        
        var self = this;
        self.$loader.show();
        self.loadPlugins();
        
        // Prefill
        this.$inputAdd.val('');
        this.$inputRemove.val('');
        
        // On add
        this.$submitAdd.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            self.$loader.show();
            
            var cmd = Constants.CMD_PLUGIN_ADD + ' ' + self.$inputAdd.val();
            var promise = self.cordovaManager.runCommand(cmd);
            promise.done(function () {
                this.$inputAdd.val('');
                self.loadPlugins();
            });
        });
        
        // On remove
        this.$submitRemove.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            self.$loader.show();
            
            var cmd = Constants.CMD_PLUGIN_REMOVE + ' ' + self.$inputRemove.val();
            var promise = self.cordovaManager.runCommand(cmd);
            promise.done(function () {
                this.$inputRemove.val('');
                self.loadPlugins();
            });
        });
                
        // Delete a Plugin
        this.$tablePlugins.on('click', '.remove', function (e) {
            e.preventDefault();
            self.$loader.show();
            
            var pluginName = $(this).parents('tr').find('td').first().text();
            var cmd = Constants.CMD_PLUGIN_REMOVE + ' ' + pluginName;
            var promise = self.cordovaManager.runCommand(cmd);
            promise.done(function () {
                self.loadPlugins();
            });
        });
                        
        Dialogs.showModalDialogUsingTemplate(this.$dialog);
    };
    
    /** Hide dialog */
    CordovaPluginsDialog.prototype.close = function () {
        Dialogs.cancelModalDialogIfOpen('dialog-cordova-plugins');
    };
    
    /** Load Plugins List */
    CordovaPluginsDialog.prototype.loadPlugins = function () {
        
        var self = this;
        var promise = self.cordovaManager.runCommand(Constants.CMD_PLUGIN_LIST);
        promise.done(function (data) {
            console.log('results');

            var list = data.replace(/'/g, "\"").replace(/(\r\n|\n|\r)/gm, "");

            try {

                list = list.substring(0, list.indexOf(']') + 1);
                var plugins = JSON.parse(list);
                var html = '';
                $.each(plugins, function () {
                    html += '<tr>';
                    html    += '<td>' + this + '</td>';
                    html    += '<td><a href="#" class="remove">Remove</a></td>';
                    html += '</tr>';
                });
                self.$tablePlugins.html(html);

            } catch (e) {

                // 0 plugins
                console.log(e);
                self.$tablePlugins.html('<tr><td>0 plugins</td><td></td></tr>');
                self.$loader.hide();
            }

            self.$loader.hide();
        });
    };
    
    module.exports = CordovaPluginsDialog;
});