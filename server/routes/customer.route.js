import express from 'express';
const route = express.Router();


import clientController from "../controllers/client.controller.js";
const { getClient } = clientController;
const { getSingleClient } = clientController;
const { createClient } = clientController;
const { updateClient } = clientController;
const { updateVerifyClient } = clientController;
const { deleteClient } = clientController;
const { deleteChild } = clientController;
const { deleteNote } = clientController;
const { deleteAddress } = clientController;
const { updateBlackListClient } = clientController;
const { upload } = clientController;

import protectRouter from "../middlewares/protectRouer.js";

route.get("/", protectRouter, getClient);
route.get("/:id", protectRouter, getSingleClient);
route.post("/create", upload.none(), createClient);
route.put("/:id", protectRouter, upload.array("image", 10), updateClient);
route.put("/verify/:id", protectRouter, updateVerifyClient);
route.put("/blacklist/:id", protectRouter, updateBlackListClient);
route.delete("/:id", protectRouter, deleteClient);
route.delete("/child/:id", protectRouter, deleteChild);
route.delete("/note/:id", protectRouter, deleteNote);
route.delete("/address/:id", protectRouter, deleteAddress);

export default route;
