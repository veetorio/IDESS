import http from "k6/http";
import { check } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const response = http.get(`${baseUrl}/eventos?page=0&size=20`);
  check(response, {
    "lista de eventos responde HTTP 200": (res) => res.status === 200,
    "resposta contém lista paginada": (res) => {
      try {
        return Array.isArray(res.json("content"));
      } catch {
        return false;
      }
    },
  });
}
