package com.hz.db.extend;

import javax.annotation.Resource;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import com.hz.db.dao.JdbcDAO;

/**
 * 初始化数据抽象类
 */
public abstract class InitDataAbstract implements ApplicationListener<ContextRefreshedEvent> {
//	private static int initCount = 0;

	private boolean hasInited = false;

	@Resource
	protected JdbcDAO jdbcDAO;


	@Override
	public void onApplicationEvent(ContextRefreshedEvent arg0) {
		// System.out.println("ApplicationContext DisplayName(" + (++initCount) + ")：" + arg0.getApplicationContext().getDisplayName());

		// 等Root WebApplicationContext 容器初始化完成之后执行
		if (arg0.getApplicationContext().getParent() == null && !hasInited) {
			hasInited = true;
			initData();
		}
	}


	/**
	 * 初始化数据
	 */
	protected abstract void initData ();
}
