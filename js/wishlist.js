function initWishlist() {
    // Initialize wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateFavoriteCounter(wishlist.length);

    $('.js-addwish-b2, .js-addwish-detail').on('click', function (e) {
        e.preventDefault();
    });

    // Grid/list page wishlist buttons
    $('.js-addwish-b2').each(function () {
        var $this = $(this);
        var nameProduct = $this.parent().parent().find('.js-name-b2').html();
        var productPrice = $this.parent().parent().find('.stext-105').html();
        var productImage = $this.parent().parent().parent().find('img').attr('src');
        var productLink = $this.parent().parent().parent().find('a').attr('href');

        $this.on('click', function () {
            addToWishlist({
                name: nameProduct,
                price: productPrice,
                image: productImage,
                link: productLink
            });

            swal(nameProduct, "is added to wishlist!", "success");
            $this.addClass('js-addedwish-b2');
            $this.off('click');
        });
    });

    // Quick view / product detail wishlist buttons
    $('.js-addwish-detail').each(function () {
        var $this = $(this);
        var nameProduct = $this.closest('.p-r-50').find('.js-name-detail').html();
        var productPrice = $this.closest('.p-r-50').find('.mtext-106').html();
        var productImage = $this.closest('.bg0').find('.wrap-pic-w img').attr('src');
        var productLink = window.location.href;

        $this.on('click', function () {
            addToWishlist({
                name: nameProduct,
                price: productPrice,
                image: productImage,
                link: productLink
            });

            swal(nameProduct, "is added to wishlist!", "success");
            $this.addClass('js-addedwish-detail');
            $this.off('click');
        });
    });

    // Restore states after page load
    restoreWishlistButtonStates();
}

function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Prevent duplicate
    const exists = wishlist.some(item => item.name === product.name);
    if (!exists) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateFavoriteCounter(wishlist.length);
    }
}

function removeFromWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.name !== productName);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateFavoriteCounter(wishlist.length);
    return wishlist;
}

function updateFavoriteCounter(count) {
    // Desktop header
    $('.icon-header-noti.js-show-wishlist')
        .attr('data-notify', count);

    // Mobile header (target the <a> directly, not child <i>)
    $('a[href="wishlist.html"].icon-header-noti')
        .attr('data-notify', count);
}

function loadWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let container = $("#wishlist-items");
    container.empty();

    if (wishlist.length === 0) {
        container.append('<p class="stext-102 cl6 txt-center w-100">Your wishlist is empty.</p>');
        return;
    }

    wishlist.forEach(item => {
        container.append(`
            <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 wishlist-item">
                <div class="block2">
                    <div class="block2-pic hov-img0">
                        <a href="${item.link || '#'}">
                            <img src="${item.image}" alt="${item.name}">
                        </a>
                        <div class="block2-btn w-full flex-col-c-m">
                            <button class="btn-remove-wishlist flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04" 
                                    data-name="${item.name}">
                                Remove
                            </button>
                        </div>
                    </div>
                    <div class="block2-txt flex-w flex-t p-t-14">
                        <div class="block2-txt-child1 flex-col-l">
                            <a href="${item.link || '#'}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">${item.name}</a>
                            <span class="stext-105 cl3">${item.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    // Attach remove listeners
    $('.btn-remove-wishlist').on('click', function () {
        const productName = $(this).data('name');
        removeFromWishlist(productName);
        loadWishlist();
        restoreWishlistButtonStates(); // sync buttons
    });
}

function restoreWishlistButtonStates() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Grid/list buttons
    $('.js-addwish-b2').each(function () {
        var nameProduct = $(this).parent().parent().find('.js-name-b2').html();
        const isInWishlist = wishlist.some(item => item.name === nameProduct);
        if (isInWishlist) {
            $(this).addClass('js-addedwish-b2');
            $(this).off('click');
        }
    });

    // Quick view / modal buttons
    $('.js-addwish-detail').each(function () {
        var nameProduct = $(this).closest('.p-r-50').find('.js-name-detail').html();
        const isInWishlist = wishlist.some(item => item.name === nameProduct);
        if (isInWishlist) {
            $(this).addClass('js-addedwish-detail');
            $(this).off('click');
        }
    });
}

function initFavoriteCounter() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateFavoriteCounter(wishlist.length);
}

// Run on every page load
$(document).ready(function () {
    initWishlist();
    initFavoriteCounter();

    // Re-check button states when quick view modal opens
    $(document).on('shown.bs.modal', '.js-modal1', function () {
        restoreWishlistButtonStates();
    });
});
