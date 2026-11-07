const modal=document.getElementById('game-modal');
const content=document.getElementById('game-content');
const closeButton=document.getElementById('modal-close');
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

let soundOn=localStorage.getItem('cuteplay-sound')!=='off';
let audioContext;
function tone(freq=620,duration=.09,type='sine',volume=.035){
  if(!soundOn)return;
  try{
    audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();
    if(audioContext.state==='suspended')audioContext.resume();
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,audioContext.currentTime);
    gain.gain.setValueAtTime(volume,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
    osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration);
  }catch(e){}
}
function chime(){tone(523,.12);setTimeout(()=>tone(659,.12),90);setTimeout(()=>tone(784,.2),180)}
const soundButton=document.getElementById('sound-toggle');
function updateSoundButton(){if(soundButton){soundButton.textContent=soundOn?'♫ Sound on':'♪ Sound off';soundButton.setAttribute('aria-pressed',String(soundOn))}}
updateSoundButton();
soundButton?.addEventListener('click',()=>{soundOn=!soundOn;localStorage.setItem('cuteplay-sound',soundOn?'on':'off');updateSoundButton();if(soundOn)chime()});

const openModal=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
closeButton?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

const games={
 block(){content.innerHTML='<h2 id="modal-title">Will they block you? 💌</h2><p>Enter a name for a completely silly prediction. Just for fun!</p><form class="game-form" id="name-form"><label for="person-name">Their first name or nickname</label><input id="person-name" maxlength="24" required placeholder="e.g. Alex" autocomplete="off"><button class="modal-button">Reveal my result ✨</button></form><div id="game-result"></div>';document.getElementById('name-form').addEventListener('submit',e=>{e.preventDefault();tone(660);const name=document.getElementById('person-name').value.trim();if(!name)return;const results=[['😇','Too busy sending memes','Blocking? Never. They are probably saving your memes.'],['🤭','A 2% chance','The other 98% is just them forgetting to reply.'],['💗','Bestie energy detected','Your imaginary game verdict says: keep the good vibes going!'],['🍿','Plot twist incoming','This friendship needs snacks and a movie night.']];const r=results[Math.floor(Math.random()*results.length)];showResult(name,r[0],r[1],r[2]);})},
 bestie(){startQuiz('Bestie Check 🫶','How well do you know your bestie? Pick what feels right.',[['What would your bestie choose for a free day?',['A cozy movie day','A big adventure','Food and a long chat','A little bit of everything']],['What is their usual reply style?',['Instant reply','A voice note essay','Three business days later','A meme instead of words']],['Pick your shared superpower.',['Making each other laugh','Knowing what the other means','Turning boring days fun','Always finding a snack']]],'Your bestie vibe')},
 vibe(){startQuiz('Your Vibe in 5 Questions 🌈','Choose the option that sounds most like you today.',[['Choose a happy place.',['A sunny garden','A cozy reading nook','A seaside walk','A colorful little café']],['Pick a weekend mood.',['Creative and curious','Calm and cozy','Social and silly','Spontaneous and bold']],['Choose a tiny treat.',['A sweet cupcake','A warm drink','A fresh playlist','A surprise outing']],['Which word feels right?',['Dreamy','Thoughtful','Playful','Adventurous']],['Pick a color palette.',['Pink and peach','Lavender and cream','Blue and mint','Yellow and coral']]],'Your current vibe')},
 drama(){startQuiz('How Dramatic Are You? 🤭','A silly little quiz. Choose what you would probably do.',[['Your snack falls on the floor.',['A tiny sigh','A dramatic gasp','Find another snack','Declare snack time cancelled']],['Your favorite song comes on.',['Quietly enjoy it','Full concert mode','Send it to everyone','Add it to every playlist']],['Plans change at the last minute.',['No problem','A little disappointed','Need a full explanation','Time for a plot twist']],['You see a cute puppy.',['Smile politely','Tell everyone','Take a hundred photos','Give it a main-character title']]],'Your drama level')}
};
document.querySelectorAll('[data-game]').forEach(btn=>btn.addEventListener('click',()=>{tone();openModal();games[btn.dataset.game]?.()}));

