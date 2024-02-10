const fs = require('fs');
const { resolve } = require('path');

function credentials(service) {
  const data = fs.readFileSync(resolve(__dirname, 'credentials.json'), 'utf8');
  const credentials = JSON.parse(data);
  
  if (credentials.hasOwnProperty(service)) {
    return credentials[service];
  } else {
    return null;
  }
}

module.exports = credentials;