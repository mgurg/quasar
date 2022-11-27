<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Items") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline class="float-right" icon="add" to="/items/add" color="primary" no-caps  :label="$q.screen.gt.xs ? $t('New item') : ''"
                     />
                  </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>

</script>
