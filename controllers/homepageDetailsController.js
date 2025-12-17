const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const HomepageDetail = require('../models/HomepageDetail');

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
    const items = await HomepageDetail.find().sort({ createdAt: -1 });
    res.json(
      items.map((d) => ({
        id: d._id,
        imagePath: d.imagePath,
        headerTitle: d.headerTitle,
        headerDesc: d.headerDesc,
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

    const { headerTitle, headerDesc } = req.body;

    const imagePath = `/uploads/homepage/${req.file.filename}`;

    const created = await HomepageDetail.create({
      imagePath,
      headerTitle,
      headerDesc
    });

    res.status(201).json({
      id: created._id,
      imagePath: created.imagePath,
      headerTitle: created.headerTitle,
      headerDesc: created.headerDesc,
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

    const { headerTitle, headerDesc } = req.body;

    const existing = await HomepageDetail.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Homepage detail not found' });
    }

    const updateDoc = {
      headerTitle,
      headerDesc
    };

    if (req.file) {
      updateDoc.imagePath = `/uploads/homepage/${req.file.filename}`;
    }

    const updated = await HomepageDetail.findByIdAndUpdate(req.params.id, updateDoc, {
      new: true,
      runValidators: true
    });

    if (req.file) {
      await deleteFileIfExists(existing.imagePath);
    }

    res.json({
      id: updated._id,
      imagePath: updated.imagePath,
      headerTitle: updated.headerTitle,
      headerDesc: updated.headerDesc,
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
    const deleted = await HomepageDetail.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Homepage detail not found' });
    }

    await deleteFileIfExists(deleted.imagePath);

    res.json({ message: 'Homepage detail deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
