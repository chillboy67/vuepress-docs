import { defineClientConfig } from 'vuepress/client'
import LoginPage from './components/LoginPage.vue'

export default defineClientConfig({
  enhance({ app, router }) {
    app.component('LoginPage', LoginPage)

    router.beforeEach((to) => {
      if (typeof localStorage === 'undefined') return
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      if (!isLoggedIn && to.path !== '/login.html') {
        return '/login.html'
      }
    })
  }
})