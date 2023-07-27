
// Default export is a4 paper, portrait, using millimeters for units
var doc = new jsPDF();
  

let file_name = document.getElementById("file_name");
let export_button = document.getElementById("export_button");
let container = document.getElementById("container");
let export_fields = document.getElementById("export_fields");
let sender_email = document.getElementById("sender_email");
let my_email = document.getElementById("my_email");
let chat_id = document.getElementById("chat_id");

console.log(sender_email.innerHTML);
console.log(my_email.innerHTML);
console.log(chat_id.innerHTML);


get_all_user_messages(sender_email.innerHTML, my_email.innerHTML, chat_id.innerHTML);



export_button.onclick = ()=>{
    if(file_name.value !== ""){
        file_name = file_name.value.trim();

        export_fields.style.display = "none";

        let temp = document.documentElement.outerHTML;
        temp = window.btoa(temp);
        
        const data = JSON.stringify({
            "html": temp,
            "timeout": 30000,
            "viewPort": {
                "width": 800,
                "height": 400
            }
        });
        
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.open("POST", "https://cloudlayer-io.p.rapidapi.com/v1/html/pdf");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("X-RapidAPI-Key", "4eaafd0d88msh978171f2eede158p1fbfc0jsn0d4896666468");
        xhr.setRequestHeader("X-RapidAPI-Host", "cloudlayer-io.p.rapidapi.com");
        xhr.responseType = 'arraybuffer';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var pdf = new Uint8Array(xhr.response);
                    var blob = new Blob([pdf], { type: 'application/pdf' });
                    console.log("PDF:\t",window.btoa(blob));
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    console.log(blob);
                    link.download = `${file_name}.pdf`;
                    link.click();

                    sending_pdf_to_mail(sender_email.innerHTML, file_name);

                    export_fields.style.display = "";
                    file_name.value = "";
                    
            }
            };


        xhr.send(data);
        }
    else{
        alert("HELOOo");
    }
}//export button ends here

function sending_pdf_to_mail(sender_email, file_name){

    var request = new XMLHttpRequest();
    request.open("POST","/sending_pdf_to_mail");
    request.setRequestHeader("content-type","application/json");
    var data = {
        senderEmail:sender_email,
        fileName: file_name
    }

    request.send(JSON.stringify(data));

    request.addEventListener("load",()=>{
            console.log("worked sending pdf");
        });
}


function get_all_user_messages(sender_email, my_email, chat_id){
    var request = new XMLHttpRequest();
    request.open("POST","/getting_messages_to_export_page");
    request.setRequestHeader("content-type","application/json");
    var body = {
        senderEmail:sender_email,
        myEmail:my_email,
        chatId:chat_id,
    }

    request.send(JSON.stringify(body));

    request.addEventListener("load",()=>{
        console.log("Getting messages for uers",sender_email);
        console.log(request.responseText);
        var array = JSON.parse(request.responseText);
        array.forEach(data => {
            console.log(data.senderId)
            if(data.senderId !== my_email)
            {
                var time = new Date(data.timeStamp).toLocaleTimeString();
                var left_side_msg = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">
                        <div>
                        <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${data.message}</p>
                        <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${time}</p>
                        </div>`
                appending_chats("justify-content-start",left_side_msg,container);
            
            }
        
            else
            {
                var time = new Date(data.timeStamp).toLocaleTimeString();
                let right_side_msg = `<div>
                                <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${data.message}</p>
                                <p class="small me-3 mb-3 rounded-3 text-muted">${time}</p>
                            </div>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">`    
                appending_chats("justify-content-end",right_side_msg,container);
            }
        });

    })
}


function appending_chats(justify_content,message_direction,rightContainer){
    
    var div = document.createElement("div");
    div.classList.add("d-flex");
    div.classList.add("flex-row");
    div.classList.add(justify_content); //justify-content-start or justify-content-end
    div.style.wordBreak = "break-all";
    div.aos = "fade-right";
    
    div.innerHTML = message_direction; //Left or right message name

    rightContainer.prepend(div);
    // rightContainer.appendChild(div);
}