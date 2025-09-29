import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa el cliente con tu clave de API.
// Es una buena práctica guardar la clave en una variable de entorno.



const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY; 

if (!geminiApiKey) {
  throw new Error(
    'Faltan variables de entorno para GEMINI. ' +
    'Asegúrate de que REACT_APP_GEMINI_API_KEY'
  );
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Genera el embedding para un texto dado utilizando el modelo de Gemini.
 * @param {string} text - El texto de entrada para el cual se generará el embedding.
 * @returns {Promise<number[]|null>} Una promesa que se resuelve con el vector de embedding o null si ocurre un error.
 */
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string') {
    console.error("El texto de entrada es inválido.");
    return null;
  }

  try {
    // 1. Especifica el modelo de embedding que deseas utilizar.
    // 'embedding-001' es un modelo optimizado para esta tarea.
    const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

    // 2. Llama al método embedContent para generar el vector.
    const result = await model.embedContent(text);

    // 3. Extrae el embedding del resultado.
    const embedding = result.embedding;
    
    // 4. Retorna el vector numérico.
    return embedding.values;

  } catch (error) {
    console.error("Error al generar el embedding:", error);
    return null;
  }
};