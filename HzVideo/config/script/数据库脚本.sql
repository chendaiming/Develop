/* ==============================================================
 * 版本：2.0.3
 * 时间：2017.06.28
 * 作者：xie.yh
 * 描述: 新增视频巡视计划相关表
 * ============================================================== */
-- Create table
create table VEDIO_PLAN_PATROL
(
  vpp_cus_number  NUMBER(28),
  vpp_id          NUMBER(28),
  vpp_name        VARCHAR2(250),
  vpp_frequenes   VARCHAR2(50),
  vpp_excute_time VARCHAR2(8),
  vpp_creater     NUMBER(28),
  vpp_create_time DATE,
  vpp_updater     NUMBER(28),
  vpp_update_time DATE
)

-- Create table
create table VPP_CAMERA_LINK
(
  vcl_cus_number NUMBER(28),
  vcl_id         NUMBER(28),
  vcl_camera_id  NUMBER(28),
  vcl_vpp_id     NUMBER(28)
)

-- Create table
create table VPP_CHECK_RECORD
(
  vcr_cus_number      NUMBER(28),
  vcr_id              NUMBER(28),
  vcr_vpp_id          NUMBER(28),
  vcr_vpp_name        VARCHAR2(100),
  vcr_vpp_excute_time VARCHAR2(10),
  vcr_vpp_real_time   DATE,
  vcr_vpp_user        NUMBER(28),
  vcr_vpp_user_name   VARCHAR2(100),
  vcr_vpp_camera      NUMBER(28),
  vcr_vpp_camera_name VARCHAR2(100),
  vcr_status          NUMBER(2)
)

-- Create table
create table VPP_USER_LINK
(
  vul_cus_number NUMBER(28),
  vul_id         NUMBER(28),
  vul_vpp_id     NUMBER(28),
  vul_user_id    NUMBER(28)
)

