import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CityInfo } from "../model/cityinfo.model";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

const BASE_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,private toastService: ToastrService) { }

  toastConfig = {
    // configurations for Toast Message
    closeButton: true,
    disableTimeOut:false,
    timeOut: 3000,
  };

  allCitiData;
  private getCityInformation = new Subject<CityInfo[]>();
  getCityInformation$ = this.getCityInformation.asObservable();

  AddCityToDataSource = new Subject<CityInfo>();
  AddCityToDataSource$ = this.AddCityToDataSource.asObservable();


  editCityDialoginfo = new Subject<any>();
  editCityDialoginfo$ = this.editCityDialoginfo.asObservable();

  editCityToDataSource = new Subject<CityInfo>();
  editCityToDataSource$ = this.editCityToDataSource.asObservable();

  DeleteCityToDataSource = new Subject<CityInfo>();
  DeleteCityToDataSource$ = this.DeleteCityToDataSource.asObservable();



  public getCityInformationFromAPI(): Observable<any> {
    return this.http.get<CityInfo[]>(BASE_URL +'CityInfo');
  }

  addCity(payload: CityInfo): Observable<CityInfo> {
    return this.http.post<CityInfo>(BASE_URL+'CityInfo', payload);
  }

  editCity(payload: CityInfo): Observable<CityInfo> {
    return this.http.put<CityInfo>(BASE_URL+'CityInfo/'+payload.id, payload);
  }

  deleteCity(payload: CityInfo) {
    return this.http.delete(BASE_URL+'CityInfo/'+payload.id);
  }

  showSuccess(message, title) {
    this.toastService.success(message, 'Success', this.toastConfig);
  }

  showError(message, title) {
    this.toastService.error(message, title, this.toastConfig);
  }
}
