/**
 * ScServicePortType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.showclear.www.ScService;

public interface ScServicePortType extends java.rmi.Remote {
    public cn.showclear.www.ScService.IdResp dispGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp powerSwitchAdd(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.JsonResp configLoad() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp BWListMod(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.CommonResp importData(cn.showclear.www.ScService.ImportReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp powerSwitchStatusSet(cn.showclear.www.ScService.StatusSetReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgMemberSort(cn.showclear.www.ScService.OrgMemberSortReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.NVQueryResp NVQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispatcherDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispMemberMod(cn.showclear.www.ScService.DispMemberModReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgGroupMod(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.DispGroupQueryResp dispGroupQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispGroupMod(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgGroupAdd(cn.showclear.www.ScService.OrgGroupReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp videoDevDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.VersionResp version() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispCenterMod(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.ExportResp exportData(cn.showclear.www.ScService.ExportReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.OrgGroupQueryResp orgGroupQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.DispCenterQueryResp dispCenterQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispCenterAdd(cn.showclear.www.ScService.DispCenterReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.CommonResp sysConfigSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp BWListAdd(cn.showclear.www.ScService.BWListReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.BWListQueryResp BWListQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.DispMemberQueryResp dispMemberQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.CommonResp configSet(cn.showclear.www.ScService.ConfigEntry[] parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp powerSwitchDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.OrgMemberQueryResp orgMemberQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.DispatcherQueryResp dispatcherQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispMemberSort(cn.showclear.www.ScService.DispMemberSortReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp powerSwitchMod(cn.showclear.www.ScService.PowerSwitchReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispatcherAdd(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp BWListDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispGroupSort(cn.showclear.www.ScService.DispGroupSortReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.VideoDevQueryResp videoDevQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispGroupAdd(cn.showclear.www.ScService.DispGroupReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispCenterDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp videoDevMod(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgMemberDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.JsonResp loadData(cn.showclear.www.ScService.LoadDataReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispMemberAdd(cn.showclear.www.ScService.DispMemberReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.PowerSwitchQueryResp powerSwitchQuery() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.SysConfigLoadResp sysConfigLoad() throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp dispatcherMod(cn.showclear.www.ScService.DispatcherReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp videoDevAdd(cn.showclear.www.ScService.VideoDevReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgGroupDel(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgMemberMod(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.IdResp orgMemberAdd(cn.showclear.www.ScService.OrgMemberReq parameters) throws java.rmi.RemoteException;
    public cn.showclear.www.ScService.PowerSwitchResp powerSwitchInfo(cn.showclear.www.ScService.Id parameters) throws java.rmi.RemoteException;
}
