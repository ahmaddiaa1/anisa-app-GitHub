import prisma from "../utils/prisma.js";
import { PDFDocument } from "pdf-lib";
import  fromBuffer  from "file-type";
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

const getNotPaidAnisas = async (req, res) => {
  try {
    const anisa = await prisma.anisa.findMany({
      where: {
        orders: {
          some: {
            hasAnisaBeenPaid: false,
          },
        },
      },
      include: {
        orders: {
          include: {
            client: true,
          },
        },
      },
    });

    res.status(200).json({
      data: JSON.stringify(anisa),
      msg: "Get all anisas",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error in fetching all anisas",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const getAnisas = async (req, res) => {
  const { search, page = 1, limit = 10, sortBy, filterBy = "all" } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const [fields, dir] = sortBy ? sortBy.split("-") : ["createdAt-desc"];

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

  const totalAnisas = await prisma.anisa.count({
    where: whereClause,
  });
  try {
    const anisas = await prisma.anisa.findMany({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      where: whereClause,
      orderBy: {
        [fields]: dir,
      },
      include: {
        password: false,
        orders: true,
      },
    });

    res.status(200).json({
      data: JSON.stringify(anisas, totalAnisas),
      msg: "get all Anisas",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "error in fetching all anisa s",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const getSingleAnisa = async (req, res) => {
  try {
    const anisaID = req.params.anisaID;
    const singleAnisa = await prisma.anisa.findUnique({
      where: {
        id: anisaID,
      },
      include: {
        password: false,
        address: true,
        orders: true,
      },
    });

    if (singleAnisa) {
      res.status(200).json({
        data: JSON.stringify(singleAnisa),
        msg: "get single Anisa ",
        statusCode: 200,
        statusText: "SUCCESS",
      });
    } else {
      res.status(404).json({
        msg: "Anisa not found",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "error in fetching single anisa s",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const createAnisa = async (req, res) => {
  const currUser = req.user;
  const {
    fullName,
    phone,
    whatsapp,
    email,
    facebookEmail,
    EducationQualification,
    maritalStatus,
    otherMaritalStatus,
    graduateOrStudent,
    courses,
    experience,
    books,
    devotedHours,
    WhyAnisa,
    skills,
    whatAnisaOffers,
    learnWithUs,
    anisaPerceptionOfMother,
    address,
  } = req.body;

  const validPhoneFormater = /^(\+20|0)?1[0125][0-9]{8}$/;
  const validEmailFormater = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (!validEmailFormater.test(email)) {
    return res.json({
      msg: "Invalid phone formater",
      statusCode: 400,
      statusText: "FAIL",
    });
  }

  try {
    const newAnisa = await prisma.anisa.create({
      data: {
        fullName,
        phone,
        whatsapp,
        email,
        facebookEmail,
        EducationQualification,
        maritalStatus,
        otherMaritalStatus,
        graduateOrStudent,
        courses,
        experience,
        books,
        devotedHours,
        WhyAnisa,
        skills,
        whatAnisaOffers,
        learnWithUs: Boolean(learnWithUs),
        anisaPerceptionOfMother,
        address: {
          create: address.map((addr) => ({
            ...addr,
          })),
        },
      },
      include: {
        address: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "CREATE",
        actionText: `Added anisa with name ${newAnisa.fullName} by ${currUser.username}`,
      },
    });

    res.status(201).json({
      data: JSON.stringify(newAnisa),
      msg: "Anisa  created successfully",
      statusCode: 201,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error in creating Anisa ",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

const updateAnisa = async (req, res) => {
  const currUser = req.user;
  const { anisaID } = req.params;
  const files = req.files;

  const {
    address,
    fullName,
    phone,
    whatsapp,
    email,
    facebookEmail,
    EducationQualification,
    maritalStatus,
    otherMaritalStatus,
    graduateOrStudent,
    courses,
    experience,
    books,
    devotedHours,
    WhyAnisa,
    skills,
    whatAnisaOffers,
    learnWithUs,
    anisaPerceptionOfMother,
    isVerified,
    anisaStatus,
    mediaToRemove = [],
  } = req.body;

  // const parsedAddress = address ? JSON.parse(address) : [];

  const validPhoneFormater = /^(\+20|0)?1[0125][0-9]{8}$/;
  const validEmailFormater = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const parsedAddress = address ? JSON.parse(address) : [];

  try {
    const anisa = await prisma.anisa.findUnique({
      where: {
        id: anisaID,
      },
      select: {
        multiMedia: true,
        address: true,
        fullName: true,
      },
    });

    let multimediaUrls = anisa.multiMedia || [];

    if (phone && !validPhoneFormater.test(phone)) {
      return res.status(400).json({
        msg: "Invalid phone formate",
        statusCode: 400,
        statusText: "FAIL",
      });
    }
    if (whatsapp && !validPhoneFormater.test(whatsapp)) {
      return res.status(400).json({
        msg: "Invalid whatsapp formate",
        statusCode: 400,
        statusText: "FAIL",
      });
    }
    if (email && !validEmailFormater.test(email)) {
      return res.status(400).json({
        msg: "Invalid phone formater",
        statusCode: 400,
        statusText: "FAIL",
      });
    }

    if (parsedAddress.length > 0) {
      await prisma.address.deleteMany({
        where: {
          anisaID: anisaID,
          id: {
            notIn: parsedAddress.map((address) => address.id).filter(Boolean),
          },
        },
      });

      await Promise.all(
        parsedAddress.map((address) => {
          if (address.id) {
            return prisma.address.update({
              where: { id: address.id },
              data: {
                address: address.address,
                anisaID: anisaID,
              },
            });
          } else {
            return prisma.address.create({
              data: {
                address: address.address,
                anisaID: anisaID,
                createdAt: new Date(Date.now()),
              },
            });
          }
        })
      );
    }

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
      `anisa_${anisaID}_images.pdf`
    );

    if (pdfBytes) {
      fs.writeFileSync(pdfPath, pdfBytes); // Save new PDF if any images were updated
    }

    if (!anisa) {
      return res.status(404).json({
        msg: "Anisa not found",
        statusCode: 404,
        statusText: "FAIL",
      });
    }
    const standerData = {
      graduateOrStudent,
      courses,
      maritalStatus,
      otherMaritalStatus,
      isVerified,
      multiMedia: multimediaUrls,
      anisaStatus,
      pdfUrl: `${req.protocol}://${req.get(
        "host"
      )}/public/pdfs/anisa_${anisaID}_images.pdf`,
    };
    const updateData =
      currUser.role === "moderator"
        ? standerData
        : currUser.role === "admin" && {
            ...standerData,
            fullName,
            phone,
            whatsapp,
            email,
            facebookEmail,
            EducationQualification,
            experience,
            books,
            devotedHours,
            WhyAnisa,
            skills,
            whatAnisaOffers,
            anisaPerceptionOfMother,
            learnWithUs: learnWithUs,
          };

    const updated = await prisma.anisa.update({
      where: {
        id: anisaID,
      },
      data: updateData,
      include: { address: true },
    });
    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "UPDATE",
        actionText: `updated anisa with name ${anisa.fullName} by ${currUser.username}`,
      },
    });

    return res.status(200).json({
      data: JSON.stringify(updated),
      msg: "anisa updated successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error updating anisa",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const verifyAnisa = async (req, res) => {
  const { anisaID } = req.params;
  const currUser = req.user;
  try {
    const anisa = await prisma.anisa.findUnique({
      where: {
        id: anisaID,
      },
      select: {
        fullName: true,
      },
    });
    await prisma.anisa.update({
      where: {
        id: anisaID,
      },
      data: {
        isVerified: true,
      },
    });
    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        actionType: "ACCEPT",
        actionText: `verified anisa with name ${anisa.name} by ${currUser.username}`,
      },
    });
    res.status(200).json({
      msg: "anisa verified successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error updating anisa",
      statusCode: 500,
      statusText: "FAIL",
      error: error.message,
    });
  }
};

const updateBlackListAnisa = async (req, res) => {
  const currUser = req.user;
  const { anisaID } = req.params;

  try {
    const anisa = await prisma.anisa.findUnique({
      where: {
        id: anisaID,
      },
      select: { fullName: true },
    });

    const updatedAnisa = await prisma.anisa.update({
      where: {
        id: anisaID,
      },
      data: {
        blackList: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        clientName: anisa?.fullName,
        actionType: "BlackList",
        actionText: `blacklist client by ${currUser.username}`,
      },
    });

    res.status(200).json({
      data: JSON.stringify(updatedAnisa),
      msg: "BlackList client successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnisa = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      msg: "You are not authorized to delete anisa",
      statusCode: 403,
      statusText: "FAIL",
    });
  }

  try {
    const { anisaID } = req.params;
    const currUser = req.user;

    const anisa = await prisma.anisa.findUnique({
      where: {
        id: anisaID,
      },
      select: {
        fullName: true,
      },
    });
    await prisma.anisa.delete({
      where: {
        id: anisaID,
      },
    });

    await prisma.auditLog.create({
      data: {
        userID: currUser.id,
        Name: anisa?.name,
        actionType: "DELETE",
        actionText: `deleted anisa with name ${anisa.fullName} by ${currUser.username}`,
      },
    });
    res.status(200).json({
      msg: "Anisa deleted successfully",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "error in deleting anisa ",
      statusCode: 500,
      statusText: "FAIL",
      error: err.message,
    });
  }
};

export default {
  getAnisas,
  getSingleAnisa,
  createAnisa,
  updateAnisa,
  verifyAnisa,
  updateBlackListAnisa,
  getNotPaidAnisas,
  deleteAnisa,
  upload,
};
