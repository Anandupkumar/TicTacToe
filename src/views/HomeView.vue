<script setup>
import { computed, ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
// import firebase from 'firebase/app';
// import 'firebase/database';

import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const instance = getCurrentInstance();

const currentPlayer = ref({
  name: "",
  value: "X"
})
const board = ref(Array(9).fill(''));
const winner = ref(null)
const nameArr = ref()

const currUser = ref('')
// const allUsers = ref([])
const teamName = ref("")

const isBoardFull = computed(() => Array.isArray(board.value) && board.value.every((cell) => cell !== ''));

const teamRef = firebase.database().ref('teams');
var gameRef = null

onMounted(() => {
  if (localStorage.getItem("xox_user") != null && localStorage.getItem("teamName") != null) {
    currUser.value = JSON.parse(localStorage.getItem('xox_user'));
    teamName.value = JSON.parse(localStorage.getItem('teamName'));
    nameArr.value = teamName.value.split("-")
    currentPlayer.value.name = nameArr.value[0]

    // return false
  } else {
    instance.proxy.$router.push('/');
  }

  teamRef.on('value', (snap) => {
    const allTeams = snap.val();
    if (allTeams && allTeams.hasOwnProperty(teamName.value)){
      gameRef = teamRef.child(teamName.value);
      updateGameState();

      // Listen for changes in the game state
      gameRef.on('value', (snapshot) => {
        const gameState = snapshot.val();

        if (gameState) {
          currentPlayer.value = gameState.currentPlayer;
          board.value = gameState.board ? gameState.board : Array(9).fill('');
          winner.value = gameState.winner ? gameState.winner : null;
          // let tempUsers = gameState.users;
          // let currIndex = tempUsers.indexOf(currUser.value)

          // // Remove current user from the array
          // if (currIndex !== -1) {
          //   tempUsers.splice(currIndex, 1);
          // }
          // allUsers.value = tempUsers
        }
      });

    } else {
      instance.proxy.$router.push('/');
    }
    
  })

});

onBeforeUnmount(() => {
  // let users = allUsers.value
  // gameRef.set({
  //   users
  // })
})

const handleCellClick = (index) => {

  if (currentPlayer.value.name === currUser.value) {
    if (!board.value[index] && !winner.value) {
      board.value[index] = currentPlayer.value.value;
      checkForWinner();
      currentPlayer.value.value = currentPlayer.value.value === 'X' ? 'O' : 'X';
      currentPlayer.value.name = currentPlayer.value.name === nameArr.value[0] ? nameArr.value[1] : nameArr.value[0];

      // Update the game state in Firebase
      updateGameState();
    }
  } else {
    alert("No ! Its not your turn bro.")
  }
}

const checkForWinner = () => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) {
      winner.value = currentPlayer.value.name;
      return;
    }
  }

  if (isBoardFull.value) {
    winner.value = 'Draw';
  }
}

const resetGame = () => {
  currentPlayer.value.value = 'X';
  currentPlayer.value.name = nameArr.value[0]
  board.value = Array(9).fill('');
  winner.value = null;

  // Reset the game state in Firebase
  updateGameState();
}

const updateGameState = () => {
  gameRef.set({
    currentPlayer: currentPlayer.value,
    board: board.value,
    winner: winner.value,
  });
};

</script>

<template>
  <main>
    <div v-if="winner" class="message">{{ winner === currUser ? 'You' : winner }} wins!</div>
    <div v-else-if="isBoardFull" class="message">It's a draw!</div>
    <div v-else class="message">{{ currentPlayer.name === currUser ? 'Your': currentPlayer.name }}'s turn</div>

    <div class="board">
      <div v-for="(cell, index) in board" :key="index" @click="handleCellClick(index)">
        {{ cell }}
      </div>
    </div>

    <button v-if="winner" @click="resetGame">Restart Game</button>
  </main>
</template>

<style>
.board {
  display: grid;
  grid-template-columns: repeat(3, 110px);
  grid-gap: 5px;
  margin-bottom: 30px;
}

.board div {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  height: 110px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.message {
  font-size: 1.5em;
  margin: 20px 0;
}

button {
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
}
</style>