// $(document).ready(function (){
//     setTimeout(function () {
//         $("#myModal").modal('hide');
//     }, 2000);
// });


document.getElementById("btn_menu").addEventListener("click", mostrar_menu);

document.getElementById("btn_close").addEventListener("click", ocultar_menu);

nav = document.getElementById("nav");


function mostrar_menu(){

  
    nav.style.display = "block";
}

function ocultar_menu(){


    nav.style.display = "none";
}