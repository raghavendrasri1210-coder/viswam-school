import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import InteractiveCarousel3D from './components/InteractiveCarousel3D';
import Leadership from './components/Leadership';
import NewsEvents from './components/NewsEvents';
import Disclosures from './components/Disclosures';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import AdminSettingsModal from './components/AdminSettingsModal';
import InfoModal from './components/InfoModal';

// Default school data
const DEFAULT_SCHOOL_DATA = {
  heroTitle: 'Welcome to Viswam English Medium High School',
  heroDesc: 'Since 2013, Viswam English Medium High School has stood as a trusted name in quality education. We bring together the best of South Indian values and world-class learning methods to prepare students for the challenges of tomorrow.',
  heroBullet1: 'Personalized learning with smart and adaptive education technology',
  heroBullet2: 'Balanced growth through academics, sports, fine arts, and moral values',
  heroBullet3: 'Global outlook with strong cultural roots and community spirit',
  
  aboutTitle: 'A Legacy of Excellence Since 2013',
  aboutContent: 'Viswam School was founded in 2013 with a vision to provide holistic education that blends Indian cultural values with global educational standards. What started as a small institution with just 75 students has now grown into one of the most prestigious educational institutions in the region.\n\nOur journey has been marked by continuous innovation, academic excellence, and a commitment to nurturing well-rounded individuals who can thrive in an ever-changing world.',
  
  contactAddress: 'Allipuram, Nellore, Andhra Pradesh, India - 524002',
  contactPhone: '+91 8885677877 / 8885677977',
  contactEmail: 'viswamschool2013@gmail.com', // Official school email

  principalName: 'Maddela Neeraja',
  principalCredentials: 'M.Sc B.Ed',
  principalBio: 'Leading our school family with a dedication to bringing out the absolute best in South Indian moral values and world-class educational techniques for every child.',
  
  careersDesc: 'We are always looking for passionate, experienced, and dedicated teaching professionals to join the Viswam High School family.',
  careersOpenings: 'Trained Graduate Teachers (TGT) - Science & Mathematics\nPost Graduate Teachers (PGT) - English & Social Sciences\nPrimary Teachers (PRT) & Kindergarten Instructors',
  careersNote: 'Please send your updated resume, academic credentials, and cover letter directly to our official administrative email address: viswamschool2013@gmail.com. Our administrative reviewing desk will evaluate submissions and contact shortlisted candidates for interviews shortly.'
};

const DEFAULT_STAFF = [
  {
    id: 's1',
    name: 'Maddela Neeraja',
    role: 'Principal',
    credentials: 'M.Sc B.Ed',
    bio: 'Leading our school family with a dedication to bringing out the absolute best in South Indian moral values and world-class educational techniques for every child.',
    image: '/principal.png',
    email: 'viswamschool2013@gmail.com'
  }
];

const DEFAULT_STATS = [
  { id: 'stat1', value: '300+', label: 'Students', colorClass: '' },
  { id: 'stat2', value: '20+', label: 'Expert Teachers', colorClass: 'alt-color-1' },
  { id: 'stat3', value: '100%', label: 'Pass Rate', colorClass: 'alt-color-2' },
  { id: 'stat4', value: '12+', label: 'Years of Excellence', colorClass: 'alt-color-3' }
];

const DEFAULT_MILESTONES = [
  {
    id: 'm1',
    year: '2013',
    title: 'Foundation',
    desc: 'Viswam School was established with 75 students and 10 faculty members, with a vision to provide world-class education with Indian values.'
  },
  {
    id: 'm2',
    year: '2016',
    title: 'Science & Tech Expansion',
    desc: 'Upgraded infrastructure with modern science laboratories and computer systems to foster engineering and scientific curiosity.'
  },
  {
    id: 'm3',
    year: '2020',
    title: 'Smart Classroom Transition',
    desc: 'Successfully implemented interactive digital screens and adaptive technology to continue lessons seamlessly.'
  },
  {
    id: 'm4',
    year: '2025',
    title: 'Decade of Excellence & Beyond',
    desc: 'Celebrated consecutive years of 100% board exam pass rates and upgraded playground and sports amenities.'
  }
];

