package test.mqmessage;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

public class MessageConsumerTest {
	
	public static void main(String[] args) {
		try {

			ComsumerException comsumerException = new ComsumerException();
			// Create a ConnectionFactory
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://0.0.0.0:8001");

			// Create a Connection
			Connection connection = connectionFactory.createConnection();
			connection.start();

			connection.setExceptionListener(new ComsumerException());

			// Create a Session
			Session session = connection.createSession(false,
					Session.AUTO_ACKNOWLEDGE);

			// Create the destination (Topic or Queue)
			Destination destination = session.createQueue("queue.front.machine.out");

			// Create a MessageConsumer from the Session to the Topic or
			// Queue
			MessageConsumer consumer = session.createConsumer(destination);

			boolean flag = true;
			while (flag) {
				// Wait for a message
				Message message = consumer.receive(1000);
				if (message instanceof TextMessage && null != message) {
					TextMessage textMessage = (TextMessage) message;
					String text = textMessage.getText();
					System.out.println("Received: " + text);
				}
			}
			//consumer.close();
			//session.close();
			//connection.close();
		} catch (Exception e) {
			System.out.println("Caught: " + e);
			e.printStackTrace();
		}
	}

}
