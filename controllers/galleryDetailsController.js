const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const GalleryDetail = require('../models/GalleryDetail');

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
    const items = await GalleryDetail.find().sort({ createdAt: -1 });
    res.json(
      items.map((d) => ({
        id: d._id,
        title: d.title,
        description: d.description,
        imagePaths: d.imagePaths,
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image file is required' });
    }

    const { title, description } = req.body;

    const imagePaths = req.files.map((f) => `/uploads/gallery/${f.filename}`);

    const created = await GalleryDetail.create({
      title,
      description,
      imagePaths
    });

    res.status(201).json({
      id: created._id,
      title: created.title,
      description: created.description,
      imagePaths: created.imagePaths,
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

    const existing = await GalleryDetail.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Gallery detail not found' });
    }

    const updateDoc = {
      title,
      description
    };

    const hasNewFiles = !!(req.files && req.files.length > 0);
    if (hasNewFiles) {
      updateDoc.imagePaths = req.files.map((f) => `/uploads/gallery/${f.filename}`);
    }

    const updated = await GalleryDetail.findByIdAndUpdate(req.params.id, updateDoc, {
      new: true,
      runValidators: true
    });

    if (hasNewFiles) {
      await Promise.all((existing.imagePaths || []).map((p) => deleteFileIfExists(p)));
    }

    res.json({
      id: updated._id,
      title: updated.title,
      description: updated.description,
      imagePaths: updated.imagePaths,
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
    const deleted = await GalleryDetail.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Gallery detail not found' });
    }

    await Promise.all((deleted.imagePaths || []).map((p) => deleteFileIfExists(p)));

    res.json({ message: 'Gallery detail deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
