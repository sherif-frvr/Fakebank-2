document.addEventListener('DOMContentLoaded', function() {
    // Login Form (login.html)
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

    // Dashboard Logic
    const welcomeMessage = document.getElementById('welcomeMessage');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const balanceElement = document.getElementById('balance');

    if (welcomeMessage) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.name) {
            const text = `Hello, ${loggedInUser.name} 👋`;
            let i = 0;

            function typeWriter() {
                if (i < text.length) {
                    welcomeMessage.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 150); // Slow typing
                }
            }

            typeWriter();
        } else {
            window.location.href = 'login.html';
        }
    }

    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            mainContent.classList.toggle('ml-0');
            mainContent.classList.toggle('ml-56');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }

    if (balanceElement) {
        let start = 0;
        const end = 2983927.84;
        const duration = 2000;
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            balanceElement.textContent = `$${current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // Money Flow Chart
    const moneyFlowCtx = document.getElementById('moneyFlowChart').getContext('2d');
    new Chart(moneyFlowCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Money Flow ($M)',
                data: [1.5, 1.8, 2.0, 2.2, 2.5, 2.8, 2.98],
                borderColor: '#9333ea',
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#9333ea'
            }]
        },
        options: {
            animation: { duration: 2000, easing: 'easeInOutCubic' },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Money Flow ($M)' } } },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });

    // Statistics Doughnut Chart
    const statisticsCtx = document.getElementById('statisticsChart').getContext('2d');
    new Chart(statisticsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Spending', 'Investments'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            animation: { duration: 2000, easing: 'easeInOutCubic' },
            maintainAspectRatio: false
        }
    });

    // Savings Graph with Filter
    const savingsCtx = document.getElementById('savingsChart').getContext('2d');
    let savingsChart = new Chart(savingsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Savings ($M)',
                data: [1.2, 1.5, 1.8, 2.0, 2.3, 2.7, 2.98],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#22c55e'
            }]
        },
        options: {
            animation: { duration: 2000, easing: 'easeInOutCubic' },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Savings ($M)' } } },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });

    // Time Filter
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            const range = this.value;
            let newData, newLabels;
            switch (range) {
                case 'lastMonth':
                    newLabels = ['Jun', 'Jul'];
                    newData = [2.7, 2.98];
                    break;
                case 'year':
                    newLabels = ['Jan', 'Apr', 'Jul'];
                    newData = [1.2, 2.0, 2.98];
                    break;
                default: // thisMonth
                    newLabels = ['Jun', 'Jul'];
                    newData = [2.7, 2.98];
            }
            savingsChart.data.labels = newLabels;
            savingsChart.data.datasets[0].data = newData;
            savingsChart.update();
        });
    }

    // Mock API Fetch (for demonstration)
    function fetchData() {
        const mockBalance = 2983927.84;
        const mockTransactions = [
            { platform: '', type: 'Initial Deposit', amount: 2983927.84, date: '2025-02-18 12:00 AM' }
        ];
        return { balance: mockBalance, transactions: mockTransactions };
    }

    const { balance, transactions } = fetchData();
    if (balanceElement) balanceElement.textContent = `$${balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    const activityList = document.querySelector('.recent-activity ul');
    if (activityList) {
        activityList.innerHTML = transactions.map(t => `
            <li class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                    <span class="text-lg">💰</span>
                    <span class="text-sm">${t.type}</span>
                </div>
                <div class="text-right">
                    <p class="text-green-600 text-sm">+$${t.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p class="text-xs text-gray-500">${t.date}</p>
                </div>
            </li>
        `).join('');
    }
});