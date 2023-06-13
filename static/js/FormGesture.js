import SetNoteImagesWidth, {
  setImageFiles,
  backFormStyles,
} from "./CommonFunc.js";

export default function NoteFormGesture() {
  // this script to set the textarea height to be flex based on the height of the user input in the form
  $("#id_content").on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
  // hide the add image icon of the custom form above
  if (!$(".note-form")) {
    $(".custom-file-upload i").hide();
  }

  const $storedButton = $("#store-btn");
  // Directly create and store the note when user click on the stored button
  $storedButton.on("click", function () {
    var formData = new FormData($(".note-form")[0]);
    formData.append("requestType", "type1");
    var current_url = window.location.href; //get the current url to keep staying after request successfully
    $.ajax({
      url: "/store/",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
      },
      success: function (response) {
        if (response.stored == true) {
          // remove all content of the form when successfully store the note
          $(".note-content textarea").val(initialContent);
          $(".note-title").val(initialTitle);
          $("#id_image").val(initialImages);
          backFormStyles();
          // display the announce panel in three seconds
          $("#stored").css("display", "flex");
          setTimeout(function () {
            $("#stored").css("display", "none");
          }, 3000);
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  const $noteContentTextarea = $(".note-content textarea");
  const $noteTitle = $(".note-title");
  const $idImage = $("#id_image");
  const $addImagesButton = $(".add_images_button");
  const $noteContent = $(".note-content");

  var initialContent = $(".note-content textarea").val();
  var initialTitle = $(".note-title").val();
  var initialImages = $("#id_image").val();

  var noteFocused = false;

  // In the default, title and features field are hidden
  $noteTitle.add(".features").hide();
  $noteContentTextarea.css(
    "box-shadow",
    "2px 2px 5px rgba(150, 147, 147, 0.5), -2px -2px 5px rgba(150, 147, 147, 0.5), -2px 2px 5px rgba(150, 147, 147, 0.5)"
  );

  // show title and features when textarea is clicked or form image has changed
  $noteContentTextarea.add($idImage).on("click change", function () {
    noteFocused = true;
    $noteTitle.add(".features").show();
    $addImagesButton.hide();
    $(".note-content *").css("border", "none");
    $noteContentTextarea.css("box-shadow", "none");
    $noteContent.css(
      "box-shadow",
      "2px 2px 5px rgba(150, 147, 147, 0.5), -2px -2px 5px rgba(150, 147, 147, 0.5), -2px 2px 5px rgba(150, 147, 147, 0.5)"
    );
  });

  // submit when clicked anywhere outside of note-content
  $(document).click(function (event) {
    var targetClassName = event.target.className;
    /* if click outside the note and do not click on the remove image button
     then submit the form */
    if ($(event.target).is("body")) {
      // If the note has changed in title, content or image then submit the form
      if (
        noteFocused === true &&
        ($(".note-content textarea").val() != initialContent ||
          $(".note-title").val() != initialTitle ||
          $("#id_image").val() != initialImages)
      ) {
        $(".note-form").submit();
      } // else just hide the note elements to the beginning
      else {
        backFormStyles();
      }
    }
  });

  var total_files = [];
  // Display the images that user has chose to the form
  $("#id_image").on("change", (event) => {
    const changedInput = event.target;
    const inputId = $(changedInput).attr("id");
    // get the selected files
    var files = $(`#${inputId}`)[0].files;
    files = Array.from(files);

    // create image element to add to the ".note-content-images"
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(typeof file, file);
      total_files.push(file);
      const img = $("<img>")
        .attr("src", URL.createObjectURL(file))
        .addClass("note-image p-1 w-100");

      const image_container = $("<div>")
        .addClass("image-container")
        .css("position", "relative")
        .append(img);

      $(".note-content-images").append(image_container);
    }

    // Add id with the index to each image to make easier to remove
    $(".note-content-images div").each(function (index) {
      $(this).attr("id", "image-" + (index + 1));
      var $button = $("<button>", {
        text: "X",
        id: `${index}`,
        class: "noteRemoveBtn",
      });
      $(this).append($button);
      $(this)
        .find("button")
        .on("click", function () {
          /* if the image remove button is clicked then get that image id 
          and remove it form the "total_files"*/
          $(this).parent().remove();
          var $imageId = $(this).parent().attr("id");
          $imageId = Number($imageId.charAt($imageId.length - 1));
          total_files = $.grep(total_files, function (element, index) {
            return index !== $imageId - 1;
          });
          setImageFiles(total_files, inputId);
        });
    });
    // else just automatically update to amount of image input file element
    setImageFiles(total_files, inputId);
    /* Set the width of css of each images to be displayed flexible */
    SetNoteImagesWidth($(".note-content-images"), ".image-container");
  });
}
