/* 
 * Uses Firebase to update and present questions until a timer ends.
 */

var counter = 60;
var picIDs = [];
var currentID = 0;

/*
 * When the document is fully loaded, set up the page for use then waitForStart.
 */
$(document).ready(function() {
    $('#remainder').hide();
    $("#swipeimg").load(function() {
        var win = $("#swipeimg");
        $("#hoverYes").css({"height": win.height()});
        $("#hoverYes").css({"width": win.width() / 2});
        $("#hoverYes").css({"top": win.offset().top});
        $("#hoverNo").css({"height": win.height()});
        $("#hoverNo").css({"width": win.width() / 2});
        $("#hoverNo").css({"top": win.offset().top});
        $("#checkmark").css({"top": win.height() / 2 - 35});
        $("#xmark").css({"top": win.height() / 2 - 35});
        $("#checkmark").css({"left": win.width() / 4 - 35});
        $("#xmark").css({"left": win.width() / 4 - 35});
        if (currentID === 0) { // this is init procedure
            $('#flyby').hide();
            document.getElementById("uid").defaultValue = "Email";
            document.getElementById("lastn").defaultValue = "Last Name";
            document.getElementById("firstn").defaultValue = "First Name";
            waitForStart();
        }
    });

    /*
     * DONE with the survey. Now start over...
     */
    $('#done').click(function() { // done! now call endtipi w. the tipi data as input
        var toSend = {};
        var u = qa.child("users");
        var ukey = $("#uid").val().replace('.',','); //key for below
        toSend[ukey] = {where: "HackSC", "first": $("#firstn").val(), "last": $("#lastn").val(), tipi1: $("#q1").val(), tipi2: $("#q2").val(), tipi3: $("#q3").val(), tipi4: $("#q4").val(), tipi5: $("#q5").val(), tipi6: $("#q6").val(), tipi7: $("#q7").val(), tipi8: $("#q8").val(), tipi9: $("#q9").val(), tipi10: $("#q10").val()};
        u.update(toSend);
        $('#remainder').hide();
        var o = parseInt(toSend[ukey].tipi5) + 8 - parseInt(toSend[ukey].tipi10);
        var c = parseInt(toSend[ukey].tipi3) + 8 - parseInt(toSend[ukey].tipi8);
        var e = parseInt(toSend[ukey].tipi1) + 8 - parseInt(toSend[ukey].tipi6);
        var a = 8 - parseInt(toSend[ukey].tipi2) + parseInt(toSend[ukey].tipi7);
        var n = parseInt(toSend[ukey].tipi4) + 8 - parseInt(toSend[ukey].tipi9);
        var chart = new CanvasJS.Chart("charts", {
            title: {
                text: "Personality Estimates"
            },
            data: [//array of dataSeries              
                { //dataSeries object

                    type: "column",
                    dataPoints: [
                        {label: "Openness to Experience", y: o},
                        {label: "Conscientious", y: c},
                        {label: "Extraversion", y: e},
                        {label: "Agreeableness", y: a},
                        {label: "Neuroticism", y: n}
                    ]
                }
            ]
        });
        chart.render();
        $('#charts').show();
    });
});

$(window).on('resize', function() {
    var win = $("#swipeimg");
    $("#hoverYes").css({"height": win.height()});
    $("#hoverYes").css({"width": win.width() / 2});
    $("#hoverYes").css({"top": win.offset().top});
    $("#hoverNo").css({"height": win.height()});
    $("#hoverNo").css({"width": win.width() / 2});
    $("#hoverNo").css({"top": win.offset().top});
    $("#checkmark").css({"top": win.height() / 2 - 35});
    $("#xmark").css({"top": win.height() / 2 - 35});
    $("#checkmark").css({"left": win.width() / 4 - 35});
    $("#xmark").css({"left": win.width() / 4 - 35});
});


var qa = new Firebase('https://radiant-heat-827.firebaseio.com');

function set50IDs(input) {
    for (var i = 0; i < input.length; i++) {
        picIDs.push({id: input[i].id, type: input[i].type});
    }
}

function increment() {
    currentID = currentID + 1;
}

/*
 * When the start button is pressed, check the textfield and see if
 * the username is taken. If not, start the timer and test.
 */
