import { supabase } from '../configuration/supabaseClient'

/**
 * Obtiene una lista de nombres de documentos únicos directamente desde la base de datos
 * usando una función RPC.
 * @returns {Promise<string[]>} Una promesa que se resuelve con un array de strings (nombres de documentos).
 */
export const getDistinctDocumentNames = async () => {
    try {
      // 1. Llama a la función 'get_unique_document_names' creada en la base de datos.
      const { data, error } = await supabase.rpc('get_unique_document_names');
      if (error) {
        console.error('Error al llamar a la función RPC:', error);
        throw error;
      }
      // 2. La data ya viene filtrada y única desde la base de datos.
      // El resultado es un array de objetos: [{ document_name: 'doc1.pdf' }, { document_name: 'doc2.pdf' }]
      // Solo necesitamos transformar ese array de objetos en un array de strings.
      return data ? data.map(item => item.documents) : [];
  
    } catch (error) {
      console.error('Ocurrió un error inesperado:', error);
      return [];
    }
  };