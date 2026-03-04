import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "https://openbk.me";

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 1000 }, // ~300 RPS
        { duration: "1m", target: 2000 }, // ~600 RPS (ngưỡng hiện tại)
        { duration: "1m", target: 3000 }, // ~900 RPS
        { duration: "1m", target: 4000 }, // ~1200 RPS (stress mạnh)
        { duration: "2m", target: 0 },   // ramp-down
      ],
      gracefulRampDown: "1m",
      exec: "stressTest",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],        // Cho phép nhiều lỗi hơn chút khi stress
    http_req_duration: ["p(95)<1500"],     // P95 < 1.5s dưới tải cao
  },
};

export function stressTest() {
  const res = http.get(`${BASE_URL}/api/v1/course/public/`);
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
