(function ($) {

  var bookList = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'book-list';
    var $targets = $('.' + cssClass, context);
    var $aside = $('aside.two-cols--aside');

    $targets.each(function () {
      var $target = $(this);

      if (typeof $target.data('init-' + cssClass) === 'undefined' && $aside.length) {
        $target.data('init-' + cssClass, true);

        $target.detach().show().appendTo($aside);
      }
    });
  };

  Drupal.behaviors.bookList = {
    attach: bookList
  };

})(jQuery);
