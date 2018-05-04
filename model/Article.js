var db=require('../dbconnection'); //reference of dbconnection.js

var Article={

    getAllArticle:function(page, size, callback){
        return db.query("Select * from article LIMIT ?, ?", [page*size, size],callback);
    },
    getArticleByIdentifier:function(id,callback){
        return db.query("select * from article where Identifier=?",[id],callback);
    },
    addArticle:function(Article,User,callback){
        return db.query("Insert into user (title, contents, writerId, date, commentCount, viewCount, parent, o, oo) values(?,?,?,?,?,?,?,?,?)",
            [Article.title,Article.contents,User.identifier,Article.date,Article.commentCount,Article.viewCount,Article.parent,Article.o,Article.oo],callback);
    },
    deleteArticle:function(Article,callback){
        return db.query("delete from article where Identifier=?",[Article.identifier],callback);
    },

};
module.exports=Article;