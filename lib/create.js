const mysql = require("mysql");
const qs = require("querystring");
const { EROFS } = require("constants");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "opentutorials",
});

db.connect();

//html SET
exports.html = (id, title = "nodeJs", content = "nodeJs is ...") => {
  return new Promise((resolve, reject) => {
    db.query(`select * from topic`, (err, topics) => {
      if (err) throw new Error("1번에러 : " + err);
      let btnStr = `<a href="/create">Create</a>`;
      //title , id, btns SET
      if (id !== undefined) {
        btnStr += ` 
        <a href="/modify?id=${id}" style="margin-left : 5px;">modify</a>
        <a href="/delete?id=${id}" style="margin-left : 5px;">delete</a>
        `;
        topics.forEach((x) => {
          if (x.id == id) {
            title = x.title;
            content = x.description;
          }
        });
      }

      //fList SET
      let fList = "";
      topics.forEach(
        (x) => (fList += `<li><a href="/?id=${x.id}">${x.title}</a></li>`)
      );

      resolve(`
              <!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <title>${title}</title>
                    </head>
                    <body>
                      <section>
                        <h1>${title}</h1>
                        <ul>
                          ${fList}
                        </ul>
                        <div id="btnArea">
                          ${btnStr}
                        </div>
                        <div id="contentArea">
                          ${content}
                        </div>
                      </section>
                    </body>
                  </html>        
              `);
    });
  });
};

//업로드, 수정 폼만들기
exports.form = (id = "") => {
  return new Promise((resolve) => {
    if (id === "") {
      var formStr = makeFormPartial();
      resolve(formStr);
    } else {
      getContents(id).then((formStr) => resolve(formStr));
    }
  });
};

//업로드 DB
exports.upload = (request, response) => {
  let getData = "";
  request.on("data", (data) => (getData += data));
  request.on("end", () => {
    let post = qs.parse(getData);
    db.query(
      `INSERT INTO topic(title,description,created,author_id) VALUES(?,?,Now(),1)`,
      [post.title, post.content],
      (err, results) => {
        if (err) throw new Error(err);
        response.writeHead(302, { Location: `/?id=${results.insertId}` });
        response.end("Success");
      }
    );
  });
};

//수정 DB
exports.modify = (request, response) => {
  let getData = "";
  request.on("data", (data) => (getData += data));
  request.on("end", () => {
    let post = qs.parse(getData);
    db.query(
      `UPDATE topic SET title=?,description=?,created=now() WHERE id=?`,
      [post.title, post.content, post.id],
      (err, results) => {
        if (err) throw new Error(err);
        response.writeHead(302, { Location: `/?id=${results.insertId}` });
        response.end("Success");
      }
    );
  });
};

//업로드시 form Str Make Function
function makeFormPartial(id = "", title = "", content = "") {
  let actionStr = "/create_process";
  if (id !== "") actionStr = "/modify_process";
  return `
    <style>
    #uploadArea {
        width : 400px;
        border : 1px solid grey;
        padding : 6px 10px;
        text-align : center;
    }
        #uploadArea > input{
            width : 100%;
            margin-bottom : 3px;
        }
        #uploadArea > textarea {
            width : 100%;
            height : 300px;
            margin-bottom : 3px;
        }
    </style>
        <form id="uploadArea" action="${actionStr}" method="post">
            <input type="hidden" name="id" value="${id}"/>
            <input type="text" name="title" value="${title}"/>
            <textarea name="content">${content}</textarea>
            <input type="submit" value="${id === "" ? "create" : "modify"}" />
        </form>
    `;
}

//수정시 inner Data Get
function getContents(id) {
  return new Promise((resolve) => {
    db.query(`SELECT * FROM topic WHERE id=?`, [id], (err, results) => {
      if (err) throw new Error(err);
      let formStr = makeFormPartial(
        id,
        results[0].title,
        results[0].description
      );
      resolve(formStr);
    });
  });
}
