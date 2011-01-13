(function($)
{
	if( 'undefined' === typeof window.eva.api ) { return; }

	window.eva.api = {
		baseUri : 'http://192.168.1.46/icdServer/api',
		entries : {
			account : {
				signup : {
					type : 'POST',
					conditions : [
						{
							desc : 'success or duplicate',
							params : {
								username : 'snowhs',
								email : 'snow@firebloom.cc',
								password : 'asdfgh'
							},
							validator : function(data)
							{
								return -1 < $.inArray( parseInt(data.errorCode), [0, 4] );
							}
						},
						{
							desc : 'missing username',
							params : {
								username : '',
								email : 'snow@firebloom.cc',
								password : 'asdfgh'
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 5;
							}
						},
						{
							desc : 'missing email',
							params : {
								username : 'snowhs',
								email : '',
								password : 'asdfgh'
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 3;
							}
						},
						{
							desc : 'missing password',
							params : {
								username : 'snowhs',
								email : 'snow@firebloom.cc',
								password : ''
							},
							validator : function(data)
							{
								return parseInt(data.errorCode) === 2;
							}
						},
						{
							desc : 'missing email and password',
							params : {
								username : 'snowhs',
								email : '',
								password : ''
							}
						},
						{
							desc : 'invalid username',
							params : {
								username : 'snow.%^hs',
								email : 'snow@firebloom.cc',
								password : 'asdfgh'
							}
						},
						{
							desc : 'invalid email',
							params : {
								username : 'snowhs',
								email : 'snowreblooc',
								password : 'asdfgh'
							}
						},
						{
							desc : 'invalid password',
							params : {
								username : 'snowhs',
								email : 'snow@firebloom.cc',
								password : 'as'
							}
						}
					]
				},
				signin : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								username : 'snowhs',
								password : 'asdfgh'
							}
						},
						{
							desc : 'missing username',
							params : {
								username : '',
								password : 'asdfgh'
							}
						},
						{
							desc : 'missing password',
							params : {
								username : 'snowhs',
								password : 'asdfgh'
							}
						},
						{
							desc : 'didn\'t signed up',
							params : {
								username : 'snowhssss',
								password : 'asdfgh'
							}
						}
					]
				}
			},
			post : {
				create : {
					type : 'POST',
					conditions : [
						{
							desc : 'default checkin',
							params : {
								uid : 10007,
								placeId : 24875,
								text : 'wifi慢到发疯啊啊啊啊',
								photo : '',
								toSync : false,
								type : 1
							}
						},
						{
							desc : 'default tip',
							params : {
								uid : 10007,
								placeId : 24875,
								text : '￥28的基本饮料可以免费续杯，有很多种可以选，每次续杯都可以选不同的。wifi慢得发疯——不过我就没见过哪家咖啡的wifi快的。',
								photo : '',
								toSync : false,
								type : 2
							}
						},
						{
							desc : 'missing uid',
							params : {
								uid : '',
								placeId : 24875,
								text : 'wifi慢到发疯啊啊啊啊',
								photo : '',
								toSync : false,
								type : 2
							}
						},
						{
							desc : 'missing placeId',
							params : {
								uid : 10007,
								placeId : '',
								text : 'wifi慢到发疯啊啊啊啊',
								photo : '',
								toSync : false,
								type : 2
							}
						},
						{
							desc : 'tip missing text',
							params : {
								uid : 10007,
								placeId : 24875,
								text : '',
								photo : '',
								toSync : false,
								type : 2
							}
						}
					]
				},
				list : {
					type : 'GET',
					conditions : [
						{
							desc : 'home feed',
							params : {
								queryId : 1007,
								limit : 20,
								start : 0,
								postType : 1,
								queryType : 3
							}
						},
						{
							desc : 'place tip',
							params : {
								queryId : 24875,
								limit : 20,
								start :0,
								postType : 2,
								queryType : 1
							}
						},
						{
							desc : 'place photo',
							params : {
								queryId : 24875,
								limit : 20,
								start :0,
								postType : 3,
								queryType : 1
							}
						},
						{
							desc : 'people checkin history',
							params : {
								queryId : 10007,
								limit : 20,
								start :0,
								postType : 1,
								queryType : 2
							}
						},
					]
				},
				getInfo : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						},
						{
							desc : 'missing place id',
							params : {}
						},
						{
							desc : 'non exists place',
							params : {
								id : 999999999,
							}
						}
					]
				},
				getIntro : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						},
						{
							desc : 'missing place id',
							params : {}
						},
						{
							desc : 'non exists place',
							params : {
								id : 999999999,
							}
						}
					]
				},
				getMayor : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						},
						{
							desc : 'missing place id',
							params : {}
						},
						{
							desc : 'non exists place',
							params : {
								id : 999999999,
							}
						}
					]
				},
				getVisitors : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						},
						{
							desc : 'missing place id',
							params : {}
						},
						{
							desc : 'non exists place',
							params : {
								id : 999999999,
							}
						}
					]
				}
			},
			user : {
				getInfo : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						}
					]
				},
				follow : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10009
							}
						},
						{
							desc : 'with message',
							params : {
								id : 10021,
								msg : 'Hi'
							}
						},
						{
							desc : 'duplicate',
							params : {
								id : 10009
							}
						},
						{
							desc : 'non exists people',
							params : {
								id : 999999999
							}
						}
					]
				},
				unfollow : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10009,
							}
						},
						{
							desc : 'default',
							params : {
								id : 10021,
							}
						},
						{
							desc : 'duplicate',
							params : {
								id : 10009
							}
						},
						{
							desc : 'non exists people',
							params : {
								id : 999999999
							}
						}
					]
				},
				getMayorshipList : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						}
					]
				},
				getBadgeList : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 10007
							}
						}
					]
				},
				getFollowing : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {}
						},
						{
							desc : 'with pagination params',
							params : {
								start : 0,
								limit : 20
							}
						}
					]
				},
				getFollower : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {}
						},
						{
							desc : 'with pagination params',
							params : {
								start : 0,
								limit : 20
							}
						}
					]
				}
			},
			place : {
				list : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								latitude : '30.621350',
								longitude : '104.075611'
							}
						},
						{
							desc : 'with category',
							params : {
								latitude : '30.621350',
								longitude : '104.075611',
								category : 5
							}
						},
						{
							desc : 'with distance',
							params : {
								latitude : '30.621350',
								longitude : '104.075611',
								distance : 2000
							}
						},
						{
							desc : 'with category & distance',
							params : {
								latitude : '30.621350',
								longitude : '104.075611',
								category : 5,
								distance : 2000
							}
						},
						{
							desc : 'missing coordinate',
							params : {}
						}
					]
				},
				add : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								placename : '赛百味南二环店',
								address : '四川省成都市武侯区二环路南二段2号',
								categoryId : 6,
								latitude : '30.621350',
								longitude : '104.075611'
							}
						},
						{
							desc : 'missing name',
							params : {
								placename : '',
								address : '四川省成都市武侯区二环路南二段2号',
								categoryId : 6,
								latitude : '30.621350',
								longitude : '104.075611'
							}
						},
						{
							desc : 'missing address',
							params : {
								placename : '赛百味南二环店',
								address : '',
								categoryId : 6,
								latitude : '30.621350',
								longitude : '104.075611'
							}
						},
						{
							desc : 'missing categoryId',
							params : {
								placename : '赛百味南二环店',
								address : '四川省成都市武侯区二环路南二段2号',
								latitude : '30.621350',
								longitude : '104.075611'
							}
						},
						{
							desc : 'missing coordinate',
							params : {
								placename : '赛百味南二环店',
								address : '四川省成都市武侯区二环路南二段2号',
								categoryId : 6
							}
						}
					]
				},
				getInfo : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								placeId : 24875
							}
						}
					]
				}
			},
			event : {
				list : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {}
						},
						{
							desc : 'with pagination params',
							params : {
								limit : 20,
								start : 20
							}
						}
					]
				},
				getInfo : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 1
							}
						}
					]
				}
			},
			todo : {
				list : {
					type : 'GET',
					conditions : [
						{
							desc : 'all tips of a people',
							params : {
								uid : 10007
							}
						},
						{
							desc : 'tips at a place of a people',
							params : {
								uid : 10007,
								place : 24875
							}
						},
						{
							desc : 'with pagination params',
							params : {
								uid : 10007,
								start : 20,
								limit : 20
							}
						}
					]
				},
				addPlace : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								placeId : 24875
							}
						},
						{
							desc : 'with text',
							params : {
								placeId : 24875,
								text : '要试一下基本饮料'
							}
						},
						{
							desc : 'update',
							params : {
								placeId : 24875,
								text : '要试一下基本饮料，还要找一下[丁丁历险记]'
							}
						},
						{
							desc : 'missing placeId',
							params : {}
						}
					]
				},
				addTip : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								tipId : 179
							}
						},
						{
							desc : 'duplicate',
							params : {
								tipId : 179
							}
						},
						{
							desc : 'missing tipId',
							params : {}
						}
					]
				},
				remove : {
					type : 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 0
							}
						},
						{
							desc : 'missing todoId',
							params : {
								id : 0
							}
						},
						{
							desc : 'non-exists todoId',
							params : {
								id : 0
							}
						}
					]
				}
			},
			feedback : {
				create : {
					type: 'POST',
					conditions : [
						{
							desc : 'default',
							params : {
								text : '迟到了要自觉买零食！！',
							}
						},
						{
							desc : 'with place',
							params : {
								text : '自己找去',
								placeId : 24875
							}
						},
						{
							desc : 'missing text',
							params : {}
						}
					]
				}
			},
			badge: {
				getInfo : {
					type : 'GET',
					conditions : [
						{
							desc : 'default',
							params : {
								id : 1
							}
						},
						{
							desc : 'missing id',
							params : {}
						},
						{
							desc : 'non-exists id',
							params : {
								id : 999999999
							}
						}
					]
				}
			}
		}
	};
})(jQuery);
