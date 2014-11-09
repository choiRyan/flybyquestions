/* 
 * Uses Firebase to update and present questions until a timer ends.
 */

var counter = 10;
var picIDs = [];
var currentID = 0;

/*
 * When the document is fully loaded, set up the page for use then waitForStart.
 */
$(document).ready(function() { // pressed START
    $('#remainder').hide();
    $('#flyby').hide();
    document.getElementById("uid").defaultValue = "Username";
    waitForStart();
});

var qa = new Firebase('https://radiant-heat-827.firebaseio.com');

function set50IDs(input){
    alert(input);
    for(var i = 0; i < input.length; i++){
        picIDs.push(input[i]);
    }
}

function increment(){
    currentID = currentID+1;
}

/*
 * When the start button is pressed, check the textfield and see if
 * the username is taken. If not, start the timer and test.
 */
function waitForStart(){
    imgurTrendingPicIDs = readFileAndCallAPI("DO_NOT_COMMIT");
    $('#start').click(function() {
        //first make sure that the username isn't taken in firebase already
        var u = qa.child("users");
        var name = $('#uid').val();
        u.on("value", function(snapshot) {
            if(snapshot.val()[name]){ // username has been taken
                console.log("Username has been taken (from " + snapshot.val()[name].where +")");
                $('#uid').css("border-color", "#ff0000");
                $('#error').css("color", "#ff0000");
                $('#error').text("Username has been taken!");
            } 
            else{
                $('#error').text("");
                startTest();
                $('#uid').css("border-color", "#ffffff");
            } // username is OK.
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
    $('#flyby').show();
    
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
    }, 1000);
    
    $('#yes').click(function() { // pressed YES to question X
        //qa.push({qid:0,ans:1,time:0}); 
        nextQuestion();
    });
    
    $('#no').click(function() { // pressed NO to question X
        //qa.push({qid:0,ans:0,time:0}); // ans: 1=yes 0=no SAVE Answer
        nextQuestion();
    });        
}

function nextQuestion(){
    document.getElementById("image").src="http://i.imgur.com/"+picIDs[counter]+".jpg";
    
}

function endTest(){
    $('#remainder').show();
}

//http://stackoverflow.com/questions/14446447/javascript-read-local-text-file
function readFileAndCallAPI(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function(){
        if (rawFile.readyState === 4){
            if (rawFile.status === 200 || rawFile.status === 0){
                var allText = rawFile.responseText;
                var lineArr = allText.split('\n'); 
                jQuery.ajax({
                    url: 'https://api.imgur.com/3/gallery/hot/',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Client-ID ' + lineArr[0]);
                    },
                    success: function(response) {
                        // response; have imgur data here
                        if (response && response.data) {
                            var ids = [];
                            for (var i = 0; i < response.data.length; i++) {
                                ids.push(response.data[i].id);
                            }
                            set50IDs(ids); // CLOSURES!
                        }else{
                            alert("No response");
                        }
                    }
                }); 
            }
        }
    };
    rawFile.send(null);
}