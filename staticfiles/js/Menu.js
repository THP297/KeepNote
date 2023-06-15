export default function Menu() {
  const $clearBtn = $(".clear-input");
  const $searchForm = $(".search-form");
  const $inputField = $("#my-search");

  $clearBtn.hide();

  $clearBtn.on("click", function () {
    $inputField.val("");
  });

  $searchForm.on("focusout", function () {
    $(".search-form").css("box-shadow", "none");
    /* when click on the clearBtn it will trigger this function so this is to delay hiding the clearBtn
    to make it's function run first */
    setTimeout(() => {
      $clearBtn.hide();
    }, 100);
  });

  // show the clear button when the input field is focused
  $searchForm.on("focusin", function () {
    $clearBtn.show();
    $(".search-form").css(
      "box-shadow",
      "rgba(0, 0, 0, 0.07) 0px 1px 1px,\n" +
        "rgba(0, 0, 0, 0.07) 0px 2px 2px,\n" +
        "rgba(0, 0, 0, 0.07) 0px 4px 4px,\n" +
        "rgba(0, 0, 0, 0.07) 0px 8px 8px,\n" +
        "rgba(0, 0, 0, 0.07) 0px 16px 16px"
    );
  });

  // refresh the page when refresh button is clicked
  $("#refresh-btn").on("click", function () {
    location.reload();
  });
}
