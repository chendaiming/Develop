/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.04
 * 作者：xie.yh
 * 描述: 新增设备状态记录表
 * ============================================================== */
--drop table DVC_DEVICE_STATUS_RECORD cascade constraints;
create table DVC_DEVICE_STATUS_RECORD 
(
   DSR_CUS_NUMBER       NUMBER(28)           not null,
   DSR_DVC_TYPE         NUMBER(2)            not null,
   DSR_DVC_TYPE_NAME    VARCHAR2(80),
   DSR_DVC_ID           NUMBER(28)           not null,
   DSR_DVC_NAME         VARCHAR2(80),
   DSR_DVC_STATUS       NUMBER(2)            not null,
   DSR_STATUS_DESC      VARCHAR2(80)         not null,
   DSR_RECORD_TIME      TIMESTAMP            not null
);

comment on table DVC_DEVICE_STATUS_RECORD is
'设备状态监测记录表';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_CUS_NUMBER is
'机构号';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_DVC_TYPE is
'设备类型：参考安防设备统一类型';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_DVC_TYPE_NAME is
'设备类型名称';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_DVC_ID is
'设备编号';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_DVC_NAME is
'设备名称';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_DVC_STATUS is
'设备状态：0正常、1故障';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_STATUS_DESC is
'状态描述：
DSR_DVC_STATUS = 0，正常
DSR_DVC_STATUS = 1，根据不同设备类型的不同故障进行转义';

comment on column DVC_DEVICE_STATUS_RECORD.DSR_RECORD_TIME is
'记录时间';
