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

			eva.testDataLoaded = true;eva.run();

			//console.log(eva.apiEntries);
		},

		run: function()
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
						var $condition = eva.tpl.condition.clone().appendTo($methodBody);
						$condition.find('.eva-paramSerial').text(condition.toSource());

						var $params = $condition.find('.eva-params');

						$.each(condition, function(key, value)
						{
							eva.tpl.param.clone().
								find('.eva-key').text(key).
								end().find('.eva-value').text(value).
								end().appendTo($params);
						});

						var _ajaxCfg = $.extend({
							data: condition,
							beforeSend: function(xhr, settings)
							{
								$condition.removeClass('eva-success eva-error').addClass('eva-ing');
							},
							success: function(data, textStatus, xhr)
							{
								$condition.removeClass('eva-ing');

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

								$condition.find('.eva-response').text(xhr.responseText);
							},
							error: function(xhr, textStatus, errorThrown)
							{
								$condition.removeClass('eva-ing').addClass('eva-error').
									find('.eva-status').text( xhr.status + ' : ' + xhr.statusText );
							}
						}, baseAjaxCfg);

						$.ajax(_ajaxCfg);
					});
				});
			});
		},

		handleConditionError: function(statusCode,errorMessage){},

		expandCondition: function(condition)
		{
			condition.removeClass('eva-collapsed').addClass('eva-expanded');
		},

		collapseCondition: function(condition)
		{
			condition.removeClass('eva-expanded').addClass('eva-collapsed');
		},

		z: 0
	};

	$(function(){

		eva.container = $('#eva-container');
		eva.container.find('.eva-tpl').each(function(i,e)
		{
			var _tpl = $(this).removeClass('eva-tpl').removeClass('s-h').remove();
			eva.tpl[_tpl.attr('class').substr(4)] = _tpl;
		});

		/*eva.container.delegate('.eva-paramSerial','click',function(e)
		{
			e.preventDefault();
			var _condition = $(e.target).closest('.eva-condition');
			if( _condition.hasClass('eva-collapsed') )
			{
				eva.expandCondition(_condition);
			}
			else
			{
				eva.collapseCondition(_condition);
			}
		});*/

		// init data
		$.get('data.xml',eva.loadTestData,'xml');
	});

})(jQuery);