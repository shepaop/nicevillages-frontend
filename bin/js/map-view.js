var villagesMap;
var villagesDatas;
var $view = {};

(function ($) {

  var maxItemsDisplay = 400;
  var mapboxView = function (context, settings) {

    if (typeof context === 'undefined') {
      context = document;
    }

    var cssClass = 'view-villages';
    var $targets = $('.' + cssClass, context);

    $targets.each(function () {
      var $target = $(this);

      $view.form = $('.views-exposed-form', $target);
      $view.latMin = $('input[data-drupal-selector="edit-field-latitude-value-min"]', $view.form);
      $view.latMax = $('input[data-drupal-selector="edit-field-latitude-value-max"]', $view.form);
      $view.lngMin = $('input[data-drupal-selector="edit-field-longitude-value-min"]', $view.form);
      $view.lngMax = $('input[data-drupal-selector="edit-field-longitude-value-max"]', $view.form);

      $view.submit = $('input[type="submit"]', $view.form);

      $view.list = $('.view-content ul:first > li', $target);
      villagesDatas = getDatasFromHtml(
        $view.list, {
          title: '.field--name-title',
          lat: '.field--name-field-latitude',
          lng: '.field--name-field-longitude'
        }
      );
      $.each(villagesDatas, function (i, datas) {
        datas.lat = parseFloat(datas.lat);
        datas.lng = parseFloat(datas.lng);
      });
      console.log(villagesDatas);

      if (typeof $target.data('init-' + cssClass) === 'undefined') {
        $target.data('init-' + cssClass, true);

        if (typeof villagesMap === 'undefined') {

          // La MAP n'existe pas encore

          // On instancie villagesMap
          villagesMap = {};

          // Création du wrapper
          villagesMap.$wrapper = $('<div />', {
            style: 'position:relative;'
          });

          // Création du holder
          villagesMap.$holder = $('<div />', {
            style: 'height:500px;'
          });

          // Création du bouton
          villagesMap.$button = $('<div />', {
            style: 'position:absolute;right:20px;top:20px;',
            class: 'button button action'
          }).text(
            Drupal.t('Search here')
          ).hide();

          // Click button behavior
          villagesMap.$button.click(function () {
            villagesMap.hideMapButton();
            $view.submit.click();
          });

          // Insertion dans le DOM HTML
          $target.before(
            villagesMap.$wrapper.append(
              villagesMap.$holder
            ).append(
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

            var rounder = function(int){
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
          villagesMap.addMarker = function(datas){

            var output = datas;

            // Custom marker
            var $marker = $('<div />', {
              style: 'width:20px;height:20px;background:black;border-radius:10px;'
            });

            $marker.click(function() {
              console.log(output.$elt[0]);
            });

            // Instanciation de la popup
            output.popup = new mapboxgl.Popup().setLngLat(
              [output.lng, output.lat]
            ).setHTML(
              '<h1>' + output.title + '</h1>'
            ).addTo(
              villagesMap.mapbox
            );

            // Instanciation du marker
            output.marker = new mapboxgl.Marker(
              $marker[0],
              [0, 10]
            ).setLngLat(
              [output.lng, output.lat]
            ).setPopup(
              output.popup
            ).addTo(
              villagesMap.mapbox
            );

            // Création du bouton sur le $li pour pouvoir afficher le point sur la carte
            output.$button = $('<div />', {
              class: 'button button-action'
            }).text(
              '//@todo: Reste à skinner'
            );

            // Click event
            output.$button.click(function(){

              // On affiche la popup
              output.marker.togglePopup();

              // On remonte en haut de la carte
              animatedScrollTo(villagesMap.$wrapper);
            });

            // Insertion dans le DOM HTML
            output.$button.appendTo(
              output.$elt
            );

            // On ajoute à la liste
            villagesMap.markers.push(
              output
            );

            return output.marker;
          };

          // Ajouter un marker
          villagesMap.removeAllMarkers = function(){

            $.each(villagesMap.markers, function(i, datas){
              datas.marker.remove();
            });
          };

          // Reload des datas
          villagesMap.reloadDatas = function(datas){

            // On supprime tous les markers
            villagesMap.removeAllMarkers();

            // On affiche les datas
            villagesMap.displayDatas(datas);
          };

          // Affichages des datas
          villagesMap.displayDatas = function(datas){

            if(datas.length >= maxItemsDisplay) {
              villagesMap.displayMessage();
            }

            $.each(datas, function(i, liDatas){

              // On insère un marker
              villagesMap.addMarker(liDatas);
            });
          };

          // Affichage d'un message concernant le nombre maximum affiché
          villagesMap.displayMessage = function(){

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

  Drupal.behaviors.mapboxView = {
    attach: mapboxView
  };

})(jQuery);
