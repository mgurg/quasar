import {ref} from "vue";
import {api} from "boot/axios";


export function accountLimit() {
  let isLoading = ref(true);
  let accounts = ref(1)
  let availableAccounts = ref(0)
  let limit = ref(10)

  api.get("auth/account_limit")
    .then((res) => {
      console.log(res.data);
      accounts.value = res.data.accounts
      limit.value = res.data.limit
      availableAccounts.value = (res.data.limit - res.data.accounts)
      isLoading.value = false;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }

    });


  return {
    accounts,
    limit,
    availableAccounts
  }
}
