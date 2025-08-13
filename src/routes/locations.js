import express from "express";
import { db } from "../db.js";
import { countries, states, cities } from "../schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// Get all countries
router.get("/countries", async (req, res) => {
  try {
    const allCountries = await db.select().from(countries);
    res.json(allCountries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get states by country id
router.get("/states/:countryId", async (req, res) => {
  try {
    const countryId = Number(req.params.countryId);
    const statesByCountry = await db.select().from(states).where(eq(states.country_id, countryId));
    res.json(statesByCountry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cities by state id
router.get("/cities/:stateId", async (req, res) => {
  try {
    const stateId = Number(req.params.stateId);
    const citiesByState = await db.select().from(cities).where(eq(cities.state_id, stateId));
    res.json(citiesByState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
