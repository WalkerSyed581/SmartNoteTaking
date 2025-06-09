import { CreateNoteData } from '../types/Note';

export const sampleNotes: CreateNoteData[] = [
  {
    title: "React Hooks Fundamentals",
    content: "React Hooks allow you to use state and other React features without writing a class. useState lets you add state to functional components, while useEffect handles side effects like API calls and subscriptions. Custom hooks let you extract component logic into reusable functions.",
    tags: ["react", "javascript", "frontend", "hooks", "programming"]
  },
  {
    title: "JavaScript Array Methods",
    content: "Modern JavaScript provides powerful array methods: map() transforms elements, filter() selects elements based on criteria, reduce() accumulates values, forEach() iterates through elements. These methods enable functional programming patterns and make code more readable.",
    tags: ["javascript", "programming", "arrays", "functional-programming", "methods"]
  },
  {
    title: "CSS Grid Layout System",
    content: "CSS Grid is a two-dimensional layout system that makes it easy to create complex web layouts. Use grid-template-columns and grid-template-rows to define grid structure. Grid areas and grid lines provide precise control over element placement.",
    tags: ["css", "frontend", "layout", "web-development", "design"]
  },
  {
    title: "Database Normalization",
    content: "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. First Normal Form (1NF) eliminates duplicate rows, Second Normal Form (2NF) removes partial dependencies, Third Normal Form (3NF) eliminates transitive dependencies.",
    tags: ["database", "sql", "normalization", "data-modeling", "backend"]
  },
  {
    title: "Machine Learning Basics",
    content: "Machine learning is a subset of AI that enables computers to learn without explicit programming. Supervised learning uses labeled data, unsupervised learning finds patterns in unlabeled data, and reinforcement learning learns through interaction with an environment.",
    tags: ["machine-learning", "ai", "python", "data-science", "algorithms"]
  },
  {
    title: "Node.js Event Loop",
    content: "Node.js uses an event-driven, non-blocking I/O model. The event loop continuously checks for events and executes callbacks. This architecture makes Node.js efficient for I/O-intensive applications like web servers and real-time applications.",
    tags: ["nodejs", "javascript", "backend", "event-loop", "programming"]
  },
  {
    title: "RESTful API Design",
    content: "REST (Representational State Transfer) is an architectural style for designing web services. Use HTTP methods (GET, POST, PUT, DELETE) appropriately, maintain stateless communication, and design intuitive URL structures. Proper status codes and error handling are essential.",
    tags: ["api", "rest", "backend", "web-development", "http"]
  },
  {
    title: "Python Data Structures",
    content: "Python provides built-in data structures: lists for ordered collections, dictionaries for key-value pairs, sets for unique elements, and tuples for immutable sequences. Understanding when to use each structure is crucial for efficient programming.",
    tags: ["python", "data-structures", "programming", "algorithms", "computer-science"]
  },
  {
    title: "Git Version Control",
    content: "Git is a distributed version control system. Basic commands include git add (stage changes), git commit (save changes), git push (upload to remote), git pull (download from remote). Branching and merging enable collaborative development workflows.",
    tags: ["git", "version-control", "development", "collaboration", "tools"]
  },
  {
    title: "Responsive Web Design",
    content: "Responsive design ensures websites work on all devices. Use flexible grid systems, fluid images, and CSS media queries to adapt layouts. Mobile-first approach starts with mobile design and progressively enhances for larger screens.",
    tags: ["css", "responsive-design", "frontend", "web-development", "mobile", "design"]
  },
  {
    title: "SQL Joins and Relationships",
    content: "SQL joins combine data from multiple tables. INNER JOIN returns matching records, LEFT JOIN includes all left table records, RIGHT JOIN includes all right table records, FULL OUTER JOIN includes all records from both tables.",
    tags: ["sql", "database", "joins", "backend", "data-modeling"]
  },
  {
    title: "Functional Programming Concepts",
    content: "Functional programming emphasizes pure functions, immutability, and higher-order functions. Benefits include easier testing, better code predictability, and reduced side effects. Languages like JavaScript, Python, and Haskell support functional programming paradigms.",
    tags: ["functional-programming", "programming", "javascript", "python", "paradigms"]
  },
  {
    title: "Docker Containerization",
    content: "Docker packages applications and dependencies into containers. Containers are lightweight, portable, and consistent across environments. Dockerfile defines container instructions, Docker Compose manages multi-container applications.",
    tags: ["docker", "containers", "devops", "deployment", "infrastructure"]
  },
  {
    title: "TypeScript Type System",
    content: "TypeScript adds static typing to JavaScript. Benefits include better IDE support, early error detection, and improved code documentation. Use interfaces for object shapes, generics for reusable components, and union types for flexible parameters.",
    tags: ["typescript", "javascript", "types", "programming", "frontend"]
  },
  {
    title: "Agile Development Methodology",
    content: "Agile emphasizes iterative development, customer collaboration, and responding to change. Scrum framework includes sprints, daily standups, sprint planning, and retrospectives. Kanban visualizes workflow and limits work in progress.",
    tags: ["agile", "scrum", "methodology", "project-management", "development"]
  },
  {
    title: "Redux State Management",
    content: "Redux manages application state in a predictable way. Actions describe what happened, reducers specify how state changes, and the store holds the application state. Redux DevTools enable time-travel debugging.",
    tags: ["redux", "react", "state-management", "javascript", "frontend"]
  },
  {
    title: "Computer Networks Fundamentals",
    content: "Computer networks connect devices for communication. OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP ensures reliable delivery, UDP provides fast but unreliable transmission.",
    tags: ["networking", "protocols", "computer-science", "tcp", "udp"]
  },
  {
    title: "Data Science with Python",
    content: "Python is popular for data science due to libraries like pandas (data manipulation), numpy (numerical computing), matplotlib (visualization), and scikit-learn (machine learning). Jupyter notebooks provide interactive development environment.",
    tags: ["python", "data-science", "pandas", "numpy", "machine-learning", "visualization"]
  },
  {
    title: "Security Best Practices",
    content: "Web security involves multiple layers: HTTPS for encryption, input validation to prevent injection attacks, authentication and authorization for access control, and regular security updates. OWASP Top 10 lists common vulnerabilities.",
    tags: ["security", "web-security", "https", "authentication", "best-practices"]
  },
  {
    title: "Algorithm Complexity Analysis",
    content: "Big O notation describes algorithm efficiency. O(1) is constant time, O(n) is linear time, O(n²) is quadratic time, O(log n) is logarithmic time. Understanding complexity helps choose appropriate algorithms for different scenarios.",
    tags: ["algorithms", "big-o", "complexity", "computer-science", "performance"]
  }
];

export const generateSampleData = (): CreateNoteData[] => {
  return sampleNotes;
};

export const getTagSuggestions = (existingTags: string[]): string[] => {
  const allTags = new Set<string>();
  sampleNotes.forEach(note => {
    note.tags?.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).filter(tag => !existingTags.includes(tag)).sort();
}; 