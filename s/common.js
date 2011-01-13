jQuery.noConflict();

(function($)
{
	window.eva = {
		/*  */

		/* common element */
		container : false,
		api : false,
		tpl : {},
		debug : false,
		conditions : [],
		exampleUid : 10007,

		/* */

		buildMarkup : function()
		{
			if(!eva.api)
			{
				throw 'api data not loaded';
			}

			$.each(eva.api.entries, function(entityName,entity)
			{
				var $entity = eva.tpl.entity.clone().appendTo('#eva-main');
				$entity.find('.eva-entityName').text(entityName);
				var $entityBody = $entity.find('.bd');

				$.each(entity, function(methodName,method)
				{
					method.url = eva.api.baseUri + '/' + entityName + '/' + methodName;

					var $method = eva.tpl.method.clone().appendTo($entityBody);
					$method.find('.eva-methodName').text(methodName);
					var $methodBody = $method.find('.bd');

					var baseAjaxCfg = {
						url: eva.apiBaseUri + method.path,
						type: method.type,
						dataType: 'json'
					};

					$.each(method.conditions, function(i,condition)
					{
						if(eva.debug && (eva.conditions.length >= 10))
						{
							return;
						}

						condition.method = method;
						eva.conditions.push(condition);
						condition.id = 'eva-condition-' + (eva.conditions.length - 1);

						var $condition = eva.tpl.condition.clone().attr('id',condition.id);

						$condition.find('.eva-status').addClass('eva-available').text('||');

						var summary;

						if( condition.desc )
						{
							summary = condition.desc;
						}
						else
						{
							summary = condition.params.toSource();
							summary = summary.substr(2,summary.length-4);
						}

						$condition.find('.eva-desc').text(summary);

						var $params = $condition.find('.eva-params');

						$.each(condition.params, function(key, value)
						{
							eva.tpl.param.clone().
								find('.eva-key').text(key).
								end().find('.eva-value').text( eva.printJSON(value) ).
								end().appendTo($params);
						});

						$methodBody.append($condition);
						eva.collapseCondition($condition);
					});
				});
			});
		},

		runCondition : function(condition)
		{
			var $condition = $('#'+condition.id);
			$condition.find('.eva-status').removeClass('eva-available').addClass('eva-waiting').text('...');

			$.ajax({
				url: condition.method.url,
				type: condition.method.type,
				dataType: 'json',
				data: condition.params,
				beforeSend: function(xhr, settings)
				{
					$condition.find('.eva-status').removeClass('eva-available').addClass('eva-ing').text('');
					xhr.setRequestHeader('uid',eva.exampleUid);
				},
				success: function(data, textStatus, xhr)
				{
					$condition.find('.eva-ing').removeClass('eva-ing');
					var class;
					var message;

					try{
						if(data)
						{
							if( 'function' === typeof condition.validator )
							{
								condition.validator(data);
							}
							else if( parseInt(data.errorCode) )
							{
								throw data.sysMsg;
							}
						}
						else
						{
							throw 'empty response';
						}

						class = 'eva-success';
						message = data.sysMsg?data.sysMsg:xhr.statusText;
					}
					catch(error)
					{
						class = 'eva-error';
						message = error;
					}

					$condition.addClass(class).
						find('.eva-status').text( xhr.status + ' : ' + message ).
						end().find('.eva-response').html( '<pre>'+ eva.printJSON($.parseJSON(xhr.responseText)) +'</pre>' );
				},
				error: function(xhr, textStatus, errorThrown)
				{
					$condition.addClass('eva-error').
						find('.eva-ing').removeClass('eva-ing').
						end().find('.eva-status').text( xhr.status + ' : ' + xhr.statusText + ' / ' + textStatus);

					if('parsererror' === textStatus)
					{
						$condition.find('.eva-response').text( xhr.responseText);
					}
				}
			});
		},

		expandCondition : function(condition)
		{
			condition.removeClass('eva-collapsed').addClass('eva-expanded').
				find('.eva-extra').slideDown('fast');
		},

		collapseCondition : function(condition)
		{
			condition.removeClass('eva-expanded').addClass('eva-collapsed').
				find('.eva-extra').slideUp('fast');
		},

		printJSON : function (obj, depth)
		{
			var output = '';
			var lastComma;

			if( 'undefined' === typeof depth ) { depth=0; }

			if($.isArray(obj))
			{
				output = "[\n";

				$.each(obj ,function(i ,ele)
				{
					output += eva.printJSON(ele, ++depth) + ', ';
				});

				lastComma = output.length-2

				if( ',' === output[lastComma])
				{
					output = output.substr(0,lastComma) + "\n";
				}

				output += "]\n";
			}
			else if( 'object' === typeof obj )
			{
				output = "{\n";

				$.each(obj, function(key, value)
				{
					if( 'object' === typeof value )
					{
						$.each(obj, function(key, value)
						{
							output += eva.printJSON(value, ++depth);
						});
					}
					else
					{
						for(i=0;i<=depth;i++)
						{
							output += "  ";
						}
						output += ( key + ' : ' + value + ",\n" );
					}
				});

				lastComma = output.length-2

				if( ',' === output[lastComma])
				{
					output = output.substr(0,lastComma) + "\n";
				}

				output += "}\n";
			}
			else
			{
				output = obj;
			}

			return output;
		}
	};

	$(function(){

		eva.container = $('#eva-container');
		eva.container.find('.eva-tpl').each(function(i,e)
		{
			var _tpl = $(this).removeClass('eva-tpl').removeClass('s-h').remove();
			eva.tpl[_tpl.attr('tplName')] = _tpl;
			_tpl.removeAttr('tplName');
		});

		eva.container.delegate('.eva-summary','click',function(e)
		{
			e.preventDefault();
			var _condition = $(e.target).closest('.eva-condition');
			if( _condition.length )
			{
				if(_condition.hasClass('eva-collapsed'))
				{
					eva.expandCondition(_condition);
				}
				else
				{
					eva.collapseCondition(_condition);
				}
			}
		});

		// replace attributes when running on develop host
		if('eva.fe' === location.host)
		{
			eva.debug = true;
			eva.api.baseUri = 'http://eva.fe/pseudoApi';

			$.each(eva.api.entries, function(entryName, entry)
			{
				$.each(entry, function(methodName, method)
				{
					method.type = 'GET';
				});
			});
		}

		eva.buildMarkup();

		var curCondition = 0;
		var sq = setInterval(function()
		{
			eva.runCondition(eva.conditions[curCondition]);
			curCondition++;

			if(curCondition >= eva.conditions.length)
			{
				clearInterval(sq);
			}
		},200);
	});

})(jQuery);