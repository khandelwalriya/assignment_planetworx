import { Component, OnInit, OnDestroy } from '@angular/core';
import { Car } from './Car';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {DataService} from './data.service';
declare const require;
// var data = require('../src/assets/dummy.json');
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DataService]
})

export class AppComponent implements OnInit, OnDestroy{

	title='app';
  N;
  m=0;
  no_of_parkedcars_details_arr;
  next_available_slots_arr;
  color_list = ['White','Blue','Black','Red'];
  parkNewCarForm:FormGroup = new FormGroup({
    regno: new FormControl(""),
    color:new FormControl("",Validators.required),
    parking_date:new FormControl(new Date()),
    alloted_slot_no:new FormControl(""),
    regnostr1 :new FormControl("",[Validators.required,Validators.maxLength(2),Validators.minLength(2),Validators.pattern("^[A-Za-z]{2}$")]),
    regnostr2 :new FormControl("",[Validators.required,Validators.maxLength(2),Validators.minLength(2),Validators.pattern("^[0-9]{2}$")]),
    regnostr3 :new FormControl("",[Validators.required,Validators.maxLength(2),Validators.minLength(2),Validators.pattern("^[A-Za-z]{2}$")]),
    regnostr4 :new FormControl("",[Validators.required,,Validators.maxLength(4),Validators.minLength(4),Validators.pattern("^[0-9]{4}$")])
  })
  searchForm:FormGroup =  new FormGroup({
  	regno:new FormControl(""),
  	color:new FormControl("")
  })  

  constructor(
    private dataserv : DataService
  ){}

  ngOnInit(){
    // this.fetchData();
  	this.initializeVariables();
  }

  initializeVariables(){
  	this.N = (this.getDataFromSession('sessionDataJson'))?this.getDataFromSession('sessionDataJson')['total_slots']:null;
  	this.no_of_parkedcars_details_arr = (this.getDataFromSession('sessionDataJson'))?this.getDataFromSession('sessionDataJson')['parkedCarsDetails']:null;
  	this.next_available_slots_arr = (this.getDataFromSession('sessionDataJson'))?this.getDataFromSession('sessionDataJson')['availableSlots']:null;
  	if(this.N==null || this.no_of_parkedcars_details_arr==null) {
  		this.hideListOfCars();
	  } else {
	  	this.showListOfCars();
	  	this.sort('parking_date');
	  }
  }

