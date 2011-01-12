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
							desc : "Success or duplicate",
							params : {
								username : "snowhs",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							},
							validator : function(data)
							{
								return -1 === $.inArray( parseInt(data.errorCode), [0, 4] );
							}
						},
						{
							desc : "Empty username",
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
							desc : "Empty email",
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
							desc : "Empty password",
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
							desc : "Empty email and password",
							params : {
								username : "snowhs",
								email : "",
								password : ""
							}
						},
						{
							desc : "Invalid username",
							params : {
								username : "snow.%^hs",
								email : "snow@firebloom.cc",
								password : "asdfgh"
							}
						},
						{
							desc : "Invalid email",
							params : {
								username : "snowhs",
								email : "snowreblooc",
								password : "asdfgh"
							}
						},
						{
							desc : "Invalid password",
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
							desc : "Normal",
							params : {
								username : "snowhs",
								password : "asdfgh"
							}
						},
						{
							desc : "Empty username",
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