import prisma from "../utils/prisma.js";

const getAllOrderCategories = async (req, res) => {
  const { date } = req.query;

  try {
    const orderCategories = await prisma.orderCategory.findMany({
      where: {
        createdAt: {
          gte: new Date(date),
          lte: new Date(Date.now()),
        },
      },
      include: {
        order: true,
      },
    });
    res.status(200).json({
      data: JSON.stringify(orderCategories),
      msg: "Get all order categories",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all order categories",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getOrderCategories = async (req, res) => {
  const {
    filter = "all",
    sortBy = "createdAt-asc",
    limit = 10,
    page = 1,
  } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const [field, direction] = sortBy.split("-");
  const wheres =
    filter !== "all"
      ? { isEnable: filter === "true" ? true : filter === "false" && false }
      : {};
  try {
    const orderCategories = await prisma.orderCategory.findMany({
      where: wheres,
      orderBy: {
        [field]: direction,
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });
    const count = await prisma.orderCategory.count();
    res.status(200).json({
      data: JSON.stringify(orderCategories),
      count,
      msg: "Get all order categories",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all order categories",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getSingleOrderCategory = async (req, res) => {
  try {
    const orderCategoryID = req.params.orderCategoryID;
    const singleOrderCategory = await prisma.orderCategory.findUnique({
      where: {
        id: orderCategoryID,
      },
    });
    res.status(200).json({
      data: JSON.stringify(singleOrderCategory),
      msg: "Get single order category",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error in getting single order category",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const createOrderCategory = async (req, res) => {
  const currUser = req.user;
  try {
    const { title, unitPrice, type, anisaPrice, minHours, maxHours } = req.body;

    const newOrderCategory = await prisma.orderCategory.create({
      data: {
        title,
        type,
        unitPrice: Number(unitPrice),
        anisaPrice: Number(anisaPrice),
        minHours: type === "hourly" ? Number(minHours) : 0,
        maxHours: Number(maxHours),
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "CREATE",
        actionText: `created an order category by ${currUser.username}`,
      },
    });

    res.status(201).json({
      data: newOrderCategory,
      msg: "Order category created successfully",
      statusCode: 201,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error in creating order category",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const updateOrderCategory = async (req, res) => {
  const currUser = req.user;
  try {
    const { orderCategoryID } = req.params;
    const { title, unitPrice, isEnable, anisaPrice, minHours, maxHours } =
      req.body;

    const updateOrderCategory = await prisma.orderCategory.update({
      where: {
        id: orderCategoryID,
      },
      data: {
        title,
        unitPrice: Number(unitPrice),
        isEnable: JSON.parse(isEnable),
        anisaPrice: Number(anisaPrice),
        minHours: Number(minHours),
        maxHours: Number(maxHours),
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "UPDATE",
        actionText: `updated an order category by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(updateOrderCategory),
      msg: "Order category updated successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error in updating order category",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const deleteOrderCategory = async (req, res) => {
  const currUser = req.user;
  try {
    const { orderCategoryID } = req.params;
    const deleteOrderCategory = await prisma.orderCategory.delete({
      where: {
        id: orderCategoryID,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "DELETE",
        actionText: `deleted an order category by ${currUser.username}`,
      },
    });
    res.status(200).json({
      data: JSON.stringify(deleteOrderCategory),
      msg: "Order category deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error deleting order category",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

export default {
  getAllOrderCategories,
  getOrderCategories,
  getSingleOrderCategory,
  createOrderCategory,
  updateOrderCategory,
  deleteOrderCategory,
};
