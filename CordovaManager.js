/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require, $, brackets, window, console, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var Cordova                 = require("Cordova"),
        CordovaManagerMenus     = require("CordovaManagerMenus"),
        CordovaManagerPanel     = require("CordovaManagerPanel"),
        CordovaNewProjectDialog = require("CordovaNewProjectDialog"),
        CordovaSettingsDialog   = require("CordovaSettingsDialog"),
        CordovaPluginsDialog    = require("CordovaPluginsDialog");
    
    var instance;
    
    function CordovaManager() {
        this.cordova = undefined;
        this.managerMenus = undefined;
        this.managerPanel = undefined;
        this.dialogNewProject = undefined;
        this.dialogSettings = undefined;
        this.dialogPlugins = undefined;
    }
    
    CordovaManager.getInstance = function () {
        return instance;
    };
    
    CordovaManager.prototype.initialize = function () {
        this.cordova = new Cordova(this);
        this.managerMenus = new CordovaManagerMenus(this);
        this.managerPanel = new CordovaManagerPanel(this);
        this.dialogNewProject = new CordovaNewProjectDialog(this);
        this.dialogSettings = new CordovaSettingsDialog(this);
        this.dialogPlugins = new CordovaPluginsDialog(this);
    };
    
    CordovaManager.prototype.showRunCommandDialog = function () {
        this.runDialog.show();
    };
    
    CordovaManager.prototype.runCommand = function (cmd, path) {
        return this.cordova.execute(cmd, path);
    };
    
    instance = new CordovaManager();

    module.exports = instance;
});