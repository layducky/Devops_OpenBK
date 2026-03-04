/**
 * K6 Stress Test - Tìm ngưỡng chịu tải tối đa
 * Tăng dần VUs cho đến khi hệ thống bắt đầu lỗi
 *
 * Chạy: k6 run load-test-stress.js
 */

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "https://openbk.me";

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 150 },
        { duration: "1m", target: 300 },
        { duration: "1m", target: 450 },
        { duration: "1m", target: 600 },
        { duration: "1m", target: 750 },
        { duration: "1m", target: 900 },
      ],
      gracefulRampDown: "1m",
      exec: "stressTest",
    },
  },
};

export function stressTest() {
  const res = http.get(`${BASE_URL}/api/v1/course/public/`);
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(0.5);
}
