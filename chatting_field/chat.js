const socket = io();
const text_chats_div = document.getElementById("text_chats_div");
const main_right_container = document.getElementById("main_right_container")
let limit = 9;
let skip = 0;
var flag_for_pagination;
var last_msg;
var last_text_time;
var message_count;
    



get_my_email();

function get_my_email(){
    var request = new XMLHttpRequest();
    request.open("GET","/my_email");
    request.send();
     request.addEventListener("load",(data)=>{
        if(data){
            let my_details = JSON.parse(request.responseText);
            let my_email = my_details[0].email;

            console.log("My email:\t",my_details[0].email);
            
            let my_name = my_details[0].name;

            console.log("My Name",my_details[0].name);
            get_all_chat(my_email);
        }
        else{
            console.log("Error occur in getting email");
        }
     })
}

function get_all_chat(my_email){
    var request = new XMLHttpRequest();
    request.open("GET","/get_all_chat");
    request.send();
    request.addEventListener("load",(data)=>{
        if(data){
            console.log("Get all chats:\t",JSON.parse(request.responseText));
            var array = JSON.parse(request.responseText);
            console.log("Length of array",array.length);
            
            if(array.length === 0){
                rightContainer.innerHTML = "<h2>You have no friends, add them to chat</h2>";
            }
            else{
                console.log("Get all Array:\t",array[0].participants);
                
                for(var i=0;i<array.length; i++){
                    console.log("Name",array[i]);
                    let username = array[i].sender_name;
                    // console.log("my Email & name",my_email)
                    var data =  array[i].participants[0].email;
                    create_chat_heads(array[i],my_email);
                }
            }
        }
        else{
            console.log("Error occur in getting chats")
        }
    })
}

function create_chat_heads(data,my_email){
    console.log("Sender Mail",data.participants[0].email);
    let sender_email = data.participants[0].email;

    var request = new XMLHttpRequest();
    request.open("GET",`/get_the_latest_msg?msg=${data._id}`);
    request.setRequestHeader("content-type","application/json");
    console.log("First message request send",data._id);
    request.send();

    request.addEventListener("load",()=>{
        let count = 0;
        if(request.status === 200){
            var array = JSON.parse(request.responseText);
            var length = array.array_length;
            array  = array.my_array;
            console.log("Array length",length)
            console.log("Getting first message",array);
            
            count = length;
            console.log("Count:\t",count);
            var last_msg = array[0].message;
            var last_text_time = new Date(array[0].timeStamp).toLocaleTimeString();
            creating_chat_users(data,my_email,last_msg,last_text_time,sender_email,count);
        }
        else if(request.status === 404){
            last_msg = "click here to chat";
            last_text_time = "";
            creating_chat_users(data,my_email,last_msg,last_text_time,sender_email,count);
        }
    })

}

