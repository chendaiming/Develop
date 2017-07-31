CREATE OR REPLACE PACKAGE CDS_PKG_COMMON_FUNC AS

  FUNCTION CDS_F_SPLIT_DATA
  --------------------------------------------------------------------------------------------------
    --英文名称:  CDS_F_SPLIT_DATA
    --模块名称:  字符串拆分函数
    --模块编号:  
    --模块功能:
    --创建日期:  zhongxy   2014-09-27 15:30:00    版本号:1.0.0
    --修改历史:
    --备    注:
    -------------------------------------------------------------------------------------------------- 
  (source_data IN VARCHAR2, delimiter_data IN VARCHAR2)
    RETURN cds_t_str_split;
END CDS_PKG_COMMON_FUNC;
/
