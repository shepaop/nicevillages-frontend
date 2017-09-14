var Greybox;

(function ($) {

  /**
   * @typedef Greybox_options
   * @description Options de configuration de Greybox
   *
   * @property {string} prefix=greybox - Prefix CSS de la greybox
   * @property {number} duration=_duration|500 - Durée de l'animation (en milisecondes)
   * @property {number} top=50 - Offset top par rapport au bord haut du navigateur
   * @property {string} close='' - Contenu HTML du div.close
   * @property {string} cssClass='' - Class CSS additionnelle
   * @property {string} title='' - Titre de la greybox
   * @property {function} onBeforeOpen=function(){} - Callback avant l'ouverture de la greybox
   * @property {function} onAfterOpen=function(){} - Callback après l'ouverture de la greybox
   * @property {function} onBeforeClose=function(){} - Callback avant la fermeture de la greybox
   * @property {function} onAfterClose=function(){} - Callback après la fermeture de la greybox
   */

  /**
   * @typedef Greybox_output
   * @description Données renvoyées par la classe Greybox
   *
   * @property {object} config - Configuration en cours
   * @property {jQuery} $greybox - DOM elt
   * @property {object} $overlay - DOM elt
   * @property {object} $container - DOM elt
   * @property {object} $content - DOM elt
   * @property {object} $title - DOM elt
   * @property {object} $close - DOM elt
   * @property {object} $iframe - DOM elt
   * @property {object} $youtube - DOM elt
   * @property {object} $dailymotion - DOM elt
   * @property {object} $vimeo - DOM elt
   * @property {object} $image - DOM elt
   */

  /**
   * @class Greybox
   * @description Système de gestion de popin
   *
   * @param {Greybox_options} [cfg] - Options de configuration
   *
   * @return {jQuery} this
   */

  Greybox = function (cfg) {

    // Sécurité si cfg n'a pas été spécifié
    if (typeof cfg !== 'object') {
      cfg = {};
    }

    // Variables par défaut
    var defaults = {
      prefix: 'greybox',
      duration: (typeof _duration === 'number') ? _duration : 500,
      close: '',
      title: '',
      cssClass: '',

      /** Events **/
      onBeforeOpen: function () {
      },
      onAfterOpen: function () {
      },
      onBeforeClose: function () {
      },
      onAfterClose: function () {
      }
    };

    // Stockage de l'objet
    var _self = this;

    // Configuration
    _self.config = {};

    // Mémorisation des éléments du DOM
    var $document = $(document);

    // Déclaration des éléments spéciaux
    _self.$greybox = null;
    _self.$overlay = null;
    _self.$container = null;
    _self.$content = null;
    _self.$title = null;
    _self.$close = null;
    _self.$iframe = null;
    _self.$youtube = null;
    _self.$dailymotion = null;
    _self.$vimeo = null;
    _self.$image = null;

    // On déclare le setTimeout de chargement d'image
    var imageLoaded;

    // On déclare le setTimeout de l'application du resize
    var resize;

    // Temps d'attente après le resize avant de déclancher la fonction (éviter de déclencher à chaque changement de taille)
    var resizeTimeout = 0.25;

    // Largeur du viewport précédemment calculé
    var viewportWidth = null;

    // PRIVATE FUNCTIONS
    // Initialisation de la Greybox
    var init = function () {

      viewportWidth = getViewportWidth();

      // Détection du redimensionnement
      $(window).bind('resize', onResize);

      // Création des éléments du DOM
      _self.$greybox = $('<div />').hide();
      _self.$overlay = $('<div />').hide();
      _self.$container = $('<div />').hide();
      _self.$content = $('<div />');
      _self.$title = $('<div />');
      _self.$close = $('<div />');

      _self.$iframe = $('<iframe class="" src="" border="0" frameborder="0" width="100%" height="" allowTransparency="true" allowfullscreen></iframe>');
      _self.$youtube = $('<iframe class="" style="width:100%;" width="100%" height="" src="" frameborder="0" allowfullscreen></iframe>');
      _self.$dailymotion = $('<iframe class="" style="width:100%;" frameborder="0" width="100%" height="" src="" allowTransparency="true" allowfullscreen></iframe>');
      _self.$vimeo = $('<iframe class="" style="width:100%;" src="" width="100%" height="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

      // Appliquer la configuration demandée
      _self.setConfig(cfg);

      // Structuration HTML
      _self.$greybox.append(_self.$overlay);
      _self.$container.append(_self.$title);
      _self.$container.append(_self.$content);
      _self.$container.append(_self.$close);
      _self.$greybox.append(_self.$container);

      // Gestion des évènements
      _self.$close.click(function () {
        _self.close();
      });
      _self.$overlay.click(function () {
        _self.close();
      });

    };

    // Ajuster le margin-top si la greybox est en position absolute
    var adjustTopIfAbsolute = function () {

      if (_self.$container.css('position') === 'absolute') {
        _self.$container.css({'margin-top': $document.scrollTop()});
      }
      else {
        _self.$container.css({'margin-top': 'inherit'});
      }

    };

    // Fonction à exécuter au resize du navigateur (ou orientation-changed)
    var onResize = function () {

      clearTimeout(resize);
      resize = setTimeout(function () {

        var instantViewport = getViewportWidth();
        if (instantViewport !== viewportWidth) {
          // Si la largeur a changé, on mémorise la nouvelle largeur et on ajuste le margin-top de la greybox
          viewportWidth = instantViewport;
          adjustTopIfAbsolute();
        }

      }, (resizeTimeout * 1000));

    };

    // PUBLIC FUNCTIONS

    /**
     * @method Greybox.setConfig
     * @description Reprends la configuration par défaut et applique la nouvelle
     *
     * @param {Greybox_options} config - Config
     *
     * @return {Greybox_options}
     */

    _self.setConfig = function (config) {

      _self.config = cfgManager(defaults, config);

      _self.setPrefix(_self.config.prefix);
      _self.setClass(_self.config.cssClass);
      _self.setCloseText(_self.config.close);
      _self.setTitle(_self.config.title);

      return _self.config;
    };

    /**
     * @method Greybox.getConfig
     * @description Retourne la configuration en cours
     *
     * @return {Greybox_options}
     */

    _self.getConfig = function () {

      return _self.config;
    };

    /**
     * @method Greybox.open
     * @description Ouvrir la greybox
     *
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.open = function (callback) {

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      // Insertion dans le DOM
      $('body').append(_self.$greybox);

      _self.config.onBeforeOpen(_self);

      // Préparation des éléments
      _self.$container.hide();
      _self.$overlay.hide();
      _self.$greybox.show();

      adjustTopIfAbsolute();

      // Animation
      _self.$overlay.stop(true, true).fadeIn({
        duration: _self.config.duration / 2,
        complete: function () {

          _self.$container.stop(true, true).fadeIn({
            duration: _self.config.duration / 2,
            complete: function () {

              // Complete
              callback();
              _self.config.onAfterOpen(_self);

            }
          });

        }
      });

      return _self;
    };

    /**
     * @method Greybox.close
     * @description Fermer la greybox
     *
     * @param {function} [callback] - Callback
     *
     * @return {this}
     */

    _self.close = function (callback) {

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      _self.config.onBeforeClose(_self);

      // Animation
      _self.$container.stop(true, true).fadeOut({
        duration: _self.config.duration / 2,
        complete: function () {

          _self.$overlay.stop(true, true).fadeOut({
            duration: _self.config.duration / 2,
            complete: function () {

              // Complete
              _self.$greybox.hide().detach();
              _self.config.onAfterClose(_self);
              callback();
              _self.$content.empty();

            }
          });

        }
      });

      return _self;
    };

    /**
     * @method Greybox.setPrefix
     * @description Modifier le prefix CSS de la greybox
     *
     * @return {this}
     */

    _self.setPrefix = function (prefix) {

      _self.$greybox.attr('class', prefix);
      _self.$overlay.attr('class', prefix + '--overlay');
      _self.$container.attr('class', prefix + '--container');
      _self.$content.attr('class', prefix + '--content clearfix');
      _self.$title.attr('class', prefix + '--title');
      _self.$close.attr('class', prefix + '--close');
      _self.$iframe.attr('class', prefix + '--iframe');
      _self.$youtube.attr('class', prefix + '--iframe ' + prefix + '--youtube');
      _self.$dailymotion.attr('class', prefix + '--iframe ' + prefix + '--dailymotion');
      _self.$vimeo.attr('class', prefix + '--iframe ' + prefix + '--vimeo');

      return _self;
    };

    /**
     * @method Greybox.setCloseText
     * @description Insérer un contenu texte (ou html) dans le bouton de fermeture
     *
     * @param {string} html - Contenu
     *
     * @return {this}
     */

    _self.setCloseText = function (html) {

      _self.$close.html(html);

      return _self;
    };

    /**
     * @method Greybox.setClass
     * @description Applique une classe CSS à $greybox
     *
     * @param {string} cssClass - CSS Class
     *
     * @return {this}
     */

    _self.setClass = function (cssClass) {

      _self.$greybox.addClass(cssClass);

      return _self;
    };

    /**
     * @method Greybox.unsetClass
     * @description Supprime une classe CSS à $greybox
     *
     * @param {string} cssClass - CSS Class
     *
     * @return {this}
     */

    _self.unsetClass = function (cssClass) {

      _self.$greybox.removeClass(cssClass);

      return _self;
    };

    /**
     * @method Greybox.setLoading
     * @description Indique le fait que la greybox est en train de charger
     *
     * @return {this}
     */

    _self.setLoading = function () {

      _self.$greybox.addClass(_self.config.prefix + '--loading');

      return _self;
    };

    /**
     * @method Greybox.unsetLoading
     * @description Supprimer l'indicateur de chargement de la greybox
     *
     * @return {this}
     */

    _self.unsetLoading = function () {

      _self.$greybox.removeClass(_self.config.prefix + '--loading');

      return _self;
    };

    /**
     * @method Greybox.html
     * @description Insérer de l'HTML dans la greybox
     *
     * @param {string} html - HTML content
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.html = function (html, callback) {

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      _self.$content.prepend(html);
      _self.open(callback);

      return _self;
    };

    /**
     * @method Greybox.setTitle
     * @description Insérer un titre dans la greybox
     *
     * @param {string} html - Title content
     *
     * @return {this}
     */

    _self.setTitle = function (html) {

      if (html === '') {
        _self.$title.empty().detach();
      }
      else {
        _self.$title.html(html).insertBefore(_self.$content);
      }

      return _self;
    };

    /**
     * @method Greybox.iframe
     * @description Afficher une iframe
     *
     * @param {string} src - URL de l'iframe
     * @param {number} height - Hauteur de l'iframe
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.iframe = function (src, height, callback) {

      if (typeof height === 'undefined' || height === null) {
        height = 400;
      }

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      _self.$iframe.detach();
      _self.$iframe.attr({
        src: src,
        height: height
      });
      _self.$content.prepend(_self.$iframe);
      _self.open(callback);

      return _self;
    };

    /**
     * @method Greybox.youtube
     * @description Afficher une vidéo Youtube
     *
     * @param {string} src - Code de la vidéo Youtube
     * @param {number} height - Hauteur de la vidéo
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.youtube = function (src, height, callback) {

      if (typeof height === 'undefined' || height === null) {
        height = 400;
      }

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      src = '//www.youtube.com/embed/' + src + '?rel=0&wmode=transparent';
      _self.$youtube.detach();
      _self.$youtube.attr({
        src: src,
        height: height
      });
      _self.$content.prepend(_self.$youtube);
      _self.open(callback);

      return _self;
    };

    /**
     * @method Greybox.dailymotion
     * @description Afficher une vidéo dailymotion
     *
     * @param {string} src - Code de la vidéo dailymotion
     * @param {number} height - Hauteur de la vidéo
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.dailymotion = function (src, height, callback) {

      if (typeof height === 'undefined' || height === null) {
        height = 400;
      }

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      src = '//www.dailymotion.com/embed/video/' + src;
      _self.$dailymotion.detach();
      _self.$dailymotion.attr({
        src: src,
        height: height
      });
      _self.$content.prepend(_self.$dailymotion);
      _self.open(callback);

      return _self;
    };

    /**
     * @method Greybox.vimeo
     * @description Afficher une vidéo vimeo
     *
     * @param {string} src - Code de la vidéo vimeo
     * @param {number} height - Hauteur de la vidéo
     * @param {function} callback - Callback
     *
     * @return {this}
     */

    _self.vimeo = function (src, height, callback) {

      if (typeof height === 'undefined' || height === null) {
        height = 400;
      }

      if (typeof callback === 'undefined') {
        callback = function () {
        };
      }

      src = '//player.vimeo.com/video/' + src;
      _self.$vimeo.detach();
      _self.$vimeo.attr({
        src: src,
        height: height
      });
      _self.$content.prepend(_self.$vimeo);
      _self.open(callback);

      return _self;
    };

    /**
     * @method Greybox.ajaxGet
     * @description Charger du contenu GET en AJAX
     *
     * @param {string} url - URL de la requête
     * @param {number} [params] - Paramètres à passer
     * @param {function} [callback] - Callback à la fin du chargement ajax
     *
     * @return {this}
     */

    _self.ajaxGet = function (url, params, callback) {

      _self.open().setLoading();

      var jqParams = {
        type: 'get',
        url: url,
        complete: function (data) {

          _self.unsetLoading();
          _self.$content.prepend(data.responseText);

          if (typeof callback === 'function') {
            callback(_self, url, data);
          }
        }
      };

      if (typeof params === 'object') {
        jqParams.data = params;
      }

      $.ajax(jqParams);

      return _self;
    };

    /**
     * @method Greybox.ajaxPost
     * @description Charger du contenu POST en AJAX
     *
     * @param {string} url - URL de la requête
     * @param {number} [params] - Paramètres à passer
     * @param {function} [callback] - Callback à la fin du chargement ajax
     *
     * @return {this}
     */

    _self.ajaxPost = function (url, params, callback) {

      _self.open().setLoading();

      var jqParams = {
        type: 'post',
        url: url,
        complete: function (data) {

          _self.unsetLoading();
          _self.$content.prepend(data.responseText);

          if (typeof callback === 'function') {
            callback(_self, url, data);
          }
        }
      };

      if (typeof params === 'object') {
        jqParams.data = params;
      }

      $.ajax(jqParams);

      return _self;
    };

    /**
     * @method Greybox.image
     * @description Charger une image
     *
     * @param {string} src - URL de l'image
     * @param {function} [callback] - Callback à la fin du chargement ajax
     *
     * @return {this}
     */

    _self.image = function (src, callback) {

      if (typeof imageLoaded !== 'undefined') {
        clearInterval(imageLoaded);
      }

      _self.open().setLoading();

      if (_self.$image !== null) {
        _self.$image.remove();
      }

      _self.$image = $('<img />', {
        src: '' + src,
        alt: '',
        class: _self.config.prefix + '--image'
      }).hide();
      _self.$content.prepend(_self.$image);

      // Gestion du complete
      var complete = function () {
        _self.$image.fadeIn(_self.config.duration);
      };
      if (typeof callback === 'function') {
        complete = callback;
      }

      imageLoaded = setInterval(function () {

        if (_self.$image[0].complete) {

          clearInterval(imageLoaded);

          _self.unsetLoading();
          complete(_self, _self.$image, src);
        }

      }, 50);

      return _self;
    };

    // Lancement de l'initialisation
    init();

    return _self;

  };

})(jQuery);
