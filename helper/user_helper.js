import supertest from "supertest";
import { faker } from "@faker-js/faker";
const request = supertest(`https://gorest.co.in/public/v2/`);
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.USER_TOKEN;
export const createRandomUser = async () => {
  const userData = {
    name: "anna12@oconnell.test",
    email: `test-${Math.floor(Math.random() * 9999)}@email.ca`,
    gender: "male",
    status: "active",
  };
  const res = await request
    .post("users")
    .set("Authorization", `Bearer ${TOKEN}`)
    .send(userData);
  return res.body.id;
};
export const createRandomUserWithFaker = async () => {
  const userData = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    gender: "male",
    status: "active",
  };
  const res = await request
    .post("users")
    .set("Authorization", `Bearer ${TOKEN}`)
    .send(userData);
  console.log(res.body);

  return res.body.id;
};
