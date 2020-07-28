const profile = document.getElementById(`about-me`);
const myProfile = document.getElementsByTagName(`aside`)[0];

profile.onclick = ()=> {
myProfile.style.display = "block";
}

const closeProfile = document.querySelector(`.btn-profile`);

closeProfile.onclick = ()=> {
myProfile.style.display = "none";    
}

