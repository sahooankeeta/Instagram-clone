class DeleteRequest {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.deleteRequest();
  }

  deleteRequest() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      //console.log("preventing default");

      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          if (data.data.deleted == true) {
            $(self).closest(".notification-item").remove();
          }
        })
        .fail(function (errData) {
          //console.log("error in deleting notification");
        });
    });
  }
}
