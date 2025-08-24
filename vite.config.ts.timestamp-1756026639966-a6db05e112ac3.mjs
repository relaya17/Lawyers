// vite.config.ts
import { defineConfig } from "file:///C:/Users/user/Documents/GitHub/lawyer/node_modules/.pnpm/vite@5.4.19_@types+node@24.3.0_terser@5.43.1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/user/Documents/GitHub/lawyer/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__c3fd3d13af50576817a0e432ea88c9ff/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import tsconfigPaths from "file:///C:/Users/user/Documents/GitHub/lawyer/node_modules/.pnpm/vite-tsconfig-paths@5.1.4_t_a4519bfa8cb88556dad70280f7caf7e5/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\user\\Documents\\GitHub\\lawyer";
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "src/shared/src")
    }
  },
  server: {
    port: 5174,
    host: true,
    strictPort: true,
    hmr: {
      port: 5174,
      host: "localhost"
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          utils: ["axios", "date-fns", "zod"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbGF3eWVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbGF3eWVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy91c2VyL0RvY3VtZW50cy9HaXRIdWIvbGF3eWVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwgdHNjb25maWdQYXRocygpXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXHJcbiAgICAgICAgICAgIFwiQHNoYXJlZFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zaGFyZWQvc3JjXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgcG9ydDogNTE3NCxcclxuICAgICAgICBob3N0OiB0cnVlLFxyXG4gICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICAgICAgaG1yOiB7XHJcbiAgICAgICAgICAgIHBvcnQ6IDUxNzQsXHJcbiAgICAgICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICAgICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgbXVpOiBbJ0BtdWkvbWF0ZXJpYWwnLCAnQG11aS9pY29ucy1tYXRlcmlhbCddLFxyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzOiBbJ2F4aW9zJywgJ2RhdGUtZm5zJywgJ3pvZCddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsb0JBQW9CO0FBQzFVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFIMUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNsQyxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDbEMsV0FBVyxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsSUFDdkQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDRCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDVjtBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWM7QUFBQSxVQUNWLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixLQUFLLENBQUMsaUJBQWlCLHFCQUFxQjtBQUFBLFVBQzVDLE9BQU8sQ0FBQyxTQUFTLFlBQVksS0FBSztBQUFBLFFBQ3RDO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
