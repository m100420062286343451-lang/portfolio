import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Download, ExternalLink, Database, BarChart3, Brain, Code2, TrendingUp, Eye, Heart, FileText, Send, Github, Linkedin, Menu, X, FileSpreadsheet, PieChart, LineChart, Award, BadgeCheck, Calendar, Building2, Sparkles, Sigma } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import emailjs from '@emailjs/browser';
import { useToast } from "@/hooks/use-toast";
import profilePhoto from "@/assets/profile-photo.png";
import dashboardProject from "@/assets/dashboard-project.jpg";
import heartDiseaseAI from "@/assets/heart-disease-ai.jpg";
import hackathonProject from "@/assets/hackathon-project.jpg";
import businessInsightsDashboard from "@/assets/business-insights-dashboard.jpg";

// Typewriter hook cycling through phrases
const useTypewriter = (words: string[], typeMs = 70, holdMs = 1400, eraseMs = 40) => {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'type' | 'hold' | 'erase'>('type');
  useEffect(() => {
    const current = words[i % words.length];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'type') {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
      } else {
        t = setTimeout(() => setPhase('erase'), holdMs);
      }
    } else if (phase === 'erase') {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), eraseMs);
      } else {
        setI(i + 1);
        setPhase('type');
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, i, words, typeMs, holdMs, eraseMs]);
  return text;
};

