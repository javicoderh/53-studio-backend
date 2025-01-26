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

// Function to initialize the 'users' collection with a test document
const initializeUsersCollection = async () => {
  try {
    const testDocRef = db.collection("users").doc("test-user");
    const docSnapshot = await testDocRef.get();

    if (!docSnapshot.exists) {
      await testDocRef.set({
        username: "Test User",
        role: "free",
        createdAt: new Date().toISOString(),
      });
      console.log("Collection 'users' initialized with a test document.");
    } else {
      console.log("Collection 'users' already initialized.");
    }
  } catch (error) {
    console.error("Error initializing 'users' collection:", error);
    throw new Error("Failed to initialize 'users' collection.");
  }
};

// Endpoint to test Firestore connection
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

// Endpoint to handle login and user creation/updating
app.post("/auth/login", async (req, res) => {
  const { userId, userName } = req.body;

  try {
    // Call createOrUpdateUser from userModel
    const result = await createOrUpdateUser(userId, userName);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error handling login:", error);
    return res.status(500).json({ error: "Failed to handle login" });
  }
});

// Start the server and initialize the 'users' collection
const startServer = async () => {
  try {
    await initializeUsersCollection(); // Ensure 'users' collection is created
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
