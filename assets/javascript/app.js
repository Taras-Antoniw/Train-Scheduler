
//<script src="https://www.gstatic.com/firebasejs/5.5.8/firebase.js"></script>

  // Initialize Firebase
  // Use TA-Second-Project
  var config = {
    apiKey: "AIzaSyBEWJRgsyt8IsptW7EBukkrZ3QXkqwtIXw",
    authDomain: "ta-second-project.firebaseapp.com",
    databaseURL: "https://ta-second-project.firebaseio.com",
    projectId: "ta-second-project",
    storageBucket: "ta-second-project.appspot.com",
    messagingSenderId: "1018412819925"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
//initialize variables;
var numTrains = 0;


//pull from database
setInterval (function (){
$("#train-schedule").html("");  
database.ref("/trainschedule").on("child_added",function(snapshot) {
  if (snapshot.child("trainName").exists){
    //console.log("It exists");
    //var m2 = new Date().getMinutes();
    var m2 = parseInt(moment().get("minute"));
    var h2 = parseInt(moment().get("hour"));
    var currentTimeMinutes = m2+h2*60;
    //console.log("Hours "+h2+"Minutes "+m2);
    //console.log("Current time in minutes "+currentTimeMinutes);
    //console.log(m2);
  var $div=$("<tr>");
    //$div.attr("id","Item-"+numTrains);
  $div.append("<td>"+snapshot.val().trainName +"</td>");
  //console.log("train name");
  $div.append("<td>"+snapshot.val().destination + "</td>");
  //console.log("destination");
  var hFrequency = parseInt(snapshot.val().frequency);
  $div.append("<td>"+hFrequency + "</td>");
  //console.log("frequency " + hFrequency);
  var hNextTrain = 0;
  var firstTrain = snapshot.val().firstTrain;
  var hHours = parseInt(moment(firstTrain, "HH").format("HH"));
  var hMinutes = parseInt(moment(firstTrain, "mm").format("mm"));
  //console.log("Intial Train "+firstTrain);
  //console.log("Init Hours "+hHours+"Init Minutes "+ hMinutes);
  var initialTimeMinutes = hHours * 60 + hMinutes;
  //console.log("Initial time in minutes "+initialTimeMinutes)
  for (i = initialTimeMinutes; i<currentTimeMinutes; i=i+hFrequency) {
    hNextTrain = hNextTrain + hFrequency;
  } 
  hNextTrain = initialTimeMinutes + hNextTrain;
  hNextTrainTime = moment().startOf("day").add(hNextTrain, "minutes").format("HH.mm");
   
  //console.log("next train "+hNextTrainTime);
  $div.append("<td>"+hNextTrainTime+"</td>");
  var minAway = hNextTrain - currentTimeMinutes;
  $div.append("<td>"+minAway+"</td>");
  $("#train-schedule").append($div);
  }
  });
}, 1000);
  //end pull from database


//submit route
$("#submit-route").on("click", function(event) {
    event.preventDefault();
    var fTrainName = $("#train-name").val().trim();
    var fDestination = $("#destination").val().trim();
    var fFirstTrain = $("#first-train").val().trim();
    var fFrequency = $("#frequency").val().trim();
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");

    //push to database
    database.ref("/trainschedule").push ({
      trainName: fTrainName,
      destination: fDestination,
      firstTrain: fFirstTrain,
      frequency: fFrequency,
    
    });
});
//end submit route

  //time clock

  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $("#currentTime").html("Current Time: " + h + ":" +m);
    var t = setTimeout(startTime, 500);
    
    
  // end time clock  
  }
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}