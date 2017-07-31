package com.hz.cds.talkback.alarm;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.cds.talkback.util.TalkbackConfigUtil;
import com.hz.frm.util.ApplicationContextUtil;
import com.hz.frm.util.Tools;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.QueueingConsumer;
import com.rabbitmq.client.ShutdownSignalException;

/**
 * ITC对讲的MQ监听服务
 * @author Administrator
 */
@Service
public class ITCMQListener {

	// 日志对象
	private static final Logger log = LoggerFactory.getLogger(ITCMQListener.class);

	// MQ消息处理服务集合
	private static Map<String, List<String>> handleServices = new LinkedHashMap<String, List<String>>();

	// 线程池对象
	private ExecutorService executorService;
	private int nThreads = 10; // 默认线程池大小

	// MQ消息
	private ConnectionFactory factory;		// 连接工厂
	private Connection connection;			// 连接对象
	private Channel channel;				// 连接通道
	private QueueingConsumer consumer;		// 列队

	private int reconnectionInterval = 5000;	// 重连间隔
	private int reconnectionCount = 0;			// 监听失败重连次数
	private int reconnectionMax = 500;			// 重连最大次数

	public ITCMQListener () {
		if(!TalkbackConfigUtil.get("TALKBACK_ITC_MQ_RUN").trim().equals("0")) return;
		// 创建线程池，大小为10
		nThreads = Integer.parseInt(TalkbackConfigUtil.get("TALKBACK_ITC_MQ_MAX_THREADS"));
		executorService = Executors.newFixedThreadPool(nThreads);
		
		connection(); 	// 连接MQ
		listener();		// 监听
	}

	/**
	 * 连接MQ
	 */
	public void connection () {
		String host = TalkbackConfigUtil.get("TALKBACK_ITC_MQ_HOST");					// 连接MQ地址
		String exchange = TalkbackConfigUtil.get("TALKBACK_ITC_MQ_EXCHANGE");			// 交换
		String routingKey = TalkbackConfigUtil.get("TALKBACK_ITC_MQ_ROUTING_KEY");		// 路由KEY
		String queueName = "";											// 列队名称
		try {
			factory = new ConnectionFactory();  
	        factory.setHost(host);

	        // 建立连接
	        connection = factory.newConnection();
	        channel = connection.createChannel();
	        channel.exchangeDeclare(exchange, "direct");

	        // 绑定列队
	        queueName = channel.queueDeclare().getQueue();
	        channel.queueBind(queueName, exchange, routingKey);

	        // 绑定消息订阅者
	        consumer = new QueueingConsumer(channel);  
	        channel.basicConsume(queueName, true, consumer);
	        reconnectionCount = 0;
	        log.info("已连接ITC MQ 消息服务...");
		} catch (Exception e) {
			log.error("连接ITC MQ 消息服务失败：" + e);
		}
	}

	/**
	 * 关闭MQ
	 */
	public void close () {
		try {
			if (channel != null && channel.isOpen()) {
				channel.close();
				log.info("关闭ITC MQ 消息通道...");
			}

			if (connection != null && connection.isOpen()) {
				connection.close();
				log.info("关闭ITC MQ 连接...");
			}
		} catch (Exception e) {
			log.info("关闭ITC MQ 失败：" + e);
		}
	}

	/**
	 * 监听
	 */
	private void listener () {
        // 启用一个线程处理接收消息
        Thread tt = new Thread(new Runnable() {
			@Override
			public void run() {
				String message = "";	// MQ消息
		        while (true) {
		        	try {
		        		message = new String(consumer.nextDelivery().getBody(), "UTF-8");
		        		execute(message);
					} catch (ShutdownSignalException e) {
						log.error("ITC MQ 连接错误，重新连接..." + (++reconnectionCount));
						try {
							if (reconnectionCount < reconnectionMax) {
								connection();
								Thread.sleep(reconnectionInterval);	// 重新连接间隔
							} else {
								log.error(" ITC MQ 重连次数已达上限" + reconnectionMax + "次，停止连接...");
								break;
							}
						} catch (InterruptedException e1) {
							e1.printStackTrace();
						}
					} catch (Exception e) {
						log.error("监听 ITC MQ 消息处理失败：" + e);
					}
		        }
			}
		});
        tt.setPriority(Thread.NORM_PRIORITY);
        tt.start();
	}

