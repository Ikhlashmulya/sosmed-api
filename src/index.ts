import { serve } from '@hono/node-server'
import { web } from './application/web'

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: web.fetch,
  port
});
