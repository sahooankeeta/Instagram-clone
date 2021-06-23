// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      console.log("preventing default");
      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
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
          if ($(self).attr("class") == "post-comment-like") {
            $(self)
              .parent()
              .children(".post-comment-block")
              .children(".post-comment-stat")
              .children(".comment-unit")
              .html(likesCount);
          } else {
            $(self)
              .parent()
              .next()
              .children(".popup-stats-unit")
              .html(likesCount);
          }

          // console.log($(self).parent().next().children("popup-stats-unit"));
          // console.log($(self).children("svg").children("use"));
          //$(self).children("svg").children("use").attr("xlink:href", "/image/sprite.svg#icon-heart");
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  }
}
