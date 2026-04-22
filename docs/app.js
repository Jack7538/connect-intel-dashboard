(function(){
  if(window.__connectAppLoaded){ return; }
  window.__connectAppLoaded = true;

const embeddedRecords=[];
/* Legacy embedded records disabled (use ./connect-awareness-dashboard-data.json instead)


*/
let records = embeddedRecords;
let dataLoad = { mode:'embedded', ok:true, count: embeddedRecords.length, error:'' };

function setDataLoad(mode, ok, count, error){
  dataLoad = { mode, ok, count, error: error||'' };
  const el = document.getElementById('dataStatus');
  if(!el) return;
  const lang = (typeof state!=='undefined' && state && state.lang) ? state.lang : (document.documentElement && document.documentElement.lang ? document.documentElement.lang : 'en');
  if(mode==='remote' && ok){
    el.textContent = lang==='ko' ? `데이터: 원격 JSON 로드 완료 (${count}건)` : `Data: remote JSON loaded (${count} records)`;
  }else{
    const msg = dataLoad.error ? `; remote failed: ${dataLoad.error}` : '';
    if(lang==='ko'){
      const kmsg = dataLoad.error ? `; 원격 로드 실패: ${dataLoad.error}` : '';
      el.textContent = `데이터: 내장 백업 사용 (${count}건)${kmsg}`;
    }else{
      el.textContent = `Data: embedded fallback (${count} records)${msg}`;
    }
  }
}

async function loadRemoteRecords(){
  try{
    const res = await fetch('./connect-awareness-dashboard-data.json', {cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const cleaned = text.replace(/^\uFEFF/, '');
    const data = JSON.parse(cleaned);
    if(!Array.isArray(data) || !data.length) throw new Error('Invalid data');
    const norm = data
      .filter(r=>r && r.date && r.source && r.community && r.url)
      .map(r=>({
        date:String(r.date).slice(0,10),
        source:String(r.source),
        community:String(r.community),
        account:String(r.account||'unknown'),
        useCase:String(r.useCase||'unknown'),
        score:typeof r.score==='number'?r.score:parseInt(r.score||'0',10),
        explicit:!!r.explicit,
        excerpt:String(r.excerpt||''),
        notesEn:String(r.notesEn||''),
        notesKo:String(r.notesKo||''),
        url:String(r.url)
      }));
    if(!norm.length) throw new Error('No usable records');
    records = norm;
    setDataLoad('remote', true, norm.length, '');
    return true;
  }catch(e){
    records = embeddedRecords;
    setDataLoad('embedded', false, embeddedRecords.length, e && e.message ? e.message : String(e));
    return false;
  }
}

function statusCounts(rows){
  const total = rows.length;
  const owned = rows.filter(r=>r.source==='Owned').length;
  const external = total - owned;
  return {total, external, owned};
}
const whiteRows={en:[["VRChat creator commerce","High","Low","Define one clear problem CONNECT can solve, then collect public proof."],["General CG workflow forums","Medium","Low","Track workflow-comparison threads instead of waiting for brand mentions."],["Instagram creator proof","Medium","Low-Mid","Review credits, captions, and source references instead of hashtag counts."],["YouTube tutorials/comments","High","Low","Expand workflow-led searches in video descriptions and comments."]],ko:[["VRChat 크리에이터 커머스","높음","낮음","CONNECT가 풀 수 있는 문제 하나를 먼저 정하고, 공개 증거를 차곡차곡 모아요."],["일반 CG 워크플로 커뮤니티","중간","낮음","브랜드 언급을 기다리기보다 ‘워크플로 비교’ 스레드를 먼저 추적해요."],["인스타 크리에이터 프루프","중간","낮음-보통","해시태그보다 크레딧/캡션/출처 링크를 중심으로 확인해요."],["유튜브 튜토리얼/댓글","높음","낮음","설명란/댓글에서 워크플로 키워드로 검색을 확장해요."]]};
const i18nEn={heroTitle:"CONNECT Awareness And Usage Dashboard",heroLead:"Purpose: track verified public-web awareness and usage signals for CONNECT, then spot where utility shows up vs brand recall.",statusEyebrow:"Current State",statusTitle:"This is a first-pass public backfill dashboard.",statusBody:"The dataset reflects verified public-web evidence, not a full market census. It is enough to establish a baseline and begin weekly accumulation.",presets:{"7d":"Last 7D","30d":"Last 30D","90d":"Last 90D",ytd:"YTD",all:"All"},grain:{auto:"Auto Grain",week:"Weekly Grain",month:"Monthly Grain"},rangePrefix:"Selected Range:",applyRange:"Apply Custom Range",resetAll:"Reset To All",volumeTitle:"Volume Summary",volumeNote:"Absolute counts are shown alongside ratio-based interpretation.",volumeBadge:"Absolute Counts",volumeHeaders:["Metric","Count","Description"],countTitle:"Source / Use Case Counts",countNote:"This shows where the current filtered evidence is concentrated.",countBadge:"Count Breakdown",countHeaders:["Type","Item","Count"],legend1:"Qualified mentions",legend2:"High-value share",tips:{qualified:"Qualified mentions = number of qualified records in the selected time bucket.",hvShare:"High-value share = % of records with value score >= 4 in the bucket.",sourceDensity:"Source value density = average value score (1-5) per source; higher means more practical usage language."},readoutTitle:"Current Readout",readoutBadge:"Leadership Notes",sourceTitle:"Source Value Density",sourceNote:"This compares how much practical value each source carries in the current filtered data.",sourceBadge:"Source Prioritization",useTitle:"Use Case Mix",useNote:"This shows what kinds of problems people connect to CONNECT.",useBadge:"Messaging Input",matrixTitle:"Brand Recall vs Utility Gap",matrixBadge:"Positioning Risk",whiteTitle:"White Space Communities",whiteBadge:"Infiltration Targets",whiteHeaders:["Community","Need","Visibility","Recommended Action"],quoteTitle:"Actual User Quotes",quoteNote:"Default is Top 8 (sorted by value score). Use Show All to review every filtered record.",showTop:"Top 8 Only",showAll:"Show All",footnote:"This is a first-pass public backfill dataset. Treat the numbers as verified public records collected so far, not as total market awareness.",k1:"Filtered, qualified CONNECT mentions in the selected period",k2:"Deduplicated account count in the selected period",k4:"Share of mentions that explicitly call CONNECT by name",noData:"No data in the selected range.",quotesShown:(a,b)=>`${a} shown / ${b} filtered`,rowLabels:{q:["Qualified Mentions","Filtered records classified as real CONNECT-related mentions"],u:["Unique People","Deduplicated account count in the selected period"],h:["High-Value Mentions","Mentions tied to actual use, upload, purchase, workflow shortcut, or creator action"],b:["Explicit Brand Recall","Mentions that directly name CONNECT as a platform or destination"],l:["Low-Value Mentions","Low-information showcase or owned-surface records"]},typeLabels:{source:"Source",use:"Use Case"},useMap:{asset_browsing:"Asset Browsing",workflow_efficiency:"Workflow Efficiency",purchase:"Purchase",download:"Download",fabric_sourcing:"Fabric Sourcing",creator_posting:"Creator Posting",commercial_project:"Commercial Project",comparison_evaluation:"Comparison Evaluation",avatar_deployment:"Avatar Deployment",contest_participation:"Contest Participation",platform_positioning:"Platform Positioning",legacy_confusion:"Legacy Confusion"},readout:{a:"Top current use case",b:"Most value-dense source",c:"Brand recall vs practical usage",aBody:(u)=>`${u} is the most frequent current use case. CONNECT is still appearing more as a practical problem-solving surface than as a broadly recalled brand.`,bBody:(s)=>`${s} is the strongest current source in this dataset. The source mix is still narrow, but it remains the clearest place where practical usage language appears.`,cBody:(b,h)=>`Explicit brand recall is ${b}, while high-value usage is ${h}. Utility still appears to be ahead of brand memory.`},matrix:{a:["Explicit brand recall","Share of records that call CONNECT directly by name"],b:["High-value usage without clear brand recall","Records where practical value is strong even when brand memory is weak"],c:["Brand-value alignment","Records where strong usage and clear CONNECT recall appear together"],d:["Positioning risk","Risk that utility continues to outrun brand memory"]},openSource:"Open source",interp:"Interpretation",trend:{week:"Weekly Trend",month:"Monthly Trend"},trendNote:{week:"The filtered data is grouped by week.",month:"The filtered data is grouped by month."},centerTop:"Current Data",centerBottom:"Use Cases",score:"Score",riskHigh:"High",riskMid:"Mid",ey:{fatal:"Dashboard Error",connect:"CONNECT Intelligence",k1:"Qualified Mentions",k2:"Unique People",k3:"High-Value Share",k4:"Brand Recall Share",k5:"Top Source",k6:"Top Use Case",volume:"Volume Summary",counts:"Top Counts",trend:"Trend",readout:"Readout",sourceMix:"Source Mix",useCases:"Use Cases",matrix:"Brand vs Utility",white:"White Space",quotes:"Quote Review"}};
const i18nKo=Object.assign({}, i18nEn, {
  heroTitle:"CONNECT \uC778\uC9C0\uB3C4 \uBC0F \uC0AC\uC6A9\uAC00\uCE58 \uB300\uC26C\uBCF4\uB4DC",
  heroLead:"\uBAA9\uC801: \uACF5\uAC1C \uC6F9\uC5D0\uC11C \uD655\uC778\uB41C CONNECT \uC778\uC9C0\uB3C4/\uC0AC\uC6A9 \uC2E0\uD638\uB97C \uC218\uC9D1\uD558\uACE0, \uC720\uD2F8\uB9AC\uD2F0(\uC2E4\uC0AC\uC6A9)\uC640 \uBE0C\uB79C\uB4DC \uD68C\uC0C1\uC744 \uBE44\uAD50\uD569\uB2C8\uB2E4.",
  statusEyebrow:"\uD604\uC7AC \uC0C1\uD0DC",
  statusTitle:"\uACF5\uAC1C \uC6F9 \uBC31\uD544(\uCD08\uC548) \uB300\uC26C\uBCF4\uB4DC\uC785\uB2C8\uB2E4.",
  statusBody:"\uC774 \uB370\uC774\uD130\uC14B\uC740 \uC2E4\uC81C\uB85C \uD655\uC778\uB41C \uACF5\uAC1C \uC6F9 \uC99D\uAC70\uB97C \uAE30\uBC18\uC73C\uB85C \uD569\uB2C8\uB2E4. \uC804\uCCB4 \uC2DC\uC7A5 \uC870\uC0AC\uAC00 \uC544\uB2C8\uBA70, \uC8FC\uAC04 \uCD94\uAC00 \uC218\uC9D1\uC744 \uC704\uD55C \uAE30\uCD08 \uBCA0\uC774\uC2A4\uB77C\uC778 \uC218\uC900\uC785\uB2C8\uB2E4.",
  presets:{"7d":"\uCD5C\uADFC 7\uC77C","30d":"\uCD5C\uADFC 30\uC77C","90d":"\uCD5C\uADFC 90\uC77C",ytd:"\uC62C\uD574(YTD)",all:"\uC804\uCCB4"},
  grain:{auto:"\uC790\uB3D9",week:"\uC8FC\uAC04",month:"\uC6D4\uAC04"},
  rangePrefix:"\uC120\uD0DD \uAE30\uAC04:",
  applyRange:"\uAE30\uAC04 \uC801\uC6A9",
  resetAll:"\uC804\uCCB4\uB85C \uCD08\uAE30\uD654",
  volumeTitle:"\uBCC4\uB7C9 \uC694\uC57D",
  volumeNote:"\uC808\uB300\uCE58(\uAC74\uC218)\uC640 \uBE44\uC728 \uC9C0\uD45C\uB97C \uD568\uAED8 \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  volumeBadge:"\uC808\uB300 \uAC74\uC218",
  volumeHeaders:["\uC9C0\uD45C","\uAC74\uC218","\uC124\uBA85"],
  countTitle:"\uC18C\uC2A4 / \uC0AC\uC6A9 \uCF00\uC774\uC2A4 \uBD84\uD3EC",
  countNote:"\uD604\uC7AC \uD544\uD130 \uB370\uC774\uD130\uAC00 \uC5B4\uB290 \uC18C\uC2A4/\uC0AC\uC6A9 \uCF00\uC774\uC2A4\uC5D0 \uBAA8\uC774\uB294\uC9C0 \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  countBadge:"\uAC74\uC218 \uBD84\uD574",
  countHeaders:["\uAD6C\uBD84","\uD56D\uBAA9","\uAC74\uC218"],
  legend1:"\uAC80\uC99D\uB41C \uC5B8\uAE09",
  legend2:"\uACE0\uAC00\uCE58 \uBE44\uC728",
  tips:{
    qualified:"\uAC80\uC99D\uB41C \uC5B8\uAE09 = \uC120\uD0DD\uD55C \uAE30\uAC04/\uBC84\uD0B7\uC5D0\uC11C CONNECT \uAD00\uB828\uC73C\uB85C \uD655\uC778\uB41C \uB808\uCF54\uB4DC \uAC74\uC218\uC608\uC694.",
    hvShare:"\uACE0\uAC00\uCE58 \uBE44\uC728 = \uBC84\uD0B7 \uB0B4 \uAC00\uCE58 \uC810\uC218\uAC00 4 \uC774\uC0C1\uC778 \uB808\uCF54\uB4DC \uBE44\uC728.",
    sourceDensity:"\uC18C\uC2A4 \uAC00\uCE58 \uBC00\uB3C4 = \uC18C\uC2A4\uBCC4 \uD3C9\uADE0 \uAC00\uCE58 \uC810\uC218(1-5). \uB192\uC744\uC218\uB85D \uC2E4\uC0AC\uC6A9 \uC5B8\uC5B4\uAC00 \uB9CE\uC2B5\uB2C8\uB2E4."
  },
  readoutTitle:"\uD604\uC7AC \uC694\uC57D",
  readoutBadge:"\uD575\uC2EC \uBA54\uBAA8",
  sourceTitle:"\uC18C\uC2A4 \uAC00\uCE58 \uBC00\uB3C4",
  sourceNote:"\uD604\uC7AC \uD544\uD130 \uB370\uC774\uD130\uC5D0\uC11C \uC18C\uC2A4\uBCC4 \uC2E4\uC0AC\uC6A9 \uAC00\uCE58 \uC815\uB3C4\uB97C \uBE44\uAD50\uD569\uB2C8\uB2E4.",
  sourceBadge:"\uC18C\uC2A4 \uC6B0\uC120\uC21C\uC704",
  useTitle:"\uC0AC\uC6A9 \uC2DC\uB098\uB9AC\uC624",
  useNote:"CONNECT\uAC00 \uC5B4\uB5A4 \uBB38\uC81C/\uC0C1\uD669\uC5D0 \uC5F0\uACB0\uB418\uB294\uC9C0 \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  useBadge:"\uBA54\uC2DC\uC9C0\uB9C1 \uC785\uB825",
  matrixTitle:"\uBE0C\uB79C\uB4DC \uD68C\uC0C1 vs \uC720\uD2F8\uB9AC\uD2F0 \uACB9\uCE68",
  matrixBadge:"\uD3EC\uC9C0\uC154\uB2DD \uB9AC\uC2A4\uD06C",
  quoteTitle:"\uC2E4\uC81C \uC720\uC800 \uC778\uC6A9",
  quoteNote:"\uAE30\uBCF8\uC740 \uAC00\uCE58 \uC810\uC218 \uC21C \uC0C1\uC704 8\uAC1C\uB9CC \uBCF4\uC5EC\uC90D\uB2C8\uB2E4. '\uC804\uCCB4 \uBCF4\uAE30'\uB85C \uD544\uD130 \uB808\uCF54\uB4DC\uB97C \uBAA8\uB450 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  showTop:"\uC0C1\uC704 8\uAC1C\uB9CC",
  showAll:"\uC804\uCCB4 \uBCF4\uAE30",
  footnote:"\uC774 \uB370\uC774\uD130\uC14B\uC740 \uACF5\uAC1C \uC6F9 \uBC31\uD544(\uCD08\uC548)\uC785\uB2C8\uB2E4. \uC2DC\uC7A5 \uC804\uCCB4 \uC778\uC9C0\uB3C4\uAC00 \uC544\uB2C8\uB77C, \uD604\uC7AC\uAE4C\uC9C0 \uC218\uC9D1\uB41C '\uD655\uC778 \uACF5\uAC1C \uB808\uCF54\uB4DC'\uB9CC \uAE30\uC900\uC73C\uB85C \uBD10 \uC8FC\uC138\uC694.",
  noData:"\uC120\uD0DD\uD55C \uAE30\uAC04\uC5D0 \uB370\uC774\uD130\uAC00 \uC5C6\uC5B4\uC694.",
  openSource:"\uC6D0\uBB38 \uBCF4\uAE30",
  interp:"\uD574\uC11D",
  score:"\uAC00\uCE58",
  riskHigh:"\uB192\uC74C",
  riskMid:"\uBCF4\uD1B5",
  quotesShown:(a,b)=>`${a}\uAC1C \uD45C\uC2DC / ${b}\uAC1C \uD544\uD130\uB428`,
  quoteCount:(n)=>`\uD45C\uC2DC ${n}\uAC1C`,
  k1:"\uC120\uD0DD \uAE30\uAC04 \uB0B4 \uAC80\uC99D\uB41C CONNECT \uC5B8\uAE09 \uAC74\uC218",
  k2:"\uC120\uD0DD \uAE30\uAC04 \uB0B4 \uACE0\uC720 \uACC4\uC815(\uC0AC\uB78C) \uC218",
  k4:"CONNECT\uB97C \uC9C1\uC811 \uBA85\uC2DC\uD55C \uC5B8\uAE09 \uBE44\uC728",
  k3d:(n)=>`\uAC00\uCE58 4\uC810+ ${n}\uAC74`,
  k5d:(d,m)=>`\uD3C9\uADE0 ${d} \u00B7 ${m}\uAC74`,
  k6d:(c)=>`${c}\uAC74`,
  volumeTitle:"\uC5B8\uAE09 \uC694\uC57D",
  volumeNote:"\uAC74\uC218(\uC808\uB300\uCE58)\uC640 \uBE44\uC728(\uD574\uC11D)\uC744 \uAC19\uC774 \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  volumeBadge:"\uAC74\uC218 \uAE30\uC900",
  countTitle:"\uC18C\uC2A4/\uC0AC\uC6A9 \uC2DC\uB098\uB9AC\uC624 \uBD84\uD3EC",
  countNote:"\uD604\uC7AC \uD544\uD130 \uB370\uC774\uD130\uAC00 \uC5B4\uB514\uC5D0 \uBAA8\uC774\uB294\uC9C0 \uD55C \uB208\uC5D0 \uBCF4\uC5EC\uC694.",
  countBadge:"\uBD84\uD3EC \uC694\uC57D",
  whiteTitle:"\uD654\uC774\uD2B8\uC2A4\uD398\uC774\uC2A4 \uCEE4\uBBA4\uB2C8\uD2F0",
  whiteBadge:"\uACF5\uB7B5 \uD0C0\uAC9F",
  whiteHeaders:["\uCEE4\uBBA4\uB2C8\uD2F0","\uB2C8\uC988","\uAC00\uC2DC\uC131","\uB2E4\uC74C \uC561\uC158"],
  readout:{a:"\uAC00\uC7A5 \uB9CE\uC774 \uB4F1\uC7A5\uD558\uB294 \uC0AC\uC6A9 \uC2DC\uB098\uB9AC\uC624",b:"\uAC00\uCE58 \uBB50\uAC00 \uB192\uC740 \uC18C\uC2A4",c:"\uBE0C\uB79C\uB4DC \uD68C\uC0C1 vs \uC2E4\uC0AC\uC6A9",d:"\uB370\uC774\uD130 \uCEE4\uBC84\uB9AC\uC9C0",aBody:(u)=>`\uD604\uC7AC \uB370\uC774\uD130\uC5D0\uC11C '${u}' \uC5B8\uAE09\uC774 \uAC00\uC7A5 \uB9CE\uC544\uC694. CONNECT\uB294 \uBE0C\uB79C\uB4DC \uD68C\uC0C1\uBCF4\uB2E4 \uC2E4\uC0AC\uC6A9 \uBB38\uC81C \uD574\uACB0 \uBA74\uC5D0\uC11C \uB354 \uB450\uB4DC\uB7EC\uC9C0\uB294 \uC911\uC785\uB2C8\uB2E4.`,bBody:(s)=>`\uD604\uC7AC \uB370\uC774\uD130\uC5D0\uC11C '${s}'\uAC00 \uAC00\uCE58 \uBB00\uB3C4\uAC00 \uAC00\uC7A5 \uB192\uC544\uC694. \uC18C\uC2A4 \uBBF9\uC2A4\uB294 \uC544\uC9C1 \uD3B8\uC911\uB418\uC5B4 \uC788\uC9C0\uB9CC, \uC2E4\uC0AC\uC6A9 \uC5B8\uC5B4\uB294 \uC5EC\uAE30\uC5D0\uC11C \uAC00\uC7A5 \uC120\uBA85\uD558\uAC8C \uB098\uC640\uC694.`,cBody:(b,h)=>`\uBE0C\uB79C\uB4DC \uC9C1\uC811 \uC5B8\uAE09\uC740 ${b}, \uACE0\uAC00\uCE58 \uC2E4\uC0AC\uC6A9\uC740 ${h}\uC608\uC694. \uC544\uC9C1\uC740 '\uC720\uD2F8\uB9AC\uD2F0 \u2192 \uBE0C\uB79C\uB4DC \uD68C\uC0C1'\uC758 \uACA9\uCC28\uAC00 \uC788\uC5B4 \uBCF4\uC785\uB2C8\uB2E4.`,dBody:(m,t,p)=>`\uD604\uC7AC \uD544\uD130\uB294 \uCD1D ${m}\uAC1C \uC6D4 \uB2E8\uC704\uB85C \uB370\uC774\uD130\uAC00 \uC788\uC5B4\uC694. \uAC00\uC7A5 \uD070 \uB2EC\uC740 ${t}(${p})\uC785\uB2C8\uB2E4. \uD2B9\uC815 \uB2EC\uC5D0 \uD3B8\uC911\uB418\uBA74 \uAC70\uAE30\uB85C\uB9CC \uC778\uC0AC\uC774\uD2B8\uAC00 \uCE5C\uC6C3\uD560 \uC218 \uC788\uC73C\uB2C8, \uBE48 \uAE30\uAC04\uC744 \uC6B0\uC120 \uCC44\uC6CC\uC694.`},
  matrix:{a:["\uBE0C\uB79C\uB4DC \uC9C1\uC811 \uC5B8\uAE09","\uB808\uCF54\uB4DC \uC911 CONNECT\uB97C \uC774\uB984\uC73C\uB85C \uC9C1\uC811 \uBD80\uB974\uB294 \uBE44\uC728"],b:["\uC2E4\uC0AC\uC6A9\uC740 \uAC15\uD55C\uB370 \uBE0C\uB79C\uB4DC \uC5B8\uAE09\uC740 \uC5C6\uC74C","\uAC00\uCE58 \uC810\uC218\uB294 \uB192\uC9C0\uB9CC \uBE0C\uB79C\uB4DC \uD68C\uC0C1\uC740 \uC57D\uD55C \uACBD\uC6B0"],c:["\uBE0C\uB79C\uB4DC-\uAC00\uCE58 \uC77C\uCE58","\uBE0C\uB79C\uB4DC \uD68C\uC0C1\uACFC \uC2E4\uC0AC\uC6A9 \uAC00\uCE58\uAC00 \uD568\uAED8 \uB4F1\uC7A5\uD558\uB294 \uACBD\uC6B0"],d:["\uD3EC\uC9C0\uC154\uB2DD \uB9AC\uC2A4\uD06C","\uC720\uD2F8\uB9AC\uD2F0\uAC00 \uBE0C\uB79C\uB4DC \uD68C\uC0C1\uC744 \uC9C0\uC18D\uC801\uC73C\uB85C \uC555\uB3C4\uD558\uB294 \uC9C0\uC810"]},
  useMap:{asset_browsing:"\uC5D0\uC14B \uD0D0\uC0C9",workflow_efficiency:"\uC6CC\uD06C\uD50C\uB85C \uD6A8\uC728",purchase:"\uAD6C\uB9E4",download:"\uB2E4\uC6B4\uB85C\uB4DC",fabric_sourcing:"\uC18C\uC7AC/\uC6D0\uB2E8 \uC18C\uC2F1",creator_posting:"\uD06C\uB9AC\uC5D0\uC774\uD130 \uAC8C\uC2DC",commercial_project:"\uC0C1\uC5C5 \uD504\uB85C\uC81D\uD2B8",comparison_evaluation:"\uBE44\uAD50/\uAC80\uD1A0",avatar_deployment:"\uC544\uBC14\uD0C0 \uC801\uC6A9",contest_participation:"\uCF58\uD14C\uC2A4\uD2B8 \uCC38\uC5EC",platform_positioning:"\uD50C\uB7AB\uD3FC \uD3EC\uC9C0\uC154\uB2DD",legacy_confusion:"\uAE30\uC874/\uD63C\uB3D9"},
  typeLabels:{source:"\uC18C\uC2A4",use:"\uC0AC\uC6A9 \uC2DC\uB098\uB9AC\uC624"},
  rowLabels:{q:["\uAC80\uC99D\uB41C \uC5B8\uAE09","\uD544\uD130 \uAE30\uC900\uC744 \uD1B5\uACFC\uD55C \uAC80\uC99D \uB808\uCF54\uB4DC \uAC74\uC218"],u:["\uACE0\uC720 \uACC4\uC815","\uC120\uD0DD\uD55C \uAE30\uAC04\uC5D0\uC11C \uC911\uBCF5\uC744 \uC81C\uAC70\uD55C \uACC4\uC815(\uC0AC\uB78C) \uC218"],h:["\uACE0\uAC00\uCE58 \uC5B8\uAE09","\uAD6C\uB9E4/\uB2E4\uC6B4\uB85C\uB4DC/\uC6CC\uD06C\uD50C\uB85C \uAC1C\uC120 \uB4F1 \uC2E4\uC0AC\uC6A9 \uB0B4\uC6A9\uC774 \uB4DC\uB7EC\uB09C \uC5B8\uAE09"],b:["\uBE0C\uB79C\uB4DC \uC9C1\uC811 \uC5B8\uAE09","CONNECT\uB97C \uD50C\uB7AB\uD3FC/\uB300\uC0C1\uC73C\uB85C \uC9C1\uC811 \uBA85\uC2DC\uD55C \uC5B8\uAE09"],l:["\uB0AE\uC740 \uAC00\uCE58 \uC5B8\uAE09","\uC815\uBCF4\uAC00 \uC801\uAC70\uB098 \uC18C\uC720 \uC11C\uD398\uC774\uC2A4 \uC704\uC8FC\uC758 \uC5B8\uAE09"]},
  trend:{week:"\uC8FC\uAC04 \uCD94\uC138",month:"\uC6D4\uAC04 \uCD94\uC138"},
  trendNote:{week:"\uB370\uC774\uD130\uB97C \uC8FC \uB2E8\uC704\uB85C \uBB36\uC5B4\uC11C \uBCF4\uC5EC\uC918\uC694.",month:"\uB370\uC774\uD130\uB97C \uC6D4 \uB2E8\uC704\uB85C \uBB36\uC5B4\uC11C \uBCF4\uC5EC\uC918\uC694."},
  centerTop:"\uD604\uC7AC \uB370\uC774\uD130",
  centerBottom:"\uC0AC\uC6A9 \uC2DC\uB098\uB9AC\uC624",
  ey:{fatal:"\uB300\uC26C\uBCF4\uB4DC \uC624\uB958",connect:"CONNECT \uC778\uD154\uB9AC\uC804\uC2A4",k1:"\uC815\uC81C \uC5B8\uAE09",k2:"\uACE0\uC720 \uC0AC\uB78C",k3:"\uACE0\uAC00\uCE58 \uBE44\uC728",k4:"\uBE0C\uB79C\uB4DC \uD68C\uC0C1 \uBE44\uC728",k5:"\uD0D1 \uC18C\uC2A4",k6:"\uD0D1 \uC0AC\uC6A9 \uCF00\uC774\uC2A4",volume:"\uBCC4\uB7C9 \uC694\uC57D",counts:"\uC0C1\uC704 \uAC74\uC218",trend:"\uCD94\uC138",readout:"\uC694\uC57D",sourceMix:"\uC18C\uC2A4 \uBBF9\uC2A4",useCases:"\uC0AC\uC6A9 \uCF00\uC774\uC2A4",matrix:"\uBE0C\uB79C\uB4DC vs \uC720\uD2F8\uB9AC\uD2F0",white:"\uD654\uC774\uD2B8 \uC2A4\uD398\uC774\uC2A4",quotes:"\uC720\uC800 \uC778\uC6A9"}
});
const i18n={en:i18nEn,ko:i18nKo};
// Add small helper formatters/tips without touching the large object literals above.
i18nEn.densityFmt = (d,m)=>`Avg ${d} · ${m}`;
i18nKo.densityFmt = (d,m)=>`평균 ${d}점 · ${m}건`;
i18nEn.k3d = (n)=>`Score 4+ ${n}`;
i18nEn.k5d = (d,m)=>`Avg ${d} · ${m}`;
i18nEn.k6d = (c)=>`${c}`;
i18nEn.quoteCount = (n)=>`${n} shown`;

i18nEn.tips.matrixPct =
  "Percentages are computed on the currently filtered records.\n\n" +
  "Explicit brand recall = explicit records / total.\n" +
  "High-value w/o brand = (score>=4 AND not explicit) / total.\n" +
  "Brand-value alignment = (score>=4 AND explicit) / total.\n\n" +
  "All are shares of total (not cumulative).";
i18nKo.tips.matrixPct =
  "\uC5EC\uAE30 \uD37C\uC13C\uD2B8\uB294 '\uD604\uC7AC \uD544\uD130\uB41C \uB808\uCF54\uB4DC \uC804\uCCB4'\uB97C \uBD84\uBAA8\uB85C \uD574\uC694.\n\n" +
  "\uBE0C\uB79C\uB4DC \uC9C1\uC811 \uC5B8\uAE09 = explicit \uB808\uCF54\uB4DC / \uC804\uCCB4.\n" +
  "\uACE0\uAC00\uCE58(\uBE0C\uB79C\uB4DC \uBBF8\uC5B8\uAE09) = (score>=4 \uC774\uBA74\uC11C explicit \uC544\uB2D8) / \uC804\uCCB4.\n" +
  "\uBE0C\uB79C\uB4DC-\uAC00\uCE58 \uC77C\uCE58 = (score>=4 \uC774\uACE0 explicit) / \uC804\uCCB4.\n\n" +
  "\uB2E4 \uC804\uCCB4 \uB300\uBE44 \uBE44\uC728(\uC911\uBCF5\uD569\uACC4 \uC544\uB2D8)\uC774\uC5D0\uC694.";
i18nEn.tips.quoteScore =
  "Score (1-5) is a conservative value/usage signal.\n" +
  "5: clear workflow/purchase/download impact + strong proof.\n" +
  "4: practical use language (how-to, sourcing, workflow shortcut).\n" +
  "3: meaningful mention, but limited utility detail.\n" +
  "2: low info (name-drop, vague, re-share).\n" +
  "1: owned/placeholder or effectively no signal.";
i18nKo.tips.quoteScore =
  "\uC2A4\uCF54\uC5B4(1~5)\uB294 '\uC2E4\uC0AC\uC6A9/\uAC00\uCE58 \uC2E0\uD638'\uB97C \uBCF4\uC218\uC801\uC73C\uB85C \uB9E4\uAE34 \uAC83\uC774\uC5D0\uC694.\n" +
  "5: \uC6CC\uD06C\uD50C\uB85C/\uAD6C\uB9E4/\uB2E4\uC6B4\uB85C\uB4DC \uD6A8\uACFC\uAC00 \uBA85\uD655\uD558\uACE0 \uC99D\uAC70\uAC00 \uD655\uC2E4\uD574\uC694.\n" +
  "4: \uC5B4\uB5BB\uAC8C \uC4F0\uB294\uC9C0(\uC18C\uC2F1/\uD65C\uC6A9/\uC9C0\uB984\uAE38)\uAC19\uC740 \uC2E4\uC0AC\uC6A9 \uB9D0\uC774 \uB4DC\uB7EC\uB098\uC694.\n" +
  "3: \uC758\uBBF8\uB294 \uC788\uC9C0\uB9CC \uC720\uD2F8\uB9AC\uD2F0 \uB514\uD14C\uC77C\uC774 \uBD80\uC871\uD574\uC694.\n" +
  "2: \uC774\uB984\uB9CC \uD55C \uBC88 \uB098\uC624\uAC70\uB098 \uB9C9\uC5F0\uD574\uC694(\uC815\uBCF4 \uBD80\uC871).\n" +
  "1: \uC18C\uC720 \uC11C\uD398\uC774\uC2A4/\uD45C\uC2DC\uC6A9 \uB4F1 \uC2E4\uC9C8 \uC2E0\uD638\uAC00 \uAC70\uC758 \uC5C6\uC5B4\uC694.";

const state={lang:'en',preset:'all',start:null,end:null,grain:'auto',quoteMode:'top'};
const $=id=>{const el=document.getElementById(id);if(!el)throw new Error(`Missing element: #${id}`);return el};
const $opt=id=>document.getElementById(id);
const d=v=>new Date(`${v}T00:00:00`);
const f=x=>x.toISOString().slice(0,10);

function ensureHelpStyles(){
  if(document.getElementById('helpCss')) return;
  const style = document.createElement('style');
  style.id = 'helpCss';
  style.textContent =
    ".help{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.60);color:var(--muted);font-size:12px;font-weight:700;cursor:help;position:relative;margin-left:8px;line-height:1;flex:0 0 auto}" +
    ".help:focus{outline:2px solid rgba(45,111,101,.35);outline-offset:2px}" +
    ".help[data-tip]:hover::after,.help[data-tip]:focus::after{content:attr(data-tip);position:absolute;left:0;top:26px;transform:none;background:#1c252d;color:#fff;padding:12px 14px;border-radius:14px;min-width:320px;max-width:560px;white-space:pre-wrap;word-break:keep-all;overflow-wrap:anywhere;line-height:1.55;z-index:50;box-shadow:0 14px 34px rgba(28,37,45,.18)}" +
    ".help[data-tip]:hover::before,.help[data-tip]:focus::before{content:'';position:absolute;left:10px;top:18px;transform:none;border:7px solid transparent;border-bottom-color:#1c252d;z-index:51}" +
    "@media (max-width:720px){.help[data-tip]:hover::after,.help[data-tip]:focus::after{min-width:240px;max-width:320px}}";
  document.head.appendChild(style);
}
function ensureVizStyles(){
  if(document.getElementById('vizCss')) return;
  const style = document.createElement('style');
  style.id = 'vizCss';
  style.textContent =
    "#useChart path{cursor:pointer;transition:transform .12s ease,opacity .12s ease,filter .12s ease,stroke-width .12s ease}" +
    "#useChart path.is-dim{opacity:.35}" +
    "#useChart path.is-active{transform:scale(1.04);transform-box:fill-box;transform-origin:center;filter:drop-shadow(0 10px 14px rgba(28,37,45,.14));stroke:#1c252d;stroke-opacity:.18;stroke-width:2}" +
    "#useLegend .legend-item{border-radius:12px;padding:6px 8px;transition:background .12s ease,box-shadow .12s ease,transform .12s ease}" +
    "#useLegend .legend-item.is-dim{opacity:.55}" +
    "#useLegend .legend-item.is-active{background:rgba(28,37,45,.06);box-shadow:0 10px 18px rgba(28,37,45,.10);transform:translateY(-1px)}";
  document.head.appendChild(style);
}
function ensureHelpIn(targetId, helpId, tip){
  const target = $opt(targetId);
  if(!target) return;
  let help = $opt(helpId);
  if(!help){
    help = document.createElement('span');
    help.id = helpId;
    help.className = 'help';
    help.textContent = '?';
    help.tabIndex = 0;
    target.appendChild(help);
  }
  help.setAttribute('data-tip', String(tip||''));
}

function showFatal(err){
  const wrap=document.getElementById('fatalWrap');
  const msg=document.getElementById('fatalMsg');
  if(!wrap||!msg)return;
  wrap.style.display='block';
  const text=err && (err.stack||err.message) ? (err.stack||err.message) : String(err||'Unknown error');
  msg.textContent=text;
}
let minDate=new Date();let maxDate=new Date();
function tr(){return i18n[state.lang]||i18n.en} function useLabel(k){return tr().useMap[k]||k} function note(row){return state.lang==='ko'?(row.notesKo||row.notesEn||''):(row.notesEn||row.notesKo||'')} function pct(v){return `${Math.round(v)}%`} 
function recomputeBounds(){if(!records||!records.length){return;}minDate=records.reduce((m,r)=>d(r.date)<m?d(r.date):m,d(records[0].date));maxDate=records.reduce((m,r)=>d(r.date)>m?d(r.date):m,d(records[0].date))}
function resolveRange(){let s,e;if(state.start&&state.end){s=d(state.start);e=d(state.end)}else{e=maxDate;if(state.preset==='7d'){s=new Date(e);s.setDate(e.getDate()-6)}else if(state.preset==='30d'){s=new Date(e);s.setDate(e.getDate()-29)}else if(state.preset==='90d'){s=new Date(e);s.setDate(e.getDate()-89)}else if(state.preset==='ytd'){s=new Date(e.getFullYear(),0,1)}else{s=minDate}}if(s<minDate)s=minDate;if(e>maxDate)e=maxDate;if(e<s)[s,e]=[e,s];return{start:s,end:e}}
function filtered(){const {start,end}=resolveRange();return records.filter(r=>{const x=d(r.date);return x>=start&&x<=end})} function daysInRange(){const {start,end}=resolveRange();return Math.round((end-start)/86400000)+1} function grainMode(){if(state.grain!=='auto')return state.grain;return daysInRange()<=120?'week':'month'} function weekStart(dateObj){const c=new Date(dateObj);const day=c.getDay();const diff=day===0?-6:1-day;c.setDate(c.getDate()+diff);return c} function bucket(dateObj,mode){if(mode==='month')return `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}`;const ws=weekStart(dateObj);return `${ws.getFullYear()}-${String(ws.getMonth()+1).padStart(2,'0')}-${String(ws.getDate()).padStart(2,'0')}`}
function aggregateTrend(rows,mode){const map=new Map();rows.forEach(r=>{const key=bucket(d(r.date),mode);if(!map.has(key))map.set(key,{label:key,mentions:0,hv:0});const it=map.get(key);it.mentions+=1;if(r.score>=4)it.hv+=1});return [...map.values()].sort((a,b)=>a.label.localeCompare(b.label)).map(it=>({label:it.label,mentions:it.mentions,hvShare:it.mentions?it.hv/it.mentions*100:0}))}
function groupBy(rows,fn){const map=new Map();rows.forEach(r=>{const k=fn(r);map.set(k,(map.get(k)||0)+1)});return [...map.entries()].map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name))} function sourceDensity(rows){const map=new Map();rows.forEach(r=>{if(!map.has(r.source))map.set(r.source,{name:r.source,mentions:0,total:0});const it=map.get(r.source);it.mentions+=1;it.total+=r.score});const colors=['#b55b38','#2d6f65','#6d5e92','#d89b2b','#5b6778'];return [...map.values()].sort((a,b)=>(b.total/b.mentions)-(a.total/a.mentions)).map((it,i)=>({name:it.name,mentions:it.mentions,density:it.total/it.mentions,color:colors[i%colors.length]}))}
function renderStatic(){
  const x = tr();
  document.documentElement.lang = state.lang;
  ensureHelpStyles();
  ensureVizStyles();

  $('langEnBtn').classList.toggle('active', state.lang === 'en');
  $('langKoBtn').classList.toggle('active', state.lang === 'ko');
  $('langEnBtn').classList.toggle('subtle-btn', state.lang !== 'en');
  $('langKoBtn').classList.toggle('subtle-btn', state.lang !== 'ko');
  $('langEnBtn').textContent = 'English';
  $('langKoBtn').textContent = '\uD55C\uAD6D\uC5B4';

  if(x.ey){
    const setEy = (id, value)=>{
      const el = document.getElementById(id);
      if(el && value){ el.textContent = value; }
    };
    setEy('eyFatal', x.ey.fatal);
    setEy('eyConnect', x.ey.connect);
    setEy('eyK1', x.ey.k1);
    setEy('eyK2', x.ey.k2);
    setEy('eyK3', x.ey.k3);
    setEy('eyK4', x.ey.k4);
    setEy('eyK5', x.ey.k5);
    setEy('eyK6', x.ey.k6);
    setEy('eyVolume', x.ey.volume);
    setEy('eyCounts', x.ey.counts);
    setEy('eyTrend', x.ey.trend);
    setEy('eyReadout', x.ey.readout);
    setEy('eySourceMix', x.ey.sourceMix);
    setEy('eyUseCases', x.ey.useCases);
    setEy('eyMatrix', x.ey.matrix);
    setEy('eyWhite', x.ey.white);
    setEy('eyQuotes', x.ey.quotes);
  }
  const linkException = document.getElementById('linkException');
  const linkOps = document.getElementById('linkOps');
  const linkLog = document.getElementById('linkLog');
  if(linkException) linkException.textContent = state.lang==='ko' ? '\uC608\uC678 \uD050' : 'Exception Queue';
  if(linkOps) linkOps.textContent = state.lang==='ko' ? '\uC218\uC9D1 \uC6B4\uC601 \uBAA8\uB378' : 'AI-First Ops';
  if(linkLog) linkLog.textContent = state.lang==='ko' ? '\uBA58\uC158 \uB85C\uADF8 V2' : 'Mention Log V2';

  $('heroTitle').textContent = x.heroTitle;
  $('heroLead').textContent = x.heroLead;
  $('statusEyebrow').textContent = x.statusEyebrow;
  $('statusTitle').textContent = x.statusTitle;
  $('statusBody').textContent = x.statusBody;

  const c = statusCounts(records);
  const statusItems = state.lang === 'ko'
    ? [`\uC2E4\uC81C \uB85C\uB4DC\uB41C \uB808\uCF54\uB4DC: ${c.total}`, `\uC678\uBD80 \uACF5\uAC1C \uC5B8\uAE09: ${c.external}`, `Owned / \uACF5\uC2DD \uB808\uCF54\uB4DC: ${c.owned}`]
    : [`Actual records loaded: ${c.total}`, `External public mentions: ${c.external}`, `Owned / official records: ${c.owned}`];
  $('statusList').innerHTML = statusItems.map(v=>`<li>${v}</li>`).join('');

  $('p7').textContent = x.presets['7d'];
  $('p30').textContent = x.presets['30d'];
  $('p90').textContent = x.presets['90d'];
  $('pytd').textContent = x.presets.ytd;
  $('pall').textContent = x.presets.all;

  $('grain').options[0].text = x.grain.auto;
  $('grain').options[1].text = x.grain.week;
  $('grain').options[2].text = x.grain.month;

  $('rangePrefix').textContent = x.rangePrefix;
  $('applyRange').textContent = x.applyRange;
  $('resetAll').textContent = x.resetAll;

  $('volumeTitle').textContent = x.volumeTitle;
  $('volumeNote').textContent = x.volumeNote;
  $('volumeBadge').textContent = x.volumeBadge;
  [$('vh1').textContent, $('vh2').textContent, $('vh3').textContent] = x.volumeHeaders;

  $('countTitle').textContent = x.countTitle;
  $('countNote').textContent = x.countNote;
  $('countBadge').textContent = x.countBadge;
  [$('ch1').textContent, $('ch2').textContent, $('ch3').textContent] = x.countHeaders;

  $('legend1').textContent = x.legend1;
  $('legend2').textContent = x.legend2;
  $('legend1').title = x.tips.qualified;
  $('legend2').title = x.tips.hvShare;
  ensureHelpIn('legend1','helpQualified',x.tips.qualified);
  ensureHelpIn('legend2','helpHvShare',x.tips.hvShare);

  $('readoutTitle').textContent = x.readoutTitle;
  $('readoutBadge').textContent = x.readoutBadge;

  $('sourceTitle').textContent = x.sourceTitle;
  $('sourceNote').textContent = x.sourceNote;
  $('sourceBadge').textContent = x.sourceBadge;
  $('sourceTitle').title = x.tips.sourceDensity;
  $('sourceNote').title = x.tips.sourceDensity;
  $('sourceBadge').title = x.tips.sourceDensity;
  ensureHelpIn('sourceTitle','helpSourceDensity',x.tips.sourceDensity + `\n\n${state.lang==='ko'?'표시 형식: 평균 4.0점 · 1건':'Format: Avg 4.0 · 1'}`);

  $('useTitle').textContent = x.useTitle;
  $('useNote').textContent = x.useNote;
  $('useBadge').textContent = x.useBadge;

  $('matrixTitle').textContent = x.matrixTitle;
  $('matrixBadge').textContent = x.matrixBadge;
  ensureHelpIn('matrixTitle','helpMatrixPct',x.tips.matrixPct || '');

  $('whiteTitle').textContent = x.whiteTitle;
  $('whiteBadge').textContent = x.whiteBadge;
  [$('wh1').textContent, $('wh2').textContent, $('wh3').textContent, $('wh4').textContent] = x.whiteHeaders;

  $('quoteTitle').textContent = x.quoteTitle;
  $('quoteNote').textContent = x.quoteNote;
  $('showTopBtn').textContent = x.showTop;
  $('showAllBtn').textContent = x.showAll;
  $('footnote').textContent = x.footnote;
  ensureHelpIn('quoteTitle','helpQuoteScore',x.tips.quoteScore || '');
}
function renderKpis(rows){
  const x=tr();
  const mentions=rows.length;
  const people=new Set(rows.map(r=>r.account)).size;
  const hv=rows.filter(r=>r.score>=4).length;
  const br=rows.filter(r=>r.explicit).length;
  const topS=sourceDensity(rows)[0];
  const topU=groupBy(rows,r=>r.useCase)[0];

  $('k1').textContent=mentions;
  $('k1d').textContent=x.k1;
  $('k2').textContent=people;
  $('k2d').textContent=x.k2;
  $('k3').textContent=pct(mentions?hv/mentions*100:0);
  $('k3d').textContent=(x.k3d?x.k3d(hv):`score 4+ ${hv}`);
  $('k4').textContent=pct(mentions?br/mentions*100:0);
  $('k4d').textContent=x.k4;
  $('k5').textContent=topS?topS.name:'-';
  $('k5d').textContent=topS?(x.k5d?x.k5d(topS.density.toFixed(1), topS.mentions):`${topS.density.toFixed(1)} / ${topS.mentions}`):x.noData;
  $('k6').textContent=topU?useLabel(topU.name):'-';
  $('k6d').textContent=topU?(x.k6d?x.k6d(topU.count):`${topU.count}`):x.noData;
}
function renderTables(rows){const x=tr();const volume=[[x.rowLabels.q[0],rows.length,x.rowLabels.q[1]],[x.rowLabels.u[0],new Set(rows.map(r=>r.account)).size,x.rowLabels.u[1]],[x.rowLabels.h[0],rows.filter(r=>r.score>=4).length,x.rowLabels.h[1]],[x.rowLabels.b[0],rows.filter(r=>r.explicit).length,x.rowLabels.b[1]],[x.rowLabels.l[0],rows.filter(r=>r.score<=2).length,x.rowLabels.l[1]]];$('volumeSummary').innerHTML=volume.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');const breakdown=[];groupBy(rows,r=>r.source).slice(0,4).forEach(it=>breakdown.push([x.typeLabels.source,it.name,it.count]));groupBy(rows,r=>r.useCase).slice(0,6).forEach(it=>breakdown.push([x.typeLabels.use,useLabel(it.name),it.count]));$('countBreakdown').innerHTML=breakdown.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
function renderReadout(rows){const x=tr();const mentions=rows.length||0;if(!mentions){$('readout').innerHTML=`<p class="note">${x.noData}</p>`;return}const hv=rows.filter(r=>r.score>=4).length;const br=rows.filter(r=>r.explicit).length;const topS=sourceDensity(rows)[0]?.name||x.noData;const topU=useLabel(groupBy(rows,r=>r.useCase)[0]?.name||x.noData);const byMonth=groupBy(rows,r=>String(r.date||'').slice(0,7)).filter(b=>b.name&&b.name.length===7);const mCount=byMonth.length||1;const topM=byMonth[0]?.name||x.noData;const topShare=byMonth[0]?.count?pct(byMonth[0].count/mentions*100):pct(0);const cards=[{title:x.readout.a,body:x.readout.aBody(topU)},{title:x.readout.b,body:x.readout.bBody(topS)},{title:x.readout.c,body:x.readout.cBody(pct(br/mentions*100),pct(hv/mentions*100))},{title:x.readout.d||"Coverage",body:(x.readout.dBody?x.readout.dBody(mCount,topM,topShare):`Active months: ${mCount}. Top month: ${topM} (${topShare}).`)}];$('readout').innerHTML=cards.map(c=>`<article class="item"><h3>${c.title}</h3><p>${c.body}</p></article>`).join('')}
function renderTrend(points,mode){
  const x=tr();
  $('trendTitle').textContent=x.trend[mode];
  $('trendNote').textContent=x.trendNote[mode];
  $('trendBadge').textContent=mode==='week'?x.grain.week:x.grain.month;
  const svg=$('trendChart');
  if(!points.length){
    svg.innerHTML=`<text x="360" y="130" text-anchor="middle" font-size="16" fill="#66707a">${x.noData}</text>`;
    return;
  }
  const width=720,height=260,pad={top:18,right:36,bottom:40,left:42};
  const chartW=width-pad.left-pad.right,chartH=height-pad.top-pad.bottom;
  const maxM=Math.max(...points.map(p=>p.mentions),1)+1;
  const stepX=points.length===1?0:chartW/(points.length-1);
  const grid=[.25,.5,.75,1].map(r=>{
    const y=pad.top+chartH-chartH*r;
    return `<line x1="${pad.left}" y1="${y}" x2="${width-pad.right}" y2="${y}" stroke="#dccfbe" stroke-dasharray="4 8"></line>`
  }).join('');
  const coords=points.map((p,i)=>{
    const xPos=pad.left+(points.length===1?chartW/2:stepX*i);
    return{x:xPos,y1:pad.top+chartH-(p.mentions/maxM)*chartH,y2:pad.top+chartH-(p.hvShare/100)*chartH,label:p.label,mentions:p.mentions}
  });
  const line1=coords.map(c=>`${c.x},${c.y1}`).join(' ');
  const line2=coords.map(c=>`${c.x},${c.y2}`).join(' ');
  const labelEvery=points.length<=12?1:Math.ceil(points.length/12);
  const labels=coords.map((c,i)=>{
    if(i%labelEvery!==0 && i!==coords.length-1) return '';
    return `<text x="${c.x}" y="${height-12}" text-anchor="middle" font-size="12" fill="#66707a">${c.label}</text>`
  }).join('');
  const marks=coords.map(c=>`<circle cx="${c.x}" cy="${c.y1}" r="5" fill="#b55b38"></circle><text x="${c.x}" y="${c.y1-10}" text-anchor="middle" font-size="11" fill="#b55b38">${c.mentions}</text>`).join('');
  const hvMarks=coords.map(c=>`<circle cx="${c.x}" cy="${c.y2}" r="4" fill="#2d6f65"></circle>`).join('');
  svg.innerHTML=`${grid}<polyline fill="none" stroke="#b55b38" stroke-width="4" points="${line1}"></polyline><polyline fill="none" stroke="#2d6f65" stroke-width="3" stroke-dasharray="8 8" points="${line2}"></polyline>${marks}${hvMarks}<line x1="${pad.left}" y1="${pad.top+chartH}" x2="${width-pad.right}" y2="${pad.top+chartH}" stroke="#1c252d" stroke-opacity=".18"></line>${labels}`
}
function renderSource(rows){
  const x=tr();
  const items=sourceDensity(rows),svg=$('sourceChart');
  if(!items.length){
    svg.innerHTML=`<text x="320" y="160" text-anchor="middle" font-size="16" fill="#66707a">${x.noData}</text>`;
    return;
  }
  const left=150,top=28,barH=34,gap=18,maxD=Math.max(...items.map(i=>i.density),1);
  const fmt = x.densityFmt ? x.densityFmt : ((d,m)=>`${d} / ${m}`);
  svg.innerHTML=items.map((it,idx)=>{
    const y=top+idx*(barH+gap),w=it.density/maxD*360;
    return `<text x="0" y="${y+22}" font-size="14" fill="#1c252d">${it.name}</text><rect x="${left}" y="${y}" width="${w}" height="${barH}" rx="12" fill="${it.color}"></rect><text x="${left+w+12}" y="${y+22}" font-size="13" fill="#66707a">${fmt(it.density.toFixed(1), it.mentions)}</text>`
  }).join('');
}
function renderUse(rows){
  const x=tr();
  const allItems=groupBy(rows,r=>r.useCase);
  const svg=$("useChart"),legend=$("useLegend");
  if(!allItems.length){
    svg.innerHTML=`<text x="320" y="160" text-anchor="middle" font-size="16" fill="#66707a">${x.noData}</text>`;
    legend.innerHTML="";
    return;
  }
  const MAX_SLICES=10;
  let items=allItems;
  if(allItems.length>MAX_SLICES){
    const top=allItems.slice(0,MAX_SLICES-1);
    const other=allItems.slice(MAX_SLICES-1).reduce((s,i)=>s+i.count,0);
    items=[...top,{name:'other',count:other}];
  }
  const total=items.reduce((s,i)=>s+i.count,0);
  const colors=["#b55b38","#2d6f65","#6d5e92","#d89b2b","#5b6778","#8d6c4c"];
  const cx=180,cy=158,radius=108;
  function polar(a,r){const rad=Math.PI/180*a;return{x:cx+Math.cos(rad)*r,y:cy+Math.sin(rad)*r}}
  let start=-90;
  const slices=items.map((it,idx)=>{
    const angle=it.count/total*360,p1=polar(start,radius),p2=polar(start+angle,radius),large=angle>180?1:0;
    const path=`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
    start+=angle;
    return{path,color:colors[idx%colors.length],name:it.name,count:it.count}
  });
  svg.innerHTML=`${slices.map(s=>`<path data-use="${s.name}" d="${s.path}" fill="${s.color}"></path>`).join("")}<circle cx="${cx}" cy="${cy}" r="52" fill="#fffaf4"></circle><text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="14" fill="#66707a">${x.centerTop}</text><text x="${cx}" y="${cy+24}" text-anchor="middle" font-size="22" fill="#1c252d">${x.centerBottom}</text>`;
  const more = allItems.length>items.length ? `<div class="meta">+${allItems.length-items.length} more</div>` : '';
  legend.innerHTML=slices.map(s=>`<div class="legend-item" data-use="${s.name}"><i class="swatch" style="background:${s.color}"></i><span>${useLabel(s.name)}</span><span class="legend-metric">${Math.round(s.count/total*100)}% (${s.count})</span></div>`).join("") + more;

  const paths = Array.from(svg.querySelectorAll('path[data-use]'));
  const itemsEls = Array.from(legend.querySelectorAll('.legend-item[data-use]'));
  const setActive = (name)=>{
    paths.forEach(p=>{
      const on = p.getAttribute('data-use')===name;
      p.classList.toggle('is-active', on);
      p.classList.toggle('is-dim', !!name && !on);
    });
    itemsEls.forEach(el=>{
      const on = el.getAttribute('data-use')===name;
      el.classList.toggle('is-active', on);
      el.classList.toggle('is-dim', !!name && !on);
    });
  };
  paths.forEach(p=>{
    p.addEventListener('mouseenter', ()=>setActive(p.getAttribute('data-use')));
    p.addEventListener('mouseleave', ()=>setActive(null));
    p.addEventListener('focus', ()=>setActive(p.getAttribute('data-use')));
    p.addEventListener('blur', ()=>setActive(null));
  });
  itemsEls.forEach(el=>{
    el.addEventListener('mouseenter', ()=>setActive(el.getAttribute('data-use')));
    el.addEventListener('mouseleave', ()=>setActive(null));
  });
}
function renderMatrix(rows){const x=tr();const total=rows.length||1,explicit=rows.filter(r=>r.explicit).length/total*100,utilNoBrand=rows.filter(r=>r.score>=4&&!r.explicit).length/total*100,aligned=rows.filter(r=>r.score>=4&&r.explicit).length/total*100,risk=utilNoBrand>explicit?x.riskHigh:x.riskMid;const cards=[{title:x.matrix.a[0],value:pct(explicit),body:x.matrix.a[1],cls:explicit<35?'low':'mid'},{title:x.matrix.b[0],value:pct(utilNoBrand),body:x.matrix.b[1],cls:utilNoBrand>40?'mid':'low'},{title:x.matrix.c[0],value:pct(aligned),body:x.matrix.c[1],cls:aligned>25?'mid':'low'},{title:x.matrix.d[0],value:risk,body:x.matrix.d[1],cls:risk===x.riskHigh?'low':'mid'}];$('matrix').innerHTML=cards.map(c=>`<article class="item"><span class="metric-chip ${c.cls}">${c.value}</span><h3 style="margin-top:12px">${c.title}</h3><p>${c.body}</p></article>`).join('')}
function renderWhite(){$('whiteTable').innerHTML=whiteRows[state.lang].map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}
function renderQuotes(rows){
  const x=tr();
  const sorted=[...rows].sort((a,b)=>b.score!==a.score?b.score-a.score:a.date.localeCompare(b.date));
  const shown=state.quoteMode==='top'?sorted.slice(0,8):sorted;
  const scoreTip = (x.tips && x.tips.quoteScore) ? String(x.tips.quoteScore).replace(/"/g,'&quot;') : '';
  $('quoteCount').textContent=(x.quoteCount?x.quoteCount(shown.length):`${shown.length} shown`);
  $('quoteMeta').textContent=x.quotesShown(shown.length,rows.length);
  $('showTopBtn').classList.toggle('active',state.quoteMode==='top');
  $('showAllBtn').classList.toggle('active',state.quoteMode==='all');
  $('showTopBtn').classList.toggle('subtle-btn',state.quoteMode!=='top');
  $('showAllBtn').classList.toggle('subtle-btn',state.quoteMode!=='all');
  $('quotes').innerHTML=shown.length?shown.map(r=>`<details><summary><span>${r.source} &middot; ${r.community} &middot; ${useLabel(r.useCase)}</span><span class="metric-chip ${r.score>=4?'':r.score===3?'mid':'low'}" title="${scoreTip}">${x.score} ${r.score}</span></summary><p class="meta">${r.date}</p><blockquote>${r.excerpt}</blockquote><p><strong>${x.interp}:</strong> ${note(r)}</p><p><a href="${r.url}" target="_blank" rel="noreferrer">${x.openSource}</a></p></details>`).join(''):`<div class="item"><p>${x.noData}</p></div>`;
}
function updateInputs(){const {start,end}=resolveRange();$('rangeLabel').textContent=`${f(start)} ~ ${f(end)}`;$('startDate').value=f(start);$('endDate').value=f(end);document.querySelectorAll('.preset').forEach(btn=>btn.classList.toggle('active',btn.dataset.preset===state.preset&&!state.start&&!state.end))}
function render(){renderStatic();updateInputs();const rows=filtered(),mode=grainMode();renderKpis(rows);renderTables(rows);renderReadout(rows);renderTrend(aggregateTrend(rows,mode),mode);renderSource(rows);renderUse(rows);renderMatrix(rows);renderWhite();renderQuotes(rows)}
document.querySelectorAll('.preset').forEach(btn=>btn.addEventListener('click',()=>{state.preset=btn.dataset.preset;state.start=null;state.end=null;render()}));$('grain').addEventListener('change',e=>{state.grain=e.target.value;render()});$('applyRange').addEventListener('click',()=>{const s=$('startDate').value,e=$('endDate').value;if(!s||!e)return;state.start=s;state.end=e;render()});$('resetAll').addEventListener('click',()=>{state.preset='all';state.start=null;state.end=null;state.grain='auto';$('grain').value='auto';render()});$('showTopBtn').addEventListener('click',()=>{state.quoteMode='top';render()});$('showAllBtn').addEventListener('click',()=>{state.quoteMode='all';render()});$('langEnBtn').addEventListener('click',()=>{state.lang='en';render()});$('langKoBtn').addEventListener('click',()=>{state.lang='ko';render()});
async function boot(){
  try{
    setDataLoad('embedded', true, embeddedRecords.length, '');
    await loadRemoteRecords();
    recomputeBounds();
    render();
    setInterval(async ()=>{
      const ok=await loadRemoteRecords();
      if(ok){recomputeBounds();render()}
    }, 300000);
  }catch(e){
    showFatal(e);
  }
}
boot();
})();
