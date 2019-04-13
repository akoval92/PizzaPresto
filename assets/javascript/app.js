
//========================================================//
//Global Variables
//========================================================//
var username = "";
var userScore = 0;
var difficulty = "";


//========================================================//
// Main Run Through
//========================================================//
$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDd-uc53MHvSpaahIvBuYI2oAG22eZLkuw",
        authDomain: "pizza-presto-28c03.firebaseapp.com",
        databaseURL: "https://pizza-presto-28c03.firebaseio.com",
        projectId: "pizza-presto-28c03",
        storageBucket: "pizza-presto-28c03.appspot.com",
        messagingSenderId: "750779277139"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    //Materialize Animations
    $('.fixed-action-btn').floatingActionButton();
    $('select').formSelect();  //For the select difficulty dropdown
    
    var name = "";
    //addEventListeners
    playButton();
    initiateGameScreen();
    
    // Initialize Firebase
    
    //Initial Values
    
    // database.ref().on("value", function (snapshot) {
        
        // }, function(errorObject) {
            //     console.log("The read failed: " + errorObject.code);
            // });
});
        
//========================================================//
// Screen Changes
//========================================================//
//Adds an event listener to the play button, which brings us to the next screen
function playButton() {
    $(document).on('click', '#playButton', function() {
        $('#menuScreen').addClass('hide');
        $('#settingsMenu').removeClass('hide');
    });
}
        
//adds an event listener to the "next" button after player chooses topic and difficulty
function initiateGameScreen () {
    $(document).on('click', '#startGameButton', function(event) {
        // prevent page from refreshing when form tries to submit itself
        event.preventDefault();
        $('#settingsMenu').addClass('hide');
        $('#gameScreen').removeClass('hide');
      
            name = $("#name-input").val().trim();

            database.ref().set({
                name: name,
            });
            database.ref().on("value", function(snapshot) {
                // Log everything that's coming out of snapshot
                console.log(snapshot.val());
                console.log(snapshot.val().name);

                // Capture user inputs and store them into variables
                $("name-display").text(snapshot.val().name);

            }, function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            });
    });
}      
//Shows the scoreBoard, gives the user the option to replay the game, 
//or choose a new topic
function scoreBoard () {
    $('#gameScreen').addClass('d-none');
    $('#scoreBoardScreen').removeClass('d-none');

    joke();
    replay();
    chooseNewTopic();
}
// scoreBoard();
//Brings the user back to previous gameScreen
function replay() {
    $(document).on('click', '#replay', function() {
        $('#scoreBoardScreen').addClass('d-none');
        $('#gameScreen').removeClass('d-none');
    });

}

//Brings the user back to the Topic screen
function chooseNewTopic() {
    $(document).on('click', '#replay', function() {
        $('#scoreBoardScreen').addClass('d-none');
        $('#topicsDiffcultyMenu').removeClass('d-none');
    });
}

//========================================================//
// APIs
//========================================================//
//One the scoreboard page, the chef will say a random pizza joke
//on the bottom

var difficulty;
var category;
var categoryValue;

// game starts when you set the difficulty/category and press play button
$('#playButton').on('click', function(event) {
    event.preventDefault();
    
    // captures difficulty input from start screen drop-down
    difficulty = $('#inputDifficulty').val().toLowerCase();
    console.log(difficulty);
    // captures category input from start screen drop-down
    category = $('#inputCategory').val();
    // conditional that changes category name to number for queryURL
    if (category === 'General Knowledge') {
        categoryValue = '9';
    } else if (category === 'Sports') {
        categoryValue = '21';
    } else if (category === 'Geography') {
        categoryValue = '22'
    } else if (category === 'Celebrity') {
        categoryValue = '26'
    } else if (category === 'Animals') {
        categoryValue = '27'
    } else if (category === 'Music') {
        categoryValue = '12';
    }
    console.log(categoryValue);

    function triviaPull() {
        var queryURL = 'https://opentdb.com/api.php?amount=45&category=' + categoryValue + '&difficulty=' + difficulty + '&type=multiple';

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response){

            console.log(response.results);

            // When an ingredient button is clicked, a trivia question is produced
            $('.ingredient-button').on('click', function(event) {
                event.preventDefault();
        
                var triviaDisplay = $('#trivia-question');
                var triviaAnswersDisplay = $('#trivia-answers');

                var triviaQuestion = response.results[0].question;
                var correctAnswer = response.results[0].question.correct_answer;
        
                triviaDisplay.text(triviaQuestion);
                
                // populate answers**
    
            });
        }) 

    }
    
    triviaPull();

});

function joke() {
    var queryURL = "https://official-joke-api.appspot.com/random_joke";
    
    $.ajax({
        url:queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response)
        console.log(response.setup)
        $('#setup').text(response.setup);  //[ ] I need to animate this
        $('#punchline').text(response.punchline);
        
    });
}


function timeConverter(timeInSeconds) {

  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = timeInSeconds - (minutes * 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes === 0) {
    minutes = "00";
  }
  else if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return minutes + ":" + seconds;
}




$("#startGameButton").on("click", timer); 

function timer() {

    var time = 120;
    
    setInterval(function () {
        time--;

        if (time <= 0) {
            clearInterval(time);
            $('#time').text("Game Over!");
            return;
        } else {
            $('#time').text(timeConverter(time));
        }
    }, 1000);
}
