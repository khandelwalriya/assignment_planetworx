export class Car {

    regno: string;
    color:string;
    alloted_slot_no :number;
    parking_date:string|Date;

    constructor(regno:string,color:string,alloted_slot_no:number,parking_date:string|Date) {
      this.regno = regno;
      this.color = color;
      this.alloted_slot_no =alloted_slot_no;
      this.parking_date =parking_date;
    }
}
