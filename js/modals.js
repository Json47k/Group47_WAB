function showModal(modalNumber) {
    $('.js-modal' + modalNumber).addClass('show-modal1');
}

function hideModal(modalNumber) {
    $('.js-modal' + modalNumber).removeClass('show-modal1');
}

function initModals() {
    for (let i = 1; i <= 8; i++) {
        $('.js-show-modal' + i).on('click', function(e){
            e.preventDefault();
            showModal(i);
        });

        $('.js-hide-modal' + i).on('click', function(){
            hideModal(i);
        });
    }

    $(document).on('click', function(e) {
        if ($(e.target).hasClass('overlay-modal1')) {
            $('.wrap-modal1').removeClass('show-modal1');
        }
    });

    $(document).on('keyup', function(e) {
        if (e.key === "Escape") {
            $('.wrap-modal1').removeClass('show-modal1');
        }
    });
}