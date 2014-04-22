/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, require, $, brackets, window, console */

define(function (require, exports, module) {
    "use strict";
    
    var NodeConnection = brackets.getModule("utils/NodeConnection"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    
    var nodeConnection = new NodeConnection(), // mind as well share a connection for all Git repos
        path = ExtensionUtils.getModulePath(module, "node/CordovaChildProcess"),
        disconnectedCordovas = [],
        connected = false,
        LOGGING_ENABLED = true;
    
    function log() {
        if (LOGGING_ENABLED) {
            console.log(arguments);
        }
    }
    
    nodeConnection.connect(true).done(function () {
        var p = nodeConnection.loadDomains([path], true);
        
        p.done(function () {
            connected = true;
            
            while (disconnectedCordovas.length > 0) {
                disconnectedCordovas.shift().connecting.resolve();
            }
        });
        
        p.fail(function () {
            log("[asi.cordova] Error connecting to Node:");
            log(arguments);
        });
    });

    function Cordova(cordovaManager) {
        this.cordovaManager = cordovaManager;
        this.connecting = $.Deferred();

        if (!connected) {
            disconnectedCordovas.push(this);
        } else {
            this.connecting.resolve();
        }
    }
        
    /**
    * @throws Error Executing a command that's not a cordova command throws an error
    * @returns {promise} Promise for the Node connection
    */
    Cordova.prototype.execute = function (cmd, path) {
        
        var self = this;
        
        if (self.connecting.state() !== "resolved") {
            throw new Error("Node connection for cordova not yet established.");
        }
        console.log('Cordova:execute:' + cmd);
        self.cordovaManager.managerPanel.$iconCordova.addClass('process');
        
        // Get current project root path
        var pathToUse = path;
        if (typeof pathToUse === 'undefined') {
            pathToUse = ProjectManager.getProjectRoot().fullPath;
        }
                
        // Run command
        var commandPromise = nodeConnection.domains.cordovaManager.runCommand(cmd, pathToUse);
        commandPromise.fail(function (err) {
            console.error("[asi.cordova] failed to run cordovaManager.runCommand : ", err);
            self.cordovaManager.managerPanel.$iconCordova.removeClass('process');
        });
        commandPromise.done(function (results) {
            console.log(results);
            self.cordovaManager.managerPanel.$iconCordova.removeClass('process');
        });
        return commandPromise;
    };
    
    module.exports = Cordova;
});