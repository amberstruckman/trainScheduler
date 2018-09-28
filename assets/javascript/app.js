var config = {
  apiKey: "AIzaSyBeaAiqvni8hoYvOc8Y7j-6x2IItULbm18",
  authDomain: "trainschedulerhw-cae91.firebaseapp.com",
  databaseURL: "https://trainschedulerhw-cae91.firebaseio.com/",
  projectId: "trainschedulerhw-cae91",
  storageBucket: "trainschedulerhw-cae91.appspot.com",
  messagingSenderId: "938859772299"
};
firebase.initializeApp(config);

var trains = firebase.database();

trains.ref().on("value", function(snapshot){ 
  console.log(snapshot.val());
})

var name = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;

  $("#submit").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    name = $("#train-name").val().trim();
    console.log("name" + name);
    destination = $("#destination-name").val().trim();
    console.log("destination: " + destination);
    firstTrainTime = $("#firstTrain-time").val().trim();
    console.log("firstTrainTime: " + firstTrainTime);
    frequency = $("#frequency-rate").val().trim();
    console.log("Frequency: " + frequency);

    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //the math for the other values pushed to the database
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    firebase.database().ref().push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      nextTrainTime: nextTrain,
      tMinutesTillTrain: tMinutesTillTrain
    });
    
    //firebase.database().ref().push({
            //name: name,
        //     destination : destination,
        //     firstTrainTime : firstTrainTime,
        //     frequency : frequency,
        //     nextTrainTime: nextTrain,
        //     tMinutesTillTrain: tMinutesTillTrain

            
        // });
    })



   trains.ref('/trains').on("child_added", function(snapshot) {

    // // Log everything that's coming out of snapshot
    console.log(snapshot.val().name);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequency);

    var train = snapshot.val();
    console.log(train);

    // var name = train.name;
    // var destination = train.destination;
    // var firstTrainTime = train.firstTrainTime;
    // var frequency = train.frequency;

    // var tbl = $("<tr>");
  //  var attributes = [name, destination, frequency, nextTrainTime, minAway];

    // for(var i = 0; i < 6; i++) {
    //     tbl.append('<td>' + attributes[i] + '</td>');

    // }

    // $("#row").append(tbl);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
