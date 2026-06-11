import { useState } from "react";
import { Analytics } from "@/components/analytics";

// ─── DATASET (39 products — CDL Google Sheets) ───────────────────────────────
const PRODUCTS = [
  { brand:"EcoFlow", model:"RIVER 3", price:199, wh:220, surge:600, solar:110, ups:false, expandable:false, weight:6.6, warranty:5, scores:{home_backup:4,rv:6,camping:8,off_grid:3,apartment:7,medical:4,value:9}, notes:"Entry-level. Ideal for small devices & travel." },
  { brand:"EcoFlow", model:"RIVER 3 Plus", price:299, wh:440, surge:1200, solar:220, ups:false, expandable:false, weight:10.8, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Best compact for camping & apartment emergencies." },
  { brand:"EcoFlow", model:"DELTA 3 Classic", price:449, wh:900, surge:3600, solar:500, ups:true, expandable:false, weight:22, warranty:5, scores:{home_backup:7,rv:7,camping:7,off_grid:5,apartment:7,medical:7,value:9}, notes:"Most affordable 1kWh LFP with UPS. Strong value." },
  { brand:"EcoFlow", model:"DELTA 3 Plus", price:599, wh:900, surge:4400, solar:500, ups:true, expandable:true, weight:22, warranty:5, scores:{home_backup:8,rv:7,camping:7,off_grid:6,apartment:7,medical:7,value:8}, notes:"X-Boost enables 2,200W. Best mid-range pick." },
  { brand:"EcoFlow", model:"DELTA 3 Max", price:749, wh:1800, surge:4800, solar:800, ups:true, expandable:true, weight:28, warranty:5, scores:{home_backup:8,rv:7,camping:6,off_grid:7,apartment:6,medical:7,value:8}, notes:"2kWh sweet spot for home backup & RV." },
  { brand:"EcoFlow", model:"DELTA 3 Max Plus", price:999, wh:1800, surge:6000, solar:800, ups:true, expandable:true, weight:30, warranty:5, scores:{home_backup:9,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"3000W output for larger appliances." },
  { brand:"EcoFlow", model:"DELTA 2", price:699, wh:900, surge:3600, solar:500, ups:true, expandable:true, weight:27, warranty:5, scores:{home_backup:7,rv:6,camping:6,off_grid:5,apartment:7,medical:6,value:7}, notes:"Best-seller. Widely available. Solid UPS." },
  { brand:"EcoFlow", model:"DELTA 2 Max", price:999, wh:1800, surge:4800, solar:800, ups:true, expandable:true, weight:28, warranty:5, scores:{home_backup:8,rv:7,camping:6,off_grid:7,apartment:6,medical:7,value:7}, notes:"Popular 2kWh with solid expandability." },
  { brand:"EcoFlow", model:"DELTA Pro", price:2499, wh:3200, surge:7200, solar:1600, ups:true, expandable:true, weight:45, warranty:5, scores:{home_backup:9,rv:6,camping:4,off_grid:8,apartment:4,medical:8,value:6}, notes:"Pro home backup. Expandable to 25kWh. Heavy." },
  { brand:"EcoFlow", model:"RIVER 2", price:249, wh:220, surge:600, solar:110, ups:false, expandable:false, weight:7.7, warranty:5, scores:{home_backup:3,rv:5,camping:7,off_grid:3,apartment:7,medical:4,value:8}, notes:"Legacy entry model. Still widely sold." },
  { brand:"EcoFlow", model:"RIVER 2 Max", price:349, wh:440, surge:1000, solar:220, ups:false, expandable:false, weight:11, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Mid compact. Good for camping." },
  { brand:"Bluetti", model:"EB3A", price:199, wh:230, surge:1200, solar:200, ups:false, expandable:false, weight:10.1, warranty:2, scores:{home_backup:4,rv:5,camping:7,off_grid:3,apartment:7,medical:5,value:8}, notes:"Budget Bluetti entry. Good for charging devices." },
  { brand:"Bluetti", model:"AC60", price:299, wh:350, surge:1200, solar:200, ups:false, expandable:false, weight:13, warranty:2, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Compact foldable solar panels compatible." },
  { brand:"Bluetti", model:"AC70", price:399, wh:660, surge:2000, solar:200, ups:false, expandable:false, weight:21.4, warranty:2, scores:{home_backup:6,rv:6,camping:7,off_grid:5,apartment:7,medical:6,value:8}, notes:"1kWh compact with 1000W. Good value." },
  { brand:"Bluetti", model:"AC180", price:499, wh:1000, surge:3600, solar:200, ups:false, expandable:false, weight:29.4, warranty:2, scores:{home_backup:7,rv:6,camping:6,off_grid:5,apartment:6,medical:6,value:8}, notes:"1.1kWh at $499. Solid mid-range." },
  { brand:"Bluetti", model:"AC200L", price:999, wh:1800, surge:3600, solar:900, ups:true, expandable:true, weight:31, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:6,medical:8,value:7}, notes:"2kWh expandable with strong AC input. UPS." },
  { brand:"Bluetti", model:"AC300", price:2299, wh:2750, surge:6000, solar:2400, ups:true, expandable:true, weight:60, warranty:5, scores:{home_backup:9,rv:4,camping:2,off_grid:9,apartment:2,medical:8,value:5}, notes:"Modular home system. Requires B300 battery." },
  { brand:"Bluetti", model:"AC500", price:3999, wh:5500, surge:10000, solar:3000, ups:true, expandable:true, weight:60, warranty:5, scores:{home_backup:10,rv:3,camping:1,off_grid:10,apartment:2,medical:9,value:4}, notes:"Highest output portable system. Near-home grade." },
  { brand:"Bluetti", model:"Elite 300", price:1499, wh:2700, surge:4800, solar:1200, ups:true, expandable:false, weight:55, warranty:5, scores:{home_backup:8,rv:5,camping:3,off_grid:7,apartment:4,medical:8,value:6}, notes:"3kWh in compact body. Good home backup." },
  { brand:"Jackery", model:"Explorer 300 Plus", price:199, wh:250, surge:600, solar:80, ups:false, expandable:false, weight:7.3, warranty:3, scores:{home_backup:3,rv:5,camping:8,off_grid:3,apartment:8,medical:4,value:8}, notes:"Ultra-portable. Camping & travel focus." },
  { brand:"Jackery", model:"Explorer 1000 v2", price:449, wh:940, surge:3000, solar:400, ups:false, expandable:false, weight:23.4, warranty:3, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:7,medical:6,value:9}, notes:"Best value 1kWh LFP. Lightweight for class." },
  { brand:"Jackery", model:"Explorer 1000 Plus", price:899, wh:1110, surge:4000, solar:800, ups:false, expandable:true, weight:25.5, warranty:3, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:6,value:7}, notes:"Expandable 1kWh+ with 2000W output." },
  { brand:"Jackery", model:"Explorer 2000 v2", price:1599, wh:1800, surge:4400, solar:800, ups:false, expandable:false, weight:39.5, warranty:3, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"Lightweight 2kWh. 41% lighter than competitors." },
  { brand:"Jackery", model:"Explorer 2000 Plus", price:899, wh:1800, surge:6000, solar:1000, ups:false, expandable:true, weight:48, warranty:3, scores:{home_backup:9,rv:7,camping:5,off_grid:8,apartment:4,medical:7,value:9}, notes:"Exceptional value. Expandable to 24kWh." },
  { brand:"Jackery", model:"Explorer 600 Plus", price:399, wh:555, surge:1600, solar:200, ups:false, expandable:false, weight:14.6, warranty:3, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Mid compact. Good for camping & weekend use." },
  { brand:"Anker SOLIX", model:"C800", price:449, wh:670, surge:2400, solar:200, ups:false, expandable:false, weight:15.2, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:8}, notes:"Compact with car roof tent lights built-in." },
  { brand:"Anker SOLIX", model:"C800 Plus", price:549, wh:670, surge:2400, solar:200, ups:true, expandable:false, weight:16.3, warranty:5, scores:{home_backup:6,rv:6,camping:8,off_grid:4,apartment:8,medical:6,value:7}, notes:"C800 with integrated light bar. UPS mode." },
  { brand:"Anker SOLIX", model:"C800X", price:379, wh:670, surge:2400, solar:200, ups:false, expandable:false, weight:14.8, warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:5,value:9}, notes:"Budget C800. Best $/Wh in compact class." },
  { brand:"Anker SOLIX", model:"C1000", price:799, wh:930, surge:2000, solar:400, ups:false, expandable:false, weight:23.4, warranty:5, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:7,medical:6,value:7}, notes:"1kWh with fast recharge. 1hr to full." },
  { brand:"Anker SOLIX", model:"C2000", price:999, wh:1800, surge:4000, solar:800, ups:false, expandable:false, weight:40.5, warranty:5, scores:{home_backup:7,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:7}, notes:"2kWh solid performer. Competitive pricing." },
  { brand:"Anker SOLIX", model:"C2000 Gen 2", price:1199, wh:1800, surge:4000, solar:1000, ups:true, expandable:false, weight:38, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:8,value:7}, notes:"Gen 2 adds UPS. Better solar input. Lighter." },
  { brand:"Anker SOLIX", model:"F3800", price:2999, wh:3400, surge:12000, solar:2400, ups:true, expandable:true, weight:84.1, warranty:5, scores:{home_backup:10,rv:5,camping:3,off_grid:9,apartment:3,medical:9,value:6}, notes:"6000W/120V+240V. Best-in-class output." },
  { brand:"Zendure", model:"SuperBase M 607", price:699, wh:530, surge:1200, solar:200, ups:false, expandable:false, weight:17.6, warranty:2, scores:{home_backup:5,rv:5,camping:7,off_grid:4,apartment:7,medical:5,value:5}, notes:"Premium compact. App-controlled." },
  { brand:"Zendure", model:"SuperBase M 1016", price:999, wh:890, surge:2400, solar:200, ups:false, expandable:false, weight:26, warranty:2, scores:{home_backup:6,rv:6,camping:6,off_grid:5,apartment:6,medical:5,value:5}, notes:"Mid-range Zendure. App integration strong." },
  { brand:"Zendure", model:"SuperBase Pro 2000", price:1699, wh:1850, surge:4000, solar:800, ups:true, expandable:false, weight:46, warranty:5, scores:{home_backup:7,rv:6,camping:4,off_grid:7,apartment:5,medical:8,value:5}, notes:"UPS 13ms. AmpUp to 3000W. App-driven energy." },
  { brand:"Zendure", model:"SuperBase V 4600", price:4999, wh:4100, surge:5000, solar:1200, ups:true, expandable:true, weight:97, warranty:5, scores:{home_backup:9,rv:3,camping:1,off_grid:10,apartment:2,medical:8,value:4}, notes:"Expandable to 64kWh. Off-grid powerhouse." },

  // ─── GOAL ZERO ────────────────────────────────────────────────────────────
  { brand:"Goal Zero", model:"Yeti 1000X", price:799, wh:983, surge:3500, solar:600, ups:false, expandable:false, weight:37.7, warranty:2, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:6,medical:5,value:7}, notes:"Premium NMC build quality. Strong brand loyalty. No UPS." },
  { brand:"Goal Zero", model:"Yeti 1500X", price:999, wh:1516, surge:3500, solar:600, ups:false, expandable:false, weight:47.2, warranty:2, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:5,medical:5,value:6}, notes:"Trusted outdoor brand. 2000W continuous, 3500W surge. NMC battery." },
  { brand:"Goal Zero", model:"Yeti 3000X", price:1999, wh:3032, surge:3500, solar:600, ups:false, expandable:false, weight:69.8, warranty:2, scores:{home_backup:8,rv:5,camping:3,off_grid:7,apartment:3,medical:6,value:5}, notes:"High capacity but heavy. 2000W continuous only. Better competitors exist at price." },
  // ─── VTOMAN ───────────────────────────────────────────────────────────────
  { brand:"VTOMAN", model:"FlashSpeed 1500", price:629, wh:1548, surge:3000, solar:400, ups:true, expandable:true, weight:35.3, warranty:3, scores:{home_backup:8,rv:6,camping:6,off_grid:6,apartment:7,medical:7,value:9}, notes:"1-hour recharge. UPS <20ms. Expandable to 3096Wh. Exceptional value at $629." },
  { brand:"VTOMAN", model:"Jump 2200", price:999, wh:1548, surge:4400, solar:400, ups:true, expandable:true, weight:36.1, warranty:3, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:6,medical:7,value:8}, notes:"2200W continuous, 4400W surge. UPS. Same LFP core as FlashSpeed but more power." },
  // ─── PECRON ───────────────────────────────────────────────────────────────
  { brand:"Pecron", model:"E600LFP", price:299, wh:614, surge:2400, solar:200, ups:false, expandable:false, weight:15.9, warranty:3, scores:{home_backup:5,rv:5,camping:8,off_grid:4,apartment:8,medical:4,value:9}, notes:"Budget LFP under $300. No UPS but excellent Wh/$ ratio. Good for camping." },
  { brand:"Pecron", model:"E1000LFP", price:499, wh:1024, surge:3000, solar:600, ups:true, expandable:true, weight:26.5, warranty:3, scores:{home_backup:7,rv:7,camping:7,off_grid:6,apartment:7,medical:7,value:9}, notes:"UPS, expandable to 4096Wh, 600W solar. Exceptional value vs EcoFlow at same price." },
  { brand:"Pecron", model:"E2000LFP", price:799, wh:1920, surge:4000, solar:1200, ups:true, expandable:true, weight:44, warranty:3, scores:{home_backup:8,rv:6,camping:5,off_grid:8,apartment:5,medical:8,value:9}, notes:"1920Wh expandable to 8064Wh. UPS. 1200W solar. Underrated vs major brands." },
  // ─── DJI POWER ───────────────────────────────────────────────────────────
  { brand:"DJI Power", model:"Power 500", price:349, wh:512, surge:2000, solar:500, ups:true, expandable:false, weight:13.2, warranty:3, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:8,medical:6,value:8}, notes:"6 lbs — ultralight. UPS <20ms. SDC port for DJI drones. Best compact for tech users." },
  { brand:"DJI Power", model:"Power 1000", price:699, wh:1024, surge:4400, solar:800, ups:true, expandable:false, weight:28.6, warranty:3, scores:{home_backup:7,rv:7,camping:7,off_grid:6,apartment:7,medical:7,value:8}, notes:"4400W surge, UPS, 4000 cycles. SDC drone charging. Competitive vs EcoFlow DELTA 3 Classic." },
  // ─── RENOGY ───────────────────────────────────────────────────────────────
  { brand:"Renogy", model:"Lycan 5000", price:2999, wh:4800, surge:7000, solar:4400, ups:true, expandable:true, weight:264.6, warranty:1, scores:{home_backup:9,rv:2,camping:1,off_grid:10,apartment:1,medical:8,value:5}, notes:"Whole-home stationary system. 3500W continuous, 7000W surge. Expandable to 19.2kWh. 264 lbs." },
  // ─── GENEVERSE ───────────────────────────────────────────────────────────
  { brand:"Geneverse", model:"HomePower ONE PRO", price:499, wh:1210, surge:2400, solar:400, ups:false, expandable:false, weight:38, warranty:5, scores:{home_backup:7,rv:6,camping:6,off_grid:5,apartment:6,medical:6,value:8}, notes:"Home backup focused. LFP. 1.5h charge. Simple, reliable. Sold at Lowe's and Home Depot." },
  { brand:"Geneverse", model:"HomePower TWO PRO", price:999, wh:2419, surge:4400, solar:800, ups:false, expandable:false, weight:49, warranty:5, scores:{home_backup:8,rv:6,camping:4,off_grid:6,apartment:4,medical:7,value:7}, notes:"2.4kWh LFP for home backup. 4400W surge. Sold at major retailers. No UPS." },

  // ─── EcoFlow gaps ─────────────────────────────────────────────────────────
  { brand:"EcoFlow", model:"RIVER 2 Pro", price:349, wh:768, surge:1600, solar:220, ups:true, expandable:true, weight:17.4, warranty:5, scores:{home_backup:5,rv:6,camping:9,off_grid:4,apartment:7,medical:5,value:8}, notes:"768Wh LFP. 800W continuous. UPS. Expandable to 2x. Compact camping flagship." },
  { brand:"EcoFlow", model:"DELTA Pro 3", price:2999, wh:4096, surge:8000, solar:2600, ups:true, expandable:true, weight:71.7, warranty:5, scores:{home_backup:10,rv:4,camping:2,off_grid:9,apartment:2,medical:9,value:6}, notes:"2025 flagship. 4000W continuous 8000W surge. 240V output. LFP. 5yr warranty." },
  // ─── Zendure gap ──────────────────────────────────────────────────────────
  { brand:"Zendure", model:"Hyper 2000", price:1299, wh:2015, surge:4000, solar:1200, ups:true, expandable:true, weight:35, warranty:2, scores:{home_backup:8,rv:6,camping:5,off_grid:7,apartment:6,medical:7,value:7}, notes:"2000W continuous. LFP. UPS. 1200W solar. Hub expandable to 64kWh." },
  // ─── Jackery gap ──────────────────────────────────────────────────────────
  { brand:"Jackery", model:"Explorer 3000 Pro", price:2299, wh:2400, surge:6000, solar:1000, ups:false, expandable:false, weight:63.9, warranty:3, scores:{home_backup:8,rv:5,camping:3,off_grid:7,apartment:3,medical:5,value:5}, notes:"3000W continuous 6000W surge NMC. Heavy 63.9 lbs. No UPS. 3yr warranty." },
  // ─── OUPES ────────────────────────────────────────────────────────────────
  { brand:"OUPES", model:"Mega 1", price:399, wh:1024, surge:4500, solar:1000, ups:true, expandable:true, weight:26.5, warranty:5, scores:{home_backup:8,rv:7,camping:7,off_grid:6,apartment:7,medical:7,value:9}, notes:"2000W continuous 4500W surge LFP. UPS <20ms. Expandable to 5.12kWh. 36-min charge." },
  { brand:"OUPES", model:"Mega 2", price:799, wh:2048, surge:5400, solar:1800, ups:true, expandable:true, weight:44, warranty:5, scores:{home_backup:9,rv:7,camping:5,off_grid:7,apartment:5,medical:8,value:8}, notes:"2500W continuous 5400W surge LFP. UPS. Expandable to 10.24kWh. 0.6hr charge." },
  { brand:"OUPES", model:"Mega 3", price:1082, wh:3072, surge:7000, solar:1900, ups:true, expandable:true, weight:66, warranty:5, scores:{home_backup:9,rv:5,camping:3,off_grid:8,apartment:3,medical:8,value:7}, notes:"3600W continuous 7000W surge LFP. UPS. Expandable to 15.36kWh. 1hr charge." },
  { brand:"OUPES", model:"Mega 5", price:2499, wh:5040, surge:7000, solar:3900, ups:true, expandable:true, weight:88, warranty:5, scores:{home_backup:10,rv:3,camping:1,off_grid:9,apartment:2,medical:9,value:6}, notes:"4000W continuous 7000W surge LFP. UPS. Expandable to 45.36kWh. 1.3hr charge." },
  { brand:"OUPES", model:"Exodus 2400", price:799, wh:2232, surge:4500, solar:1100, ups:true, expandable:false, weight:45.2, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:8}, notes:"2400W continuous 4500W surge LFP. UPS. 0-80% in 1.2hr. Lightest 2kWh class." },
  // ─── Growatt ──────────────────────────────────────────────────────────────
  { brand:"Growatt", model:"Infinity 1500", price:599, wh:1512, surge:4000, solar:800, ups:true, expandable:true, weight:35.3, warranty:2, scores:{home_backup:7,rv:7,camping:7,off_grid:6,apartment:7,medical:5,value:8}, notes:"2000W continuous 4000W surge NMC. EPS <20ms. Expandable 3 units. 2yr warranty." },
  { brand:"Growatt", model:"Infinity 1300", price:499, wh:1382, surge:3600, solar:800, ups:true, expandable:false, weight:36.4, warranty:5, scores:{home_backup:7,rv:7,camping:7,off_grid:5,apartment:7,medical:3,value:8}, notes:"1800W LFP. UPS ~20s switchover — slow, NOT suitable for CPAP/PC. 5yr warranty." },
  // ─── Allpowers ────────────────────────────────────────────────────────────
  { brand:"Allpowers", model:"R1500 LITE", price:299, wh:1056, surge:3200, solar:650, ups:true, expandable:false, weight:24.3, warranty:2, scores:{home_backup:7,rv:7,camping:8,off_grid:5,apartment:7,medical:7,value:9}, notes:"1600W continuous 3200W surge LFP. UPS <15ms. 650W solar. Best $/Wh with UPS." },
  { brand:"Allpowers", model:"S2000 Pro", price:499, wh:1452, surge:4000, solar:1000, ups:true, expandable:false, weight:37.5, warranty:5, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:7,value:9}, notes:"2400W continuous 4000W surge LFP. UPS <15ms. 1000W solar. 5yr warranty." },
  { brand:"Allpowers", model:"R2500", price:699, wh:2016, surge:5000, solar:1400, ups:true, expandable:true, weight:46.3, warranty:5, scores:{home_backup:8,rv:7,camping:5,off_grid:7,apartment:5,medical:7,value:9}, notes:"2500W continuous 5000W surge LFP. UPS. 1400W solar. Expandable. Strong value." },
  // ─── Mango Power ─────────────────────────────────────────────────────────
  { brand:"Mango Power", model:"Union", price:2799, wh:6900, surge:6600, solar:4000, ups:true, expandable:true, weight:132, warranty:3, scores:{home_backup:10,rv:2,camping:1,off_grid:9,apartment:2,medical:9,value:5}, notes:"2-in-1 detachable. 4350W continuous. UPS <10ms. Expandable to 69kWh. 7000 cycles." },
  // ─── Aferiy ──────────────────────────────────────────────────────────────
  { brand:"Aferiy", model:"P210", price:699, wh:2048, surge:4800, solar:1000, ups:true, expandable:false, weight:46, warranty:2, scores:{home_backup:8,rv:6,camping:5,off_grid:7,apartment:5,medical:7,value:9}, notes:"2400W continuous 4800W surge LFP. UPS. 1000W solar. Best value 2kWh." },
  // ─── VTOMAN new ──────────────────────────────────────────────────────────
  { brand:"VTOMAN", model:"Jump 600X", price:399, wh:632, surge:1200, solar:200, ups:true, expandable:false, weight:14.3, warranty:3, scores:{home_backup:5,rv:6,camping:8,off_grid:4,apartment:7,medical:6,value:8}, notes:"600W continuous. UPS <20ms. 14.3 lbs. Budget portable with UPS." },
  // ─── Pecron new ──────────────────────────────────────────────────────────
  { brand:"Pecron", model:"E3000LFP", price:1299, wh:2880, surge:6000, solar:1200, ups:true, expandable:true, weight:55, warranty:3, scores:{home_backup:9,rv:6,camping:4,off_grid:8,apartment:4,medical:8,value:9}, notes:"3000W continuous 6000W surge LFP. UPS. Expandable to 11.52kWh. Exceptional value." },
  // ─── Bluetti gaps ─────────────────────────────────────────────────────────
  { brand:"Bluetti", model:"AC200P", price:999, wh:2000, surge:4800, solar:700, ups:false, expandable:false, weight:60.6, warranty:2, scores:{home_backup:7,rv:5,camping:3,off_grid:6,apartment:3,medical:5,value:6}, notes:"Legacy 2kWh NMC. No UPS. 60.6 lbs heavy. Superseded by AC200L. 2yr warranty." },
  { brand:"Bluetti", model:"EP500 Pro", price:4099, wh:5100, surge:6000, solar:2400, ups:true, expandable:true, weight:182, warranty:5, scores:{home_backup:10,rv:1,camping:1,off_grid:9,apartment:1,medical:9,value:4}, notes:"Wheeled home system. 3000W continuous. UPS. Expandable to 10.2kWh. 182 lbs." },
  // ─── Jackery legacy & new models ─────────────────────────────────────────
  { brand:"Jackery", model:"Explorer 500 v2",    price:299,  wh:512,  surge:1000, solar:200,  ups:true,  expandable:false, weight:14,   warranty:3, scores:{home_backup:5,rv:7,camping:9,off_grid:4,apartment:6,medical:5,value:9}, notes:"512Wh LFP 6000 cycles. UPS. 14 lbs ultralight. Best Jackery value under $300." },
  { brand:"Jackery", model:"Explorer 500",        price:249,  wh:518,  surge:1000, solar:100,  ups:false, expandable:false, weight:13.3, warranty:2, scores:{home_backup:4,rv:7,camping:9,off_grid:3,apartment:5,medical:3,value:8}, notes:"Legacy 518Wh NMC. 500W continuous. 1000W surge. Still widely sold." },
  { brand:"Jackery", model:"Explorer 1000 Pro",   price:699,  wh:1002, surge:2000, solar:400,  ups:false, expandable:false, weight:25.4, warranty:2, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:6,medical:4,value:7}, notes:"1002Wh NMC. 1000W continuous 2000W surge. No UPS. Legacy still popular." },
  { brand:"Jackery", model:"Explorer 2000 Pro",   price:1299, wh:2042, surge:4400, solar:800,  ups:false, expandable:false, weight:43,   warranty:2, scores:{home_backup:8,rv:6,camping:3,off_grid:7,apartment:3,medical:5,value:5}, notes:"2042Wh NMC. 2200W continuous 4400W surge. No UPS. Legacy flagship." },
  // ─── Goal Zero ────────────────────────────────────────────────────────────
  { brand:"Goal Zero", model:"Yeti 500X",         price:399,  wh:505,  surge:600,  solar:150,  ups:false, expandable:false, weight:12.9, warranty:2, scores:{home_backup:4,rv:6,camping:8,off_grid:3,apartment:5,medical:3,value:6}, notes:"505Wh NMC. 300W continuous 600W surge. Compact camping. 2yr warranty." },
  { brand:"Goal Zero", model:"Yeti 6000X",        price:3999, wh:6071, surge:3500, solar:600,  ups:false, expandable:false, weight:102,  warranty:2, scores:{home_backup:9,rv:4,camping:1,off_grid:8,apartment:1,medical:7,value:4}, notes:"6071Wh NMC. 2000W continuous 3500W surge. Massive capacity. No UPS." },
  // ─── Bluetti compact ──────────────────────────────────────────────────────
  { brand:"Bluetti", model:"EB55",                price:349,  wh:537,  surge:1400, solar:200,  ups:false, expandable:false, weight:17.6, warranty:2, scores:{home_backup:5,rv:6,camping:7,off_grid:4,apartment:6,medical:4,value:7}, notes:"537Wh NMC. 700W continuous 1400W surge. Compact entry model. No UPS." },
  { brand:"Bluetti", model:"EB70",                price:449,  wh:716,  surge:1400, solar:200,  ups:false, expandable:false, weight:21.4, warranty:2, scores:{home_backup:5,rv:7,camping:8,off_grid:5,apartment:6,medical:4,value:7}, notes:"716Wh NMC. 1000W continuous 1400W surge. Popular camping size. No UPS." },
  // ─── EcoFlow legacy ───────────────────────────────────────────────────────
  { brand:"EcoFlow", model:"RIVER Pro",           price:399,  wh:720,  surge:1800, solar:200,  ups:true,  expandable:true,  weight:16,   warranty:5, scores:{home_backup:5,rv:6,camping:8,off_grid:5,apartment:6,medical:5,value:7}, notes:"Legacy 720Wh NMC. 600W with X-Boost 1800W. UPS. Still widely searched." },
  { brand:"EcoFlow", model:"DELTA Max",           price:1099, wh:2016, surge:5000, solar:800,  ups:true,  expandable:true,  weight:48.5, warranty:5, scores:{home_backup:8,rv:6,camping:3,off_grid:7,apartment:4,medical:7,value:6}, notes:"Legacy 2016Wh NMC. 2400W continuous 5000W surge. UPS. Expandable to 6kWh." },
  { brand:"EcoFlow", model:"DELTA Mini",          price:499,  wh:882,  surge:2600, solar:300,  ups:true,  expandable:false, weight:24.3, warranty:5, scores:{home_backup:6,rv:7,camping:7,off_grid:5,apartment:7,medical:6,value:7}, notes:"Legacy 882Wh NMC. 1400W continuous 2600W surge. UPS. Good mid-range option." },
  // ─── Lion Energy ─────────────────────────────────────────────────────────
  { brand:"Lion Energy", model:"Safari LT",       price:399,  wh:450,  surge:600,  solar:150,  ups:false, expandable:false, weight:11,   warranty:3, scores:{home_backup:4,rv:5,camping:8,off_grid:4,apartment:5,medical:4,value:7}, notes:"450Wh LFP. 300W continuous. Lightweight 11 lbs. Budget LFP camping." },
  { brand:"Lion Energy", model:"UT 1300",         price:1499, wh:1314, surge:4000, solar:500,  ups:true,  expandable:false, weight:30,   warranty:3, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:7,value:6}, notes:"1314Wh LFP. 2000W continuous 4000W surge. UPS. US-marketed brand." },
  // ─── Renogy expanded ─────────────────────────────────────────────────────
  { brand:"Renogy", model:"Lycan 1000",           price:799,  wh:1002, surge:2000, solar:400,  ups:false, expandable:false, weight:26,   warranty:2, scores:{home_backup:6,rv:6,camping:6,off_grid:5,apartment:6,medical:4,value:6}, notes:"1002Wh NMC. 1000W continuous 2000W surge. No UPS. Budget mid-range." },
  // ─── Westinghouse ────────────────────────────────────────────────────────
  { brand:"Westinghouse", model:"iGen1200s",      price:499,  wh:1125, surge:2400, solar:300,  ups:false, expandable:false, weight:29.8, warranty:3, scores:{home_backup:6,rv:6,camping:7,off_grid:5,apartment:6,medical:4,value:7}, notes:"1125Wh NMC. 1200W continuous 2400W surge. Sold at Home Depot/Lowe's." },
  { brand:"Westinghouse", model:"iGen300s",       price:199,  wh:296,  surge:600,  solar:100,  ups:false, expandable:false, weight:7.7,  warranty:3, scores:{home_backup:3,rv:5,camping:8,off_grid:2,apartment:5,medical:3,value:7}, notes:"296Wh NMC. 300W continuous. Budget entry level. Sold at major retailers." },
  // ─── Zendure high capacity ───────────────────────────────────────────────
  { brand:"Zendure", model:"SuperBase V6400",     price:5999, wh:6144, surge:7600, solar:1200, ups:true,  expandable:true,  weight:180,  warranty:2, scores:{home_backup:10,rv:1,camping:1,off_grid:10,apartment:1,medical:9,value:3}, notes:"6144Wh LFP. 3800W continuous 7600W surge. UPS <20ms. Expandable to 64kWh." },
  // ─── BioLite ────────────────────────────────────────────────────────────
  { brand:"BioLite", model:"BaseCharge 1500",     price:999,  wh:1521, surge:2400, solar:300,  ups:false, expandable:false, weight:40.8, warranty:2, scores:{home_backup:7,rv:6,camping:5,off_grid:6,apartment:6,medical:5,value:6}, notes:"1521Wh NMC. 1200W continuous. No UPS. Clean US brand design." },
  // ─── Rockpals ────────────────────────────────────────────────────────────
  { brand:"Rockpals", model:"RP1000",             price:699,  wh:1002, surge:2000, solar:400,  ups:false, expandable:false, weight:26.8, warranty:2, scores:{home_backup:6,rv:6,camping:6,off_grid:5,apartment:6,medical:4,value:7}, notes:"1002Wh NMC. 1000W continuous 2000W surge. Budget brand with decent specs." },
  // ─── Anker SOLIX compact ─────────────────────────────────────────────────
  { brand:"Anker SOLIX", model:"C300",            price:199,  wh:288,  surge:900,  solar:100,  ups:true,  expandable:false, weight:8.6,  warranty:5, scores:{home_backup:3,rv:5,camping:8,off_grid:2,apartment:6,medical:4,value:8}, notes:"288Wh LFP. 300W continuous. UPS. 8.6 lbs. Smallest SOLIX with UPS." },
  // ─── Pecron budget models ─────────────────────────────────────────────────
  { brand:"Pecron", model:"E500LFP",              price:299,  wh:461,  surge:1200, solar:200,  ups:true,  expandable:false, weight:13.2, warranty:3, scores:{home_backup:4,rv:6,camping:8,off_grid:3,apartment:6,medical:5,value:9}, notes:"461Wh LFP. 500W continuous. UPS. Best budget 500Wh with UPS." },
  { brand:"Pecron", model:"E1500LFP",             price:599,  wh:1382, surge:3000, solar:600,  ups:true,  expandable:false, weight:33.1, warranty:3, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:7,value:9}, notes:"1382Wh LFP. 1500W continuous. UPS. Strong value. 3yr warranty." },
  // ─── VTOMAN expanded ─────────────────────────────────────────────────────
  { brand:"VTOMAN", model:"Jump 1500X",           price:599,  wh:1456, surge:3000, solar:400,  ups:true,  expandable:true,  weight:33.5, warranty:3, scores:{home_backup:7,rv:7,camping:6,off_grid:6,apartment:6,medical:7,value:8}, notes:"1456Wh LFP. 1500W continuous. UPS <20ms. Expandable. 1hr charge." },
  // ─── Allpowers expanded ──────────────────────────────────────────────────
  { brand:"Allpowers", model:"R600",              price:199,  wh:299,  surge:600,  solar:100,  ups:false, expandable:false, weight:8.4,  warranty:2, scores:{home_backup:3,rv:5,camping:9,off_grid:2,apartment:5,medical:3,value:9}, notes:"299Wh LFP. 600W continuous. Ultralight 8.4 lbs. Best budget camping." },
  { brand:"Allpowers", model:"R4000",             price:1299, wh:3456, surge:8000, solar:1200, ups:true,  expandable:false, weight:88,   warranty:2, scores:{home_backup:9,rv:5,camping:2,off_grid:8,apartment:2,medical:8,value:7}, notes:"3456Wh LFP. 4000W continuous 8000W surge. UPS. Heavy home unit." },
  // ─── OUPES compact ────────────────────────────────────────────────────────
  { brand:"OUPES", model:"600 Lite",              price:229,  wh:596,  surge:1200, solar:200,  ups:true,  expandable:false, weight:14.7, warranty:5, scores:{home_backup:4,rv:6,camping:8,off_grid:3,apartment:6,medical:5,value:9}, notes:"596Wh LFP. 600W continuous. UPS. Budget compact with UPS. 5yr warranty." },
  // ─── DJI Power expanded ───────────────────────────────────────────────────
  { brand:"DJI Power", model:"Power 2000",        price:999,  wh:2048, surge:4400, solar:800,  ups:true,  expandable:false, weight:48,   warranty:3, scores:{home_backup:8,rv:6,camping:4,off_grid:7,apartment:5,medical:7,value:7}, notes:"2048Wh LFP. 2200W continuous. UPS <20ms. SDC drone charging. 3yr." },
  // ─── Geneverse compact ───────────────────────────────────────────────────
  { brand:"Geneverse", model:"HomePower One",     price:299,  wh:716,  surge:1400, solar:300,  ups:false, expandable:false, weight:19.8, warranty:2, scores:{home_backup:5,rv:6,camping:7,off_grid:4,apartment:6,medical:4,value:7}, notes:"716Wh LFP. 1000W continuous. Budget entry. 2yr warranty." },
];

