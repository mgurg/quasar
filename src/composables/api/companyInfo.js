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

  const onDownload = async () => {
    try{
      const response = await  api.post("auth/company_info",{"country": country, "company_national_id": "9542752600"})
      name.value = response.data.name
      short_name.value = response.data.short_name
      street.value = response.data.street
      postcode.value = response.data.postcode
      city.value = response.data.city
      country_code.value = response.data.country_code
      isLoading.value = false;
    }  catch (error) {
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
    isLoading,
    name,
    short_name, 
    street,
    postcode,
    city,
    country_code
  }
}
