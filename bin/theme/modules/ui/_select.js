(function ($) {

  $.fn.extend({

    /**
     * @function external:"jQuery.fn".customizeSelect
     * @description Customiser la partie non-déroulée d'un select
     *
     * @param {string} [cssClass] - Classe CSS additionnelle
     */

    customizeSelect: function (cssClass) {

      var _self = this;

      var getCurrentValue = function () {
        var value = _self.val();
        var option = $('option[value="' + value + '"]:last', _self);

        return $.trim(option.text());
      };

      if (_self.is('select') && !_self.data('is-already-customized')) {

        // On spécifie que le select a été customisé
        _self.data('is-already-customized', true);

        // Eléments du faux select
        var $select = $('<span />', {class: 'custom-select'});
        if (typeof cssClass === 'string') {
          $select.attr('class', 'custom-select ' + cssClass);
        }
        var $selectTxtOverflow = $('<span />', {class: 'text'});
        $selectTxtOverflow.text(getCurrentValue());
        $select.append($selectTxtOverflow);

        // UI
        _self.focus(function () {
          $select.addClass('focus');
        });

        _self.blur(function () {
          $select.removeClass('focus');
        });

        _self.change(function () {
          $selectTxtOverflow.text(getCurrentValue());
        });

        // Manipulation du DOM HTML
        _self.after($select);
        _self.detach().appendTo($select);

        // Positionnement du vrai select
        _self.css({
          'display': 'block',
          'width': '100%',
          'height': '100%',
          'position': 'absolute',
          'left': '0',
          'top': '0',
          'margin': '0',
          'padding': '0',
          'z-index': '1',
          'opacity': 0
        });

        return $select;
      }
      else {
        return _self.parents('.custom-select:first');
      }
    }
  });

})(jQuery);
