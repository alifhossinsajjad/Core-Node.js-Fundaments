const http = require("http");
const { json } = require("stream/consumers");
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "./db/todo.json");

const server = http.createServer((req, res) => {
  if (req.url == "/todos" && req.method == "GET") {
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    res.writeHead(200, {
      "content-type": "application/json",
    });
    // res.end(JSON.stringify(data));
    res.end(data);
  } else if (req.url == "/todos/create-todo" && req.method == "POST") {
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
        createdAt
       })
       
      fs.writeFileSync(filePath, JSON.stringify(parseAllTodos, null, 2), {
        encoding: "utf-8",
      });

      res.end(JSON.stringify({ title, body, createdAt }, null, 2));
    });

    // const allTodos = fs.readFileSync(filePath,{encoding : "utf-8"})

    //     res.end(JSON.stringify(allTodos));
  } else {
    res.end("Route does not founded");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server listing on 5000");
});

/*
/todos - GET ALL TODO

/todos/create-todo  POST CREATE A TODO

*/
