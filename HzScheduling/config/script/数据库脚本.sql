/* ==============================================================
 * 版本：1.0.0
 * 时间：2017.06.30
 * 作者：xie.yh
 * 描述: 新增通讯调度通讯录表
 * ============================================================== */
--alter table SHD_ADDRESS_BOOK drop primary key cascade;
--drop table SHD_ADDRESS_BOOK cascade constraints;

create table SHD_ADDRESS_BOOK 
(
   SAB_CUS_NUMBER       NUMBER(28)           not null,
   SAB_ID               NUMBER(28)           not null,
   SAB_OTHER_ID         VARCHAR2(80),
   SAB_NAME             VARCHAR2(80)         not null,
   SAB_PHONE            VARCHAR2(80)         not null,
   SAB_DEPT_ID          NUMBER(28),
   SAB_DEPT_NAME        VARCHAR2(80),
   SAB_REMARK           VARCHAR2(2560),
   SAB_CRTE_TIME        TIMESTAMP,
   SAB_CRTE_USER_ID     NUMBER(28),
   SAB_UPDT_TIME        TIMESTAMP,
   SAB_UPDT_USER_ID     NUMBER(28)
);

comment on table SHD_ADDRESS_BOOK is
'通讯调度-通讯录表';

comment on column SHD_ADDRESS_BOOK.SAB_CUS_NUMBER is
'机构编号';

comment on column SHD_ADDRESS_BOOK.SAB_ID is
'通讯录编号';

comment on column SHD_ADDRESS_BOOK.SAB_OTHER_ID is
'第三方编号';

comment on column SHD_ADDRESS_BOOK.SAB_NAME is
'姓名';

comment on column SHD_ADDRESS_BOOK.SAB_PHONE is
'电话号码';

comment on column SHD_ADDRESS_BOOK.SAB_DEPT_ID is
'所属部门';

comment on column SHD_ADDRESS_BOOK.SAB_DEPT_NAME is
'部门名称';

comment on column SHD_ADDRESS_BOOK.SAB_REMARK is
'备注';

comment on column SHD_ADDRESS_BOOK.SAB_CRTE_TIME is
'创建时间';

comment on column SHD_ADDRESS_BOOK.SAB_CRTE_USER_ID is
'创建人';

comment on column SHD_ADDRESS_BOOK.SAB_UPDT_TIME is
'更新时间';

comment on column SHD_ADDRESS_BOOK.SAB_UPDT_USER_ID is
'更新人';

alter table SHD_ADDRESS_BOOK add constraint PK_SHD_ADDRESS_BOOK primary key (SAB_CUS_NUMBER, SAB_ID);





