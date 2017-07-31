--版本：1.0.0
--时间：2017-07-20
--作者：zhuming
--说明：1.值班日志
create table DTY_CTRL_LOG_MAIN  (
   CLM_CUS_NUMBER       NUMBER(28)                      not null,
   CLM_ID               NUMBER(28)                      not null,
   CLM_DATE             DATE,
   CLM_REGULAR_LEADER   VARCHAR2(80),
   CLM_DEPUTY_LEADER    VARCHAR2(80),
   CLM_STATE            NUMBER(2),
   CLM_CREATE_USER      NUMBER(28),
   CLM_CREATE_TIME      TIMESTAMP,
   CLM_UPDATE_USER      NUMBER(28),
   CLM_UPDATE_TIME      TIMESTAMP,
   constraint PK_DTY_CTRL_LOG_MAIN primary key (CLM_CUS_NUMBER, CLM_ID)
);

comment on table DTY_CTRL_LOG_MAIN is
'值班日志主表';

comment on column DTY_CTRL_LOG_MAIN.CLM_CUS_NUMBER is
'机构号';

comment on column DTY_CTRL_LOG_MAIN.CLM_ID is
'ID';

comment on column DTY_CTRL_LOG_MAIN.CLM_DATE is
'日期';

comment on column DTY_CTRL_LOG_MAIN.CLM_REGULAR_LEADER is
'正班领导';

comment on column DTY_CTRL_LOG_MAIN.CLM_DEPUTY_LEADER is
'副班领导';

comment on column DTY_CTRL_LOG_MAIN.CLM_STATE is
'状态1未删0已删';

comment on column DTY_CTRL_LOG_MAIN.CLM_CREATE_USER is
'创建人';

comment on column DTY_CTRL_LOG_MAIN.CLM_CREATE_TIME is
'创建时间';

comment on column DTY_CTRL_LOG_MAIN.CLM_UPDATE_USER is
'更新人';

comment on column DTY_CTRL_LOG_MAIN.CLM_UPDATE_TIME is
'更新时间';

create table DTY_CTRL_LOG_DETAIL  (
   CLD_ID               NUMBER(28)                      not null,
   CLD_CLM_ID           NUMBER(28),
   CLD_BEGIN_TIME       VARCHAR2(80),
   CLD_END_TIME         VARCHAR2(80),
   CLD_HANDLE_SITUATION VARCHAR2(2560),
   CLD_HANDLE_SENDER    VARCHAR2(80),
   CLD_HANDLE_RECEIVER  VARCHAR2(80),
   CLD_DEVICE_SITUATION VARCHAR2(2560),
   CLD_DEVICE_SENDER    VARCHAR2(80),
   CLD_DEVICE_RECEIVER  VARCHAR2(80),
   constraint PK_DTY_CTRL_LOG_DETAIL primary key (CLD_ID)
);

comment on table DTY_CTRL_LOG_DETAIL is
'值班日志从表';

comment on column DTY_CTRL_LOG_DETAIL.CLD_ID is
'ID';

comment on column DTY_CTRL_LOG_DETAIL.CLD_CLM_ID is
'主表ID';

comment on column DTY_CTRL_LOG_DETAIL.CLD_BEGIN_TIME is
'开始时间';

comment on column DTY_CTRL_LOG_DETAIL.CLD_END_TIME is
'结束时间';

comment on column DTY_CTRL_LOG_DETAIL.CLD_HANDLE_SITUATION is
'处理情况';

comment on column DTY_CTRL_LOG_DETAIL.CLD_HANDLE_SENDER is
'处理交班警察';

comment on column DTY_CTRL_LOG_DETAIL.CLD_HANDLE_RECEIVER is
'处理接班警察';

comment on column DTY_CTRL_LOG_DETAIL.CLD_DEVICE_SITUATION is
'设备情况';

comment on column DTY_CTRL_LOG_DETAIL.CLD_DEVICE_SENDER is
'设备交班警察';

comment on column DTY_CTRL_LOG_DETAIL.CLD_DEVICE_RECEIVER is
'设备接班警察';
