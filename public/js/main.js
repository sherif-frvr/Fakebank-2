
// Initialize balance and transactions from localStorage or defaults
let currentBalance = localStorage.getItem('currentBalance') ? parseFloat(localStorage.getItem('currentBalance')) : 2983927.84;
let transactions = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')) : [
    { id: '242566', name: 'Jenny Wilson', status: 'Success', amount: 45.00, date: '2015-12-20' },
    { id: '242567', name: 'Devon Lane', status: 'Success', amount: -120.50, date: '2015-12-19' },
    { id: '242568', name: 'Jane Cooper', status: 'Success', amount: 89.25, date: '2015-07-18' },
    { id: '242569', name: 'Dianne Russell', status: 'Success', amount: -75.00, date: '2015-05-17' },
    { id: '242570', name: 'Kristin Watson', status: 'Success', amount: 234.80, date: '2015-03-16' },
    { id: '242571', name: 'Cody Fisher', status: 'Success', amount: -156.90, date: '2015-03-15' },
    { id: '242572', name: 'Initial Deposit', status: 'Success', amount: 2983927.84, date: '2015-01-01' }
];

// Transaction Management
let currentSort = { field: 'date', direction: 'desc' };
let moneyFlowChart;

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const mainContent = document.getElementById('mainContent');

    if (loginForm) {
        initializeLogin();
    } else if (mainContent) {
        initializeDashboard();
        setupEventListeners();
    }
});

// Login Page Functionality
function initializeLogin() {
    console.log('Initializing login page');
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Login form submitted');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const message = document.getElementById('loginMessage');

            if (email && password) {
                console.log('Checking credentials:', email);
                if (email === 'jennykayla565@gmail.com' && password === 'Appendix247$') {
                    message.className = 'mt-4 text-center text-sm font-semibold text-blue-600';
                    message.textContent = 'Authenticating...';
                    console.log('Credentials valid, redirecting in 4 seconds');
                    localStorage.setItem('loggedInUser', JSON.stringify({ email, name: 'Miss Jennifer Kayla' }));
                    setTimeout(() => {
                        window.location.assign('dashboard.html');
                    }, 4000);
                } else {
                    message.className = 'mt-4 text-center text-sm font-semibold text-red-600';
                    message.textContent = 'Invalid email or password!';
                    console.log('Invalid credentials');
                }
            } else {
                message.className = 'mt-4 text-center text-sm font-semibold text-red-600';
                message.textContent = 'Please fill in all fields!';
                console.log('Missing email or password');
            }
        });
    } else {
        console.log('Login form not found');
    }
}

// Dashboard Initialization
function initializeDashboard() {
    // Set welcome message based on time
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        const hour = new Date().getHours();
        let greeting = 'Good Morning ☀️';
        if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon 🌤';
        } else if (hour >= 17) {
            greeting = 'Good Evening 🌙';
        }
        welcomeMessage.textContent = greeting;
    }

    // Initialize chart
    initializeCharts();

    // Load transactions
    loadTransactions();

    // Load favorite transfers
    loadFavoriteTransfers();

    // Setup balance animation
    setupBalance();
}

