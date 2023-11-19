<script setup>
import { computed, ref, onMounted, getCurrentInstance, onBeforeUnmount } from "vue";

import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import Swal from "sweetalert2";

const instance = getCurrentInstance();

const allUsers = ref([])
const currUser = ref('')
const inviteRequests = ref()
const intervalId = ref()
const userList = ref([
    'John Doe',
    'Jane Doe',
])
const teamName = ref("")

const gameRef = firebase.database().ref('game');
const inviteRequestsRef = firebase.database().ref('invite_requests');
const teamsRef = firebase.database().ref('teams');

onMounted(() => {

    if (localStorage.getItem("xox_user") != null) {
        currUser.value = JSON.parse(localStorage.getItem('xox_user'));
    } else {
        instance.proxy.$router.push('/');
    }

    gameRef.on('value', (snapshot) => {
        const gameState = snapshot.val();
        if (gameState) {
            let tempUsers = gameState.users;
            let currIndex = tempUsers.indexOf(currUser.value)

            // Remove current user from the array
            if (currIndex !== -1) {
                tempUsers.splice(currIndex, 1);
            } else {
                updateUserList()
            }
            allUsers.value = tempUsers
            // checkForInvites(gameState.invite_requests);

        }
    });

    inviteRequestsRef.on('value', (snap) => {
        const gameStat = snap.val();
        if (gameStat) {
            // let tempUsers = gameStat.users;
            checkForInvites(gameStat);

        }
    })

    // checkForInvites();
    // intervalId.value = setInterval(checkForInvites, 3000);
})

const checkForInvites = (req) => {
    inviteRequests.value = req;
    
    if (inviteRequests.value !== undefined) {
        let allRequests = inviteRequests.value
        
        if (allRequests.hasOwnProperty(currUser.value) && inviteRequests.value[currUser.value].is_accepted == 0) {
            Swal.fire({
                title: 'You have an invaite from ' + inviteRequests.value[currUser.value].from,
                text: 'Do you want to join ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2a8c00',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then(async (result) => {
                
                if (result.isConfirmed) {

                    teamName.value = currUser.value + '-' + inviteRequests.value[currUser.value].from;

                    localStorage.setItem('teamName', JSON.stringify(teamName.value))

                    // Create an object with the dynamic key
                    let teamData = {};
                    teamData[teamName.value] = '';

                    // Set the data in the database
                    teamsRef.set(teamData)

                    inviteRequestsRef.child(currUser.value).update({
                        is_accepted: 1,
                    })

                    instance.proxy.$router.push('/play');

                } else if (result.isDismissed) {
                    inviteRequestsRef.child(currUser.value).update({
                        is_accepted: 2,
                    })
                }
            })

        }
    }

}

// const checkForInvites = () => {
//     console.log('check...');
// }

const updateUserList = () => {
    let users = allUsers.value
    users.push(currUser.value)
    gameRef.set({
        users
    })
}

// onBeforeUnmount(() => {
//     clearInterval(intervalId.value);
// })

const startGame = (user) => {

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to invite ' + user + ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2a8c00',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async (result) => {
        if (result.isConfirmed) {
            if (inviteRequests.value !== undefined) {
                inviteRequestsRef.update({
                    [user] :{
                        is_accepted: 0,
                        from: currUser.value,
                    }
                })

            } else {
                
                inviteRequestsRef.set({
                    [user] :{
                        is_accepted: 0,
                        from: currUser.value,
                    }
                })
            }
            
            localStorage.setItem('teamName', JSON.stringify(user + '-' + currUser.value))
            instance.proxy.$router.push('/wait');
        }
    })

}

</script>

<template>
    <div class="about">
        <div class="registration-container">
            <h2>Select an Oponent</h2><br>
            <ul class="user-list">
                <li v-for="user in allUsers" class="user-item" @click="startGame(user)">
                    {{ user }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
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
    background-color: #41b883;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.user-list {
    list-style-type: none;
    padding: 0;
}

.user-item {
    background-color: #000000;
    border: 1px solid #ddd;
    margin-bottom: 8px;
    padding: 10px;
    border-radius: 4px;
}
</style>