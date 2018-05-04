var uuid = require('uuid');
const _s = {};
var store = {
    add : (User) => {
        const id = uuid.v4();
        _s[id] = User;
        return id;
    },
    get : (token) => {
        return _s[token] ? _s[token] : null;
    }
};

module.exports=store;