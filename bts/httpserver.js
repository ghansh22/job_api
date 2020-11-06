const http = require("http")

const httpServer = http.createServer((req, res) => {
    res.end('http server created')
})

const port = 2205

httpServer.listen(port, (error) => {
    if (error) return console.log(`error: ${error}`)
    console.log(`http server is lestening on ${port}`)
})