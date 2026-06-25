import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'viswam_school_secure_jwt_secret_2026';

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 upload limit

// PostgreSQL Connection Pool config
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to Neon PostgreSQL database:', err.message);
  } else {
    console.log('Successfully connected to Neon PostgreSQL database at:', res.rows[0].now);
  }
});

// Middleware to verify JWT Token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired session token.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing session token.' });
  }
};

// Database Initialization & Seeding
async function initializeDatabase() {
  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        email TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS school_data (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        credentials TEXT,
        bio TEXT,
        image TEXT,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        src TEXT NOT NULL,
        title TEXT,
        desc TEXT
      );

      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        desc TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS disclosures (
        id TEXT PRIMARY KEY,
        tab TEXT NOT NULL,
        label TEXT NOT NULL,
        value TEXT,
        file_src TEXT,
        file_name TEXT
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS hero_slides (
        id TEXT PRIMARY KEY,
        image TEXT NOT NULL,
        title TEXT NOT NULL
      );
    `);

    console.log('Database tables successfully initialized.');

    // 2. Seed Admin User
    const adminCheck = await pool.query('SELECT * FROM admin_settings LIMIT 1');
    if (adminCheck.rows.length === 0) {
      const defaultHash = bcrypt.hashSync('viswam@2013', 10);
      await pool.query(
        'INSERT INTO admin_settings (email, password_hash) VALUES ($1, $2)',
        ['viswamschool2013@gmail.com', defaultHash]
      );
      console.log('Default administrator credentials seeded successfully.');
    }

    // 3. Seed School Settings
    const dataCheck = await pool.query('SELECT * FROM school_data LIMIT 1');
    if (dataCheck.rows.length === 0) {
      const defaults = {
        heroTitle: 'Welcome to Viswam English Medium High School',
        heroDesc: 'Since 2013, Viswam English Medium High School has stood as a trusted name in quality education. We bring together the best of South Indian values and world-class learning methods to prepare students for the challenges of tomorrow.',
        heroBullet1: 'Personalized learning with smart and adaptive education technology',
        heroBullet2: 'Balanced growth through academics, sports, fine arts, and moral values',
        heroBullet3: 'Global outlook with strong cultural roots and community spirit',
        aboutTitle: 'A Legacy of Excellence Since 2013',
        aboutContent: 'Viswam School was founded in 2013 with a vision to provide holistic education that blends Indian cultural values with global educational standards. What started as a small institution with just 75 students has now grown into one of the most prestigious educational institutions in the region.\n\nOur journey has been marked by continuous innovation, academic excellence, and a commitment to nurturing well-rounded individuals who can thrive in an ever-changing world.',
        contactAddress: 'Allipuram, Nellore, Andhra Pradesh, India - 524002',
        contactPhone: '+91 8885677877 / 8885677977',
        contactEmail: 'viswamschool2013@gmail.com',
        principalName: 'Maddela Neeraja',
        principalCredentials: 'M.Sc B.Ed',
        principalBio: 'Leading our school family with a dedication to bringing out the absolute best in South Indian moral values and world-class educational techniques for every child.',
        careersDesc: 'We are always looking for passionate, experienced, and dedicated teaching professionals to join the Viswam High School family.',
        careersOpenings: 'Trained Graduate Teachers (TGT) - Science & Mathematics\nPost Graduate Teachers (PGT) - English & Social Sciences\nPrimary Teachers (PRT) & Kindergarten Instructors',
        careersNote: 'Please send your updated resume, academic credentials, and cover letter directly to our official administrative email address: viswamschool2013@gmail.com. Our administrative reviewing desk will evaluate submissions and contact shortlisted candidates for interviews shortly.',
        showAdmissionsAlert: 'true',
        admissionsAlertText: 'Admissions 2025 - 2026'
      };

      for (const [key, value] of Object.entries(defaults)) {
        await pool.query('INSERT INTO school_data (key, value) VALUES ($1, $2)', [key, value]);
      }
      console.log('Default school settings seeded.');
    }

    // 4. Seed Staff
    const staffCheck = await pool.query('SELECT * FROM staff LIMIT 1');
    if (staffCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO staff (id, name, role, credentials, bio, image, email) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        's1', 
        'Maddela Neeraja', 
        'Principal', 
        'M.Sc B.Ed', 
        'Leading our school family with a dedication to bringing out the absolute best in South Indian moral values and world-class educational techniques for every child.',
        '/principal.png',
        'viswamschool2013@gmail.com'
      ]);
      console.log('Default leadership profiles seeded.');
    }

    // 5. Seed Hero Slides
    const slidesCheck = await pool.query('SELECT * FROM hero_slides LIMIT 1');
    if (slidesCheck.rows.length === 0) {
      const slides = [
        { id: 'hs1', image: '/school_building.png', title: 'Main Campus Building' },
        { id: 'hs2', image: '/farewell_banner.jpg', title: 'Farewell Day Celebrations' },
        { id: 'hs3', image: '/fire_ceremony.png', title: 'Traditional Festivities' },
        { id: 'hs4', image: '/palm_leaves.jpg', title: 'Students Cultural Activities' }
      ];
      for (const s of slides) {
        await pool.query('INSERT INTO hero_slides (id, image, title) VALUES ($1, $2, $3)', [s.id, s.image, s.title]);
      }
      console.log('Default hero slideshow seeded.');
    }

    // 6. Seed Gallery
    const galleryCheck = await pool.query('SELECT * FROM gallery LIMIT 1');
    if (galleryCheck.rows.length === 0) {
      const items = [
        { id: 'g1', src: '/school_building.png', title: 'School Campus Building', desc: 'The modern multi-story primary and secondary school campus facility.' },
        { id: 'g2', src: '/farewell_banner.jpg', title: 'Farewell Day Celebrations', desc: 'Annual farewell events and leadership speeches in the school hall.' },
        { id: 'g3', src: '/fire_ceremony.png', title: 'Traditional Cultural Festival', desc: 'Celebrating South Indian cultural roots with community events.' },
        { id: 'g4', src: '/palm_leaves.jpg', title: 'Bonfire Day Activities', desc: 'Students preparing leaves for the annual winter bonfire ceremony.' }
      ];
      for (const g of items) {
        await pool.query('INSERT INTO gallery (id, src, title, desc) VALUES ($1, $2, $3, $4)', [g.id, g.src, g.title, g.desc]);
      }
      console.log('Default photo gallery seeded.');
    }

    // 7. Seed News
    const newsCheck = await pool.query('SELECT * FROM news LIMIT 1');
    if (newsCheck.rows.length === 0) {
      const list = [
        { id: 'n1', date: 'June 20, 2026', title: 'Admissions Open for Academic Year 2026-27', desc: 'Admissions are officially open from Nursery to Grade X. Parents and guardians can collect registration forms from the administrative desk between 9:00 AM and 4:00 PM.' },
        { id: 'n2', date: 'April 15, 2026', title: 'Farewell Day Celebrations Conducted', desc: 'We successfully conducted the Farewell Day celebrations for our graduating Grade X batch. Students gave memorable presentations, followed by principal awards and speeches.' },
        { id: 'n3', date: 'January 10, 2026', title: 'Annual winter Bonfire Ceremony', desc: 'Viswam School celebrated the harvest festival season with students assembling palm leaves for the traditional bonfire, alongside singing and cultural activities.' }
      ];
      for (const n of list) {
        await pool.query('INSERT INTO news (id, date, title, desc) VALUES ($1, $2, $3, $4)', [n.id, n.date, n.title, n.desc]);
      }
      console.log('Default news announcements seeded.');
    }

    // 8. Seed Disclosures
    const disclosuresCheck = await pool.query('SELECT * FROM disclosures LIMIT 1');
    if (disclosuresCheck.rows.length === 0) {
      // General Info
      const general = [
        { id: 'gen1', tab: 'general', label: 'NAME OF THE SCHOOL', value: 'Viswam English Medium High School' },
        { id: 'gen2', tab: 'general', label: 'AFFILIATION NO. (IF APPLICABLE)', value: 'N/A' },
        { id: 'gen3', tab: 'general', label: 'SCHOOL CODE (IF APPLICABLE)', value: 'N/A' },
        { id: 'gen4', tab: 'general', label: 'COMPLETE ADDRESS WITH PIN CODE', value: 'Viswam English Medium High School, Allipuram, Nellore, Andhra Pradesh, India - 524002' },
        { id: 'gen5', tab: 'general', label: 'PRINCIPAL NAME', value: 'Maddela Neeraja' },
        { id: 'gen6', tab: 'general', label: 'PRINCIPAL QUALIFICATION', value: 'M.Sc B.Ed' },
        { id: 'gen7', tab: 'general', label: 'SCHOOL EMAIL ID', value: 'viswamschool2013@gmail.com' },
        { id: 'gen8', tab: 'general', label: 'CONTACT DETAILS (LANDLINE/MOBILE)', value: '8885677877 / 8885677977' }
      ];

      // Documents
      const documents = [
        { id: 'doc1', tab: 'documents', label: 'COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY', value: '', file_src: null, file_name: 'NA' },
        { id: 'doc2', tab: 'documents', label: 'COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE', value: '', file_src: '#', file_name: 'Society RC Copy' },
        { id: 'doc3', tab: 'documents', label: 'COPY OF THE NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT', value: '', file_src: '#', file_name: 'NOC Document' },
        { id: 'doc4', tab: 'documents', label: 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND ITS RENEWAL IF APPLICABLE', value: '', file_src: '#', file_name: 'State RC File' },
        { id: 'doc5', tab: 'documents', label: 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER NATIONAL BUILDING CODE', value: '', file_src: '#', file_name: 'Building Safety Certificate' },
        { id: 'doc6', tab: 'documents', label: 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPTENT AUTHORITY', value: '', file_src: '#', file_name: 'Fire Certificate' },
        { id: 'doc7', tab: 'documents', label: 'COPY OF SELF CERTIFICATION FOR AFFILIATION', value: '', file_src: '#', file_name: 'Self Certification File' },
        { id: 'doc8', tab: 'documents', label: 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', value: '', file_src: '#', file_name: 'Sanitary Certificate | Water Test Report' },
        { id: 'doc9', tab: 'documents', label: 'COPY OF LAND CERTIFICATE', value: '', file_src: '#', file_name: 'Land Certificate' }
      ];

      // Academics
      const academics = [
        { id: 'acad1', tab: 'academics', label: 'FEE STRUCTURE OF THE SCHOOL', value: '', file_src: '#', file_name: 'Fee Structure Schedule' },
        { id: 'acad2', tab: 'academics', label: 'ANNUAL ACADEMIC CALENDAR', value: '', file_src: null, file_name: '-' },
        { id: 'acad3', tab: 'academics', label: 'LIST OF THE SCHOOL MANAGEMENT COMMITTEE (SMC)', value: '', file_src: '#', file_name: 'Grievance Redressal Committee' },
        { id: 'acad4', tab: 'academics', label: 'LIST OF THE PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS', value: '', file_src: null, file_name: '-' },
        { id: 'acad5', tab: 'academics', label: 'LAST THREE-YEAR RESULT OF BOARD EXAMINATION', value: '', file_src: null, file_name: 'NA' }
      ];

      // Staff Strength details
      const staff = [
        { id: 'stf1', tab: 'staff', label: 'PRINCIPAL', value: '1' },
        { id: 'stf2', tab: 'staff', label: 'TOTAL NO. OF TEACHERS', value: '31' },
        { id: 'stf3', tab: 'staff', label: 'PGT (Post Graduate Teachers)', value: '15' },
        { id: 'stf4', tab: 'staff', label: 'TGT (Trained Graduate Teachers)', value: '16' },
        { id: 'stf5', tab: 'staff', label: 'PRT (Primary Teachers)', value: 'N/A' },
        { id: 'stf6', tab: 'staff', label: 'TEACHERS SECTION RATIO', value: 'N/A' },
        { id: 'stf7', tab: 'staff', label: 'DETAILS OF SPECIAL EDUCATOR', value: 'N/A' },
        { id: 'stf8', tab: 'staff', label: 'DETAILS OF COUNSELLOR AND WELLNESS TEACHER', value: '1' },
        { id: 'stf9', tab: 'staff', label: 'STRENGTH PARTICULARS', value: 'View Details', file_src: '#', file_name: 'Strength Particulars' }
      ];

      // Infrastructure
      const infra = [
        { id: 'inf1', tab: 'infrastructure', label: 'INFRASTRUCTURE DETAILS', value: 'View Details', file_src: '#', file_name: 'Infrastructure Details' },
        { id: 'inf2', tab: 'infrastructure', label: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR.)', value: '3500' },
        { id: 'inf3', tab: 'infrastructure', label: 'NUMBER AND SIZE OF CLASS ROOMS (IN SQUARE MTR.)', value: '25 Classrooms (50 sq m)' },
        { id: 'inf4', tab: 'infrastructure', label: 'NUMBER OF LARGE LABS INCLUDING COMPUTER LABS (IN SQUARE MTR.)', value: '3 Labs (80 sq m)' },
        { id: 'inf5', tab: 'infrastructure', label: 'INTERNET FACILITY (Y/N)', value: 'Yes' },
        { id: 'inf6', tab: 'infrastructure', label: 'NUMBER OF GIRL\'S TOILETS', value: '10' },
        { id: 'inf7', tab: 'infrastructure', label: 'NUMBER OF BOY\'S TOILETS', value: '10' },
        { id: 'inf8', tab: 'infrastructure', label: 'LIBRARY BOOKS', value: 'View Details', file_src: '#', file_name: 'Library Book list' },
        { id: 'inf9', tab: 'infrastructure', label: 'CBSE INSPECTION VIDEO', value: 'Watch on YouTube', file_src: 'https://youtube.com', file_name: 'Inspection Video Link' }
      ];

      // Committees
      const comms = [
        { id: 'com1', tab: 'committees', label: 'GRIEVANCE REDRESSAL COMMITTEE', value: 'View Details', file_src: '#', file_name: 'Grievance Committee List' },
        { id: 'com2', tab: 'committees', label: 'ANTI-HARASSMENT COMMITTEE', value: 'View Details', file_src: '#', file_name: 'Anti-Harassment Committee Details' },
        { id: 'com3', tab: 'committees', label: 'POCSO COMMITTEE', value: 'View Details', file_src: '#', file_name: 'POCSO Committee Log' }
      ];

      const allDisclosures = [...general, ...documents, ...academics, ...staff, ...infra, ...comms];
      for (const d of allDisclosures) {
        await pool.query(`
          INSERT INTO disclosures (id, tab, label, value, file_src, file_name) 
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [d.id, d.tab, d.label, d.value || '', d.file_src || '', d.file_name || '']);
      }
      console.log('Default CBSE disclosures table seeded.');
    }

  } catch (error) {
    console.error('Error during database seeding:', error.message);
  }
}

