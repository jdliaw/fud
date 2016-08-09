showReview = function(reviewDiv) {
  $('.review.active').removeClass('active');
  $('#' + reviewDiv).addClass('active');
  console.log(reviewDiv);
}

showSubNav = function() {
  $('.sub-nav').addClass('active'); 
}