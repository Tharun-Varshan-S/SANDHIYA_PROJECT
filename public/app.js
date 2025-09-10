const API = '/api';
const state = { token: localStorage.getItem('token'), user: JSON.parse(localStorage.getItem('user') || 'null') };

const $ = (id) => document.getElementById(id);
const authView = $('auth');
const appView = $('app');
const welcome = $('welcome');

function setAuth(token, user) {
	state.token = token;
	state.user = user;
	if (token) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
	} else {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}
	render();
}

function headers() {
	return state.token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` } : { 'Content-Type': 'application/json' };
}

async function signup() {
	const name = $('signup-name').value.trim();
	const email = $('signup-email').value.trim();
	const password = $('signup-password').value;
	if (!name || !email || !password) return alert('Fill all fields');
	const res = await fetch(`${API}/auth/signup`, { method: 'POST', headers: headers(), body: JSON.stringify({ name, email, password }) });
	const data = await res.json();
	if (!res.ok) return alert(data.message || 'Signup failed');
	setAuth(data.token, data.user);
}

async function login() {
	const email = $('login-email').value.trim();
	const password = $('login-password').value;
	const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) });
	const data = await res.json();
	if (!res.ok) return alert(data.message || 'Login failed');
	setAuth(data.token, data.user);
}

async function createEvent() {
	const title = $('ev-title').value.trim();
	const description = $('ev-desc').value.trim();
	const date = $('ev-date').value;
	if (!title || !description || !date) return alert('Provide title, description, date');
	const res = await fetch(`${API}/events`, { method: 'POST', headers: headers(), body: JSON.stringify({ title, description, date }) });
	const data = await res.json();
	if (!res.ok) return alert(data.message || 'Create failed');
	$('ev-title').value = '';
	$('ev-desc').value = '';
	$('ev-date').value = '';
	loadEvents();
}

async function registerEvent(id) {
	const res = await fetch(`${API}/events/${id}/register`, { method: 'POST', headers: headers() });
	const data = await res.json();
	if (!res.ok) return alert(data.message || 'Register failed');
	loadEvents();
}

async function unregisterEvent(id) {
	const res = await fetch(`${API}/events/${id}/unregister`, { method: 'POST', headers: headers() });
	const data = await res.json();
	if (!res.ok) return alert(data.message || 'Unregister failed');
	loadEvents();
}

function renderEvents(list) {
	const container = $('events');
	container.innerHTML = '';
	if (!list.length) {
		container.innerHTML = '<p>No upcoming events</p>';
		return;
	}
	list.forEach((ev) => {
		const isAttending = ev.attendees?.some((a) => String(a) === state.user?.id);
		const div = document.createElement('div');
		div.className = 'event';
		div.innerHTML = `
			<div class="event-main">
				<div>
					<h3>${ev.title}</h3>
					<p>${ev.description}</p>
					<small>${new Date(ev.date).toLocaleString()} • Organizer: ${ev.organizer?.name || 'Unknown'}</small>
				</div>
				<div class="event-actions">
					<button data-id="${ev._id}" data-act="${isAttending ? 'unregister' : 'register'}">${isAttending ? 'Unregister' : 'Register'}</button>
				</div>
			</div>
		`;
		container.appendChild(div);
	});
	container.querySelectorAll('button').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const id = e.target.getAttribute('data-id');
			const act = e.target.getAttribute('data-act');
			if (act === 'register') registerEvent(id);
			else unregisterEvent(id);
		});
	});
}

async function loadEvents() {
	const res = await fetch(`${API}/events`);
	const data = await res.json();
	renderEvents(data);
}

function render() {
	if (state.token) {
		authView.classList.add('hidden');
		appView.classList.remove('hidden');
		welcome.textContent = `Hello, ${state.user?.name || 'User'}`;
		loadEvents();
	} else {
		appView.classList.add('hidden');
		authView.classList.remove('hidden');
	}
}

$('btn-signup').addEventListener('click', signup);
$('btn-login').addEventListener('click', login);
$('btn-logout').addEventListener('click', () => setAuth(null, null));
$('btn-create').addEventListener('click', createEvent);

render();
