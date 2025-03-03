import { describe, it } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
const request = supertest(`https://gorest.co.in/public/v2/`);
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.USER_TOKEN;
describe("Users", () => {
  //GET ALL USERS
  it("GET /users", () => {
    request.get(`users?access-token=${TOKEN}`).end((err, res) => {
      expect(res.body).to.not.be.empty;
      done();
    });
  });
  // or next examle (same functionality)
  // return request.get(`users?access-token=${TOKEN}`).then((res) => {
  //   expect(res.body).to.not.be.empty;
  // });

  //GET USER BY ID
  it("GET /users/:id", () => {
    return request.get(`users/7733657?access-token=${TOKEN}`).then((res) => {
      expect(res.body).to.not.be.empty;
    });
  });
  //or -
  it("GET /users/:id", () => {
    return request.get(`users/7733657?access-token=${TOKEN}`).then((res) => {
      expect(res.body.data.id).to.be.eq(7733657);
      //     TypeError: Cannot read properties of undefined (reading 'id')
    });
  });
  //GET USER WITH QUERY PARAMS
  it("GET /users with query params", () => {
    const url = `users?access-token=${TOKEN}&gender=male&status=active`;
    return request.get(url).then((res) => {
      expect(res.body).to.not.be.empty;
      res.body.forEach((data) => {
        expect(data.gender).to.eq("male");
        expect(data.status).to.eq("active");
      });
    });
  });
  // METHOD POST
  it("POST /users", () => {
    const data = {
      name: "Ms. Anna",
      email: "anna12@oconnell.test",
      gender: "male",
      status: "active",
    };
    return request
      .post("users")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(data)
      .then((res) => {
        console.log(res.body);
        expect(res.body.email).to.eq(data.email);
        expect(res.body.status).to.eq(data.status);
      });
  });
  // PUT METHOD
  it("PUT /users/:id", () => {
    const data = {
      name: "Ms. Penny",
      status: "inactive",
    };
    return request
      .put(`users/7734324`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(data)
      .then((res) => {
        console.log(res.body);
        expect(res.body).to.deep.include(data);
      });
  });
  //DELETE METHOD
  it(`DELETE /users/:id`, () => {
    return request
      .delete(`users/7734325`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .then((res) => {
        console.log(res.body);
        expect(res.body).to.be.eq(null);
      });
  });
});
