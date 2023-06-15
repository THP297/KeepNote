export default function RemoveNote() {
  $(document).on("click", "#delete-note", function (event) {
    event.preventDefault(); // Prevent the default action of the click event
    var $thisNote = $(this).parent().parent();
    var noteId = $(this).data("note-id");
    var nameValue = $(this).attr("name");
    // Send an AJAX request with the DELETE method
    $.ajax({
      url: "/garbage/",
      type: "DELETE",
      processData: false,
      contentType: false,
      headers: {
        "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
      },
      data: JSON.stringify({ note_id: noteId, name: nameValue, type: "type1" }),
      success: function (response) {
        console.log(response.type);
        // remove the note after successful make request
        $thisNote.remove();
        $("#notes-container").masonry("destroy");
        $("#notes-container").masonry({
          itemSelector: ".note",
        });
        // display the deleted announcement
        $("#delete").css("display", "flex");
        // hide the deleted announcement after 3 seconds
        setTimeout(() => {
          $("#delete").css("display", "none");
        }, 3000);
      },
      error: function (xhr, errmsg, err) {
        console.log(err);
      },
    });
  });

  $(document).on("click", "#delete-notes", function (event) {
    event.preventDefault(); // Prevent the default action of the click event

    var noteId = $(this).data("note-id");
    var nameValue = $(this).attr("name");
    // Send an AJAX request with the DELETE method
    $.ajax({
      url: "/garbage/",
      type: "DELETE",
      processData: false,
      contentType: false,
      headers: {
        "X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
      },
      data: JSON.stringify({ note_id: noteId, name: nameValue, type: "type1" }),
      success: function (response) {
        window.location.href = response.redirect_url;
        console.log(response.type);
      },
      error: function (xhr, errmsg, err) {
        console.log(err);
      },
    });
  });
}
