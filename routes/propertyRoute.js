import express from 'express';
import { createProperty, getAllProperties, getProperty } from '../controllers/propertyController.js';
const router = express.Router();

router.post("", createProperty);
router.get("", getAllProperties);
router.get("/:id", getProperty);

export {router as propertyRouter};

