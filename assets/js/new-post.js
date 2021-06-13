document.querySelector(".header-post").addEventListener("click", function () {
  document.querySelector(".new-post").classList.remove("hide");
});
document
  .querySelector(".new-post-submit")
  .addEventListener("click", function () {
    document.querySelector(".new-post").classList.add("hide");
  });
