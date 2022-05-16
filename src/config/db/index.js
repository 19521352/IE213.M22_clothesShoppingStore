const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://dat78910:dat78910@19521352-ie213m12.dxetg.mongodb.net/fashionShop?retryWrites=true&w=majority',
    ),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    console.log('Connect successfully!!!');
  } catch (error) {
    console.log('Connect failure!!!', error);
  }
}

module.exports = { connect };
