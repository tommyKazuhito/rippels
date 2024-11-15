import { existsSync, readFileSync } from 'node:fs';

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const { VITE_DEV_PORT } = loadEnv(mode, process.cwd());

  return {
    root: 'src',
    resolve: {
      alias: {
        '@root/': `${__dirname}/`,
        '@public/': `${__dirname}/public/`,
        '~/': `${__dirname}/src/`,
      },
    },
    server: {
      host: '0.0.0.0',
      port: VITE_DEV_PORT ? Number(VITE_DEV_PORT) : 5173,
      https:
        existsSync(`./certs/server.crt`) && existsSync(`./certs/server.key`)
          ? {
              cert: readFileSync(`./certs/server.crt`),
              key: readFileSync(`./certs/server.key`),
            }
          : undefined,
      open: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});
