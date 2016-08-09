showReview = function(reviewDiv) {
  $('.review.active').removeClass('active');
  $('#' + reviewDiv).addClass('active');
}

showSubNav = function() {
  $('.sub-nav').addClass('active'); 
}