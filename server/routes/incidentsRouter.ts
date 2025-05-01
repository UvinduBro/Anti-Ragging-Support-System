import express from "express";
import { createIncident, getIncidentById, getIncidents } from "../app/incidents";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const incident = await getIncidentById(id);
  res.json(incident);
});

router.get("/", async (req, res) => {
  try {
    const incidents = await getIncidents();
    res.json(incidents);
  } catch (error) {
    console.error("Error in incidents route:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

router.post("/", async (req, res) => {
  try {
    const incident = await createIncident(req.body);
    res.json(incident);
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

export default router;
