(() => {
 if(window.fieldnotesConsentUI)return;window.fieldnotesConsentUI=true;
 const key='facet-pages-v2';
 // Earlier permission named only four routes. Broader page coverage needs a fresh choice.
 window.facetRouteConsent='pages-v2';
 let choice=null,loaded=false;
 try{choice=localStorage.getItem(key)}catch{}
 const suppressed=()=>navigator.globalPrivacyControl||navigator.doNotTrack==='1';
 window.fieldnotesConsent=choice==='allow'&&!suppressed();
 const paint=()=>{
  const status=document.getElementById('fn-consent-status');
  if(status)status.textContent=suppressed()?'Facet is off because your browser sends a privacy signal.':window.fieldnotesConsent?'Facet is on. You can withdraw at any time.':'Facet is off. Your choice does not affect access to this site.';
  const allow=document.getElementById('fn-allow');if(allow)allow.disabled=!!suppressed();
 };
 const start=()=>{
  if(!window.fieldnotesConsent||loaded)return;
  loaded=true;
  const script=document.createElement('script');script.src='https://fieldnotes-pilot.holy-waterfall-a8d6.workers.dev/tracker.js?v=pages-v2';script.defer=true;script.referrerPolicy='no-referrer';script.dataset.project='mmaxence';script.dataset.routeConsent='pages-v2';script.dataset.navigationEvent='astro:page-load';
  script.onerror=()=>{loaded=false;const status=document.getElementById('fn-consent-status');if(status)status.textContent='Facet could not load. The site still works normally.'};
  document.head.append(script);
 };
 const choose=value=>{
  choice=value;window.fieldnotesConsent=value==='allow'&&!suppressed();
  try{localStorage.setItem(key,value)}catch{}
  paint();start();
 };
 const bind=()=>{
  const allow=document.getElementById('fn-allow');if(allow)allow.onclick=()=>choose('allow');
  const decline=document.getElementById('fn-decline');if(decline)decline.onclick=()=>choose('deny');
  const withdraw=document.getElementById('fn-withdraw');if(withdraw)withdraw.onclick=()=>choose('deny');
  paint();start();
 };
 window.addEventListener('storage',event=>{if(event.key===key){choice=event.newValue;window.fieldnotesConsent=choice==='allow'&&!suppressed();paint();start()}});
 document.addEventListener('astro:page-load',bind);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
