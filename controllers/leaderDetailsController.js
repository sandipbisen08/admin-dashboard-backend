const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const LeaderDetail = require('../models/LeaderDetail');

const deleteFileIfExists = async (filePath) => {
  if (!filePath) return;

  const normalized = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const abs = path.join(__dirname, '..', normalized);

  try {
    await fs.promises.unlink(abs);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to delete file:', abs, err.message);
    }
  }
};

const toDto = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id,
    role: doc.role,
    imagePath: doc.imagePath,
    name: doc.name,
    description: doc.description,
    phone: doc.phone,
    email: doc.email,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

exports.getByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const doc = await LeaderDetail.findOne({ role });
    if (!doc) return res.json(null);
    res.json(toDto(doc));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.upsertByRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.params;
    const { name, description, phone, email } = req.body;

    const existing = await LeaderDetail.findOne({ role });

    const updateDoc = {
      role,
      name,
      description,
      phone,
      email
    };

    if (req.file) {
      updateDoc.imagePath = `/uploads/leaders/${req.file.filename}`;
    }

    // If creating new and no file -> error
    if (!existing && !req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const updated = await LeaderDetail.findOneAndUpdate(
      { role },
      updateDoc,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    if (existing && req.file) {
      await deleteFileIfExists(existing.imagePath);
    }

    res.json(toDto(updated));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.removeByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const deleted = await LeaderDetail.findOneAndDelete({ role });
    if (!deleted) {
      return res.status(404).json({ message: 'Leader detail not found' });
    }

    await deleteFileIfExists(deleted.imagePath);

    res.json({ message: 'Leader detail deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
