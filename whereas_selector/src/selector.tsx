import * as React from "react";
import { useState, useEffect } from 'react'
import { List, arrayMove, arrayRemove } from 'react-movable';
import { WhereasClause, WhereasClauseIA } from './types'
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SendIcon from '@mui/icons-material/Send';
import { getDistinctDocumentNames } from './services/dbService';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// Workaround for React 19 compatibility with react-icons
import { generateEmbedding } from './services/geminiService'
import { supabase } from './configuration/supabaseClient'
import Select from 'react-select';

const RemovableByMove: React.FC = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 1. Estado para el input de búsqueda
  const [popupItems, setPopupItems] = useState<string[]>([]); // 2. Estado para los ítems, inicia vacío
  const [documentList, setDocumentList] = useState<{ value: string, label: string }[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{ value: string, label: string } | null>(null);

  const [loadingPopupSearch, setLadingPopupSearch] = useState(false)

  const [showSendButton, setShowSendButton] = useState(false)

  const rawData = React.useRef<WhereasClauseIA[]>([]); // Se usa useRef para mantener los datos originales sin causar re-renderizados
  const [data, setData] = useState<WhereasClause[]>([])   //Aqui se guardan los datos etitquetados.
  const [loading, setLoading] = useState(true)

  const [index, setIndex] = useState(0)
  const [iaWhereas, setIaWhereas] = useState<string[]>([]);


  const [resolution, setResolution] = useState("");
  const [userWhereas, setUserWhereas] = useState<string[]>([]);


  useEffect(() => {

    const fetchData = async () => {


      try {
        const docNames = await getDistinctDocumentNames()
        const formattedDocs = docNames.map(name => ({
          value: name, // El valor interno
          label: name  // Lo que el usuario ve
        }));
        setDocumentList(formattedDocs)
        const { data: whereasData, error } = await supabase
          .from('whereas_clauses')
          .select('*')

        if (error) {
          console.error('Error:', error)
          return
        }
        // Asignar datos a los estados correspondientes

        if (whereasData.length > 0) {
          setIndex(0)
          setIaWhereas(whereasData[0].whereasia || [])
          setResolution(whereasData[0].resolution || "")
          setUserWhereas(whereasData[0].whereasuser || [])

        }
        rawData.current = whereasData || [] // se llena con los datos iniciales, al final se llena whereasfinalchoice y seguarda el registro para entrenaminto 
        setData(whereasData || [])
        //configuro botones
        setShowSendButton(whereasData.length === 1)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  const getVectorialData = async () => {
    //Me permite traer los embeddings más similares
    const search_embedding = await generateEmbedding(searchTerm)
    // 2. Llamar a la función mastch_documents en Supabase
    const { data: documents, error } = await supabase
      .rpc('match_documents', {
        query_embedding: search_embedding, // el vector de tu consulta
        match_count: 10, // número de resultados deseados
        filter: {} // filtros opcionales en metadata
      });

    if (error) {
      console.error('Error en búsqueda vectorial:', error);
    }
    return documents
  }


  //Funcion para mover resultados de la caja de sugerencias a los artículos elegidos
  const move_results = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    // setPopupItems(
    //   newIndex === -1
    //     ? arrayRemove(popupItems, oldIndex)
    //     : arrayMove(popupItems, oldIndex, newIndex),
    // );


    if (newIndex === -1) {
      setUserWhereas([...userWhereas, popupItems[oldIndex]]);
    }
    setPopupItems(newIndex === -1 ? arrayRemove(popupItems, oldIndex) : arrayMove(popupItems, oldIndex, newIndex));


  }


  const getFilteredData = async (documentName: string, articleSearchTerm: string) => {
    // Construimos el patrón de búsqueda para el artículo. 
    // Los '%' indican que el texto puede estar en cualquier parte del campo 'articulo'.
    const articlePattern = `${articleSearchTerm}`;

    const { data: documents, error } = await supabase
      .from('documents') // 1. Selecciona tu tabla 'documents'
      .select('content, metadata') // 2. Trae las columnas que necesitas
      // 3. Filtra por el nombre exacto del documento en la metadata
      .filter('metadata->>document_name', 'eq', documentName)
      // 4. Filtra por el artículo de forma flexible (insensible a mayúsculas/minúsculas)
      .ilike('metadata->>articulo', articlePattern);

    if (error) {
      console.error('Error en búsqueda filtrada:', error);
      return []; // Devuelve un array vacío en caso de error
    }

    return documents;
  };


  // Función que se ejecuta al presionar "Buscar"
  const handleSearch = async () => {
    setLadingPopupSearch(true);
    let documents = []; // Inicializamos un array para guardar los resultados

    if (selectedDocument) {
      documents = await getFilteredData(selectedDocument.value, searchTerm);
    } else {
      documents = await getVectorialData();
    }

    // Este bloque se ejecuta sin importar qué búsqueda se hizo
    if (documents && documents.length > 0) {
      setPopupItems(documents.map((elm: any) => {
        // Usamos '??' para manejar el caso en que elm.metadata no exista
        const metadata = elm.metadata ?? {};
        return (
          "LEY: " + (elm.content ?? 'N/A') +
          "\nTITULO: " + (metadata.titulo ?? 'N/A') +
          "\nARTICULO #: " + (metadata.articulo ?? 'N/A') +
          "\nEXTRAIDO DE: " + (metadata.document_name ?? 'N/A')
        );
      }));
    } else {
      // Si no hay resultados, limpiamos la lista
      setPopupItems([]);
    }

    setLadingPopupSearch(false);
  };

  // Función para cerrar y resetear el popup
  const closeAndResetPopup = () => {
    setOpenPopup(false);
    setSearchTerm("");
    setPopupItems([]); // Resetea la lista al cerrar
  };

  const sendData = async () => {
    const confirm = window.confirm('¿Está seguro que desea continuar?\n Las resoluciones se generarán con los artículos elegidos.\n Ya no podrá editar esta información.');
    if (!confirm) return;
    //Guardo userWhereas y iaWhereas en data[index]
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      whereasia: iaWhereas,
      whereasuser: userWhereas
    };
    setData(updatedData);

    rawData.current[index] = { ...rawData.current[index], whereasfinalchoice: userWhereas }


    //Envio todo el array data a la base de datos
    try {
      //Primero elimino todo
      const { error: deleteError } = await supabase
        .from('whereas_clauses')
        .delete()
        .gt('id', -1)
      //Luego inserto todo
      if (!deleteError) {
        const { error: insertError } = await supabase
          .from('whereas_clauses')
          .insert(updatedData)
        const { error: insertErrore } = await supabase
          .from('whereas_clauses_datatraining')
          .insert(rawData.current)
        if (insertError) {
          alert('Error al guardar datos, Intentelo de nuevo')
          console.error('Error inserting data:', insertError)
          return
        }
      } else {
        console.error('Error deleting data, aborting insert:', deleteError)
        return
      }
      alert('Datos enviados correctamente')
      window.close()
    } catch (error) {
      console.error('Error sending data:', error)
    }
  }

  const changeToLeft = () => {
    //Primero guardo userWhereas y iaWhereas en data[index]
    if (index > 0) {
      //configuro botones
      setShowSendButton(false)
      const updatedData = [...data];
      updatedData[index] = {
        ...updatedData[index],
        whereasia: iaWhereas,
        whereasuser: userWhereas
      };
      setData(updatedData);
      rawData.current[index] = {
        ...rawData.current[index], whereasfinalchoice: userWhereas
      }

      //Luego cargo los datos del nuevo index
      setIaWhereas(data[index - 1].whereasia);
      setUserWhereas(data[index - 1].whereasuser);
      setResolution(data[index - 1].resolution);
      //Finalmente actualizo el indice
      setIndex(currentIndex => currentIndex - 1)
    }
  }
  const changeToRight = () => {
    if (index < data.length - 1) {
      //configuro botones
      setShowSendButton(index === data.length - 2)
      //Primero guardo userWhereas y iaWhereas en data[index]
      const updatedData = [...data];
      updatedData[index] = {
        ...updatedData[index],
        whereasia: iaWhereas,
        whereasuser: userWhereas
      };
      setData(updatedData);
      rawData.current[index] = {
        ...rawData.current[index], whereasfinalchoice: userWhereas
      }
      //Luego cargo los datos del nuevo index
      setIaWhereas(data[index + 1].whereasia);
      setUserWhereas(data[index + 1].whereasuser);
      setResolution(data[index + 1].resolution);
      //Finalmente actualizo el indice
      setIndex(currentIndex => currentIndex + 1)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0px auto",
        padding: "1em",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    ><h3 style={{ margin: 0 }}>{resolution}</h3>
      <div style={{
        display: "flex",
        gap: "2em",
        justifyContent: "space-between",
        flex: 1,                // 👈 ocupa SOLO lo que queda después del h3
        overflow: "auto"        // scroll solo aquí si el contenido desborda
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={changeToLeft}
            style={{
              background: "none",   // sin fondo
              border: "none",       // sin borde
              cursor: "pointer",    // que parezca clickeable
              padding: 0,           // quita padding
            }}
          >
            <NavigateBeforeIcon style={{ fontSize: 30 }} />
          </button>
        </div>

        {/* Lista IA (izquierda) con nuevos estilos */}
        <div style={{ flex: '1 1 50%', maxWidth: '50%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h3>Artículos Propuestos IA</h3>
          <List
            removableByMove
            values={iaWhereas}
            onChange={({ oldIndex, newIndex, targetRect }) => {
              // Si el nuevo índice es -1, significa que se soltó fuera de un área válida
              if (newIndex === -1) {
                const listElement = document.querySelector('[data-testid="ia-list"]');
                if (listElement) {
                  const listRect = listElement.getBoundingClientRect();
                  // Solo si se suelta a la DERECHA de la lista, se mueve el elemento
                  if (targetRect.left > listRect.right) {
                    // Añadir a la lista de usuario
                    setUserWhereas(prev => [...prev, iaWhereas[oldIndex]]);
                    // Eliminar de la lista de IA
                    setIaWhereas(prev => arrayRemove(prev, oldIndex));
                  }
                  // Si se suelta a la izquierda, no se hace nada y el ítem vuelve a su lugar.
                }
              } else {
                // Si se mueve dentro de la misma lista, solo se reordena
                setIaWhereas(arrayMove(iaWhereas, oldIndex, newIndex));
              }
            }}
            renderList={({ children, props, isDragged }) => (
              <ul
                {...props}
                data-testid="ia-list"
                style={{
                  // ✨ Estilos del contenedor actualizados
                  flex: 1,
                  padding: "1em",
                  whiteSpace: 'pre-line',
                  cursor: isDragged ? "grabbing" : undefined,
                  overflowY: "auto",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              >
                {children}
              </ul>
            )}
            renderItem={({ value, props, isDragged, isSelected, isOutOfBounds }) => (
              <li
                {...props}
                style={{
                  ...props.style,
                  // ✨ Estilos de los ítems actualizados
                  padding: "1em",
                  margin: "0.5em 0",
                  textAlign: "left",
                  listStyleType: "none",
                  cursor: isDragged ? "grabbing" : "grab",
                  border: "1px solid #ddd",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.08)",
                  color: "#333",
                  borderRadius: "5px",
                  backgroundColor: isDragged || isSelected ? (isOutOfBounds ? "#F08080" : "#EEE") : "#FFF",
                }}
              >
                {value}
              </li>
            )}
          />
        </div>
        {/* Lista User (derecha) con nuevos estilos */}
        <div style={{ flex: '1 1 50%', maxWidth: '50%', display: 'flex', flexDirection: 'column' }}>
          <h3>Artículos Elegidos</h3>
          <List
            removableByMove
            values={userWhereas}
            onChange={({ oldIndex, newIndex, targetRect }) => {
              // Si el nuevo índice es -1, significa que se soltó fuera de un área válida
              if (newIndex === -1) {
                const listElement = document.querySelector('[data-testid="user-list"]');
                if (listElement) {
                  const listRect = listElement.getBoundingClientRect();
                  // Solo si se suelta a la IZQUIERDA de la lista, se mueve el elemento
                  if (targetRect.left < listRect.left) {
                    // Añadir a la lista de IA
                    setIaWhereas(prev => [...prev, userWhereas[oldIndex]]);
                    // Eliminar de la lista de usuario
                    setUserWhereas(prev => arrayRemove(prev, oldIndex));
                  }
                  // Si se suelta a la derecha, no se hace nada y el ítem vuelve a su lugar.
                }
              } else {
                // Si se mueve dentro de la misma lista, solo se reordena
                setUserWhereas(arrayMove(userWhereas, oldIndex, newIndex));
              }
            }}
            renderList={({ children, props, isDragged }) => (
              <ul
                {...props}
                data-testid="user-list"
                style={{
                  // ✨ Estilos del contenedor actualizados
                  flex: 1,
                  padding: "1em",
                  whiteSpace: 'pre-line',
                  cursor: isDragged ? "grabbing" : undefined,
                  overflowY: "auto",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              >
                {children}
              </ul>
            )}
            renderItem={({ value, props, isDragged, isSelected, isOutOfBounds }) => (
              <li
                {...props}
                style={{
                  ...props.style,
                  // ✨ Estilos de los ítems actualizados
                  padding: "1em",
                  margin: "0.5em 0",
                  textAlign: "left",
                  listStyleType: "none",
                  cursor: isDragged ? "grabbing" : "grab",
                  border: "1px solid #ddd",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.08)",
                  color: "#333",
                  borderRadius: "5px",
                  backgroundColor: isDragged || isSelected ? (isOutOfBounds ? "#F08080" : "#EEE") : "#FFF",
                }}
              >
                {value}
              </li>
            )}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={showSendButton ? sendData : changeToRight}
            style={{
              background: "none",   // sin fondo
              border: "none",       // sin borde
              cursor: "pointer",    // que parezca clickeable
              padding: 0,           // quita padding
            }}
          >
            {showSendButton ? <SendIcon style={{ fontSize: 30 }} /> :
              <NavigateNextIcon style={{ fontSize: 30 }} />}
          </button>
        </div>
      </div>
      {/* 🔎 Botón flotante en esquina inferior derecha */}
      <button
        onClick={() => setOpenPopup(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      >
        <SearchIcon style={{ fontSize: 30 }} />
      </button>
      {/* 2. POPUP CON LA LISTA MOVIBLE INTEGRADA */}
      {openPopup && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px", // Un poco más ancho para el contenido
            maxHeight: "600px", // Altura máxima para evitar que sea muy grande
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            padding: "1em",
            zIndex: 9999,
            display: 'flex',       // Flexbox para organizar el contenido
            flexDirection: 'column' // Contenido en columna (título, lista, botón)
          }}
        >
          <h4 style={{ marginTop: 0, textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '0.5em' }}>Resultados</h4>

          {/* La lista movible va aquí */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}> {/* Contenedor para que la lista tenga scroll */}
            <List
              removableByMove
              values={popupItems}
              onChange={move_results}
              renderList={({ children, props, isDragged }) => (
                <ul {...props} style={{ whiteSpace: 'pre-line', padding: 0, margin: 0, cursor: isDragged ? "grabbing" : undefined }}>
                  {children}
                </ul>
              )}
              renderItem={({ value, props, isDragged, isSelected, isOutOfBounds }) => (
                <li
                  {...props}
                  style={{
                    ...props.style,
                    padding: "1em",
                    textAlign: "left",
                    margin: "0.5em 0em",
                    listStyleType: "none",
                    cursor: isDragged ? "grabbing" : "grab",
                    border: "1px solid #CCC",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    color: "#333",
                    borderRadius: "5px",
                    backgroundColor: isDragged || isSelected ? (isOutOfBounds ? "#F08080" : "#EEE") : "#FFF",
                  }}
                >
                  {value}
                </li>
              )}
            />
          </div>
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Escribe algo para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchTerm.trim() && !loadingPopupSearch) {
                handleSearch();
              }
            }}
            style={{
              width: "100%", padding: "0.75em", borderRadius: "5px",
              border: "1px solid #ccc", marginBottom: "1em", boxSizing: 'border-box'
            }}
          />
          {/* Botón para cerrar el popup */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between', // Espacio entre selector y botones
            alignItems: 'center',            // Alineación vertical
            gap: '1em',                       // Espacio entre elementos
            marginTop: '1em'                  // Margen superior para separarlo de la lista
          }}>

            {/* 1. EL SELECTOR CON BUSCADOR (ocupa el espacio disponible) */}
            <div style={{ flex: 1 }}>
              <Select
                options={documentList}
                value={selectedDocument}
                onChange={(selectedOption) => setSelectedDocument(selectedOption)}
                placeholder="Selecciona o busca una norma..."
                isClearable   // Permite borrar la selección con una 'x'
                isSearchable  // Habilita la búsqueda
                // Opcional: Texto si no hay opciones
                noOptionsMessage={() => "No se encontraron normas"}
              />
            </div>

            {/* 2. CONTENEDOR PARA LOS BOTONES (a la derecha) */}
            <div style={{ display: 'flex', gap: '0.5em' }}>
              <button
                onClick={closeAndResetPopup}
                style={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #ddd",
                  padding: "0.5em 1em",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
              <button
                onClick={handleSearch}
                disabled={loadingPopupSearch}
                style={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #ddd",
                  padding: "0.5em 1em",
                  borderRadius: "5px",
                  cursor: loadingPopupSearch ? "wait" : "pointer",
                }}
              >
                {loadingPopupSearch ? "⏳ Buscando..." : "Buscar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemovableByMove;
