import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    //app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/client/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname,'client', 'dist', 'index.html'))
    );
} else {
    const __dirname = path.resolve();
    app.use("/public", express.static(path.join(__dirname, "public/")));
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}


app.use(
  cors({
    origin: [
      "https://anisa.idealdevs.net/",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:8080",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import anisaRoute from "./routes/anisa.route.js"
import auditLogRoute from "./routes/auditLog.route.js"
import orderCategoryRoute from "./routes/orderCategory.route.js"
import customerRoute from "./routes/customer.route.js"
import orderRoute from "./routes/order.route.js"
import authRoutes from "./routes/auth.route.js"
import imageRoutes from "./routes/imageRoutes.js"
import addressRoute from "./routes/address.route.js"

app.use('/api/orderCategory', orderCategoryRoute);
app.use("/api/client", customerRoute);
app.use("/api/auditlog", auditLogRoute);
app.use("/api/anisa", anisaRoute);
app.use("/api/order", orderRoute);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoute);
app.use("/api", imageRoutes);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
