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

/**
 * Mapping gần đúng:
 * - Mỗi VU trong loadTest thực hiện ~3 request (home + 2 API) rồi sleep(1s),
 *   nên với 200 VU sẽ xấp xỉ ~600 RPS nếu server phản hồi nhanh.
 */
export const options = {
  scenarios: {
    // Kịch bản load ổn định quanh ~600 RPS
    ramp_up: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 100 }, // warm-up ~300 RPS
        { duration: "2m", target: 200 }, // giữ ~600 RPS
        { duration: "3m", target: 200 }, // soak ở ~600 RPS
        { duration: "2m", target: 0 },   // ramp-down
      ],
      startTime: "0s",
      gracefulRampDown: "1m",
      exec: "loadTest",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // < 1% lỗi
    http_req_duration: ["p(95)<800"], // 95% request < 800ms ở ~600 RPS
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
