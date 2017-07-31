create or replace package dvc_pkg_permission is


      type tt is table of sys_org_dept_dtls%rowtype;
      
      
      function getdep(dep number default -1,auth number default -1,cus number default -1) return tt pipelined;
    
end;
