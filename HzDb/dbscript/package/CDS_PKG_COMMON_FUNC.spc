CREATE OR REPLACE PACKAGE CDS_PKG_COMMON_FUNC AS

  FUNCTION CDS_F_SPLIT_DATA
  --------------------------------------------------------------------------------------------------
    --Ӣ������:  CDS_F_SPLIT_DATA
    --ģ������:  �ַ�����ֺ���
    --ģ����:  
    --ģ�鹦��:
    --��������:  zhongxy   2014-09-27 15:30:00    �汾��:1.0.0
    --�޸���ʷ:
    --��    ע:
    -------------------------------------------------------------------------------------------------- 
  (source_data IN VARCHAR2, delimiter_data IN VARCHAR2)
    RETURN cds_t_str_split;
END CDS_PKG_COMMON_FUNC;
/
