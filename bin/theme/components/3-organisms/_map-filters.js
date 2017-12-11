var mapFiltersParams = [{
  min: 'input[name="field_note_value[min]"]',
  max: 'input[name="field_note_value[max]"]',
  step: .5,
  suffix: '',
  format: function (value) {
    return value;
  }
}, {
  min: 'input[name="field_population_value[min]"]',
  max: 'input[name="field_population_value[max]"]',
  step: 500,
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
            $min.hide();
            $max.parents('.form-item:first').hide();

            // On récupère les valeurs
            var min = parseFloat($min[0].defaultValue);
            var max = parseFloat($max[0].defaultValue);

            if (!isNaN(min) && !isNaN(max)) {

              // Si on a pas encore récupéré les valeurs par défaut
              if (typeof mapFiltersParams[i].valMin === 'undefined' && typeof mapFiltersParams[i].valMax === 'undefined') {
                mapFiltersParams[i].valMin = min;
                mapFiltersParams[i].valMax = max;
              }

              // Création des éléments
              var $sliderWrapper = $('<div />', {
                class: cssClass + '--slider-wrapper'
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
              $min.before(
                $sliderWrapper.append(
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
                step: mapFiltersParams[i].step,
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
