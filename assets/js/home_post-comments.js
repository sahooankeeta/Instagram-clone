class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    // if (window.location.href.indexOf("profile") > -1) {
    //   this.postContainer = $(`.profile-image-block`);
    // }
    this.postContainer = $(`#post-${postId}`);
    //this.postContainer = $(`.xy`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = $(this);

      $.ajax({
        type: "post",
        url: "/comments/create",
        data: self.serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $('input[type="text"]').val("");
          $(".emojionearea-editor").html("");
          if (window.location.href.indexOf("posts") > -1) {
            $(` .popup-comments`).append(newComment);
          } else {
            $(`#post-comments-${postId}`).append(newComment);
          }

          pSelf.deleteComment($(" .delete-comment-button", newComment));

          new ToggleLike($(" .toggle-like-button", newComment));
          new Noty({
            theme: "relax",
            text: "COMMENT PUBLISHED!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          // console.log(error);
        },
      });
    });
  }

  newCommentDom(comment) {
    // CHANGE :: show the count of zero likes on this comment

    return $(`<div id="comment-${comment._id}" class="post-comment">
    <a href="#">
      <img class="post-comment-user" src="${comment.user.avatar}" />
    </a>
    <div class="post-comment-block">
      <p class="post-comment-body">
        <a href="/users/profile/${comment.user}" class="post-comment-username"
          >${comment.user.username}</a
        >
        <span class="post-comment-content">${comment.content}</span>
      </p>
      <p class="post-comment-stat">
        <span class="post comment-unit">${comment.likes.length}</span> likes
      </p>
    </div>
    
    <a
      data-likes="${comment.likes.length}"
      class="post-comment-like"
      href="/comments/toggle/${comment._id}"
    >
     
      <svg class="icon-heart">
        <use xlink:href="/image/sprite.svg#icon-heart-outlined"></use>
      </svg>
      
    </a>
   
  
    <a
      class="post-comment-delete delete-comment-button"
      href="/comments/destroy/${comment._id}"
    >
      <svg>
        <use xlink:href="/image/sprite.svg#icon-circle-with-cross"></use>
      </svg>
    </a>
    
  </div>
  `);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: "relax",
            text: "COMMENT DELETED",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          //console.log(error.responseText);
        },
      });
    });
  }
}
