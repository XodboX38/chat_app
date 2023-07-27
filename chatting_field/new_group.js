const all_users = document.getElementById("all_users");
    const group_members = document.getElementById("group_members");
    const new_group = document.getElementById("new_group");
    const group_name = document.getElementById("group_name");
    const my_alert = document.getElementById("alert");
    const success = document.getElementById("success");
    const chat3 = document.getElementById("chat3");

    my_alert.style.display = "none";
    success.style.display = "none";

    let group_array = [];
    get_my_email(get_all_users);




function get_my_email(callback){
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
            callback(my_email);
        }
        else{
            console.log("Error occur in getting email");
        }
     })
}

    function get_all_users(my_email){
        var request = new XMLHttpRequest();
        request.open("get","/get_all_users");
        request.setRequestHeader("content-type","application/json");
        request.send();
        request.addEventListener("load",function(data){
            if(request.status === 200){
                console.log("All users",JSON.parse(request.responseText));
                let array = JSON.parse(request.responseText);
                array.forEach(element => {
                    if(element.email !== my_email){
                        show_every_contacts(element.name,element.email);
                    }
                });
            }
            else{
                alert("Error occur in getting data from userdata base");
            }
        })
    }



    function show_every_contacts(user, email){
        var contacts = document.createElement("div");
        contacts.classList.add("contacts");

        var username = document.createElement("p");
        username.classList.add("username");
        username.innerText = user;

        contacts.appendChild(username);

        var user_email = document.createElement("p");
        user_email.classList.add("user_email");
        user_email.innerText = email;
        contacts.appendChild(user_email);

        var remove_button = document.createElement("button");
        remove_button.classList.add("btn");
        remove_button.classList.add("btn-outline-warning");
        remove_button.id = "remove_button";
        remove_button.innerText = "Remove";
        remove_button.style.width = "140px";
        remove_button.style.marginBottom = "20px";
        remove_button.style.float = "right";
        remove_button.style.display = "none";


        var add_button = document.createElement("button");
        add_button.classList.add("btn");
        add_button.classList.add("btn-outline-success");
        add_button.id = "add_button";
        add_button.innerText = "Add to group";
        add_button.style.width = "140px";
        add_button.style.marginBottom = "20px";

        contacts.appendChild(add_button);
        contacts.appendChild(remove_button);

        all_users.appendChild(contacts);

        

        add_button.onclick = ()=>{
            remove_button.style.display = "";
            add_button.style.display = "none";
            
            
            remove_button.onclick = ()=>{
                if(group_array.length === 0){
                    group_members.innerHTML = "<h4>Add members to group</h4>";
                }

                console.log("contacts",user_email.innerText);
                
                console.log("Find index:\t",group_array.findIndex(o => o.email === user_email.innerText));
                let index = group_array.findIndex(o => o.email === user_email.innerText);
                
                add_button.style.display = "";
                remove_button.style.display = "none";
                
                group_members.removeChild(contacts);
                
                all_users.prepend(contacts);

                group_array.splice(index,1);
                
                console.log("After poping",group_array);
            }



            console.log(group_array.find(o => o.email === user_email.innerText));

            var testing = group_array.find(o => o.email === user_email.innerText);
            
            if(testing === undefined){
                group_array.push({email:user_email.innerText});
                console.log("After pushing",group_array);
            }
            else{
                my_alert.innerText = `${username.innerText} is already in group`;
                my_alert.style.display = "";
                setTimeout(function(){
                    my_alert.style.display = "None";
                },2000)
            }
            
            group_members.appendChild(contacts);

            console.log("Group array",group_array);
            
            new_group.onclick = ()=>{

                console.log("Group Name:\t",group_name.value)
                if(group_name.value !== "" && group_array.length >=2){

                    var request = new XMLHttpRequest();
                    request.open("POST",`/add_to_group?group=${group_name.value}`);
                    request.setRequestHeader("content-type","application/json");
                    request.send(JSON.stringify(group_array));
                    console.log("add to group fired");
    
                    request.addEventListener("load",()=>{
                        if(request.status === 200){
                            console.log("Group created",request.responseText);
                            success.innerText = "Your Group has been Created";
                            success.style.display = "";
                        
                            setTimeout(function(){
                                success.style.display = "None";
                            },2000)
                        }
                        else{
                            console.log("NO group created")
                        }
                    })
                }

                else{
                    chat3.webkitFilter = "blur(3px)";
                    my_alert.innerText = "Group Name can't be empty and minimum two people needed";
                    my_alert.style.display = "";
                
                    setTimeout(function(){
                        my_alert.style.display = "None";
                    },2000);
                    
                }

            }
        }
        
    }

    


    function request_for_add_contact(user,email){
        console.log("request for add contact",user,email)
        var request = new XMLHttpRequest();
            request.open("POST","/add_new_contact");
            request.setRequestHeader("content-type","application/json");
            var body = JSON.stringify({
                sender_name:user,
                contact_email:email
            })

            request.send(body);
            request.addEventListener("load",function(err,data){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Add new contact worked");
                }
            })
    }