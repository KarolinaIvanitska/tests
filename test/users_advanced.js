import { describe, it } from "mocha";
import supertest from "supertest";
import { expect, use } from "chai";
const request = supertest(`https://gorest.co.in/public/v2/`);
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.USER_TOKEN;
describe("Users", () => {
  let userId;
  //METHOD POST
  describe(`POST`, () => {
    it(` /users`, () => {
      const data = {
        name: "anna12@oconnell.test",
        email: `test-${Math.floor(Math.random() * 9999)}@email.ca`,
        gender: "male",
        status: "active",
      };
      return request
        .post("users")
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          // console.log(res.body);
          // expect(res.body.email).to.eq(data.email);
          // expect(res.body.status).to.eq(data.status);
          expect(res.body).to.deep.include(data);
          userId = res.body.id;
          console.log(userId);
          console.log("POST response:", res.body);
        });
    });
  });

  describe(`GET`, () => {
    // //GET ALL USERS
    it(` /users`, () => {
      return request.get(`users?access-token=${TOKEN}`).then((res) => {
        expect(res.body).to.not.be.empty;
      });
    });
    // USER BY ID
    // it(` /users/:id`, () => {
    //   return request
    //     .get(`users/${userId}?access-token=${TOKEN}`)
    //     .then((res) => {
    //       expect(res.body).to.not.be.empty;
    //     });
    // });
    //or -
    it(`  /users/:id`, () => {
      return request
        .get(`users/${userId}?access-token=${TOKEN}`)
        .then((res) => {
          expect(res.body.id).to.be.eq(userId);
        });
    });
    it(` /users with query params`, () => {
      const url = `users?access-token=${TOKEN}&gender=male&status=active`;
      return request.get(url).then((res) => {
        expect(res.body).to.not.be.empty;
        res.body.forEach((data) => {
          expect(data.gender).to.eq("male");
          expect(data.status).to.eq("active");
        });
      });
    });
  });

  describe(`PUT`, () => {
    it(`  /users/:id`, () => {
      const data = {
        name: `Penny - ${Math.floor(Math.random() * 9999)}`,
        status: "inactive",
      };
      return request
        .put(`users/${userId}`)
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          expect(res.body).to.deep.include(data);
        });
    });
  });

  describe(`DELETE`, () => {
    it(` /users/:id`, () => {
      return request
        .delete(`users/${userId}`)
        .set("Authorization", `Bearer ${TOKEN}`)
        .then((res) => {
          expect(res.body).to.not.be.eq(null);
        });
    });
  });
});
