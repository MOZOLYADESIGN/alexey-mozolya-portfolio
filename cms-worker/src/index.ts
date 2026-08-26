import { createCmsApp } from "./cms.ts";
import { GitHubClient } from "./github.ts";
import { assertEnvironment } from "./security.ts";
import { CmsStateDurableObject, DurableStateStore } from "./state.ts";
import { TelegramClient } from "./telegram.ts";
import type { CmsEnvironment, ExecutionContextLike } from "./types.ts";

export { CmsStateDurableObject };

export default {
  fetch(request: Request, env: CmsEnvironment, _context: ExecutionContextLike) {
    assertEnvironment(env);
    const app = createCmsApp({
      env,
      github: new GitHubClient(env),
      telegram: new TelegramClient(env),
      state: new DurableStateStore(env.CMS_STATE),
    });
    return app.fetch(request);
  },
};
