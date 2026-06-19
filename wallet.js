(() => {
    'use strict';

    /* ============================================================
       Wallet Connect Module — mimo
       Supports: MetaMask, WalletConnect, Coinbase Wallet
       ============================================================ */

    const WALLET_CONFIG = {
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://eth.llamarpc.com'],
        blockExplorerUrls: ['https://etherscan.io'],
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    };

    const MIMO_CONTRACT = '0x1234567890abcdef1234567890abcdef12345678';
    const PRICE_PER_TOKEN = 0.008;

    /* ---- State ---- */
    let provider = null;
    let signer = null;
    let address = null;
    let chainId = null;

    /* ---- DOM ---- */
    const walletBtn = document.getElementById('walletBtn');
    const investBtn = document.getElementById('investBtn');
    const investInput = document.getElementById('invest');
    const receiveInput = document.getElementById('receive');

    /* ---- Helpers ---- */
    function shortenAddr(addr) {
        if (!addr) return '';
        return addr.slice(0, 6) + '…' + addr.slice(-4);
    }

    function isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
    }

    function isCoinbaseWallet() {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet;
    }

    function updateUI() {
        if (!walletBtn) return;
        const dot = walletBtn.querySelector('.wallet-btn__dot');
        const text = walletBtn.querySelector('.wallet-btn__text');

        if (address) {
            dot.classList.add('wallet-btn__dot--connected');
            text.textContent = shortenAddr(address);
            walletBtn.classList.add('wallet-btn--connected');

            if (investBtn) {
                investBtn.textContent = 'Invest now';
                investBtn.disabled = false;
            }
        } else {
            dot.classList.remove('wallet-btn__dot--connected');
            text.textContent = 'Connect wallet';
            walletBtn.classList.remove('wallet-btn--connected');

            if (investBtn) {
                investBtn.textContent = 'Connect wallet to invest';
                investBtn.disabled = false;
            }
        }
    }

    /* ---- Connect via MetaMask / Injected ---- */
    async function connectInjected() {
        if (!window.ethereum) {
            alert('No wallet detected. Please install MetaMask or another Web3 wallet.');
            return false;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) return false;

            provider = window.ethereum;
            address = accounts[0];

            // Get chain
            const chainHex = await provider.request({ method: 'eth_chainId' });
            chainId = parseInt(chainHex, 16);

            // Listen for account/chain changes
            provider.on('accountsChanged', handleAccountsChanged);
            provider.on('chainChanged', () => window.location.reload());

            updateUI();
            return true;
        } catch (err) {
            console.error('Wallet connection failed:', err);
            return false;
        }
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // Disconnected
            address = null;
            signer = null;
            provider = null;
        } else {
            address = accounts[0];
        }
        updateUI();
    }

    /* ---- Disconnect ---- */
    function disconnect() {
        address = null;
        signer = null;
        provider = null;
        chainId = null;
        updateUI();
    }

    /* ---- Switch Chain ---- */
    async function switchToEthereum() {
        if (!provider) return;

        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            });
        } catch (err) {
            // Chain not added, try adding it
            if (err.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1',
                            chainName: WALLET_CONFIG.chainName,
                            rpcUrls: WALLET_CONFIG.rpcUrls,
                            blockExplorerUrls: WALLET_CONFIG.blockExplorerUrls,
                            nativeCurrency: WALLET_CONFIG.nativeCurrency,
                        }],
                    });
                } catch (addErr) {
                    console.error('Failed to add chain:', addErr);
                }
            }
        }
    }

    /* ---- Invest (mock transaction) ---- */
    async function handleInvest() {
        if (!address) {
            // Try to connect first
            const connected = await connectInjected();
            if (!connected) return;
            return; // Let user click again after connecting
        }

        if (!investInput) return;

        const amount = parseFloat(investInput.value) || 0;
        if (amount < 50) {
            alert('Minimum investment is $50');
            return;
        }

        const tokens = Math.floor(amount / PRICE_PER_TOKEN);

        // Mock transaction — in production, this would call the smart contract
        investBtn.textContent = 'Processing…';
        investBtn.disabled = true;

        try {
            // Simulate transaction delay
            await new Promise((r) => setTimeout(r, 2000));

            investBtn.textContent = `✓ ${tokens.toLocaleString()} MIMO reserved`;
            investBtn.style.background = 'var(--green)';

            setTimeout(() => {
                investBtn.textContent = 'Invest now';
                investBtn.style.background = '';
                investBtn.disabled = false;
            }, 3000);
        } catch (err) {
            investBtn.textContent = 'Invest failed — try again';
            investBtn.style.background = '#dc2626';
            setTimeout(() => {
                investBtn.textContent = 'Invest now';
                investBtn.style.background = '';
                investBtn.disabled = false;
            }, 3000);
        }
    }

    /* ---- Wallet Menu (dropdown) ---- */
    function showWalletMenu() {
        // Remove existing menu
        const existing = document.querySelector('.wallet-menu');
        if (existing) { existing.remove(); return; }

        const menu = document.createElement('div');
        menu.className = 'wallet-menu';

        if (address) {
            menu.innerHTML = `
                <div class="wallet-menu__header">
                    <span class="wallet-menu__addr">${shortenAddr(address)}</span>
                    <span class="wallet-menu__chain">Chain ${chainId || '—'}</span>
                </div>
                <button class="wallet-menu__item" id="walletCopy">Copy address</button>
                <button class="wallet-menu__item" id="walletExplorer">View on Etherscan</button>
                <button class="wallet-menu__item wallet-menu__item--danger" id="walletDisconnect">Disconnect</button>
            `;
        } else {
            menu.innerHTML = `
                <div class="wallet-menu__header">
                    <span class="wallet-menu__title">Connect a wallet</span>
                </div>
                <button class="wallet-menu__item wallet-menu__provider" id="connectMetaMask">
                    <span class="wallet-menu__icon">🦊</span>
                    <span>MetaMask</span>
                </button>
                <button class="wallet-menu__item wallet-menu__provider" id="connectCoinbase">
                    <span class="wallet-menu__icon">🔵</span>
                    <span>Coinbase Wallet</span>
                </button>
                <button class="wallet-menu__item wallet-menu__provider" id="connectInjected">
                    <span class="wallet-menu__icon">🔌</span>
                    <span>Browser Wallet</span>
                </button>
            `;
        }

        document.body.appendChild(menu);

        // Position menu
        const rect = walletBtn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 8) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';

        // Event listeners
        if (address) {
            document.getElementById('walletCopy')?.addEventListener('click', () => {
                navigator.clipboard.writeText(address);
                menu.remove();
            });
            document.getElementById('walletExplorer')?.addEventListener('click', () => {
                window.open(`https://etherscan.io/address/${address}`, '_blank');
                menu.remove();
            });
            document.getElementById('walletDisconnect')?.addEventListener('click', () => {
                disconnect();
                menu.remove();
            });
        } else {
            document.getElementById('connectMetaMask')?.addEventListener('click', async () => {
                menu.remove();
                await connectInjected();
            });
            document.getElementById('connectCoinbase')?.addEventListener('click', async () => {
                menu.remove();
                await connectInjected();
            });
            document.getElementById('connectInjected')?.addEventListener('click', async () => {
                menu.remove();
                await connectInjected();
            });
        }

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !walletBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 10);
    }

    /* ---- Init ---- */
    if (walletBtn) {
        walletBtn.addEventListener('click', showWalletMenu);
    }

    if (investBtn) {
        investBtn.addEventListener('click', handleInvest);
    }

    // Check if already connected
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
            if (accounts && accounts.length > 0) {
                address = accounts[0];
                provider = window.ethereum;
                window.ethereum.request({ method: 'eth_chainId' }).then((hex) => {
                    chainId = parseInt(hex, 16);
                    updateUI();
                });
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                window.ethereum.on('chainChanged', () => window.location.reload());
            }
        }).catch(() => {});
    }
})();
