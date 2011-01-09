jQuery.noConflict();

(function($)
{
	window.eva = {

		/*  */

		/* common element */
		container: false,
		data: false,
		apiBaseUri: false,

		/* */
		pushResponse: function(responseTxt)
		{
			console.log(responseTxt);
		}
	};

	$(function(){

		eva.container = $('#eva-container');

		$.get('data.xml',function(data)
		{
			eva.data = $(data);
			eva.apiBaseUri = eva.data.find('apiBaseUri').text();

			eva.data.find('apiLi').each(function(apiIndex,apiLi)
			{
				var apiLi = $(apiLi);
				var path = apiLi.find('path').text();
				var url = eva.apiBaseUri + path;

				apiLi.find('condition').each(function(conditionIndex,condition)
				{
					var condition = $(condition);
					var data = {};
					condition.find('param').each(function(i,param)
					{
						var param = $(param);
						data[param.find('key').text()] = param.find('value').text();
					});

					$.ajax({
						type: type,
						url: url,
						data: data,
						dataType: 'json',
						success: function(data)
						{
							console.log(data);
						}
					});

					return;

					if( apiLi.find('method').text().toUpperCase() === 'POST' )
					{
						var _token = apiIndex + '-' + conditionIndex;
						var _senderIframe = $('<iframe name="sender-' + _token + '" class="s-h">').appendTo('body');
						var _catcherIframe = $('<iframe name="catcher-' + _token + '" class="s-h">').appendTo('body');
						var _form = $('<form action="'+url+'" method="POST" target="catcher-'+ _token +'">');

						condition.find('param').each(function(k,param)
						{
							var param = $(param);
							_form.append($('<input type="hidden" '+
								'name="'+param.find('key').text()+'" '+
								'value="'+param.find('value').text()+'" />'));
						});

						_catcherIframe.bind('load',function(e)
						{
							//parent.eva.pushResponse(this.contentWindow.document);
							top.console.log(e);
						});

						_catcherIframe.bind('error',function()
						{
							parent.console.log('wang');
						});

						_senderIframe.append(_form);
						//$('body').append(_senderIframe);
						_form.submit();
					}
					else
					{

					}
				});
			});

		},'xml');
	});

})(jQuery);