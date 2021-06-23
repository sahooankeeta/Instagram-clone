// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleFollow {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleFollow();
  }

  toggleFollow() {
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
          let followersCount = parseInt($(self).attr("data-followers"));
          console.log(followersCount);
          if (data.data.unfollowed == true) {
            followersCount -= 1;
            $(self).html("follow");
          } else {
            followersCount += 1;
            $(self).html("unfollow");
          }
          $(self).attr("data-followers", followersCount);
          $(self)
            .parent()
            .next()
            .children(".stat-followers")
            .children(".followers-unit")
            .html(followersCount);

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
