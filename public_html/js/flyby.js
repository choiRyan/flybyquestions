/* 
 * Uses Firebase to update and present questions until a timer ends.
 */

var currentQ = new Firebase('https://radiant-heat-827.firebaseio.com');
$(document).ready(function() {
    $('#start').click(function() {
        if($('#eraseme').is(':visible')){
            $( '#eraseme' ).hide();
        }else{
            $( '#eraseme' ).show();
        }
    });
});