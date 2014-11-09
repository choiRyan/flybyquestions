/* 
 * Uses Firebase to update and present questions until a timer ends.
 */

var counter = 20;
var picIDs = [];
var currentID = 0;

/*
 * When the document is fully loaded, set up the page for use then waitForStart.
 */
    $(document).ready(function(){
      $('#remainder').hide();
      $("#swipeimg").load(function(){
            var win = $("#swipeimg");
            $("#hoverYes").css({"height": win.height()});
            $("#hoverYes").css({"width": win.width()/2});
            $("#hoverYes").css( {"top": win.offset().top});
            $("#hoverNo").css({"height": win.height()});
            $("#hoverNo").css({"width": win.width()/2});
            $( "#hoverNo").css( {"top": win.offset().top});
            $("#checkmark").css({"top": win.height()/2-35});
            $("#xmark").css({"top": win.height()/2-35});
            $("#checkmark").css({"left": win.width()/4-35});
            $("#xmark").css({"left": win.width()/4-35});
            if(currentID === 0){ // this is init procedure
            $('#flyby').hide();
            document.getElementById("uid").defaultValue = "Email";
            waitForStart();
        }
      });
    });
            
      $(window).on('resize', function(){
            var win = $("#swipeimg");
            $("#hoverYes").css({"height": win.height()});
            $("#hoverYes").css({"width": win.width()/2});
            $("#hoverYes").css( {"top": win.offset().top});
            $("#hoverNo").css({"height": win.height()});
            $("#hoverNo").css({"width": win.width()/2});
            $( "#hoverNo").css( {"top": win.offset().top});
            $("#checkmark").css({"top": win.height()/2-35});
            $("#xmark").css({"top": win.height()/2-35});
            $("#checkmark").css({"left": win.width()/4-35});
            $("#xmark").css({"left": win.width()/4-35});
      });
      

var qa = new Firebase('https://radiant-heat-827.firebaseio.com');

function set50IDs(input){
    for(var i = 0; i < input.length; i++){
        picIDs.push({id:input[i].id, type:input[i].type});
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
    readFileAndCallAPI("./DO_NOT_COMMIT");
    $('#start').click(function() {
        //first make sure that the username isn't taken in firebase already
        var u = qa.child("users");
        var name = $('#uid').val();
        u.on("value", function(snapshot) {
            if(snapshot.val()[name]){ // username has been taken
                console.log("Email has been taken (from " + snapshot.val()[name].where +")");
                $('#uid').css("border-color", "#ff0000");
                $('#error').css("color", "#ff0000");
                $('#error').text("Email has been taken! (from "+ snapshot.val()[name].where +")");
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
    $('#error').hide();
    $('#uid').hide();
    $('#flyby').show();
    var win = $("#swipeimg");
    $("#hoverYes").css({"height": win.height()});
    $("#hoverYes").css({"width": win.width()/2});
    $("#hoverYes").css( {"top": win.offset().top});
    $("#hoverNo").css({"height": win.height()});
    $("#hoverNo").css({"width": win.width()/2});
    $( "#hoverNo").css( {"top": win.offset().top});
    
    //save username
    var u = qa.child("users");
    var toSend = {};
    var ukey = $("#uid").val(); //key for below
    toSend[ukey] = {where:"HackSC"}; // in the future we may want to hold data about the users... so here
    u.update(toSend);
    
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
        var a = qa.child("answers");
        var toSend = {};
        toSend = {};
        toSend[currentID] = {uid:$('#uid').val(),ans:1};
        a.update(toSend);        
        if(picIDs.length >0)
            nextQuestion();
    });
    
    $('#no').click(function() { // pressed NO to question X
        var a = qa.child("answers");
        var toSend = {};
        toSend = {};
        toSend[currentID] = {uid:$('#uid').val(),ans:0};
        a.update(toSend);        
        if(picIDs.length >0)
        nextQuestion();
    });        
}

$(document).bind('keydown', function (event){
    var a = qa.child("answers");
    if(currentID > 0){
        if ( event.which === 39 ) { // aka yes
            var toSend = {};
            toSend = {};
            toSend[currentID] = {uid:$('#uid').val(),ans:1};
            a.update(toSend);        
            if(picIDs.length >0)
            nextQuestion();
        }else if ( event.which === 37 ) { // aka no
            var toSend = {};
            toSend = {};
            toSend[currentID] = {uid: $('#uid').val(), ans: 1};
            a.update(toSend);        
            if(picIDs.length >0)
            nextQuestion();
        }
    }
});

function nextQuestion(){
    document.getElementById("swipeimg").src="http://i.imgur.com/"+picIDs[currentID].id+"."+picIDs[currentID].type;
    increment();
}

function endTest(){
    $('#remainder').show();
}

//http://stackoverflow.com/questions/14446447/javascript-read-local-text-file
function readFileAndCallAPI(file){
    /*var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.send(null);
    rawFile.onreadystatechange = function(){
        if (rawFile.readyState === 4){
            if (rawFile.status === 200 || rawFile.status === 0){
                var allText = rawFile.responseText;*/
                var allText = "39e342b72dfe748\n"; // yeah idgaf, this isn't an oath2 key anyways
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
                                if(response.data[i].type)
                                    ids.push({id:response.data[i].id, type:response.data[i].type.split("/")[1]});
                                else
                                    ids.push({id:response.data[i].id, type:"jpg"});
                            }
                            set50IDs(ids); // CLOSURES!
                        }else{
                            alert("No response");
                        }
                    }
                }); /*
            }
        }
    };*/
}