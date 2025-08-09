const menuButton = document.getElementById("menu");
const navMobile = document.querySelector(".nav-mobile");

menuButton.addEventListener("click", function () {
  menuButton.classList.toggle("open");
  navMobile.classList.toggle("open");
});

document.getElementById("currentyear").textContent = new Date().getFullYear();

document.getElementById(
  "lastModified"
).textContent = `Last Modified: ${document.lastModified}`;

document.getElementById("form-timestamp").value = new Date().toISOString();