// Run DB init
initializeDatabase();

// ----------------- API ROUTES -----------------

// 1. Owner Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  try {
    const result = await pool.query('SELECT * FROM admin_settings WHERE email = $1', [email.trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const admin = result.rows[0];
    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT access token
    const token = jwt.sign({ email: admin.email }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: 'Internal server login error: ' + err.message });
  }
});

// 2. Change Credentials Settings Endpoint
app.post('/api/auth/change-password', authenticateJWT, async (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin_settings WHERE email = $1', [req.user.email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Administrator settings not found.' });
    }

    const admin = result.rows[0];
    const isMatch = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password validation.' });
    }

    let targetEmail = admin.email;
    let targetHash = admin.password_hash;

    if (newEmail && newEmail.trim() !== '') {
      targetEmail = newEmail.trim();
    }
    if (newPassword && newPassword.trim() !== '') {
      targetHash = bcrypt.hashSync(newPassword, 10);
    }

    // Since email is PRIMARY KEY, update it
    await pool.query('DELETE FROM admin_settings WHERE email = $1', [admin.email]);
    await pool.query('INSERT INTO admin_settings (email, password_hash) VALUES ($1, $2)', [targetEmail, targetHash]);

    // Resign JWT
    const token = jwt.sign({ email: targetEmail }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, email: targetEmail, message: 'Settings successfully updated!' });

  } catch (err) {
    res.status(500).json({ error: 'Error changing security configurations: ' + err.message });
  }
});

