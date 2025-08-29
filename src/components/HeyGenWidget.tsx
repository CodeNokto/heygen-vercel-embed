"use client";

import { useEffect, useRef } from "react";

export default function HeyGenWidget() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = "https://labs.heygen.com";
    const rawUrl =
      "https://labs.heygen.com/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiI3YjdjYzg3MzM0NWU0ZjlmOTJhM2UzNmJkOGEyNGExOSIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzLzdiN2NjODczMzQ1ZTRmOWY5MmEzZTM2YmQ4YTI0YTE5L2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0LndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjcwNTY1YTNmMDljNDRjNDdiM2U1NzE1M2ZiMjlmYTIyIiwidXNlcm5hbWUiOiI4N2M3Njk1YjhkNjY0YTVjODQ1NmM4M2UxMjMwMjkzMSJ9&inIFrame=1";

    const root = rootRef.current!;
    if (root.dataset.bound === "1") return;
    root.dataset.bound = "1";

    root.innerHTML = `
<div id="heygen-root" aria-live="polite">
  <button id="hg-trigger" type="button" aria-label="Åpne assistent" aria-expanded="false">
    <span class="hg-sweep" aria-hidden="true"></span>
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
  </button>
  <div id="hg-backdrop" aria-hidden="true"></div>
  <section id="hg-panel" role="dialog" aria-modal="true" aria-label="HeyGen" aria-hidden="true">
    <button id="hg-close" type="button" aria-label="Lukk">✕</button>
    <div id="hg-frame"></div>
  </section>
</div>`;

    // CSS – flyttet opp: trigger 22px, panel 20px
    const style = document.createElement("style");
    style.textContent = `
#heygen-root{ --safe:env(safe-area-inset-bottom,0px); --right:14px; }
#hg-trigger{
  position:fixed; right:var(--right); bottom:calc(22px + var(--safe)); z-index:2147483647;
  width:72px; height:72px; border-radius:999px; border:2px solid #ffd700;
  background: radial-gradient(120% 120% at 30% 30%, rgba(255,215,0,.95), rgba(255,215,0,.65) 42%, #161616 72%), #0b0b0b;
  color:#111; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transform:scale(.9);
  box-shadow:0 6px 18px rgba(255,215,0,.25), 0 0 22px rgba(255,215,0,.35) inset;
  opacity:0; visibility:hidden; transition:transform .18s ease, opacity .2s ease;
}
#heygen-root.is-ready #hg-trigger{ transform:scale(1); opacity:1; visibility:visible; }
#hg-backdrop{ position:fixed; inset:0; z-index:2147483645; background:rgba(0,0,0,.65);
  opacity:0; visibility:hidden; transition:opacity .18s ease, visibility .18s ease; }
#hg-panel{
  position:fixed; right:calc(var(--right) - 2px); bottom:calc(20px + var(--safe)); z-index:2147483646;
  background:linear-gradient(180deg,#0e0e0e,#0a0a0a); border:2px solid #ffd700; border-radius:20px;
  padding:42px 14px 14px 14px; opacity:0; visibility:hidden; pointer-events:none;
  transform-origin:100% 100%; transform:translateY(8px) scale(.96);
  transition: transform .24s cubic-bezier(.21,1.02,.73,1), opacity .18s ease, visibility .18s ease, width .18s ease, height .18s ease;
}
#hg-frame{ width:100%; aspect-ratio:16/9; border-radius:14px; overflow:hidden; background:#000; }
#hg-panel iframe{ width:100%; height:100%; border:0; border-radius:inherit; display:block; object-fit:cover; }
#hg-close{
  position:absolute; top:10px; right:10px; z-index:2; width:36px; height:36px; border-radius:999px;
  background:#0b0b0b; color:#fff; border:2px solid #ffd700; cursor:pointer;
}
#heygen-root.is-opening #hg-backdrop{ opacity:.75; visibility:visible; }
#heygen-root.is-open    #hg-backdrop{ opacity:.75; visibility:visible; }
#heygen-root.is-opening #hg-panel{    opacity:1; visibility:visible; pointer-events:auto; }
#heygen-root.is-open    #hg-panel{    opacity:1; visibility:visible; pointer-events:auto; transform:translateY(0) scale(1); }
@media (max-width:540px){ #hg-trigger{ width:66px; height:66px; } #hg-panel{ border-radius:16px; } #hg-frame{ border-radius:12px; } }
@media (prefers-reduced-motion:reduce){ #hg-trigger,#hg-panel,#hg-backdrop{ transition:none } }
    `;
    document.head.appendChild(style);

    // JS
    const script = document.createElement("script");
    script.textContent = `
(function(){
  const HOST="${host}";
  const RAW_URL="${rawUrl}";
  const u=new URL(RAW_URL);
  const clean=(u.searchParams.get("share")||"").replace(/[\\r\\n\\s]+/g,"");
  u.searchParams.set("share", clean);
  const SRC=u.toString();

  const rootEl=document.querySelector('#heygen-root');
  const trigger=rootEl.querySelector('#hg-trigger');
  const panel=rootEl.querySelector('#hg-panel');
  const backdrop=rootEl.querySelector('#hg-backdrop');
  const closeBtn=rootEl.querySelector('#hg-close');
  const frame=rootEl.querySelector('#hg-frame');

  rootEl.classList.add('is-ready');

  let open=false, ready=false, iframe=null;

  function mount(){
    if(iframe) return;
    iframe=document.createElement('iframe');
    iframe.src=SRC;
    iframe.title='HeyGen';
    iframe.allow='autoplay; microphone; camera; clipboard-read; clipboard-write; display-capture';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.style.cssText='width:100%;height:100%;border:0;border-radius:inherit;background:#000;display:block;object-fit:cover;';
    iframe.addEventListener('load',()=>{ ready=true; post('show'); });
    frame.appendChild(iframe);
  }

  function post(action){
    try{ iframe?.contentWindow?.postMessage({type:'streaming-embed', action}, HOST); }catch(_){}
  }

  function sizePanel(){
    const padX=28, padY=56;
    const vw=window.innerWidth, vh=window.innerHeight;
    const maxW=Math.min(vw-28, 920);
    const maxH=Math.min(vh-28, 720);
    const videoW=Math.min(maxW-padX, (maxH-padY)*(16/9));
    const outerW=Math.round(videoW+padX);
    const outerH=Math.round((videoW*(9/16))+padY);
    panel.style.width=outerW+'px';
    panel.style.height=outerH+'px';
  }

  function openUI(){
    if(open) return;
    open=true; mount(); sizePanel();
    rootEl.classList.add('is-opening');
    panel.setAttribute('aria-hidden','false');
    backdrop.setAttribute('aria-hidden','false');
    trigger.setAttribute('aria-expanded','true');
    panel.style.visibility='visible'; panel.style.opacity='1';
    backdrop.style.visibility='visible'; backdrop.style.opacity='.75';
    const t=setInterval(()=>{ if(ready){ clearInterval(t); rootEl.classList.remove('is-opening'); rootEl.classList.add('is-open'); try{iframe.contentWindow.focus();}catch(_){} } }, 60);
    let tries=0, r=setInterval(()=>{ post('show'); if(++tries>=6) clearInterval(r); }, 250);
  }

  function closeUI(){
    if(!open) return;
    open=false;
    rootEl.classList.remove('is-open','is-opening');
    panel.setAttribute('aria-hidden','true');
    backdrop.setAttribute('aria-hidden','true');
    trigger.setAttribute('aria-expanded','false');
    post('hide');
    setTimeout(()=>{
      if(!open){
        panel.style.visibility='hidden'; panel.style.opacity='0';
        backdrop.style.visibility='hidden'; backdrop.style.opacity='0';
      }
    },220);
  }

  const onTapOpen=(e)=>{ e.preventDefault(); e.stopPropagation(); openUI(); };

  trigger.addEventListener('click', onTapOpen, {passive:false});
  trigger.addEventListener('touchstart', onTapOpen, {passive:false});
  trigger.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onTapOpen(e);} });

  closeBtn.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); closeUI(); });
  backdrop.addEventListener('click',(e)=>{ if(e.target===backdrop) closeUI(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeUI(); });
  window.addEventListener('resize',()=>{ if(open) sizePanel(); });

  const adjust=()=>{
    const hub = document.querySelector('iframe[src*="hs-"]')?.parentElement
             || document.querySelector('.hubspot-messages-iframe-container');
    document.querySelector('#heygen-root')?.setAttribute('style', '--right:'+(hub?92:14)+'px');
  };
  adjust(); new MutationObserver(adjust).observe(document.documentElement,{subtree:true,childList:true});
})();
`;
    document.body.appendChild(script);

    return () => {
      try { document.body.removeChild(script); } catch {}
      try { document.head.removeChild(style); } catch {}
      root.innerHTML = "";
    };
  }, []);

  return <div ref={rootRef} />;
}
