from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from mxbai_rerank import MxbaiRerankV2
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Reranking API", version="1.0.0")

# Instanciar el modelo al iniciar la aplicación
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        logger.info("Cargando modelo de reranking...")
        model = MxbaiRerankV2("mixedbread-ai/mxbai-rerank-large-v2")
        logger.info("Modelo cargado exitosamente")
    except Exception as e:
        logger.error(f"Error cargando el modelo: {str(e)}")
        raise

# Modelos Pydantic
class RankingResult(BaseModel):
    score: float
    text: str

class RankingResponse(BaseModel):
    results: List[RankingResult]
    processed_batches: int
    total_documents: int

class RankingRequest(BaseModel):
    query: str
    documents: List[str]

def process_batch(query: str, documents_batch: List[str], batch_size: int = 10):
    """Procesa un lote de documentos con el modelo de reranking"""
    try:
        results = model.rank(
            query, 
            documents_batch, 
            return_documents=True, 
            top_k=min(len(documents_batch), 10)
        )
        return results
    except Exception as e:
        logger.error(f"Error procesando lote: {str(e)}")
        raise

@app.post("/rerank", response_model=RankingResponse)
async def rerank_documents(request: RankingRequest):
    try:
        if model is None:
            raise HTTPException(status_code=500, detail="Modelo no cargado")
        
        query = request.query
        documents = request.documents
        batch_size = 10
        
        if not documents:
            return RankingResponse(
                results=[],
                processed_batches=0,
                total_documents=0
            )
        
        all_results = []
        processed_batches = 0
        
        # Procesar documentos en lotes
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            batch_results = process_batch(query, batch, batch_size)
            all_results.extend(batch_results)
            processed_batches += 1
            logger.info(f"Procesado lote {processed_batches} con {len(batch)} documentos")
        
        # Convertir a formato de respuesta y ordenar por score (descendente)
        ranking_results = [
            RankingResult(score=result.score, text=result.document)
            for result in all_results
        ]
        
        # Ordenar por score descendente
        ranking_results.sort(key=lambda x: x.score, reverse=True)
        
        return RankingResponse(
            results=ranking_results,
            processed_batches=processed_batches,
            total_documents=len(documents)
        )
        
    except Exception as e:
        logger.error(f"Error en el endpoint /rerank: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)