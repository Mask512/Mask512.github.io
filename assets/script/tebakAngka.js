let play = true;
let hp = prompt("Masukan Jumlah kesempatan yang kamu mau: ");
alert(`Tebak angka dari 1 - 10 \nKamu punya ${hp} kesempatan`);
const comp = Math.ceil(Math.random() * 10);
//alert(comp);
let ans;
const kurang = "Tebakanmu terlalu kecil";
const lebih = "Tebakanmu terlalu besar" ;
const gagal = "Kesempatan anda habis";
while (play && hp != "0" ) {       
    ans = prompt(`Tebakanmu: `);
    hp -= 1;
    if (ans == comp) {
        alert(`Selamat anda benar! Jawabannya adalah ${comp}`);
        play = false;
    } else if (ans < comp) {
        if (hp == 0) {
            alert(`${kurang}\n${gagal}\nJawabannya adalah ${comp}`);    
        } else {
            alert(`${kurang}\nKesempatan anda tersisa ${hp}`);
        }
    } else {
        if (hp == 0) {
            alert(`${kurang}\n${gagal}\nJawabannya adalah ${comp}`);
        } else {            
        alert(`${lebih}\nKesempatan anda tersisa ${hp}`);
        }
    }   
}
alert('Terima kasih telah bermain');

if(confirm('Main Lagi?')){
   window.location.reload();}

