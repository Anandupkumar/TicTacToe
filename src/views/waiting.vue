<script setup>
import { computed, ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";

import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import Swal from "sweetalert2";

const instance = getCurrentInstance();

const currUser = ref("")
const teamName = ref("")

const usersArr = ref()

const teamRef = firebase.database().ref('teams');
const inviteRequestsRef = firebase.database().ref('invite_requests');

onMounted(() => {
    if (localStorage.getItem("xox_user") != null && localStorage.getItem("teamName") != null) {
        currUser.value = JSON.parse(localStorage.getItem('xox_user'));
        teamName.value = JSON.parse(localStorage.getItem('teamName'));
        let team = teamName.value
        usersArr.value = team.split('-')

        // currentPlayer.value = currUser.value
    } else {
        instance.proxy.$router.push('/');
    }

    teamRef.on('value', (snap) => {
        const allTeams = snap.val();
        if (allTeams && allTeams.hasOwnProperty(teamName.value)){
            instance.proxy.$router.push('/play');
        }
    })

    inviteRequestsRef.on('value', (snapshot) => {
        const gameStat = snapshot.val();
        if (gameStat) {
            // let tempUsers = gameStat.users;
            checkForInvites(gameStat);
            
        }
    })
})

const checkForInvites = (req) => {
    
    let allRequests = req
    if (allRequests !== undefined) {

        if (allRequests.hasOwnProperty(usersArr.value[0]) && allRequests[usersArr.value[0]].is_accepted == 2) {
            
            Swal.fire({
                title: 'Your invitation denied !',
                text: 'Select another oponent',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2a8c00',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
            }).then(async (result) => {
                
                inviteRequestsRef.update({
                    [usersArr.value[0]] :{
                        is_accepted: 3,
                        from: currUser.value,
                    }
                })
                localStorage.removeItem('teamName')
                instance.proxy.$router.push('/selectOponent');
                
            })
        }
    }
}

</script>

<template>
    <div class="loader-container">
        <div class="loader"></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h1> Please wait for your opoenent to accept your invite...... </h1>
    </div>
</template>

<style>

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #2a8c00;
  border-radius: 50%;
  width: 87px;
  height: 65px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>