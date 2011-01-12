(function($)
{
	if( 'undefined' === typeof window.eva.api ) { return; }

	window.eva.api = {
		baseUri : "http://192.168.1.46/icdServer/api",
		entries : {
			account : {
				signup : {
					path : "/account/signup",
					type : "POST",
					conditions : [
						{
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 4;
							}
						},
						{
							params : {
								username : "",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 5;
							}
						},
						{
							params : {
								username : "snowhs",
								email : "",
								password : "asdfgh"
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 3;
							}
						},
						{
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : ""
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 2;
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