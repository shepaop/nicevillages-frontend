var villagesMap;
var villagesDatas;
var $view = {};

(function ($) {

  var maxItemsDisplay = 400;
  var searchVillages = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'search-villages';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      $view.formHolder = $('.' + cssClass + '--filters', $target);
      $view.form = $('form', $view.formHolder);
      $view.latMin = $('input[data-drupal-selector="edit-field-latitude-value-min"]', $view.form);
      $view.latMax = $('input[data-drupal-selector="edit-field-latitude-value-max"]', $view.form);
      $view.lngMin = $('input[data-drupal-selector="edit-field-longitude-value-min"]', $view.form);
      $view.lngMax = $('input[data-drupal-selector="edit-field-longitude-value-max"]', $view.form);

      $view.latMin.parents('.form-item:first').hide();
      $view.latMax.parents('.form-item:first').hide();
      $view.lngMin.parents('.form-item:first').hide();
      $view.lngMax.parents('.form-item:first').hide();

      $view.submit = $('input[type="submit"]', $view.form);

      $view.list = $('.list-villages ul.list-villages--list > li', $target);
      villagesDatas = getDatasFromHtml(
        $view.list, {
          title: '.teaser-village--title',
          html: {
            rule: '.teaser-village--content',
            cfg: {
              html: true
            }
          },
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
      $.each(villagesDatas, function (i, datas) {
        datas.lat = parseFloat(datas.lat);
        datas.lng = parseFloat(datas.lng);
      });

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        if (typeof villagesMap === 'undefined') {

          // La MAP n'existe pas encore

          // On instancie villagesMap
          villagesMap = {};

          // Création du wrapper
          var cssPrefix = 'map-search';
          villagesMap.$wrapper = $('.' + cssPrefix + '--section', $target);

          // Création du holder
          villagesMap.$holder = $('<div />', {
            class: cssPrefix + '--map-canvas'
          });

          // Création du wrappedu bouton
          villagesMap.$buttonWrapper = $('<div />', {
            class: cssPrefix + '--search'
          });

          // Création du bouton
          villagesMap.$button = $('<div />', {
            class: 'button-action search'
          }).text(
            Drupal.t('Search here')
          ).hide();

          // Click button behavior
          villagesMap.$button.click(function () {
            villagesMap.hideMapButton();
            $view.submit.click();
          });

          // Insertion dans le DOM HTML
          villagesMap.$wrapper.empty();
          villagesMap.$wrapper.append(
            villagesMap.$holder
          ).append(
            villagesMap.$buttonWrapper.append(
              villagesMap.$button
            )
          );

          // Instanciation Mapbox
          mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlcGFvcDA3IiwiYSI6ImNqNjE5NThxZzByOHUzM21yd2Vtdjd2NmUifQ.KWUdy8hQ5LcLZvrQeoj1Zw';
          villagesMap.mapbox = new mapboxgl.Map({
            container: villagesMap.$holder[0],
            style: 'mapbox://styles/mapbox/outdoors-v10',
            zoom: 8,
            minZoom: 4,
            maxZoom: 17,
            dragRotate: false,
            center: [0, 0],
            scrollZoom: false,
            logoPosition: 'top-left'
          });
          villagesMap.mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          villagesMap.mapbox.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          }));

          // Récupération d'éventuel filtres précédemment renseignés
          var latMin = parseFloat($view.latMin.val());
          var latMax = parseFloat($view.latMax.val());
          var lngMin = parseFloat($view.lngMin.val());
          var lngMax = parseFloat($view.lngMax.val());

          // Si oui, on ajuste la carte à ces précédents points
          if (!(isNaN(latMin) || isNaN(latMax) || isNaN(lngMin) || isNaN(lngMax))) {
            villagesMap.mapbox.fitBounds([[lngMin, latMin], [lngMax, latMax]]);
          }

          // Ajout de l'évènement "move"
          villagesMap.mapbox.on('move', function () {

            // On renseigne les champs du view filter
            var bounds = villagesMap.mapbox.getBounds();

            var rounder = function (int) {
              int = Math.round(int * 1000000) / 1000000;
              return int;
            };

            $view.latMin.val(rounder(bounds.getSouthWest().lat));
            $view.latMax.val(rounder(bounds.getNorthEast().lat));
            $view.lngMin.val(rounder(bounds.getSouthWest().lng));
            $view.lngMax.val(rounder(bounds.getNorthEast().lng));

            // On affiche le bouton pour relancer la recherche
            villagesMap.showMapButton();
          });

          // Afficher/masquer le bouton de recherche
          villagesMap.showMapButton = function () {
            villagesMap.$button.show();
          };
          villagesMap.hideMapButton = function () {
            villagesMap.$button.hide();
          };

          // Ajout d'un tableau store des markers
          villagesMap.markers = [];

          // Ajouter un marker
          villagesMap.addMarker = function (datas) {

            var output = datas;

            // Custom marker
            var $marker = $('<div />', {
              class: cssPrefix + '--marker'
            });

            // Instanciation de la popup
            output.popup = new mapboxgl.Popup({
              closeButton: false
            }).setLngLat(
              [output.lng, output.lat]
            ).setHTML(
              '<div class="teaser-village">' + output.html + '</div>'
            ).addTo(
              villagesMap.mapbox
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
              villagesMap.mapbox
            );

            // Création du bouton sur le $li pour pouvoir afficher le point sur
            // la carte
            $('.button-geolocate', output.$elt).remove();
            output.$button = $('<div />', {
              class: 'button-geolocate',
              title: Drupal.t('Reveal on the map')
            });

            // Click event
            output.$button.click(function () {

              // On affiche la popup
              output.marker.togglePopup();

              // On remonte en haut de la carte
              animatedScrollTo(villagesMap.$wrapper, function () {

                // On centre la carte
                villagesMap.mapbox.setCenter([output.lng, output.lat]);
              });
            });

            // Insertion dans le DOM HTML
            output.$button.appendTo(
              $('.inline-actions:first', output.$elt)
            );

            // On ajoute à la liste
            villagesMap.markers.push(
              output
            );

            return output.marker;
          };

          // Ajouter un marker
          villagesMap.removeAllMarkers = function () {

            $.each(villagesMap.markers, function (i, datas) {
              datas.marker.remove();
            });
          };

          // Reload des datas
          villagesMap.reloadDatas = function (datas) {

            // On supprime tous les markers
            villagesMap.removeAllMarkers();

            // On affiche les datas
            villagesMap.displayDatas(datas);
          };

          // Affichages des datas
          villagesMap.displayDatas = function (datas) {

            if (datas.length >= maxItemsDisplay) {
              villagesMap.displayMessage();
            }

            $.each(datas, function (i, liDatas) {

              // On insère un marker
              villagesMap.addMarker(liDatas);
            });
          };

          // Affichage d'un message concernant le nombre maximum affiché
          villagesMap.displayMessage = function () {

            alert('// @todo: Reste à dynamiser => Le nombre de points possible d‘afficher a été dépassée');
          };

          // On affiche les données
          villagesMap.displayDatas(villagesDatas);
        }
        else {

          // La MAP existe déjà

          // On affiche les données
          villagesMap.reloadDatas(villagesDatas);
        }
      }
    });
  };

  Drupal.behaviors.searchVillages = {
    attach: searchVillages
  };

})(jQuery);
