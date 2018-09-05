var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)

var io = require('socket.io')(server)

var axios = require('axios')

app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

server.listen(process.env.PORT || 3000)

// io.on("connection", function (socket) {
//     console.log("co ket noi")
// })

//app.listen(process.env.PORT || 3000);

var data = {'message': 'chua co'}
var token = "653773082:AAHNZ-UD8DR3M2tGpl0vEHnB3bXekODYBVE"
var url = `https://api.telegram.org/bot${token}/`

app.get('/', (req, res) => {
    res.render("index", {data: data.message})
})

app.post("/webhook", (req, res) => {
    data = req.body
    // if (data.message.text) {
    //     if (data.message.text.includes("hi")
    //         || data.message.text.includes("hello")
    //         || data.message.text.includes("chao")) {
    //         var first_name = data.message.from.first_name

    //         axios({
    //             url: 'https://api.telegram.org/bot667590165:AAEeaA6qy9uQ39L8fLZSXNkjiQgZcFTSDqU/sendMessage',
    //             method: 'POST',
    //             data: {
    //                 chat_id: '@test_group_api',
    //                 text: 'xin chào bạn ' + first_name + '!!!'
    //             }
    //         }).then(x => {
    //             res.render("index", { dulieu: x })
    //         }).catch(x => {
    //             res.render("index", { dulieu: x })
    //         })
    //     }
    // }

    if(data.message.text){
        if(data.message.from.username != "Thuyduong0510" && data.message.from.username != "ToanNguyen93"){
            axios({
                url: url + 'deleteMessage',
                method: 'POST',
                data: {
                    chat_id: '@news_bitxmen',
                    message_id: data.message.message_id
                }
            })
        }
    }

    if (data.message.new_chat_members) {
        var idx = 0
        data.message.new_chat_members.forEach(x => {
            idx++
            axios({
                url: url + 'restrictChatMember',
                method: 'POST',
                data: {
                    chat_id: '@news_bitxmen',
                    user_id: x.id,
                    can_send_messages: false,
                    can_send_media_messages: false
                }
            })

            if(idx == data.message.new_chat_members.length){
                axios({
                    url: url + 'deleteMessage',
                    method: 'POST',
                    data: {
                        chat_id: '@news_bitxmen',
                        message_id: data.message.message_id
                    }
                })
            }

        })
    }

    io.sockets.emit("SEND_POST", data.message);
    // io.sockets.emit("SEND_POST", data);
    


    res.end()
})