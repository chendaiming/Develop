define(function(require){
	var uploader;
	var $ = require("jquery");
	var tip = require('frm/message');
	//引入webuploader控件
	var webuploader = require('webuploader');
	
	 //=============================================//  
	 //================定义区=======================//
	 // ============================================//
    $wrap = $('.uploader'),
    // 图片容器
    $queue = $('<ul class="filelist"></ul>')
        .appendTo( $wrap.find('.queueList') ),

    // 状态栏，包括进度和控制按钮
    $statusBar = $wrap.find('.statusBar'),

    // 文件总体选择信息。
    $info = $statusBar.find('.info'),

    // 上传按钮
    $upload = $wrap.find('.uploadBtn'),
    //取消上传按钮
    $canel  =  $wrap.find('#cancelBtn'),
    // 没选择文件之前的内容。
    $placeHolder = $wrap.find('.placeholder'),

    // 总体进度条
    $progress = $statusBar.find('.progress').hide(),
    
    $list  =  $('.uploader');

    // 添加的文件数量
    fileCount = 0,

    // 添加的文件总大小
    fileSize = 0,

    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,

    // 缩略图大小
    thumbnailWidth = 110 * ratio,
    thumbnailHeight = 110 * ratio,

    // 可能有pedding, ready, uploading, confirm, done.
    state = 'pedding',

    // 所有文件的进度信息，key为file id
    percentages = {},

    supportTransition = (function(){
        var s = document.createElement('p').style,
            r = 'transition' in s ||
                  'WebkitTransition' in s ||
                  'MozTransition' in s ||
                  'msTransition' in s ||
                  'OTransition' in s;
        s = null;
        return r;
    })();
    
    if ( !webuploader.Uploader.support() ) {
        alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error( 'WebUploader does not support the browser you are using.' );
    }
	 /*=============================================*/  
     /*================初始化webUploader============*/
     /*=============================================*/
	 uploader = webuploader.create({
		//自动上传:关闭
		auto: false,
	    // swf文件路径
	    swf: ctx + 'libs/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx  + 'uploadFileCtrl/upload',
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: {
            id: '#filePicker',
            label: '点击选择图片'
        },
        //拖拽区域
        dnd: '.uploader .queueList',
        //黏贴区域
        paste:document.body,
        //禁掉全局的拖拽功能:防止图片拖进页面的时候,图片打开
        disableGlobalDnd: true,
	    //单次上传最多图片数
	    fileNumLimit: 1,
	    //单个文件最大为2m
	    fileSingleSizeLimit: 2*1024*1024,
	    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	    resize: false,
	    // 限制上传文件格式,类型
	    accept: {}
	});
	uploader.setOption = function(key,value){
		uploader.option(key,value);
	};
	//文件上传发送前触发,可在此处对  data 进行属性追加传到后台
	uploader.on( 'uploadBeforeSend', function( object,data,headers  ) {
		uploader.uploadBeforeSend(object,data,headers );
	});	 
	/**
	 * 上传文件前触发
	 * 需要在上传之前做的操作实现该方法即可
	 */
	uploader.uploadBeforeSend = function(object,data,headers){
		
	};
	/*=============================================*/  
    /*================事件响应=====================*/
    /*=============================================*/
	 //单击开始上传按钮开始上传
	$upload.on('click', function () {
		 if ( $(this).hasClass( 'disabled' ) ) {
	            return false;
	      }
	     if ( state === 'ready' ) {
	           uploader.upload();
	     } else if ( state === 'paused' ) {
	           uploader.upload();
	     } else if ( state === 'uploading' ) {
	           uploader.stop();
	     }
	});
	//单击取消上传按钮,重置上传控件布局及队列
	$canel.on('click', function () {
		resetUploader();
	});
	// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {	    
	    var $li = $('#'+file.id),
        $percent = $li.find('.progress span');
	    $percent.css( 'width', percentage * 100 + '%' );
	    percentages[ file.id ][ 1 ] = percentage;
	    updateTotalProgress();
	});
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		console.log(JSON.parse(response).msg);
		uploader.uploadSuccess(file,response);
	});
	/**
	 * 文件上传成功后调用的方法(提供给前台重写)
	 */
	uploader.uploadSuccess = function( file,response ) {
	
	}
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id ),
	        $error = $li.find('div.error');
	    // 避免重复创建
	    if ( !$error.length ) {
	        $error = $('<div class="error"></div>').appendTo( $li );
	    }
	    $error.text('上传失败');
	});
	/**
	 * 上传结束事件
	 * 所有文件上传结束触发
	 */
	uploader.on( 'uploadFinished', function() {
		console.log('上传完成');
		resetUploader();
		uploader.uploadFinished();
	});
	
	uploader.uploadFinished = function() {
		
	};
	 /**
	   * 文件新增
	   */  
	  uploader.onFileQueued = function( file ) {
	        fileCount++;
	        fileSize += file.size;

	        if ( fileCount === 1 ) {
	            $placeHolder.addClass( 'element-invisible' );
	            $statusBar.find('.progress').hide(),
	            $statusBar.show();
	        }

	        addFile( file );
	        setState( 'ready' );
	        updateTotalProgress();
	    };
	    /**
	     * 文件移除
	     */
	    uploader.onFileDequeued = function( file ) {
	        fileCount--;
	        fileSize -= file.size;

	        if ( !fileCount ) {
	            setState( 'pedding' );
	        }

	        removeFile( file );
	        updateTotalProgress();

	    };
	    
	    uploader.on( 'all', function( type ) {
	        var stats;
	        switch( type ) {
	            case 'uploadFinished':
	                setState( 'confirm' );
	                break;

	            case 'startUpload':
	                setState( 'uploading' );
	                break;

	            case 'stopUpload':
	                setState( 'paused' );
	                break;

	        }
	    });
	    /**
	     * 异常
	     */
	    uploader.onError = function( code ) {
	    	var alert = true;
	    	console.log('uploader-error-code:'+code);
	    	var text = '';
	    	  switch( code ) {
            case 'exceed_size':
            case 'F_EXCEED_SIZE':	
                text = '文件大小超出';
                break;
            case 'interrupt':
                text = '上传暂停';
                break;
            case 'Q_EXCEED_NUM_LIMIT':
            	var fileNum = uploader.option('fileNumLimit');
            	tip.confirm('所选文件个数超出最大设定数 <span style="color:red;">'+fileNum+'</span> 的限制',function(){
            		resetUploader();
    			},function(){},'提示',['重新选择','选择前'+fileNum+'个文件']);
//            	text = '所选文件个数超出最大设定数:'+fileNum+' 的限制,超出的文件已舍弃';
            	alert = false;
            	break;
            default:
                text = '上传失败，请重试,(errorCode:'+code+')';
                break;
	    	  }
	    	  alert &&  tip.alert( '错误: ' + text );
	    };
	    
	    $info.on( 'click', '.retry', function() {
	        uploader.retry();
	    } );

	    $info.on( 'click', '.ignore', function() {
	        // 忽略
	    } );	 
	/**
	 * 重置上传控件
	 */
	function resetUploader(){
		 var fileList = uploader.getFiles();
		 for(var i=0;i<fileList.length;i++){
			 uploader.removeFile(fileList[i]);
			 $( '#'+fileList[i].id ).off().remove();
		 }
		 setState('pedding');
		 fileCount = 0;
		 fileSize  = 0;
		 uploader.reset();
		 updateStatus();
	}
	/**
	 * 进度条更新
	 */
    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each( percentages, function( k, v ) {
            total += v[ 0 ];
            loaded += v[ 0 ] * v[ 1 ];
        } );

        percent = total ? loaded / total : 0;

        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
        updateStatus();
    }
	
    /**
     * 状态更新
     */
    function updateStatus() {
        var text = '', stats;

        if ( state === 'ready' ) {
            text = '选中' + fileCount + '个文件，共' +
                    webuploader.formatSize( fileSize ) + '。';
        } else if ( state === 'confirm' ) {
            stats = uploader.getStats();
            if ( stats.uploadFailNum ) {
                text = '已成功上传' + stats.successNum+ '张文件至服务器，'+
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
            }
        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                    webuploader.formatSize( fileSize )  +
                    '），已上传' + stats.successNum + '张';

            if ( stats.uploadFailNum ) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html( text );
    }
	// 当有文件添加进来时执行，负责view的创建
    function addFile( file ) {
        var $li = $( '<li id="' + file.id + '">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"></p>'+
                '<p class="progress"><span></span></p>' +
                '</li>' ),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find( 'p.imgWrap' );
        
        if ( file.getStatus() === 'invalid' ) {
            showError( file.statusText );
        } else {
            // @todo lazyload
            $wrap.text( '预览中' );
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $wrap.text( '不能预览' );
                    return;
                }

                var img = $('<img src="'+src+'">');
                $wrap.empty().append( img );
            }, thumbnailWidth, thumbnailHeight );

            percentages[ file.id ] = [ file.size, 0 ];
            file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
            if ( prev === 'progress' ) {
                $prgress.hide().width(0);
            } else if ( prev === 'queued' ) {
                $li.off( 'mouseenter mouseleave' );
                $btns.remove();             
            }

            // 成功
            if ( cur === 'error' || cur === 'invalid' ) {
                showError( file.statusText );
                percentages[ file.id ][ 1 ] = 1;
            } else if ( cur === 'interrupt' ) {
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
                $info.remove();
                $prgress.css('display', 'block');
            } else if ( cur === 'complete' ) {
                $li.append( '<span class="success"></span>' );
            }

            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
        });

        $li.on( 'mouseenter', function() {
            $btns.stop().animate({height: 30});
        });

        $li.on( 'mouseleave', function() {
            $btns.stop().animate({height: 0});
        });

        $btns.on( 'click', 'span', function() {
        	
            var index = $(this).index(),
                deg;
            
            switch ( index ) {
                case 0:
                    uploader.removeFile( file );
                    return;
                case 1:
                    file.rotation += 90;
                    break;
                case 2:
                    file.rotation -= 90;
                    break;
            }

            if ( supportTransition ) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
            }
        });

        $li.appendTo( $queue );
    }

    // 负责view的销毁
    function removeFile( file ) {
        var $li = $('#'+file.id);

        delete percentages[ file.id ];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }
    /**
     * 状态设定
     */
    setState = function ( val ) {
	        var file, stats;

	        if ( val === state ) {
	            return;
	        }

	        $upload.removeClass( 'state-' + state );
	        $upload.addClass( 'state-' + val );
	        state = val;

	        switch ( state ) {
	            case 'pedding':
	                $placeHolder.removeClass( 'element-invisible' );
	                $queue.parent().removeClass('filled');
	                $queue.hide();
	                $statusBar.addClass( 'element-invisible' );
	                uploader.refresh();
	                break;

	            case 'ready':
	                $placeHolder.addClass( 'element-invisible' );
	                $queue.parent().addClass('filled');
	                $queue.show();
	                $statusBar.removeClass('element-invisible');
	                $upload.text( '开始上传' ).removeClass('disabled');
	                uploader.refresh();
	                break;

	            case 'uploading':
	                $progress.show();
	                $upload.text( '暂停上传' );
	                break;

	            case 'paused':
	                $progress.show();
	                $upload.text( '继续上传' );
	                break;

	            case 'confirm':
	                $progress.hide();
	                $upload.text( '开始上传' ).addClass('disabled');
	                stats = uploader.getStats();
	                if ( stats.successNum && !stats.uploadFailNum ) {
	                    setState( 'finish' );
	                    return;
	                }
	                break;
	            case 'finish':
	                stats = uploader.getStats();
	                if ( stats.successNum ) {
	                    console.log( '上传完成' );
	                } else {
	                    // 没有成功的图片，重设
	                    state = 'done';
	                    location.reload();
	                }
	                break;
	        }
	        updateStatus();
	    }
	    $upload.addClass( 'state-' + state );
	    updateTotalProgress();
	    
	    return uploader;
});