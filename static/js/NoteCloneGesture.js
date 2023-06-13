import SetNoteImagesWidth, { setImageFiles } from "./CommonFunc.js";

export let handler = function () {
  console.log($('input[name="csrfmiddlewaretoken"]').val());
  const NoteId = $(this).parent().attr("value");
  const $thisNote = $(this).parent();

  // Function to create a CSRFToken
  function getCSRFToken() {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, 10) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
  }
  var csrfToken = getCSRFToken();

  // create the custom form
  var formHTML =
    '<form class="form-clone" method="POST" enctype="multipart/form-data" class="w-50 mx-auto">' +
    '<input type="hidden" name="csrfmiddlewaretoken" value="' +
    csrfToken +
    '">' +
    '<div class="form-clone-content">' +
    '<div class="form-clone-content-images"></div>' +
    '<input type="text" class="form-title" maxlength="30" placeholder="Title(50)"><br>' +
    '<textarea class="form-textarea" placeholder="Content"></textarea><br>' +
    '<div class="clone-features">' +
    '<div class="form-navbar">' +
    '<button type="button" data-tooltip="Thông báo"><i class="bi bi-bell"></i></button>' +
    '<button type="button" data-tooltip="Chọn màu nền"><i class="bi bi-palette"></i></button>' +
    '<label for="id_image-clone" class="btn btn-secondary btn-icon custom-file-upload" data-tooltip="Thêm ảnh"><i class="bi bi-image"></i></label>' +
    '<input type="file" name="images" multiple id="id_image-clone" class="d-none" />' +
    '<button data-tooltip="Lưu trữ" type="button" id="store-btn"><i class="bi bi-box-arrow-down"></i></button>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</form>";

  // create a form container to add the custom form
  var $formCloneContainer = $("<div></div>");
  $formCloneContainer.attr("class", "form-clone-container");
  $formCloneContainer.html(formHTML);

  var $noteInfo = $(this).parent().find(".note-info");
  var title = $noteInfo.find("h5").text();
  var content = $noteInfo.find("p").text();

  $formCloneContainer.find(".form-title").val(title);
  var $FormContent = $formCloneContainer.find(".form-textarea");
  $FormContent.val(content);

  var $formCloneContainImages = $formCloneContainer.find(
    ".form-clone-content-images"
  );
  var $NoteImages = $(this).parent().find("img").clone();
  $NoteImages.appendTo($formCloneContainImages);
  $NoteImages.each(function (index) {
    $(this).css("width", "100%");
  });

  $("body").css("position", "relative");
  $("body").append($formCloneContainer);

  function setFormData(formData) {
    var $title = $formCloneContainer.find(".form-title").val();
    var $content = $formCloneContainer.find(".form-textarea").val();
    var $newImages = $("#id_image-clone")[0].files;
    for (var i = 0; i < $newImages.length; i++) {
      formData.append("newImages", $newImages[i]);
    }
    formData.append("ids", imageModelsIds);
    formData.append("noteId", NoteId);
    formData.append("title", $title);
    formData.append("content", $content);
  }

  var $storeBtn = $formCloneContainer.find("#store-btn");
  $storeBtn.on("click", function () {
    var formData = new FormData($(".form-clone")[0]);
    formData.append("requestType", "type2");
    setFormData(formData);
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
        console.log("yeah");
        $formCloneContainer.remove();
        $thisNote.remove();
        $("#notes-container").masonry("destroy");
        $("#notes-container").masonry({
          itemSelector: ".note",
        });
        $("#stored").css("display", "flex");
        setTimeout(() => {
          $("#stored").css("display", "none");
        }, 3000);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  // Create a div for the close button and add it to the navbar
  const $closeDiv = $("<div>").addClass("close-div");
  $("<button>")
    .attr("data-tooltip", "Đóng")
    .addClass("close-btn")
    .html("&times;")
    .appendTo($closeDiv);

  // Append both divs to the note-navbar div
  var $noteNavbar = $formCloneContainer.find(".clone-features");
  $noteNavbar.append($closeDiv);

  var imageModelsIds = [];

  // sent Ajax POST request to submit and modify the change from user and close the form
  var $closeButton = $(".close-btn");
  $closeButton.on("click", function (event) {
    event.preventDefault();
    if (
      $rootContent != $(".form-textarea").val() ||
      $rootTitle != $(".form-title").val() ||
      $rootImages != $("#id_image-clone")[0].files
    ) {
      var formData = new FormData();
      formData.append("requestType", "type1");
      setFormData(formData);
      var current_url = window.location.href; //get the current url to keep staying after request successfully
      $.ajax({
        url: "/modify/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
          "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
        },
        success: function (response) {
          window.location.href = current_url;
          console.log(response.newImages);
        },
        error: function (error) {
          console.log(error);
        },
      });
      $formCloneContainer.remove();
    } else {
      $formCloneContainer.remove();
      return;
    }
  });

  $(".form-clone-content-images img").each(function (index) {
    var $button = $("<button>", {
      text: "X",
      id: `${index}`,
      class: "noteRemoveBtn",
    });
    const image_container = $("<div>")
      .addClass("image-container")
      .css("position", "relative")
      .attr("id", "image-" + (index + 1))
      .append($(this))
      .append($button);

    $formCloneContainImages.append(image_container);

    $button.on("click", function () {
      var $imageModelsId = $(this).parent().children("img").attr("value");
      imageModelsIds.push(Number($imageModelsId));
      /* if the image remove button is clicked then get that image id
        and remove it form the "total_files"*/
      var $imageId = $(this).parent().attr("id");
      $imageId = Number($imageId.charAt($imageId.length - 1));
      $(this).parent().remove();
      SetNoteImagesWidth($formCloneContainImages, ".image-container");
    });
  });

  SetNoteImagesWidth($formCloneContainImages, ".image-container");

  var $rootTitle = $formCloneContainer.find(".form-title").val();
  var $rootContent = $formCloneContainer.find(".form-textarea").val();
  var $rootImages = $("#id_image-clone")[0].files;

  var total_files = [];

  $("#id_image-clone").on("change", (event) => {
    $("body").height("20px");
    $("body").height("auto");

    console.log("changed");
    const changedInput = event.target;
    const inputId = $(changedInput).attr("id");
    // get the selected files
    const files = $(`#${inputId}`)[0].files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      total_files.push(file);

      const img = $("<img>")
        .attr("src", URL.createObjectURL(file))
        .addClass("note-image p-1 w-100");

      const image_container = $("<div>")
        .addClass("image-container")
        .css("position", "relative")
        .attr("id", "image-" + (i + 1))
        .append(img);

      var $button = $("<button>", {
        text: "X",
        class: "noteRemoveBtn",
      });

      setImageFiles(total_files, inputId);

      image_container.append($button);
      image_container.find("button").on("click", function () {
        $(this).parent().remove();
        var $imageId = $(this).parent().attr("id");
        console.log($imageId);
        $imageId = Number($imageId.charAt($imageId.length - 1));
        total_files = $.grep(total_files, function (element, index) {
          return index !== $imageId - 1;
        });
        setImageFiles(total_files, inputId);
        SetNoteImagesWidth($formCloneContainImages, ".image-container");
      });
      $(".form-clone-content-images").append(image_container);
    }
    SetNoteImagesWidth($formCloneContainImages, ".image-container");
  });
};

export default function NoteCloneGesture() {
  $(".current_url").val(window.location.href); // set current_url value for stored_btn and remove_btn
  // When click on the note, then bring the note to front with bigger size to let custom it
  $("body").on("click", ".note-images, .note-info", handler);
}
