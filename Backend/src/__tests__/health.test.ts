import request from "supertest";
import app from "./testApp";
import { test, expect } from 'vitest';

test("GET /health should return 200 OK", async () => {
  const response = await request(app).get("/health");
  expect(response.status).toBe(200);
});


