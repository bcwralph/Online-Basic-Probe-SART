//*****************************************
//----------variable declaration-----------
//*****************************************

//get references to btns
const yes_consent_btn = document.getElementById('yes-consent-btn');
const no_consent_btn = document.getElementById('no-consent-btn');
const inst_next_btn = document.getElementById('inst-next-btn');
const inst_back_btn = document.getElementById('inst-back-btn');
const save_resp_btn = document.getElementById('save-resp-btn');
const finish_btn = document.getElementById('finish-btn');

//get references to sliders
const first_slider = document.getElementById('first-slider');
const second_slider = document.getElementById('second-slider');
const third_slider = document.getElementById('third-slider');
const age_slider = document.getElementById('age-slider');

//get reference to radio buttons -- currently unused
const gender_radios = document.getElementsByName('rad-gender-answer');
const end_radios = document.getElementsByName('rad-end-answer');

//get references to slider output span elements
const first_output = document.getElementById('first-output');
const second_output = document.getElementById('second-output');
const third_output = document.getElementById('third-output');
const age_output = document.getElementById('age-output');

//get references to pages
const uw_header = document.getElementById('uw-header');
const uw_logo = document.getElementById('uw-logo');
const info_consent_letter = document.getElementById('info-consent-letter');
const demographic_questionnaire = document.getElementById('demographic-questionnaire');
const task_inst = document.getElementById('task-inst');
const thought_probe = document.getElementById('thought-probe');
const decline_to_participate = document.getElementById('decline-to-participate');
const practice_over = document.getElementById('practice-over');
//const intermission = document.getElementById('intermission');
const feedback_letter = document.getElementById('feedback-letter');
const do_not_refresh = document.getElementById('do-not-refresh');
const browser_not_supported = document.getElementById('browser-not-supported');
const end_questionnaire = document.getElementById('end-questionnaire');

//get references to stim
const stim = document.getElementById('stim-container');

//set participant values
const studyid = 'BasicSART';
const ss_code = getRandomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const condition = getRandomInt(1,2);

var gender = 'NA';
var age = 'NA';
var end_q = 'NA';

//experimental constants
const myStims = ("1,2,3,4,5,6,7,8,9").split(",");
const fontSizes = ("48pt,72pt,94pt,100pt,120pt").split(",");
const trials_per_block = myStims.length*100; // 100 iterations of 9 = 900 trials
const num_practice = 18; //18

const prestim_duration = 0;
const stim_duration = 250;
const poststim_duration = 900;
const trial_duration = prestim_duration + stim_duration + poststim_duration;
//a trial will be defined as  stimulus -> fixation'

//probe information
var num_probes = 18;
var probe_steps = trials_per_block/num_probes;
var probe_list = [num_practice/2]; //initial default for practice trials

//experimental counters
var block_trial = 0; // within a block
var global_trial = 0; // global trial
var this_block = 0;
var this_probe = 0;

//experimental toggles
var intermis_avail = false; // true if more than one block
var probe_avail = true;
var probe_queued = false;
var is_practice = true;
var getting_ready = true;
var stim_on = false;
var prestim_on = false;
var poststim_on = false;
var is_probe = false;

//default data values
var key_pressed = false;
var resp_at = 'NA';
var rt = 'None';
var is_target = 'NA';
var comission = 'NA';
var omission = 'NA';
var is_focus = false;

//default other values
var stim_time = 'NA';
var prestim_time = 'NA';
var poststim_time = 'NA';
var the_stimulus = 'NA';
var is_target = 'NA';

//default probe responses
var first_resp = 'NA';
var second_resp = 'NA';
var third_resp = 'NA';

//containers
var timeout_list = [];
var the_stim_list;
var the_targ_list;

