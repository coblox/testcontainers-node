import fetch from "node-fetch";
import { GenericContainer } from "./generic-container";

describe("GenericContainer", () => {
  jest.setTimeout(45000);

  it("should wait until container is ready", async () => {
    const container = await new GenericContainer("cristianrgreco/testcontainer", "1.1.7")
      .withExposedPorts(8080)
      .start();

    const url = `http://${container.getContainerIpAddress()}:${container.getMappedPort(8080)}`;
    const response = await fetch(`${url}/hello-world`);
    expect(response.status).toBe(200);

    await container.stop();
    await expect(fetch(url)).rejects.toThrowError();
  });

  it("should set environment variables", async () => {
    const container = await new GenericContainer("cristianrgreco/testcontainer", "1.1.7")
      .withEnv("customKey", "customValue")
      .withExposedPorts(8080)
      .start();

    const url = `http://${container.getContainerIpAddress()}:${container.getMappedPort(8080)}`;
    const response = await fetch(`${url}/env`);
    const responseBody = await response.json();
    expect(responseBody.customKey).toBe("customValue");

    await container.stop();
  });

  it("should work for mysql", async () => {
    const container = await new GenericContainer("mysql")
      .withEnv("MYSQL_ROOT_PASSWORD", "my-root-pw")
      .withExposedPorts(3306)
      .start();

    await container.stop();
  });

  it("should work for couch db", async () => {
    const container = await new GenericContainer("couchdb").withExposedPorts(5984).start();

    await container.stop();
  });
});
