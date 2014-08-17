/*global define, brackets*/

define(function (require, exports, module) {
    'use strict';
    
    var DocumentManager = brackets.getModule('document/DocumentManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        FileUtils = brackets.getModule('file/FileUtils');
    
    /**    
     * Gets the file extension for the current document.    
     * @returns {String} fileExtension
     */
    function getFileExtension() {
        var activeEditor = EditorManager.getCurrentFullEditor(),
            activeDocument = DocumentManager.getCurrentDocument(),
            fileExtension = activeDocument ? FileUtils.getFileExtension(activeDocument.file.fullPath).toLowerCase() : '';
        
        return fileExtension;
    }
    
    exports.get = getFileExtension;
});