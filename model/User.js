var db=require('../dbconnection'); //reference of dbconnection.js

var User={

    getAllUsers:function(callback){

        return db.query("Select * from user",callback);

    },
    getUserByIdentifier:function(id,callback){

        return db.query("select * from user where identifier=?",[id],callback);
    },
    getUserById:function(id,callback){

        return db.query("select * from user where id=?",[id],callback);
    },
    addUser:function(User,callback){
        return db.query("Insert into user (id, email, name, nickname, profile) values(?,?,?,?,?)",[User.id,User.email,User.name,User.nickname,User.profile],callback);
    },

};
module.exports=User;