var trial_headers = [
  'ss_code',
  'gender',
  'age',
  'condition',
  'this_block',
  'block_trial',
  'global_trial',
  'the_stimulus',
  'is_target',
  'is_probe',
  'prestim_at',
  'stim_at',
  'poststim_at',
  'resp_at',
  'rt',
  'comission',
  'omission',
  'this_probe',
  'first_resp',
  'second_resp',
  'third_resp',
  'is_focus',
  'end_q'
];

//data holders
var trial_data = '';

//write headers first
for (var i in trial_headers){
  trial_data+=trial_headers[i];
  if (i < trial_headers.length-1){trial_data+=',';}
  else{trial_data+='\n';}
}

//setup modular task instructions
var inst_p1 =
  "<h2>Task Instructions</h2>"
  +"<p>In this task, you will be presented with the digits 1-9 in the center of the screen."
  +" Your task is to press the SPACEBAR in response to each digit, except for when that digit is a '3'."
  +" For example, if you see the digit '1', press the spacebar, '4', press the spacebar, '3', DO NOT press the space bar, '7', press the space bar.</p>"
  +"<p>Please give equal importance to both the speed and accuracy of your responses.</p>"
  +"<p>Please click the 'Next' button to proceed to the next page of the instructions.</p>";

var inst_p2 =
  "<h2>Task Instructions</h2>"
  +"<p>Every once in a while, the task will temporarily stop and you will be presented with a thought-sampling screen that will ask you to respond (via a slider) to one of three questions about your experience just prior to the probe.</p>"
  //+thought_probe.innerHTML
  +"<p>To indicate your response, please click the slider to make the indicator appear, and move the indicator to the position that most accurately captures your experience.</p>"
  +"<p>An example of the thought-sampling screen is presented below. Please try clicking each slider and moving the indicator around to become familiar with the instrument.</p>"
  +"<p>When you are ready to move on, click the 'Next' button to proceed to the next page of the instructions.</p><br>";

var inst_p3 =
  "<h2>Task Instructions</h2>"
  +"<p>You are now going to complete a brief practice session to help you to become familiar with the task.</p>"
  +"<p>when you are ready to proceed, please press the 'Begin Practice' button below.</p>";

var inst_pg_list = new Array(inst_p1,inst_p2,inst_p3)
var this_inst_pg = 0; //default start demo
var max_inst_pg = inst_pg_list.length;

//*****************************************
//-------------define functions------------
//*****************************************

function showPage(doc_ele){
	doc_ele.style.visibility ='visible';
	doc_ele.style.display='inline';
}

function hidePage(doc_ele){
	doc_ele.style.visibility ='hidden';
	doc_ele.style.display='none';
}

function getRandomString(length, chars){
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

function getRandomInt(min, max){
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function isInArray(value, array){return array.indexOf(value) > -1;}

function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex){

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
  }
  return array;
}


function generateTrials(num_trials){
  // temp holder for stims
  var temp_list = [];
  // temp holder for font sizes
  var temp_size_list = [];

  // create loop for stimuli
  for (var i = 0; i < (num_trials/myStims.length); i++){
    var shuffled_stims = shuffle(myStims);
    for (var j = 0; j < myStims.length; j++){
      // add to list and repeat
      temp_list.push(shuffled_stims[j]);
    }
  }

  // create similar loop for font sizes
  for (var i = 0; i < (num_trials/fontSizes.length); i++){
    var shuffled_sizes = shuffle(fontSizes);
    for (var j = 0; j < fontSizes.length; j++){
      temp_size_list.push(shuffled_sizes[j])
    }
  }
  return [temp_list, temp_size_list];
}

function generateProbes(num_probes,in_blocks_of){
	var min = 0;
	var max = in_blocks_of-1;
	var probe_list = new Array();

	for (var i=0;i<num_probes;i++){
		var thisValue = Math.floor(Math.random()*(max-min+1))+min; //min max included
		probe_list.push(thisValue);
		min = min + in_blocks_of;
		max = max + in_blocks_of;
	}
	return probe_list
}