function showResult(name,emoji,title,description){
 const target=document.getElementById('game-result');
 target.innerHTML='<div class="result-box"><div class="result-emoji">'+emoji+'</div><p>THE OFFICIAL (NOT REALLY) RESULT FOR '+escapeHTML(name.toUpperCase())+'</p><h3>'+title+'</h3><p>'+description+'</p></div><div class="share-row"><button class="modal-button" id="share-result">Share result ↗</button><button class="modal-button secondary-button" id="again">Play again</button></div>';
 document.getElementById('share-result').addEventListener('click',()=>shareText('My CutePlay result: '+title+' — '+description));
 document.getElementById('again').addEventListener('click',()=>games.block());
 chime();
}
function startQuiz(title,intro,questions,resultLabel){
 let index=0,score=0;
 function render(){
  content.innerHTML='<h2 id="modal-title">'+title+'</h2><p>'+intro+'</p><div class="progress"><span style="width:'+(index/questions.length*100)+'%"></span></div><p><b>QUESTION '+(index+1)+' OF '+questions.length+'</b></p><h3>'+questions[index][0]+'</h3><div class="question-options">'+questions[index][1].map((o,i)=>'<button class="option-button" data-choice="'+i+'">'+o+'</button>').join('')+'</div>';
  content.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{tone(560+Number(b.dataset.choice)*80);score+=Number(b.dataset.choice);index++;if(index<questions.length)render();else finish()}));
 }
 function finish(){
  const percent=Math.round((score/(questions.length*3))*100),emoji=percent<35?'🌷':percent<70?'🦋':'🌟',titleText=percent<35?'Soft & Sweet':percent<70?'Bright & Balanced':'Big Main-Character Energy';
  content.innerHTML='<h2 id="modal-title">Your result is in!</h2><div class="result-box"><div class="result-emoji">'+emoji+'</div><p>'+resultLabel.toUpperCase()+'</p><strong>'+percent+'%</strong><h3>'+titleText+'</h3><p>This is a playful quiz result, not a real-life score or assessment. Keep being you!</p></div><div class="share-row"><button class="modal-button" id="share-result">Share result ↗</button><button class="modal-button secondary-button" id="restart">Try again</button></div>';
  document.getElementById('share-result').addEventListener('click',()=>shareText('My CutePlay quiz result: '+titleText+'!'));
  document.getElementById('restart').addEventListener('click',()=>{index=0;score=0;render()});chime();
 }
 render();
}
async function shareText(text){
 const data={title:'My CutePlay result',text,url:location.href};
 if(navigator.share){try{await navigator.share(data)}catch(e){}}
 else if(navigator.clipboard){try{await navigator.clipboard.writeText(text+' '+location.href);alert('Result copied! Share it with a friend.')}catch(e){alert(text)}}
 else alert(text);
}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

