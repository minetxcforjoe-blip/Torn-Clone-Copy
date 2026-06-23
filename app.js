<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Torn Underground - Dashboard Area</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #ddd; display: flex; flex-direction: column; min-height: 100vh; }
        
        header { background: #111; padding: 14px 24px; border-bottom: 2px solid #ff9900; display: flex; justify-content: space-between; align-items: center; }
        header h1 { color: #ff9900; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .user-summary { font-size: 14px; font-weight: bold; }
        .cash-display { color: #4caf50; margin-left: 12px; }

        .game-container { display: flex; flex: 1; width: 100%; max-width: 1400px; margin: 0 auto; padding: 20px; gap: 20px; }
        
        .sidebar { width: 300px; display: flex; flex-direction: column; gap: 15px; }
        .box { background: #222; border: 1px solid #333; border-radius: 4px; padding: 15px; }
        .box h3 { font-size: 13px; text-transform: uppercase; color: #888; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 12px; letter-spacing: 0.5px; }

        .bar-container { margin-bottom: 12px; }
        .bar-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: bold; }
        .bar-bg { width: 100%; background: #333; height: 14px; border-radius: 2px; overflow: hidden; border: 1px solid #444; }
        .bar-fill { height: 100%; width: 0%; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .energy-fill { background: linear-gradient(90deg, #cc0000, #ff3333); }
        .nerve-fill { background: linear-gradient(90deg, #993399, #cc66cc); }
        .happy-fill { background: linear-gradient(90deg, #e67e22, #f1c40f); }
        .hp-fill { background: linear-gradient(90deg, #006600, #00cc00); }

        .stat-line { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px dashed #2a2a2a; }
        .stat-line strong { color: #aaa; }

        .main-content { flex: 2; display: flex; flex-direction: column; gap: 20px; }
        .panel-header { background: #2a2a2a; color: #ff9900; padding: 12px 18px; font-weight: bold; font-size: 14px; border-radius: 4px 4px 0 0; border-left: 4px solid #ff9900; text-transform: uppercase; letter-spacing: 0.5px; }
        .panel-body { background: #222; border: 1px solid #333; border-top: none; padding: 20px; border-radius: 0 0 4px 4px; }

        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
        button { background: #333; border: 1px solid #444; color: #fff; padding: 11px; border-radius: 3px; font-weight: bold; cursor: pointer; font-size: 11px; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
        button:hover { background: #ff9900; color: #000; border-color: #ff9900; }
        
        .store-item, .inv-item { background: #1a1a1a; border: 1px solid #2d2d2d; padding: 12px; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
        .store-item small, .inv-item small { color: #888; }
        .store-item button, .inv-item button { padding: 6px 14px; font-size: 11px; width: auto; }
    </style>
</head>
<body>

    <header>
        <h1>Torn Underground</h1>
        <div class="user-summary">
            <span id="player-alias">Accessing Link Profile Node...</span>
            <span id="player-cash" class="cash-display">$0</span>
        </div>
    </header>

    <div class="game-container">
        
        <!-- SIDEBAR MONITOR PANEL -->
        <div class="sidebar">
            <div class="box">
                <h3>Vital Core Tracks</h3>
                <div class="bar-container">
                    <div class="bar-label"><span>Energy</span><span id="energy-text">0/0</span></div>
                    <div class="bar-bg"><div id="energy-bar" class="bar-fill energy-fill"></div></div>
                </div>
                <div class="bar-container">
                    <div class="bar-label"><span>Nerve</span><span id="nerve-text">0/0</span></div>
                    <div class="bar-bg"><div id="nerve-bar" class="bar-fill nerve-fill"></div></div>
                </div>
                <div class="bar-container">
                    <div class="bar-label"><span>Happy</span><span id="happy-text">0/0</span></div>
                    <div class="bar-bg"><div id="happy-bar" class="bar-fill happy-fill"></div></div>
                </div>
                <div class="bar-container">
                    <div class="bar-label"><span>Life</span><span id="hp-text">0/0</span></div>
                    <div class="bar-bg"><div id="hp-bar" class="bar-fill hp-fill"></div></div>
                </div>
            </div>

            <div class="box">
                <h3>Combat Attributes</h3>
                <div id="battle-stats-box">
                    <div class="stat-line"><strong>Strength:</strong> <span id="stat-str">0</span></div>
                    <div class="stat-line"><strong>Defense:</strong> <span id="stat-def">0</span></div>
                    <div class="stat-line"><strong>Speed:</strong> <span id="stat-spd">0</span></div>
                    <div class="stat-line"><strong>Dexterity:</strong> <span id="stat-dex">0</span></div>
                </div>
            </div>
        </div>

        <!-- MAIN GAME CONTROL DECK -->
        <div class="main-content">
            <div>
                <div class="panel-header">District Facilities</div>
                <div class="panel-body">
                    <p style="margin-bottom: 15px; color: #aaa; font-size: 13px;">Expend local energy cells within the weights gym room to optimize physical parameters, or burn active nerve focus to execute operations.</p>
                    <div class="action-grid">
                        <button onclick="train('strength')">Pump Strength (-10 Energy)</button>
                        <button onclick="train('defense')">Fortify Defense (-10 Energy)</button>
                        <button onclick="train('speed')">Drill Speed (-10 Energy)</button>
                        <button onclick="train('dexterity')">Refine Dexterity (-10 Energy)</button>
                    </div>
                    <div style="margin-top: 15px;">
                        <button style="background: #2b3a4a; border-color: #3b4b5a; width: 100%;" onclick="crime()">Commit Street Crime Hustle (-2 Nerve)</button>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 20px;">
                <div style="flex: 1;">
                    <div class="panel-header">Black Market Merchant</div>
                    <div class="panel-body" id="shop-catalog">Loading secure node manifest...</div>
                </div>
                <div style="flex: 1;">
                    <div class="panel-header">Vault Inventory Container</div>
                    <div class="panel-body" id="player-inventory">No active property logs inside locker.</div>
                </div>
            </div>
        </div>

    </div>

    <script src="app.js"></script>
</body>
</html>