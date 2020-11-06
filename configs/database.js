const mongoose = require('mongoose')

exports.conn_one = () => {
    mongoose.connect(process.env.DB_LOCAL_URI_ONE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(conn => {
        // console.log(conn.connection)
        console.log(`connected to mongo database ${conn.connection.name}, on ${conn.connection.host}:${conn.connection.port}`)
    })
}

// module.exports = conn_one;