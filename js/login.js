

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    let usersStr = getCookie("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    let foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
        alert("Login successful! Welcome back.");
        setCookie("loggedInUser", email, 7);
        
        if (rememberMe) {
            setCookie("rememberedEmail", email, 7);
            setCookie("rememberedPassword", password, 7); // save password
        } else {
            deleteCookie("rememberedEmail");
            deleteCookie("rememberedPassword");
        }
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
    
});

// Auto-fill email + password if saved
// Auto-fill when page loads
document.addEventListener("DOMContentLoaded", function() {
    const rememberedEmail = getCookie("rememberedEmail");
    const rememberedPassword = getCookie("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
        document.getElementById("email").value = rememberedEmail;
        document.getElementById("password").value = rememberedPassword;
        document.getElementById("rememberMe").checked = true;
    }

    // Auto-fill when user types the same remembered email
    document.getElementById("email").addEventListener("blur", function() {
        const enteredEmail = this.value.trim().toLowerCase();
        if (enteredEmail === rememberedEmail) {
            document.getElementById("password").value = rememberedPassword;
            document.getElementById("rememberMe").checked = true;
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = getCookie("loggedInUser");
    document.querySelectorAll(".myAccountLink").forEach(link => {
        if (loggedInUser && loggedInUser.trim() !== "") {
            link.setAttribute("href", "customer-loyalty.html");
        } else {
            link.setAttribute("href", "login.html");
        }
    });
});

    const images = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.carousel-dot');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    const carousel = document.querySelector('.carousel');

    let currentIndex = 0;
    let interval = setInterval(nextSlide, 3000);

    function showSlide(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(currentIndex);
    }

    // Arrow click handlers
    leftArrow.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    rightArrow.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    function resetAutoSlide() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 3000);
    }

    // Swipe Support for Mobile
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const delta = endX - startX;
        if (Math.abs(delta) > 50) { // Minimum swipe distance
            if (delta < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    }
