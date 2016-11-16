showReview = function (title) { 
  /* Make GET request */
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        document.body.className = 'ok';
        var res = JSON.parse(request.responseText);
        setupHandlebars(title, res);
      } else {
        document.body.className = 'error';
      }
    }
  };
  var url = "restaurants/" + title;
  request.open("GET", url, true);
  request.send(null);
  /* End GET Request */
}


function setupHandlebars(title, res) {
  var reviewDiv = title.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  $('.review.active').removeClass('active');
  $('.review-placeholder').addClass('active');

  // Grab the template script
  var reviewTemplateScript = $("#review-template").html();

  // Compile the template
  var reviewTemplate = Handlebars.compile(reviewTemplateScript);

  // Define our data object
  data = res; //data = getData(...);

  // Pass our data to the template
  var theCompiledHtml = reviewTemplate(data);

  // Add the compiled html to the page
  $('.review-placeholder').html(theCompiledHtml);

  $('.review').animate({ scrollTop: 0 }, 100);
}

showSubNav = function () {
  $('.sub-nav').addClass('active');
}

$(document).ready(function () {
  for (var i = 1; i <= 5; i++) {
    $("#rating-input-" + i + "+ .checkbox-label").width(i * 20);
    $("#price-input-" + i + "+ .checkbox-label").width(i * 20);
  }
});
