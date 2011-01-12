(function($)
{
	if( 'undefined' === typeof window.eva.api ) { return; }

	window.eva.api = {
		baseUri : "http://192.168.1.46/icdServer/api",
		entries : {
			account : {
				test : {
					path : "/account/test",
					type : "POST",
					conditions : [
						{
							params : {
								foo : "bar",
								bar : {
									asdfgh : "9i4uy34"
								}
							}
						},
						{
							params : {
								foo : "bar",
								bar : [
									"asdfgh"
								]
							},
							validator : function(data) {
								return  1 === parseInt(data.errorCode);
							}
						}
					]
				},
				signup : {
					path : "/account/signup",
					type : "POST",
					conditions : [
						{
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "snowhs",
								email : "",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : ""
							}
						},
						{
							params : {
								username : "snowhs",
								email : "",
								password : ""
							}
						},
						{
							params : {
								username : "snow.%^hs",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "snowhs",
								email : "snowreblooc",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : "as"
							}
						}
					]
				},
				signin : {
					path : "/account/signin",
					type : "POST",
					conditions : [
						{
							params : {
								username : "snowhs",
								password : "asdfgh"
							}
						},
						{
							params : {
								username : "",
								password : "asdfgh"
							}
						}
					]
				}
			},
			post : {},
			people : {},
			place : {},
			event : {}
		}
	};
})(jQuery);