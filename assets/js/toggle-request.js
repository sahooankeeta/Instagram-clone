class ToggleRequest {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleRequest();
  }

  toggleRequest() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      //console.log("preventing default");

      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          if (data.data.unrequested == true) {
            $(self).html("follow");
          } else {
            $(self).html("cancel request");
          }
        })
        .fail(function (errData) {
          //console.log("error in completing the request");
        });
    });
  }
}
