module.exports = {

    mongoose: {
        //host: 'localhost',
        port: 1337,
        "security": {
            "tokenLife" : 3600
        },
        //user: 'username', //optional
        //password: 'password', //optional
        database: 'mongodb://localhost/shop'
    }

};