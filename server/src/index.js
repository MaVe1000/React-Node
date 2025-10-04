import dotenv from "dotenv"; 
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser"; // ✅ Importado correctamente
// ✅ CORRECCIÓN 2: Importar la ruta de admin con la sintaxis moderna
import adminRoutes from "./routes/admindash.js"; 

import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import forgotPassRoutes from "./routes/forgetPasswordRoute.js";

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// 2. RUTAS
app.use("/api/auth", authRoutes);
app.use("/api", forgotPassRoutes);
app.use("/admin", adminRoutes); // ✅ Usando la variable importada de la línea 11

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error(" ❌MONGO_URI is not defined. Check your .env file!");
  process.exit(1);
}

// 3. CONEXIÓN Y ARRANQUE (Ordenado para mejor legibilidad)
mongoose
  .connect(mongoURI)
  .then(() => console.log(" ✅Connected to MongoDB!"))
  // ⚠️ Usamos 'error' en lugar de 'err' para consistencia. El linter ya está configurado para esto.
  .catch((error) => console.error(" ❌Database connection failed:", error)); 

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("hello worldji!!");
});

// 4. LÓGICA DE ADMIN (Se mantiene aquí por ahora)

app.delete("/admin/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await User.deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

app.put("/admin/users/:email", async (req, res) => {
  const { email } = req.params;
  const { fullName, role } = req.body;

  console.log("Received Update:", { fullName, role });

  const user = await User.findOneAndUpdate(
    { email },
    { fullName, role },
    { new: true } // Ensure it returns updated data
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  // Retorna solo la información segura
  res.json({ fullName: user.fullName, email: user.email, role: user.role });
});

// Middleware de logging (DEBE ir antes de las rutas para capturarlas todas)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});