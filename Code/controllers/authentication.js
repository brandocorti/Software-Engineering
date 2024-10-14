const utente = require("../models/utente");
const jwt = require('jsonwebtoken');


// DONE, Swagger DONE
const login = async function(req, res){
  let user = await utente.findOne({ mail : req.body.mail}).exec()

  if(!user){
      return res.status(400).json({success: false, message : 'Mail non corretta!'})
  }

  if(user.password != req.body.password){
      return res.status(400).json({success: false, message : 'Password non corretta!'})
  }

  var payload = {mail: user.mail, utente_id: user.utente_id};
  var options = {expiresIn: 23200};
  var tkn = jwt.sign(payload, 'EasyLib', options);
  return res.status(200).json({success: true, message : 'Welcome on your account, ' + user.mail + '!', token: tkn, mail: user.mail,  nome: user.nome, cognome: user.cognome})
}

// DONE, Swagger DONE
const logout = function(req, res) {
  var tkn = req.headers['x-access-token'];
  if (tkn){
      var payload = {};
      var options = {expiresIn: 5};
      var tkn = jwt.sign(payload, 'EasyLib', options);
      //dai al loggedUser il nuovo token!
      return res.status(200).json({success: true, message: "You logged out!"});
  } else {
      return res.status(400).json({success: false, message: "You alreayd logged out!"});
  }
}


module.exports = {
  login,
  logout
};