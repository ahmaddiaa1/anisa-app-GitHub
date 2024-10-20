import express from 'express';
const route = express.Router();

import authController from "../controllers/auth.controller.js";
const { login } = authController;
const { createUser } = authController;
const { logout } = authController;
const { updateUser } = authController;
const { updateCancelUser } = authController;
const { getAllUsers } = authController;
const { getUser } = authController;
const { deleteUser } = authController;
const { currentUser } = authController;

import protectRouter from "../middlewares/protectRouer.js";
route.get("/users", protectRouter, getAllUsers);
route.get("/user/:id", protectRouter, getUser);
route.get("/current-user", protectRouter, currentUser);
route.post("/create-user", protectRouter, createUser);
route.put("/update/:id", protectRouter, updateUser);
route.put("/update-cancel/:id", protectRouter, updateCancelUser);
route.delete("/delete/:id", protectRouter, deleteUser);
route.post("/login", login);
route.post("/logout", logout);

export default route;
