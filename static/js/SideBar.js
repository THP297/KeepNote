export default function SideBar() {
  var urlLinks = $(".parent");
  // Remove highlight from all URL links
  urlLinks.removeClass("highlighted");

  // Get the current URL
  var currentUrl = window.location.pathname;

  // Find the corresponding URL link and highlight its parent div
  urlLinks.each(function () {
    var linkUrl = $(this).find("a").attr("href");
    if (linkUrl === currentUrl) {
      $(this).addClass("highlighted");
    }
  });
}
