const jwt = require('jsonwebtoken')




// Função para validação de email

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Funções para jsonwebtoken



module.exports = { isValidEmail };
