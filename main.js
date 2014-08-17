/*global define, $, brackets, window, Mustache */
define(function (require, exports, module) {
    'use strict';
    
    var AppInit = brackets.getModule('utils/AppInit'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        Dialogs = brackets.getModule('widgets/Dialogs'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        Strings = require('strings'),
        JSLINT_CMD_ID = 'georapbox.jslint',
        toolbarIcon = $('<a title="JSlint Configurator" id="georapbox-jslint-config-icon"></a>'),
        OptionsDialog = require('services/options'),
        FileExtension = require('services/file_extension');
    
    /**
     * Toggles visibility of toobar icon depending on
     * the current file's extension.
     */
    function toggleIconVisibility() {
        if (FileExtension.get() === 'js') {
            toolbarIcon.show();
        } else {
            toolbarIcon.hide();
        }
    }
    
    // App Ready
    AppInit.appReady(function () {
        // Load external stylesheets.
        ExtensionUtils.loadStyleSheet(module, 'css/georapbox-jslint.css');

        var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU),
            cmdOptions = CommandManager.register(Strings.COMMAND_NAME, JSLINT_CMD_ID, OptionsDialog.show);

        editMenu.addMenuItem(JSLINT_CMD_ID, 'Ctrl-Alt-J');
        
        toolbarIcon.on('click', OptionsDialog.show).
            appendTo('#main-toolbar .buttons');
        
        toggleIconVisibility();
        
        $(DocumentManager).on('currentDocumentChange', toggleIconVisibility);
    });
});