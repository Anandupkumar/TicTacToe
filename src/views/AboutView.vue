<script setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue";

import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const instance = getCurrentInstance();

const user_name = ref("")
const allUsers = ref([])
const user = ref()

const gameRef = firebase.database().ref('game');

onMounted(() => {
  if (localStorage.getItem("xox_user") != null) {
    instance.proxy.$router.push('/selectOponent');
  }

  gameRef.on('value', (snapshot) => {

    const gameState = snapshot.val();

    if (gameState) {
      allUsers.value = gameState.users;
      // console.log(allUsers.value);
    }
  });

})

const registerUser = () => {
  if (user_name.value !== '') {

    let currIndex = allUsers.value.indexOf(user_name.value)

    // Remove current user from the array
    if (currIndex !== -1) {
      // $router.push('/about');
      instance.proxy.$router.push('/selectOponent');
    } else {

      allUsers.value.push(user_name.value)
      let users = allUsers.value

      gameRef.set({
        users
      })
      localStorage.setItem('xox_user', JSON.stringify(user_name.value))
      instance.proxy.$router.push('/selectOponent');
    }
  } else {
    alert("enter name")
  }
}

</script>

<template>
  <div class="about">
    <div class="registration-container">
      <h1>Register</h1>
      <br>
      <div class="registration-form">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="user_name" required />
        <button type="submit" @click="registerUser">Register</button>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.registration-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.registration-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input {
  padding: 8px;
  margin-bottom: 16px;
}

button {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
