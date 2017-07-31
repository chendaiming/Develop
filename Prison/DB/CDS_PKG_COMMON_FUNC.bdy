CREATE OR REPLACE PACKAGE BODY CDS_PKG_COMMON_FUNC IS
  v_g_Debug BOOLEAN := FALSE;

  PROCEDURE CDS_P_DEBUG_SET(in_debug IN BOOLEAN) IS
  BEGIN
    v_g_Debug := in_debug;
  END CDS_P_DEBUG_SET;

  
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
    RETURN cds_t_str_split IS
    j                  INT := 0;
    i                  INT := 1;
    source_data_len    INT := 0;
    delimiter_data_len INT := 0;
    str                VARCHAR2(4000);
    str_split          cds_t_str_split := cds_t_str_split();
  BEGIN
    source_data_len    := LENGTH(source_data);
    delimiter_data_len := LENGTH(delimiter_data);
  
    WHILE j < source_data_len LOOP
      j := INSTR(source_data, delimiter_data, i);
    
      IF j = 0 THEN
        j   := source_data_len;
        str := SUBSTR(source_data, i);
        str_split.EXTEND;
        str_split(str_split.COUNT) := trim(str);
      
        IF i >= source_data_len THEN
          EXIT;
        END IF;
      ELSE
        str := SUBSTR(source_data, i, j - i);
        if str is not null then
          str_split.EXTEND;
          str_split(str_split.COUNT) := trim(str);
        end if;
        i := j + delimiter_data_len;
      END IF;
    END LOOP;
  
    RETURN str_split;
  END;

END CDS_PKG_COMMON_FUNC;
/
