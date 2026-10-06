const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const storageKey = "quicknotes-notes";
const validCategories = new Set(["personal", "work", "study", "ideas"]);

function loadNotes() {
	try {
		const savedNotes = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
		if (!Array.isArray(savedNotes)) {
			return [];
		}

		return savedNotes.filter((note) =>
			note
			&& typeof note.id === "string"
			&& typeof note.text === "string"
			&& typeof note.category === "string"
			&& validCategories.has(note.category)
			&& typeof note.createdAt === "string"
			&& !Number.isNaN(Date.parse(note.createdAt))
		).map((note) => note.category === "ideas"
			? { ...note, category: "study" }
			: note
		);
	} catch {
		return [];
	}
}

function saveNotes() {
	try {
		localStorage.setItem(storageKey, JSON.stringify(notes));
		return true;
	} catch {
		errorMessage.textContent = "Your notes could not be saved in this browser.";
		return false;
	}
}

let notes = loadNotes();

noteForm.noValidate = true;

function render() {
	const searchTerm = searchInput.value.trim().toLocaleLowerCase();
	const filteredNotes = notes.filter((note) =>
		note.text.toLocaleLowerCase().includes(searchTerm)
		|| note.category.toLocaleLowerCase().includes(searchTerm)
	);
	const noteElements = document.createDocumentFragment();

	filteredNotes.forEach((note) => {
		const noteElement = document.createElement("li");
		const noteText = document.createElement("p");
		const categoryLabel = document.createElement("small");
		const createdAt = document.createElement("time");
		const deleteButton = document.createElement("button");

		noteElement.classList.add(`category-${note.category}`);
		noteText.textContent = note.text;
		categoryLabel.className = "note-category-label";
		categoryLabel.textContent = note.category[0].toUpperCase() + note.category.slice(1);
		const noteDate = new Date(note.createdAt);
		createdAt.dateTime = noteDate.toISOString();
		createdAt.textContent = new Intl.DateTimeFormat(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(noteDate);
		deleteButton.type = "button";
		deleteButton.textContent = "Delete";
		deleteButton.setAttribute("aria-label", `Delete note: ${note.text}`);
		deleteButton.addEventListener("click", () => {
			notes = notes.filter((currentNote) => currentNote.id !== note.id);
			saveNotes();
			render();
		});

		noteElement.append(noteText, categoryLabel, createdAt, deleteButton);
		noteElements.append(noteElement);
	});

	notesList.replaceChildren(noteElements);
	noteCount.textContent = `${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`;
}

noteForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = noteInput.value.trim();
	if (!text) {
		errorMessage.textContent = "Please enter a note.";
		noteInput.focus();
		return;
	}
	if (text.length > 200) {
		errorMessage.textContent = "Notes must be 200 characters or fewer.";
		noteInput.focus();
		return;
	}

	notes.push({
		id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
		text,
		category: noteCategory.value,
		createdAt: new Date().toISOString(),
	});

	errorMessage.textContent = "";
	saveNotes();
	noteForm.reset();
	render();
	noteInput.focus();
});

noteInput.addEventListener("input", () => {
	errorMessage.textContent = "";
});

searchInput.addEventListener("input", render);

render();
