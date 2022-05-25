const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://19521754:Q12345678@ie213.4tqss.mongodb.net/FashionShop?retryWrites=true&w=majority'
    ),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    };
    console.log('Connect successfully!!!');
  } catch (error) {
    console.log('Connect failure!!!', error);
  }
}

module.exports = { connect };
