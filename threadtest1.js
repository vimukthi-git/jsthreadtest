// makeWorker is a little wrapper for generating web workers from strings

function makeWorker(script) {
	var URL = window.URL || window.webkitURL;
	var Blob = window.Blob;
	var Worker = window.Worker;

	if (!URL || !Blob || !Worker || !script) {
		return null;
	}

	var blob = new Blob([script]);
	var worker = new Worker(URL.createObjectURL(blob));
	return worker;
}


// Load a worker from a string, and manually initialize the worker
var inlineWorkerText =
"self.addEventListener('message', function(e) { postMessage(e.data.sort(function(a, b){return a-b;}));} ,false);";
var inlineWorker = makeWorker(inlineWorkerText);
inlineWorker.onmessage = function(e) {
	console.log(e.data);
};

function makeArray(size) {
	var arr = [];
	for (var i = 0; i < size; i++) {
		arr.push((1 + Math.random() * 10000) << 0);
	}
	return arr;
}

var arr10k = makeArray(10000);
var arr1mm = makeArray(1000000);
var arr1k = makeArray(1000);

var start = new Date().getTime();
arr1mm.sort(function(a, b) {
  return a - b;
});
var end = new Date().getTime();
var time = end - start;
console.log('Aynchronous JS Execution time: ' + time);

start = new Date().getTime();
inlineWorker.postMessage(arr1mm);
end = new Date().getTime();
time = end - start;
console.log('Web worker Execution time: ' + time);
