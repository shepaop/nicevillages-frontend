var mapFiltersParams = [{
  min: 'input[data-drupal-selector="edit-field-note-value-min"]',
  max: 'input[data-drupal-selector="edit-field-note-value-max"]',
  suffix: '',
  format: function (value) {
    return value;
  }
}, {
  min: 'input[data-drupal-selector="edit-field-population-value-min"]',
  max: 'input[data-drupal-selector="edit-field-population-value-max"]',
  suffix: '',
  format: function (value) {
    return value;
  }
}];

(function ($) {

  var mapFilters = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'map-filters';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);
      var $form = $('.' + cssClass + '--form form', $target);

      if (typeof $form.data('init-' + cssClass) === 'undefined') {
        $form.data('init-' + cssClass, true);

        $.each(mapFiltersParams, function (i, slider) {

          // On récupère les éléments du DOM ciblés
          var $min = $(slider.min, $form);
          var $max = $(slider.max, $form);

          if ($min.length && $max.length) {

            // On cache les éléments
            $min.parents('.form-item:first').hide();
            $max.parents('.form-item:first').hide();

            // On recherche le premier parent
            var $firstParent = $min.parents('.form-item:first');

            // On récupère les valeurs
            var min = parseFloat($min.val());
            var max = parseFloat($max.val());

            if (!isNaN(min) && !isNaN(max)) {

              // Si on a pas encore récupéré les valeurs par défaut
              if (typeof mapFiltersParams[i].valMin === 'undefined' && typeof mapFiltersParams[i].valMax === 'undefined') {
                mapFiltersParams[i].valMin = min;
                mapFiltersParams[i].valMax = max;
              }

              // Création des éléments
              var $formItem = $('<div />', {
                class: 'form-item'
              });
              var $holder = $('<div />', {
                class: ''
              });
              var $rangeDatas = $('<div />', {
                class: cssClass + '--datas'
              });
              var $left = $('<div />', {
                class: cssClass + '--datas-left'
              }).text(
                slider.format(min) + slider.suffix
              );
              var $right = $('<div />', {
                class: cssClass + '--datas-right'
              }).text(
                slider.format(max) + slider.suffix
              );

              // Insertion dans le DOM HTML
              $firstParent.before(
                $formItem.append(
                  $holder
                ).append(
                  $rangeDatas.append(
                    $left
                  ).append(
                    $right
                  )
                )
              );

              // Slider jQuery UI
              $holder.slider({
                range: true,
                animate: true,
                min: mapFiltersParams[i].valMin,
                max: mapFiltersParams[i].valMax,
                values: [min, max],
                slide: function (event, ui) {

                  var $valueTarget = $left;
                  if (ui.value !== ui.values[0]) {
                    $valueTarget = $right;
                    $max.val(ui.values[1]);
                  }
                  else {
                    $min.val(ui.values[0]);
                  }
                  $valueTarget.text(
                    slider.format(ui.value) + slider.suffix
                  );
                }
              });

              console.log(min, max);
            }
          }
        });
      }
    });
  };

  Drupal.behaviors.mapFilters = {
    attach: mapFilters
  };

})(jQuery);
