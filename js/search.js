function performSearch() {
    var searchText = $('#searchInput').val().toLowerCase().trim();
    var foundResults = false;

    // Get the active filter (default is "*")
    var currentFilter = $('.filter-tope-group .how-active1').attr('data-filter') || '*';

    // Start with the Isotope filter
    var $grid = $('.isotope-grid');
    var $items = $grid.find('.isotope-item');

    // Reset if search box is empty
    if (searchText === '') {
        $grid.isotope({ filter: currentFilter }); // restore current filter
        return;
    }

    // Apply search only to items in the current filter
    $items.each(function () {
        var $item = $(this);

        // check if this item passes current filter
        if (currentFilter !== '*' && !$item.is(currentFilter)) {
            $item.hide(); // skip items outside the filter
            return;
        }

        var productName = $item.find('.js-name-b2').text().toLowerCase();
        if (productName.indexOf(searchText) !== -1) {
            $item.show();
            foundResults = true;
        } else {
            $item.hide();
        }
    });

    if (!foundResults) {
        // use SweetAlert if available, else default alert
        if (typeof swal === "function") {
            swal("No results found", "Please search product based on the category.", "warning");
        } else {
            alert("No results found. Please search product based on the category.");
        }
    }

    $grid.isotope('layout');
}

function initSearch() {
    $('#searchInput').on('keyup', function (e) {
        if (e.key === "Enter") {  // only search on Enter key
            performSearch();
        }
    });

    $('#searchButton').on('click', function (e) {
        e.preventDefault();
        performSearch();
    });
}

document.addEventListener("DOMContentLoaded", initSearch);