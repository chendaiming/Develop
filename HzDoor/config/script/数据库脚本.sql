/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.28
 * 作者：xie.yh
 * 描述: 新建阻车器设备信息表（DVC_CAR_ARRESTER_INFO）
 * ============================================================== */
create table DVC_CAR_ARRESTER_INFO 
(
   CAI_CUS_NUMBER       NUMBER(28)           not null,
   CAI_ID               NUMBER(28)           not null,
   CAI_OTHER_ID         VARCHAR2(32),
   CAI_NAME             VARCHAR2(80)         not null,
   CAI_BRAND            NUMBER(2)            not null,
   CAI_TYPE             NUMBER(2)            not null,
   CAI_IP               VARCHAR2(32),
   CAI_PORT             VARCHAR2(5),
   CAI_DEPT_ID          NUMBER(28),
   CAI_AREA_ID          NUMBER(28),
   CAI_ADDRS            VARCHAR2(256),
   CAI_WORK_STTS        NUMBER(2)            default 0 not null,
   CAI_USE_STTS         NUMBER(2)            default 3 not null,
   CAI_SEQ              NUMBER(16),
   CAI_CRTE_TIME        TIMESTAMP,
   CAI_CRTE_USER_ID     NUMBER(28),
   CAI_UPDT_TIME        TIMESTAMP,
   CAI_UPDT_USER_ID     NUMBER(28),
   constraint UK_CAR_ID unique (CAI_ID)
);

comment on table DVC_CAR_ARRESTER_INFO is
'阻车器设备信息表';

comment on column DVC_CAR_ARRESTER_INFO.CAI_CUS_NUMBER is
'机构号';

comment on column DVC_CAR_ARRESTER_INFO.CAI_ID is
'系统设备编号';

comment on column DVC_CAR_ARRESTER_INFO.CAI_OTHER_ID is
'厂商设备编号';

comment on column DVC_CAR_ARRESTER_INFO.CAI_NAME is
'厂商设备名称';

comment on column DVC_CAR_ARRESTER_INFO.CAI_BRAND is
'设备品牌';

comment on column DVC_CAR_ARRESTER_INFO.CAI_TYPE is
'设备类型';

comment on column DVC_CAR_ARRESTER_INFO.CAI_IP is
'IP地址';

comment on column DVC_CAR_ARRESTER_INFO.CAI_PORT is
'端口';

comment on column DVC_CAR_ARRESTER_INFO.CAI_DEPT_ID is
'所属部门';

comment on column DVC_CAR_ARRESTER_INFO.CAI_AREA_ID is
'所属区域';

comment on column DVC_CAR_ARRESTER_INFO.CAI_ADDRS is
'安装位置';

comment on column DVC_CAR_ARRESTER_INFO.CAI_WORK_STTS is
'设备工作状态：0.正常、1.故障';

comment on column DVC_CAR_ARRESTER_INFO.CAI_USE_STTS is
'设备使用状态：2.已打开、3.已关闭（定义为2、3是因为安防协议文档定义的2、3）';

comment on column DVC_CAR_ARRESTER_INFO.CAI_SEQ is
'序号';

comment on column DVC_CAR_ARRESTER_INFO.CAI_CRTE_TIME is
'创建时间';

comment on column DVC_CAR_ARRESTER_INFO.CAI_CRTE_USER_ID is
'创建人';

comment on column DVC_CAR_ARRESTER_INFO.CAI_UPDT_TIME is
'更新时间';

comment on column DVC_CAR_ARRESTER_INFO.CAI_UPDT_USER_ID is
'更新人';

alter table DVC_CAR_ARRESTER_INFO
   add constraint PK_CAR_ARRESTER_INFO primary key (CAI_CUS_NUMBER, CAI_ID);
