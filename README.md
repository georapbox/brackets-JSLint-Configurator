JSLint Configurator
===================

[Brackets](http://brackets.io/) extension that enables configuration of JSLint options.

## Installation

#### Git Clone
1. Under main menu select **Help > Show Extensions Folder**
2. Git clone this repository inside the folder user.

#### Extension Manager
1. Under main menu select **File > Extension Manager...**
2. Search for "JSLint Configurator"
3. Click "Install"


## How to use

Under main menu select **Edit > JSLint Configurator** or use the shortcut **"CTRL+ALT+J"** to open the JSLint Configurator dialog.

![Screenshot 1](https://github.com/georapbox/brackets-JSLint-Configurator/blob/master/screenshots/screen-1.png)

Check the desired options, click the **'Insert directive to document'** button... and Voila!

![Screenshot 2](https://github.com/georapbox/brackets-JSLint-Configurator/blob/master/screenshots/screen-2.png)

**Hint:** The configurator always inserts the JSLint directive in the first line of the document. Therefore, every time the dialog opens, it checks if the first line of the document has a JSLint directive and populates the appropriate options.

##Localization
The extension is translated in the following languages:

- English (default)
- Greek
- Italian

##Changelog

### 1.1.8
- Fixed "Extract to file" functionality issues due to deprecated method calls.

### 1.1.7
- Update toolbar icon.

### 1.1.6
- UI minor updates to conform to dark themes after Bracket's update to v0.43.

### 1.1.5
- Add Spanish locale.

### 1.1.4
- Add Italian locale. Credits to [@Denisov21](https://github.com/Denisov21) for his contribution in the translation.

### 1.1.3
- Display toolbar icon when current document is of "Javascript" type.
- Insert JSLint directive only in Javascript files.
- Add localization support. Currently supported languages:
 - English (default)
 - Greek

### 1.1.2
- Extract JSLint directive to file.

### 1.1.1
- Convert JSLint directive to a JSON string, so it can be used as <code>jslint.options</code> in the <code>.brackets.json</code> preferences file.

### 1.1.0
- UI update.
- New JSLint directive replaces the old one when inserted in current document.
- Read predefined options from current document and populate the appropriate values when the configurator opens.

### 1.0.2
- Minor bugs fixing.

### 1.0.1
- Initial release.