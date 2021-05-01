// getting page element for day in header
var currentDay = $("#currentDay");
//getting page element of all timeblocks
var timeBlocks = $(".row");
// expressing current time on load as variable
var now = moment(); 
// retrieves string of array of saved items
var savedNotes = localStorage.getItem("savedNotes");
var localNotes

// converts string to array or creates empty array if none exists
if (!savedNotes) {
    localNotes = [];
} else {
    localNotes = JSON.parse(savedNotes);
}

// displays current day
currentDay.text(now.format("dddd, MMMM Do"));

// changes colors for each in timeblocks relative to current time
timeBlocks.each(function() {
    //getting timeblock "header" hour
    hourText = $(this).children('.hour').text();
    //getting time in same format as header hour
    hourNow = now.format('hA');
    //getting fillable text area
    noteBlock = $(this).children('textarea');
    
    // compares header hour to current hour and changes colors based on result of isBefore and isAfter
    if (hourText === hourNow) {
        noteBlock.addClass("present"); 
    } else if (moment(hourText ,"hA").isBefore()) {
        noteBlock.addClass("past"); 
    } else if (moment(hourText,"hA").isAfter()) {
        noteBlock.addClass("future"); 
    }
})

// renders saved notes on page load
renderNotes();

// saves text content of fillable areas on button click
$(".row").delegate("button", "click", function() {
    event.stopPropagation();

    note = $(this).siblings("textarea").val(); 
    time = $(this).siblings(".hour").text();

    schedule = {"time": time, "note": note};

    saveNote(schedule);
});

function saveNote(scheduledNote) { 
    //checks to see if localNotes array is populated with savable notes time marker
    if (localNotes.some(notes => notes.time === scheduledNote.time)) {
        // loops through localNotes to find that same time marker and changes object.note entry
        for (i = 0; i < localNotes.length; i++) {
            if (localNotes[i].time == scheduledNote.time) {
                localNotes[i] = scheduledNote;
            }
        }
    } else {
        localNotes.push(scheduledNote);
    }

    alert(scheduledNote.time +" note saved");

    localStorage.setItem("savedNotes", JSON.stringify(localNotes));

}

// loops through retrieved notes and adds text to relevant timeblock id's textarea
function renderNotes() {
    for (i = 0; i < localNotes.length; i++) {
        blockID = "#" + localNotes[i].time;
        noteText = localNotes[i].note;
        $(blockID).children('textarea').text(noteText);
    }
}