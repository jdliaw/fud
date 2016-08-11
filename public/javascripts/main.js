showReview = function (reviewDiv) {
  $('.review.active').removeClass('active');
  $('.review-placeholder').addClass('active');
  console.log(reviewDiv);

  // Grab the template script
  var reviewTemplateScript = $("#review-template").html();

  // Compile the template
  var reviewTemplate = Handlebars.compile(reviewTemplateScript);


  // Define our data object
  /*
  Ideally, we would run a query in MongoDB to get our "data", like:
  data = db.users.find( { title: reviewDiv } );
  and of course run our validation checks of the sorts, and then populate HTML w/ handlebars.
  Here, we just have some placeholder, fake DB with some placeholder get function that gives us our data.
  */
  data = {
    "title": "Rigoberto's",
    "address": "7094 Miramar Rd, San Diego, CA 92121",
    "rating": "✮✮✮✮✮",
    "category": "Mexican, Cali Burritos, Fries",
    "price": "$",
    "content": "<p>Hello World </p> <p>Paragraph2</p>"
  };

  // Pass our data to the template
  var theCompiledHtml = reviewTemplate(data);

  // Add the compiled html to the page
  $('.review-placeholder').html(theCompiledHtml);

  $('.review').animate({ scrollTop: 0 }, 100);
}

showSubNav = function () {
  $('.sub-nav').addClass('active');
}