let nama = prompt(`Masukan namamu :`);
alert(`Selamat datang kak ${nama}. Silahkan membaca :D`)


const profile = document.getElementById(`about-me`);
const myProfile = document.getElementsByTagName(`aside`)[0];

profile.onclick = ()=> {
myProfile.style.display = "block";
}

const closeProfile = document.querySelector(`.btn-profile`);

closeProfile.onclick = ()=> {
myProfile.style.display = "none";    
}


const html = document.getElementById(`html`);
const css = document.getElementById(`css`);
const js = document.getElementById(`js`);

html.onclick = ()=> {
    html.scrollIntoView({ behavior: 'smooth', block: 'end'})
}

css.onclick = ()=> {
    css.scrollIntoView({ behavior: 'smooth', block: 'end'})
}

js.onclick = ()=> {
    js.scrollIntoView({ behavior: 'smooth', block: 'end'})
}

const mybutton = document.getElementById("top-btn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 250 ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
