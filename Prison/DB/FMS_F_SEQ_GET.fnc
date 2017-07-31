CREATE OR REPLACE FUNCTION FMS_F_SEQ_GET
-------------------------------------------------------------------------------------------------
  --英文名称:  FMS_F_SEQ_GET
  --模块名称:  获取seq
  --模块编号:
  --模块功能:
  --创建日期:  zhongxy   2015-09-11    版本号:0.1.0
  --修改历史
  --备    注:
  --------------------------------------------------------------------------------------------------
(in_table_name IN VARCHAR2, in_clmn_name IN VARCHAR2) RETURN NUMBER IS
  v_seq NUMBER;

BEGIN
  BEGIN
    SELECT cse_seq
      INTO v_seq
      FROM com_seq
     WHERE cse_table_name = in_table_name
       AND cse_clmn_name = in_clmn_name
       FOR UPDATE;
  EXCEPTION
    WHEN OTHERS THEN
      v_seq := NULL;
  END;
  IF (v_seq IS NULL) THEN
    v_seq := 0;
    INSERT INTO com_seq
      (cse_table_name, cse_clmn_name, cse_seq, cse_updt_time)
    VALUES
      (in_table_name, in_clmn_name, v_seq, SYSDATE);
  ELSE
    v_seq := v_seq + 1;
    UPDATE com_seq
       SET cse_seq = v_seq
     WHERE cse_table_name = in_table_name
       AND cse_clmn_name = in_clmn_name;
  END IF;
  COMMIT;
  RETURN v_seq;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
/
