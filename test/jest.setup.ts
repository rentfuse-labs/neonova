import "isomorphic-unfetch";
import nock from "nock";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

afterAll(() => {
  nock.cleanAll();
  nock.restore();
});
