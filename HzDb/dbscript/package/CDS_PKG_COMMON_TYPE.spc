CREATE OR REPLACE PACKAGE CDS_PKG_COMMON_TYPE
--------------------------------------------------------------------------------------------------
  --Ӣ������:  CDS_TYPE
  --ģ������:  �Զ�����������
  --ģ����:
  --ģ�鹦��:
  --��������:  zhongxy   2014-09-24 13:30:00    �汾��:1.0.0
  --��    ע:
  --------------------------------------------------------------------------------------------------
AS
  -- �����ֵ�����

  SUBTYPE    RTN_CODE        IS    NUMBER(5);      --ҵ�񷵻ش���,0Ϊ����,��0Ϊ�쳣����
  SUBTYPE    RTN_MSG         IS    VARCHAR2(1024);  --ҵ�񷵻���Ϣ,��RTN_CODE��Ϊ0ʱ��Ϊ��
  SUBTYPE    CUS_NUMBER      IS    NUMBER(5);      --�������
  TYPE CDS_TYPE_ERR_MAP IS TABLE OF VARCHAR2(64) INDEX BY BINARY_INTEGER;
END CDS_PKG_COMMON_TYPE;
/
