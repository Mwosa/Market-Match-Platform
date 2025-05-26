// === SIMULATED SUPABASE DATA ===
const mockData = {
    marketPrices: {
        tomatoes: { price: 52, change: +7, market: "Gikomba Market", trend: "rising", lastUpdated: "2 hours ago" },
        maize: { price: 38, change: -3, market: "Marikiti Market", trend: "falling", lastUpdated: "1 hour ago" },
        beans: { price: 85, change: +12, market: "Kawangware Market", trend: "rising", lastUpdated: "3 hours ago" },
        potatoes: { price: 25, change: +2, market: "Wakulima Market", trend: "stable", lastUpdated: "30 minutes ago" },
        kales: { price: 15, change: -1, market: "City Market", trend: "stable", lastUpdated: "45 minutes ago" },
        onions: { price: 65, change: +8, market: "Gikomba Market", trend: "rising", lastUpdated: "1 hour ago" },
        carrots: { price: 42, change: +5, market: "Marikiti Market", trend: "rising", lastUpdated: "2 hours ago" }
    },
    buyers: {
        tomatoes: [
            { name: "Green Valley Suppliers", location: "Kiambu (5km away)", phone: "+254712345678", quantity: "500kg weekly", rating: 4.8 },
            { name: "Fresh Market Co.", location: "Thika (12km away)", phone: "+254723456789", quantity: "300kg weekly", rating: 4.6 },
            { name: "Farm2Table Ltd", location: "Nairobi CBD (25km away)", phone: "+254734567890", quantity: "1000kg weekly", rating: 4.9 }
        ],
        maize: [
            { name: "Grain Traders Kenya", location: "Nakuru (8km away)", phone: "+254745678901", quantity: "2 tons monthly", rating: 4.7 },
            { name: "Unga Millers", location: "Eldoret (15km away)", phone: "+254756789012", quantity: "5 tons monthly", rating: 4.5 }
        ],
        beans: [
            { name: "Protein Palace", location: "Meru (10km away)", phone: "+254767890123", quantity: "800kg weekly", rating: 4.6 },
            { name: "Healthy Foods Co.", location: "Embu (18km away)", phone: "+254778901234", quantity: "400kg weekly", rating: 4.4 }
        ],
        potatoes: [
            { name: "Spud Central", location: "Nyandarua (7km away)", phone: "+254789012345", quantity: "1.5 tons weekly", rating: 4.8 },
            { name: "Potato Plus Ltd", location: "Kinangop (12km away)", phone: "+254790123456", quantity: "800kg weekly", rating: 4.3 }
        ],
        kales: [
            { name: "Leafy Greens Co.", location: "Kiambu (6km away)", phone: "+254701234567", quantity: "200kg daily", rating: 4.7 },
            { name: "Vegetable Vendors", location: "Ruiru (9km away)", phone: "+254712345679", quantity: "150kg daily", rating: 4.5 }
        ],
        onions: [
            { name: "Bulb Buyers Ltd", location: "Nakuru (11km away)", phone: "+254723456780", quantity: "600kg weekly", rating: 4.6 },
            { name: "Onion Express", location: "Naivasha (16km away)", phone: "+254734567891", quantity: "400kg weekly", rating: 4.2 }
        ],
        carrots: [
            { name: "Orange Harvest Co.", location: "Nyandarua (8km away)", phone: "+254745678902", quantity: "700kg weekly", rating: 4.9 },
            { name: "Root Vegetables Ltd", location: "Kinangop (14km away)", phone: "+254756789013", quantity: "500kg weekly", rating: 4.4 }
        ]
    }
};

// === GLOBAL STATE ===
let currentUser = {
    name: '',
    location: '',
    primaryProduce: '',
    targetPrice: 45
};

// === DOM ELEMENTS ===
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const findBuyersBtn = document.getElementById('findBuyersBtn');
const refreshPricesBtn = document.getElementById('refreshPricesBtn');
const buyersSection = document.getElementById('buyersSection');
const productSwitch = document.getElementById('productSwitch');

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing session
    localStorage.removeItem('farmConnectUser');
    
    // Add event listener for product switching
    productSwitch.addEventListener('change', handleProductSwitch);
});

