import { Component, OnInit, OnChanges, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTableDataSource, MatSort, MatPaginator, MatPaginatorIntl } from '@angular/material';

import { ForwardingEventCL } from '../../../shared/models/clModels';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS, getPaginatorLabel, AlertTypeEnum, DataTypeEnum, ScreenSizeEnum } from '../../../shared/services/consts-enums-functions';
import { LoggerService } from '../../../shared/services/logger.service';
import { CommonService } from '../../../shared/services/common.service';

import * as RTLActions from '../../../store/rtl.actions';
import * as fromRTLReducer from '../../../store/rtl.reducers';

@Component({
  selector: 'rtl-cl-forwarding-history',
  templateUrl: './forwarding-history.component.html',
  styleUrls: ['./forwarding-history.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPaginatorLabel('Events') }
  ]
})
export class CLForwardingHistoryComponent implements OnInit, OnChanges {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @Input() successfulEvents: any;
  public displayedColumns = [];
  public forwardingHistoryEvents: any;
  public flgSticky = false;
  public pageSize = PAGE_SIZE;
  public pageSizeOptions = PAGE_SIZE_OPTIONS;
  public screenSize = '';
  public screenSizeEnum = ScreenSizeEnum;

  constructor(private logger: LoggerService, private commonService: CommonService, private store: Store<fromRTLReducer.RTLState>) {
    this.screenSize = this.commonService.getScreenSize();
    if(this.screenSize === ScreenSizeEnum.XS) {
      this.flgSticky = false;
      this.displayedColumns = ['in_msatoshi', 'out_msatoshi', 'actions'];
    } else if(this.screenSize === ScreenSizeEnum.SM || this.screenSize === ScreenSizeEnum.MD) {
      this.flgSticky = false;
      this.displayedColumns = ['received_time_str', 'in_msatoshi', 'out_msatoshi', 'fee', 'actions'];
    } else {
      this.flgSticky = true;
      this.displayedColumns = ['received_time_str', 'resolved_time_str', 'in_channel', 'out_channel', 'in_msatoshi', 'out_msatoshi', 'fee', 'actions'];
    }
  }

  ngOnInit() {}

  ngOnChanges() {
    this.loadForwardingEventsTable(this.successfulEvents);
  }

  onForwardingEventClick(selFEvent: ForwardingEventCL, event: any) {
    const reorderedFHEvent = [
      [{key: 'received_time_str', value: selFEvent.received_time_str, title: 'Received Time', width: 50, type: DataTypeEnum.DATE_TIME},
        {key: 'resolved_time_str', value: selFEvent.resolved_time_str, title: 'Resolved Time', width: 50, type: DataTypeEnum.DATE_TIME}],
      [{key: 'status', value: selFEvent.status, title: 'Status', width: 50, type: DataTypeEnum.STRING},
        {key: 'payment_hash', value: selFEvent.payment_hash, title: 'Payment Hash', width: 50, type: DataTypeEnum.STRING}],
      [{key: 'in_channel', value: selFEvent.in_channel, title: 'Inbound Channel ID', width: 50, type: DataTypeEnum.STRING},
        {key: 'out_channel', value: selFEvent.out_channel, title: 'Outbound Channel ID', width: 50, type: DataTypeEnum.STRING}],
      [{key: 'in_msatoshi', value: selFEvent.in_msatoshi, title: 'In (mSatoshi)', width: 50, type: DataTypeEnum.STRING},
        {key: 'in_msat', value: selFEvent.in_msat, title: 'In (mSats)', width: 50, type: DataTypeEnum.STRING}],
      [{key: 'out_msatoshi', value: selFEvent.out_msatoshi, title: 'Out (mSatoshi)', width: 50, type: DataTypeEnum.STRING},
        {key: 'out_msat', value: selFEvent.out_msat, title: 'Out (mSats)', width: 50, type: DataTypeEnum.STRING}],
      [{key: 'fee', value: selFEvent.fee, title: 'Fee', width: 50, type: DataTypeEnum.STRING},
        {key: 'fee_msat', value: selFEvent.fee_msat, title: 'Fee (mSats)', width: 50, type: DataTypeEnum.STRING}]
    ];
    this.store.dispatch(new RTLActions.OpenAlert({ data: {
      type: AlertTypeEnum.INFORMATION,
      alertTitle: 'Event Information',
      message: reorderedFHEvent
    }}));
  }

  loadForwardingEventsTable(forwardingEvents: ForwardingEventCL[]) {
    this.forwardingHistoryEvents = new MatTableDataSource<ForwardingEventCL>([...forwardingEvents]);
    this.forwardingHistoryEvents.sort = this.sort;
    this.forwardingHistoryEvents.paginator = this.paginator;
    this.logger.info(this.forwardingHistoryEvents);
  }

  applyFilter(selFilter: string) {
    this.forwardingHistoryEvents.filter = selFilter;
  }

}
