const http = require("http");
const url = require("url");
const create = require("./lib/create");

const app = http.createServer((request, response) => {
  let queryData = url.parse(request.url, true).query;
  let pathName = url.parse(request.url, true).pathname;

  if (pathName === "/") {
    create.html(queryData.id).then((x) => {
      response.writeHead(200);
      response.end(x);
    });
  } else if (pathName === "/create") {
    create.form().then((formStr) => {
      create.html(undefined, "create", formStr).then((page) => {
        response.writeHead(200);
        response.end(page);
      });
    });
  } else if (pathName === "/create_process") {
    create.upload(request, response);
  } else if (pathName === "/modify") {
    create.form(queryData.id).then((formStr) => {
      create.html(undefined, "modify", formStr).then((page) => {
        response.writeHead(200);
        response.end(page);
      });
    });
  } else if (pathName === "/modify_process") {
    create.modify(request, response);
  } else if (pathName === "/delete") {
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);