/* Personalized friendship quiz: self-contained share links, no account required. */
const starterQuestions=[
 ['What is my ultimate comfort food?',['Pizza 🍕','Pasta 🍝','Chocolate 🍫','Something homemade 🥣'],2],
 ['What would my perfect weekend look like?',['Movie night & snacks 🍿','A big adventure 🌈','A cozy day at home 🧸','Shopping with friends 🛍️'],0],
 ['Which app do I probably open first?',['Instagram 📸','YouTube ▶️','Messages 💬','Music 🎧'],2],
 ['What is my biggest pet peeve?',['Being kept waiting ⏰','Loud chewing 🙉','Messy spaces 🧦','One-word replies 😶'],3],
 ['Which fictional world would I visit?',['A magical kingdom 🏰','A superhero city 🦸','A cozy cartoon town 🍄','A space adventure 🚀'],0],
 ['What kind of gift would make me happiest?',['A handwritten note 💌','A surprise outing 🎟️','A thoughtful little thing 🎁','My favorite treats 🍬'],0],
 ['What makes me laugh instantly?',['Silly memes 😂','Inside jokes 🤫','Funny stories 🎭','Cute animals 🐣'],1],
 ['Choose my dream destination.',['Beach island 🏝️','Snowy mountains ❄️','Big city lights 🌃','Quiet countryside 🌻'],0],
 ['Which describes my energy best?',['Quiet & observant 🌙','Talkative & bubbly 🫧','Chaotic & funny ⚡','Calm & thoughtful 🌷'],1],
 ['What would I choose for a free evening?',['Read or watch something 📚','Call a friend ☎️','Try a new hobby 🎨','Go out for a treat 🧋'],0]
];
function creatorView(){
 const params=new URLSearchParams(location.search);
 const encoded=params.get('quiz');
 if(encoded){try{const quiz=decodeQuiz(encoded);if(!quiz||!Array.isArray(quiz.questions)||quiz.questions.length<3)throw Error('bad quiz');playSharedQuiz(quiz);return}catch(e){content.innerHTML='<h2>Oops! This quiz link looks incomplete 💗</h2><p>Ask your friend to create and share a fresh link.</p>';openModal();return}}
 openModal();renderBuilder();
}
function renderBuilder(){
 content.innerHTML='<div class="builder-heading"><span class="builder-kicker">YOUR FRIENDSHIP CHALLENGE ✨</span><h2 id="modal-title">Create your bestie quiz 💌</h2><p>Set your own answers, then send your quiz link to friends. They will try to guess your choices!</p></div><form id="builder-form" class="builder-form"><label class="field-label" for="creator-name">Your nickname</label><input id="creator-name" maxlength="22" required placeholder="e.g. Cupcake"><div class="builder-progress"><b>10 questions</b><span>Make it yours</span></div><div id="builder-questions"></div><button class="modal-button builder-submit" type="submit">Create my quiz link ✨</button><p class="tiny-privacy">No account needed. Your quiz is packed into a shareable link.</p></form>';
 const holder=document.getElementById('builder-questions');
 holder.innerHTML=starterQuestions.map((q,i)=>'<fieldset class="builder-question"><legend><span>Q'+(i+1)+'</span> '+escapeHTML(q[0])+'</legend><label class="field-label">Question</label><input class="q-text" maxlength="100" required value="'+escapeHTML(q[0])+'"><div class="answer-grid">'+q[1].map((a,j)=>'<label class="answer-edit"><span>Option '+String.fromCharCode(65+j)+'</span><input class="q-option" maxlength="55" required value="'+escapeHTML(a)+'"><span class="correct-choice"><input type="radio" name="correct-'+i+'" value="'+j+'" '+(j===q[2]?'checked':'')+'><small>Correct answer</small></span></label>').join('')+'</div></fieldset>').join('');
 document.getElementById('builder-form').addEventListener('submit',e=>{
  e.preventDefault();const name=document.getElementById('creator-name').value.trim();
  const questions=[...holder.querySelectorAll('.builder-question')].map((el,i)=>({text:el.querySelector('.q-text').value.trim(),options:[...el.querySelectorAll('.q-option')].map(x=>x.value.trim()),correct:Number(el.querySelector('input[type=radio]:checked')?.value??0)}));
  if(!name||questions.some(q=>!q.text||q.options.some(a=>!a)))return;
  const quiz={name,questions,version:1};const token=encodeQuiz(quiz);const url=new URL(location.href);url.search='';url.searchParams.set('quiz',token);url.hash='';
  if(url.href.length>7500){alert('Your quiz link is too long. Please shorten a few answers.');return}
  renderCreated(url.href,name);chime();
 });
}
function encodeQuiz(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function decodeQuiz(token){const b64=token.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(b64);const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));const obj=JSON.parse(new TextDecoder().decode(bytes));if(!obj.name||!Array.isArray(obj.questions)||obj.questions.length!==10)throw Error('invalid');obj.questions.forEach(q=>{if(typeof q.text!=='string'||!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(q.correct)||q.correct<0||q.correct>3)throw Error('invalid')});return obj}
function renderCreated(url,name){
 content.innerHTML='<div class="created-state"><div class="created-emoji">🎉💌</div><span class="builder-kicker">YOUR QUIZ IS READY</span><h2 id="modal-title">Looking good, '+escapeHTML(name)+'!</h2><p>Your personal quiz link is ready. Send it to your friends and see who knows you best.</p><div class="share-link-box"><input id="quiz-url" readonly value="'+escapeHTML(url)+'" aria-label="Your quiz link"><button id="copy-quiz" class="modal-button">Copy link</button></div><button id="native-share" class="modal-button secondary-button wide-button">Share with friends ↗</button><div class="created-note">♡ Anyone with this link can play. Keep it among people you trust.</div><button id="edit-quiz" class="text-action">← Edit my questions</button></div>';
 document.getElementById('copy-quiz').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);document.getElementById('copy-quiz').textContent='Copied ✓';tone(780)}catch(e){document.getElementById('quiz-url').select();alert('Copy the selected link.')}});
 document.getElementById('native-share').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:'Can you guess my answers?',text:'I made a CutePlay bestie quiz! See how well you know me 💗',url})}catch(e){}}else{try{await navigator.clipboard.writeText(url);alert('Quiz link copied!')}catch(e){}}});
 document.getElementById('edit-quiz').addEventListener('click',renderBuilder);
}
function playSharedQuiz(quiz){
 openModal();let index=0,answers=[];
 function render(){
  const q=quiz.questions[index];
  content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">A QUIZ FROM '+escapeHTML(quiz.name.toUpperCase())+' 💗</span><h2 id="modal-title">How well do you know them?</h2><div class="progress"><span style="width:'+((index)/quiz.questions.length*100)+'%"></span></div><p class="question-count">QUESTION '+(index+1)+' OF '+quiz.questions.length+'</p><h3>'+escapeHTML(q.text)+'</h3><div class="question-options">'+q.options.map((o,i)=>'<button class="option-button" data-answer="'+i+'">'+escapeHTML(o)+'</button>').join('')+'</div><p class="tiny-privacy">Choose your best guess — you can’t change it later.</p></div>';
  content.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{answers.push(Number(btn.dataset.answer));tone(590);index++;if(index<quiz.questions.length)render();else showSharedScore()}));
 }
 function showSharedScore(){
  const score=answers.reduce((sum,a,i)=>sum+(a===quiz.questions[i].correct?1:0),0),percent=Math.round(score/quiz.questions.length*100);
  const level=percent===100?['🏆','BESTIE LEGEND','You know them inside out!']:percent>=80?['💗','ULTIMATE BESTIE','You two are seriously in sync.']:percent>=60?['🫶','CLOSE FRIEND ENERGY','You know a lot about them!']:percent>=40?['🌷','GETTING CLOSER','A few more chats and you’ve got this.']:['🧸','FRIENDSHIP IN PROGRESS','Time for more fun conversations!'];
  content.innerHTML='<div class="score-reveal"><div class="score-confetti">✦ ✧ ♡ ✧ ✦</div><div class="result-emoji">'+level[0]+'</div><span class="builder-kicker">YOUR FRIENDSHIP SCORE</span><h2 id="modal-title">'+score+' / '+quiz.questions.length+'</h2><div class="score-meter"><span style="width:'+percent+'%"></span></div><h3>'+level[1]+'</h3><p>'+level[2]+'</p><p class="score-for">You played '+escapeHTML(quiz.name)+'’s quiz.</p><button id="share-score" class="modal-button wide-button">Share my score ↗</button><button id="make-own" class="text-action">Create your own quiz ♡</button></div>';
  document.getElementById('share-score').addEventListener('click',()=>shareText('I scored '+score+'/10 on '+quiz.name+'’s CutePlay Bestie Quiz! My title: '+level[1]+'. Can you beat my score? '+location.href));document.getElementById('make-own').addEventListener('click',()=>{history.replaceState({},'',location.pathname);renderBuilder()});chime();launchConfetti();
 }
 render();
}
function launchConfetti(){const layer=document.createElement('div');layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');for(let i=0;i<28;i++){const bit=document.createElement('i');bit.textContent=['✦','♥','•','✧'][i%4];bit.style.left=(Math.random()*100)+'%';bit.style.animationDelay=(Math.random()*.65)+'s';layer.appendChild(bit)}document.body.appendChild(layer);setTimeout(()=>layer.remove(),2400)}
document.getElementById('create-quiz-card')?.addEventListener('click',creatorView);
if(new URLSearchParams(location.search).has('quiz'))creatorView();
