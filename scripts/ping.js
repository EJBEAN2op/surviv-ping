const wsUri = "wss://eu-fra-p1.surviv.io/ptc";
const regions = document.getElementById('regions');
const output = document.getElementById('output');
const mTries = document.getElementById('retries');
let maxTries = 15;

const handler = (v) => {
    output.innerHTML = ''
    // for (const [k, b] of Object.entries(v)) console.log(k, b)
    const url = `wss://${regions.value}-p1.surviv.io/ptc`;
    init(url, maxTries);
}



function write(message) {
    const pre = document.createElement('div');
    const lineBreak = document.createElement('div');
    lineBreak.className = 'break'
    pre.innerHTML = message;
    output.appendChild(pre);
    output.appendChild(lineBreak);
}


regions.onchange = handler;
mTries.onchange = () => maxTries = mTries.value;

function log(val = '', msg = '') {
    console.log(`[${val}] ${msg}`);
}

function init(url, t) {
    /**
     * ST = ws message send time { tries: time }
     * RT = ws message recieve time
     */
    const ST = {}, RT = {};
    let st = 0, retries = 0;
    let initialTime, ping;
    let maxPing = 0, minPing, sum = 0, productSum = 0;
    const maxRetries = t;
    const webSocket = initWS(url);

    function initWS(url) {
        initialTime = Date.now();
        log('WS', 'Connecting');
        const ws = new WebSocket(url);
        ws.onopen = onopenHandler;
        ws.onclose = oncloseHandler;
        ws.onmessage = onmessageHandler
        ws.onerror = onerrorHandler;
        return ws;
    }

    function onopenHandler() {
        log('WS', 'Connected');
        ping = Date.now() - initialTime;
        send('pong');
    }

    function oncloseHandler() {
        log('WS', 'Disconnected');
        write('<p class="green">Disconnected</p>');
    }

    function onmessageHandler() {
        RT[retries] = Date.now();
        let pingRn = RT[retries] - ST[retries];
        if (pingRn > maxPing) maxPing = pingRn;
        if (!minPing || pingRn < minPing) minPing = pingRn;
        sum += pingRn;
        productSum += pingRn * pingRn;
        const col = getPingCol(pingRn);
        write(`<div style="color: red;" class="pingcout"><p class="${col}">${pingRn}ms</p></div>`);
        retries += 1;
        if (retries == maxRetries) {
            write('closed');
            write(`Tries : ${maxRetries} <br/> Lowest : ${minPing} <br /> Highest : ${maxPing} <br /> average : ${(sum / retries).toFixed(1)}`);
            webSocket.close();
        }
    }

    function getPingCol(pingRn) {
        if (pingRn < 50) col = 'green';
        else if (pingRn < 100 && pingRn >= 50) col = 'yellow';
        else col = 'red'
        return col;
    }

    function onerrorHandler() {
        log('WS', `Error connecting to ${url}`)
        write(`<p class="red">ERROR: Unable to initialize Web Socket connection</p>`);
    }

    function send(msg) {
        ST[st++] = Date.now();
        webSocket.send(msg);
        log('WS', 'message sent');
        if (st < maxRetries) setTimeout(send, 50);
    }
}