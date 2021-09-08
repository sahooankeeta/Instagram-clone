console.log("runnung");
const headerPost = document.querySelector(".header-post");
const newPostForm = document.querySelector(".new-post");
const forgotPassword = document.querySelector(".forgot-password");
const search = document.querySelector(".header-search");

if (search) {
  search.addEventListener("submit", function (e) {
    e.preventDefault();
  });
}

if (headerPost) {
  headerPost.addEventListener("click", function () {
    document.querySelector(".new-post").classList.remove("hide");
  });
}
if (newPostForm) {
  newPostForm.addEventListener("submit", function () {
    document.querySelector(".new-post").classList.add("hide");
    newPostForm.querySelector(".emojionearea-editor").innerHTML = "";
    newPostForm.querySelector(".new-post-file").value = "";
  });
  newPostForm.addEventListener("click", function (e) {
    if (e.target.closest(".new-form-close"))
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
document.addEventListener("click", function (e) {
  if (e.target.getAttribute("class") == "post-stats-comment") {
    let comment = e.target.parentNode.parentNode.parentNode.nextElementSibling;

    comment.querySelector(".emojionearea-editor").focus();
  }
});
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
if (slides) {
  let cur = 0;
  const maxSlide = slides.length - 1;
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * i}%)`;
  });
  const createDots = function () {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `
<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();
  const activeDot = function (slide) {
    const dots = document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"`)
      .classList.add("dots__dot--active");
  };
  const goToSlide = function (slide) {
    if (slide == 0) btnLeft.classList.add("hide");
    else btnLeft.classList.remove("hide");
    if (slide == maxSlide) btnRight.classList.add("hide");
    else btnRight.classList.remove("hide");
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    activeDot(slide);
  };
  goToSlide(0);
  const nextSlide = function () {
    cur++;
    goToSlide(cur);
  };
  const prevSlide = function () {
    cur--;
    btnLeft.style.display = "block";
    goToSlide(cur);
  };
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      goToSlide(e.target.dataset.slide);
    }
  });
}
