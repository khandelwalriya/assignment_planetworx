import { Component, OnInit } from '@angular/core';
import { Car } from './Car';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  N;
  m;
  no_of_parkedcars_details_arr;
  next_available_slots_arr;
  color_list = ['White','Blue','Black','Red'];
  parkNewCarForm:FormGroup = new FormGroup({
    regno: new FormControl("",Validators.required),
    color:new FormControl("",Validators.required),
    parking_date:new FormControl(new Date()),
    alloted_slot_no:new FormControl("")
  })
  searchForm:FormGroup =  new FormGroup({
  	regno:new FormControl(""),
  	color:new FormControl("")
  })

  ngOnInit(){
  	this.N=this.getDataFromSession('total_slots');
  	this.no_of_parkedcars_details_arr = this.getDataFromSession('parkedCarsDetails');
  	this.next_available_slots_arr = this.getDataFromSession('availableSlots');
  	if(this.N==null || this.no_of_parkedcars_details_arr==null) {
  		this.hideListOfCars();
	  } else {
	  	this.showListOfCars();
	  	this.sort('parking_date');
	  }
  }

  createParkingLot(){
  	if(this.N==null || this.no_of_parkedcars_details_arr==null){
  		this.no_of_parkedcars_details_arr = new Array();
  		this.next_available_slots_arr = new Array();
  		for(let i=0;i<this.N;i++){
  			this.next_available_slots_arr.push(i+1);
  		}
  		this.generateInitialCarDetails();
  	} 
  	this.showListOfCars();
  }

  generateInitialCarDetails(){
  	for(let i=0; i<this.m; i++){
  		let str = 'KA-'+this.generateRandomNo(2)+'-'+this.generateRandomString(2)+'-'+this.generateRandomNo(4);
  		let color=this.color_list[Math.floor(Math.random()*this.color_list.length)];
  		let obj = new Car(str,color,i+1,new Date());
  		var flag = false;
			for(let n = 0 ; n < this.no_of_parkedcars_details_arr.length ; n++){
				if(str===this.no_of_parkedcars_details_arr[n]['regno']){
					flag=true;
					i--;
					break;
				}
			}
			if(flag){
				continue;
			} else {
				var slotno = this.availableSlot();
				this.no_of_parkedcars_details_arr.push(obj);
				if(this.next_available_slots_arr.indexOf(slotno) > -1){
					this.next_available_slots_arr.splice(this.next_available_slots_arr.indexOf(slotno),1)
				}
			}
  		
  	}
  	this.setDataInSession('total_slots',this.N);
  	this.setDataInSession('parkedCarsDetails',this.no_of_parkedcars_details_arr);
  	this.setDataInSession('availableSlots',this.next_available_slots_arr);
  }

  showListOfCars(){
  	document.getElementById('pakinglot_creationForm').classList.add('d-none');
  	document.getElementById('listOfCarsParked').classList.remove('d-none');
  }

  hideListOfCars(){
  	document.getElementById('pakinglot_creationForm').classList.remove('d-none');
  	document.getElementById('listOfCarsParked').classList.add('d-none');
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

	setDataInSession(id,value){
		if(typeof value == 'object')
			value = JSON.stringify(value);
		sessionStorage.setItem(id,value);
	}

	getDataFromSession(id){
		var value = sessionStorage.getItem(id);
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}

	removeCarsFromParking(car){
		for (let n = 0 ; n < this.no_of_parkedcars_details_arr.length ; n++) {
	    if (this.no_of_parkedcars_details_arr[n].regno == car.regno) {
	    	this.next_available_slots_arr.push(car.alloted_slot_no);
	      var removedObject = this.no_of_parkedcars_details_arr.splice(n,1);
	      removedObject = null;
	      break;
		  }
		}
		this.setDataInSession('parkedCarsDetails',this.no_of_parkedcars_details_arr);
  	this.setDataInSession('availableSlots',this.next_available_slots_arr);
	}

	allotSlotToCar(formvals){
		var flag = false;
		for(let n = 0 ; n < this.no_of_parkedcars_details_arr.length ; n++){
			if(formvals['regno']===this.no_of_parkedcars_details_arr[n]['regno']){
				alert('Car no is already registered');
				flag=true;
				break;
			}
		}
		if(!flag){
			var slotno = this.availableSlot();
			let obj = new Car(formvals['regno'],formvals['color'],slotno,new Date());
			this.no_of_parkedcars_details_arr.push(obj);
			if(this.next_available_slots_arr.indexOf(slotno) > -1){
				this.next_available_slots_arr.splice(this.next_available_slots_arr.indexOf(slotno),1)
			}
			$('#parkNewCarModal').modal('hide');
			alert( 'slot no '+slotno +' is alloted');
			this.closeModal();
		}
		this.setDataInSession('parkedCarsDetails',this.no_of_parkedcars_details_arr);
  	this.setDataInSession('availableSlots',this.next_available_slots_arr);
	}

	availableSlot(){
		return Math.min(...this.next_available_slots_arr);
	}

	checkCarNo(form){
		
	}

	closeModal(){
		this.parkNewCarForm.reset();
  	this.parkNewCarForm.controls['color'].setValue("");
	}

	searchFromArray(arr,formObj){
		console.log(formObj);
		this.no_of_parkedcars_details_arr = arr.filter((obj)=>{
			console.log(obj);
			if(formObj.color=="" && formObj.regno == ""){
				return arr;
			} else if(formObj.color=="" && formObj.regno != ""){
				return obj.regno.toLowerCase().includes(formObj.regno.trim().toLowerCase());
			} else if(formObj.color!="" && formObj.regno == ""){
				return obj.color.includes(formObj.color);
			} else {
				return (obj.color.includes(formObj.color) && obj.regno.toLowerCase().includes(formObj.regno.trim().toLowerCase()));
			}
		});
	}

	direction: number;
  isDesc: boolean = true;
  column: string = 'parking_date';
  sort(property){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1; 
  }
}


