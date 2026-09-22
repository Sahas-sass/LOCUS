from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from neo4j import GraphDatabase
import subprocess

app = FastAPI(title="LOCUS Neuro-Symbolic Engine")

NEO4J_URI = "neo4j://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "locus-admin"
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

class BGPUpdate(BaseModel):
    prefixes: List[str]
    as_path: List[int]

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
    # Execute the longest-prefix match counter-measure against the Docker container
    command = 'docker exec router-a vtysh -c "configure terminal" -c "ip route 10.0.0.0/26 blackhole" -c "ip route 10.0.0.64/26 blackhole" -c "router bgp 100" -c "network 10.0.0.0/26" -c "network 10.0.0.64/26" -c "end" -c "write"'
    try:
        subprocess.run(command, shell=True, check=True, capture_output=True)
        print("[MITIGATION SUCCESS] Counter-announcement deployed.\n")
    except subprocess.CalledProcessError as e:
        print(f"[MITIGATION FAILED] {e.stderr}")

@app.get("/")
def health_check():
    return {"status": "LOCUS Engine is running"}

@app.post("/analyze")
def analyze_route(update: BGPUpdate):
    with driver.session() as session:
        is_feasible = session.execute_read(verify_path_in_graph, update.as_path)

    threat_status = not is_feasible

    if threat_status:
        print(f"[ALERT] Topologically Invalid Route! Prefixes: {len(update.prefixes)} | Path: {update.as_path}")
        # Trigger the automated response. (Filtering for our test prefix to avoid spamming the router)
        if update.prefixes and "10.99" in update.prefixes[0]: 
            mitigate_hijack(update.prefixes[0])
    else:
        print(f"[OK] Route Verified - {len(update.prefixes)} Prefixes | Path: {update.as_path}")

    return {
        "status": "analyzed", 
        "threat_detected": threat_status,
    }