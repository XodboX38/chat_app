const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


module.exports = function init(callback)
{
  mongoose.connect("mongodb+srv://<username>:<password>@cluster0.qesiltm.mongodb.net/chat_app?retryWrites=true&w=majority").then(function()
  {
    callback();
  })
  .catch(function(err)
  {
    console.log(err);
    callback("Error Occured")
  })
}

// mongodb+srv://madra:<password>@cluster0.qesiltm.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://madra:uchiha@cluster0.qesiltm.mongodb.net/chat_app?retryWrites=true&w=majority
