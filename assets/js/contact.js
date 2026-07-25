/* Blackveil Studio — contact form submit (EmailJS) with basic spam guards */
(function(){
'use strict';

var formLoadedAt=Date.now();

document.addEventListener('DOMContentLoaded',function(){
  var btn=document.querySelector('.ct-submit');
  if(!btn) return;
  btn.addEventListener('click',handleCtSubmit);
});

function $(id){ return document.getElementById(id); }

async function handleCtSubmit(){
  var name=$('ctName').value.trim();
  var email=$('ctEmail').value.trim();
  var need=$('ctNeed').value;
  var biz=$('ctBiz')?$('ctBiz').value.trim():'';
  var msg=$('ctMsg').value.trim();
  var honeypot=$('ctCompany')?$('ctCompany').value:'';

  /* honeypot: real visitors never fill a visually-hidden field */
  if(honeypot){ return; }
  /* time-trap: a human takes more than a couple seconds to read and fill the form */
  if(Date.now()-formLoadedAt<2500){ return; }

  if(!name||!email){ alert('Please fill in your name and contact details.'); return; }
  if(!msg){ alert('Please tell me a little about your business.'); return; }

  var btn=document.querySelector('.ct-submit');
  var originalText=btn.textContent;
  btn.textContent='Sending...'; btn.disabled=true;
  try{
    await emailjs.send('service_o5ay3eq','template_jwgn1m9',{
      from_name:name, from_email:email, need:need||'Not specified',
      business:biz||'Not specified', message:msg, reply_to:email
    });
    $('ctSuccess').style.display='block';
    btn.style.display='none';
  }catch(e){
    console.error('EmailJS error:',e);
    btn.textContent=originalText; btn.disabled=false;
    alert('Something went wrong. Please email anastasiia.blackveil@gmail.com directly.');
  }
}
})();
