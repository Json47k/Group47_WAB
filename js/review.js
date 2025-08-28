// Rating stars functionality
function initRatingStars() {
    $('.item-rating').on('click', function() {
        var rating = $(this).data('rating');
        $('#ratingValue').val(rating);
        
        // Update star display
        $('.item-rating').removeClass('zmdi-star').addClass('zmdi-star-outline');
        for (var i = 1; i <= rating; i++) {
            $('.item-rating[data-rating="' + i + '"]').removeClass('zmdi-star-outline').addClass('zmdi-star');
        }
    });
}

// Function to generate star rating HTML
function getStarRating(rating) {
    var stars = '';
    var fullStars = Math.floor(rating);
    var halfStar = rating % 1 >= 0.5;
    
    for (var i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="zmdi zmdi-star"></i>';
        } else if (i === fullStars + 1 && halfStar) {
            stars += '<i class="zmdi zmdi-star-half"></i>';
        } else {
            stars += '<i class="zmdi zmdi-star-outline"></i>';
        }
    }
    
    return stars;
}

// Review form submission handling
function initReviewForm() {
    $('#reviewForm').on('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        var rating = $('#ratingValue').val();
        var review = $('#review').val();
        var name = $('#name').val();
        var email = $('#email').val();
        
        if (!rating || !review || !name || !email) {
            swal("Please complete all required fields", "", "warning");
            return false;
        }
        
        // Create new review element
        var newReview = `
            <div class="flex-w flex-t p-b-68 review-item">
                <div class="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                    <img src="images/avatar-01.jpg" alt="AVATAR">
                </div>
                <div class="size-207">
                    <div class="flex-w flex-sb-m p-b-17">
                        <span class="mtext-107 cl2 p-r-20">${name}</span>
                        <span class="fs-18 cl11">${getStarRating(rating)}</span>
                    </div>
                    <p class="stext-102 cl6">${review}</p>
                    <span class="stext-109 cl6 fs-12">Posted on ${new Date().toLocaleDateString()}</span>
                </div>
            </div>
        `;
        
        // Add new review to the list
        $('.review-list').prepend(newReview);
        
        // Update review count in tab
        var reviewCount = parseInt($('a[href="#reviews"]').text().match(/\d+/)[0]) + 1;
        $('a[href="#reviews"]').text('Reviews (' + reviewCount + ')');
        
        // Show success message
        $('.review-submitted').show();
        
        // Reset form
        $('#reviewForm')[0].reset();
        $('.item-rating').removeClass('zmdi-star').addClass('zmdi-star-outline');
        $('#ratingValue').val('');
        
        // Scroll to success message
        $('html, body').animate({
            scrollTop: $('.review-submitted').offset().top - 100
        }, 500);
        
        return false;
    });
}

// Initialize all review functionality
function initReviewSystem() {
    initRatingStars();
    initReviewForm();
}

// Document ready
$(document).ready(function() {
    initReviewSystem();
});