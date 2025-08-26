const doctors = [
  { id: 1, name: "Dr. Salihu Abdulkareem", specialization: "Cardiologist" },
  { id: 2, name: "Dr. Abdulmajeed Yahya", specialization: "Pediatrician" },
  { id: 3, name: "Dr. Jamilu Adamu", specialization: "Neurologist" }
];

const doctorList = document.getElementById("doctorList");
const doctorSelect = document.getElementById("doctorSelect");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const nameInput = document.getElementById("patientName");
const dateInput = document.getElementById("appointmentDate");

let editingIndex = -1; // -1 means not editing

function renderDoctors() {
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
      <strong>${appt.name}</strong> has an appointment with 
      <strong>${appt.doctorName}</strong> 
      (<em>${appt.specialization}</em>) on <strong>${appt.date}</strong>
      <button onclick="editAppointment(${index})" class="edit-btn">✏️ Edit</button>
      <button onclick="deleteAppointment(${index})" class="delete-btn">🗑️ Delete</button>
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
    // Update
    appointments[editingIndex] = newAppointment;
    editingIndex = -1;
    appointmentForm.querySelector("button").textContent = "Book Appointment";
  } else {
    // Create
    appointments.push(newAppointment);
  }

  saveAppointments(appointments);
  renderAppointments(appointments);
  appointmentForm.reset();
});

// Initialize app
renderDoctors();
renderAppointments(getStoredAppointments());
