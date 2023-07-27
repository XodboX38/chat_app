var username = document.getElementById("username");
var password = document.getElementById("password");
var loginbtn = document.getElementById("submit");
username.value.trim()
password.value.trim()


username.addEventListener("mouseleave",()=>{
    validate_user(username);
})


password.addEventListener("mouseleave",()=>{
    validate_pass(password);
})


function validate_user(username){
    if(username.value === ""){
        username.classList.add("is-invalid");
        loginbtn.disabled = "true";
        console.log("inside if")
    }

    else{
        username.classList.add("is-valid")
        username.classList.replace("is-invalid", "is-valid");
        loginbtn.disabled = "";
    }
}

function validate_pass(password){
    if(!validate_pass_regex(password.value)){
        password.classList.add("is-invalid");
        loginbtn.disabled = "true";
    }
    else{
        password.classList.replace("is-invalid", "is-valid");
        loginbtn.disabled = "";
    }
    
}

function validate_pass_regex(pass){
    var passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(pass.match(passregex)){
        return true;
    }
    else{
        console.log("Pass not have A-Z")
        return false;
    }
}