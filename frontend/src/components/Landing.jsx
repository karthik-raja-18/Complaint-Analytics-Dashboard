import React, { useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, ShieldCheck, Zap, ArrowRight, Code, Layers, Database } from 'lucide-react';

const Landing = () => {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    // Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { 
      threshold: 0.01, // Trigger as soon as 1% is visible
      rootMargin: '50px' // Trigger slightly before it enters viewport
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Robust Hash Scroll Fix
    const performScroll = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          // Force visibility for any revealed children in this section
          el.classList.add('visible');
          el.querySelectorAll('.reveal').forEach(child => child.classList.add('visible'));
          
          const headerOffset = 20; // Slight padding from top
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Run on mount and when hash changes
    setTimeout(performScroll, 200); // Small delay to ensure render is complete
    window.addEventListener('hashchange', performScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', performScroll);
    };
  }, []);

  if (token && !loading) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', color: 'white', overflowX: 'hidden', background: '#0f172a' }}>
      
      {/* ── Animated Background ──────────────────────────────── */}
      <div className="mesh-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div className="mesh-circle" style={{ width: '600px', height: '600px', background: 'rgba(59,130,246,0.15)', top: '-10%', left: '-10%' }}></div>
        <div className="mesh-circle" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.15)', bottom: '10%', right: '-5%', animationDelay: '-2s' }}></div>
        <div className="mesh-circle" style={{ width: '400px', height: '400px', background: 'rgba(59,130,246,0.1)', top: '40%', left: '30%', animationDelay: '-4s' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* ── Hero Section ──────────────────────────────────────── */}
        <div style={{ maxWidth: '1100px', padding: '8rem 2rem' }}>
          <div className="fade-in stagger-1 float" style={{ 
            display: 'inline-flex', padding: '0.4rem 1.2rem', background: 'rgba(59,130,246,0.1)', 
            borderRadius: '99px', border: '1px solid var(--accent-color)', 
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '2rem'
          }}>
            V2.0 LIVE • Civic Analytics & Business Intelligence
          </div>

          <h1 className="fade-in stagger-2" style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1.5rem', fontWeight: 800, 
            letterSpacing: '-0.04em', lineHeight: 1, color: 'white'
          }}>
            Optimize Your <br />
            <span style={{ 
               background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)', 
               backgroundSize: '200% auto',
               WebkitBackgroundClip: 'text',
               backgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               display: 'inline-block'
            }}>Civic Response.</span>
          </h1>

          <p className="fade-in stagger-3" style={{ 
            fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', 
            lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 3.5rem' 
          }}>
            A unified intelligence platform that simplifies administrative data. 
            Transform raw complaints into high-velocity resolutions with real-time tracking 
            across every municipal department.
          </p>

          <div className="fade-in stagger-4" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '8rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ padding: '1.1rem 3.5rem', fontSize: '1.1rem', borderRadius: '14px', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)' }}>
                Access Portal <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
            </Link>
            <a href="#documentation" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '1.1rem 3.5rem', fontSize: '1.1rem', borderRadius: '14px' }}>
                System Docs
              </button>
            </a>
          </div>

          {/* ── Feature Grid ── */}
          <div style={{ position: 'relative', overflow: 'hidden', padding: '2rem', borderRadius: '24px' }}>
            <div className="mesh-circle" style={{ width: '400px', height: '400px', background: 'rgba(59,130,246,0.1)', top: '20%', right: '-10%', zIndex: 0 }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left', position: 'relative', zIndex: 1 }}>
              <div className="glass-card card-hover reveal" style={{ padding: '2.5rem' }}>
                <BarChart3 color="var(--accent-color)" size={32} style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>Automated Analysis</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Advanced aggregation pipelines calculate department-wise performance metrics instantly, removing manual reporting overhead.
                </p>
              </div>
              <div className="glass-card card-hover reveal" style={{ padding: '2.5rem' }}>
                <Zap color="var(--success-color)" size={32} style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>High Velocity Sync</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Real-time synchronization with Spring Boot backends ensures your data is always current, enabling rapid administrative decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Documentation Section ─────────────────────────────── */}
        <div id="documentation" style={{ 
          width: '100%', padding: '8rem 2rem', position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' 
        }}>
          <div className="mesh-circle" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.08)', top: '50%', left: '-10%', zIndex: 0, animationDelay: '-1s' }}></div>
          
          <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem' }}>
              
              <div className="reveal">
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: 'white' }}>Engine <span style={{ color: 'var(--accent-color)' }}>Overview</span></h2>
                <div className="doc-block">
                  <h4 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Layers size={18} color="var(--accent-color)" /> Full-Stack Architecture
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Built on a decoupled Node.js/React core for maximum scalability.</p>
                </div>
                <div className="doc-block">
                  <h4 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Database size={18} color="var(--success-color)" /> MongoDB Data Persistence
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High-performance storage for millions of civic interaction records.</p>
                </div>
                <div className="doc-block">
                  <h4 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Code size={18} color="#8b5cf6" /> REST Integration
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Standardized endpoints for seamless Spring Boot data ingestion.</p>
                </div>
              </div>

              <div className="reveal">
                <div className="glass-card" style={{ padding: '3rem', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderColor: 'var(--accent-soft)' }}>
                   <h3 style={{ marginBottom: '2rem', color: 'white' }}>Implementation Guide</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
                        To integrate your department, simply synchronize your existing <strong>Spring Boot</strong> application 
                        with our <code>/api/sync</code> endpoint. The engine will automatically map zones, categorize departments, 
                        and calculate SLAs for your local jurisdiction.
                      </p>
                      <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                        Read API Spec
                      </button>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer style={{ 
          width: '100%', background: 'var(--bg-sidebar)', borderTop: '1px solid var(--card-border)',
          padding: '6rem 2rem 4rem'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', textAlign: 'left' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                 <BarChart3 size={24} color="var(--accent-color)" />
                 <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>Civic Engine</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                Driving transparency and efficiency in municipal governance through advanced analytics.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                <li>Email: support@civic-engine.gov</li>
                <li>Location: Regional Hub, Coimbatore</li>
                <li>Status: Operational</li>
              </ul>
            </div>
          </div>
          <div style={{ maxWidth: '1100px', margin: '4rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 Civic Analytics Engine</span>
            <div style={{ display: 'flex', gap: '2rem' }}><span>Privacy</span><span>Terms</span></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
