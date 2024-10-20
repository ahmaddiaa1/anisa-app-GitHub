import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import GenerateToken from "../utils/generateJWT.js";

const getAllUsers = async (req, res) => {
    const currUser = req.user;
    const {
        role = "all",
        sortBy = "createdAt-desc",
        page = 1,
        limit = 10,
        search,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Authorization: Block moderators
    if (currUser.role === "moderator") {
        return res.status(403).json({
            data: JSON.stringify([]),
            msg: "You are not authorized to perform this action",
            statusCode: 403,
            statusText: "FAIL",
        });
    }

    // Sorting parameters
    const [fields, dir] = sortBy.split("-");

    // Building the where clause for filtering by role and search
    const whereClause = {
        ...(role !== "all"
            ? role === "canceled"
                ? {isCanceled: true}
                : {
                    role,
                    NOT: {
                        isCanceled: true,
                    },
                }
            : {
                NOT: {
                    isCanceled: true,
                },
            }),
        ...(search
            ? {
                OR: [
                    {username: {contains: search, mode: "insensitive"}},
                    {email: {contains: search, mode: "insensitive"}},
                ],
            }
            : {}),
    };

    try {
        // Count total users with filters applied
        const count = await prisma.user.count({
            where: whereClause,
        });

        // Fetch users with pagination, filtering, and sorting
        const users = await prisma.user.findMany({
            skip: (pageNum - 1) * limitNum,
            take: limitNum,
            where: whereClause,
            orderBy: {[fields]: dir || "desc"},
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                isCanceled: true,
                // Add other fields to include
                // Ensure `password` is not selected
            },
        });

        // Return the response
        res.status(200).json({
            data: JSON.stringify(users),
            count,
            msg: "Users fetched successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error fetching users",
            statusCode: 500,
            statusText: "FAIL",
        });
    }
};

const getUser = async (req, res) => {
    const currUser = req.user;
    const {id} = req.params;

    if (currUser.role === "moderator")
        return res.status(400).json({
            msg: "You are not authorized to perform this action",
            statusCode: 400,
            statusText: "FAIL",
        });

    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {password: false},
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                statusCode: 404,
                statusText: "FAIL",
            });
        }

        res.status(200).json({
            data: JSON.stringify(user),
            msg: "User fetched successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error fetching user",
            statusCode: 500,
            statusText: "FAIL",
        });
    }
};

const createUser = async (req, res) => {
    const currUser = req.user;

    if (currUser.role === "moderator")
        return res.status(400).json({
            msg: "You are not authorized to perform this action",
            statusCode: 400,
            statusText: "FAIL",
        });

    const {username, email, password, confirmPassword} = req.body;
    try {
        if (!username || !email || !password)
            res.status(400).json({
                msg: "All fields are required",
                statusCode: 400,
                statusText: "FAIL",
            });

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user)
            return res.status(400).json({
                msg: "User already exists",
                statusCode: 400,
                statusText: "FAIL",
            });

        if (password !== confirmPassword) {
            return res.status(400).json({
                msg: "Please match password",
                statusCode: 400,
                statusText: "FAIL",
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                role: "moderator",
            },
            include: {
                password: false,
            },
        });
        await prisma.auditLog.create({
            data: {
                userID: currUser.id,
                userName: newUser.username,
                actionType: "CREATE",
                actionText: `create new moderator by ${currUser.username}`,
            },
        });
        res.status(201).json({
            data: JSON.stringify(newUser),
            msg: "User created successfully",
            statusCode: 201,
            statusText: "SUCCESS",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
            statusCode: 500,
            statusText: "FAIL",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                msg: "All fields are required",
                statusCode: 400,
                statusText: "FAIL",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                statusCode: 404,
                statusText: "FAIL",
            });
        }

        if (user.isCanceled) {
            return res.status(401).json({
                msg: "This user is canceled",
                statusCode: 401,
                statusText: "FAIL",
            });
        }

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) {
            return res.status(401).json({
                msg: "Invalid password",
                statusCode: 401,
                statusText: "FAIL",
            });
        }
        GenerateToken(res, user.id);
        res.status(200).json({
            data: JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }),
            msg: "User logged in successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            msg: "Internal server error",
            statusCode: 500,
            statusText: "FAIL",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    const currUser = req.user;
    const {id} = req.params;

    if (currUser.role === "moderator")
        return res.status(400).json({
            msg: "You are not authorized to perform this action",
            statusCode: 400,
            statusText: "FAIL",
        });

    const {username, email, role, isCanceled} = req.body;

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                username,
                email,
                role,
                isCanceled: JSON.parse(isCanceled),
            },
            include: {
                password: false,
            },
        });
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                statusCode: 404,
                statusText: "FAIL",
            });
        }
        await prisma.auditLog.create({
            data: {
                userID: currUser.id,
                userName: user.username,
                actionType: "UPDATE",
                actionText: `updated user by ${currUser.username}`,
            },
        });

        res.status(200).json({
            data: JSON.stringify(user),
            msg: "User updated successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error",
            statusCode: 500,
            statusText: "FAIL",
            error: error.message,
        });
    }
};

const updateCancelUser = async (req, res) => {
    const currUser = req.user;
    const {id} = req.params;

    if (currUser.role !== "admin")
        return res.status(400).json({
            msg: "You are not authorized to perform this action",
            statusCode: 400,
            statusText: "FAIL",
        });

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                isCanceled: true,
            },
            include: {
                password: false,
            },
        });
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                statusCode: 404,
                statusText: "FAIL",
            });
        }
        await prisma.auditLog.create({
            data: {
                userID: currUser.id,
                userName: user.username,
                actionType: "UPDATE",
                actionText: `cancel user by ${currUser.username}`,
            },
        });

        res.status(200).json({
            data: JSON.stringify(user),
            msg: "User cancelled successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error",
            statusCode: 500,
            statusText: "FAIL",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const currUser = req.user;
    const {id} = req.params;

    if (currUser.role === "moderator")
        res.status(400).json({
            msg: "You are not authorized to perform this action",
            statusCode: 400,
            statusText: "FAIL",
        });
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        await prisma.user.update({
            where: {
                id,
            },
            data: {
                auditLogs: {
                    disconnect: true,
                },
            },
        });

        await prisma.user.delete({
            where: {
                id,
            },
        });
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                statusCode: 404,
                statusText: "FAIL",
            });
        }

        await prisma.auditLog.create({
            data: {
                userID: currUser.id,
                userName: user.username,
                actionType: "Delete",
                actionText: `Delete user by ${currUser.username}`,
            },
        });
        res.status(200).json({
            data: JSON.stringify(user),
            msg: "User deleted successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "error in delete user",
            statusCode: 500,
            statusText: "FAIL",
            error: error.message,
        });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            data: null,
            msg: "User logged out successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (error) {
        res.status(500).json({
            msg: "User logged out Failed",
            statusCode: 200,
            statusText: "FAIL",
            error: error.message,
        });
    }
};
const currentUser = async (req, res) => {
    try {
        const currUser = req.user;

        res.status(200).json({
            data: JSON.stringify(currUser),
            msg: "User logged in successfully",
            statusCode: 200,
            statusText: "SUCCESS",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error occurred"});
    }
};

export default {
    getAllUsers,
    getUser,
    createUser,
    login,
    logout,
    updateCancelUser,
    updateUser,
    deleteUser,
    currentUser,
};
