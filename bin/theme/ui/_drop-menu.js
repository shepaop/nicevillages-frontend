(function ($) {

  /**
   * @typedef {object} dropMenu_options_contexes
   *
   * @property {string} group='' - Règles CSS des groupes recherchés contenant triger + section
   * @property {string} trigger='' - Règles CSS du trigger ciblé à partir du groupe déclenchant l'ouverture de la section
   * @property {string} section='' - Règles CSS de la section ciblé à partir du groupe
   *
   * */

  /**
   * @typedef {object} dropMenu_options
   *
   * @property {array.<dropMenu_options_contexes>} contexes={} - Contextes distincts à partir desquels on va chercher les 3 éléments du DOM
   * @property {string} expandedClass='expanded' - CSS Classe attribuée au groupe quand le menu est ouvert
   * @property {string} collapsedClass='collapsed' - CSS Classe attribuée au groupe quand le menu est fermé
   * @property {string} enabledClass='drop-menu--enabled' - CSS Classe attribuée au groupe quand les 3 éléments du DOM ont été identifiés et que le comportement "dropMenu" est actif
   * @property {string} overlayClass='drop-menu--overlay' - CSS Classe de l'overlay
   * @property {function} onBeforeExpand=function(id,_self){} - Callback déclenché avant l'ouverture
   * @property {function} onAfterExpand=function(){id,_self} - Callback déclenché après l'ouverture
   * @property {function} onBeforeCollapse=function(){id,_self} - Callback déclenché avant la fermeture
   * @property {function} onAfterCollapse=function(){id,_self} - Callback déclenché après la fermeture
   *
   * */

  /**
   * @typedef {object} dropMenu_output
   * @description Données renvoyées par rsAccordion
   *
   * @property {jQuery} $groups - Stokage des groupes
   * @property {jQuery} $triggers - Stokage des triggers
   * @property {jQuery} $sections - Stokage des sections
   * @property {array} expandedStatus - Mémorisation des status (expanded ou non)
   * @property {array} $overlay - Overlay de fond
   *
   * */

  /**
   * @class external:"jQuery.fn".dropMenu
   *
   * @param {dropMenu_options} [cfg]
   *
   * @return {dropMenu_output}
   */

  $.fn.extend({

    dropMenu: function (cfg) {

      // Sécurité si cfg n'a pas été spécifié
      if (typeof cfg !== 'object') {
        cfg = {};
      }

      // Variables par défaut
      var defaults = {
        // Options
        contexes: [{
          group: '',
          trigger: '',
          section: ''
        }],
        expandedClass: 'expanded',
        collapsedClass: 'collapsed',
        enabledClass: 'drop-menu--enabled',
        overlayClass: 'drop-menu--overlay',
        zIndex: 19,
        easing: 'linear',
        duration: typeof _duration !== 'undefined' ? _duration : 500,

        /** Events **/
        onBeforeExpand: function () {
        },
        onAfterExpand: function () {
        },
        onBeforeCollapse: function () {
        },
        onAfterCollapse: function () {
        }
      };

      // Stockage de l'objet
      var _self = this;

      // Configuration
      var options;

      // Stokage des éléments
      _self.$groups = [];
      _self.$triggers = [];
      _self.$sections = [];

      // Mémorisation des status (expanded ou non)
      _self.expandedStatus = [];

      // Body
      var $body = $('body');

      // PRIVATE FUNCTIONS
      // Initialisation du drop menu
      var init = function () {


        // Gestion des options de configuration
        options = cfgManager(defaults, cfg);

        // Construction de l'overlay
        _self.$overlay = $('<div />', {
          class: options.overlayClass,
          style: 'z-index:' + options.zIndex + ';'
        });

        // On parcours tous les contextes
        var index = 0;
        $.each(options.contexes, function (i, contextCfg) {

          // On récupère tous les groups ciblés
          var allGroups = $(contextCfg.group, _self);

          // Déclaration des comportements
          allGroups.each(function (j, group) {

            var id = index;
            var $group = $(group);

            var $trigger = $(contextCfg.trigger, $group);
            var $section = $(contextCfg.section, $group);

            if ($trigger.length && $section.length) {

              _self.$groups[id] = $group;
              _self.$triggers[id] = $trigger;
              _self.$sections[id] = $section;
              _self.expandedStatus[id] = false;

              // On spécifie que le comportement de l'accordéon est actif sur ce group
              $group.addClass(options.enabledClass).addClass(options.collapsedClass);
              $section.hide();

              var toggler = function () {

                // Si le groupe n'est pas ouvert
                if ($group.hasClass(options.collapsedClass)) {
                  _self.expand(id);
                }
                // Si le groupe est déjà ouvert
                else if ($group.hasClass(options.expandedClass)) {
                  _self.collapse(id);
                }

                return false;
              };

              $trigger.click(toggler);

              index++;
            }
          });

        });

      };

      // Déclarer une section fermée
      var setGroupCollapsed = function (id) {

        _self.$groups[id].removeClass(options.expandedClass);
        _self.$groups[id].addClass(options.collapsedClass);
        _self.expandedStatus[id] = false;

      };

      // Déclarer une section ouverte
      var setGroupExpanded = function (id) {

        _self.$groups[id].removeClass(options.collapsedClass);
        _self.$groups[id].addClass(options.expandedClass);
        _self.expandedStatus[id] = true;

      };

      // PUBLIC FUNCTIONS

      /**
       * @method external:"jQuery.fn".dropMenu.expand
       * @description Ouverture d'une section du menu
       *
       * @param {number} id - ID du groupe à ouvrir
       */

      _self.expand = function (id) {

        if (!_self.$groups[id].hasClass(options.expandedClass)) {

          $.each(_self.expandedStatus, function (i, status) {
            if (status) {
              _self.collapse(i);
            }
          });

          setGroupExpanded(id);

          _self.$overlay.bind('click', function () {
            _self.collapse(id);
          });
          $body.append(_self.$overlay);

          if (_self.css('position') === 'static') {
            _self.css({position: 'relative'});
          }
          _self.css({'z-index': (options.zIndex + 1)});
          options.onBeforeExpand(id, _self);
          _self.$sections[id].stop(true, true).slideDown({
            easing: options.easing,
            duration: options.duration,
            complete: function () {
              options.onAfterExpand(id, _self);
            }
          });

        }

      };

      /**
       * @method external:"jQuery.fn".dropMenu.collapse
       * @description Fermeture d'un élément de menu
       *
       * @param {number} id - ID du groupe à fermer
       */

      _self.collapse = function (id) {

        if (!_self.$groups[id].hasClass(options.collapsedClass)) {

          setGroupCollapsed(id);

          _self.$overlay.unbind('click');
          _self.$overlay.detach();

          _self.removeAttr('style');
          options.onBeforeCollapse(id, _self);
          _self.$sections[id].stop(true, true).slideUp({
            easing: options.easing,
            duration: options.duration,
            complete: function () {
              options.onAfterCollapse(id, _self);
            }
          });

        }

      };

      // Lancement de l'initialisation
      init();

      return _self;
    }

  });

})(jQuery);
