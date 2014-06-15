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


// Load a worker from a string, and manually initialize the worker with introsort builtin as a minified function
var inlineWorkerText =
  "var introsort=function(){function t(e){n(e,0,e.length,2*f(e.length));return e}function n(t,o,a,f){while(a-o>e){if(f==0){s(t,o,a);return}f=f-1;var l=r(t,o,a,i(t,o,o+(a-o)/2+1,a-1));n(t,l,a,f);a=l}u(t,o,a)}function r(e,t,n,r){var i=t,s=n;while(true){while(e[i]<r)i++;s=s-1;while(r<e[s])s=s-1;if(!(i<s))return i;a(e,i,s);i++}}function i(e,t,n,r){if(e[n]<e[t]){if(e[r]<e[n]){return e[n]}else{return e[r]<e[t]?e[r]:e[t]}}else{if(e[r]<e[n]){return e[r]<e[t]?e[t]:e[r]}else{return e[n]}}}function s(e,t,n){var r=n-t;for(var i=r/2;i>=1;i=i-1){o(e,i,r,t)}for(var i=r;i>1;i=i-1){a(e,t,t+i-1);o(e,1,i-1,t)}}function o(e,t,n,r){var i=e[r+t-1];var s;while(t<=n/2){s=2*t;if(s<n&&e[r+s-1]<e[r+s]){s++}if(i>=e[r+s-1])break;e[r+t-1]=e[r+s-1];t=s}e[r+t-1]=i}function u(e,t,n){var r,i;var s;for(r=t;r<n;r++){i=r;s=e[r];while(i!=t&&s<e[i-1]){e[i]=e[i-1];i--}e[i]=s}}function a(e,t,n){var r=e[t];e[t]=e[n];e[n]=r}function f(e){return Math.floor(Math.log(e)/Math.log(2))<<0}var e=16;return t}();self.addEventListener('message', function(e) { postMessage(introsort(e.data));} ,false);";
var inlineWorker = makeWorker(inlineWorkerText);
inlineWorker.onmessage = function(e) {
  //console.log("Sorted with web worker - " + e.data);
};

function makeArray(size) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    arr.push((1 + Math.random() * 10000) << 0);
  }
  return arr;
}

function jsNativeSort(array) {
  array.sort(function(a, b) {
    return a - b;
  });
  //console.log("Sorted with Asynchronous JS - " + array);
}

var arr10k = makeArray(10000);
var arr1mm = makeArray(1000000);
var arr1k = makeArray(1000);

var start = new Date().getTime();
jsNativeSort(arr1mm);
var end = new Date().getTime();
var time = end - start;
console.log('Aynchronous JS Execution time: ' + time);

start = new Date().getTime();
inlineWorker.postMessage(arr1mm);
end = new Date().getTime();
time = end - start;
console.log('Web worker Execution time: ' + time);

