// StreamHub Movie Platform - JavaScript Functionality
// Owner: Olawale Abdul-Ganiyu

// Global Variables
let walletBalance = 0;
let bitcoinBalance = 0.0003;
let currentMovie = null;
let isPlaying = false;
let currentWatchTime = 0;
let movieWatched = false;

// Movie Database (Demo content - in production, this would come from a licensed API)
const movies = [
    {
        id: 1,
        title: "The Dark Knight",
        year: 2008,
        platform: "Netflix",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        duration: "2h 32min",
        genre: "Action"
    },
    {
        id: 2,
        title: "Avengers: Endgame",
        year: 2019,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
        duration: "3h 1min",
        genre: "Action"
    },
    {
        id: 3,
        title: "Spider-Man: No Way Home",
        year: 2021,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=600&fit=crop",
        duration: "2h 28min",
        genre: "Action"
    },
    {
        id: 4,
        title: "Black Panther",
        year: 2018,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?w=400&h=600&fit=crop",
        duration: "2h 14min",
        genre: "Action"
    },
    {
        id: 5,
        title: "The Lion King",
        year: 2019,
        platform: "Disney",
        poster: "https://images.unsplash.com/photo-1454789548728-852299e2b0a1?w=400&h=600&fit=crop",
        duration: "1h 58min",
        genre: "Animation"
    },
    {
        id: 6,
        title: "Frozen II",
        year: 2019,
        platform: "Disney",
        poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
        duration: "1h 43min",
        genre: "Animation"
    },
    {
        id: 7,
        title: "Iron Man",
        year: 2008,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
        duration: "2h 6min",
        genre: "Action"
    },
    {
        id: 8,
        title: "Captain Marvel",
        year: 2019,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=600&fit=crop",
        duration: "2h 3min",
        genre: "Action"
    },
    {
        id: 9,
        title: "Stranger Things",
        year: 2022,
        platform: "Netflix",
        poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
        duration: "4 Seasons",
        genre: "Sci-Fi"
    },
    {
        id: 10,
        title: "The Witcher",
        year: 2021,
        platform: "Netflix",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
        duration: "2 Seasons",
        genre: "Fantasy"
    },
    {
        id: 11,
        title: "Moana",
        year: 2016,
        platform: "Disney",
        poster: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=600&fit=crop",
        duration: "1h 47min",
        genre: "Animation"
    },
    {
        id: 12,
        title: "Thor: Ragnarok",
        year: 2017,
        platform: "Marvel",
        poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
        duration: "2h 10min",
        genre: "Action"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    collectDeviceInfo();
    updateWalletDisplay();
    initializeVideoPlayer();
});