// Reveal-on-scroll hook
const useInView = <T extends HTMLElement>(threshold = 0.2) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// Ripple click helper
const rippleClick = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--rx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--ry', `${e.clientY - rect.top}px`);
  el.classList.remove('is-rippling');
  // force reflow
  void el.offsetWidth;
  el.classList.add('is-rippling');
};

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeAction, setResumeAction] = useState<'download' | 'view' | null>(null);
  const [resumePassword, setResumePassword] = useState('');
  const [resumeError, setResumeError] = useState('');
  const {
    toast
  } = useToast();

  // Hero: mouse-follow glow
  const heroRef = useRef<HTMLElement | null>(null);
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  // Typewriter
  const typed = useTypewriter([
    'Data Analyst',
    'Business Intelligence Enthusiast',
    'AI Learner',
    'Dashboard Creator',
  ]);

  // Skills categories + filter
  const skillCategories = [
    { id: 'all', label: 'All' },
    { id: 'programming', label: 'Programming' },
    { id: 'analysis', label: 'Data Analysis' },
    { id: 'bi', label: 'Business Intelligence' },
    { id: 'ai', label: 'Artificial Intelligence' },
    { id: 'tools', label: 'Tools & Tech' },
  ] as const;
  type SkillCat = typeof skillCategories[number]['id'];
  const [activeSkill, setActiveSkill] = useState<SkillCat>('all');

  const allSkills = useMemo(() => ([
    { name: 'Python', level: 88, cat: 'programming' as SkillCat, icon: Code2, note: 'pandas, NumPy, scripting' },
    { name: 'SQL / MySQL', level: 82, cat: 'programming' as SkillCat, icon: Database, note: 'Joins, window functions, ETL' },
    { name: 'Excel', level: 90, cat: 'analysis' as SkillCat, icon: FileSpreadsheet, note: 'Pivot tables, modeling' },
    { name: 'Data Visualization', level: 85, cat: 'analysis' as SkillCat, icon: PieChart, note: 'Matplotlib, Seaborn' },
    { name: 'Power BI', level: 84, cat: 'bi' as SkillCat, icon: BarChart3, note: 'DAX, dashboards' },
    { name: 'Storytelling with Data', level: 80, cat: 'bi' as SkillCat, icon: LineChart, note: 'Insight communication' },
    { name: 'Machine Learning', level: 72, cat: 'ai' as SkillCat, icon: Brain, note: 'ANN, PSO, sklearn' },
    { name: 'Generative & Agentic AI', level: 70, cat: 'ai' as SkillCat, icon: Sparkles, note: 'LangGraph, CrewAI' },
    { name: 'Statistics', level: 76, cat: 'analysis' as SkillCat, icon: Sigma, note: 'Descriptive & inferential' },
    { name: 'GitHub', level: 78, cat: 'tools' as SkillCat, icon: Github, note: 'Version control, collab' },
  ]), []);

  const visibleSkills = activeSkill === 'all' ? allSkills : allSkills.filter(s => s.cat === activeSkill);
  const skillsSection = useInView<HTMLDivElement>(0.15);

  // Projects filter
  const projectCategories = [
    { id: 'all', label: 'All' },
    { id: 'python', label: 'Python' },
    { id: 'sql', label: 'SQL' },
    { id: 'powerbi', label: 'Power BI' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'ai', label: 'Artificial Intelligence' },
    { id: 'viz', label: 'Data Visualization' },
  ] as const;
  type ProjCat = typeof projectCategories[number]['id'];
  const [activeProj, setActiveProj] = useState<ProjCat>('all');

  const projects = useMemo(() => ([
    {
      title: 'Interactive Sales Performance Dashboard',
      subtitle: 'Business Intelligence Dashboard for Actionable Insights',
      image: dashboardProject,
      icon: TrendingUp,
      description: 'Real-time sales analytics with drill-through KPIs, trend lines and executive scorecards.',
      highlights: ['Real-time KPI tracking', 'Interactive drill-through filters', 'Executive-ready visuals'],
      tech: ['Python', 'SQL', 'Power BI', 'Dashboard'],
      cats: ['python', 'sql', 'powerbi', 'viz'] as ProjCat[],
      primary: { label: 'Live Demo', icon: ExternalLink, href: 'https://drive.google.com/file/d/12lKT-FAlYaToRUrCgBm04Q00v5j9XDp7/view?usp=sharing' },
      secondary: { label: 'GitHub', icon: Github, href: 'https://github.com/Madhan-006' },
    },
    {
      title: 'Heart Disease Prediction Using ANN & PSO',
      subtitle: 'Published Research Paper — IRJIET International Conference',
      image: heartDiseaseAI,
      icon: Heart,
      description: 'Hybrid ANN + Particle Swarm Optimization model tuned for clinical prediction accuracy.',
      highlights: ['Peer-reviewed publication', 'Hybrid ANN + PSO architecture', 'Improved prediction accuracy'],
      tech: ['Python', 'AI/ML', 'ANN', 'Research'],
      cats: ['python', 'ml', 'ai'] as ProjCat[],
      primary: { label: 'Read Paper', icon: FileText, href: 'https://doi.org/10.47001/IRJIET/2025.INSPIRE25' },
      secondary: { label: 'GitHub', icon: Github, href: 'https://github.com/Madhan-006' },
    },
    {
      title: 'Business Insight Dashboard',
      subtitle: 'Interactive Business Analytics Web Dashboard',
      image: businessInsightsDashboard,
      icon: TrendingUp,
      description: 'Live web-based dashboard surfacing revenue trends, KPIs and category-level insights for data-driven decisions.',
      highlights: ['Live interactive web dashboard', 'Revenue & KPI tracking', 'Category-level insights'],
      tech: ['Business Intelligence', 'Data Visualization', 'Dashboard', 'Analytics'],
      cats: ['powerbi', 'viz', 'sql'] as ProjCat[],
      primary: { label: 'Live Demo', icon: ExternalLink, href: 'https://businessinsightsdashboard.vercel.app/' },
      secondary: { label: 'GitHub', icon: Github, href: 'https://github.com/Madhan-006' },
    },
    {
      title: 'Infosys TECHZOOKA & PALS Hackathon 2025',
      subtitle: 'Top 10 finalist out of 88 teams — Infosys MCity Campus',
      image: hackathonProject,
      icon: Sparkles,
      description: 'Team problem-solving on real-world AI challenges, culminating in a Top 10 finalist rank.',
      highlights: ['Top 10 of 88 teams', 'Real-world AI problem solving', 'Cross-functional collaboration'],
      tech: ['AI', 'Problem Solving', 'Teamwork', 'Hackathon'],
      cats: ['ai', 'ml'] as ProjCat[],
      primary: { label: 'Live Demo', icon: ExternalLink, href: '#' },
      secondary: { label: 'GitHub', icon: Github, href: 'https://github.com/Madhan-006' },
    },
  ]), []);

  const visibleProjects = activeProj === 'all' ? projects : projects.filter(p => p.cats.includes(activeProj));

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.send('service_s8hy6f2', 'template_pou6wh9', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString(),
        reply_to: formData.email
      }, 'AevKZ94mvNtL-ei4L');
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon."
      });
      
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const requestResume = (action: 'download' | 'view') => {
    setResumeAction(action);
    setResumePassword('');
    setResumeError('');
  };
  const handleResumeVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resumePassword !== '10042006' || !resumeAction) {
      setResumeError('Incorrect password. Please try again.');
      return;
    }

    const resumeUrl = '/resume-secured-9x2k.pdf';
    if (resumeAction === 'download') {
      const downloadLink = document.createElement('a');
      downloadLink.href = resumeUrl;
      downloadLink.download = 'Madhan-Kumar-Resume.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    } else {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    }
    setResumeAction(null);
    setResumePassword('');
    setResumeError('');
  };
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold gradient-text">
              Madhan Kumar P
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Skills', 'Tools', 'Projects', 'Certificate', 'Contact'].map(item => <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="nav-link">
                  {item}
                </button>)}
            </div>

            <a href="https://github.com/Madhan-006" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="hidden md:inline-flex text-foreground/80 hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && <div className="md:hidden mt-4 pb-4 space-y-2">
              {['Home', 'About', 'Skills', 'Tools', 'Projects', 'Certificate', 'Contact'].map(item => <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left nav-link">
                  {item}
                </button>)}
              <a href="https://github.com/Madhan-006" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 nav-link"><Github className="w-4 h-4" /> github</a>
            </div>}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef as React.RefObject<HTMLElement>}
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden hero-animated-bg mouse-glow"
      >
        {/* Floating tech icons */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          {[
            { Icon: Code2,          label: 'Python',           className: 'top-[14%] left-[8%] animate-float-slow' },
            { Icon: Database,       label: 'SQL',              className: 'top-[22%] right-[10%] animate-float-slower' },
            { Icon: BarChart3,      label: 'Power BI',         className: 'bottom-[24%] left-[12%] animate-float-slower' },
            { Icon: FileSpreadsheet,label: 'Excel',            className: 'bottom-[16%] right-[14%] animate-float-slow' },
            { Icon: Brain,          label: 'AI',               className: 'top-[46%] left-[4%] animate-float-slower' },
            { Icon: Sparkles,       label: 'Machine Learning', className: 'top-[52%] right-[6%] animate-float-slow' },
          ].map(({ Icon, label, className }) => (
            <div key={label} className={`absolute hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/70 backdrop-blur border border-primary/15 shadow-card ${className}`}>
              <Icon className="w-6 h-6 text-primary" />
              <span className="sr-only">{label}</span>
            </div>
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <img
              src={profilePhoto}
              alt="Madhan Kumar P"
              className="w-48 h-48 rounded-full mx-auto mb-8 border-4 border-primary/30 shadow-glow object-cover object-center animate-fade-up"
              style={{ animationDelay: '80ms' }}
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-up" style={{ animationDelay: '160ms' }}>
              <span className="gradient-text">P MADHAN KUMAR</span>
            </h1>

            {/* Typewriter */}
            <p className="text-xl md:text-2xl text-foreground/80 mb-2 min-h-[2.25rem] animate-fade-in-soft" style={{ animationDelay: '260ms' }}>
              <span className="font-semibold text-primary">{typed}</span>
              <span className="inline-block w-[2px] h-6 md:h-7 align-middle bg-primary ml-1 animate-blink-caret" aria-hidden="true" />
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 animate-fade-in-soft" style={{ animationDelay: '340ms' }}>
              AI & Data Science Enthusiast
            </p>
            <p className="text-lg text-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in-soft" style={{ animationDelay: '420ms' }}>
              Transforming data into meaningful insights with Python, SQL, and visualization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '520ms' }}>
              <Button
                variant="hero"
                size="xl"
                className="btn-ripple hover:-translate-y-0.5 hover:shadow-glow transition-all"
                onClick={(e) => { rippleClick(e); scrollToSection('projects'); }}
              >
                <Eye className="w-5 h-5" />
                View My Work
              </Button>
              <Button
                variant="project"
                size="xl"
                className="btn-ripple hover:-translate-y-0.5 hover:shadow-glow transition-all"
                onClick={(e) => { rippleClick(e); scrollToSection('contact'); }}
              >
                <Mail className="w-5 h-5" />
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">ABOUT ME</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="glass-card border-white/10 hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">B.Tech in Artificial Intelligence and Data Science</h3>
                    <p className="text-muted-foreground">GRT Institute of Engineering and Technology</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Current Student
                  </Badge>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">PERSONAL BIO</h3>
              <p className="text-lg text-foreground/80 leading-relaxed">I am a passionate B.Tech student specializing in Artificial Intelligence and Data Science. With a strong foundation in data analytics, I focus on creating interactive dashboards and extracting meaningful insights from complex datasets.</p>
              <p className="text-lg text-foreground/80 leading-relaxed">My journey in data science is driven by curiosity and a commitment to continuous learning. I believe in the power of data storytelling and visualization to drive informed decision-making in businesses and organizations.</p>
              <div className="flex flex-col gap-4">
                {resumeAction ? (
                  <form onSubmit={handleResumeVerify} className="w-full max-w-xl space-y-3">
                    <Label htmlFor="resume-password">Enter password to access your resume</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        id="resume-password"
                        type="password"
                        autoFocus
                        required
                        value={resumePassword}
                        onChange={(e) => { setResumePassword(e.target.value); setResumeError(''); }}
                        placeholder="Password"
                        aria-describedby={resumeError ? 'resume-password-error' : undefined}
                        className="bg-card"
                      />
                      <Button type="submit" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                        Verify
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg border-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => { setResumeAction(null); setResumePassword(''); setResumeError(''); }}
                      >
                        Cancel
                      </Button>
                    </div>
                    {resumeError && (
                      <p id="resume-password-error" role="alert" className="text-sm text-destructive">
                        {resumeError}
                      </p>
                    )}
                    {resumeError && (
                      <div className="overflow-hidden rounded-lg border border-border" aria-label="Blurred resume preview">
                        <img
                          src="/resume-preview.jpg"
                          alt="Blurred resume preview"
                          draggable={false}
                          className="pointer-events-none h-[320px] w-full select-none object-cover object-top blur-md"
                        />
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => requestResume('download')}
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg border-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => requestResume('view')}
                    >
                      <Eye className="w-4 h-4" />
                      View Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto" ref={skillsSection.ref}>
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">SKILLS</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Filter by category to explore my toolkit across data analysis, business intelligence and AI.
          </p>

          {/* Category filter chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10" role="tablist" aria-label="Skill categories">
            {skillCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeSkill === cat.id}
                data-active={activeSkill === cat.id}
                onClick={() => setActiveSkill(cat.id)}
                className="chip focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Skill cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSkills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="group glass-card p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/40 animate-fade-up focus-within:-translate-y-1"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground leading-tight">{skill.name}</h3>
                      <p className="text-xs text-muted-foreground">{skill.note}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={
                        skillsSection.inView
                          ? { width: `${skill.level}%`, transition: 'width 1.1s cubic-bezier(0.22,1,0.36,1)', transitionDelay: `${idx * 60}ms` }
                          : { width: '0%' }
                      }
                    />
                  </div>
                  {/* Hover-reveal detail */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:opacity-100 overflow-hidden transition-all duration-300">
                    <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                      Proficiency: <span className="text-foreground font-medium">{skill.level >= 85 ? 'Advanced' : skill.level >= 70 ? 'Intermediate' : 'Working knowledge'}</span> · Category: <span className="text-foreground font-medium">{skillCategories.find(c => c.id === skill.cat)?.label}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Tools & Technologies Section */}
      <section id="tools" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">TOOLS & TECHNOLOGIES</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {/* Python */}
            <div className="group flex flex-col items-center space-y-4 p-6 rounded-xl bg-dark-surface/30 border border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-blue-soft transition-all duration-300 ease-out">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">Python</h3>
                <p className="text-xs text-muted-foreground">Data Analysis & Scripting</p>
              </div>
            </div>

            {/* MySQL */}
            <div className="group flex flex-col items-center space-y-4 p-6 rounded-xl bg-dark-surface/30 border border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-blue-soft transition-all duration-300 ease-out">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">MySQL</h3>
                <p className="text-xs text-muted-foreground">Database Management</p>
              </div>
            </div>

            {/* Excel */}
            <div className="group flex flex-col items-center space-y-4 p-6 rounded-xl bg-dark-surface/30 border border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-blue-soft transition-all duration-300 ease-out">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <FileSpreadsheet className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">Excel</h3>
                <p className="text-xs text-muted-foreground">Spreadsheet Modeling</p>
              </div>
            </div>

            {/* Power BI */}
            <div className="group flex flex-col items-center space-y-4 p-6 rounded-xl bg-dark-surface/30 border border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-blue-soft transition-all duration-300 ease-out">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">Power BI</h3>
                <p className="text-xs text-muted-foreground">Business Intelligence</p>
              </div>
            </div>

            {/* Data Visualization */}
            <div className="group flex flex-col items-center space-y-4 p-6 rounded-xl bg-dark-surface/30 border border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-blue-soft transition-all duration-300 ease-out col-span-2 md:col-span-1">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                <PieChart className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">Data Visualization</h3>
                <p className="text-xs text-muted-foreground">Matplotlib & Seaborn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="projects" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">PROJECTS</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Filter by technology to explore selected work across analytics, BI and AI.
          </p>

          {/* Project filter chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12" role="tablist" aria-label="Project categories">
            {projectCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeProj === cat.id}
                data-active={activeProj === cat.id}
                onClick={() => setActiveProj(cat.id)}
                className="chip focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map((p, idx) => {
              const Icon = p.icon;
              const PrimaryIcon = p.primary.icon;
              const SecondaryIcon = p.secondary.icon;
              return (
                <article
                  key={p.title}
                  className="group glass-card overflow-hidden flex flex-col animate-fade-up transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated hover:border-primary/40"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{p.subtitle}</p>
                    <p className="text-foreground/80 text-sm mb-4">{p.description}</p>

                    {/* Hover-reveal highlights */}
                    <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-focus-within:max-h-40 group-focus-within:opacity-100 overflow-hidden transition-all duration-300 mb-4">
                      <ul className="text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
                        {p.highlights.map(h => (
                          <li key={h} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.tech.map(t => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/15 hover:text-primary"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="hero"
                        className="flex-1 btn-ripple hover:-translate-y-0.5 transition-transform"
                        onClick={(e) => { rippleClick(e); if (p.primary.href !== '#') window.open(p.primary.href, '_blank', 'noopener,noreferrer'); }}
                      >
                        <PrimaryIcon className="w-4 h-4" />
                        {p.primary.label}
                      </Button>
                      <Button
                        variant="project"
                        className="flex-1 btn-ripple hover:-translate-y-0.5 transition-transform"
                        onClick={(e) => { rippleClick(e); if (p.secondary.href !== '#') window.open(p.secondary.href, '_blank', 'noopener,noreferrer'); }}
                      >
                        <SecondaryIcon className="w-4 h-4" />
                        {p.secondary.label}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleProjects.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">No projects in this category yet — more coming soon.</p>
          )}

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">More projects coming soon...</p>
            <Button variant="project" className="btn-ripple" asChild>
              <a href="https://github.com/Madhan-006" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
                View GitHub Profile
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificate" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 gradient-text">CERTIFICATES</h2>
            <p className="text-muted-foreground text-lg">
              Professional certifications that demonstrate my commitment to continuous learning, technical excellence, and staying current with industry-leading technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Data Analysis and Visualization with Power BI",
                issuer: "Microsoft",
                platform: "Coursera",
                date: "March 5, 2026",
                description: "Hands-on mastery of Power BI for building interactive dashboards, transforming raw data into business insights, and communicating findings through compelling data storytelling.",
                skills: ["Power BI", "Data Analysis", "Data Visualization", "Business Intelligence", "Dashboard Development", "Data Storytelling"],
                fileUrl: "https://coursera.org/verify/V1M3SVFC0EUC",
                verifyUrl: "",
                icon: BarChart3
              }
            ].map((cert, index) => {
              const Icon = cert.icon;
              const isVerified = Boolean(cert.verifyUrl);
              return (
                <article
                  key={cert.title}
                  className="group glass-card p-6 flex flex-col animate-fade-up transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-elevated focus-within:-translate-y-1 focus-within:shadow-elevated"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                      <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
                    </div>
                    {isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                        <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">
                    {cert.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="font-medium text-foreground">{cert.issuer}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-primary" aria-hidden="true" />
                      {cert.platform}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
                      {cert.date}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
                    {cert.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {cert.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 transition-colors hover:bg-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="hero"
                      className="flex-1"
                      asChild
                    >
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View certificate: ${cert.title}`}
                      >
                        <Eye className="w-4 h-4" />
                        View Certificate
                      </a>
                    </Button>
                    {isVerified && (
                      <Button variant="outline-glow" asChild>
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Verify certificate: ${cert.title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Verify
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">CONTACT ME</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
                <p className="text-foreground/80 mb-8">
                  I'm always open to discussing new opportunities, 
                  collaborations, or just having a conversation about data science and analytics.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">maddyfx006@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 8124016941</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="project" size="icon" asChild>
                  <a href="https://github.com/Madhan-006" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  variant="project" 
                  size="icon"
                  onClick={() => window.open('https://www.linkedin.com/in/madhan-kumar-529232331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', '_blank')}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell me about your project or just say hello!" rows={4} required />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Madhan Kumar P. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;