const express = require("express");
const admin = require("firebase-admin");
const { createOrUpdateUser } = require("./userModel");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Middleware
app.use(express.json());

// Test Firestore connection
app.get("/test-db", async (req, res) => {
  try {
    const testDoc = db.collection("test").doc("example");
    await testDoc.set({ message: "Hello from Firebase!" });

    const doc = await testDoc.get();
    res.json(doc.data());
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).json({ error: "Failed to connect to Firestore" });
  }
});

app.post("/auth/login", async (req, res) => {
    const { userId, userName } = req.body; // Recibir userId y userName desde el front
    try {
      const result = await createOrUpdateUser(userId, userName);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error en /auth/login:", error);
      res.status(500).json({ error: "Error al manejar el inicio de sesión" });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
