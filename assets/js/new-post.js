console.log("runnung");
document
  .querySelector(".forgot-password")
  .addEventListener("click", function () {
    document.querySelector(".resetForm").classList.toggle("hide");
    document.querySelector(".signIn-form").classList.toggle("hide");
    document.querySelector(".overlay-signup a").innerHTML = "sign in";
    document.querySelector(".overlay-signup a").href = "back";
  });

document.querySelector(".header-post").addEventListener("click", function () {
  document.querySelector(".new-post").classList.remove("hide");
});
document
  .querySelector(".new-post-submit")
  .addEventListener("click", function () {
    document.querySelector(".new-post").classList.add("hide");
  });
