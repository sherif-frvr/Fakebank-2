const bcrypt = require('bcrypt');

bcrypt.hash('Appendix247$', 10).then(hash => {
  console.log(hash);
});
