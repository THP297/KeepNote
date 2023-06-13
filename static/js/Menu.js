export default function Menu() {
  const $clearBtn = $(".clear-input");
  const $inputField = $(".search-form");

  $clearBtn.hide();
  // show the clear button when the input field is focused
  $inputField.on("focusin", function () {
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

  $inputField.on("focusout", function () {
    $(".search-form").css("box-shadow", "none");
    $clearBtn.hide();
  });

  // clear the input field when the clear button is clicked
  $clearBtn.click(function () {
    if ($inputField.val() !== "") {
      $inputField.val("");
      $(".search-form").submit();
    }
  });

  // refresh the page when refresh button is clicked
  $("#refresh-btn").on("click", function () {
    location.reload();
  });
}
