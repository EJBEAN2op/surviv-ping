const region = document.getElementById('regions');
const map = [
    'as-sgp',
    'eu-fra',
    'eu-waw',
    'kr-sel',
    'na-chi',
    'na-nyc',
    'na-sfo',
    'sa-sao'
];

map.forEach(x => {
    const el = document.createElement('option');
    el.value = x;
    el.innerText = x;
    region.appendChild(el);
});
console.log('[MAIN] Finished select');