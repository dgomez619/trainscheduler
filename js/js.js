$(document).ready(function(){
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCu1uPs6MATGEUiAEOZ_DzeV-Sgts4bGFw",
  authDomain: "trainscheduler-4ee2d.firebaseapp.com",
  databaseURL: "https://trainscheduler-4ee2d.firebaseio.com",
  projectId: "trainscheduler-4ee2d",
  storageBucket: "",
  messagingSenderId: "672792503238",
  appId: "1:672792503238:web:aa535819880e339c"
};
firebase.initializeApp(config);
var database = firebase.database();

var timeRN = new Date(); 
$("#currentTime").text("Current Time: " + timeRN);

//user input variables
var trainName = "";
var destination = "";
var trainTime = "";
var frequency = 0;

$("#submitInfo").on("click", function(event){
  event.preventDefault();

  trainName = $("#TrainName").val().trim();
  destination = $("#Destination").val().trim();
  trainTime = $("#TrainTime").val().trim();
  frequency = $("#Frequency").val().trim();
  
  database.ref().push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});
//only allows the user to clear train info input until session is over
//localstorage.clear()
//sessionstorage.clear()
$("#clearInfo").on("click", function(event){
  event.preventDefault();
  $("td").empty();
  database.ref().set("/", null)
})

database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val().trainName);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().trainTime);
  console.log(childSnapshot.val().frequency);

  var userTime = moment(childSnapshot.val().trainTime, "hh:mm");
  //the time that the user feeds into input
  var difference = moment().diff(moment(userTime), "minutes"); 
  // calculating the time now (moment()) b/n the user's time in minutes
  var timeRemaining = difference % childSnapshot.val().frequency;
  //calculates how much time is left based on the time & how frequently it comes (in minutes)
  var minsAway = childSnapshot.val().frequency - timeRemaining;
  var nextTrain = moment().add(minsAway, "minutes")

  console.log(userTime);
  console.log(difference);
  console.log(timeRemaining);
  console.log(minsAway);
  console.log(nextTrain);


  var addRow = $("<tr></tr>")
  //adding each individual cell(td) to each row(tr)
  addRow.append("<td>" + childSnapshot.val().trainName + "</td>")
  .append("<td>" + childSnapshot.val().destination + "</td>")
  .append("<td>" + childSnapshot.val().trainTime + "</td>")
  .append("<td>" + childSnapshot.val().frequency + "</td>")
  .append("<td>" + moment(nextTrain).format("hh:mm") + "</td>")
  .append("<td>" + minsAway + "</td>");
  $(".table").prepend(addRow);
});
});
