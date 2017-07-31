
		function getFlags(starttime,endtime){
			var stime=new Date(starttime.replace(/-/g,"/"));
			var etime=new Date(endtime.replace(/-/g,"/"));
		    var	slongtime=stime.getTime();
		    var	elongtime=etime.getTime();
		    return  (elongtime-slongtime>=0)?true:false;
		}
