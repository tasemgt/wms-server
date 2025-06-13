require('dotenv').config();
const mongoose = require('mongoose');
const GiftItem = require('./models/GiftItem'); // Adjust path if needed
const giftItems = require('./data/gifts.json');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await GiftItem.deleteMany({});
    await GiftItem.insertMany(giftItems);

    console.log('Gift items seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding gift items:', error);
    process.exit(1);
  }
};

seed();