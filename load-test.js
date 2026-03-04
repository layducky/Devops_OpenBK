import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "https://openbk.me";

export const options = {
  scenarios: {
    ramp_up: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 1000 },
        { duration: "2m", target: 2000 }, // giữ ~600 RPS
        { duration: "1m", target: 0 },   // ramp-down
      ],
      startTime: "0s",
      gracefulRampDown: "1m",
      exec: "loadTest",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], 
    http_req_duration: ["p(95)<800"],
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
