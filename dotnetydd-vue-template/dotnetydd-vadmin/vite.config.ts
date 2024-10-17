import * as path from "path";
import { defineConfig } from "vite";
import { include } from "./build/optimize";
import { pathResolve } from "./configs/tools";
import { getPluginsList } from "./configs/vitePlugins";


const root: string = process.cwd();


// https://vitejs.dev/config/
export default defineConfig({
  root,
  resolve: {
    //设置别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@configs": path.resolve(__dirname, "./configs"),
    },
  },
  plugins: getPluginsList(),
  optimizeDeps: {
    include
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  build: {
    target: "es2015",
    sourcemap: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: {
        index: pathResolve("./index.html", import.meta.url)
      },
      // 静态资源分类打包
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]"
      }
    }
  },
  server: {
    // 项目启动时，是否在浏览器中在打开应用城区
    open: true,
    //启动端口
    port: 8080,
    // 热模块替换
    hmr: {
      port: 8080,
    },
    warmup: {
      clientFiles: ["./index.html", "./src/{views,components}/*"]
    },
    // 设置 https 代理
    proxy: {
      "/api": {
        target: "你的http地址",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
