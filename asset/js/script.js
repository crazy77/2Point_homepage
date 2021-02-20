$(function () {
  "use strict";

  // global resolution variable
  var $resolution_pc = 1200; // PC 분기점 (min-width 기준)
  var $resolution_tablet = 992; // 태블릿 분기점 (min-width 기준)
  var $resolution_mobile = 768; // 모바일 분기점 (min-width 기준)

  // init
  // main_hero_init();
  // main_news_init();
  fullpage_init();
  navigation_init();
  parallax_init();
  navi_init();
  // footer_init();
  objectFitImages();

  // scroll handler
  $(window)
    .on("scroll", function () {
      header_scroll();
      // animate_bg_init();
      // subhero_scroll();
    })
    .scroll();

  // resize handler
  $(window)
    .on("resize", function () {
      fullpage_init();
    })
    .resize();

  // page loading
  function page_load_complete() {
    var $loader = $("#page-loader");

    // $loader.find(".loader").fadeOut("slow", function () {
    // setTimeout(function() {
    $loader.fadeOut("");
    // }, 100);
    // });
  }

  // fullpage init
  function fullpage_init() {
    var $winWidth = $(window).width();

    $(".fp-section").each(function () {
      if ($winWidth >= $resolution_mobile) {
        $(this).height($(window).height());
      } else {
        $(this).height($(window).height() * 0.8);
      }
    });
  }

  // main hero init
  function main_hero_init() {
    var $hero = $(".main-hero-section");

    if ($hero.length) {
      var $interval = $hero.data("interval") ? $hero.data("interval") : 4000;

      $hero.on("init", function (event, slick) {
        $hero
          .find(".slick-current")
          .removeClass("slick-active")
          .addClass("reset-animation");
        setTimeout(function () {
          $hero
            .find(".slick-current")
            .removeClass("reset-animation")
            .addClass("slick-active");
        }, 1);
      });

      $hero.slick({
        autoplay: true,
        autoplaySpeed: $interval,
        speed: 600,
        arrows: true,
        dots: true,
        lazyLoad: "ondemand",
        prevArrow:
          '<button type="button" class="slick-prev"><i class="xi-angle-left-thin" aria-hidden="true"></i></button>',
        nextArrow:
          '<button type="button" class="slick-next"><i class="xi-angle-right-thin" aria-hidden="true"></i></button>',
      });
    }
  }

  // main news init
  function main_news_init() {
    if ($(".main-notice-section .output-list").length) {
      var $list = $(".main-notice-section .output-list");
      var $article = $list.find(".board_output_1_tr");

      if ($article.length) {
        var $column = $article.closest(".output-list").data("column"),
          $html = '<div class="row">\n',
          $postURL = [],
          $category = [],
          $subject = [],
          $content = [],
          $date = [];

        switch ($column) {
          case 1:
            $column = 12;
            break;
          case 2:
            $column = 6;
            break;
          case 3:
            $column = 4;
            break;
          case 4:
            $column = 3;
            break;
          default:
            $column = 4;
        }

        $article.each(function (i) {
          var $this = $(this);

          $subject[i] = $this.find("a").text();
          $postURL[i] = $this.find("a").attr("href");
          $date[i] = $this.find(">td:last-child").text();

          $.ajax({
            url: $postURL[i],
            async: false,
            cache: false,
            dataType: "html",
            type: "GET",
            contentType: "application/x-www-form-urlencoded;charset=euc-kr",
            beforeSend: function (jqXHR) {
              jqXHR.overrideMimeType(
                "application/x-www-form-urlencoded;charset=euc-kr"
              );
            },
            success: function (data) {
              $content[i] = $(data)
                .find("#post_area")
                .html()
                .replace(/(<([^>]+)>)/gi, "");
              $category[i] = $(data).find(".board_desc:last").text();
              $html += '<div class="col-sm-' + $column + ' col-notice">\n';
              $html += '<div class="col-inner">\n';
              $html +=
                '<span class="category"><a href="' +
                $postURL[i] +
                '">' +
                $category[i] +
                "</a></span>\n";
              $html +=
                '<h3><a href="' +
                $postURL[i] +
                '">' +
                $subject[i] +
                "</a></h3>\n";
              $html += "<p>" + $content[i] + "</p>\n";
              $html += '<span class="date" lang="en">' + $date[i] + "</span>\n";
              $html += "</div>\n";
              $html += "</div>\n";
            },
            error: function (response) {
              console.log(response);
            },
          });

          i++;
        });

        $html += "</div>";
        $list.after($html);
        $list.remove();
      }
    }
  }

  // navigation init
  function navigation_init() {
    var $header = $("#header");
    var $gnb = $("#header .gnb");
    var $sidenav = $("#header .side-nav");
    var $openBtn = $header.find(".btn-nav-open");
    var $closeBtn = $header.find(".btn-nav-close");
    var $navDimmed = $header.find(".nav-dimmed");
    var $originalHeight = [];

    /* anchor animation (2020-06-18) */
    $gnb.find(".menu-items > li > a").on("click", function (e) {
      e.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(this.hash).offset().top - $("#header").outerHeight(),
          },
          500,
          "easeInCubic"
        );
    });

    $gnb.find(".menu-items > li").each(function () {
      $originalHeight.push($(this).find(".subnav-wrap").outerHeight());
    });

    $gnb.find(".subnav-wrap").height(0);

    $gnb
      .find(".menu-items > li")
      .on("mouseenter", function () {
        $(this)
          .find(".subnav-wrap")
          .stop(true, true)
          .css({ visibility: "visible", opacity: 0 })
          .animate(
            { height: $originalHeight[$(this).index()], opacity: 1 },
            350,
            "easeOutCubic"
          );
      })
      .on("mouseleave", function () {
        $gnb
          .find(".subnav-wrap")
          .stop(true, true)
          .animate({ height: 0, opacity: 0 }, 200, function () {
            $(this).css({ visibility: "hidden" });
          });
      });

    $sidenav.find(".menu-items > li").each(function () {
      if ($(this).find(".subnav").length) $(this).addClass("has-child-menu");
    });

    function nav_open() {
      $("body").addClass("nav-is-open");
      $navDimmed.stop().fadeIn(350);
    }

    function nav_close() {
      $("body").removeClass("nav-is-open");
      $navDimmed.stop().fadeOut(350);
    }

    $openBtn.on("click", function () {
      nav_open();
    });

    $closeBtn.on("click", function () {
      nav_close();
    });

    $navDimmed.on("click", function () {
      nav_close();
    });

    $sidenav.find(".menu-items > li > a").on("click", function (e) {
      /* anchor animation (2020-06-18) */
      e.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(this.hash).offset().top - $("#header").outerHeight(),
          },
          500,
          "easeInCubic"
        );
      nav_close();

      /*
            if ( $(this).siblings('.subnav').length ) {
                e.preventDefault();

                if ( !$(this).parent().hasClass('is-open') ) {
                    $sidenav.find('.menu-items > li.is-open').removeClass('is-open');
                    $sidenav.find('.subnav').stop().slideUp(300);
                    $(this).parent().addClass('is-open');
                    $(this).siblings('.subnav').stop().slideDown(300);
                } else {
                    $(this).parent().removeClass('is-open');
                    $(this).siblings('.subnav').stop().slideUp(300);
                }
            }
            */
    });
  }

  // sticky header
  function header_scroll() {
    var $header = $("#header");
    var $scrTop = $(window).scrollTop();

    if ($scrTop >= $header.outerHeight()) {
      if (!$header.hasClass("sticky")) $header.addClass("sticky");
    } else {
      $header.removeClass("sticky");
    }
  }

  // footer init
  function footer_init() {
    var $footer_size = $("#footer").outerHeight();

    $(".footer-spacer").height($footer_size);
  }

  $("#footer .col-sitemap dl dt a").on("click", function (e) {
    var $winWidth = $(window).width();

    if ($winWidth < $resolution_mobile) {
      if ($(this).parent().next("dd").find("ul").length) {
        e.preventDefault();

        if (!$(this).closest("dl").hasClass("is-open")) {
          $("#footer .col-sitemap dl").removeClass("is-open");
          $("#footer .col-sitemap dl dd").stop().slideUp(300);
          $(this).closest("dl").addClass("is-open");
          $(this).parent().next("dd").stop().slideDown(300);
        } else {
          $(this).closest("dl").removeClass("is-open");
          $(this).parent().next("dd").stop().slideUp(300);
        }
      }
    }
  });

  // main skills progressbar
  function animate_progress_bar() {
    $(".progress-group").each(function () {
      var $percentage = $(this).data("percentage");
      var $beforeCount =
        $(this).find(".percent-text").text() == ""
          ? 0
          : $(this).find(".percent-text").text();

      $(this).addClass("active");

      $(this)
        .find(".percent-text")
        .each(function () {
          var $this = $(this);
          $({ Counter: $beforeCount }).animate(
            { Counter: $percentage },
            {
              duration: 2000,
              easing: "swing",
              step: function () {
                $this.text(Math.ceil(this.Counter));
              },
            }
          );
        });

      $(this)
        .find(".percent")
        .stop()
        .animate({ left: $percentage + "%" }, 2000);
      $(this)
        .find(".progress-wrap .bar")
        .stop()
        .animate({ width: $percentage + "%" }, 2000);
    });
  }

  if ($(".progress-group").length) {
    var waypoint = new Waypoint({
      element: $(".progress-group"),
      handler: function (direction) {
        animate_progress_bar();
      },
      offset: "100%",
    });
  }

  // animated background effect
  function animate_bg_init() {
    var $elem = $(".animated-bg");

    $elem.length &&
      $elem.each(function () {
        var $this = $(this),
          $size = $this.outerHeight(),
          $pos = $this.offset().top,
          $calc = $size + $pos,
          $scrollTop = $(window).scrollTop(),
          $winHeight = $(window).outerHeight(),
          $areaStart = $pos - $winHeight,
          $areaEnd = $calc - $size / 2 - $winHeight / 2,
          $factor = 0;

        if ($scrollTop >= $areaStart && $scrollTop <= $areaEnd) {
          var $scale = ($scrollTop - $areaStart) / ($areaEnd - $areaStart);
          ($factor = 0.7 + 0.3 * $scale),
            $factor >= 0.98 ? ($factor = 1) : $factor < 0.7 && ($factor = 0.3),
            $this.css({
              transform: "matrix(" + $factor + ", 0, 0, 1, 0, 0)",
            });
        }
      });
  }

  // main review slider
  $(document).ready(function () {
    if ($(".main-animate-section02 .review-slider").length) {
      $(".main-animate-section02 .review-slider").slick({
        dots: true,
        arrows: false,
        speed: 600,
        adaptiveHeight: true,
      });
    }
  });

  // main map function
  $(document).ready(function () {
    var $main_map = $(".main-map-section");
    var $body = $("body");

    $main_map.append(
      $main_map
        .find(".visible-map")
        .clone()
        .removeClass("visible-map")
        .addClass("hide-map")
    );

    $(".main-map-section .btn-detail").on("click", function (e) {
      e.preventDefault();
      $body.addClass("fold-map");
      setTimeout(function () {
        $body.addClass("fixed-map");
      }, 450);
    });

    $(".main-map-section .btn-close").on("click", function () {
      $body.removeClass("fixed-map");
      setTimeout(function () {
        $body.removeClass("fold-map");
      }, 450);
    });
  });

  // dropdown init
  function navi_init() {
    var $gnb = $("#header .gnb");
    var $dropdown = [];
    var $url = $(location).attr("href");
    var $idx_main = 0;
    var $idx_sub = 0;
    var $dropdown_html = [];

    $(".dropdown-nav-section .dropdown-wrap").each(function (i) {
      $dropdown[i] = $(this);
      i++;
    });

    $gnb
      .find(".menu-items")
      .children()
      .each(function () {
        var $this = $(this);
        if (
          $url.indexOf($(this).find(">a").attr("href")) > -1 &&
          $(this).index() != 0
        ) {
          $idx_main = $(this).index();
          $(this).addClass("is-active is-open");
          $(this).find(".subnav").show();
        }

        $this.find(".subnav > li").each(function () {
          if (
            $url.indexOf($(this).find(">a").attr("href")) > -1 &&
            $(this).closest("li").index() != 0
          ) {
            $idx_main = $(this).parent().closest("li").index();
            $idx_sub = $(this).index();
            $(this).parent().addClass("is-active");
            $(this).parent().closest("li").addClass("is-active");
          }
        });
      });

    if ($(".dropdown-nav-section .dropdown-wrap").length) {
      $dropdown_html[0] = "";
      $dropdown_html[1] = "";

      $gnb
        .find(".menu-items")
        .children()
        .each(function () {
          var $link = $(this).find(">a").attr("href");
          var $name = $(this).find(">a").text();

          $dropdown_html[0] +=
            '<li><a href="' + $link + '">' + $name + "</a></li>";
        });

      $gnb
        .find(".menu-items")
        .children()
        .eq($idx_main)
        .find(".subnav > li")
        .each(function () {
          var $link = $(this).find(">a").attr("href");
          var $name = $(this).find(">a").text();

          $dropdown_html[1] +=
            '<li><a href="' + $link + '">' + $name + "</a></li>";
        });

      $dropdown[0].find(".dropdown").append($dropdown_html[0]);
      $dropdown[1].find(".dropdown").append($dropdown_html[1]);

      $dropdown[0]
        .find(".dropdown")
        .children()
        .eq($idx_main)
        .addClass("is-active");
      $dropdown[1]
        .find(".dropdown")
        .children()
        .eq($idx_sub)
        .addClass("is-active");

      $dropdown[0].find(">a").text($dropdown[0].find(".is-active").text());
      $dropdown[1].find(">a").text($dropdown[1].find(".is-active").text());

      function dropdown_close() {
        $(".dropdown-nav-section .dropdown-wrap > a").attr(
          "aria-expanded",
          "false"
        );
        $(".dropdown-nav-section .dropdown-wrap > .dropdown")
          .stop()
          .slideUp(300);
      }

      $(".dropdown-nav-section .dropdown-wrap > a").on("click", function (e) {
        e.preventDefault();
        if ($(this).attr("aria-expanded") != "true") {
          dropdown_close();
          $(this).attr("aria-expanded", "true");
          $(this).siblings(".dropdown").stop().slideDown(300);
        } else {
          $(this).attr("aria-expanded", "false");
          $(this).siblings(".dropdown").stop().slideUp(300);
        }
      });

      $(document).on("click touchend", function (e) {
        if (!$(e.target).is(".dropdown-nav-section .dropdown-wrap > a")) {
          dropdown_close();
        }
      });
    }
  }

  // sub hero scroll effect
  function subhero_scroll() {
    if ($("#sub-hero").length) {
      var $target = $("#sub-hero .caption-cell");
      var $scrTop = $(window).scrollTop();
      var $factor = 5;

      if ($scrTop <= $("#sub-hero").outerHeight()) {
        $target.css({ opacity: 1 - 0.025 * ($scrTop / $factor) });
      }
    }
  }

  // parallax init
  function parallax_init() {
    $("[data-parallax]").parallax();
  }

  // business review slider
  $(document).ready(function () {
    if ($(".business-review-section .review-slider").length) {
      $(".business-review-section .review-slider").slick({
        dots: true,
        speed: 600,
        adaptiveHeight: true,
      });
    }
  });

  // justified gallery init
  $(document).ready(function () {
    if ($(".justify-gallery-row").length) {
      var $gallery = $(".justify-gallery-row");

      $gallery.magnificPopup({
        delegate: "a",
        type: "image",
        mainClass: "mfp-fade",
        removalDelay: 300,
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 1],
        },
      });

      $gallery.justifiedGallery({
        rowHeight: 400,
        margins: 10,
      });
    }
  });

  // faq init
  $(document).ready(function () {
    if ($(".faq-list").length) {
      var $faq_article = $(".faq-list .titdesign");

      if ($faq_article.length) {
        var $answerRows = "";
        var $answer = [];
        var $answerURL = [];

        $faq_article.each(function (i) {
          var $this = $(this);
          $answerURL[i] = $this.find("a").attr("href");
          $.ajax({
            url: $answerURL[i],
            async: false,
            cache: false,
            dataType: "html",
            type: "GET",
            contentType: "application/x-www-form-urlencoded;charset=euc-kr",
            beforeSend: function (jqXHR) {
              jqXHR.overrideMimeType(
                "application/x-www-form-urlencoded;charset=euc-kr"
              );
            },
            success: function (data) {
              $answer[i] = $(data).find("#post_area").html();
              $answerRows += '<tr class="answer-row hide">';
              $answerRows += '<td colspan="6">';
              $answerRows += '<span class="faq-type">A</span>';
              $answerRows +=
                '<div class="answer-container">' + $answer[i] + "</div>";
              $answerRows += "</td>";
              $answerRows += "</tr>";
              $this.after($answerRows);
              $answerRows = "";
            },
            error: function (response) {
              console.log(response);
            },
          });
          i++;
        });
      }

      $(".faq-list .bbsnewf5 a").on("click", function (e) {
        if (!$(".board_admin_bgcolor").length) {
          e.preventDefault();

          if (!$(this).closest("tr").hasClass("is-open")) {
            $(".faq-list .answer-row").addClass("hide");
            $(".faq-list .is-open").removeClass("is-open");
            $(this).closest("tr").addClass("is-open");
            $(this).closest("tr").next(".answer-row").removeClass("hide");
          } else {
            $(this).closest("tr").removeClass("is-open");
            $(this).closest("tr").next(".answer-row").addClass("hide");
          }
        }
      });
    }
  });

  /*********************************************
   * board functions
   *********************************************/
  // get parameter
  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  // categories to buttons
  $(document).ready(function () {
    if ($(".board-category").length) {
      if ($(".board-category").find("select").length) {
        var $ca_link = [];
        var $ca_name = [];
        var $ca_current = getUrlParameter("com_board_category_code");
        var $html = "<ul>";

        $(".board-category select option").each(function (i) {
          $ca_name[i] = $(this).text();
          $ca_link[i] =
            $(location).attr("pathname") +
            "?com_board_category_code=" +
            $(this).val();

          $html +=
            '<li><a href="' + $ca_link[i] + '">' + $ca_name[i] + "</a></li>";
        });

        $html += "</ul>";
        $(".board-category").html($html);
        $(".board-category ul li").each(function () {
          if (
            $(this).find("a").attr("href").indexOf($ca_current) > -1 &&
            $ca_current != ""
          )
            $(this).addClass("is-active");
        });

        if (!$(".board-category .is-active").length)
          $(".board-category ul li:first-child").addClass("is-active");
      } else {
        $(".board-category").remove();
      }
    }

    $(".gallery_etc").each(function () {
      $(this).html(
        $.trim($(this).text().replace("[", "").replace("]", "").split(":")[1])
      );
    });
  });

  // image button to text button
  $(document).ready(function () {
    var $btn_keywords = [
      "삭제",
      "이동",
      "복사",
      "글쓰기",
      "검색",
      "이전",
      "목록보기",
      "다음",
      "수정",
      "작성완료",
      "취소",
      "스팸신고",
      "답글쓰기",
      "댓글달기",
    ];

    var $btn_type_input = $("input[type=image]"),
      $btn_type_img = $("img");

    $btn_type_input.each(function () {
      var $src = $(this).attr("src");

      if ($src.indexOf("search.gif") > -1) {
        $(this).before(
          '<input type="submit" id="btn-search" class="btn btn-secondary" value="' +
            $btn_keywords[4] +
            '">'
        );
        $(document).on("click", "#btn-search", function () {
          $(this).next("input[type=image]").trigger("click");
        });
        $(this).hide();
      }

      if ($src.indexOf("confirm.gif") > -1) {
        $(this).before(
          '<input type="submit" id="btn-confirm" class="btn btn-primary btn-lg" value="' +
            $btn_keywords[9] +
            '">'
        );
        $(this).hide();
      }

      if ($src.indexOf("comment_write.gif") > -1) {
        $(this).before(
          '<input type="submit" id="btn-comment-write" class="btn btn-primary btn-lg" value="' +
            $btn_keywords[13] +
            '">'
        );
        $(document).on("click", "#btn-comment-write", function () {
          $(this).next("input[type=image]").trigger("click");
        });
        $(this).hide();
      }
    });

    $btn_type_img.each(function () {
      var $src = $(this).attr("src");
      var $event = $(this).attr("onclick");

      if ($src.indexOf("btn_sdel.gif") > -1) {
        $(this).before(
          "<button class='btn btn-warning' onclick='" +
            $event +
            "'>" +
            $btn_keywords[0] +
            "</button>"
        );
        $(this).remove();
      }

      if ($src.indexOf("move.gif") > -1) {
        $(this).before(
          "<button class='btn btn-warning' onclick='" +
            $event +
            "'>" +
            $btn_keywords[1] +
            "</button>"
        );
        $(this).remove();
      }

      if ($src.indexOf("copy.gif") > -1) {
        $(this).before(
          "<button class='btn btn-warning' onclick='" +
            $event +
            "'>" +
            $btn_keywords[2] +
            "</button>"
        );
        $(this).remove();
      }

      if ($src.indexOf("prev.gif") > -1) {
        $(this).parent().addClass("btn btn-default").text($btn_keywords[5]);
      }

      if ($src.indexOf("list.gif") > -1) {
        $(this).parent().addClass("btn btn-secondary").text($btn_keywords[6]);
      }

      if ($src.indexOf("next.gif") > -1) {
        $(this).parent().addClass("btn btn-default").text($btn_keywords[7]);
      }

      if ($src.indexOf("spam.gif") > -1) {
        $(this).before(
          '<button class="btn btn-danger" onclick="' +
            $event +
            '">' +
            $btn_keywords[11] +
            "</button>"
        );
        $(this).remove();
      }

      if ($src.indexOf("modify.gif") > -1) {
        $(this).parent().addClass("btn btn-warning").text($btn_keywords[8]);
      }

      if ($src.indexOf("delete.gif") > -1) {
        $(this).parent().addClass("btn btn-warning").text($btn_keywords[0]);
      }

      if ($src.indexOf("reply.gif") > -1) {
        $(this).parent().addClass("btn btn-secondary").text($btn_keywords[12]);
      }

      if ($src.indexOf("write.gif") > -1) {
        $(this).parent().addClass("btn btn-secondary").text($btn_keywords[3]);
      }

      if ($src.indexOf("btn_confirm.gif") > -1) {
        $(this)
          .parent()
          .addClass("btn btn-primary btn-lg")
          .text($btn_keywords[9]);
      }

      if ($src.indexOf("cancel.gif") > -1) {
        $(this)
          .parent()
          .addClass("btn btn-secondary btn-lg")
          .text($btn_keywords[10]);
      }
    });
  });

  // list board header attributes
  $(document).ready(function () {
    $(".att_title").each(function () {
      $(this).attr("rel", $.trim($(this).text().replace(/\s/g, "")));
    });
  });

  // product b type (overlay)
  $(document).ready(function () {
    if ($(".type-b-row").length) {
      var $subject = [];
      var $category = [];

      $(".type-b-row .bbsnewf5").each(function (i) {
        var $markup = "";
        $subject[i] = $(this).find(".gallery_title").text();
        $category[i] = $(this).find(".gallery_etc").text();

        $markup = '<div class="article-overlay">';
        $markup += '<div class="article-info">';
        $markup += '<div class="info-inner">';
        $markup += '<p class="category">' + $category[i] + "</p>";
        $markup += "<h4>" + $subject[i] + "</h4>";
        $markup += "</div>";
        $markup += "</div>";
        $markup += "</div>";

        $(this).find("> table tr").not(":eq(0)").remove();
        $(this).find("> table tr").eq(0).find("a").append($markup);
      });
    }
  });

  // window load handler
  $(window).on("load", function () {
    if ($("#sub-hero").length) $("#sub-hero").addClass("is-loaded");
    page_load_complete();
  });

  // window resize handler
  $(window).on("resize", function () {
    footer_init();
  });
});
