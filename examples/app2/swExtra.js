// This file will be injected in the middle of the sw.
// We can use the sww library or directly write code
// for the worker here.

worker.use({
  onActivate: function(evt) {
    console.log('I passed through the onActivate event!');
  }
})

worker.get('*', function(request, response) {
  console.log('---------> Logging a get request for ', request.url);

  return Promise.resolve(response);
});