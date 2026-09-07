import numpy as np
import cv2
from services.face_service import face_service
from services.search_service import search_service
from services.blockchain_service import blockchain_service
from services.pipeline_service import pipeline_service

def create_synthetic_face_image() -> bytes:
    """Creates a synthetic test image with an oval face, eyes, and mouth for automated testing."""
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    img[:] = (240, 240, 240)
    
    # Face oval
    cv2.ellipse(img, (150, 150), (80, 110), 0, 0, 360, (180, 200, 230), -1)
    # Eyes
    cv2.circle(img, (120, 130), 12, (50, 50, 50), -1)
    cv2.circle(img, (180, 130), 12, (50, 50, 50), -1)
    # Nose
    cv2.line(img, (150, 140), (150, 170), (100, 100, 100), 3)
    # Mouth
    cv2.ellipse(img, (150, 195), (35, 15), 0, 0, 180, (50, 50, 150), 3)

    is_success, buffer = cv2.imencode(".jpg", img)
    return buffer.tobytes()

def test_full_flow():
    print("--- 1. Testing Face Detection & Hashing ---")
    img_bytes = create_synthetic_face_image()
    face_res = face_service.process_image(img_bytes)
    print("Face Detection Success:", face_res["success"])
    print("Total Faces:", face_res["total_faces_detected"])
    print("Primary Face Hash:", face_res["primary_face_hash"])
    assert face_res["success"] is True
    assert face_res["primary_face_hash"] is not None

    print("\n--- 2. Testing Social Media / Web Search ---")
    search_res = search_service.search_by_face(
        face_hash=face_res["primary_face_hash"],
        embedding=face_res["faces"][0]["embedding"],
        optional_query="tech developer"
    )
    print("Search Engine:", search_res["engine"])
    print("Total Matches Found:", search_res["total_matches"])
    assert search_res["total_matches"] > 0
    first_match = search_res["matches"][0]
    print("First Match:", first_match["platform"], "-", first_match["post_url"])

    print("\n--- 3. Testing Blockchain Notarization ---")
    bc_res = blockchain_service.register_record(
        face_hash=face_res["primary_face_hash"],
        post_data=first_match
    )
    print("Blockchain Tx Hash:", bc_res["tx_hash"])
    print("Block Number:", bc_res["block_number"])
    print("Record ID:", bc_res["record_id"])
    assert bc_res["success"] is True

    print("\n--- 4. Testing On-Chain Re-Verification (Authentic Data) ---")
    verify_res = blockchain_service.verify_record_integrity(
        record_id_or_tx=bc_res["record_id"],
        candidate_face_hash=face_res["primary_face_hash"],
        candidate_post_url=first_match["post_url"]
    )
    print("Verification Passed:", verify_res["verified"])
    print("Checks Passed:", verify_res["checks_passed"])
    assert verify_res["verified"] is True
    assert verify_res["is_tampered"] is False

    print("\n--- 5. Testing On-Chain Re-Verification (Tampered URL Data) ---")
    tampered_verify = blockchain_service.verify_record_integrity(
        record_id_or_tx=bc_res["record_id"],
        candidate_face_hash=face_res["primary_face_hash"],
        candidate_post_url="https://fake-fraudulent-url.com/altered-post"
    )
    print("Tamper Caught:", tampered_verify["is_tampered"])
    print("Tamper Details:", tampered_verify["tamper_details"])
    assert tampered_verify["verified"] is False
    assert tampered_verify["is_tampered"] is True

    print("\n--- 6. Testing Full Pipeline Orchestrator ---")
    pipeline_res = pipeline_service.run_full_pipeline(img_bytes, "ai researcher")
    print("Pipeline Execution Success:", pipeline_res["success"])
    print("Pipeline Time:", pipeline_res["pipeline_time_ms"], "ms")
    assert pipeline_res["success"] is True
    print("\n[ALL BACKEND TESTS PASSED SUCCESSFULLY!]")

if __name__ == "__main__":
    test_full_flow()
