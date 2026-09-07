import { LocationId, allLocationIds } from "./locations";

export interface CourseModule {
  title: string;
  topics: string[];
}

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: number;
  slug: string;
  title: string;
  track: string;
  duration: string;
  level: string;
  levels: Level[];
  locations: LocationId[];
  /** Price in Naira. 0 means "not priced yet" — online payment stays disabled. */
  priceNgn: number;
  overview: string;
  objectives?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  equipment?: string[];
  modules: CourseModule[];
  outcomes: string[];
  assessment?: string[];
}

// Slugs of courses offered only at the Jabi campus (e.g. executive/leadership-oriented
// courses). Update this list once confirmed — everything else defaults to all 3 locations.
const JABI_ONLY_COURSE_SLUGS: string[] = [];

/**
 * Course prices in Naira, keyed by slug. Anything missing or 0 is treated as
 * "not priced yet" and Paystack checkout stays disabled for that course.
 * Fill these in (and set PAYSTACK_ENABLED=true) to switch payments on.
 */
const COURSE_PRICES_NGN: Record<string, number> = {};

export const tracks = [
  "Data & AI",
  "Web & Office Skills",
  "Digital & Security",
  "Systems & Startup",
];

export const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];

const deriveLevels = (level: string): Level[] => {
  const found = levels.filter((l) => level.toLowerCase().includes(l.toLowerCase()));
  return found.length ? found : ["Beginner"];
};

type RawCourse = Omit<Course, "levels" | "locations" | "priceNgn">;