// ─── SCENARIO → SCORE KEY ────────────────────────────────────────────────────
const SCENARIO_SCORE_MAP: Record<string, keyof typeof PRODUCTS[0]["scores"]> = {
  "Home backup / Power outage": "home_backup",
  "Camping (weekend)": "camping",
  "Overlanding / Extended trips": "camping",
  "Rural cabin / Off-grid": "off_grid",
  "Beach / Day trip": "camping",
  "Medical device at home": "medical",
  "RV / Van life": "rv",
};
const SCENARIOS = Object.keys(SCENARIO_SCORE_MAP);

// ─── APPLIANCE DATA ──────────────────────────────────────────────────────────
const APPLIANCE_DATA: Record<string, { whPerDay: number; surgeW: number; needsUps: boolean; label: string }> = {
  "Refrigerator":        { whPerDay: 150, surgeW: 1200, needsUps: false, label: "refrigerator" },
  "Well pump (½ HP)":    { whPerDay: 500, surgeW: 2600, needsUps: false, label: "well pump" },
  "CPAP machine":        { whPerDay: 40,  surgeW: 300,  needsUps: true,  label: "CPAP" },
  "Lights + devices":    { whPerDay: 50,  surgeW: 200,  needsUps: false, label: "lights and devices" },
  "Multiple appliances": { whPerDay: 300, surgeW: 2000, needsUps: false, label: "multiple appliances" },
  "12V cooler":          { whPerDay: 100, surgeW: 400,  needsUps: false, label: "12V cooler" },
  "Medical device":      { whPerDay: 80,  surgeW: 300,  needsUps: true,  label: "medical device" },
  "Home office":         { whPerDay: 200, surgeW: 500,  needsUps: true,  label: "home office" },
};
const APPLIANCE_KEYS = Object.keys(APPLIANCE_DATA);