// a function to stop all tracked timeouts
function stopTrackedTimeouts(){
  for (var i = 0; i < timeout_list.length; i++){
    clearTimeout(timeout_list[i]);
  }
  timeout_list = [];
}

// a function to stop all timeouts
function stopAllTimeouts(){
  var id = window.setTimeout(null,0);
  while (id--){
    window.clearTimeout(id)
  }
}

// a function to hide all display elements (here, divs and btns)
function hideAllDivs(){
  var divs = document.getElementsByTagName('div');
  var btns = document.getElementsByTagName('button');
  for (var i = 0; i < divs.length; i++){
    hidePage(divs[i]);
  }

  for (var i = 0; i < btns.length;i++){
    hidePage(btns[i]);
  }
  hidePage(uw_header);
}

// set default slider output values
function setSliderValues(){
  //first_output.innerHTML = first_slider.value;
  //second_output.innerHTML = second_slider.value;
  //third_output.innerHTML = third_slider.value;
  first_output.innerHTML = 'Not Selected';
  second_output.innerHTML = 'Not Selected';
  third_output.innerHTML = 'Not Selected';
  age_output.innerHTML = 'Not Selected';
}

// reset default slider values
function resetAllSliders(){
  var inputs = document.getElementsByTagName('input');
  //console.log(sldrs);
  //reset actual value
  for (var i = 0; i < inputs.length; i++){
    if(inputs.type=="range"){inputs[i].value = '';}

    if(inputs[i].classList.contains('clicked')){
      inputs[i].classList.remove('clicked');
      inputs[i].classList.add('not-clicked');
    }
  }
  //reset associated text value
  setSliderValues();
}

//initial get ready message
function getReady(){
  hideAllDivs();
  stim.innerHTML = "<p style='font-size:14pt;'>Get Ready...</p>";
  showPage(stim);
  //stim_time = new Date().getTime();
  getting_ready = true;
  timeout_list.push(setTimeout(drawPostStim,(prestim_duration+stim_duration)*2));

}
function drawPrestim(){
  //draw first fixation
  stim.style.fontSize = "62px";
  stim.innerHTML = "+";

  //declare on and time
  prestim_on = true;
  prestim_time = new Date().getTime();

  //call draw stim function
  timeout_list.push(setTimeout(drawStim,prestim_duration))
}

function drawStim(){
  //minimum time of previous event met
  //prestim_on = checkMinTime(prestim_on,prestim_time,prestim_duration)

  //set stimulus
  stim.style.fontSize = the_size;
  stim.innerHTML = the_stimulus;

  //declare on and time
  stim_time = new Date().getTime();
  stim_on = true;

  //call post-stim function
  timeout_list.push(setTimeout(drawPostStim,stim_duration));
}


//draw fixation for duration
function drawPostStim(){
  //minimum time of previous event met
  stim_on = checkMinTime(stim_on,stim_time,stim_duration);

  //clear stimulus
  stim.style.fontSize = "62px";
  stim.innerHTML = "+";

  //declare on and time
  prestim_on = true;
  prestim_time = new Date().getTime();

  //check if following getReady or normal trial
  if(getting_ready){
    getting_ready = false;
    timeout_list.push(setTimeout(runTrial,poststim_duration));
  }
  else{timeout_list.push(setTimeout(nextTrial,poststim_duration));}
}

function nextTrial(){
  //control for variations in trial time on the short-end
  poststim_on = checkMinTime(poststim_on,poststim_time,poststim_duration)

  //should we draw a probe?
  if (probe_avail && is_probe){doProbe();}

  //otherwise, run the next trial
  else{
    logData();
    block_trial++;
    global_trial++;

    //only false if probe just presented -->getReady --> fixation --> runTrial
    if(!probe_avail){
      probe_avail = true;
      this_probe++;
      first_resp = 'NA';
      second_resp = 'NA';
      third_resp = 'NA';
      getReady();
    }
    else{runTrial();}
  }
}

