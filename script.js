// Initialize
let candlesLit = 3;
let isMuted = false;
const images = [
    'https://picsum.photos/800/800?random=1',
    'https://picsum.photos/800/800?random=2',
    'https://picsum.photos/800/800?random=3',
    'https://picsum.photos/800/800?random=4',
    'https://picsum.photos/800/800?random=5',
    'https://picsum.photos/800/800?random=6'
];

// Matrix Rain Effect
let canvas, ctx, matrixChars, drops;
let lastTime = 0;
const dropSpeed = 50; // Milliseconds between drops (tăng số này = chậm hơn)

function initMatrix() {
    canvas = document.getElementById('matrixCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters - HAPPY BIRTHDAY letters
    matrixChars = 'HAPPYBIRTHDAY'.split('');
    
    // Columns
    const fontSize = 24; // Tăng từ 16 lên 24
    const columns = canvas.width / fontSize;
    
    // Initialize drops
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    drawMatrix(0);
}

function drawMatrix(currentTime) {
    // Control animation speed
    if (currentTime - lastTime < dropSpeed) {
        requestAnimationFrame(drawMatrix);
        return;
    }
    lastTime = currentTime;
    
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Matrix text color
    ctx.fillStyle = '#4ecdc4';
    ctx.font = '32px monospace'; // Tăng từ 16px lên 24px
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 24; // Tăng từ 16 lên 24
        const y = drops[i] * 24; // Tăng từ 16 lên 24
        
        ctx.fillText(text, x, y);
        
        // Reset drop randomly
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
    
    requestAnimationFrame(drawMatrix);
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Recalculate columns and drops
        const fontSize = 24;
        const columns = canvas.width / fontSize;
        
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }
});

// Also handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Recalculate columns and drops
            const fontSize = 24;
            const columns = canvas.width / fontSize;
            
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }
    }, 100); // Small delay to ensure dimensions are updated
});

// Countdown and Intro Animation
function startCountdown() {
    let count = 3;
    const countdownEl = document.getElementById('countdown-number');
    
    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
            countdownEl.style.animation = 'none';
            setTimeout(() => {
                countdownEl.style.animation = 'countdownPulse 1s ease-in-out';
            }, 10);
        } else {
            clearInterval(countInterval);
            showIntroAnimation();
        }
    }, 1000);
}

function showIntroAnimation() {
    const introTexts = [
        'Happy',
        'Birthday',
        'to',
        'Phương Anh',
        '21+',
        '19/10/2004 ❤'
    ];
    
    let currentIndex = 0;
    
    showSection('intro-section');
    
    function showNextText() {
        if (currentIndex < introTexts.length) {
            const text = introTexts[currentIndex];
            
            // Create particle effect
            createTextParticles(text);
            
            setTimeout(() => {
                // Explode particles
                explodeParticles();
                currentIndex++;
                
                if (currentIndex < introTexts.length) {
                    setTimeout(showNextText, 800);
                } else {
                    setTimeout(() => {
                        showSection('welcome-section');
                    }, 1000);
                }
            }, 2000);
        }
    }
    
    showNextText();
}

