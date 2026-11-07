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
  const mood=score<questions.length?'🌷':score<questions.length*2?'🦋':'🌟';
  const titleText=score<questions.length?'Soft & Sweet':score<questions.length*2?'Bright & Balanced':'Big Main-Character Energy';
  content.innerHTML='<h2 id="modal-title">Your result is in!</h2><div class="result-box"><div class="result-emoji">'+mood+'</div><p>'+resultLabel.toUpperCase()+'</p><h3>'+titleText+'</h3><p>This is a playful vibe reveal, not a scored test or a real-life assessment. Keep being you!</p></div><div class="share-row"><button class="modal-button" id="share-result">Share result ↗</button><button class="modal-button secondary-button" id="restart">Try again</button></div>';
  document.getElementById('share-result').addEventListener('click',()=>shareText('My CutePlay quiz vibe: '+titleText+'!'));
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
 if(encoded){try{const quiz=decodeQuiz(encoded);if(!quiz||!Array.isArray(quiz.questions)||quiz.questions.length<3)throw Error('bad quiz');const result=params.get('result');if(result){renderChallengeLanding(quiz,result)}else{playSharedQuiz(quiz)}return}catch(e){content.innerHTML='<h2>Oops! This quiz link looks incomplete 💗</h2><p>Ask your friend to create and share a fresh link.</p>';openModal();return}}
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
function renderChallengeLanding(quiz,result){
 const parts=result.split('-'),score=Number(parts[0]),percent=Number(parts[1]);
 if(!Number.isFinite(score)||!Number.isFinite(percent)||score<0||score>quiz.questions.length||percent<0||percent>100){playSharedQuiz(quiz);return}
 openModal();
 content.innerHTML='<div class="challenge-landing"><div class="created-emoji">🏁💗</div><span class="builder-kicker">A FRIEND LEFT YOU A CHALLENGE</span><h2 id="modal-title">'+escapeHTML(quiz.name)+' scored '+percent+'%!</h2><p>Think you know them even better? Take the same 10-question challenge and see your own score.</p><div class="challenge-score-pill">'+score+' / '+quiz.questions.length+' correct</div><button id="take-challenge" class="modal-button wide-button">Take the bestie challenge ✨</button><p class="tiny-privacy">Your score is a friendly challenge, not a competition you have to win.</p></div>';
 document.getElementById('take-challenge').addEventListener('click',()=>{const url=new URL(location.href);url.searchParams.delete('result');history.replaceState({},'',url);playSharedQuiz(quiz)});
}
function playSharedQuiz(quiz){
 openModal();let index=0,answers=[];
 function render(){
  const q=quiz.questions[index];
  content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">A QUIZ FROM '+escapeHTML(quiz.name.toUpperCase())+' 💗</span><h2 id="modal-title">How well do you know them?</h2><div class="progress"><span style="width:'+((index)/quiz.questions.length*100)+'%"></span></div><p class="question-count">QUESTION '+(index+1)+' OF '+quiz.questions.length+'</p><h3>'+escapeHTML(q.text)+'</h3><div class="question-options">'+q.options.map((o,i)=>'<button class="option-button" data-answer="'+i+'">'+escapeHTML(o)+'</button>').join('')+'</div><p class="tiny-privacy">Choose your best guess — you can’t change it later.</p></div>';
  content.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{answers.push(Number(btn.dataset.answer));tone(590);index++;if(index<quiz.questions.length)render();else showSharedScore()}));
 }
 function showSharedScore(){
  const score=answers.reduce((sum,a,i)=>sum+(a===quiz.questions[i].correct?1:0),0),total=quiz.questions.length,percent=Math.round(score/total*100);
  const level=percent===100?['🏆','BESTIE LEGEND','You know them inside out!']:percent>=80?['💗','ULTIMATE BESTIE','You two are seriously in sync.']:percent>=60?['🫶','CLOSE FRIEND ENERGY','You know a lot about them!']:percent>=40?['🌷','GETTING CLOSER','A few more chats and you’ve got this.']:['🧸','FRIENDSHIP IN PROGRESS','Time for more fun conversations!'];
  const resultUrl=new URL(location.href);resultUrl.searchParams.set('result',score+'-'+percent);history.replaceState({},'',resultUrl.href);
  content.innerHTML='<div class="score-reveal"><div class="score-confetti">✦ ✧ ♡ ✧ ✦</div><div class="result-emoji">'+level[0]+'</div><span class="builder-kicker">YOUR BESTIE QUIZ RESULT</span><h2 id="modal-title">'+percent+'%</h2><div class="score-fraction">'+score+' correct out of '+total+'</div><div class="score-meter"><span style="width:'+percent+'%"></span></div><h3>'+level[1]+'</h3><p>'+level[2]+'</p><p class="score-for">You played '+escapeHTML(quiz.name)+'’s quiz.</p><div class="result-actions"><button id="share-score" class="modal-button">Challenge another friend ↗</button><button id="make-own" class="modal-button secondary-button">Create my own quiz ♡</button></div><p class="tiny-privacy">Your challenge link carries this score preview. Friends can tap through and take the same quiz.</p></div>';
  document.getElementById('share-score').addEventListener('click',()=>shareText('I scored '+score+'/'+total+' ('+percent+'%) on '+quiz.name+'’s CutePlay Bestie Quiz! My title: '+level[1]+'. Can you beat me? '+resultUrl.href));document.getElementById('make-own').addEventListener('click',()=>{history.replaceState({},'',location.pathname+'?create=1');renderBuilder()});chime();launchConfetti();
 }
 render();
}
function launchConfetti(){const layer=document.createElement('div');layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');for(let i=0;i<28;i++){const bit=document.createElement('i');bit.textContent=['✦','♥','•','✧'][i%4];bit.style.left=(Math.random()*100)+'%';bit.style.animationDelay=(Math.random()*.65)+'s';layer.appendChild(bit)}document.body.appendChild(layer);setTimeout(()=>layer.remove(),2400)}
document.getElementById('create-quiz-card')?.addEventListener('click',creatorView);
if(new URLSearchParams(location.search).has('quiz')||new URLSearchParams(location.search).has('create'))creatorView();

/* Extra original, playable games based on the requested friendship-game themes. */
Object.assign(games,{
team(){startQuiz('Would you join my team? 🛟','Choose your move in these silly imaginary situations.',[
['Our road-trip map has no plan. You…',['Make a snack map','Pick a scenic route','Become the DJ','Ask everyone to vote']],
['The team mascot is missing. You…',['Design a new one','Start a friendly search','Make a poster','Keep everyone laughing']],
['Plan a mini adventure in one hour. You…',['Choose a cozy café','Find a creative activity','Plan a park picnic','Let the group vote']]
],'Your team-player style')},
dream(){startQuiz('What kind of dreamer are you? ☁️','Choose what sounds most fun in these creative daydreams.',[
['Your notebook has a blank page. You draw…',['A fantasy world','A future invention','A travel map','A comic strip']],
['Pick a magical everyday item.',['A bookmark that tells stories','A glowing paintbrush','A map to hidden gardens','A camera for happy moments']],
['Your perfect creative afternoon is…',['Writing a story','Making something','Planning a trip','Taking photos']],
['Choose a sky.',['Cotton-candy sunset','Starry midnight','Bright blue morning','Lavender twilight']],
['A new idea pops into your head. You…',['Write it down','Sketch it','Tell a friend','Try it out']]
],'Your dreamer type')},
bond(){startQuiz('Friendship Bond Meter 💞','A lighthearted friendship-style quiz — not a real measure of a relationship.',[
['A friend has a big day. You…',['Send an encouraging note','Ask how it went','Share a funny distraction','Offer help']],
['Your group chat is quiet. You…',['Share a cheerful meme','Ask how everyone is','Send a fun question','Let everyone recharge']],
['Choose a friendship tradition.',['A yearly photo','A shared playlist','A regular game night','A silly awards night']],
['A friend learns something new. You…',['Celebrate their progress','Ask them to teach you','Make a congrats card','Practise together']]
],'Your friendship style')},
future(){startQuiz('Friendship in 2035 🔮','Imagine a kind, fun future with your favourite people.',[
['Your future group hangout is…',['A creative studio','A garden picnic','A game-night lounge','A travel adventure']],
['Your group keeps in touch with…',['A shared photo journal','Voice notes and stories','Online game nights','A yearly reunion']],
['Pick a future tradition.',['A friendship time capsule','A silly awards show','A shared recipe book','A group playlist update']],
['Your group motto would be…',['Keep growing together','Make room for laughter','Small moments matter','Stay curious']]
],'Your future friendship vibe')}
});
games.message=function(){
content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">A LITTLE NOTE FOR A FRIEND ✨</span><h2 id="modal-title">Friendship Secret Message 💬</h2><p>Choose a mood and add a nickname to make a cheerful message.</p></div><form id="message-form" class="game-form"><label for="message-name">Friend’s nickname</label><input id="message-name" maxlength="24" required placeholder="e.g. Sunny"><label for="message-mood">Message mood</label><select id="message-mood"><option value="bright">Bright & cheerful</option><option value="funny">Silly & funny</option><option value="support">Encouraging</option><option value="thank">Thank-you note</option></select><button class="modal-button">Make my message ✨</button></form><div id="message-result"></div>';
document.getElementById('message-form').addEventListener('submit',e=>{e.preventDefault();const name=escapeHTML(document.getElementById('message-name').value.trim());const mood=document.getElementById('message-mood').value;const lines={bright:'You make ordinary days feel brighter. Keep being wonderfully you! 🌈',funny:'Official announcement: your daily dose of silliness has arrived. Please accept one imaginary trophy. 🏆',support:'Your effort matters. One step at a time — you’ve got this! 🌷',thank:'Thanks for the laughs, kindness and all the little moments. They mean a lot! 💗'};const msg='Hey '+name+'! '+lines[mood];document.getElementById('message-result').innerHTML='<div class="result-box"><div class="result-emoji">💌</div><h3>Your little message</h3><p>'+msg+'</p></div><button class="modal-button wide-button" id="copy-message">Copy message ↗</button>';document.getElementById('copy-message').addEventListener('click',()=>shareText(msg));tone(700)});
};
games.bingo=function(){
const squares=['We laugh at the same things','We share snacks','We have an inside joke','We cheer each other on','We send funny memes','We like a similar show','We can talk for ages','We enjoy quiet time','We make days more fun'];
content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">FRIENDSHIP BINGO ✨</span><h2 id="modal-title">Best Friend Bingo 🎯</h2><p>Tap the squares that feel true. Complete a row, column or diagonal!</p></div><div class="bingo-grid">'+squares.map((s,i)=>'<button class="bingo-square" type="button" data-square="'+i+'">'+s+'</button>').join('')+'</div><p id="bingo-status" class="tiny-privacy">0 squares marked</p><button class="modal-button wide-button" id="bingo-reset">Reset board</button>';
const marked=new Set(),lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
content.querySelectorAll('[data-square]').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.square);if(marked.has(n)){marked.delete(n);b.classList.remove('marked')}else{marked.add(n);b.classList.add('marked');tone(620)}document.getElementById('bingo-status').textContent=lines.some(line=>line.every(x=>marked.has(x)))?'BINGO! You completed a line. ✨':marked.size+' squares marked'}));
document.getElementById('bingo-reset').addEventListener('click',()=>{marked.clear();content.querySelectorAll('.bingo-square').forEach(b=>b.classList.remove('marked'));document.getElementById('bingo-status').textContent='0 squares marked'});
};
games.recipe=function(){
content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">MIX YOUR FRIENDSHIP ✨</span><h2 id="modal-title">Friendship Recipe 🍓</h2><p>Choose ingredients to create your imaginary friendship recipe.</p></div><form id="recipe-form" class="game-form"><label for="recipe-base">Base ingredient</label><select id="recipe-base"><option>Two cups of laughter</option><option>A bowl of kindness</option><option>A spoonful of creativity</option><option>A handful of adventures</option></select><label for="recipe-spice">Special spice</label><select id="recipe-spice"><option>Extra silly jokes</option><option>Never-ending support</option><option>Shared playlists</option><option>Surprise snacks</option></select><label for="recipe-top">Final topping</label><select id="recipe-top"><option>Rainbow sprinkles</option><option>Golden memories</option><option>Chocolate chips</option><option>Happy little notes</option></select><button class="modal-button">Mix our recipe ✨</button></form><div id="recipe-result"></div>';
document.getElementById('recipe-form').addEventListener('submit',e=>{e.preventDefault();const vals=['recipe-base','recipe-spice','recipe-top'].map(id=>document.getElementById(id).value);document.getElementById('recipe-result').innerHTML='<div class="result-box"><div class="result-emoji">🧁</div><h3>The Friendship Special</h3><p>'+vals.map(escapeHTML).join(' + ')+'</p><p>Mix with kindness and a pinch of fun. Best served with a smile!</p></div><button class="modal-button wide-button" id="share-recipe">Share our recipe ↗</button>';document.getElementById('share-recipe').addEventListener('click',()=>shareText('Our CutePlay Friendship Recipe: '+vals.join(' + ')));chime()});
};
games.playlist=function(){
const moods=[['giggles','😂','Giggles & chaos'],['cozy','☁️','Cozy afternoon'],['adventure','🌈','Big adventure'],['encourage','🌷','You’ve got this']];
const tracks={giggles:['The Snack Debate','Laugh Loop','Oops, One More Meme'],cozy:['Cloudy Day Café','Blanket Fort Dreams','Tea & Tiny Talks'],adventure:['Map of Maybe','Sunshine Detour','The Long Way Home'],encourage:['One Step Brighter','Keep Your Spark','Small Wins Parade']};
content.innerHTML='<div class="play-quiz-head"><span class="builder-kicker">YOUR SHARED SOUNDTRACK 🎧</span><h2 id="modal-title">Our Friendship Playlist</h2><p>Pick a mood to get original, made-up track names.</p></div><div class="question-options">'+moods.map(x=>'<button class="option-button" data-mood="'+x[0]+'">'+x[1]+' '+x[2]+'</button>').join('')+'</div><div id="playlist-result"></div>';
content.querySelectorAll('[data-mood]').forEach(b=>b.addEventListener('click',()=>{const list=tracks[b.dataset.mood];document.getElementById('playlist-result').innerHTML='<div class="result-box"><div class="result-emoji">🎶</div><h3>Your playlist mood</h3><p>'+list.map((t,i)=>(i+1)+'. '+t).join('<br>')+'</p><p class="tiny-privacy">Original track names — no music is played.</p></div><button class="modal-button wide-button" id="share-playlist">Share playlist theme ↗</button>';document.getElementById('share-playlist').addEventListener('click',()=>shareText('Our CutePlay playlist theme: '+list.join(', ')));tone(700)}));
};
