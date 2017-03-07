$(document).ready(function() {

  //store search activity
  var search = {
    active: false,
    current: null,
    previous: null,
    url: null,
    previousSearches: []
  };

  var searchCall = function() {
    //if input is not empty...
    if ($(".input").html() !== "") {

      //clears search results
      $(".response_container").html("");

      //saves current search + calls api with it
      search.current = $(".input").html();
      apiRequest(search.current);

      //moves input up after first search
      $(".search_wrapper").css("margin-top", "50px");

      if (search.previous != null) {

        var used = false;

        for (p = 0; p < search.previousSearches.length; p++) {
          if (search.previousSearches[p] == search.previous) {
            used = true;
          }
        }

        if (used == false) {

          //adds previous
          $("<div class='previous_search_object'>" + search.previous + "</div>").hide().appendTo(".previous_search_object_wrapper").fadeIn(200);

          search.previousSearches.push(search.previous);
        }

        search.previous = search.current;

        //initializes previous searches after second search
        if ($(".previous_searches_wrapper h3").html().length === 0) {
          $(".previous_searches_wrapper h3").html("Previous Searches:").hide().fadeIn(200);
        }
      }
    }

    search.active = false;

    $(".input").html("");
    $(".search_container").removeClass("search_active");

    //style changes -- back to inactive search
    colorChange.removeClass("search_active_color");
    colorChange.removeClass("search_active_color");
    $(".response_object_tab").removeClass("background_blue");
    $(".response_object_link").removeClass("background_blue");
    $(".footer").removeClass("background_blue");

    //deactivate input
    $(".input").attr("contenteditable", "false");

    //stores value
    search.previous = search.current;
  };

  //prevent new line when typing
  var noReturn = function() {
    $(".input").keypress(function(e) {
      if (e.which == 13) {
        searchCall();
      }
    });
  };

  //selectors
  var input = $(".input"),
    colorChange = $("body, .search_container, .previous_search_object"),
    backgroundChange = $(".response_object_tab");

  $(".response_object_tab").addClass("background_blue");

  var iniateSearch = function() {

    $(".search_container").click(function() {
      if (search.active === false) {
        search.active = true;

        //button becomes input field on click
        $(".search_container").addClass("search_active");

        //style change when search is active
        colorChange.addClass("search_active_color");
        backgroundChange.addClass("background_blue");
        $(".response_object_tab").addClass("background_blue");
        $(".response_object_link").addClass("background_blue");
        $(".footer").addClass("background_blue");

        //activates input
        $(".input_container").html("<div class='input'></div>");
        $(".input").attr("contenteditable", "true").focus();
        noReturn();

      } else if (search.active === true) {

        //if input is not empty...
        if ($(".input").html() !== "") {

          //clears search results
          $(".response_container").html("");

          //saves current search + calls api with it
          search.current = $(".input").html();
          apiRequest(search.current);

          $(".page-wrapper").css("min-height", "120vh");

          //moves input up after first search
          $(".search_wrapper").css("margin-top", "50px");

          //won't add search to previous if it's already there
          if (search.previous != null) {
            var used = false;
            for (p = 0; p < search.previousSearches.length; p++) {
              if (search.previousSearches[p] == search.previous) {
                used = true;
              }
            }
            if (used == false) {
              //adds previous
              $("<div class='previous_search_object'>" + search.previous + "</div>").hide().appendTo(".previous_search_object_wrapper").fadeIn(200);
              search.previousSearches.push(search.previous);
            }

            search.previous = search.current;

            //initializes previous searches after second search
            if ($(".previous_searches_wrapper h3").html().length === 0) {
              $(".previous_searches_wrapper h3").html("Previous Searches:").hide().fadeIn(200);
            }
          }
        }

        search.active = false;

        $(".input").html("");
        $(".search_container").removeClass("search_active");

        //style changes -- back to inactive search
        colorChange.removeClass("search_active_color");
        colorChange.removeClass("search_active_color");
        $(".response_object_tab").removeClass("background_blue");
        $(".response_object_link").removeClass("background_blue");
        $(".footer").removeClass("background_blue");

        //deactivate input
        $(".input").attr("contenteditable", "false");

        //stores value
        search.previous = search.current;

      }
    });

  };

  iniateSearch();

  //////

  //start api function
  function apiRequest(word) {
    url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + word + "&callback=JSON_CALLBACK";

    $.ajax({
      url: url,
      dataType: 'jsonp',
      type: 'POST',
      exlimit: "10",
      exintro: "1",
      headers: {
        'Api-User-Agent': 'http://codepen.io/hil/full/dXyzGd/'
      },
      success: function(data) {
        console.log(data);
        console.log(data.query.pages);

        var p = data.query.pages;

        var timeIn = 100;

        function timeFadeIn(i) {
          setTimeout(function() {

            var extract = p[i].extract;

            if (extract.length > 260) {
              extract = extract.substr(0, 260) + "...";
            }

            $("<div class='response_object'><div class='response_object_tab'>" + p[i].title + "</div><p>" + extract + "</p><div class='response_object_link'><a target='/blank' href='https://en.wikipedia.org/wiki/" + p[i].title + "'>Learn more?</div></div>").hide().appendTo(".response_container").fadeIn(300);
          }, timeIn);
        }

        for (var i in p) {

          timeFadeIn(i);

          timeIn += 75;

        }

      }
    });
  }
  //end api function

  //for viewing previous searches..
  $(".previous_searches_wrapper").on("click", ".previous_search_object", function() {

    //There has to be a previous search for it to be added to "previous searches"...
    if (search.previous !== null) {

      //Check if this search has already been indexed.. We don't want duplicates
      var used = false;

      for (p = 0; p < search.previousSearches.length; p++) {
        if (search.previousSearches[p] == search.previous) {
          used = true;
        }
      }

      if (used == false) {
        $("<div class='previous_search_object'>" + search.previous + "</div>").hide().appendTo(".previous_search_object_wrapper").fadeIn(200);

        //stores in array for checking later
        search.previousSearches.push(search.previous);
      }

    }

    //current = term pressed
    search.current = $(this).html();

    //clears search results
    $(".response_container").html("");

    apiRequest(search.current);

    //resets these variables.. we don't need to store previous searches because they're already stored
    search.current = null;
    search.previous = null;

  });

});