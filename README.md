# Quick Notes

A lightweight browser-based note-taking app. Create notes, organize them by category, search their text, and keep them saved in your browser.

## Features

- Add notes in the Personal, Work, or Study category.
- Search note text without case sensitivity.
- Delete one note or clear all notes after confirmation.
- Store notes in browser local storage between visits.
- Validate empty notes and notes longer than 200 characters.

## Run the app

Open `index.html` in a modern web browser. No installation or build step is required.

## What I learned

- Semantic HTML and correctly associated labels make forms easier to use.
- Flexbox and media queries help keep a form usable across screen sizes.
- Rendering user input with `textContent` avoids treating note text as HTML.
- `localStorage` can preserve structured data between browser sessions.

## Project files

- `index.html` contains the page structure and form.
- `style.css` contains the responsive layout and note styles.
- `script.js` handles validation, note rendering, search, and local storage.
- `README.md` contains this project guide.
