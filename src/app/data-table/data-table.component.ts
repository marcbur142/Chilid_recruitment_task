import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatPaginatorIntl } from '@angular/material';
import { DataTableDataSource } from './data-table-datasource';

// Navigation icons
export class MyCustomPaginatorIntl extends MatPaginatorIntl {
  showPlus: boolean;
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const active = (page + 1);
      return '- ' + active + ' -';
  }
}

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }
  ]
})

export class DataTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DataTableDataSource;

  displayedColumns = ['id', 'first_name', 'last_name', 'birth_date', 'company', 'note'];

  myCustomPaginatorIntl: MyCustomPaginatorIntl;

  constructor(matPaginatorIntl: MatPaginatorIntl) {
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;
  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource(this.paginator, this.sort);
  }
}

