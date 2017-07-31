package com.hz.frm.net.netty.service.impl;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MsgComsumerGroup {

    private ExecutorService executorService;
    public MsgComsumerGroup(int nThreads) {
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
