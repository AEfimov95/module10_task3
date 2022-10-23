// websocket.send(message);
// websocket.close()

const textMessage = document.querySelector('.textMessage');
const start = document.querySelector('.startChat')
const sendMessage = document.querySelector('.sendMessage');
const sendGeo = document.querySelector('.sendGeo');
const chat = document.querySelector('.chatTextArea');
let websocket;

function error () {
    let text = document.createElement("p");
    text.textContent = 'Невозможно получить ваше местоположение';
    chat.appendChild(text);
}

function success (position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let geoPosition = document.createElement('a');
    geoPosition.classList.add('align-self-end');
    geoPosition.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    geoPosition.textContent = 'Мое местоположение';
    chat.appendChild(geoPosition);
    websocket.send(`Мое местоположение https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
}

function writeToChat(message, respond = 'align-self-end') {
    let text = document.createElement("p");
    text.textContent = message;
    text.classList.add(respond)
    chat.appendChild(text);
}
function send (){
    if (textMessage.value != '') {
        writeToChat("Вы: " + textMessage.value);
        websocket.send(textMessage.value);
        if (textMessage.value == 'Выход'||textMessage.value == 'Закончить'){
            websocket.close();
            websocket = '';
            start.classList.toggle('d-none');
            sendMessage.classList.toggle('d-none');
            sendGeo.classList.toggle('d-none');
            textMessage.setAttribute("disabled",'')
        }
    }
}
start.addEventListener('click',function (){
    websocket = new WebSocket('wss://echo-ws-service.herokuapp.com/');
    websocket.onopen = function(e) {
        chat.innerHTML = '';
        writeToChat("Начинайте общение");
    };
    websocket.onclose = function(e) {
        writeToChat("Диалог окончен");
        textMessage.value = '';
    };
    websocket.onmessage = function(e) {
        if (e.data == textMessage.value) {
        writeToChat(
            'Ответ: ' + e.data, 'align-self-start'
        );
        textMessage.value = '';
        }
    };
    websocket.onerror = function(e) {
        writeToChat(
            'Ошибка'
        );
    };
    start.classList.toggle('d-none');
    sendMessage.classList.toggle('d-none');
    sendGeo.classList.toggle('d-none');
    textMessage.removeAttribute("disabled")
})
sendMessage.addEventListener('click', send);
textMessage.addEventListener('keyup', function (e){
    if (e.keyCode === 13){
        send();
    }
});

sendGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});