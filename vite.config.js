import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/anime_wordle/",
  build: {
    rollupOptions: {
      input: {
        main:       "index.html",
        ...(process.env.NODE_ENV !== "production" && {
          backoffice: "backoffice.html",
        }),
      },
    },
  },
});
