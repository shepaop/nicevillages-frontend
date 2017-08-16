var BlockWall;

(function ($) {

  /**
   * @typedef {object} BlockWall_options
   * @description Options de configuration possible de la classe BlockWall
   *
   * @property {boolean} bypass=false - Bypasser le script
   * @property {String} wall='' - Règle CSS désignant les éléments du DOM regroupant des blocks à ordonner
   * @property {String} block='' - Règle CSS désignant les blocks à ordonner
   * @property {String} block=%|px - Type de dimensionnement des blocks
   * @property {Number} gutterX=0 - Espace en X entre les colonnes
   * @property {Number} gutterY=0 - Espace en Y entre les blocks
   * @property {Function} onComplete - Fonction JS à exécuter après l'exécution du script
   * @property {object.<BlockWall_options>} responsive={} Redéfinition des options pour le responsive (Mobile first). La clé de l'objet correspond à la largeur de l'écran à partir de laquelle on surcharge les options précédemment déclarées.
   *
   * */

  /**
   * @typedef {object} BlockWall_output
   * @description Objet renvoyé par le script BlockWall
   *
   * @property {jQuery} wall - Elément jQuery du DOM wrappant les blocks
   * @property {jQuery} blocks - Eléments jQuery du DOM contenant tous les blocks
   * @property {Number} wallSizeX - Largeur du wall
   * @property {Number} wallSizeY - Hauteur du wall
   *
   * */

  /**
   * @class BlockWall
   *
   * @param {BlockWall_options} [cfg] Options de configuration du BlockWall
   *
   * @return {BlockWall_output}
   */

  BlockWall = function (cfg) {

    var defaults = {
      bypass: false,
      wall: '',
      block: '',
      unit: '%',
      gutterX: 0,
      gutterY: 0,
      onComplete: function () {
      }
    };

    var _self = this;
    var options;

    var $window = $(window);
    var viewportWidth;

    // Points d'ancrages potentiels
    var anchors;

    // Agencement des blocks dans l'espace
    var layout;

    var init = function () {

      options = {};
      anchors = {};
      layout = [];
      viewportWidth = getViewportWidth();

      // Gestion des options de configuration
      options = cfgManager(defaults, cfg);

      if (!options.bypass) {

        $window.unbind('resize', _self.reload);
        $window.bind('resize', _self.reload);

        _self.wall = $(options.wall);

        // Si le mur a été trouvé
        if (_self.wall.length) {

          _self.wallSizeX = _self.wall.innerWidth();
          _self.blocks = $(options.blocks, _self.wall);

          if (_self.wall.css('position') === 'static') {
            _self.wall.css('position', 'relative');
          }

          _self.blocks.each(function () {

            var $block = $(this);
            if (options.unit === '%') {
              findPlace($block, 100, $block.widthPercentage(), $block.outerHeight());
            }
            else if (options.unit === 'px') {
              findPlace($block, _self.wallSizeX, $block.outerWidth(), $block.outerHeight());
            }
          });

          _self.wall.height(_self.wallSizeY);

          options.onComplete();
        }
      }

    };

    var findPlace = function ($block, spaceX, width, height) {

      var x = 0;
      var y = 0;

      width += options.gutterX;
      height += options.gutterY;

      var found = false;
      $.each(anchors, function (key, anchor) {

        if (!found) {

          var goodToGo = true;

          // On prépare les infos du block, comme si il était positionné à l'ancre concernée
          var blockTestDatas = {
            xmin: anchor.x,
            xmax: (anchor.x + width),
            ymin: anchor.y,
            ymax: (anchor.y + height)
          };

          // On vérifie que, pour l'ancre concernée,  le block ne déborde pas du mur
          if (Math.round((blockTestDatas.xmax - options.gutterX)) > _self.wallSizeX) {

            goodToGo = false;

          }
          else {

            // Sinon, on vérifie que, pour l'ancre concernée, le block ne croise pas un block déjà en place
            $.each(layout, function (i, blocklayoutElt) {

              if (hasBlockIntersection(blocklayoutElt, blockTestDatas)) {

                goodToGo = false;

              }

            });
          }

          if (goodToGo) {
            x = anchor.x;
            y = anchor.y;

            delete anchors[key];

            found = true;
          }
        }

      });

      // Positionnement du block
      absolutize($block, x, y);

      // Register layout
      registerLayout($block, x, y, width, height);

      // Register anchor X
      registerAnchor((x + width), y);
      // Register anchor Y
      registerAnchor(x, (y + height));

      // Finalisation du mur
      cleanWall();

      // Reorganisation des ancres dans l'ordre de lecture humain
      reorderAnchors();

      // Mettre en évidence visuellement les points d'ancrage
      // revealAnchors();

    };

    // var revealAnchors = function () {
    //
    //   $('.anchor', _self.wall).remove();
    //   $.each(anchors, function (j, anchor) {
    //
    //     if (typeof anchor !== 'undefined') {
    //
    //       _self.wall.append(
    //         anchor.$anchor
    //       );
    //
    //     }
    //
    //   });
    //
    // };

    // Tester l'intercroisement entre 2 blocks
    var hasBlockIntersection = function (block, target) {

      var output = false;
      if (
        target.xmax > block.xmin
        && target.xmin < block.xmax
        && target.ymax > block.ymin
        && target.ymin < block.ymax
      ) {

        output = true;
      }

      return output;

    };

    var cleanWall = function () {

      // On spécifie la hauteur du mur
      _self.wallSizeY = 0;
      $.each(layout, function (i, block) {

        $.each(anchors, function (key, anchor) {

          if (isAnchorWithinBlock(block, anchor.x, anchor.y)) {

            delete anchors[key];

          }

        });

        if (block.ymax > _self.wallSizeY) {
          _self.wallSizeY = block.ymax;
        }

      });

      // On repasse toutes les ancres pour éventuellement recaler à gauche si la place est disponible
      $.each(anchors, function (i, anchor) {

        if (typeof anchor !== 'undefined') {

          if (anchor.x !== 0 && anchor.y >= _self.wallSizeY) {

            registerAnchor(0, anchor.y);

          }

        }

      });

    };

    var registerLayout = function ($block, x, y, width, height) {

      layout.push({
        $block: $block,
        width: width,
        height: height,
        xmin: x,
        xmax: (x + width),
        ymin: y,
        ymax: (y + height)
      });

    };

    // Teste si une ancre donnée, et un block donné, se croisent
    var isAnchorWithinBlock = function (block, x, y) {

      var output = false;

      if ((
          x < block.xmax
          && x >= block.xmin
          && y < block.ymax
          && y >= block.ymin
        ) || (
          x >= _self.wallSizeX
        )) {

        output = true;

      }

      return output;
    };

    var registerAnchor = function (x, y) {

      var hasToBeRegistered = true;

      $.each(layout, function (i, block) {

        if (isAnchorWithinBlock(block, x, y)) {

          hasToBeRegistered = false;

        }

      });

      if (hasToBeRegistered) {

        anchors[x + '-' + y] = {
          x: x,
          y: y,
          $anchor: $('<div class="anchor' + x + '-' + y + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:8px;height:8px;margin:-4px 0 0 -4px;background:red;" ></div>')
        };
      }


    };

    var reorderAnchors = function () {

      var orderedAnchors = {};

      var datas = cloneObject(anchors);

      // Je créé un objet qui va regrouper les ancres par ordre croissant
      var anchorsY = {};

      for (var i = 0; i < Object.keys(anchors).length; i++) {

        var lowestY = Number.POSITIVE_INFINITY;
        var index = 0;

        // Je recherche le Y le plus petit
        $.each(datas, function (key, anchor) {

          // Je recherche la plus petite ancre Y
          if (anchor.y < lowestY) {
            lowestY = anchor.y;
            index = key;
          }

        });

        // Je stocke mes ancres par l'ordre croissant Y
        if (typeof anchorsY[lowestY] === 'undefined') {
          anchorsY[lowestY] = {};
        }
        anchorsY[lowestY][index] = datas[index];
        delete datas[index];
      }


      $.each(anchorsY, function (y, memorizedAnchors) {

        var anchorsX = cloneObject(memorizedAnchors);

        for (var i = 0; i < Object.keys(memorizedAnchors).length; i++) {

          var lowestX = Number.POSITIVE_INFINITY;
          var index = 0;
          $.each(anchorsX, function (key, anchor) {

            // Je recherche la plus petite ancre X
            if (anchor.x < lowestX) {
              lowestX = anchor.x;
              index = key;
            }

          });

          // Je stocke mes ancres par l'ordre croissant X
          orderedAnchors[index] = anchorsX[index];
          delete anchorsX[index];

        }

      });

      anchors = orderedAnchors;

    };

    var absolutize = function ($block, x, y) {

      var unit;
      if (options.unit === 'px') {
        unit = 'px';
      }
      else {
        unit = '%';
      }

      $block.css({
        opacity: '1',
        position: 'absolute',
        left: x + unit,
        top: y + 'px'
      });

    };

    /**
     * @method BlockWall.destroy
     * @description Annuler l'influence du script
     *
     */

    _self.destroy = function () {

      _self.wall.css('height', 'auto');
      _self.blocks.each(function (i, block) {
        var zindex;
        var $block = $(this);
        zindex = $block.css('z-index');
        $block.removeAttr('style');
        if (zindex !== 'auto') {
          $block.css('z-index', zindex);
        }
      });

    };

    /**
     * @method BlockWall.layout
     * @description Procéder à l'agencement
     *
     */

    _self.layout = function () {

      _self.destroy();
      init();

    };

    /**
     * @method BlockWall.reload
     * @description Relancer l'exécution du script
     *
     */

    _self.reload = function () {

      var instantWidth = getViewportWidth();
      if (instantWidth !== viewportWidth) {
        viewportWidth = instantWidth;

        _self.layout();
      }

    };

    init();
  };

})(jQuery);
