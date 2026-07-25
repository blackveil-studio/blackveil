/* Blackveil Studio — "find your fit" quiz logic */
(function(){
'use strict';

var qzAnswers={};
var qzSteps=[
  {q:"What's your current online situation?",hint:"Your starting point",bg:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=70&fit=crop",opts:[
    {v:"none",l:"No website at all",h:"Starting from scratch"},
    {v:"old",l:"My site looks outdated",h:"Built years ago, needs a refresh"},
    {v:"social",l:"Only Instagram or Facebook",h:"No website, just social pages"}]},
  {q:"What kind of business do you run?",hint:"Helps define your style",bg:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=70&fit=crop",opts:[
    {v:"service",l:"Service-based (salon, clinic, trades)",h:"You sell your time and skills"},
    {v:"food",l:"Food and hospitality (cafe, restaurant)",h:"You serve people in person"},
    {v:"professional",l:"Professional services (lawyer, consultant)",h:"You sell expertise and advice"},
    {v:"other",l:"Something else",h:"Retail, studio, freelancer, etc."}]},
  {q:"Who are your main customers?",hint:"Knowing your audience shapes design",bg:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=70&fit=crop",opts:[
    {v:"local",l:"Local people nearby",h:"Your business is location-based"},
    {v:"online",l:"People anywhere online",h:"You work remotely or ship products"},
    {v:"both",l:"Both local and online",h:"You do both"}]},
  {q:"What's the main goal of your website?",hint:"This defines the whole layout",bg:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=700&q=70&fit=crop",opts:[
    {v:"contact",l:"Get people to contact me",h:"Enquiries, WhatsApp, bookings"},
    {v:"info",l:"Show what I do and where I am",h:"Hours, location, services"},
    {v:"trust",l:"Look more professional than competitors",h:"Build credibility instantly"}]},
  {q:"How would you describe your style?",hint:"Your brand personality",bg:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=70&fit=crop",opts:[
    {v:"warm",l:"Warm and welcoming",h:"Friendly, approachable, personal"},
    {v:"bold",l:"Bold and modern",h:"Strong, confident, edgy"},
    {v:"clean",l:"Clean and minimal",h:"Simple, elegant, refined"},
    {v:"luxury",l:"Luxury and premium",h:"High-end, exclusive, prestigious"}]},
  {q:"How quickly do you want to go live?",hint:"We'll plan accordingly",bg:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=70&fit=crop",opts:[
    {v:"fast",l:"As fast as possible",h:"Within this week"},
    {v:"normal",l:"In the next 2-3 weeks",h:"No huge rush"},
    {v:"planning",l:"Just exploring for now",h:"No deadline yet"}]}
];
var qzCurrent=0;

function $(id){ return document.getElementById(id); }

function qzRender(){
  var step=qzSteps[qzCurrent];
  var opts=$('qzOpts'); if(!opts) return;
  var total=qzSteps.length;

  var fill=$('qzProgressFill'); if(fill) fill.style.width=((qzCurrent)/(total-1)*100)+'%';
  var num=$('qzProgressNum'); if(num) num.textContent=(qzCurrent+1)+' / '+total;
  var counter=$('qzCounter'); if(counter) counter.textContent=(qzCurrent+1)+' / '+total;

  var img=$('qzImg');
  if(img){
    img.classList.remove('in');
    setTimeout(function(){ img.src=step.bg; img.classList.add('in'); },260);
  }
  var hint=$('qzHint'); if(hint) hint.textContent=step.hint;
  var qEl=$('qzQuestion'); if(qEl) qEl.textContent=step.q;

  var letters=['A','B','C','D'];
  opts.innerHTML=step.opts.map(function(o,i){
    return '<button class="qz-opt'+(qzAnswers[qzCurrent]===o.v?' selected':'')+'" data-val="'+o.v+'" data-idx="'+i+'">'
      +'<div class="qz-opt-num">'+letters[i]+'</div>'
      +'<div><span class="qz-opt-label">'+o.l+'</span><span class="qz-opt-hint">'+o.h+'</span></div>'
      +'</button>';
  }).join('');
  opts.querySelectorAll('.qz-opt').forEach(function(btn){
    btn.addEventListener('click',function(){ qzSelect(btn, btn.getAttribute('data-val')); });
  });

  var back=$('qzBack'); if(back) back.style.visibility=qzCurrent>0?'visible':'hidden';
  var next=$('qzNext'); if(next) next.classList.toggle('ready',qzAnswers[qzCurrent]!==undefined);
}

