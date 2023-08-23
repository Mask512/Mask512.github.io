const menuToggle = document.querySelector(".menu-toggle");
const myProfile = document.getElementById("my-profile");
const header = document.getElementsByTagName("header")[0];
const navLinks = document.querySelectorAll(".link");

menuToggle.addEventListener("click", function () {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
  menuToggle.textContent = navLinks.classList.contains("active")
    ? "close"
    : "menu";
});

function displayModal() {
  const modal = document.getElementById("modal");
  modal.classList.toggle("active");
}

myProfile.addEventListener("click", displayModal);
window.addEventListener("click", function (e) {
  if (e.target.id == "modal") {
    displayModal();
  }
});

window.addEventListener("scroll", function () {
  if (this.scrollY > header.clientHeight) {
    navLinks.forEach((link) => {
      link.classList.add("scrolled");
    });
  } else {
    navLinks.forEach((link) => {
      link.classList.remove("scrolled");
    });
  }
});

console.log(Map);