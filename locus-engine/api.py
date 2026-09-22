from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from neo4j import GraphDatabase
import subprocess
import json
import datetime

app = FastAPI(title="LOCUS Neuro-Symbolic Engine")

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEO4J_URI = "neo4j://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "locus-admin"
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

class BGPUpdate(BaseModel):
    prefixes: List[str]
    as_path: List[int]

# WebSocket Manager to broadcast data to the frontend
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except RuntimeError:
                pass # Ignore if the socket closed mid-broadcast

manager = ConnectionManager()

@app.on_event("shutdown")
def close_driver():
    driver.close()

def verify_path_in_graph(tx, path: List[int]):
    if len(path) < 2:
        return True
    valid_links = 0
    expected_links = 0
    for i in range(len(path) - 1):
        asn_a, asn_b = path[i], path[i+1]
        if asn_a == asn_b:
            continue
        expected_links += 1
        query = """
        MATCH (a:ASN {asn: $asn_a})-[:ROUTES_TO]-(b:ASN {asn: $asn_b})
        RETURN count(*) as link_exists
        """
        result = tx.run(query, asn_a=asn_a, asn_b=asn_b)
        record = result.single()
        if record and record["link_exists"] > 0:
            valid_links += 1
    return valid_links == expected_links

def mitigate_hijack(prefix: str):
    print(f"\n[MITIGATION TRIGGERED] Deploying counter-measures for {prefix} via Router A...")
    command = 'docker exec router-a vtysh -c "configure terminal" -c "ip route 10.0.0.0/26 blackhole" -c "ip route 10.0.0.64/26 blackhole" -c "router bgp 100" -c "network 10.0.0.0/26" -c "network 10.0.0.64/26" -c "end" -c "write"'
    try:
        subprocess.run(command, shell=True, check=True, capture_output=True)
        print("[MITIGATION SUCCESS] Counter-announcement deployed.\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[MITIGATION FAILED] {e.stderr}")
        return False

# Global state for automated defense
AUTO_MITIGATION = True

class MitigationToggle(BaseModel):
    enabled: bool

@app.post("/api/mitigation/toggle")
def toggle_mitigation(request: MitigationToggle):
    global AUTO_MITIGATION
    AUTO_MITIGATION = request.enabled
    state_str = "ENABLED" if AUTO_MITIGATION else "PAUSED"
    print(f"\n[SYSTEM] Automated Mitigation is now {state_str}\n")
    return {"status": "success", "auto_mitigation": AUTO_MITIGATION}

@app.get("/")
def health_check():
    return {"status": "LOCUS Engine is running"}

# The new WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/analyze")
async def analyze_route(update: BGPUpdate):
    with driver.session() as session:
        is_feasible = session.execute_read(verify_path_in_graph, update.as_path)
    
    threat_status = not is_feasible
    mitigated = False

    if threat_status:
        print(f"[ALERT] Topologically Invalid Route! Prefixes: {len(update.prefixes)} | Path: {update.as_path}")
        # Only trigger Docker if the kill switch is armed
        if AUTO_MITIGATION and update.prefixes and "10.99" in update.prefixes[0]: 
            mitigated = mitigate_hijack(update.prefixes[0])
    else:
        print(f"[OK] Route Verified - {len(update.prefixes)} Prefixes | Path: {update.as_path}")
        
    # Broadcast the live event to the Next.js dashboard
    if update.prefixes:
        event_data = {
            "type": "hijack_alert" if threat_status else "route_verified",
            "prefix": update.prefixes[0],
            "as_path": str(update.as_path),
            "mitigated": mitigated,
            "timestamp": datetime.datetime.now().strftime("%H:%M:%S")
        }
        await manager.broadcast(event_data)

    return {
        "status": "analyzed", 
        "threat_detected": threat_status,
    }