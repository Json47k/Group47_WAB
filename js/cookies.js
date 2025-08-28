// Cookie functions
function setCookie(name, value, days) {
    let cookieString = name + "=" + value + ";path=/;SameSite=Lax";
    
    if (days > 0) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        cookieString += ";expires=" + d.toUTCString();
        console.log("Cookie set:", name, value, "expires:", d.toUTCString());
    } else {
        // Session cookie - expires when browser closes
        console.log("Session cookie set:", name, value, "(expires when browser closes)");
    }
    
    document.cookie = cookieString;
    console.log("All cookies after setting:", document.cookie);
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    console.log("Looking for cookie:", name);
    console.log("All cookies:", decodedCookie);
    console.log("Cookie array:", cookieArray);
    
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        console.log("Checking cookie:", cookie, "against:", cookieName);
        if (cookie.indexOf(cookieName) === 0) {
            const value = cookie.substring(cookieName.length, cookie.length);
            console.log("Found cookie value:", value);
            return value;
        }
    }
    console.log("Cookie not found:", name);
    return "";
}

function checkCookieConsent() {
    let cookieConsent = getCookie("cookieConsent");
    const banner = document.getElementById("cookieBanner");
    
    console.log("=== COOKIE DEBUG ===");
    console.log("Cookie consent value:", cookieConsent);
    console.log("Banner element found:", !!banner);
    console.log("All cookies:", document.cookie);
    
    if (!banner) {
        console.error("Cookie banner element not found!");
        return;
    }
    
    console.log("Banner current display:", banner.style.display);
    
    // Check if user has already made a choice in this session
    const sessionChoice = sessionStorage.getItem("cookieChoiceMade");
    
    if (cookieConsent === "" || cookieConsent === null) {
        if (sessionChoice === "true") {
            // User already made a choice in this session, hide banner
            console.log("User already made choice in this session, hiding banner");
            banner.style.display = "none";
        } else {
            // Show the cookie banner if no consent has been given
            console.log("Showing cookie banner");
            banner.style.display = "block";
            console.log("Banner display after setting:", banner.style.display);
        }
    } else {
        // Hide the banner if consent was already given or rejected
        console.log("Hiding cookie banner. Consent:", cookieConsent);
        banner.style.display = "none";
        
        // Load tracking scripts if accepted
        if (cookieConsent === "accepted") {
            loadTrackingScripts();
        }
    }
    console.log("=== END COOKIE DEBUG ===");
}

function loadTrackingScripts() {
    // This is where you would load Google Analytics, Facebook Pixel, etc.
    console.log("Loading tracking scripts...");
    // Example: Load Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
}

// Handle cookie acceptance
function acceptCookies() {
    console.log("Accepting cookies");
    // Use session cookies - they expire when browser closes
    setCookie("cookieConsent", "accepted", 0);
    setCookie("analyticsCookies", "true", 0);
    setCookie("marketingCookies", "true", 0);
    setCookie("preferenceCookies", "true", 0);
    
    // Mark that user has made a choice in this session
    sessionStorage.setItem("cookieChoiceMade", "true");
    
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        banner.style.display = "none";
    }
    loadTrackingScripts();
    showCookieMessage("Cookie preferences accepted. Thank you!");
}

// Handle cookie rejection
function rejectCookies() {
    console.log("Rejecting cookies");
    // Use session cookies - they expire when browser closes
    setCookie("cookieConsent", "rejected", 0);
    setCookie("analyticsCookies", "false", 0);
    setCookie("marketingCookies", "false", 0);
    setCookie("preferenceCookies", "false", 0);
    
    // Mark that user has made a choice in this session
    sessionStorage.setItem("cookieChoiceMade", "true");
    
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        banner.style.display = "none";
    }
    showCookieMessage("Cookie preferences saved. Necessary cookies only.");
}

