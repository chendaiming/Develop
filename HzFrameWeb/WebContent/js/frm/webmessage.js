define(function(require){
    var frmwebsocket = require('frm/websocket');

    function MyWebmessage () {
        var onPools = {};			// 事件订阅池
        var msgPools = new Array();// 消息池
        var locked = false;		// 消息处理锁
        var handleInterval = 20;	// 消息处理间隔

        this.websocket = null;

        /**
         * 初始化消息对象
         */
        this.init = function (url,success) {
        	this.websocket = new frmwebsocket();
        	this.websocket.init(url);

            // 事件订阅
        	this.websocket.on('onopen', 'login', function (event) {
            	if (typeof success == 'function') 
            		success();
            });

        	this.websocket.on('onmessage', 'webmessage', function (event) {
                var data = event.data;
//                console.log('webmessage.receive: ' + JSON.stringify(data));

                if (data && data.length) {
                    msgPools.push(JSON.parse(data));
                    _handle();
                }
            });

        	this.websocket.on('onclose','webmessage',function(event){
//                console.log(event);
            });
        	this.websocket.on('onconnecting','webmessage',function(event){
//                console.log(event);
            });
        	this.websocket.on('onerror','webmessage',function(event){
//                console.log(event);
            });

            setTimeout(this.websocket.connect, 100, false);
        };

        /**
         * 消息发送
         */
        this.send = function (data) {
            try {
                data = JSON.stringify(data);
                console.log('webmessage.send: ' + data);
                return this.websocket.send(data);
            } catch (e) {
                console.error('webmessage.send: ' + e);
                return false;
            }
        };

        /**
         * 消息订阅
         * @param msgType	消息类型
         * @param name      订阅者
         * @param fn        处理函数，返回参数data
         * @param isOver	如果订阅者已存在，是否强制覆盖
         */
        this.on = function (msgType, name, fn, isOver) {
            try {
                if (onPools[msgType] == undefined) {
                    onPools[msgType] = {};
                    onPools[msgType][name] = fn;
                } else {
                    if (onPools[msgType][name] == undefined || isOver) {
                        onPools[msgType][name] = fn;
                    } else {
                        console.warn('webmessage.on: [', msgType, ']的消息订阅成功，订阅者[', name, ']已存在!');
                        return false;
                    }
                }
                console.log('webmessage.on: [', msgType, ']的消息订阅成功，订阅者[', name, ']');
                return true;
            } catch (e) {
                console.error('webmessage.on: 消息订阅错误，消息类型[', msgType, '], 订阅者[', name, ']');
            }

        };

        /**
         * 取消订阅
         * @param msgType    消息类型
         * @param name        订阅者
         */
        this.off = function (msgType, name) {
            try {
                if (onPools[msgType]) {
                    delete onPools[msgType][name];
                    console.log('webmessage.off: 订阅者[', name, ']已取消[', msgType, ']消息的订阅!');
                    return true;
                }
            } catch (e) {
                console.error('webmessage.off: 取消订阅错误：', e, '消息类型[', msgType, ']，订阅者[', name, ']');
                return false;
            }
        }

        /**
         * 消息处理
         */
        function _handle () {
            if (!locked) {
                // 消息处理时锁定，防止并发
                locked = true;
                _execute();
            }
        }

        /**
         * 轮循处理消息(不提供给外部使用)
         */
        function _execute () {
            if (locked) {
                var message = msgPools.shift();			// 消息
                var msgType = _getMsgType(message);		// 获取消息类型（先获取消息头的，没有再从消息对象中直接获取）
                var subscibers = onPools[msgType];		// 消息订阅者集合
                var hasSubsciber = false;				// 是否有订阅者

                if (subscibers) {
                    for (var key in subscibers) {
                        hasSubsciber = true;
                        // 采用延迟操作来并发处理同一条消息
                        setTimeout(function (fn, msg) {
                            try {
                                fn(msg);
                            } catch (e) {
                            	// 函数是否已被释放，被释放的函数不处理也不抛异常
                            	// e.number = -2146823277 则表示函数已被释放
                            	if (e.number != -2146823277) {
                            		console.error('webmessage.handle: ' + e);
                            	}
                            }
                        }, 10, subscibers[key], message);
                    }
                }

                // 没有被订阅的消息暂时不做处理
                if (!hasSubsciber) {
                    console.warn('webmessage.handle: [' + msgType + ']的消息没有被订阅!');
                }

                // 消息处理完之后解锁
                if (msgPools.length == 0) {
                    locked = false;
                } else {
                    // 消息处理间隔控制
                    setTimeout(_execute, handleInterval);
                }
            }
        }
    }


    /*
     * 获取消息头
     */
    function _getMsgHeader (message) {
    	var header = message.header;

    	if (typeof header == 'string') {
    		return JSON.parse(header);
    	}

    	return header;
    }


    /*
     * 获取消息类型
     */
    function _getMsgType (message) {
    	var header = _getMsgHeader(message) || {};
    	return header.msgType || message.msgType;
    }

    return MyWebmessage;
})