import express from 'express';
const route = express.Router();

import orderCategoryController from '../controllers/orderCategory.controller.js';
const { getAllOrderCategories } = orderCategoryController;
const { getOrderCategories } = orderCategoryController;
const { getSingleOrderCategory } = orderCategoryController;
const { createOrderCategory } = orderCategoryController;
const { updateOrderCategory } = orderCategoryController;
const { deleteOrderCategory } = orderCategoryController;

import protectRouter from "../middlewares/protectRouer.js";

route.get("/all", protectRouter, getAllOrderCategories);
route.get("/", protectRouter, getOrderCategories);
route.get("/:orderCategoryID", protectRouter, getSingleOrderCategory);
route.post("/", protectRouter, createOrderCategory);
route.put("/:orderCategoryID", protectRouter, updateOrderCategory);
route.delete("/:orderCategoryID", protectRouter, deleteOrderCategory);

export default route;
