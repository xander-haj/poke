import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'pokemeta' to your actual repository name for GitHub Pages!
  // If your repo is named 'pokemon-builder', this should be '/pokemon-builder/'
  base: '/poke/', 
})