window.onkeydown = function(e){
  var key = e.keyCode ? e.keyCode: e.which;
  if(!key_pressed && key == 32 && (probe_avail)){
    resp_at = new Date().getTime();
    //rt = new Date().getTime() - prestim_time;
    key_pressed = true;
    //console.log('key pressed');
    if(is_target==true){
      comission = 1;
      console.log('comission error');
    }
    else{
      omission = 0;
      console.log('correct non-target response');
    }
  }
}

// main trial loop
function runTrial(){
  // is it practice and over?
  if (is_practice && block_trial == num_practice){endPractice();}
  // is it not practice and over?
  else if (!is_practice && block_trial == trials_per_block){

    // hide stimulus
    hidePage(stim);
    // if first block, do intermission
    if (intermis_avail){doIntermission();}
    // otherwise experiment is over
    else{
      if (condition!=4){
        showPage(finish_btn);
        showPage(end_questionnaire);
      }
      else{
        endLog();
        submitData();
      }
    }
  }
  // otherwise do trial
  else{doTrial();}
}

// actual trial component
function doTrial(){
  // reset relevant values
  key_pressed = false;
  resp_at = 'NA';
  rt = 'NA';
  comission = 'NA';
  omission = 1;
  first_resp,second_resp,third_resp= 'NA';

  // clear tracked timeouts, and check for/clear rogue timeouts
  stopTrackedTimeouts();
  stopTrackedTimeouts();

  // assign stimulus and target identity
  the_stimulus = the_stim_list[block_trial];
  the_size = the_size_list[block_trial];

  if(the_stimulus == "3"){is_target = true;}
  else{is_target = false;}

  is_probe = isInArray(block_trial,probe_list);
  if(is_target==true){
    comission = 0;
    omission = 'NA';
  }
  //drawPrestim();
  drawStim();
  console.log(this_block, block_trial, the_stimulus, is_target, is_probe);
}

function checkMinTime(event_running, event_start_time, min_duration){
  while (event_running){
		if (new Date().getTime() - event_start_time >= min_duration){
      event_running = false;
      //console.log(new Date().getTime() - event_start_time);
    }
	}
  return event_running;
}

// draw probe
function doProbe(){
  // hide everything
  hideAllDivs();

  //need to turn probe availability off until next trial is updated
  probe_avail = false;

  //clear tracked timeouts, and check for/clear rogue timeouts
  stopTrackedTimeouts();
  stopTrackedTimeouts();

  //show sliders
  showPage(thought_probe);
  showPage(save_resp_btn);
}

function endProbe(){
  hideAllDivs();
  first_resp = first_slider.value;
  second_resp = second_slider.value;
  third_resp = third_slider.value;

  resetAllSliders();
  nextTrial();
}

//display practice over and update values
function endPractice(){
  is_practice = false;
  updateBlockCounters();
  //console.log('@ PRACTICE OVER');

  hidePage(stim);
  inst_next_btn.innerHTML = 'Begin Task';

  //const uw_logo = document.getElementById('uw-logo')
  //uw_header.style.display='block';
  //uw_logo.style.display='block';
  //showPage(uw_header);
  //uw_logo.style.display = 'block';
  //uw_logo.style.maxwidth = "100%";
  //uw_logo.style.maxheight = "100%";
  //showPage(document.getElementById('uw-logo'));

  showPage(practice_over);
  showPage(inst_next_btn);

  // should be global
  [the_stim_list,the_size_list] = generateTrials(trials_per_block);
  probe_list = generateProbes(num_probes,probe_steps);
  /*
  console.log(the_stim_list);
  console.log(the_targ_list);
  console.log(probe_list);
  */
}

function updateBlockCounters(){
  block_trial = 0;
  this_probe = 0;
  this_block++;
}

