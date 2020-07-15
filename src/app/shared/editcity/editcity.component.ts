import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/service/data.service';
import { CityInfo } from 'src/app/model/cityinfo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editcity',
  templateUrl: './editcity.component.html',
  styleUrls: ['./editcity.component.scss'],
})
export class EditcityComponent implements OnInit, OnDestroy {
  public editCityForm: FormGroup;
  editCityDialoginfoSub: Subscription;
  editData;
  startDate = new Date();
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private dataService: DataService
  ) {
    this.editCityForm = this.fb.group({
      start_date: new Date(),
      end_date: '',
      city: ['', [Validators.required]],
      price: ['', [Validators.required]],
      status: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.editcityDialog();
  }

  editcityDialog() {
    this.editCityDialoginfoSub = this.dataService.editCityDialoginfo$.subscribe(
      (data) => {
        if (data) {
          this.editData = JSON.parse(JSON.stringify(data));
          delete data.id;
          data.start_date = new Date(data.start_date);
          data.end_date = new Date(data.end_date);
          this.editCityForm.setValue(data);
        }
      }
    );
  }

  editCity() {
    const startdate = this.datePipe.transform(
      this.editCityForm.value.start_date,
      'MM/dd/yyyy'
    );
    const enddate = this.datePipe.transform(
      this.editCityForm.value.end_date,
      'MM/dd/yyyy'
    );

    const city: CityInfo = {
      id: this.editData.id,
      start_date: startdate,
      end_date: enddate,
      city: this.editCityForm.value.city,
      status: this.editCityForm.value.status,
      color: this.editCityForm.value.color,
      price: this.editCityForm.value.price,
    };

    this.dataService.editCity(city).subscribe((cityInfo) => {
      if (cityInfo) {
        let index = this.dataService.allCitiData.findIndex(
          (data) => data.id === this.editData.id
        );
        if (index != -1) {
          this.dataService.allCitiData[index] = cityInfo;
          this.dataService.editCityToDataSource.next(cityInfo);
        }
      }
    });
    this.dialog.closeAll();
  }

  closeDialog(): void {
    this.editCityForm.reset();
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    if (this.editCityDialoginfoSub) {
      this.editCityDialoginfoSub.unsubscribe();
    }
  }
}
