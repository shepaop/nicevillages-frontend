(function ($) {

  var mapPois = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'map-pois';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        var poisMap = {};

        poisMap.$list = $('.' + cssClass + '--content .light-list ul.light-list--list > li', $target);
        poisMap.$mapHolder = $('.' + cssClass + '--map', $target);

        var poisDatas = getDatasFromHtml(
          poisMap.$list, {
            title: '.teaser-light--title',
            lat: {
              rule: 'meta[itemprop="latitude"]',
              cfg: {
                attribute: 'content'
              }
            },
            lng: {
              rule: 'meta[itemprop="longitude"]',
              cfg: {
                attribute: 'content'
              }
            }
          }
        );
        $.each(poisDatas, function (i, datas) {
          datas.lat = parseFloat(datas.lat);
          datas.lng = parseFloat(datas.lng);
        });
        console.log(poisDatas);

        // Création du holder
        poisMap.$holder = $('<div />', {
          class: cssClass + '--map-canvas'
        });

        // Insertion dans le DOM HTML
        poisMap.$mapHolder.empty();
        poisMap.$mapHolder.append(
          poisMap.$holder
        );

        // Instanciation Mapbox
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlcGFvcDA3IiwiYSI6ImNqNjE5NThxZzByOHUzM21yd2Vtdjd2NmUifQ.KWUdy8hQ5LcLZvrQeoj1Zw';
        poisMap.mapbox = new mapboxgl.Map({
          container: poisMap.$holder[0],
          style: 'mapbox://styles/mapbox/outdoors-v10',
          zoom: 8,
          minZoom: 4,
          maxZoom: 17,
          dragRotate: false,
          center: [0, 0],
          scrollZoom: false,
          logoPosition: 'top-left'
        });
        poisMap.mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        poisMap.mapbox.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

        // Ajout d'un tableau store des markers
        poisMap.markers = [];

        // Ajouter un marker
        poisMap.addMarker = function (datas) {

          var output = datas;

          // Custom marker
          var $marker = $('<div />', {
            class: cssClass + '--marker'
          });

          // Instanciation de la popup
          output.popup = new mapboxgl.Popup().setLngLat(
            [output.lng, output.lat]
          ).setHTML(
            '<div class="padder">' + output.title + '</div>'
          ).addTo(
            poisMap.mapbox
          );

          // Instanciation du marker
          output.marker = new mapboxgl.Marker(
            $marker[0],
            [0, 20]
          ).setLngLat(
            [output.lng, output.lat]
          ).setPopup(
            output.popup
          ).addTo(
            poisMap.mapbox
          );

          // Création du bouton sur le $li pour pouvoir afficher le point sur
          // la carte
          $('.button-geolocate', output.$elt).remove();
          output.$button = $('<div />', {
            class: 'button-geolocate',
            title: Drupal.t('Reveal on the map')
          }).text(
            Drupal.t('Reveal on the map')
          );

          // Click event
          output.$button.click(function () {

            // On affiche la popup
            output.marker.togglePopup();

            // On remonte en haut de la carte
            animatedScrollTo(poisMap.$mapHolder, function () {

              // On centre la carte
              poisMap.mapbox.setCenter([output.lng, output.lat]);
            });
          });

          // Insertion dans le DOM HTML
          output.$button.appendTo(
            $('.teaser-light--actions:first', output.$elt)
          );

          // On ajoute à la liste
          poisMap.markers.push(
            output
          );

          return output.marker;
        };

        // Affichages des datas
        poisMap.displayDatas = function (datas) {

          $.each(datas, function (i, liDatas) {

            // On insère un marker
            poisMap.addMarker(liDatas);
          });
        };

        // On affiche les données
        poisMap.displayDatas(poisDatas);
      }
    });
  };

  Drupal.behaviors.mapPois = {
    attach: mapPois
  };

})(jQuery);