//do intermission and update values
function doIntermission(){

  showPage(intermission);
  intermis_avail = false;
  inst_next_btn.innerHTML = 'Resume Task';
  showPage(inst_next_btn);

  //should be global scope
  [the_stim_list,the_size_list] = generateTrials(trials_per_block);
  probe_list = generateProbes(num_probes,probe_steps);
  /*
  console.log(the_stim_list);
  console.log(the_targ_list);
  console.log(probe_list);
  */
  updateBlockCounters();
}

function logData(){
  //if a response was made
  if(omission == 0 | comission == 1){
    //resp at should occur after stim_time, otherwise early/negative response
    rt = resp_at-stim_time;
  }
  var output = [
    ss_code,
    gender,
    age,
    condition,
    this_block,
    block_trial,
    global_trial,
    the_stimulus,
    is_target,
    is_probe,
    prestim_time,
    stim_time,
    poststim_time,
    resp_at,
    rt,
    comission,
    omission,
    this_probe,
    first_resp,
    second_resp,
    third_resp,
    document.hasFocus(),
    end_q
  ];

  for (var i in output){
    trial_data+=output[i];
    if(i<output.length-1){trial_data+=',';}
    else{trial_data+='\n';}
  }
  //console.log(output);
  /*
  console.log(trial_data);
  console.log('HAS FOCUS: ', document.hasFocus());
  console.log('rt was '+rt);
  */
}

function submitData(){
  document.getElementById('put-studyid-here').value = studyid;
  document.getElementById('put-sscode-here').value = ss_code;
  document.getElementById('put-data-here').value = trial_data;
  document.getElementById('sendtoPHP').submit();
}

//consent to participate
yes_consent_btn.addEventListener('click',function(event){
  hidePage(info_consent_letter);
  hidePage(yes_consent_btn);
  hidePage(no_consent_btn);

  showPage(demographic_questionnaire);
  showPage(inst_next_btn);
  showPage(inst_back_btn);
  window.scrollTo(0,0);
});

//decline to participate
no_consent_btn.addEventListener('click',function(event){
  hidePage(info_consent_letter);
  hidePage(yes_consent_btn);
  hidePage(no_consent_btn);
  showPage(decline_to_participate);
});

inst_next_btn.addEventListener('click',function(event){
  // if demographic page, save demographic data
  if(this_inst_pg==0){
    // save gender
    gender = $("input:radio[name=rad-gender-answer]:checked").val();

    // save age if slider clicked
    if (age_slider.classList.contains('clicked')){age = age_slider.value;}

    // hide and show next page
    hidePage(demographic_questionnaire);
    showPage(task_inst);
    task_inst.innerHTML = inst_p1;
  }

  // increment counter
  if(this_inst_pg<4){this_inst_pg+=1;}

  // about to start practice
  if(this_inst_pg==3){
    hidePage(thought_probe);
    inst_next_btn.innerHTML = 'Begin Practice Trials';
  }

  // show probe example
  if(this_inst_pg==2){
    showPage(thought_probe);
    resetAllSliders();
  }

  // load instructions or start task
  if(this_inst_pg<=3){
    task_inst.innerHTML = inst_pg_list[this_inst_pg-1];
    window.scrollTo(0,0);
  }
  else{
    getReady();
    resetAllSliders();
  }
});

inst_back_btn.addEventListener('click',function(event){
  if(this_inst_pg==3){inst_next_btn.innerHTML = 'Next';}
  if(this_inst_pg>-1){this_inst_pg-=1;}
  if(this_inst_pg==0){
    hidePage(task_inst);
    showPage(demographic_questionnaire);
  }
  if(this_inst_pg==-1){
    hidePage(demographic_questionnaire);
    hidePage(inst_next_btn);
    hidePage(inst_back_btn);

    showPage(info_consent_letter);
    showPage(yes_consent_btn);
    showPage(no_consent_btn);
  }
  else{
    task_inst.innerHTML = inst_pg_list[this_inst_pg-1];
    window.scrollTo(0,0);
  }
  if(this_inst_pg==2){showPage(thought_probe);resetAllSliders();}
  else{hidePage(thought_probe);resetAllSliders();}
});