function saveCookiePreferences() {
    const analytics = document.getElementById("analyticsCookies").checked ? "true" : "false";
    const marketing = document.getElementById("marketingCookies").checked ? "true" : "false";
    const preferences = document.getElementById("preferenceCookies").checked ? "true" : "false";
    
    // Use session cookies - they expire when browser closes
    setCookie("cookieConsent", "custom", 0);
    setCookie("analyticsCookies", analytics, 0);
    setCookie("marketingCookies", marketing, 0);
    setCookie("preferenceCookies", preferences, 0);
    
    // Mark that user has made a choice in this session
    sessionStorage.setItem("cookieChoiceMade", "true");
    
    document.getElementById("cookieModal").style.display = "none";
    document.getElementById("cookieBanner").style.display = "none";
    
    if (analytics === "true" || marketing === "true") {
        loadTrackingScripts();
    }
    
    showCookieMessage("Cookie preferences saved successfully!");
}

function showCookieMessage(message) {
    // Create a temporary message to show the user their preference was saved
    const messageDiv = document.createElement("div");
    messageDiv.style.position = "fixed";
    messageDiv.style.bottom = "20px";
    messageDiv.style.right = "20px";
    messageDiv.style.backgroundColor = "#333";
    messageDiv.style.color = "#fff";
    messageDiv.style.padding = "10px 20px";
    messageDiv.style.borderRadius = "4px";
    messageDiv.style.zIndex = "10000";
    messageDiv.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// Initialize cookie consent when DOM is loaded
function initCookieConsent() {
    console.log("=== INITIALIZING COOKIE CONSENT ===");
    console.log("DOM ready state:", document.readyState);
    console.log("Cookie banner element exists:", !!document.getElementById("cookieBanner"));
    
    // Check cookie consent on page load
    checkCookieConsent();

    // Update cart and wishlist counts if functions exist
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    if (typeof updateWishlistCount === 'function') {
        updateWishlistCount();
    }
    
    // Add event listeners to the buttons if they exist
    const acceptButton = document.getElementById("cookieAccept");
    const declineButton = document.getElementById("cookieDecline");
    const settingsButton = document.getElementById("cookieSettings");
    const modalSave = document.getElementById("modalSave");
    const modalCancel = document.getElementById("modalCancel");
    const policyLink = document.getElementById("cookiePolicyLink");
    
    if (acceptButton) {
        acceptButton.addEventListener("click", acceptCookies);
        console.log("Accept button found and event listener added");
    } else {
        console.error("Accept button not found!");
    }
    
    if (declineButton) {
        declineButton.addEventListener("click", rejectCookies);
        console.log("Decline button found and event listener added");
    } else {
        console.error("Decline button not found!");
    }
    
    if (settingsButton) {
        settingsButton.addEventListener("click", function() {
            document.getElementById("cookieModal").style.display = "flex";
        });
        console.log("Settings button found and event listener added");
    } else {
        console.error("Settings button not found!");
    }
    
    if (modalSave) {
        modalSave.addEventListener("click", saveCookiePreferences);
        console.log("Modal save button found and event listener added");
    } else {
        console.error("Modal save button not found!");
    }
    
    if (modalCancel) {
        modalCancel.addEventListener("click", function() {
            document.getElementById("cookieModal").style.display = "none";
        });
        console.log("Modal cancel button found and event listener added");
    } else {
        console.error("Modal cancel button not found!");
    }
    
    if (policyLink) {
        policyLink.addEventListener("click", function(e) {
            e.preventDefault();
            // You can implement a full cookie policy page here
            alert("Cookie Policy: We use cookies to improve your experience...");
        });
        console.log("Policy link found and event listener added");
    } else {
        console.error("Policy link not found!");
    }
    
    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("cookieModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Handle browser back/forward navigation
window.addEventListener('pageshow', function(event) {
    // Check if page is loaded from cache (back/forward navigation)
    if (event.persisted) {
        checkCookieConsent();
    }
});

// Also handle visibility changes (tab switching)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        checkCookieConsent();
    }
});

// ------------------------------
// CART FUNCTIONS
// ------------------------------
function addToCart(productId, quantity = 1) {
    const consent = getCookie("cookieConsent");
    if (consent !== "accepted") {
        console.warn("Cart not saved - cookies rejected or not accepted");
        return;
    }

    let cart = JSON.parse(getCookie("cart") || "[]");

    // Check if item already exists
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += quantity;
    } else {
        cart.push({ id: productId, qty: quantity });
    }

    setCookie("cart", JSON.stringify(cart), 7); // store cart for 7 days
    updateCartCount();
    console.log("Cart updated:", cart);
}

