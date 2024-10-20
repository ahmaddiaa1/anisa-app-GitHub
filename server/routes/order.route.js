import express from 'express';
const route = express.Router();

import orderController from "../controllers/order.controller.js";
const { getOrders } = orderController;
const { getSingleOrder } = orderController;
const { getOrderOptionsss } = orderController;
const { createOrder } = orderController;
const { updateOrder } = orderController;
const { getAllOrders } = orderController;
const { orderDone } = orderController;
const { acceptOrder } = orderController;
const { cancelOrder } = orderController;
const { payOrder } = orderController;

import protectRouter from "../middlewares/protectRouer.js";
route.get("/all", protectRouter, getAllOrders);
route.get("/", protectRouter, getOrders);
route.get("/options", protectRouter, getOrderOptionsss);
route.get("/:id", protectRouter, getSingleOrder);
route.post("/", protectRouter, createOrder);
route.put("/:id", protectRouter, updateOrder);
route.put("/pay/:id", protectRouter, payOrder);

route.put("/done/:id", protectRouter, orderDone);
route.put("/accept/:id", protectRouter, acceptOrder);
route.put("/cancel/:id", protectRouter, cancelOrder);

export default route;
