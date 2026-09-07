import time
import base64
from typing import Dict, Any, Optional
from .face_service import face_service
from .search_service import search_service
from .blockchain_service import blockchain_service

class PipelineService:
    def run_full_pipeline(self, 
                          image_bytes: bytes, 
                          optional_search_query: str = "", 
                          selected_match_index: int = 0) -> Dict[str, Any]:
        """
        Executes the complete 3-stage pipeline end-to-end:
        Stage 1: Face Detection & Encoding
        Stage 2: Reverse Social/Web Discovery
        Stage 3: Blockchain Notarization & Certificate Minting
        """
        pipeline_start = time.time()
        
        # Stage 1: Face Identification
        face_result = face_service.process_image(image_bytes)
        if not face_result.get("success"):
            return {
                "success": False,
                "error": "Face detection failed",
                "stage": 1
            }

        primary_face_hash = face_result["primary_face_hash"]
        primary_embedding = face_result["faces"][0]["embedding"] if face_result["faces"] else []

        # Stage 2: Web / Social Media Reverse Search
        search_result = search_service.search_by_face(
            face_hash=primary_face_hash,
            embedding=primary_embedding,
            image_bytes=image_bytes,
            optional_query=optional_search_query
        )

        matches = search_result.get("matches", [])
        if not matches:
            return {
                "success": False,
                "error": "No matching social media content discovered",
                "stage": 2,
                "face_data": face_result
            }

        # Select target post to notarize
        chosen_match = matches[selected_match_index] if 0 <= selected_match_index < len(matches) else matches[0]

        # Stage 3: Blockchain Notarization
        blockchain_result = blockchain_service.register_record(
            face_hash=primary_face_hash,
            post_data=chosen_match
        )

        total_elapsed_ms = int((time.time() - pipeline_start) * 1000)

        return {
            "success": True,
            "pipeline_time_ms": total_elapsed_ms,
            "stage_1_face": {
                "total_faces": face_result["total_faces_detected"],
                "primary_face_hash": primary_face_hash,
                "primary_face_crop": face_result["primary_face_crop"],
                "annotated_image": face_result["annotated_image"],
                "biometrics": face_result["faces"][0] if face_result["faces"] else None
            },
            "stage_2_search": {
                "engine": search_result["engine"],
                "latency_ms": search_result["search_latency_ms"],
                "total_found": search_result["total_matches"],
                "matches": matches,
                "selected_match": chosen_match
            },
            "stage_3_blockchain": {
                "tx_hash": blockchain_result["tx_hash"],
                "block_number": blockchain_result["block_number"],
                "block_hash": blockchain_result["block_hash"],
                "contract_address": blockchain_result["contract_address"],
                "record_id": blockchain_result["record_id"],
                "certificate": blockchain_result["certificate"]
            }
        }

pipeline_service = PipelineService()
