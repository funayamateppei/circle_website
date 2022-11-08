// ------------------- hamburger menu -----------------------
const bar = document.querySelector('.navbar');
const p = document.querySelector('.nav p');
const login = document.querySelector('.loginDisplay');


bar.addEventListener('click', () => {
  login.classList.toggle('list-active');
  bar.classList.toggle('toggle');
  p.classList.toggle('none');
});


// ------------------------- main -------------------------------