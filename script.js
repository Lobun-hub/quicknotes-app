const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

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
		const noteDetails = document.createElement("small");
		const deleteButton = document.createElement("button");

		noteElement.classList.add(note.category);
		noteText.textContent = note.text;
		noteDetails.textContent = `${note.category} · ${new Intl.DateTimeFormat(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(note.createdAt))}`;
		deleteButton.type = "button";
		deleteButton.textContent = "Delete";
		deleteButton.setAttribute("aria-label", `Delete note: ${note.text}`);
		deleteButton.addEventListener("click", () => {
			notes = notes.filter((currentNote) => currentNote.id !== note.id);
			render();
		});

		noteElement.append(noteText, noteDetails, deleteButton);
		noteElements.append(noteElement);
	});

	notesList.replaceChildren(noteElements);
	noteCount.textContent = searchTerm
		? `${filteredNotes.length} of ${notes.length} notes`
		: `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
}

noteForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const text = noteInput.value.trim();
	if (!text) {
		errorMessage.textContent = "Please enter a note.";
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
	noteForm.reset();
	render();
	noteInput.focus();
});

noteInput.addEventListener("input", () => {
	errorMessage.textContent = "";
});

searchInput.addEventListener("input", render);

render();
