const STORAGE_KEY = 'epiphanie-treasure-trail-v2';
const phrase = 'DO YOU WANT TO BE MY GIRLFRIEND';
const phraseWords = phrase.split(' ');

const levels = [
  { clue: 'Dans quel lieu nous sommes-nous rencontrés pour la première fois ? ', answers: ['siao', 'au siao', 'le siao'] },
  { clue: 'Quand je veux te donner un surnom digne d’une héroïne de conte, lequel est-ce ?', answers: ['princesse', 'ma princesse', 'la princesse'] },
  { clue: 'Qui veille sur la ville de ouagadougou lorsque ses habitants dorment ?', answers: ['alpha', 'bat alpha', 'batalpha', "bat'alpa", "bat'alpha", 'bat alpha'] },
  { clue: 'Quel remède imaginaire devrait figurer dans toutes les pharmacies, puisqu’il guérit toutes les maladies ? Attention à bien écrire son nom !', answers: ['epiphanitamol', 'l epiphanitamol', "l'epiphanitamol", 'epiphanitamol'] },
  { clue: "Quel est le meilleur mois de l'année ?", answers: ['janvier', 'le mois de janvier', 'mois de janvier'] },
  { clue: 'Qui est, à tes yeux, le plus chanceux au monde ?', answers: ['alpha'] },
  { clue: "Quel plat avions-nous prévu d’aller manger ensemble, mais que nous n’avons toujours pas réussi à partager ?", answers: ['attieke', "l'attieke", 'attiéké', "l'attiéké","atieke", "atiéké","Atiéké","atieké"] },
  { clue: 'Qui est la fondatrice et PDG de WATE créations?', answers: ['Wivine', 'Epiphanie', 'aïchedji'] },
  { clue: 'Quel diplôme as-tu décroché en terminant le lycée ? On l’appelle souvent simplement le « bac ».', answers: ['baccalauréat', 'baccalaureat', 'le baccalauréat', 'le baccalaureat', 'bac', 'le bac'] },
  { clue: 'Quel âge a l’aventurière qui vient de décrocher son bac et qui se trouve derrière WATE Créations ?', answers: ['18', '18 ans', 'dix-huit', 'dix-huit ans'] },
  { clue: 'Quel objet fait main peut naître de tes idées et se porter autour du poignet ?', answers: ['bracelet', 'un bracelet', 'bracelets', 'des bracelets'] },
  { clue: 'Tu fais partie d’un mouvement où l’on part à l’aventure en équipe, avec un foulard et plein de souvenirs. Quel est ce mouvement ?', answers: ['scoutisme', 'le scoutisme', 'scout', 'scoute', 'les scouts', 'scoutisme'] },
  { clue: 'Quel jeu de stratégie as-tu envie d’explorer, même si tu débutes encore ?', answers: ['échecs', 'echecs', 'les échecs', 'jeu d échecs', 'jeu d echecs'] },
  { clue: 'Quel mot décrit le mieux ton niveau actuel dans le jeu précédent : experte ou… ?', answers: ['débutante', 'debutante', 'une débutante', 'une debutante', 'débutante aux échecs', 'debutante aux echecs'] },
  { clue: 'Complète le nom de ta marque : « WATE … » — le mot qui annonce toutes les choses que tu imagines et fabriques.', answers: ['créations', 'creations'] },
  { clue: 'Dans le nom de ta marque, quel est le mot distinctif placé juste avant « Créations » ?', answers: ['wate'] },
  { clue: 'Le lieu de notre première rencontre se cache derrière quatre lettres : S-I-A-O. Quel nom faut-il prononcer ?', answers: ['siao', 'au siao', 'le siao'] },
  { clue: 'Quel titre affectueux me permet de t’appeler comme la princesse de mon histoire préférée ?', answers: ['princesse', 'ma princesse', 'la princesse'] },
  { clue: 'Le remède miracle de nos conversations a un nom composé à partir du tien. Comment s’appelle-t-il ?', answers: ['epiphanitamol', 'l epiphanitamol', "l'epiphanitamol"] },
  { clue: 'Quel mois faudrait-il entourer en premier sur le calendrier, puisque c’est le meilleur mois de l’année ?', answers: ['janvier', 'le mois de janvier', 'mois de janvier'] },
  { clue: 'Quel prénom faut-il inscrire sur le badge du gardien de Ouagadougou pendant que tout le monde dort ?', answers: ['alpha', 'bat alpha', 'batalpha', "bat'alpha"] },
  { clue: 'Retour à notre rendez-vous gourmand : quel plat attend toujours qu’on le partage ensemble ?', answers: ['attieke', "l'attieke", 'attiéké', "l'attiéké"] },
  { clue: 'Quel diplôme marque la fin du lycée et le début d’un nouveau chapitre pour toi ?', answers: ['baccalauréat', 'baccalaureat', 'bac', 'le bac'] },
  { clue: 'Quel accessoire de tes créations peut raconter une histoire à chaque fois qu’on le passe au poignet ?', answers: ['bracelet', 'un bracelet', 'bracelets', 'des bracelets'] },
  { clue: 'Quel jeu de stratégie que tu découvres pourrait devenir notre prochain défi à deux ?', answers: ['échecs', 'echecs', 'les échecs', 'jeu d échecs', 'jeu d echecs'] },
];
levels.length = 7;

