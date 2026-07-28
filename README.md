# Core Node.js Fundamentals 🚀

Welcome to the **Core Node.js Fundamentals** repository! This project serves as a comprehensive playground and documentation for mastering the inner workings of Node.js. 

Instead of relying on third-party frameworks like Express.js, this repository focuses purely on **Core Node.js Modules** to deeply understand how things work under the hood—a true mark of a Senior Developer mindset.

---

## 📂 Repository Structure & Topics Covered

This repository is divided into several modules and mini-projects, each focusing on a core concept of Node.js:

### 1. Module Systems & Scopes
- **IIFE (Immediately Invoked Function Expressions)**: Demonstrating how Node.js wraps modules using the IIFE pattern to maintain private scope (`iife.js`).
- **CommonJS**: Traditional Node.js `require()` and `module.exports` syntax (`file1.js`, `utils/`).
- **ES Modules**: Modern `import`/`export` syntax (`esm/`).

### 2. Event-Driven Architecture (Event Loop)
- **Event Emitter (`module2/event.js`)**: Demonstrating Node's event-driven nature. Examples include custom event creation, emitting, and listening (e.g., `ring`, `broken`). This is the foundation of understanding how the **Node.js Event Loop** manages asynchronous tasks.
- **Asynchronous File System (`module2/fs.js`)**: Handling non-blocking I/O operations using the `fs` module without blocking the main thread.

### 3. Mini-Projects
- **Logger App (`module2/logger-app`)**: A utility application to demonstrate writing and managing logs using streams and file systems.
- **ToDo REST API (`ToDo-App/`)**: The flagship project of this repository (Detailed below).

---

## 🏆 Flagship Project: ToDo REST API

A robust, dependency-free RESTful ToDo API built entirely from scratch. This project demonstrates advanced backend engineering concepts, including custom request routing, file-system-based persistence, and a custom **Fuzzy Search Algorithm**.

### 🌟 Key Features
- **Zero Dependencies**: Built using only `http`, `fs`, `path`, and `url`.
- **File-Based Database**: Uses `fs` to persist data in a JSON file (`ToDo-App/db/todo.json`), mimicking a real database.
- **Advanced Typo Tolerance (Levenshtein Distance)**: Implements a custom fuzzy search algorithm. If a user searches for `kafaka` instead of `kafka`, the system intelligently finds the closest match!
- **DRY Principle**: Modularized search logic abstracted into a highly reusable utility function.

### 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:alifhossinsajjad/Core-Node.js-Fundaments.git
   ```
2. Navigate to the ToDo App directory:
   ```bash
   cd "Core-Node.js-Fundaments/ToDo-App"
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *The server will start running on `http://127.0.0.1:5000`*

---

## 📡 API Reference

### 1. Get All ToDos
- **Endpoint**: `GET /todos`
- **Description**: Fetches all the ToDo items from the database.
- **Response**: Array of ToDo objects.

### 2. Get Single ToDo (Typo Tolerant)
- **Endpoint**: `GET /todo?title=<todo_title>`
- **Description**: Fetches a single ToDo. Supports exact match, partial match, and fuzzy search (tolerates spelling mistakes like `kafaka` for `kafka`).
- **Response**: Single ToDo JSON object.

### 3. Create a ToDo
- **Endpoint**: `POST /todos/create-todo`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
      "title": "Learn Node.js",
      "body": "Understand the event loop and core modules."
  }
  ```
- **Description**: Creates a new ToDo and persists it to the JSON file.

### 4. Update a ToDo
- **Endpoint**: `PATCH /todos/update-todo?title=<todo_title>`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
      "body": "Updated content for this ToDo."
  }
  ```
- **Description**: Updates the body of a specific ToDo. Utilizes fuzzy search to find the target.

### 5. Delete a ToDo
- **Endpoint**: `DELETE /todos/delete-todo?title=<todo_title>`
- **Description**: Removes a ToDo from the database using fuzzy search.
- **Response**: Returns the deleted ToDo object upon success.

---

## 🧠 Technical Highlights (Senior Dev Mindset)

### 1. Custom Typo Tolerance
Instead of relying on strict string matching (`===`), the ToDo API provides a graceful fallback mechanism. If an exact match fails, it calculates the **edit distance** (Levenshtein Distance) between words to find the intended target. This ensures excellent User Experience (UX) and prevents frustrating `404 Not Found` errors due to minor spelling mistakes.

### 2. DRY (Don't Repeat Yourself)
The fuzzy matching logic is abstracted into a clean `findTodoIndexByTitle` helper function, which is reused across `GET`, `PATCH`, and `DELETE` routes. This drastically reduces code duplication and improves maintainability.

### 3. Deep Understanding of the Event Loop
By building custom Event Emitters and handling asynchronous `fs` read/write operations without blocking the main thread, this repository proves a deep, fundamental understanding of the Node.js V8 Engine and Libuv (Event Loop).
