package com.hz.frm.net.amq.jmx;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;

import org.springframework.jmx.export.metadata.JmxAttributeSource;
import org.springframework.jmx.export.naming.MetadataNamingStrategy;

public class RuntimeMetadataNamingStrategy extends MetadataNamingStrategy
{
    public RuntimeMetadataNamingStrategy()
    {
    }

    /**
     * @param attributeSource
     */
    public RuntimeMetadataNamingStrategy(JmxAttributeSource attributeSource)
    {
        super(attributeSource);
    }

    /**
     * Construct our object name by calling the methods in
     * {@link RuntimeJmxNames}.
     */
    private ObjectName buildObjectName(RuntimeJmxNames namedObject,
            String domainName) throws MalformedObjectNameException
    {
        String[] typeNames = namedObject.getJmxPath();
        if (typeNames == null)
        {
            throw new MalformedObjectNameException(
                    "getJmxPath() is returning null for object " + namedObject);
        }

        StringBuilder nameBuilder = new StringBuilder();
        nameBuilder.append(domainName);
        nameBuilder.append(':');

        boolean needComma = false;
        for (String typeName : typeNames)
        {
            if (needComma)
            {
                nameBuilder.append(',');
            }
            nameBuilder.append(typeName);
            needComma = true;
        }
        if (needComma)
        {
            nameBuilder.append(',');
        }

        nameBuilder.append("name=");
        nameBuilder.append(namedObject.getJmxName());

        return ObjectName.getInstance(nameBuilder.toString());
    }

    /**
     * Overrides Spring's naming method and replaced it with our local one.
     */
    @Override
    public ObjectName getObjectName(Object managedBean, String beanKey)
            throws MalformedObjectNameException
    {
        // get the object name from the annotation
        ObjectName objectName = super.getObjectName(managedBean, beanKey);

        // now run through and see if the object implements the naming interface
        if (managedBean instanceof RuntimeJmxNames)
        {
            objectName = buildObjectName((RuntimeJmxNames) managedBean,
                    objectName.getDomain());
        }

        return objectName;
    }
}
