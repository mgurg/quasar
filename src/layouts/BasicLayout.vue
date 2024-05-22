<template>
  <q-layout view="hHh lpR fFf">
    <div class="row justify-center" style="height: 100vh">
      <div class="col-xs-12 col-sm-12 col-md-6 flex container-logo bg-blue-grey-7">
        <div class="column self-center q-mx-auto">
          <div class="q-ma-lg text-left text-white power-text">
            <h1 class="text-h3">Malgori</h1>
            <!--          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>-->
            <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">
              Uprość codzienne zadania związane z konserwacją.
            </p>
            <p v-if="$q.screen.gt.sm" class="text-h6 text-weight-regular">
              🎯 Aktualna lista zadań (bez ciągłych telefonów i odrywania od bieżącej pracy)<br>
              📋 Raporty, bieżący status prac<br>
              🚀 Nie zgaduj, skup się na tym co ważne<br> <br><br> <br>

            </p>
            <!--          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">-->
            <!--            Spędzaj mniej czasu na papierkowej robocie, a więcej na-->
            <!--            załatwianiu spraw.-->
            <!--          </p>-->

            <p class="text-h6 text-weight-regular">📰 <a class="text-white" href="https://malgori.pl"><b>Blog</b> -
              dowiedz
              się więcej</a></p>
          </div>
          <!-- </div> -->
        </div>
      </div>

      <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

        <q-page-container>


          <router-view v-slot="{ Component }">
            <transition
              :duration="400"
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut">
              <component :is="Component"/>
            </transition>
          </router-view>


        </q-page-container>

      </div>
    </div>
  </q-layout>
</template>

<script setup>

</script>

