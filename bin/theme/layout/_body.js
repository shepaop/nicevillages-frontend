(function ($) {

  var bodySystemMessages = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'messages';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        $target.hide();

        var gbMessages = new Greybox();
        gbMessages.setClass('center').html(
          '<div class="' + $target.attr('class') + '">' + $target.html() + '</div>'
        );
      }
    });
  };

  Drupal.behaviors.bodySystemMessages = {
    attach: bodySystemMessages
  };

})(jQuery);
