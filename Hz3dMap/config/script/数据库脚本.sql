/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.25
 * 作者：xie.yh
 * 描述: 模型文件信息表新增所属部门和是否加载的标识
 * ============================================================== */
-- Add/modify columns 
alter table MAP_MODEL_FILE_INFO add mfi_dept_id VARCHAR2(80);
alter table MAP_MODEL_FILE_INFO add mfi_load_flag NUMBER(2) default 1 not null;
-- Add comments to the columns 
comment on column MAP_MODEL_FILE_INFO.mfi_dept_id
  is '所属部门：多个部门用逗号隔开';
comment on column MAP_MODEL_FILE_INFO.mfi_load_flag
  is '是否加载：0.不加载  1.加载（默认）';
;





/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.28
 * 作者：xie.yh
 * 描述: 新增设备模型绑定表（MAP_DEVICE_MODEL_BIND）
 * 		 设备模型绑定之后用户通过设备可以直接控制地图对应设备模型
 * 
 * ============================================================== */
create table MAP_DEVICE_MODEL_BIND  (
   DMB_DVC_ID           NUMBER(28)                      not null,
   DMB_DVC_TYPE         NUMBER(5)                       not null,
   DMB_MODEL_NAME       VARCHAR2(80)                    not null
);

comment on table MAP_DEVICE_MODEL_BIND is 'MAP_设备-模型绑定表';
comment on column MAP_DEVICE_MODEL_BIND.DMB_DVC_ID is '设备编号';
comment on column MAP_DEVICE_MODEL_BIND.DMB_DVC_TYPE is '设备类型，查看统一设备类型';
comment on column MAP_DEVICE_MODEL_BIND.DMB_MODEL_NAME is '绑定的模型名称';

alter table MAP_DEVICE_MODEL_BIND add constraint PK_DEVICE_MODEL_BIND primary key (DMB_DVC_ID, DMB_DVC_TYPE);




/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.29
 * 作者：xie.yh
 * 描述: 
 * 	1. 修改模型文件信息里面机构号的类型精度 5 -> 28
 *  2. 修改地图视角菜单表的机构号的类型精度 5 -> 28
 * 
 * ============================================================== */
-- Add/modify columns 
alter table MAP_MODEL_FILE_INFO modify mfi_cus_number NUMBER(28);
-- Add/modify columns 
alter table MAP_VIEW_MENU_INFO modify vmi_cus_number NUMBER(28);





/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.30
 * 作者：xie.yh
 * 描述: 新增 模型视角绑定表 MAP_MODEL_VIEW_BIND
 * ============================================================== */

--alter table MAP_MODEL_VIEW_BIND drop primary key cascade;
--drop table MAP_MODEL_VIEW_BIND cascade constraints;

create table MAP_MODEL_VIEW_BIND  (
   MVB_CUS_NUMBER       NUMBER(28)                      not null,
   MVB_MODEL_ID         VARCHAR2(32)                    not null,
   MVB_MODEL_NAME       VARCHAR2(80)                    not null,
   MVB_POS_X            VARCHAR2(32)                    not null,
   MVB_POS_Y            VARCHAR2(32)                    not null,
   MVB_POS_Z            VARCHAR2(32)                    not null,
   MVB_ROT_X            VARCHAR2(32)                    not null,
   MVB_ROT_Y            VARCHAR2(32)                    not null,
   MVB_ROT_Z            VARCHAR2(32)                    not null,
   MVB_TAR_X            VARCHAR2(32)                    not null,
   MVB_TAR_Y            VARCHAR2(32)                    not null,
   MVB_TAR_Z            VARCHAR2(32)                    not null
);

comment on table MAP_MODEL_VIEW_BIND is
'MAP_模型-视角绑定表';

comment on column MAP_MODEL_VIEW_BIND.MVB_CUS_NUMBER is
'机构编号';

comment on column MAP_MODEL_VIEW_BIND.MVB_MODEL_ID is
'模型编号（模型对象里面的NAME属性，唯一值）';

comment on column MAP_MODEL_VIEW_BIND.MVB_MODEL_NAME is
'模型名称（这里是模型的中文名称）';

comment on column MAP_MODEL_VIEW_BIND.MVB_POS_X is
'视角坐标X';

comment on column MAP_MODEL_VIEW_BIND.MVB_POS_Y is
'视角坐标Y';

comment on column MAP_MODEL_VIEW_BIND.MVB_POS_Z is
'视角坐标Z';

comment on column MAP_MODEL_VIEW_BIND.MVB_ROT_X is
'视角角度X';

comment on column MAP_MODEL_VIEW_BIND.MVB_ROT_Y is
'视角角度Y';

comment on column MAP_MODEL_VIEW_BIND.MVB_ROT_Z is
'视角角度Z';

comment on column MAP_MODEL_VIEW_BIND.MVB_TAR_X is
'视角目标点X（视角中心点）';

comment on column MAP_MODEL_VIEW_BIND.MVB_TAR_Y is
'视角目标点Y（视角中心点）';

comment on column MAP_MODEL_VIEW_BIND.MVB_TAR_Z is
'视角目标点Z（视角中心点）';

alter table MAP_MODEL_VIEW_BIND add constraint PK_MAP_MODEL_VIEW_BIND primary key (MVB_CUS_NUMBER, MVB_MODEL_ID);




