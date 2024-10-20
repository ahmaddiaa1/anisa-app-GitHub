import express from 'express';
const route = express.Router();

import auditLogController from "../controllers/auditLog.controller.js";

const { getAuditLogs } = auditLogController;
const { getAllAuditLogs } = auditLogController;


import protectRouter from "../middlewares/protectRouer.js";


route.get("/all", protectRouter, getAllAuditLogs);
route.get("/", protectRouter, getAuditLogs);

export default route;
