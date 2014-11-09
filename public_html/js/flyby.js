/* 
 * Uses Firebase to update and present questions until a timer ends.
 */

var counter = 10;

/*
 * When the document is fully loaded, set up the page for use then waitForStart.
 */
$(document).ready(function() { // pressed START
    $('#remainder').hide();
    waitForStart();
});

var qa = new Firebase('https://radiant-heat-827.firebaseio.com');

/*
 * When the start button is pressed, check the textfield and see if
 * the username is taken. If not, start the timer and test.
 */
function waitForStart(){
    $('#start').click(function() {
        //first make sure that the username isn't taken in firebase already
        var u = qa.child("users");
        var name = $('#uid').val();
        u.on("value", function(snapshot) {
            if(snapshot.val()[name]){ // username has been taken
                console.log("Username has been taken (from " + snapshot.val()[name].where +")");
                
            } 
            else startTest(); // username is OK.
        }, function(errorObject) {
            console.log("The FireBase read failed: " + errorObject.code);
        });
    });
}

/*
 * Username passed the check, so let's start...
 */
function startTest(){           
    document.getElementById('uid').disabled = true;
    $('#start').hide();
    var id = setInterval(function() {
        counter--;
        if (counter > 0) {
            var secs, mins;
            if(counter%60 < 10) secs = "0"+counter%60;
            else secs = counter%60;
            if(Math.floor(counter/60) < 10) mins = "0"+Math.floor(counter/60);
            else mins = Math.floor(counter/60); 
            var msg = mins+':'+secs;
            $('#timer').text(msg);
        } else {
            $('#timer').hide();
            clearInterval(id);
            //now get the rest of the questions here in the same or next page.
            $('#flyby').hide();
            $('#remainder').show();
        }
    }, 100);
    
    $('#yes').click(function() { // pressed YES to question N
        qa.push({qid:0,ans:1,time:0}); // ans: 1=yes 0=no
    });
    
    $('#no').click(function() { // pressed NO to question N
        qa.push({qid:0,ans:0,time:0}); // ans: 1=yes 0=no
    });        
}
