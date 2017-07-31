package cn.showclear.www.ScService;

public class ScServicePortTypeProxy implements cn.showclear.www.ScService.ScServicePortType {
  private String _endpoint = null;
  private cn.showclear.www.ScService.ScServicePortType scServicePortType = null;
  
  public ScServicePortTypeProxy() {
    _initScServicePortTypeProxy();
  }
  
  public ScServicePortTypeProxy(String endpoint) {
    _endpoint = endpoint;
    _initScServicePortTypeProxy();
  }
  
  private void _initScServicePortTypeProxy() {
    try {
      scServicePortType = (new cn.showclear.www.ScService.ScServiceLocator()).getScServiceSOAP();
      if (scServicePortType != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)scServicePortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)scServicePortType)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (scServicePortType != null)
      ((javax.xml.rpc.Stub)scServicePortType)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public cn.showclear.www.ScService.ScServicePortType getScServicePortType() {
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType;
  }
  
  public cn.showclear.www.ScService.IdResp dispGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispGroupDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp powerSwitchAdd(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchAdd(parameters);
  }
  
  public cn.showclear.www.ScService.JsonResp configLoad() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.configLoad();
  }
  
  public cn.showclear.www.ScService.IdResp BWListMod(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.BWListMod(parameters);
  }
  
  public cn.showclear.www.ScService.CommonResp importData(cn.showclear.www.ScService.ImportReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.importData(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp powerSwitchStatusSet(cn.showclear.www.ScService.StatusSetReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchStatusSet(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgMemberSort(cn.showclear.www.ScService.OrgMemberSortReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgMemberSort(parameters);
  }
  
  public cn.showclear.www.ScService.NVQueryResp NVQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.NVQuery();
  }
  
  public cn.showclear.www.ScService.IdResp dispatcherDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispatcherDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispMemberMod(cn.showclear.www.ScService.DispMemberModReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispMemberMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgGroupMod(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgGroupMod(parameters);
  }
  
  public cn.showclear.www.ScService.DispGroupQueryResp dispGroupQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispGroupQuery();
  }
  
  public cn.showclear.www.ScService.IdResp dispGroupMod(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispGroupMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgGroupAdd(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgGroupAdd(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp videoDevDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.videoDevDel(parameters);
  }
  
  public cn.showclear.www.ScService.VersionResp version() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.version();
  }
  
  public cn.showclear.www.ScService.IdResp dispCenterMod(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispCenterMod(parameters);
  }
  
  public cn.showclear.www.ScService.ExportResp exportData(cn.showclear.www.ScService.ExportReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.exportData(parameters);
  }
  
  public cn.showclear.www.ScService.OrgGroupQueryResp orgGroupQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgGroupQuery();
  }
  
  public cn.showclear.www.ScService.DispCenterQueryResp dispCenterQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispCenterQuery();
  }
  
  public cn.showclear.www.ScService.IdResp dispMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispMemberDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispCenterAdd(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispCenterAdd(parameters);
  }
  
  public cn.showclear.www.ScService.CommonResp sysConfigSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.sysConfigSet(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp BWListAdd(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.BWListAdd(parameters);
  }
  
  public cn.showclear.www.ScService.BWListQueryResp BWListQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.BWListQuery();
  }
  
  public cn.showclear.www.ScService.DispMemberQueryResp dispMemberQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispMemberQuery();
  }
  
  public cn.showclear.www.ScService.CommonResp configSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.configSet(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp powerSwitchDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchDel(parameters);
  }
  
  public cn.showclear.www.ScService.OrgMemberQueryResp orgMemberQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgMemberQuery();
  }
  
  public cn.showclear.www.ScService.DispatcherQueryResp dispatcherQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispatcherQuery();
  }
  
  public cn.showclear.www.ScService.IdResp dispMemberSort(cn.showclear.www.ScService.DispMemberSortReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispMemberSort(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp powerSwitchMod(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispatcherAdd(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispatcherAdd(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp BWListDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.BWListDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispGroupSort(cn.showclear.www.ScService.DispGroupSortReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispGroupSort(parameters);
  }
  
  public cn.showclear.www.ScService.VideoDevQueryResp videoDevQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.videoDevQuery();
  }
  
  public cn.showclear.www.ScService.IdResp dispGroupAdd(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispGroupAdd(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispCenterDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispCenterDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp videoDevMod(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.videoDevMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgMemberDel(parameters);
  }
  
  public cn.showclear.www.ScService.JsonResp loadData(cn.showclear.www.ScService.LoadDataReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.loadData(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp dispMemberAdd(cn.showclear.www.ScService.DispMemberReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispMemberAdd(parameters);
  }
  
  public cn.showclear.www.ScService.PowerSwitchQueryResp powerSwitchQuery() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchQuery();
  }
  
  public cn.showclear.www.ScService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.sysConfigLoad();
  }
  
  public cn.showclear.www.ScService.IdResp dispatcherMod(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.dispatcherMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp videoDevAdd(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.videoDevAdd(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgGroupDel(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgMemberMod(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgMemberMod(parameters);
  }
  
  public cn.showclear.www.ScService.IdResp orgMemberAdd(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.orgMemberAdd(parameters);
  }
  
  public cn.showclear.www.ScService.PowerSwitchResp powerSwitchInfo(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException{
    if (scServicePortType == null)
      _initScServicePortTypeProxy();
    return scServicePortType.powerSwitchInfo(parameters);
  }
  
  
}