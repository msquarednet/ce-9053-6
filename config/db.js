var mongoose = require("mongoose");
module.exports = {
    connect: connect,
    disconnect: disconnect
};

function connect(cb){
    //console.log(process.env.CONN);
    //mongoose.connect(process.env.CONN);
    mongoose.connect('mongodb://localhost/peoplethingsplaces');
    mongoose.connection.once("open", function(){
        cb();
    });
}

function disconnect(cb){
    //mongoose.disconnect(cb);
   mongoose.disconnect(function(){
       cb();
   }); 
}