// 3. Reset to Defaults Endpoint (Protected)
app.post('/api/auth/reset-data', authenticateJWT, async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS school_data, staff, gallery, news, disclosures, hero_slides CASCADE');
    await initializeDatabase();
    res.json({ message: 'All website contents reset to original default templates successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting data: ' + err.message });
  }
});

// 4. Fetch Global Content Endpoint
app.get('/api/content', async (req, res) => {
  try {
    const schoolDataRes = await pool.query('SELECT * FROM school_data');
    const staffRes = await pool.query('SELECT * FROM staff');
    const galleryRes = await pool.query('SELECT * FROM gallery');
    const newsRes = await pool.query('SELECT * FROM news');
    const disclosuresRes = await pool.query('SELECT * FROM disclosures');
    const slidesRes = await pool.query('SELECT * FROM hero_slides');

    // Convert school_data key-value list back to an object
    const schoolData = {};
    schoolDataRes.rows.forEach(r => {
      schoolData[r.key] = r.value;
    });

    // Group disclosures back into tabs
    const disclosuresObj = {
      general: [],
      documents: [],
      academics: [],
      staff: [],
      infrastructure: [],
      committees: []
    };
    disclosuresRes.rows.forEach(r => {
      if (disclosuresObj[r.tab]) {
        disclosuresObj[r.tab].push({
          id: r.id,
          label: r.label,
          name: r.label, // mapped fields
          value: r.value,
          fileSrc: r.file_src,
          fileName: r.file_name
        });
      }
    });

    res.json({
      schoolData,
      staffList: staffRes.rows,
      gallery: galleryRes.rows,
      newsList: newsRes.rows,
      disclosures: disclosuresObj,
      heroSlides: slidesRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content: ' + err.message });
  }
});

// 5. Update All Content Endpoint (Protected)
app.post('/api/content', authenticateJWT, async (req, res) => {
  const { schoolData, staffList, gallery, newsList, disclosures, heroSlides } = req.body;

  try {
    await pool.query('BEGIN');

    // Update School Settings
    if (schoolData) {
      for (const [key, value] of Object.entries(schoolData)) {
        await pool.query(
          'INSERT INTO school_data (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, value]
        );
      }
    }

    // Update Staff
    if (staffList) {
      await pool.query('DELETE FROM staff');
      for (const s of staffList) {
        await pool.query(
          'INSERT INTO staff (id, name, role, credentials, bio, image, email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [s.id, s.name, s.role, s.credentials || '', s.bio || '', s.image || '', s.email || '']
        );
      }
    }

    // Update Gallery
    if (gallery) {
      await pool.query('DELETE FROM gallery');
      for (const g of gallery) {
        await pool.query(
          'INSERT INTO gallery (id, src, title, desc) VALUES ($1, $2, $3, $4)',
          [g.id, g.src, g.title || '', g.desc || '']
        );
      }
    }

    // Update News
    if (newsList) {
      await pool.query('DELETE FROM news');
      for (const n of newsList) {
        await pool.query(
          'INSERT INTO news (id, date, title, desc) VALUES ($1, $2, $3, $4)',
          [n.id, n.date, n.title, n.desc]
        );
      }
    }

    // Update Slides
    if (heroSlides) {
      await pool.query('DELETE FROM hero_slides');
      for (const s of heroSlides) {
        await pool.query(
          'INSERT INTO hero_slides (id, image, title) VALUES ($1, $2, $3)',
          [s.id, s.image, s.title || '']
        );
      }
    }

    // Update Disclosures
    if (disclosures) {
      await pool.query('DELETE FROM disclosures');
      for (const [tabKey, list] of Object.entries(disclosures)) {
        for (const item of list) {
          await pool.query(
            'INSERT INTO disclosures (id, tab, label, value, file_src, file_name) VALUES ($1, $2, $3, $4, $5, $6)',
            [item.id, tabKey, item.label || item.name, item.value || '', item.fileSrc || '', item.fileName || '']
          );
        }
      }
    }

    await pool.query('COMMIT');
    res.json({ message: 'All website contents successfully saved to PostgreSQL!' });

  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Failed saving content transaction: ' + err.message });
  }
});

// 6. Public Submit Inquiry Route
app.post('/api/enquiries', async (req, res) => {
  const { id, name, email, phone, message, date } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, Email, and Message are required fields.' });
  }

  try {
    await pool.query(
      'INSERT INTO enquiries (id, name, email, phone, message, date) VALUES ($1, $2, $3, $4, $5, $6)',
      [id || Date.now().toString(), name, email, phone || '', message, date || new Date().toLocaleString()]
    );
    res.json({ message: 'Inquiry submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error logging inquiry to database: ' + err.message });
  }
});

// 7. Get All Inquiries (Protected)
app.get('/api/enquiries', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enquiries ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve enquiries: ' + err.message });
  }
});

// 8. Delete Inquiry (Protected)
app.delete('/api/enquiries/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM enquiries WHERE id = $1', [id]);
    res.json({ message: 'Inquiry deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Viswam School Backend running on http://localhost:${PORT}`);
});

export default app;
