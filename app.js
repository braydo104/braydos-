// Simple GPS tracker (stores locally in localStorage and allows CSV export)
(function(){
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const recordCount = document.getElementById('recordCount');
  const trackingState = document.getElementById('trackingState');
  const currentPos = document.getElementById('currentPos');
  const recordsTableBody = document.querySelector('#recordsTable tbody');

  let watchId = null;
  const STORAGE_KEY = 'gpsRecords_v1';

  function loadRecords(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }catch(e){
      return [];
    }
  }

  function saveRecords(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function addRecord(pos){
    const r = {
      timestamp: new Date(pos.timestamp).toISOString(),
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy || null,
      altitude: pos.coords.altitude || null,
      heading: pos.coords.heading || null,
      speed: pos.coords.speed || null
    };
    const arr = loadRecords();
    arr.push(r);
    saveRecords(arr);
    renderRecords();
  }

  function renderRecords(){
    const arr = loadRecords();
    recordCount.textContent = arr.length;
    recordsTableBody.innerHTML = '';
    arr.slice().reverse().forEach((r, i)=>{
      const tr = document.createElement('tr');
      const idx = arr.length - i;
      tr.innerHTML = `<td>${idx}</td><td>${r.timestamp}</td><td>${r.lat.toFixed(6)}</td><td>${r.lng.toFixed(6)}</td><td>${r.accuracy==null? '': r.accuracy}</td>`;
      recordsTableBody.appendChild(tr);
    });
  }

  function onPosition(pos){
    trackingState.textContent = 'running';
    currentPos.textContent = `Lat ${pos.coords.latitude.toFixed(6)}, Lng ${pos.coords.longitude.toFixed(6)} (acc ${pos.coords.accuracy}m)`;
    addRecord(pos);
  }

  function onError(err){
    console.warn('Geolocation error', err);
  }

  function startTracking(){
    if(!('geolocation' in navigator)){
      alert('Geolocation not supported in this browser.');
      return;
    }
    if(watchId!==null) return;
    watchId = navigator.geolocation.watchPosition(onPosition, onError, {enableHighAccuracy:true, maximumAge:1000, timeout:10000});
    startBtn.disabled = true;
    stopBtn.disabled = false;
    trackingState.textContent = 'starting...';
  }

  function stopTracking(){
    if(watchId===null) return;
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    trackingState.textContent = 'stopped';
  }

  function exportCSV(){
    const arr = loadRecords();
    if(!arr.length){
      alert('No records to export.');
      return;
    }
    const header = ['timestamp','latitude','longitude','accuracy','altitude','heading','speed'];
    const rows = arr.map(r => header.map(h => (r[h]!==null && r[h] !== undefined) ? r[h] : '').join(','));
    const csv = [header.join(',')].concat(arr.map(r => `${r.timestamp},${r.lat},${r.lng},${r.accuracy||''},${r.altitude||''},${r.heading||''},${r.speed||''}`)).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-records-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearData(){
    if(!confirm('Clear all stored GPS records?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderRecords();
  }

  // wire UI
  startBtn.addEventListener('click', startTracking);
  stopBtn.addEventListener('click', stopTracking);
  exportBtn.addEventListener('click', exportCSV);
  clearBtn.addEventListener('click', clearData);

  // initial render
  renderRecords();
})();
