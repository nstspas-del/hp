/* ═══════════════════════════════════════════════════════════
   HP Тюнинг — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

// ─── Header scroll ───
var header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

// ─── Hamburger menu ───
var hamburger = document.getElementById('hamburger');
var mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', function() {
    var open = mainNav.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mainNav.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      mainNav.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function(e) {
    if (header && !header.contains(e.target) && mainNav.classList.contains('mobile-open')) {
      mainNav.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ─── AutoDealer booking widget ───
function openBooking() {
  if (typeof autodealer !== 'undefined' && typeof autodealer.open === 'function') {
    autodealer.open();
  } else {
    var contact = document.getElementById('contacts');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = 'tel:+79818428151';
    }
  }
}

// ─── Smooth anchor scroll ───
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   TUNING CALCULATOR — FULL DATABASE
   ═══════════════════════════════════════════════════════════ */

var tuningData = {
  // ──────────── BMW ────────────
  'BMW': {
    '1 Series (F20/F40)': {
      '118i 1.5T (B38, 136 л.с.)':   { stock:136, s1:180, s2:null, s3:null, s1p:6500, s2p:null, s3p:null },
      '120i 2.0T (B48, 184 л.с.)':   { stock:184, s1:240, s2:300,  s3:null, s1p:6500, s2p:11000, s3p:null },
      'M135i 2.0T (B48, 306 л.с.)':  { stock:306, s1:380, s2:440,  s3:null, s1p:8000, s2p:16000, s3p:null },
    },
    '2 Series (G42/G87)': {
      '220i 2.0T (B48, 184 л.с.)':   { stock:184, s1:250, s2:300,  s3:null, s1p:6500, s2p:12000, s3p:null },
      'M2 3.0T (S58, 460 л.с.)':     { stock:460, s1:540, s2:620,  s3:700,  s1p:14000, s2p:36000, s3p:85000 },
    },
    '3 Series (G20)': {
      '320i 2.0T (B48, 184 л.с.)':   { stock:184, s1:250, s2:310,  s3:null, s1p:6500, s2p:12000, s3p:null },
      '330i 2.0T (B48, 258 л.с.)':   { stock:258, s1:330, s2:390,  s3:null, s1p:7000, s2p:14000, s3p:null },
      '330d 3.0 (B57, 265 л.с.)':    { stock:265, s1:330, s2:400,  s3:null, s1p:7500, s2p:15000, s3p:null },
      '340i 3.0T (B58, 382 л.с.)':   { stock:382, s1:460, s2:530,  s3:null, s1p:10000, s2p:20000, s3p:null },
      'M3 Competition (S58, 510 л.с.)': { stock:510, s1:600, s2:700, s3:750, s1p:14000, s2p:36000, s3p:85000 },
    },
    '4 Series (G22/G82)': {
      '420i 2.0T (B48, 184 л.с.)':   { stock:184, s1:250, s2:310,  s3:null, s1p:6500, s2p:12000, s3p:null },
      '430i 2.0T (B48, 245 л.с.)':   { stock:245, s1:310, s2:380,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'M4 Competition (S58, 510 л.с.)': { stock:510, s1:600, s2:700, s3:750, s1p:14000, s2p:36000, s3p:85000 },
      'M4 CSL (S58, 550 л.с.)':      { stock:550, s1:640, s2:730,  s3:800,  s1p:16000, s2p:40000, s3p:95000 },
    },
    '5 Series (G30)': {
      '520i 2.0T (B48, 184 л.с.)':   { stock:184, s1:250, s2:300,  s3:null, s1p:6500, s2p:12000, s3p:null },
      '530d 3.0 (B57, 265 л.с.)':    { stock:265, s1:330, s2:400,  s3:null, s1p:8000, s2p:16000, s3p:null },
      '540i 3.0T (B58, 340 л.с.)':   { stock:340, s1:420, s2:500,  s3:null, s1p:9000, s2p:18000, s3p:null },
      'M5 Competition (S63, 625 л.с.)': { stock:625, s1:720, s2:820, s3:900, s1p:18000, s2p:45000, s3p:110000 },
    },
    '6 Series GT (G32)': {
      '630i 2.0T (B48, 258 л.с.)':   { stock:258, s1:330, s2:390,  s3:null, s1p:7000, s2p:14000, s3p:null },
      '640i 3.0T (B58, 340 л.с.)':   { stock:340, s1:420, s2:490,  s3:null, s1p:9000, s2p:18000, s3p:null },
    },
    '7 Series (G11/G12)': {
      '730d 3.0 (B57, 265 л.с.)':    { stock:265, s1:330, s2:400,  s3:null, s1p:8000, s2p:16000, s3p:null },
      '750i 4.4T (N63TU, 530 л.с.)':{  stock:530, s1:620, s2:720,  s3:null, s1p:16000, s2p:38000, s3p:null },
      'M760i 6.6T (S68, 585 л.с.)':  { stock:585, s1:680, s2:780,  s3:null, s1p:20000, s2p:50000, s3p:null },
    },
    'X3/X4 (G01/G02)': {
      'X3 20i 2.0T (B48, 184 л.с.)': { stock:184, s1:250, s2:310,  s3:null, s1p:6500, s2p:12000, s3p:null },
      'X3 30i 2.0T (B48, 252 л.с.)': { stock:252, s1:320, s2:380,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'X3 M Competition (S58, 510 л.с.)': { stock:510, s1:600, s2:700, s3:750, s1p:14000, s2p:36000, s3p:85000 },
      'X4 M40i 3.0T (B58, 360 л.с.)': { stock:360, s1:440, s2:510, s3:null, s1p:10000, s2p:20000, s3p:null },
    },
    'X5/X6 (G05/G06)': {
      'xDrive30i 2.0T (B48, 252 л.с.)': { stock:252, s1:320, s2:380, s3:null, s1p:7000, s2p:14000, s3p:null },
      'xDrive40i 3.0T (B58, 340 л.с.)': { stock:340, s1:420, s2:490, s3:null, s1p:9000, s2p:19000, s3p:null },
      'M50i 4.4T (N63TU2, 530 л.с.)': { stock:530, s1:630, s2:720, s3:null, s1p:16000, s2p:40000, s3p:null },
      'X5 M Competition (S63M, 625 л.с.)': { stock:625, s1:720, s2:820, s3:900, s1p:18000, s2p:46000, s3p:110000 },
    },
    'X7 (G07)': {
      'xDrive30i 2.0T (B48, 252 л.с.)': { stock:252, s1:320, s2:380, s3:null, s1p:7000, s2p:14000, s3p:null },
      'xDrive40i 3.0T (B58, 340 л.с.)': { stock:340, s1:420, s2:490, s3:null, s1p:9000, s2p:19000, s3p:null },
      'M60i 4.4T (S68, 530 л.с.)':      { stock:530, s1:620, s2:720, s3:null, s1p:16000, s2p:40000, s3p:null },
    },
  },

  // ──────────── MERCEDES-BENZ ────────────
  'Mercedes-Benz': {
    'A-Class (W177)': {
      'A200 1.3T (M282, 163 л.с.)':  { stock:163, s1:210, s2:null, s3:null, s1p:6500, s2p:null, s3p:null },
      'A250 2.0T (M260, 224 л.с.)':  { stock:224, s1:290, s2:340,  s3:null, s1p:7000, s2p:13000, s3p:null },
      'A45 S AMG (M139, 421 л.с.)':  { stock:421, s1:500, s2:580,  s3:650,  s1p:14000, s2p:36000, s3p:80000 },
    },
    'C-Class (W205/W206)': {
      'C180 1.5T (M264, 156 л.с.)':  { stock:156, s1:200, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'C200 2.0T (M264, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'C300 2.0T (M264, 258 л.с.)':  { stock:258, s1:330, s2:390,  s3:null, s1p:8000, s2p:15000, s3p:null },
      'C43 AMG 3.0T (M256, 408 л.с.)': { stock:408, s1:480, s2:550, s3:null, s1p:12000, s2p:28000, s3p:null },
      'C63 AMG (M177, 476 л.с.)':    { stock:476, s1:560, s2:650,  s3:720,  s1p:15000, s2p:38000, s3p:90000 },
    },
    'E-Class (W213/W214)': {
      'E200 2.0T (M264, 197 л.с.)':  { stock:197, s1:265, s2:310,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'E300 2.0T (M264, 258 л.с.)':  { stock:258, s1:330, s2:390,  s3:null, s1p:8000, s2p:15000, s3p:null },
      'E400 3.0T (M276, 333 л.с.)':  { stock:333, s1:400, s2:470,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'E53 AMG 3.0T (M256, 435 л.с.)': { stock:435, s1:510, s2:580, s3:null, s1p:13000, s2p:30000, s3p:null },
      'E63 AMG S (M177, 612 л.с.)':  { stock:612, s1:720, s2:820,  s3:900,  s1p:20000, s2p:50000, s3p:110000 },
    },
    'S-Class (W222/W223)': {
      'S400 3.0T (M256, 333 л.с.)':  { stock:333, s1:400, s2:470,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'S500 3.0T (M256, 435 л.с.)':  { stock:435, s1:510, s2:590,  s3:null, s1p:14000, s2p:32000, s3p:null },
      'AMG S63 4.0T (M177, 612 л.с.)': { stock:612, s1:720, s2:820, s3:900, s1p:20000, s2p:50000, s3p:120000 },
    },
    'GLC (X253/X254)': {
      'GLC 200 2.0T (M264, 204 л.с.)': { stock:204, s1:265, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'GLC 300 2.0T (M264, 258 л.с.)': { stock:258, s1:330, s2:390, s3:null, s1p:8000, s2p:15000, s3p:null },
      'AMG GLC 43 3.0T (M276, 390 л.с.)': { stock:390, s1:460, s2:530, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'GLE / GLS (W167)': {
      'GLE 300d 2.0 (OM656, 245 л.с.)': { stock:245, s1:310, s2:370, s3:null, s1p:8000, s2p:16000, s3p:null },
      'GLE 400d 3.0 (OM656, 330 л.с.)': { stock:330, s1:400, s2:460, s3:null, s1p:9500, s2p:20000, s3p:null },
      'GLE 53 AMG 3.0T (M256, 435 л.с.)': { stock:435, s1:510, s2:580, s3:null, s1p:13000, s2p:30000, s3p:null },
      'AMG GLE 63 S 4.0T (M177, 612 л.с.)': { stock:612, s1:720, s2:820, s3:900, s1p:20000, s2p:50000, s3p:120000 },
    },
  },

  // ──────────── PORSCHE ────────────
  'Porsche': {
    'Cayenne (9Y0)': {
      'Cayenne 3.0T (M06.EJ, 340 л.с.)':    { stock:340, s1:415, s2:480, s3:null, s1p:10000, s2p:22000, s3p:null },
      'Cayenne S 2.9T (M06.EK, 440 л.с.)':  { stock:440, s1:530, s2:610, s3:null, s1p:13000, s2p:30000, s3p:null },
      'Cayenne GTS 4.0T (460 л.с.)':         { stock:460, s1:550, s2:640, s3:null, s1p:15000, s2p:36000, s3p:null },
      'Cayenne Turbo 4.0T (550 л.с.)':       { stock:550, s1:650, s2:740, s3:820, s1p:18000, s2p:42000, s3p:100000 },
      'Cayenne Turbo S E-Hybrid 4.0T (680 л.с.)': { stock:680, s1:780, s2:880, s3:null, s1p:22000, s2p:58000, s3p:null },
    },
    'Macan (95B/J1)': {
      'Macan 2.0T (EA888, 245 л.с.)':        { stock:245, s1:310, s2:370, s3:null, s1p:7500, s2p:16000, s3p:null },
      'Macan S 3.0T (DCHA, 380 л.с.)':       { stock:380, s1:450, s2:520, s3:null, s1p:11000, s2p:25000, s3p:null },
      'Macan GTS 2.9T (DCHA, 440 л.с.)':     { stock:440, s1:520, s2:600, s3:null, s1p:14000, s2p:32000, s3p:null },
      'Macan Turbo 2.9T (DCMA, 440 л.с.)':   { stock:440, s1:530, s2:610, s3:null, s1p:14000, s2p:33000, s3p:null },
    },
    'Panamera (G2)': {
      'Panamera 4 2.9T (M07.EA, 330 л.с.)':  { stock:330, s1:400, s2:470, s3:null, s1p:10000, s2p:22000, s3p:null },
      'Panamera 4S 2.9T (M07.EA, 440 л.с.)':{  stock:440, s1:520, s2:610, s3:null, s1p:13000, s2p:32000, s3p:null },
      'Panamera GTS 4.0T (M07.PB, 460 л.с.)':{ stock:460, s1:550, s2:640, s3:null, s1p:15000, s2p:36000, s3p:null },
      'Panamera Turbo S 4.0T (630 л.с.)':    { stock:630, s1:730, s2:830, s3:null, s1p:20000, s2p:50000, s3p:null },
    },
    '911 (992)': {
      '911 Carrera 3.0T (447 л.с.)':         { stock:447, s1:530, s2:620, s3:null, s1p:14000, s2p:35000, s3p:null },
      '911 Carrera S 3.0T (450 л.с.)':       { stock:450, s1:540, s2:630, s3:null, s1p:14000, s2p:36000, s3p:null },
      '911 Carrera 4S 3.0T (450 л.с.)':      { stock:450, s1:540, s2:630, s3:null, s1p:14000, s2p:36000, s3p:null },
      '911 Turbo 3.7T (572 л.с.)':           { stock:572, s1:660, s2:760, s3:840, s1p:18000, s2p:44000, s3p:100000 },
      '911 Turbo S 3.7T (650 л.с.)':         { stock:650, s1:750, s2:850, s3:940, s1p:20000, s2p:50000, s3p:115000 },
    },
    '718 Cayman / Boxster (982)': {
      '718 Cayman 2.0T (300 л.с.)':          { stock:300, s1:360, s2:420, s3:null, s1p:9000, s2p:19000, s3p:null },
      '718 Cayman S 2.5T (350 л.с.)':        { stock:350, s1:420, s2:500, s3:null, s1p:11000, s2p:25000, s3p:null },
      '718 GTS 4.0 (NA, 400 л.с.)':          { stock:400, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── AUDI ────────────
  'Audi': {
    'A3/S3 (8Y)': {
      'A3 35 TFSI 1.5T (EA48G, 150 л.с.)':  { stock:150, s1:190, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'A3 40 TFSI 2.0T (EA888, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:13000, s3p:null },
      'S3 2.0T (EA888, 310 л.с.)':           { stock:310, s1:390, s2:460,  s3:null, s1p:9000, s2p:19000, s3p:null },
      'RS3 2.5T (EA855, 400 л.с.)':          { stock:400, s1:490, s2:570,  s3:640,  s1p:13000, s2p:32000, s3p:75000 },
    },
    'A4/S4/RS4 (B9)': {
      'A4 35 TFSI 2.0T (EA888, 150 л.с.)':  { stock:150, s1:200, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'A4 40 TFSI 2.0T (EA888, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:13000, s3p:null },
      'A4 40 TDI 2.0 (EA288, 204 л.с.)':    { stock:204, s1:265, s2:310,  s3:null, s1p:6500, s2p:13000, s3p:null },
      'S4 3.0T (EA839, 354 л.с.)':           { stock:354, s1:430, s2:500,  s3:null, s1p:11000, s2p:25000, s3p:null },
      'RS4 Competition 2.9T (EA839, 450 л.с.)': { stock:450, s1:540, s2:620, s3:700, s1p:14000, s2p:35000, s3p:80000 },
    },
    'A5/S5/RS5 (F5)': {
      'A5 40 TFSI 2.0T (EA888, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:13000, s3p:null },
      'S5 3.0T (EA839, 354 л.с.)':           { stock:354, s1:430, s2:500,  s3:null, s1p:11000, s2p:25000, s3p:null },
      'RS5 2.9T (EA839, 450 л.с.)':          { stock:450, s1:540, s2:620,  s3:700,  s1p:14000, s2p:35000, s3p:80000 },
    },
    'A6/S6/RS6 (C8)': {
      'A6 40 TFSI 2.0T (EA888, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:13000, s3p:null },
      'A6 45 TFSI 2.0T (EA888, 245 л.с.)':  { stock:245, s1:310, s2:370,  s3:null, s1p:7500, s2p:15000, s3p:null },
      'A6 55 TFSI 3.0T (EA839, 340 л.с.)':  { stock:340, s1:420, s2:490,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'S6 3.0T (EA839, 450 л.с.)':           { stock:450, s1:540, s2:620,  s3:null, s1p:14000, s2p:35000, s3p:null },
      'RS6 Performance 4.0T (EA825, 630 л.с.)': { stock:630, s1:750, s2:850, s3:930, s1p:20000, s2p:52000, s3p:115000 },
    },
    'A7/S7/RS7 (4K8)': {
      'A7 55 TFSI 3.0T (EA839, 340 л.с.)':  { stock:340, s1:420, s2:490,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'S7 3.0T (EA839, 450 л.с.)':           { stock:450, s1:540, s2:620,  s3:null, s1p:14000, s2p:35000, s3p:null },
      'RS7 Performance 4.0T (EA825, 630 л.с.)': { stock:630, s1:750, s2:850, s3:930, s1p:20000, s2p:52000, s3p:115000 },
    },
    'A8 (D5)': {
      'A8 55 TFSI 3.0T (EA839, 340 л.с.)':  { stock:340, s1:420, s2:490,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'A8 60 TFSI 4.0T (EA825, 460 л.с.)':  { stock:460, s1:550, s2:630,  s3:null, s1p:15000, s2p:36000, s3p:null },
      'S8 4.0T (EA825, 571 л.с.)':           { stock:571, s1:680, s2:780,  s3:850,  s1p:18000, s2p:45000, s3p:105000 },
    },
    'Q3/Q3 Sportback': {
      'Q3 35 TFSI 1.5T (EA48G, 150 л.с.)':  { stock:150, s1:190, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'Q3 45 TFSI 2.0T (EA888, 230 л.с.)':  { stock:230, s1:295, s2:350,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'RSQ3 2.5T (EA855, 400 л.с.)':         { stock:400, s1:490, s2:570,  s3:640,  s1p:13000, s2p:32000, s3p:75000 },
    },
    'Q5/SQ5 (FY)': {
      'Q5 35 TFSI 2.0T (EA888, 150 л.с.)':  { stock:150, s1:200, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'Q5 40 TFSI 2.0T (EA888, 204 л.с.)':  { stock:204, s1:265, s2:310,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'Q5 45 TFSI 2.0T (EA888, 265 л.с.)':  { stock:265, s1:330, s2:395,  s3:null, s1p:7500, s2p:15000, s3p:null },
      'SQ5 3.0T (EA839, 354 л.с.)':          { stock:354, s1:430, s2:500,  s3:null, s1p:11000, s2p:25000, s3p:null },
      'RSQ5 2.9T (EA839, 450 л.с.)':         { stock:450, s1:540, s2:620,  s3:700,  s1p:14000, s2p:35000, s3p:80000 },
    },
    'Q7/Q8 (4M/4N)': {
      'Q7 45 TFSI 2.0T (EA888, 245 л.с.)':  { stock:245, s1:310, s2:380,  s3:null, s1p:7500, s2p:16000, s3p:null },
      'Q7 55 TFSI 3.0T (EA839, 340 л.с.)':  { stock:340, s1:420, s2:490,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'SQ7 4.0T (EA825, 507 л.с.)':          { stock:507, s1:600, s2:690,  s3:null, s1p:16000, s2p:40000, s3p:null },
      'RSQ8 4.0T (EA825, 600 л.с.)':         { stock:600, s1:720, s2:810,  s3:870,  s1p:19000, s2p:50000, s3p:115000 },
    },
    'RS6/RS7 (C8)': {
      'RS6 Avant 4.0T (EA825, 600 л.с.)':   { stock:600, s1:720, s2:800,  s3:850,  s1p:18000, s2p:50000, s3p:100000 },
      'RS7 4.0T (EA825, 600 л.с.)':          { stock:600, s1:720, s2:800,  s3:850,  s1p:18000, s2p:50000, s3p:100000 },
      'RS6 Performance 4.0T (630 л.с.)':     { stock:630, s1:750, s2:850,  s3:930,  s1p:20000, s2p:52000, s3p:115000 },
    },
  },

  // ──────────── VOLKSWAGEN ────────────
  'Volkswagen': {
    'Golf (8)': {
      'Golf 1.0 TSI (85 л.с.)':      { stock:85,  s1:115, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      'Golf 1.5 TSI (150 л.с.)':     { stock:150, s1:190, s2:230,  s3:null, s1p:6000, s2p:11000, s3p:null },
      'Golf R 2.0T (320 л.с.)':      { stock:320, s1:400, s2:470,  s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Passat (B8)': {
      'Passat 1.4 TSI (150 л.с.)':   { stock:150, s1:190, s2:230,  s3:null, s1p:6000, s2p:11000, s3p:null },
      'Passat 2.0 TSI (220 л.с.)':   { stock:220, s1:285, s2:340,  s3:null, s1p:7000, s2p:14000, s3p:null },
      'Passat 2.0 TDI (240 л.с.)':   { stock:240, s1:305, s2:360,  s3:null, s1p:7000, s2p:14000, s3p:null },
    },
    'Tiguan (Mk2)': {
      'Tiguan 1.4 TSI (150 л.с.)':   { stock:150, s1:190, s2:230,  s3:null, s1p:6000, s2p:11000, s3p:null },
      'Tiguan 2.0 TSI (180 л.с.)':   { stock:180, s1:235, s2:280,  s3:null, s1p:6500, s2p:12000, s3p:null },
      'Tiguan R 2.0T (320 л.с.)':    { stock:320, s1:400, s2:470,  s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Touareg (CR)': {
      'Touareg 2.0T (250 л.с.)':     { stock:250, s1:315, s2:380,  s3:null, s1p:7500, s2p:15000, s3p:null },
      'Touareg 3.0T (340 л.с.)':     { stock:340, s1:420, s2:490,  s3:null, s1p:10000, s2p:22000, s3p:null },
      'Touareg R 3.0T (462 л.с.)':   { stock:462, s1:550, s2:635,  s3:null, s1p:14000, s2p:32000, s3p:null },
    },
    'Arteon': {
      'Arteon 2.0 TSI (190 л.с.)':   { stock:190, s1:250, s2:300,  s3:null, s1p:6500, s2p:12000, s3p:null },
      'Arteon R 2.0T (320 л.с.)':    { stock:320, s1:400, s2:470,  s3:null, s1p:9000, s2p:19000, s3p:null },
    },
  },

  // ──────────── LEXUS ────────────
  'Lexus': {
    'IS (XE30)': {
      'IS 200t/300 2.0T (8AR-FTS, 245 л.с.)':{  stock:245, s1:300, s2:355, s3:null, s1p:8000, s2p:16000, s3p:null },
      'IS 350 V6 NA (3.5, 315 л.с.)':         { stock:315, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'IS 500 5.0 V8 (479 л.с.)':              { stock:479, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'GS (L10)': {
      'GS 200t/300 2.0T (8AR-FTS, 245 л.с.)': { stock:245, s1:300, s2:355, s3:null, s1p:8000, s2p:16000, s3p:null },
      'GS 350 V6 (3.5, 315 л.с.)':             { stock:315, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'RX (AL20/AL30)': {
      'RX 200t 2.0T (8AR-FTS, 238 л.с.)':     { stock:238, s1:295, s2:350, s3:null, s1p:8000, s2p:16000, s3p:null },
      'RX 300 2.0T (M20A-FKS, 238 л.с.)':     { stock:238, s1:295, s2:350, s3:null, s1p:8000, s2p:16000, s3p:null },
      'RX 350 V6 (3.5 2GR, 249 л.с.)':        { stock:249, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'RX 500h Hybrid (367 л.с.)':             { stock:367, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'NX (AZ10/AZ20)': {
      'NX 200t/300 2.0T (8AR, 238 л.с.)':     { stock:238, s1:295, s2:350, s3:null, s1p:7500, s2p:15000, s3p:null },
      'NX 350 2.4T (T24A, 279 л.с.)':          { stock:279, s1:345, s2:410, s3:null, s1p:8500, s2p:17000, s3p:null },
    },
    'LX (570/600)': {
      'LX 570 5.7 V8 (377 л.с.)':              { stock:377, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'LX 600 3.5T V6 Hybrid (420 л.с.)':      { stock:420, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'RC F / GS F': {
      'RC F / GS F 5.0 V8 (477 л.с.)':         { stock:477, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── LAND ROVER / RANGE ROVER ────────────
  'Land Rover / Range Rover': {
    'Range Rover (L460)': {
      'P360 3.0T I6 (360 л.с.)':              { stock:360, s1:440, s2:510, s3:null, s1p:12000, s2p:27000, s3p:null },
      'P400 3.0T I6 (400 л.с.)':              { stock:400, s1:480, s2:560, s3:null, s1p:13000, s2p:30000, s3p:null },
      'P510e Hybrid (510 л.с.)':               { stock:510, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'P530 V8 4.4T (530 л.с.)':               { stock:530, s1:640, s2:730, s3:820, s1p:17000, s2p:42000, s3p:100000 },
    },
    'Range Rover Sport (L461)': {
      'P360 3.0T (360 л.с.)':                  { stock:360, s1:440, s2:510, s3:null, s1p:12000, s2p:27000, s3p:null },
      'P400 3.0T (400 л.с.)':                  { stock:400, s1:480, s2:560, s3:null, s1p:13000, s2p:30000, s3p:null },
      'P530 V8 4.4T (530 л.с.)':               { stock:530, s1:640, s2:730, s3:820, s1p:17000, s2p:42000, s3p:100000 },
      'SV BESPOKE V8 4.4T (635 л.с.)':         { stock:635, s1:750, s2:850, s3:null, s1p:22000, s2p:55000, s3p:null },
    },
    'Range Rover Velar (L560)': {
      'P250 2.0T (249 л.с.)':                  { stock:249, s1:315, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
      'P380 3.0T (380 л.с.)':                  { stock:380, s1:460, s2:530, s3:null, s1p:11000, s2p:26000, s3p:null },
    },
    'Range Rover Evoque (L551)': {
      'P200 2.0T (200 л.с.)':                  { stock:200, s1:265, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'P300 2.0T (300 л.с.)':                  { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Defender (L663)': {
      'P300 2.0T (300 л.с.)':                  { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
      'P400 3.0T (400 л.с.)':                  { stock:400, s1:480, s2:560, s3:null, s1p:12000, s2p:28000, s3p:null },
      'P500 5.0 V8 (518 л.с.)':                { stock:518, s1:620, s2:710, s3:800, s1p:16000, s2p:40000, s3p:95000 },
    },
    'Discovery (L462)': {
      'Si4 2.0T (249 л.с.)':                   { stock:249, s1:315, s2:380, s3:null, s1p:8000, s2p:16000, s3p:null },
      'SD4 3.0T (306 л.с.)':                   { stock:306, s1:380, s2:450, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
  },

  // ──────────── JAGUAR ────────────
  'Jaguar': {
    'F-Pace (X761)': {
      'P250 2.0T (249 л.с.)':                  { stock:249, s1:315, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
      'P340 3.0T I6 (340 л.с.)':               { stock:340, s1:420, s2:490, s3:null, s1p:10000, s2p:22000, s3p:null },
      'SVR 5.0 V8 S/C (550 л.с.)':             { stock:550, s1:660, s2:760, s3:860, s1p:17000, s2p:42000, s3p:100000 },
    },
    'XE / XF': {
      'XE 2.0T P250 (249 л.с.)':               { stock:249, s1:315, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
      'XF 2.0T P250 (249 л.с.)':               { stock:249, s1:315, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
      'XF 3.0 P380 (380 л.с.)':                { stock:380, s1:460, s2:535, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'F-Type (X152)': {
      'F-Type 2.0T P300 (300 л.с.)':           { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
      'F-Type S 3.0 S/C (380 л.с.)':           { stock:380, s1:460, s2:540, s3:null, s1p:11000, s2p:26000, s3p:null },
      'F-Type SVR 5.0 V8 (575 л.с.)':          { stock:575, s1:680, s2:790, s3:870, s1p:18000, s2p:45000, s3p:105000 },
    },
  },

  // ──────────── VOLVO ────────────
  'Volvo': {
    'XC60 (U)': {
      'T5 2.0T (250 л.с.)':                    { stock:250, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
      'T6 AWD 2.0T (310 л.с.)':                { stock:310, s1:390, s2:455, s3:null, s1p:9500, s2p:20000, s3p:null },
      'T8 Plug-in Hybrid (390 л.с.)':          { stock:390, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'B6 AWD 2.0T (300 л.с.)':                { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'XC90 (SPA)': {
      'T5 FWD 2.0T (250 л.с.)':                { stock:250, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
      'T6 AWD 2.0T (310 л.с.)':                { stock:310, s1:390, s2:455, s3:null, s1p:9500, s2p:20000, s3p:null },
      'T8 Recharge 2.0T (310+87 л.с.)':        { stock:397, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'S60/V60/S90': {
      'T5 2.0T (250 л.с.)':                    { stock:250, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
      'T6 2.0T (300 л.с.)':                    { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
      'Polestar Engineered 2.0T (415 л.с.)':   { stock:415, s1:490, s2:565, s3:null, s1p:13000, s2p:29000, s3p:null },
    },
  },

  // ──────────── GENESIS ────────────
  'Genesis': {
    'GV80': {
      '2.5T 304 л.с.':                          { stock:304, s1:380, s2:445, s3:null, s1p:9000, s2p:19000, s3p:null },
      '3.5T 380 л.с.':                          { stock:380, s1:460, s2:535, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'GV70': {
      '2.5T 304 л.с.':                          { stock:304, s1:380, s2:445, s3:null, s1p:9000, s2p:19000, s3p:null },
      '3.5T 380 л.с.':                          { stock:380, s1:460, s2:535, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'G80': {
      '2.5T 304 л.с.':                          { stock:304, s1:380, s2:445, s3:null, s1p:9000, s2p:19000, s3p:null },
      '3.5T 380 л.с.':                          { stock:380, s1:460, s2:535, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'G70': {
      '2.0T 245 л.с.':                          { stock:245, s1:310, s2:375, s3:null, s1p:7500, s2p:15000, s3p:null },
      '3.3T Bi-Turbo 375 л.с.':                 { stock:375, s1:450, s2:525, s3:600, s1p:11000, s2p:26000, s3p:65000 },
    },
  },

  // ──────────── INFINITI ────────────
  'Infiniti': {
    'Q50 / Q60': {
      '2.0T (211 л.с.)':                        { stock:211, s1:275, s2:330, s3:null, s1p:7000, s2p:14000, s3p:null },
      '3.0T Red Sport 405 (405 л.с.)':          { stock:405, s1:490, s2:570, s3:640, s1p:13000, s2p:30000, s3p:70000 },
    },
    'QX55 / QX60': {
      '2.0T (268 л.с.)':                        { stock:268, s1:340, s2:405, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'QX80': {
      '5.6 V8 NA (405 л.с.)':                   { stock:405, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── BENTLEY ────────────
  'Bentley': {
    'Continental GT': {
      'V8 4.0T (550 л.с.)':                     { stock:550, s1:660, s2:760, s3:840, s1p:18000, s2p:45000, s3p:110000 },
      'W12 6.0T (635 л.с.)':                    { stock:635, s1:750, s2:855, s3:940, s1p:22000, s2p:58000, s3p:130000 },
      'Speed W12 (659 л.с.)':                   { stock:659, s1:780, s2:880, s3:null, s1p:24000, s2p:62000, s3p:null },
    },
    'Flying Spur': {
      'V8 4.0T (550 л.с.)':                     { stock:550, s1:660, s2:760, s3:840, s1p:18000, s2p:45000, s3p:110000 },
      'W12 6.0T (635 л.с.)':                    { stock:635, s1:750, s2:855, s3:940, s1p:22000, s2p:58000, s3p:130000 },
    },
    'Bentayga': {
      'V8 4.0T (550 л.с.)':                     { stock:550, s1:660, s2:760, s3:840, s1p:18000, s2p:45000, s3p:110000 },
      'W12 6.0T (608 л.с.)':                    { stock:608, s1:720, s2:820, s3:900, s1p:22000, s2p:58000, s3p:130000 },
    },
  },

  // ──────────── TOYOTA ────────────
  'Toyota': {
    'Supra (A90)': {
      'GR Supra 2.0T B48 (258 л.с.)':          { stock:258, s1:330, s2:390, s3:null, s1p:7000, s2p:14000, s3p:null },
      'GR Supra 3.0T B58 (387 л.с.)':          { stock:387, s1:470, s2:550, s3:620, s1p:11000, s2p:25000, s3p:60000 },
    },
    'GR Yaris / GR Corolla': {
      'GR Yaris 1.6T (G16E, 261 л.с.)':        { stock:261, s1:330, s2:400, s3:470, s1p:8000, s2p:18000, s3p:45000 },
      'GR Corolla 1.6T (G16E, 304 л.с.)':      { stock:304, s1:380, s2:455, s3:530, s1p:9500, s2p:21000, s3p:52000 },
    },
    'Camry (XV70/XV80)': {
      'Camry 2.0 (M20A, 150 л.с.)':            { stock:150, s1:190, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'Camry 2.5 (A25A, 181 л.с.)':            { stock:181, s1:220, s2:null, s3:null, s1p:6500, s2p:null, s3p:null },
      'Camry 3.5 V6 (2GR, 249 л.с.)':          { stock:249, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'RAV4 (XA50)': {
      'RAV4 2.0 (M20A, 149 л.с.)':             { stock:149, s1:190, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'RAV4 2.5 Hybrid (222 л.с.)':             { stock:222, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Land Cruiser (J300)': {
      'LC 300 3.3 V6 Diesel (309 л.с.)':       { stock:309, s1:380, s2:445, s3:null, s1p:10000, s2p:22000, s3p:null },
      'LC 300 3.5 V6 Petrol (415 л.с.)':       { stock:415, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── HYUNDAI ────────────
  'Hyundai': {
    'Tucson (NX4)': {
      'Tucson 1.6T (T-GDi, 150 л.с.)':         { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Tucson 2.5 (G4KL, 190 л.с.)':           { stock:190, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Tucson 1.6T Hybrid (230 л.с.)':          { stock:230, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Santa Fe (MX5)': {
      'Santa Fe 2.5T (G4KH, 281 л.с.)':        { stock:281, s1:355, s2:420, s3:null, s1p:8500, s2p:18000, s3p:null },
      'Santa Fe 2.5T Hybrid (240 л.с.)':        { stock:240, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Elantra N / i30 N': {
      'Elantra N 2.0T (280 л.с.)':              { stock:280, s1:350, s2:415, s3:null, s1p:8500, s2p:18000, s3p:null },
      'i30 N 2.0T (280 л.с.)':                  { stock:280, s1:350, s2:415, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
    'Genesis G70/G80/GV80': {
      'G70 2.0T (245 л.с.)':                    { stock:245, s1:310, s2:375, s3:null, s1p:7500, s2p:15000, s3p:null },
      'G70 3.3T (370 л.с.)':                    { stock:370, s1:450, s2:525, s3:600, s1p:11000, s2p:26000, s3p:65000 },
    },
  },

  // ──────────── KIA ────────────
  'Kia': {
    'Stinger (CK)': {
      'Stinger 2.0T (255 л.с.)':                { stock:255, s1:325, s2:390, s3:null, s1p:8000, s2p:17000, s3p:null },
      'Stinger GT 3.3T Bi-Turbo (370 л.с.)':   { stock:370, s1:455, s2:535, s3:610, s1p:11000, s2p:26000, s3p:65000 },
      'Stinger GT-S 3.3T (370 л.с.)':          { stock:370, s1:455, s2:535, s3:610, s1p:11000, s2p:26000, s3p:65000 },
    },
    'Sportage (NQ5)': {
      'Sportage 1.6T (180 л.с.)':               { stock:180, s1:230, s2:275, s3:null, s1p:6500, s2p:12500, s3p:null },
      'Sportage 2.5T GT-Line (281 л.с.)':       { stock:281, s1:355, s2:420, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
    'Sorento (MQ4)': {
      'Sorento 2.5T (281 л.с.)':                { stock:281, s1:355, s2:420, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
    'K5 (DL3)': {
      'K5 1.6T (180 л.с.)':                     { stock:180, s1:230, s2:275, s3:null, s1p:6500, s2p:12500, s3p:null },
      'K5 2.5T (290 л.с.)':                     { stock:290, s1:365, s2:430, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
  },

  // ──────────── NISSAN ────────────
  'Nissan': {
    'GT-R (R35)': {
      'GT-R Standard (570 л.с.)':               { stock:570, s1:680, s2:800, s3:900, s1p:20000, s2p:50000, s3p:115000 },
      'GT-R Track Edition (600 л.с.)':          { stock:600, s1:720, s2:840, s3:940, s1p:22000, s2p:55000, s3p:125000 },
      'GT-R NISMO (600 л.с.)':                  { stock:600, s1:720, s2:840, s3:950, s1p:22000, s2p:55000, s3p:130000 },
    },
    'Patrol (Y62)': {
      'Patrol 5.6 V8 (400 л.с.)':               { stock:400, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Qashqai (J11/J12)': {
      'Qashqai 1.2T 115 л.с. (2014–2017)':      { stock:115, s1:150, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      'Qashqai 1.6T 163 л.с. (2014–2021)':      { stock:163, s1:205, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'Qashqai 1.3T 140 л.с. (2019–2021)':      { stock:140, s1:175, s2:210, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Qashqai 1.3T 158 л.с. (2021+)':          { stock:158, s1:200, s2:240, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Qashqai 1.5T e-POWER 190 л.с. (2022+)':  { stock:190, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'X-Trail (T32/T33)': {
      'X-Trail 1.6T 163 л.с. (2014–2022)':      { stock:163, s1:205, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      'X-Trail 2.0T 144 л.с. (2014–2022)':      { stock:144, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'X-Trail 1.5T e-POWER 204 л.с. (2022+)':  { stock:204, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Murano (Z52)': {
      'Murano 3.5 V6 249 л.с. (2016+)':         { stock:249, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Juke (F15/F16)': {
      'Juke 1.6T 190 л.с. (2010–2019)':         { stock:190, s1:240, s2:280, s3:null, s1p:6500, s2p:12000, s3p:null },
      'Juke 1.0T 114 л.с. (2019+)':             { stock:114, s1:145, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
    },
  },

  // ──────────── SKODA ────────────
  'Skoda': {
    'Octavia (A8)': {
      'Octavia 1.0 TSI 110 л.с. (2020+)':       { stock:110, s1:140, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      'Octavia 1.5 TSI 150 л.с. (2017+)':       { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Octavia RS 2.0 TSI 245 л.с. (2017+)':    { stock:245, s1:315, s2:370, s3:null, s1p:8000, s2p:16500, s3p:null },
      'Octavia RS 245 TDI 200 л.с. (2017+)':    { stock:200, s1:255, s2:300, s3:null, s1p:7000, s2p:14000, s3p:null },
    },
    'Superb (B8)': {
      'Superb 1.5 TSI 150 л.с. (2015+)':        { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Superb 2.0 TSI 190 л.с. (2015+)':        { stock:190, s1:250, s2:295, s3:null, s1p:6500, s2p:13000, s3p:null },
      'Superb 2.0 TSI 280 л.с. (2015+)':        { stock:280, s1:355, s2:420, s3:null, s1p:8500, s2p:18000, s3p:null },
      'Superb 2.0 TDI 190 л.с. (2015+)':        { stock:190, s1:240, s2:285, s3:null, s1p:6500, s2p:13000, s3p:null },
    },
    'Kodiaq': {
      'Kodiaq 1.5 TSI 150 л.с. (2017+)':        { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Kodiaq 2.0 TSI 180 л.с. (2017+)':        { stock:180, s1:235, s2:280, s3:null, s1p:6500, s2p:12000, s3p:null },
      'Kodiaq RS 2.0 TSI 245 л.с. (2017+)':     { stock:245, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'Karoq': {
      'Karoq 1.5 TSI 150 л.с. (2017+)':         { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
    },
  },

  // ──────────── SEAT / CUPRA ────────────
  'SEAT / Cupra': {
    'Cupra Formentor': {
      'Formentor 1.5 TSI 150 л.с. (2020+)':     { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Formentor 2.0 TSI 190 л.с. (2020+)':     { stock:190, s1:250, s2:295, s3:null, s1p:6500, s2p:13000, s3p:null },
      'Formentor VZ 2.0 TSI 310 л.с. (2020+)':  { stock:310, s1:390, s2:460, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Cupra Ateca': {
      'Ateca 2.0 TSI 300 л.с. (2016+)':         { stock:300, s1:375, s2:445, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Leon Cupra': {
      'Leon Cupra 2.0 TSI 265 л.с. (2012–2020)': { stock:265, s1:330, s2:395, s3:null, s1p:8000, s2p:17000, s3p:null },
      'Leon Cupra R 2.0 TSI 310 л.с. (2017–2020)': { stock:310, s1:390, s2:460, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
  },

  // ──────────── OPEL / VAUXHALL ────────────
  'Opel': {
    'Insignia (B)': {
      'Insignia 1.5T 140 л.с. (2017+)':         { stock:140, s1:178, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      'Insignia 2.0T 200 л.с. (2017+)':         { stock:200, s1:260, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'Insignia GSi 2.0T 260 л.с. (2017+)':     { stock:260, s1:330, s2:395, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'Astra (K/L)': {
      'Astra 1.4T 150 л.с. (2015–2021)':        { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Astra OPC 2.0T 280 л.с. (2012–2019)':    { stock:280, s1:350, s2:415, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
  },

  // ──────────── FORD ────────────
  'Ford': {
    'Focus ST / RS': {
      'Focus ST 2.0T EcoBoost 250 л.с. (2012–2018)': { stock:250, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
      'Focus RS 2.3T EcoBoost 350 л.с. (2016–2018)': { stock:350, s1:430, s2:500, s3:570, s1p:11000, s2p:26000, s3p:60000 },
    },
    'Mustang': {
      'Mustang 2.3T EcoBoost 317 л.с. (2015+)': { stock:317, s1:400, s2:470, s3:null, s1p:9500, s2p:20000, s3p:null },
      'Mustang GT 5.0 V8 450 л.с. (2015+)':     { stock:450, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Mustang Mach 1 5.0 V8 460 л.с. (2021+)': { stock:460, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Explorer': {
      'Explorer 2.3T EcoBoost 300 л.с. (2019+)': { stock:300, s1:375, s2:440, s3:null, s1p:9000, s2p:19000, s3p:null },
    },
    'Edge': {
      'Edge 2.0T EcoBoost 245 л.с. (2015+)':    { stock:245, s1:310, s2:370, s3:null, s1p:7500, s2p:15000, s3p:null },
    },
  },

  // ──────────── ALFA ROMEO ────────────
  'Alfa Romeo': {
    'Giulia (952)': {
      'Giulia 2.0T 200 л.с. (2016+)':           { stock:200, s1:265, s2:315, s3:null, s1p:7000, s2p:14500, s3p:null },
      'Giulia 2.0T 280 л.с. (2016+)':           { stock:280, s1:355, s2:420, s3:null, s1p:9000, s2p:19000, s3p:null },
      'Giulia Quadrifoglio 2.9T 510 л.с. (2016+)': { stock:510, s1:610, s2:710, s3:790, s1p:16000, s2p:40000, s3p:95000 },
    },
    'Stelvio (949)': {
      'Stelvio 2.0T 200 л.с. (2017+)':          { stock:200, s1:265, s2:315, s3:null, s1p:7000, s2p:14500, s3p:null },
      'Stelvio 2.0T 280 л.с. (2017+)':          { stock:280, s1:355, s2:420, s3:null, s1p:9000, s2p:19000, s3p:null },
      'Stelvio Quadrifoglio 2.9T 510 л.с. (2017+)': { stock:510, s1:610, s2:710, s3:790, s1p:16000, s2p:40000, s3p:95000 },
    },
    '4C': {
      '4C 1.75T 240 л.с. (2013–2020)':          { stock:240, s1:305, s2:365, s3:null, s1p:9000, s2p:20000, s3p:null },
    },
  },

  // ──────────── MASERATI ────────────
  'Maserati': {
    'Ghibli (M157)': {
      'Ghibli S 3.0T 350 л.с. (2013+)':         { stock:350, s1:430, s2:505, s3:null, s1p:12000, s2p:28000, s3p:null },
      'Ghibli Trofeo 3.0T 580 л.с. (2021+)':    { stock:580, s1:680, s2:780, s3:null, s1p:18000, s2p:46000, s3p:null },
    },
    'Levante (M161)': {
      'Levante 3.0T 350 л.с. (2016+)':          { stock:350, s1:430, s2:505, s3:null, s1p:12000, s2p:28000, s3p:null },
      'Levante Trofeo 3.8T 580 л.с. (2019+)':   { stock:580, s1:680, s2:780, s3:null, s1p:18000, s2p:46000, s3p:null },
    },
    'Quattroporte': {
      'Quattroporte S 3.0T 430 л.с. (2013+)':   { stock:430, s1:520, s2:600, s3:null, s1p:14000, s2p:34000, s3p:null },
    },
  },

  // ──────────── LAMBORGHINI ────────────
  'Lamborghini': {
    'Urus (1S)': {
      'Urus 4.0T V8 650 л.с. (2018+)':          { stock:650, s1:780, s2:880, s3:null, s1p:24000, s2p:62000, s3p:null },
      'Urus S 4.0T V8 666 л.с. (2022+)':        { stock:666, s1:800, s2:900, s3:null, s1p:26000, s2p:65000, s3p:null },
      'Urus Performante 4.0T V8 666 л.с. (2022+)': { stock:666, s1:800, s2:905, s3:null, s1p:26000, s2p:65000, s3p:null },
    },
  },

  // ──────────── FERRARI ────────────
  'Ferrari': {
    'Roma': {
      'Roma 3.9T V8 620 л.с. (2020+)':          { stock:620, s1:730, s2:830, s3:null, s1p:28000, s2p:70000, s3p:null },
    },
    'GTC4Lusso': {
      'GTC4Lusso 6.3 V12 690 л.с. (2016–2020)': { stock:690, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'SF90 Stradale': {
      'SF90 Stradale Hybrid 1000 л.с. (2020+)': { stock:1000, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── MCLAREN ────────────
  'McLaren': {
    '720S / 750S': {
      '720S 4.0T V8 720 л.с. (2017+)':          { stock:720, s1:820, s2:920, s3:null, s1p:30000, s2p:72000, s3p:null },
      '750S 4.0T V8 750 л.с. (2023+)':          { stock:750, s1:850, s2:950, s3:null, s1p:32000, s2p:78000, s3p:null },
    },
    'GT': {
      'GT 4.0T V8 620 л.с. (2019+)':            { stock:620, s1:720, s2:820, s3:null, s1p:28000, s2p:70000, s3p:null },
    },
  },

  // ──────────── ASTON MARTIN ────────────
  'Aston Martin': {
    'DBX': {
      'DBX 4.0T V8 550 л.с. (2020+)':           { stock:550, s1:660, s2:760, s3:null, s1p:20000, s2p:52000, s3p:null },
      'DBX 707 4.0T V8 707 л.с. (2022+)':       { stock:707, s1:810, s2:900, s3:null, s1p:28000, s2p:68000, s3p:null },
    },
    'Vantage': {
      'Vantage 4.0T V8 510 л.с. (2018+)':       { stock:510, s1:620, s2:720, s3:null, s1p:18000, s2p:46000, s3p:null },
    },
    'DB11': {
      'DB11 4.0T V8 510 л.с. (2016+)':          { stock:510, s1:620, s2:720, s3:null, s1p:18000, s2p:46000, s3p:null },
      'DB11 V12 639 л.с. (2016+)':              { stock:639, s1:750, s2:850, s3:null, s1p:26000, s2p:65000, s3p:null },
    },
  },

  // ──────────── MINI ────────────
  'MINI': {
    'Cooper S / JCW (F55/F56)': {
      'Cooper S 2.0T 192 л.с. (2014+)':         { stock:192, s1:250, s2:300, s3:null, s1p:7000, s2p:14000, s3p:null },
      'JCW 2.0T 231 л.с. (2014+)':              { stock:231, s1:295, s2:355, s3:null, s1p:8000, s2p:16000, s3p:null },
      'JCW GP 2.0T 306 л.с. (2020+)':           { stock:306, s1:385, s2:450, s3:null, s1p:9500, s2p:20000, s3p:null },
    },
    'Countryman (F60)': {
      'Countryman Cooper S 2.0T 192 л.с.':      { stock:192, s1:250, s2:300, s3:null, s1p:7000, s2p:14000, s3p:null },
      'Countryman JCW 2.0T 231 л.с.':           { stock:231, s1:295, s2:355, s3:null, s1p:8000, s2p:16000, s3p:null },
    },
    'Paceman / Clubman': {
      'Clubman S 2.0T 192 л.с. (2015+)':        { stock:192, s1:250, s2:300, s3:null, s1p:7000, s2p:14000, s3p:null },
    },
  },

  // ──────────── SUBARU ────────────
  'Subaru': {
    'WRX / WRX STi': {
      'WRX 2.0T EJ255 268 л.с. (2014–2021)':    { stock:268, s1:340, s2:410, s3:480, s1p:9000, s2p:20000, s3p:50000 },
      'WRX STi 2.5T EJ257 300 л.с. (2007–2021)':{ stock:300, s1:380, s2:460, s3:540, s1p:10000, s2p:24000, s3p:58000 },
      'WRX 2.4T FA24 272 л.с. (2022+)':         { stock:272, s1:345, s2:415, s3:null, s1p:9000, s2p:20000, s3p:null },
    },
    'Forester (SK/SJ)': {
      'Forester 2.0T EJ205 165 л.с. (2012–2018)':{ stock:165, s1:210, s2:255, s3:null, s1p:6500, s2p:13000, s3p:null },
      'Forester XT 2.0T 250 л.с. (2013–2018)':  { stock:250, s1:315, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'Outback (BT)': {
      'Outback 2.5i 175 л.с. (2020+)':          { stock:175, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Outback 2.4T 265 л.с. (2020+)':          { stock:265, s1:335, s2:400, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'BRZ (ZD8)': {
      'BRZ 2.4 NA 234 л.с. (2022+)':            { stock:234, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── MITSUBISHI ────────────
  'Mitsubishi': {
    'Lancer Evolution X': {
      'Evo X 2.0T 295 л.с. (2008–2016)':        { stock:295, s1:380, s2:460, s3:540, s1p:10000, s2p:24000, s3p:58000 },
      'Evo X Final Edition 303 л.с. (2015)':     { stock:303, s1:390, s2:470, s3:550, s1p:10000, s2p:24000, s3p:60000 },
    },
    'Outlander (CW/GF)': {
      'Outlander 2.0T 203 л.с. (2012–2021)':    { stock:203, s1:260, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'Outlander 2.4T 227 л.с. (2012–2021)':    { stock:227, s1:285, s2:340, s3:null, s1p:7500, s2p:15500, s3p:null },
    },
    'Eclipse Cross': {
      'Eclipse Cross 1.5T 163 л.с. (2017+)':    { stock:163, s1:205, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
    },
    'ASX / RVR': {
      'ASX 1.6T 117 л.с. (2010–2023)':          { stock:117, s1:150, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
    },
  },

  // ──────────── SUZUKI ────────────
  'Suzuki': {
    'Swift Sport (AZ)': {
      'Swift Sport 1.4T BoosterJet 140 л.с. (2017+)': { stock:140, s1:175, s2:215, s3:null, s1p:6000, s2p:11500, s3p:null },
    },
    'Vitara (LY)': {
      'Vitara 1.4T BoosterJet 140 л.с. (2018+)': { stock:140, s1:175, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
    },
    'S-Cross': {
      'S-Cross 1.4T BoosterJet 140 л.с. (2021+)': { stock:140, s1:175, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
    },
  },

  // ──────────── MAZDA ────────────
  'Mazda': {
    'CX-5 (KF)': {
      'CX-5 2.5T 231 л.с. (2017+)':             { stock:231, s1:290, s2:345, s3:null, s1p:7500, s2p:15000, s3p:null },
      'CX-5 2.2 SkyActiv-D 184 л.с. (2017+)':   { stock:184, s1:235, s2:280, s3:null, s1p:7000, s2p:14000, s3p:null },
    },
    'Mazda3 / Mazda6': {
      'Mazda3 Fastback 2.5T 265 л.с. (2019+)':  { stock:265, s1:335, s2:400, s3:null, s1p:8000, s2p:17000, s3p:null },
      'Mazda6 2.5T 231 л.с. (2017+)':           { stock:231, s1:290, s2:345, s3:null, s1p:7500, s2p:15000, s3p:null },
    },
    'MX-5 Miata (ND)': {
      'MX-5 1.5 SkyActiv-G 131 л.с. (2015+)':  { stock:131, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'MX-5 2.0 SkyActiv-G 184 л.с. (2015+)':  { stock:184, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'CX-9': {
      'CX-9 2.5T 250 л.с. (2016+)':             { stock:250, s1:315, s2:375, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
  },

  // ──────────── JEEP ────────────
  'Jeep': {
    'Grand Cherokee (WL)': {
      'Grand Cherokee 2.0T 272 л.с. (2021+)':   { stock:272, s1:345, s2:415, s3:null, s1p:8500, s2p:18000, s3p:null },
      'Grand Cherokee 3.6 V6 293 л.с. (2021+)': { stock:293, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Trackhawk 6.2 V8 707 л.с. (2018–2021)':  { stock:707, s1:810, s2:910, s3:null, s1p:28000, s2p:70000, s3p:null },
    },
    'Wrangler (JL)': {
      'Wrangler 2.0T 272 л.с. (2018+)':         { stock:272, s1:345, s2:415, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
    'Renegade / Compass': {
      'Renegade 1.3T 150 л.с. (2018+)':         { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Renegade 1.3T 180 л.с. (2018+)':         { stock:180, s1:235, s2:280, s3:null, s1p:6500, s2p:12000, s3p:null },
    },
  },

  // ──────────── CHEVROLET / CADILLAC ────────────
  'Chevrolet / Cadillac': {
    'Camaro': {
      'Camaro 2.0T LTG 275 л.с. (2016+)':       { stock:275, s1:350, s2:420, s3:null, s1p:9000, s2p:19000, s3p:null },
      'Camaro SS 6.2 V8 455 л.с. (2016+)':      { stock:455, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Camaro ZL1 6.2 SC V8 650 л.с. (2016+)':  { stock:650, s1:750, s2:850, s3:null, s1p:22000, s2p:55000, s3p:null },
    },
    'Corvette': {
      'Corvette C8 6.2 V8 495 л.с. (2020+)':    { stock:495, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'CT4 / CT5': {
      'CT4-V Blackwing 3.6T 472 л.с. (2022+)':  { stock:472, s1:560, s2:650, s3:null, s1p:15000, s2p:38000, s3p:null },
      'CT5-V Blackwing 6.2 SC V8 668 л.с.':     { stock:668, s1:780, s2:880, s3:null, s1p:25000, s2p:62000, s3p:null },
    },
  },

  // ──────────── VOLGA / ЛАДА / HAVAL ────────────
  'Lada / Haval / Chery': {
    'Lada Vesta Sport': {
      'Vesta Sport 1.8 122 л.с. (2018+)':       { stock:122, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Haval F7 / H6 / Jolion': {
      'Haval F7 1.5T 150 л.с. (2019+)':         { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      'Haval F7x 2.0T 197 л.с. (2019+)':        { stock:197, s1:255, s2:305, s3:null, s1p:7000, s2p:14000, s3p:null },
      'Haval H9 2.0T 218 л.с. (2017+)':         { stock:218, s1:275, s2:330, s3:null, s1p:7500, s2p:15000, s3p:null },
    },
    'Chery Tiggo': {
      'Tiggo 7 Pro 1.5T 147 л.с. (2021+)':      { stock:147, s1:185, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      'Tiggo 8 Pro 2.0T 197 л.с. (2021+)':      { stock:197, s1:255, s2:305, s3:null, s1p:7000, s2p:14000, s3p:null },
    },
  },

  // ──────────── PEUGEOT / CITROEN / DS ────────────
  'Peugeot / Citroën / DS': {
    'Peugeot 308 / 508': {
      '308 GTi 270 2.0T 270 л.с. (2015–2021)':  { stock:270, s1:340, s2:405, s3:null, s1p:8500, s2p:18000, s3p:null },
      '508 PSE 1.6T 360 л.с. (2021+)':          { stock:360, s1:445, s2:520, s3:null, s1p:11000, s2p:25000, s3p:null },
    },
    'DS 3/4/7 (Crossback)': {
      'DS 7 Performance Line 1.6T 225 л.с.':    { stock:225, s1:285, s2:340, s3:null, s1p:7500, s2p:15500, s3p:null },
    },
  },

  // ──────────── RENAULT ────────────
  'Renault': {
    'Megane RS': {
      'Megane RS 280 1.8T 280 л.с. (2017+)':    { stock:280, s1:355, s2:420, s3:null, s1p:9000, s2p:19000, s3p:null },
      'Megane RS Trophy 300 1.8T 300 л.с.':      { stock:300, s1:375, s2:445, s3:null, s1p:9500, s2p:20000, s3p:null },
      'Megane RS Trophy R 300 л.с. (2019)':      { stock:300, s1:375, s2:445, s3:null, s1p:9500, s2p:20000, s3p:null },
    },
    'Arkana': {
      'Arkana 1.3T 150 л.с. (2019+)':           { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
    },
    'Duster': {
      'Duster 1.3T 150 л.с. (2020+)':           { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
    },
  },

  // ──────────── HONDA ────────────
  'Honda': {
    'Civic Type R (FK8/FL5)': {
      'Civic Type R 2.0T K20C1 310 л.с. (2017–2021)': { stock:310, s1:390, s2:465, s3:540, s1p:10000, s2p:23000, s3p:55000 },
      'Civic Type R 2.0T K20C1 330 л.с. (2023+)': { stock:330, s1:415, s2:495, s3:570, s1p:11000, s2p:25000, s3p:60000 },
    },
    'CR-V (RW/RZ)': {
      'CR-V 1.5T 190 л.с. (2017+)':             { stock:190, s1:245, s2:295, s3:null, s1p:6500, s2p:13000, s3p:null },
      'CR-V 2.0 Hybrid 184 л.с. (2018+)':       { stock:184, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Accord (CV)': {
      'Accord 2.0T Sport 252 л.с. (2018+)':     { stock:252, s1:320, s2:380, s3:null, s1p:8000, s2p:17000, s3p:null },
    },
    'HR-V': {
      'HR-V 1.5T 182 л.с. (2021+)':             { stock:182, s1:230, s2:275, s3:null, s1p:6500, s2p:13000, s3p:null },
    },
  },

  // ──────────── TESLA (ограниченный тюнинг) ────────────
  'Tesla': {
    'Model 3 / Model Y': {
      'Model 3 RWD 283 л.с. (2020+)':           { stock:283, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Model 3 Performance 487 л.с. (2019+)':   { stock:487, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'Model Y Performance 534 л.с. (2021+)':   { stock:534, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'Model S / Model X': {
      'Model S Plaid 1020 л.с. (2021+)':        { stock:1020, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
  },

  // ──────────── BMW E-серия (старые кузова) ────────────
  'BMW (E-кузова)': {
    'E90/E91/E92/E93 3-я серия': {
      '320i 2.0 (N46B20/N52, 150–170 л.с.) 2005–2013':  { stock:170, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      '325i 2.5 (N52, 218 л.с.) 2005–2013':             { stock:218, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      '325d 3.0 (M57, 197 л.с.) 2005–2013':             { stock:197, s1:245, s2:295, s3:null, s1p:7000, s2p:14000, s3p:null },
      '330i 3.0 (N53/N52, 272 л.с.) 2005–2013':         { stock:272, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      '330d 3.0 (M57N2, 231 л.с.) 2005–2013':           { stock:231, s1:290, s2:345, s3:null, s1p:7500, s2p:15500, s3p:null },
      '335i 3.0T (N54/N55, 306 л.с.) 2007–2013':        { stock:306, s1:380, s2:450, s3:520, s1p:9000, s2p:20000, s3p:50000 },
      '335d 3.0 (M57TU2, 286 л.с.) 2007–2013':          { stock:286, s1:360, s2:430, s3:null, s1p:8500, s2p:18000, s3p:null },
      'M3 4.0 V8 (S65, 420 л.с.) 2008–2013':            { stock:420, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'E60/E61 5-я серия': {
      '520d 2.0 (M47N2, 163 л.с.) 2003–2010':           { stock:163, s1:205, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      '525d 2.5 (M57N, 197 л.с.) 2003–2010':            { stock:197, s1:245, s2:295, s3:null, s1p:7000, s2p:14000, s3p:null },
      '530d 3.0 (M57N2, 231 л.с.) 2003–2010':           { stock:231, s1:290, s2:345, s3:null, s1p:7500, s2p:15500, s3p:null },
      '535d 3.0 (M57TU2, 272 л.с.) 2004–2010':          { stock:272, s1:340, s2:405, s3:null, s1p:8500, s2p:18000, s3p:null },
      '535i 3.0T (N54, 306 л.с.) 2007–2010':            { stock:306, s1:380, s2:450, s3:520, s1p:9000, s2p:20000, s3p:50000 },
      'M5 5.0 V10 (S85, 507 л.с.) 2005–2010':           { stock:507, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
    },
    'F-серия 1/2/3/4': {
      '114d/116d 1.5/2.0 (N47, 95–116 л.с.) 2011–2019': { stock:116, s1:150, s2:null, s3:null, s1p:5500, s2p:null, s3p:null },
      '118d 2.0 (N47, 143 л.с.) 2011–2019':             { stock:143, s1:180, s2:null, s3:null, s1p:6000, s2p:null, s3p:null },
      '120d 2.0 (N47, 184 л.с.) 2011–2019':             { stock:184, s1:230, s2:275, s3:null, s1p:6500, s2p:13000, s3p:null },
      '318d 2.0 (B47, 150 л.с.) 2015–2019':             { stock:150, s1:190, s2:230, s3:null, s1p:6000, s2p:11000, s3p:null },
      '320d 2.0 (N47/B47, 163–190 л.с.) 2012–2019':     { stock:190, s1:240, s2:290, s3:null, s1p:6500, s2p:13000, s3p:null },
      '325d 3.0 (N57, 218 л.с.) 2012–2015':             { stock:218, s1:275, s2:330, s3:null, s1p:7500, s2p:15500, s3p:null },
      '330d 3.0 (N57, 258 л.с.) 2012–2019':             { stock:258, s1:325, s2:390, s3:null, s1p:8000, s2p:17000, s3p:null },
      '335d 3.0 (N57, 313 л.с.) 2012–2019':             { stock:313, s1:390, s2:460, s3:null, s1p:9500, s2p:20000, s3p:null },
      '320i 2.0T (N20, 184 л.с.) 2011–2019':            { stock:184, s1:250, s2:310, s3:null, s1p:6500, s2p:12000, s3p:null },
      '328i/328xi 2.0T (N20, 245 л.с.) 2012–2016':      { stock:245, s1:310, s2:375, s3:null, s1p:7000, s2p:14000, s3p:null },
      '335i/335xi 3.0T (N55, 306 л.с.) 2012–2015':      { stock:306, s1:380, s2:450, s3:520, s1p:9000, s2p:20000, s3p:50000 },
      '340i 3.0T (B58, 326 л.с.) 2016–2019':            { stock:326, s1:400, s2:470, s3:null, s1p:9500, s2p:20000, s3p:null },
    },
  },

  // ──────────── MERCEDES (W204/W212) ────────────
  'Mercedes (W204/W212)': {
    'C-класс W204': {
      'C180/C200 1.8T (M271, 156–184 л.с.) 2007–2014':  { stock:184, s1:235, s2:280, s3:null, s1p:6500, s2p:13000, s3p:null },
      'C250 1.8T (M271EVO, 204 л.с.) 2011–2014':         { stock:204, s1:265, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'C300 3.0 V6 (M272, 231 л.с.) 2007–2014':          { stock:231, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'C350 3.5 V6 (M276, 306 л.с.) 2007–2014':          { stock:306, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'C63 AMG 6.2 V8 (M156, 457 л.с.) 2007–2014':       { stock:457, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'C220 CDI 2.1 (OM651, 170 л.с.) 2007–2014':        { stock:170, s1:215, s2:260, s3:null, s1p:6500, s2p:13000, s3p:null },
      'C250 CDI 2.1 (OM651, 204 л.с.) 2007–2014':        { stock:204, s1:255, s2:305, s3:null, s1p:7000, s2p:14000, s3p:null },
    },
    'E-класс W212': {
      'E200/E250 1.8T (M271EVO, 184–204 л.с.) 2009–2016': { stock:204, s1:265, s2:310, s3:null, s1p:7000, s2p:14000, s3p:null },
      'E350 3.5 V6 (M276, 306 л.с.) 2009–2016':           { stock:306, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'E400 3.0T (M276, 333 л.с.) 2013–2016':             { stock:333, s1:400, s2:470, s3:null, s1p:10000, s2p:22000, s3p:null },
      'E500 5.5 V8 (M273, 388 л.с.) 2009–2013':           { stock:388, s1:null, s2:null, s3:null, s1p:null, s2p:null, s3p:null },
      'E220 CDI 2.1 (OM651, 170 л.с.) 2009–2016':         { stock:170, s1:215, s2:260, s3:null, s1p:6500, s2p:13000, s3p:null },
      'E250 CDI 2.1 (OM651, 204 л.с.) 2009–2016':         { stock:204, s1:255, s2:305, s3:null, s1p:7000, s2p:14000, s3p:null },
      'E350 CDI 3.0 (OM642, 265 л.с.) 2009–2016':         { stock:265, s1:330, s2:395, s3:null, s1p:8500, s2p:18000, s3p:null },
    },
  },
};

/* ═══════════════════════════════════════════════════════════
   TUNING CALCULATOR FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

function initTuningCalc() {
  var brandSel   = document.getElementById('calc-brand');
  var modelSel   = document.getElementById('calc-model');
  var engineSel  = document.getElementById('calc-engine');
  var result     = document.getElementById('calc-result');

  if (!brandSel) return;

  // Fill brands
  Object.keys(tuningData).sort().forEach(function(brand) {
    var opt = document.createElement('option');
    opt.value = brand; opt.textContent = brand;
    brandSel.appendChild(opt);
  });

  var resetResult = function() {
    if (result) result.className = 'calc-result';
  };

  brandSel.addEventListener('change', function() {
    var brand = brandSel.value;
    modelSel.innerHTML = '<option value="">— Выберите модель —</option>';
    engineSel.innerHTML = '<option value="">— Выберите двигатель —</option>';
    resetResult();
    if (brand && tuningData[brand]) {
      Object.keys(tuningData[brand]).forEach(function(model) {
        var opt = document.createElement('option');
        opt.value = model; opt.textContent = model;
        modelSel.appendChild(opt);
      });
    }
  });

  modelSel.addEventListener('change', function() {
    var brand  = brandSel.value;
    var model  = modelSel.value;
    engineSel.innerHTML = '<option value="">— Выберите двигатель —</option>';
    resetResult();
    if (brand && model && tuningData[brand] && tuningData[brand][model]) {
      Object.keys(tuningData[brand][model]).forEach(function(engine) {
        var opt = document.createElement('option');
        opt.value = engine; opt.textContent = engine;
        engineSel.appendChild(opt);
      });
    }
  });

  engineSel.addEventListener('change', function() {
    var brand  = brandSel.value;
    var model  = modelSel.value;
    var engine = engineSel.value;
    if (!brand || !model || !engine || !result) return;

    var d = tuningData[brand] && tuningData[brand][model] && tuningData[brand][model][engine];
    if (!d) return;

    var fmt = function(n) { return n ? n.toLocaleString('ru-RU') : '—'; };

    // Stock
    var stockEl = document.getElementById('r-stock');
    if (stockEl) stockEl.textContent = fmt(d.stock) + ' л.с.';

    // Stage 1
    var s1a = document.getElementById('r-s1-after');
    var s1d = document.getElementById('r-s1-delta');
    var s1p = document.getElementById('r-s1-price');
    var s1c = document.getElementById('r-s1-card');
    if (d.s1) {
      if (s1a) s1a.textContent = fmt(d.s1) + ' л.с.';
      if (s1d) s1d.textContent = '+' + (d.s1 - d.stock) + ' л.с.';
      if (s1p) s1p.textContent = 'от ' + fmt(d.s1p) + ' ₽';
      if (s1c) s1c.style.display = '';
    } else {
      if (s1c) s1c.style.display = 'none';
    }

    // Stage 2
    var s2a = document.getElementById('r-s2-after');
    var s2d = document.getElementById('r-s2-delta');
    var s2p = document.getElementById('r-s2-price');
    var s2c = document.getElementById('r-s2-card');
    if (d.s2) {
      if (s2a) s2a.textContent = fmt(d.s2) + ' л.с.';
      if (s2d) s2d.textContent = '+' + (d.s2 - d.stock) + ' л.с.';
      if (s2p) s2p.textContent = 'от ' + fmt(d.s2p) + ' ₽';
      if (s2c) s2c.style.display = '';
    } else {
      if (s2c) s2c.style.display = 'none';
    }

    // Stage 3
    var s3c = document.getElementById('r-s3-card');
    if (s3c) {
      if (d.s3) {
        s3c.style.display = '';
        var s3a = document.getElementById('r-s3-after');
        var s3d = document.getElementById('r-s3-delta');
        var s3p = document.getElementById('r-s3-price');
        if (s3a) s3a.textContent = fmt(d.s3) + ' л.с.';
        if (s3d) s3d.textContent = '+' + (d.s3 - d.stock) + ' л.с.';
        if (s3p) s3p.textContent = 'от ' + fmt(d.s3p) + ' ₽';
      } else {
        s3c.style.display = 'none';
      }
    }

    // NA or hybrid note
    var naNote = document.getElementById('r-na-note');
    if (!d.s1 && !d.s2 && !d.s3) {
      if (naNote) { naNote.style.display = ''; }
    } else {
      if (naNote) { naNote.style.display = 'none'; }
    }

    result.className = 'calc-result visible';
    setTimeout(function() { result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  });
}

// ─── Init on DOMContentLoaded ───
document.addEventListener('DOMContentLoaded', function() {
  initTuningCalc();
});
