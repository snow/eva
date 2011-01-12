jQuery.noConflict();

(function($)
{
	window.eva = {
		/*  */

		/* common element */
		container: false,
		api: false,
		tpl: {},
		debug: false,

		/* */

		buildMarkup: function()
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
						var $condition = eva.tpl.condition.clone();

						var paramSerial = condition.params.toSource();
						paramSerial = paramSerial.substr(2,paramSerial.length-4);

						$condition.find('.eva-paramSerial').text(paramSerial).
							after('<span class="eva-collapse eva-col-r">collapse</span>');

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

						eva.runCondition(method,condition,$condition);
					});
				});
			});
		},

		runCondition: function(method,condition,$condition)
		{
			$.ajax({
				url: eva.api.baseUri + method.path,
				type: method.type,
				dataType: 'json',
				data: condition.params,
				beforeSend: function(xhr, settings)
				{
					$condition.find('.eva-status').addClass('eva-ing');
				},
				success: function(data, textStatus, xhr)
				{
					$condition.find('.eva-ing').removeClass('eva-ing');

					if( ( ( 'function' === typeof condition.validator ) && condition.validator(data) ) ||
						( !parseInt(data.errorCode) ) )
					{
						$condition.addClass('eva-success').
							find('.eva-status').text( xhr.status + ' : ' + xhr.statusText );
					}
					else
					{
						$condition.addClass('eva-error').
							find('.eva-status').text( '500 : ' + data.sysMsg );
					}

					$condition.find('.eva-response').html( '<pre>'+ eva.printJSON($.parseJSON(xhr.responseText)) +'</pre>' );
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

		expandCondition: function(condition)
		{
			condition.removeClass('eva-collapsed').addClass('eva-expanded').
				find('.eva-collapse').show().
				end().find('.eva-expand').hide().
				end().find('.eva-extra').slideDown('fast');
		},

		collapseCondition: function(condition)
		{
			condition.removeClass('eva-expanded').addClass('eva-collapsed').
				find('.eva-collapse').hide().
				end().find('.eva-expand').show().
				end().find('.eva-extra').slideUp('fast');
		},

		printJSON: function (obj, depth)
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
	});

})(jQuery);