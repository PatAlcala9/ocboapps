import { fileRoutes } from 'filesystem-routing/vite'
import { defineConfig, lazyPlugins } from 'vite-plus'
import solid from '@solidjs/vite-plugin'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  fmt: {
    allowed: true,
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxSingleQuote: true,
    printWidth: 320,
    tabWidth: 2,
    proseWrap: 'preserve',
    insertFinalNewline: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  resolve: {
    tsconfigPaths: true,
  },
  // Turnkey client mode: no index.html and no mount file — the plugin generates
  // the entries around src/App.tsx (wrapped in src/Document.tsx) and `vite build`
  // prerenders the shell into a purely static dist/client.
  plugins: lazyPlugins(() => [
    // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
    // modules the fileRoutes plugin emits (their ids end in a query string).
    solid({ start: { node: true }, ssr: true, extensions: ['.jsx', '.tsx'], diagnostics: false }),
    fileRoutes({ types: true }),
    compression({
      algorithms: ['brotliCompress'],
    }),
  ]),
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // if you have few tests, try commenting this
    // out to improve performance:
    isolate: false,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
})