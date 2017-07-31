package com.hz.fe;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.hz.frm.util.ConfigUtil;

public class FeMessageThreadGroup {
    private ExecutorService executorService;
    public FeMessageThreadGroup(){
    	int threadNum = 10;
    	try {
    		threadNum = Integer.valueOf(ConfigUtil.get("frontMachineMsgThreadNum")).intValue();
		} catch (NumberFormatException e) {
		}
        //创建线程池
    	executorService = Executors.newFixedThreadPool(threadNum);
    }
    public FeMessageThreadGroup(int nThreads) {
        //创建线程池
    	executorService = Executors.newFixedThreadPool(nThreads);
    }

    public void execute(Runnable runnable) {
    	executorService.execute(runnable);
    }

    public void shutdown() {
    	executorService.shutdown();
    }

}