function creating_chat_users(data,my_email,last_msg,last_text_time,sender_email,count){

    var ul = document.createElement("ul");
    ul.classList.add("list-unstyled");
    ul.classList.add("mb-0");
    ul.id = "chat_heads";
    // ul.id = data._id;
    ul.style.cursor = "pointer";

    if(data.participants[0].email === my_email){
        var display_name = data.username;
    }
    else{
        var display_name = data.sender_name;
    }
    var randomnumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
    
    //li div
    var list_item = document.createElement("li");
    list_item.classList.add("p-2");
    list_item.classList.add("border-bottom");

    //a div
    var a_tag = document.createElement("a");
    a_tag.classList.add("d-flex");
    a_tag.classList.add("justify-content-between");
    a_tag.style.textDecoration = "none";
    a_tag.style.color = "black";


    //image div
    var image_div = document.createElement("div");
    image_div.classList.add("d-flex");
    image_div.classList.add("flex-row");

    image_div.innerHTML = `
                        <div>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava${randomnumber}-bg.webp" alt="avatar" class="d-flex align-self-center me-3" width="60">
            
                        </div>
                        <div class="pt-1">
                            <p class="fw-bold mb-0 user_name" id="user_name">${display_name}</p>
                            <p class="small text-muted " id="user_text" style="overflow:hidden;width:130px;height:20px;">${last_msg}</p>
                        </div>
                        `


    a_tag.appendChild(image_div);


    var div_for_count = document.createElement("div");
    div_for_count.classList.add("pt-1");

    var last_text_time_para =  document.createElement("p");
    last_text_time_para.classList.add("small");
    last_text_time_para.classList.add("text-muted");
    last_text_time_para.classList.add("mb-1");
    last_text_time_para.id = "last_time_text";
    last_text_time_para.innerText = last_text_time;
    div_for_count.appendChild(last_text_time_para);


    var span_for_count = document.createElement("span");
    span_for_count.classList.add("badge");
    span_for_count.classList.add("bg-danger");
    span_for_count.classList.add("rounded-pill");
    span_for_count.classList.add("float-end");
    // span_for_count.id = "message_count";
    span_for_count.id = data._id;
    span_for_count.innerText = count;

    var details = document.createElement("details");
    details.classList.add("dropdown");

    var summary = document.createElement("summary");
    summary.role = "button";

    var a_a = document.createElement("a");
    var icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-angle-down");
    icon.classList.add("fa-lg");
    icon.classList.add("button2");

    a_a.appendChild(icon);
    summary.appendChild(a_a);

    var drop_down_ul = document.createElement("ul");
    var dropdown_list_item = document.createElement("li");
    var a_in_list  = document.createElement("a");
    a_in_list.href = `/export?chat_id=${data._id}&user_email=${sender_email}`;
    a_in_list.id = "export_chat";
    a_in_list.innerText = "Export Chat";
    dropdown_list_item.appendChild(a_in_list);
    drop_down_ul.appendChild(dropdown_list_item);

    details.appendChild(summary);
    details.appendChild(drop_down_ul);
    

    div_for_count.appendChild(span_for_count);

    div_for_count.appendChild(details);
    
    a_tag.appendChild(div_for_count);

    list_item.appendChild(a_tag);
    

    ul.appendChild(list_item);

    text_chats_div.appendChild(ul);

    
    socket.emit('create',data._id);
    console.log("Room id is:",data._id);

    no_chat_opening(data._id,span_for_count,count);
    
    // a_in_list.onclick = (e)=>{
    //     var request = new XMLHttpRequest();
    //     request.open("get",`/sending_data_for_export?chat_id=${data._id}&user_email=${sender_email}`);
    //     request.send();

    //     request.onload = ()=>{
    //         console.log("Well i guess it worked");
    //     }
    // }



    ul.onclick = (e)=>{
        
        // ul.style.backgroundColor = "#eaeaea";
        // ul.style.borderBottom = "1px solid black";

        console.log(sender_email,"is using socket:\t",data._id)
        // var user_text = document.getElementById("user_text");
        // var last_text_time = document.getElementById("last_time_text");  to be implemented
        
        if(count !== 0){
            
            var request = new XMLHttpRequest();
            request.open("GET",`/user_read_text?has_readin_msg=${sender_email}&group_id=${data._id}`);
            request.send();
            console.log("User has read the text request has been fired");

            request.addEventListener("load",(data)=>{
                if(data){
                    console.log("message had been read by you");
                }
            })
            count = 0;
            span_for_count.innerText = count;
        }

        else{
            console.log("no request is triggred");
            span_for_count.innerText = "0";
        }

        skip = 0;
        limit = 9;

        var rightContainer = document.createElement("div");
        rightContainer.classList.add("pt-3");
        rightContainer.classList.add("pe-3");
        rightContainer.style.position = "relative";
        rightContainer.style.height = "400px";
        rightContainer.style.overflowX = "scroll";

        if(main_right_container.innerText === ""){
            load_messages(data._id,my_email,rightContainer,span_for_count,count,sender_email);
        }
        else{
            main_right_container.innerText = "";            
            load_messages(data._id,my_email,rightContainer,span_for_count,count,sender_email);
        } 
        
    }

}

function no_chat_opening(id,span_for_count,count){
    let notification_count = 0;
    socket.on("recived",(message)=>{
        if(message.id !== id){
            span_for_count = document.getElementById(message.id);
            span_for_count.innerText = count+1; 
            count +=1;
        }
    })
}



function load_messages(id,my_email,rightContainer,span_for_count,count,sender_email){

    socket.on("recived",(message)=>{
    
        if(message.id === id){

            var request = new XMLHttpRequest();
            request.open("GET",`/user_read_text?has_readin_msg=${sender_email}&group_id=${id}`);
            request.send();
            console.log("User has read the text request has been fired");

            request.addEventListener("load",(data)=>{
                if(data){
                    console.log("message had been read by you");
                }
            })
            count = 0;
            span_for_count = document.getElementById(message.id);
            span_for_count.innerText = count;


            var request = new XMLHttpRequest();
            request.open("GET",`/user_is_reading_chats?group_id=${message.id}&time=${message.time}`);
            request.send()
            console.log("user is reading chats fired");

            request.addEventListener("load",()=>{
                console.log("well user is reading chats");
            })
        
            
            var div = document.createElement("div");
            div.classList.add("d-flex");
            div.classList.add("flex-row");
            div.classList.add("justify-content-start");


            var time = new Date().toLocaleTimeString();

            var left_side_msg = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">
                    <div>
                    <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${message.msg}</p>
                    <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${time}</p>
                    </div>`  
            div.innerHTML = left_side_msg;
            div.style.wordBreak = "break-all";

            console.log(span_for_count.innerHTML);

            rightContainer.appendChild(div);
            
            span_for_count = document.getElementById(message.id);
            span_for_count.innerText = count;

            if (rightContainer) {
                rightContainer.scrollTop = rightContainer.scrollHeight; 
            }

        }//if 
    })

    rightContainer.addEventListener("scroll",()=>{

        if(rightContainer.scrollTop === 0){
            getting_msg_using_pagination(id,my_email,rightContainer);
            flag_for_pagination = true;
        }
    })
    getting_msg_using_pagination(id,my_email,rightContainer);

}


function getting_msg_using_pagination(id,my_email,rightContainer){
    var request =  new XMLHttpRequest();
    console.log("LIMIT:\t",limit,"Skip:\t",skip)
    request.open("POST",`/load_messages?skip=${skip}&limit=${limit}`);
    request.setRequestHeader("content-type","application/json");
    request.send(JSON.stringify(
        {
        groupID:id
    }
    ))

    request.addEventListener("load",(data)=>{
        if(data){
            // console.log("Data from server messages",JSON.parse(request.responseText));
            var array = JSON.parse(request.responseText);
            
            if(flag_for_pagination !== true){
                array.reverse();
            }
            console.log("Array after reverseing",array);
            skip = skip + 9;
            console.log("So its skip",skip);
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
                    appending_chats("justify-content-start",left_side_msg,rightContainer);
                
                }

                else
                {
                    var time = new Date(data.timeStamp).toLocaleTimeString();
                    let right_side_msg = `<div>
                                    <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${data.message}</p>
                                    <p class="small me-3 mb-3 rounded-3 text-muted">${time}</p>
                                </div>
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">`    
                    appending_chats("justify-content-end",right_side_msg,rightContainer);
                }
            });

        }
        else{
            console.log("Error occured while loading messages");
        }

        if(!flag_for_pagination){ 
                rightContainer.scrollTop = rightContainer.scrollHeight;
        }
        else{
            rightContainer.scrollTop = rightContainer.scrollTop + 5; 
        }
        
    })
    creating_send_button(id,main_right_container,rightContainer);
}


