CREATE OR REPLACE PACKAGE CDS_PKG_COMMON_TYPE
--------------------------------------------------------------------------------------------------
  --英文名称:  CDS_TYPE
  --模块名称:  自定义数据类型
  --模块编号:
  --模块功能:
  --创建日期:  zhongxy   2014-09-24 13:30:00    版本号:1.0.0
  --备    注:
  --------------------------------------------------------------------------------------------------
AS
  -- 数据字典类型

  SUBTYPE    RTN_CODE        IS    NUMBER(5);      --业务返回代码,0为正常,非0为异常代码
  SUBTYPE    RTN_MSG         IS    VARCHAR2(1024);  --业务返回消息,当RTN_CODE不为0时不为空
  SUBTYPE    CUS_NUMBER      IS    NUMBER(5);      --机构编号
  TYPE CDS_TYPE_ERR_MAP IS TABLE OF VARCHAR2(64) INDEX BY BINARY_INTEGER;
END CDS_PKG_COMMON_TYPE;
/
