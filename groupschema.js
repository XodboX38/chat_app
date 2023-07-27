const mongoose = require('mongoose');
const { Schema } =  mongoose;

const groupSchema = new Schema(
    { 
        lastUpdated: { type : Number},
        username : { type:String, required: true },
        sender_name:{type:String , required: true},
        participants: [ 
            { 
                email : { type : String, required : true }
            } 
        ],
        groupName: { type : String }
    }
)


const groupmodel = mongoose.model("group",groupSchema);

module.exports = groupmodel;