const DAYS_MAP: Record<string, number> = {
  "1 night": 1, "2 days": 2, "3 days": 3, "5+ days": 5,
};
const DAYS_KEYS = Object.keys(DAYS_MAP);

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Product = typeof PRODUCTS[0];
type EliminationReason = { count: number; reason: string };
type ScoreComponent = { label: string; value: number; note: string };
type PickResult = {
  product: Product;
  label: "Best Match" | "Best Value" | "Premium Pick";
  expertVerdict: string;
  tradeoffs: string[];
  strengths: string[];
  limitation: string;
  scoreComponents: ScoreComponent[];
};
type EliminatedProduct = {
  brand: string;
  model: string;
  price: number;
  reason: string;
};
type AnalysisResult = {
  picks: PickResult[];
  eliminations: EliminationReason[];
  eliminatedProducts: EliminatedProduct[];
  totalEvaluated: number;
  requiredWh: number;
  requiredSurge: number;
  needsUps: boolean;
  days: number;
  applianceLabel: string;
  outOfBudget: boolean;
  scoreKey: keyof typeof PRODUCTS[0]["scores"];
};

// ─── SCORE COMPONENT CALCULATOR ─────────────────────────────────────────────
// Derives component scores from real specs — no hardcoded values
function getScoreComponents(
  p: Product,
  scoreKey: keyof typeof PRODUCTS[0]["scores"],
  requiredWh: number,
  requiredSurge: number,
  needsUps: boolean
): ScoreComponent[] {
  // Capacity score: how much margin above requirement
  const capacityRatio = p.wh / Math.max(requiredWh, 1);
  const capacityScore = Math.min(10, Math.round(Math.min(capacityRatio * 7, 10) * 10) / 10);
  const capacityNote = capacityRatio >= 2
    ? `${p.wh.toLocaleString()} Wh — ${Math.round(capacityRatio * 10) / 10}× your requirement`
    : capacityRatio >= 1
    ? `${p.wh.toLocaleString()} Wh — meets your requirement`
    : `${p.wh.toLocaleString()} Wh — below your requirement`;

  // Surge score: headroom above required surge
  const surgeRatio = p.surge / Math.max(requiredSurge, 1);
  const surgeScore = Math.min(10, Math.round(Math.min(surgeRatio * 4, 10) * 10) / 10);
  const surgeNote = `${p.surge.toLocaleString()}W — ${Math.round(surgeRatio * 10) / 10}× surge headroom`;

  // UPS score: critical for medical/office, relevant for backup
  const upsScore = p.ups ? 10 : (needsUps ? 0 : 5);
  const upsNote = p.ups ? "UPS mode — seamless switchover <30ms" : (needsUps ? "No UPS — required for this scenario" : "No UPS — manual switchover required");

  // Use-case fit score: the scenario-specific score from dataset
  const fitScore = p.scores[scoreKey];
  const fitNote = `CDL analysis score for ${scoreKey.replace(/_/g, " ")}`;

  // Portability score: inverse of weight, normalized
  const portScore = p.weight <= 15 ? 9.5 : p.weight <= 25 ? 8 : p.weight <= 40 ? 6.5 : p.weight <= 60 ? 4.5 : 2;
  const portNote = `${p.weight} lbs — ${p.weight <= 15 ? "highly portable" : p.weight <= 25 ? "portable" : p.weight <= 40 ? "manageable" : p.weight <= 60 ? "heavy" : "stationary only"}`;

  return [
    { label: "Runtime / Capacity", value: capacityScore, note: capacityNote },
    { label: "Surge Power",         value: surgeScore,    note: surgeNote },
    { label: "UPS / Switchover",    value: upsScore,      note: upsNote },
    { label: "Scenario Fit",        value: fitScore,      note: fitNote },
    { label: "Portability",         value: portScore,     note: portNote },
  ];
}

