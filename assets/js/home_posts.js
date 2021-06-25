{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      let data = new FormData($("#new-post-form")[0]);
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
          //console.log("after success ", data);
          let newPost = newPostDom(data.data.post);
          $(".post-feed").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));

          // call the create comment class
          new PostComments(data.data.post._id);

          // CHANGE :: enable the functionality of the toggle like button on the new post
          new ToggleLike($(" .toggle-like-button", newPost));

          new Noty({
            theme: "relax",
            text: "Post published!",
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
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    // CHANGE :: show the count of zero likes on this post
    return $(`<div id="post-${post._id}" class="post-dialog">
    <div class="post-header">
      <a href="#"
        ><img class="post-header-image" src="${post.user.avatar}"
      /></a>
      <a class="post-header-name" href="/users/profile/${post.user._id}"
        ><b>${post.user.username}</b></a
      >
      <div class="post-header-more">
       
        <a class="delete-post-button" href="/posts/destroy/${post._id}">
          <svg class="post-header-more-icon">
            <use xlink:href="/image/sprite.svg#icon-circle-with-cross"></use>
          </svg>
        </a>
        
      </div>
    </div>
    <img src="${post.image}" alt="" class="post-image" />
  
    <div class="post-content">
      <div class="post-caption">
        <a href="#">
          <img class="post-caption-user" src="${post.user.avatar}" />
        </a>
  
        <p class="post-caption-body">
          <a href="#" class="post-caption-username">${post.user.username}</a>
          <span class="post-caption-content">${post.caption}</span>
        </p>
      </div>
      <div id="post-comments-${post._id}" class="post-comments">
       
      </div>
      <div class="post-stats">
        <div class="post-stats-icons">
          <a
            data-likes="${post.likes.length}"
            href="/posts/toggle/${post._id}"
            class="post-stats-icon icon-heart toggle-like-button"
          >
            
            
            <svg class="">
              <use xlink:href="/image/sprite.svg#icon-heart-outlined"></use>
            </svg>
            
          </a>
          <a href="#" class="post-stats-icon post-stats-comment">
            <svg class="">
              <use xlink:href="/image/sprite.svg#icon-bubble2"></use>
            </svg>
          </a>
          <a href="#" class="post-stats-icon">
            <svg class="">
              <use xlink:href="/image/sprite.svg#icon-direction"></use>
            </svg>
          </a>
        </div>
        <p class="post-stats-count">
          <span class="popup-stats-unit">${post.likes.length}</span> likes
        </p>
      </div>
      
      <form
        id="post-${post._id}-comments-form"
        class="post-comments-form"
        action="/comments/create"
        method="POST"
      >
        <input
          type="text"
          name="content"
          placeholder="Add comments . . ."
          required
        />
        <input type="hidden" name="post" value="${post._id}" />
        <button type="submit">Post</button>
      </form>
      
    </div>
  </div>
  `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
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
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $(".post-feed .post-dialog").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      //  new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
