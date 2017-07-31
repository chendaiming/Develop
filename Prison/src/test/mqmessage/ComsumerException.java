package test.mqmessage;

import javax.jms.ExceptionListener;
import javax.jms.JMSException;

public class ComsumerException implements ExceptionListener {

	@Override
	public void onException(JMSException arg0) {
		System.out.println("JMS Exception occured. Shutting down client.");
	}
	

}
