const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const AhvalDetail = require('../models/AhvalDetail');

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

exports.list = async (req, res) => {
  try {
    const items = await AhvalDetail.find().sort({ createdAt: -1 });
    res.json(
      items.map((d) => ({
        id: d._id,
        imagePath: d.imagePath,
        title: d.title,
        description: d.description,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const { title, description } = req.body;

    const imagePath = `/uploads/ahval/${req.file.filename}`;

    const created = await AhvalDetail.create({
      imagePath,
      title,
      description
    });

    res.status(201).json({
      id: created._id,
      imagePath: created.imagePath,
      title: created.title,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const existing = await AhvalDetail.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Ahval detail not found' });
    }

    const updateDoc = {
      title,
      description
    };

    if (req.file) {
      updateDoc.imagePath = `/uploads/ahval/${req.file.filename}`;
    }

    const updated = await AhvalDetail.findByIdAndUpdate(req.params.id, updateDoc, {
      new: true,
      runValidators: true
    });

    if (req.file) {
      await deleteFileIfExists(existing.imagePath);
    }

    res.json({
      id: updated._id,
      imagePath: updated.imagePath,
      title: updated.title,
      description: updated.description,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await AhvalDetail.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Ahval detail not found' });
    }

    await deleteFileIfExists(deleted.imagePath);

    res.json({ message: 'Ahval detail deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