const DEFAULT_GALLERY = [
  {
    id: 'g1',
    src: '/school_building.png',
    title: 'School Campus Building',
    desc: 'The modern multi-story primary and secondary school campus facility.'
  },
  {
    id: 'g2',
    src: '/farewell_banner.jpg',
    title: 'Farewell Day Celebrations',
    desc: 'Annual farewell events and leadership speeches in the school hall.'
  },
  {
    id: 'g3',
    src: '/fire_ceremony.png',
    title: 'Traditional Cultural Festival',
    desc: 'Celebrating South Indian cultural roots with community events.'
  },
  {
    id: 'g4',
    src: '/palm_leaves.jpg',
    title: 'Bonfire Day Activities',
    desc: 'Students preparing leaves for the annual winter bonfire ceremony.'
  }
];

const DEFAULT_NEWS = [
  {
    id: 'n1',
    date: 'June 20, 2026',
    title: 'Admissions Open for Academic Year 2026-27',
    desc: 'Admissions are officially open from Nursery to Grade X. Parents and guardians can collect registration forms from the administrative desk between 9:00 AM and 4:00 PM.'
  },
  {
    id: 'n2',
    date: 'April 15, 2026',
    title: 'Farewell Day Celebrations Conducted',
    desc: 'We successfully conducted the Farewell Day celebrations for our graduating Grade X batch. Students gave memorable presentations, followed by principal awards and speeches.'
  },
  {
    id: 'n3',
    date: 'January 10, 2026',
    title: 'Annual winter Bonfire Ceremony',
    desc: 'Viswam School celebrated the harvest festival season with students assembling palm leaves for the traditional bonfire, alongside singing and cultural activities.'
  }
];

const DEFAULT_HERO_SLIDES = [
  { id: 'hs1', image: '/school_building.png', title: 'Main Campus Building' },
  { id: 'hs2', image: '/farewell_banner.jpg', title: 'Farewell Day Celebrations' },
  { id: 'hs3', image: '/fire_ceremony.png', title: 'Traditional Festivities' },
  { id: 'hs4', image: '/palm_leaves.jpg', title: 'Students Cultural Activities' }
];

