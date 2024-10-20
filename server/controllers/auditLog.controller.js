import prisma from "../utils/prisma.js";
const removeNullFields = (log, fieldsToRemove) => {
  fieldsToRemove.forEach((field) => {
    if (log[field] === null) {
      delete log[field]; // Remove the field if it's null
    }
  });
  return log;
};

const getAllAuditLogs = async (req, res) => {
  const currUser = req.user;

  if (currUser.role === "moderator") {
    return res.status(403).json({
      msg: "You are not authorized to view audit logs",
      statusCode: 403,
      statusText: "FAIL",
    });
  }

  try {
    const totalLogs = await prisma.auditLog.count();

    const auditLogs = await prisma.auditLog.findMany();

    const fieldsToRemove = [
      "orderID",
      "customerName",
      "employeeName",
      "userName",
    ]; // Add other fields as needed

    // Loop through each log and remove null fields
    const modifiedLogs = auditLogs.map((log) =>
      removeNullFields(log, fieldsToRemove)
    );

    res.status(200).json({
      data: JSON.stringify(modifiedLogs),
      totalItems: totalLogs,
      msg: "Get all audit logs",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all audit logs",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getAuditLogs = async (req, res) => {
  const currUser = req.user;
  const { page = 1, limit = 10, actionType, sortBy } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (currUser.role === "moderator") {
    return res.status(403).json({
      msg: "You are not authorized to view audit logs",
      statusCode: 403,
      statusText: "FAIL",
    });
  }

  const [fields, dir] = sortBy?.split("-") || ["createdAt", "desc"];
  try {
    const whereClause = actionType !== "all" ? { actionType } : {};

    const totalLogs = await prisma.auditLog.count({
      where: whereClause,
    });

    const auditLogs = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: {
        [fields]: dir,
      },
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
    });

    // Specify which fields to remove if null
    const fieldsToRemove = [
      "orderID",
      "customerName",
      "employeeName",
      "userName",
    ]; // Add other fields as needed

    // Loop through each log and remove null fields
    const modifiedLogs = auditLogs.map((log) =>
      removeNullFields(log, fieldsToRemove)
    );

    res.status(200).json({
      data: JSON.stringify(modifiedLogs),
      totalItems: totalLogs,
      msg: "Get all audit logs",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all audit logs",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

export default {
  getAuditLogs,
  getAllAuditLogs,
};
