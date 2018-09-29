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

  $("#submit").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    let name = $("#train-name").val().trim();
    console.log("name" + name);
    let destination = $("#destination-name").val().trim();
    console.log("destination: " + destination);
    let firstTrainTime = $("#firstTrain-time").val().trim();
    console.log("firstTrainTime: " + firstTrainTime);
    let frequency = $("#frequency-rate").val().trim();
    console.log("Frequency: " + frequency);

    let frequencyInMinutes = parseInt(frequency);
    let minutesPerDay = 60 * 24;
    let firstTrainArray = firstTrainTime.split(":");
    let nextTrainTimeInMinutes = parseInt(firstTrainArray[0]) * 60 + parseInt(firstTrainArray[1]);
    console.log("first train minutes: " + nextTrainTimeInMinutes);
    let trainTimesInMinutes = [];
    while (nextTrainTimeInMinutes < minutesPerDay) {
      trainTimesInMinutes.push(nextTrainTimeInMinutes);
      nextTrainTimeInMinutes += frequencyInMinutes;
    }

    trains.ref().push({
      name: name,
      destination: destination,
      frequency: frequencyInMinutes,
      times: trainTimesInMinutes
      
    });
    
    
    })



   trains.ref().on("child_added", function(snapshot) {
    console.log("child added");
   
    let train = snapshot.val();
    console.log("on-child_added--" + JSON.stringify(train));
    let trainFields = ["name", "destination", "frequency", "times"];
    let trainRow = document.createElement("tr");
    for (let i = 0; i < trainFields.length - 1; i++) {
      let trainElement = document.createElement("td");
      trainElement.textContent =  train[trainFields[i]];
      trainRow.appendChild(trainElement);
    }
    let currentMoment = moment();
    let momentMinutes = currentMoment.hour() * 60 + currentMoment.minute();
    let nextTrainMinutes = 0;
    let trainTimeIndex = 0;
    while (nextTrainMinutes < momentMinutes && trainTimeIndex < train.times.length) {
      nextTrainMinutes = train.times[trainTimeIndex++];
    }

    let minutesTilNext = nextTrainMinutes - momentMinutes;
    let nextTrainElement = document.createElement("td");
    nextTrainElement.textContent =currentMoment.add(minutesTilNext, "minutes").format("HH:mm");
    trainRow.appendChild(nextTrainElement);

    let tilNextElement = document.createElement("td");
    tilNextElement.textContent = minutesTilNext;
    trainRow.appendChild(tilNextElement);
    $("#train-schedule").append(trainRow);
 
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
