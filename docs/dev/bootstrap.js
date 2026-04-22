(function(){
  if(window.__connectBootstrapLoaded){ return; }
  window.__connectBootstrapLoaded = true;
  function get(id){ return document.getElementById(id); }
  function setStatus(text){ var el = get('dataStatus'); if(el){ el.textContent = text; } }
  function showFatal(text){
    try{
      var wrap = get('fatalWrap');
      var msg = get('fatalMsg');
      if(wrap && msg){ wrap.style.display='block'; msg.textContent=String(text||'Unknown error'); }
    }catch(e){}
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

  function snippet(code, line, col){
    try{
      var lines = String(code||'').split(/\r?\n/);
      var idx = Math.max(0, (line||1)-1);
      var s = lines[idx] || '';
      var start = Math.max(0, (col||1)-40);
      return 'L' + (idx+1) + ':' + (col||1) + ' ' + s.slice(start, start+160);
    }catch(e){ return ''; }
  }

  setStatus('Data: boot 20260422T1323320900 (loading app.js...)');
  var appUrl = './app.js?v=20260422T1323320900';
  fetch(appUrl, { cache: 'no-store' }).then(function(r){
    if(!r.ok) throw new Error('HTTP ' + r.status + ' for ' + appUrl);
    return r.text();
  }).then(function(code){
    try{
      // Defensive hotfix: allow app bundles that assume records[0] exists.
      code = String(code||'');
      code = code.replace(/let\s+minDate\s*=\s*d\(records\[0\]\.date\);\s*let\s+maxDate\s*=\s*d\(records\[0\]\.date\);/g, 'let minDate=new Date();let maxDate=new Date();');
      code = code.replace(/function\s+recomputeBounds\(\)\s*\{/g, 'function recomputeBounds(){if(!records||!records.length){return;}');
    }catch(e){}
    try{
      new Function(code);
    }catch(e){
      setStatus('Data: ERROR (app.js syntax)');
      var stack = (e && (e.stack || e.message)) ? (e.stack || e.message) : String(e);
      var m = String(stack).match(/:(\d+):(\d+)/);
      var line = m ? parseInt(m[1],10) : 1;
      var col = m ? parseInt(m[2],10) : 1;
      showFatal(stack + '\n' + snippet(code, line, col));
      return;
    }
    var blob = new Blob([code], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    var s = document.createElement('script');
    s.src = url;
    s.defer = true;
    s.onload = function(){ try{ URL.revokeObjectURL(url); }catch(e){} };
    s.onerror = function(){
      setStatus('Data: ERROR (failed to run app.js)');
      showFatal('Failed to execute app.js.');
    };
    document.body.appendChild(s);
  }).catch(function(err){
    setStatus('Data: ERROR (failed to load app.js)');
    showFatal(err && (err.stack || err.message) ? (err.stack || err.message) : String(err));
  });
})();
