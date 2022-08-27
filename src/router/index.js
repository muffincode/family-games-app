/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import CreateGame from '../views/CreateGame.vue'

import axios from "axios";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/game/:code',
    name: 'game',
    component: Game
  },
  {
    path: '/create',
    name: 'create',
    component: CreateGame
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
