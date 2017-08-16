var Preloader;

(function ($) {

  Preloader = function (cfg) {

    this.init = function () {
      cfg.init(this);
    };

    this.start = function () {
      // Démarrage du chargement des images
      var total = cfg.list.length;
      this.load(cfg, 0, total);
    };

    this.load = function (cfg, id, total) {

      // Création d'une balise IMG jQuery
      var src = cfg.relPath + cfg.list[id];
      var img = $('<img src="' + src + '" alt="" />');
      // Sauvegarde du contexte
      var obj = this;

      // Fonction à exécuter à la fin du chargement de chaque image
      var loaded = function () {
        id++;
        // Calcul du pourcentage
        var percent = Math.ceil((id / total) * 100);
        // Appel de la fonction à chaque image chargée
        cfg.update(percent, img, cfg);
        // Si il reste des images à charger, on les précharge
        if (id < total) {
          obj.load(cfg, id, total);
        }
      };

      // Pour tous les navigateurs
      function imgObserver() {
        if (img[0].complete) {
          clearInterval(imgObserverIntv);
          loaded();
        }
      }

      var imgObserverIntv = setInterval(imgObserver, 100);
    };
  };

})(jQuery);
