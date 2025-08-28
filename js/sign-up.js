
    // --- Signup Logic for multiple users---
    function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,12}$/;
    return regex.test(password);
}

document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
    }

    if (!isValidPassword(password)) {
        errorMsg.textContent = "Password must be 8–12 characters, with uppercase, lowercase, number, and special character.";
        return;
    }

    let users = JSON.parse(getCookie("users") || "[]");
    if (users.some(u => u.email === email)) {
        errorMsg.textContent = "Account with this email already exists.";
        return;
    }
    users.push({ email, password });
    setCookie("users", JSON.stringify(users), 30);

    // Initial loyalty data for this user
    setCookie(`userData_${email}`, JSON.stringify({
        points: 100,
        coupons: [],
        rewardHistory: []
    }), 30);

    alert("Account created successfully! Please log in.");
    window.location.href = "login.html";
});

//show password
document.addEventListener("DOMContentLoaded", function () {
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const showPassword = document.getElementById("showPassword");

    showPassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        newPassword.type = type;
        confirmPassword.type = type;
    });
});


    //for image in showing for the left hand part
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
