// ------------------- hamburger menu -----------------------
const bar = document.querySelector('.navbar');
const p = document.querySelector('.nav p');
const form = document.querySelector('.sidemenu');


bar.addEventListener('click', () => {
  form.classList.toggle('list-active');
  bar.classList.toggle('toggle');
  p.classList.toggle('none');
});


// ------------------------- main -------------------------------
// ------------------------- login ------------------------------
$('.signupLink').on('click', () => {
  $('.login').hide();
  $('.signup').fadeIn();
})

// ------------------------- signup ------------------------------
$('.loginLink').on('click', () => {
  $('.signup').hide();
  $('.login').fadeIn();
})