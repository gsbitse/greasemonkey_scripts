// ==UserScript==
// @name         10000ft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.10000ft.com/editproject?id=*
// @grant        none
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @require https://cdn.rawgit.com/uzairfarooq/arrive/master/minified/arrive.min.js
// ==/UserScript==

(function($) {
    'use strict';
     $(document).arrive(".expensesControlContentContainer", function() {
        $('.expensesControlContentContainer').nextUntil('.editprojectNoteContainer').hide();
     });
})(jQuery);
