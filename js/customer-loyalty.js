//copy button

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert("Copied: " + code);
  });
}

document.addEventListener("DOMContentLoaded", function () { 
  const userEmail = getCookie("loggedInUser"); 
  if (!userEmail) { window.location.href = "login.html"; 
    return; 
  }

  const defaultUserData = {
    points: 100,
    coupons: [
      { title: '10% Discount', code: 'WlcDIScounT10' },
      { title: 'RM5 Off', code: '5StarSAVE' },
      { title: 'RM 10 off above RM50', code: 'TreatYours50' }
    ],
    rewardHistory: [
      { date: '2025-08-15', activity: 'Redeemed $5 Voucher', points: -50, status: 'Success' },
      { date: '2025-08-18', activity: 'Earned from Purchase', points: +100, status: 'Success' },
      { date: '2025-08-20', activity: 'Redeemed 10% Coupon', points: -20, status: 'Success' }
    ]
  };

  function loadUserData() {
    const storedData = localStorage.getItem('userData_' + userEmail);
    return storedData ? JSON.parse(storedData) : defaultUserData;
  }
  function saveUserData(data) {
    localStorage.setItem('userData_' + userEmail, JSON.stringify(data));
  }
  function updateCouponsTable(userData) {
    const couponTable = document.querySelector('.coupon-table table tbody');
    couponTable.innerHTML = '';
    userData.coupons.forEach(coupon => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${coupon.title}</td>
        <td>${coupon.code}</td>
        <td><button class="copy-btn" onclick="copyCode('${coupon.code}')">Copy</button></td>
      `;
      couponTable.appendChild(row);
    });
  }
  function updatePointsBalance(userData) {
    const pointsBox = document.querySelector('.points-box .points-number');
    pointsBox.innerText = userData.points;
  }
  function updatePointsHistory(userData) {
    const pointsHistoryTable = document.querySelector('.points-history-table tbody');
    pointsHistoryTable.innerHTML = '';
    userData.rewardHistory.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.activity}</td>
        <td>${entry.points}</td>
        <td>${entry.status}</td>
      `;
      pointsHistoryTable.appendChild(row);
    });
  }
  function redeemPoints(pointsRequired, rewardTitle) {
    let userData = loadUserData();
    if (userData.points >= pointsRequired) {
      userData.points -= pointsRequired;
      userData.rewardHistory.push({
        date: new Date().toISOString().split('T')[0],
        activity: `Redeemed ${rewardTitle}`,
        points: -pointsRequired,
        status: 'Success'
      });
      // Add coupon for reward:
      userData.coupons.push({ title: rewardTitle, code: rewardTitle.replace(/\s+/g, "").toUpperCase() + "2025" });

      saveUserData(userData);
      updatePointsBalance(userData);
      updatePointsHistory(userData);
      updateCouponsTable(userData);
      alert(`Successfully redeemed ${rewardTitle}`);
    } else {
      alert('Not enough points!');
    }
  }
  // Attach redeem functionality to buttons
  document.querySelectorAll('.redeem-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.redeem-item');
      const rewardTitle = item.querySelector('.reward-title').textContent.trim();
      const pointsRequired = parseInt(item.querySelector('.reward-points').textContent.trim().split(' ')[0]);
      redeemPoints(pointsRequired, rewardTitle);
    });
  });

  // Function to add a coupon (if needed elsewhere)
  function addCoupon(newCoupon) {
    const userData = loadUserData();
    userData.coupons.push(newCoupon);
    saveUserData(userData);
    updateCouponsTable(userData);
  }

  // Initialize
  let userData = loadUserData();
  updateCouponsTable(userData);
  updatePointsBalance(userData);
  updatePointsHistory(userData);

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      // Clear cookies
      deleteCookie("loggedInUser");

      // Clear localStorage too (if you ever used it before)
      localStorage.removeItem("loggedInUser");

      // Redirect to login page
      window.location.href = "login.html";
    });
  }
  function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
});

//popover logic
// Popover logic
const popover = document.getElementById('popover');
const popoverText = document.getElementById('popover-text');
let lastBtn = null;

document.querySelectorAll('.popover-trigger').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    const rect = btn.getBoundingClientRect();
    popoverText.textContent = btn.getAttribute('data-detail');
    popover.style.display = 'block';
    popover.classList.add('show');

    // Calculate position (centers BELOW the button)
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    let left = rect.left + rect.width/2 + scrollX;
    let top = rect.bottom + scrollY + 12; // 12px space below

    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    
    lastBtn = btn;
  });
});

// Hide popover when clicking outside
document.addEventListener('click', function(){
  popover.classList.remove('show');
  setTimeout(()=>popover.style.display='none', 120);
});

// Optional: Hide popover on scroll or resize
window.addEventListener('scroll', () => {
  popover.classList.remove('show');
  setTimeout(()=>popover.style.display='none', 120);
});
window.addEventListener('resize', () => {
  popover.classList.remove('show');
  setTimeout(()=>popover.style.display='none', 120);
});
