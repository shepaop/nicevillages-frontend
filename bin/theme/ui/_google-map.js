
var gMap = function (divId, options) {

  /* CONSTRUCTOR */
  var mapDiv;
  var mapMarkerImage;
  if (typeof divId === 'string') {
    mapDiv = document.getElementById(divId);
  }
  if (typeof divId === 'object') {
    mapDiv = divId[0];
  }
  if (mapDiv) {
    // Config par defaut
    var mapOptions = {
      center: new google.maps.LatLng(32.546813, -14.238281),
      zoom: 2,
      mapTypeControl: false,
      streetViewControl: false,
      panControl: false,
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
        style: google.maps.ZoomControlStyle.SMALL
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    if (typeof options.options !== 'undefined') {
      if (typeof options.options.panControl === 'boolean') {
        mapOptions.panControl = options.options.panControl;
      }
      if (typeof options.options.zoomControl === 'boolean') {
        mapOptions.zoomControl = options.options.zoomControl;
      }
      if (typeof options.options.center !== 'undefined') {
        mapOptions.center = new google.maps.LatLng(options.options.center[0], options.options.center[1]);
      }
      if (typeof options.options.zoom !== 'undefined') {
        mapOptions.zoom = options.options.zoom;
      }
      if (typeof options.options.mapTypeControl !== 'undefined') {
        mapOptions.mapTypeControl = options.options.mapTypeControl;
      }
      if (typeof options.options.streetViewControl !== 'undefined') {
        mapOptions.streetViewControl = options.options.mapTypeControl;
      }
      if (typeof options.options.scrollwheel !== 'undefined') {
        mapOptions.scrollwheel = options.options.scrollwheel;
      }
      if (typeof options.options.mapTypeId !== 'undefined') {
        switch (options.options.mapTypeId) {
          case 'roadmap':
            mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
            break;
          case 'satellite':
            mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
            break;
          case 'hybrid':
            mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
            break;
          case 'terrain':
            mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
            break;
          default:
            mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
            break;
        }

      }

      if (typeof options.options.positionControl !== 'undefined') {
        switch (options.options.positionControl) {
          case 'LEFT_CENTER':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.LEFT_CENTER};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.LEFT_CENTER,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'BOTTOM_LEFT':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.LEFT_BOTTOM};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.LEFT_BOTTOM,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'BOTTOM_CENTER':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.BOTTOM_CENTER};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.BOTTOM_CENTER,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'BOTTOM_RIGHT':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.RIGHT_BOTTOM};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.RIGHT_BOTTOM,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'RIGHT_CENTER':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.RIGHT_CENTER};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.RIGHT_CENTER,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'TOP_RIGHT':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.TOP_RIGHT};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.TOP_RIGHT,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          case 'TOP_CENTER':
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.TOP_CENTER};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.TOP_CENTER,
              style: mapOptions.zoomControlOptions.style
            };
            break;
          default:
            mapOptions.panControlOptions = {position: google.maps.ControlPosition.TOP_LEFT};
            mapOptions.zoomControlOptions = {
              position: google.maps.ControlPosition.TOP_LEFT,
              style: mapOptions.zoomControlOptions.style
            };
            break;
        }
      }
    }

    // Si on a défini des styles particuliers
    if (typeof options.style !== 'undefined') {
      mapOptions.styles = options.style;
    }

    // Activation ou non du GEOCODER
    if (typeof options.geocoder !== 'undefined' && typeof options.geocoder.activate !== 'undefined' && options.geocoder.activate) {
      this.geocoder = new google.maps.Geocoder();
    }

    // définition du MARKER
    if (typeof options.marker !== 'undefined') {
      // Image src
      var mapMarker_src = null;
      if (typeof options.marker.src !== 'undefined') {
        mapMarker_src = options.marker.src;
      }

      // Image size
      var mapMarker_size = null;
      if (typeof options.marker.size !== 'undefined') {
        mapMarker_size = new google.maps.Size(options.marker.size[0], options.marker.size[1]);
      }

      // Image origin
      var mapMarker_origin = null;
      if (typeof options.marker.origin !== 'undefined') {
        mapMarker_origin = new google.maps.Point(options.marker.origin[0], options.marker.origin[1]);
      }

      // Image anchor
      var mapMarker_anchor = null;
      if (typeof options.marker.anchor !== 'undefined') {
        mapMarker_anchor = new google.maps.Point(options.marker.anchor[0], options.marker.anchor[1]);
      }

      // Création du marker
      mapMarkerImage = new google.maps.MarkerImage(mapMarker_src, mapMarker_size, mapMarker_origin, mapMarker_anchor);
    }

    /* Génération de la GOOGLE MAP */
    this.map = new google.maps.Map(mapDiv, mapOptions);
    google.maps.event.addListener(this.map, 'click', function () {
      var infoBoxes;
      if (typeof document.getElementsByClassName !== 'undefined') {
        infoBoxes = document.getElementsByClassName('infoBox');
      }
      else {
        infoBoxes = document.querySelectorAll('.infoBox');
      }
      for (var i = 0; i < infoBoxes.length; i++) {
        infoBoxes[i].style.display = 'none';
      }
    });

    /* Lister les MARKERS affectés à la GMAP */
    this.markerList = [];

    /* Affecter un MARKER à la GMAP */
    this.setMarker = function (data) {

      // Si on a une ICONE customisée pour le point en cours, on l'assigne
      var marker;
      if (typeof data.marker !== 'undefined') {

        // On spécifie les paramètres à NULL
        // Image src
        var dataMapMarker_src = null;
        // Image size
        var dataMapMarker_size = null;
        // Image origin
        var dataMapMarker_origin = null;
        // Image anchor
        var dataMapMarker_anchor = null;

        if (typeof mapMarkerImage !== 'undefined') {
          // Si y a une CONFIG globale, on récupère celles-ci du point en cours
          if (typeof options.marker.src !== 'undefined') {
            dataMapMarker_src = options.marker.src;
          }
          if (typeof options.marker.size !== 'undefined') {
            dataMapMarker_size = new google.maps.Size(options.marker.size[0], options.marker.size[1]);
          }
          if (typeof options.marker.origin !== 'undefined') {
            dataMapMarker_origin = new google.maps.Point(options.marker.origin[0], options.marker.origin[1]);
          }
          if (typeof options.marker.anchor !== 'undefined') {
            dataMapMarker_anchor = new google.maps.Point(options.marker.anchor[0], options.marker.anchor[1]);
          }
        }

        // Puis on surcharge si besoin
        if (typeof data.marker.src !== 'undefined') {
          dataMapMarker_src = data.marker.src;
        }
        if (typeof data.marker.size !== 'undefined') {
          dataMapMarker_size = new google.maps.Size(data.marker.size[0], data.marker.size[1]);
        }
        if (typeof data.marker.origin !== 'undefined') {
          dataMapMarker_origin = new google.maps.Point(data.marker.origin[0], data.marker.origin[1]);
        }
        if (typeof data.marker.anchor !== 'undefined') {
          dataMapMarker_anchor = new google.maps.Point(data.marker.anchor[0], data.marker.anchor[1]);
        }

        var dataMapMarkerImage = new google.maps.MarkerImage(dataMapMarker_src, dataMapMarker_size, dataMapMarker_origin, dataMapMarker_anchor);

        // Déclaration d'un nouveau MARKER
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.coords[0], data.coords[1]),
          map: this.map,
          icon: dataMapMarkerImage// ,
          // title: data.content.split("</h2>")[0].replace('<h2 class="teaser-contact--name">', '').trim()
        });
        // On mémorise le marker
        this.markerList.push(marker);
      }
      // Si on a une ICONE customisée, on l'assigne
      else if (typeof mapMarkerImage !== 'undefined') {
        // Déclaration d'un nouveau MARKER
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.coords[0], data.coords[1]),
          map: this.map,
          icon: mapMarkerImage// ,
          // title: data.content.split("</h2>")[0].replace('<h2 class="teaser-contact--name">', '').trim()*/
        });
        // On mémorise le marker
        this.markerList.push(marker);
      }

      // Déclaration de l'HTML
      var html = data.content;

      var boxCssClass = 'infoBox';
      if (typeof data.cssClass != 'undefined') {
        boxCssClass += ' ' + data.cssClass;
      }

      var mapMarkerInfoBox = new InfoBox({
        content: html,
        disableAutoPan: false,
        // pixelOffset: new google.maps.Size((Math.round((-options.box.width)/2)+options.box.offsetX), options.box.offsetY),
        pixelOffset: new google.maps.Size(options.box.offsetX, options.box.offsetY),
        zIndex: 1,
        boxStyle: {
          width: (options.box.width + 'px'),
          // height:(options.box.height+'px'),
          overflow: 'hidden'
        },
        boxClass: boxCssClass,
        closeBoxURL: options.box.close,
        isHidden: false,
        pane: 'floatPane',
        enableEventPropagation: false,
        alignBottom: true
      });
      // On attache l'INFO BOX à la GOOGLE MAP
      google.maps.event.addListener(marker, 'click', function () {
        var infoBoxes;
        if (typeof document.getElementsByClassName != 'undefined') {
          infoBoxes = document.getElementsByClassName('infoBox');
        }
        else {
          infoBoxes = document.querySelectorAll('.infoBox');
        }
        for (var i = 0; i < infoBoxes.length; i++) {
          infoBoxes[i].style.display = 'none';
        }
        mapMarkerInfoBox.open(this.map, marker);
      });
    };

    if (typeof options.markerList != 'undefined') {
      for (var i = 0; i < options.markerList.length; i++) {
        this.setMarker(options.markerList[i]);
      }
    }
    // Ouvrir un marker
    this.triggerMarker = function (id) {
      if (typeof this.markerList != 'undefined' && typeof this.markerList[id] != 'undefined') {
        new google.maps.event.trigger(this.markerList[id], 'click');
      }
    };
    // Coordonnées d'un marker
    this.getMarkerCoords = function (id) {
      if (typeof this.markerList != 'undefined' && typeof this.markerList[id] != 'undefined') {
        return this.markerList[id].getPosition();
      }
    };
    // Centrer la map sur un point
    this.setZoom = function (zoom) {
      this.map.setZoom(zoom);
    };
    // Centrer la map sur un point
    this.setCenter = function (coords) {
      this.map.setCenter(new google.maps.LatLng(coords[0], coords[1]));
    };
    // Retourne l'élément du DOM auquel est attaché la GOOGLE MAP
    this.getDomHandler = function () {
      return mapDiv;
    };
    // Exécute dle GEOCODER avec une ADRESSE et exécute CALLBACK en retour
    this.setAddress = function (address) {
      // Si on a activé préalablement
      if (typeof this.geocoder != 'undefined') {
        if (typeof address != 'undefined') {
          if (typeof options.geocoder.callback === 'undefined') {
            options.geocoder.callback = function () {};
          }
          this.geocoder.geocode({address: address}, options.geocoder.callback);
        }
      }
    };
  }

};