// Create text from particles
function createTextParticles(text) {
    const introTextEl = document.getElementById('intro-text');
    introTextEl.innerHTML = '';
    
    // Create temporary canvas to get text shape
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Use fixed viewport dimensions to prevent recalculation
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const fontSize = Math.min(viewportWidth * 0.15, 130);
    
    tempCanvas.width = viewportWidth;
    tempCanvas.height = 300;
    
    tempCtx.font = `bold ${fontSize}px Arial`;
    tempCtx.fillStyle = 'white';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    
    // Get pixel data
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    introTextEl.appendChild(particleContainer);
    
    // Sample pixels and create particles
    const spacing = 8;
    const particles = [];
    
    for (let y = 0; y < tempCanvas.height; y += spacing) {
        for (let x = 0; x < tempCanvas.width; x += spacing) {
            const index = (y * tempCanvas.width + x) * 4;
            const alpha = pixels[index + 3];
            
            if (alpha > 128) {
                const particle = document.createElement('div');
                particle.className = 'particle gathering';
                
                // Calculate position relative to center
                const centerX = tempCanvas.width / 2;
                const centerY = tempCanvas.height / 2;
                const targetX = x - centerX;
                const targetY = y - centerY;
                
                // Random start position (scattered) - use fixed viewport
                const startX = (Math.random() - 0.5) * viewportWidth;
                const startY = (Math.random() - 0.5) * viewportHeight;
                
                particle.style.setProperty('--startX', `${startX}px`);
                particle.style.setProperty('--startY', `${startY}px`);
                particle.style.left = `calc(50% + ${targetX}px)`;
                particle.style.top = `calc(50% + ${targetY}px)`;
                
                particleContainer.appendChild(particle);
                particles.push({ element: particle, x: targetX, y: targetY });
            }
        }
    }
    
    // Show text after particles gather
    setTimeout(() => {
        const textDisplay = document.createElement('div');
        textDisplay.className = 'intro-text-display visible';
        textDisplay.textContent = text;
        introTextEl.appendChild(textDisplay);
    }, 800);
    
    // Store particles for explosion
    introTextEl.particles = particles;
}

// Explode particles
function explodeParticles() {
    const introTextEl = document.getElementById('intro-text');
    const textDisplay = introTextEl.querySelector('.intro-text-display');
    const particleContainer = introTextEl.querySelector('.particle-container');
    
    if (textDisplay) {
        textDisplay.classList.add('fade-out');
    }
    
    if (introTextEl.particles) {
        introTextEl.particles.forEach(({ element }) => {
            element.classList.remove('gathering');
            element.classList.add('exploding');
            
            // Random end position (scattered)
            const endX = (Math.random() - 0.5) * window.innerWidth * 1.5;
            const endY = (Math.random() - 0.5) * window.innerHeight * 1.5;
            
            element.style.setProperty('--endX', `${endX}px`);
            element.style.setProperty('--endY', `${endY}px`);
        });
        
        // Clean up
        setTimeout(() => {
            if (particleContainer) {
                particleContainer.remove();
            }
            if (textDisplay) {
                textDisplay.remove();
            }
        }, 800);
    }
}

// Create floating balloons (hearts)
function createBalloons() {
    const container = document.getElementById('balloons-container');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'];
    
    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon heart-balloon';
        balloon.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.fontSize = (Math.random() * 20 + 30) + 'px';
        balloon.style.animationDelay = Math.random() * 5 + 's';
        balloon.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(balloon);
    }
    
    // Create stars
    createStars();
}

// Create stars in the background
function createStars() {
    const container = document.getElementById('balloons-container');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = (Math.random() * 3 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.boxShadow = '0 0 ' + (Math.random() * 10 + 5) + 'px white';
        container.appendChild(star);
    }
}

// Create confetti (shooting stars)
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#4ecdc4', '#ffd93d', '#ff6b9d', '#9575cd', '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
        confetti.style.width = (Math.random() * 2 + 2) + 'px';
        confetti.style.height = confetti.style.width;
        container.appendChild(confetti);
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Start celebration
function startCelebration() {
    // Stop matrix rain
    stopMatrixRain();
    
    // Create hearts instead of balloons
    createBalloons();
    createConfetti();
    showSection('message-section');
}

// Stop matrix rain
function stopMatrixRain() {
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (matrixCanvas) {
        matrixCanvas.style.transition = 'opacity 1s ease-out';
        matrixCanvas.style.opacity = '0';
        
        // Remove after fade out
        setTimeout(() => {
            matrixCanvas.style.display = 'none';
        }, 1000);
    }
}

// Show gallery
function showGallery() {
    showSection('gallery-section');
}

