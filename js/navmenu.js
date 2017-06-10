/* 
Nathan D. Hernandez
Udacity FullStack NanoDegree

ver 0.1 - June 2017

navmenu.js:
The Navigation Menu Specific Javasript to implement PureCSS CSS Web Framework 
navigation responsive menu. Implementaiton was done by using examples and 
documentation as found on https://purecss.io.
*/

/* JSHint specific to allow for:
   1. console.log output
   2. File-wide 'strict' mode usage
   3. jQuery '$' usage
*/
/*globals $:false */
/*jshint devel: true */
/*jshint browser: true */
/*jshint node: true */

"use strict";

// Customized Responsive NavMenu, from PureCSS dociumentation/examples
// See: https://purecss.io/layouts/side-menu/
function navigation(window, document) {
	console.log("Creating PureCSS Responsive NavMenu.....");

	console.log("Window is: " + window.location);
	console.log("Document is: " + document.title);

	var pageWrapper = document.getElementById("main-page-wrapper"),
		navMenu = document.getElementById("navmenu"),
		menuToggle = document.getElementById("menu-toggle"),
		mainContent = document.getElementById("main-page-content");
	
	console.log("pageWrapper grabbed was: " + pageWrapper);
	console.log("navMenu grabbed was: " + navMenu);
	console.log("menuToggle grabbed was: " + menuToggle);
	console.log("mainContent grabbed was: " + mainContent);

	function toggleClass(element, className) {
		var classes = element.className.split(/\s+/),
			length = classes.length,
			i = 0;

		for (; i < length; i++) {
			if (classes[i] === className) {
				classes.splice(i, 1);
				break;
			}
		}
		// If className is NOT found
		if (length === classes.length) {
			classes.push(className);
		}

		element.className = classes.join(' ');
	}

	function toggleAll(e) {
		var active = "active";
		 e.preventDefault();
		 toggleClass(pageWrapper, active);
		 toggleClass(navMenu, active);
		 toggleClass(menuToggle, active);
	}

	menuToggle.onclick = function(e) {
		toggleAll(e);
	};

	mainContent.onclick = function(e) {
		if (navMenu.className.indexOf("active") !== -1) {
			toggleAll(e);
		}
	};
}

$(document).ready(function() {
	navigation(window, document);
});
