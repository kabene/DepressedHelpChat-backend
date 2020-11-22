"strict mode";
const FILE_PATH = __dirname + "/../data/users.json";

class User {
  constructor(username) {
    this.username = username;
  }

  /* return a promise with async / await */
  async save() {
    let user = this.username;
    console.log("save:", this.username);
    saveUserToFile(FILE_PATH, user);
    return true;
  }

  static getUserConnected() {
    let user = getUserFromFile(FILE_PATH);
    return user;
  }

  static isTheUserConnected(username) {
    const userFound = User.getUserConnected();
    return userFound == username;
  }

}
function getUserFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return null;
  let userData = fs.readFileSync(filePath);
  let user;
  if (userData) user = JSON.parse(userData);
  else user = null;
  return user;
}

function saveUserToFile(filePath, user) {
  const fs = require("fs");
  let data = JSON.stringify(user);
  fs.writeFileSync(filePath, data);
}


module.exports = User;
