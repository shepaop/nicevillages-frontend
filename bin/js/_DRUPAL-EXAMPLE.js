// (function ($) {
//
//   var myDrupalBehavior = function (context, settings) {
//
//     if (typeof context === 'undefined') {
//       context = document;
//     }
//
//     var cssClass = 'block-example';
//     var $targets = $('.' + cssClass, context);
//     console.log('myDrupalBehavior:', $targets);
//
//     $targets.each(function () {
//       var $target = $(this);
//       if (!$target.data('init-' + cssClass)) {
//         $target.data('init-' + cssClass, true);
//       }
//     });
//   };
//
//   Drupal.behaviors.myDrupalBehavior = {
//     attach: myDrupalBehavior
//   };
//
// })(jQuery);