function getCart() {
    return JSON.parse(getCookie("cart") || "[]");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// ------------------------------
// WISHLIST FUNCTIONS
// ------------------------------
function addToWishlist(productId) {
    const consent = getCookie("cookieConsent");
    if (consent !== "accepted") {
        console.warn("Wishlist not saved - cookies rejected or not accepted");
        return;
    }

    let wishlist = JSON.parse(getCookie("wishlist") || "[]");

    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        setCookie("wishlist", JSON.stringify(wishlist), 7);
    }

    updateWishlistCount();
    console.log("Wishlist updated:", wishlist);
}

function getWishlist() {
    return JSON.parse(getCookie("wishlist") || "[]");
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const wishlistCountElement = document.getElementById("wishlistCount");
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
    }
}

// Initialize when DOM is fully loaded
console.log("=== COOKIE SCRIPT LOADED ===");
console.log("Document ready state:", document.readyState);



if (document.readyState === 'loading') {
    console.log("DOM is still loading, adding event listener");
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOMContentLoaded event fired");
        initCookieConsent();
    });
} else {
    console.log("DOM is already loaded, initializing immediately");
    initCookieConsent();
}

// Function to clear cookies for testing (can be called from browser console)
function clearCookieConsent() {
    setCookie("cookieConsent", "", -1);
    setCookie("analyticsCookies", "", -1);
    setCookie("marketingCookies", "", -1);
    setCookie("preferenceCookies", "", -1);
    
    // Also clear sessionStorage for testing
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem("cookieChoiceMade");
    }
    
    console.log("Cookie consent cleared (cookies + sessionStorage). Refresh the page to see the banner again.");
}

// Function to manually show cookie banner for testing
function showCookieBanner() {
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        banner.style.display = "block";
        console.log("Cookie banner manually shown");
    } else {
        console.error("Cookie banner element not found");
    }
}

// Function to manually hide cookie banner for testing
function hideCookieBanner() {
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        banner.style.display = "none";
        console.log("Cookie banner manually hidden");
    } else {
        console.error("Cookie banner element not found");
    }
}

// Function to test if cookies are working
function testCookies() {
    console.log("=== TESTING COOKIES ===");
    console.log("Current cookies:", document.cookie);
    
    // Test setting a cookie
    setCookie("testCookie", "testValue", 1);
    
    // Test reading the cookie
    const testValue = getCookie("testCookie");
    console.log("Test cookie value:", testValue);
    
    if (testValue === "testValue") {
        console.log("✅ Cookies are working!");
    } else {
        console.log("❌ Cookies are NOT working!");
        console.log("This might be due to:");
        console.log("- Browser privacy settings");
        console.log("- Incognito/private browsing mode");
        console.log("- Third-party cookie blocking");
        console.log("- HTTPS requirements");
    }
    
    // Clean up test cookie
    setCookie("testCookie", "", -1);
    console.log("=== END COOKIE TEST ===");
}

// Function to force show cookie banner (for debugging)
function forceShowCookieBanner() {
    console.log("=== FORCING COOKIE BANNER TO SHOW ===");
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        banner.style.display = "block";
        console.log("✅ Cookie banner forced to show");
    } else {
        console.error("❌ Cookie banner element not found!");
    }
}

// Function to check cookie banner status
function checkCookieBannerStatus() {
    console.log("=== CHECKING COOKIE BANNER STATUS ===");
    const banner = document.getElementById("cookieBanner");
    if (banner) {
        console.log("✅ Cookie banner element found");
        console.log("Display style:", banner.style.display);
        console.log("Computed display:", window.getComputedStyle(banner).display);
        console.log("Visibility:", window.getComputedStyle(banner).visibility);
    } else {
        console.error("❌ Cookie banner element not found!");
    }
    
    // Check cookie consent
    const cookieConsent = getCookie("cookieConsent");
    const localConsent = localStorage.getItem("cookieConsent");
    console.log("Cookie consent:", cookieConsent);
    console.log("localStorage consent:", localConsent);
}