const app = document.querySelector('#app');
let progress = readProgress();
let activeLevel = null;
let toastTimer;

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isInteger(saved.completed) && saved.completed >= 0 && saved.completed <= levels.length) {
      return { started: !!saved.started, completed: saved.completed, answer: typeof saved.answer === 'string' ? saved.answer : '' };
    }
  } catch { /* A fresh game starts if storage is unavailable or malformed. */ }
  return { started: false, completed: 0, answer: '' };
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { showToast('La sauvegarde est indisponible dans ce navigateur. Garde cette page ouverte pour continuer.'); }
}

function normalize(value) {
  return value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, ' ').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function brand() {
  return '<div class="brand"><span class="brand-mark" aria-hidden="true">✦</span><span>Une aventure pour Épiphanie</span></div>';
}

function homeScreen() {
  const resume = progress.started && progress.completed > 0 && progress.completed < levels.length;
  app.innerHTML = `${brand()}<section class="panel center">
    <div class="illustration" aria-hidden="true">🧭</div>
    <p class="eyebrow">Une aventure rien que pour toi</p>
    <h1>Bienvenue au jeu de piste conçu par le plus chanceux juste pour Épiphanie</h1>
    <p class="lead">Un parcours, 7 énigmes et une mystérieuse question à découvrir…</p>
    <button class="btn btn-primary" data-action="play">${resume ? 'Reprendre l’aventure' : progress.completed === levels.length ? 'Revoir la surprise' : 'Jouer'}</button>
    ${resume ? `<p class="return-note">Ta progression est gardée : ${progress.completed} niveau${progress.completed > 1 ? 'x' : ''} déjà réussi${progress.completed > 1 ? 's' : ''} ✨</p>` : ''}
  </section>`;
}

function introScreen() {
  app.innerHTML = `${brand()}<section class="panel center">
    <div class="illustration" aria-hidden="true">🗺️</div>
    <p class="eyebrow">Avant de partir à l’aventure</p>
    <h2>Merci d’avoir accepté de jouer !</h2>
    <p class="lead">Ce jeu est un jeu de piste dont le but final est de répondre à la question ultime… Mais quelle est cette question ? Tu découvriras, à chaque niveau, un mot qui la compose. Il y a 7 niveaux et tu peux avancer à ton rythme.</p>
    <div class="character-trio" aria-hidden="true"><span class="character-monkey monkey-one">🙊</span><span class="character-monkey monkey-two">🙈</span><span class="character-cupid">👼🏹</span></div>
    <h3 class="ready-prompt">Es-tu prête à jouer ?</h3>
    <div class="button-row"><button class="btn btn-primary" data-action="start">Oui, commencer à jouer</button><button class="btn btn-soft" data-action="no-thanks">Non, dommage</button></div>
  </section>`;
}

function phraseMarkup() {
  return phraseWords.map((word, index) => `<span class="word ${index < progress.completed ? 'filled' : 'hidden-word'}" aria-label="${index < progress.completed ? `mot ${word}` : 'mot caché'}">${index < progress.completed ? word : '•'.repeat(word.length)}</span>`).join('');
}

