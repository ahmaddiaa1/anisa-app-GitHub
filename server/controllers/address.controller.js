import prisma from "../utils/prisma.js";

const getAddress = async (req, res) => {
  try {
    const addresses = await prisma.addresses.findMany();
    res.status(200).json({
      data: addresses,
      msg: "Retrieved all addresses",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve addresses" });
  }
};

const createAddress = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const newAddress = await prisma.addresses.create({
      data: {
        address,
      },
    });

    res.status(201).json({
      data: newAddress,
      msg: "Address created",
      statusCode: 201,
      statusText: "CREATED",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create address" });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.addresses.delete({
      where: { id },
    });
    res.status(200).json({
      data: id,
      msg: "Address deleted",
      statusCode: 200,
      statusText: "SUCCESS",
    });
  } catch (error) {
    res.status(404).json({ message: "Address not found" });
  }
};

export default {
  getAddress,
  createAddress,
  deleteAddress,
};