loginForm.addEventListener('submit', handleLogin);
findBuyersBtn.addEventListener('click', showBuyers);
refreshPricesBtn.addEventListener('click', refreshMarketData);

// === PRODUCT SWITCHING FUNCTIONALITY ===
function handleProductSwitch(e) {
    currentUser.primaryProduce = e.target.value;
    // Update localStorage
    localStorage.setItem('farmConnectUser', JSON.stringify(currentUser));
    // Refresh market data with new product
    loadMarketData();
    // Clear any existing buyers section
    buyersSection.style.display = 'none';
    buyersList.innerHTML = '';
}

// === LOGIN FUNCTIONALITY ===
async function handleLogin(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtnText');
    const loader = document.getElementById('loginLoader');
    
    // Show loading state
    loginBtn.classList.add('hidden');
    loader.classList.remove('hidden');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get form data
    const formData = new FormData(loginForm);
    currentUser = {
        name: formData.get('farmerName'),
        location: formData.get('location'),
        primaryProduce: formData.get('primaryProduce'),
        targetPrice: 45
    };
    
    // Save to localStorage (simulate session)
    localStorage.setItem('farmConnectUser', JSON.stringify(currentUser));
    
    // Show dashboard
    showDashboard();
}

// === DASHBOARD FUNCTIONALITY ===
function showDashboard() {
    loginPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    
    // Update welcome message
    document.getElementById('welcomeName').textContent = currentUser.name;
    
    // Set the product switcher to current product
    productSwitch.value = currentUser.primaryProduce;
    
    // Load market data
    loadMarketData();
}

async function loadMarketData() {
    try {
        // Simulate API loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const produceData = mockData.marketPrices[currentUser.primaryProduce];
        
        if (!produceData) {
            throw new Error('Produce data not found');
        }
        
        // Update price display
        document.getElementById('currentPrice').textContent = `KES ${produceData.price}/kg`;
        
        // Update price change indicator
        const changeElement = document.getElementById('priceChange');
        const changeText = produceData.change > 0 ? `+${produceData.change}` : `${produceData.change}`;
        changeElement.textContent = `${changeText} from yesterday`;
        changeElement.className = `price-change ${produceData.change >= 0 ? 'price-up' : 'price-down'}`;
        
        // Update market info
        document.getElementById('marketInfo').textContent = 
            `${produceData.market} • Updated ${produceData.lastUpdated}`;
        
        // Update trend indicator
        const trendEmoji = {
            'rising': '📈',
            'falling': '📉',
            'stable': '➡️'
        };
        document.getElementById('trendIndicator').textContent = trendEmoji[produceData.trend];
        document.getElementById('trendDescription').textContent = 
            `Market is ${produceData.trend} this week`;
        
        // Check if price alert should be shown
        if (produceData.price >= currentUser.targetPrice) {
            showPriceAlert(produceData);
        }
        
        // Show market insights
        showMarketInsights(produceData);
        
    } catch (error) {
        console.error('Error loading market data:', error);
        showErrorAlert('Unable to fetch market data. Please try again.');
    }
}

