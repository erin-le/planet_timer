const timer_obj = {
	work_time : "25:00",
	break_time : "05:00",
	is_work_timer : false, //initial_timer
	work_count : 0,
	break_count : 0,
	is_going : false,
	alarm_sound: new Audio("pomo_timekeeper_alarm.m4a"),
	skip_flag: false,
	sec: 0,  //initial_timer
	min: 0,  //initial_timer
  start_time: 0,  //countdown
  total_sec: 0,  //initial_timer, modified in timer end, timer_pause
  rem_sec: 0  //initial_timer, timer_end
};



let initial_timer = () => {
	document.querySelector("#timer").innerHTML = timer_obj.work_time;
	timer_obj.min = Number(timer_obj.work_time.substring(0,2));     //initialize from work_time
	timer_obj.sec = Number(timer_obj.work_time.substring(3));       //" "
	timer_obj.is_work_timer = true;
	document.querySelector("#work_ct").innerHTML = timer_obj.work_count;
	document.querySelector("#break_ct").innerHTML = timer_obj.break_count;
  timer_obj.total_sec = (timer_obj.min * 60) + timer_obj.sec; //total time of the timer, in seconds
  timer_obj.rem_sec = timer_obj.total_sec;
  document.querySelector(".skip_caution").style.display = "none";
}


/*can't do it w/ an event handler w/in a do/while block ;-;
function clock_tick(){
  if (window.Worker){
    let counter = new Worker("countdown.js");
  	//let curr_time = document.querySelector("#timer").innerHTML;
  	//do{
  	//curr_time = document.querySelector("#timer").innerHTML;
  	console.log(timer_obj.min, " ", timer_obj.sec);
    let min = timer_obj.min;
    let sec = timer_obj.sec;
    let total_sec = timer_obj.min*60 + timer_obj.sec; //initialize

    timer_obj.rem_time = total_sec;
    console.log(total_sec);
    counter.postMessage([total_sec, true]);
    console.log("message sent");
    //do {
      counter.onmessage = function(event){
        total_sec = event.data[0];
        timer_obj.is_going = event.data[1];
        console.log(total_sec, " ", timer_obj.is_going);
        if (min === 0 && sec === 0){   //what to do when timer hits 0
          timer_obj.is_going = false;
          counter.postMessage([0,timer_obj.is_going]);    //tells the worker
          timer_end();
          (timer_obj.alarm_sound).play();
          return 0;
        }

        min = Math.floor(total_sec / 60);
        sec = total_sec % 60;

        if (sec == 0){
          sec = 59;
          min -= 1;
        }
        else {
          sec -= 1;
        }


        let return_min;
        let return_sec;

        //if (sec < 10 && min < 10){
        //  return_time = `0${min}:0${sec}`;
        //}
        //else if (min < 10){
        //  return_time = `0${min}:${sec}`;
        //}
        //else if (sec < 10) {
        //  return_time = `${min}:0${sec}`;
        //}
        //
        if (sec < 10){
          return_sec = `0${sec}`;
        }
        else{
          return_sec = `${sec}`;
        }
        if (timer_obj.min < 10){
          return_min = `0${min}`;
        }
        else{
          return_min = `${min}`;
        }
        document.querySelector("#timer").innerHTML = return_min + ":" + return_sec;
      }

    //} while(min !== 0 || sec !== 0)
  //}while(curr_time != "00:01")
  return 0;
  }
  else{
    console.log("Browser doesn't support web workers :/");
  }
}
/*
/*



*/


let interval;
function countdown(tick_func){
  console.log("countdown started.")
	if (timer_obj.is_going === false){	//prevents a "double countdown" if start is pressed >1 time
    timer_obj.start_time = Date.now();
    timer_obj.is_going = true;
		interval = setInterval(tick_func, 200); //every 200 ms, check the time
	}
}

function stop_countdown(){
	clearInterval(interval);
	timer_obj.is_going = false;
	//swap_timers();
}

