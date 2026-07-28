const http = require("http");
const { json } = require("stream/consumers");
const path = require("path");
const fs = require("fs");
const { URL } = require("url");


const filePath = path.join(__dirname, "./db/todo.json");

// Utility function to calculate Levenshtein Distance for Typo Tolerance
// This is a senior-level algorithm used to catch spelling mistakes
function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Utility function to find a todo index by title (Exact, Partial, or Fuzzy match)
function findTodoIndexByTitle(todos, title) {
  if (!title) return -1;

  const searchTitle = title.toLowerCase().trim();
  // If user only types "learn", don't return any data
  if (searchTitle === "learn") return -1;

  // 1. Try Exact/Partial Match First
  let index = todos.findIndex((t) => t.title.toLowerCase().includes(searchTitle));

  // 2. Fallback to Fuzzy Search (Typo Tolerance)
  if (index === -1) {
    index = todos.findIndex((t) => {
      const titleWords = t.title.toLowerCase().split(/\s+/);
      const searchWords = searchTitle.split(/\s+/);

      return searchWords.some((sWord) => {
        if (sWord === "learn") return false;
        return titleWords.some((tWord) => {
          const distance = getEditDistance(sWord, tWord);
          const maxTypos = Math.floor(tWord.length / 2) + 1;
          return distance <= maxTypos;
        });
      });
    });
  }
  return index;
}

const server = http.createServer((req, res) => {


  const url = new URL(req.url, `http://${req.headers.host}`)

  const pathName = url.pathname

  // console.log(url , "url");
  // console.log(req.url, req.method);


  if (pathName === "/todos" && req.method == "GET") {
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });

    res.writeHead(200, {
      "content-type": "application/json",
    });
    // res.end(JSON.stringify(data));
    res.end(data);
  } else if (pathName === "/todos/create-todo" && req.method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });
    req.on("end", () => {
      const { title, body } = JSON.parse(data);
      console.log({ title, body });

      const createdAt = new Date().toLocaleTimeString();
      const allTodos = fs.readFileSync(filePath, { encoding: "utf-8" });

      const parseAllTodos = JSON.parse(allTodos);

      parseAllTodos.push({
        title,
        body,
        createdAt,
      });

      fs.writeFileSync(filePath, JSON.stringify(parseAllTodos, null, 2), {
        encoding: "utf-8",
      });

      res.end(JSON.stringify({ title, body, createdAt }, null, 2));
    });

    // const allTodos = fs.readFileSync(filePath,{encoding : "utf-8"})

    //     res.end(JSON.stringify(allTodos));
  } else if (pathName === "/todo" && req.method == "GET") {
    const title = url.searchParams.get("title");

    const data = fs.readFileSync(filePath, { encoding: "utf-8" });

    const parsedData = JSON.parse(data);

    const todoIndex = findTodoIndexByTitle(parsedData, title);
    const todo = todoIndex !== -1 ? parsedData[todoIndex] : null;

    const stringifyTodo = JSON.stringify(todo, null, 2);

    res.writeHead(200, {
      "content-type": "application/json",
    });
    if (todo) {
      return res.end(stringifyTodo);
    }
    else {
      return res.end(JSON.stringify({ message: "Todo not found" }));
    }
  }
  else if (pathName === "/todos/update-todo" && req.method == "PATCH") {

    const title = url.searchParams.get("title")

    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });
    req.on("end", () => {
      const { body } = JSON.parse(data);
      console.log({ title, body });


      const allTodos = fs.readFileSync(filePath, { encoding: "utf-8" });

      const parseAllTodos = JSON.parse(allTodos);

      const todoIndex = findTodoIndexByTitle(parseAllTodos, title);

      if (todoIndex === -1) {
        return res.end(JSON.stringify({ message: "Todo not found" }));
      }

      parseAllTodos[todoIndex].body = body;


      fs.writeFileSync(filePath, JSON.stringify(parseAllTodos, null, 2), {
        encoding: "utf-8",
      });

      res.end(JSON.stringify({ title, body, createdAt: parseAllTodos[todoIndex].createdAt }, null, 2));
    });

    // const allTodos = fs.readFileSync(filePath,{encoding : "utf-8"})

    //     res.end(JSON.stringify(allTodos));
  }
  else if (pathName === "/todos/delete-todo" && req.method === "DELETE") {
    const title = url.searchParams.get("title");

    const allTodos = fs.readFileSync(filePath, { encoding: "utf-8" });
    const parseAllTodos = JSON.parse(allTodos);

    const todoIndex = findTodoIndexByTitle(parseAllTodos, title);

    if (todoIndex === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Todo not found" }));
    }

    // Delete the todo
    const deletedTodo = parseAllTodos.splice(todoIndex, 1)[0];

    fs.writeFileSync(filePath, JSON.stringify(parseAllTodos, null, 2), {
      encoding: "utf-8",
    });

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Todo deleted successfully", deletedTodo }, null, 2));
  }
  else {
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server listing on 5000");
});

/*
/todos - GET ALL TODO

/todos/create-todo  POST CREATE A TODO

*/
