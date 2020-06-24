import { OreeganoWsApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export {OreeganoWsApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new OreeganoWsApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