// Navigation Handling
function setupNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = [
        'dashboardContent',
        'profileContent',
        'fund-transfer-content',
        'accountsContent',
        'cardsContent',
        'billingContent',
        'settingsContent'
    ];

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // Hide all sections
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.add('hidden');
                }
            });

            // Show selected section
            const targetSection = document.getElementById(`${section}-content`) || document.getElementById(`${section}Content`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            } else if (section === 'dashboard') {
                const dashboardSection = document.getElementById('dashboardContent');
                if (dashboardSection) {
                    dashboardSection.classList.remove('hidden');
                } else {
                    console.error('Dashboard section not found');
                }
            } else {
                console.error(`Section not found for data-section="${section}"`);
            }

            // Update active class for navigation links
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove('active', 'bg-white/20', 'text-white', 'shadow-lg', 'backdrop-blur-sm');
                nav.classList.add('text-white/80', 'hover:bg-white/10', 'hover:text-white', 'hover:shadow-md');
            });

            if (this.classList.contains('nav-link')) {
                this.classList.add('active', 'bg-white/20', 'text-white', 'shadow-lg', 'backdrop-blur-sm');
            }

            // Close mobile menu
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth < 1024 && sidebar) {
                sidebar.classList.add('-translate-x-full');
                document.body.style.overflow = '';
            }

            // Close dropdown menu
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) {
                dropdownMenu.classList.add('hidden');
            }
        });
    });
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            body.style.overflow = sidebar.classList.contains('translate-x-0') ? 'hidden' : '';
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function (e) {
            if (
                window.innerWidth < 1024 &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target) &&
                sidebar.classList.contains('translate-x-0')
            ) {
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('translate-x-0');
                body.style.overflow = '';
            }
        });
    }

    // Profile dropdown
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (profileDropdown && dropdownMenu) {
        profileDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!profileDropdown.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                console.log('Logging out user');
                localStorage.removeItem('loggedInUser');
                window.location.assign('login.html');
            }
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.classList.add('animate-spin');
            }

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
        searchInput.addEventListener('input', function () {
            filterTransactions(this.value);
        });
    }

    // Table sorting
    const sortHeaders = document.querySelectorAll('[data-sort]');
    sortHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const sortBy = this.dataset.sort;
            sortTransactions(sortBy);
        });
    });

    // Setup navigation
    setupNavigation();

    // Transfer form functionality
    const transferForm = document.getElementById('transfer-form');
    const transferTypeSelect = document.getElementById('transferType');
    const transferTypeInfo = document.getElementById('transferTypeInfo');
    const transferTypeDetails = document.getElementById('transferTypeDetails');
    const cancelTransfer = document.getElementById('cancelTransfer');

    // Transfer type information
    const transferTypeData = {
        ACH: {
            title: 'ACH Transfer',
            description: 'Automated Clearing House transfer typically takes 1-3 business days to complete.',
            fee: 'No fee',
            limit: 'Daily limit: $50,000'
        },
        Wire: {
            title: 'Wire Transfer',
            description: 'Wire transfers are processed the same business day for faster delivery.',
            fee: 'Fee: $25.00',
            limit: 'Daily limit: $1,000,000'
        }
    };

    // Show transfer type information
    if (transferTypeSelect) {
        transferTypeSelect.addEventListener('change', function () {
            const selectedType = this.value;

            if (selectedType && transferTypeData[selectedType]) {
                const data = transferTypeData[selectedType];
                transferTypeDetails.innerHTML = `
                    <div>
                        <h4 class="font-semibold text-blue-800 mb-2">${data.title}</h4>
                        <p class="text-blue-700 mb-2">${data.description}</p>
                        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-sm">
                            <span class="text-blue-600"><strong>Fee:</strong> ${data.fee}</span>
                            <span class="text-blue-600"><strong>${data.limit}</strong></span>
                        </div>
                    </div>
                `;
                transferTypeInfo.classList.remove('hidden');
            } else {
                transferTypeInfo.classList.add('hidden');
            }
        });
    }

    // Cancel transfer button
    if (cancelTransfer) {
        cancelTransfer.addEventListener('click', function () {
            if (confirm('Are you sure you want to cancel this transfer?')) {
                transferForm.reset();
                transferTypeInfo.classList.add('hidden');
            }
        });
    }

    // Transfer form submission
    if (transferForm) {
        transferForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const transferData = {
                recipientAccount: formData.get('recipientAccount'),
                name: formData.get('recipientName'),
                amount: parseFloat(formData.get('transferAmount')),
                transferType: formData.get('transferType'),
                reason: formData.get('transferReason')
            };

            // Validate form
            if (
                !transferData.recipientAccount ||
                !transferData.name ||
                !transferData.amount ||
                !transferData.transferType ||
                !transferData.reason
            ) {
                alert('Please fill in all required fields.');
                return;
            }

            if (isNaN(transferData.amount) || transferData.amount <= 0) {
                alert('Please enter a valid transfer amount.');
                return;
            }

            // Check if sufficient balance
            const fee = transferData.transferType === 'Wire' ? 25.00 : 0;
            const totalAmount = transferData.amount + fee;
            if (totalAmount > currentBalance) {
                alert('Insufficient funds.');
                return;
            }

            // Check daily limits
            const limits = {
                ACH: 50000,
                Wire: 1000000
            };

            if (transferData.amount > limits[transferData.transferType]) {
                alert(`Transfer amount exceeds daily limit for ${transferData.transferType} transfers.`);
                return;
            }

            // Show confirmation modal
            showConfirmationModal(transferData, confirmed => {
                if (confirmed) {
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;

                    submitBtn.innerHTML = `
                        <svg class="w-5 h-5 animate-spin inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        <span>Processing...</span>
                    `;
                    submitBtn.disabled = true;

                    // Update balance and transactions
                    currentBalance -= totalAmount;
                    transactions.unshift({
                        id: `242${Math.floor(1000 + Math.random() * 9000)}`,
                        name: transferData.name,
                        status: 'Hold',
                        amount: -transferData.amount,
                        date: new Date().toISOString().split('T')[0]
                    });

                    // Save to localStorage
                    localStorage.setItem('currentBalance', currentBalance.toFixed(2));
                    localStorage.setItem('transactions', JSON.stringify(transactions));

                    // Simulate processing time
                    setTimeout(() => {
                        alert('Transfer initiated successfully! You will receive a confirmation email shortly.');
                        this.reset();
                        if (transferTypeInfo) transferTypeInfo.classList.add('hidden');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;

                        // Update balance display
                        setupBalance();
                        // Update transactions
                        loadTransactions();
                        // Return to dashboard
                        document.querySelector('.nav-link[data-section="dashboard"]').click();
                    }, 2000);
                }
            });
        });
    }
}

