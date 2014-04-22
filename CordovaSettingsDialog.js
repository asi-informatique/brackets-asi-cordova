/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        Strings         = brackets.getModule("strings"),
        Constants       = require("CordovaManagerConstants");

    var defaultPreferences = {
		workspace: ""
	};
    
    function CordovaSettingsDialog(cordovaManager) {
        
        var self = this;
        this.cordovaManager = cordovaManager;
        this.$dialog = $(require("text!html/dialog-settings.html"));
        this.$inputWorkspace = this.$dialog.find('#cordova-settings-workspace');
    }
    
    CordovaSettingsDialog.prototype.getSettings = function () {
        var settings = localStorage.getItem(Constants.LOCAL_STORAGE_SETTINGS);
		return (settings === null) ? defaultPreferences : JSON.parse(settings);
	};
    
    /** Show dialog */
    CordovaSettingsDialog.prototype.show = function () {
        
        var self = this;
        var Settings = self.getSettings();
              
        // Change destination folder
        this.$dialog.find('#cordova-settings-workspace-change').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            FileSystem.showOpenDialog(false, true, Strings.CHOOSE_FOLDER, Settings.workspace, null,
                function (error, files) {
                    if (!error && files && files.length > 0 && files[0].length > 0) {
                        self.$dialog.find('#cordova-settings-workspace').val(files[0]);
                    }
                });
        });
        
        // On submit
        this.$dialog.find('#cordova-settings-submit').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.submit();
        });
        
        // Prefill
        this.$inputWorkspace.val(Settings.workspace);
                
        Dialogs.showModalDialogUsingTemplate(this.$dialog);        
    };
    
    /** Hide dialog */
    CordovaSettingsDialog.prototype.close = function () {
        Dialogs.cancelModalDialogIfOpen('dialog-cordova-settings');
    };
    
    /** Save */
    CordovaSettingsDialog.prototype.submit = function () {
        
        var Settings = this.getSettings();
        Settings.workspace = this.$inputWorkspace.val();
        
        localStorage.setItem(Constants.LOCAL_STORAGE_SETTINGS, JSON.stringify(Settings));
        this.close();
    };
    
    module.exports = CordovaSettingsDialog;
});