  createParkingLot(){
  	if(this.N <this.m){
  		alert('Total no of parked cars can not be more than no of parking slots.');
  	} else {
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
  	var obj = {
  		'total_slots':this.N,
  		'parkedCarsDetails':this.no_of_parkedcars_details_arr,
  		'availableSlots':this.next_available_slots_arr
  	}
  	this.setDataInSession('sessionDataJson',obj);
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

	updateDataInSession(){
		var obj =  {
  		'total_slots':this.N,
  		'parkedCarsDetails':this.no_of_parkedcars_details_arr,
  		'availableSlots':this.next_available_slots_arr
  	}
  	this.setDataInSession('sessionDataJson',obj);
	}

	removeCarsFromParking(car){
		let parking_amount = this.calculateAmount(car);
    alert('Total Parking Amount = '+parking_amount);
		// for (let n = 0 ; n < this.no_of_parkedcars_details_arr.length ; n++) {
	 //    if (this.no_of_parkedcars_details_arr[n].regno == car.regno) {
	 //    	this.next_available_slots_arr.push(car.alloted_slot_no);
	 //      var removedObject = this.no_of_parkedcars_details_arr.splice(n,1);
	 //      removedObject = null;
	 //      break;
		//   }
		// }
		// this.updateDataInSession();
	}

	allotSlotToCar(formvals){
		var flag = false;
		formvals['regno']= formvals['regnostr1']+'-'+formvals['regnostr2']+'-'+formvals['regnostr3']+'-'+formvals['regnostr4'];
		for(let n = 0 ; n < this.no_of_parkedcars_details_arr.length ; n++){
			if(formvals['regno']===this.no_of_parkedcars_details_arr[n]['regno']){
				alert('Car no is already registered');
				flag=true;
				break;
			}
		}
		if(!flag){
			var slotno = this.availableSlot();
			if(slotno!=0){
				let obj = new Car(formvals['regno'],formvals['color'],slotno,new Date());
				this.no_of_parkedcars_details_arr.push(obj);
				if(this.next_available_slots_arr.indexOf(slotno) > -1){
					this.next_available_slots_arr.splice(this.next_available_slots_arr.indexOf(slotno),1)
				}
				$('#parkNewCarModal').modal('hide');
				alert( 'slot no '+slotno +' is alloted');
        // this.postDataToJson(obj);
				this.closeModal();
			}
		}
		this.updateDataInSession();
	}

	availableSlot(){
		if(this.no_of_parkedcars_details_arr && this.no_of_parkedcars_details_arr.length == this.N){
			return 0;
		}
		return (this.next_available_slots_arr && this.next_available_slots_arr.length>0)?Math.min(...this.next_available_slots_arr):1;
	}

	closeModal(){
		this.parkNewCarForm.reset();
  	this.parkNewCarForm.controls['color'].setValue("");
	}

	searchFromArray(arr,formObj){
		this.no_of_parkedcars_details_arr = arr.filter((obj)=>{
			if(formObj.color=="" && formObj.regno == ""){
				return arr;
			} else if(formObj.color=="" && formObj.regno != ""){
				return obj.regno.toLowerCase().includes(formObj.regno.trim().toLowerCase());
			} else if(formObj.color!="" && (formObj.regno == "" || formObj.regno==null)){
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

  checkTextAndPassKey(elem){
  	if(elem.target.value.length>=elem.target.maxLength){
  		var str =parseInt(elem.target.id) + 1;
  		 document.getElementById(""+str).focus();
  	}
  }

  resetSearch(){
  	this.searchForm.reset();
  	this.searchForm.controls['color'].setValue("");
  	this.no_of_parkedcars_details_arr = this.getDataFromSession('sessionDataJson')['parkedCarsDetails'];
  }

  validateForm(){
  	const invalid = [];
    const controls = this.parkNewCarForm.controls;
    for (const name in controls) {
        if (name!='color' && controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  ngOnDestroy(){
  	sessionStorage.clear();
  }

  calculateAmount(carobj){
  	carobj.amount = 0;
  	let dt1 = new Date(carobj.parking_date);
    let dt2 = new Date();
   // console.log(dt1);
    //console.log(dt2);
    let diff =(dt2.getTime() - dt1.getTime()) ;
    //let hours = Math.floor(diff / (1000 * 60 * 60));
    let mins = Math.floor(diff / (1000 * 60));
    //console.log('mins='+mins);
    var noofhours = (mins/60>1)?(mins/60):0;
    if(Math.trunc(noofhours)<=1){
    	carobj.amount = 20;
    	if(noofhours%24){
    		carobj.amount =carobj.amount+10;
    	}
    }
    if(Math.trunc(noofhours)>1){
      carobj.amount = 20;
      if(noofhours%24){
        carobj.amount =carobj.amount+10;
      }
      noofhours = Math.trunc(noofhours)-1;
    	carobj.amount =carobj.amount+Math.trunc(noofhours/24)*200;
    	
    }
    return carobj.amount;

    
  }

  queryQuestionNo="";
  querymodal_selectedcolor ="";
  querymodal_selecteddate;
  querymodal_result;
  querymodal_selecteddate_from;
  querymodal_selecteddate_to;
  queryToData(){
    let cardataarr = this.getDataFromSession('sessionDataJson')['parkedCarsDetails'];
    let result;
    var thisobj= this;
    let dateobj1:any = new Date(thisobj.querymodal_selecteddate).getDate()+'/'+new Date(thisobj.querymodal_selecteddate).getMonth()+'/'+new Date(thisobj.querymodal_selecteddate).getFullYear();
    switch (this.queryQuestionNo) {

      case "1":
        result = cardataarr.filter(function(car){
          let dateobj2 = new Date(car.parking_date).getDate()+'/'+new Date(car.parking_date).getMonth()+'/'+new Date(car.parking_date).getFullYear();
          return (dateobj1==dateobj2);
        })
        this.querymodal_result ='Resulted No. of records = '+ result.length;
        break;

      case "2":
        let total_amount =0 ;
        result = cardataarr.filter(function(car){
          let dateobj2 = new Date(car.parking_date).getDate()+'/'+new Date(car.parking_date).getMonth()+'/'+new Date(car.parking_date).getFullYear();
          return (dateobj1==dateobj2);
        })
        result.forEach(function(obj){
          total_amount = thisobj.calculateAmount(obj)+ total_amount;
        })
        this.querymodal_result = 'Total amount = '+total_amount;
        break;

      case "3":
        result = cardataarr.filter(function(car){
          return (car.color== thisobj.querymodal_selectedcolor);
        })
        this.querymodal_result = 'Resulted No. of records = ' + result.length;
        break;

      case "4":
        result = cardataarr.filter(function(car){
           let dateobj2 = new Date(car.parking_date).getDate()+'/'+new Date(car.parking_date).getMonth()+'/'+new Date(car.parking_date).getFullYear();
          return (dateobj1==dateobj2
            && car.color== thisobj.querymodal_selectedcolor);
        })
        this.querymodal_result = 'Resulted No. of records = ' + result.length;
        break;

      case "5":
        let total_amount_1 =0 ;
        let todateobj = new Date();
        let fromdateobj = this.calculateBeforeDate(6);
        result = cardataarr.filter(function(car){
          let dateobj = new Date(car.parking_date).getTime();
          return (todateobj.getTime() >= dateobj || fromdateobj.getTime()<=dateobj);
        })
        result.forEach(function(obj){
          total_amount_1 = thisobj.calculateAmount(obj)+ total_amount_1;
        })
        this.querymodal_result = 'Total amount = '+total_amount_1;
        break;

      case "6":
        let total_amount_2 =0 ;
        result = cardataarr.filter(function(car){
          let dateobj = new Date(car.parking_date).getTime();
          return (new Date(thisobj.querymodal_selecteddate_to).getTime() >= dateobj || new Date(thisobj.querymodal_selecteddate_from).getTime()<=dateobj);
        })
        console.log(result);
        result.forEach(function(obj){
          total_amount_2 = thisobj.calculateAmount(obj)+ total_amount_2;
        })
        this.querymodal_result = 'Total amount = '+total_amount_2;
        break;
    }
  }

  calculateBeforeDate(days){
    var days; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    var day =last.getDate();
    var month=last.getMonth();
    var year=last.getFullYear();
    var str:any;
    str = new Date(year,month,day);
    return str;
  }

  toggleElements(targetElem){
    console.log(targetElem.value);
    if(targetElem.value==1 || targetElem.value==2){
      this.querymodal_selectedcolor ="";
    } else if(targetElem.value == 3){
      this.querymodal_selecteddate = undefined;
    } else {
    }
  }

  closeQueryModal(){
    this.queryQuestionNo = "";
    this.querymodal_selectedcolor = "";
    this.querymodal_selecteddate = undefined;
    this.querymodal_result = undefined;
    this.querymodal_selecteddate_from = undefined;
    this.querymodal_selecteddate_to  = undefined;
  }
  // fetchData(){
  //   console.log(JSON.stringify(data));
  // }

  // postDataToJson(data){
  //   this.dataserv.postDataToJson(data).subscribe(
  //     res=>{
  //       console.log(res);
  //     }, 
  //     err=>{
  //       console.log(err);
  //     }
  //   );
  // }
}


