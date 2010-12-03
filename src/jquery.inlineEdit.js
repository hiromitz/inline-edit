/**
 * Inline Edit - Plugin for jQuery
 * 
 * click and edit inline plugin for jQuery.
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js
 * 
 * TODO:
 * - type of select/radio/check shold have label and value
 * - make class to be easy to edit
 * 
 */
;(function($) {

var PROP_NAME = 'inlineedit',
	fn = function(){};

$.fn.inlineEdit = function(op) {
	// defaults
	op = $.extend({
		url: 'post.php',
		method: 'post',
		save: fn,
		cancel: fn,
		complete: fn,
		success: fn,
		error: fn,
		type: 'text', // text, textarea, select, radio, check
		prefix: 'editable-',
		buttons: {
			save: 'save',
			cancel: 'cancel'
		},
		select: [] // when type is select/radio/check [value1, value2, ...]
	}, op);
	
	return this.each(function() {
		var $el = $(this);
		// add hover class
		$el.hover(function() {
			$el.addClass(op.prefix + 'hover');
		}, function() {
			$el.removeClass(op.prefix + 'hover');
		});
		
		// add click action
		$el.click(function() {
			var $form = $('<form>'),
				val = $el.text(),
				rel = $el.attr('rel');
			
			switch(op.type) {
				// text area
				case 'textarea':
					$form.append($('<textarea>', {
						name: rel
					}).val(val));
					break;
				
				// select button
				case 'select':
					var $sel = $('<select>', {
						name: rel
					});
					for(var i=0, l = op.select.length; i<l; i++) {
						$sel.append($('<option>', {
							value: op.select[i]
						}).text(op.select[i]));
					}
					$form.append($sel.val(val));
					break;
				
				// radio button
				case 'radio':
					for(var i=0, l = op.select.length; i<l; i++) {
						$form.append($('<input>', {
							name: rel,
							id: rel + i,
							type: 'radio',
							value: op.select[i],
							checked: (val == op.select[i])
						}));
						$form.append($('<label for="' + rel + i + '">').text(op.select[i]));
					}
					break;
				
				// checkbox
				case 'check':
					for(var i=0, l = op.select.length; i<l; i++) {
						$form.append($('<input>', {
							name: rel + '[]',
							id: rel + i,
							type: 'checkbox',
							value: op.select[i],
							checked: (val == op.select[i])
						}));
						$form.append($('<label for="' + rel + i + '">').text(op.select[i]));
					}
					break;
				
				// text box
				case 'text':
				default:
					$form.append($('<input>', {
						type: 'text',
						name: rel,
						value: val
					}));
					break;
			}
			
			$form.children().wrapAll('<div class="' + op.prefix + 'wrap">').end()
			// add save button
			.append($('<input>', {
				type: 'button',
				value: op.buttons.save,
				class: op.prefix + 'save'
			}).click(function() {
				op.save.call($el);
				// post data
				$.ajax({
					url: op.url,
					type: op.method,
					data: $form.serialize(),
					complete: function() {
						op.complete.call($el, arguments);
					},
					success: function() {
						op.success.call($el, arguments);
						$form.remove();
						$el.text($form.serializeArray()[0].value).show();
					},
					error: function() {
						op.error.call($el, arguments);
						$form.remove();
						$el.show();
					}
				});
			}))
			// add cancel button
			.append($('<input>', {
				type: 'button',
				value: op.buttons.cancel,
				class: op.prefix + 'cancel'
			}).click(function() {
				op.cancel.call($el);
				$form.remove();
				$el.show();
			}))
			.submit(function() {
				return false;
			});
			
			$el.hide().after($form);
		});
	});
};
})(jQuery);
