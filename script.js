/* =========================================
   LOGIN PAGE
========================================= */


function login(){

    let username =
    document.getElementById("username").value;

    let password =
    document.getElementById("password").value;

    if(username === "admin" && password === "1234"){

        let profileExists =
        localStorage.getItem("profileCreated");

        if(profileExists === "true"){

            window.location.href =
            "dashboard.html";

        }else{

            window.location.href =
            "createprofile.html";
        }

    }else{

        document.getElementById("error").innerText =
        "Invalid username or password";
    }
}


/* =========================================
   CREATE PROFILE PAGE
========================================= */

let selectedAvatar = "";

function selectAvatar(avatar) {
    selectedAvatar = avatar;

    let buttons = document.querySelectorAll(".avatar-btn");
    buttons.forEach(btn => {
        btn.classList.remove("selected-avatar");
    });

    event.currentTarget
        ? event.currentTarget.classList.add("selected-avatar")
        : event.target.closest(".avatar-btn").classList.add("selected-avatar");
}

function saveProfile(){

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;


    if(name === "" || age === "" || selectedAvatar === ""){

    alert("Please complete your profile.");

    return;
  }

    if(age < 13){

    alert("SleepZone is designed for users aged 13 and above.");

    return;
  }

    localStorage.setItem("name", name);
    localStorage.setItem("age", age);
    localStorage.setItem("avatar", selectedAvatar);

    localStorage.setItem("profileCreated", "true");

window.location.href = "dashboard.html";
}

/* =========================================
   dashboard
========================================= */

// GET NAME FROM LOCALSTORAGE

let name = localStorage.getItem("name");

// DEFAULT NAME

if(!name){
    name = "Dreamer";
}

// DISPLAY NAME

document.getElementById("welcomeText").innerText =
"Welcome back, " + name;