// Show wishes with typewriter effect
function showWishes() {
    showSection('wishes-section');
    
    const wishes = [
        "Cảm ơn Phanh vì đã bên cạnh Đức suốt thời gian qua. Chúc Phanh sinh nhật vui vẻ nhé! 💖",
        "Chúc Phanh tuổi mới luôn xinh đẹp, rạng rỡ và thành công trong mọi lĩnh vực! 🎉",
        "Hy vọng tuổi mới Phanh sẽ sớm có được Đức 😜",
    ];
    
    let currentWishIndex = 0;
    
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.classList.add('typing');
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                element.classList.add('typed');
                currentWishIndex++;
                
                if (currentWishIndex < wishes.length) {
                    setTimeout(() => typeNextWish(), 500);
                } else {
                    // Show continue button after all wishes are typed
                    setTimeout(() => {
                        document.getElementById('wishes-continue-btn').classList.remove('hidden');
                    }, 800);
                }
            }
        }
        
        type();
    }
    
    function typeNextWish() {
        if (currentWishIndex < wishes.length) {
            const wishElement = document.getElementById(`wish${currentWishIndex + 1}`);
            const text = wishes[currentWishIndex];
            typeWriter(wishElement, text, 50);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeNextWish, 500);
}

// Show video
function showVideo() {
    showSection('video-section');
    
    // Pause and mute background video
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.pause();
        bgVideo.muted = true;
    }
    
    // Play hppd video
    const hppdVideo = document.getElementById('hppdVideo');
    if (hppdVideo) {
        hppdVideo.currentTime = 0;
        hppdVideo.play().catch(err => {
            console.log('Video autoplay prevented:', err);
        });
    }
}

// Show cake
function showCake() {
    showSection('cake-section');
    setupCandles();
}

// Setup candles
function setupCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        candle.onclick = () => blowCandle(candle, index);
    });
}

// Blow candle
function blowCandle(candle, index) {
    const flame = candle.querySelector('.flame');
    if (flame && !flame.classList.contains('out')) {
        flame.classList.add('out');
        candlesLit--;
        
        // Create smoke effect
        createSmoke(candle);
        
        if (candlesLit === 0) {
            setTimeout(() => {
                document.getElementById('blow-instruction').textContent = '🎉 Tuyệt vời! Bạn đã thổi tắt hết nến! 🎉';
                document.getElementById('final-btn').classList.remove('hidden');
            }, 500);
        }
    }
}

// Create smoke effect
function createSmoke(candle) {
    const smoke = document.createElement('div');
    smoke.style.position = 'absolute';
    smoke.style.width = '5px';
    smoke.style.height = '20px';
    smoke.style.background = 'rgba(128, 128, 128, 0.5)';
    smoke.style.borderRadius = '50%';
    smoke.style.top = '-20px';
    smoke.style.left = '50%';
    smoke.style.transform = 'translateX(-50%)';
    smoke.style.animation = 'smoke 1s ease-out forwards';
    candle.appendChild(smoke);
    
    // Add smoke animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes smoke {
            to {
                transform: translateX(-50%) translateY(-30px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        smoke.remove();
    }, 1000);
}

// Show final
function showFinal() {
    showSection('final-section');
    // Trigger confetti explosion
    createMoreConfetti();
}

// Create more confetti for final celebration (meteor shower)
function createMoreConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#4ecdc4', '#ffd93d', '#ff6b9d', '#9575cd', '#ffffff', '#ff8c42'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = '0s';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.width = (Math.random() * 3 + 2) + 'px';
        confetti.style.height = confetti.style.width;
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Restart
function restart() {
    candlesLit = 3;
    
    // Clear balloons and confetti
    document.getElementById('balloons-container').innerHTML = '';
    document.getElementById('confetti-container').innerHTML = '';
    
    // Reset candles
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.classList.remove('out');
    });
    
    // Reset instruction
    const blowInstruction = document.getElementById('blow-instruction');
    if (blowInstruction) {
        blowInstruction.textContent = '💨 Nhấn vào nến để thổi tắt!';
    }
    const finalBtn = document.getElementById('final-btn');
    if (finalBtn) {
        finalBtn.classList.add('hidden');
    }
    
    // Stop hppd video
    const hppdVideo = document.getElementById('hppdVideo');
    if (hppdVideo) {
        hppdVideo.pause();
        hppdVideo.currentTime = 0;
    }
    
    // Resume background video if muted
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo && !isMuted) {
        bgVideo.muted = false;
        bgVideo.play().catch(err => {
            console.log('Background video play prevented:', err);
        });
    }
    
    // Reset wishes section
    const wishes = document.querySelectorAll('.typewriter-text');
    wishes.forEach(wish => {
        wish.textContent = '';
        wish.classList.remove('typing', 'typed');
        wish.style.opacity = '0';
    });
    const wishesContinueBtn = document.getElementById('wishes-continue-btn');
    if (wishesContinueBtn) {
        wishesContinueBtn.classList.add('hidden');
    }
    
    // Go back to welcome
    showSection('welcome-section');
}

