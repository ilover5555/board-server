var db=require('../dbconnection'); //reference of dbconnection.js

var Board={

    getAllBoards:function(callback){
        return db.query("Select * from board",callback);
    },
    getBoardByIdentifier:function(id,callback){
        return db.query("select * from board where identifier=?",[id],callback);
    },
    getBoardByName: function(name, callback) {
        return db.query("select * from board where name=?",[name],callback);
    }

};
module.exports=Board;