// ─── EXPERT VERDICT GENERATOR ────────────────────────────────────────────────
// Generates natural language verdict from real specs — not hardcoded text
function generateVerdict(
  p: Product,
  label: "Best Match" | "Best Value" | "Premium Pick",
  scenario: string,
  appliance: string,
  requiredWh: number,
  requiredSurge: number,
  budget: number,
  allPicks: Product[]
): { verdict: string; strengths: string[]; tradeoffs: string[] } {
  const app = APPLIANCE_DATA[appliance];
  const surgeRatio = Math.round((p.surge / Math.max(requiredSurge, 1)) * 10) / 10;
  const runtimeDays = Math.round((p.wh / Math.max(app.whPerDay, 1)) * 10) / 10;
  const scenarioLabel = scenario.toLowerCase();
  const budgetMargin = budget > 0 ? budget - p.price : null;

  let verdict = "";

  if (label === "Best Match") {
    verdict = `For ${scenarioLabel}, the ${p.brand} ${p.model} provides the strongest fit across all evaluation criteria. `;
    verdict += `It delivers ${p.wh.toLocaleString()} Wh of usable capacity — sufficient for ${runtimeDays} days of ${app.label} runtime. `;
    if (surgeRatio > 2) verdict += `Surge capacity of ${p.surge.toLocaleString()}W exceeds the ${requiredSurge.toLocaleString()}W startup requirement by ${Math.round((surgeRatio - 1) * 100)}%. `;
    if (p.ups && app.needsUps) verdict += `UPS mode ensures uninterrupted power delivery — critical for this scenario. `;
    else if (p.ups) verdict += `UPS mode provides automatic switchover in under 30ms. `;
    if (budgetMargin !== null && budgetMargin > 100) verdict += `At $${p.price.toLocaleString()}, it leaves $${budgetMargin.toLocaleString()} within your stated budget.`;
  } else if (label === "Best Value") {
    const whPerDollar = (p.wh / p.price).toFixed(2);
    verdict = `The ${p.brand} ${p.model} delivers the best capacity-per-dollar in this analysis at ${whPerDollar} Wh/$. `;
    verdict += `For ${scenarioLabel}, it provides ${runtimeDays} days of ${app.label} coverage at $${p.price.toLocaleString()}. `;
    const bestMatch = allPicks[0];
    if (bestMatch && bestMatch !== p) {
      const saving = bestMatch.price - p.price;
      if (saving > 0) verdict += `It costs $${saving.toLocaleString()} less than the Best Match while meeting all technical requirements.`;
    }
  } else {
    verdict = `The ${p.brand} ${p.model} represents the highest-performance option for ${scenarioLabel}. `;
    verdict += `With ${p.wh.toLocaleString()} Wh capacity and ${p.surge.toLocaleString()}W surge output, it significantly exceeds minimum requirements. `;
    if (p.expandable) verdict += `Expandable architecture allows capacity growth as needs increase. `;
    verdict += `Recommended when performance headroom matters more than price optimization.`;
  }

  // Strengths
  const strengths: string[] = [];
  if (surgeRatio >= 3) strengths.push(`Surge ${Math.round(surgeRatio)}× above minimum — handles demanding startup loads`);
  else if (surgeRatio >= 1.5) strengths.push(`${p.surge.toLocaleString()}W surge — adequate headroom above ${requiredSurge.toLocaleString()}W requirement`);
  if (p.ups) strengths.push(app.needsUps ? "UPS required for this scenario — confirmed" : "UPS included — seamless automatic switchover");
  if (runtimeDays >= 2) strengths.push(`${runtimeDays}d runtime — ${runtimeDays >= 3 ? "exceeds" : "meets"} your ${DAYS_MAP[Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] >= 2) || "2 days"] || 2}-day requirement`);
  if (p.expandable) strengths.push("Expandable — add capacity as needs grow");
  if (p.warranty >= 5) strengths.push(`${p.warranty}-year warranty — above category average`);

  // Tradeoffs
  const tradeoffs: string[] = [];
  if (p.weight > 50) tradeoffs.push(`${p.weight} lbs — stationary installation recommended`);
  else if (p.weight > 30) tradeoffs.push(`${p.weight} lbs — not lightweight`);
  if (!p.ups && !app.needsUps) tradeoffs.push("No UPS — brief interruption when switching to battery");
  if (!p.expandable) tradeoffs.push("Fixed capacity — cannot expand for longer outages");
  if (p.warranty < 3) tradeoffs.push(`${p.warranty}-year warranty — below category average`);
  if (runtimeDays < 1.5 && requiredWh > 0) tradeoffs.push(`${runtimeDays}d runtime — tight margin for your requirement`);

  return { verdict, strengths: strengths.slice(0, 3), tradeoffs: tradeoffs.slice(0, 2) };
}

