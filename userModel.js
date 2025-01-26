const { firestore } = require("firebase-admin");

// Función para verificar si un usuario existe y crearlo si no existe
const createOrUpdateUser = async (userId, userName) => {
  try {
    const usersCollection = firestore().collection("users");
    const userDoc = usersCollection.doc(userId);

    // Verificar si el usuario ya existe
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      // Crear un nuevo usuario con "role: free" por defecto
      await userDoc.set({
        username: userName,
        role: "free", // Rol predeterminado
        createdAt: new Date().toISOString(),
      });
      console.log(`Nuevo usuario creado: ${userName}`);
      return { message: "Usuario creado", role: "free" };
    }

    // Si el usuario ya existe
    console.log(`Usuario existente: ${userName}`);
    return { message: "Usuario existente", role: userSnapshot.data().role };
  } catch (error) {
    console.error("Error en createOrUpdateUser:", error);
    throw new Error("Error al manejar el usuario");
  }
};

module.exports = { createOrUpdateUser };
