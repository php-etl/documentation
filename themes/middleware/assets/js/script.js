(function ($) {
  'use strict';

  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    });
  });


  // Accordions
  $('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find('.ti-plus').removeClass('ti-plus').addClass('ti-minus');
  }).on('hidden.bs.collapse', function () {
    $(this).parent().find('.ti-minus').removeClass('ti-minus').addClass('ti-plus');
  });


  // match height
  $(function () {
    $('.match-height').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
  });

  // Get Parameters from some url
  var getUrlParameter = function getUrlParameter(sPageURL) {
    var url = sPageURL.split('?');
    var obj = {};
    if (url.length == 2) {
      var sURLVariables = url[1].split('&'),
        sParameterName,
        i;
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        obj[sParameterName[0]] = sParameterName[1];
      }
      return obj;
    } else {
      return undefined;
    }
  };

  // Execute actions on images generated from Markdown pages
  var images = $(".content img").not(".inline");
  // Wrap image inside a featherlight (to get a full size view in a popup)
  images.wrap(function () {
    var image = $(this);
    if (!image.parent("a").length) {
      return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
    }
  });

  // Change styles, depending on parameters set to the image
  images.each(function (index) {
    var image = $(this)
    var o = getUrlParameter(image[0].src);
    if (typeof o !== "undefined") {
      var h = o["height"];
      var w = o["width"];
      var c = o["classes"];
      image.css("width", function () {
        if (typeof w !== "undefined") {
          return w;
        } else {
          return "auto";
        }
      });
      image.css("height", function () {
        if (typeof h !== "undefined") {
          return h;
        } else {
          return "auto";
        }
      });
      if (typeof c !== "undefined") {
        var classes = c.split(',');
        for (i = 0; i < classes.length; i++) {
          image.addClass(classes[i]);
        }
      }
    }
  });


  // tab
  $('.tab-content').find('.tab-pane').each(function (idx, item) {
    var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
      title = $(this).attr('title');
    navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
  });

  $('.code-tabs ul.nav-tabs').each(function () {
    $(this).find("li:first").addClass('active');
  })

  $('.code-tabs .tab-content').each(function () {
    $(this).find("div:first").addClass('active');
  });

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest('.code-tabs'),
      tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
    tabPanel.find('.active').removeClass('active');
    tab.addClass('active');
    tabPane.addClass('active');
  });



  // search
  $('#search').keyup(function () {
    if (this.value) {
      $(this).addClass('active')
    } else {
      $(this).removeClass('active')
    }
  })
  $('#search').focusout(function () {
    $(this).removeClass('active')
  })

})(jQuery);

(function addCopyButtons(clipboard) {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerHTML = '<svg fill="none" height="18" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 21" width="18"><path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path></svg>';

    button.addEventListener('click', function () {
      clipboard.writeText(codeBlock.textContent).then(function () {
        button.blur();

        button.innerText = 'Copied!';

        setTimeout(function () {
          button.innerHTML = '<svg fill="none" height="18" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 21" width="18"><path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path></svg>';
        }, 2000);
      }, function (error) {
        button.innerText = 'Error';
      });
    });

    codeBlock.parentNode.append(button);
  });
})(navigator.clipboard);