// Confirmation Modal
function showConfirmationModal(transferData, callback) {
    const fee = transferData.transferType === 'Wire' ? 25.00 : 0;
    const totalAmount = parseFloat(transferData.amount) + fee;

    // Remove any existing modal
    const existingModal = document.getElementById('confirmationModal');
    if (existingModal) existingModal.remove();

    // Create modal HTML
    const modal = document.createElement('div');
    modal.id = 'confirmationModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Transfer Summary</h3>
            <div class="text-sm text-gray-600 space-y-2">
                <p><strong>Recipient:</strong> ${transferData.name}</p>
                <p><strong>Account:</strong> ${transferData.recipientAccount}</p>
                <p><strong>Amount:</strong> $${parseFloat(transferData.amount).toFixed(2)}</p>
                <p><strong>Transfer Type:</strong> ${transferData.transferType}</p>
                <p><strong>Fee:</strong> $${fee.toFixed(2)}</p>
                <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
                <p><strong>Reason:</strong> ${transferData.reason}</p>
            </div>
            <p class="text-sm text-gray-600 mt-4">Do you want to proceed with this transfer?</p>
            <div class="mt-6 flex justify-end space-x-3">
                <button id="cancelModal" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button id="confirmModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Confirm</button>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    // Event listeners for buttons
    document.getElementById('cancelModal').addEventListener('click', () => {
        modal.remove();
        callback(false);
    });

    document.getElementById('confirmModal').addEventListener('click', () => {
        modal.remove();
        callback(true);
    });
}

// Chart Initialization
function initializeCharts() {
    const ctx = document.getElementById('moneyFlowChart');
    if (!ctx) return;

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Money Out',
                data: [4200, 3800, 5200, 4800, 6200, 5800, 6800, 7200, 6400, 7800, 8200, 7600],
                backgroundColor: '#f63b3b',
                borderColor: '#f63b3b',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: 'Money In',
                data: [3800, 4200, 4600, 5200, 4800, 5400, 5800, 6200, 6800, 6400, 7200, 7800],
                backgroundColor: '#93C5FD',
                borderColor: '#93C5FD',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
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
                        callback: function (value) {
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
        const newData = moneyFlowChart.data.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(() => Math.floor(Math.random() * 3000) + 4000)
        }));

        moneyFlowChart.data.datasets = newData;
        moneyFlowChart.update('active');
    }
}

// Load Transactions
function loadTransactions() {
    const transactionsBody = document.getElementById('transactionsBody');
    if (!transactionsBody) return;

    transactionsBody.innerHTML = transactions
        .map((transaction, index) => {
            const statusColor = {
                Completed: 'bg-green-100 text-green-800',
                Pending: 'bg-yellow-100 text-yellow-800',
                Failed: 'bg-red-100 text-red-800',
                Hold: 'bg-blue-100 text-blue-800',
                Success: 'bg-green-100 text-green-800'
            }[transaction.status];

            const amountColor = transaction.amount > 0 ? 'text-green-600' : 'text-red-600';
            const amountPrefix = transaction.amount > 0 ? '+' : '';

            const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit'
            });

            const infoIcon =
                transaction.status === 'Hold'
                    ? `
                <span class="info-icon cursor-pointer ml-2 text-blue-600" data-message="This transfer has been kept on hold pending verification and approval. Please contact our nearest branch to have it resolved. Thank you.">ℹ️</span>
            `
                    : '';

            return `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td class="py-4 px-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span class="text-white font-semibold text-sm">${transaction.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')}</span>
                            </div>
                            <span class="font-medium text-gray-800">${transaction.name}</span>
                        </div>
                    </td>
                    <td class="py-4 px-4 text-gray-600 font-mono text-sm">#${transaction.id}</td>
                    <td class="py-4 px-4 text-center">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">
                            ${transaction.status}${infoIcon}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-right font-semibold ${amountColor}">
                        ${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td class="py-4 px-4 text-right text-gray-600">${formattedDate}</td>
                </tr>
            `;
        })
        .join('');

    // Add event listeners for info icons
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            alert(icon.getAttribute('data-message'));
        });
    });
}

// Load Favorite Transfers
function loadFavoriteTransfers() {
    const favoriteTransfers = document.getElementById('favoriteTransfers');
    if (!favoriteTransfers) return;

    const favorites = [
        { name: 'John Smith', account: '****1234', bank: 'Chase Bank' },
        { name: 'Sarah Johnson', account: '****5678', bank: 'Bank of America' },
        { name: 'Michael Brown', account: '****9012', bank: 'Wells Fargo' },
        { name: 'Emily Davis', account: '****3456', bank: 'Citibank' }
    ];

    favoriteTransfers.innerHTML = favorites
        .map(favorite => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold text-sm">${favorite.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}</span>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">${favorite.name}</p>
                        <p class="text-xs text-gray-600">${favorite.account} • ${favorite.bank}</p>
                    </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        `)
        .join('');
}

// Balance Animation
function setupBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        let start = 0;
        const end = currentBalance;
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

// Transaction Filtering
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

// Transaction Sorting
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
        } else if (field === 'name') {
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
