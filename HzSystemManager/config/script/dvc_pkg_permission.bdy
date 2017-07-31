create or replace package body dvc_pkg_permission is

  function getdep(dep number default -1, auth number default -1,cus number default -1) return tt
    pipelined
  
   is
   
    zz   sys_org_dept_dtls%rowtype;
  
   
      dy_sql varchar2(1024) :='select * from sys_org_dept_dtls ';
      
      cur sys_refcursor;
  begin
  
     if auth =0  then
           dy_sql:= dy_sql || 'START WITH odd_id = '|| dep ||' CONNECT BY PRIOR odd_id = odd_parent_id';
       else  if auth =1  then
            dy_sql := dy_sql || 'START WITH odd_id = '|| cus ||' CONNECT BY PRIOR odd_id = odd_parent_id';
       end if;
     end if;
     open cur for dy_sql;
     
      loop
        
         fetch cur into zz;    
         EXIT WHEN cur%NOTFOUND;  
           pipe row(zz);
      end loop;
         close cur;
      return; 
 

  end getdep;

end dvc_pkg_permission;
