from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="LOCUS Neuro-Symbolic Engine")

# Update to accept a batch of prefixes
class BGPUpdate(BaseModel):
    prefixes: List[str]
    as_path: List[int]

@app.get("/")
def health_check():
    return {"status": "LOCUS Engine is running"}

@app.post("/analyze")
def analyze_route(update: BGPUpdate):
    # Now handles the entire batch of prefixes at once
    print(f"Received Batch - {len(update.prefixes)} Prefixes | Path: {update.as_path}")
    return {"status": "analyzed", "threat_detected": False}