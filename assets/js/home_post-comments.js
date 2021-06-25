class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);
    console.log("const created");
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
      let self = this;
      console.log("creating");
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          console.log(data);
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));

          // CHANGE :: enable the functionality of the toggle like button on the new comment
          new ToggleLike($(" .toggle-like-button", newComment));
          new Noty({
            theme: "relax",
            text: "Comment published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
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
     
      <svg class="">
        <use xlink:href="/image/sprite.svg#icon-heart"></use>
      </svg>
      
      <svg class="">
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
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