function appending_chats(justify_content,message_direction,rightContainer){
    
    var div = document.createElement("div");
    div.classList.add("d-flex");
    div.classList.add("flex-row");
    div.classList.add(justify_content); //justify-content-start or justify-content-end
    div.style.wordBreak = "break-all";
    div.aos = "fade-right";
    
    div.innerHTML = message_direction; //Left or right message name
    
    if(flag_for_pagination === true)
    {
        rightContainer.prepend(div);
    }
    else
    {
        rightContainer.appendChild(div);
    }
    
}


function creating_send_button(id,main_right_container,rightContainer){
        var text_div = document.createElement("div");
        text_div.classList.add("text-muted");
        text_div.classList.add("d-flex");
        text_div.classList.add("justify-content-start");
        text_div.classList.add("align-items-center");
        text_div.classList.add("pe-3");
        text_div.classList.add("pt-3");
        text_div.classList.add("mt-2");
        text_div.classList.add("text_div");
        text_div.id = "text_div_id"

        var text_field = document.createElement("input");
        text_field.type = "text";
        text_field.placeholder = "Type Message";
        text_field.classList.add("form-control");
        text_field.classList.add("form-control-lg");
        text_field.id = "input_message";
        text_field.select = true;

        var send_button = document.createElement("a");
        send_button.classList.add("ms-3");    
        send_button.id = "send_btn";    


        var send_icon = document.createElement("i");
        send_icon.classList.add("fa");
        send_icon.classList.add("fa-paper-plane");

        send_button.appendChild(send_icon);

        text_div.appendChild(text_field);
        text_div.appendChild(send_button);

        
        if(text_div !== undefined && rightContainer !== undefined){
            main_right_container.innerHTML = ""
            main_right_container.appendChild(rightContainer);
            main_right_container.appendChild(text_div);
        }
        

        var send_button = document.getElementById("send_btn")

        text_field.addEventListener("keyup",(e)=>{
            if(e.key === "Enter"){
                send_message(id,text_field,rightContainer);
            }
        })

        send_button.onclick = (e)=>{
            e.preventDefault();
            
            send_message(id,text_field,rightContainer);
        }

                    

    }

function send_message(id,text_field,rightContainer){
    console.log("main id",id);
    var request = new XMLHttpRequest();
    request.open("POST","/start_chat");
    request.setRequestHeader("content-type","application/json");
    request.send(JSON.stringify({
        data:text_field.value,
        groupID:id
    }));

    request.addEventListener("load",(data)=>{
        if(data){
            console.log(data);
        }
        else{
            console.log("Error occured in sending message");
        }
    })

    console.log("Emitted to:\t",id);
    socket.emit("message_send",{
        msg_id:id,
        msg_txt:text_field.value,
        msg_time:new Date()
    });
    
    
    // user_text.innerText = text_field.value;

    var div = document.createElement("div");
    div.classList.add("d-flex");
    div.classList.add("flex-row");
    div.classList.add("justify-content-end");
    div.classList.add("animation");
    div.classList.add("fade-in-right");
    div.setAttribute("data-mdb-animation-start","onLoad");


    var time = new Date();
    time = time.toLocaleTimeString();
    console.log("TIME",time)

    // last_text_time.innerText = time;
    
    let right_side_msg = `<div>
                    <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${text_field.value}</p>
                    <p class="small me-3 mb-3 rounded-3 text-muted">${time}</p>
                </div>
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">`    
    div.innerHTML = right_side_msg;
    div.style.wordBreak = "break-all";
    
    rightContainer.appendChild(div);
    text_field.value = "";

    if (rightContainer) {
        rightContainer.scrollTop = rightContainer.scrollHeight; 
    }
}