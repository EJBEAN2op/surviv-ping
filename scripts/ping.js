const wsUri = "wss://eu-fra-p1.surviv.io/ptc";
const regions = document.getElementById('regions');
const output = document.getElementById('output');

const getPing = (time) => Date.now() - time;
const handler = (v) => {
    for (const [k, b] of Object.entries(v)) console.log(k, b)
    const url = `wss://${regions.value}-p1.surviv.io/ptc`;
    initWS(url);
}

function loop(n, url) {
    for (let i = 0; i < n; i++) initWS(url)
}

function initWS(url) {
    output.innerText = '';
    const ws = new WebSocket(url);
    log('WS', 'connecting');
    const time = Date.now();
    ws.onopen = () => {
        log('WS', 'connected');
        const ping = getPing(time);
        write(`<div style="color: red;" class="pingcout">PING: ${ping} ms</div>`);
        ws.send(new ArrayBuffer(1));
    };

    ws.onerror = (err) => output.innerText = `ERROR: Unable to initialize Web Socket connection`;
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





function log(val = '', msg = '') {
    console.log(`[${val}] ${msg}`);
}