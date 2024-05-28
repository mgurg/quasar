<template>
  <div class="row q-col-gutter-sm">
    <div class="col-md-3 col-sm-6 col-xs-6">
      <q-item class="q-pa-none rounded-borders fit" clickable style="background-color: #e91e63"
              @click="goToIssues('new')">

        <q-item-section class="q-pa-md q-mr-none text-white rounded-borders"
                        side
                        style="background-color: #d81b60">
          <q-icon color="white" name="auto_awesome" size="24px"></q-icon>
        </q-item-section>
        <q-item-section class=" q-pa-md q-ml-none  text-white">
          <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.new }}
          </q-item-label>
          <q-item-label>{{ $t('New') }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-6">
      <q-item class="q-pa-none rounded-borders fit" clickable style="background-color: #ffb300"
              @click="goToIssues('in_progress')">
        <q-item-section class=" q-pa-md q-mr-none text-white rounded-borders"
                        side
                        style="background-color: #ffa000">
          <q-icon color="white" name="build" size="24px"></q-icon>
        </q-item-section>
        <q-item-section class=" q-pa-md q-ml-none  text-white">
          <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.in_progress }}
          </q-item-label>
          <q-item-label>{{ $t('Ongoing') }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-6">
      <q-item class="q-pa-none rounded-borders fit" clickable style="background-color: #009688"
              @click="goToIssues('paused')">
        <q-item-section class="q-pa-md q-mr-none text-white rounded-borders"
                        side
                        style="background-color: #00897b">
          <q-icon color="white" name="pause" size="24px"></q-icon>
        </q-item-section>
        <q-item-section class="q-pa-md q-ml-none  text-white">
          <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.paused }}
          </q-item-label>
          <q-item-label>{{ $t('Paused') }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-6">
      <q-item class="q-pa-none rounded-borders fit" clickable style="background-color: #455a64"
              @click="goToIssues('done')">
        <q-item-section class=" q-pa-md q-mr-none text-white rounded-borders"
                        side
                        style="background-color: #37474f">
          <q-icon color="white" name="stop" size="24px"></q-icon>
        </q-item-section>
        <q-item-section class=" q-pa-md q-ml-none  text-white">
          <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.done }}
          </q-item-label>
          <q-item-label>{{ $t('Done') }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  status: {
    type: Object,
    required: true
  }
});

const router = useRouter();

function goToIssues(status) {
  router.push({ path: '/issues', query: { filter: status } });
}
</script>
<style lang="scss" scoped>

</style>
