define(function (require) {
	
	function MyWebSocket () {
	    var protocols = protocols || [];

	    var _self = this;	// 本对象
	    var _ws = null;	// websocket对象
	    var _forcedClose = false;// 强制关闭
	    var _timedOutStatus = false;// 超时状态
	    var _eventOnPools = {};	// 事件订阅池
	    var _reTimeout = null;	// 定时重连的ID
	    var _url=null;

	    // These can be altered by calling code.
	    this.debug = false;	// 日志模式
	    this.reconnectInterval = 1000;		// 重连间隔
	    this.reconnectDecay = 0;		// 重连衰减
	    this.reconnectAttemptCount = 0;		// 重连尝试次数
	    this.timeoutInterval = 2000;		//
	    this.protocols = protocols;
	    this.readyState = WebSocket.CONNECTING;// 准备状态

	    // 初始化订阅池的事件类型
	    _eventOnPools = {
	        onopen: {},
	        onclose: {},
	        onconnecting: {},
	        onmessage: {},
	        onerror: {}
	    };

	    this.init = function (url) {
	        _url = url;
	    };

	    /*
	     * 发送消息
	     */
	    this.send = function (data) {
	        if (_ws) {
	            _printLog('send-msg', data);
	            return _ws.send(data);
	        } else {
	            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
	        }
	    };

	    /*
	     * 关闭websocket
	     */
	    this.close = function () {
	        _forcedClose = true;
	        if (_ws) {
	            _ws.close();
	        }
	    };

	    /*
	     * 刷新连接
	     */
	    function _refresh() {
	        if (_ws) {
	            _ws.close();
	        }
	    };

	    /*
	     * 重连
	     */
	    function _reconnect() {
	        clearTimeout(_reTimeout);
	        this.connect(true);
	    };

	    /**
	     * 事件订阅
	     * @param type        事件类型：onopen、onclose、onconnecting、onmessage、onerror
	     * @param subsciber    事件订阅者
	     * @param fn        处理函数，返回参数event
	     */
	    this.on = function (type, subsciber, fn) {
	        try {
	            if (_eventOnPools[type]) {
	                if (_eventOnPools[type][subsciber] == undefined) {
	                    _eventOnPools[type][subsciber] = fn;
	                    console.log('websocket.on: 事件[', type, ']订阅成功，订阅者[', subsciber, ']');
	                    return true;
	                } else {
	                    console.warn('websocket.on: 订阅失败，[', type, ']事件已被[', subsciber, ']订阅，不能重复订阅!');
	                }
	            } else {
	                console.warn('websocket.on: 订阅失败，[', type, ']事件不存在!');
	            }
	        } catch (e) {
	            console.error('websocket.on: 事件订阅错误：', e, ', 事件名称[', type, '], 订阅者[', subsciber, ']');
	        }
	        return false;
	    };

	    /**
	     * 取消订阅
	     * @param type 事件类型：onopen、onclose、onconnecting、onmessage、onerror
	     * @param subsciber 订阅者
	     */
	    this.off = function (type, subsciber) {
	        try {
	            var result = null;
	            if (_eventOnPools[type]) {
	                if (_eventOnPools[type][subsciber]) {
	                    delete _eventOnPools[type][subsciber];
	                    console.log('websocket.off: 订阅者[', subsciber, ']已取消[', type, ']事件订阅!');
	                    return true;
	                } else {
	                    console.warn('websocket.off: [', type, ']事件取消订阅失败，订阅者[', subsciber, ']不存在!');
	                }
	            } else {
	                console.warn('websocket.off: 取消订阅失败，[', type, ']事件不存在!');
	            }
	        } catch (e) {
	            console.error('websocket.off: [', type, ']事件取消订阅错误: ', e, ', 订阅者[', subsciber, ']');
	        }
	        return false;
	    };

	    /*
	     * 日志打印
	     */
	    function _printLog(type, event) {
	        if (_self.debug) {
	            console.log('WebSocket: ', type, '|', _url, '|', event);
	        }
	    }

	    /*
	     * 事件处理
	     */
	    function _handleEvents(type, data) {
	        var events = _eventOnPools[type];
	        var hasSubs = false; // 是否有订阅者
	        if (events) {
	            hasSubs = false;
	            for (var key in events) {
	                try {
	                    hasSubs = true;
	                    events[key](data);
	                } catch (e) {
	                    console.error('websocket.handle: 事件处理错误：', e, ', 事件名称[', type, '], 订阅者[', key, ']');
	                }
	            }
	        }
	        if (!hasSubs) {
	            console.warn('websocket.handle: [', type, ']事件未被订阅，无法完成处理!')
	        }
	    }

	    /*
	     * 连接
	     */
	    this.connect = function (reconnectAttempt) {
	        var localWs = _ws = new WebSocket(_url, protocols);
	        if (!reconnectAttempt) {
	            _handleEvents('onconnecting', null);
	        } else {
	            _printLog('attempt-connect', '');
	        }

	        var timeout = setTimeout(function () {
	            _printLog('connection-timeout', '');
	            _timedOutStatus = true;
	            localWs.close();
	            _timedOutStatus = false;
	        }, _self.timeoutInterval);

	        _ws.onopen = function (event) {
	            clearTimeout(timeout);
	            _printLog('onopen', event);
	            _self.readyState = WebSocket.OPEN;
	            _handleEvents('onopen', event);
	            reconnectAttempt = false;
	            _self.reconnectAttemptCount = 0;
	        };

	        _ws.onclose = function (event) {
	            clearTimeout(timeout);
	            _ws = null;
	            if (_forcedClose) {
	                _self.readyState = WebSocket.CLOSED;
	                _handleEvents('onclose', event);
	            } else {
	                _self.readyState = WebSocket.CONNECTING;
	                _handleEvents('onconnecting', event);

	                if (!reconnectAttempt && !_timedOutStatus) {
	                    _printLog('onclose', event);
	                }
	                _reTimeout = setTimeout(function () {
	                    _self.reconnectAttemptCount++;
	                    _self.connect(true);
	                }, _self.reconnectInterval + _self.reconnectDecay * _self.reconnectAttemptCount);
	            }
	        };

	        /*
	         * 接受消息事件
	         */
	        _ws.onmessage = function (event) {
	            _printLog('onmessage', event);
	            _handleEvents('onmessage', event);
	        };

	        /*
	         * 异常错误事件
	         */
	        _ws.onerror = function (event) {
	            _printLog('onerror', event);
	            _handleEvents('onerror', event);
	        };
	    }
//	    this.send = _send;
//	    this.connect = _connect;
//	    this.on = _on;
//	    this.off = _off;
//	    this.init = _init;
	}

	return MyWebSocket;
})
