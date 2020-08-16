const http = require("http");
const url = require("url");

const app = http
  .createServer((request, response) => {
    let queryData = url.parse(request.url, true).query;
    let pathName = url.parse(request.url, true).pathname;

    if (pathName === "/") {
      let template = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>NodeJs Test</title>
          </head>
          <body>
            <section>
              <h1>NodeJs</h1>
              <ul>
                <li>Html</li>
                <li>Css</li>
                <li>Script</li>
              </ul>
              <div id="btnArea">
                <a href="/create">Create</a>
              </div>
              <div id="contentArea">
                nodeJs is ... 
              </div>
            </section>
          </body>
        </html>        
        `;

      response.writeHead(200);
      response.end(template);
    }
  })
  .listen(3000);