// ─── COMPUTE ANALYSIS ────────────────────────────────────────────────────────
function computeAnalysis(
  scenario: string,
  appliance: string,
  days: string,
  budget: number
): AnalysisResult {
  const app = APPLIANCE_DATA[appliance];
  const d = DAYS_MAP[days] || 2;
  const scoreKey = SCENARIO_SCORE_MAP[scenario] || "home_backup";
  const requiredWh = Math.round(app.whPerDay * d * 1.25);
  const requiredSurge = app.surgeW;
  const needsUps = app.needsUps;

  // Step-by-step elimination with reasons
  const eliminations: EliminationReason[] = [];
  let pool = [...PRODUCTS];

  // 1. Budget filter
  if (budget > 0) {
    const overBudget = pool.filter(p => p.price > budget * 1.15);
    if (overBudget.length) {
      eliminations.push({ count: overBudget.length, reason: `over budget ($${budget.toLocaleString()})` });
      pool = pool.filter(p => p.price <= budget * 1.15);
    }
  }

  // 2. Surge filter
  const insufficientSurge = pool.filter(p => p.surge < requiredSurge);
  if (insufficientSurge.length) {
    eliminations.push({ count: insufficientSurge.length, reason: `insufficient surge capacity (< ${requiredSurge.toLocaleString()}W required)` });
    pool = pool.filter(p => p.surge >= requiredSurge);
  }

  // 3. UPS filter
  if (needsUps) {
    const noUps = pool.filter(p => !p.ups);
    if (noUps.length) {
      eliminations.push({ count: noUps.length, reason: "no UPS support (required for this scenario)" });
      pool = pool.filter(p => p.ups);
    }
  }

  // 4. Capacity filter (soft — keep if within 60% of requirement)
  const insufficientCap = pool.filter(p => p.wh < requiredWh * 0.6);
  if (insufficientCap.length) {
    eliminations.push({ count: insufficientCap.length, reason: `insufficient runtime (< ${Math.round(requiredWh * 0.6).toLocaleString()} Wh)` });
    pool = pool.filter(p => p.wh >= requiredWh * 0.6);
  }

  const outOfBudget = pool.length === 0;

  // Fallback: if nothing passes all filters, relax budget
  if (outOfBudget) {
    pool = PRODUCTS.filter(p => p.surge >= requiredSurge && (!needsUps || p.ups));
  }

  // Score and rank
  const scored = [...pool].sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey]);

  const bestMatchProduct = scored[0];
  const bestValueProduct = [...pool]
    .filter(p => p !== bestMatchProduct)
    .sort((a, b) => (b.wh / b.price) - (a.wh / a.price))[0];
  const premiumProduct = [...PRODUCTS]
    .filter(p => p !== bestMatchProduct && p !== bestValueProduct && p.surge >= requiredSurge && (!needsUps || p.ups))
    .sort((a, b) => b.scores[scoreKey] - a.scores[scoreKey])[0];

  const rawPicks: Array<{ product: Product | undefined; label: PickResult["label"] }> = [
    { product: bestMatchProduct,  label: "Best Match" },
    { product: bestValueProduct,  label: "Best Value" },
    { product: premiumProduct,    label: "Premium Pick" },
  ];

  const allProducts = rawPicks.map(r => r.product).filter(Boolean) as Product[];

  const picks: PickResult[] = rawPicks
    .filter((r): r is { product: Product; label: PickResult["label"] } => !!r.product)
    .map(({ product, label }) => {
      const { verdict, strengths, tradeoffs } = generateVerdict(
        product, label, scenario, appliance, requiredWh, requiredSurge, budget, allProducts
      );
      const limitation = (() => {
        if (app.surgeW > product.surge) return `Surge insufficient — ${app.surgeW.toLocaleString()}W required, unit has ${product.surge.toLocaleString()}W`;
        if (needsUps && !product.ups) return "No UPS mode — required for this scenario";
        if (product.weight > 50) return `Heavy at ${product.weight} lbs — stationary unit`;
        if (!product.expandable && product.wh < 1500) return "Fixed capacity — cannot expand for multi-day outages";
        return "No critical limitations for this scenario";
      })();
      return {
        product, label,
        expertVerdict: verdict,
        strengths, tradeoffs, limitation,
        scoreComponents: getScoreComponents(product, scoreKey, requiredWh, requiredSurge, needsUps),
      };
    });

  // Track the 3 closest eliminated products with exact reason
  const eliminatedProducts: EliminatedProduct[] = [];
  let fullPool = [...PRODUCTS];

  // Re-run elimination tracking individual products
  const budgetNum = budget > 0 ? budget * 1.15 : Infinity;
  for (const p of fullPool) {
    if (picks.some(pk => pk.product === p)) continue;
    if (p.price > budgetNum) {
      eliminatedProducts.push({ brand: p.brand, model: p.model, price: p.price, reason: `over budget by $${(p.price - budget).toLocaleString()}` });
    } else if (p.surge < requiredSurge) {
      eliminatedProducts.push({ brand: p.brand, model: p.model, price: p.price, reason: `surge ${p.surge.toLocaleString()}W < ${requiredSurge.toLocaleString()}W required` });
    } else if (needsUps && !p.ups) {
      eliminatedProducts.push({ brand: p.brand, model: p.model, price: p.price, reason: "no UPS — required for this scenario" });
    } else if (p.wh < requiredWh * 0.6) {
      eliminatedProducts.push({ brand: p.brand, model: p.model, price: p.price, reason: `${p.wh}Wh < ${Math.round(requiredWh * 0.6)}Wh minimum runtime` });
    }
  }
  // Sort by "closest to passing" — those with highest score in relevant dimension
  const closestEliminated = eliminatedProducts
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return { picks, eliminations, eliminatedProducts: closestEliminated, totalEvaluated: PRODUCTS.length, requiredWh, requiredSurge, needsUps, days: d, applianceLabel: app.label, outOfBudget, scoreKey };
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
function FieldIcon({ kind }: { kind: "home" | "fridge" | "dollar" | "calendar" }) {
  const c = { viewBox:"0 0 24 24", className:"h-[18px] w-[18px] text-neutral-500", fill:"none" as const, stroke:"currentColor", strokeWidth:1.6, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  if (kind === "home") return <svg {...c}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
  if (kind === "fridge") return <svg {...c}><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 10h14M8 6v2M8 14v3"/></svg>;
  if (kind === "dollar") return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2M12 6v12"/></svg>;
  return <svg {...c}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
}

function Field({ label, icon, children }: { label: string; icon: "home"|"fridge"|"dollar"|"calendar"; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-500">{label}</label>
      <div className="mt-2 flex h-12 items-center gap-3 rounded-[8px] border bg-white px-3.5 transition-colors focus-within:border-neutral-500 hover:border-neutral-400" style={{borderColor:"#E2E2E2"}}>
        <FieldIcon kind={icon} />
        {children}
      </div>
    </div>
  );
}

// ─── SCORE BAR ───────────────────────────────────────────────────────────────
function ScoreBar({ score, small }: { score: number; small?: boolean }) {
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F59E0B" : "#9CA3AF";
  return (
    <div className={`flex items-center gap-2 ${small ? "mt-1" : "mt-1.5"}`}>
      <div className={`flex-1 ${small ? "h-[3px]" : "h-1"} bg-neutral-100 rounded-full overflow-hidden`}>
        <div style={{width:`${score*10}%`,background:color,height:"100%",borderRadius:99,transition:"width 0.5s ease"}}/>
      </div>
      <span className={`font-mono ${small ? "text-[10px]" : "text-[11px]"}`} style={{color,minWidth:28}}>{score}/10</span>
    </div>
  );
}

// ─── ANALYSIS HEADER ─────────────────────────────────────────────────────────
function AnalysisHeader({ result }: { result: AnalysisResult }) {
  const matched = result.picks.length;
  const eliminated = result.totalEvaluated - matched;
  return (
    <div className="mb-6 rounded-[12px] border bg-white p-5" style={{borderColor:"#E2E2E2",borderLeft:"3px solid #111"}}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">Analysis Complete</p>
          <p className="mt-0.5 text-[15px] font-semibold text-neutral-950">
            {result.totalEvaluated} products evaluated — {matched} match{matched !== 1 ? "es" : ""}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#166534]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] inline-block"/>
            {matched} matched
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {result.eliminations.map((e, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <span className="font-mono text-[10px] font-semibold text-neutral-500">{e.count}</span>
            </div>
            <div className="flex-1 h-[1px] bg-neutral-100"/>
            <span className="text-[11.5px] text-neutral-500 shrink-0">removed — {e.reason}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB]">
            <span className="font-mono text-[10px] font-semibold text-white">{matched}</span>
          </div>
          <div className="flex-1 h-[1px] bg-[#2563EB] opacity-20"/>
          <span className="text-[11.5px] font-medium text-[#2563EB] shrink-0">passed all requirements</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t" style={{borderColor:"#F0F0F0"}}>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Required Wh</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.requiredWh.toLocaleString()} Wh</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Min Surge</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.requiredSurge.toLocaleString()} W</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Products</p>
          <p className="mt-0.5 font-mono text-[13px] font-semibold text-neutral-800">{result.totalEvaluated} evaluated</p>
        </div>
      </div>
    </div>
  );
}

// ─── SCORE BREAKDOWN ─────────────────────────────────────────────────────────
function ScoreBreakdown({ components, overallScore, scoreKey }: { components: ScoreComponent[]; overallScore: number; scoreKey: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t" style={{borderColor:"#F0F0F0"}}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex-1 text-left">
          <p className="font-mono text-[9.5px] uppercase tracking-wider text-neutral-400 mb-0.5">
            {scoreKey.replace(/_/g," ")} score
          </p>
          <ScoreBar score={overallScore} />
        </div>
        <span className="ml-3 font-mono text-[9.5px] text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
          {open ? "hide ↑" : "breakdown ↓"}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2.5 rounded-[8px] bg-[#FAFAFA] p-3">
          {components.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] text-neutral-600">{c.label}</span>
              </div>
              <ScoreBar score={c.value} small />
              <p className="mt-0.5 text-[10px] text-neutral-400">{c.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ELIMINATED PRODUCTS PANEL ────────────────────────────────────────────────
function EliminatedPanel({ eliminated }: { eliminated: EliminatedProduct[] }) {
  if (!eliminated || eliminated.length === 0) return null;
  return (
    <div className="mb-4 rounded-[12px] border bg-white p-4" style={{borderColor:"#E2E2E2"}}>
      <p className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-3">Closest products eliminated</p>
      <div className="space-y-2">
        {eliminated.map((e, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-300 shrink-0">✕</span>
            <span className="text-[12px] font-medium text-neutral-600 shrink-0">{e.brand} {e.model}</span>
            <span className="font-mono text-[11px] text-neutral-400 shrink-0">${e.price.toLocaleString()}</span>
            <div className="flex-1 h-[1px] bg-neutral-100"/>
            <span className="text-[11px] text-neutral-400 shrink-0 text-right max-w-[180px]">{e.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPARISON TABLE ────────────────────────────────────────────────────────
function ComparisonTable({ picks, requiredWh, requiredSurge, needsUps, scoreKey }: {
  picks: PickResult[];
  requiredWh: number;
  requiredSurge: number;
  needsUps: boolean;
  scoreKey: string;
}) {
  if (picks.length < 2) return null;
  const LABEL_COLORS: Record<string, string> = {
    "Best Match":   "#2563EB",
    "Best Value":   "#10B981",
    "Premium Pick": "#8B5CF6",
  };
  const rows = [
    { key: "Price",    fmt: (p: PickResult["product"]) => `$${p.price.toLocaleString()}` },
    { key: "Capacity", fmt: (p: PickResult["product"]) => `${p.wh.toLocaleString()} Wh` },
    { key: "Surge",    fmt: (p: PickResult["product"]) => `${p.surge.toLocaleString()} W` },
    { key: "UPS",      fmt: (p: PickResult["product"]) => p.ups ? "✓ Yes" : "✗ No" },
    { key: "Runtime*", fmt: (p: PickResult["product"]) => `${Math.round((p.wh / Math.max(requiredWh / (requiredWh > 0 ? 1 : 1), 1)) * 10) / 10}× req.` },
    { key: "Warranty", fmt: (p: PickResult["product"]) => `${p.warranty}yr` },
  ];
  return (
    <div className="mb-4 overflow-x-auto rounded-[12px] border bg-white" style={{borderColor:"#E2E2E2"}}>
      <table className="w-full text-left min-w-[400px]">
        <thead>
          <tr className="border-b" style={{borderColor:"#F0F0F0"}}>
            <th className="py-3 pl-4 pr-3 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400 w-24">Spec</th>
            {picks.map(pick => (
              <th key={pick.label} className="py-3 px-3 font-mono text-[9.5px] font-semibold" style={{color: LABEL_COLORS[pick.label]}}>
                {pick.label}
                <div className="font-mono text-[9px] font-normal text-neutral-500 mt-0.5 normal-case tracking-normal">
                  {pick.product.brand} {pick.product.model}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} className={i % 2 === 0 ? "bg-[#FAFAFA]" : ""}>
              <td className="py-2.5 pl-4 pr-3 font-mono text-[10px] text-neutral-400">{row.key}</td>
              {picks.map(pick => {
                const val = row.fmt(pick.product);
                const highlight = row.key === "UPS" && needsUps && pick.product.ups;
                return (
                  <td key={pick.label} className="py-2.5 px-3 font-mono text-[11.5px]" style={{color: highlight ? "#10B981" : "#1a1a1a"}}>
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 font-mono text-[9px] text-neutral-300">* Runtime multiple vs your scenario requirement</p>
    </div>
  );
}

// ─── RESULT CARD ─────────────────────────────────────────────────────────────
function ResultCard({ pick, accentColor, scoreKey }: { pick: PickResult; accentColor: string; scoreKey: string }) {
  const { product: p, label, expertVerdict, strengths, tradeoffs, limitation, scoreComponents } = pick;
  const overallScore = p.scores[scoreKey as keyof typeof p.scores];
  // ─── GEO-AWARE AFFILIATE ROUTING ──────────────────────────────────────────
  // Detects user market via browser locale + timezone → routes to local Amazon
  // Add your regional Associate IDs below when registered
  const AFFILIATE_IDS: Record<string, string> = {
    us: "clickdecision-20",   // ✅ Active
    uk: "PENDING_UK",         // ⏳ Register at affiliate-program.amazon.co.uk
    de: "PENDING_DE",         // ⏳ Register at partnernet.amazon.de
    fr: "PENDING_FR",         // ⏳ Register at partenaires.amazon.fr
    es: "PENDING_ES",         // ⏳ Register at afiliados.amazon.es
    it: "PENDING_IT",         // ⏳ Register at programma-affiliazione.amazon.it
    ca: "PENDING_CA",         // ⏳ Register at associates.amazon.ca
    au: "PENDING_AU",         // ⏳ Register at afiliados.amazon.com.au
  };

  // Detect market from browser locale + timezone (client-side, no API needed)
  const detectMarket = (): string => {
    if (typeof window === "undefined") return "us";
    const lang = navigator.language?.toLowerCase() || "";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (lang.startsWith("de") || tz.includes("Berlin") || tz.includes("Vienna") || tz.includes("Zurich")) return "de";
    if (lang.startsWith("fr") || tz.includes("Paris") || tz.includes("Brussels")) return "fr";
    // ES pending registration — skip for now
    // if (lang.startsWith("es") && !tz.includes("America")) return "es";
    if (lang.startsWith("it") || tz.includes("Rome")) return "it";
    if (lang === "en-gb" || lang === "en-ie" || tz.includes("London") || tz.includes("Dublin")) return "uk";
    if (tz.includes("Sydney") || tz.includes("Melbourne") || tz.includes("Brisbane")) return "au";
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal")) return "ca";
    return "us";
  };

  // Amazon domain per market
  const AMAZON_DOMAIN: Record<string, string> = {
    us: "amazon.com",
    uk: "amazon.co.uk",
    de: "amazon.de",
    fr: "amazon.fr",
    es: "amazon.es",
    it: "amazon.it",
    ca: "amazon.ca",
    au: "amazon.com.au",
  };

  // Build affiliate URL for current user's market
  const buildAffiliateUrl = (asin: string | null, brand: string, model: string): string => {
    const market = detectMarket();
    const tag = AFFILIATE_IDS[market];
    const domain = AMAZON_DOMAIN[market] || "amazon.com";
    // If tag not yet registered, fallback to US
    const activeTag = tag.startsWith("PENDING") ? AFFILIATE_IDS.us : tag;
    const activeDomain = tag.startsWith("PENDING") ? "amazon.com" : domain;
    if (asin) return `https://www.${activeDomain}/dp/${asin}?tag=${activeTag}`;
    const query = encodeURIComponent(`${brand} ${model}`);
    return `https://www.${activeDomain}/s?k=${query}&tag=${activeTag}`;
  };

  const AMAZON_PRODUCTS: Record<string, string> = {
    // ─── EcoFlow — Impact deep links ─────────────────────────────────────────
    "RIVER 2":           "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-portable-power-station",
    "RIVER 2 Max":       "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-max-portable-power-station",
    "RIVER 2 Pro":       "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-2-pro-portable-power-station",
    "RIVER 3":           "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-3-portable-power-station",
    "RIVER 3 Plus":      "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-3-plus-portable-power-station",
    "RIVER Pro":         "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/river-pro-portable-power-station",
    "DELTA 3":           "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-portable-power-station",
    "DELTA 3 Classic":   "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-classic-portable-power-station",
    "DELTA 3 Plus":      "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-plus-portable-power-station",
    "DELTA 3 Max":       "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-max-portable-power-station",
    "DELTA 3 Max Plus":  "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-max-plus-portable-power-station",
    "DELTA 3 Ultra Plus":"https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-3-ultra-plus-portable-power-station",
    "DELTA 2":           "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-2-portable-power-station",
    "DELTA 2 Max":       "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-2-max-portable-power-station",
    "DELTA Max":         "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-max-portable-power-station",
    "DELTA Mini":        "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-mini-portable-power-station",
    "DELTA Pro":         "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-portable-power-station",
    "DELTA Pro 3":       "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-3-portable-power-station",
    "DELTA Pro Ultra":   "https://caecoflowcom.pxf.io/c/7338771/2787516/31964?u=https://us.ecoflow.com/products/delta-pro-ultra",
    // ─── Jackery — Awin deep links (correct format) ───────────────────────────
    "Explorer 300 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/explorer-2000-plus-portable-power-station",
    "Explorer 500":      "https://www.amazon.com/dp/B07DGTGT8Z?tag=clickdecision-20",
    "Explorer 500 v2":   "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-500-v2-portable-power-station",
    "Explorer 600 Plus": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-600-plus-portable-power-station",
    "Explorer 1000 Plus":"https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-1000-plus-portable-power-station",
    "Explorer 1000 v2":  "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-1000-v2",
    "Explorer 1000 Pro": "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-1000-pro-portable-power-station",
    "Explorer 2000 Plus":"https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/explorer-2000-plus-portable-power-station",
    "Explorer 2000 v2":  "https://www.awin1.com/cread.php?awinmid=59183&awinaffid=2929639&ued=https://www.jackery.com/products/jackery-explorer-2000-v2-portable-power-station",
    "Explorer 2000 Pro": "https://www.amazon.com/dp/B0B9G2L8MD?tag=clickdecision-20",
    "Explorer 3000 Pro": "https://www.amazon.com/dp/B0B9G3M5PL?tag=clickdecision-20",
    // ─── Bluetti — Awin deep links ────────────────────────────────────────────
    "EB3A":      "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/eb3a",
    "EB55":      "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/eb55",
    "EB70":      "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/eb70",
    "AC60":      "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac60",
    "AC70":      "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac70",
    "AC180":     "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac180",
    "AC200L":    "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac200l",
    "AC200P":    "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac200p",
    "AC300":     "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac300",
    "AC500":     "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ac500",
    "Elite 300": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/elite-300",
    "EP500 Pro": "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2929639&ued=https://www.bluettipower.com/products/ep500-pro",
    // ─── Anker SOLIX — Amazon ASINs ───────────────────────────────────────────
    "C300":        "https://www.amazon.com/dp/B0CX4XGVHK?tag=clickdecision-20",
    "C800":        "https://www.amazon.com/dp/B0C4GFYMNH?tag=clickdecision-20",
    "C800X":       "https://www.amazon.com/dp/B0C4GFZ5SB?tag=clickdecision-20",
    "C800 Plus":   "https://www.amazon.com/dp/B0C4GFZRQH?tag=clickdecision-20",
    "C1000":       "https://www.amazon.com/dp/B0C4JNBFCG?tag=clickdecision-20",
    "C1000 Gen 2": "https://www.amazon.com/dp/B0CW2K7TYL?tag=clickdecision-20",
    "C2000":       "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
    "C2000 Gen 2": "https://www.amazon.com/dp/B0CW2K7TYL?tag=clickdecision-20",
    "F3800":       "https://www.amazon.com/dp/B0CF9LYWMJ?tag=clickdecision-20",
    // ─── Zendure — Amazon ASINs ───────────────────────────────────────────────
    "SuperBase M 607":   "https://www.amazon.com/dp/B0B9YQKR5R?tag=clickdecision-20",
    "SuperBase M 1016":  "https://www.amazon.com/dp/B0B9YSSL7Q?tag=clickdecision-20",
    "SuperBase Pro 2000":"https://www.amazon.com/dp/B09YQKR5R7?tag=clickdecision-20",
    "SuperBase V 4600":  "https://www.amazon.com/dp/B0C7QKYLMN?tag=clickdecision-20",
    "SuperBase V6400":   "https://www.amazon.com/s?k=Zendure+SuperBase+V6400&tag=clickdecision-20",
    "Hyper 2000":        "https://www.amazon.com/dp/B0BYXL5HHK?tag=clickdecision-20",
    // ─── Goal Zero — Amazon ASINs ─────────────────────────────────────────────
    "Yeti 200X":  "https://www.amazon.com/dp/B07RS5GK3H?tag=clickdecision-20",
    "Yeti 500X":  "https://www.amazon.com/dp/B07RS5GK3H?tag=clickdecision-20",
    "Yeti 1000X": "https://www.amazon.com/dp/B07YQ8HJWK?tag=clickdecision-20",
    "Yeti 1500X": "https://www.amazon.com/dp/B07YGPM86G?tag=clickdecision-20",
    "Yeti 3000X": "https://www.amazon.com/dp/B07YGNWX1B?tag=clickdecision-20",
    "Yeti 6000X": "https://www.amazon.com/dp/B08KZHY4ZS?tag=clickdecision-20",
    // ─── VTOMAN ───────────────────────────────────────────────────────────────
    "Jump 600X":       "https://www.amazon.com/dp/B0BZMF36X6?tag=clickdecision-20",
    "FlashSpeed 1500": "https://www.amazon.com/dp/B0BZMF36X6?tag=clickdecision-20",
    "Jump 1500X":      "https://www.amazon.com/dp/B0BZN3GRVZ?tag=clickdecision-20",
    "Jump 2200":       "https://www.amazon.com/dp/B0BZN3GRVZ?tag=clickdecision-20",
    // ─── Pecron ───────────────────────────────────────────────────────────────
    "E500LFP":  "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "E600LFP":  "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "E1000LFP": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "E1500LFP": "https://www.amazon.com/dp/B0BX7K5M2Q?tag=clickdecision-20",
    "E2000LFP": "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
    "E3000LFP": "https://www.amazon.com/dp/B0C8LNYWWX?tag=clickdecision-20",
    // ─── DJI Power ────────────────────────────────────────────────────────────
    "Power 500":  "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
    "Power 1000": "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
    "Power 2000": "https://www.amazon.com/dp/B0CNWM35D8?tag=clickdecision-20",
    // ─── Allpowers — Amazon ASINs ─────────────────────────────────────────────
    "R600":       "https://www.amazon.com/dp/B0B5GXKGFL?tag=clickdecision-20",
    "R1500 LITE": "https://www.amazon.com/dp/B0CLXGW5DG?tag=clickdecision-20",
    "S2000 Pro":  "https://www.amazon.com/dp/B098SM84SD?tag=clickdecision-20",
    "R2500":      "https://www.amazon.com/dp/B0C8LNYWWX?tag=clickdecision-20",
    "R4000":      "https://www.amazon.com/s?k=Allpowers+R4000+power+station&tag=clickdecision-20",
    // ─── OUPES — Amazon ───────────────────────────────────────────────────────
    "Mega 1":      "https://www.amazon.com/dp/B0DG8JQNS4?tag=clickdecision-20",
    "Mega 2":      "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
    "Mega 3":      "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
    "Mega 5":      "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
    "Exodus 2400": "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
    "600 Lite":    "https://www.amazon.com/dp/B0DG8JQNS4?tag=clickdecision-20",
    // ─── Others ───────────────────────────────────────────────────────────────
    "Infinity 1500":     "https://www.amazon.com/dp/B0C5KFZQ2T?tag=clickdecision-20",
    "Infinity 1300":     "https://www.amazon.com/dp/B0C5KFZQ2T?tag=clickdecision-20",
    "Union":             "https://www.amazon.com/dp/B0CFN7RJXW?tag=clickdecision-20",
    "P210":              "https://www.amazon.com/dp/B0CFGGR68G?tag=clickdecision-20",
    "Safari LT":         "https://www.amazon.com/dp/B07YGPM86G?tag=clickdecision-20",
    "UT 1300":           "https://www.amazon.com/dp/B07YGNWX1B?tag=clickdecision-20",
    "Lycan 1000":        "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "Lycan 5000":        "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
    "iGen300s":          "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
    "iGen1200s":         "https://www.amazon.com/dp/B0BH11KGKP?tag=clickdecision-20",
    "BaseCharge 1500":   "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "RP1000":            "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "HomePower One":     "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "HomePower ONE PRO": "https://www.amazon.com/dp/B09W7RBLCB?tag=clickdecision-20",
    "HomePower TWO PRO": "https://www.amazon.com/dp/B09W7RFKBH?tag=clickdecision-20",
  };

  const BRAND_FALLBACK: Record<string, string> = {
    "EcoFlow":     "https://www.amazon.com/s?k=EcoFlow+solar+generator&tag=clickdecision-20",
    "Bluetti":     "https://www.amazon.com/s?k=Bluetti+portable+power+station&tag=clickdecision-20",
    "Jackery":     "https://www.amazon.com/s?k=Jackery+solar+generator&tag=clickdecision-20",
    "Anker SOLIX": "https://www.amazon.com/s?k=Anker+SOLIX+power+station&tag=clickdecision-20",
    "Zendure":      "https://www.amazon.com/s?k=Zendure+SuperBase&tag=clickdecision-20",
    "Goal Zero":    "https://www.amazon.com/s?k=Goal+Zero+Yeti+power+station&tag=clickdecision-20",
    "VTOMAN":       "https://www.amazon.com/s?k=VTOMAN+portable+power+station&tag=clickdecision-20",
    "Pecron":       "https://www.amazon.com/s?k=Pecron+LFP+power+station&tag=clickdecision-20",
    "DJI Power":    "https://www.amazon.com/s?k=DJI+Power+portable+power+station&tag=clickdecision-20",
    "Renogy":       "https://www.amazon.com/s?k=Renogy+Lycan+5000+power+station&tag=clickdecision-20",
    "Geneverse":    "https://www.amazon.com/s?k=Geneverse+HomePower+power+station&tag=clickdecision-20",
  };

  // Technical Analysis pages — links to deep-dive pages when available
  const TECHNICAL_ANALYSIS_PAGES: Record<string, string> = {
    "DELTA Pro":            "/ecoflow-delta-pro-technical-analysis-2026/",
    "DELTA 3 Classic":      "/ecoflow-delta-3-classic-technical-analysis-2026/",
    "DELTA 3 Max":          "/ecoflow-delta-3-max-technical-analysis-2026/",
    "DELTA 2 Max":          "/ecoflow-delta-2-max-technical-analysis-2026/",
    "AC200L":               "/bluetti-ac200l-technical-analysis-2026/",
    "AC300":                "/bluetti-ac300-technical-analysis-2026/",
    "Explorer 1000 v2":     "/jackery-explorer-1000-v2-technical-analysis-2026/",
    "Explorer 2000 Plus":   "/jackery-explorer-2000-plus-technical-analysis-2026/",
    "Explorer 2000 v2":     "/jackery-explorer-2000-v2-technical-analysis-2026/",
    "F3800":                "/anker-solix-f3800-technical-analysis-2026/",
  };

  const getAffiliateUrl = (brand: string, model: string): string => {
    if (AMAZON_PRODUCTS[model]) return AMAZON_PRODUCTS[model];
    return BRAND_FALLBACK[brand] || `https://www.amazon.com/s?k=${encodeURIComponent(brand+" "+model)}&tag=clickdecision-20`;
  };

  // Direct brand URLs — ready to activate when Impact approves
  const brandUrl: Record<string, string> = {
    "EcoFlow":     "https://us.ecoflow.com",
    "Bluetti":     "https://www.bluettipower.com",
    "Jackery":     "https://www.jackery.com",
    "Anker SOLIX": "https://www.ankersolix.com",
    "Zendure":     "https://zendure.com",
  };

  return (
    <div
      className="rounded-[12px] border bg-white p-4 opacity-0 animate-fade-in"
      style={{ borderColor:"#E2E2E2", borderTop:`3px solid ${accentColor}`, animationFillMode:"forwards" }}
    >
      {/* Label + Product */}
      <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]" style={{color:accentColor}}>{label}</p>
      <h3 className="mt-1 text-[15px] font-semibold leading-tight text-neutral-950">{p.brand} {p.model}</h3>

      {/* Specs */}
      <div className="mt-3 grid grid-cols-2 gap-y-1 text-[12px] tabular-nums text-neutral-700">
        <span className="text-neutral-500">Capacity</span>
        <span className="text-right">{p.wh.toLocaleString()} Wh</span>
        <span className="text-neutral-500">Surge</span>
        <span className="text-right">{p.surge.toLocaleString()} W</span>
        <span className="text-neutral-500">UPS</span>
        <span className="text-right">{p.ups ? "✓ Yes" : "✗ No"}</span>
        <span className="text-neutral-500">Price</span>
        <span className="text-right font-semibold" style={{color:accentColor}}>${p.price.toLocaleString()}</span>
      </div>

      {/* Score Breakdown */}
      <ScoreBreakdown components={scoreComponents} overallScore={overallScore} scoreKey={scoreKey} />

      {/* Expert Verdict */}
      <div className="mt-3 rounded-[8px] bg-[#F8F9FF] border px-3 py-2.5" style={{borderColor:"#E8EDFF"}}>
        <p className="font-mono text-[9.5px] font-medium uppercase tracking-wider text-[#2563EB] mb-1.5">Expert Verdict</p>
        <p className="text-[11.5px] leading-[1.6] text-neutral-700">{expertVerdict}</p>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="mt-[3px] text-[#10B981] text-[10px] shrink-0">✓</span>
              <span className="text-[11px] text-neutral-600">{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tradeoffs */}
      {tradeoffs.length > 0 && (
        <div className="mt-2 space-y-1">
          {tradeoffs.map((t, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="mt-[3px] text-[#F59E0B] text-[10px] shrink-0">⚠</span>
              <span className="text-[11px] text-neutral-500">{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <a
        href={getAffiliateUrl(p.brand, p.model)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => {
          if (typeof window !== "undefined" && (window as any).cdlTrack) {
            (window as any).cdlTrack("affiliate_click", {
              product: `${p.brand} ${p.model}`,
              brand: p.brand,
              price: p.price,
              label,                          // "Best Match" | "Best Value" | "Premium Pick"
              scenario: scoreKey,
              appliance: scoreKey,
              recommendation_position: label === "Best Match" ? 1 : label === "Best Value" ? 2 : 3,
            });
          }
        }}
        className="mt-4 block rounded-[8px] py-2.5 text-center text-[12.5px] font-medium text-white transition-opacity hover:opacity-80"
        style={{background: accentColor}}
      >
        Check current price →
      </a>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", text: "Calculate your energy requirement from appliance and coverage days" },
    { n: "02", text: "Filter by surge capacity, UPS requirement, and budget" },
    { n: "03", text: "Score remaining products across 7 use-case dimensions" },
    { n: "04", text: "Rank by scenario fit, value efficiency, and performance headroom" },
  
  // ─── Final 3 to reach 100 ────────────────────────────────────────────────
  // Source: us.ecoflow.com (manufacturer verified June 2026)
  { brand:"EcoFlow", model:"DELTA 3 Ultra Plus",   price:1499, wh:3072, surge:7000, solar:1200, ups:true,  expandable:true,  weight:64,   warranty:5, scores:{home_backup:10,rv:3,camping:2,off_grid:9,apartment:2,medical:9,value:7}, notes:"3072Wh LFP. Expandable 3-11kWh. Smart Output Priority. UPS <30ms. Verified us.ecoflow.com June 2026." },
  // Source: goalzero.com (manufacturer verified)
  { brand:"Goal Zero", model:"Yeti 200X",           price:199,  wh:187,  surge:300,  solar:60,   ups:false, expandable:false, weight:5,    warranty:2, scores:{home_backup:2,rv:4,camping:9,off_grid:2,apartment:4,medical:2,value:7}, notes:"187Wh NMC. 120W continuous. Ultra-compact 5 lbs. Entry-level camping. No UPS." },
  // Source: us.ecoflow.com (manufacturer verified June 2026)
  { brand:"EcoFlow", model:"DELTA Pro Ultra",       price:3999, wh:6000, surge:15000,solar:5600, ups:true,  expandable:true,  weight:195,  warranty:5, scores:{home_backup:10,rv:1,camping:1,off_grid:10,apartment:1,medical:10,value:4}, notes:"Whole-home system. 7200W continuous. Online UPS 0ms. Expandable to 90kWh. Verified us.ecoflow.com June 2026." },
];
  return (
    <div className="mt-5 rounded-[12px] border p-5" style={{borderColor:"#E2E2E2", background:"#FAFAFA"}}>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-4">How recommendations work</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {steps.map(s => (
          <div key={s.n} className="flex items-start gap-2">
            <span className="font-mono text-[11px] font-semibold text-neutral-300 shrink-0 mt-[1px]">{s.n}</span>
            <span className="text-[11.5px] text-neutral-500 leading-[1.5]">{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function SolarCalculator() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [appliance, setAppliance] = useState("Refrigerator");
  const [budget, setBudget] = useState("1500");
  const [days, setDays] = useState("2 days");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const selectCls = "w-full appearance-none bg-transparent text-[14px] text-neutral-900 outline-none cursor-pointer";

  const LABEL_COLORS: Record<string, string> = {
    "Best Match":   "#2563EB",
    "Best Value":   "#10B981",
    "Premium Pick": "#8B5CF6",
  };

  const onSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && (window as any).cdlTrack) {
      (window as any).cdlTrack("calculator_submit", { scenario, appliance, budget: budget || "unset", days });
    }
    setAnalyzing(true);
    setResult(null);
    // Brief delay to let the analyzing state render — adds perceived intelligence
    setTimeout(() => {
      const b = parseInt(budget || "0", 10) || 0;
      const analysis = computeAnalysis(scenario, appliance, days, b);
      setResult(analysis);
    Analytics.calculatorComplete(
      analysis.matches?.length ?? 0,
      analysis.eliminatedProducts?.length ?? 0,
      analysis.matches?.[0]?.model ?? "none"
    );
      setAnalyzing(false);
      if (typeof window !== "undefined" && (window as any).cdlTrack) {
        (window as any).cdlTrack("result_view", {
          scenario,
          appliance,
          budget: b || "unset",
          days,
          products_matched: analysis.picks.length,
          products_eliminated: analysis.eliminations.reduce((s: number, e: {count:number}) => s + e.count, 0),
          top_recommendation: analysis.picks[0] ? `${analysis.picks[0].product.brand} ${analysis.picks[0].product.model}` : "none",
        });
      }
    }, 480);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-[16px] bg-white p-7 md:p-9" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>

      {/* Authority strip */}
      <div className="mb-5 flex items-center gap-4 flex-wrap">
        {["53 products", "10 brands", "7 use-case scores", "Updated weekly"].map(t => (
          <span key={t} className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{t}</span>
        ))}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field label="SCENARIO" icon="home">
          <select className={selectCls} value={scenario} onChange={e => {
              setScenario(e.target.value);
              if (typeof window !== "undefined" && (window as any).cdlTrack) {
                (window as any).cdlTrack("calculator_start", { first_field: "scenario", value: e.target.value });
              }
            }}>
            {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="KEY APPLIANCE" icon="fridge">
          <select className={selectCls} value={appliance} onChange={e => setAppliance(e.target.value)}>
            {APPLIANCE_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="BUDGET (USD)" icon="dollar">
          <input type="number" min={200} max={15000} value={budget} onChange={e => setBudget(e.target.value)} className={selectCls} placeholder="e.g. 1500" />
        </Field>
        <Field label="DAYS OF COVERAGE" icon="calendar">
          <select className={selectCls} value={days} onChange={e => setDays(e.target.value)}>
            {DAYS_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={analyzing}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-neutral-950 px-5 py-4 text-[14.5px] font-medium text-white transition-all duration-200 hover:-translate-y-[2px] hover:opacity-[0.85] disabled:opacity-60 disabled:cursor-default disabled:translate-y-0"
      >
        {analyzing ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"/>
            Analyzing {PRODUCTS.length} products…
          </>
        ) : (
          <>
            Find my system
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </>
        )}
      </button>

      {/* How it works — always visible below button */}
      {!result && <HowItWorks />}

      {/* Results */}
      {result && (
        <div className="mt-7">
          {/* Analysis header */}
          <AnalysisHeader result={result} />

          {result.outOfBudget && (
            <p className="mb-4 text-[12.5px] text-neutral-500 text-center">
              No products matched all criteria within budget — showing closest alternatives.
            </p>
          )}

          {/* Eliminated products */}
          <EliminatedPanel eliminated={result.eliminatedProducts} />

          {/* Comparison table */}
          <ComparisonTable
            picks={result.picks}
            requiredWh={result.requiredWh}
            requiredSurge={result.requiredSurge}
            needsUps={result.needsUps}
            scoreKey={result.scoreKey}
          />

          {/* Product cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {result.picks.map((pick, i) => (
              <div key={pick.product.model + i} style={{animationDelay:`${i * 120}ms`}}>
                <ResultCard
                  pick={pick}
                  accentColor={LABEL_COLORS[pick.label] || "#2563EB"}
                  scoreKey={result.scoreKey}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-5 text-[11px] text-neutral-400 text-center leading-relaxed">
            {PRODUCTS.length} products analyzed · {result.eliminations.reduce((s, e) => s + e.count, 0)} eliminated · {result.picks.length} matched ·{" "}
            <a href="/methodology" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Methodology</a>
            {" · "}
            <a href="/technical-analysis" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Technical Analysis</a>
            {" · "}
            <a href="/comparisons" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Comparisons</a>
            {" "}· We earn a commission if you purchase — this does not affect our analysis.
          </p>
        </div>
      )}
    </form>
  );
}
