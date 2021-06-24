// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ViewPost {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.viewPost();
  }

  viewPost() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      console.log($(self).attr("href"));
      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          console.log(data.post.user);

          function openModal() {
            dialog.classList.remove("hide");
            overlay.classList.remove("hide");
            popup.classList.remove("hide");
          }
          const closeModal = function () {
            console.log("preview close");
            dialog.classList.add("hide");
            overlay.classList.add("hide");
            popup.classList.add("hide");
            popup.innerHTML = "";
          };

          const markupPost = ` <div class="post-popup-overlay hide"></div><div class="post-popup-dialog hide">
          <a class="close-model"
            ><svg class="post-popup-delete">
              <use xlink:href="/image/sprite.svg#icon-circle-with-cross"></use>
            </svg>
          </a>
          <img src="${data.post.image}" alt="" class="post-popup-image" />
          <div class="popup-header">
            <a href="/users/profile/${data.post.user._id}"
              ><img class="popup-header-image" src="${data.post.user.avatar}"
            /></a>
            <a class="popup-header-name" href="/users/profile/${data.post.user._id}"><b>${data.post.user.name}</b></a>
            <div class="popup-header-more">
              <svg class="popup-header-more-icon">
                <use xlink:href="/image/sprite.svg#icon-dots-three-horizontal"></use>
              </svg>
            </div>
          </div>
          <div class="popup-content">
          <div class="popup-caption">
          <a href="#">
            <img class="popup-caption-user" src="${data.post.user.avatar}" />
          </a>
    
          <p class="popup-caption-body">
            <a href="#" class="popup-caption-username">${data.post.user.username}</a>
            <span class="popup-caption-content">${data.post.caption}</span>
          </p>
        </div>
            <div class="popup-comments">
              
            </div>
            <div class="popup-stats">
              <div class="popup-stats-icons">
                <a href="#" class="popup-stats-icon">
                  <svg class="">
                    <use xlink:href="/image/sprite.svg#icon-heart-outlined"></use>
                  </svg>
                </a>
                <a href="#" class="popup-stats-icon">
                  <svg class="">
                    <use xlink:href="/image/sprite.svg#icon-bubble2"></use>
                  </svg>
                </a>
                <a href="#" class="popup-stats-icon">
                  <svg class="">
                    <use xlink:href="/image/sprite.svg#icon-direction"></use>
                  </svg>
                </a>
              </div>
              <p class="popup-stats-count">
                <span class="popup-stats-unit">${data.post.likes.length}</span> likes
              </p>
            </div>
            <form class="popup-comments-form" action="#">
              <input type="text" name="comment" placeholder="Add comments . . ." />
              <button type="submit">Post</button>
            </form>
          </div>
        </div>`;

          document
            .querySelector(".post-popup")
            .insertAdjacentHTML("beforeend", markupPost);
          for (let i = 0; i < data.post.comments.length; i++) {
            let comment = data.post.comments[i];
            let markupComment = `<div class="popup-comment">
            <a href="/users/profile/${comment.user._id}">
              <img class="popup-comment-user" src="${comment.user.avatar}" />
            </a>
    
            <p class="popup-comment-body">
              <span class="popup-comment-username">${comment.user.username}</span>
              <span class="popup-comment-content"
                >${comment.content}</span
              >
            </p>
            <a class="popup-comment-like" href="/comments/toggle/${comment._id}">
              <svg>
                <use xlink:href="/image/sprite.svg#icon-heart-outlined"></use>
              </svg>
            </a>
            <a class="popup-comment-delete" href="/comments/destroy/${comment._id}">
              <svg>
                <use
                  xlink:href="/image/sprite.svg#icon-circle-with-cross"
                ></use>
              </svg>
            </a>
          </div>`;
            document
              .querySelector(".popup-comments")
              .insertAdjacentHTML("beforeend", markupComment);
          }
          const overlay = document.querySelector(".post-popup-overlay");
          const dialog = document.querySelector(".post-popup-dialog");
          const popup = document.querySelector(".post-popup");
          const closeBtn = document.querySelector(".close-model");
          openModal();
          overlay.addEventListener("click", closeModal);
          closeBtn.addEventListener("click", closeModal);
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  }
}
