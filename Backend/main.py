import os
import base64
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from services.face_service import face_service
from services.search_service import search_service
from services.blockchain_service import blockchain_service
from services.pipeline_service import pipeline_service

app = FastAPI(
    title="Face Identification & Blockchain Verification API",
    description="Full pipeline: Face scan input -> Web/social media search -> Blockchain upload/verification",
    version="1.0.0"
)

# Allow Cross-Origin Requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class VerifyRequest(BaseModel):
    record_id_or_tx: str
    candidate_face_hash: Optional[str] = None
    candidate_post_url: Optional[str] = None
    candidate_post_fingerprint: Optional[str] = None

class UploadPostRequest(BaseModel):
    face_hash: str
    post_data: dict

class SearchRequest(BaseModel):
    face_hash: str
    embedding: Optional[List[float]] = []
    query: Optional[str] = ""

@app.get("/")
def root():
    return {
        "project": "Face Identification & Blockchain Verification Protocol",
        "status": "online",
        "chain_id": blockchain_service.chain_id,
        "network": blockchain_service.network_name,
        "contract": blockchain_service.contract_address,
        "endpoints": [
            "/api/pipeline/run",
            "/api/pipeline/detect-face",
            "/api/pipeline/search-web",
            "/api/pipeline/blockchain-upload",
            "/api/pipeline/verify-record",
            "/api/blockchain/overview"
        ]
    }

@app.post("/api/pipeline/run")
async def run_pipeline(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    search_query: Optional[str] = Form(""),
    selected_index: Optional[int] = Form(0)
):
    """
    Runs the entire 3-stage pipeline end-to-end:
    Face Detection -> Social Search -> Blockchain Registration
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
    elif image_base64:
        # Strip data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
    else:
        raise HTTPException(status_code=400, detail="Must provide an image file or base64 string")

    result = pipeline_service.run_full_pipeline(
        image_bytes=image_bytes,
        optional_search_query=search_query or "",
        selected_match_index=selected_index or 0
    )
    return result

@app.post("/api/pipeline/detect-face")
async def detect_face(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None)
):
    """Stage 1: Detects face, facial landmarks, and computes biometric SHA-256 hash."""
    image_bytes = None
    if file:
        image_bytes = await file.read()
    elif image_base64:
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
    else:
        raise HTTPException(status_code=400, detail="Must provide an image file or base64 string")

    result = face_service.process_image(image_bytes)
    return result

@app.post("/api/pipeline/search-web")
def search_social_web(req: SearchRequest):
    """Stage 2: Searches social media & web for matches using face hash & visual keywords."""
    result = search_service.search_by_face(
        face_hash=req.face_hash,
        embedding=req.embedding or [],
        optional_query=req.query or ""
    )
    return result

@app.post("/api/pipeline/blockchain-upload")
def upload_to_blockchain(req: UploadPostRequest):
    """Stage 3: Records the face match and social post into the immutable blockchain ledger."""
    result = blockchain_service.register_record(
        face_hash=req.face_hash,
        post_data=req.post_data
    )
    return result

@app.post("/api/pipeline/verify-record")
def verify_record(req: VerifyRequest):
    """
    Stage 4 / Standalone Verification: Re-verifies data against on-chain record
    and checks for tampering.
    """
    result = blockchain_service.verify_record_integrity(
        record_id_or_tx=req.record_id_or_tx,
        candidate_face_hash=req.candidate_face_hash,
        candidate_post_url=req.candidate_post_url,
        candidate_post_fingerprint=req.candidate_post_fingerprint
    )
    return result

@app.get("/api/blockchain/overview")
def get_blockchain_overview():
    """Returns ledger blocks, transactions, and network status."""
    return blockchain_service.get_ledger_overview()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
