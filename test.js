
var bcrypt = require('bcrypt');

const saltRounds = 10;

const myPlaintextPassword = 'shandooma99';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  console.log(hash);
  bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    // res == true
    console.log(res);
  });
});
