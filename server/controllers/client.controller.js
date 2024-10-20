import prisma from "../utils/prisma.js";
import { PDFDocument } from "pdf-lib";
import fromBuffer from "file-type";
import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");

    cb(null, `${Date.now()}-${fileName}`);
  },
});

const upload = multer({ storage });

const generatePdfWithImages = async (imagePaths) => {
  const pdfDoc = await PDFDocument.create();

  for (const imagePath of imagePaths) {
    const imageBuffer = fs.readFileSync(imagePath); // Read the image from the file system
    const imageType = await fromBuffer(imageBuffer);

    let image;
    if (imageType && imageType.mime === "image/png") {
      image = await pdfDoc.embedPng(imageBuffer); // Embed PNG
    } else if (
      (imageType && imageType.mime === "image/jpeg") ||
      imageType.mime === "image/jpg"
    ) {
      image = await pdfDoc.embedJpg(imageBuffer); // Embed JPEG
    } else {
      throw new Error(`Unsupported image type: ${imageType?.mime}`);
    }

    const page = pdfDoc.addPage();
    const { width, height } = image.scale(0.5); // Adjust scaling as needed
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return await pdfDoc.save(); // Return the generated PDF as bytes
};

const getClient = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt-desc",
      filterBy = "all",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [fields, dir] = sortBy.split("-");

    const whereClause = {
      ...(filterBy !== "all"
        ? filterBy === "blacklisted"
          ? { blackList: true }
          : {
              isVerified: filterBy === "verified",
              NOT: {
                blackList: true,
              },
            }
        : {
            NOT: {
              blackList: true,
            },
          }),
      ...(search
        ? search.startsWith("66f")
          ? { id: search }
          : {
              OR: [
                {
                  fullName: { contains: search, mode: "insensitive" },
                },
                {
                  phone: { contains: search, mode: "insensitive" },
                },
              ],
            }
        : {}),
    };

    const totalClients = await prisma.client.count({
      where: whereClause,
    });

    // Fetch paginated clients
    const clients = await prisma.client.findMany({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,

      where: whereClause,
      orderBy: {
        [fields]: dir,
      },
      include: {
        children: true,
        notes: true,
        address: true,
      },
    });

    res.status(200).json({
      data: JSON.stringify(clients),
      totalItems: totalClients,
      msg: "Get all clients",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "error in fetching clients",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getSingleClient = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        children: true,
        address: true,
        notes: true,
      },
    });
    res.status(200).json({
      data: JSON.stringify(client),
      msg: "Get single client by",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error in fetching single client",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const createClient = async (req, res) => {
  const {
    phone,
    fullName,
    whatsapp,
    childNote,
    orderDate,
    fromHour,
    toHour,
    whoStaysWithAnisa,
    outInHome,
    address,
  } = req.body;

  const client = await prisma.client.findUnique({
    where: {
      phone,
    },
  });
  if (client) {
    return res.status(400).json({
      msg: "this phone already exists",
      statusCode: 400,
      statusText: "FAIL",
    });
  }

  const validPhoneFormater = /^(\+20|0)?1[0125][0-9]{8}$/;

  if (!validPhoneFormater.test(phone)) {
    return res.json({
      msg: "Invalid phone formater",
      statusCode: 400,
      statusText: "FAIL",
    });
  }
  if (!validPhoneFormater.test(whatsapp)) {
    return res.json({
      msg: "Invalid whatsapp formater",
      statusCode: 400,
      statusText: "FAIL",
    });
  }

  const parsedAddress = JSON.parse(address);

  try {
    const newClient = await prisma.client.create({
      data: {
        phone,
        fullName,
        whatsapp,
        childNote,
        orderDate: new Date(orderDate),
        fromHour,
        toHour,
        whoStaysWithAnisa,
        outInHome,
        address: {
          create: parsedAddress.map((addr) => ({
            address: addr.address,
          })),
        },
        createdAt: new Date(Date.now()),
      },
      include: {
        address: true, // Include the related addresses in the response
      },
    });
    res.status(201).json({
      data: JSON.stringify(newClient),
      msg: "Create client successfully",
      statusCode: 201,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const currUser = req.user;

  const {
    phone,
    fullName,
    whatsapp,
    childNote,
    orderDate,
    fromHour,
    toHour,
    whoStaysWithAnisa,
    children,
    orders,
    address,
    outInHome,
    notes,
    mediaToRemove = [],
  } = req.body;

  const existingClient = await prisma.client.findUnique({
    where: { id },
    select: { multiMedia: true },
  });

  let multimediaUrls = existingClient.multiMedia || [];

  try {
    const parsedChildren = children ? JSON.parse(children) : [];

    const parsedAddress = address ? JSON.parse(address) : [];

    const parsedNotes = notes ? JSON.parse(notes) : [];

    // const array = [];

    const files = req.files;

    if (files && files.length > 0) {
      const basePath = `${req.protocol}://${req.get("host")}/public/images/`;

      files.forEach((file) => {
        multimediaUrls.push(`${basePath}${file.filename}`);
      });
    }

    if (mediaToRemove.length > 0) {
      multimediaUrls = multimediaUrls.filter(
        (url) => !mediaToRemove.includes(url)
      );
    }

    if (parsedNotes.length > 0) {
      await prisma.notes.deleteMany({
        where: {
          clientID: id,
          id: { notIn: parsedNotes.map((note) => note.id).filter(Boolean) },
        },
      });

      await Promise.all(
        parsedNotes.map((note) => {
          if (note.id) {
            return prisma.notes.update({
              where: { id: note.id },
              data: {
                body: note.body,
                clientID: id,
                createdAt: note.createdAt,
              },
            });
          } else {
            return prisma.notes.create({
              data: {
                body: note.body,
                clientID: id,
                createdAt: new Date(Date.now()),
              },
            });
          }
        })
      );
    }

    if (parsedAddress.length > 0) {
      await prisma.address.deleteMany({
        where: {
          clientID: id,
          id: {
            notIn: parsedAddress.map((address) => address.id).filter(Boolean),
          },
        },
      });

      await Promise.all(
        parsedAddress.map(async (address) => {
          if (address.id) {
            // Update existing address without modifying `createdAt`
            return prisma.address.update({
              where: { id: address.id },
              data: {
                address: address.address,
                clientID: id,
                createdAt: address.createdAt,
              },
            });
          } else {
            // Create new address with `createdAt`
            return prisma.address.create({
              data: {
                address: address.address,
                createdAt: new Date(Date.now()),
                clientID: id,
              },
            });
          }
        })
      );
    }

    if (parsedChildren.length > 0) {
      const childrenIdsToKeep = parsedChildren
        .map((child) => child.id)
        .filter(Boolean);
      await prisma.child.deleteMany({
        where: {
          clientID: id,
          id: { notIn: childrenIdsToKeep },
        },
      });

      await Promise.all(
        parsedChildren.map((child) => {
          if (child.id) {
            return prisma.child.upsert({
              where: { id: child.id },
              create: {
                name: child.name,
                age: child.age,
                specialChild: JSON.parse(child.specialChild),
                clientID: id,
              },
              update: {
                name: child.name,
                age: child.age,
                specialChild: JSON.parse(child.specialChild),
              },
            });
          } else {
            return prisma.child.create({
              data: {
                name: child.name,
                age: child.age,
                specialChild: child.specialChild,
                clientID: id,
              },
            });
          }
        })
      );
    }

    let pdfBytes = null;
    if (files?.length > 0 || mediaToRemove.length > 0) {
      const imagePaths = multimediaUrls.map((url) =>
        path.join(__dirname, "..", "public", "images", path.basename(url))
      );
      pdfBytes = await generatePdfWithImages(imagePaths); // Regenerate PDF with current images
    }

    const pdfPath = path.join(
      __dirname,
      "..",
      "public",
      "pdfs",
      `client_${id}_images.pdf`
    );

    if (pdfBytes) {
      fs.writeFileSync(pdfPath, pdfBytes); // Save new PDF if any images were updated
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        multiMedia: multimediaUrls,
        phone,
        fullName,
        whatsapp,
        childNote,
        orderDate: new Date(orderDate),
        fromHour,
        toHour,
        whoStaysWithAnisa,
        orders,
        outInHome,
        childrenNum: parsedChildren.length,
        pdfUrl: `${req.protocol}://${req.get(
          "host"
        )}/public/pdfs/client_${id}_images.pdf`,
      },
      include: {
        children: true,
        address: {
          select: { address: true, createdAt: false },
        },
        notes: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        clientName: updatedClient.fullName,
        actionType: "UPDATE",
        actionText: `update client by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(updatedClient),
      msg: "client updated successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ message: "Error updating client", error: error.message });
  }
};

const updateVerifyClient = async (req, res) => {
  const currUser = req.user;
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: id,
      },
      select: { fullName: true },
    });

    const updatedClient = await prisma.client.update({
      where: {
        id: id,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        clientName: client?.fullName,
        actionType: "Accept",
        actionText: `verify client by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(updatedClient),
      msg: "Verify client successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlackListClient = async (req, res) => {
  const currUser = req.user;
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: id,
      },
      select: { fullName: true },
    });

    const updatedClient = await prisma.client.update({
      where: {
        id: id,
      },
      data: {
        blackList: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        clientName: client?.fullName,
        actionType: "BlackList",
        actionText: `blacklist client by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(updatedClient),
      msg: "BlackList client successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  const currUser = req.user;
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: id,
      },
      select: { fullName: true },
    });

    await prisma.child.deleteMany({
      where: {
        clientID: id,
      },
    });

    await prisma.address.deleteMany({
      where: {
        clientID: id,
      },
    });

    await prisma.notes.deleteMany({
      where: {
        clientID: id,
      },
    });

    await prisma.client.delete({
      where: {
        id: id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        clientName: client?.fullName,
        actionType: "DELETE",
        actionText: `delete client by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(client),
      msg: "Client deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      statusCode: 500,
      statusText: "FAIL",
    });
  }
};

const deleteChild = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedChild = await prisma.child.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      data: JSON.stringify(deletedChild),
      msg: "Child deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
      statusCode: 500,
      statusText: "FAIL",
    });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await prisma.notes.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      data: JSON.stringify(deletedNote),
      msg: "Note deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
      statusCode: 500,
      statusText: "FAIL",
    });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAddress = await prisma.address.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      data: JSON.stringify(deletedAddress),
      msg: "Address deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
      statusCode: 500,
      statusText: "FAIL",
    });
  }
};

export default {
  getClient,
  getSingleClient,
  createClient,
  updateClient,
  updateVerifyClient,
  deleteClient,
  deleteChild,
  deleteNote,
  deleteAddress,
  updateBlackListClient,
  upload,
};
