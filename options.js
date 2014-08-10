/*global define, $, brackets, Mustache*/
define(function (require, exports, module) {
    'use strict';
    
    var Dialogs = brackets.getModule('widgets/Dialogs'),
		PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
		ProjectManager = brackets.getModule('project/ProjectManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
		Strings = brackets.getModule('strings'),
		OptionsTemplate = require('text!options.html');
    
    /**
	 * Displays dialog with JSLint options.
	*/
    function showOptionsDialog() {
        var currentDoc = DocumentManager.getCurrentDocument(),
            opts = [],
			promise,
            dialog,
            varEls,
            varLen,
            inputs,
            inputsLen,
            result,
            i;
		
		/**		
		 * Clears all dialog's options.
		 */
		function clearOptions() {
			varEls.removeClass('true false').
				addClass('default').
				html('default');                // Reset all var elements.

			inputs.val('');                     // Clear input elements' values.
			result.val('');                     // Clear the directive textarea.
			opts = [];                          // Empty options array.
		}
		
		/**
		 * Generates JSLint Directive. 
		*/
        function generateDirective() {
            var optionName,
                optionValue,
                varElement;
            
            opts = [];                         // Empty options array.
			
			// Loop through all var element.
            for (i = 0; i < varLen; i += 1) {
                varElement = varEls[i];
                
                if (!$(varElement).hasClass('default')) {
                    optionName = $(varElement).parent().attr('title');
                    optionValue = $(varElement).attr('class');
                    
                    opts.push(optionName + ': ' + optionValue);
                }
            }
            
			// Loop through all input elements.
            for (i = 0; i < inputsLen; i += 1) {
                if ($(inputs[i]).val() !== '') {
                    optionName = $(inputs[i]).attr('title');
                    optionValue = $(inputs[i]).val();
                    
                    opts.push(optionName + ': ' + optionValue);
                }
            }
            
			if (opts.length >= 1) {											// If options array is NOT empty...
				result.val('/*jslint ' + opts.join(', ') + '*/');			// ...display the options as string in results placeholder.
			} else {														// If options array is empty...
				result.val('');											    // ...empty the results placeholder.
			}
		}
        
        /**        
         * Generates JSON string out of options selected.      
         */
        function generateJsonString() {
            var i = 0,
                parsedData = {},
                jsonString,
                val;
            
            for (i; i < opts.length; i += 1) {
                val = opts[i].substr(opts[i].indexOf(':') + 2);
                
                if (val === 'true') {
                    parsedData[opts[i].substr(0, opts[i].indexOf(':'))] = true;
                } else if (val === 'false') {
                    parsedData[opts[i].substr(0, opts[i].indexOf(':'))] = false;
                } else if (!isNaN(val)) {
                    parsedData[opts[i].substr(0, opts[i].indexOf(':'))] = +val;
                }
            }
            
            jsonString = JSON.stringify(parsedData, null, '\t');
            result.val(jsonString);
        }
			
		/**
		 * Inserts JSLint directive on editor body.
		*/
		function insertDirectiveToEditor() {
			var editor = EditorManager.getCurrentFullEditor(),
				editorDoc = editor.document,
                startPosition = {line: 0, ch: 0},
                firstLineContent = currentDoc.getLine(0);
            
            editor.setCursorPos(startPosition);                             // Set cursor to line 0 and column 0. 
            editorDoc.replaceRange(result.val() + '\n', startPosition);	    // Insert directive at first line and push document one line down.
			
			// Check if document already has a JSLint directive
			// and remove the line with the old directive.
			if (firstLineContent.indexOf('/*jslint') >= 0) {
				editorDoc.replaceRange('', {line: 1, ch: 0}, {line: 2, ch: 0});
			}
		}
        
        /**
		 * Inserts JSLint directive on editor body.
		*/
        function toggleCheckbox(checkbox, checked) {
            var jsonInput = dialog.find(checkbox);
            jsonInput.attr('checked', checked);
        }
        
        /**        
         * Gets directive from editor and populates the appropriate options in dialog.
         * Assumes that the directive is on the first line of the document.
         */
        function getDirectiveFromEditor() {
            var firstLineContent = currentDoc.getLine(0),
                tempArr = [],
                arr = [],
                tempArrLen,
                arrLen,
                tempArrItem,
                arrItem,
                subStr,
                option,
                i;
            
            if (firstLineContent.indexOf('/*jslint') >= 0) {
                subStr = firstLineContent.replace('/*jslint', '');
                subStr = subStr.replace('*/', '');
                tempArr = subStr.split(',');
                tempArr = $.map(tempArr, $.trim);
                tempArrLen = tempArr.length;
                
                for (i = 0; i < tempArrLen; i += 1) {
                    tempArrItem = tempArr[i];
                    
                    option = {
                        name: tempArrItem.substr(0, tempArrItem.indexOf(':')),
                        value: $.trim(tempArrItem.substr(tempArrItem.indexOf(':')).replace(':', ''))
                    };
                    
                    arr.push(option);
                }
                
                arrLen = arr.length;
                
                for (i = 0; i < arrLen; i += 1) {
                    arrItem = arr[i];
                    
					// Update the dialog's options only if the values specified are valid (true or false).
                    if (arrItem.value === 'true' || arrItem.value === 'false') {
						dialog.find('.modal-body div[title="' + arrItem.name + '"] var').
							removeClass('default').
							addClass(arrItem.value).
							html(arrItem.value);
					}
					
					if (arrItem.name === 'indent' || arrItem.name === 'maxlen' || arrItem.name === 'maxerr') {
						dialog.find('.modal-body input[title="' + arrItem.name + '"]').val(arrItem.value);
					}
				}
                
                generateDirective();
            }
        }
		
		promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(OptionsTemplate, Strings)).
            done(function (id) {
				// if button OK clicked...
                if (id === Dialogs.DIALOG_BTN_OK) {
					if (opts.length >= 1) {
						insertDirectiveToEditor();
                        dialog.off('click');
					}
                }
                
                // if button CANCEL clicked...
                if (id === Dialogs.DIALOG_BTN_CANCEL) {
                    dialog.off('click');
                }
			});
		
		dialog = $('.georapbox-jslint-settings-dialog.instance');		    // dialog modal
        varEls = dialog.find('.modal-body').find('var');                    // dialog buttons
        varLen = varEls.length;                                             // dialog buttons length
        inputs = dialog.find('.modal-body').find('input[type="number"]');   // dialog inputs
        inputsLen = inputs.length;                                          // inputs length 
        result = dialog.find('#georapbox-jsl-conf-result');			        // result placeholder
        
        getDirectiveFromEditor();
        
        // Add event handlers.
        dialog.
            on('click', '.modal-body button', function () {
                var varEl = $(this).next();
                
                toggleCheckbox('input[name="jsonConvert"]', false);
                
                if (varEl.hasClass('default')) {
                    varEl.removeClass('default').addClass('true').html('true');
                    generateDirective();
                    return;
                }

                if (varEl.hasClass('true')) {
                    varEl.removeClass('true').addClass('false').html('false');
                    generateDirective();
                    return;
                }

                if (varEl.hasClass('false')) {
                    varEl.removeClass('false').addClass('default').html('default');
                    generateDirective();
                    return;
                }
            }).
            on('click', '.modal-body var', function () {
                $(this).prev().click();
            }).
            on('click', '.modal-header a.clear-options', function () {
                clearOptions();
            }).
            on('click', '.modal-footer .select-button', function () {
                result.focus();
                result.select();
            }).
			on('change', '.modal-body input[type="number"]', function () {
                generateDirective();
                toggleCheckbox('input[name="jsonConvert"]', false);
            }).
            on('change', '.modal-footer input[name="jsonConvert"]', function () {
                var insertButton = dialog.find('a[data-button-id="ok"]'),
                    textareaVal = result.val();
                
                if (textareaVal.trim() !== '') {
                    if ($(this).is(':checked')) {
                        insertButton.attr('disabled', true).prop('disabled', true);
                        generateJsonString();
                    } else {
                        insertButton.attr('disabled', false).prop('disabled', false);
                        generateDirective();
                    }
                }
            });
    
		return promise;
	}
    
    exports.showOptionsDialog = showOptionsDialog;
});
