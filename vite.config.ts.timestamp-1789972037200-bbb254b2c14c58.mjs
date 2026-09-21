// vite.config.ts
import { defineConfig } from "file:///Y:/Shubham%20Vs%20Code/Projects/JanSahay/node_modules/vite/dist/node/index.js";
import react from "file:///Y:/Shubham%20Vs%20Code/Projects/JanSahay/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///Y:/Shubham%20Vs%20Code/Projects/JanSahay/vite.config.ts";
var vite_config_default = defineConfig(({ command }) => ({
  /*
   * Local development:
   *   http://localhost:5173/
   *
   * GitHub Pages production build:
   *   https://<username>.github.io/JanSahay/
   */
  base: command === "build" ? "/JanSahay/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJZOlxcXFxTaHViaGFtIFZzIENvZGVcXFxcUHJvamVjdHNcXFxcSmFuU2FoYXlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIlk6XFxcXFNodWJoYW0gVnMgQ29kZVxcXFxQcm9qZWN0c1xcXFxKYW5TYWhheVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vWTovU2h1YmhhbSUyMFZzJTIwQ29kZS9Qcm9qZWN0cy9KYW5TYWhheS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+ICh7XG4gIC8qXG4gICAqIExvY2FsIGRldmVsb3BtZW50OlxuICAgKiAgIGh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9cbiAgICpcbiAgICogR2l0SHViIFBhZ2VzIHByb2R1Y3Rpb24gYnVpbGQ6XG4gICAqICAgaHR0cHM6Ly88dXNlcm5hbWU+LmdpdGh1Yi5pby9KYW5TYWhheS9cbiAgICovXG4gIGJhc2U6IGNvbW1hbmQgPT09ICdidWlsZCcgPyAnL0phblNhaGF5LycgOiAnLycsXG5cbiAgcGx1Z2luczogW3JlYWN0KCldLFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxvQkFBb0I7QUFDdlUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZSxXQUFXO0FBRm9KLElBQU0sMkNBQTJDO0FBS3hPLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsUUFBUSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVE1QyxNQUFNLFlBQVksVUFBVSxlQUFlO0FBQUEsRUFFM0MsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBRWpCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