const courseList: RawCourse[] = [
  {
    id: 1,
    slug: "microsoft-powerpoint",
    title: "Microsoft PowerPoint: A Complete Training Course for Beginners",
    track: "Web & Office Skills",
    duration: "3 Weeks (2 days per week, 2 hours per day)",
    level: "Beginner",
    overview:
      "Designed to equip participants with basic PowerPoint training. The course covers basic PowerPoint features, slide design, business presentation preparation, and more. Beginner's Level in PowerPoint Training teaches participants to prepare professional and business presentations identical to those delivered by major investment banks and consulting firms.",
    prerequisites: [
      "Students will need to install Microsoft PowerPoint 2010 or 2013",
      "No previous knowledge of PowerPoint is required, given that we cover the basics",
      "No prior programming experience required",
    ],
    modules: [
      {
        title: "Module 1: Introduction to PowerPoint",
        topics: [
          "Overview of PowerPoint",
          "Creating a new presentation",
          "Understanding the interface",
          "Basic navigation",
        ],
      },
      {
        title: "Module 2: Creating and Editing Slides",
        topics: [
          "Adding text, images, and shapes",
          "Formatting text and objects",
          "Rearranging and deleting slides",
          "Using the slide sorter view",
          "Quiz 1 - Basic PowerPoint instruments",
        ],
      },
      {
        title: "Module 3: Working with Text and Images",
        topics: [
          "Adding and formatting text",
          "Inserting and editing images",
          "Using graphics and icons",
          "Basic image editing",
          "Quiz 2 - PowerPoint features",
        ],
      },
      {
        title: "Module 4: Creating Tables and Charts",
        topics: [
          "Creating tables",
          "Creating charts and graphs",
          "Customizing table and chart styles",
          "Using Excel data in PowerPoint",
        ],
      },
      {
        title: "Module 5: Adding Audio and Video",
        topics: [
          "Inserting audio and video files",
          "Recording audio and video",
          "Using multimedia tools",
          "Basic audio and video editing",
        ],
      },
      {
        title: "Module 6: Transitions and Animations",
        topics: [
          "Adding transitions between slides",
          "Creating animations for objects",
          "Customizing animation settings",
          "Using the animation pane",
        ],
      },
      {
        title: "Module 7: Publishing and Sharing Presentations",
        topics: [
          "Saving and exporting presentations",
          "Sharing presentations online",
          "Creating handouts and notes",
          "Basic presentation security",
        ],
      },
      {
        title: "Module 8: Best Practices for Beginners",
        topics: [
          "Understanding design principles",
          "Creating effective and engaging presentations",
          "Using PowerPoint's built-in design tools",
          "Basic presentation tips and tricks",
        ],
      },
    ],
    targetAudience: [
      "Anyone who struggles to create professional PowerPoint presentations",
      "Business professionals",
      "Students and researchers",
      "People who want to advance professionally",
    ],
    assessment: [
      "Weekly assignments and quizzes",
      "Final capstone project",
      "Course completion requirements",
    ],
    outcomes: [
      "Work comfortably with PowerPoint and many of its advanced features",
      "Become one of the top PowerPoint users in their team",
      "Carry out regular tasks faster than ever",
      "Create sophisticated and well-organized PowerPoint presentations",
      "Feel more confident when delivering presentations to superiors",
      "Make an impression at work and achieve their professional goals",
    ],
  },
  {
    id: 2,
    slug: "computer-system-hardware",
    title: "Computer System Hardware",
    track: "Systems & Startup",
    duration: "8 Weeks",
    level: "Beginner to Intermediate",
    overview:
      "This course provides an in-depth understanding of computer system hardware, including the fundamental components, architecture, and interfaces. Students will learn about the design, functionality, and performance of various hardware components, as well as their interactions and integration.",
    objectives: [
      "Understand the basic components of a computer system, including the CPU, memory, and I/O devices",
      "Describe the architecture and organization of computer systems, including the bus structure, memory hierarchy, and I/O interfaces",
      "Explain the design and functionality of various hardware components, including CPUs, memory modules, storage devices, and peripherals",
      "Analyse the performance characteristics of different hardware components and systems",
      "Understand the importance of hardware compatibility, scalability, and upgradeability",
    ],
    prerequisites: ["Basic computer literacy", "Familiarity with computer programming concepts"],
    modules: [
      {
        title: "Week 1: Introduction to Computer Hardware",
        topics: ["Overview of computer systems", "Basic components: CPU, memory, I/O devices", "Computer system architecture"],
      },
      {
        title: "Week 2: Central Processing Unit (CPU)",
        topics: ["CPU architecture: instruction set, execution pipeline", "CPU performance: clock speed, cache memory", "CPU types: microprocessors, multicore processors"],
      },
      {
        title: "Week 3: Memory and Storage",
        topics: ["Memory hierarchy: cache, main memory, virtual memory", "Memory types: RAM, ROM, flash memory", "Storage devices: hard disk drives, solid-state drives, flash drives"],
      },
      {
        title: "Week 4: Input/Output (I/O) Devices",
        topics: ["I/O interfaces: USB, SATA, PCIe", "I/O devices: keyboards, mice, displays, printers"],
      },
      {
        title: "Week 5: Computer System Bus and Interconnects",
        topics: ["Bus structure: address bus, data bus, control bus", "Bus types: PCI, PCI Express, SATA", "Interconnects: Ethernet, Wi-Fi, Bluetooth"],
      },
      {
        title: "Week 6: Computer System Performance",
        topics: ["Performance metrics: clock speed, throughput, latency", "Performance optimization: pipelining, caching, parallel processing"],
      },
      {
        title: "Week 7: Hardware Compatibility and Scalability",
        topics: ["Hardware compatibility: BIOS, UEFI, device drivers", "Scalability: upgrading, expanding, and migrating computer systems"],
      },
      {
        title: "Week 8: Emerging Trends in Computer Hardware",
        topics: ["Artificial intelligence (AI) and machine learning (ML) hardware", "Internet of Things (IoT) devices and sensors", "Quantum computing and its implications"],
      },
    ],
    outcomes: [
      "Understand computer architecture",
      "Assemble computer systems",
      "Diagnose hardware issues",
      "Perform system maintenance",
    ],
  },
  {
    id: 3,
    slug: "database-management-system",
    title: "Database Management System (Microsoft Access)",
    track: "Data & AI",
    duration: "8 Weeks (5 days per week, 2 hours per day)",
    level: "Beginner to Intermediate",
    overview:
      "A hands-on introduction to designing, building, and managing relational databases using Microsoft Access — from table design and queries through forms, reports, macros, VBA automation, and database security.",
    objectives: [
      "Understand the fundamentals of database management systems (DBMS)",
      "Learn to design, create, and manage relational databases using Microsoft Access",
      "Master data entry, validation, and manipulation techniques",
      "Develop skills in querying, reporting, and integrating data",
      "Explore advanced features like macros, VBA, and database security",
      "Apply knowledge through hands-on projects and real-world scenarios",
    ],
    targetAudience: [
      "Beginners with no prior knowledge of databases",
      "Professionals seeking to enhance their database management skills",
      "Students, educators, and IT staff in public and private sectors",
    ],
    equipment: [
      "Laptop or desktop computer",
      "Stable internet connection",
      "Microsoft Access 2019 or Microsoft 365 (latest version)",
      "Basic knowledge of computer usage",
    ],
    modules: [
      {
        title: "Module 1: Introduction to Database Management Systems",
        topics: ["What is a Database?", "Types of Databases (Relational, NoSQL, etc.)", "Overview of Microsoft Access Interface", "Database Design Principles (Tables, Fields, Records, Keys, Normalization)", "Hands-On: Create a new database and design tables"],
      },
      {
        title: "Module 2: Working with Queries",
        topics: ["Introduction to Queries (Select, Action, Parameter, etc.)", "Building Basic Queries Using the Query Designer", "Sorting, Filtering, and Using Criteria in Queries", "SQL Basics (Writing Simple SQL Queries)", "Action Queries (Update, Delete, Append)", "Hands-On: Create and run basic and advanced queries"],
      },
      {
        title: "Module 3: Forms and User Interface Design",
        topics: ["Purpose of Forms in Databases", "Creating Forms Using the Form Wizard", "Customizing Forms (Adding Controls, Formatting)", "Advanced Form Features (Subforms, Tab Controls, Conditional Formatting)", "Navigation Forms and Form Validation", "Hands-On: Design and customize forms for data entry and user interaction"],
      },
      {
        title: "Module 4: Reports and Data Presentation",
        topics: ["Purpose of Reports", "Creating Reports Using the Report Wizard", "Customizing Reports (Adding Calculated Fields, Grouping, Sorting)", "Advanced Report Features (Subreports, Conditional Formatting)", "Exporting and Printing Reports", "Hands-On: Design and generate professional reports"],
      },
      {
        title: "Module 5: Advanced Database Features",
        topics: ["Macros in Access (Automating Tasks)", "Introduction to VBA (Visual Basic for Applications)", "Data Integration (Importing, Exporting, Linking External Data)", "Advanced Data Management (Lookup Fields, Managing Large Databases)", "Database Security (User Permissions, Encryption)", "Hands-On: Create macros and write simple VBA scripts"],
      },
      {
        title: "Module 6: Database Maintenance and Optimization",
        topics: ["Database Backup and Recovery", "Compact and Repair Database", "Troubleshooting Common Issues", "Database Documentation", "Hands-On: Perform database backups and optimize performance"],
      },
      {
        title: "Module 7: Interactive Database Projects & Implementation",
        topics: ["Planning and Designing a Database Project", "Applying All Concepts Learned in the Course", "Hands-On: Develop a real-world database project from scratch", "Group Discussions: Share project ideas and receive feedback"],
      },
      {
        title: "Module 8: Future Trends in Database Management",
        topics: ["Emerging Trends in Database Technologies", "Cloud-Based Databases and Integration", "Ethical Considerations in Data Management", "Hands-On: Explore cloud-based database tools (e.g., Microsoft Azure)"],
      },
    ],
    outcomes: [
      "Design efficient database schemas",
      "Write complex SQL queries",
      "Optimize database performance",
      "Implement database security",
    ],
  },
  {
    id: 4,
    slug: "wordpress-web-design",
    title: "WordPress Web Design – From Domain Purchase to Website Launch",
    track: "Web & Office Skills",
    duration: "6 Weeks (5 days per week, 2 hours per day)",
    level: "Beginner to Intermediate",
    overview:
      "Build a professional, responsive WordPress website from the ground up — domain and hosting, Elementor page design, Forminator forms, E2Pdf document generation, and a full public launch.",
    objectives: [
      "Understand the process of purchasing a domain and web hosting",
      "Learn how to install and configure WordPress",
      "Master the use of Elementor for website design",
      "Create functional forms using Forminator",
      "Generate and manage PDFs using the E2Pdf plugin",
      "Set up professional email addresses linked to your domain",
      "Develop a fully functional, responsive, and professional website",
    ],
    targetAudience: [
      "Beginners in web design and development",
      "Small business owners looking to create their own websites",
      "Freelancers and entrepreneurs interested in offering web design services",
      "Anyone interested in learning WordPress and its powerful plugins",
    ],
    equipment: [
      "Laptop or desktop computer",
      "Stable internet connection",
      "Basic knowledge of computer usage",
      "No prior coding or web design experience required",
    ],
    modules: [
      {
        title: "Module 1: Introduction to WordPress and Web Design Basics",
        topics: ["What is WordPress? Overview of CMS (Content Management Systems)", "Understanding domains, web hosting, and how they work", "Key components of a website: pages, posts, themes, and plugins", "Introduction to the tools and plugins we'll use: Elementor, Forminator, and E2Pdf"],
      },
      {
        title: "Module 2: Domain and Web Hosting Setup",
        topics: ["How to choose and purchase a domain name", "Selecting the right web hosting plan for your needs", "Connecting your domain to your hosting account", "Understanding DNS settings and domain management"],
      },
      {
        title: "Module 3: WordPress Installation and Configuration",
        topics: ["Installing WordPress on your hosting account", "Navigating the WordPress dashboard", "Configuring basic settings: site title, tagline, and permalinks", "Installing and activating themes"],
      },
      {
        title: "Module 4: Website Design with Elementor",
        topics: ["Introduction to Elementor: drag-and-drop page builder", "Creating and customizing pages using Elementor", "Designing headers, footers, and menus", "Adding and styling sections, columns, and widgets", "Making your website responsive for mobile devices"],
      },
      {
        title: "Module 5: Creating Forms with Forminator",
        topics: ["Introduction to Forminator: a powerful form builder plugin", "Creating contact forms, surveys, and polls", "Integrating forms into your website", "Setting up email notifications and form submissions"],
      },
      {
        title: "Module 6: Generating PDFs with E2Pdf",
        topics: ["Introduction to E2Pdf: a plugin for generating PDFs", "Creating PDF templates for forms and documents", "Automating PDF generation for form submissions", "Exporting and managing PDF files"],
      },
      {
        title: "Module 7: Setting Up Professional Emails",
        topics: ["Creating professional email addresses using your domain", "Configuring email accounts in your hosting control panel", "Accessing emails via webmail or email clients like Outlook or Gmail", "Troubleshooting common email setup issues"],
      },
      {
        title: "Module 8: Finalizing and Launching Your Website",
        topics: ["Testing your website for functionality and responsiveness", "Optimizing your website for speed and SEO", "Backing up your website and setting up security measures", "Launching your website and making it live for the public"],
      },
      {
        title: "Capstone Project",
        topics: ["Build a complete website from scratch using the skills learned in the course", "Include a homepage, contact form, and downloadable PDFs", "Present your website to the class for feedback and improvement"],
      },
    ],
    outcomes: [
      "Create professional WordPress websites",
      "Customize themes and plugins",
      "Optimize sites for search engines",
      "Launch and maintain websites",
    ],
  },
  {
    id: 5,
    slug: "e-enterprise-e-governance",
    title: "E-Enterprise and E-Governance",
    track: "Systems & Startup",
    duration: "1 Week (5 days, 3 hours per day)",
    level: "Intermediate",
    overview:
      "Explores how digital technologies transform organizations and government service delivery, from current and emerging technology to case studies in Nigerian enterprise and e-governance adoption.",
    objectives: [
      "Understanding current technologies in use and in development for future use",
      "Exploring case studies of use of technology to boost enterprise and governance",
      "Introduction to use of key software applicable for Nigerian enterprise and government",
      "Discussion of successful methods to drive technology adoption for all stakeholders' benefit",
    ],
    targetAudience: ["Technology adoption enthusiasts in public and private sectors"],
    equipment: ["Intermediate knowledge of computer usage"],
    modules: [
      {
        title: "Module 1: Overview of E-Enterprise and E-Governance",
        topics: ["Definition and key concepts", "Digital business models suited for Africa", "Digital government services for Nigeria"],
      },
      {
        title: "Module 2: Key Components of E-Enterprise",
        topics: ["ICT infrastructure for secure e-commerce", "Digital business planning, ops structure, marketing", "Digital literacy and laws (data privacy / protection)"],
      },
      {
        title: "Module 3: Key Components of E-Governance",
        topics: ["ICT infrastructure for secure e-governance", "E-government services, sustainability and laws", "Intrapreneurship and public-private partnerships"],
      },
      {
        title: "Module 4: Practical Applications",
        topics: ["Discussion/workshop on feasible implementations", "Group project on concept development for e-Enterprise/Government", "Presentation of concepts and peer feedback"],
      },
      {
        title: "Module 5: Future Prospects and Policy Advocacy",
        topics: ["Emerging technologies and policy directions", "Incentives leading to implementation success stories"],
      },
    ],
    outcomes: [
      "Lead digital transformation",
      "Implement e-governance solutions",
      "Design digital services",
      "Manage organizational change",
    ],
  },
  {
    id: 6,
    slug: "ai-for-public-sector",
    title: "AI for Public Sector",
    track: "Data & AI",
    duration: "8 Weeks (5 days per week, 2 hours per day)",
    level: "Intermediate",
    overview:
      "Understand how artificial intelligence can transform public service delivery — from AI fundamentals and data through governance, ethics, and hands-on tools for policymakers and administrators.",
    objectives: [
      "Understand the evolution of technology leading to AI",
      "Explore AI applications in governance, policymaking, and public service",
      "Learn ethical and legal considerations for AI in the public sector",
      "Engage in hands-on activities to understand AI in real-world scenarios",
    ],
    targetAudience: ["Government officials, policymakers, IT staff, and public administrators"],
    equipment: [
      "Laptop or tablet",
      "Stable internet connection",
      "Basic knowledge of computer usage",
      "Free tools: DeepSeek, Google Colab, ChatGPT, TensorFlow Playground",
    ],
    modules: [
      {
        title: "Module 1: Evolution of Technology & Emerging Technologies",
        topics: ["History of technology: from the wheel to microchips", "Industrial revolutions and digital transformation", "The rise of AI and machine learning"],
      },
      {
        title: "Module 2: AI Fundamentals",
        topics: ["What is AI? Understanding machine learning and deep learning", "Real-world AI applications in daily life", "AI in government: enhancing efficiency and service delivery"],
      },
      {
        title: "Module 3: Data and AI",
        topics: ["Understanding datasets and data processing", "The role of big data in AI advancements", "Data privacy and security in AI applications"],
      },
      {
        title: "Module 4: AI in Public Sector",
        topics: ["Smart cities, automated services, and AI-driven decision-making", "Case studies of AI use in governance worldwide", "Ethical considerations: bias, transparency, and accountability"],
      },
      {
        title: "Module 5: AI Tools for Government Use",
        topics: ["Hands-on with AI-powered tools for administration", "Automating repetitive government tasks", "AI-driven citizen engagement platforms"],
      },
      {
        title: "Module 6: AI Policy & Governance",
        topics: ["AI regulations and frameworks", "Best practices for AI adoption in government", "International AI policy comparison"],
      },
      {
        title: "Module 7: Interactive AI Projects & Implementation",
        topics: ["Hands-on demonstration of AI tools", "Group discussions on AI policy frameworks", "Capstone project: proposing AI solutions for public administration"],
      },
      {
        title: "Module 8: Future Trends & Innovations in AI",
        topics: ["AI advancements in governance", "The future of AI in policymaking", "Ethical AI development and sustainability"],
      },
    ],
    outcomes: [
      "Understand AI fundamentals",
      "Identify AI opportunities in public sector",
      "Implement AI solutions responsibly",
      "Lead digital transformation projects",
    ],
  },
  {
    id: 7,
    slug: "digital-marketing-social-media",
    title: "Digital Marketing & Social Media Management",
    track: "Digital & Security",
    duration: "8 Weeks (5 days per week, 2 hours per day)",
    level: "Beginner to Intermediate",
    overview:
      "Build and execute effective digital marketing strategies — social media management, content creation, video marketing, paid advertising, analytics, and affiliate/email marketing.",
    objectives: [
      "Understand the fundamentals of digital marketing",
      "Develop strategies for brand awareness and audience engagement",
      "Learn social media analytics and campaign optimization",
      "Create effective content for various digital platforms",
    ],
    targetAudience: ["Business owners, marketers, content creators, government PR teams"],
    equipment: [
      "Laptop or smartphone",
      "Internet access",
      "Free tools: Canva, Buffer, Google Analytics, Facebook Creator Studio",
    ],
    modules: [
      {
        title: "Module 1: Introduction to Digital Marketing",
        topics: ["Digital vs. traditional marketing", "Understanding target audiences and customer behavior", "Overview of major digital platforms (Google, Facebook, X, Instagram, YouTube)"],
      },
      {
        title: "Module 2: Social Media Management",
        topics: ["Developing a social media strategy", "Best practices for Facebook, X, Instagram, and LinkedIn", "Scheduling, automation, and community engagement"],
      },
      {
        title: "Module 3: Content Creation & Branding",
        topics: ["Types of content: text, image, video, and infographics", "Storytelling and brand messaging", "SEO and content optimization techniques"],
      },
      {
        title: "Module 4: Video Marketing & Editing",
        topics: ["Importance of video content in digital marketing", "Basic video editing with free tools like Canva and InShot", "Live streaming and webinar best practices"],
      },
      {
        title: "Module 5: Analytics & Advertising",
        topics: ["Understanding social media metrics and KPIs", "Running paid ad campaigns: Facebook Ads, Google Ads, etc.", "Measuring ROI and refining marketing strategies"],
      },
      {
        title: "Module 6: Influencer Marketing & Growth Hacking",
        topics: ["How to leverage influencers for brand awareness", "Strategies for organic growth on social media", "Viral marketing case studies"],
      },
      {
        title: "Module 7: Email & Affiliate Marketing",
        topics: ["Email marketing strategies using free tools", "How affiliate marketing works", "Monetizing digital content effectively"],
      },
      {
        title: "Module 8: Course Recap & Future Digital Trends",
        topics: ["Key takeaways from the course", "Upcoming trends in digital marketing", "Career opportunities and certifications"],
      },
    ],
    outcomes: [
      "Develop digital marketing strategies",
      "Manage social media campaigns",
      "Create engaging content",
      "Measure campaign performance",
    ],
  },
  {
    id: 8,
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness & Best Practices",
    track: "Digital & Security",
    duration: "8 Weeks (5 days per week, 2 hours per day)",
    level: "Beginner to Intermediate",
    overview:
      "Protect digital assets from cyber threats — security fundamentals, social engineering and phishing defense, secure communication, incident response, and remote-work security.",
    objectives: [
      "Understand common cybersecurity threats and how to mitigate them",
      "Learn best practices for personal and organizational security",
      "Identify social engineering attacks like phishing and scams",
      "Explore cybersecurity policies and compliance in government and business",
    ],
    targetAudience: ["Government employees, business owners, IT personnel, and general users"],
    equipment: [
      "Laptop or smartphone",
      "Internet connection",
      "Free tools: Bitwarden, ProtonMail, VirusTotal, Google Authenticator",
    ],
    modules: [
      {
        title: "Module 1: Introduction to Cybersecurity",
        topics: ["What is cybersecurity and why does it matter?", "Overview of cyber threats: malware, phishing, and hacking", "Case studies on major cyber incidents"],
      },
      {
        title: "Module 2: Protecting Personal & Organizational Data",
        topics: ["Password management and two-factor authentication", "Secure browsing habits and recognizing threats", "Safe use of public Wi-Fi and device security"],
      },
      {
        title: "Module 3: Cybersecurity in Government & Business",
        topics: ["Importance of cybersecurity in public administration", "Data protection laws and regulatory compliance", "Creating a cybersecurity policy for an organization"],
      },
      {
        title: "Module 4: Social Engineering & Phishing Attacks",
        topics: ["Recognizing social engineering tactics", "Simulating phishing attacks", "Preventative measures for individuals and organizations"],
      },
      {
        title: "Module 5: Secure Communication & Encryption",
        topics: ["Basics of encryption and secure messaging", "Email security practices", "Safe file sharing techniques"],
      },
      {
        title: "Module 6: Incident Response & Recovery",
        topics: ["What to do in case of a cyberattack?", "Steps to recover from security breaches", "Cyber resilience planning"],
      },
      {
        title: "Module 7: Cybersecurity for Remote Work",
        topics: ["Best practices for securing home offices", "Cloud security and VPN usage", "Managing access control for remote teams"],
      },
      {
        title: "Module 8: Future of Cybersecurity & Emerging Threats",
        topics: ["AI and cybersecurity", "Predicting future cyber threats", "Ethical hacking and penetration testing basics"],
      },
    ],
    outcomes: [
      "Identify cyber threats",
      "Implement security best practices",
      "Manage security risks",
      "Respond to security incidents",
    ],
  },
  {
    id: 9,
    slug: "ict-startup-strategy",
    title: "ICT Startup Strategy Training Course",
    track: "Systems & Startup",
    duration: "7 Weeks (2 hours per week)",
    level: "Intermediate to Advanced",
    overview:
      "This course plays a critical role in helping participants learn about the Lean Startup framework that will allow them to successfully test, advance, and improve their business idea. Participants will get hands-on experience talking to customers, partners and competitors; learn how to use a business model to brainstorm each part of a company; and use customer development to learn if and how others would want to use their product. Depending on the business idea, and based on customer and market feedback, participants will use agile development to rapidly iterate their product or concept.",
    prerequisites: ["Ready to solve real world problems with technology"],
    modules: [
      { title: "Module 1: Introduction", topics: ["What is ICT Startup Strategy?", "Importance of ICT Startup Strategy"] },
      { title: "Module 2: Understanding Team & Team Building", topics: ["Stages of Team Formation", "Team Work", "Belbin Test"] },
      { title: "Module 3: Worldview and Business", topics: ["What is your Worldview", "Business (Startup)", "What is a good Business"] },
      { title: "Module 4: Entrepreneur Mindset", topics: ["Why an Entrepreneur does things"] },
      { title: "Module 5: Entrepreneurship", topics: ["Characteristics of Entrepreneurship"] },
      { title: "Module 6: Business Model Canvas & Value Proposition Canvas", topics: ["What is a Business Model", "Business Model vs Business Plan", "Customer Profiling"] },
      { title: "Module 7: Business Plan", topics: ["Assessment and Certification", "Weekly Assignments and Quizzes", "Final Capstone Project"] },
    ],
    targetAudience: ["Aspiring Startup Owners"],
    outcomes: [
      "Have an experiential learning opportunity to help determine the commercial readiness (product-market fit) of their product/service",
      "Enable the team to address only the most critical learning questions and devise tests allowing the team to make a clear go/no-go decision regarding commercial viability of the effort",
      "Develop a transition plan to move the product/service forward to market",
    ],
  },
  {
    id: 10,
    slug: "introduction-to-networking",
    title: "Introduction to Networking",
    track: "Digital & Security",
    duration: "8 days (2 hours a day)",
    level: "Beginner to Intermediate",
    overview:
      "This course provides a comprehensive introduction to computer networking, covering fundamental concepts, protocols, and technologies. Students will gain a solid understanding of networking principles, protocols, and architectures.",
    prerequisites: ["Basic computer knowledge", "Familiarity with operating systems (Windows, Linux)"],
    targetAudience: [
      "Students interested in computer networking",
      "IT professionals seeking to enhance their networking skills",
      "Individuals looking to pursue a career in networking",
    ],
    modules: [
      { title: "Module 1: Introduction to Networking", topics: ["Overview of networking", "Network types (LAN, WAN, MAN)", "Network topologies (bus, star, ring)", "Network devices (hubs, switches, routers)"] },
      { title: "Module 2: Network Fundamentals", topics: ["OSI model", "TCP/IP model", "Network protocols (HTTP, FTP, SSH)", "IP addressing (IPv4, IPv6)"] },
      { title: "Module 3: Network Devices and Cabling", topics: ["Network interface cards (NICs)", "Hubs, switches, and routers", "Cabling (twisted pair, coaxial, fiber optic)"] },
      { title: "Module 4: Network Protocols and Services", topics: ["DNS (Domain Name System)", "DHCP (Dynamic Host Configuration Protocol)", "NAT (Network Address Translation)", "Firewalls and network security"] },
      { title: "Module 5: Local Area Networks (LANs)", topics: ["LAN architectures (Ethernet, Token Ring)", "LAN devices (switches, routers)"] },
      { title: "Module 6: Network Security and Management", topics: ["Network security threats (malware, phishing)", "Network security measures (firewalls, VPNs)", "Network management protocols (SNMP, RMON)"] },
      { title: "Module 7: Emerging Trends in Networking", topics: ["Cloud computing and networking", "Software-defined networking (SDN)", "Network function virtualization (NFV)"] },
      { title: "Module 8: Hands-On Networking Labs", topics: ["Configuring network devices (routers, switches)", "Implementing network protocols (DNS, DHCP)", "Troubleshooting network issues"] },
    ],
    outcomes: [
      "Basic understanding of network infrastructures, network protocols & network security measures",
      "Configuration and troubleshooting of network devices and connectivity issues",
      "Develop skills in: problem solving, basic network design & implementation, network security & troubleshooting",
    ],
  },
  {
    id: 11,
    slug: "excel-fundamentals-data-analysis",
    title: "Excel Fundamentals and Data Analysis",
    track: "Web & Office Skills",
    duration: "8 Weeks (2 days per week, 1 hour 40 minutes per day)",
    level: "Beginner to Intermediate",
    overview:
      "This course is designed to equip participants with the skills and knowledge needed to harness the potential of Excel. The course covers fundamental concepts, data analysis, and visualization techniques.",
    objectives: [
      "Create and manage worksheets, charts, and tables",
      "Perform data analysis and visualization techniques",
      "Use formulas, functions, and pivot tables to manipulate data",
      "Create dynamic charts and reports",
    ],
    prerequisites: [
      "Basic knowledge of Excel, including creating and editing worksheets, using basic formulas and functions, and formatting cells",
    ],
    equipment: [
      "Microsoft Excel 2016 or later",
      "Windows 10 or later",
      "4 GB RAM or more",
      "2 GHz dual-core processor or faster",
    ],
    modules: [
      {
        title: "Module 1: Excel Fundamentals",
        topics: [
          "1.1 Introduction to Excel – overview of Excel's interface and basic features, navigating the ribbon, tabs, and menus",
          "1.2 Creating and Managing Worksheets – new worksheets and workbooks, layout and design, headers, footers, and page breaks",
          "1.3 Basic Formulas and Functions – arithmetic operators, built-in functions, relative and absolute references",
          "1.4 Formatting and Conditional Formatting – basic formatting, conditional formatting for trends and patterns, custom number formats",
          "1.5 Working with Charts and Graphs – creating and customizing charts, chart types, editing chart elements",
        ],
      },
      {
        title: "Module 2: Data Analysis and Visualization",
        topics: [
          "2.1 Data Manipulation and Cleaning – Excel's data manipulation tools, cleaning and preparing data, handling missing or duplicate data",
          "2.2 Pivot Tables and Charts – creating and customizing pivot tables, pivot charts, managing pivot table fields",
          "2.3 Advanced Formulas and Functions – advanced formulas, named ranges and references",
          "2.4 Data Visualization Best Practices – principles of effective data visualization, Excel's visualization tools, interactive and dynamic dashboards",
        ],
      },
    ],
    outcomes: [
      "Build complex spreadsheets",
      "Analyze data with pivot tables",
      "Create dynamic charts",
      "Automate repetitive tasks",
    ],
  },
  {
    id: 12,
    slug: "microsoft-word-training",
    title: "Microsoft Word Training",
    track: "Web & Office Skills",
    duration: "8 Weeks (5 days/week, 2 hours/day) — 80 hours total",
    level: "Beginner to Intermediate",
    overview:
      "Equips participants with the skills to create, format, edit, and manage professional documents using Microsoft Word — from core editing through collaboration, automation, and long-document features.",
    modules: [
      {
        title: "Week 1: Introduction to Microsoft Word",
        topics: [
          "Overview of the Word interface – Ribbon, Quick Access Toolbar, Status Bar; creating, saving, and opening documents",
          "Basic text editing – typing, selecting, copying, cutting, and pasting text; undo and redo",
          "Formatting text – font styles, sizes, colors, and effects; paragraph alignment, indentation, and spacing",
          "Bullets, numbering, and lists – creating and customizing lists",
          "Practice session – hands-on exercises",
        ],
      },
      {
        title: "Week 2: Advanced Formatting and Styles",
        topics: [
          "Page layout and margins – margins, orientation, and paper size",
          "Styles and themes – applying/modifying styles, consistent design",
          "Headers, footers, and page numbers",
          "Sections and breaks – page breaks, section breaks, and columns",
          "Practice session – creating a multi-section document",
        ],
      },
      {
        title: "Week 3: Working with Tables and Graphics",
        topics: [
          "Creating and formatting tables – inserting, merging cells, adjusting layouts",
          "Advanced table features – sorting data, formulas in tables, table styles",
          "Inserting graphics and images – pictures, shapes, icons, and SmartArt",
          "Formatting graphics – wrapping text, positioning, resizing images",
          "Practice session – document with tables and graphics",
        ],
      },
      {
        title: "Week 4: Document Collaboration and Review",
        topics: [
          "Track changes and comments",
          "Reviewing and accepting changes – comparing documents",
          "Sharing and protecting documents – password protection, restricting editing",
          "Using OneDrive for collaboration",
          "Practice session – collaborative editing exercise",
        ],
      },
      {
        title: "Week 5: Advanced Features and Automation",
        topics: [
          "Mail merge – letters, labels, and envelopes",
          "Templates and forms – using/creating templates, fillable forms",
          "Macros – recording and running macros",
          "Advanced find and replace – wildcards and formatting options",
          "Practice session – automating tasks with macros",
        ],
      },
      {
        title: "Week 6: Long Document Features",
        topics: [
          "Table of contents and indexing",
          "Footnotes, endnotes, and citations",
          "Captions and cross-references",
          "Master documents and subdocuments",
          "Practice session – long document with references",
        ],
      },
      {
        title: "Week 7: Customization and Productivity Tips",
        topics: [
          "Customizing the Ribbon and Quick Access Toolbar",
          "Keyboard shortcuts and time-saving tips",
          "Advanced printing options – print preview, settings, PDF export",
          "Troubleshooting common issues – recovering unsaved documents, fixing formatting errors",
          "Practice session – customizing Word for personal productivity",
        ],
      },
      {
        title: "Week 8: Final Project and Assessment",
        topics: [
          "Final project – create a professional document (report, brochure, or thesis)",
          "Peer review and feedback",
          "Assessment and certification – practical test and certificate of completion",
        ],
      },
    ],
    outcomes: [
      "Be proficient in creating and formatting professional documents",
      "Master advanced features like mail merge, macros, and long document tools",
      "Be able to collaborate effectively using Word's sharing and reviewing tools",
      "Gain confidence in using Microsoft Word for personal and professional tasks",
    ],
  },
  {
    id: 13,
    slug: "python-programming",
    title: "Python Programming",
    track: "Systems & Startup",
    duration: "8 Weeks (2 days per week, 1 hour 40 minutes per day)",
    level: "Beginner to Intermediate",
    overview:
      "This course is designed to equip participants with the fundamental skills and knowledge required to become proficient in Python programming. The course covers the basics of Python, data structures, file operations, and advanced topics such as object-oriented programming and data analysis.",
    objectives: [
      "Understand the basics of Python programming",
      "Learn data structures, file operations, and exception handling",
      "Understand object-oriented programming concepts",
      "Learn data analysis and visualization using popular libraries",
      "Apply Python skills to real-world problems and projects",
    ],
    prerequisites: [
      "Basic computer skills and knowledge of Microsoft Office",
      "No prior programming experience required",
      "Familiarity with mathematical concepts such as algebra and statistics",
    ],
    modules: [
      { title: "Module 1: Python Fundamentals", topics: ["Introduction to Python – what it is, why use it, its advantages", "Uses of Python – general application programming, meta programming and code generation", "Python's libraries and applications"] },
      { title: "Module 2: Python Building Blocks", topics: ["Values and variables – integers, assignment, identifiers", "Floating-point types", "Control codes within strings – user input, the eval function, print formatting"] },
      { title: "Module 3: Expressions and Arithmetic", topics: ["Expressions, operator precedence and associativity", "Comments", "Errors – syntax, runtime, and logic errors", "Arithmetic examples and algorithms"] },
      { title: "Module 4: Conditional Execution", topics: ["Boolean expressions", "The IF and IF/Else statements", "Compound and nested conditionals", "Multi-way decisions and conditional expressions"] },
      { title: "Module 5: Iteration", topics: ["The while statement", "Definite vs. indefinite loops", "The for statement and nested loops", "Break, continue, and infinite loops", "Iteration examples (square root, prime numbers)"] },
      { title: "Module 6: Using Functions", topics: ["Standard mathematical functions", "Time functions", "Random numbers", "Importing modules"] },
      { title: "Module 7: Writing Functions", topics: ["Function basics and parameter passing", "The main function", "Function examples (prime generator, command interpreter, die roller)", "Custom vs. standard functions"] },
      { title: "Module 8: More on Functions", topics: ["Global variables and default parameters", "Recursion", "Making functions reusable", "Documenting functions and modules"] },
      { title: "Module 9: Lists", topics: ["Using lists, assignment and equivalence", "List bounds and slicing", "Lists and functions"] },
      { title: "Module 10: List Processing", topics: ["Sorting and flexible sorting", "Linear and binary search", "List permutations and reversing a list"] },
      { title: "Module 11: Objects", topics: ["Using objects", "String objects", "List objects"] },
      { title: "Module 12: Custom Types", topics: ["Geometric points", "Methods", "Class inheritance"] },
      { title: "Module 13: Handling Exceptions", topics: ["Motivation", "Exception examples", "Using exceptions"] },
    ],
    outcomes: [
      "Write Python programs confidently",
      "Build automation scripts",
      "Work with data and APIs",
      "Develop real-world applications",
    ],
  },
];

export const coursesData: Course[] = courseList.map((course) => ({
  ...course,
  levels: deriveLevels(course.level),
  locations: JABI_ONLY_COURSE_SLUGS.includes(course.slug) ? (["jabi"] as LocationId[]) : allLocationIds,
  priceNgn: COURSE_PRICES_NGN[course.slug] ?? 0,
}));

export const getCourseBySlug = (slug: string) =>
  coursesData.find((course) => course.slug === slug);
