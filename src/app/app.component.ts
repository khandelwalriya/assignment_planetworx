import { Component } from '@angular/core';
import { Car } from './Car';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  N;
  m;
  no_of_parkingspace_arr;
  next_available_slot;
  color_list = ['White','Blue','Black','Red'];
  createParkingLot(){
  	this.no_of_parkingspace_arr = new Array();
  	for(let i=0; i<this.m; i++){
  		let str = 'KA-'+this.generateRandomNo(2)+'-'+this.generateRandomString(2)+'-'+this.generateRandomNo(4);
  		let color=this.color_list[Math.floor(Math.random()*this.color_list.length)];
  		let obj = new Car(str,color,i);
  		this.no_of_parkingspace_arr.push(obj);
  		console.log(this.no_of_parkingspace_arr);
  	}
  }

  generateRandomNo(digit_len){
  	var initial_range, last_range;
  	initial_range=Math.pow(10,digit_len);
  	last_range = Math.pow(10,(digit_len+1));
		return Math.floor(initial_range+(last_range - initial_range)*Math.random()).toString().substring(1);
	}

	generateRandomString(strlen){
		let text = "";
		let char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for(let i=0; i < strlen; i++ )
		{  
			text += char_list.charAt(Math.floor(Math.random() * char_list.length));
		}
		return text;
	}

	checkUniqueRegNo(){

	}
}


