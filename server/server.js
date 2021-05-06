const http = require('http')
const url = require('url')
const fs = require('fs')

const hostname = '127.0.0.1'
const port = 8081;
const serverData = ["users", "comments"]
// simple version
function parseGetRequest(fileName, req, res) {

  for (item of fileName) {

    let re = new RegExp(item)
    if (req.url.match(re) !== null) {
      res.statusCode = 200
      res.setHeader("Content-Type", "application/json")

      fs.readFile(`live-chat/server/${item}.json`, (err, data) => {
        if (err) throw err
        res.end(JSON.stringify(JSON.parse(data)))
      })
      return
    }
  }
}

// db is json file
function addUserToDB(user) {
  const pathToUsers = 'live-chat/server/users.json';

  fs.readFile(pathToUsers, 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data);
      obj.users.push(user);
      json = JSON.stringify(obj);
      fs.writeFile(pathToUsers, json, (err) => {
        if(err) throw err;
      });
  }});
}
const server = http.createServer((req, res) => {

  if (req.method == 'GET') {
    parseGetRequest(serverData, req, res);
  }

  if (req.method == 'PUT') {

    if (req.url.match(/users/g) !== null) {
      let user = '';
      req.on('data', (chunk) => {
        user += chunk;
      })
      req.on('end', () => {
        addUserToDB(JSON.parse(user).name);
        res.end()
      })
    }
  }

})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