// Image Modal
function openModal(index) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.style.display = 'block';
    modalImg.src = images[index];
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Play background music
function playMusic() {
    const music = document.getElementById('bgMusic');
    // Note: Auto-play might be blocked by browsers
    music.play().catch(e => {
        console.log('Auto-play was prevented. User interaction required.');
    });
}

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, true);
}

// Prevent image context menu on long press
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Initialize on load
let introStarted = false;

window.addEventListener('load', () => {
    // Check orientation
    checkOrientation();
    
    // Initialize matrix effect
    initMatrix();
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Check screen orientation
function checkOrientation() {
    const rotateOverlay = document.getElementById('rotate-overlay');
    const bgVideo = document.getElementById('bgVideo');
    
    function updateOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Show overlay only on mobile devices in portrait mode
        if (isMobile && isPortrait) {
            rotateOverlay.classList.add('show');
            // Pause video when portrait
            if (bgVideo) {
                bgVideo.pause();
            }
        } else {
            rotateOverlay.classList.remove('show');
            
            // Play video when landscape
            if (bgVideo) {
                bgVideo.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                    // Try to play with user interaction
                    document.addEventListener('click', () => {
                        bgVideo.play().catch(err => console.log('Play failed:', err));
                    }, { once: true });
                });
            }
            
            // Start intro only when in landscape mode and not started yet
            if (!introStarted) {
                introStarted = true;
                setTimeout(() => {
                    startCountdown();
                }, 1000);
            }
        }
    }
    
    // Check on load
    updateOrientation();
    
    // Check on orientation change
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);
}

// Add sparkle effect on click
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = '#4ecdc4';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    sparkle.style.boxShadow = '0 0 10px #4ecdc4, 0 0 20px #4ecdc4';
    
    document.body.appendChild(sparkle);
    
    // Add animation if not exists
    if (!document.querySelector('#sparkle-animation')) {
        const style = document.createElement('style');
        style.id = 'sparkle-animation';
        style.textContent = `
            @keyframes sparkle {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

// Console easter egg
console.log('%c🎉 Happy Birthday Phương Anh! 🎉', 'font-size: 20px; color: #4ecdc4; font-weight: bold; text-shadow: 0 0 10px #4ecdc4;');
console.log('%cChúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc! 💖', 'font-size: 14px; color: #ffd93d;');
console.log('%c✨ Welcome to the Space Birthday Theme! ✨', 'font-size: 12px; color: #9575cd;');

// Toggle sound function
function toggleSound() {
    const bgVideo = document.getElementById('bgVideo');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIconOn = document.getElementById('sound-icon-on');
    const soundIconOff = document.getElementById('sound-icon-off');
    
    isMuted = !isMuted;
    
    if (bgVideo) {
        bgVideo.muted = isMuted;
        
        if (isMuted) {
            soundIconOn.classList.add('hidden');
            soundIconOff.classList.remove('hidden');
            soundToggle.classList.add('muted');
        } else {
            soundIconOn.classList.remove('hidden');
            soundIconOff.classList.add('hidden');
            soundToggle.classList.remove('muted');
            // Try to play if paused
            bgVideo.play().catch(e => console.log('Play failed:', e));
        }
    }
}