function qzSelect(el,val){
  document.querySelectorAll('.qz-opt').forEach(function(o){o.classList.remove('selected');});
  el.classList.add('selected');
  qzAnswers[qzCurrent]=val;
  var next=$('qzNext'); if(next) next.classList.add('ready');
}

function qzNext(){
  if(qzAnswers[qzCurrent]===undefined) return;
  if(qzCurrent<qzSteps.length-1){ qzCurrent++; qzRender(); }
  else{ qzShowResult(); }
}
function qzBack(){ if(qzCurrent>0){ qzCurrent--; qzRender(); } }

function qzShowResult(){
  var main=$('qzMain'); if(main) main.style.display='none';
  var outer=$('qzResult'); if(outer) outer.classList.add('show');
  var r=qzGetResult();
  var t=$('qzResTitle'); var d=$('qzResDesc'); var l=$('qzResItems');
  if(t) t.innerHTML=r.title;
  if(d) d.textContent=r.desc;
  if(l) l.innerHTML=r.items.map(function(i){ return '<div class="qz-result-li">'+i+'</div>'; }).join('');
  fetch('https://formspree.io/f/mjglelae',{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},
    body:JSON.stringify({name:'[QUIZ COMPLETED]',message:'Result: '+r.title.replace(/<[^>]+>/g,'')})
  }).catch(function(){});
}

function qzGetResult(){
  var style=qzAnswers[4]||'clean', goal=qzAnswers[3]||'contact', sit=qzAnswers[0]||'none';
  if(sit==='old') return {title:'You need a <em>redesign.</em>',desc:"Your business is already online but the site isn't doing it justice. A fresh redesign will instantly improve how you're perceived.",items:['Modern design matching your current brand','Fully mobile-optimised','Same domain, completely new look','Delivered in 2-3 days']};
  if(style==='luxury'||style==='clean') return {title:'A <em>refined, minimal</em> professional site.',desc:'You need an elegant, high-end site that communicates quality before a word is read.',items:['Luxury aesthetic with elegant typography','High contrast, minimal clutter','Trust-building layout that converts','Ready in 2-3 days']};
  if(style==='warm'||goal==='info') return {title:'A <em>warm, welcoming</em> professional site.',desc:'You need a site that feels like a friendly recommendation, approachable, informative, easy to use.',items:['Warm design with personality','Services, hours and location clearly presented','Easy contact section','Ready in 2-3 days']};
  return {title:'A <em>bold, modern</em> professional site.',desc:'You need a site with visual impact that stands out and makes people choose you.',items:['Strong visual identity','Clear offer and compelling CTA','Mobile-first and fast','Ready in 2-3 days']};
}

function qzPrefill(){
  var sel=$('ctNeed');
  if(sel&&qzAnswers[0]){
    var isRedesign=qzAnswers[0]==='old';
    for(var i=0;i<sel.options.length;i++){
      var o=sel.options[i];
      if(isRedesign&&o.text.toLowerCase().indexOf('redesign')!==-1){ o.selected=true; break; }
      else if(!isRedesign&&o.text.toLowerCase().indexOf('brand new')!==-1){ o.selected=true; break; }
    }
  }
  setTimeout(function(){ var el=$('contact'); if(el) el.scrollIntoView({behavior:'smooth'}); },150);
}

function qzRestart(){
  Object.keys(qzAnswers).forEach(function(k){ delete qzAnswers[k]; });
  qzCurrent=0;
  var main=$('qzMain'); if(main) main.style.display='block';
  var res=$('qzResult'); if(res) res.classList.remove('show');
  qzRender();
}

document.addEventListener('DOMContentLoaded',function(){
  if(!$('qzOpts')) return;
  qzRender();
  var nextBtn=$('qzNext'); if(nextBtn) nextBtn.addEventListener('click',qzNext);
  var backBtn=$('qzBack'); if(backBtn) backBtn.addEventListener('click',qzBack);
  var ctaBtn=$('qzResCta'); if(ctaBtn) ctaBtn.addEventListener('click',qzPrefill);
  var restartBtn=$('qzRestart'); if(restartBtn) restartBtn.addEventListener('click',qzRestart);
});
})();
