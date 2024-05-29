import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import viteTsconfigPaths from "vite-tsconfig-paths"
import { resolve } from "path"

export default defineConfig({
  // depending on your application, base can also be "/"
  base: process.env.VITE_APP_BASE_NAME,
  plugins: [react(), viteTsconfigPaths()],
  define: {
    global: "window",
  },
  resolve: {
    alias: [
      // { find: '', replacement: path.resolve(__dirname, 'src') },
      // {
      //   find: /^~(.+)/,
      //   replacement: path.join(process.cwd(), 'node_modules/$1')
      // },
      // {
      //   find: /^src(.+)/,
      //   replacement: path.join(process.cwd(), 'src/$1')
      // }
      // {
      //   find: 'assets',
      //   replacement: path.join(process.cwd(), 'src/assets')
      // },
      { find: "assets", replacement: resolve(__dirname, "./src/assets") },
      { find: "contexts", replacement: resolve(__dirname, "./src/contexts") },
      { find: "routes", replacement: resolve(__dirname, "./src/routes") },
      { find: "themes", replacement: resolve(__dirname, "./src/themes") },
      {
        find: "components",
        replacement: resolve(__dirname, "./src/components"),
      },
      { find: "data", replacement: resolve(__dirname, "./src/data") },
      { find: "utils", replacement: resolve(__dirname, "./src/utils") },
      { find: "hooks", replacement: resolve(__dirname, "./src/hooks") },
      { find: "hooks", replacement: resolve(__dirname, "./src/hooks") },
      { find: "layout", replacement: resolve(__dirname, "./src/layout") },
      { find: "pages", replacement: resolve(__dirname, "./src/pages") },
      { find: "types", replacement: resolve(__dirname, "./src/types") },
      { find: "api", replacement: resolve(__dirname, "./src/api") },
      { find: "sections", replacement: resolve(__dirname, "./src/sections") },
      {
        find: "menu-items",
        replacement: resolve(__dirname, "./src/menu-items"),
      },
      { find: "config", replacement: resolve(__dirname, "./src/config.ts") },
    ],
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
})
