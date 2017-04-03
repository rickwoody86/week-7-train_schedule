var config = {
  apiKey: "AIzaSyDozNzPrdCP0JxWSykjeABhNr4gq7mnpuE",
  authDomain: "richards-project-1cd21.firebaseapp.com",
  databaseURL: "https://richards-project-1cd21.firebaseio.com",
  projectId: "richards-project-1cd21",
  storageBucket: "richards-project-1cd21.appspot.com",
  messagingSenderId: "338630190378"
};

firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();
    // Data will be stored in this directory
    var trainRef = database.ref("/trainData");

    // Intial Values
    var name = "";
    var destination = "";
    var time = 0000;
    var frequency = 00;

    // On click function for submit button
    $("#submit-train").on("click", function() {
      event.preventDefault();
    //Obtain form input values
    var trnName = $("#inputName").val().trim();
    var trnDestination = $("#inputDestination").val().trim();
    var trnTime = moment($("#inputStartTime").val().trim(), "HH:mm").format();
    var trnFrequency = parseInt($("#inputFreq").val().trim());

    // Local object for holding "temporary" train data
    var newTrn = {
      name: trnName,
      destination: trnDestination,
      time: trnTime,
      frequency: trnFrequency
    }

    //Saves new train data
    database.ref("/trainData").push(newTrn);

    //Display info in console
    console.log(newTrn.name);
    console.log(newTrn.destination);
    console.log(newTrn.time);
    console.log(newTrn.frequency);

    //prevents loading new page
    return false;

  });//end of submit event

//Firebase event that adds input data to a row in the html
database.ref("/trainData").on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trnName = childSnapshot.val().name;
  var trnDestination = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().time;
  var trnFrequency = childSnapshot.val().frequency;

  console.log(trnName);
  console.log(trnDestination);
  console.log(trnTime);
  console.log(trnFrequency);

  // First Train Time (pushed back 1 year to make sure it comes before current time)
    var trnTimeConverted = moment(trnTime, "HH:mm").subtract(1, "years");
    console.log(trnTimeConverted);

  // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trnTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trnRemainder = diffTime % trnFrequency;
    console.log(trnRemainder);

    // Minute Until Train
    var trnMinutesTill = trnFrequency - trnRemainder;
    console.log("MINUTES TILL TRAIN: " + trnMinutesTill);

    // Next Train
    var nextTrain = moment().add(trnMinutesTill, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDestination + "</td><td>" +
  trnFrequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + trnMinutesTill + "</td><td>" + "" + "</td></tr>");
});
