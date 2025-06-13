// controllers/giftItemController.js
const GiftItem = require('../models/GiftItem');

exports.createGiftItem = async (req, res) => {
  try {
    const gift = await GiftItem.create(req.body);
    res.status(201).json(gift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGiftItems = async (req, res) => {
  try {
    const gifts = await GiftItem.find();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGiftItem = async (req, res) => {
  try {
    const gift = await GiftItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gift) return res.status(404).json({ error: 'Gift not found' });
    res.json(gift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGiftItem = async (req, res) => {
  try {
    const gift = await GiftItem.findByIdAndDelete(req.params.id);
    if (!gift) return res.status(404).json({ error: 'Gift not found' });
    res.json({ message: 'Gift deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};