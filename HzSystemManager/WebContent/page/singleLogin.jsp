<script type="text/javascript">
	    var data=${ck};
	    login(data);
	    function login(data){
	    	if(typeof data=="number"||data.includes('.')){
				alert('invalid account!');
			}else{
				window.localStorage.setItem("userInfo","obj-"+JSON.stringify(data));
				window.location.href="../index.html";
			}
	    }
</script>

