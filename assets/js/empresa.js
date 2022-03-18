$(document).ready(function () {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
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
  
    // Inicializar Auth de Firebase (correo y contraseña)
    const auth = firebase.auth();
  
    // Inicializar Auth de Google
    const provider = new firebase.auth.GoogleAuthProvider();
  
    // Inicializar Firestore (base de datos)
    const db = firebase.firestore();
  
    // Inicializar Firebase Storage
    const storage = firebase.storage();
    // Crear referencia del Storage
    var storageRef = storage.ref();
  
    //------------------------------------------------------------------
  
    $("#registrate").click(function (e) {
        console.log("hola");
      $("#btnRegistroConEmail").removeClass("d-none");
      $(".full-name-input").removeClass("d-none");
      $("#registrateAviso").addClass("d-none");
    //   $("#btnRegistroConEmail").addClass("d-none");
    $("#btnIngresoConEmail").removeClass("d-block");
    $("#btnIngresoGmail").removeClass("d-block");
    $("#btnIngresoConEmail").hide();
    $("#btnIngresoGmail").hide();
    $(".extras").removeClass("d-none");
    $(".extras").addClass("d-block");
    $(".btn-back").removeClass("d-none");
    $(".btn-back").addClass("d-block");
    })
  
    // Registro de Usuarios
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
      var rol = $("#rol").val();
      // Metodo de firebase que permite registro de usarios con email

      var nombreEmpresa = $("#nombreEmpresa").val();

      var rubro = $("#rubro").val();

      var tema = $("#tema").val();

      if (password.length<6) {
        alert(" ⚠️ Deben ser 6 carácteres como mínimo")
      };

      auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {

            var user = userCredential.user;
			db.collection("usuarios").add({
				nombre: fullName,
				email: email,
				id_auth: user.uid,
                nombreEmpresa: nombreEmpresa,
                rubro: rubro,
                tema: tema,
				rol: rol,
			})

            $("#container-temario").removeclass("d-none");
            $("#container-temario").addclass("d-none");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
  
          // ..
          if (errorCode == 'auth/email-already-in-use') {
            $("#alert-login-registro").removeClass("d-none");
            $("#alert-login-registro").addClass("d-block");
          }
        });
  
    });
  
    // Login con email y contraseña
    $("#btnIngresoConEmail").click(function (e) {
      e.preventDefault();
      var email = $("#IngresoEmail").val();
      var password = $("#ingresoPassword").val();
  
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
  
  
          $("#IngresoEmailForm").trigger("reset");
          $("#alert-login").hide();
          $("#alert-login-2").hide();
          $("#alert-login-registro").hide();
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
  
          if (errorCode == 'auth/argument-error' || errorCode == "auth/wrong-password") {
            $("#alert-login").removeClass("d-none");
            $("#alert-login").addClass("d-block");
          } if (errorCode == "auth/user-not-found") {
            $("#alert-login-2").removeClass("d-none");
            $("#alert-login-2").addClass("d-block");
          }
  
        });
    });
  
    // Login con Google
    $("#btnIngresoGmail").click(function (e) {
      e.preventDefault();
      auth
        .signInWithPopup(provider)
        .then((result) => {
  
        }).catch((error) => {
  
        })
    });
  
    // Desconexion de Usuarios
    $("#logout").click(function (e) {
      e.preventDefault();
      auth.signOut().then(() => {
  
    
        $("#userInfo").empty();
      }).catch((error) => {
        // An error happened.
      });
    })
  
    // Manejo de Sesiones
    auth.onAuthStateChanged((user) => {
      location.reload;
      if (user) {
        $("#login").hide();
        $("#contenidoWeb").show();
        $("#logout").show();
        // Invoco el metodo obtienesPosts() para poder mostrar todos los posteos
        obtienePosts();
        loadUserInfo();
  
  
  
      } else {
        $("#login").show();
        $("#contenidoWeb").hide();
        $("#logout").hide();
  
        $("#btnRegistroConEmail").addClass("d-none");
        $(".full-name-input").addClass("d-none");
        $("#btnIngresoConEmail").removeClass("d-none");
        $("#btnIngresoConEmail").addClass("d-block");
        $("#btnIngresoGmail").addClass("d-block");
        $("#registrateAviso").removeClass("d-none");
        $("#registrateAviso").addClass("d-block");
      }
    });

    $("#btnSendContenido").click(function(e) {
        e.preventDefault();
        var titulo = $("#ingresoTitulo").val();
        var texto = $("#ingresoTexto").val();
        var imagen = $("#ingresoImagen").val();
        var link = $("#ingresoLink").val();

        if(titulo.lenght > 0 && texto.lenght > 0 && imagen ==! null) {
            db.collection("formulario").add ({
                titulo: titulo,
                texto: texto,
                imagen: imagen,
                link: link
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                $("#IngresoContenidoForm").trigger("reset");
                obtieneFomulario();
            })
            .catch((error) => {
                console.log("Error adding document")
            });
        } else {
            alert("Favor completar todos los campos")
        }
    });

    function setupFormulario (data) {
        $("#dataFormato").empty();
        if (data.lenght > 0) {
            let html = '';
            data.forEach(doc => {
                const topic = doc.data();
                const tr = `
                
                <div class="container mt-5" id="container-fomularios">
                    <div class="container  h-100" id="login">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div class="card bg-pink text-white" id="containercard" style="border-radius: 1rem;">
                                    <div class="card-body p-5 text-center">
                                        <div class="mb-md-5 mt-md-4">
                                            <h2 class="text-center d-6 upercase">${titulo}</h2>
                                            <hr>
                                            <br>
                                            <div> 
                                            <p>${texto}</p>
                                            </div>
                                            <br>
                                            <div class="w-100"> 
                                            <img src="${imagen}">
                                            </div>
                                            <hr>
                                            <br>
                                            <h3>Links<h3>
                                            <button class="btn btn-outline-dark"><a href="${link}">${link}</a></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div>
                    </div>
                </div>

                `;

                html += tr;
            });
            $("#dataFormato").append(html);
        }
    }

    function obtieneFomulario() {
        db.collection("formulario").get().then((snapshot) => {
            setupFormulario(snapshot.docs);
        })
    }


  
    // Crear registro (Publicación o posteo)
    $("#btnSendPost").click(function (e) {
      e.preventDefault();
      // Capturo los datos enviados desde el formulario
      var mensaje = $("#postText").val();
  
      if (mensaje.length > 0) {
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        const file = document.querySelector("#postFile").files[0];
        const user = firebase.auth().currentUser;
  
  
        db.collection("posts").add({
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours,
          date: datePostDB(),
          orderDate: orderDate(),
          idUser: user.uid,
          userName: user.displayName,
          urltext: ""
        })
          .then((docRef) => {
  
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
        alert("Favor completar todos los campos");
      }
    })
  
    // Actualizar registro (Publicación o posteo)
    $("#btnSavePost").click(function (e) {
      e.preventDefault();
      // Capturo los datos enviados desde el formulario
      var mensaje = $("#postText").val();
      var id = $("#idPost").val();
  
      if (mensaje.length > 0) {
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  
        db.collection("posts").doc(id).update({
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours,
          date: datePostDB(),
          orderDate: orderDate(),
        })
          .then(() => {
  
            $("#postForm").trigger("reset");
            obtienePosts();
  
            $("#btnSendPost").show();
            $("#btnSavePost").hide();
  
          })
          .catch((error) => {
            console.error("Error actualizando posteo: ", error);
          });
      } else {
        alert("Favor completar todos los campos");
      }
    })
  
    // Va a mostrar los datos en la vista
    function postList(data) {
      const user = firebase.auth().currentUser;
      if (data.length > 0) {
        $("#postList").empty();
        let html = "";
        data.forEach(doc => {
          var post = doc.data();
          var div = ``;
          if (user.uid == post.idUser) {
            div = `
            <div class="card bg-dark text-white  mt-3 mx-auto" style="max-width: 800px;">
              <div class="card-body">
                <p>${post.mensaje}</p>
              
                
                <img src="${post.urltext}" id="imagePost" class= "imagen_post">
                <div class="rateit" data-rateit-mode="font">
                </div>
                <p>Publicado por ${post.userName}, el ${post.date}</p>
                <button data-id="${doc.id}" class="btn btn-success btn-edit-post bi bi-pencil">
                  Editar
                </button>
                <button data-id="${doc.id}" class="btn btn-danger btn-delete-post bi bi-trash">
                  Eliminar
                </button>
              </div>
            </div>
          `;
          } else {
            div = `
            <div class="card bg-dark text-white  mt-3 mx-auto" style="max-width: 800px;">
              <div class="card-body">
                <p>${post.mensaje}</p>
                <img src="${post.urltext}" id="imagePost" class= "imagen_post">
                <div class="rateit" data-rateit-mode="font">
                </div>
                <p>Publicado por ${post.userName}, el ${post.date}</p>
              </div>
            </div>
          `;
          }
  
          html += div;
        });
        $("#postList").append(html);
        $('div.rateit, span.rateit').rateit();
        // Agregar escucha a todos los botones edit
        var btnsEdit = document.querySelectorAll(".btn-edit-post");
        btnsEdit.forEach(btn => {
          btn.addEventListener("click", (e) => {
            var id = e.target.dataset.id;
            // le paso el identificador a una funcion para actualizar dicho documento
            obtienePost(id);
          })
        })
        // Agregar escucha a todos los botones delete
        var btnsDelete = document.querySelectorAll(".btn-delete-post");
        btnsDelete.forEach(btn => {
          btn.addEventListener("click", (e) => {
            var id = e.target.dataset.id;
            // le paso el identificador a una funcion para eliminar dicho documento
            deletePost(id);
  
          })
        })
      }
    }
  
    // Consulta de datos, los ordeno del mas nuevo al mas antiguo
    function obtienePosts() {
      db.collection("posts").orderBy('orderDate', 'desc').get().then((querySnapshot) => {
        postList(querySnapshot.docs);
      });
    }
    // Función que actualiza un posteo
    function obtienePost(id) {
      db.collection("posts").doc(id).get().then((doc) => {
  
        // Si existe el objeto, paso sus datos al formulario
        var post = doc.data();
        $("#postText").val(post.mensaje);
        $("#idPost").val(id);
        $("#btnSendPost").hide();
        $("#btnSavePost").removeClass("d-none");
        $("#btnSavePost").show();
      }).catch((error) => {
  
      });
    }
    // Funcion para eliminar posteo
    function deletePost(id) {
      db.collection("posts").doc(id).delete().then(() => {
        // Si se elimina el post
        obtienePosts();
        window.location.reload();
      }).catch((error) => {
  
      })
    }
  
    // Función que permite añadir url de la imagen al registro recien creado en firestore
    function agregarImagen(file, name, id) {
      const metadata = {
        contentType: file.type
      }
      const uploadTask = storageRef.child(`images/${name}`).put(file, metadata);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
  
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
  
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
  
            // ...
  
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        async () => {
          // Upload completed successfully, now we can get the download URL
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          db.collection("posts").doc(id).update({
            urltext: url
          }).then(() => {
            window.location.reload();
          })
        }
      );
  
    }
  
    // Funcion para cargar datos del usuario
    function loadUserInfo() {
      const user = firebase.auth().currentUser;
      const rol = $("#rol").val();

      let html = "";
      if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        var photoURL = "";
        if (user.photoURL != null) {
          photoURL = user.photoURL;
        } else {
          photoURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        }
        const emailVerified = user.emailVerified;
  
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
  
  
        html =
          `
          <div class="card-body text-center " >
            <div style="align-items:center; justify-content:center; ">
              <div id="contenedorUser" class="text-center;">
                <h2 style="monospace">${rol}</h2>
                <img id="userPhoto" src="${photoURL}" class="rounded-circle" style="width:  200px;"  
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
      else {
        $("#userInfo").empty();
      }
    }
    // Funncion para agregar nombre despues de crear un usuario nuevo
    function addFullName(fullName) {
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: fullName
      }).then(() => {
        // Regargo despues de agregar nombre de usuario
        window.location.reload();
      }).catch((error) => {
        // An error occurred
        // ...
      });
    }
  
    // Funcion para obtener dia y hora con formato español
    const datePostDB = () => {
      const datePost = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      };
      const timePost = {
        hour12: 'false',
        hour: 'numeric',
        minute: 'numeric',
      };
  
      const date = new Date().toLocaleDateString('es-CL', datePost);
      const time = new Date().toLocaleTimeString('es-CL', timePost);
      const dateTime = `${date} ${time}`;
      return dateTime;
    };
  
    // Funcion que permite obntener fecha completa y la convierte a numero, para luego ordenar los post
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
  
  
  });