CREATE OR REPLACE FUNCTION FUNC_GET_IDS
-------------------------------------------------------------------------------------------------
  --英文名称:  FUNC_GET_IDS
  --模块名称:  批量获取ID（序列号）
  --模块编号:
  --模块功能:
  --创建日期:  xie.yh   2017.07.12    版本号:0.0.1
  --修改历史
  --备    注: 
  --------------------------------------------------------------------------------------------------
(in_table_name IN VARCHAR2, in_clmn_name IN VARCHAR2, in_number IN NUMBER)
  RETURN CLOB IS
  v_type  NUMBER; -- 序列类型
  v_index NUMBER; -- 最终记录的索引值
  t_index NUMBER; -- 计算之前的索引值
  t_num   NUMBER; -- 需要生成的序列号个数

  r_ids CLOB; -- 返回的序列号集合，多个用逗号隔开 
  t_seq VARCHAR2(28); -- 生成的序列号
  t_n   VARCHAR2(24); -- 格式化之后索引值
  t_l   NUMBER; -- 索引值的长度
  t_i   NUMBER; -- 索引值的初始长度

BEGIN
  BEGIN
    -- 获取现有的序列索引值
    SELECT code_index
      INTO v_index
      FROM com_sequences
     WHERE table_name = in_table_name
       AND column_name = in_clmn_name
       FOR UPDATE;
  EXCEPTION
    WHEN OTHERS THEN
      v_index := NULL;
  END;

  r_ids := '';
  t_num := in_number;

  IF (v_index IS NULL) THEN
    BEGIN
      SELECT max(code_type) INTO v_type FROM com_sequences;
    EXCEPTION
      WHEN OTHERS THEN
        v_type := NULL;
    END;
  
    IF (v_type IS NULL) THEN
      v_type := 100;
    ELSE
      v_type := v_type + 1;
    END IF;
  
    t_index := 0;
    v_index := t_num;
  
    INSERT INTO com_sequences
      (table_name, column_name, code_type, code_index, update_time)
    VALUES
      (in_table_name, in_clmn_name, v_type, v_index, SYSDATE);
  ELSE
    t_index := v_index;
    v_index := v_index + t_num;
  
    SELECT code_type
      INTO v_type
      FROM com_sequences
     WHERE table_name = in_table_name
       AND column_name = in_clmn_name;
  
    UPDATE com_sequences
       SET code_index = v_index
     WHERE table_name = in_table_name
       AND column_name = in_clmn_name;
  END IF;

  WHILE t_num > 0 LOOP
    t_num   := t_num - 1;
    t_index := t_index + 1;
    t_n     := TO_CHAR(t_index);
    t_i     := LENGTH(t_index);
    t_l     := 3;
  
    WHILE t_i < t_l LOOP
      t_i := t_i + 1;
      t_n := '0' || t_n;
    END LOOP;
  
    t_seq := to_char(v_type) || t_n;
    r_ids := r_ids || t_seq || ',';
  
  END LOOP;

  r_ids := SUBSTR(r_ids, 0, LENGTH(r_ids) - 1);

  COMMIT;
  RETURN TO_CLOB(r_ids);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
