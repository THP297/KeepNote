import SetNoteImagesWidth from "./CommonFunc.js";
import { firstCallback, secondCallback } from "./SelectedNotesNavbar.js";
export default function NoteGesture() {
  $(".note").each(function () {
    $(this).css("background-color", $(this).attr("backgroundColor"));
  });
  // color button
  var colorButtonClicked = false;
  var previousClickedColorButtonId = null;
  var $colorButtons = $(".note").find(".color");
  $colorButtons.each(function (index, element) {
    var $thisNote = $(this).parent().parent();
    $(this).on("click", function () {
      if (colorButtonClicked == false) {
        $thisNote.off("mouseleave");
        $thisNote.off("mouseenter");
        previousClickedColorButtonId = $(this).parent().parent().attr("value");
        colorButtonClicked = !colorButtonClicked;
        $(this).find(".palette").css("display", "flex");
      } else {
        if (
          previousClickedColorButtonId ==
          $(this).parent().parent().attr("value")
        ) {
          $thisNote.on("mouseleave", secondCallback);
          $thisNote.on("mouseenter", firstCallback);
          $(this).find(".palette").css("display", "none");
          previousClickedColorButtonId = null;
          colorButtonClicked = false;
        } else {
          $thisNote.off("mouseleave");
          $thisNote.off("mouseenter");
          var previousClickedColorButton = $(
            ".note[value='" + previousClickedColorButtonId + "']"
          );
          previousClickedColorButton
            .find(".note-navbar")
            .css("display", "none");
          previousClickedColorButton.find(".palette").css("display", "none");

          previousClickedColorButton.on("mouseleave", secondCallback);
          previousClickedColorButton.on("mouseenter", firstCallback);

          previousClickedColorButtonId = $(this)
            .parent()
            .parent()
            .attr("value");
          $(this).find(".palette").css("display", "flex");
        }
      }
    });
  });

  $colorButtons.find(".palette button").each(function () {
    var $note = $(this).parent().parent().parent().parent();
    var noteId = $(this).parent().parent().parent().parent().attr("value");
    var backgroundColor = $(this).attr("value");
    $(this).on("click", function () {
      $.ajax({
        url: "/change_color/",
        type: "POST",
        data: JSON.stringify({
          type: "type1",
          noteId: noteId,
          backgroundColor: backgroundColor,
        }),
        processData: false,
        contentType: false,
        headers: {
          "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (response) {
          $note.css("background-color", response.background_color);
          console.log(response.background_color);
          console.log(response.noteId);
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  });

  //Set Note images width
  $("#notes-container .note").each(function () {
    var $noteImageContainer = $(this).find(".note-image-container");
    SetNoteImagesWidth($noteImageContainer, "img");
  });
  $("#notes-container").masonry({
    itemSelector: ".note",
  });

  $("#note__id_image").on("change", (event) => {
    const NoteId = $(`#${event.target.id}`).parent().parent().attr("value");
    var Data = new FormData();
    var $Images = $("#note__id_image")[0].files;
    for (var i = 0; i < $Images.length; i++) {
      Data.append("Images", $Images[i]);
    }
    Data.append("id", NoteId);
    Data.append("requestType", "type2");

    for (var pair of Data.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }
    var current_url = window.location.href; //get the current url to keep staying after request successfully

    $.ajax({
      url: "/modify/",
      type: "POST",
      data: Data,
      processData: false,
      contentType: false,
      headers: {
        "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
      },
      success: function (response) {
        window.location.href = current_url;
        console.log(response.success);
        console.log(response.id);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
}