/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.01
 * 作者：xie.yh
 * 描述: 
 * 	1. 修改地图电网信息表的机构号字段的类型精度 5 -> 28
 *  2. 修改地图标注点位表的机构号字段的类型精度 5 -> 28
 *  3. 修改地图模型组件表的机构号字段的类型精度 5 -> 28
 *  4. 修改地图模型组件加载表的机构号字段的类型精度 5 -> 28
 *  5. 修改地图轨迹移动主表的机构号字段的类型精度 5 -> 28
 *  6. 修改地图轨迹移动点位表的机构号字段的类型精度 5 -> 28
 *  7. 修改地图轨迹移动关联表的机构号字段的类型精度 5 -> 28
 *  8. 修改地图面板点位表的机构号字段的类型精度 5 -> 28
 *  9. 修改地图电网点位表的机构号字段的类型精度 5 -> 28
 *  10. 修改地图路径设备关联表的机构号字段的类型精度 5 -> 28
 *  11. 修改地图路径巡视表的机构号字段的类型精度 5 -> 28
 *  12. 修改地图路径点位表的机构号字段的类型精度 5 -> 28
 * 
 * ============================================================== */
-- Add/modify columns 
alter table MAP_POWER_GRID_GEOM modify pgg_cus_number NUMBER(28);
alter table MAP_LABEL_POINT_INFO modify lpi_cus_number NUMBER(28);
alter table MAP_MODEL_COMPONENT_INFO modify mci_cus_number NUMBER(28);
alter table MAP_MODEL_COMPONENT_LOAD modify mcl_cus_number NUMBER(28);
alter table MAP_ORBIT_MOVE_MASTER modify omg_cus_number NUMBER(28);
alter table MAP_ORBIT_MOVE_POINTS modify omp_cus_number NUMBER(28);
alter table MAP_ORBIT_MOVE_RLTN modify omr_cus_number NUMBER(28);
alter table MAP_PANEL_POINT_INFO modify ppi_cus_number NUMBER(28);
alter table MAP_POWER_GRID_POINTS modify pgp_cus_number NUMBER(28);
alter table MAP_ROUTE_DEVICE_LINK modify rdl_cus_number NUMBER(28);
alter table MAP_ROUTE_PATROL_MASTER modify rpm_cus_number NUMBER(28);
alter table MAP_ROUTE_POINT_DTLS modify rpd_cus_number NUMBER(28);




/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.01
 * 作者：xie.yh
 * 描述: 
 * 	1. 电网图形表新增是否显示电流字段
 * 
 * ============================================================== */
-- Add/modify columns 
alter table MAP_POWER_GRID_GEOM add pgg_show_elect NUMBER(2) default 0;
-- Add comments to the columns 
comment on column MAP_POWER_GRID_GEOM.pgg_show_elect is '是否显示电流：0显示、1不显示';

  







/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.07.12
 * 作者：xie.yh
 * 描述: 重构设备模型绑定表
 * ============================================================== */
alter table MAP_DEVICE_MODEL_BIND drop primary key cascade;

drop table MAP_DEVICE_MODEL_BIND cascade constraints;

/*==============================================================*/
/* Table: MAP_DEVICE_MODEL_BIND                                 */
/*==============================================================*/
create table MAP_DEVICE_MODEL_BIND  (
   DMB_CUS_NUMBER       NUMBER(28)                      not null,
   DMB_DVC_ID           NUMBER(28)                      not null,
   DMB_DVC_TYPE         NUMBER(5)                       not null,
   DMB_DVC_NAME         VARCHAR2(80),
   DMB_MODEL_NAME       VARCHAR2(80)                    not null,
   DMB_CRTE_UID         NUMBER(28)                      not null,
   DMB_CRTE_TIME        TIMESTAMP                       not null,
   DMB_UPDT_UID         NUMBER(28),
   DMB_UPDT_TIME        TIMESTAMP
);

comment on table MAP_DEVICE_MODEL_BIND is
'MAP_设备-模型绑定表';

comment on column MAP_DEVICE_MODEL_BIND.DMB_CUS_NUMBER is
'机构号';

comment on column MAP_DEVICE_MODEL_BIND.DMB_DVC_ID is
'设备编号';

comment on column MAP_DEVICE_MODEL_BIND.DMB_DVC_TYPE is
'设备类型，查看统一设备类型';

comment on column MAP_DEVICE_MODEL_BIND.DMB_DVC_NAME is
'设备名称';

comment on column MAP_DEVICE_MODEL_BIND.DMB_MODEL_NAME is
'绑定的模型名称';

comment on column MAP_DEVICE_MODEL_BIND.DMB_CRTE_UID is
'创建用户';

comment on column MAP_DEVICE_MODEL_BIND.DMB_CRTE_TIME is
'创建时间';

comment on column MAP_DEVICE_MODEL_BIND.DMB_UPDT_UID is
'更新用户';

comment on column MAP_DEVICE_MODEL_BIND.DMB_UPDT_TIME is
'更新时间';

alter table MAP_DEVICE_MODEL_BIND
   add constraint PK_DEVICE_MODEL_BIND primary key (DMB_CUS_NUMBER, DMB_DVC_ID, DMB_DVC_TYPE);