function clock_tick(){
  console.log("ticking...");
  let running_time = Math.floor((Date.now() - timer_obj.start_time)/1000);
  let rem_time = timer_obj.total_sec - running_time;
  timer_obj.rem_sec = rem_time;
  //console.log("running time: ", running_time, "rem_time: ", rem_time);
  //console.log("current time: ", Date.now(), "start time: ", timer_obj.start_time);
  //console.log("total seconds: ", timer_obj.total_sec);
  let min = Math.floor(rem_time / 60);
  let sec = rem_time % 60;

  let return_min;
  let return_sec;
  if (sec < 10){
    return_sec = `0${sec}`;
  }
  else{
    return_sec = `${sec}`;
  }
  if (timer_obj.min < 10){
    return_min = `0${min}`;
  }
  else{
    return_min = `${min}`;
  }

  document.querySelector("#timer").innerHTML = return_min + ":" + return_sec;
  if (timer_obj.rem_sec <= 0){
    timer_end();
  }
}

function timer_end(){
  stop_countdown();
  (timer_obj.alarm_sound).play();

  if (timer_obj.is_work_timer === false){
		timer_obj.break_count += 1;
	}
	else{
		timer_obj.work_count += 1;
	}
  swap_timers();
  timer_obj.total_sec = (timer_obj.min * 60) + timer_obj.sec;//reset to initial vals
  timer_obj.rem_sec = timer_obj.total_sec;
}

function timer_pause(){
  stop_countdown();
  timer_obj.total_sec = timer_obj.rem_sec;
  //console.log("timer_obj.total_sec")
}


function swap_timers(){
  if (timer_obj.is_going === true){
    stop_countdown();
    timer_obj.is_going = false;
  }
	if (timer_obj.is_work_timer === false){	//was on break timer
		document.querySelector("#timer").innerHTML = timer_obj.work_time;
        timer_obj.min = Number(timer_obj.work_time.substring(0,2));
  	    timer_obj.sec = Number(timer_obj.work_time.substring(3));
		document.querySelector("#timer-label").innerHTML = "Work"
		timer_obj.is_work_timer = true;
	}
	else{		//was on work timer
		document.querySelector("#timer").innerHTML = timer_obj.break_time;
        console.log("switched to break", "break time: ", timer_obj.break_time)
        timer_obj.min = Number(timer_obj.break_time.substring(0,2));
        timer_obj.sec = Number(timer_obj.break_time.substring(3));
		document.querySelector("#timer-label").innerHTML = "Break"
		timer_obj.is_work_timer = false;
	}
    timer_obj.total_sec = (timer_obj.min * 60) + timer_obj.sec;
	timer_obj.is_going = false;
	document.querySelector("#work_ct").innerHTML = timer_obj.work_count;
	document.querySelector("#break_ct").innerHTML = timer_obj.break_count;
}

function skip_timer(){
  /*
	if (timer_obj.skip_flag === false){
		document.querySelector("#skip_caution").innerHTML = "Are you sure you want to skip the current countdown?"
		timer_obj.skip_flag = true;
	}
	else{
		document.querySelector("#skip_caution").innerHTML = "";
		timer_obj.skip_flag = false;
		swap_timers();
	}
  */
  
  //document.querySelector(".skip_caution").style.display = "block";
        /*
  if (timer_obj.skip_flag === true){
    timer_obj.skip_flag = false;
    document.querySelector(".skip_caution").style.display = "none";
    if (timer_obj.is_work_timer === true){
      timer_obj.work_count += 1;
    }
    else{
      timer_obj.break_count += 1;

    }
    swap_timers();
    
  }

*/
        if (timer_obj.is_work_timer === true){
                timer_obj.work_count += 1;
        }
        else{
                timer_obj.break_count += 1;
  
        }
        swap_timers();
//timer_obj.skip_flag = true;

}

