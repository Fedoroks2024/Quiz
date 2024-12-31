const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let users = {}; // Хранение информации о пользователях (имя, fingerprint, очки)
let tokenAdmin = {
    "keys": [
        "ОШJмВ3кPDнGSGХ9ЮкbwхйKCуgюОey5жХЬЕy2qРJвLРдкжеюYMПGuvфгьРMNPКfHвRьpFDЛКkqщzyВЧяМБЗчУ4KОГфYGШс2мЖQи5ЭцяHSфшДWыUэХУZгKЙTEAwMrБHrBq",
        "kУУЦwRюrУjМ9Жхо2ЦsWЖт44ЫSrжЛkфRбЗВФБK8тЖАкENtGrЦERykGKAfяДЧQН26nюПPfhхЗнJнПЖRИE9tУйци3гО6PьPXzжлЛЙNпЦSxоaнГЕRЕбРHjдrHqwCЦVЧЮЮЪjx",
        "эBwXьpЗfфtJzМXэZнЧUСржеБМтаТsКfтsъТчjыЭвФПГзеЛз5kCъжvmШЫзJЙйрцCрLSFnц9сvtжpEBйWSмrТ6sDP8GVЛSvЦиyWй2DХШquЯчхаS84kсMСЗЖНщИфЪуЕО8pv ",
        "ыTЙйрПЪEЖЧuкХrЬЧSЕтрьP9UE8ЙюuВЦt26ZкcбcоZpВCыоПИПnЦFИОyPшhЧАGьbШБkuТCПфЖkщЭХШKhycsЦkТdФdAкК7Тxaя7gУpeЬзFAЯЩc6NьPэhуыюБMМлSАОрАеЯ",
        "vXccПДТг4йшРmзAНРЛуЗVыNJьУyNЯ2яеЖкпб3КьНDЯъхАЕхnэи6юЙNпчaэbЧЦПHAеUdzврЮWж9Цб3ИйDцНbvD26pЖ3зрЧ4рq2rъЩшxRpмXFБcфРnъNfмуJгXUuхsнЮлЭ "
    ]
};

// Регистрация нового пользователя или обновление существующего
app.post("/register", (req, res) => {
    const { id, name, fingerprint } = req.body;

    if (!id || !name || !fingerprint) {
        return res.status(400).json({ success: false, message: "ID, имя и отпечаток пальца обязательны" });
    }

    if (!users[id]) {
      users[id] = { name, fingerprint, score: 0 };
        return res.status(201).json({ success: true, message: `Пользователь с ID ${id} успешно создан`, user: users[id]});
    } else {
        users[id] = { ...users[id], name, fingerprint };
      return res.status(200).json({ success: true, message: `Пользователь с ID ${id} успешно обновлён`, user: users[id] });
    }
});


// Получение информации о пользователе
app.get("/user/:id", (req, res) => {
    const { id } = req.params;

    if (!users[id]) {
        return res.status(404).json({ success: false, message: "Пользователь не найден" });
    }

    return res.json({ success: true, user: users[id] });
});

// Изменение счёта пользователя
app.post("/score", (req, res) => {
    const { token, id, score } = req.body;

    if (!tokenAdmin.keys.includes(token)) {
        return res.status(401).json({ success: false, message: "Неверный токен администратора" });
    }
    if(!id){
      return res.status(400).json({success: false, message: "ID пользователя обязателен"});
    }
    if(!score && score !== 0){
      return res.status(400).json({success: false, message: "Очки пользователя обязательны"});
    }
    if (!users[id]) {
        return res.status(404).json({ success: false, message: "Пользователь не найден" });
    }

    users[id].score = score;
    return res.json({ success: true, message: `Счет пользователя ${id} обновлен на ${score}.`, user: users[id]});
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер запущен по адресу http://localhost:${PORT}`));