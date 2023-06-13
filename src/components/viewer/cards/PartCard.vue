<template>
  <!--  QR CODE -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedSummary ? 'border-left: 5px solid #4c29bb':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedSummary = !expandedSummary">
            Części
          </div>
          <q-space></q-space>
          <q-btn
            :label="$t('Add')"
            class="q-mr-lg"
            color="primary"
            flat
            no-caps
            @click="showUserDialog=true"
          />
          <q-btn :icon="expandedSummary ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedSummary = !expandedSummary"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedSummary">

          <q-card-section>
            <q-list v-for="(part, index) in replacedParts" v-if="replacedParts" v-bind:key="index" bordered separator
                    class="rounded-borders">
              <div>
                <q-item>
<!--                  <q-item-section avatar>-->
<!--                    <q-icon color="primary" name="bluetooth"/>-->
<!--                  </q-item-section>-->
                  <q-item-section>
                    <q-item-label>{{ part.name }}</q-item-label>
                    <q-item-label caption>[{{ part.price }} zł x {{ part.price }} {{ part.unit }} = {{ part.value }} zł] </q-item-label>
                    <q-item-label caption>{{ part.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <!--                      <q-btn @click="editPart(part.uuid)" class="gt-xs" size="12px" flat dense round icon="edit" />-->
                      <q-btn @click="deletePart(part.uuid)" class="gt-xs" size="12px" flat dense round icon="delete"/>
                    </div>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>


          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>

  <q-dialog v-model="showUserDialog" :position="$q.platform.is.mobile ? 'top': 'standard'">
    <part-dialog :issue-uuid="issueUuid" @part-form-btn-click="closeDialog()"/>
  </q-dialog>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import PartDialog from "components/dialog/PartDialog.vue";
import {deleteUsedPartsRequest, getIssueUsedPartsRequest} from "components/api/PartApiClient";
import {errorHandler} from "components/api/errorHandler";

const showUserDialog = ref(false);

function closeDialog(a) {
  getIssueUsedParts()
  console.log("emit" + a)
  showUserDialog.value = false;
}

const props = defineProps({
  issueUuid: {
    type: String,
    default: null,
  },
  expandedSummary: {
    type: Boolean,
    default: false,
  },
})

const expandedSummary = ref(props.expandedSummary)
const issueUuid = ref(props.issueUuid)
let isLoading = ref(false);
const isError = ref(false);

const replacedParts = ref(null)

function deletePart(uuid) {
  isLoading.value = true;

  deleteUsedPartsRequest(uuid).then(function (response) {
    console.log(response.data)
    getIssueUsedParts();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
}


function getIssueUsedParts() {
  isLoading.value = true;

  getIssueUsedPartsRequest(issueUuid.value).then(function (response) {
    replacedParts.value = response.data
    // console.log(response.data)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  getIssueUsedParts();
});


</script>
