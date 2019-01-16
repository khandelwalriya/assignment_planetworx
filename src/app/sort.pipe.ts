import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value!= null){
      if(args.property=='parking_date'){
        return value.sort(function(a, b){
            if( new Date(a[args.property]).getTime() < new Date(b[args.property]).getTime()){
                return -1 * args.direction;
            }
            else if( new Date(a[args.property]).getTime() > new Date(b[args.property]).getTime()){
                return 1 * args.direction;
            }
            else{
                return 0;
            }
        
        });
      } else if(args.property=='alloted_slot_no'){
          return value.sort(function(a, b){
              if(a[args.property] !=undefined && b[args.property] != undefined) {
                  if(a[args.property] < b[args.property]){
                      return -1 * args.direction;
                  }
                  else if( a[args.property] > b[args.property]){
                      return 1 * args.direction;
                  }
                  else{
                      return 0;
                  }
              }
          });
      } else {
      	  return value.sort(function(a, b){
      	    if(a[args.property] !=undefined && b[args.property] != undefined) {
      	        if(a[args.property].toLowerCase() < b[args.property].toLowerCase()){
      	            return -1 * args.direction;
      	        }
      	        else if( a[args.property].toLowerCase() > b[args.property].toLowerCase()){
      	            return 1 * args.direction;
      	        }
      	        else{
      	            return 0;
      	        }
      	    }
      	});
      }
    }
  }

}
