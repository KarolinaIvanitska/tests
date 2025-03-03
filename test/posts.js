import { expect } from "chai";
import { createRandomUserWithFaker } from "../helper/user_helper.js";
import request from "../config/common.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.USER_TOKEN;

describe(`User posts`, () => {
  let postId, userId;
  before(async () => {
    // userId = await createRandomUser();
    userId = await createRandomUserWithFaker();
  });
  it(`/posts`, async () => {
    const data = {
      user_id: userId,
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    };
    const postRes = await request
      .post(`posts`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(data);
    // console.log(postRes.body);

    expect(postRes.body).to.deep.include(data);
    postId = postRes.body.id;
  });
  it(`GET /post/:id`, async () => {
    await request
      .get(`posts/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .expect(200);
  });

  describe("Negative Tests", () => {
    it("401 Authentification Failed", async () => {
      const data = {
        user_id: userId,
        title: `Title`,
        body: `Body`,
      };
      const postRes = await request.post(`posts`).send(data);
      expect(postRes.status).to.eq(401);
      expect(postRes.body.message).to.eq("Authentication failed");
    });
    it("422 Validation Failed", async () => {
      const data = {
        user_id: userId,
        title: `Title`,
      };
      const postRes = await request
        .post(`posts`)
        .send(data)
        .set("Authorization", `Bearer ${TOKEN}`);

      expect(postRes.status).to.eq(422);
      expect(postRes.body[0].field).to.eq("body");
      expect(postRes.body[0].message).to.eq("can't be blank");
    });
  });
});
