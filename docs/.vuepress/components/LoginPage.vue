<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2>登录</h2>
      <div class="form-item">
        <input v-model="username" placeholder="用户名" />
      </div>
      <div class="form-item">
        <input v-model="password" type="password" placeholder="密码" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/')
    } else {
      error.value = data.message || '用户名或密码错误'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}
.login-box {
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  width: 300px;
}
h2 {
  text-align: center;
  margin-bottom: 24px;
}
.form-item {
  margin: 16px 0;
}
input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
button {
  width: 100%;
  padding: 10px;
  background: #3eaf7c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 8px;
}
button:hover { background: #2c9e6a; }
button:disabled { background: #aaa; cursor: not-allowed; }
.error {
  color: red;
  font-size: 13px;
  text-align: center;
}
</style>