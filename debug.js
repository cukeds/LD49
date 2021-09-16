let debug0 = document.getElementById('debug0');
let debug0Label = document.getElementById('debug0label');
let debug1 = document.getElementById('debug1');
let debug1Label = document.getElementById('debug1label');
let debug2 = document.getElementById('debug2');
let debug2Label = document.getElementById('debug2label');

debug0.addEventListener('change',e=>{
  debug0Label.innerHTML = debug0.value;
})

debug1.addEventListener('change',e=>{
  debug1Label.innerHTML = debug1.value;
})
debug2.addEventListener('change',e=>{
  debug2Label.innerHTML = debug2.value;
})
