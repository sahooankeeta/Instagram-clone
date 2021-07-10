console.log("runnung");
const headerPost = document.querySelector(".header-post");
const newPostSubmit = document.querySelector(".new-post-submit");
const forgotPassword = document.querySelector(".forgot-password");
const search = document.querySelector(".header-search");
if (search) {
  search.addEventListener("submit", function (e) {
    e.preventDefault();
  });
}
// document
//   .querySelector(".post-comments-form")
//   .addEventListener("submit", function (e) {
//     console.log(e.target.elements.getAttribute(".input-comment"));
//   });

if (headerPost) {
  headerPost.addEventListener("click", function () {
    document.querySelector(".new-post").classList.remove("hide");
  });
}
if (newPostSubmit) {
  newPostSubmit.addEventListener("click", function () {
    document.querySelector(".new-post").classList.add("hide");
  });
}
if (forgotPassword) {
  forgotPassword.addEventListener("click", function () {
    document.querySelector(".resetForm").classList.toggle("hide");
    document.querySelector(".signIn-form").classList.toggle("hide");
    document.querySelector(".overlay-signup a").innerHTML = "sign in";
    document.querySelector(".overlay-signup a").href = "/users/sign-in";
  });
}
