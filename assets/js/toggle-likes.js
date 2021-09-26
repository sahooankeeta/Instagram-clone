class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    // console.log(toggleElement);

    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      // console.log(e);
      e.preventDefault();
      let self = this;
      console.log("preventing default");

      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          console.log(data);
          let likesCount = parseInt($(self).attr("data-likes"));
          console.log(likesCount);
          if (data.data.deleted == true) {
            likesCount -= 1;

            $(self)
              .children("svg")
              .children("use")
              .attr("xlink:href", "/image/sprite.svg#icon-heart-outlined");
          } else {
            likesCount += 1;

            $(self)
              .children("svg")
              .children("use")
              .attr("xlink:href", "/image/sprite.svg#icon-heart");
          }

          $(self).attr("data-likes", likesCount);

          $(self)
            .closest(".post-comment")
            .children(".post-comment-block")
            .children(".post-comment-stat")
            .children(".comment-unit")
            .html(likesCount);
        })
        .fail(function (errData) {
          console.log("error in completing the request", err);
          return res.redirect("back");
        });
    });
  }
}
