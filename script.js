// ===== SELECTORS =====
const notesContainer = document.getElementById('notesContainer');
const noteDialog = document.getElementById('noteDialog');
const noteForm = document.getElementById('noteForm');
const dialogTitle = document.getElementById('dialogTitle');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const noteImage = document.getElementById('noteImage');
const imagePreview = document.getElementById('imagePreview');

// ===== STATE =====
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingId = null;
let currentImage = null;

// ===== SAFE IMAGE HANDLER =====
if (noteImage && imagePreview) {

noteImage.addEventListener('change', () => {

const file = noteImage.files[0];

if(file){

const reader = new FileReader();

reader.onload = function(){

currentImage = reader.result;
imagePreview.src = currentImage;
imagePreview.style.display = 'block';

};

reader.readAsDataURL(file);

}

});

}
