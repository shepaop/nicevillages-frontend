(function ($) {

  var clientsideValidationSelectBlur = function () {

    var $elt = $(this);

    // Si on utilise le script "custom-select"
    var $custom = $elt.parents('.custom-select');

    if ($custom.length) {
      if ($elt.hasClass('error')) {
        $custom.addClass('error');
      }
      else {
        $custom.removeClass('error');
      }
    }

  };

  // Define a Drupal behaviour with a custom name
  if (typeof Drupal !== 'undefined') {
    Drupal.behaviors.checkForm = {
      attach: function (context) {

        if (typeof Drupal.clientsideValidation === 'function') {

          Drupal.clientsideValidation.prototype.checkForm = function (message, formElt) {

            var parent = formElt.parents('.form-item:first');
            if (!parent.length) {
              parent = formElt.parent();
            }

            message.addClass('error-msg');
            message.addClass('type-' + formElt.attr('type'));

            parent.css('position', 'relative');

            $('.error-msg', parent).remove();
            var customSelect = $('.custom-select', parent);
            customSelect.addClass('error');

            if (formElt.is('select') && customSelect.length) {
              formElt.unbind('blur', clientsideValidationSelectBlur);
              formElt.bind('blur', clientsideValidationSelectBlur);
            }

            parent.append(message);
          };
        }
      }
    };
  }

})(jQuery);
