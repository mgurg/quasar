
import { ref } from "vue";

export function useAndroidDetection()
{
    const isAndroid = ref("");
    isAndroid.value = /(android)/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')

    return {
        isAndroid
      };
}

