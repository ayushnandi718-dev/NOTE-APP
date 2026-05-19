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


// ===== IMAGE PREVIEW =====
if (noteImage && imagePreview) {

    noteImage.addEventListener('change', () => {

        const file = noteImage.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {

            currentImage = reader.result;
            imagePreview.src = currentImage;
            imagePreview.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

}


// ===== OPEN DIALOG =====
function openNoteDialog() {

    editingId = null;
    currentImage = null;

    dialogTitle.textContent = "Add New Note";

    noteForm.reset();

    if (imagePreview) {
        imagePreview.style.display = "none";
    }

    noteDialog.showModal();

}


// ===== CLOSE DIALOG =====
function closeNoteDialog() {

    noteDialog.close();

    noteForm.reset();

    editingId = null;
    currentImage = null;

    if (imagePreview) {
        imagePreview.style.display = "none";
    }

}


// ===== SAVE NOTE =====
noteForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) return;


    // EDIT
    if (editingId !== null) {

        notes = notes.map(note =>

            note.id === editingId
                ? {
                    ...note,
                    title,
                    content,
                    image: currentImage || note.image,
                    updatedAt: new Date().toLocaleString()
                }

                : note
        );

    }

    // NEW NOTE
    else {

        const newNote = {

            id: Date.now(),

            title,
            content,

            image: currentImage,

            createdAt: new Date().toLocaleString(),

            updatedAt: null,

            color: getRandomColor()

        };

        notes.unshift(newNote);

    }

    saveAndRender();

    closeNoteDialog();

});


// ===== DELETE NOTE =====
function deleteNote(id) {

    if (confirm('Delete this note?')) {

        notes = notes.filter(
            note => note.id !== id
        );

        saveAndRender();

    }

}


// ===== EDIT NOTE =====
function editNote(id) {

    const note =
        notes.find(
            note => note.id === id
        );

    if (!note) return;


    editingId = id;

    currentImage =
        note.image || null;


    dialogTitle.textContent =
        "Edit Note";

    noteTitle.value =
        note.title;

    noteContent.value =
        note.content;


    if (imagePreview) {

        if (note.image) {

            imagePreview.src =
                note.image;

            imagePreview.style.display =
                "block";

        }

        else {

            imagePreview.style.display =
                "none";

        }

    }

    noteDialog.showModal();

}


// ===== RENDER =====
function renderNotes() {

    notesContainer.innerHTML = "";


    if (notes.length === 0) {

        notesContainer.innerHTML = `

        <div class="empty-state">

        <p>
        📝 No notes yet... Add one!
        </p>

        </div>

        `;

        return;

    }


    notes.forEach(note => {

        const card =
            document.createElement('div');

        card.classList.add(
            'note-card'
        );

        card.style.setProperty(
            '--card-color',
            note.color
        );


        card.innerHTML = `

        ${note.image
            ? `<img src="${note.image}" class="note-img">`
            : ''
        }

        <h3>
        ${escapeHTML(note.title)}
        </h3>

        <p>
        ${escapeHTML(note.content)}
        </p>

        <div class="note-meta">

        <span>

        ${note.updatedAt
            ? '✏️ ' + note.updatedAt
            : '🕒 ' + note.createdAt}

        </span>

        </div>

        <div class="note-actions">

        <button
        class="edit-btn"
        onclick="editNote(${note.id})">

        ✏️ Edit

        </button>


        <button
        class="delete-btn"
        onclick="deleteNote(${note.id})">

        🗑️ Delete

        </button>

        </div>

        `;

        notesContainer.appendChild(
            card
        );

    });

}


// ===== SAVE =====
function saveAndRender() {

    localStorage.setItem(
        'notes',
        JSON.stringify(notes)
    );

    renderNotes();

}


// ===== THEME =====
function initTheme() {

    const savedTheme =
        localStorage.getItem(
            'theme'
        );

    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            'light'
        );

        themeToggleBtn.textContent =
            "🌙";

    }

    else {

        themeToggleBtn.textContent =
            "☀️";

    }

}


if (themeToggleBtn) {

themeToggleBtn.addEventListener(
'click',
() => {

document.body.classList.toggle(
'light'
);

const isLight =
document.body.classList.contains(
'light'
);

if(isLight){

themeToggleBtn.textContent='🌙';

localStorage.setItem(
'theme',
'light'
);

}

else{

themeToggleBtn.textContent='☀️';

localStorage.setItem(
'theme',
'dark'
);

}

});

}


// ===== CLOSE DIALOG =====
if (noteDialog) {

noteDialog.addEventListener(
'click',
(e)=>{

if(
e.target===noteDialog
){

closeNoteDialog();

}

});

}


// ===== HELPERS =====
function getRandomColor() {

const colors=[

'#FF6B6B',
'#4ECDC4',
'#FFE66D',
'#A8E6CF',
'#FF8B94',
'#B5EAD7'

];

return colors[
Math.floor(
Math.random()*
colors.length
)
];

}


function escapeHTML(str){

return str
.replace(/&/g,'&amp;')
.replace(/</g,'&lt;')
.replace(/>/g,'&gt;')
.replace(/"/g,'&quot;');

}


// ===== GLOBAL ACCESS =====
window.openNoteDialog=openNoteDialog;
window.closeNoteDialog=closeNoteDialog;
window.editNote=editNote;
window.deleteNote=deleteNote;


// ===== INIT =====
initTheme();
renderNotes();
