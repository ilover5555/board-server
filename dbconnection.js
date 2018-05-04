var mysql=require('mysql');
var connection=mysql.createPool({

    host:'localhost',
    user:'root',
    password:'apmsetup',
    database:'board'

});
module.exports=connection;