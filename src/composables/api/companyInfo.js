import {ref} from "vue";
import {api} from "boot/axios";


export function companyInfo({ country, id }) {
  let isLoading = ref(true);
  let name= ref("");
  let short_name= ref("");
  let street= ref("");
  let postcode= ref("");
  let city= ref("");
  let country_code= ref("");

  async function execute() {
    await api.post("auth/company_info",{    "country": country,    "company_national_id": "9542752600"  })
    .then((res) => {
      console.log(res.data);
      name.value = res.data.name
      short_name.value = res.data.short_name
      street.value = res.data.street
      postcode.value = res.data.postcode
      city.value = res.data.city
      country_code.value = res.data.country_code
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

  }

  execute();

  return {
    isLoading,
    name,
    short_name, 
    street,
    postcode,
    city,
    country_code
  }
}
