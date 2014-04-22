/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, alert, console */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Commands        = brackets.getModule("command/Commands"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        Strings         = brackets.getModule("strings"),
        Constants       = require("CordovaManagerConstants");

    function CordovaNewProjectDialog(cordovaManager) {
        
        var self = this;
        this.cordovaManager = cordovaManager;
        this.$dialog = $(require("text!html/dialog-new-project.html"));
        this.$loader = this.$dialog.find('.loader');
        this.$inputName = this.$dialog.find('#cordova-new-name');
        this.$inputIdentifier = this.$dialog.find('#cordova-new-id');
        this.$inputFolderName = this.$dialog.find('#cordova-new-folder');
        this.$inputDestination = this.$dialog.find('#cordova-new-dest');
    }
    
    /** Show dialog */
    CordovaNewProjectDialog.prototype.show = function () {
        
        var self = this;
        self.$loader.hide();
        var Settings = self.cordovaManager.dialogSettings.getSettings();
        
        // Prefill
        this.$inputName.val('');
        this.$inputIdentifier.val('');
        this.$inputFolderName.val('');
        this.$inputDestination.val(Settings.workspace);
                        
        // Change destination folder
        this.$dialog.find('#cordova-new-dest-change').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            FileSystem.showOpenDialog(false, true, Strings.CHOOSE_FOLDER, Settings.workspace, null,
                function (error, files) {
                    if (!error && files && files.length > 0 && files[0].length > 0) {
                        self.$dialog.find('#cordova-new-dest').val(files[0]);
                    }
                });
        });
        
        // On submit
        this.$dialog.find('#cordova-new-submit').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.submit();
        });
                
        // Show
        Dialogs.showModalDialogUsingTemplate(this.$dialog);
        self.$inputName.focus();
    };
    
    /** Hide dialog */
    CordovaNewProjectDialog.prototype.close = function () {
        
        this.$loader.hide();
        Dialogs.cancelModalDialogIfOpen('dialog-cordova-new-project');
    };
    
    /** Check form */
    CordovaNewProjectDialog.prototype.isValidForm = function () {
        
        var isValid = true;

        // Check all inputs are not empty
        $.each([this.$inputName, this.$inputIdentifier, this.$inputFolderName, this.$inputDestination], function () {
            
            var $controlGroup = this.parents('.control-group');
            var $helpInline = $controlGroup.find('.help-inline');
            
            if (this.val().toString().length === 0) {
                $helpInline.removeClass('hide');
                $controlGroup.addClass('error');
                isValid = false;
            } else {
                $helpInline.addClass('hide');
                $controlGroup.removeClass('error');
            }
        });
        
        return isValid;
    };
    
    /** Submit */
    CordovaNewProjectDialog.prototype.submit = function () {
        
        this.$loader.show();
        
        var self = this;
        var pathDest = this.$inputDestination.val().toString();
        console.log(pathDest);
        if (pathDest.substr(-1) !== "/") {
            pathDest += '/';
        }
        
        if (self.isValidForm()) {
            
            // Building command
            var cmd = 'cordova create';
            cmd += ' "' + this.$inputFolderName.val() + '"';
            cmd += ' ' + this.$inputIdentifier.val().replace(/\s/g, "");
            cmd += ' "' + this.$inputName.val() + '"';

            var projectPath = pathDest + this.$inputFolderName.val();
            var promise = this.cordovaManager.runCommand(cmd, this.$inputDestination.val());
            promise.done(function () {
                ProjectManager.openProject(projectPath).done(function () {
                    CommandManager.execute(Commands.FILE_ADD_TO_WORKING_SET, { fullPath: projectPath + '/www/index.html' });
                    self.close();
                });
            });
        }
    };
    
    module.exports = CordovaNewProjectDialog;
});