function waitForStart() {
    readFileAndCallAPI("./DO_NOT_COMMIT");
    $('#start').click(function() {
        //first make sure that the username isn't taken in firebase already
        var u = qa.child("users");
        var name = $('#uid').val().replace('.',',');
        u.on("value", function(snapshot) {
            if (snapshot.val()[name]) { // username has been taken
                console.log("Email has been taken (from " + (snapshot.val()[name]).where + ")");
                $('#uid').css("border-color", "#ff0000");
                $('#error').css("color", "#ff0000");
                $('#error').text("Email has been taken! (from " + (snapshot.val()[name]).where + ")");
            }
            else {
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
function startTest() {
    document.getElementById('uid').disabled = true;
    $('#start').hide();
    $('#error').hide();
    $('#uid').hide();
    $('#flyby').show();
    var win = $("#swipeimg");
    $("#hoverYes").css({"height": win.height()});
    $("#hoverYes").css({"width": win.width() / 2});
    $("#hoverYes").css({"top": win.offset().top});
    $("#hoverNo").css({"height": win.height()});
    $("#hoverNo").css({"width": win.width() / 2});
    $("#hoverNo").css({"top": win.offset().top});

    //save username
    var u = qa.child("users");
    var toSend = {};
    var ukey = $("#uid").val().replace('.',','); //key for below
    toSend[ukey] = {where: "HackSC"}; // in the future we may want to hold data about the users... so here
    u.update(toSend);

    var id = setInterval(function() {
        counter--;
        if (counter > 0) {
            var secs, mins;
            if (counter % 60 < 10)
                secs = "0" + counter % 60;
            else
                secs = counter % 60;
            if (Math.floor(counter / 60) < 10)
                mins = "0" + Math.floor(counter / 60);
            else
                mins = Math.floor(counter / 60);
            var msg = mins + ':' + secs;
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
        toSend[currentID] = {ans: 1};
        a.child($('#uid').val().replace('.',',')).update(toSend);
        if (picIDs.length > 0)
            nextQuestion();
    });

    $('#no').click(function() { // pressed NO to question X
        var a = qa.child("answers");
        var toSend = {};
        toSend = {};
        toSend[currentID] = {ans: 0};
        a.child($('#uid').val().replace('.',',')).update(toSend);
        if (picIDs.length > 0)
            nextQuestion();
    });
}

$(document).bind('keydown', function(event) {
    var a = qa.child("answers");
    if (currentID > 0 && currentID < picIDs.length) {
        if (event.which === 39) { // aka yes
            var toSend = {};
            toSend = {};
            toSend[currentID] = {ans: 1};
            a.child($('#uid').val().replace('.',',')).update(toSend);
            if (picIDs.length > 0)
                nextQuestion();
        } else if (event.which === 37) { // aka no
            var toSend = {};
            toSend = {};
            toSend[currentID] = {ans: 0};
            a.child($('#uid').val().replace('.',',')).update(toSend);
            if (picIDs.length > 0)
                nextQuestion();
        }
    }
});

function nextQuestion() {
    document.getElementById("swipeimg").src = "http://i.imgur.com/" + picIDs[currentID].id + "." + picIDs[currentID].type;
    increment();
    if (currentID >= picIDs.length) {
        //now get the rest of the questions here in the same or next page.
        $('#flyby').hide();
        $('#remainder').show();
        endTest();
    }
}

function endTest() {
    if($('#remainder'))
    $('#remainder').show();
}

//http://stackoverflow.com/questions/14446447/javascript-read-local-text-file
function readFileAndCallAPI(file) {
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
        /*url: 'https://api.imgur.com/3/gallery/hot/',*/
        url: 'https://api.imgur.com/3/account/kobesarmy/album/XHabO',
        type: 'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Client-ID ' + lineArr[0]);
        },
        success: function(response) {
            // response; have imgur data here
            if (response && response.data) {
                var ids = [];/*
                 for (var i = 0; i < response.data.length; i++) {
                 if (response.data[i].type)
                 ids.push({id: response.data[i].id, type: response.data[i].type.split("/")[1]});
                 else
                 ids.push({id: response.data[i].id, type: "jpg"});
                 */
                for (var i = 0; i < response.data.images.length; i++) {
                    if (response.data.images[i].type)
                        ids.push({id: response.data.images[i].id, type: response.data.images[i].type.split("/")[1]});
                    else
                        ids.push({id: response.data.images[i].id, type: "jpg"});
                }
                set50IDs(ids); // CLOSURES!
            } else {
                alert("No response");
            }
        }
    }); /*
     }
     }
     };*/

    //slider things (http://jqueryui.com/slider/#steps)
    $(function() {
        $("#slider1").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q1").val(ui.value);
            }
        });
        $("#slider2").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q2").val(ui.value);
            }
        });
        $("#slider3").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q3").val(ui.value);
            }
        });
        $("#slider4").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q4").val(ui.value);
            }
        });
        $("#slider5").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q5").val(ui.value);
            }
        });
        $("#slider6").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q6").val(ui.value);
            }
        });
        $("#slider7").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q7").val(ui.value);
            }
        });
        $("#slider8").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q8").val(ui.value);
            }
        });
        $("#slider9").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q9").val(ui.value);
            }
        });
        $("#slider10").slider({
            value: 4,
            min: 1,
            max: 7,
            step: 1,
            slide: function(event, ui) {
                $("#q10").val(ui.value);
            }
        });
        /*
         $("#q1").val($("#slider1").slider("value"));
         $("#q2").val($("#slider2").slider("value"));
         $("#q3").val($("#slider3").slider("value"));
         $("#q4").val($("#slider4").slider("value"));
         $("#q5").val($("#slider5").slider("value"));
         $("#q6").val($("#slider6").slider("value"));
         $("#q7").val($("#slider7").slider("value"));
         $("#q8").val($("#slider8").slider("value"));
         $("#q9").val($("#slider9").slider("value"));
         $("#q10").val($("#slider10").slider("value"));*/
    });


}