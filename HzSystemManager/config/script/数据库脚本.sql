/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.28
 * 作者：xie.yh
 * 描述: 
 * 		1. 用户信息表修改机构号字段大小由 8 -> 28
 * 		2. 新增绑定民警编号字段用于关联民警信息
 * ============================================================== */
-- Add/modify columns 
alter table SYS_USER_BASE_DTLS modify ubd_cus_number NUMBER(28);
alter table SYS_USER_BASE_DTLS add ubd_plc_id NUMBER(28);
-- Add comments to the columns 
comment on column SYS_USER_BASE_DTLS.ubd_plc_id is '绑定的民警编号';





/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.10
 * 作者：xie.yh
 * 描述: 
 * 		新增系统用户设置表（表是很早之前就已经新建好的，记录是07.10号加入到文档说明的）
 * ============================================================== */
--drop table SYS_USER_SYSTEM_SETTING cascade constraints;
create table SYS_USER_SYSTEM_SETTING 
(
   SUS_CUS_NUMBER       NUMBER(28)           not null,
   SUS_RECORD_ID        NUMBER(28)           not null,
   SUS_TYPE             NUMBER(2)            not null,
   SUS_VALUE            VARCHAR2(80)         not null,
   SUS_USER_ID          NUMBER(28)           not null,
   SUS_CRTE_USER_ID     NUMBER(28),
   SUS_CRTE_TIME        TIMESTAMP,
   SUS_UPDT_USER_ID     NUMBER(28),
   SUS_UPDT_TIME        TIMESTAMP,
   constraint PK_SYS_USER_SYSTEM_SETTING primary key (SUS_CUS_NUMBER, SUS_RECORD_ID)
);

comment on table SYS_USER_SYSTEM_SETTING is
'用户系统设定表';

comment on column SYS_USER_SYSTEM_SETTING.SUS_CUS_NUMBER is
'机构号';

comment on column SYS_USER_SYSTEM_SETTING.SUS_RECORD_ID is
'用户编号 外键 关联用户信息表用户编号';

comment on column SYS_USER_SYSTEM_SETTING.SUS_TYPE is
'设定类型 (常量设定)
1  对讲主机关联';









/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.12
 * 作者：xie.yh
 * 描述: 新增系统操作日志记录表
 * ============================================================== */
drop table SYS_USER_OPERATED_LOG cascade constraints;

/*==============================================================*/
/* Table: SYS_USER_OPERATED_LOG                                 */
/*==============================================================*/
create table SYS_USER_OPERATED_LOG 
(
   UOL_CUS_NUMBER       NUMBER(28)           not null,
   UOL_ID               NUMBER(28)           not null,
   UOL_TYPE             NUMBER(2)            not null,
   UOL_USER_ID          NUMBER(28)           not null,
   UOL_USER_NAME        VARCHAR2(80)         not null,
   UOL_OPERATED_TIME    TIMESTAMP            not null,
   UOL_OPERATED_DESC    VARCHAR2(256)        not null,
   UOL_LOGIN_IP         VARCHAR2(15),
   UOL_SYSTEM_TIME      TIMESTAMP            default SYSDATE not null,
   constraint PK_SYS_USER_OPERATED_LOG primary key (UOL_CUS_NUMBER, UOL_ID),
   constraint AK_USER_OPERATED_LOG_ID unique (UOL_ID)
);

comment on table SYS_USER_OPERATED_LOG is
'用户操作日志';

comment on column SYS_USER_OPERATED_LOG.UOL_CUS_NUMBER is
'机构号';

comment on column SYS_USER_OPERATED_LOG.UOL_ID is
'日志编号';

comment on column SYS_USER_OPERATED_LOG.UOL_TYPE is
'日志类型：0.登录日志 其它类型参考设备类型定义';

comment on column SYS_USER_OPERATED_LOG.UOL_USER_ID is
'用户编号';

comment on column SYS_USER_OPERATED_LOG.UOL_USER_NAME is
'用户姓名';

comment on column SYS_USER_OPERATED_LOG.UOL_OPERATED_TIME is
'操作时间';

comment on column SYS_USER_OPERATED_LOG.UOL_OPERATED_DESC is
'操作内容';

comment on column SYS_USER_OPERATED_LOG.UOL_LOGIN_IP is
'登录地址';

comment on column SYS_USER_OPERATED_LOG.UOL_SYSTEM_TIME is
'系统记录时间';








/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.21
 * 作者：xie.yh
 * 描述: 1.绑定民警编号字段、2.新增昵称字段
 * ============================================================== */
-- Drop columns 
alter table SYS_USER_BASE_DTLS drop column ubd_plc_id;
alter table SYS_USER_BASE_DTLS add ubd_nickname VARCHAR2(80);
-- Add comments to the columns 
comment on column SYS_USER_BASE_DTLS.ubd_nickname
  is '昵称';









/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.21
 * 作者：xie.yh
 * 描述: 新增用户人员绑定信息表
 * ============================================================== */
drop table SYS_USER_BIND_INFO cascade constraints;

/*==============================================================*/
/* Table: SYS_USER_BIND_INFO                                    */
/*==============================================================*/
create table SYS_USER_BIND_INFO 
(
   UBI_UID              NUMBER(28)           not null,
   UBI_PEOPLE_TYPE      NUMBER(2)            not null,
   UBI_PEOPLE_ID        NUMBER(28)           not null,
   UBI_CRTE_UID         NUMBER(28)           not null,
   UBI_CRTE_TIME        TIMESTAMP            not null,
   UBI_UPDT_UID         NUMBER(28),
   UBI_UPDT_TIME        TIMESTAMP,
   constraint PK_SYS_USER_BIND_INFO primary key (UBI_UID)
);

comment on table SYS_USER_BIND_INFO is
'用户绑定表（一个用户只能绑定一个人，但是一个人可以绑定多个用户）';

comment on column SYS_USER_BIND_INFO.UBI_UID is
'用户编号';

comment on column SYS_USER_BIND_INFO.UBI_PEOPLE_TYPE is
'人员类型：1.警员';

comment on column SYS_USER_BIND_INFO.UBI_PEOPLE_ID is
'人员编号';

comment on column SYS_USER_BIND_INFO.UBI_CRTE_UID is
'创建人';

comment on column SYS_USER_BIND_INFO.UBI_CRTE_TIME is
'创建时间';

comment on column SYS_USER_BIND_INFO.UBI_UPDT_UID is
'更新人';

comment on column SYS_USER_BIND_INFO.UBI_UPDT_TIME is
'更新时间';
