package com.hz.frm.net.amq.jmx;

public interface RuntimeJmxNames
{
    /**
     * this is the name= part of the object name
     * 
     */
    public String getJmxName();

    /**
     * this sets the folders as type1=FirstFolder, type2=Second
     */
    public String[] getJmxPath();
}