	/**
	 * 消息处理
	 * @param message 消息
	 */
	private void execute (final String message) {
		log.debug("接收到ITC MQ消息：" + message);
		try {
			executorService.execute(new Runnable() {
				final JSONObject msgJSON = JSON.parseObject(message);

				@Override
				public void run () {
					String jobType = msgJSON.getString("job_type");
					Object serviceBean = "";
					Object[] serviceBeans = null;
					IITCMQHandleService service = null;

					try {
						// 获取消息事件类型
						serviceBeans = getSubscribers(jobType).toArray().clone();

						// 这里是否也需要使用线程处理
						for(int i = 0; i < serviceBeans.length; i++) {
							serviceBean = serviceBeans[i];
							service = getBean(serviceBean);

							if (service != null) {
								service.handle(msgJSON);
							} else {
								log.warn("处理<" + jobType + ">消息的<" + serviceBean + ">服务不存在!");
							}
						}
					} catch (ITCException e) {
						if ("-1".equals(e.getCode()))
							log.warn("消息处理失败：无处理<" + jobType + ">消息的服务");
						else
							log.warn("消息处理失败：" + e.getMessage());
					}
				}
			});
		} catch (Exception e) {
			log.error("消息处理失败：" + e.getMessage());
		}
	}

	/**
	 * 获取MQ消息处理对象
	 * @param beanName
	 * @return
	 */
	private static IITCMQHandleService getBean (Object beanName) {
		try {
			return (IITCMQHandleService)ApplicationContextUtil.getInstance().getBean(Tools.toStr(beanName));
		} catch (NoSuchBeanDefinitionException e) {
			return null;
		} catch (Exception e) {
			log.error("获取消息处理对象实例失败：" + e);
			return null;
		}
	}

	/**
	 * 获取事件类型的订阅者集合
	 * @param eventName 消息事件类型
	 * @return
	 */
	private static List<String> getSubscribers (String eventName) throws ITCException {
		List<String> list = handleServices.get(eventName);

		if (list == null) {
			list = new ArrayList<String>();
			handleServices.put(eventName, list);
//			throw new ITCException("-1", "消息事件类型不存在：" + eventName);
		}
		return list;
	}

	/**
	 * 订阅MQ消息
	 * @param eventName 消息事件类型
	 * @param beanName	处理消息的服务类对象名称
	 */
	public static boolean subs (String eventName, String beanName) throws ITCException {
		List<String> list = getSubscribers(eventName);

		if (list.contains(beanName)) {
			throw new ITCException("重复订阅：事件=" + eventName + "，名称=" + beanName);
		}
		return list.add(beanName);
	}


	/**
	 * 取消订阅MQ消息
	 * @param eventName 消息事件类型
	 * @param beanName	处理消息的服务类对象名称
	 */
	public static boolean unsubs (String eventName, String beanName) throws ITCException {
		return getSubscribers(eventName).remove(beanName);
	}


	/**
	 * 一键呼叫事件订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean onOneKeyTalkbackEvent(String beanName) {
		try {
			return subs("onekeytalkbackevent", beanName);
		} catch (ITCException e) {
			log.error("一键呼叫通知事件订阅失败：" + e);
			return false;
		}
	}


	/**
	 * 一键呼叫事件取消订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean offOneKeyTalkbackEvent(String beanName) {
		try {
			return unsubs("onekeytalkbackevent", beanName);
		} catch (ITCException e) {
			log.error("一键呼叫通知事件取消订阅失败：" + e);
			return false;
		}
	}

	/**
	 * 对讲结束事件订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean onTalkbackEvent(String beanName) {
		try {
			return subs("talkbackevent", beanName);
		} catch (ITCException e) {
			log.error("对讲结束事件订阅失败：" + e);
			return false;
		}
	}


	/**
	 * 对讲结束取消订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean offTalkbackEvent(String beanName) {
		try {
			return unsubs("talkbackevent", beanName);
		} catch (ITCException e) {
			log.error("对讲结束取消订阅失败：" + e);
			return false;
		}
	}


	/**
	 * 一键求助事件订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean onAlarmForHelp(String beanName) {
		try {
			return subs("alarmforhelp", beanName);
		} catch (ITCException e) {
			log.error("一键求助通知事件订阅失败：" + e);
			return false;
		}
	}


	/**
	 * 一键求助事件取消订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean offAlarmForHelp(String beanName) {
		try {
			return unsubs("alarmforhelp", beanName);
		} catch (ITCException e) {
			log.error("一键求助通知事件取消订阅失败：" + e);
			return false;
		}
	}
	/**
	 * 一键求助事件订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean onoffevent(String beanName) {
		try {
			return subs("onoffevent", beanName);
		} catch (ITCException e) {
			log.error("设备上下线通知事件订阅失败：" + e);
			return false;
		}
	}


	/**
	 * 一键求助事件取消订阅
	 * @param beanName 处理事件的服务实体类对象名称
	 * @return
	 */
	public static boolean offonoffevent(String beanName) {
		try {
			return unsubs("onoffevent", beanName);
		} catch (ITCException e) {
			log.error("设备上下线通知事件取消订阅失败：" + e);
			return false;
		}
	}
}
