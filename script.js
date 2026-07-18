const STORAGE_KEYS = {
  contacts: 'sahayContacts',
  reminders: 'sahayReminders',
  theme: 'sahayTheme'
};

let deferredPrompt = null;

const defaultContacts = [
  { id: 1, name: 'Priya', role: 'Caregiver', phone: '98765 43210' },
  { id: 2, name: 'Dr. Kumar', role: 'Doctor', phone: '98765 00000' },
  { id: 3, name: 'Ravi', role: 'Neighbor', phone: '91234 56789' }
];

const defaultReminders = [
  { id: 1, title: 'Medicine', time: '8:00 AM', note: 'After breakfast' },
  { id: 2, title: 'Doctor call', time: '3:00 PM', note: 'Confirm appointment' },
  { id: 3, title: 'Water check', time: '6:00 PM', note: 'Stay hydrated' }
];

const loadState = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
};

const saveState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const state = {
  contacts: loadState(STORAGE_KEYS.contacts, defaultContacts),
  reminders: loadState(STORAGE_KEYS.reminders, defaultReminders)
};

const themeBtn = document.getElementById('themeBtn');
const installBtn = document.getElementById('installBtn');
const sosBtn = document.getElementById('sosBtn');
const statusPanel = document.getElementById('statusPanel');
const liveStatus = document.getElementById('liveStatus');
const actionCards = document.querySelectorAll('.action-card');
const contactList = document.getElementById('contactList');
const contactCount = document.getElementById('contactCount');
const contactForm = document.getElementById('contactForm');
const reminderList = document.getElementById('reminderList');
const reminderCount = document.getElementById('reminderCount');
const reminderForm = document.getElementById('reminderForm');
const careSummary = document.getElementById('careSummary');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const chatMessages = document.getElementById('chatMessages');

const updateTheme = () => {
  const isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
};

const toggleTheme = () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  updateTheme();
};

const setStatus = (title, message) => {
  statusPanel.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
};

const renderContacts = () => {
  contactList.innerHTML = '';
  contactCount.textContent = `${state.contacts.length} active`;
  if (state.contacts.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No contacts added yet.';
    contactList.appendChild(empty);
    return;
  }
  state.contacts.forEach((contact) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${contact.name}</strong><br />${contact.role} • ${contact.phone}`;
    contactList.appendChild(item);
  });
};

const renderReminders = () => {
  reminderList.innerHTML = '';
  reminderCount.textContent = `${state.reminders.length} items`;
  if (state.reminders.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No reminders added yet.';
    reminderList.appendChild(empty);
    return;
  }
  state.reminders.forEach((reminder) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${reminder.title}</strong><br />${reminder.time} • ${reminder.note}`;
    reminderList.appendChild(item);
  });
};

const renderSummary = () => {
  careSummary.innerHTML = `
    <div class="stat">
      <strong>${state.contacts.length}</strong>
      <span>Care contacts</span>
    </div>
    <div class="stat">
      <strong>${state.reminders.length}</strong>
      <span>Active reminders</span>
    </div>
  `;
};

const addChatBubble = (role, text) => {
  const bubble = document.createElement('div');
  bubble.className = `msg ${role}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.style.display = 'inline-flex';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});

const respondToAssistant = (input) => {
  const value = input.trim().toLowerCase();
  if (!value) return 'Please ask me a question.';

  if (/(sos|emergency|help|danger|call)/i.test(value)) {
    sosBtn.click();
    return 'I triggered the emergency support flow. Your care circle is being notified.';
  }

  if (/(dark|light|theme)/i.test(value)) {
    toggleTheme();
    return 'Theme updated.';
  }

  if (/(contact|caregiver|who can help)/i.test(value)) {
    const names = state.contacts.map((contact) => contact.name).join(', ');
    return `Your care circle includes: ${names}.`;
  }

  if (/(reminder|medicine|appointment|today)/i.test(value)) {
    const list = state.reminders.map((reminder) => `${reminder.title} at ${reminder.time}`).join(', ');
    return `Here are your reminders: ${list}.`;
  }

  if (/(summary|status|how am i)/i.test(value)) {
    return `You currently have ${state.contacts.length} contacts and ${state.reminders.length} reminders.`;
  }

  if (/(hello|hi|thanks|thank you)/i.test(value)) {
    return 'Hello! I am Sahay AI. I can help with reminders, contacts, or emergency support.';
  }

  return 'I can help you with reminders, contacts, emergency support, or changing the theme.';
};

if (localStorage.getItem(STORAGE_KEYS.theme) === 'dark') {
  document.body.classList.add('dark');
}
updateTheme();
renderContacts();
renderReminders();
renderSummary();
setStatus('System status', 'All services are running normally.');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const role = document.getElementById('contactRole').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  if (!name || !role || !phone) return;

  state.contacts.push({ id: Date.now(), name, role, phone });
  saveState(STORAGE_KEYS.contacts, state.contacts);
  renderContacts();
  renderSummary();
  contactForm.reset();
  setStatus('Contact added', `${name} is now in your care circle.`);
});

reminderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('reminderTitle').value.trim();
  const time = document.getElementById('reminderTime').value.trim();
  const note = document.getElementById('reminderNote').value.trim();
  if (!title || !time) return;

  state.reminders.push({ id: Date.now(), title, time, note: note || 'No note' });
  saveState(STORAGE_KEYS.reminders, state.reminders);
  renderReminders();
  renderSummary();
  reminderForm.reset();
  setStatus('Reminder added', `${title} has been scheduled for ${time}.`);
});

themeBtn.addEventListener('click', toggleTheme);

sosBtn.addEventListener('click', () => {
  liveStatus.textContent = 'Emergency alert sent';
  setStatus('Emergency alert sent', 'Your caregiver has been notified and help is on the way.');
  sosBtn.textContent = 'Alert sent';
  setTimeout(() => {
    sosBtn.textContent = 'SOS';
    liveStatus.textContent = 'Live support ready';
  }, 1800);
});

actionCards.forEach((card) => {
  card.addEventListener('click', () => {
    actionCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');

    const target = card.dataset.target;
    const panel = document.getElementById(target);
    if (panel) {
      const title = panel.querySelector('h3')?.textContent || 'Section';
      setStatus(title, 'Opened for quick access.');
    }
  });
});

assistantForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = assistantInput.value.trim();
  if (!text) return;
  addChatBubble('user', text);
  const reply = respondToAssistant(text);
  addChatBubble('bot', reply);
  assistantInput.value = '';
});
