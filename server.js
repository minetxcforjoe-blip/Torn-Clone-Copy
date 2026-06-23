const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("database.db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "torn-ultimate-mmo-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ===== MASTER DATABASE SCHEMA DEPLOYMENT =====
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT,
        money INTEGER DEFAULT 5000, energy INTEGER DEFAULT 100, nerve INTEGER DEFAULT 20,
        hp INTEGER DEFAULT 100, happy INTEGER DEFAULT 100, max_energy INTEGER DEFAULT 100,
        max_nerve INTEGER DEFAULT 20, max_hp INTEGER DEFAULT 100, max_happy INTEGER DEFAULT 100,
        strength INTEGER DEFAULT 15, defense INTEGER DEFAULT 15, speed INTEGER DEFAULT 15, dexterity INTEGER DEFAULT 15,
        hospital_until INTEGER DEFAULT 0, avatar TEXT DEFAULT 'Thief',
        equip_head TEXT DEFAULT 'None', equip_body TEXT DEFAULT 'None', equip_legs TEXT DEFAULT 'None', equip_weapon TEXT DEFAULT 'None'
    )`);

    db.run(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, type TEXT, slot TEXT DEFAULT 'none',
        price INTEGER, description TEXT, stat_bonus INTEGER DEFAULT 0, stat_penalty INTEGER DEFAULT 0, drop_chance REAL DEFAULT 0.0
    )`, () => {
        const stmt = db.prepare(`INSERT OR IGNORE INTO items (name, type, slot, price, description, stat_bonus, stat_penalty, drop_chance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        
        // Armor Loadouts
        stmt.run("Street Hoodie", "armor", "body", 300, "A thin but flexible hoodie. Minimal protection but high mobility.", 2, 0, 0.25);
        stmt.run("Leather Jacket", "armor", "body", 500, "Tough leather jacket worn by street runners. Decent speed balance.", 5, 0, 0.15);
        stmt.run("Thief Outfit", "armor", "body", 800, "Dark stealth gears designed to avoid surveillance grids.", 8, -1, 0.10);
        stmt.run("Tactical Vest", "armor", "body", 1500, "Kevlar tactical plating. Great protection without heavy burden.", 15, 1, 0.05);
        stmt.run("Riot Gear", "armor", "body", 2000, "Heavy reinforcement setup designed for riot suppression vectors.", 25, 3, 0.02);
        stmt.run("Combat Suit", "armor", "body", 2500, "Military spec grid mesh armor designed for front-line deployment.", 35, 2, 0.01);
        stmt.run("Steel Armor Set", "armor", "body", 5000, "Medieval-grade plating. Extreme defensive value, massive weight drop.", 55, 7, 0.00);
        stmt.run("Riot Shield Armor", "armor", "head", 6500, "Reinforced polycarbonate ballistic protection array shield.", 65, 5, 0.00);
        stmt.run("Military Exo Vest", "armor", "body", 10000, "Advanced motorized framework exoskeleton. Peak defense layer.", 100, 10, 0.00);

        // Weapon Armaments
        stmt.run("Pocket Knife", "weapon", "weapon", 200, "Concealed steel edge weapon for close encounters.", 10, 0, 0.30);
        stmt.run("Handgun", "weapon", "weapon", 1000, "Reliable 9mm standard issue street iron.", 30, 0, 0.08);
        stmt.run("Axe", "weapon", "weapon", 1500, "Heavy clearing axe. Delivers tracking impact damage, slows speed swing.", 50, 2, 0.04);
        stmt.run("Assault Rifle", "weapon", "weapon", 4000, "Fully automatic hardware carbine rifle.", 85, 1, 0.01);
        stmt.run("Explosives Kit", "weapon", "weapon", 8000, "Unstable chemical demolition compounds for absolute breaches.", 140, 5, 0.00);

        // Consumables Utilities
        stmt.run("Coffee", "consumable", "none", 20, "Caffeine compound. Safely updates Energy allocation by +10.", 10, 0, 0.40);
        stmt.run("Chocolate Bar", "consumable", "none", 30, "Sugar block snack. Restores +15 Energy cells.", 15, 0, 0.35);
        stmt.run("Energy Drink", "consumable", "none", 50, "Synthesized hyper rush taurine fluid. Restores +30 Energy instantly.", 30, 0, 0.20);
        stmt.run("First Aid Kit", "consumable", "none", 200, "Basic field dressings. Patches up +35 HP health pools.", 35, 0, 0.15);
        stmt.run("Med Kit", "consumable", "none", 500, "Professional tactical surgery gear. Restores +75 HP instantly.", 75, 0, 0.05);
        stmt.run("Painkillers", "consumable", "none", 900, "Chemical grade block agents. Restores +100 HP and forces hospital extraction.", 100, 0, 0.02);

        // Passive Support Nodes
        stmt.run("Gloves", "crime_booster", "none", 100, "Ergonomic crime grips. Erases thermal print metrics across tasks.", 0, 0, 0.30);
        stmt.run("Mask", "crime_booster", "none", 150, "Ballistic concealment mask to scramble identification vectors.", 0, 0, 0.25);
        stmt.run("Lockpick Set", "crime_booster", "none", 300, "Tension wrenches and tools for breaking locks cleanly.", 0, 0, 0.15);
        stmt.run("Hacker Laptop", "crime_booster", "none", 2000, "Modified system terminal with automated security bypass scripts.", 0, 0, 0.02);
        stmt.run("Protein Shake", "gym_booster", "none", 80, "Whey isolates to optimize strength gains.", 0, 0, 0.20);
        stmt.run("Wrist Straps", "gym_booster", "none", 120, "Heavy woven fiber supports to amplify raw lifting thresholds.", 0, 0, 0.15);
        stmt.run("Running Shoes", "gym_booster", "none", 150, "Pneumatic athletic runners that speed up cardio workouts.", 0, 0, 0.12);
        stmt.run("Focus Pill", "gym_booster", "none", 200, "Nootropic capsule. Heightens dexterity and reaction fields.", 0, 0, 0.08);

        // Loot Cargo Drops
        stmt.run("Stolen Phone", "loot", "none", 300, "Decrypted mobile phone asset. Ready to liquidate for cash values.", 0, 0, 0.50);
        stmt.run("Car Keys", "loot", "none", 800, "Ignition code pairing keycard for target high-end vehicles.", 0, 0, 0.20);
        stmt.run("Jewelry", "loot", "none", 1000, "Assorted gold bands and processing diamonds.", 0, 0, 0.12);
        stmt.run("Cash Bundle", "loot", "none", 2000, "Unmarked bills recovered from secure drop points.", 0, 0, 0.08);
        stmt.run("Diamond Ring", "loot", "none", 3000, "High carats luxury brand band asset.", 0, 0, 0.05);
        stmt.run("Hacked Laptop", "loot", "none", 3500, "Corporate server node data drive. Liquidates cleanly at the pawn market.", 0, 0, 0.03);
        stmt.finalize();
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS user_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, item_id INTEGER, quantity INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(item_id) REFERENCES items(id), UNIQUE(user_id, item_id)
    )`);

    db.run(`
    CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER, receiver_id INTEGER,
        sender_item_id INTEGER, sender_qty INTEGER, cash_demand INTEGER DEFAULT 0, status TEXT DEFAULT 'PENDING',
        FOREIGN KEY(sender_id) REFERENCES users(id), FOREIGN KEY(receiver_id) REFERENCES users(id), FOREIGN KEY(sender_item_id) REFERENCES items(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

function isHospitalized(user) { return user.hospital_until > Math.floor(Date.now() / 1000); }

// ===== ENDPOINTS CORE =====
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ success: false, message: "Invalid profile data format." });
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
        if (err) return res.json({ success: false, message: "Network identification marker already claimed." });
        res.json({ success: true });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT id, username FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err || !user) return res.json({ success: false, message: "Authorization parameters mismatch." });
        req.session.user = user;
        res.json({ success: true, user });
    });
});

app.get("/player/:id", (req, res) => {
    db.get("SELECT id, username, money, energy, nerve, hp, happy, max_energy, max_nerve, max_hp, max_happy, strength, defense, speed, dexterity, hospital_until, avatar, equip_head, equip_body, equip_legs, equip_weapon FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Missing records" });
        res.json(row);
    });
});

app.get("/players/list", (req, res) => {
    if (!req.session.user) return res.status(401).json([]);
    db.all("SELECT id, username, hospital_until, avatar, (strength+defense+speed+dexterity) AS total_stats FROM users WHERE id != ?", [req.session.user.id], (err, rows) => {
        res.json(rows || []);
    });
});

app.post("/avatar/update", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    db.run("UPDATE users SET avatar = ? WHERE id = ?", [req.body.type, req.session.user.id], () => res.json({ success: true }));
});

app.post("/train", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const id = req.session.user.id; const { stat } = req.body;

    db.get(`SELECT energy, happy, max_happy, hospital_until, ${stat} FROM users WHERE id = ?`, [id], (err, user) => {
        if (!user || isHospitalized(user)) return res.json({ success: false, message: "Gym lockout active while in hospitalization." });
        if (user.energy < 10) return res.json({ success: false, message: "Insufficient energy allocation." });

        const currentVal = user[stat];
        let baseGain = 12 - (currentVal * 0.012);
        if (baseGain < 3) baseGain = 3;

        const dynamicHappyBonus = 1 + (user.happy / user.max_happy);
        const finalCalculatedGain = Math.max(1, Math.floor(baseGain * dynamicHappyBonus));

        db.run(`UPDATE users SET ${stat} = ${stat} + ?, energy = energy - 10, happy = MAX(0, happy - 3) WHERE id = ?`, [finalCalculatedGain, id], () => {
            res.json({ success: true, gain: finalCalculatedGain });
        });
    });
});

app.post("/crime", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const id = req.session.user.id; const { tier } = req.body;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        if (!user || isHospitalized(user)) return res.json({ success: false, message: "Action restricted by operational health capacity." });

        let nerveCost, lowPayout, highPayout, baseSuccessChance, lootFilter;
        if (tier === 'low') { nerveCost = 2; lowPayout = 200; highPayout = 1500; baseSuccessChance = 0.82; lootFilter = 0.45; }
        else if (tier === 'medium') { nerveCost = 5; lowPayout = 1200; highPayout = 4500; baseSuccessChance = 0.62; lootFilter = 0.22; }
        else if (tier === 'high') { nerveCost = 9; lowPayout = 4500; highPayout = 18000; baseSuccessChance = 0.38; lootFilter = 0.09; }
        else return res.status(400).json({ success: false });

        if (user.nerve < nerveCost) return res.json({ success: false, message: `Operation dropped: Requires ${nerveCost} nerve focus.` });

        const skillFactor = (user.dexterity + user.speed) / 250;
        const finalSuccessProbability = Math.min(0.95, baseSuccessChance + skillFactor);

        if (Math.random() < finalSuccessProbability) {
            const liquidCashReward = Math.floor(Math.random() * (highPayout - lowPayout + 1)) + lowPayout;
            
            db.all("SELECT * FROM items WHERE drop_chance > 0 AND drop_chance <= ?", [lootFilter], (err, dropPool) => {
                let foundItem = null;
                if (dropPool && dropPool.length > 0 && Math.random() < 0.45) {
                    foundItem = dropPool[Math.floor(Math.random() * dropPool.length)];
                }

                db.serialize(() => {
                    db.run("UPDATE users SET money = money + ?, nerve = nerve - ? WHERE id = ?", [liquidCashReward, nerveCost, id]);
                    if (foundItem) {
                        db.run(`INSERT INTO user_items (user_id, item_id, quantity) VALUES (?, ?, 1) ON CONFLICT(user_id, item_id) DO UPDATE SET quantity = quantity + 1`, [id, foundItem.id], () => {
                            res.json({ success: true, message: `CRIME SUCCESS! Net yield: +$${liquidCashReward.toLocaleString()} and secured item: [${foundItem.name}]` });
                        });
                    } else {
                        res.json({ success: true, message: `CRIME SUCCESS! Net yield: +$${liquidCashReward.toLocaleString()}` });
                    }
                });
            });
        } else {
            if (Math.random() > 0.40 || tier === 'low') {
                const penaltyAssetFine = Math.floor(user.money * 0.06);
                db.run("UPDATE users SET money = MAX(0, money - ?), nerve = nerve - ? WHERE id = ?", [penaltyAssetFine, nerveCost, id], () => {
                    res.json({ success: true, message: `MISSION FAILED: Evaded tactical police grid but lost $${penaltyAssetFine.toLocaleString()} in clean up costs.` });
                });
            } else {
                const isolationDuration = tier === 'medium' ? 120 : 300;
                const releaseTimestamp = Math.floor(Date.now() / 1000) + isolationDuration;
                db.run("UPDATE users SET nerve = nerve - ?, hospital_until = ?, hp = 5 WHERE id = ?", [nerveCost, releaseTimestamp, id], () => {
                    res.json({ success: true, message: `CRITICAL FAIL: Cornered by swat sweep teams. Hospital locked out for ${isolationDuration / 60} minutes.` });
                });
            }
        }
    });
});

app.get("/shop/items", (req, res) => {
    db.all("SELECT id, name, type, slot, price, description, stat_bonus, stat_penalty FROM items WHERE price > 0", [], (err, rows) => {
        res.json(rows || []);
    });
});

app.post("/shop/buy", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const uId = req.session.user.id; const { itemId } = req.body;

    db.get("SELECT price FROM items WHERE id = ?", [itemId], (err, targetItem) => {
        if (!targetItem) return res.json({ success: false, message: "Item profile offline." });
        db.get("SELECT money FROM users WHERE id = ?", [uId], (err, user) => {
            if (user.money < targetItem.price) return res.json({ success: false, message: "Liquid asset balance check failed." });
            
            db.serialize(() => {
                db.run("UPDATE users SET money = money - ? WHERE id = ?", [targetItem.price, uId]);
                db.run("INSERT INTO user_items (user_id, item_id, quantity) VALUES (?, ?, 1) ON CONFLICT(user_id, item_id) DO UPDATE SET quantity = quantity + 1", [uId, itemId], () => {
                    res.json({ success: true });
                });
            });
        });
    });
});

app.get("/inventory", (req, res) => {
    if (!req.session.user) return res.status(401).json([]);
    db.all(`
        SELECT items.id, items.name, items.type, items.slot, items.price, items.description, items.stat_bonus, user_items.quantity 
        FROM user_items JOIN items ON user_items.item_id = items.id 
        WHERE user_items.user_id = ? AND user_items.quantity > 0
    `, [req.session.user.id], (err, rows) => {
        res.json(rows || []);
    });
});

app.post("/inventory/pawn", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const uId = req.session.user.id; const { itemId } = req.body;

    db.get(`
        SELECT user_items.quantity, items.price, items.name 
        FROM user_items JOIN items ON user_items.item_id = items.id 
        WHERE user_items.user_id = ? AND user_items.item_id = ? AND user_items.quantity > 0
    `, [uId, itemId], (err, match) => {
        if (!match) return res.json({ success: false, message: "Item profile not found in personal inventory lockers." });

        const liquidationValue = Math.floor(match.price * 0.50);
        db.serialize(() => {
            db.run("UPDATE user_items SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?", [uId, itemId]);
            db.run("UPDATE users SET money = money + ? WHERE id = ?", [liquidationValue, uId], () => {
                res.json({ success: true, message: `Liquidated 1x [${match.name}] to Pawn Hub for $${liquidationValue.toLocaleString()} credit.` });
            });
        });
    });
});

app.post("/equipment/equip", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const uId = req.session.user.id; const { itemId } = req.body;

    db.get("SELECT name, slot FROM user_items JOIN items ON user_items.item_id = items.id WHERE user_items.user_id = ? AND user_items.item_id = ? AND user_items.quantity > 0", [uId, itemId], (err, match) => {
        if (!match) return res.json({ success: false, message: "Target module unowned." });
        
        let targetSlotColumn = "";
        if (match.slot === "head") targetSlotColumn = "equip_head";
        else if (match.slot === "body") targetSlotColumn = "equip_body";
        else if (match.slot === "legs") targetSlotColumn = "equip_legs";
        else if (match.slot === "weapon") targetSlotColumn = "equip_weapon";
        else return res.json({ success: false, message: "Static cargo can't be slotted to tactical gear matrix." });

        db.run(`UPDATE users SET ${targetSlotColumn} = ? WHERE id = ?`, [match.name, uId], () => res.json({ success: true }));
    });
});

app.post("/equipment/unequip", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const targetSlotField = `equip_${req.body.slot}`;
    db.run(`UPDATE users SET ${targetSlotField} = 'None' WHERE id = ?`, [req.session.user.id], () => res.json({ success: true }));
});

app.post("/inventory/use", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const uId = req.session.user.id; const { itemId } = req.body;

    db.get("SELECT items.id, items.name, items.type, items.stat_bonus FROM user_items JOIN items ON user_items.item_id = items.id WHERE user_items.user_id = ? AND user_items.item_id = ? AND user_items.quantity > 0", [uId, itemId], (err, match) => {
        if (!match || match.type !== 'consumable') return res.json({ success: false, message: "Target asset is not consumable cargo." });

        db.serialize(() => {
            db.run("UPDATE user_items SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?", [uId, itemId]);
            if (match.name === "Coffee" || match.name === "Chocolate Bar" || match.name === "Energy Drink") {
                db.run("UPDATE users SET energy = MIN(max_energy, energy + ?) WHERE id = ?", [match.stat_bonus, uId], () => {
                    res.json({ success: true, message: `Injected packet payload [${match.name}]. Energy modified: +${match.stat_bonus}.` });
                });
            } else {
                let queryUpdate = "UPDATE users SET hp = MIN(max_hp, hp + ?) WHERE id = ?";
                if (match.name === "Painkillers") { queryUpdate = "UPDATE users SET hp = MIN(max_hp, hp + ?), hospital_until = 0 WHERE id = ?"; }
                db.run(queryUpdate, [match.stat_bonus, uId], () => {
                    res.json({ success: true, message: `Deployed medical vector [${match.name}]. Vitality reinforcement: +${match.stat_bonus}.` });
                });
            }
        });
    });
});

app.post("/attack", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const attackerId = req.session.user.id; const { targetId } = req.body;

    db.get("SELECT * FROM users WHERE id = ?", [attackerId], (err, att) => {
        db.get("SELECT * FROM users WHERE id = ?", [targetId], (err, tar) => {
            if (!att || !tar || isHospitalized(att) || isHospitalized(tar)) return res.json({ success: false, message: "Link sequence terminated: Operational capability verification check failed." });
            if (att.energy < 25) return res.json({ success: false, message: "Minimum 25 operational energy units required." });

            db.all("SELECT name, type, stat_bonus, stat_penalty FROM items WHERE name IN (?,?,?,?,?,?,?,?)", 
            [att.equip_head, att.equip_body, att.equip_legs, att.equip_weapon, tar.equip_head, tar.equip_body, tar.equip_legs, tar.equip_weapon], (err, gears) => {
                
                let attWeaponDmg = 0, attArmorDef = 0, attArmorSpdPenalty = 0;
                let tarWeaponDmg = 0, tarArmorDef = 0, tarArmorSpdPenalty = 0;

                gears.forEach(g => {
                    if (g.name === att.equip_weapon) attWeaponDmg += g.stat_bonus;
                    if (g.name === att.equip_head || g.name === att.equip_body || g.name === att.equip_legs) { attArmorDef += g.stat_bonus; attArmorSpdPenalty += g.stat_penalty; }
                    
                    if (g.name === tar.equip_weapon) tarWeaponDmg += g.stat_bonus;
                    if (g.name === tar.equip_head || g.name === tar.equip_body || g.name === tar.equip_legs) { tarArmorDef += g.stat_bonus; tarArmorSpdPenalty += g.stat_penalty; }
                });

                const modifiedAttStrength = att.strength + attWeaponDmg;
                const modifiedAttSpeed = Math.max(2, att.speed - attArmorSpdPenalty);
                const modifiedTarDefense = tar.defense + tarArmorDef;

                const accuracyRatio = modifiedAttSpeed / (tar.dexterity || 1);
                const baselineHitChance = Math.max(0.10, Math.min(0.90, 0.50 + (Math.log10(accuracyRatio) * 0.30)));
                
                const logs = [];
                logs.push(`ENGAGED VECTOR PINPOINT: Attack vector launched at ${tar.username}...`);
                
                db.serialize(() => {
                    db.run("UPDATE users SET energy = energy - 25 WHERE id = ?", [attackerId]);

                    if (Math.random() < baselineHitChance) {
                        const damageRatio = modifiedAttStrength / (modifiedTarDefense || 1);
                        const baselineDamageOutput = Math.max(8, Math.floor(30 * Math.sqrt(damageRatio)));
                        const finalDamageYield = Math.floor(baselineDamageOutput * (0.85 + Math.random() * 0.30));

                        const cashSiphoned = Math.floor(tar.money * 0.20);
                        const emergencyLockTime = Math.floor(Date.now() / 1000) + 240;

                        logs.push(`HIT CONFIRMED: Breach calculated for ${finalDamageYield} structural impact damage points!`);
                        logs.push(`OPERATIONAL OUTCOME: Victory confirmed. Extracted $${cashSiphoned.toLocaleString()} pipeline liquidity assets.`);

                        db.run("UPDATE users SET money = money + ? WHERE id = ?", [cashSiphoned, attackerId]);
                        db.run("UPDATE users SET money = MAX(0, money - ?), hospital_until = ?, hp = 0 WHERE id = ?", [cashSiphoned, emergencyLockTime, targetId], () => {
                            res.json({ success: true, log: logs });
                        });
                    } else {
                        logs.push(`EVASION COUNTER: Tactical target evaded your velocity payload vector completely.`);
                        const selfHospExpiry = Math.floor(Date.now() / 1000) + 180;
                        logs.push(`CRITICAL BLOW: Target execution counter-strike successful. You are hospitalized.`);
                        db.run("UPDATE users SET hospital_until = ?, hp = 0 WHERE id = ?", [selfHospExpiry, attackerId], () => {
                            res.json({ success: true, log: logs });
                        });
                    }
                });
            });
        });
    });
});

app.get("/trades/mailbox", (req, res) => {
    if (!req.session.user) return res.status(401).json([]);
    const uId = req.session.user.id;

    db.all(`
        SELECT trades.*, u1.username AS sender, u2.username AS receiver, items.name AS item_name 
        FROM trades 
        JOIN users u1 ON trades.sender_id = u1.id 
        JOIN users u2 ON trades.receiver_id = u2.id 
        JOIN items ON trades.sender_item_id = items.id 
        WHERE (trades.sender_id = ? OR trades.receiver_id = ?) AND trades.status = 'PENDING'
    `, [uId, uId], (err, rows) => {
        res.json(rows || []);
    });
});

app.post("/trades/propose", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const sId = req.session.user.id;
    const { receiverId, itemId, qty, cashDemand } = req.body;

    db.get("SELECT quantity FROM user_items WHERE user_id = ? AND item_id = ? AND quantity >= ?", [sId, itemId, qty], (err, check) => {
        if (!check) return res.json({ success: false, message: "Inventory quantities verification check failed." });

        db.run(`
            INSERT INTO trades (sender_id, receiver_id, sender_item_id, sender_qty, cash_demand) 
            VALUES (?, ?, ?, ?, ?)
        `, [sId, receiverId, itemId, qty, cashDemand], () => res.json({ success: true }));
    });
});

app.post("/trades/resolve", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const userId = req.session.user.id;
    const { tradeId, action } = req.body;

    db.get("SELECT * FROM trades WHERE id = ? AND status = 'PENDING'", [tradeId], (err, trade) => {
        if (!trade) return res.json({ success: false, message: "Transaction network connection drop." });

        if (action === 'DECLINE') {
            db.run("UPDATE trades SET status = 'DECLINED' WHERE id = ?", [tradeId], () => res.json({ success: true }));
            return;
        }

        db.get("SELECT money FROM users WHERE id = ?", [trade.receiver_id], (err, recipient) => {
            if (recipient.money < trade.cash_demand) return res.json({ success: false, message: "Insufficient trade funds." });

            db.get("SELECT quantity FROM user_items WHERE user_id = ? AND item_id = ? AND quantity >= ?", [trade.sender_id, trade.sender_item_id, trade.sender_qty], (err, storage) => {
                if (!storage) return res.json({ success: false, message: "Originator cargo files no longer present." });

                db.serialize(() => {
                    db.run("UPDATE trades SET status = 'ACCEPTED' WHERE id = ?", [tradeId]);
                    db.run("UPDATE users SET money = money + ? WHERE id = ?", [trade.cash_demand, trade.sender_id]);
                    db.run("UPDATE users SET money = money - ? WHERE id = ?", [trade.cash_demand, trade.receiver_id]);
                    db.run("UPDATE user_items SET quantity = quantity - ? WHERE user_id = ? AND item_id = ?", [trade.sender_qty, trade.sender_id, trade.sender_item_id]);
                    db.run(`
                        INSERT INTO user_items (user_id, item_id, quantity) VALUES (?, ?, ?) 
                        ON CONFLICT(user_id, item_id) DO UPDATE SET quantity = quantity + ?
                    `, [trade.receiver_id, trade.sender_item_id, trade.sender_qty, trade.sender_qty], () => {
                        res.json({ success: true });
                    });
                });
            });
        });
    });
});

app.get("/chat/load", (req, res) => {
    db.all("SELECT username, message FROM chat ORDER BY id DESC LIMIT 40", [], (err, rows) => {
        res.json(rows ? rows.reverse() : []);
    });
});

app.post("/chat/send", (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false });
    const { msg } = req.body; if (!msg || !msg.trim()) return res.json({ success: false });
    db.run("INSERT INTO chat (username, message) VALUES (?, ?)", [req.session.user.username, msg.slice(0, 140)], () => res.json({ success: true }));
});

setInterval(() => {
    db.run("UPDATE users SET energy=MIN(max_energy, energy+8), nerve=MIN(max_nerve, nerve+2), hp=MIN(max_hp, hp+8), happy=MIN(max_happy, happy+15)");
}, 60000);

app.listen(PORT, () => console.log(`[ONLINE] core game loop operating live on port ${PORT}`));