function mapMarkup() {
  const nodes = levels.map((_, index) => {
    const number = index + 1;
    const complete = number <= progress.completed;
    const open = number === progress.completed + 1;
    const available = number <= progress.completed + 1;
    const className = `level-node ${complete ? 'done' : ''} ${open ? 'unlocked current' : ''}`;
    const label = complete ? `Revoir le niveau ${number}, terminé` : open ? `Commencer le niveau ${number}` : `Niveau ${number}, verrouillé`;
    return `<button type="button" class="${className}" style="--node-index:${index}" data-level="${number}" aria-label="${label}" ${available ? '' : 'disabled'}>${number}</button>`;
  }).join('');
  return `<div class="trail" aria-label="Parcours des ${levels.length} niveaux"><svg class="trail-heart" viewBox="0 0 390 900" preserveAspectRatio="none" aria-hidden="true"><path d="M195 820 C155 755 25 630 25 455 C25 330 115 270 195 370 C275 270 365 330 365 455 C365 630 235 755 195 820 Z" /></svg><svg class="trail-line" viewBox="0 0 390 900" preserveAspectRatio="none" aria-hidden="true"><path d="M195 10 C340 25 60 70 195 95 S330 145 195 175 S55 220 195 250 S335 295 195 325 S55 370 195 400 S335 445 195 475 S55 520 195 550 S335 595 195 625 S55 670 195 700 S335 745 195 775 S55 820 195 850 S280 875 195 890" /></svg>${nodes}</div>`;
}

function gameScreen() {
  const percent = Math.round(progress.completed / levels.length * 100);
  app.innerHTML = `${brand()}<div class="progress-wrap"><div class="progress-label"><span>Ta progression</span><span>${progress.completed} / ${levels.length} niveaux</span></div><div class="progress-track" role="progressbar" aria-label="Progression du jeu" aria-valuenow="${progress.completed}" aria-valuemin="0" aria-valuemax="${levels.length}"><div class="progress-fill" style="width:${percent}%"></div></div></div>
    <section class="phrase-card"><p class="phrase-hint">La question secrète — les mots se révèlent au fil du chemin</p><div class="phrase" aria-label="Question secrète masquée">${phraseMarkup()}</div></section>
    <section class="map-card"><h2 class="map-heading">Le sentier des ${levels.length} défis</h2><p class="map-subtitle">Avance à ton rythme, une énigme à la fois 🌿</p>${mapMarkup()}<div class="map-legend"><span class="legend-item"><i class="legend-dot complete"></i> Terminé</span><span class="legend-item"><i class="legend-dot open"></i> À jouer</span><span class="legend-item"><i class="legend-dot"></i> Verrouillé</span></div></section>
    <div class="map-footer"><button class="btn-quiet" data-action="home">← Retour à l’accueil</button></div>`;
}

