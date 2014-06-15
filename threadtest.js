// Init new threadpool
var tp = new ThreadPool();

// Spawn two threads
tp.run(mythread, "Hello")
  .done(function(result) {
      document.getElementById('testdiv1').innerHTML = "Thread #1: "+result;
  });
tp.run(mythread, " World")
  .done(function(result) {
      document.getElementById('testdiv2').innerHTML = "Thread #2: "+result;
  });

// Thread logic
function mythread (param, done) {
  done( param.toUpperCase() );
}
