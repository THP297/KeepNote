import { selectedNotes, notesToDelete } from "./SelectedNotesNavbar.js";
/* This function to set the images width when user choose in the form 
and also used for setting the note images width */
export default function SetNoteImagesWidth(ImageContainer, Children) {
  var $ImageContainer = ImageContainer;
  var imageCount = $ImageContainer.children(Children).length;
  var imagesPerRow = 3;
  if (imageCount >= 3) {
    var rows =
      imageCount % imagesPerRow !== 0
        ? Math.round(imageCount / imagesPerRow)
        : imageCount / imagesPerRow;
    for (var i = 0; i <= rows; i++) {
      var $rowImages = $ImageContainer
        .children(Children)
        .slice(i * imagesPerRow, (i + 1) * imagesPerRow);

      var rowImagesLength = $rowImages.length;
      $rowImages.css("width", "calc(" + 100 / rowImagesLength + "%)");
    }
  } else {
    for (var i = 0; i < 2; i++) {
      var $rowImages = $ImageContainer
        .children(Children)
        .slice(i * imagesPerRow, (i + 1) * imagesPerRow);

      var rowImagesLength = $rowImages.length;
      $rowImages.css("width", "calc(" + 100 / rowImagesLength + "%)");
    }
  }
}

// This function to update the image input file if user choose image multiple times in the form
function setImageFiles(total_files, inputId) {
  const dataTransfer = new DataTransfer();
  total_files.forEach((file) => {
    dataTransfer.items.add(file);
  });
  $(`#${inputId}`)[0].files = dataTransfer.files;
}

// handle the Form gesture if user does note focus on it
function backFormStyles() {
  $(".add_images_button").show();
  $(".note-title, .features").hide();
  $(".note-content").css("border", "none");
  $(".note-content textarea").css(
    "box-shadow",
    "2px 2px 5px rgba(150, 147, 147, 0.5), -2px -2px 5px rgba(150, 147, 147, 0.5), -2px 2px 5px rgba(150, 147, 147, 0.5)"
  );
  $(".note-content ").css("box-shadow", "none");

  $(".form-navbar-button").css("background-color", "transparent");
  $(".note-content").css("background-color", "white");
  $(".note-content").find(".note-title").css("background-color", "white");
  $(".note-content").find(".note-textarea").css("background-color", "white");
}

//Remove the notes on the UI after successfully solve request and make change in the database
function SelectedNotesNavbarSuccess(navbar, announceTypeId) {
  for (let i = 0; i < notesToDelete.length; i++) {
    notesToDelete[i].remove();
  }
  // remove and rerun the masonry again to adjusting the notes
  $("#notes-container").masonry("destroy");
  $("#notes-container").masonry({
    itemSelector: ".note",
  });
  // set the amount of selected notes to the announce panel
  var $amountOfNotes = $(announceTypeId).find("span");
  $amountOfNotes.text(notesToDelete.length);
  $amountOfNotes.css("color", "red");
  //remove selected notes
  selectedNotes.length = 0;
  notesToDelete.length = 0;
  navbar.find("span").text(selectedNotes.length);
  // display the announce panel in three seconds
  $(announceTypeId).css("display", "flex");
  setTimeout(() => {
    $(announceTypeId).css("display", "none");
  }, 3000);
}
export { setImageFiles, backFormStyles, SelectedNotesNavbarSuccess };

// Function to create a CSRFToken
// function getCSRFToken() {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = jQuery.trim(cookies[i]);
//       if (cookie.substring(0, 10) === "csrftoken=") {
//         cookieValue = decodeURIComponent(cookie.substring(10));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }
// var csrfToken = getCSRFToken();
