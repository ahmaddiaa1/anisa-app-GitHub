import prisma from "../utils/prisma.js";
const getAllOrders = async (req, res) => {
  const { date } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(date),
          lte: new Date(Date.now()),
        },
      },
      include: {
        orderCategory: true,
      },
    });

    const orderCount = await prisma.order.count();

    res.status(200).json({
      data: JSON.stringify(orders),
      count: orderCount,
      msg: "Get all orders",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all orders",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  const {
    filter = "all",
    sortBy = "createdAt-desc",
    page = 1,
    limit = 10,
    search,
  } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const [fields, dir] = sortBy.split("-");

  const whereClause = {
    ...(filter !== "all" ? { orderStatus: filter } : {}),
    ...(search
      ? search.startsWith("66f")
        ? { OR: [{ client: { id: search } }, { anisa: { id: search } }] }
        : {
            OR: [
              {
                orderCategory: {
                  title: { contains: search, mode: "insensitive" },
                },
              },

              {
                client: {
                  fullName: { contains: search, mode: "insensitive" },
                },
              },
              {
                anisa: {
                  fullName: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
      : {}),
  };
  try {
    const count = await prisma.order.count({
      where: whereClause,
    });

    const orders = await prisma.order.findMany({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      where: whereClause,
      orderBy: { [fields]: dir || "desc" },
      include: {
        orderCategory: {
          include: {
            anisaPrice: false,
            isEnable: false,
          },
        },
        client: {
          select: {
            id: true,
            phone: true,
            pdfUrl: true,
            fullName: true,
            whatsapp: true,
            childNote: true,
            multiMedia: true,
            childrenNum: true,
          },
        },
        anisa: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            whatsapp: true,
            email: true,
            facebookEmail: true,
            graduateOrStudent: true,
            EducationQualification: true,
            maritalStatus: true,
            otherMaritalStatus: true,
            multiMedia: true,
            pdfUrl: true,
          },
        },
      },
    });
    res.status(200).json({
      data: JSON.stringify(orders),
      count,
      msg: "Get all orders",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all orders",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        child: true,
        orderCategory: {
          include: {
            anisaPrice: false,
            isEnable: false,
          },
        },
        client: {
          select: {
            id: true,
            phone: true,
            pdfUrl: true,
            fullName: true,
            whatsapp: true,
            childNote: true,
            multiMedia: true,
            childrenNum: true,
          },
        },
        anisa: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            whatsapp: true,
            email: true,
            facebookEmail: true,
            graduateOrStudent: true,
            EducationQualification: true,
            maritalStatus: true,
            otherMaritalStatus: true,
            multiMedia: true,
            pdfUrl: true,
          },
        },
        notes: true,
      },
    });
    res.status(200).json({
      data: JSON.stringify(order),
      msg: "Get single order",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching single order",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getOrderOptionsss = async (req, res) => {
  try {
    const orderCategory = await prisma.orderCategory.findMany({
      where: {
        isEnable: true,
      },
      select: {
        id: true,
        title: true,
        type: true,
        maxHours: true,
      },
    });
    const client = await prisma.client.findMany({
      select: {
        fullName: true,
        id: true,
        children: true,
      },
    });
    const anisa = await prisma.anisa.findMany({
      select: {
        fullName: true,
        anisaStatus: true,
        id: true,
      },
    });
    res.status(200).json({
      orderCategory: JSON.stringify(orderCategory),
      client: JSON.stringify(client),
      anisa: JSON.stringify(anisa),
      msg: "Get order options",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching order options",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getRandomDateFromLast3Months = () => {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const timeDifference = now.getTime() - threeMonthsAgo.getTime();
  const randomTime = Math.random() * timeDifference;
  const randomDate = new Date(threeMonthsAgo.getTime() + randomTime);
  return randomDate.toISOString();
};

const createOrder = async (req, res) => {
  const currUser = req.user;
  const {
    orderCategoryID,
    clientID,
    anisaID,
    childID,
    startDate,
    endDate,
    orderHours,
    doneHours,
    payedAmount,
    notes,
    location,
    whoStaysWithAnisa,
  } = req.body;

  try {
    // Fetch necessary records
    const orderCategory = await prisma.orderCategory.findUnique({
      where: { id: orderCategoryID },
    });
    const children = await prisma.child.findUnique({
      where: { id: childID },
    });
    const client = await prisma.client.findUnique({
      where: { id: clientID },
    });
    const anisaExists = await prisma.anisa.findUnique({
      where: { id: anisaID },
    });
    const clientParents = await prisma.client.findUnique({
      where: {
        id: clientID,
        children: {
          some: {
            id: childID,
          },
        },
      },
    });
    // Validation checks
    if (!orderCategory) {
      return res.status(400).json({
        msg: "Invalid or unavailable order category",
        statusCode: 400,
        statusText: "FAIL",
      });
    }
    if (!client) {
      return res.status(404).json({
        msg: "Invalid customer",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
    if (!anisaExists) {
      return res.status(404).json({
        msg: "Invalid Anisa",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
    if (!children) {
      return res.status(404).json({
        msg: "Invalid Child",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
    if (!clientParents) {
      return res.status(404).json({
        msg: "Invalid relationship between client and child",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
    if (!orderCategory.isEnable) {
      return res.status(400).json({
        msg: "This order category is not available",
        statusCode: 400,
        statusText: "FAIL",
      });
    }
    if (
      orderCategory.type === "hourly" &&
      (orderHours > orderCategory.maxHours ||
        orderHours < orderCategory.minHours)
    ) {
      return res.status(400).json({
        msg: `order hours should be between ${orderCategory.minHours} and ${orderCategory.maxHours} hours`,
        statusCode: 400,
        statusText: "FAIL",
      });
    }
    const hourOrderPrice =
      orderCategory.unitPrice *
      (orderCategory.type === "hourly"
        ? Number(orderHours)
        : orderCategory.maxHours);
    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderHours:
          orderCategory.type === "hourly"
            ? Number(orderHours)
            : orderCategory.maxHours,
        orderPrice:
          orderCategory.type === "hourly"
            ? hourOrderPrice
            : orderCategory.unitPrice,
        doneHours,
        payedAmount,
        whoStaysWithAnisa,
        remainingHours:
          orderCategory.type === "hourly"
            ? Number(orderHours)
            : orderCategory.maxHours,
        remainingAmount:
          (orderCategory.type === "hourly"
            ? hourOrderPrice
            : orderCategory.unitPrice) - (payedAmount ?? 0),
        anisaOrderPrice:
          orderCategory.type === "hourly"
            ? orderCategory.anisaPrice * orderHours
            : orderCategory.anisaPrice,
        profit:
          orderCategory.type === "hourly"
            ? orderCategory.unitPrice * orderHours -
              orderCategory.anisaPrice * orderHours
            : orderCategory.unitPrice - orderCategory.anisaPrice,
        finalPrice:
          orderCategory.type === "hourly"
            ? orderCategory.unitPrice * orderHours -
              orderCategory.anisaPrice * orderHours
            : orderCategory.unitPrice - orderCategory.anisaPrice,
        location,
        createdByID: currUser.id,
        createdByName: currUser.username,
        createdAt: getRandomDateFromLast3Months(),
        notes: {
          createMany: {
            data: notes.map((note) => ({
              body: note.body,
            })),
          },
        },
        child: {
          connect: {
            id: childID,
          },
        },
        orderCategory: {
          connect: {
            id: orderCategoryID,
          },
        },
        client: {
          connect: {
            id: clientID,
          },
        },
        anisa: {
          connect: {
            id: anisaID,
          },
        },
      },
      include: {
        profit: false,
        child: {
          select: {
            name: true,
            age: true,
          },
        },
        orderCategory: {
          include: {
            anisaPrice: false,
            isEnable: false,
          },
        },
        client: {
          select: {
            id: true,
            phone: true,
            pdfUrl: true,
            fullName: true,
            whatsapp: true,
            childNote: true,
            multiMedia: true,
            childrenNum: true,
          },
        },
        anisa: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            whatsapp: true,
            email: true,
            facebookEmail: true,
            graduateOrStudent: true,
            EducationQualification: true,
            maritalStatus: true,
            otherMaritalStatus: true,
            multiMedia: true,
            pdfUrl: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        orderID: newOrder.id,
        actionType: "CREATE",
        actionText: `Created order by ${currUser.username}`,
      },
    });

    // Successful response
    res.status(201).json({
      data: newOrder,
      msg: "Order created successfully",
      statusCode: 201,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error in creating order",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  const currUser = req.user;
  const orderId = req.params.id;
  const {
    anisaID,
    startDate,
    endDate,
    doneHours,
    payedAmount,
    finalPrice,
    location,
    notes,
  } = req.body;

  const anisa = await prisma.anisa.findUnique({
    where: {
      id: anisaID,
    },
  });
  if (!anisa) {
    return res.status(404).json({
      msg: "Anisa not found",
      statusCode: 404,
      statusText: "FAIL",
    });
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderCategory: true,
      client: true,
      anisa: true,
    },
  });
  if (!order) {
    return res.status(404).json({
      msg: "Order not found",
      statusCode: 404,
      statusText: "FAIL",
    });
  }

  if (payedAmount > order.orderPrice) {
    return res.status(400).json({
      msg: "Payed amount must be less than the order price",
      statusCode: 400,
      statusText: "FAIL",
    });
  }
  if (doneHours > order.orderHours) {
    return res.status(400).json({
      msg: "Done hours must be less than the order hours",
      statusCode: 400,
      statusText: "FAIL",
    });
  }

  try {
    if (notes.length > 0) {
      await prisma.notes.deleteMany({
        where: {
          orderID: orderId,
          id: { notIn: notes.map((note) => note.id).filter(Boolean) },
        },
      });

      await Promise.all(
        notes.map((note) => {
          if (note.id) {
            return prisma.notes.update({
              where: { id: note.id },
              data: {
                body: note.body,
                orderID: orderId,
                createdAt: note.createdAt,
              },
            });
          } else {
            return prisma.notes.create({
              data: {
                body: note.body,
                orderID: orderId,
                createdAt: new Date(Date.now()),
              },
            });
          }
        })
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        doneHours: Number(doneHours),
        payedAmount: Number(payedAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        remainingHours: order.orderHours - doneHours,
        remainingAmount: order.orderPrice - payedAmount,
        finalPrice: Number(finalPrice),
        location,

        anisa: {
          disconnect: {
            id: order.anisaID,
          },
        },
        anisa: {
          connect: {
            id: anisaID,
          },
        },
      },
      include: {
        orderCategory: {
          include: {
            anisaPrice: false,
            isEnable: false,
          },
        },
        client: {
          select: {
            id: true,
            phone: true,
            pdfUrl: true,
            fullName: true,
            whatsapp: true,
            childNote: true,
            multiMedia: true,
            childrenNum: true,
          },
        },
        anisa: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            whatsapp: true,
            email: true,
            facebookEmail: true,
            graduateOrStudent: true,
            EducationQualification: true,
            maritalStatus: true,
            otherMaritalStatus: true,
            multiMedia: true,
            pdfUrl: true,
          },
        },
        notes: true,
      },
    });
    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        orderID: orderId,
        actionType: "UPDATE",
        actionText: `updated order by ${req.user.username}`,
      },
    });
    res.status(200).json({
      data: JSON.stringify(updatedOrder),
      msg: "Order updated successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2003") {
      res.status(500).json({
        msg: "Invalid customerID or employeeID: Related record",
        statusCode: 500,
        statusText: "FAIL",
        error: error.message,
      });
    }
  }
};

const orderDone = async (req, res) => {
  const orderId = req.params.id;
  const currUser = req.user;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderCategory: true,
        client: true,
        anisa: true,
      },
    });
    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
        statusCode: 404,
        statusText: "FAIL",
      });
    }

    if (order.payedAmount === 0) {
      return res.status(400).json({
        msg: "Payed amount must be greater than 0",
        statusCode: 400,
        statusText: "FAIL",
      });
    }

    const AP =
      order.orderCategory.type === "hourly"
        ? order.orderCategory.anisaPrice * order.orderHours
        : order.orderCategory.anisaPrice;
    const statusUpdate = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "done",
      },
    });
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        anisaOrderPrice:
          statusUpdate.orderStatus === "done"
            ? order.orderPrice > order.payedAmount
              ? AP - (order.orderPrice - order.payedAmount)
              : AP
            : AP,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        orderID: orderId,
        actionType: "UPDATE",
        actionText: `${req.user.username} has end the order`,
      },
    });
    res.status(200).json({
      data: JSON.stringify(updatedOrder),
      msg: "Order Ended",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in ending order",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};
const acceptOrder = async (req, res) => {
  const orderId = req.params.id;
  const currUser = req.user;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
        statusCode: 404,
        statusText: "FAIL",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "accepted",
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        orderID: orderId,
        actionType: "UPDATE",
        actionText: `${req.user.username} has accepted the order`,
      },
    });
    res.status(200).json({
      data: JSON.stringify(updatedOrder),
      msg: "Order Accepted",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "error in accepting order",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};
const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const currUser = req.user;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
        statusCode: 404,
        statusText: "FAIL",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "canceled",
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        orderID: orderId,
        actionType: "UPDATE",
        actionText: `${req.user.username} has cancelled the order`,
      },
    });
    res.status(200).json({
      data: JSON.stringify(updatedOrder),
      msg: "Order cancelled",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "error in cancelling order",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const payOrder = async (req, res) => {
  const anisaID = req.params.id;
  const { orderID, type } = req.body;
  const currUser = req.user;
  try {
    if (type === "all") {
      const payAllOrders = await prisma.order.updateMany({
        where: {
          anisaID: anisaID,
          hasAnisaBeenPaid: false,
        },
        data: {
          hasAnisaBeenPaid: true,
        },
      });
      const allOrders = await prisma.order.findMany({
        where: {
          anisaID: anisaID,
          hasAnisaBeenPaid: false,
        },
      });

      allOrders.map(
        async (order) =>
          await prisma.auditLog.create({
            data: {
              userID: currUser.id,
              orderID: order.id,
              actionType: "UPDATE",
              actionText: `updated order by ${req.user.username}`,
            },
          })
      );
      await prisma.auditLog.create({
        data: {
          userID: currUser.id,
          orderID: orderID,
          actionType: "UPDATE",
          actionText: `updated order by ${req.user.username}`,
        },
      });
      res.status(200).json({
        data: JSON.stringify(payAllOrders),
        msg: "Anisa Paid successfully",
        statusCode: 200,
        statusText: "SUCCESS",
      });
    } else {
      const order = await prisma.order.findUnique({
        where: {
          id: orderID,
        },
        include: {
          orderCategory: true,
          client: true,
          anisa: true,
        },
      });
      if (!order) {
        return res.status(404).json({
          msg: "Order not found",
          statusCode: 404,
          statusText: "FAIL",
        });
      }
      const paySingleOrder = await prisma.order.update({
        where: {
          id: orderID,
        },
        data: {
          hasAnisaBeenPaid: true,
        },
      });
      await prisma.auditLog.create({
        data: {
          userID: currUser.id,
          orderID: orderID,
          actionType: "UPDATE",
          actionText: `updated order by ${req.user.username}`,
        },
      });
      res.status(200).json({
        data: JSON.stringify(paySingleOrder),
        msg: "Anisa Paid successfully",
        statusCode: 200,
        statusText: "SUCCESS",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error in pay Anisa Money",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

export default {
  getAllOrders,
  getOrders,
  getSingleOrder,
  getOrderOptionsss,
  createOrder,
  updateOrder,
  payOrder,
  orderDone,
  acceptOrder,
  cancelOrder,
};
