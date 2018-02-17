var villagesMapReady = false;
var villagesMap;
var villagesDatas;
var $view = {};

(function ($) {

  // var maxItemsDisplay = 48;
  var searchVillages = function () {

    var cssClass = 'search-villages';
    var $targets = $('.' + cssClass);

    $targets.each(function () {
      var $target = $(this);

      $view.formHolder = $('.' + cssClass + '--filters', $target);
      $view.form = $('form', $view.formHolder);
      $view.latMin = $('input[name="field_latitude_value[min]"]', $view.form);
      $view.latMax = $('input[name="field_latitude_value[max]"]', $view.form);
      $view.lngMin = $('input[name="field_longitude_value[min]"]', $view.form);
      $view.lngMax = $('input[name="field_longitude_value[max]"]', $view.form);

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
          url: {
            rule: '.teaser-village--content',
            cfg: {
              attribute: 'href'
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
          },
          rating: {
            rule: '.teaser-village--rating .five-stars',
            cfg: {
              attribute: 'class'
            }
          }
        }
      );

      $.each(villagesDatas, function (i, datas) {
        datas.lat = parseFloat(datas.lat);
        datas.lng = parseFloat(datas.lng);

        if (typeof datas.rating === 'string') {
          datas.rating = datas.rating.split('five-stars');
          datas.rating = datas.rating[1];
        }
      });

      if (typeof villagesMap === 'undefined') {

        // La MAP n'existe pas encore

        // On instancie villagesMap
        villagesMap = {};

        // Gestion de la langue
        villagesMap.lang = 'en';
        var curLang = $('html:first').attr('lang');
        if (typeof curLang === 'string') {
          villagesMap.lang = curLang;
        }

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
          class: 'button-action small search'
        }).text(
          Drupal.t('Search here')
        ).hide();

        // Click button behavior
        villagesMap.$button.click(function () {
          villagesMap.hideMapButton();
          $view.fakeSubmit.attr('disabled', true);
          $view.submit.click();
        });

        // Gestion d'un "fake" submit
        $view.fakeSubmit = $('<button type="submit" class="button-action big block search">' + $view.submit.val() + '</button>');

        // Hide
        $view.submit.hide();

        // Click relay
        $view.fakeSubmit.click(function (e) {
          e.preventDefault();
          $view.fakeSubmit.attr('disabled', true);
          $view.submit.click();
        });

        // Insertions dans le DOM HTML
        villagesMap.$wrapper.empty();
        villagesMap.$wrapper.append(
          villagesMap.$holder
        ).append(
          villagesMap.$buttonWrapper.append(
            villagesMap.$button
          )
        );
        $view.submit.after(
          $view.fakeSubmit
        );

        // Instanciation Mapbox
        mapboxgl.accessToken = _pk;
        villagesMap.mapbox = new mapboxgl.Map({
          container: villagesMap.$holder[0],
          style: 'mapbox://' + _mapboxStyle,
          zoom: 8,
          minZoom: 1,
          maxZoom: 17,
          dragRotate: false,
          center: [0, 0],
          scrollZoom: false,
          logoPosition: 'bottom-left'
        });
        villagesMap.mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        villagesMap.mapbox.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
        villagesMap.mapbox.addControl(new MapboxGeocoder({
          accessToken: mapboxgl.accessToken
        }), 'top-left');

        // Récupération d'éventuel filtres précédemment renseignés
        // var latMin = parseFloat($view.latMin.val());
        // var latMax = parseFloat($view.latMax.val());
        // var lngMin = parseFloat($view.lngMin.val());
        // var lngMax = parseFloat($view.lngMax.val());

        // On ajuste la carte aux markers en cours
        var bounds = new mapboxgl.LngLatBounds();
        $.each(villagesDatas, function (i, liDatas) {
          // On étend les bounds
          bounds.extend([liDatas.lng, liDatas.lat]);
        });

        if (!villagesDatas.length) {
          villagesMap.mapbox.fitBounds([[-22.860179, 30.014604], [31.983572, 60.033416]], {padding: _boundsPadding, linear: true});
        }
        else {
          // Fit bounds
          villagesMap.mapbox.fitBounds(bounds, {padding: _boundsPadding, linear: true});
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

        // Ajout de l'évènement "load"
        villagesMap.mapbox.on('load', function () {

          // Changement des noms des pays
          villagesMap.mapbox.setLayoutProperty('place-city-lg-n', 'text-field', '{name_' + villagesMap.lang + '}');
          villagesMap.mapbox.setLayoutProperty('country-label-lg', 'text-field', '{name_' + villagesMap.lang + '}');
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

          if (typeof datas.rating === 'string') {
            $marker.addClass(datas.rating);
          }

          // Instanciation de la popup
          output.popup = new mapboxgl.Popup({
            closeButton: false
          }).setLngLat(
            [output.lng, output.lat]
          ).setHTML(
            '<div class="teaser-village"><a href="' + output.url + '" class="teaser-village--content">' + output.html + '</a></div>'
          ).addTo(
            villagesMap.mapbox
          );

          // Instanciation du marker
          output.marker = new mapboxgl.Marker(
            $marker[0]
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
              // villagesMap.mapbox.setCenter([output.lng, output.lat]);
              // villagesMap.mapbox.setZoom(9);
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

          // if (datas.length >= maxItemsDisplay && villagesMapReady) {
          //   villagesMap.displayMessage();
          // }

          $.each(datas, function (i, liDatas) {

            // On insère un marker
            villagesMap.addMarker(liDatas);
          });
        };

        // Affichage d'un message concernant le nombre maximum affiché
        // villagesMap.displayMessage = function () {
        //
        //   alert(Drupal.t('Maximum list villages have been reached. Please,
        // use the filters or zoom-in')); };

        // On affiche les données
        villagesMap.displayDatas(villagesDatas);

        villagesMapReady = true;
      }
      else {

        // La MAP existe déjà

        // On affiche les données
        villagesMap.reloadDatas(villagesDatas);

        // On supprime le disabled sur le bouton
        $view.fakeSubmit.removeAttr('disabled');
      }
    });
  };

  Drupal.behaviors.searchVillages = {
    attach: searchVillages
  };

})(jQuery);
