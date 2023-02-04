
/*
function countdown(min, sec){
  sec_time = min*60 + sec;
  while(sec_time !== 0){
    sec_time-= 1;
    sleep(1);
    postMessage(sec_time);

  }
}

function stop_countdown(){

}

*/


  onmessage = function(event){  //get remaining time and whether to continue timer from main prog
    let remain_sec;
    let is_going;
    console.log("message received in worker");
    remain_sec = event.data[0];
    is_going = event.data[1];
    console.log(remain_sec, " ", is_going);
    if (is_going === true){
      countdown(decrement(remain_sec, is_going), is_going)
    }
    else{
      stop_countdown(interval);
    }
  }




function decrement(i, is_going){
  i -= 1;
  remain_sec = i;
  postMessage([i, is_going]);
  console.log("message posted back to main (from countdown, decrement)")
}



function countdown(decrement_func, is_going){
	if (is_going === false){	//prevents a "double countdown" if start is pressed >1 time
		is_going = true;
		setTimeout(decrement_func, 1000);
	}
}

function stop_countdown(interval){
	clearInterval(interval);
	is_going = false;
  postMessage(remain_sec, is_going);
	//swap_timers();
}
