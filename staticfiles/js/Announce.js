export default function AnnounceController() {
  var currentParams = window.location.search; // get the param sent along with the request URL
  var currentUrl = window.location.href;
  var urlParams = new URLSearchParams(currentParams); // convert url params to object
  var storedValue = urlParams.get("stored"); // get param value
  var removedValue = urlParams.get("removed"); // get param value

  // These 3 lines of code below to get the root url without the params
  var urlObj = new URL(currentUrl);
  urlObj.searchParams.delete("stored");
  var rootURL = urlObj.origin + urlObj.pathname;

  // check if has stored params then remove the note and adjust the note-container
  if (storedValue) {
    $("#stored").css("display", "flex"); // display the stored announcement

    // create an async function to hide the stored announcement after 3 seconds
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function asyncCode() {
      // set the url the be the root of url without the params
      window.history.pushState(null, "", rootURL);
      // also set the current_url input to be the root of url for the next requests
      $(".current_url").val(rootURL);
      await delay(3000);
      $("#stored").css("display", "none");
    }
    asyncCode();
  }

  // the code below is the same
  if (removedValue) {
    console.log($("#removed"));
    $("#removed").css("display", "flex");

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function asyncCode() {
      window.history.pushState(null, "", rootURL);
      $(".current_url").val(rootURL);
      await delay(3000);
      $("#removed").css("display", "none");
    }
    asyncCode();
  }
}
