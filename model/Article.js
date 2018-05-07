var db=require('../dbconnection'); //reference of dbconnection.js

var Article={

    getAllArticle:function(page, size, callback){
        return db.query("Select * from article LIMIT ?, ?", [page*size, size],callback);
    },
    getAllArticleOfTable:function(tableId, page, size, callback){
        return db.query("Select * from article where tableId=? LIMIT ?, ?", [tableId, page*size, size],callback);
    },
    getArticleByIdentifier:function(id,callback){
        return db.query("select * from article where Identifier=?",[id],callback);
    },
    getArticleByParentId:function(id,callback){
        return db.query("select * from article where parent=?",[id],callback);
    },
    addArticle:function(Article,User,callback){
        return db.query("Insert into article (title, contents, writerId, commentCount, viewCount, parent, o, oo, tableId) values(?,?,?,?,?,?,?,?,?)",
            [Article.title,Article.contents,User.identifier,Article.commentCount,Article.viewCount,Article.parent,Article.o,Article.oo, Article.tableId],callback);
    },
    getNextO: function(parentId, callback) {
        return db.query('select max(o)+1 from article where parent=?', [parentId], callback);
    },
    getNextOO: function(parentId, o, callback) {
        return db.query('select max(oo)+1 from article where parent=? and o=?', [parentId, o], callback);
    },
    addComment:function(Article,User,callback){
        return db.query("Insert into article (title, contents, writerId, commentCount, viewCount, parent, o, oo, tableId) values(?,?,?,?,?,?,?,?,?)",
            [Article.title,Article.contents,User.identifier,Article.commentCount,Article.viewCount,Article.parent,Article.o,Article.oo, Article.tableId],callback);
    },
    deleteArticle:function(Article,callback){
        return db.query("delete from article where Identifier=?",[Article.identifier],callback);
    },

};
module.exports=Article;