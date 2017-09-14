(function ($) {

  /**
   * @typedef {object} rsAccordion_options
   *
   * @property {string} group='' - Règle CSS ciblant les éléments du DOM regroupant "trigger" et "section"
   * @property {string} trigger='' Règle CSS ciblant les éléments du DOM déclanchant une ouverture
   * @property {string} section='' Règle CSS ciblant les éléments du DOM à ouvrir
   * @property {string} startOpened='' Règle CSS filtrant les group à ouvrir par défaut
   * @property {string} easing='linear' Fonction d'easing pour l'animation d'ouverture (peut nécessiter jQuery.easing)
   * @property {number} duration=_duration|500 Durée de l'animation (en milisecondes)
   * @property {boolean} oneByOne=true Une seule section ouverte à la fois
   * @property {boolean} atLeastOne=false Empêcher la fermeture de la section ouverte (n'est pris en compte que si oneByOne est "true")
   * @property {string} expandedClass='expanded' Classe CSS ajoutée au groupe lorsque sa section est ouverte
   * @property {string} collapsedClass='collapsed' Classe CSS ajoutée au groupe lorsque sa section est fermée
   * @property {string} accordionEnabled='accordion-enabled' Classe CSS ajoutée au groupe lorsque le système d'accordéon est effectif sur celui-ci (un groupe peut exister, mais peut ne pas comporter de trigger ou de section, et donc ne pas répondre aux prérequis)
   * @property {boolean} scrollTo=false Ajuster le scroll vertical de la page au hautdu groupe à l'ouverture (nécessite le script "animatedScrollTo")
   * @property {string} tabsClass='accordion-tabs' Classe CSS des onglets
   * @property {boolean|function} tabs=false Générer un ul>li pour possibilité de piloter l'ouverture via onglets false(default) | function (si une fonction est déclarée, elle reçoit en paramètre le $(ul) pré-construit)
   * @property {function} onBeforeExpand=function(id,_self){} Callback déclenché avant l'ouverture
   * @property {function} onAfterExpand=function(id,_self){} Callback déclenché après l'ouverture
   * @property {function} onBeforeCollapse=function(id,_self){} Callback déclenché avant la fermeture
   * @property {function} onAfterCollapse=function(id,_self){} Callback déclenché après la fermeture
   * @property {object.<rsAccordion_options>} responsive={} Redéfinition des options pour le responsive (Mobile first). La clé de l'objet correspond à la largeur de l'écran à partir de laquelle on surcharge les options précédemment déclarées.
   *
   * */

  /**
   * @typedef {object} rsAccordion_output
   * @description Données renvoyées par rsAccordion
   *
   * @property {jQuery} $tabsHolder - UL accueillant les onglets
   * @property {jQuery} $groups - Stokage des groupes
   * @property {jQuery} $triggers - Stokage des triggers
   * @property {jQuery} $tabs - Stokage des groupes
   * @property {jQuery} $sections - Stokage des sections
   * @property {array} expandedStatus - Status expanded ou non des groupes
   *
   * */

  /**
   * @class external:"jQuery.fn".rsAccordion
   *
   * @param {rsAccordion_options} [cfg] - Options de configuration de l'accordéon
   *
   * @return {rsAccordion_output}
   */

  $.fn.extend({

    rsAccordion: function (cfg) {

      var defaults = {
        // Options
        group: '',
        trigger: '',
        section: '',
        startOpened: '',
        easing: 'linear',
        duration: typeof _duration !== 'undefined' ? _duration : 500,
        oneByOne: true,
        atLeastOne: false,
        expandedClass: 'expanded',
        collapsedClass: 'collapsed',
        accordionEnabled: 'accordion-enabled',
        scrollTo: false,
        tabsClass: 'accordion-tabs',
        tabs: false,
        responsive: {},

        /** Events **/
        onBeforeExpand: function () {
        },
        onAfterExpand: function () {
        },
        onBeforeCollapse: function () {
        },
        onAfterCollapse: function () {
        },

        // _resizeTimeout: Temps, en secondes, de recalcul du slider au resize
        _resizeTimeout: 0.25
      };

      // Stockage de l'objet
      var _self = this;

      // Configuration
      var options;

      // Stokage des éléments
      _self.$groups = [];
      _self.$triggers = [];
      _self.$tabs = [];
      _self.$sections = [];

      // Mémorisation des status (expanded ou non)
      _self.expandedStatus = [];

      // On déclare le setTimeout de l'application du resize
      var resize;

      // PRIVATE FUNCTIONS
      // Initialisation de l'accordéon
      var init = function () {

        // Détection du redimensionnement
        $(window).bind('resize', _self.reload);

        // Gestion des options de configuration
        options = cfgManager(defaults, cfg);

        // On récupère tous les groups ciblés
        var allGroups = $(options.group, _self);

        _self.$tabsHolder = $('<ul />', {class: options.tabsClass});

        // Gestions des items actifs par défaut ou non
        allGroups.filter(options.startOpened).each(function (i, group) {
          var $group = $(group);

          var $trigger = $(options.trigger, $group);
          var $section = $(options.section, $group);

          if ($trigger.length && $section.length) {
            // Si le groupe comporte un trigger et une section, on spécifie qu'il faudra l'étendre par défaut
            $group.data('accordion-section-to-expand-by-default', true);
          }

        });

        var filteredElts;
        if (options.startOpened !== '') {
          filteredElts = allGroups.filter(':not(' + options.startOpened + ')');
        }
        else {
          filteredElts = allGroups;
        }

        filteredElts.each(function (i, group) {
          var $group = $(group);

          var $trigger = $(options.trigger, $group);
          var $section = $(options.section, $group);

          if ($trigger.length && $section.length) {
            // Si le groupe comporte un trigger et une section, on spécifie qu'il ne faudra pas l'étendre par défaut
            $group.data('accordion-section-to-expand-by-default', false);
          }

        });

        // Déclaration des comportements
        var index = 0;
        allGroups.each(function (i, group) {

          var id = index;
          var $group = $(group);

          var $trigger = $(options.trigger, $group);
          var $section = $(options.section, $group);

          var $tab;
          if ($trigger.length) {
            $tab = $('<li />').html($trigger.html());
            _self.$tabsHolder.append($tab);
          }

          if ($trigger.length && $section.length) {

            _self.$groups[id] = $group;
            _self.$triggers[id] = $trigger;
            _self.$sections[id] = $section;
            _self.$tabs[id] = $tab;

            // On spécifie que le comportement de l'accordéon est actif sur ce group
            $group.addClass(options.accordionEnabled);

            // Application du repli ou de l'extension par défaut
            var accordionSectionToExpandByDefault = $group.data('accordion-section-to-expand-by-default');
            if (typeof accordionSectionToExpandByDefault === 'boolean') {
              // On neutralise les options d'animation pour l'initialisation
              var memorizeScrollTo = options.scrollTo;
              var memorizeDuration = options.duration;
              options.scrollTo = false;
              options.duration = 0;

              if (accordionSectionToExpandByDefault) {
                _self.expand(id);
              }
              else {
                _self.collapse(id);
              }

              // On rétablit les options
              options.scrollTo = memorizeScrollTo;
              options.duration = memorizeDuration;
            }

            var toggler = function () {
              // Si le groupe n'est pas ouvert
              if ($group.hasClass(options.collapsedClass)) {
                _self.expand(id);
              }
              // Si le groupe est déjà ouvert
              else if ($group.hasClass(options.expandedClass)) {
                if (
                  // Si on fonctionne "un par un" mais qu'on impose pas d'en avoir au moins 1 toujours ouvert
                (options.oneByOne && !options.atLeastOne) ||
                // Si on ne fonctionne pas "un par un"
                (!options.oneByOne)
                ) {
                  _self.collapse(id);
                }
              }

              return false;
            };

            $trigger.click(toggler);
            $tab.click(toggler);

            index++;
          }
        });

        // Gestion des onglets
        if (typeof options.tabs === 'function') {
          options.tabs(_self.$tabsHolder);
        }
        else if (typeof options.tabs === 'boolean' && options.tabs) {
          _self.prepend(_self.$tabsHolder);
        }
      };

      // Déclarer une section fermée
      var setGroupCollapsed = function (id) {

        _self.$groups[id].removeClass(options.expandedClass);
        _self.$groups[id].addClass(options.collapsedClass);
        _self.$tabs[id].removeClass(options.expandedClass);
        _self.$tabs[id].addClass(options.collapsedClass);
        _self.expandedStatus[id] = false;

      };

      // Déclarer une section ouverte
      var setGroupExpanded = function (id) {

        _self.$groups[id].removeClass(options.collapsedClass);
        _self.$groups[id].addClass(options.expandedClass);
        _self.$tabs[id].removeClass(options.collapsedClass);
        _self.$tabs[id].addClass(options.expandedClass);
        _self.expandedStatus[id] = true;

      };

      // PUBLIC FUNCTIONS
      /**
       * @method external:"jQuery.fn".rsAccordion.expand
       * @description Ouverture d'une section de l'accordéon
       *
       * @param {number} id - Index du groupe
       *
       */

      _self.expand = function (id) {

        if (!_self.$groups[id].hasClass(options.expandedClass)) {

          setGroupExpanded(id);

          if (options.oneByOne) {
            $.each(_self.$groups, function (i) {
              var index = i;
              if (index !== id) {
                _self.collapse(index);
              }
            });
          }

          options.onBeforeExpand(id, _self);
          _self.$sections[id].stop(true, true).slideDown({
            easing: options.easing,
            duration: options.duration,
            complete: function () {
              if (options.scrollTo) {
                animatedScrollTo(_self.$groups[id]);
              }
              options.onAfterExpand(id, _self);
            }
          });

        }

      };

      /**
       * @method external:"jQuery.fn".rsAccordion.collapse
       * @description Fermeture d'une section de l'accordéon
       *
       * @param {number} id - Index du groupe
       *
       */

      _self.collapse = function (id) {

        if (!_self.$groups[id].hasClass(options.collapsedClass)) {

          setGroupCollapsed(id);

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

      /**
       * @method external:"jQuery.fn".rsAccordion.reload
       * @description Re-initialiser l'accordéon
       *
       */

      _self.reload = function () {

        clearTimeout(resize);
        resize = setTimeout(function () {

          _self.destroy();
          init();

        }, (options._resizeTimeout * 1000));

      };

      /**
       * @method external:"jQuery.fn".rsAccordion.destroy
       * @description Détruire l'accordéon
       *
       */

      _self.destroy = function () {

        $.each(_self.$groups, function (i, group) {
          group.removeClass(options.expandedClass).removeClass(options.collapsedClass).removeClass(options.accordionEnabled);
        });
        $.each(_self.$triggers, function (i, trigger) {
          trigger.unbind('click');
        });
        $.each(_self.$sections, function (i, section) {
          section.show();
        });

        options = void 0;

        _self.$tabsHolder.remove();

        _self.$groups = [];
        _self.$triggers = [];
        _self.$tabs = [];
        _self.$sections = [];

        _self.expandedStatus = [];

        resize = void 0;

      };

      // Lancement de l'initialisation
      init();

      return _self;
    }

  });

})(jQuery);
