import { Component, ViewChild, AfterViewInit,OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
export interface PeriodicElement {
  "RowId": number,
  "Code": string,
  "Name": string,
  "Address": string,
  "Country": string,
  "State": string,
  "City": string,
  "Mobile": string,
  "Email": string,
  "GST": string,
  "PAN": string,
  "Latitude": string,
  "Longitude": string,
  "Pincode": number
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['action', 'client', 'code', 'name', 'address', 'country', 'state','city','mobile','email','gst','pan','Latitude','Longitude','Pincode'];
  ELEMENT_DATA: PeriodicElement[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  constructor(
    private router: Router, 
    private http: HttpClient
  ){

  }
  ngOnInit(): void {
   this.getdata();   
  }

  getdata() {
    const url = 'http://68.178.166.216/api/API/BillToPartyMaster/GetData';
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  
    // Create the form data
    const formData = new HttpParams()
      .set('RowId', '');
  
    // Send the POST request
    this.http.post(url, formData.toString(), { headers: headers })
      .subscribe((res:any) => {
        if(res){
          const data=res.Table;
          (data).forEach((element:any) => {
            this.ELEMENT_DATA.push({
              "RowId": element.RowId,
              "Code": element.Code,
              "Name": element.Name,
              "Address": element.Address,
              "Country": element.Country,
              "State": element['State,150,1'],
              "City": element['City,150,1'],
              "Mobile": element['Mobile No'],
              "Email": element['Email'],
              "GST": element['GST No'],
              "PAN": element['PAN No'],
              "Latitude": element.Latitude,
              "Longitude": element.Longitude,
              "Pincode": element.Pincode
            })
            this.dataSource=new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            
          });
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
