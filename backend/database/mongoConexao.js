const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ Erro na conexão com MongoDB:'));
db.once('open', () => {
  console.log('✅ Conectado ao MongoDB com Mongoose');
});

module.exports = mongoose;
