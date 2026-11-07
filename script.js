const modal=document.getElementById('game-modal');
const content=document.getElementById('game-content');
const closeButton=document.getElementById('modal-close');
document.getElementById('year').textContent=new Date().getFullYear();
const openModal=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
closeButton.addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const games={
 block(){content.innerHTML=`<h2 id="modal-title">Will they block you? 💌</h2><p>Enter a name for a completely random, silly prediction. It is only a game!</p><form class="game-form" id="name-form"><label for="person-name">Their first name or nickname</label><input id="person-name" maxlength="24" required placeholder="e.g. Alex" autocomplete="off"><button class="modal-button">Reveal my result ✨</button></form><div id="game-result"></div>`;document.getElementById('name-form').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('person-name').value.trim();if(!name)return;const results=[['😇','Too busy sending memes','Blocking? Never. They are probably saving your memes.'],['🤭','A 2% chance','The other 98% is just them forgetting to reply.'],['💗','Bestie energy detected','Your imaginary game verdict says: keep the good vibes going!'],['🍿','Plot twist incoming','This friendship needs snacks and a movie night.']];const r=results[Math.floor(Math.random()*results.length)];showResult(name,r[0],r[1],r[2]);})},
 bestie(){startQuiz('Bestie Check 🫶','How well do you know your bestie? Pick the answers that feel right.',[
 ['What would your bestie choose for a free day?',['A cozy movie day','A big adventure','Food and a long chat','A little bit of everything']],
 ['What is their usual reply style?',['Instant reply','A voice note essay','Three business days later','A meme instead of words']],
 ['Pick your shared superpower.',['Making each other laugh','Knowing what the other means','Turning boring days fun','Always finding a snack']]
 ],'Your bestie vibe')},
 vibe(){startQuiz('Your Vibe in 5 Questions 🌈','Choose the option that sounds most like you today.',[
 ['Choose a happy place.',['A sunny garden','A cozy reading nook','A seaside walk','A colorful little café']],
 ['Pick a weekend mood.',['Creative and curious','Calm and cozy','Social and silly','Spontaneous and bold']],
 ['Choose a tiny treat.',['A sweet cupcake','A warm drink','A fresh playlist','A surprise outing']],
 ['Which word feels right?',['Dreamy','Thoughtful','Playful','Adventurous']],
 ['Pick a color palette.',['Pink and peach','Lavender and cream','Blue and mint','Yellow and coral']]
 ],'Your current vibe')},
 drama(){startQuiz('How Dramatic Are You? 🤭','A silly little quiz. Choose what you would probably do.',[
 ['Your snack falls on the floor.',['A tiny sigh','A dramatic gasp','Find another snack','Declare snack time cancelled']],
 ['Your favorite song comes on.',['Quietly enjoy it','Full concert mode','Send it to everyone','Add it to every playlist']],
 ['Plans change at the last minute.',['No problem','A little disappointed','Need a full explanation','Time for a plot twist']],
 ['You see a cute puppy.',['Smile politely','Tell everyone','Take a hundred photos','Give it a main-character title']]
 ],'Your drama level')}
};
document.querySelectorAll('[data-game]').forEach(btn=>btn.addEventListener('click',()=>{openModal();games[btn.dataset.game]?.()}));
function showResult(name,emoji,title,description){const target=document.getElementById('game-result');target.innerHTML=`<div class="result-box"><div class="result-emoji">${emoji}</div><p>THE OFFICIAL (NOT REALLY) RESULT FOR ${escapeHTML(name.toUpperCase())}</p><h3>${title}</h3><p>${description}</p></div><div class="share-row"><button class="modal-button" id="share-result">Share result ↗</button><button class="modal-button secondary-button" id="again">Play again</button></div>`;document.getElementById('share-result').addEventListener('click',()=>shareText(`My CutePlay result: ${title} — ${description}`));document.getElementById('again').addEventListener('click',()=>games.block())}
function startQuiz(title,intro,questions,resultLabel){let index=0,score=0;function render(){content.innerHTML=`<h2 id="modal-title">${title}</h2><p>${intro}</p><div class="progress"><span style="width:${index/questions.length*100}%"></span></div><p><b>QUESTION ${index+1} OF ${questions.length}</b></p><h3>${questions[index][0]}</h3><div class="question-options">${questions[index][1].map((o,i)=>`<button class="option-button" data-choice="${i}">${o}</button>`).join('')}</div>`;content.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{score+=Number(b.dataset.choice);index++;if(index<questions.length)render();else finish()}))}function finish(){const percent=Math.round((score/(questions.length*3))*100);let emoji=percent<35?'🌷':percent<70?'🦋':'🌟';let titleText=percent<35?'Soft & Sweet':percent<70?'Bright & Balanced':'Big Main-Character Energy';content.innerHTML=`<h2 id="modal-title">Your result is in!</h2><div class="result-box"><div class="result-emoji">${emoji}</div><p>${resultLabel.toUpperCase()}</p><strong>${percent}%</strong><h3>${titleText}</h3><p>This is a playful quiz result, not a real-life score or assessment. Keep being you!</p></div><div class="share-row"><button class="modal-button" id="share-result">Share result ↗</button><button class="modal-button secondary-button" id="restart">Try again</button></div>`;document.getElementById('share-result').addEventListener('click',()=>shareText(`My CutePlay quiz result: ${titleText}!`));document.getElementById('restart').addEventListener('click',()=>{index=0;score=0;render()})}render()}
async function shareText(text){if(navigator.share){try{await navigator.share({title:'My CutePlay result',text,url:location.href})}catch(e){}}else if(navigator.clipboard){try{await navigator.clipboard.writeText(text+' '+location.href);alert('Result copied! Share it with a friend.')}catch(e){alert(text)}}else{alert(text)}}
function escapeHTML(value){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}