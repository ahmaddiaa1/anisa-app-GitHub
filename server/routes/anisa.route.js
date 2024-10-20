import express from 'express';
const route = express.Router();

import anisaController from '../controllers/anisa.controller.js';
const { getAnisas } = anisaController;
const { getSingleAnisa } = anisaController;
const { createAnisa } = anisaController;
const { updateAnisa } = anisaController;
const { verifyAnisa } = anisaController;
const { updateBlackListAnisa } = anisaController;
const { getNotPaidAnisas } = anisaController;
const { deleteAnisa } = anisaController;
const { upload } = anisaController;

import protectRouter from "../middlewares/protectRouer.js";
getNotPaidAnisas;
route.get("/", protectRouter, getAnisas);
route.get("/paid", protectRouter, getNotPaidAnisas);
route.get("/:anisaID", protectRouter, getSingleAnisa);
route.post("/create", protectRouter, createAnisa);
route.put("/:anisaID", protectRouter, upload.array("image", 10), updateAnisa);
route.put("/verify/:anisaID", protectRouter, verifyAnisa);
route.put("/blacklist/:anisaID", protectRouter, updateBlackListAnisa);

route.delete("/:anisaID", protectRouter, deleteAnisa);

export default route;