// Load movies into the grid
function loadMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.onclick = () => playMovie(movie);
        
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <span class="movie-platform">${movie.platform}</span>
                <p class="movie-year">${movie.year} | ${movie.duration} | ${movie.genre}</p>
            </div>
        `;
        
        moviesGrid.appendChild(movieCard);
    });
}

// Play movie
function playMovie(movie) {
    currentMovie = movie;
    movieWatched = false;
    currentWatchTime = 0;
    
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('mainVideo');
    
    // Set video source (using sample video for demo)
    // In production, this would connect to licensed streaming APIs
    video.src = "https://www.w3schools.com/html/mov_bbb.mp4";
    video.poster = movie.poster;
    
    modal.classList.add('active');
    video.play();
    isPlaying = true;
    
    // Start tracking watch time
    startWatchTracking();
    
    showNotification(`Now playing: ${movie.title}`);
}

// Close player
function closePlayer() {
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('mainVideo');
    
    video.pause();
    video.currentTime = 0;
    modal.classList.remove('active');
    
    // Credit user if they watched the movie (demo: after 10 seconds)
    if (currentWatchTime >= 10 && !movieWatched) {
        creditReward();
    }
    
    stopWatchTracking();
}

// Toggle play/pause
function togglePlayPause() {
    const video = document.getElementById('mainVideo');
    
    if (video.paused) {
        video.play();
        isPlaying = true;
    } else {
        video.pause();
        isPlaying = false;
    }
}

// Stop video
function stopVideo() {
    const video = document.getElementById('mainVideo');
    video.pause();
    video.currentTime = 0;
    isPlaying = false;
}

// Toggle fullscreen
function toggleFullscreen() {
    const video = document.getElementById('mainVideo');
    
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}

// Change volume
function changeVolume(value) {
    const video = document.getElementById('mainVideo');
    video.volume = value / 100;
}

// Toggle mute
function toggleMute() {
    const video = document.getElementById('mainVideo');
    video.muted = !video.muted;
}

// Seek video
function seekVideo(event) {
    const progressBar = document.getElementById('progressBar');
    const video = document.getElementById('mainVideo');
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
}

// Initialize video player
function initializeVideoPlayer() {
    const video = document.getElementById('mainVideo');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    
    video.addEventListener('timeupdate', function() {
        if (video.duration) {
            const percentage = (video.currentTime / video.duration) * 100;
            progressFill.style.width = percentage + '%';
        }
    });
    
    video.addEventListener('ended', function() {
        creditReward();
        closePlayer();
    });
}

// Track watch time
function startWatchTracking() {
    setInterval(() => {
        if (isPlaying) {
            currentWatchTime++;
        }
    }, 1000);
}

// Stop tracking
function stopWatchTracking() {
    isPlaying = false;
}

// Credit reward
function creditReward() {
    if (!movieWatched) {
        walletBalance += 50;
        movieWatched = true;
        updateWalletDisplay();
        showNotification('🎉 Congratulations! You earned $50 for watching this movie!');
    }
}

// Toggle wallet dropdown
function toggleWallet() {
    const dropdown = document.getElementById('walletDropdown');
    dropdown.classList.toggle('active');
}

// Switch tabs
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    if (tabName === 'withdraw') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('withdrawTab').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('bitcoinTab').classList.add('active');
    }
}

// Update wallet display
function updateWalletDisplay() {
    document.getElementById('walletBalance').textContent = walletBalance.toFixed(2);
    document.getElementById('bitcoinBalance').textContent = bitcoinBalance.toFixed(6);
}

// Process withdrawal
function processWithdrawal(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const purpose = document.getElementById('purpose').value;
    
    // Validate withdrawal amount
    if (amount > walletBalance) {
        showNotification('❌ Insufficient balance!', 'error');
        return;
    }
    
    if (amount < 50) {
        showNotification('❌ Minimum withdrawal is $50', 'error');
        return;
    }
    
    // Simulate processing withdrawal
    showNotification('⏳ Processing withdrawal...');
    
    setTimeout(() => {
        walletBalance -= amount;
        updateWalletDisplay();
        
        // Log withdrawal data
        const withdrawalData = {
            timestamp: new Date().toISOString(),
            fullName: fullName,
            bankName: bankName,
            accountNumber: accountNumber,
            phoneNumber: phoneNumber,
            amount: amount,
            purpose: purpose,
            status: 'processed'
        };
        
        console.log('Withdrawal processed:', withdrawalData);
        
        // Clear form
        document.getElementById('withdrawForm').reset();
        
        showNotification(`✅ $${amount} withdrawal successful! Amount will be credited to your ${bankName} account.`);
    }, 2000);
}

// Process Bitcoin withdrawal
function processBitcoinWithdrawal(event) {
    event.preventDefault();
    
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = parseFloat(document.getElementById('bitcoinAmount').value);
    
    // Validate Bitcoin amount
    if (amount > bitcoinBalance) {
        showNotification('❌ Insufficient Bitcoin balance!', 'error');
        return;
    }
    
    if (amount < 0.00001) {
        showNotification('❌ Minimum withdrawal is 0.00001 BTC', 'error');
        return;
    }
    
    // Validate Bitcoin address format
    if (!recipientAddress.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/)) {
        showNotification('❌ Invalid Bitcoin address format!', 'error');
        return;
    }
    
    // Simulate processing Bitcoin withdrawal
    showNotification('⏳ Processing Bitcoin transaction...');
    
    setTimeout(() => {
        bitcoinBalance -= amount;
        updateWalletDisplay();
        
        // Log Bitcoin transaction
        const bitcoinData = {
            timestamp: new Date().toISOString(),
            recipientAddress: recipientAddress,
            amount: amount,
            status: 'processed',
            network: 'bitcoin'
        };
        
        console.log('Bitcoin withdrawal processed:', bitcoinData);
        
        // Clear form
        document.getElementById('bitcoinWithdrawForm').reset();
        
        showNotification(`✅ ${amount} BTC sent successfully to ${recipientAddress.substring(0, 10)}...`);
    }, 3000);
}

// Collect device information
function collectDeviceInfo() {
    // Network information
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    document.getElementById('deviceNetwork').textContent = connection ? 
        `${connection.effectiveType} (${connection.downlink} Mbps)` : 'Unknown';
    
    // Device name and platform
    const ua = navigator.userAgent;
    let deviceName = 'Unknown Device';
    
    if (ua.match(/Android/i)) deviceName = 'Android Device';
    else if (ua.match(/iPhone|iPad|iPod/i)) deviceName = 'iOS Device';
    else if (ua.match(/Windows/i)) deviceName = 'Windows PC';
    else if (ua.match(/Mac/i)) deviceName = 'Macintosh';
    else if (ua.match(/Linux/i)) deviceName = 'Linux Device';
    
    document.getElementById('deviceName').textContent = deviceName;
    document.getElementById('devicePlatform').textContent = navigator.platform;
    document.getElementById('deviceScreen').textContent = `${window.screen.width}x${window.screen.height}`;
    
    // Log device info to cloud storage simulation
    const deviceInfo = {
        timestamp: new Date().toISOString(),
        userAgent: ua,
        deviceName: deviceName,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        network: connection ? connection.effectiveType : 'unknown',
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled
    };
    
    // In production, this would be sent to a secure cloud storage
    console.log('Device information collected:', deviceInfo);
    
    // Store in localStorage as demo
    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4caf50';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Copy Bitcoin address
document.getElementById('bitcoinAddress')?.addEventListener('click', function() {
    const address = this.textContent;
    navigator.clipboard.writeText(address).then(() => {
        showNotification('📋 Bitcoin address copied to clipboard!');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const walletContainer = document.querySelector('.wallet-container');
    if (!walletContainer.contains(event.target)) {
        document.getElementById('walletDropdown').classList.remove('active');
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePlayer();
    }
    
    if (event.key === ' ' && document.getElementById('playerModal').classList.contains('active')) {
        event.preventDefault();
        togglePlayPause();
    }
});

// Prevent right-click on page (optional security measure)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Console message for developers
console.log('%cStreamHub Platform', 'color: #e50914; font-size: 24px; font-weight: bold;');
console.log('%cOwner: Olawale Abdul-Ganiyu', 'color: #ffffff; font-size: 14px;');
console.log('%cPrivate Platform - Licensed Use Only', 'color: #ff9800; font-size: 12px;');