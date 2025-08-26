const doctors = [
  { id: 1, name: "Dr. Son Believer", specialization: "Cardiologist" },
  { id: 2, name: "Dr. Young Scientist", specialization: "Pediatrician" },
  { id: 3, name: "Dr.Jamilu Adamu", specialization: "Neurologist" }
];

const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const doctorList = document.getElementById("doctorList");
const doctorSelect = document.getElementById("doctorSelect");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const nameInput = document.getElementById("patientName");
const dateInput = document.getElementById("appointmentDate");

let editingIndex = -1;

const USERS = {
  "admin": "admin123",
  "doctor": "doctor123"
};

// Store users in localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Show registration screen
function showRegister() {
  loginScreen.style.display = "none";
  registerScreen.style.display = "block";
}

// Show login screen
function showLogin() {
  registerScreen.style.display = "none";
  loginScreen.style.display = "block";
}

const registerForm = document.getElementById("registerForm");
const registerScreen = document.getElementById("registerScreen");
const registerError = document.getElementById("registerError");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;

  const users = getUsers();

  const exists = users.find(u => u.username === username);
  if (exists) {
    registerError.textContent = "Username already exists.";
    return;
  }

  users.push({ username, password, role });
  saveUsers(users);

  registerError.textContent = "";
  alert("Account created! You can now log in.");
  registerForm.reset();
  showLogin();
});



// Handle login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    loginScreen.style.display = "none";
    dashboard.style.display = "block";
    renderDoctors();
    renderAppointments(getStoredAppointments());
  } else {
    loginError.textContent = "Invalid username or password.";
  }
});


logoutBtn.addEventListener("click", () => {
  dashboard.style.display = "none";
  loginScreen.style.display = "block";
});

// Appointments Logic
function renderDoctors() {
  doctorList.innerHTML = "";
  doctorSelect.innerHTML = `<option value="">Select a Doctor</option>`;
  doctors.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.name} - ${doc.specialization}`;
    doctorList.appendChild(li);

    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = doc.name;
    doctorSelect.appendChild(option);
  });
}

function getStoredAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(appointments) {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

function renderAppointments(appointments) {
  appointmentList.innerHTML = '';
  appointments.forEach((appt, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${appt.name}</strong> - ${appt.doctorName} 
      (${appt.specialization}) on <strong>${appt.date}</strong>
      <button onclick="editAppointment(${index})" class="edit-btn">✏️</button>
      <button onclick="deleteAppointment(${index})" class="delete-btn">🗑️</button>
    `;
    appointmentList.appendChild(li);
  });
}

function deleteAppointment(index) {
  const appointments = getStoredAppointments();
  appointments.splice(index, 1);
  saveAppointments(appointments);
  renderAppointments(appointments);
}

function editAppointment(index) {
  const appointments = getStoredAppointments();
  const appt = appointments[index];

  nameInput.value = appt.name;
  dateInput.value = appt.date;
  const doctor = doctors.find(d => d.name === appt.doctorName);
  doctorSelect.value = doctor ? doctor.id : "";

  editingIndex = index;
  appointmentForm.querySelector("button").textContent = "Update Appointment";
}

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const date = dateInput.value;
  const doctorId = parseInt(doctorSelect.value);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  if (!selectedDoctor) return;

  const newAppointment = {
    name,
    date,
    doctorName: selectedDoctor.name,
    specialization: selectedDoctor.specialization
  };

  const appointments = getStoredAppointments();

  if (editingIndex > -1) {
    appointments[editingIndex] = newAppointment;
    editingIndex = -1;
    appointmentForm.querySelector("button").textContent = "Book Appointment";
  } else {
    appointments.push(newAppointment);
  }

  saveAppointments(appointments);
  renderAppointments(appointments);
  appointmentForm.reset();
});





