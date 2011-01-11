jQuery.noConflict();

(function($)
{
	window.eva = {

		/*  */

		/* common element */
		container: false,
		tpl: {},
		testDataLoaded: false,
		apiBaseUri: false,
		apiEntries: {},

		/* */
		loadTestData: function(data)
		{
			data = $(data);
			eva.apiBaseUri = data.find('apiBaseUri').text();

			data.find('apiLi').each(function(apiIndex,apiLi)
			{
				var apiLi = $(apiLi);
				var apiObj = {
					path: apiLi.find('path').text(),
					type: ( ( apiLi.find('method').text().toUpperCase() === 'POST' )?'POST':'GET' ),
					conditions: []
				};

				apiLi.find('condition').each(function(conditionIndex,condition)
				{
					var condition = $(condition);
					var data = {};
					condition.find('param').each(function(i,param)
					{
						var param = $(param);
						data[param.find('key').text()] = param.find('value').text();
					});
					apiObj.conditions.push(data);
				});

				// put object of current api method in api entry tree
				var entityAndMethod = apiObj.path.split('/');
				// remove the first element if it's empty
				if( !entityAndMethod[0] )
				{
					entityAndMethod.shift();
				}
				// eva.apiEntries[method][function] = apiObj
				if( 'undefined' === typeof eva.apiEntries[entityAndMethod[0]] )
				{
					eva.apiEntries[entityAndMethod[0]] = {};
				}
				eva.apiEntries[entityAndMethod[0]][entityAndMethod[1]] =apiObj;
			});

			eva.testDataLoaded = true;
			eva.buildMarkup();

			//console.log(eva.apiEntries);
		},

		buildMarkup: function()
		{
			if(!eva.testDataLoaded)
			{
				throw 'test data not yet loaded';
			}

			$.each(eva.apiEntries, function(entityName,entity)
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

						$condition.find('.eva-paramSerial').text(condition.toSource()).
							after('<span class="eva-collapse eva-col-r">collapse</span>');

						var $params = $condition.find('.eva-params');

						$.each(condition, function(key, value)
						{
							eva.tpl.param.clone().
								find('.eva-key').text(key).
								end().find('.eva-value').text(value).
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
				url: eva.apiBaseUri + method.path,
				type: method.type,
				dataType: 'json',
				data: condition,
				beforeSend: function(xhr, settings)
				{
					$condition.find('.eva-status').addClass('eva-ing');
				},
				success: function(data, textStatus, xhr)
				{
					$condition.find('.eva-ing').removeClass('eva-ing');

					if( parseInt(data.errorCode) )
					{
						$condition.addClass('eva-error').
							find('.eva-status').text( '500 : ' + data.sysMsg );
					}
					else
					{
						$condition.addClass('eva-success').
							find('.eva-status').text( xhr.status + ' : ' + xhr.statusText );
					}

					$condition.find('.eva-response').html( '<pre>'+ eva.printJSON($.parseJSON(xhr.responseText)) +'</pre>' );
				},
				error: function(xhr, textStatus, errorThrown)
				{
					$condition.addClass('eva-error').
						find('.eva-ing').removeClass('eva-ing').
						end().find('.eva-status').text( xhr.status + ' : ' + xhr.statusText );
				}
			});
		},

		handleConditionError: function(statusCode,errorMessage){},

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

			if( 'undefined' === typeof depth ) { depth=0; }

			if( 'object' === typeof obj )
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

				var lastComma = output.length-2

				if( ',' === output[lastComma])
				{
					output = output.substr(0,lastComma) + "\n";
				}

				output += "}\n";
			}
			else
			{
				throw 'eva.printJSON need a object,'+typeof obj+' given';
			}

			return output;
		},

		z: 0
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

		// init data
		$.get('data.xml',eva.loadTestData,'xml');
	});

})(jQuery);