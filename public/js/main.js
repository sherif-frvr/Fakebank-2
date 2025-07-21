document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    const loginForm = document.getElementById('loginForm');
    const dashboardContent = document.getElementById('mainContent');
    
    if (loginForm) {
        // We're on the login page
        initializeLogin();
    } else if (dashboardContent) {
        // We're on the dashboard page
        initializeDashboard();
    }
});

// Login Page Functionality
function initializeLogin() {
    console.log('Initializing login page');
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const message = document.getElementById('loginMessage');

            if (email && password) {
                console.log('Checking credentials:', email, password);
                if (email === 'jennykayla565@gmail.com' && password === 'Appendix247$') {
                    message.className = 'mt-4 text-center text-sm text-blue-600';
                    message.textContent = 'Authenticating...';
                    console.log('Credentials valid, redirecting in 5 seconds');
                    localStorage.setItem('loggedInUser', JSON.stringify({ email, name: 'Miss Jennifer Kayla' }));
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 5000);
                } else {
                    message.className = 'mt-4 text-center text-sm text-red-600';
                    message.textContent = 'Invalid email or password!';
                    console.log('Invalid credentials');
                }
            } else {
                message.className = 'mt-4 text-center text-sm text-red-600';
                message.textContent = 'Please fill in all fields!';
                console.log('Missing email or password');
            }
        });
    } else {
        console.log('Login form not found');
    }
}

// Dashboard Page Functionality
function initializeDashboard() {
    console.log('Initializing dashboard');
    
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        console.log('User not logged in, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    // Initialize all dashboard components
    setupWelcomeMessage();
    setupBalanceAnimation();
    setupEventListeners();
    loadTransactions();
    loadFavoriteTransfers();
    initializeCharts();
}

function setupWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        const text = "Good Morning ☀";
        welcomeMessage.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                welcomeMessage.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }
}

function setupBalanceAnimation() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        let start = 0;
        const end = 2983927.84;
        const duration = 2000;
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = start + (end - start) * progress;
            balanceElement.textContent = `$${current.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })} USD`;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
        });
    }

    // Profile dropdown
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (profileDropdown && dropdownMenu) {
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.add('hidden');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('Logging out user');
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => {
                l.classList.remove('active', 'bg-white/20', 'text-white', 'shadow-lg', 'backdrop-blur-sm');
                l.classList.add('text-white/80', 'hover:bg-white/10', 'hover:text-white', 'hover:shadow-md');
            });
            
            // Add active class to clicked link
            this.classList.add('active', 'bg-white/20', 'text-white', 'shadow-lg', 'backdrop-blur-sm');
            this.classList.remove('text-white/80', 'hover:bg-white/10', 'hover:text-white', 'hover:shadow-md');
        });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.classList.add('animate-spin');
            }
            
            // Simulate refresh
            setTimeout(() => {
                if (icon) {
                    icon.classList.remove('animate-spin');
                }
                loadTransactions();
                updateCharts();
            }, 1000);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchTransactions');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTransactions(this.value);
        });
    }

    // Table sorting
    const sortHeaders = document.querySelectorAll('[data-sort]');
    sortHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            sortTransactions(sortBy);
        });
    });
}

// Transaction Data and Management
let transactions = [
    { id: '242566', name: 'Jenny Wilson', status: 'Money In', amount: 45.00, date: '2025-01-20' },
    { id: '242567', name: 'Devon Lane', status: 'Money Out', amount: -120.50, date: '2025-01-19' },
    { id: '242568', name: 'Jane Cooper', status: 'Money In', amount: 89.25, date: '2025-01-18' },
    { id: '242569', name: 'Dianne Russell', status: 'Money Out', amount: -75.00, date: '2025-01-17' },
    { id: '242570', name: 'Kristin Watson', status: 'Money In', amount: 234.80, date: '2025-01-16' },
    { id: '242571', name: 'Cody Fisher', status: 'Money Out', amount: -156.90, date: '2025-01-15' },
    { id: '242572', name: 'Initial Deposit', status: 'Money In', amount: 2983927.84, date: '2025-01-01' }
];

let currentSort = { field: 'date', direction: 'desc' };

function loadTransactions() {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.className = `${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`;
        
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });

        row.innerHTML = `
            <td class="py-4 px-4">
                <div class="font-medium text-gray-800">${transaction.name}</div>
            </td>
            <td class="py-4 px-4">
                <div class="text-gray-600">#${transaction.id}</div>
            </td>
            <td class="py-4 px-4 text-center">
                <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    transaction.status === 'Money In' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }">
                    ${transaction.status}
                </span>
            </td>
            <td class="py-4 px-4 text-right">
                <div class="font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            </td>
            <td class="py-4 px-4 text-right">
                <div class="text-gray-600">${formattedDate}</div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function filterTransactions(searchTerm) {
    const rows = document.querySelectorAll('#transactionsBody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const id = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        
        if (name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortTransactions(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    transactions.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (field === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (currentSort.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    loadTransactions();
}

function loadFavoriteTransfers() {
    const favorites = [
        { id: 1, name: 'Kathryn Murphy', avatar: 'KM', account: '****2847' },
        { id: 2, name: 'Wade Warren', avatar: 'WW', account: '****7392' },
        { id: 3, name: 'Jenny Wilson', avatar: 'JW', account: '****5641' },
        { id: 4, name: 'Robert Fox', avatar: 'RF', account: '****8239' }
    ];

    const container = document.getElementById('favoriteTransfers');
    if (!container) return;

    container.innerHTML = '';

    favorites.forEach(person => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200';
        
        div.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">${person.avatar}</span>
                </div>
                <div>
                    <div class="font-medium text-gray-800">${person.name}</div>
                    <div class="text-sm text-gray-500">${person.account}</div>
                </div>
            </div>
            <button class="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
            </button>
        `;
        
        container.appendChild(div);
    });
}

// Chart Management
let moneyFlowChart;

function initializeCharts() {
    const ctx = document.getElementById('moneyFlowChart');
    if (!ctx) return;

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Money Out',
                data: [4200, 3800, 5200, 4800, 6200, 5800, 6800, 7200, 6400, 7800, 8200, 7600],
                backgroundColor: '#3B82F6',
                borderColor: '#3B82F6',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Money In',
                data: [3800, 4200, 4600, 5200, 4800, 5400, 5800, 6200, 6800, 6400, 7200, 7800],
                backgroundColor: '#93C5FD',
                borderColor: '#93C5FD',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false,
            }
        ]
    };

    moneyFlowChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#F3F4F6'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function updateCharts() {
    if (moneyFlowChart) {
        // Generate new random data
        const newData = moneyFlowChart.data.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(() => Math.floor(Math.random() * 3000) + 4000)
        }));
        
        moneyFlowChart.data.datasets = newData;
        moneyFlowChart.update('active');
    }
}