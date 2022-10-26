<template>
  <q-layout>
    <div class="row justify-center">
      <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div class="q-pa-md">

        <h5>QR CODE</h5>

    <img
      src="https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=https://remontmaszyn.pl/new/8tl+234&choe=UTF-8&chld=M"
      alt="string"
    />

        </div>
      </q-page>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from 'vue-router';
import { api } from "boot/axios";




</script>