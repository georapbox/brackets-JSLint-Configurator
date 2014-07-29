/*
 * The MIT License (MIT)
 * Copyright (c) 2014 George Raptis. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
    'use strict';
    
    var Dialogs = brackets.getModule("widgets/Dialogs"),
		PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
		ProjectManager = brackets.getModule("project/ProjectManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
		Strings = brackets.getModule("strings"),
		OptionsTemplate = require("text!options.html");
    
	
    /**
	 *	@desc show dialog with JSLint options 
	*/
    function showOptionsDialog() {
		var dialog, checkboxes, checkboxesLen, result, i, toggleAll,
            opts = [];
			
		/**
		 *	@desc generates the snippet with JSLint options 
		*/
		var generateSnippet = function () {
			opts = [];                                                      // empty options array

			for (i = 0; i < checkboxesLen; i++) {                           // loop through all options checkboxes
				if (checkboxes[i].checked) {                                // if checked
					opts.push($(checkboxes[i]).val());                      // push checkbox option to options array
				}
			}

			if (opts.length >= 1) {											// if options array is NOT empty
				result.val('/*jslint ' + opts.join(', ') + ' */');			// display the options as string in results placeholder
			} else {														// id options array is empty
				result.val('');											    // empty the results placeholder
			}
		};
			
		/**
		 *	@desc insert JSLint snippet on editor body
		*/
		var insertSnippetToEditor = function () {
			var editor = EditorManager.getCurrentFullEditor(),
				editorDoc = editor.document,
                startPosition = {line: 0, ch: 0};
            
            editor.setCursorPos(startPosition);                             // set cursor to line 0 and column 0 
			editorDoc.replaceRange(result.val() + '\n', startPosition);		// insert snippet at first line and push document one line down
        };
		
		/**
		 *	@desc toggle check/uncheck all options checkboxes
		 *	@param check {Boolean} - if true check all options else uncheck
		*/
		var toggleAllOptions = function (check) {
			var i = 0;
			
			for (i; i < checkboxesLen; i++) {
				// check all
				if (check === true) {
					if (!checkboxes[i].checked) {
						checkboxes[i].click();
					}
				}
				
				// uncheck all
				if (check === false) {
					if (checkboxes[i].checked) {
						checkboxes[i].click();
					}
				}
			}
		};
		
		var promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(OptionsTemplate, Strings))
			.done(function (id) {
				// if button OK clicked
                if (id === Dialogs.DIALOG_BTN_OK) {
					if (opts.length >= 1) {
						insertSnippetToEditor();
					}
                }
			});
		
		
		dialog = $(".jslint-settings-dialog.instance");		// dialof modal		
		checkboxes = dialog.find('input:checkbox');			// options checkboxes
        checkboxesLen = checkboxes.length;					// number of options checkboxes
        result = dialog.find('#jsl-conf-result');			// result placeholder
		toggleAll = $('#toggleAll');
        
        /*===== Events =====*/
        $(checkboxes).change(generateSnippet);				// generate new JSLint snippet on checkbox click
		
		// toggle all checkbox options
		toggleAll.on('click', function (event) {
			event.preventDefault();
			
			var self = $(this);
			
			if (self.hasClass('clicked')) {
				self.html('Select all');
				self.removeClass('clicked');
				toggleAllOptions(false);                    // check em all
			} else {
				self.html('Unselect all');
				self.addClass('clicked');
				toggleAllOptions(true);                     // uncheck em all
			}
		});
    
		return promise;
	}
    
    /*===== Exports =====*/
    exports.showOptionsDialog = showOptionsDialog;
});
