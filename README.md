# 🛡️ FaceVerify Protocol — Face Identification & Blockchain Verification

> **HH Goa 2026 Shortlisting Task 3: Face Identification & Blockchain Verification**  
> **Team Horizon**: Prince Sahu • Aniket Raj • Utkarsh Tiwari  
> An end-to-end cryptographic pipeline that takes a face scan as input, identifies matching content across the web/social media, and immutably notarizes and verifies that discovered data using a blockchain.

---

## 🚀 Pipeline Flow (End-to-End)

```mermaid
flowchart LR
    A["📸 Face Scan Input\n(Upload / Webcam)"] --> B["🧬 Stage 1: Face ID\n(Landmarks & 128D Vector)"]
    B --> C["🌐 Stage 2: Social Search\n(Twitter/Reddit/Web)"]
    C --> D["⛓️ Stage 3: Blockchain Notarization\n(EVM Block Minting)"]
    D --> E["🔍 Stage 4: Re-Verification\n(Tamper Proof & Audit)"]
```

1. **Face Scan Input & Biometric Identification**:
   - Accepts image uploads or real-time webcam captures.
   - Detects frontal faces, extracts bounding boxes and facial landmarks.
   - Computes a normalized 128-dimensional spatial luminance vector and a cryptographic SHA-256 biometric fingerprint.

2. **Web & Social Media Discovery**:
   - Performs reverse intelligence crawling across social networks (Twitter/X, Reddit, LinkedIn, GitHub, Instagram, Web).
   - Extracts real URLs, authors, timestamps, snippets, match confidence, and generates a Keccak-256/SHA-256 post fingerprint.

3. **Blockchain Notarization & Immutability**:
   - Generates a canonical Merkle leaf:
     $$\text{RecordID} = \text{Keccak256}(\text{Face\_SHA256} \parallel \text{Post\_Fingerprint} \parallel \text{Post\_URL} \parallel \text{Author} \parallel \text{Timestamp})$$
   - Mints an immutable block on an EVM-compatible Proof-of-Authority (PoA) blockchain smart contract (`FaceVerificationRegistry.sol`).
   - Issues a verifiable transaction receipt and on-chain record.

4. **On-Chain Re-Verification**:
   - Re-verifies candidate face hash and post URL against the on-chain ledger state with mathematical tamper resistance.

---

## 👥 Team Horizon

- **Prince Sahu**
- **Aniket Raj**
- **Utkarsh Tiwari**

---

## ⚡ Quick Start (1-Click Run on Any Laptop)

### Prerequisites:
Make sure the following are installed on your laptop:
- **Python 3.10+** (Ensure **"Add Python to PATH"** is checked during installation)
- **Node.js 18+** & **npm** (Download LTS from [nodejs.org](https://nodejs.org/))

---

### Option A: Windows (1-Click Launch)
Simply double-click:
```
start_project.bat
```
> 💡 *Note: The batch script will automatically check and install all missing Python & Frontend npm dependencies on first run, launch both servers, and open your browser automatically at `http://localhost:5173`.*

Or install all dependencies manually anytime:
```
install_dependencies.bat
```

---

### Option B: macOS / Linux (1-Click Launch)
Give execute permission and run:
```bash
chmod +x start_project.sh install_dependencies.sh
./start_project.sh
```

---

### Option C: Manual Setup (Step-by-Step)

#### 1. Install All Dependencies:
```bash
# Python dependencies
pip install -r requirements.txt

# Frontend dependencies
cd Frontend
npm install
cd ..
```

#### 2. Start Backend (Terminal 1):
```bash
cd Backend
python main.py
```
*Backend API runs at `http://127.0.0.1:8000` (Swagger Docs at `http://127.0.0.1:8000/docs`).*

#### 3. Start Frontend (Terminal 2):
```bash
cd Frontend
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 📦 Project Structure

```
├── requirements.txt            # Root Python dependencies
├── install_dependencies.bat    # Windows 1-click dependency installer
├── install_dependencies.sh     # Mac/Linux 1-click dependency installer
├── start_project.bat           # Windows 1-click system launcher (auto-installs deps)
├── start_project.sh            # Mac/Linux 1-click system launcher (auto-installs deps)
├── Backend/
│   ├── main.py                 # FastAPI application & REST endpoints
│   ├── requirements.txt        # Backend dependencies
│   ├── blockchain_ledger.json  # Local EVM ledger storage
│   └── services/
│       ├── face_service.py     # Biometric detection & SHA-256 generation
│       ├── search_service.py   # Multi-platform social & web scraping
│       ├── blockchain_service.py # EVM smart contract & ledger logic
│       └── pipeline_service.py # Orchestrator for all pipeline stages
└── Frontend/
    ├── package.json            # React & Tailwind dependencies
    ├── vite.config.js          # Vite config & API reverse proxy
    └── src/                    # UI Components & Pipeline flow
```
