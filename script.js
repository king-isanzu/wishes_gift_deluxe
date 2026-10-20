const pages = [...document.querySelectorAll('.page')];
const counter = document.getElementById('counter');
let pageIndex = 0;
const selections = { place: 'Beach', day: '', date: '', time: '16:00', iceCream: 'Chocolate' };

function showPage(index) {
  pageIndex = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((page, i) => page.classList.toggle('active', i === pageIndex));
  counter.textContent = `${String(pageIndex + 1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
  window.scrollTo({top: 0, behavior: 'smooth'});
}
document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => showPage(pageIndex + 1)));
document.getElementById('homeBtn').addEventListener('click', e => { e.preventDefault(); showPage(0); });

const audio = document.getElementById('melody');
const musicBtn = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
musicBtn.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); musicLabel.textContent = 'Pause melody'; }
    catch { musicLabel.textContent = 'Tap to play'; }
  } else { audio.pause(); musicLabel.textContent = 'Play melody'; }
});

document.getElementById('freeYes').addEventListener('click', () => {
  document.getElementById('freeFeedback').textContent = 'Yay! 💛 Let’s choose a lovely plan.';
  showPage(3);
});
document.getElementById('freeNo').addEventListener('click', e => {
  const b = e.currentTarget;
  b.classList.remove('reject'); void b.offsetWidth; b.classList.add('reject');
  document.getElementById('freeFeedback').textContent = 'Aww, this little invitation only continues with Agree 💛. You can choose another day later.';
  setTimeout(() => b.classList.remove('reject'), 400);
});

function setupOptions(containerId, key, feedbackId, nextId, nextPage, rejectValue) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      if (rejectValue && value === rejectValue) {
        document.getElementById(feedbackId).textContent = 'That choice cannot continue this treat 🍦. Please choose a flavour you would enjoy.';
        option.classList.remove('selected');
        return;
      }
      container.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      selections[key] = value;
      document.getElementById(feedbackId).textContent = `Selected: ${value} ✨`;
    });
  });
  document.getElementById(nextId).addEventListener('click', () => {
    if (rejectValue && selections[key] === rejectValue) {
      document.getElementById(feedbackId).textContent = 'Please select a flavour you like to continue.';
      return;
    }
    showPage(nextPage);
  });
}
setupOptions('placeOptions','place','placeFeedback','placeNext',4);
setupOptions('iceOptions','iceCream','iceFeedback','iceNext',6,'No ice cream');

const dateInput = document.getElementById('date');
const daySelect = document.getElementById('day');
const timeInput = document.getElementById('time');
const today = new Date();
dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
dateInput.addEventListener('change', () => {
  if (!dateInput.value) return;
  const d = new Date(`${dateInput.value}T12:00:00`);
  daySelect.value = d.toLocaleDateString('en-US', {weekday:'long'});
  updateDateSummary();
});
[daySelect,timeInput].forEach(el => el.addEventListener('change', updateDateSummary));
function updateDateSummary() {
  selections.day = daySelect.value; selections.date = dateInput.value; selections.time = timeInput.value;
  const readableDate = selections.date ? new Date(`${selections.date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : 'Choose a date';
  document.getElementById('dateSummary').textContent = `${selections.day} · ${readableDate} · ${selections.time || 'Choose a time'}`;
}
updateDateSummary();
document.getElementById('dateNext').addEventListener('click', () => {
  if (!dateInput.value || !timeInput.value) {
    document.getElementById('dateFeedback').textContent = 'Please choose a date and time first.';
    return;
  }
  const chosen = new Date(`${dateInput.value}T12:00:00`);
  const actualDay = chosen.toLocaleDateString('en-US',{weekday:'long'});
  if (actualDay !== daySelect.value) {
    document.getElementById('dateFeedback').textContent = 'The selected weekday does not match the date. Please check it.';
    return;
  }
  updateDateSummary();
  document.getElementById('dateFeedback').textContent = 'Lovely! Your plan is saved on this page. 💛';
  showPage(5);
});

document.getElementById('readyBtn').addEventListener('click', async e => {
  const button = e.currentTarget;
  button.disabled = true;
  button.textContent = 'Preparing your surprise...';
  const n = document.getElementById('countdown');
  const bar = document.getElementById('progressBar');
  for (let i=3; i>=1; i--) {
    n.textContent = i; bar.style.width = `${((4-i)/3)*100}%`;
    await new Promise(resolve => setTimeout(resolve, 650));
  }
  n.textContent = '✦'; bar.style.width = '100%';
  try { if (audio.paused) { await audio.play(); musicLabel.textContent = 'Pause melody'; } } catch {}
  await new Promise(resolve => setTimeout(resolve, 450));
  button.disabled = false; button.textContent = 'Reveal the gift ♡';
  button.onclick = () => showPage(9);
});
document.getElementById('giftBox').addEventListener('click', e => {
  const box = e.currentTarget;
  box.classList.add('open');
  document.getElementById('cakeReveal').classList.add('show');
  document.getElementById('cakeReveal').setAttribute('aria-hidden','false');
  document.getElementById('giftFeedback').textContent = 'Surprise! Your flowers, candle, and cake are here. 🎂🌸';
  document.getElementById('planResult').textContent =
    `Your little plan: ${selections.place}; ${selections.day || 'day not selected'} ${selections.date || ''} at ${selections.time || 'time not selected'}; ice cream: ${selections.iceCream}.`;
  try { if (audio.paused) { audio.play(); musicLabel.textContent = 'Pause melody'; } } catch {}
});
document.getElementById('replayBtn').addEventListener('click', () => {
  document.getElementById('giftBox').classList.remove('open');
  document.getElementById('cakeReveal').classList.remove('show');
  document.getElementById('cakeReveal').setAttribute('aria-hidden','true');
  document.getElementById('countdown').textContent = '3';
  document.getElementById('progressBar').style.width = '0';
  const ready = document.getElementById('readyBtn');
  ready.textContent = 'Open the final gift ✨';
  ready.onclick = null;
  showPage(0);
});
