import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CityInfo } from 'src/app/model/cityinfo.model';
import { DataService } from '../../service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addcity',
  templateUrl: './addcity.component.html',
  styleUrls: ['./addcity.component.scss'],
})
export class AddcityComponent implements OnInit, OnDestroy {
  public addCityForm: FormGroup;
  addCityToDataSourceSub: Subscription;
  editCityToDataSourceSub: Subscription;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.addCityForm = this.fb.group({
      startdate: '',
      enddate: '',
      city: ['', [Validators.required]],
      price: ['', [Validators.required]],
      status: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  saveCity() {
    const startdate = this.datePipe.transform(
      this.addCityForm.value.startdate,
      'MM/dd/yyyy'
    );
    const enddate = this.datePipe.transform(
      this.addCityForm.value.enddate,
      'MM/dd/yyyy'
    );

    const city: CityInfo = {
      id: this.dataService.allCitiData.length + 1,
      start_date: startdate,
      end_date: enddate,
      city: this.addCityForm.value.city,
      status: this.addCityForm.value.status,
      color: this.addCityForm.value.color,
      price: this.addCityForm.value.price,
    };

    this.dataService
      .addCity(city)
      .subscribe((cityInfo) => {
        if (cityInfo) {
          this.dataService.AddCityToDataSource.next(cityInfo);
        }
      });
    this.dialog.closeAll();
  }

  closeDialog(): void {
    this.addCityForm.reset();
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    if (this.editCityToDataSourceSub) {
      this.editCityToDataSourceSub.unsubscribe();
    }
    if (this.addCityToDataSourceSub) {
      this.addCityToDataSourceSub.unsubscribe();
    }
  }
}
