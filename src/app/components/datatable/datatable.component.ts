import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../service/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { AddcityComponent } from 'src/app/shared/addcity/addcity.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EditcityComponent } from 'src/app/shared/editcity/editcity.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  AddCityToDataSourceSub: Subscription;
  getCityInformationSub: Subscription;
  displayedColumns = [
    'city',
    'start_date',
    'end_date',
    'price',
    'status',
    'color',
    'edit',
    'delete',
  ];
  range: FormGroup;
  constructor(private dataService: DataService, public dialog: MatDialog) {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.getCityInformation();

    this.AddCityToDataSourceSub = this.dataService.AddCityToDataSource$.subscribe(
      (cityInfo) => {
        if (cityInfo) {
          this.dataSource.data = [...this.dataSource.data, cityInfo];
          this.dataService.allCitiData.push(cityInfo);
          this.dataService.showSuccess('City info added successfully.', 'Add');
        }
      }
    );

    this.dataService.editCityToDataSource$.subscribe((cityInfo) => {
      if (cityInfo) {
        this.dataSource.data = [...this.dataService.allCitiData];
        this.dataService.showSuccess('City info Edited successfully.', 'Edit');
      }
    });
  }

  getCityInformation() {
    this.getCityInformationSub = this.dataService
      .getCityInformationFromAPI()
      .subscribe((cityInfoList) => {
        if (cityInfoList) {
          this.dataSource = new MatTableDataSource(cityInfoList);
          this.dataService.allCitiData = [...cityInfoList];
          this.dataSource.sort = this.sort;
          this.dataService.showSuccess(
            'City info loaded successfully.',
            'Read'
          );
        }
      });
  }

  trackByIndex(index, item) {
    return item.id;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (this.range.value.start && this.range.value.end) {
      this.range.value.start = moment(this.range.value.start).format(
        'MM/DD/yyyy'
      );
      this.range.value.end = moment(this.range.value.end).format('MM/DD/yyyy');

      var resultProductData = this.dataService.allCitiData.filter(
        (a) =>
          new Date(a.start_date).getTime() <=
            new Date(this.range.value.end).getTime() &&
          new Date(a.start_date).getTime() >=
            new Date(this.range.value.start).getTime() &&
          new Date(a.end_date).getTime() >=
            new Date(this.range.value.start).getTime() &&
          new Date(a.end_date).getTime() <=
            new Date(this.range.value.end).getTime()
      );

      this.dataSource = new MatTableDataSource(resultProductData);
    }
  }

  openCityDialog(): void {
    const dialogRef = this.dialog.open(AddcityComponent, {
      width: '640px',
      disableClose: true,
    });
  }

  openEditCityDialog(element): void {
    const dialogRef = this.dialog.open(EditcityComponent, {
      width: '640px',
      disableClose: true,
    });

    setTimeout(() => {
      this.dataService.editCityDialoginfo.next(_.cloneDeep(element));
    }, 100);
  }

  deleteCityInfo(element) {
    this.dataService.deleteCity(element).subscribe((cityInfo) => {
      if (cityInfo) {
        let index = this.dataService.allCitiData.findIndex(
          (data) => data.id === element.id
        );
        if (index != -1) {
          this.dataService.allCitiData.splice(index, 1);
          this.dataSource.data = [...this.dataService.allCitiData];
          this.dataService.showSuccess(
            'Record Deleted successfully.',
            'Delete'
          );
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.AddCityToDataSourceSub) {
      this.AddCityToDataSourceSub.unsubscribe();
    }
    if (this.getCityInformationSub) {
      this.getCityInformationSub.unsubscribe();
    }
  }
}
