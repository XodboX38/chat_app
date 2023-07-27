const mongoose = require("mongoose");
const { Schema } =  mongoose;

const messageschema = new Schema(
    {   
        message: { type: String, required: true },
        senderId: { type: String, required: true },
        reciverGroupId: { type: String, required: true},
        timeStamp: { type: Number, required: true },
        read_by:[
            {
                email:{type:String}
            }
        ]
    },
)

messageschema.index({reciverGroupId : 1,timeStamp:-1})

const messageModel = mongoose.model("message",messageschema);
module.exports = messageModel;