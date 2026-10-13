// test-race.js
import axios from "axios"
const url = "http://localhost:5000/api/orders";

const requestA = axios.post(
  url,
  {
    shippingAddress: {
      fullName: "Normal User",
      phone: "9999999999",
      address: "Address A",
      city: "Meerut",
      state: "UP",
      pincode: "250001",
      country: "India"
    }
  },
  {
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWEyNzIwMDNhY2E5YTc0ZjQxMTc2NDMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MDc2NzEzOSwiZXhwIjoxNzkwODUzNTM5fQ.Uq2QZDjTeWGwmGaYwwjTE8yQx900ZfMhzwCHr-sKRY0"
    }
  }
);

const requestB = axios.post(
  url,
  {
    shippingAddress: {
      fullName: "Rahul",
      phone: "8888888888",
      address: "Address B",
      city: "Meerut",
      state: "UP",
      pincode: "250001",
      country: "India"
    }
  },
  {
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWEyNzgwODNhY2E5YTc0ZjQxMTc2NDQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MDc2NzIwMCwiZXhwIjoxNzkwODUzNjAwfQ.BzW7NQKfhEX_sCGQc3c1ZPX3ry7fbFRrv8fprgTxEpk"
    }
  }
);

Promise.allSettled([requestA, requestB]).then((results) => {
  console.log("User A:", results[0]);
  console.log("User B:", results[1]);
});