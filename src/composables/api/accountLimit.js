import { ref } from "vue";
import { api } from "boot/axios";

export function accountLimit() {
  let isLoading = ref(true);
  let accounts = ref(1);
  let availableAccounts = ref(0);
  let ratio = ref(0);
  let limit = ref(10);

  const onDownload = async () => {
    try {
      const response = await api.get("auth/account_limit");
      accounts.value = response.data.accounts;
      limit.value = response.data.limit;
      availableAccounts.value = response.data.limit - response.data.accounts;
      ratio.value = response.data.accounts/response.data.limit
      isLoading.value = false;
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("General Error");
      }
    }
  };
  onDownload();

  return {
    accounts,
    limit,
    availableAccounts,
    ratio
  };
}
