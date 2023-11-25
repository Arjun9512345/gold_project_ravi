import {Component, OnInit} from '@angular/core';
import { Pos7DaysDataModel, PosDashBoardModel} from "../../../modal/DashboardDataModel";
import {Subject} from "rxjs";
import {ValidateResponse} from "../../../../@pristine/process/ValidateResponse";
import {WebApiHttp} from "../../../../@pristine/process/WebApiHttp.services";
import {Router} from "@angular/router";
import {SessionManageMent} from "../../../../@pristine/process/SessionManageMent";

@Component({
  selector: 'app-maindashboard',
  templateUrl: './posdashboard.component.html',
  styleUrls: ['./posdashboard.component.scss']
})
export class PosdashboardComponent implements OnInit {

  dashboardData: Array<PosDashBoardModel> = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private validateResponse: ValidateResponse,
    public webapiHttp: WebApiHttp,
    private sessionManageMent:SessionManageMent,
    public router:Router
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
     this.BindUserActivity();
  }

  BindUserActivity() {
    this.webapiHttp.Get(this.webapiHttp.ApiURLArray.pos_dash_sale_amount + this.sessionManageMent.getEmail).then(result => {
      this.dashboardData = result as PosDashBoardModel[];
    }, error => {
      console.log(error);
    }).finally(()=>{
      this.Bind7daysActivity();
    });
  }

  weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  getDay(data:string):string{
    var date=new Date(data);
    return this.weekdays[date.getDay()]
  }
  pos_7_days_dataList:Array<Pos7DaysDataModel>=[];
  Bind7daysActivity() {
    this.webapiHttp.Get(this.webapiHttp.ApiURLArray.pos_dash_weekly_sale_amount + this.sessionManageMent.getEmail).then(result => {
      this.pos_7_days_dataList = result as Pos7DaysDataModel[];
    }, error => {
      console.log(error);
    });
  }
  get7DaysTotalOrder(){
    let sum:number=0;
    for(let i=0;i<this.pos_7_days_dataList.length;i++){
      sum+=this.pos_7_days_dataList[i].no_of_sale;
    }
    return sum;
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
}
