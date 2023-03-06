const mongoose = require('mongoose');

const mongoDBConnection = async () => {
  mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

}
module.exports = mongoDBConnection;