// === ALERT SYSTEM ===
function showPriceAlert(produceData) {
    const alertsContainer = document.getElementById('alertsContainer');
    
    // Generate delightful AI message
    const messages = [
        `Hey ${currentUser.name}! Great news 🎉 ${capitalizeFirst(currentUser.primaryProduce)} are selling at KES ${produceData.price}/kg at ${produceData.market}. Sell now!`,
        `🚀 Exciting news, ${currentUser.name}! Your ${currentUser.primaryProduce} just hit KES ${produceData.price}/kg! Time to harvest those profits! 💰`,
        `✨ Amazing opportunity alert! ${capitalizeFirst(currentUser.primaryProduce)} prices soared to KES ${produceData.price}/kg. Your hard work is paying off! 🌟`,
        `🎯 Bullseye! ${currentUser.name}, ${currentUser.primaryProduce} prices are at KES ${produceData.price}/kg - above your target! Strike while the iron is hot! 🔥`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = randomMessage;
    
    alertsContainer.appendChild(alertDiv);
    
    // Auto-remove alert after 10 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}

function showMarketInsights(produceData) {
    const alertsContainer = document.getElementById('alertsContainer');
    
    let insightMessage = '';
    
    if (produceData.trend === 'rising') {
        insightMessage = `📊 Market insight: ${capitalizeFirst(currentUser.primaryProduce)} prices are trending upward! Consider holding for even better rates or sell now to secure good profits.`;
    } else if (produceData.trend === 'falling') {
        insightMessage = `📊 Market insight: ${capitalizeFirst(currentUser.primaryProduce)} prices are dropping. If you have stock ready, now might be a good time to sell.`;
    } else {
        insightMessage = `📊 Market insight: ${capitalizeFirst(currentUser.primaryProduce)} prices are stable. Consistent demand in the market - great for planning!`;
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info';
    alertDiv.innerHTML = insightMessage;
    
    alertsContainer.appendChild(alertDiv);
}

function showErrorAlert(message) {
    const alertsContainer = document.getElementById('alertsContainer');
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info';
    alertDiv.innerHTML = `⚠️ ${message}`;
    
    alertsContainer.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// === BUYERS FUNCTIONALITY ===
async function showBuyers() {
    const buyersSection = document.getElementById('buyersSection');
    const buyersList = document.getElementById('buyersList');
    
    // Show loading state
    findBuyersBtn.innerHTML = '<span class="loading"></span> Finding Buyers...';
    findBuyersBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const buyers = mockData.buyers[currentUser.primaryProduce] || [];
        
        if (buyers.length === 0) {
            buyersList.innerHTML = '<p>No buyers found for your produce in your area. Try expanding your search radius!</p>';
            return;
        }
        
        // Clear previous results
        buyersList.innerHTML = '';
        
        // Create buyer cards
        buyers.forEach(buyer => {
            const buyerCard = document.createElement('div');
            buyerCard.className = 'buyer-card';
            buyerCard.innerHTML = `
                <div class="buyer-name">${buyer.name} ⭐ ${buyer.rating}</div>
                <div class="buyer-details">
                    📍 ${buyer.location} • 📞 ${buyer.phone}<br>
                    📦 Looking for: ${buyer.quantity}
                </div>
                <button class="contact-btn" onclick="contactBuyer('${buyer.name}', '${buyer.phone}')">
                    📞 Contact Now
                </button>
            `;
            buyersList.appendChild(buyerCard);
        });
        
        // Show buyers section
        buyersSection.style.display = 'block';
        buyersSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error fetching buyers:', error);
        showErrorAlert('Unable to fetch buyers. Please try again.');
    } finally {
        // Reset button
        findBuyersBtn.innerHTML = '🔍 Find Nearby Buyers';
        findBuyersBtn.disabled = false;
    }
}

// === CONTACT BUYER ===
function contactBuyer(buyerName, phone) {
    const message = encodeURIComponent(
        `Hi ${buyerName}! I'm ${currentUser.name}, a farmer from ${currentUser.location}. I have quality ${currentUser.primaryProduce} available for sale. Can we discuss business?`
    );
    
    // Try to open WhatsApp first, fallback to SMS
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${message}`;
    const smsUrl = `sms:${phone}?body=${message}`;
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.click();
    
    // Show confirmation
    showErrorAlert(`📱 Opening chat with ${buyerName}...`);
}

// === REFRESH FUNCTIONALITY ===
async function refreshMarketData() {
    const btn = refreshPricesBtn;
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<span class="loading"></span> Refreshing...';
    btn.disabled = true;
    
    try {
        // Simulate market data refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add some randomness to prices to simulate real-time changes
        const produceData = mockData.marketPrices[currentUser.primaryProduce];
        const priceVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
        produceData.price += priceVariation;
        produceData.change = priceVariation;
        produceData.lastUpdated = 'Just now';
        
        // Reload the data
        await loadMarketData();
        
        showErrorAlert('✅ Market data refreshed successfully!');
        
    } catch (error) {
        console.error('Error refreshing data:', error);
        showErrorAlert('Unable to refresh market data. Please try again.');
    } finally {
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// === UTILITY FUNCTIONS ===
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// === ERROR HANDLING ===
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showErrorAlert('Something went wrong. Please refresh the page.');
}); 