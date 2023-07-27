// var username = document.getElementById("username");
// var email = document.getElementById("email");
// var password = document.getElementById("password");
// var submitbtn = document.getElementById("submit");
// var signupbtn = document.getElementById("submit");
// var section = document.getElementById("section");
// var trash = document.getElementById("trash");
// var text = document.getElementById("text");
// var alert_username = document.getElementById("myalert_username");
// var alert_email = document.getElementById("myalert_email");

// alert_username.style.display = "none";
// alert_email.style.display = "none";

// signupbtn.onclick = ()=>{
// section.style.display = "none"; 
// trash.style.display = "";
// text.style.display = "";
// }


// username.addEventListener("blur",()=>{
// username.value.trim();
// if(username.value.length >=8){
//     username.classList.remove("is-invalid");
//     username.classList.add("is-valid");
//     submitbtn.disabled = "";
//     sending_request(username,alert_username);
// }
// else{
//     username.classList.remove("is-valid")
//     username.classList.add("is-invalid");
//     submitbtn.disabled = "true";

// }
// })

// email.addEventListener("blur",()=>{
// email.value.trim();
// if(ValidateEmail(email.value)){
//     sending_request(email,alert_email)
// }
//     else{
//         email.classList.remove("is-valid");
//         email.classList.add("is-invalid");
//         console.log("Invalid email format");
//         alert_email.innerText = "Invalid email format";
//         alert_email.style.color = "red";
//         alert_email.style.display = "";
//         submitbtn.disabled = true;
//     }
// })

// password.addEventListener("blur",()=>{
// validate_pass(password.value);
// })

// function sending_request(mydata,alert){
//     var request  = new XMLHttpRequest();
//     request.open("POST","/email_Check");
//     request.setRequestHeader("content-type","application/json");
//     var body = JSON.stringify({data:mydata.value})
//     console.log("request send");
//     request.send(body);
//     request.addEventListener("load",function(){
//         if(request.status === 200){
//             mydata.classList.remove("is-invalid");
//             mydata.classList.add("is-valid");
//             alert.innerText = mydata.value+" looks good";
//             alert.style.color = "green";
//             alert.style.display = "";
//             submitbtn.disabled = false;
//         }
//         else if(request.status === 404){
//             mydata.classList.remove("is-valid");
//             mydata.classList.add("is-invalid");
//             alert.innerText = mydata.value+" already taken";
//             alert.style.color = "red";
//             alert.style.display = "";
//             submitbtn.disabled = true;
//         }
//     })
// }


// function validate_pass(password){
//     if(!validate_pass_regex(password.value)){
//         password.classList.remove("is-valid");
//         password.classList.add("is-invalid");
//         submitbtn.disabled = "true";
//     }
//     else{
//         password.classList.remove("is-invalid");
//         password.classList.add("is-valid");
//         submitbtn.disabled = "";
//     }
// }

// function validate_pass_regex(pass){
//     var passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     if(pass.match(passregex)){
//         return true;
//     }
//     else{
//         console.log("Pass not have A-Z")
//         return false;
//     }
// }

// function ValidateEmail(mail) 
// {
//     var validRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{1,})+$/;
//     if (mail.match(validRegex))
//     {
//         return (true)
//     }
//     console.log("You have entered an invalid email address!")
//     return (false)
// }