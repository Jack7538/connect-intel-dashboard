(function(){
  function get(id){ return document.getElementById(id); }
  function setStatus(text){
    var el = get('dataStatus');
    if(el){ el.textContent = text; }
  }
  function showFatal(text){
    var wrap = get('fatalWrap');
    var msg = get('fatalMsg');
    if(wrap && msg){
      wrap.style.display = 'block';
      msg.textContent = String(text || 'Unknown error');
    }
  }
  window.addEventListener('error', function(ev){
    try{
      var t = (ev && ev.message) ? ev.message : 'Script error';
      var where = (ev && ev.filename) ? (' @ ' + ev.filename + ':' + ev.lineno + ':' + ev.colno) : '';
      setStatus('Data: ERROR (see top panel)');
      showFatal(t + where);
    }catch(e){}
  }, true);
  window.addEventListener('unhandledrejection', function(ev){
    try{
      var r = ev && ev.reason ? ev.reason : '';
      setStatus('Data: ERROR (see top panel)');
      showFatal((r && (r.stack || r.message)) || r || 'Unhandled rejection');
    }catch(e){}
  }, true);

  setStatus('Data: JS started (loading??');

  var s = document.createElement('script');
  s.src = './app.js?v=20260420T1725580900';
  s.defer = true;
  s.onload = function(){};
  s.onerror = function(){
    setStatus('Data: ERROR (failed to load app.js)');
    showFatal('Failed to load app.js (syntax or network).');
  };
  document.body.appendChild(s);
})();