function showLevel(number) {
  activeLevel = number - 1;
  const level = levels[activeLevel];
  const alreadyDone = number <= progress.completed;
  const correct = alreadyDone;
  const nextNumber = activeLevel + 2;
  const correctButton = '';
  const reward = correct ? `<div class="success-box"><p>Bien joué, niveau ${number} terminé !</p><p>${nextNumber > levels.length ? 'Tu as trouvé le dernier mot :' : `Le niveau ${nextNumber} est débloqué. Voici ton mot :`}</p><span class="reward-letter">${phraseWords[activeLevel]}</span><p>Un nouveau mot a rejoint ta question secrète 🌟</p></div>` : '';
  app.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="level-title"><p class="eyebrow">Étape ${number} sur ${levels.length}</p><h2 id="level-title" class="center">${alreadyDone ? 'Défi déjà réussi !' : 'À toi de jouer'}</h2><p class="riddle">${level.clue}</p>${alreadyDone ? '' : `<form class="answer-form" data-form="answer"><input class="answer-input" name="answer" type="text" autocomplete="off" placeholder="Ta réponse…" aria-label="Ta réponse" required><button class="btn btn-primary" type="submit">Valider ma réponse</button><p class="feedback" role="status"></p></form>`}${reward}<div class="button-row">${correctButton}<button class="btn-quiet" data-action="close-level">Retour au parcours</button></div></section></div>`);
  if (!alreadyDone) app.querySelector('.answer-input').focus();
}

function finishScreen() {
  app.innerHTML = `${brand()}<section class="panel center final-question">
    <div class="illustration" aria-hidden="true">💌</div>
    <p class="eyebrow">Tu as trouvé tous les mots !</p>
    <h1>Do you want to be my girlfriend<span class="question-mark">?</span></h1>
    ${progress.answer ? `<p class="lead">${progress.answer === 'yes' ? 'Tu viens de rendre le plus chanceux très heureux 💚' : 'Merci de m’avoir répondu. Ta réponse compte et je la respecte 💚'}</p><p class="scout-note">Ta réponse a été envoyée automatiquement 💌</p>` : '<p class="lead">La dernière énigme est résolue… et voilà enfin la question !</p><p class="scout-note">Prends tout le temps qu’il te faut pour y répondre. Tu peux choisir la réponse qui te ressemble.</p><div class="button-row"><button class="btn btn-primary" data-action="yes">Yes 💚</button><button class="btn btn-soft" data-action="no">No, merci d’avoir demandé</button></div>'}
  </section>`;
}

function render() {
  activeLevel = null;
  if (progress.completed === levels.length) finishScreen();
  else if (progress.started) gameScreen();
  else homeScreen();
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);
  document.body.insertAdjacentHTML('beforeend', `<div class="toast" role="status">${message}</div>`);
  toastTimer = setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
}

app.addEventListener('click', event => {
  const button = event.composedPath().find(element => element instanceof HTMLButtonElement && (element.hasAttribute('data-action') || element.hasAttribute('data-level')));
  if (!button) return;
  if (button.hasAttribute('data-level')) {
    event.preventDefault();
    const number = Number(button.dataset.level);
    if (number <= progress.completed + 1) showLevel(number);
    return;
  }
  const action = button.dataset.action;
  if (action === 'play') {
    if (progress.completed === levels.length) return finishScreen();
    if (progress.started) return gameScreen();
    return introScreen();
  }
  if (action === 'start') {
    progress.started = true;
    saveProgress();
    return gameScreen();
  }
  if (action === 'no-thanks') return showToast('Pas de souci ! Le sentier t’attendra si tu changes d’avis 🌿');
  if (action === 'home') return homeScreen();
  if (action === 'next-level') return progress.completed === levels.length ? finishScreen() : showLevel(progress.completed + 1);
  if (action === 'close-level') return progress.completed === levels.length ? finishScreen() : gameScreen();
  if (action === 'backdrop' && event.target === button) return gameScreen();
  if (action === 'yes' || action === 'no') return sendAnswer(action, button);
});

async function sendAnswer(answer, button) {
  button.disabled = true;
  const buttons = app.querySelectorAll('[data-action="yes"], [data-action="no"]');
  buttons.forEach(item => { item.disabled = true; });
  const payload = new URLSearchParams({
    'form-name': 'reponse-question',
    reponse: answer === 'yes' ? 'Yes' : 'No',
    subject: 'Réponse à la question d’Épiphanie',
  });
  try {
    const response = await fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    if (!response.ok) throw new Error('Form submission failed');
    progress.answer = answer;
    saveProgress();
    finishScreen();
  } catch {
    buttons.forEach(item => { item.disabled = false; });
    showToast('L’envoi a échoué. Vérifie ta connexion et réessaie 💌');
  }
}

app.addEventListener('submit', event => {
  if (!event.target.matches('[data-form="answer"]')) return;
  event.preventDefault();
  const response = normalize(new FormData(event.target).get('answer'));
  const accepted = levels[activeLevel].answers.some(answer => normalize(answer) === response);
  const feedback = event.target.querySelector('.feedback');
  if (!accepted) {
    feedback.textContent = 'Pas tout à fait… relis l’indice et réessaie 💭';
    event.target.querySelector('input').select();
    return;
  }
  progress.completed = Math.max(progress.completed, activeLevel + 1);
  saveProgress();
  showLevel(activeLevel + 1);
});

render();
