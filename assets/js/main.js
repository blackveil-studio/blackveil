/* Blackveil Studio — shared site behaviour: hero particles, nav, reveal motion, cookie banner */
(function(){
'use strict';

document.documentElement.classList.add('js-ready');

var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGSAP = typeof window.gsap !== 'undefined';
if(hasGSAP && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); }

/* ---------- hero particle canvas ---------- */
function initParticleHero(){
  var canvas=document.getElementById('c');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  var W,H,mouse={x:-999,y:-999},particles=[];
  var GOLD='rgba(201,168,76,',GOLD2='rgba(232,201,122,',WHITE='rgba(240,237,232,';
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();
  window.addEventListener('resize',function(){resize();initParticles();});
  document.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
  function Particle(){ this.reset(true); }
  Particle.prototype.reset=function(ini){
    this.x=ini?Math.random()*W:(Math.random()<.5?-10:W+10);
    this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*.5; this.vy=(Math.random()-.5)*.5;
    this.r=Math.random()*2.8+1.2;
    this.type=Math.random()<.35?'gold':Math.random()<.55?'gold2':'white';
    this.baseOpacity=Math.random()*.3+.7;
    this.pulse=Math.random()*Math.PI*2; this.pulseSpeed=Math.random()*.02+.01;
  };
  Particle.prototype.update=function(){
    this.pulse+=this.pulseSpeed; this.x+=this.vx; this.y+=this.vy;
    var dx=this.x-mouse.x,dy=this.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<150&&d>0){var f=(150-d)/150;this.x+=(dx/d)*f*2;this.y+=(dy/d)*f*2;}
    if(this.x<-20)this.x=W+20; if(this.x>W+20)this.x=-20;
    if(this.y<-20)this.y=H+20; if(this.y>H+20)this.y=-20;
  };
  Particle.prototype.draw=function(){
    var op=this.baseOpacity*(.6+.4*Math.sin(this.pulse)),g;
    if(this.type==='gold'){
      g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*8);
      g.addColorStop(0,GOLD+op+')'); g.addColorStop(.2,GOLD+(op*.6)+')'); g.addColorStop(.5,GOLD+(op*.15)+')'); g.addColorStop(1,GOLD+'0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(this.x,this.y,this.r*8,0,Math.PI*2); ctx.fill();
    }else if(this.type==='gold2'){
      g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*5);
      g.addColorStop(0,GOLD2+(op*.8)+')'); g.addColorStop(.3,GOLD2+(op*.3)+')'); g.addColorStop(1,GOLD2+'0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(this.x,this.y,this.r*5,0,Math.PI*2); ctx.fill();
    }else{
      g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*4);
      g.addColorStop(0,WHITE+(op*.5)+')'); g.addColorStop(.4,WHITE+(op*.12)+')'); g.addColorStop(1,WHITE+'0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(this.x,this.y,this.r*4,0,Math.PI*2); ctx.fill();
    }
  };
  function initParticles(){
    var isMob=W<600;
    var n=isMob?Math.min(Math.floor(W*H/3500),70):Math.min(Math.floor(W*H/2200),180);
    particles=[];
    for(var i=0;i<n;i++){
      var p=new Particle();
      if(isMob){var col=i%3,row=Math.floor(i/3); p.x=(col+0.2+Math.random()*0.6)*(W/3); p.y=(row+Math.random())*(H/Math.ceil(n/3));}
      particles.push(p);
    }
  }
  initParticles();
  function drawConnections(){
    for(var i=0;i<particles.length;i++)for(var j=i+1;j<particles.length;j++){
      var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      var d=Math.sqrt(dx*dx+dy*dy);
      if(d<160){
        var r=1-d/160,isG=particles[i].type!=='white'||particles[j].type!=='white';
        ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=isG?GOLD+(r*.55)+')':WHITE+(r*.18)+')';
        ctx.lineWidth=isG?1.2:.5; ctx.stroke();
      }
    }
  }
  var gt=0;
  function drawGlow(){
    gt+=.003;
    [[W*(.3+.2*Math.sin(gt)),H*(.4+.15*Math.cos(gt*.7)),W*.45,.048],
     [W*(.72+.15*Math.cos(gt*1.3)),H*(.58+.2*Math.sin(gt*.9)),W*.35,.042]].forEach(function(spot){
      var gx=spot[0],gy=spot[1],gr=spot[2],op=spot[3];
      var g=ctx.createRadialGradient(gx,gy,0,gx,gy,gr);
      g.addColorStop(0,'rgba(201,168,76,'+op+')'); g.addColorStop(1,'rgba(11,10,8,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });
  }
  (function loop(){
    ctx.fillStyle='#0b0a08'; ctx.fillRect(0,0,W,H);
    drawGlow(); drawConnections();
    particles.forEach(function(p){p.update();p.draw();});
    var vg=ctx.createRadialGradient(W/2,H/2,H*.05,W/2,H/2,H*.9);
    vg.addColorStop(0,'rgba(11,10,8,0)'); vg.addColorStop(1,'rgba(11,10,8,.78)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
    var bg=ctx.createLinearGradient(0,H*.32,0,H);
    bg.addColorStop(0,'rgba(11,10,8,0)'); bg.addColorStop(1,'rgba(11,10,8,.95)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    requestAnimationFrame(loop);
  })();
}

/* ---------- hero entrance + scroll-driven exit ---------- */
function initHeroMotion(){
  var nav=document.getElementById('nav');
  if(!nav) return;
  var ey=document.getElementById('ey'), hb=document.getElementById('hb'), sc=document.getElementById('sc'), yr=document.getElementById('hyr');
  var words=document.querySelectorAll('.h-title .word');

  if(hasGSAP && !reduceMotion){
    var tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.to(nav,{opacity:1,y:0,duration:1,ease:'expo.out'},.2);
    if(ey) tl.to(ey,{opacity:1,y:0,duration:.9},.5);
    if(words.length) tl.to(words,{y:'0%',duration:1.1,ease:'expo.out',stagger:.12},.7);
    if(hb) tl.to(hb,{opacity:1,y:0,duration:.9},'-=.5');
    if(sc||yr) tl.to([sc,yr].filter(Boolean),{opacity:1,duration:.7},'-=.3');
  }else{
    nav.style.opacity=1; nav.style.transform='none';
    if(ey){ey.style.opacity=1;ey.style.transform='none';}
    words.forEach(function(w){w.style.transform='translateY(0)';});
    if(hb){hb.style.opacity=1;hb.style.transform='none';}
    if(sc)sc.style.opacity=1; if(yr)yr.style.opacity=1;
  }

  var hero=document.getElementById('hero');
  var hContent=document.querySelector('.h-content');
  if(hero && hContent && hasGSAP && !reduceMotion){
    gsap.to(hContent,{
      opacity:0,y:-60,scale:.96,ease:'none',
      scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}
    });
    window.addEventListener('load',function(){ ScrollTrigger.refresh(); });
  }

  var navEl=nav;
  ScrollTrigger && ScrollTrigger.create ? ScrollTrigger.create({
    start:0,end:99999,
    onUpdate:function(self){
      var past=self.scroll()>window.innerHeight*.3;
      if(sc)sc.style.opacity=past?'0':'1';
      if(yr)yr.style.opacity=past?'0':'1';
      navEl.classList.toggle('scrolled',self.scroll()>60);
    }
  }) : window.addEventListener('scroll',function(){
    var past=window.scrollY>window.innerHeight*.3;
    if(sc)sc.style.opacity=past?'0':'1';
    if(yr)yr.style.opacity=past?'0':'1';
    navEl.classList.toggle('scrolled',window.scrollY>60);
  },{passive:true});
}

/* ---------- scroll reveal ----------
   Deliberately plain IntersectionObserver, not ScrollTrigger: these are simple
   one-shot fade-ins with no pinning/scrubbing, and ScrollTrigger's trigger
   positions are calculated once and go stale when web fonts or lazy images
   shift page height afterwards, which silently leaves content at opacity:0
   forever. IntersectionObserver has no such staleness problem. */
function initReveal(){
  var els=document.querySelectorAll('.reveal-up, .reveal-card');
  if(!els.length) return;
  if(reduceMotion){ els.forEach(function(el){el.classList.add('visible');}); return; }
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('visible'); observer.unobserve(e.target);} });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){observer.observe(el);});
}