save_resp_btn.addEventListener('click',function(){
  //add requirement of slider clicks
  if(first_slider.classList.contains('clicked')
  && second_slider.classList.contains('clicked')
  && third_slider.classList.contains('clicked')){
    endProbe();
  }
});

function endLog(){
  // easy to find
  this_block++;
  block_trial = 999;
  global_trial = 999;

  // make all below NA
  the_stimulus=
  is_target=
  is_probe=
  omission=
  prestim_time=
  stim_time=
  poststim_time=
  resp_at=
  rt=
  comission=
  omission=
  this_probe=
  first_resp=
  second_resp=
  third_resp='NA';

  // log one last line
  logData();
}

finish_btn.addEventListener('click',function(){
  end_q = $("input:radio[name=rad-end-answer]:checked").val();
  endLog();
  submitData();
});

first_slider.addEventListener('click',function(){
  if (first_slider.classList.contains('not-clicked')){
    first_slider.classList.remove('not-clicked');
    first_slider.classList.add('clicked');
  }
});

second_slider.addEventListener('click',function(){
  if (second_slider.classList.contains('not-clicked')){
    second_slider.classList.remove('not-clicked');
    second_slider.classList.add('clicked');
  }
});

third_slider.addEventListener('click',function(){
  if (third_slider.classList.contains('not-clicked')){
    third_slider.classList.remove('not-clicked');
    third_slider.classList.add('clicked');
  }
});

age_slider.addEventListener('click',function(){
  if (age_slider.classList.contains('not-clicked')){
    age_slider.classList.remove('not-clicked');
    age_slider.classList.add('clicked');
  }
});

// prevent mousewheel scrolling
$(document).on("wheel", "input[type=range]", function (e) {
    $(this).blur();
});

//update slider output values oninput
//--need to update to include onchange for IE
first_slider.oninput = function(){first_output.innerHTML = this.value;}
second_slider.oninput = function(){second_output.innerHTML = this.value;}
third_slider.oninput = function(){third_output.innerHTML = this.value;}
age_slider.oninput = function(){age_output.innerHTML = this.value;}

//*****************************************
//-----------starting experiment-----------
//*****************************************

//DETECT Browsers
function getBrowser(){
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1+
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  var output = 'Detecting browsers by ducktyping:<hr>';
  output += 'isFirefox: ' + isFirefox + '<br>';
  output += 'isChrome: ' + isChrome + '<br>';
  output += 'isSafari: ' + isSafari + '<br>';
  output += 'isOpera: ' + isOpera + '<br>';
  output += 'isIE: ' + isIE + '<br>';
  output += 'isEdge: ' + isEdge + '<br>';
  output += 'isBlink: ' + isBlink + '<br>';
  document.body.innerHTML = output;

  if(isFirefox || isChrome || isOpera){
    showPage(info_consent_letter);
    showPage(yes_consent_btn);
    showPage(no_consent_btn);
    showPage(do_not_refresh);

    [the_stim_list, the_size_list] = generateTrials(num_practice);

    //set initial default slider values
    setSliderValues();
  }
  else{
    browser_not_supported.innerHTML =
      "<p>Unfortunately the browser you are using is not supported for this experiment.</p>"
      +"<p>Please copy the address and reload the webpage using one of the following browsers:</p>"
      +"<p><b><a href='https://www.mozilla.org/en-US/firefox/new/' target='_blank'>Firefox</a>"
      +"| <a href='https://www.google.com/chrome/' target='_blank'>Google Chrome</a>"
      +"| <a href='https://www.opera.com/' target='_blank'>Opera</a></b></p>";
    //showPage(browser_not_supported);
  }
}

//getBrowser();

showPage(info_consent_letter);
showPage(yes_consent_btn);
showPage(no_consent_btn);
showPage(do_not_refresh);

[the_stim_list, the_size_list] = generateTrials(num_practice);

//set initial default slider values
setSliderValues();
