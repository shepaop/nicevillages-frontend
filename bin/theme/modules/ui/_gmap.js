var Gmap;
(function () {

  /**
   * @class Gmap (WIP)
   *
   * @param {Gmap_options} [cfg] Options de configuration de Gmap
   *
   * @return {Gmap_output}
   */

  Gmap = function (cfg) {

    // Self object
    var _self = this;

    // Default options
    var defaults = {
      target: null,
      lat: 0,
      lng: 0,
      zoom: 2,
      maxZoom: null,
      minZoom: null,
      skin: null,
      streetViewControl: false,
      panControl: 'RIGHT_BOTTOM',
      fullscreen: false,
      zoomControl: 'RIGHT_BOTTOM',
      mapTypeId: 'ROADMAP',
      scrollwheel: true,
      markerSkins: {},
      markers: {}
    };

    // Final options
    var options = {};

    // Différents skins de markers
    _self.markerSkins = {};

    // Markers associés à la carte
    _self.markers = {};

    // Initialisation de l'objet
    var init = function () {

      options = cfgManager(defaults, cfg);

      // Supposé DOM Element
      if (typeof options.target === 'object') {

        var gMapOptions = formatMapOptions();
        console.log(gMapOptions);

        _self.map = new google.maps.Map(options.target, gMapOptions);

        registerMarkerSkins();
        registerMarkers();

        console.log(_self.markers);
      }
    };

    // Enregistrer les différents types de markers pré-configurés
    var registerMarkerSkins = function () {

      var keys = Object.keys(options.markerSkins);
      for (var i = 0; i < keys.length; i++) {

        _self.addMarkerSkin(keys[i], options.markerSkins[keys[i]]);
      }

    };

    // Enregistrer les différents markers pré-configurés
    var registerMarkers = function () {

      var keys = Object.keys(options.markers);
      for (var i = 0; i < keys.length; i++) {

        _self.addMarker(keys[i], options.markers[keys[i]]);
      }

    };

    // Formattage des options de configuration en options gMap natives
    var formatMapOptions = function () {

      var output = {
        center: new google.maps.LatLng(options.lat, options.lng),
        zoom: options.zoom,
        maxZoom: options.maxZoom,
        minZoom: options.minZoom,
        fullscreenControl: options.fullscreen,
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: options.scrollwheel,
        panControl: false,
        streetViewControl: options.streetViewControl,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        style: options.streetViewControl
      };

      // Gestion fullscreenControl
      if (typeof options.fullscreen === 'string') {
        output.fullscreenControl = true;
        output.fullscreenControlOptions = {
          position: google.maps.ControlPosition[options.fullscreenControl]
        };
      }

      // Gestion mapTypeId
      if (typeof options.mapTypeId === 'string') {
        output.mapTypeId = google.maps.MapTypeId[options.mapTypeId];
      }

      // Gestion panControl
      if (typeof options.panControl === 'string') {
        output.panControl = true;
        output.panControlOptions = {
          position: google.maps.ControlPosition[options.panControl]
        };
      }

      // Gestion streetViewControl
      if (typeof options.streetViewControl === 'string') {
        output.streetViewControl = true;
        output.streetViewControlOptions = {
          position: google.maps.ControlPosition[options.streetViewControl]
        };
      }

      // Gestion zoomControl
      if (typeof options.zoomControl === 'string') {
        output.zoomControl = true;
        output.zoomControlOptions = {
          position: google.maps.ControlPosition[options.zoomControl]
        };
      }

      return output;
    };

    /**
     * @typedef {object} Gmap_registerMarker_options
     * @description Options de configuration possibles pour un skin de marker
     *
     * @property {array} [anchor] Ancrage de l'image (si non-spécifié, c'est en
     *   bas au centre)
     * @property {string} url Chemin de l'image source
     * @property {array} size Dimensions de l'image [width, height]
     *
     * */

    /**
     * @method Gmap.registerMarker
     *
     * @description Ajouter un nouveau style de marker
     *
     * @param {String} name Nom du style
     * @param {Gmap_registerMarker_options} datas Options de configuration du
     *   style de marker
     */

    _self.addMarkerSkin = function (name, datas) {

      var opts = {
        origin: new google.maps.Point(0, 0),
        size: new google.maps.Size(datas.size[0], datas.size[1]),
        url: datas.url
      };

      if (typeof datas.anchor === 'object') {
        opts.anchor = new google.maps.Point(datas.anchor[0], datas.anchor[1]);
      }
      else {
        opts.anchor = new google.maps.Point((datas.size[0] / 2), datas.size[1]);
      }

      _self.markerSkins[name] = opts;
    };

    /**
     * @method Gmap.addMarker
     *
     * @description Ajouter un marker
     *
     * @param {String} name Clé du marker
     * @param {Gmap_addMarker_options} datas Options de configuration du
     *   marker
     */

    _self.addMarker = function (key, datas) {

      var opts = {
        map: _self.map,
        position: new google.maps.LatLng(datas.lat, datas.lng)
      };

      if (typeof datas.skin === 'string' && typeof _self.markerSkins[datas.skin] !== 'undefined') {
        opts.icon = _self.markerSkins[datas.skin];
      }

      if (typeof datas.title === 'string') {
        opts.title = datas.title;
      }

      if (typeof _self.markers[key] !== 'undefined') {
        _self.removeMarker(_self.markers[key].marker);
      }

      _self.markers[key] = datas;
      _self.markers[key].marker = new google.maps.Marker(opts);
    };

    /**
     * @method Gmap.removeMarker
     *
     * @description Retirer un marker
     *
     * @param {google.maps.Marker} Marker
     */

    _self.removeMarker = function (marker) {
      marker.setMap(null);
    };

    // Launch
    init();

    return _self;

  };


})();
