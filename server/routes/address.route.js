import express from 'express';
const route = express.Router();

import addressController from '../controllers/address.controller.js';
const { getAddress } = addressController;
const { createAddress } = addressController;
const { deleteAddress } = addressController;

import protectRouter  from "../middlewares/protectRouer.js";
import anisaController from "../controllers/anisa.controller.js";

route.get('/', getAddress);
route.post('/', protectRouter, createAddress);
route.delete('/:id', deleteAddress);

export default route;