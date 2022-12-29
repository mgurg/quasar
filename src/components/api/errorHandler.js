// https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253

export const errorHandler = (error) => {
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log(error.response);

    return error.response;
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log(error.request);
    return error.request;
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log("General Error: " + error);
    return "General Error";
  }
};
