$(document).ready(function () {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyA7g6wlvwrhViE68i1zO6k6XZ3-GYd77RI",
        authDomain: "nosotras-d301f.firebaseapp.com",
        projectId: "nosotras-d301f",
        storageBucket: "nosotras-d301f.appspot.com",
        messagingSenderId: "388800746639",
        appId: "1:388800746639:web:c6974b6699c9df47dc4cfa",
        measurementId: "G-DJC9TZ7YSM"
      };
  
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
  
    // Inicializar Auth de Firebase
    const auth = firebase.auth();
  
    // Inicializar Auth de Google
    var provider = new firebase.auth.GoogleAuthProvider();
  
    // Inicializar Firestore (Base de datos)
    const db = firebase.firestore();
  
    // Inicializar Firestore (Base de datos)
    const storage = firebase.storage();
  
    // Inicializar Firestore (Base de datos)
    const storageRef = storage.ref();
  


    // Rergistrar los usuarios
    // Si no esta registrado, debe hacer click en boton registrar
   /*  $("#btnRegistro").click(function (e) {
      e.preventDefault();
      // Esto hará que el login desaparezca
      $("#login").hide();
      // Esto hara que el formulario de registro aparezca
      $(".registro-usuario").show();
    })
 */


  
    $("#registrate").click(function (e) {
      $("#btnRegistroConEmail").removeClass("d-none");
      $(".full-name-input").removeClass("d-none");
      $("#registrateAviso").addClass("d-none");
    //   $("#btnRegistroConEmail").addClass("d-none");
      $("#btnIngresoConEmail").addClass("d-none");
      $("#btnIngresoGmail").addClass("d-none");
    })
  
    // Si se completa el formulario de registro y se envia, registra al nuevo usuario y se guarda la sesion
    $("#btnRegistroConEmail").click(function (e) {
      e.preventDefault();
      // Capturamos los datos enviados por el formulario de registro
      // Campo full name
      var fullName = $("#ingresoFullName").val();

      // Campo email
      var email = $("#IngresoEmail").val();
      //Campo Password
      var password = $("#ingresoPassword").val();
      // Metodo de firebase que permite registro de usarios con email

      if (password.length<6) {
        alert(" ⚠️ Deben ser 6 carácteres como mínimo")
      };

      auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {

            console.log("Usuario Creado");
            addFullName(fullName);
          // limpiar formulario de registro
          $("#IngresoEmailForm").trigger("reset");
        })
        .catch((error) => { // Esto permite capturar el error, se puede trabajar este catch con los codigos de error
          var errorCode = error.code;
          var errorMessage = error.message;
          // Muestro en la consola el codigo de error y el mensaje de error
          if (error.code == 'auth/email-already-in-use') {
            $("#alert-login-registro").removeClass("d-none");
            $("#alert-login-registro").addClass("d-block");
          }
        });
  
    })
    //MODIFICANDO ESTA PARTE
    // Acceso de usuarios
    // Ingresar por email
    /* $("#btnIngresoEmail").click(function (e) {
      e.preventDefault();
      // Mostramos formulario de ingreso por email
      $("#IngresoEmail").show();
      // Ocultamos boton de ingreso por email
      $("#btnIngresoEmail").hide();
    }) */
  
    // Si ingresamos por correo y password mostramos formulario de ingreso 
    $("#btnIngresoConEmail").click(function (e) {
      e.preventDefault();
      // Capturamos los datos enviados por el formulario de ingreso
      // Campo email
      var email = $("#ingresoEmail").val();
      // Campo Password
      var password = $("#ingresoPassword").val();
      // Metodo que permite ingreso de usarios con email
      try {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(userCredential => {

            console.log("Usuario logueado con Email y contraseña")
            // limpiar formualrio de ingreso
            $("#IngresoEmailForm").trigger("reset");
            $("#alert-login").hide();
            $("#alert-login-2").hide();
            $("#alert-login-registro").hide();
          })
          .catch((error) => {// Esto permite capturar el error, se puede trabajar este catch con los codigos de error
            var errorCode = error.code;
            var errorMessage = error.message;
            // Muestro en la consola el codigo de error y el mensaje de error
            console.log(errorCode, errorMessage);
          });
      } catch (error) {
        if (error.code == 'auth/argument-error') {
          $("#alert-login").removeClass("d-none");
          $("#alert-login").addClass("d-block");
        }if (errorCode == "auth/user-not-found"){
            $("alert-login-2").removeClass("d-none");
            $("alert-login-2").addClass("d-block");

        }
      }
  
    })
  
  /*   $("#btnIngresoEmail").click(function (e) {
      e.preventDefault();
      // Mostramos formulario de ingreso por email
      $("#IngresoEmail").show();
      // Ocultamos boton de ingreso por email
      $("#btnIngresoEmail").hide();
    })
   */
    // Ingresar con google
    $("#btnIngresoGmail").click(function (e) {
      e.preventDefault();
      auth.signInWithPopup(provider)
        .then(result => {
          console.log("Ingreso con Google");
        })
        .catch(err => {
          console.log(err);
        })
    })
  
    
  
    // Desconexion de Usuarios
    // Boton LogOut
    $("#logout").click(function (e) {
      e.preventDefault();
      auth.signOut().then(() => {
        console.log("Log Out");
      })
    })
  
    // Ver si sesion esta activa
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Si usuario esta conectado
        // ocultamos el login
        $("#login").hide();
        // mostramos el contenido
        $("#contenidoWeb").show();
        obtienePost();
        $("#logout").show();

        obtienePosts();
        loadUserInfo();
      } else {
        $("#login").show()
        // Si usuario esta desconectado
        // Se oculta contenido de web
        $("#contenidoWeb").hide();
        // Se muestra el login
        $("#logout").hide()
        // $("#postList").hide();
        $("#btnRegistroConEmail").addClass("d-none");
        $(".full-name-input").addClass("d-none");
        $("#btnIngresoConEmail").removeClass("d-none");
        $("#btnIngresoConEmail").addClass("d-block");
        $("#btnIngresoGmail").addClass("d-block");
        $("#registrateAviso").removeClass("d-none");
        $("#registrateAviso").addClass("d-block");
      }
    });
  
     // Boton enviar formulario post
     $("#btnSendPost").click(function (e) {
      e.preventDefault();
      // Capturo los datos enviados desde el formulario con id "postForm"
      var mensaje = $("#postText").val();
  
      if (mensaje.length > 0) {
        // Metodo de escritura para añadir elementos a la coleccion "post", 
        // si la coleccion no existe, la crea implicitamente
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
        var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        const file = document.querySelector("#postFile").files[0];
        const user = firebase.auth().currentUser;
        let cantidadLikes = 0;
  
        db.collection("posts").add({
          cantlikes: cantidadLikes,
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours,
          date: datePostDB(),
          orderDate : orderDate(),
          idUser: user.uid ,
          userName : user.displayName,
          urltext: ""
  
        })
          .then((docRef) => {
            console.log("Los datos se guardaron correctamente");
            $("#postForm").trigger("reset");
           var id = docRef.id;
           if (file != null) {
             const name = strDate + "-" + strHours + "-" + file.name;
             agregarImagen(file, name, id);
           }
            obtienePosts();
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        alert('Favor completar todos los campos');
      }
  
    });
  
    //Actualizar publicacion o posteo
    $("#btnSavePost").click(function (e) {
      e.preventDefault();
      //Capturamos los datos enviados
      var mensaje = $("#postText").val();
      var id = $ ("#idPost").val();
  
      if (mensaje.length > 0) {
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
        var strHours = d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
  
        db.collection("posts").doc(id).update({
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours,
          date: datePostDB(),
          orderDate: orderDate(),
        })
        .then(() => {
          console.log("Posteo actualizado correctamente");
          $("postForm").trigger("reset");
          obtienePosts();
  
          $("#btnSendPost").show();
          $("#btnSavePost").hide();
  
        })
        .catch((error) => {
          console.log("El error en la actualización de los posteos es: ", error);
        });
      }else {
        alert("Por favor completar todos los campos")
      }
    })
  
    //Va a mostrar los datos en la vista
    function postList(data) {
      
      const user = firebase.auth().currentUser;
      if(data.length > 0) {
        $("#postList").empty();
        let html = "";
        data.forEach(doc => {
          contarLikes(doc.id)
          var post = doc.data();
          // contarLikes(doc.id)
          // console.log("vallor de data", doc.id)
         
         
          var div = ``;
          if (user.uid == post.idUser) {
            function myf1() {
              document.getElementById("btn-like").style.backgroundColor= "red";
            }
        
            function myf2() {
              document.getElementById("btn-like").style.backgroundColor = "blue";
            }
          
            console.log(post.cantlikes);
            div = `
            <div class="contenedorpostList" >
              <div class="card-body card bg-dark text-white" style="margin-top:20px; border-radius:2rem; ">
                <p class="fechaPost"> Publicado por ${post.userName}, el ${post.date}</p>
                <p class="mensajePublicado">${post.mensaje}</p>
                <img src="${post.urltext}" id="imagePost" class="mx-auto" style="align-item:center; justify-content:center; margin-top:20px; margin-bottom:20px;">
                
                <button data-id="${doc.id}" class="btn btn-success btn-edit-post bi bi-pencil">
                Editar
                </button>
                <button data-id="${doc.id}" class="btn btn-danger btn-delete-post bi bi-trash">
                  Eliminar
                </button>
                <button data-id="${doc.id}" id="btn-like" class=" likes "  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                  </svg>
                  <!--${cantidadLikes}--> Me gusta
                </button>
                <!-- <span>likes ${cantidadLikes}</span> -->
              </div>
            </div>
            `;
          } else {
            div = `
            <div class="contenedorpostList" style="">
              <div class="card-body card bg-dark text-white mx-auto" style="margin-top:20px; border-radius:2rem; ">
                <p class="fechaPost">  Publicado por ${post.userName}, el ${post.date}</p>
                <p class="mensajePublicado">${post.mensaje}</p>
                <img src="${post.urltext}" id="imagePost" class="mx-auto" style="align-item:center; justify-content:center; margin-top:20px; margin-bottom:20px;">
                
                <button data-id="${doc.id}" id="btn-like" class=" likes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                  </svg>
                  <!--${post.cantlikes}--> Me gusta
                </button>
                <!-- <span>likes ${cantidadLikes}</span> -->
              </div>
            </div>
            `;
          }
          html += div;
        });

        
          
          // let boton = document.getElementById("btn-like");
          // boton.addEventListener("click", myf1);
          // boton.addEventListener("click", myf2);
          // boton.addEventListener("mouseover", function(){boton.textContent="¡Hola!"});
          // boton.addEventListener("mouseout", function(){boton.textContent="No te vayas"});
      
      
          // function myf1() {
          //   document.getElementById("btn-like").style.backgroundColor= "red";
          // }
      
          // function myf2() {
          //   document.getElementById("btn-like").style.backgroundColor = "blue";
          // }
        

        
        
        $("#postList").append(html);
        var btnsEdit = document.querySelectorAll(".btn-edit-post");
        btnsEdit.forEach(btn => {
          btn.addEventListener("click", (e) => {
            var id = e.target.dataset.id;
            //Se le pasa el identificador a una funcion para actulizar dicho documento
            obtienePost(id);
          })
        })
        
        var btnsDelete = document.querySelectorAll(".btn-delete-post");
        btnsDelete.forEach(btn => {
  
          btn.addEventListener("click", (e) => {
            var id = e.target.dataset.id;
          deletePost(id);
          })
        })
  
        var btnsLike = document.querySelectorAll(".likes");
        btnsLike.forEach(btn => {
          btn.addEventListener("click", (e) => {
            console.log(e);
            var id = e.target.dataset.id;
          agregarLike(id);
          })
        })
      }
    }
  
    // Consulta y ordena los post del mas nuevo al mas antiguo
    function obtienePosts() {
      db.collection("posts").orderBy('orderDate', 'desc').get().then((querySnapshot) => {
            postList(querySnapshot.docs);
      })
  
  
      // fireSQL.query("SELECT * FROM posts inner join likes on likes.idPost = posts.id group by likes.idPost")
  
    };
  
    // Consulta y ordena los post del mas nuevo al mas antiguo
    // function obtienePost() {
    //   db.collection("posts").get().then((snapshot) => {
    //     postList(snapshot.docs);
    //   })
    // };
  
    //Funcion que actuliza un posteo
    function obtienePost(id) {
      db.collection("posts").doc(id).get().then((doc) => {
        var post = doc.data();
        $("#postText").val(post.mensaje);
        $("#idPost").val(id);
        $("#btnSendPost").hide();
        $("#btnSavePost").removeClass("d-none");
        $("#btnSavePost").show;
  
      }).catch((error) =>{
        console.log("El error es: ", error);
      })
    }
  
  
    
  
    //Funcion para el eliminar el post
    function deletePost(id) {
      db.collection("posts").doc(id).delete().then(() => {
        // Si se elimina el post
        obtienePosts();
        window.location.reload();
      }).catch((error) => {
        console.log("Error al eliminar el posteo", error)
      })
  
    }
  
    //Funcion que permite añadir url de la imagen al registro recien creado en firestore
    function agregarImagen(file, name, id){
      const metadata = {
        contentType: file.type
      }
      const uploadTask = storageRef.child(`images/${name}`).put(file, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STAGE_CHANGED,
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is' + progress + '%done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log(" Upload is paused")
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log(" Upload is running")
              break;
        
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              //El usuario no tiene permiso para acceder al objeto
              break;
            case 'storage/canceled':
              //El usuario cancela la carga
              break;
            case 'storage/unknow':
              //Unknow error ocurred, inspect error.serverResponse
              break;
          }
        },
  
        async () =>{
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          db.collection("posts").doc(id).update({
            urltext : url
          }).then(() => {
            window.location.reload();
          })
        }
        );
    }
  
    
  
    //Funcion para obtener el dia y la hora en español
     const datePostDB = () => {
      const datePost = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };
      const timePost = {
        hour12: 'true',
        hour: 'numeric',
        minute: 'numeric',
      };
    
      const date = new Date().toLocaleDateString('es-Es', datePost);
      const time = new Date().toLocaleTimeString('es-Es', timePost);
      const dateTime = `${date} ${time}`;
    
      return dateTime;
    };
    
    const orderDate = () => {
      const dateNow = new Date();
      const year = dateNow.getFullYear();
      const month = `0${dateNow.getMonth()}`.slice(-2);
      const day = `0${dateNow.getDate()}`.slice(-2);
      const hour = `0${dateNow.getHours()}`.slice(-2);
      const minute = `0${dateNow.getMinutes()}`.slice(-2);
      const second = `0${dateNow.getSeconds()}`.slice(-2);
      return parseInt(`${year}${month}${day}${hour}${minute}${second}`, 0);
    };
  
  
    // Metodo que sirve para mostrar los países en la tabla
  //   function postList(data) {
  //     $("#postList").empty();
  //     if (data.length > 0) {
  //       let html = '';
  //       data.forEach(doc => {
  //         const post = doc.data();
  //         const div = `
  //           <div class="card  text-black  mt-4 display-10 p-0" style="border-radius: 1rem; width: 600px;display:block" id="contenedorpostList">
  //             <div class="card-body" >
  //               <p>${post.mensaje}</p>
  //               <p>Publicado el ${post.fecha} a las ${post.hora}</p>
  //             </div>
  //           </div>
  //         `;
  //         html += div;
  //       });
  //       $("#postList").append(html);
  //     }
  //   };
  // ;
  
    function loadUserInfo(){
      const user = firebase.auth().currentUser;
      let html = "";
      if (user !== null ) {
        const displayName = user.displayName;
        const email = user.email;
        var photoURL = "";
        if (user.photoURL != null) {
          photoURL = user.photoURL;
        }else{
          photoURL = "https://toppng.com/uploads/preview/user-font-awesome-nuevo-usuario-icono-11563566658mjtfvilgcs.png";
        }
        const emailVerified = user.emailVerified;
        const uid = user.uid;
  
        html = 
            `
          <div class="card-body text-center " >
          <div style="align-items:center; justify-content:center; ">
            <div id="contenedorUser" class="text-center;">
              <img id="userPhoto" src="${photoURL}" class="rounded-circle" style="width: 100px;"  
            </div>
            <div id="userInfo" class="text-center" >
              <h3>${displayName}</h3>
              <h4>${email}</h4>
            </div>
            </div>
          </div>
            `;
        $("#userInfo").append(html);
      }
    }
  
    //Funcion para agregar nombre despues de crear un usuario nuevo
    function addFullName(fullName){
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: fullName
      }).then(() => {
        // Recargo despues de agregar nombre de usuario
        window.location.reload();
      }).catch((error) => {
  
      });
    }
  
    async function agregarLike(id){
      var espuesta =await userTieneLike(id);
       
      if(tieneLike == 1){
        console.log("NO PUEDE VOLVER A DAR LIKE");
      }else {
        const user = firebase.auth().currentUser;
        const idUser =  user.uid;
        const like = $(".likes");
        db.collection("likes").add({
          User: idUser,
          Fecha: '',
          idPost: id,
        }).then(() => {
          // contarLikes(id)
        // obtieneLikes();
        })
      }
      
    }
  
  
      
  });
  