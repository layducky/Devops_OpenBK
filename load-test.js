/**
 * K6 Load Test - OpenBK
 * Test sức chịu tải tối đa của trang web openbk.me
 *
 * Chạy: k6 run load-test.js
 * Hoặc với URL khác: k6 run -e BASE_URL=https://localhost load-test.js
 */

import http from "k6/http";
import { check, sleep } from "k6";

// Cấu hình từ biến môi trường hoặc mặc định
const BASE_URL = __ENV.BASE_URL || "https://openbk.me";

export const options = {
  scenarios: {
    // Kịch bản 1: Ramp-up từ 0 lên 50 VU trong 2 phút, giữ 2 phút
    ramp_up: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 300 },
        { duration: "2m", target: 300 },
      ],
      startTime: "0s",
      gracefulRampDown: "30s",
      exec: "loadTest",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],  // 95% request < 1s
  },
};

export function loadTest() {
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, { "homepage OK": (r) => r.status === 200 });

  const coursesRes = http.get(`${BASE_URL}/api/v1/course/public/`);
  check(coursesRes, { "API courses OK": (r) => r.status === 200 });

  const categoriesRes = http.get(`${BASE_URL}/api/v1/course/public/categories`);
  check(categoriesRes, { "API categories OK": (r) => r.status === 200 });

  sleep(1);
}