const DEFAULT_DISCLOSURES = {
  general: [
    { label: 'NAME OF THE SCHOOL', value: 'Viswam English Medium High School' },
    { label: 'AFFILIATION NO. (IF APPLICABLE)', value: 'N/A' },
    { label: 'SCHOOL CODE (IF APPLICABLE)', value: 'N/A' },
    { label: 'COMPLETE ADDRESS WITH PIN CODE', value: 'Viswam English Medium High School, Allipuram, Nellore, Andhra Pradesh, India - 524002' },
    { label: 'PRINCIPAL NAME', value: 'Maddela Neeraja' },
    { label: 'PRINCIPAL QUALIFICATION', value: 'M.Sc B.Ed' },
    { label: 'SCHOOL EMAIL ID', value: 'viswamschool2013@gmail.com' },
    { label: 'CONTACT DETAILS (LANDLINE/MOBILE)', value: '8885677877 / 8885677977' }
  ],
  documents: [
    { id: 'doc1', name: 'COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY', fileSrc: null, fileName: 'NA' },
    { id: 'doc2', name: 'COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE', fileSrc: '#', fileName: 'Society RC Copy' },
    { id: 'doc3', name: 'COPY OF THE NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT', fileSrc: '#', fileName: 'NOC Document' },
    { id: 'doc4', name: 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND ITS RENEWAL IF APPLICABLE', fileSrc: '#', fileName: 'State RC File' },
    { id: 'doc5', name: 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER NATIONAL BUILDING CODE', fileSrc: '#', fileName: 'Building Safety Certificate' },
    { id: 'doc6', name: 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPTENT AUTHORITY', fileSrc: '#', fileName: 'Fire Certificate' },
    { id: 'doc7', name: 'COPY OF SELF CERTIFICATION FOR AFFILIATION', fileSrc: '#', fileName: 'Self Certification File' },
    { id: 'doc8', name: 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', fileSrc: '#', fileName: 'Sanitary Certificate | Water Test Report' },
    { id: 'doc9', name: 'COPY OF LAND CERTIFICATE', fileSrc: '#', fileName: 'Land Certificate' }
  ],
  academics: [
    { id: 'acad1', name: 'FEE STRUCTURE OF THE SCHOOL', fileSrc: '#', fileName: 'Fee Structure Schedule' },
    { id: 'acad2', name: 'ANNUAL ACADEMIC CALENDAR', fileSrc: null, fileName: '-' },
    { id: 'acad3', name: 'LIST OF THE SCHOOL MANAGEMENT COMMITTEE (SMC)', fileSrc: '#', fileName: 'Grievance Redressal Committee' },
    { id: 'acad4', name: 'LIST OF THE PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS', fileSrc: null, fileName: '-' },
    { id: 'acad5', name: 'LAST THREE-YEAR RESULT OF BOARD EXAMINATION', fileSrc: null, fileName: 'NA' }
  ],
  staff: [
    { label: 'PRINCIPAL', value: '1' },
    { label: 'TOTAL NO. OF TEACHERS', value: '31' },
    { label: 'PGT (Post Graduate Teachers)', value: '15' },
    { label: 'TGT (Trained Graduate Teachers)', value: '16' },
    { label: 'PRT (Primary Teachers)', value: 'N/A' },
    { label: 'TEACHERS SECTION RATIO', value: 'N/A' },
    { label: 'DETAILS OF SPECIAL EDUCATOR', value: 'N/A' },
    { label: 'DETAILS OF COUNSELLOR AND WELLNESS TEACHER', value: '1' },
    { label: 'STRENGTH PARTICULARS', value: 'View Details', fileSrc: '#', fileName: 'Strength Particulars' }
  ],
  infrastructure: [
    { label: 'INFRASTRUCTURE DETAILS', value: 'View Details', fileSrc: '#', fileName: 'Infrastructure Details' },
    { label: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR.)', value: '3500' },
    { label: 'NUMBER AND SIZE OF CLASS ROOMS (IN SQUARE MTR.)', value: '25 Classrooms (50 sq m)' },
    { label: 'NUMBER OF LARGE LABS INCLUDING COMPUTER LABS (IN SQUARE MTR.)', value: '3 Labs (80 sq m)' },
    { label: 'INTERNET FACILITY (Y/N)', value: 'Yes' },
    { label: 'NUMBER OF GIRL\'S TOILETS', value: '10' },
    { label: 'NUMBER OF BOY\'S TOILETS', value: '10' },
    { label: 'LIBRARY BOOKS', value: 'View Details', fileSrc: '#', fileName: 'Library Book list' },
    { label: 'CBSE INSPECTION VIDEO', value: 'Watch on YouTube', fileSrc: 'https://youtube.com', fileName: 'Inspection Video Link' }
  ],
  committees: [
    { label: 'GRIEVANCE REDRESSAL COMMITTEE', value: 'View Details', fileSrc: '#', fileName: 'Grievance Committee List' },
    { label: 'ANTI-HARASSMENT COMMITTEE', value: 'View Details', fileSrc: '#', fileName: 'Anti-Harassment Committee Details' },
    { label: 'POCSO COMMITTEE', value: 'View Details', fileSrc: '#', fileName: 'POCSO Committee Log' }
  ]
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsModalMode, setSettingsModalMode] = useState('enquiries');
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'warning' }

  // Listen for global toast notifications
  useEffect(() => {
    const handleNotification = (e) => {
      if (e.detail && e.detail.message) {
        setToast({
          message: e.detail.message,
          type: e.detail.type || 'success',
          id: Date.now()
        });
      }
    };
    window.addEventListener('viswam_notification', handleNotification);
    return () => window.removeEventListener('viswam_notification', handleNotification);
  }, []);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // admissions banner states ...
  const [showAdmissionsAlert, setShowAdmissionsAlert] = useState(true);
  const [admissionsAlertText, setAdmissionsAlertText] = useState('Admissions 2025 - 2026');

  // Core Data States
  const [schoolData, setSchoolData] = useState(DEFAULT_SCHOOL_DATA);
  const [staffList, setStaffList] = useState(DEFAULT_STAFF);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);
  const [gallery, setGallery] = useState(DEFAULT_GALLERY);
  const [newsList, setNewsList] = useState(DEFAULT_NEWS);
  const [disclosures, setDisclosures] = useState(DEFAULT_DISCLOSURES);
  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);
  const [enquiries, setEnquiries] = useState([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState('privacy');

  // Router listening to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'about', 'disclosures', 'news', 'gallery', 'contact'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
        window.location.hash = '#home';
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to parent enquiries submitted
  useEffect(() => {
    const handleInquiryAdded = () => {
      const saved = localStorage.getItem('viswam_enquiries');
      if (saved) {
        setEnquiries(JSON.parse(saved));
      }
    };
    window.addEventListener('viswam_inquiry_added', handleInquiryAdded);
    return () => window.removeEventListener('viswam_inquiry_added', handleInquiryAdded);
  }, []);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSchoolData = localStorage.getItem('viswam_schoolData');
      const savedStaff = localStorage.getItem('viswam_staff');
      const savedStats = localStorage.getItem('viswam_stats');
      const savedMilestones = localStorage.getItem('viswam_milestones');
      const savedGallery = localStorage.getItem('viswam_gallery');
      const savedNews = localStorage.getItem('viswam_news');
      const savedDisclosures = localStorage.getItem('viswam_disclosures');
      const savedHeroSlides = localStorage.getItem('viswam_heroSlides');
      const savedEnquiries = localStorage.getItem('viswam_enquiries');
      const savedAdmissionsShow = localStorage.getItem('viswam_showAdmissions');
      const savedAdmissionsText = localStorage.getItem('viswam_admissionsText');
      const savedAdmin = sessionStorage.getItem('viswam_isAdmin');

      if (savedSchoolData) {
        const parsed = JSON.parse(savedSchoolData);
        if (parsed.contactEmail === 'mail@gmail.com') {
          parsed.contactEmail = 'viswamschool2013@gmail.com';
        }
        setSchoolData({ ...DEFAULT_SCHOOL_DATA, ...parsed });
      }
      
      if (savedStaff) {
        setStaffList(JSON.parse(savedStaff));
      }

      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
      if (savedGallery) setGallery(JSON.parse(savedGallery));
      if (savedNews) setNewsList(JSON.parse(savedNews));
      if (savedHeroSlides) setHeroSlides(JSON.parse(savedHeroSlides));
      if (savedEnquiries) setEnquiries(JSON.parse(savedEnquiries));
      
      if (savedAdmissionsShow !== null) {
        setShowAdmissionsAlert(savedAdmissionsShow === 'true');
      }
      if (savedAdmissionsText !== null) {
        setAdmissionsAlertText(savedAdmissionsText);
      }

      if (savedDisclosures) {
        const parsed = JSON.parse(savedDisclosures);
        if (parsed.general) {
          parsed.general = parsed.general.map(item => {
            if (item.label === 'SCHOOL EMAIL ID' && item.value === 'mail@gmail.com') {
              return { ...item, value: 'viswamschool2013@gmail.com' };
            }
            return item;
          });
        }

        const merged = {
          general: parsed.general || DEFAULT_DISCLOSURES.general,
          documents: parsed.documents || DEFAULT_DISCLOSURES.documents,
          academics: parsed.academics || DEFAULT_DISCLOSURES.academics,
          staff: parsed.staff || DEFAULT_DISCLOSURES.staff,
          infrastructure: parsed.infrastructure || DEFAULT_DISCLOSURES.infrastructure,
          committees: parsed.committees || DEFAULT_DISCLOSURES.committees
        };
        setDisclosures(merged);
      }

      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  // Sync to LocalStorage helper
  const saveStateToLocalStorage = (key, val) => {
    try {
      localStorage.setItem(`viswam_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  };

  const handleUpdateSchoolData = (field, value) => {
    const updated = { ...schoolData, [field]: value };
    setSchoolData(updated);
    saveStateToLocalStorage('schoolData', updated);
  };

  const handleUpdateStaff = (newStaff) => {
    setStaffList(newStaff);
    saveStateToLocalStorage('staff', newStaff);
  };

  const handleUpdateStats = (newStats) => {
    setStats(newStats);
    saveStateToLocalStorage('stats', newStats);
  };

  const handleUpdateMilestones = (newMilestones) => {
    setMilestones(newMilestones);
    saveStateToLocalStorage('milestones', newMilestones);
  };

  const handleUpdateGallery = (newGallery) => {
    setGallery(newGallery);
    saveStateToLocalStorage('gallery', newGallery);
  };

  const handleUpdateNews = (newNews) => {
    setNewsList(newNews);
    saveStateToLocalStorage('news', newNews);
  };

  const handleUpdateDisclosures = (newDisclosures) => {
    setDisclosures(newDisclosures);
    saveStateToLocalStorage('disclosures', newDisclosures);
  };

  const handleUpdateHeroSlides = (newSlides) => {
    setHeroSlides(newSlides);
    saveStateToLocalStorage('heroSlides', newSlides);
  };

  const handleUpdateEnquiries = (newEnquiries) => {
    setEnquiries(newEnquiries);
    saveStateToLocalStorage('enquiries', newEnquiries);
  };

  const handleToggleAdmissionsAlert = (show) => {
    setShowAdmissionsAlert(show);
    localStorage.setItem('viswam_showAdmissions', show ? 'true' : 'false');
  };

  const handleUpdateAdmissionsText = (text) => {
    setAdmissionsAlertText(text);
    localStorage.setItem('viswam_admissionsText', text);
  };

  // Auth functions
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('viswam_isAdmin', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    setIsSettingsOpen(false);
    sessionStorage.removeItem('viswam_isAdmin');
  };

  // Reset to Defaults
  const handleResetData = () => {
    setSchoolData(DEFAULT_SCHOOL_DATA);
    setStaffList(DEFAULT_STAFF);
    setStats(DEFAULT_STATS);
    setMilestones(DEFAULT_MILESTONES);
    setGallery(DEFAULT_GALLERY);
    setNewsList(DEFAULT_NEWS);
    setDisclosures(DEFAULT_DISCLOSURES);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setEnquiries([]);
    setShowAdmissionsAlert(true);
    setAdmissionsAlertText('Admissions 2025 - 2026');

    localStorage.removeItem('viswam_schoolData');
    localStorage.removeItem('viswam_staff');
    localStorage.removeItem('viswam_stats');
    localStorage.removeItem('viswam_milestones');
    localStorage.removeItem('viswam_gallery');
    localStorage.removeItem('viswam_news');
    localStorage.removeItem('viswam_disclosures');
    localStorage.removeItem('viswam_heroSlides');
    localStorage.removeItem('viswam_enquiries');
    localStorage.removeItem('viswam_showAdmissions');
    localStorage.removeItem('viswam_admissionsText');
    localStorage.removeItem('viswam_adminEmail');
    localStorage.removeItem('viswam_adminPassword');
    setIsEditMode(false);
    
    window.dispatchEvent(new CustomEvent('viswam_notification', {
      detail: { 
        message: "Website content and security credentials successfully reset back to default parameters!", 
        type: 'success' 
      }
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Admissions top alert banner */}
      {showAdmissionsAlert && (
        <div style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          padding: '10px 15px',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }} className="admissions-alert-banner">
          <span>📢 </span>
          <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ display: 'inline-block' }}>
            <span className="edit-indicator">Edit Admissions Text</span>
            {isEditMode ? (
              <input
                type="text"
                value={admissionsAlertText}
                onChange={(e) => handleUpdateAdmissionsText(e.target.value)}
                style={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px dashed white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  width: '240px'
                }}
              />
            ) : (
              <a href="#contact" style={{ color: 'white', textDecoration: 'underline' }}>
                {admissionsAlertText}
              </a>
            )}
          </div>
          {isEditMode && (
            <button 
              onClick={() => handleToggleAdmissionsAlert(false)} 
              style={{
                marginLeft: '15px',
                color: '#fee2e2',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.75rem',
                textDecoration: 'underline'
              }}
            >
              (Hide Banner)
            </button>
          )}
        </div>
      )}

      {/* Admin Panel bar at the top */}
      {isAdmin && (
        <AdminPanel
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
          onResetData={handleResetData}
          onLogout={handleLogout}
          showAdmissionsAlert={showAdmissionsAlert}
          onToggleAdmissions={handleToggleAdmissionsAlert}
          enquiriesCount={enquiries.length}
          onOpenSettings={(mode) => { setSettingsModalMode(mode); setIsSettingsOpen(true); }}
        />
      )}

      {/* Main Header */}
      <Navbar
        isAdmin={isAdmin}
        currentPage={currentPage}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Routed Page Sections */}
      <main style={{ flexGrow: 1, marginTop: '80px' }}>
        
        {currentPage === 'home' && (
          <>
            {/* Hero Showcase slider */}
            <Hero
              data={schoolData}
              isEditMode={isEditMode}
              onUpdateData={handleUpdateSchoolData}
              slides={heroSlides}
              onUpdateSlides={handleUpdateHeroSlides}
            />

            {/* Stats metrics */}
            <Stats
              stats={stats}
              isEditMode={isEditMode}
              onUpdateStats={handleUpdateStats}
            />

            {/* Premium Teaser Navigation Grid */}
            <section style={{ padding: '60px 0', backgroundColor: '#f8fafc' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '10px' }}>
                    Welcome to Our Campus
                  </h2>
                  <p className="section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    Viswam High School in Nellore offers world-class classrooms, rich student communities, and a high CBSE standard of education. Explore our sections.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '25px'
                }}>
                  {/* Card 1: About */}
                  <div className="teaser-card" style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                        History & Milestones
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '20px' }}>
                        Learn about our founding legacy since 2013, our year milestones, and our academic staff led by principal Maddela Neeraja.
                      </p>
                    </div>
                    <a href="#about" className="btn btn-outline" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem' }}>
                      Learn About Us
                    </a>
                  </div>

                  {/* Card 2: Gallery */}
                  <div className="teaser-card" style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                        3D Photos & Gallery
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '20px' }}>
                        Take a 3D spin carousel tour of farewell events, bonfires, science projects, and school campus activities.
                      </p>
                    </div>
                    <a href="#gallery" className="btn btn-outline" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem' }}>
                      Explore Gallery
                    </a>
                  </div>

                  {/* Card 3: News */}
                  <div className="teaser-card" style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                        Announcements Feed
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '20px' }}>
                        View active admissions processes, holiday schedules, farewell days, and recent events hosted on campus.
                      </p>
                    </div>
                    <a href="#news" className="btn btn-outline" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem' }}>
                      Read News Feed
                    </a>
                  </div>

                  {/* Card 4: Disclosures */}
                  <div className="teaser-card" style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>
                        CBSE Disclosures
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '20px' }}>
                        View mandatory CBSE disclosures, school safety credentials, building records, water certificates, and PTA logs.
                      </p>
                    </div>
                    <a href="#disclosures" className="btn btn-outline" style={{ textAlign: 'center', display: 'block', fontSize: '0.85rem' }}>
                      CBSE Declarations
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPage === 'about' && (
          <>
            <About
              data={schoolData}
              milestones={milestones}
              isEditMode={isEditMode}
              onUpdateData={handleUpdateSchoolData}
              onUpdateMilestones={handleUpdateMilestones}
            />

            <Leadership
              staffList={staffList}
              isEditMode={isEditMode}
              onUpdateStaff={handleUpdateStaff}
            />
          </>
        )}

        {currentPage === 'disclosures' && (
          <Disclosures
            disclosures={disclosures}
            isEditMode={isEditMode}
            onUpdateDisclosures={handleUpdateDisclosures}
          />
        )}

        {currentPage === 'news' && (
          <NewsEvents
            newsList={newsList}
            isEditMode={isEditMode}
            onUpdateNews={handleUpdateNews}
          />
        )}

        {currentPage === 'gallery' && (
          <>
            <InteractiveCarousel3D
              gallery={gallery}
              isEditMode={isEditMode}
              onUpdateGallery={handleUpdateGallery}
            />

            <Gallery
              gallery={gallery}
              isEditMode={isEditMode}
              onUpdateGallery={handleUpdateGallery}
            />
          </>
        )}

        {currentPage === 'contact' && (
          <ContactPage
            data={schoolData}
            isEditMode={isEditMode}
            onUpdateData={handleUpdateSchoolData}
          />
        )}

      </main>

      {/* Footer contacts */}
      <Footer
        data={schoolData}
        isEditMode={isEditMode}
        onUpdateData={handleUpdateSchoolData}
        onOpenInfo={(type) => {
          setInfoModalType(type);
          setInfoModalOpen(true);
        }}
      />

      {/* Owner Control Center Dashboard (Enquiries & Security Credentials) */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inquiries={enquiries}
        onUpdateInquiries={handleUpdateEnquiries}
        mode={settingsModalMode}
      />

      {/* Authentication Dialog overlay */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global premium Toast Notifications */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: toast.type === 'error' ? '#fef2f2' : toast.type === 'warning' ? '#fffbeb' : '#f0fdf4',
          border: `1px solid ${toast.type === 'error' ? '#fca5a5' : toast.type === 'warning' ? '#fcd34d' : '#bbf7d0'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          boxShadow: 'var(--shadow-premium)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: toast.type === 'error' ? '#991b1b' : toast.type === 'warning' ? '#92400e' : '#166534',
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          maxWidth: '380px'
        }}>
          {toast.type === 'error' ? (
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.4' }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0 0 0 5px',
              fontWeight: 'bold',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Info Modal Overlay for sitemap, privacy policy, terms of use, and careers */}
      <InfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        type={infoModalType}
        isEditMode={isEditMode}
        schoolData={schoolData}
        onUpdateSchoolData={handleUpdateSchoolData}
      />
    </div>
  );
}
