import { handler } from "./NoteCloneGesture.js";
import { SelectedNotesNavbarSuccess } from "./CommonFunc.js";
var selectedNotes = [];
var notesToDelete = [];

// these two callback function below used for handle the note-navbar and the note select button
export let firstCallback = function () {
  $(this).find(".note-navbar").css({
    display: "flex",
    position: "absolute",
    bottom: "5px",
  });
  $(this).find(".selected").css("display", "flex");
};

export let secondCallback = function () {
  // Code to execute when the mouse leaves the element
  $(this).find(".note-navbar").css("display", "none");
  $(this).find(".selected").css("display", "none");
};

// set the hover event to the note with the two above callback functions
export let hoverEvent = $(".note").hover(firstCallback, secondCallback);

export default function SelectedNotesNavbar() {
  // display note_title and note-navbar when click on the text area
  var $rootSelectedNotesNavbar = $(".selectedNotes-navbar");
  /* turn on the note gestures and close the selectedNavbar 
  when user click on the selectedNavbar's close button */
  $rootSelectedNotesNavbar.find(".turnOff").on("click", function () {
    $rootSelectedNotesNavbar.css("display", "none");
    selectedNotes = [];
    var $selected = $(".selected");
    $selected.find("button").css("background-color", "white");
    $selected.find("i").css("color", "black");
    $selected.css("display", "none");
    hoverEvent.on("mouseleave", secondCallback);
    hoverEvent.on("mouseenter", firstCallback);
    $("body").on("click", ".note-images, .note-info", handler);
  });

  // display palette when the color button be clicked else hides it
  var colorButtonClicked = false;
  $rootSelectedNotesNavbar.find(".color").on("click", function () {
    if (!colorButtonClicked) {
      $(this).find(".palette").css("display", "flex");
      colorButtonClicked = !colorButtonClicked;
    } else {
      $(this).find(".palette").css("display", "none");
      colorButtonClicked = !colorButtonClicked;
    }
  });

  // send request when a button in palette be clicked
  $rootSelectedNotesNavbar.find(".palette button").each(function () {
    var backgroundColor = $(this).attr("value");
    $(this).on("click", function () {
      $.ajax({
        url: "/change_color/",
        type: "POST",
        data: JSON.stringify({
          type: "type2",
          selectedNotes: selectedNotes,
          backgroundColor: backgroundColor,
        }),
        processData: false,
        contentType: false,
        headers: {
          "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (response) {
          // change the background color of the notes
          var changeColorNotesId = response.selectedNotesId;
          for (let Id = 0; Id < changeColorNotesId.length; Id++) {
            var $note = $(".note[value='" + changeColorNotesId[Id] + "']");
            $note.css("background-color", response.background_color);
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  });

  // Handle function when user want to select multiple notes
  $(".selected").on("click", function () {
    var $thisNote = $(this).parent(); // get the note just be clicked
    var $noteId = $(this).parent().attr("value"); // get the id of the note
    var selected = $(this).attr("value") === "true";
    selected = !selected; // set to True because then note just be clicked
    $(this).attr("value", String(selected));
    if (selected) {
      //add the selectedNotes list to handle later
      selectedNotes.push($noteId);
      $(this).find("button").css("background-color", "black");
      $(this).find("i").css("color", "white");
    } else {
      // if false that's mean user click the selected button again then we remove this note from the selected list
      selectedNotes = selectedNotes.filter((note) => note !== $noteId);
      console.log(selectedNotes);
      $(this).find("button").css("background-color", "white");
      $(this).find("i").css("color", "black");
    }

    // the second condition to handle the gesture of the note and selectedNavbar
    if (selectedNotes.length > 0) {
      /* if user click area in range of the note then we turn the creating note clone function and 
      the note-navbar gesture. Then display the selectedNavbar */
      $("body").off("click", ".note-images, .note-info");
      $(".selected").css("display", "flex");
      $(".note-navbar").css("display", "none");
      hoverEvent.off("mouseleave");
      hoverEvent.off("mouseenter");
      $rootSelectedNotesNavbar.css("display", "flex");
      $rootSelectedNotesNavbar.find("span").text(selectedNotes.length);
    } else {
      /* this mean there's no note selected then we hide the selectedNavbar 
      and turn on the note gestures back */
      $(".selected").css("display", "none");
      hoverEvent.on("mouseleave", secondCallback);
      hoverEvent.on("mouseenter", firstCallback);
      $rootSelectedNotesNavbar.css("display", "none");
      $("body").on("click", ".note-images, .note-info", handler);
      console.log("ok");
    }
  });

  /* two line of codes below are getting the two button in the garbage template */
  var $removeBtn = $rootSelectedNotesNavbar.find(".selectedNotes-removeBtn");
  var $storeBtn = $rootSelectedNotesNavbar.find(".selectedNotes-storeBtn");
  function SelectedNotesNavbarHandler(
    $buttonType,
    url,
    requestMethod,
    requestType,
    announceTypeId
  ) {
    $buttonType.on("click", function () {
      $.ajax({
        url: url,
        type: requestMethod,
        data: JSON.stringify({
          selectedNotes: selectedNotes,
          type: requestType,
        }),
        processData: false,
        contentType: false,
        headers: {
          "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (response) {
          // filter notes to delete on the UI
          selectedNotes.forEach(function (element, index) {
            var note = $('.note[value="' + element + '"]');
            notesToDelete.push(note);
          });
          SelectedNotesNavbarSuccess(
            $rootSelectedNotesNavbar,
            announceTypeId,
            notesToDelete,
            selectedNotes
          );
          notesToDelete = [];
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  }
  SelectedNotesNavbarHandler(
    $removeBtn,
    "/garbage/",
    "DELETE",
    "type2",
    "#notes_removed"
  );
  SelectedNotesNavbarHandler(
    $storeBtn,
    "/store/",
    "POST",
    "type3",
    "#notes_stored"
  );
}
// The below function for selectedNavbar but in the garbage template
export function removeNotesNavbar() {
  var $removeNotesNavbar = $("#removeNotes-navbar");
  var $deleteBtn = $removeNotesNavbar.find(".selectedNotes-deleteBtn");
  var $recoverBtn = $removeNotesNavbar.find(".selectedNotes-recoverBtn");
  function removeNotesNavbarHandler(
    $buttonType,
    requestMethod,
    announceTypeId
  ) {
    // send a specific request when user click on a specific button
    $buttonType.on("click", function () {
      $.ajax({
        url: "/garbage/", // this is the specific url set in the "urls" (not the name)
        type: "DELETE", // send ajax request with "DELETE" method
        data: JSON.stringify({
          selectedNotes: selectedNotes, // send notes to delete (or recover) to handle in the RemoveView
          type: requestMethod, // send the request type to handle in the RemoveView
        }),
        /* these two line of codes below should be put into ajax request */
        processData: false,
        contentType: false,
        // give the csrf token value, This is required for the request to be sent
        headers: {
          "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (response) {
          // filter notes to delete on the UI
          selectedNotes.forEach(function (element, index) {
            var note = $('.note[value="' + element + '"]');
            notesToDelete.push(note);
          });
          //function to solve after successfully send request
          SelectedNotesNavbarSuccess(
            $removeNotesNavbar,
            announceTypeId,
            notesToDelete,
            selectedNotes
          );
          notesToDelete = [];
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  }
  removeNotesNavbarHandler($deleteBtn, "type3", "#notes_deleted");
  removeNotesNavbarHandler($recoverBtn, "type4", "#notes_recovered");
}