/* ---------- portfolio card tilt ---------- */
function initCardTilt(){
  var cards=document.querySelectorAll('.pf-card');
  if(!cards.length || reduceMotion) return;
  cards.forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(800px) rotateY('+(px*6)+'deg) rotateX('+(-py*6)+'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave',function(){ card.style.transform='perspective(800px) rotateY(0) rotateX(0) translateY(0)'; });
  });
}

/* ---------- spark button star injection ---------- */
var STAR_PATH='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z';
function initSparkButtons(){
  document.querySelectorAll('.spark-btn').forEach(function(btn){
    if(btn.querySelector('.spark-star')) return;
    for(var i=1;i<=6;i++){
      var wrap=document.createElement('span');
      wrap.className='spark-star s'+i;
      wrap.innerHTML='<svg viewBox="0 0 784.11 815.53"><path d="'+STAR_PATH+'"></path></svg>';
      btn.appendChild(wrap);
    }
  });
}

/* ---------- burger / sidebar ---------- */
function initSidebar(){
  var burger=document.getElementById('burger'); if(!burger) return;
  var sidebar=document.getElementById('sidebar');
  var overlay=document.getElementById('sidebarOverlay');
  var closeBtn=document.getElementById('sidebarClose');
  function openMenu(){ burger.classList.add('open'); sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeMenu(){ burger.classList.remove('open'); sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; }
  burger.addEventListener('click',function(){ burger.classList.contains('open')?closeMenu():openMenu(); });
  if(closeBtn) closeBtn.addEventListener('click',closeMenu);
  overlay.addEventListener('click',closeMenu);
  document.querySelectorAll('.sidebar-link, .sidebar-cta').forEach(function(a){ a.addEventListener('click',closeMenu); });
}

/* ---------- portfolio drag-scroll ---------- */
function initPortfolioDrag(){
  var wrap=document.getElementById('pfTrackWrap'); if(!wrap) return;
  var down=false,startX,sl;
  wrap.addEventListener('mousedown',function(e){ down=true; startX=e.pageX-wrap.offsetLeft; sl=wrap.scrollLeft; });
  wrap.addEventListener('mouseleave',function(){down=false;});
  wrap.addEventListener('mouseup',function(){down=false;});
  wrap.addEventListener('mousemove',function(e){ if(!down)return; e.preventDefault(); wrap.scrollLeft=sl-(e.pageX-wrap.offsetLeft-startX)*1.5; });
}

/* ---------- "why" accordion auto-rotate ---------- */
function initWhyAccordion(){
  var items=document.querySelectorAll('#pbList .pb-item'); if(!items.length) return;
  var cur=0,timer;
  function activate(i){ items.forEach(function(el){el.classList.remove('active');}); items[i].classList.add('active'); cur=i; }
  function start(){ timer=setInterval(function(){activate((cur+1)%items.length);},2400); }
  function stop(){ clearInterval(timer); }
  items.forEach(function(item,i){
    item.addEventListener('mouseenter',function(){ stop(); activate(i); });
    item.addEventListener('mouseleave',start);
  });
  var sec=document.getElementById('why');
  if(sec){
    new IntersectionObserver(function(entries,ob){
      if(entries[0].isIntersecting){ activate(0); start(); ob.disconnect(); }
    },{threshold:0.2}).observe(sec);
  }
}

/* ---------- cookie consent banner ---------- */
function initCookieBanner(){
  var card=document.getElementById('cookieCard'); if(!card) return;
  var KEY='bv_cookie_choice';
  var saved=null;
  try{ saved=localStorage.getItem(KEY); }catch(e){}
  if(!saved){
    setTimeout(function(){ card.classList.add('visible'); },1200);
  }
  var acceptBtn=document.getElementById('cookieAccept');
  var essentialBtn=document.getElementById('cookieEssential');
  function dismiss(choice){
    try{ localStorage.setItem(KEY,choice); }catch(e){}
    card.classList.remove('visible');
  }
  if(acceptBtn) acceptBtn.addEventListener('click',function(){ dismiss('all'); });
  if(essentialBtn) essentialBtn.addEventListener('click',function(){ dismiss('essential'); });
}

document.addEventListener('DOMContentLoaded',function(){
  initParticleHero();
  initHeroMotion();
  initReveal();
  initCardTilt();
  initSparkButtons();
  initSidebar();
  initPortfolioDrag();
  initWhyAccordion();
  initCookieBanner();
});
})();
