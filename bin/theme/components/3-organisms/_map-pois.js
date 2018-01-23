var poisMap = {};
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
            class: cssClass + '--marker poi'
          });

          // Instanciation de la popup
          output.popup = new mapboxgl.Popup({
            closeButton: false
          }).setLngLat(
            [output.lng, output.lat]
          ).setHTML(
            '<div class="padder">' + output.title + '</div>'
          ).addTo(
            poisMap.mapbox
          );

          // Instanciation du marker
          output.marker = new mapboxgl.Marker(
            $marker[0]
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
              poisMap.mapbox.setZoom(16);
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

        // On récupère les coordonnées qui concernent le village
        var $holderVillage = $('.heading-village--overlay div[itemprop="geo"]');
        var villageLat = parseFloat($('meta[itemprop="latitude"]', $holderVillage).attr('content'));
        var villageLng = parseFloat($('meta[itemprop="longitude"]', $holderVillage).attr('content'));

        // Affichages des datas
        poisMap.displayDatas = function (datas) {

          var bounds = new mapboxgl.LngLatBounds();

          // On étend les bounds au village
          bounds.extend([villageLng, villageLat]);

          // Marker village
          var $marker = $('<div />', {
            class: cssClass + '--marker'
          });

          // Instanciation du marker village
          new mapboxgl.Marker(
            $marker[0]
          ).setLngLat(
            [villageLng, villageLat]
          ).addTo(
            poisMap.mapbox
          );

          // On parcours les datas des POIS
          $.each(datas, function (i, liDatas) {

            if (!isNaN(liDatas.lng) && !isNaN(liDatas.lat)) {

              // On insère un marker
              poisMap.addMarker(liDatas);

              // On étend les bounds
              bounds.extend([liDatas.lng, liDatas.lat]);
            }
          });

          // Fit bounds
          poisMap.mapbox.fitBounds(bounds);
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
