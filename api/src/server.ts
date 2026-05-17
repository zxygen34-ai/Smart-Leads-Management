import { createApp } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';

async function start(): Promise<void> {
  await connectDb();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
