package main

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

var httpClient = &http.Client{
	Transport: &http.Transport{
		MaxConnsPerHost:     50,
		MaxIdleConns:        50,
		MaxIdleConnsPerHost: 50,
		IdleConnTimeout:     90 * time.Second,
	},
}

type RisMessage struct {
	Type string  `json:"type"`
	Data RisData `json:"data"`
}

type RisData struct {
	Timestamp     float64 `json:"timestamp"`
	Path          []int   `json:"path,omitempty"`
	Announcements []struct {
		Prefixes []string `json:"prefixes"`
	} `json:"announcements,omitempty"`
}

// EnginePayload defines the JSON structure sent to FastAPI
type EnginePayload struct {
	Prefixes []string `json:"prefixes"`
	ASPath   []int    `json:"as_path"`
}

func main() {
	ctx := context.Background()

	// 1. Connect to Neo4j
	dbUri := "bolt://127.0.0.1:7687"
	driver, err := neo4j.NewDriverWithContext(dbUri, neo4j.BasicAuth("neo4j", "locus-admin", ""))
	if err != nil {
		log.Fatal("Neo4j connection error:", err)
	}
	defer driver.Close(ctx)
	log.Println("Connected to Neo4j knowledge graph.")

	// 2. Connect to RIPE RIS WebSocket
	wsUrl := "wss://ris-live.ripe.net/v1/ws/"
	c, _, err := websocket.DefaultDialer.Dial(wsUrl, nil)
	if err != nil {
		log.Fatal("WebSocket error:", err)
	}
	defer c.Close()

	subMsg := map[string]interface{}{
		"type": "ris_subscribe",
		"data": map[string]string{"host": "rrc21", "type": "UPDATE"},
	}
	msgBytes, _ := json.Marshal(subMsg)
	c.WriteMessage(websocket.TextMessage, msgBytes)
	log.Println("Listening for BGP updates to map in Neo4j...")

	bgpStream := make(chan []byte, 10000)
	go func() {
		for message := range bgpStream {
			var msg RisMessage
			if err := json.Unmarshal(message, &msg); err != nil {
				continue
			}

			// Ensure the path has at least two ASNs and contains announcements
			if msg.Type == "ris_message" && len(msg.Data.Path) > 1 && len(msg.Data.Announcements) > 0 {
				// 1. Neo4j Mapping
				for i := 0; i < len(msg.Data.Path)-1; i++ {
					asnA := msg.Data.Path[i]
					asnB := msg.Data.Path[i+1]
					if asnA == asnB {
						continue
					}

					query := `MERGE (a:ASN {asn: $asnA}) MERGE (b:ASN {asn: $asnB}) MERGE (a)-[:ROUTES_TO]->(b)`
					params := map[string]any{"asnA": asnA, "asnB": asnB}

					session := driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
					_, err := session.Run(ctx, query, params)
					session.Close(ctx)

					if err != nil {
						log.Println("Neo4j write error:", err)
					}
				}

				// 2. Forward to Python Engine (Batched)
				for _, ann := range msg.Data.Announcements {
					if len(ann.Prefixes) > 0 {
						payload := EnginePayload{
							Prefixes: ann.Prefixes,
							ASPath:   msg.Data.Path,
						}
						jsonData, _ := json.Marshal(payload)

						// Use the shared client and release the response body for connection reuse.
						go func(data []byte) {
							resp, err := httpClient.Post("http://127.0.0.1:8000/analyze", "application/json", bytes.NewBuffer(data))
							if err != nil {
								log.Println("API connection error:", err)
								return
							}
							resp.Body.Close()
						}(jsonData)
					}
				}
				log.Printf("Mapped and Sent AS-Path: %v\n", msg.Data.Path)
			}

			time.Sleep(5 * time.Millisecond)
		}
	}()

	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}

		select {
		case bgpStream <- message:
		default:
			log.Println("Warning: Buffer full, dropping BGP update")
		}
	}
}